import type { SupabaseClient } from "@supabase/supabase-js";

import { getVnDateKey, getVnYesterdayKey } from "@/lib/utils/vn-date";
import type { Database } from "@/types/supabase";

type ServerClient = SupabaseClient<Database>;

export type AwardXpResult = {
  totalXp: number;
  streak: number;
  lastActiveDate: string | null;
};

/**
 * Atomically award XP and update streak via Postgres RPC.
 * Pass xpAmount = 0 to sync streak/date only (flashcard-only days).
 */
export async function awardXpAndUpdateStreak(
  supabase: ServerClient,
  userId: string,
  xpAmount: number,
): Promise<AwardXpResult | null> {
  if (xpAmount < 0) return null;

  const { data, error } = await supabase.rpc("award_user_xp", {
    p_user_id: userId,
    p_xp_amount: xpAmount,
    p_today: getVnDateKey(),
    p_yesterday: getVnYesterdayKey(),
  });

  if (error) return null;

  const row = data?.[0];
  if (!row) return null;

  return {
    totalXp: row.total_xp,
    streak: row.streak,
    lastActiveDate: row.last_active_date,
  };
}