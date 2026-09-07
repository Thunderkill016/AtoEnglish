"use client";

import { useCallback } from "react";
import { MILESTONE_REWARDS } from "../utils/streakCalculator";

export interface MilestoneState {
  pendingMilestone: number | null;
  showOverlay: boolean;
  dismissMilestone: () => Promise<void>;
  checkMilestone: (streak: number) => void;
  isAwarding: boolean;
}

/**
 * Streak milestone celebrations are outside the active product surface.
 * Keep this no-op compatibility hook until callers are removed from the large
 * lesson orchestrator; do not add milestone rewards or engagement behavior here.
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

/** Compatibility lookup for legacy callers; not an active product surface. */
export function getMilestoneReward(milestone: number) {
  return MILESTONE_REWARDS[milestone] ?? null;
}
