import type { SupabaseClient } from "@supabase/supabase-js";

import {
  calculateNextReview,
  createInitialSRSState,
  type ReviewRating,
} from "@/features/srs/fsrs";
import type {
  Card,
  CardInsert,
  CardUpdate,
  Database,
} from "@/types/database";

type TypedSupabaseClient = SupabaseClient<Database>;

export type CreateCardInput = Pick<
  CardInsert,
  "word" | "meaning_vn" | "phonetic" | "example_en" | "topic" | "level"
>;

export type ReviewCardResult = {
  card: Card;
  review: {
    rating: ReviewRating;
    reviewed_at: string;
  };
};

// ---------------------------------------------------------------------------
// Insert
// ---------------------------------------------------------------------------

export async function insertCard(
  supabase: TypedSupabaseClient,
  userId: string,
  input: CreateCardInput
): Promise<{ data: Card | null; error: Error | null }> {
  const srs = createInitialSRSState();

  const payload: CardInsert = {
    user_id: userId,
    word: input.word.trim(),
    meaning_vn: input.meaning_vn.trim(),
    phonetic: input.phonetic?.trim() ?? null,
    example_en: input.example_en?.trim() ?? null,
    topic: input.topic?.trim() ?? null,
    level: input.level ?? "A1",
    interval: srs.interval,
    ease_factor: srs.ease_factor,
    repetitions: srs.repetitions,
    due_date: srs.due_date,
    last_reviewed: srs.last_reviewed,
  };

  const { data, error } = await supabase
    .from("cards")
    .insert(payload)
    .select()
    .single();

  return { data, error: error ? new Error(error.message) : null };
}

// ---------------------------------------------------------------------------
// Update (manual fields, preserves SRS unless explicitly provided)
// ---------------------------------------------------------------------------

export async function updateCard(
  supabase: TypedSupabaseClient,
  cardId: string,
  userId: string,
  updates: CardUpdate
): Promise<{ data: Card | null; error: Error | null }> {
  const sanitized: CardUpdate = { ...updates };

  if (typeof sanitized.word === "string") sanitized.word = sanitized.word.trim();
  if (typeof sanitized.meaning_vn === "string") {
    sanitized.meaning_vn = sanitized.meaning_vn.trim();
  }

  const { data, error } = await supabase
    .from("cards")
    .update(sanitized)
    .eq("id", cardId)
    .eq("user_id", userId)
    .select()
    .single();

  return { data, error: error ? new Error(error.message) : null };
}

// ---------------------------------------------------------------------------
// Review — FSRS schedule update
// ---------------------------------------------------------------------------

export async function reviewCard(
  supabase: TypedSupabaseClient,
  cardId: string,
  userId: string,
  rating: ReviewRating
): Promise<{ data: ReviewCardResult | null; error: Error | null }> {
  const { data: existing, error: fetchError } = await supabase
    .from("cards")
    .select("*")
    .eq("id", cardId)
    .eq("user_id", userId)
    .single();

  if (fetchError || !existing) {
    return {
      data: null,
      error: new Error(fetchError?.message ?? "Card not found"),
    };
  }

  const next = calculateNextReview(
    {
      interval: existing.interval,
      ease_factor: existing.ease_factor,
      repetitions: existing.repetitions,
    },
    rating
  );

  const { data: updated, error: updateError } = await supabase
    .from("cards")
    .update({
      interval: next.interval,
      ease_factor: next.ease_factor,
      repetitions: next.repetitions,
      due_date: next.due_date,
      last_reviewed: next.last_reviewed,
    })
    .eq("id", cardId)
    .eq("user_id", userId)
    .select()
    .single();

  if (updateError || !updated) {
    return {
      data: null,
      error: new Error(updateError?.message ?? "Failed to update card"),
    };
  }

  return {
    data: {
      card: updated,
      review: { rating, reviewed_at: next.reviewed_at },
    },
    error: null,
  };
}

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

export async function getDueCards(
  supabase: TypedSupabaseClient,
  userId: string,
  limit = 20
): Promise<{ data: Card[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .lte("due_date", new Date().toISOString())
    .order("due_date", { ascending: true })
    .limit(limit);

  return { data: data ?? [], error: error ? new Error(error.message) : null };
}

export async function getCardsByTopic(
  supabase: TypedSupabaseClient,
  userId: string,
  topic: string
): Promise<{ data: Card[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("cards")
    .select("*")
    .eq("user_id", userId)
    .eq("topic", topic)
    .order("created_at", { ascending: false });

  return { data: data ?? [], error: error ? new Error(error.message) : null };
}

export async function deleteCard(
  supabase: TypedSupabaseClient,
  cardId: string,
  userId: string
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from("cards")
    .delete()
    .eq("id", cardId)
    .eq("user_id", userId);

  return { error: error ? new Error(error.message) : null };
}