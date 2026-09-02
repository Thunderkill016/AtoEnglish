import { describe, expect, it } from "vitest";

import type { ErrorMemoryEntry, ErrorMemoryStatus } from "@/lib/learning/error-memory";
import type { LearnerSkillState } from "@/lib/learning/evidence";
import {
  planSession,
  type PlannerCandidate,
  type SessionPlannerInput,
} from "@/lib/learning/session-planner";

function state(targetId: string, overrides: Partial<LearnerSkillState> = {}): LearnerSkillState {
  return {
    targetId,
    recognition: 0,
    retrieval: 0,
    listening: 0,
    production: 0,
    repair: 0,
    transfer: 0,
    retention: 0,
    evidenceCount: 0,
    lastEvidenceAt: null,
    ...overrides,
  };
}

function candidate(overrides: Partial<PlannerCandidate> & Pick<PlannerCandidate, "id" | "targetId" | "evidenceType">): PlannerCandidate {
  return {
    importance: 0.5,
    transferValue: 0,
    prerequisiteTargetIds: [],
    ...overrides,
  };
}

function errorMemoryEntry(overrides: Partial<ErrorMemoryEntry> = {}): ErrorMemoryEntry {
  const status: ErrorMemoryStatus = overrides.status ?? "recurring";
  return {
    key: "cap-b|lesson-b|1.0.0|produce|missing-target-group:0",
    targetId: "cap-b",
    lessonId: "lesson-b",
    lessonVersion: "1.0.0",
    actionId: "produce",
    errorTag: "missing-target-group:0",
    remediationCandidateIds: [],
    status,
    independentFailureCount: status === "recurring" ? 2 : 1,
    supportedFailureCount: 0,
    independentFailuresSinceRepair: status === "recurring" ? 2 : status === "repaired" ? 0 : 1,
    firstSeenAt: "2026-09-01T10:00:00.000Z",
    lastSeenAt: "2026-09-02T10:00:00.000Z",
    repairedAt: status === "repaired" ? "2026-09-02T11:00:00.000Z" : null,
    ...overrides,
  };
}

function plannerCandidate(id: string, targetId: string, lessonId: string, actionId = "produce") {
  return candidate({
    id,
    targetId,
    evidenceType: "production",
    metadata: { lessonId, lessonVersion: "1.0.0", actionId },
  });
}

const fixedNow = "2026-09-03T00:00:00.000Z";

function plan(input: Omit<SessionPlannerInput, "now">) {
  return planSession({ ...input, now: fixedNow });
}

describe("session planner v1", () => {
  it("is deterministic for identical input", () => {
    const input = {
      candidates: [
        candidate({ id: "cap-a:recognition", targetId: "cap-a", evidenceType: "recognition" }),
        candidate({ id: "cap-b:retrieval", targetId: "cap-b", evidenceType: "retrieval" }),
      ],
      states: [],
      sessionSize: 2,
    };

    const first = plan(input);
    const second = plan(input);

    expect(first).toEqual(second);
    expect(first.policy).toBe("session-planner-v1");
  });

  it("blocks candidates whose declared prerequisite is not ready", () => {
    const result = plan({
      candidates: [
        candidate({
          id: "cap-2:production",
          targetId: "cap-2",
          evidenceType: "production",
          prerequisiteTargetIds: ["cap-1"],
        }),
      ],
      states: [state("cap-1")],
      sessionSize: 1,
    });

    expect(result.opportunities).toEqual([]);
    expect(result.blocked[0]?.reasons).toContain("prerequisite-not-ready:cap-1");
  });

  it("allows the next capability after enough prerequisite evidence exists", () => {
    const result = plan({
      candidates: [
        candidate({
          id: "cap-2:production",
          targetId: "cap-2",
          evidenceType: "production",
          prerequisiteTargetIds: ["cap-1"],
        }),
      ],
      states: [state("cap-1", { retrieval: 0.3, evidenceCount: 2 })],
      sessionSize: 1,
    });

    expect(result.opportunities[0]?.candidate.id).toBe("cap-2:production");
  });

  it("blocks transfer until the same target has prior production evidence", () => {
    const transfer = candidate({
      id: "cap-a:transfer",
      targetId: "cap-a",
      evidenceType: "transfer",
      transferValue: 1,
    });

    const blocked = plan({ candidates: [transfer], states: [state("cap-a")], sessionSize: 1 });
    expect(blocked.opportunities).toEqual([]);
    expect(blocked.blocked[0]?.reasons).toContain("transfer-needs-prior-production");

    const allowed = plan({
      candidates: [transfer],
      states: [state("cap-a", { production: 0.35, evidenceCount: 2 })],
      sessionSize: 1,
    });
    expect(allowed.opportunities[0]?.candidate.id).toBe("cap-a:transfer");
  });

  it("blocks retention for a target with no prior evidence", () => {
    const result = plan({
      candidates: [candidate({ id: "cap-a:retention", targetId: "cap-a", evidenceType: "retention" })],
      states: [state("cap-a")],
      sessionSize: 1,
    });

    expect(result.blocked[0]?.reasons).toContain("retention-needs-prior-evidence");
  });

  it("prefers recognition over production for an otherwise equal cold-start target", () => {
    const result = plan({
      candidates: [
        candidate({ id: "cap-a:production", targetId: "cap-a", evidenceType: "production" }),
        candidate({ id: "cap-a:recognition", targetId: "cap-a", evidenceType: "recognition" }),
      ],
      states: [],
      sessionSize: 1,
    });

    expect(result.opportunities[0]?.candidate.id).toBe("cap-a:recognition");
  });

  it("uses recent and in-session penalties to avoid hammering one target", () => {
    const result = plan({
      candidates: [
        candidate({ id: "cap-a:recognition", targetId: "cap-a", evidenceType: "recognition", importance: 1 }),
        candidate({ id: "cap-a:retrieval", targetId: "cap-a", evidenceType: "retrieval", importance: 1 }),
        candidate({ id: "cap-b:recognition", targetId: "cap-b", evidenceType: "recognition", importance: 0.9 }),
      ],
      states: [],
      sessionSize: 2,
      recentTargetIds: ["cap-a"],
    });

    expect(result.opportunities.map((item) => item.candidate.targetId)).toEqual(["cap-b", "cap-a"]);
  });

  it("caps the number of opportunities for one target inside a session", () => {
    const result = plan({
      candidates: [
        candidate({ id: "a:recognition", targetId: "a", evidenceType: "recognition" }),
        candidate({ id: "a:retrieval", targetId: "a", evidenceType: "retrieval" }),
        candidate({ id: "a:listening", targetId: "a", evidenceType: "listening" }),
      ],
      states: [],
      sessionSize: 3,
      config: { maxPerTarget: 2 },
    });

    expect(result.opportunities).toHaveLength(2);
    expect(result.blocked.some((item) => item.reasons.includes("target-session-cap"))).toBe(true);
  });

  it("gives a stale weak target more urgency than an equally weak fresh target", () => {
    const result = plan({
      candidates: [
        candidate({ id: "old:retrieval", targetId: "old", evidenceType: "retrieval" }),
        candidate({ id: "fresh:retrieval", targetId: "fresh", evidenceType: "retrieval" }),
      ],
      states: [
        state("old", { retrieval: 0.2, evidenceCount: 3, lastEvidenceAt: "2026-08-01T00:00:00.000Z" }),
        state("fresh", { retrieval: 0.2, evidenceCount: 3, lastEvidenceAt: "2026-09-02T23:30:00.000Z" }),
      ],
      sessionSize: 1,
    });

    expect(result.opportunities[0]?.candidate.targetId).toBe("old");
    expect(result.opportunities[0]?.reasons.some((reason) => reason.startsWith("staleness:"))).toBe(true);
  });

  it("boosts only the matching candidate when a recurring error needs repair", () => {
    const result = plan({
      candidates: [
        plannerCandidate("a-candidate", "cap-a", "lesson-a"),
        plannerCandidate("z-candidate", "cap-b", "lesson-b"),
      ],
      states: [],
      sessionSize: 1,
      errorMemory: [errorMemoryEntry()],
    });

    expect(result.opportunities[0]?.candidate.id).toBe("z-candidate");
    expect(result.opportunities[0]?.breakdown.errorRepairPressure).toBe(1);
    expect(result.opportunities[0]?.reasons).toContain("recurring-error-repair:1");
  });

  it.each(["observed", "supported-only", "repaired"] as const)(
    "does not alter ranking for %s error memory",
    (status) => {
      const result = plan({
        candidates: [
          plannerCandidate("a-candidate", "cap-a", "lesson-a"),
          plannerCandidate("z-candidate", "cap-b", "lesson-b"),
        ],
        states: [],
        sessionSize: 1,
        errorMemory: [errorMemoryEntry({ status })],
      });

      expect(result.opportunities[0]?.candidate.id).toBe("a-candidate");
      expect(result.opportunities[0]?.breakdown.errorRepairPressure).toBe(0);
    },
  );

  it("does not leak legacy same-action pressure across target, lesson version, or action identity", () => {
    const target = plannerCandidate("a-candidate", "cap-a", "lesson-a");
    const mismatches = [
      errorMemoryEntry({ targetId: "cap-x" }),
      errorMemoryEntry({ lessonId: "lesson-x" }),
      errorMemoryEntry({ lessonVersion: "2.0.0" }),
      errorMemoryEntry({ actionId: "repair" }),
    ];

    for (const entry of mismatches) {
      const result = plan({ candidates: [target], states: [], sessionSize: 1, errorMemory: [entry] });
      expect(result.opportunities[0]?.breakdown.errorRepairPressure).toBe(0);
    }
  });

  it("routes recurring pressure to an explicit cross-action remediation candidate", () => {
    const lessonId = "LESSON-CAP002-FIRST-MEETING-V1";
    const repairId = `${lessonId}:repair`;
    const transferId = `${lessonId}:transfer`;
    const repair = candidate({
      id: repairId,
      targetId: "CAP-003",
      evidenceType: "repair",
      metadata: { lessonId, lessonVersion: "1", actionId: "repair" },
    });
    const transfer = candidate({
      id: transferId,
      targetId: "CAP-002",
      evidenceType: "transfer",
      transferValue: 1,
      metadata: { lessonId, lessonVersion: "1", actionId: "transfer" },
    });
    const recurringTransferError = errorMemoryEntry({
      key: "CAP-002|LESSON-CAP002-FIRST-MEETING-V1|1|transfer|missing-target-group:0",
      targetId: "CAP-002",
      lessonId,
      lessonVersion: "1",
      actionId: "transfer",
      remediationCandidateIds: [repairId],
    });

    const result = plan({
      candidates: [transfer, repair],
      states: [state("CAP-002", { production: 0.3, evidenceCount: 1 })],
      sessionSize: 2,
      errorMemory: [recurringTransferError],
    });

    const repairOpportunity = result.opportunities.find((item) => item.candidate.id === repairId);
    const transferOpportunity = result.opportunities.find((item) => item.candidate.id === transferId);
    expect(repairOpportunity?.breakdown.errorRepairPressure).toBe(1);
    expect(transferOpportunity?.breakdown.errorRepairPressure).toBe(0);
  });

  it("explicit remediation hints override the legacy same-action fallback", () => {
    const source = plannerCandidate("lesson-b:produce", "cap-b", "lesson-b");
    const remediation = plannerCandidate("lesson-b:retrieve", "cap-b", "lesson-b", "retrieve");
    const entry = errorMemoryEntry({ remediationCandidateIds: [remediation.id] });

    const result = plan({
      candidates: [source, remediation],
      states: [],
      sessionSize: 2,
      errorMemory: [entry],
    });

    expect(result.opportunities.find((item) => item.candidate.id === source.id)?.breakdown.errorRepairPressure).toBe(0);
    expect(result.opportunities.find((item) => item.candidate.id === remediation.id)?.breakdown.errorRepairPressure).toBe(1);
  });

  it("keeps recurring error pressure binary even when multiple tags route to one candidate", () => {
    const matchingCandidate = plannerCandidate("candidate", "cap-b", "lesson-b");
    const first = errorMemoryEntry({ remediationCandidateIds: [matchingCandidate.id] });
    const second = errorMemoryEntry({
      key: "cap-b|lesson-b|1.0.0|produce|incorrect-choice",
      errorTag: "incorrect-choice",
      remediationCandidateIds: [matchingCandidate.id],
    });
    const result = plan({
      candidates: [matchingCandidate],
      states: [],
      sessionSize: 1,
      errorMemory: [first, second],
    });

    expect(result.opportunities[0]?.breakdown.errorRepairPressure).toBe(1);
    expect(result.opportunities[0]?.reasons).toContain("recurring-error-repair:2");
  });
});
