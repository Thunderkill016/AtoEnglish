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

// Suppress unused variable warning — kept for type narrowing in callers
void CEFR_LEVEL_ORDER;

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
    const BASE_XP = unitDef?.xp ?? 80;
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

    // 5. Fire-and-forget: check and award achievements (non-blocking)
    // We do NOT await — achievement failure must never break lesson completion
    void (async () => {
      try {
        const totalCompleted = (resultData.completed_count ?? 1);
        const totalXp = resultData.new_total_xp ?? 0;
        const streak = nextStreak;

        // Run all achievement checks in parallel
        await Promise.allSettled([
          // Lesson count achievements
          (supabase as unknown as { from: (t: string) => { select: (c: string) => { order: (c: string, o: Record<string, boolean>) => Promise<{ data: Array<{ id: string; threshold: number | null }> | null }> } } })
            .from("achievements").select("id, threshold").order("threshold", { ascending: true })
            .then(async () => {
              // Simplified: upsert lesson milestone achievements
              const lessonMilestones: Record<number, string> = { 1: "first_lesson", 5: "lessons_5", 10: "lessons_10", 25: "lessons_25", 50: "lessons_50" };
              const toAward = Object.entries(lessonMilestones)
                .filter(([threshold]) => totalCompleted >= Number(threshold))
                .map(([, id]) => ({ user_id: user.id, achievement_id: id }));
              if (toAward.length > 0) {
                await (supabase as unknown as { from: (t: string) => { upsert: (d: unknown[], o: Record<string, unknown>) => Promise<unknown> } })
                  .from("user_achievements").upsert(toAward, { onConflict: "user_id,achievement_id", ignoreDuplicates: true });
              }
            }),

          // XP achievements
          (async () => {
            const xpMilestones: Record<number, string> = { 100: "xp_100", 500: "xp_500", 1000: "xp_1000", 5000: "xp_5000" };
            const toAward = Object.entries(xpMilestones)
              .filter(([threshold]) => totalXp >= Number(threshold))
              .map(([, id]) => ({ user_id: user.id, achievement_id: id }));
            if (toAward.length > 0) {
              await (supabase as unknown as { from: (t: string) => { upsert: (d: unknown[], o: Record<string, unknown>) => Promise<unknown> } })
                .from("user_achievements").upsert(toAward, { onConflict: "user_id,achievement_id", ignoreDuplicates: true });
            }
          })(),

          // Streak achievements + freeze grant
          (async () => {
            if (streak <= 0) return;
            const streakMilestones: Record<number, string> = { 3: "streak_3", 7: "streak_7", 14: "streak_14", 30: "streak_30", 100: "streak_100" };
            const toAward = Object.entries(streakMilestones)
              .filter(([threshold]) => streak >= Number(threshold))
              .map(([, id]) => ({ user_id: user.id, achievement_id: id }));
            if (toAward.length > 0) {
              await (supabase as unknown as { from: (t: string) => { upsert: (d: unknown[], o: Record<string, unknown>) => Promise<unknown> } })
                .from("user_achievements").upsert(toAward, { onConflict: "user_id,achievement_id", ignoreDuplicates: true });
            }
            // Grant a streak freeze on milestone streaks (7, 14, 30 days)
            if ([7, 14, 30].includes(streak)) {
              type RpcFn = (name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
              await (supabase.rpc as unknown as RpcFn)("grant_streak_freeze", { p_user_id: user.id, p_count: 1 });
            }
          })(),

          // CEFR level-up achievement
          leveledUp
            ? (async () => {
                const levelAchievements: Record<string, string> = { A1: "level_a1", A2: "level_a2", B1: "level_b1" };
                const achievementId = levelAchievements[newLevel];
                if (achievementId) {
                  await (supabase as unknown as { from: (t: string) => { upsert: (d: unknown[], o: Record<string, unknown>) => Promise<unknown> } })
                    .from("user_achievements").upsert(
                      [{ user_id: user.id, achievement_id: achievementId }],
                      { onConflict: "user_id,achievement_id", ignoreDuplicates: true }
                    );
                }
              })()
            : Promise.resolve(),
        ]);
      } catch {
        // Achievement failure is completely non-blocking — lesson is already saved
      }
    })();

    return {
      success: true,
      message: `Hoàn thành bài học thành công! Bạn nhận được ${xpEarned} XP (${cleanParams.starCount}⭐).`,
      xpEarned,
      newStreak: nextStreak,
      newTotalXp: resultData.new_total_xp ?? 0,
      completedCount: resultData.completed_count ?? 1,
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
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để reset tiến trình."
      };
    }

    // 1. Xóa tiến trình unit
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

    // 2. Xóa card_reviews liên quan đến unit này
    const vocabList = UNIT_VOCABULARY[unitId] || [];
    if (vocabList.length > 0) {
      const wordList = vocabList.map(v => v.word.toLowerCase().trim());
      await supabase
        .from("cards")
        .delete()
        .eq("user_id", user.id)
        .in("word", wordList);
      // Non-critical: SRS card cleanup failure doesn't block progress reset
    }

    // 3. Revalidate cache
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

    let activeUnit = unitStatuses.find(u => !u.completed && u.progress > 0);
    if (!activeUnit) activeUnit = unitStatuses.find(u => !u.completed);
    if (!activeUnit) activeUnit = unitStatuses[unitStatuses.length - 1];

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
