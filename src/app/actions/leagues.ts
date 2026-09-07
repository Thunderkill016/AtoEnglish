"use server";

/** Compatibility no-op until the large unit completion orchestrator drops its legacy call. */
export async function updateLeagueXp(_xpEarned: number): Promise<void> {
  return;
}
