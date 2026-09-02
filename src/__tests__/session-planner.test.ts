import { describe, expect, it } from "vitest";

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
});
