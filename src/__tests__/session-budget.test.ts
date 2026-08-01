import { describe, expect, it } from "vitest";

import {
  LEARNING_SESSION_BUDGETS,
  formatLearningSessionDuration,
  resolveLearningSessionBudget,
} from "@/lib/lessons/session-budget";
import { GOLD_MISSION_01 } from "@/lib/missions/gold-mission-01";

describe("learning session budgets", () => {
  it("keeps the standard session bounded to one can-do and six chunks", () => {
    const budget = resolveLearningSessionBudget(GOLD_MISSION_01, "standard");

    expect(budget).toMatchObject({
      minimumMinutes: 12,
      maximumMinutes: 15,
      newCanDoLimit: 1,
      targetChunkCount: 6,
      feedbackCount: 2,
      completesLesson: true,
    });
    expect(formatLearningSessionDuration(budget)).toBe("12–15 phút");
  });

  it("keeps the busy-day session review-only", () => {
    const budget = resolveLearningSessionBudget(GOLD_MISSION_01, "busy");

    expect(budget).toMatchObject({
      minimumMinutes: 3,
      maximumMinutes: 5,
      newCanDoLimit: 0,
      targetChunkCount: 3,
      feedbackCount: 0,
      completesLesson: false,
    });
    expect(formatLearningSessionDuration(budget)).toBe("3–5 phút");
  });

  it("locks the product-wide content limits", () => {
    expect(LEARNING_SESSION_BUDGETS.standard.targetChunkLimit).toBeLessThanOrEqual(
      6,
    );
    expect(LEARNING_SESSION_BUDGETS.standard.feedbackLimit).toBeLessThanOrEqual(
      2,
    );
    expect(LEARNING_SESSION_BUDGETS.busy.newCanDoLimit).toBe(0);
    expect(LEARNING_SESSION_BUDGETS.busy.completesLesson).toBe(false);
  });
});
