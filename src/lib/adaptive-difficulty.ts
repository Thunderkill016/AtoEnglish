/**
 * S3-3: Adaptive Difficulty Signal
 *
 * Tracks per-exercise-type error rates across sessions (localStorage).
 * Surfaces a hint to the lesson UI: when a type has >50% errors, show an
 * extra encouragement tip and optionally feed back to PracticeSection ordering.
 *
 * Data shape (stored per unitId):
 *   ato_difficulty_<unitId> = {
 *     matching: { attempts: 5, errors: 2 },
 *     scramble: { attempts: 3, errors: 3 },
 *     wordbank: { attempts: 2, errors: 0 },
 *     correction: { attempts: 1, errors: 0 },
 *     quiz:     { attempts: 8, errors: 1 },
 *   }
 */

export type ExerciseType = "matching" | "scramble" | "wordbank" | "correction" | "dictation" | "quiz";

interface TypeStat { attempts: number; errors: number }
type DifficultyStore = Partial<Record<ExerciseType, TypeStat>>;

const KEY = (unitId: string) => `ato_difficulty_${unitId}`;

function load(unitId: string): DifficultyStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY(unitId));
    return raw ? (JSON.parse(raw) as DifficultyStore) : {};
  } catch { return {}; }
}

function save(unitId: string, store: DifficultyStore): void {
  try { localStorage.setItem(KEY(unitId), JSON.stringify(store)); } catch { /* ignore */ }
}

/** Record one attempt for a given exercise type in this unit. */
export function recordAttempt(unitId: string, type: ExerciseType, correct: boolean): void {
  const store = load(unitId);
  const prev = store[type] ?? { attempts: 0, errors: 0 };
  store[type] = {
    attempts: prev.attempts + 1,
    errors: prev.errors + (correct ? 0 : 1),
  };
  save(unitId, store);
}

/** Return error rate (0–1) for a type.  Returns 0 if no data. */
export function errorRate(unitId: string, type: ExerciseType): number {
  const store = load(unitId);
  const stat = store[type];
  if (!stat || stat.attempts === 0) return 0;
  return stat.errors / stat.attempts;
}

/**
 * Returns exercise types the user struggles with (error rate > 0.5, ≥3 attempts).
 * Used by the UI to show a targeted encouragement tip.
 */
export function getWeakTypes(unitId: string): ExerciseType[] {
  const store = load(unitId);
  return (Object.entries(store) as [ExerciseType, TypeStat][])
    .filter(([, stat]) => stat.attempts >= 3 && stat.errors / stat.attempts > 0.5)
    .map(([type]) => type);
}

/** Human-readable label for each exercise type (Vietnamese) */
export const TYPE_LABELS: Record<ExerciseType, string> = {
  matching:   "Nối từ",
  scramble:   "Sắp xếp câu",
  wordbank:   "Xây dựng câu",
  correction: "Tìm lỗi sai",
  dictation:  "Chính tả",
  quiz:       "Trắc nghiệm",
};
