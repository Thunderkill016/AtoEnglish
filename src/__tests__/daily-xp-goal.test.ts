import { describe, it, expect } from "vitest";

import {
  DEFAULT_DAILY_XP_GOAL,
  goalFromOnboardingTime,
  isValidDailyXpGoal,
  resolveDailyXpGoal,
} from "@/lib/constants/daily-xp-goal";

describe("daily-xp-goal", () => {
  it("validates allowed goal range", () => {
    expect(isValidDailyXpGoal(5)).toBe(true);
    expect(isValidDailyXpGoal(50)).toBe(true);
    expect(isValidDailyXpGoal(200)).toBe(true);
    expect(isValidDailyXpGoal(4)).toBe(false);
    expect(isValidDailyXpGoal(201)).toBe(false);
    expect(isValidDailyXpGoal(50.5)).toBe(false);
  });

  it("resolves missing goals to default", () => {
    expect(resolveDailyXpGoal(null)).toBe(DEFAULT_DAILY_XP_GOAL);
    expect(resolveDailyXpGoal(undefined)).toBe(DEFAULT_DAILY_XP_GOAL);
    expect(resolveDailyXpGoal(80)).toBe(80);
    expect(resolveDailyXpGoal(999)).toBe(DEFAULT_DAILY_XP_GOAL);
  });

  it("maps onboarding time to XP goals", () => {
    expect(goalFromOnboardingTime("5min")).toBe(20);
    expect(goalFromOnboardingTime("15min")).toBe(50);
    expect(goalFromOnboardingTime("30min")).toBe(100);
    expect(goalFromOnboardingTime("60min")).toBe(200);
    expect(goalFromOnboardingTime(undefined)).toBe(DEFAULT_DAILY_XP_GOAL);
  });
});