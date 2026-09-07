"use server";

import type { LeagueData } from "@/lib/leagues";

/**
 * Compatibility boundary for retired league/leaderboard mechanics.
 *
 * Active product flows may still import these functions while their large
 * orchestrators are simplified independently. They intentionally perform no
 * database reads, assignments, ranking updates or XP mutations.
 */
export async function getMyLeague(): Promise<
  { success: true; data: LeagueData } | { success: false; error: string }
> {
  return { success: false, error: "League feature retired" };
}

/** Retired league XP side effect — intentionally a no-op. */
export async function updateLeagueXp(_xpEarned: number): Promise<void> {
  return;
}
