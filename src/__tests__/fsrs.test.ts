import { describe, it, expect } from "vitest";
import { reviewCardFSRS, mapDbCardToFSRSCard } from "@/lib/srs/fsrs";
import { State } from "ts-fsrs";
import type { Card } from "@/types/database";

// Minimal mock card for testing. Keep this aligned with the persisted FSRS state.
function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "test-uuid",
    user_id: "user-uuid",
    word: "hello",
    phonetic: null,
    meaning_vn: "xin chào",
    example_en: null,
    topic: null,
    level: "A1",
    state: State.New,
    difficulty: 0,
    stability: 0,
    interval: 0,
    repetitions: 0,
    due_date: new Date().toISOString(),
    last_review: null,
    next_review: null,
    elapsed_days: 0,
    scheduled_days: 0,
    lapses: 0,
    learning_steps: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

describe("reviewCardFSRS", () => {
  it("returns a valid result for 'Good' rating on a new card", () => {
    const card = makeCard();
    const result = reviewCardFSRS(card, "Good");

    expect(result.state).toBeDefined();
    expect(result.difficulty).toBeGreaterThan(0);
    expect(result.stability).toBeGreaterThan(0);
    // New cards enter learning step — scheduled_days may be 0 initially
    expect(result.interval).toBeGreaterThanOrEqual(0);
    expect(result.next_review).toBeTruthy();
    expect(result.last_review).toBeTruthy();
  });

  it("returns the native ReviewLog fields needed to rebuild history", () => {
    const card = makeCard();
    const result = reviewCardFSRS(card, "Good");

    expect(result.reviewLog.rating).toBeTypeOf("number");
    expect(result.reviewLog.state).toBeTypeOf("number");
    expect(result.reviewLog.elapsed_days).toBeGreaterThanOrEqual(0);
    expect(result.reviewLog.last_elapsed_days).toBeGreaterThanOrEqual(0);
    expect(result.reviewLog.scheduled_days).toBeGreaterThanOrEqual(0);
    expect(result.reviewLog.learning_steps).toBeGreaterThanOrEqual(0);
    expect(result.reviewLog.review).toBeTruthy();
    expect(result.reviewLog.due).toBeTruthy();
  });

  it("'Again' rating on a review card increments lapses", () => {
    const card = makeCard({
      state: State.Review,
      stability: 5,
      difficulty: 3,
      repetitions: 3,
      lapses: 2,
      last_review: new Date(Date.now() - 5 * 86_400_000).toISOString(),
    });
    const result = reviewCardFSRS(card, "Again");
    expect(result.lapses).toBe(3);
    // Relearning should stay short-term before promotion back to Review.
    expect(result.interval).toBeLessThanOrEqual(3);
  });

  it("'Easy' rating on new card gives longer interval than 'Good'", () => {
    const cardGood = makeCard();
    const cardEasy = makeCard();
    const good = reviewCardFSRS(cardGood, "Good");
    const easy = reviewCardFSRS(cardEasy, "Easy");
    expect(easy.interval).toBeGreaterThanOrEqual(good.interval);
  });

  it("next_review is in the future", () => {
    const card = makeCard();
    const result = reviewCardFSRS(card, "Good");
    const nextReview = new Date(result.next_review).getTime();
    expect(nextReview).toBeGreaterThan(Date.now() - 1000); // within 1s tolerance
  });

  it("debug object has expected shape", () => {
    const card = makeCard();
    const result = reviewCardFSRS(card, "Hard");
    expect(result.debug).toMatchObject({
      rating: "Hard",
      stateName: expect.any(String),
      stability: expect.any(Number),
      difficulty: expect.any(Number),
      interval: expect.any(Number),
      lapses: expect.any(Number),
      learningSteps: expect.any(Number),
    });
  });

  it("uses custom retentionRate when provided (lower retention yields longer intervals)", () => {
    const lastReview = new Date(Date.now() - 10 * 86_400_000).toISOString();
    const card = makeCard({
      state: State.Review,
      stability: 10,
      difficulty: 4,
      repetitions: 4,
      last_review: lastReview,
    });
    const resultLow = reviewCardFSRS(card, "Good", 0.8);
    const resultHigh = reviewCardFSRS(card, "Good", 0.95);
    expect(resultLow.interval).toBeGreaterThanOrEqual(resultHigh.interval);
  });
});

describe("mapDbCardToFSRSCard", () => {
  it("maps a new card correctly", () => {
    const dbCard = makeCard();
    const fsrsCard = mapDbCardToFSRSCard(dbCard);
    expect(fsrsCard.reps).toBe(0);
    expect(fsrsCard.state).toBe(State.New);
    expect(fsrsCard.stability).toBe(0);
    expect(fsrsCard.lapses).toBe(0);
    expect(fsrsCard.learning_steps).toBe(0);
  });

  it("preserves persisted FSRS history instead of reconstructing it from due dates", () => {
    const dbCard = makeCard({
      elapsed_days: 12,
      scheduled_days: 9,
      lapses: 3,
      learning_steps: 2,
      last_review: "2026-08-20T00:00:00.000Z",
      next_review: "2026-09-10T00:00:00.000Z",
    });
    const fsrsCard = mapDbCardToFSRSCard(dbCard);
    expect(fsrsCard.elapsed_days).toBe(12);
    expect(fsrsCard.scheduled_days).toBe(9);
    expect(fsrsCard.lapses).toBe(3);
    expect(fsrsCard.learning_steps).toBe(2);
  });
});
