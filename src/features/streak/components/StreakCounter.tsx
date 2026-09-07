"use client";

import type { StreakState } from "../utils/streakCalculator";

interface StreakCounterProps {
  state: StreakState;
  compact?: boolean;
  onActivateFreeze?: () => void;
}

/**
 * Compatibility shell for retired streak gamification UI.
 * Streak pressure, milestone rewards, freeze inventory, and comeback prompts are outside the active learning scope.
 */
export default function StreakCounter(_props: StreakCounterProps) {
  return null;
}
