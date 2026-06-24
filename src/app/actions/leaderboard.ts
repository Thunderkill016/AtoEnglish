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

/**
 * getLeaderboard — fetches top 20 users by total XP.
 * Joins user_progress with profiles for display names.
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

    // Fetch top 20 by total_xp, join with profiles for display_name
    const { data, error } = await supabase
      .from("user_progress")
      .select("user_id, total_xp, streak, current_level")
      .order("total_xp", { ascending: false })
      .limit(20);

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: true, entries: [] };
    }

    // Fetch display names for all user IDs from the users table
    const userIds = data.map((row) => row.user_id);
    const { data: userRows } = await supabase
      .from("users")
      .select("id, display_name, email")
      .in("id", userIds);

    const profileMap = new Map(
      (userRows ?? []).map((u: UserRow) => [
        u.id,
        u.display_name ?? u.email?.split("@")[0] ?? "Ẩn danh",
      ])
    );

    const entries: LeaderboardEntry[] = data.map((row, idx) => ({
      rank: idx + 1,
      user_id: row.user_id,
      display_name:
        profileMap.get(row.user_id) ??
        `Học viên ${row.user_id.slice(0, 6)}`,
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
