"use server";

/**
 * Barrel re-export for backward compatibility.
 * `progress.ts` has been split into focused modules for maintainability.
 *
 * For new code, import directly from the specific module:
 *   @/app/actions/unit      — unit completion, SRS seeding, reset, getCurrentUnit
 *   @/app/actions/stats     — getUserProgress, weeklyXP, progressStats, dailyXpGoal
 *   @/app/actions/placement — savePlacementResult
 */
export * from "./unit";
export * from "./stats";
export * from "./placement";
