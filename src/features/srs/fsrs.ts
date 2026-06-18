/**
 * FSRS-lite — simplified Free Spaced Repetition Scheduler
 * Maps to cards table fields: interval, ease_factor, repetitions, due_date
 *
 * Ratings (aligned with FSRS / Anki convention):
 *   1 = Again  — forgot completely
 *   2 = Hard   — recalled with difficulty
 *   3 = Good   — recalled correctly
 *   4 = Easy   — recalled effortlessly
 */

export type ReviewRating = 1 | 2 | 3 | 4;

export const REVIEW_RATINGS = {
  AGAIN: 1,
  HARD: 2,
  GOOD: 3,
  EASY: 4,
} as const satisfies Record<string, ReviewRating>;

export const FSRS_DEFAULTS = {
  interval: 0,
  ease_factor: 2.5,
  repetitions: 0,
  min_ease_factor: 1.3,
  max_ease_factor: 3.0,
} as const;

export type SRSState = {
  interval: number;
  ease_factor: number;
  repetitions: number;
  due_date: string;
  last_reviewed: string | null;
};

export type SRSReviewResult = SRSState & {
  reviewed_at: string;
};

function clampEase(ease: number): number {
  return Math.min(
    FSRS_DEFAULTS.max_ease_factor,
    Math.max(FSRS_DEFAULTS.min_ease_factor, ease)
  );
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function roundInterval(days: number): number {
  return Math.max(1, Math.round(days));
}

/**
 * Calculate next SRS state after a review.
 * Pure function — no DB side effects.
 */
export function calculateNextReview(
  current: Pick<SRSState, "interval" | "ease_factor" | "repetitions">,
  rating: ReviewRating,
  reviewedAt: Date = new Date()
): SRSReviewResult {
  let { interval, ease_factor, repetitions } = current;

  switch (rating) {
    case REVIEW_RATINGS.AGAIN:
      repetitions = 0;
      interval = 1;
      ease_factor = clampEase(ease_factor - 0.2);
      break;

    case REVIEW_RATINGS.HARD:
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else {
        interval = roundInterval(interval * 1.2);
      }
      ease_factor = clampEase(ease_factor - 0.15);
      break;

    case REVIEW_RATINGS.GOOD:
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1;
      } else if (repetitions === 2) {
        interval = 6;
      } else {
        interval = roundInterval(interval * ease_factor);
      }
      break;

    case REVIEW_RATINGS.EASY:
      repetitions += 1;
      ease_factor = clampEase(ease_factor + 0.15);
      if (repetitions === 1) {
        interval = 4;
      } else {
        interval = roundInterval(interval * ease_factor * 1.3);
      }
      break;
  }

  return {
    interval,
    ease_factor: Number(ease_factor.toFixed(2)),
    repetitions,
    due_date: addDays(reviewedAt, interval).toISOString(),
    last_reviewed: reviewedAt.toISOString(),
    reviewed_at: reviewedAt.toISOString(),
  };
}

/** Returns true if the card is due for review. */
export function isCardDue(dueDate: string, now: Date = new Date()): boolean {
  return new Date(dueDate) <= now;
}

/** Initial SRS state for a newly created card. */
export function createInitialSRSState(createdAt: Date = new Date()): SRSState {
  return {
    interval: FSRS_DEFAULTS.interval,
    ease_factor: FSRS_DEFAULTS.ease_factor,
    repetitions: FSRS_DEFAULTS.repetitions,
    due_date: createdAt.toISOString(),
    last_reviewed: null,
  };
}