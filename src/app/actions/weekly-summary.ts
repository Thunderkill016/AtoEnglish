"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * getWeeklySummary — fetches the current week's XP and lesson stats for a user.
 * Used by the weekly push notification cron job.
 */
export async function getWeeklySummary() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  // Parallel: XP this week + units completed this week
  const [xpResult, unitsResult] = await Promise.all([
    supabase
      .from("user_progress")
      .select("total_xp, streak, current_level")
      .eq("user_id", user.id)
      .single(),
    supabase
      .from("user_lesson_progress")
      .select("unit_id, completed_at")
      .eq("user_id", user.id)
      .gte("completed_at", weekAgo.toISOString()),
  ]);

  return {
    totalXp: xpResult.data?.total_xp ?? 0,
    streak: xpResult.data?.streak ?? 0,
    currentLevel: xpResult.data?.current_level ?? "A0",
    unitsCompletedThisWeek: unitsResult.data?.length ?? 0,
  };
}
