"use client";

import { useCallback } from "react";

export interface MilestoneState {
  pendingMilestone: number | null;
  showOverlay: boolean;
  dismissMilestone: () => Promise<void>;
  checkMilestone: (streak: number) => void;
  isAwarding: boolean;
}

/**
 * Compatibility hook only.
 * Streak milestone celebrations and rewards are outside the active product scope.
 * Keep the return shape until the large lesson orchestrator drops its legacy wiring.
 */
export function useStreakMilestone(): MilestoneState {
  const dismissMilestone = useCallback(async () => {}, []);
  const checkMilestone = useCallback((_streak: number) => {}, []);

  return {
    pendingMilestone: null,
    showOverlay: false,
    dismissMilestone,
    checkMilestone,
    isAwarding: false,
  };
}
