import { describe, it, expect } from "vitest";
import { reviewCardFSRS, mapDbCardToFSRSCard } from "@/lib/srs/fsrs";
import { State } from "ts-fsrs";
import type { Card } from "@/types/database";

// Minimal mock card for testing
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
    ease_factor: 2.5,
    due_date: new Date().toISOString(),
    last_review: null,
    next_review: null,
    last_reviewed: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  } as Card;
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

  it("returns a ReviewLog with correct shape", () => {
    const card = makeCard();
    const result = reviewCardFSRS(card, "Good");

    expect(result.reviewLog).toBeDefined();
    expect(result.reviewLog.rating).toBeTypeOf("number");
    expect(result.reviewLog.state).toBeTypeOf("number");
    // New card in learning step — scheduled_days is 0 until promoted to Review
    expect(result.reviewLog.scheduled_days).toBeGreaterThanOrEqual(0);
    expect(result.reviewLog.review).toBeTruthy();
    expect(result.reviewLog.due).toBeTruthy();
  });

  it("'Again' rating results in short interval (relearning)", () => {
    const card = makeCard({ state: State.Review, stability: 5, difficulty: 3 });
    const result = reviewCardFSRS(card, "Again");
    // Relearning should have short interval
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
    });
  });
});

describe("mapDbCardToFSRSCard", () => {
  it("maps a new card correctly", () => {
    const dbCard = makeCard();
    const fsrsCard = mapDbCardToFSRSCard(dbCard);
    expect(fsrsCard.reps).toBe(0);
    expect(fsrsCard.state).toBe(State.New);
    expect(fsrsCard.stability).toBe(0);
  });

  it("sets elapsed_days to 0 for new cards", () => {
    const dbCard = makeCard();
    const fsrsCard = mapDbCardToFSRSCard(dbCard);
    expect(fsrsCard.elapsed_days).toBe(0);
  });
});
