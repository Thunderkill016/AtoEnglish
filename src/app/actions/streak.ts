"use server";

import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import { StreakMilestoneSchema } from "@/lib/security/validation";
import { getTodayVN, MILESTONE_REWARDS, STREAK_MILESTONES } from "@/features/streak/utils/streakCalculator";

const repairRateLimiter = createRateLimiter(5, 60_000, "streak-repair");

/** Repair a broken streak. Costs 200 XP. Only within 24h of break. */
export async function repairStreak(): Promise<{ success: boolean; error?: string; newStreak?: number }> {
  const rateErr = await checkActionRateLimit(repairRateLimiter, "Thao tác quá nhanh, thử lại sau.");
  if (rateErr) return { success: false, error: rateErr };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Không có quyền truy cập" };

  const { data: progress } = await supabase
    .from("user_progress")
    .select("streak, total_xp, last_active_date, best_streak")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!progress) return { success: false, error: "Không tìm thấy dữ liệu." };
  if ((progress.total_xp ?? 0) < 200) return { success: false, error: "Không đủ XP (cần 200 XP)." };

  const todayVN = getTodayVN();
  const lastDate = progress.last_active_date;
  if (!lastDate) return { success: false, error: "Không có streak để sửa." };

  // Validate: only allow repair if missed exactly 1 day (within 24h window)
  const daysDiff = Math.round(
    (new Date(todayVN + "T12:00:00Z").getTime() - new Date(lastDate + "T12:00:00Z").getTime()) / 86_400_000
  );
  if (daysDiff < 1) return { success: false, error: "Streak của bạn vẫn đang active!" };
  if (daysDiff > 2) return { success: false, error: "Đã quá 24h — không thể sửa streak nữa." };

  // Restore: set last_active_date to today (streak stays as-is, user must study today to increment)
  const { error } = await supabase
    .from("user_progress")
    .update({
      total_xp: (progress.total_xp ?? 0) - 200,
      last_active_date: todayVN,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true, newStreak: progress.streak };
}

const milestoneRateLimiter = createRateLimiter(20, 60_000, "streak-milestone");

/** Award milestone rewards (XP bonus + freezes). Called after lesson completion. */
export async function awardMilestoneReward(milestone: number): Promise<{ success: boolean; error?: string }> {
  const parsed = StreakMilestoneSchema.safeParse({ milestone });
  if (!parsed.success) {
    return { success: false, error: "Invalid milestone." };
  }

  if (!(STREAK_MILESTONES as readonly number[]).includes(parsed.data.milestone)) {
    return { success: false, error: "Invalid milestone." };
  }

  const reward = MILESTONE_REWARDS[parsed.data.milestone];
  if (!reward) return { success: false, error: "No reward config." };

  const rateErr = await checkActionRateLimit(milestoneRateLimiter, "Rate limit exceeded.");
  if (rateErr) return { success: false, error: rateErr };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data: progress } = await supabase
    .from("user_progress")
    .select("total_xp, streak_freeze_count")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!progress) return { success: false, error: "No progress record." };

  const newFreezes = Math.min(3, (progress.streak_freeze_count ?? 0) + reward.freezes);

  const { error } = await supabase
    .from("user_progress")
    .update({
      total_xp: (progress.total_xp ?? 0) + reward.xpBonus,
      streak_freeze_count: newFreezes,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", user.id);

  if (error) return { success: false, error: error.message };
  return { success: true };
}
