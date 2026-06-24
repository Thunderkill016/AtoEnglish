"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type UserRow = Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "display_name" | "email">;

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  total_xp: number;
  streak: number;
  current_level: string;
  is_current_user: boolean;
}

// ─── Helper ────────────────────────────────────────────────────────────────────

async function buildDisplayNameMap(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[]
): Promise<Map<string, string>> {
  const { data: userRows } = await supabase
    .from("users")
    .select("id, display_name, email")
    .in("id", userIds);

  return new Map(
    (userRows ?? []).map((u: UserRow) => [
      u.id,
      u.display_name ?? u.email?.split("@")[0] ?? "Ẩn danh",
    ])
  );
}

// ─── All-time leaderboard ──────────────────────────────────────────────────────

/**
 * getLeaderboard — fetches top 20 users by total XP (all-time).
 * No rate limit needed — read-only, auth-gated.
 */
export async function getLeaderboard(): Promise<{
  success: boolean;
  entries?: LeaderboardEntry[];
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập." };
    }

    const { data, error } = await supabase
      .from("user_progress")
      .select("user_id, total_xp, streak, current_level")
      .order("total_xp", { ascending: false })
      .limit(20);

    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: true, entries: [] };

    const userIds = data.map((row) => row.user_id);
    const profileMap = await buildDisplayNameMap(supabase, userIds);

    const entries: LeaderboardEntry[] = data.map((row, idx) => ({
      rank: idx + 1,
      user_id: row.user_id,
      display_name: profileMap.get(row.user_id) ?? `Học viên ${row.user_id.slice(0, 6)}`,
      total_xp: row.total_xp ?? 0,
      streak: row.streak ?? 0,
      current_level: row.current_level ?? "A1",
      is_current_user: row.user_id === user.id,
    }));

    return { success: true, entries };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Lỗi hệ thống: ${msg}` };
  }
}

// ─── Weekly leaderboard ────────────────────────────────────────────────────────

/**
 * getWeeklyLeaderboard — fetches top 20 users by XP earned THIS week.
 * Uses user_lesson_progress.xp_earned filtered by completed_at >= Monday 00:00 UTC.
 * No rate limit needed — read-only, auth-gated.
 */
export async function getWeeklyLeaderboard(): Promise<{
  success: boolean;
  entries?: LeaderboardEntry[];
  weekStart?: string;
  error?: string;
}> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Bạn cần đăng nhập." };
    }

    // Compute start of current ISO week (Monday 00:00 UTC)
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() - daysToMonday);
    weekStart.setUTCHours(0, 0, 0, 0);
    const weekStartISO = weekStart.toISOString();

    // Fetch all lesson completions this week
    const { data, error } = await supabase
      .from("user_lesson_progress")
      .select("user_id, xp_earned")
      .gte("completed_at", weekStartISO);

    if (error) return { success: false, error: error.message };
    if (!data || data.length === 0) return { success: true, entries: [], weekStart: weekStartISO };

    // Aggregate XP per user
    const xpByUser = new Map<string, number>();
    for (const row of data) {
      xpByUser.set(row.user_id, (xpByUser.get(row.user_id) ?? 0) + (row.xp_earned ?? 0));
    }

    // Sort descending and take top 20
    const sorted = [...xpByUser.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    if (sorted.length === 0) return { success: true, entries: [], weekStart: weekStartISO };

    const userIds = sorted.map(([uid]) => uid);
    const profileMap = await buildDisplayNameMap(supabase, userIds);

    // Fetch streak + level from user_progress for display
    const { data: progressRows } = await supabase
      .from("user_progress")
      .select("user_id, streak, current_level")
      .in("user_id", userIds);

    const progressMap = new Map(
      (progressRows ?? []).map((p) => [p.user_id, { streak: p.streak ?? 0, level: p.current_level ?? "A1" }])
    );

    const entries: LeaderboardEntry[] = sorted.map(([uid, weekXp], idx) => {
      const prog = progressMap.get(uid);
      return {
        rank: idx + 1,
        user_id: uid,
        display_name: profileMap.get(uid) ?? `Học viên ${uid.slice(0, 6)}`,
        total_xp: weekXp,
        streak: prog?.streak ?? 0,
        current_level: prog?.level ?? "A1",
        is_current_user: uid === user.id,
      };
    });

    return { success: true, entries, weekStart: weekStartISO };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: `Lỗi hệ thống: ${msg}` };
  }
}
