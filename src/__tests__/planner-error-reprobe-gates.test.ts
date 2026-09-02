import { describe, expect, it } from "vitest";

import type { ErrorMemoryEntry } from "@/lib/learning/error-memory";
import { planSession, type PlannerCandidate } from "@/lib/learning/session-planner";

const sourceCandidate: PlannerCandidate = {
  id: "lesson-b:produce",
  targetId: "cap-b",
  evidenceType: "production",
  prerequisiteTargetIds: ["cap-a"],
  metadata: {
    lessonId: "lesson-b",
    lessonVersion: "1.0.0",
    actionId: "produce",
  },
};

const satisfiedRecurringError: ErrorMemoryEntry = {
  key: "cap-b|lesson-b|1.0.0|produce|missing-target-group:0",
  targetId: "cap-b",
  lessonId: "lesson-b",
  lessonVersion: "1.0.0",
  actionId: "produce",
  errorTag: "missing-target-group:0",
  remediationCandidateIds: ["lesson-b:retrieve"],
  remediationSatisfiedAt: "2026-09-02T12:00:00.000Z",
  status: "recurring",
  independentFailureCount: 2,
  supportedFailureCount: 0,
  independentFailuresSinceRepair: 2,
  firstSeenAt: "2026-09-01T10:00:00.000Z",
  lastSeenAt: "2026-09-02T10:00:00.000Z",
  repairedAt: null,
};

describe("planner remediation re-probe hard gates", () => {
  it("does not let source re-probe pressure bypass an unmet prerequisite", () => {
    const result = planSession({
      candidates: [sourceCandidate],
      states: [],
      sessionSize: 1,
      now: "2026-09-03T00:00:00.000Z",
      errorMemory: [satisfiedRecurringError],
    });

    expect(result.opportunities).toEqual([]);
    expect(result.blocked[0]?.reasons).toContain("prerequisite-not-ready:cap-a");
  });
});
