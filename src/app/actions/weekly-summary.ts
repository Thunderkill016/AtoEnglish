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

export interface WeeklyReportData {
  // User snapshot
  totalXp: number;
  streak: number;
  currentLevel: string;
  // This week
  lessonsThisWeek: number;
  cardsThisWeek: number;
  activeDaysThisWeek: number;
  // Last week (for comparison deltas)
  lessonsLastWeek: number;
  cardsLastWeek: number;
  activeDaysLastWeek: number;
  // Card rating breakdown this week (Again=1 Hard=2 Good=3 Easy=4)
  ratingBreakdown: { again: number; hard: number; good: number; easy: number };
  // Per-day activity last 7 days (ISO date → card count)
  dailyActivity: Array<{ date: string; label: string; cards: number; lessons: number }>;
}

/**
 * getWeeklyReport — comprehensive weekly stats for the /progress/weekly page.
 * Parallel-fetches lesson progress + card review logs for this week and last week.
 */
export async function getWeeklyReport(): Promise<WeeklyReportData | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const now = new Date();
    const vnOffset = 7 * 60; // UTC+7
    const vnNow = new Date(now.getTime() + vnOffset * 60000);

    // Date boundaries (in ISO, Supabase stores UTC)
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    // Parallel fetch: user stats + this-week lessons + last-week lessons +
    //                 this-week card logs + last-week card logs
    const [progressRes, lessonsThisRes, lessonsLastRes, cardsThisRes, cardsLastRes] =
      await Promise.all([
        supabase
          .from("user_progress")
          .select("total_xp, streak, current_level")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_lesson_progress")
          .select("unit_id, completed_at")
          .eq("user_id", user.id)
          .gte("completed_at", weekAgo.toISOString()),
        supabase
          .from("user_lesson_progress")
          .select("unit_id, completed_at")
          .eq("user_id", user.id)
          .gte("completed_at", twoWeeksAgo.toISOString())
          .lt("completed_at", weekAgo.toISOString()),
        supabase
          .from("card_review_logs")
          .select("card_id, rating, created_at")
          .eq("user_id", user.id)
          .gte("created_at", weekAgo.toISOString()),
        supabase
          .from("card_review_logs")
          .select("card_id, rating, created_at")
          .eq("user_id", user.id)
          .gte("created_at", twoWeeksAgo.toISOString())
          .lt("created_at", weekAgo.toISOString()),
      ]);

    const lessonsThis = lessonsThisRes.data ?? [];
    const lessonsLast = lessonsLastRes.data ?? [];
    const cardsThis = cardsThisRes.data ?? [];
    const cardsLast = cardsLastRes.data ?? [];

    // Rating breakdown
    const ratingBreakdown = { again: 0, hard: 0, good: 0, easy: 0 };
    for (const r of cardsThis) {
      if (r.rating === 1) ratingBreakdown.again++;
      else if (r.rating === 2) ratingBreakdown.hard++;
      else if (r.rating === 3) ratingBreakdown.good++;
      else if (r.rating === 4) ratingBreakdown.easy++;
    }

    // Active days this week (unique VN dates with any card review or lesson)
    const toVnDate = (iso: string) =>
      new Date(iso).toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });

    const activeDaysSet = new Set<string>();
    for (const c of cardsThis) activeDaysSet.add(toVnDate(c.created_at));
    for (const l of lessonsThis) if (l.completed_at) activeDaysSet.add(toVnDate(l.completed_at));

    const activeDaysLastSet = new Set<string>();
    for (const c of cardsLast) activeDaysLastSet.add(toVnDate(c.created_at));
    for (const l of lessonsLast) if (l.completed_at) activeDaysLastSet.add(toVnDate(l.completed_at));

    // Build per-day activity for last 7 days
    const DAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const dailyActivity: WeeklyReportData["dailyActivity"] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(vnNow);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("sv-SE");
      const dayOfWeek = d.getDay(); // 0=Sun
      const cards = cardsThis.filter(c => toVnDate(c.created_at) === dateStr).length;
      const lessons = lessonsThis.filter(l => l.completed_at && toVnDate(l.completed_at) === dateStr).length;
      dailyActivity.push({ date: dateStr, label: DAY_LABELS[dayOfWeek] ?? dateStr, cards, lessons });
    }

    return {
      totalXp: progressRes.data?.total_xp ?? 0,
      streak: progressRes.data?.streak ?? 0,
      currentLevel: progressRes.data?.current_level ?? "A0",
      lessonsThisWeek: lessonsThis.length,
      cardsThisWeek: cardsThis.length,
      activeDaysThisWeek: activeDaysSet.size,
      lessonsLastWeek: lessonsLast.length,
      cardsLastWeek: cardsLast.length,
      activeDaysLastWeek: activeDaysLastSet.size,
      ratingBreakdown,
      dailyActivity,
    };
  } catch {
    return null;
  }
}
