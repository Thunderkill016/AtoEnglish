/**
 * Guest / offline FSRS deck in localStorage (TASK-314).
 * Pure merge helpers + browser load/save. No schema change.
 */

import type { SeedLexisItem } from "@/lib/v2/seed-lexis";
import { reviewCardFSRS } from "@/lib/srs/fsrs";
import type { Card } from "@/types/database";

export const LOCAL_CARDS_KEY = "ato_local_cards";
export const LOCAL_CARDS_EVENT = "ato-local-cards";

export interface LocalCard {
  id: string;
  word: string;
  phonetic: string | null;
  meaning_vn: string;
  example_en: string | null;
  topic: string;
  level: string;
  interval: number;
  repetitions: number;
  due_date: string;
  state: number;
  difficulty: number;
  stability: number;
  last_review: string | null;
  next_review: string | null;
  source?: "lexis" | "phrase";
  created_at: string;
  updated_at: string;
}

export interface LocalCardsState {
  cards: LocalCard[];
  updatedAt?: string;
}

function emptyState(): LocalCardsState {
  return { cards: [] };
}

/** Stable id for a word (no crypto needed). */
export function localCardId(word: string): string {
  const key = word.toLowerCase().trim().replace(/\s+/g, "-").slice(0, 80);
  return `local-${key}`;
}

function emitChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(LOCAL_CARDS_EVENT));
}

/**
 * Pure: merge seed items into existing deck (skip duplicates by lowercased word).
 * New cards are due now (state=0) so they appear in flashcards immediately.
 */
export function mergeSeedIntoLocalCards(
  existing: readonly LocalCard[],
  seed: readonly SeedLexisItem[],
  meta: { lessonId: string; level: string; now?: string },
): { cards: LocalCard[]; added: number } {
  const now = meta.now ?? new Date().toISOString();
  const byWord = new Map<string, LocalCard>();
  for (const c of existing) {
    byWord.set(c.word.toLowerCase().trim(), c);
  }

  let added = 0;
  for (const item of seed) {
    const word = item.word.trim();
    if (!word) continue;
    const key = word.toLowerCase();
    if (byWord.has(key)) continue;

    const card: LocalCard = {
      id: localCardId(word),
      word: key,
      phonetic: item.phonetic,
      meaning_vn: item.meaning_vn,
      example_en: item.example_en,
      topic: meta.lessonId,
      level: meta.level,
      interval: 0,
      repetitions: 0,
      due_date: now,
      state: 0,
      difficulty: 0,
      stability: 0,
      last_review: null,
      next_review: now,
      source: item.source,
      created_at: now,
      updated_at: now,
    };
    byWord.set(key, card);
    added += 1;
  }

  return { cards: Array.from(byWord.values()), added };
}

/** Cards due for review (due_date <= now). */
export function getDueLocalCardsFrom(
  cards: readonly LocalCard[],
  nowIso: string = new Date().toISOString(),
): LocalCard[] {
  const now = new Date(nowIso).getTime();
  return cards
    .filter((c) => {
      const due = new Date(c.due_date).getTime();
      return !Number.isNaN(due) && due <= now;
    })
    .sort(
      (a, b) =>
        new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
    );
}

/**
 * Pure FSRS review on a local card (maps to Db Card shape for reviewCardFSRS).
 */
export function reviewLocalCardPure(
  card: LocalCard,
  rating: "Again" | "Hard" | "Good" | "Easy",
  nowIso: string = new Date().toISOString(),
): LocalCard {
  const dbLike: Card = {
    id: card.id,
    user_id: "local",
    word: card.word,
    phonetic: card.phonetic,
    meaning_vn: card.meaning_vn,
    example_en: card.example_en,
    topic: card.topic,
    level: card.level,
    interval: card.interval,
    due_date: card.due_date,
    repetitions: card.repetitions,
    created_at: card.created_at,
    updated_at: card.updated_at,
    state: card.state,
    difficulty: card.difficulty,
    stability: card.stability,
    last_review: card.last_review,
    next_review: card.next_review,
  };

  const result = reviewCardFSRS(dbLike, rating);
  const nextDue = result.next_review ?? result.due_date ?? nowIso;

  return {
    ...card,
    state: result.state,
    difficulty: result.difficulty,
    stability: result.stability,
    last_review: result.last_review,
    next_review: result.next_review,
    interval: result.interval,
    repetitions: result.repetitions,
    due_date: rating === "Again" ? nowIso : nextDue,
    updated_at: nowIso,
  };
}

export function loadLocalCards(): LocalCardsState {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(LOCAL_CARDS_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as LocalCardsState;
    if (!parsed || !Array.isArray(parsed.cards)) return emptyState();
    return { cards: parsed.cards, updatedAt: parsed.updatedAt };
  } catch {
    return emptyState();
  }
}

export function saveLocalCards(state: LocalCardsState): void {
  if (typeof window === "undefined") return;
  try {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(LOCAL_CARDS_KEY, JSON.stringify(state));
    emitChange();
  } catch {
    /* quota */
  }
}

/**
 * Seed lesson vocab into local deck. Returns how many new cards were added.
 * Browser-only; no-op on server.
 */
export function seedLessonToLocalCards(
  seed: readonly SeedLexisItem[],
  meta: { lessonId: string; level: string },
): number {
  if (typeof window === "undefined") return 0;
  if (seed.length === 0) return 0;
  const current = loadLocalCards();
  const { cards, added } = mergeSeedIntoLocalCards(current.cards, seed, meta);
  if (added > 0) {
    saveLocalCards({ cards });
  }
  return added;
}

export function getDueLocalCards(): LocalCard[] {
  return getDueLocalCardsFrom(loadLocalCards().cards);
}

export function getAllLocalCards(): LocalCard[] {
  return loadLocalCards().cards;
}

/**
 * Apply FSRS rating to a local card by id; persist.
 */
export function reviewLocalCard(
  cardId: string,
  rating: "Again" | "Hard" | "Good" | "Easy",
): { success: boolean; card?: LocalCard } {
  if (typeof window === "undefined") return { success: false };
  const state = loadLocalCards();
  const idx = state.cards.findIndex((c) => c.id === cardId);
  if (idx < 0) return { success: false };

  const updated = reviewLocalCardPure(state.cards[idx], rating);
  const next = [...state.cards];
  next[idx] = updated;
  saveLocalCards({ cards: next });
  return { success: true, card: updated };
}
