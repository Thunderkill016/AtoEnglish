'use client';

interface StreakShieldWidgetProps {
  currentStreak: number;
  freezeCount: number;
  onUseFreeze?: () => Promise<void>;
}

/**
 * Compatibility shell for the retired streak-shield mechanic.
 * Freeze inventory and protection actions are outside the active learning scope.
 */
export function StreakShieldWidget(_props: StreakShieldWidgetProps) {
  return null;
}
