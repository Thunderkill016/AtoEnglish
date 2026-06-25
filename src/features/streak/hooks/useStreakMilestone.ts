"use client";

import { useState, useCallback } from "react";
import { STREAK_MILESTONES, MILESTONE_REWARDS } from "../utils/streakCalculator";
import { awardMilestoneReward } from "@/app/actions/streak";

export interface MilestoneState {
  /** Milestone days that are ready to celebrate */
  pendingMilestone: number | null;
  /** Whether celebration overlay is visible */
  showOverlay: boolean;
  /** Dismiss and award milestone */
  dismissMilestone: () => Promise<void>;
  /** Check if a given streak count hits a milestone (call after lesson complete) */
  checkMilestone: (streak: number) => void;
  /** Whether a reward is being awarded */
  isAwarding: boolean;
}

const CELEBRATED_KEY = "celebrated-milestones";

function getCelebrated(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(CELEBRATED_KEY);
    return raw ? new Set(JSON.parse(raw) as number[]) : new Set();
  } catch {
    return new Set();
  }
}

function markCelebrated(milestone: number): void {
  try {
    const celebrated = getCelebrated();
    celebrated.add(milestone);
    localStorage.setItem(CELEBRATED_KEY, JSON.stringify([...celebrated]));
  } catch { /* ignore */ }
}

/**
 * useStreakMilestone — Phase B hook from research doc Part 6.
 *
 * Checks whether a lesson completion triggers a milestone celebration.
 * Persists celebration state in localStorage to prevent re-showing.
 * On dismiss: calls awardMilestoneReward() server action to grant XP+freeze.
 *
 * Usage: call checkMilestone(currentStreak) after every lesson completion.
 */
export function useStreakMilestone(): MilestoneState {
  const [pendingMilestone, setPendingMilestone] = useState<number | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isAwarding, setIsAwarding] = useState(false);

  const checkMilestone = useCallback((streak: number) => {
    const milestone = (STREAK_MILESTONES as readonly number[]).find(m => m === streak);
    if (!milestone) return;

    const celebrated = getCelebrated();
    if (celebrated.has(milestone)) return; // Already shown

    setPendingMilestone(milestone);
    setShowOverlay(true);
  }, []);

  const dismissMilestone = useCallback(async () => {
    if (!pendingMilestone) return;
    setIsAwarding(true);

    // Mark as celebrated locally first (optimistic)
    markCelebrated(pendingMilestone);

    // Award on server
    try {
      await awardMilestoneReward(pendingMilestone);
    } catch { /* server action handles errors gracefully */ }

    setIsAwarding(false);
    setShowOverlay(false);
    setPendingMilestone(null);
  }, [pendingMilestone]);

  return {
    pendingMilestone,
    showOverlay,
    dismissMilestone,
    checkMilestone,
    isAwarding,
  };
}

/** Get reward config for a given milestone day */
export function getMilestoneReward(milestone: number) {
  return MILESTONE_REWARDS[milestone] ?? null;
}
