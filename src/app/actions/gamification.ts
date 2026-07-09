"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import { z } from "zod";

const freezeLimiter = createRateLimiter(5, 60 * 60 * 1000, "streak-freeze");

// ─── Local types (until migration is applied + npm run db:types is run) ───────

interface AchievementRow {
  id: string;
  title_vn: string;
  title_en: string;
  description_vn: string;
  emoji: string;
  category: "streak" | "xp" | "lesson" | "speaking" | "flashcard" | "special";
  xp_reward: number;
  threshold: number | null;
  created_at: string;
}

interface UserAchievementRow {
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  notified: boolean;
}

interface UserProgressWithFreeze {
  streak: number;
  streak_freeze_count: number;
  best_streak: number;
}

// ─── Use Streak Freeze ─────────────────────────────────────────────────────────

/**
 * Consume one streak freeze to protect today's streak.
 * Uses PL/pgSQL function use_streak_freeze() for atomicity.
 */
export async function useStreakFreeze() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "Bạn cần đăng nhập." };

  const rateErr = await checkActionRateLimit(
    freezeLimiter,
    "Quá nhiều yêu cầu. Thử lại sau.",
  );
  if (rateErr) return { success: false, error: rateErr };

  // use_streak_freeze RPC is added by migration 20260624020000.
  // Cast via unknown since supabase.ts hasn't been regenerated yet.
  type RpcFn = (name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
  const { data, error } = await (supabase.rpc as unknown as RpcFn)("use_streak_freeze", { p_user_id: user.id });

  if (error) return { success: false, error: error.message };

  const result = data as { success: boolean; freezes_remaining: number; streak: number; error?: string };
  if (!result.success) return { success: false, error: result.error ?? "Không thể dùng lá chắn." };

  revalidatePath("/dashboard");
  return {
    success: true,
    freezesRemaining: result.freezes_remaining,
    streak: result.streak,
  };
}

// ─── Get Achievements ─────────────────────────────────────────────────────────

/**
 * Fetch all achievements + which ones the current user has unlocked.
 */
export async function getAchievements() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, achievements: [], unlockedIds: [] };

    // Use typed PostgrestBuilder cast since tables are added by migration
    const sbAny = supabase as ReturnType<typeof createClient> extends Promise<infer C> ? C : never;

    const [catalogRes, unlockedRes] = await Promise.all([
      (supabase as unknown as { from: (t: string) => { select: (c: string) => { order: (c: string) => { order: (c: string) => Promise<{ data: AchievementRow[] | null; error: { message: string } | null }> } } } }).from("achievements").select("*").order("category").order("threshold"),
      (supabase as unknown as { from: (t: string) => { select: (c: string) => { eq: (c: string, v: string) => Promise<{ data: Pick<UserAchievementRow, "achievement_id" | "unlocked_at">[] | null; error: { message: string } | null }> } } }).from("user_achievements").select("achievement_id, unlocked_at").eq("user_id", user.id),
    ]);
    void sbAny;

    if (catalogRes.error) return { success: false, achievements: [], unlockedIds: [] };

    const unlockedMap = new Map(
      (unlockedRes.data ?? []).map(r => [r.achievement_id, r.unlocked_at])
    );

    const achievements = (catalogRes.data ?? []).map((a: AchievementRow) => ({
      ...a,
      unlocked_at: unlockedMap.get(a.id) ?? null,
    }));

    return {
      success: true,
      achievements,
      unlockedIds: Array.from(unlockedMap.keys()),
    };
  } catch {
    return { success: false, achievements: [], unlockedIds: [] };
  }
}

// ─── Check and Award Achievements ────────────────────────────────────────────

const CheckAchievementSchema = z.object({
  category: z.enum(["streak", "xp", "lesson", "speaking", "flashcard", "special"]),
  value: z.number().int().min(0).max(100_000),
});

/**
 * Check if user has earned new achievements for a category + value.
 * Called after completing a lesson, reaching XP milestones, etc.
 */
export async function checkAndAwardAchievements(
  category: "streak" | "xp" | "lesson" | "speaking" | "flashcard" | "special",
  value: number,
  specialId?: string
): Promise<{ newlyUnlocked: string[] }> {
  try {
    const parsed = CheckAchievementSchema.safeParse({ category, value });
    if (!parsed.success) return { newlyUnlocked: [] };

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { newlyUnlocked: [] };

    type AnyTable = { from: (t: string) => { select: (c: string) => unknown } };
    const db = supabase as unknown as AnyTable;

    // Fetch catalog + already unlocked in parallel
    const [catalogResult, unlockedResult] = await Promise.all([
      (db.from("achievements").select("id, threshold, xp_reward, category") as Promise<{ data: Pick<AchievementRow, "id" | "threshold" | "xp_reward" | "category">[] | null; error: unknown }>),
      (supabase as unknown as { from: (t: string) => { select: (c: string) => { eq: (c: string, v: string) => Promise<{ data: { achievement_id: string }[] | null }> } } }).from("user_achievements").select("achievement_id").eq("user_id", user.id),
    ]);

    if ((catalogResult as { error: unknown }).error) return { newlyUnlocked: [] };

    const allAchievements = (catalogResult.data ?? []).filter(a => a.category === category);
    const alreadyUnlocked = new Set((unlockedResult.data ?? []).map(r => r.achievement_id));
    const newlyUnlocked: string[] = [];

    const toUnlock = allAchievements.filter(a => {
      if (alreadyUnlocked.has(a.id)) return false;
      if (a.threshold === null) return specialId === a.id;
      return value >= a.threshold;
    });

    if (toUnlock.length === 0) return { newlyUnlocked: [] };

    const inserts = toUnlock.map(a => ({ user_id: user.id, achievement_id: a.id }));

    await (supabase as unknown as { from: (t: string) => { upsert: (d: unknown, o: unknown) => Promise<unknown> } })
      .from("user_achievements")
      .upsert(inserts, { onConflict: "user_id,achievement_id", ignoreDuplicates: true });

    newlyUnlocked.push(...toUnlock.map(a => a.id));

    // Award XP bonus for each achievement
    const totalXpReward = toUnlock.reduce((sum, a) => sum + (a.xp_reward ?? 0), 0);
    if (totalXpReward > 0) {
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      await supabase.rpc("award_user_xp", {
        p_user_id: user.id,
        p_xp_amount: totalXpReward,
        p_today: today,
        p_yesterday: yesterday,
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/progress");
    return { newlyUnlocked };
  } catch {
    return { newlyUnlocked: [] };
  }
}

// ─── Get Streak Info ──────────────────────────────────────────────────────────

/**
 * Returns streak + freeze count for the StreakShieldWidget.
 * NOTE: streak_freeze_count column is added by migration 20260624020000.
 * Run `npm run db:types` after applying the migration.
 */
export async function getStreakInfo() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, streak: 0, freezeCount: 0, bestStreak: 0 };

    const { data, error } = await supabase
      .from("user_progress")
      .select("streak, streak_freeze_count, best_streak")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) return { success: false, streak: 0, freezeCount: 0, bestStreak: 0 };

    const row = data as unknown as UserProgressWithFreeze;
    return {
      success: true,
      streak: row.streak ?? 0,
      freezeCount: row.streak_freeze_count ?? 0,
      bestStreak: row.best_streak ?? 0,
    };
  } catch {
    return { success: false, streak: 0, freezeCount: 0, bestStreak: 0 };
  }
}
