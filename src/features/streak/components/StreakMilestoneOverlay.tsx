"use client";

import type { StreakState } from "../utils/streakCalculator";

interface StreakMilestoneOverlayProps {
  state: StreakState;
  onDismiss: () => void;
}

/**
 * Compatibility shell only.
 *
 * Streak milestone celebrations, reward overlays and confetti are outside the
 * active product surface. The component remains temporarily so the lesson
 * orchestrator can be simplified independently without a risky large-file edit.
 */
export default function StreakMilestoneOverlay({
  state,
  onDismiss,
}: StreakMilestoneOverlayProps) {
  void state;
  void onDismiss;
  return null;
}
