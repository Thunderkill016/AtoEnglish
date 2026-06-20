import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/**
 * Cached Supabase queries for Server Components.
 * React.cache() deduplicates calls within the same request — prevents
 * multiple Server Components from triggering duplicate DB queries.
 *
 * Usage: import { getCachedUserProgress } from "@/lib/queries/user"
 * These are SERVER-ONLY — do not import in Client Components.
 */

/**
 * Fetch user_progress row — cached per request.
 * Safe to call from layout.tsx AND page.tsx without duplicate DB hits.
 */
export const getCachedUserProgress = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_progress")
    .select("current_level, streak, total_xp, last_active_date, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
});

/**
 * Fetch completed unit IDs for the user — cached per request.
 */
export const getCachedCompletedUnits = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_lesson_progress")
    .select("unit_id")
    .eq("user_id", userId);
  return data?.map((r) => r.unit_id) ?? [];
});

/**
 * Fetch current user — cached per request.
 * Avoids repeated auth.getUser() calls across Server Components.
 */
export const getCachedUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Fetch flashcard stats — cached per request.
 */
export const getCachedFlashcardStats = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("user_flashcard_progress")
    .select(
      "cards_reviewed_today, streak_days, best_streak, total_cards_reviewed"
    )
    .eq("user_id", userId)
    .maybeSingle();
  return data;
});
