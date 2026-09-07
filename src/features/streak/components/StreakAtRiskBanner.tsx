"use client";

import type { StreakState } from "../utils/streakCalculator";

interface StreakAtRiskBannerProps {
  state: StreakState;
  onActivateFreeze?: () => void;
  onDismiss: () => void;
}

/**
 * Compatibility shell for retired streak-pressure UI.
 * Loss-aversion banners and freeze prompts are outside the active learning scope.
 */
export default function StreakAtRiskBanner(_props: StreakAtRiskBannerProps) {
  return null;
}

/** Retired inline streak-pressure variant. */
export function StreakAtRiskInline(
  _props: Pick<StreakAtRiskBannerProps, "state" | "onActivateFreeze">
) {
  return null;
}
