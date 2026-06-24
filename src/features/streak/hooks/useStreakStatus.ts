"use client";

import { useMemo } from "react";
import { computeStreakStatus, type StreakState } from "../utils/streakCalculator";

interface UseStreakStatusProps {
  streak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  freezeCount: number;
}

/**
 * Derives the current streak status from DB data.
 * Memoized — only recomputes when inputs change.
 */
export function useStreakStatus(props: UseStreakStatusProps): StreakState {
  return useMemo(
    () =>
      computeStreakStatus({
        streak: props.streak,
        bestStreak: props.bestStreak,
        lastActiveDate: props.lastActiveDate,
        freezeCount: props.freezeCount,
      }),
    [props.streak, props.bestStreak, props.lastActiveDate, props.freezeCount]
  );
}
