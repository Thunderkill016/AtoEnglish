/**
 * Product North Star — locked 2026-07-10.
 * Full rationale: LESSON_SYSTEM_FOUNDATION.md §0
 *
 * Core promise: learner reaches CEFR B1 (Independent User) —
 * the minimum threshold to *use* English independently, then self-extend.
 */

/** Primary outcome band the product optimizes for */
export const CORE_OUTCOME_CEFR = "B1" as const;

/** Human-readable promise (VI) — landing / onboarding / dashboard */
export const CORE_OUTCOME_PROMISE_VI =
  "Đạt B1 — đủ để dùng tiếng Anh độc lập trong đời sống và công việc cơ bản.";

export const CORE_OUTCOME_PROMISE_EN =
  "Reach B1 — independent English for everyday life and basic work.";

/**
 * Curriculum path that delivers the core outcome.
 * After this, B2 + business are extensions (self-development), not the MVP bar.
 */
export const CORE_PATH = {
  /** Inclusive unit ids from constants/units order */
  startUnitId: "unit-a0-1",
  /** Last unit of B1 band — completing this = curriculum path to B1 */
  endUnitId: "unit-32",
  bands: ["A0", "A1", "A2", "B1"] as const,
  /** Approximate unit counts (must match units.ts) */
  unitCounts: { A0: 8, A1: 12, A2: 6, B1: 14 } as const,
  totalCoreUnits: 40,
} as const;

/** Extension after B1 — optional depth, not required for “dùng được” */
export const EXTENSION_PATH = {
  bands: ["B2"] as const,
  startUnitId: "unit-33",
  endUnitId: "unit-42",
  includesBusinessTrack: true,
} as const;

/** Mid checkpoint before full B1 */
export const SURVIVAL_CHECKPOINT_CEFR = "A2" as const;

export type CoreOutcomeCefr = typeof CORE_OUTCOME_CEFR;
