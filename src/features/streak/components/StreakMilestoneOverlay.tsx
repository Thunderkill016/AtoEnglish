"use client";

interface StreakMilestoneOverlayProps {
  state: unknown;
  onDismiss: () => void;
}

/**
 * Compatibility shell only.
 * Streak milestone celebrations and reward overlays are outside the active
 * product scope. Keep this null-rendering boundary until UnitTemplate drops
 * its legacy import.
 */
export default function StreakMilestoneOverlay({
  state,
  onDismiss,
}: StreakMilestoneOverlayProps) {
  void state;
  void onDismiss;
  return null;
}
