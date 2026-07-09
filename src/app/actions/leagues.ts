"use server";

import { createClient } from "@/lib/supabase/server";
import { createRateLimiter } from "@/lib/security/rate-limit";
import { checkActionRateLimit } from "@/lib/security/action-guard";
import { LeagueXpSchema } from "@/lib/security/validation";
import type { LeagueTier, LeagueData, LeagueMember } from "@/lib/leagues";

// Re-export types so consumers can import from either this file or @/lib/leagues
export type { LeagueTier, LeagueData, LeagueMember } from "@/lib/leagues";

const leagueLimiter = createRateLimiter(30, 60_000, "league");

/**
 * getMyLeague — fetch (or create) the current user's weekly league.
 * Uses the assign_league_for_user() DB function for idempotent assignment.
 * Rate-limited: RPC can write membership rows.
 */
export async function getMyLeague(): Promise<
  { success: true; data: LeagueData } | { success: false; error: string }
> {
  try {
    const rateErr = await checkActionRateLimit(leagueLimiter);
    if (rateErr) return { success: false, error: rateErr };

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "Not authenticated" };

    // Ensure user is assigned to a league this week (idempotent)
    const { error: assignError } = await supabase.rpc("assign_league_for_user", {
      p_user_id: user.id,
    });
    if (assignError) return { success: false, error: assignError.message };

    // Get current week Monday
    const weekStart = getWeekMonday();

    // Fetch user's league_id for this week
    const { data: membership, error: mErr } = await supabase
      .from("league_memberships")
      .select("league_id, xp_this_week, leagues!inner(tier, week_start)")
      .eq("user_id", user.id)
      .eq("leagues.week_start", weekStart)
      .single();

    if (mErr || !membership) return { success: false, error: "No league found" };

    const leagueRow = membership.leagues as unknown as { tier: LeagueTier; week_start: string };
    const leagueId = membership.league_id;

    // Fetch all members of this league with their profile names
    const { data: members, error: membersErr } = await supabase
      .from("league_memberships")
      .select("user_id, xp_this_week")
      .eq("league_id", leagueId)
      .order("xp_this_week", { ascending: false });

    if (membersErr || !members) return { success: false, error: "Failed to load members" };

    // Fetch display names from the `users` public table (has display_name + email)
    const userIds = members.map((m) => m.user_id);
    const { data: profiles } = await supabase
      .from("users")
      .select("id, display_name, email")
      .in("id", userIds);

    const nameMap: Record<string, string> = {};
    (profiles ?? []).forEach((p) => {
      nameMap[p.id] = p.display_name ?? p.email.split("@")[0] ?? "Người học";
    });

    // Build ranked member list
    const rankedMembers: LeagueMember[] = members.map((m, i) => ({
      user_id: m.user_id,
      display_name: nameMap[m.user_id] ?? "Người học",
      xp_this_week: m.xp_this_week,
      rank: i + 1,
      isMe: m.user_id === user.id,
    }));

    const myEntry = rankedMembers.find((m) => m.isMe);
    const myRank = myEntry?.rank ?? rankedMembers.length;
    const myXp = membership.xp_this_week;
    const total = rankedMembers.length;

    // Days left in week (Mon=0 ... Sun=6 → Monday resets)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const daysLeft = dayOfWeek === 0 ? 1 : 8 - dayOfWeek; // days until next Monday

    return {
      success: true,
      data: {
        league_id: leagueId,
        tier: leagueRow.tier,
        week_start: leagueRow.week_start,
        members: rankedMembers,
        myXp,
        myRank,
        daysLeft,
        isPromotionZone: myRank <= 5,
        isRelegationZone: total >= 10 && myRank > total - 5,
      },
    };
  } catch {
    return { success: false, error: "Unknown error" };
  }
}

/**
 * updateLeagueXp — bump current user's xp_this_week by xpEarned.
 * Called after unit completion. Fire-and-forget from completeUnit().
 * Rate-limited: 30/min (unit completions are the trigger).
 */
export async function updateLeagueXp(xpEarned: number): Promise<void> {
  try {
    const parsed = LeagueXpSchema.safeParse({ xpEarned });
    if (!parsed.success) return;

    const rateErr = await checkActionRateLimit(leagueLimiter);
    if (rateErr) return;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.rpc("bump_league_xp", {
      p_user_id: user.id,
      p_xp_delta: Math.min(parsed.data.xpEarned, 500),
    });
  } catch { /* silent — league XP is non-critical */ }
}

// Helper: return current week's Monday as ISO date string
function getWeekMonday(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  return monday.toISOString().split("T")[0];
}
