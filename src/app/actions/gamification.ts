"use server";

/**
 * Frozen compatibility actions for retired gamification features.
 *
 * The active product scope no longer includes streak-freeze mechanics,
 * achievements, achievement XP rewards, or gamification progress surfaces.
 * These exports remain only so legacy importers do not break while the
 * surrounding dashboard/runtime wiring is removed incrementally.
 *
 * Do not add new DB reads/writes or product behavior here.
 */

export async function useStreakFreeze() {
  return {
    success: false as const,
    error: "Streak Freeze đã được đóng khỏi phạm vi sản phẩm hiện tại.",
    freezesRemaining: 0,
    streak: 0,
  };
}

export async function getAchievements() {
  return {
    success: true as const,
    achievements: [],
    unlockedIds: [],
  };
}

export async function checkAndAwardAchievements(
  _category: "streak" | "xp" | "lesson" | "speaking" | "flashcard" | "special",
  _value: number,
  _specialId?: string
): Promise<{ newlyUnlocked: string[] }> {
  return { newlyUnlocked: [] };
}

export async function getStreakInfo() {
  return {
    success: true as const,
    streak: 0,
    freezeCount: 0,
    bestStreak: 0,
  };
}
