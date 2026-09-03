import { describe, expect, it } from "vitest";

import type { ErrorMemoryEntry } from "@/lib/learning/error-memory";
import { planSession, type PlannerCandidate } from "@/lib/learning/session-planner";

const recurringError: ErrorMemoryEntry = {
  key: "cap-b|lesson-b|1.0.0|produce|missing-target-group:0",
  targetId: "cap-b",
  lessonId: "lesson-b",
  lessonVersion: "1.0.0",
  actionId: "produce",
  errorTag: "missing-target-group:0",
  remediationCandidateIds: ["candidate-b"],
  remediationSatisfiedAt: null,
  status: "recurring",
  independentFailureCount: 2,
  supportedFailureCount: 0,
  independentFailuresSinceRepair: 2,
  firstSeenAt: "2026-09-01T10:00:00.000Z",
  lastSeenAt: "2026-09-02T10:00:00.000Z",
  repairedAt: null,
};

const gatedCandidate: PlannerCandidate = {
  id: "candidate-b",
  targetId: "cap-b",
  evidenceType: "production",
  prerequisiteTargetIds: ["cap-a"],
  importance: 0.5,
  metadata: {
    lessonId: "lesson-b",
    lessonVersion: "1.0.0",
    actionId: "produce",
  },
};

describe("planner recurring-error hard gates", () => {
  it("does not let explicit recurring remediation pressure bypass an unmet prerequisite", () => {
    const result = planSession({
      candidates: [gatedCandidate],
      states: [],
      sessionSize: 1,
      now: "2026-09-03T00:00:00.000Z",
      errorMemory: [recurringError],
    });

    expect(result.opportunities).toEqual([]);
    expect(result.blocked[0]?.reasons).toContain("prerequisite-not-ready:cap-a");
  });
});
