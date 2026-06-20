"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

// Use auto-generated types — no more `as any` casts
type FlashcardProgressRow =
  Database["public"]["Tables"]["user_flashcard_progress"]["Row"];
type FlashcardProgressInsert =
  Database["public"]["Tables"]["user_flashcard_progress"]["Insert"];

export type FlashcardStats = Pick<
  FlashcardProgressRow,
  | "cards_reviewed_today"
  | "total_cards_reviewed"
  | "total_sessions"
  | "streak_days"
  | "best_streak"
  | "last_session_at"
>;

const EMPTY_STATS: FlashcardStats = {
  cards_reviewed_today: 0,
  total_cards_reviewed: 0,
  total_sessions: 0,
  streak_days: 0,
  best_streak: 0,
  last_session_at: null,
};

/**
 * Lấy thống kê flashcard của user hiện tại.
 * Trả về zeros nếu chưa có record.
 */
export async function getFlashcardStats(): Promise<{
  success: boolean;
  stats?: FlashcardStats;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthenticated" };

  const { data, error } = await supabase
    .from("user_flashcard_progress")
    .select(
      "cards_reviewed_today, total_cards_reviewed, total_sessions, streak_days, best_streak, last_session_at"
    )
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return { success: false, error: error.message };
  if (!data) return { success: true, stats: EMPTY_STATS };

  return { success: true, stats: data };
}

/**
 * Ghi nhận 1 session flashcard hoàn thành.
 * Tự động tính streak (liên tiếp ngày, reset nếu bỏ ngày).
 */
export async function recordFlashcardSession(
  cardsReviewed: number
): Promise<{ success: boolean; stats?: FlashcardStats; error?: string }> {
  if (cardsReviewed <= 0) return { success: false, error: "No cards reviewed" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthenticated" };

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const yesterday = new Date(Date.now() - 86_400_000)
    .toISOString()
    .slice(0, 10);

  // Fetch existing row
  const { data: existing } = await supabase
    .from("user_flashcard_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const lastDate = existing?.last_session_date ?? null;

  // Streak logic
  let newStreak: number;
  if (!lastDate || !existing) {
    newStreak = 1; // First session ever
  } else if (lastDate === today) {
    newStreak = existing.streak_days; // Same day — keep streak
  } else if (lastDate === yesterday) {
    newStreak = existing.streak_days + 1; // Consecutive day
  } else {
    newStreak = 1; // Gap > 1 day — reset
  }

  const isNewDay = lastDate !== today;

  const upsertData: FlashcardProgressInsert = {
    user_id: user.id,
    cards_reviewed_today: isNewDay
      ? cardsReviewed
      : (existing?.cards_reviewed_today ?? 0) + cardsReviewed,
    total_cards_reviewed: (existing?.total_cards_reviewed ?? 0) + cardsReviewed,
    total_sessions: (existing?.total_sessions ?? 0) + 1,
    streak_days: newStreak,
    best_streak: Math.max(newStreak, existing?.best_streak ?? 0),
    last_session_date: today,
    last_session_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("user_flashcard_progress")
    .upsert(upsertData, { onConflict: "user_id" })
    .select(
      "cards_reviewed_today, total_cards_reviewed, total_sessions, streak_days, best_streak, last_session_at"
    )
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, stats: data };
}
