"use server";

import { createClient } from "@/lib/supabase/server";

export interface FlashcardStats {
  cards_reviewed_today: number;
  total_cards_reviewed: number;
  total_sessions: number;
  streak_days: number;
  best_streak: number;
  last_session_at: string | null;
}

/**
 * Lấy thống kê flashcard của user hiện tại
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("user_flashcard_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return { success: false, error: error.message };

  // Chưa có record → return zeros
  if (!data) {
    return {
      success: true,
      stats: {
        cards_reviewed_today: 0,
        total_cards_reviewed: 0,
        total_sessions: 0,
        streak_days: 0,
        best_streak: 0,
        last_session_at: null,
      },
    };
  }

  return { success: true, stats: data as FlashcardStats };
}

/**
 * Gọi sau khi hoàn thành 1 session flashcard
 * cardsReviewed: số thẻ đã ôn trong session vừa xong
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

  // Fetch existing record
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: existing } = await (supabase as any)
    .from("user_flashcard_progress")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle() as { data: (FlashcardStats & { last_session_date?: string }) | null };

  const lastDate = existing?.last_session_date ?? null;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  // Calculate streak
  let newStreak: number;
  if (!lastDate || !existing) {
    // First session ever
    newStreak = 1;
  } else if (lastDate === today) {
    // Already reviewed today — keep streak
    newStreak = existing.streak_days ?? 0;
  } else if (lastDate === yesterday) {
    // Reviewed yesterday — increment streak
    newStreak = (existing.streak_days ?? 0) + 1;
  } else {
    // Gap > 1 day — reset streak
    newStreak = 1;
  }

  const isNewDay = lastDate !== today;
  const newTotal = (existing?.total_cards_reviewed ?? 0) + cardsReviewed;
  const newToday = isNewDay ? cardsReviewed : (existing?.cards_reviewed_today ?? 0) + cardsReviewed;
  const newSessions = (existing?.total_sessions ?? 0) + 1;
  const newBest = Math.max(newStreak, existing?.best_streak ?? 0);

  const upsertData = {
    user_id: user.id,
    cards_reviewed_today: newToday,
    total_cards_reviewed: newTotal,
    total_sessions: newSessions,
    streak_days: newStreak,
    best_streak: newBest,
    last_session_date: today,
    last_session_at: new Date().toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("user_flashcard_progress")
    .upsert(upsertData, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, stats: data as FlashcardStats };
}
