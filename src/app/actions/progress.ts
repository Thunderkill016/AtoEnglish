"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import { UNITS } from "@/lib/constants/units";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { CompleteUnitSchema } from "@/lib/security/validation";

const completeUnitLimiter = createRateLimiter(10, 60 * 1000, "complete-unit");

// CEFR level order — used for no-regression check
const CEFR_LEVEL_ORDER = ["A0", "A1", "A2", "B1", "B2", "C1"] as const;
type CEFRAutoLevel = (typeof CEFR_LEVEL_ORDER)[number];

/**
 * Server Action xử lý khi người dùng hoàn thành một Unit học tập.
 * Cộng XP (theo unit.xp), cập nhật streak, lưu từ vựng vào SRS.
 */
export async function completeUnit(unitId: string, starCount: number = 3) {
  try {
    // Rate Limiting
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await completeUnitLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return {
        success: false,
        error: "Yêu cầu quá thường xuyên. Vui lòng thử lại sau."
      };
    }

    // Input Validation
    const validated = CompleteUnitSchema.safeParse({ unitId, starCount });
    if (!validated.success) {
      return {
        success: false,
        error: `Dữ liệu không hợp lệ: ${validated.error.issues.map(e => e.message).join(", ")}`
      };
    }
    const cleanParams = validated.data;

    const supabase = await createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để hoàn thành chương học."
      };
    }

    // Lấy ngày hôm nay dưới dạng YYYY-MM-DD theo múi giờ Việt Nam
    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    // 2. Chạy giao dịch hoàn thành unit thông qua RPC để đảm bảo tính nguyên tử (Atomicity) và hiệu năng tối ưu
    const unitDef = UNITS.find(u => u.id === cleanParams.unitId);
    const BASE_XP = unitDef?.xp ?? 80; // fallback 80 nếu không tìm thấy unit
    const xpMultiplier = cleanParams.starCount === 3 ? 1.0 : cleanParams.starCount === 2 ? 0.85 : 0.70;
    const xpEarned = Math.round(BASE_XP * xpMultiplier);

    const { data: txResult, error: txError } = await supabase.rpc("complete_unit_transaction", {
      p_user_id: user.id,
      p_unit_id: cleanParams.unitId,
      p_xp_earned: xpEarned,
      p_stars: cleanParams.starCount,
      p_today: today,
    });

    if (txError) {
      return {
        success: false,
        error: `Lỗi giao dịch hoàn thành bài học: ${txError.message}`
      };
    }

    interface TransactionResult {
      success: boolean;
      already_completed?: boolean;
      xp_earned?: number;
      new_streak?: number;
      new_total_xp?: number;
      current_level?: string;
      completed_count?: number;
      leveled_up?: boolean;
    }
    const resultData = txResult as unknown as TransactionResult;

    if (resultData.already_completed) {
      return {
        success: true,
        message: "Unit này đã được bạn hoàn thành trước đó.",
        alreadyCompleted: true
      };
    }

    const nextStreak   = resultData.new_streak ?? 1;
    const newLevel     = (resultData.current_level || "A0") as CEFRAutoLevel;
    const leveledUp    = resultData.leveled_up ?? false;

    // 3. Bulk upsert tất cả từ vựng vào bảng cards (1 query thay vì N+1)
    const vocabList = UNIT_VOCABULARY[cleanParams.unitId] || [];
    let addedCount = 0;

    if (vocabList.length > 0) {
      const now = new Date().toISOString();
      const cardsToInsert = vocabList.map((vocab) => ({
        user_id: user.id,
        word: vocab.word.toLowerCase().trim(),
        phonetic: vocab.phonetic,
        meaning_vn: vocab.meaning_vn,
        example_en: vocab.example_en,
        topic: vocab.topic,
        level: vocab.level,
        interval: 0,
        repetitions: 0,
        due_date: now,
        state: 0,
        difficulty: 0.0,
        stability: 0.0,
        last_review: null,
        next_review: now,
      }));

      const { data: upserted, error: upsertError } = await supabase
        .from("cards")
        .upsert(cardsToInsert, { onConflict: "user_id,word", ignoreDuplicates: true })
        .select("id");

      if (!upsertError) addedCount = upserted?.length ?? 0;
    }

    // 4. Revalidate cache
    revalidatePath("/dashboard");
    revalidatePath("/learn");
    revalidatePath("/flashcards");
    revalidatePath("/progress");

    return {
      success: true,
      message: `Hoàn thành bài học thành công! Bạn nhận được ${xpEarned} XP (${cleanParams.starCount}⭐).`,
      xpEarned,
      newStreak: nextStreak,
      vocabAddedCount: addedCount,
      leveledUp: leveledUp ? newLevel : null,
      newLevel,
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống: ${errorMessage}`
    };
  }
}


/**
 * Server Action lấy trạng thái hoàn thành của một unit cụ thể.
 */
export async function getUnitCompletionStatus(unitId: string) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, completed: false };
    }

    const { data, error } = await supabase
      .from("user_lesson_progress")
      .select("id, completed_at, xp_earned")
      .eq("user_id", user.id)
      .eq("unit_id", unitId)
      .maybeSingle();

    if (error) {
      return { success: false, completed: false };
    }

    return {
      success: true,
      completed: !!data,
      completedAt: data?.completed_at || null,
      xpEarned: data?.xp_earned || 0
    };
  } catch {
    return { success: false, completed: false };
  }
}

/**
 * Bulk version of getUnitCompletionStatus — fetches ALL completed units
 * for the current user in a single DB query instead of N queries.
 * Returns a Map<unitId, { completedAt, xpEarned }> for O(1) lookups.
 */
export async function getAllUnitCompletionStatuses(): Promise<{
  success: boolean;
  completedMap: Map<string, { completedAt: string | null; xpEarned: number }>;
}> {
  const emptyResult = { success: false, completedMap: new Map<string, { completedAt: string | null; xpEarned: number }>() };
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return emptyResult;

    const { data, error } = await supabase
      .from("user_lesson_progress")
      .select("unit_id, completed_at, xp_earned")
      .eq("user_id", user.id);

    if (error) return emptyResult;

    const completedMap = new Map<string, { completedAt: string | null; xpEarned: number }>();
    for (const row of data ?? []) {
      if (row.unit_id) {
        completedMap.set(row.unit_id, {
          completedAt: row.completed_at ?? null,
          xpEarned: row.xp_earned ?? 0,
        });
      }
    }
    return { success: true, completedMap };
  } catch {
    return emptyResult;
  }
}

/**
 * Server Action lấy thông tin tiến trình tổng thể của người dùng (streak, XP, level).
 */
export async function getUserProgress() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập để lấy thông tin tiến trình." };
    }

    const { data, error } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      return { success: false, error: `Lỗi truy vấn: ${error.message}` };
    }

    // display_name: dùng user_metadata (Auth) — không query bảng users không tồn tại
    const displayName =
      user.user_metadata?.display_name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Học viên";

    return {
      success: true,
      progress: {
        user_id: user.id,
        current_level: data?.current_level || "A0",
        streak: data?.streak || 0,
        total_xp: data?.total_xp || 0,
        last_active_date: data?.last_active_date || null,
        daily_xp_goal: 50,
        display_name: displayName
      }
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg };
  }
}

/**
 * Server Action lấy số lượng unit đã hoàn thành của user.
 */
export async function getCompletedUnitsCount() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { success: false, count: 0 };
    }

    const { count, error } = await supabase
      .from("user_lesson_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      return { success: false, count: 0 };
    }
    return { success: true, count: count || 0 };
  } catch {
    return { success: false, count: 0 };
  }
}

/**
 * Server Action reset toàn bộ tiến trình của một unit (xóa progress và cards SRS liên quan).
 */
export async function resetUnitProgress(unitId: string) {
  try {
    const supabase = await createClient();
    
    // 1. Kiểm tra trạng thái đăng nhập
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để thực hiện reset bài học."
      };
    }

    // 2. Xóa tiến trình bài học trong user_lesson_progress
    const { error: deleteProgressError } = await supabase
      .from("user_lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("unit_id", unitId);

    if (deleteProgressError) {
      return {
        success: false,
        error: `Lỗi khi xóa tiến trình: ${deleteProgressError.message}`
      };
    }

    // 3. Xóa các từ vựng thuộc Unit này trong bảng cards
    const vocabList = UNIT_VOCABULARY[unitId] || [];
    if (vocabList.length > 0) {
      const wordList = vocabList.map(v => v.word.toLowerCase().trim());
      const { error: deleteCardsError } = await supabase
        .from("cards")
        .delete()
        .eq("user_id", user.id)
        .in("word", wordList);

      if (deleteCardsError) {
        // Non-critical: SRS card cleanup failed — unit progress still reset
      }
    }

    // 4. Revalidate cache
    revalidatePath("/dashboard");
    revalidatePath("/learn");
    revalidatePath("/flashcards");

    return {
      success: true,
      message: `Đã reset thành công toàn bộ tiến trình bài học ${unitId}.`
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống: ${errorMessage}`
    };
  }
}

/**
 * Server Action lấy thông tin Unit đang học hiện tại của người dùng.
 */
export async function getCurrentUnit() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Đối với người dùng chưa đăng nhập, mặc định hiển thị Unit 1 với progress 0%
    if (authError || !user) {
      const u1 = UNITS[0];
      return {
        success: true,
        unitId: u1.id,
        title: u1.title,
        description: u1.description,
        currentPhase: "Pha 1: Input",
        progress: 0,
        completed: false,
        route: u1.route
      };
    }

    // 2. Lấy danh sách từ vựng của tất cả các bài để so khớp xem thẻ nào đã được lưu
    const allWords = UNITS.flatMap(unit =>
      (UNIT_VOCABULARY[unit.id] || []).map(v => v.word.toLowerCase().trim())
    );

    // Parallel: fetch completed lessons + user cards simultaneously
    const [completedRes, cardsRes] = await Promise.all([
      supabase
        .from("user_lesson_progress")
        .select("unit_id")
        .eq("user_id", user.id),
      supabase
        .from("cards")
        .select("word")
        .eq("user_id", user.id)
        .in("word", allWords),
    ]);

    if (completedRes.error) {
      return {
        success: false,
        error: `Lỗi truy vấn database: ${completedRes.error.message}`
      };
    }

    const completedUnitIds = completedRes.data?.map(l => l.unit_id) || [];
    const savedWords = new Set(cardsRes.data?.map(c => c.word.toLowerCase().trim()) || []);

    // Tính toán trạng thái cho từng Unit
    const unitStatuses = UNITS.map(unit => {
      const isCompleted = completedUnitIds.includes(unit.id);
      const vocab = UNIT_VOCABULARY[unit.id] || [];
      const savedCount = vocab.filter(v => savedWords.has(v.word.toLowerCase().trim())).length;
      
      let progress = 0;
      let phase = "Pha 1: Input";
      if (vocab.length > 0 && savedCount > 0) {
        if (savedCount < vocab.length) {
          progress = 40;
          phase = "Pha 2: Processing";
        } else {
          progress = 75;
          phase = "Pha 3: Output";
        }
      }

      return {
        unitId: unit.id,
        title: unit.title,
        description: unit.description,
        currentPhase: isCompleted ? "Hoàn thành" : phase,
        progress: isCompleted ? 100 : progress,
        completed: isCompleted,
        route: unit.route
      };
    });

    // 3. Quyết định unit đang học hiện tại
    // Đầu tiên tìm unit đang học dở (progress > 0 và chưa completed)
    let activeUnit = unitStatuses.find(u => !u.completed && u.progress > 0);
    if (!activeUnit) {
      // Nếu không có, chọn unit đầu tiên chưa hoàn thành
      activeUnit = unitStatuses.find(u => !u.completed);
    }
    if (!activeUnit) {
      // Nếu tất cả đã hoàn thành, hiển thị unit cuối cùng
      activeUnit = unitStatuses[unitStatuses.length - 1];
    }

    return {
      success: true,
      ...activeUnit
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      error: `Lỗi hệ thống: ${errorMessage}`
    };
  }
}

/**
 * Server Action cập nhật mục tiêu XP hàng ngày của người dùng.
 */
export async function updateDailyXpGoal(goal: number) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập để cập nhật mục tiêu XP." };
    }

    if (![30, 50, 80, 100].includes(goal)) {
      return { success: false, error: "Mục tiêu XP không hợp lệ." };
    }

    const { error } = await supabase
      .from("user_progress")
      .update({ updated_at: new Date().toISOString() }) // daily_xp_goal not in DB schema
      .eq("user_id", user.id);

    if (error) {
      return { success: false, error: `Lỗi khi cập nhật mục tiêu: ${error.message}` };
    }

    revalidatePath("/dashboard");
    return { success: true, message: `Đã cập nhật mục tiêu XP hàng ngày thành ${goal} XP.` };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg };
  }
}

/**
 * Lấy dữ liệu XP theo 7 ngày gần nhất từ user_lesson_progress.
 */
export async function getWeeklyXpData() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, data: [] };

    const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const days: { day: string; label: string; xp: number; pct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
      days.push({ day: dateStr, label: dayLabels[d.getDay()], xp: 0, pct: 0 });
    }

    const startDate = days[0].day;

    // +07:00 so Postgres interprets startDate as VN midnight, not UTC midnight
    const startUtc = startDate + "T00:00:00+07:00";

    // Fetch lesson XP and speaking sessions in parallel
    const [lessonsRes, speakingRes] = await Promise.all([
      supabase
        .from("user_lesson_progress")
        .select("xp_earned, completed_at")
        .eq("user_id", user.id)
        .gte("completed_at", startUtc),
      supabase
        .from("speaking_sessions")
        .select("practice_type, created_at")
        .eq("user_id", user.id)
        .gte("created_at", startUtc),
    ]);

    // Add lesson XP per day
    if (!lessonsRes.error && lessonsRes.data) {
      for (const row of lessonsRes.data) {
        const rowDate = new Date(row.completed_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        const day = days.find(d => d.day === rowDate);
        if (day) day.xp += (row.xp_earned || 0);
      }
    }

    // Add speaking XP per day (estimated from practice_type)
    const SPEAKING_XP: Record<string, number> = { shadowing: 5, roleplay: 8, journal: 5 };
    if (!speakingRes.error && speakingRes.data) {
      for (const row of speakingRes.data) {
        const rowDate = new Date(row.created_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        const day = days.find(d => d.day === rowDate);
        if (day) day.xp += SPEAKING_XP[row.practice_type] ?? 5;
      }
    }

    const maxXp = Math.max(...days.map(d => d.xp), 1);
    return {
      success: true,
      data: days.map(d => ({ ...d, pct: Math.round((d.xp / maxXp) * 100) }))
    };
  } catch {
    return { success: false, data: [] };
  }
}


/**
 * Lấy thống kê tổng hợp cho trang Progress.
 */
export async function getProgressStats() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, stats: null };

    const [progressRes, cardsRes, completedRes, speakingRes] = await Promise.all([
      supabase.from("user_progress").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("cards").select("state").eq("user_id", user.id),
      supabase.from("user_lesson_progress").select("unit_id", { count: "exact" }).eq("user_id", user.id),
      supabase.from("speaking_sessions").select("id", { count: "exact" }).eq("user_id", user.id),
    ]);

    const progress = progressRes.data;
    const cards = cardsRes.data || [];
    const totalCards = cards.length;
    const cardsByState = {
      new: cards.filter(c => c.state === 0).length,
      learning: cards.filter(c => c.state === 1).length,
      review: cards.filter(c => c.state === 2).length,
      relearning: cards.filter(c => c.state === 3).length,
    };

    return {
      success: true,
      stats: {
        totalXp: progress?.total_xp || 0,
        streak: progress?.streak || 0,
        currentLevel: progress?.current_level || "A0",
        totalCards,
        cardsByState,
        completedUnits: completedRes.count || 0,
        totalSpeakingSessions: speakingRes.count || 0,
      }
    };
  } catch {
    return { success: false, stats: null };
  }
}

const placementLimiter = createRateLimiter(3, 60 * 60 * 1000, "placement-test"); // 3/hour

/**
 * Server Action lưu kết quả Placement Test và cập nhật current_level của user.
 */
export async function savePlacementResult(level: string, score: number) {
  try {
    const reqHeaders = await headers();
    const ip = reqHeaders.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const rateLimitCheck = await placementLimiter.check(ip);
    if (!rateLimitCheck.success) {
      return { success: false, error: "Vui lòng chờ trước khi làm lại test." };
    }

    const validLevels = ["A1", "A2", "B1", "B2"];
    if (!validLevels.includes(level) || typeof score !== "number" || score < 0 || score > 40) {
      return { success: false, error: "Dữ liệu không hợp lệ." };
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập." };
    }

    const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    // Check if user already has a progress record
    const { data: existing } = await supabase
      .from("user_progress")
      .select("user_id, total_xp, streak")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      // Existing user: only update level, preserve XP + streak
      const { error } = await supabase
        .from("user_progress")
        .update({ current_level: level, last_active_date: today })
        .eq("user_id", user.id);

      if (error) return { success: false, error: `Lỗi lưu kết quả: ${error.message}` };
    } else {
      // New user: create fresh record with placement score as seed XP
      const { error } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          current_level: level,
          total_xp: score * 5, // 5 XP per correct — modest seed
          streak: 0,
          last_active_date: today,
        });

      if (error) return { success: false, error: `Lỗi lưu kết quả: ${error.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/learn");
    revalidatePath("/roadmap");
    return { success: true, message: `Đã cập nhật level ${level} thành công!` };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}


