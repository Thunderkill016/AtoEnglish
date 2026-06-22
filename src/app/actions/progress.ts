"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getUnitVocabulary } from "@/lib/constants/vocabulary";
import { awardXpAndUpdateStreak } from "@/lib/progress/award-xp";
import { UNITS } from "@/lib/constants/units";
import { headers } from "next/headers";
import { createRateLimiter } from "@/lib/security/rate-limit";
import {
  isValidDailyXpGoal,
  resolveDailyXpGoal,
} from "@/lib/constants/daily-xp-goal";
import { getSpeakingXp } from "@/lib/constants/xp-rewards";
import {
  hasSpeakingOnDate,
  sumLessonXpOnDate,
  sumQuizXpOnDate,
  sumSpeakingXpOnDate,
  toVnDateKey,
} from "@/lib/dashboard/today-xp";
import { addVnDays, getVnDateKey, getVnWeekdayLabel, getVnYesterdayKey } from "@/lib/utils/vn-date";
import { getUserSavedWords } from "@/lib/cards/saved-words";
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
    const today = getVnDateKey();

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

    // 4. Cộng XP và cập nhật streak (atomic RPC — no read-then-write race)
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("current_level")
      .eq("user_id", user.id)
      .maybeSingle();

    const awardResult = await awardXpAndUpdateStreak(supabase, user.id, xpEarned);
    if (!awardResult) {
      return {
        success: false,
        error: "Lỗi cập nhật tiến trình người dùng.",
      };
    }

    const nextStreak = awardResult.streak;
    const totalXp = awardResult.totalXp;

    // 5. Bulk upsert tất cả từ vựng vào bảng cards (1 query thay vì N+1)
    const vocabList = getUnitVocabulary(cleanParams.unitId);
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

    // 6. Auto level-up: compute new CEFR level based on completed units
    const { data: completedData } = await supabase
      .from("user_lesson_progress")
      .select("unit_id")
      .eq("user_id", user.id);

    const completedUnitIdsNew = completedData?.map(c => c.unit_id) || [];
    const nextUncompletedUnit = UNITS.find(u => !completedUnitIdsNew.includes(u.id)) || UNITS[UNITS.length - 1];
    const newLevel = nextUncompletedUnit.level;

    const currentLevel = userProgress?.current_level ?? "A0";
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

export interface UnitCompletionStatus {
  unitId: string;
  success: boolean;
  completed: boolean;
  completedAt: string | null;
  xpEarned: number;
}

/**
 * Batch-fetch completion status for all curriculum units (1 query instead of N).
 */
export async function getAllUnitCompletionStatuses(): Promise<{
  success: boolean;
  statuses: UnitCompletionStatus[];
}> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, statuses: [] };
    }

    const { data, error } = await supabase
      .from("user_lesson_progress")
      .select("unit_id, completed_at, xp_earned")
      .eq("user_id", user.id);

    if (error) {
      return { success: false, statuses: [] };
    }

    const byUnit = new Map(
      (data ?? []).map((row) => [row.unit_id, row]),
    );

    const statuses: UnitCompletionStatus[] = UNITS.map((unit) => {
      const row = byUnit.get(unit.id);
      return {
        unitId: unit.id,
        success: true,
        completed: !!row,
        completedAt: row?.completed_at ?? null,
        xpEarned: row?.xp_earned ?? 0,
      };
    });

    return { success: true, statuses };
  } catch {
    return { success: false, statuses: [] };
  }
}

/**
 * Today's XP from lessons + speaking, plus speaking quest flag.
 */
export async function getTodayActivitySummary() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return {
        success: false,
        lessonXp: 0,
        speakingXp: 0,
        quizXp: 0,
        totalXp: 0,
        hasSpeakingToday: false,
        lessonCompletedToday: false,
        hasFlashcardsReviewedToday: false,
      };
    }

    const todayKey = getVnDateKey();
    const startUtc = `${todayKey}T00:00:00+07:00`;

    const [lessonsRes, speakingRes, flashcardRes, quizRes] = await Promise.all([
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
      supabase
        .from("user_flashcard_progress")
        .select("last_session_date, cards_reviewed_today")
        .eq("user_id", user.id)
        .maybeSingle(),
      supabase
        .from("quiz_results")
        .select("xp_earned, quiz_date")
        .eq("user_id", user.id)
        .eq("quiz_date", todayKey),
    ]);

    const lessons = lessonsRes.data ?? [];
    const speaking = speakingRes.data ?? [];
    const quizzes = quizRes.data ?? [];
    const lessonXp = sumLessonXpOnDate(lessons, todayKey);
    const speakingXp = sumSpeakingXpOnDate(speaking, todayKey);
    const quizXp = sumQuizXpOnDate(quizzes, todayKey);
    const flashcardProgress = flashcardRes.data;

    return {
      success: true,
      lessonXp,
      speakingXp,
      quizXp,
      totalXp: lessonXp + speakingXp + quizXp,
      hasSpeakingToday: hasSpeakingOnDate(speaking, todayKey),
      lessonCompletedToday: lessons.some(
        (row) => toVnDateKey(row.completed_at) === todayKey,
      ),
      hasFlashcardsReviewedToday:
        flashcardProgress?.last_session_date === todayKey &&
        (flashcardProgress.cards_reviewed_today ?? 0) > 0,
    };
  } catch {
    return {
      success: false,
      lessonXp: 0,
      speakingXp: 0,
      quizXp: 0,
      totalXp: 0,
      hasSpeakingToday: false,
      lessonCompletedToday: false,
      hasFlashcardsReviewedToday: false,
    };
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
        current_level: data?.current_level || "A0",
        streak: data?.streak || 0,
        total_xp: data?.total_xp || 0,
        last_active_date: data?.last_active_date || null,
        daily_xp_goal: resolveDailyXpGoal(data?.daily_xp_goal),
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
    const vocabList = getUnitVocabulary(unitId);
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

    // Parallel: fetch completed lessons + all saved card words (no 500+ word IN list)
    const [completedRes, savedWords] = await Promise.all([
      supabase
        .from("user_lesson_progress")
        .select("unit_id")
        .eq("user_id", user.id),
      getUserSavedWords(supabase, user.id),
    ]);

    if (completedRes.error) {
      return {
        success: false,
        error: `Lỗi truy vấn database: ${completedRes.error.message}`
      };
    }

    const completedUnitIds = completedRes.data?.map(l => l.unit_id) || [];

    // Tính toán trạng thái cho từng Unit
    const unitStatuses = UNITS.map(unit => {
      const isCompleted = completedUnitIds.includes(unit.id);
      const vocab = getUnitVocabulary(unit.id);
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

    if (!isValidDailyXpGoal(goal)) {
      return {
        success: false,
        error: `Mục tiêu XP phải từ 5 đến 200.`,
      };
    }

    const { data: existing, error: fetchError } = await supabase
      .from("user_progress")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError) {
      return { success: false, error: `Lỗi khi kiểm tra tiến trình: ${fetchError.message}` };
    }

    const payload = {
      daily_xp_goal: goal,
      updated_at: new Date().toISOString(),
    };

    const { error } = existing
      ? await supabase.from("user_progress").update(payload).eq("user_id", user.id)
      : await supabase.from("user_progress").insert({
          user_id: user.id,
          current_level: "A0",
          streak: 0,
          total_xp: 0,
          last_active_date: null,
          ...payload,
        });

    if (error) {
      return { success: false, error: `Lỗi khi cập nhật mục tiêu: ${error.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/settings");
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

    const todayKey = getVnDateKey();
    const days: { day: string; label: string; xp: number; pct: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const dateStr = addVnDays(todayKey, -i);
      days.push({ day: dateStr, label: getVnWeekdayLabel(dateStr), xp: 0, pct: 0 });
    }

    const startDate = days[0].day;

    // +07:00 so Postgres interprets startDate as VN midnight, not UTC midnight
    const startUtc = startDate + "T00:00:00+07:00";

    const [lessonsRes, speakingRes, quizRes] = await Promise.all([
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
      supabase
        .from("quiz_results")
        .select("xp_earned, quiz_date")
        .eq("user_id", user.id)
        .gte("quiz_date", startDate),
    ]);

    // Add lesson XP per day
    if (!lessonsRes.error && lessonsRes.data) {
      for (const row of lessonsRes.data) {
        const rowDate = new Date(row.completed_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        const day = days.find(d => d.day === rowDate);
        if (day) day.xp += (row.xp_earned || 0);
      }
    }

    if (!speakingRes.error && speakingRes.data) {
      for (const row of speakingRes.data) {
        const rowDate = new Date(row.created_at).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
        const day = days.find(d => d.day === rowDate);
        if (day) day.xp += getSpeakingXp(row.practice_type);
      }
    }

    if (!quizRes.error && quizRes.data) {
      for (const row of quizRes.data) {
        const day = days.find((d) => d.day === row.quiz_date);
        if (day) day.xp += row.xp_earned;
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

/**
 * Server Action tính toán điểm số dự kiến IELTS và TOEIC dựa trên tiến độ thực tế,
 * lịch sử luyện nói và hiệu năng ghi nhớ thẻ flashcard FSRS.
 */
export async function getPredictiveScore() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập để xem dự đoán điểm số." };
    }

    // Parallel fetch required data
    const [completedRes, speakingRes, cardsRes] = await Promise.all([
      supabase.from("user_lesson_progress").select("unit_id").eq("user_id", user.id),
      supabase.from("speaking_sessions").select("accuracy_score").eq("user_id", user.id),
      supabase.from("cards").select("state").eq("user_id", user.id),
    ]);

    if (completedRes.error) {
      return { success: false, error: `Lỗi khi lấy tiến trình: ${completedRes.error.message}` };
    }

    const completedUnits = completedRes.data?.map(u => u.unit_id) || [];
    const speakingSessions = speakingRes.data || [];
    const cards = cardsRes.data || [];

    // Group units by level
    let a0Count = 0;
    let a1Count = 0;
    let a2Count = 0;
    let b1Count = 0;
    let b2Count = 0;

    completedUnits.forEach(id => {
      if (id.startsWith("unit-a0-")) {
        a0Count++;
      } else {
        const num = parseInt(id.replace("unit-", ""), 10);
        if (num >= 1 && num <= 12) a1Count++;
        else if (num >= 13 && num <= 18) a2Count++;
        else if (num >= 19 && num <= 32) b1Count++;
        else if (num >= 33 && num <= 42) b2Count++;
      }
    });

    // 1. Calculate Base IELTS and TOEIC based on CEFR level completion
    let baseIelts = 0.0;
    let baseToeic = 10.0;

    // A0 (8 units) -> IELTS 0.0 to 2.0, TOEIC 10 to 100
    baseIelts += a0Count * (2.0 / 8);
    baseToeic += a0Count * (90 / 8);

    // A1 (12 units) -> IELTS 2.0 to 3.0, TOEIC 100 to 250
    if (a0Count >= 6) {
      baseIelts += a1Count * (1.0 / 12);
      baseToeic += a1Count * (150 / 12);
    } else {
      baseIelts += a1Count * (0.8 / 12);
      baseToeic += a1Count * (120 / 12);
    }

    // A2 (6 units) -> IELTS 3.0 to 4.0, TOEIC 250 to 400
    baseIelts += a2Count * (1.0 / 6);
    baseToeic += a2Count * (150 / 6);

    // B1 (14 units) -> IELTS 4.0 to 5.5, TOEIC 400 to 600
    baseIelts += b1Count * (1.5 / 14);
    baseToeic += b1Count * (200 / 14);

    // B2 (10 units) -> IELTS 5.5 to 7.0, TOEIC 600 to 800
    baseIelts += b2Count * (1.5 / 10);
    baseToeic += b2Count * (200 / 10);

    // 2. Adjust based on speaking accuracy
    let speakingMultiplier = 0.90;
    let avgSpeakingAccuracy = 0;
    const scoredSpeakingSessions = speakingSessions.filter(s => s.accuracy_score !== null);
    if (scoredSpeakingSessions.length > 0) {
      const sum = scoredSpeakingSessions.reduce((acc, curr) => acc + (curr.accuracy_score || 0), 0);
      avgSpeakingAccuracy = sum / scoredSpeakingSessions.length;
      speakingMultiplier = 0.85 + (avgSpeakingAccuracy / 100) * 0.20;
    }

    // 3. Adjust based on SRS vocabulary retention (retained cards in state=2 or active in state=1)
    let srsMultiplier = 0.90;
    let retentionRate = 0;
    if (cards.length > 0) {
      const reviewCards = cards.filter(c => c.state === 2).length;
      const learningCards = cards.filter(c => c.state === 1).length;
      retentionRate = (reviewCards + learningCards * 0.5) / cards.length;
      srsMultiplier = 0.85 + retentionRate * 0.20;
    }

    // Calculate final estimated scores
    let finalIelts = baseIelts * speakingMultiplier * srsMultiplier;
    let finalToeic = baseToeic * speakingMultiplier * srsMultiplier;

    // Minimum constraints
    if (finalIelts < 1.0) finalIelts = 1.0;
    if (finalToeic < 10) finalToeic = 10;

    // Cap at maximum curriculum potential (IELTS 7.5, TOEIC 850 for B2 assessment)
    if (finalIelts > 7.5) finalIelts = 7.5;
    if (finalToeic > 850) finalToeic = 850;

    // Rounded scores for standardized presentation
    const roundedIelts = Math.round(finalIelts * 2) / 2;
    const roundedToeic = Math.round(finalToeic / 5) * 5;

    // Calculate individual skills estimation
    const listeningBand = Math.round(Math.min(finalIelts * 1.05 * srsMultiplier, 8.0) * 2) / 2;
    const readingBand = Math.round(Math.min(finalIelts * 1.08 * srsMultiplier, 8.0) * 2) / 2;
    const speakingBand = Math.round(Math.min(finalIelts * 0.95 * speakingMultiplier, 7.5) * 2) / 2;
    const writingBand = Math.round(Math.min(finalIelts * 0.92, 7.5) * 2) / 2;

    // Generate actionable recommendations
    const recommendations: string[] = [];
    if (completedUnits.length < 5) {
      recommendations.push("Hãy học thêm ít nhất 5 bài học mới để mở khóa các chủ đề ngữ pháp và từ vựng cốt lõi.");
    }
    if (cards.length < 20) {
      recommendations.push("Bạn có quá ít từ vựng trong hộp nhớ. Hoàn thành bài học và ôn tập thẻ ghi nhớ FSRS mỗi ngày.");
    } else if (retentionRate < 0.4) {
      recommendations.push("Tỷ lệ ghi nhớ từ vựng SRS của bạn hơi thấp. Hãy dành 10 phút ôn tập thẻ để củng cố bộ nhớ.");
    }
    if (speakingSessions.length < 3) {
      recommendations.push("Luyện Nói chưa đủ. Hãy thực hành Shadowing hoặc AI Roleplay ít nhất 3 lần để kích hoạt phản xạ.");
    } else if (avgSpeakingAccuracy < 70) {
      recommendations.push("Phát âm của bạn cần cải thiện. Hãy chú ý hơn đến phụ âm cuối (codas) khi luyện Shadowing.");
    }

    if (recommendations.length === 0) {
      recommendations.push("Tuyệt vời! Hãy tiếp tục duy trì thói quen học đều đặn mỗi ngày để sớm đạt mục tiêu.");
    }

    return {
      success: true,
      score: {
        rawIelts: finalIelts,
        rawToeic: finalToeic,
        ielts: roundedIelts,
        toeic: roundedToeic,
        skills: {
          listening: Math.max(listeningBand, 1.0),
          reading: Math.max(readingBand, 1.0),
          speaking: Math.max(speakingBand, 1.0),
          writing: Math.max(writingBand, 1.0),
        },
        avgSpeakingAccuracy,
        srsRetention: retentionRate * 100,
        completedUnitsCount: completedUnits.length,
        recommendations
      }
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    return { success: false, error: errMsg };
  }
}
