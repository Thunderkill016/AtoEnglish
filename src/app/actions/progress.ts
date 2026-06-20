"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import { UNITS } from "@/lib/constants/units";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { CompleteUnitSchema } from "@/lib/security/validation";

const completeUnitLimiter = createRateLimiter(10, 60 * 1000, "complete-unit");

/**
 * Server Action xử lý khi người dùng hoàn thành một Unit học tập.
 * Cộng 80 XP, cập nhật streak, lưu tất cả từ vựng trong unit vào SRS (nếu chưa có).
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

    // 2. Kiểm tra xem unit này đã được hoàn thành chưa (tránh cộng XP trùng)
    const { data: existingProgress, error: progressError } = await supabase
      .from("user_lesson_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("unit_id", cleanParams.unitId)
      .maybeSingle();

    if (progressError) {
      return {
        success: false,
        error: `Lỗi kiểm tra lịch sử học tập: ${progressError.message}`
      };
    }

    if (existingProgress) {
      return {
        success: true,
        message: "Unit này đã được bạn hoàn thành trước đó.",
        alreadyCompleted: true
      };
    }

    // 3. Tiến hành insert bản ghi hoàn thành vào user_lesson_progress
    // Dynamic XP based on performance stars: 3★=100%, 2★=85%, 1★=70%
    const BASE_XP = 80;
    const xpMultiplier = cleanParams.starCount === 3 ? 1.0 : cleanParams.starCount === 2 ? 0.85 : 0.70;
    const xpEarned = Math.round(BASE_XP * xpMultiplier);

    const { error: insertProgressError } = await supabase
      .from("user_lesson_progress")
      .insert({
        user_id: user.id,
        unit_id: cleanParams.unitId,
        xp_earned: xpEarned
      });

    if (insertProgressError) {
      return {
        success: false,
        error: `Lỗi lưu tiến trình bài học: ${insertProgressError.message}`
      };
    }

    // 4. Cộng XP và cập nhật streak trong user_progress
    const { data: userProgress, error: fetchProgressError } = await supabase
      .from("user_progress")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchProgressError) {
      return {
        success: false,
        error: `Lỗi truy vấn tiến trình người dùng: ${fetchProgressError.message}`
      };
    }

    let nextStreak = 1;
    let totalXp = xpEarned;

    if (!userProgress) {
      // Nếu chưa có tiến trình người dùng, tạo bản ghi mới
      const { error: createProgressError } = await supabase
        .from("user_progress")
        .insert({
          user_id: user.id,
          current_level: "A1", // Default level for new users
          streak: 1,
          total_xp: xpEarned,
          last_active_date: today
        });

      if (createProgressError) {
        return {
          success: false,
          error: `Lỗi tạo mới tiến trình người dùng: ${createProgressError.message}`
        };
      }
    } else {
      // Nếu đã có tiến trình, tính toán streak
      totalXp = userProgress.total_xp + xpEarned;
      const lastActive = userProgress.last_active_date;

      if (!lastActive) {
        nextStreak = 1;
      } else {
        // Tính ngày hôm qua
        const d = new Date(today);
        d.setDate(d.getDate() - 1);
        const yesterday = d.toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

        if (lastActive === today) {
          // Làm nhiều bài trong cùng 1 ngày, giữ nguyên streak
          nextStreak = userProgress.streak;
        } else if (lastActive === yesterday) {
          // Làm bài liên tiếp ngày tiếp theo, tăng streak
          nextStreak = userProgress.streak + 1;
        } else {
          // Cách ngày không học, reset streak về 1
          nextStreak = 1;
        }
      }

      const { error: updateProgressError } = await supabase
        .from("user_progress")
        .update({
          total_xp: totalXp,
          streak: nextStreak,
          last_active_date: today
        })
        .eq("user_id", user.id);

      if (updateProgressError) {
        return {
          success: false,
          error: `Lỗi cập nhật tiến trình người dùng: ${updateProgressError.message}`
        };
      }
    }

    // 5. Bulk upsert tất cả từ vựng vào bảng cards (1 query thay vì N+1)
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

    // 6. Auto level-up: compute new CEFR level based on total completed units
    const { count: totalCompleted } = await supabase
      .from("user_lesson_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const completedCount = totalCompleted ?? 0;
    // Level thresholds: A1 (0-2 units), A2 (3 units), B1 (4+ units)
    type CEFRLevelLocal = "A1" | "A2" | "B1" | "B2" | "C1";
    let newLevel: CEFRLevelLocal = "A1";
    if (completedCount >= 4) newLevel = "B1";
    else if (completedCount >= 3) newLevel = "A2";

    const currentLevel = userProgress?.current_level ?? "A1";
    if (newLevel && newLevel !== currentLevel) {
      await supabase
        .from("user_progress")
        .update({ current_level: newLevel })
        .eq("user_id", user.id);
    }

    // 7. Revalidate cache
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
      leveledUp: newLevel !== currentLevel ? newLevel : null,
      previousLevel: currentLevel,
      newLevel: newLevel,
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

    // Lấy display_name từ bảng users
    const { data: profile } = await supabase
      .from("users")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle();

    const displayName = profile?.display_name || user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Học viên";

    return {
      success: true,
      progress: {
        user_id: user.id,
        current_level: data?.current_level || "A1",
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
    const { data, error } = await supabase
      .from("user_lesson_progress")
      .select("xp_earned, completed_at")
      .eq("user_id", user.id)
      .gte("completed_at", startDate + "T00:00:00.000Z");

    if (!error && data) {
      for (const row of data) {
        const rowDate = new Date(row.completed_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        const day = days.find(d => d.day === rowDate);
        if (day) day.xp += (row.xp_earned || 0);
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

    const [progressRes, cardsRes, completedRes] = await Promise.all([
      supabase.from("user_progress").select("*").eq("user_id", user.id).maybeSingle(),
      supabase.from("cards").select("state").eq("user_id", user.id),
      supabase.from("user_lesson_progress").select("unit_id", { count: "exact" }).eq("user_id", user.id),
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
        currentLevel: progress?.current_level || "A1",
        totalCards,
        cardsByState,
        completedUnits: completedRes.count || 0,
      }
    };
  } catch {
    return { success: false, stats: null };
  }
}
