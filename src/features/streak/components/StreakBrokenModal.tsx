"use client";

import type { StreakState } from "../utils/streakCalculator";

interface StreakBrokenModalProps {
  state: StreakState;
  totalXp: number;
  onDismiss: () => void;
  onRepaired: () => void;
}

/**
 * Compatibility shell for the retired streak-repair mechanic.
 * XP spending and streak recovery prompts no longer belong to the active product scope.
 */
export default function StreakBrokenModal(_props: StreakBrokenModalProps) {
  return null;
}
