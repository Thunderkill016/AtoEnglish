import { describe, expect, it } from "vitest";

import { createEmptyLearnerSkillState } from "./evidence";
import { readLearnerDimension } from "./learner-state-read";
import { planSession, type PlannerCandidate } from "./session-planner";

describe("learner state evidence coverage", () => {
  it("keeps an unobserved default zero unknown", () => {
    const state = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      recognition: 0.8,
      evidenceCount: 1,
      evidenceByType: { recognition: 1 },
    };

    expect(readLearnerDimension(state, "production")).toEqual({
      estimate: null,
      evidenceCount: 0,
      status: "unknown",
      confidence: null,
      modelVersion: "ema-routing-v1",
      decisionScope: "routing",
    });
  });

  it("keeps an observed zero as real routing evidence", () => {
    const state = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      evidenceCount: 1,
      evidenceByType: { production: 1 },
    };

    expect(readLearnerDimension(state, "production")).toMatchObject({
      estimate: 0,
      evidenceCount: 1,
      status: "observed",
      confidence: null,
    });
  });

  it("does not turn an unknown dimension into a full skill gap", () => {
    const candidate: PlannerCandidate = {
      id: "produce-test",
      targetId: "CAP-TEST",
      evidenceType: "production",
      importance: 0,
    };
    const unknownState = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      recognition: 0.8,
      evidenceCount: 1,
      evidenceByType: { recognition: 1 },
    };
    const observedZeroState = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      evidenceCount: 1,
      evidenceByType: { production: 1 },
    };

    const unknown = planSession({ candidates: [candidate], states: [unknownState], sessionSize: 1 });
    const observedZero = planSession({
      candidates: [candidate],
      states: [observedZeroState],
      sessionSize: 1,
    });

    expect(unknown.opportunities[0]?.breakdown.skillGap).toBe(0);
    expect(unknown.opportunities[0]?.reasons).toContain("evidence-unknown:production");
    expect(observedZero.opportunities[0]?.breakdown.skillGap).toBe(1);
    expect(observedZero.opportunities[0]?.reasons).toContain("skill-gap:1");
  });

  it("blocks transfer until production has actually been observed", () => {
    const transfer: PlannerCandidate = {
      id: "transfer-test",
      targetId: "CAP-TEST",
      evidenceType: "transfer",
    };
    const state = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      recognition: 0.9,
      evidenceCount: 2,
      evidenceByType: { recognition: 2 },
    };

    const plan = planSession({ candidates: [transfer], states: [state], sessionSize: 1 });

    expect(plan.opportunities).toHaveLength(0);
    expect(plan.blocked[0]?.reasons).toContain("transfer-needs-observed-production");
  });

  it("blocks transfer when production is observed but below the readiness floor", () => {
    const transfer: PlannerCandidate = {
      id: "transfer-test",
      targetId: "CAP-TEST",
      evidenceType: "transfer",
    };
    const state = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      production: 0.1, // Below default floor 0.2
      evidenceCount: 1,
      evidenceByType: { production: 1 },
    };

    const plan = planSession({ candidates: [transfer], states: [state], sessionSize: 1 });

    expect(plan.opportunities).toHaveLength(0);
    expect(plan.blocked[0]?.reasons).toContain("transfer-needs-prior-production");
  });

  it("allows transfer when production is observed and meets or exceeds the readiness floor", () => {
    const transfer: PlannerCandidate = {
      id: "transfer-test",
      targetId: "CAP-TEST",
      evidenceType: "transfer",
    };
    const state = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      production: 0.35, // Above default floor 0.2
      evidenceCount: 1,
      evidenceByType: { production: 1 },
    };

    const plan = planSession({ candidates: [transfer], states: [state], sessionSize: 1 });

    expect(plan.opportunities).toHaveLength(1);
    expect(plan.opportunities[0]?.candidate.id).toBe("transfer-test");
  });

  it("grants per-dimension cold-start exploration when one dimension is observed but another is unknown", () => {
    const produceCandidate: PlannerCandidate = {
      id: "produce-test",
      targetId: "CAP-TEST",
      evidenceType: "production",
      importance: 0.5,
    };
    const state = {
      ...createEmptyLearnerSkillState("CAP-TEST"),
      recognition: 0.9,
      evidenceCount: 5,
      evidenceByType: { recognition: 5 }, // Production is unknown
    };

    const plan = planSession({ candidates: [produceCandidate], states: [state], sessionSize: 1 });

    expect(plan.opportunities[0]?.breakdown.skillGap).toBe(0);
    expect(plan.opportunities[0]?.breakdown.coldStart).toBeGreaterThan(0);
    expect(plan.opportunities[0]?.reasons).toContain("evidence-unknown:production");
    expect(plan.opportunities[0]?.reasons).toContain("cold-start:production");
  });

  describe("fallback semantics when typed coverage is absent", () => {
    it("fails closed to unknown for default zero dimensions even when total evidenceCount > 0", () => {
      const legacyState = {
        targetId: "CAP-LEGACY",
        recognition: 0.85,
        retrieval: 0,
        listening: 0,
        production: 0, // Unobserved in reality
        repair: 0,
        transfer: 0,
        retention: 0,
        evidenceCount: 10, // Total evidence exists from recognition
        lastEvidenceAt: "2026-09-02T10:00:00.000Z",
        evidenceByType: undefined, // Typed coverage missing!
      };

      const read = readLearnerDimension(legacyState, "production");
      expect(read.status).toBe("unknown");
      expect(read.estimate).toBeNull();
      expect(read.evidenceCount).toBe(0);
    });

    it("treats positive estimates as observed even without typed coverage", () => {
      const legacyState = {
        targetId: "CAP-LEGACY",
        recognition: 0.85,
        retrieval: 0,
        listening: 0,
        production: 0.6, // Explicit positive estimate
        repair: 0,
        transfer: 0,
        retention: 0,
        evidenceCount: 10,
        lastEvidenceAt: "2026-09-02T10:00:00.000Z",
        evidenceByType: undefined,
      };

      const read = readLearnerDimension(legacyState, "production");
      expect(read.status).toBe("observed");
      expect(read.estimate).toBe(0.6);
      expect(read.evidenceCount).toBe(10);
    });
  });

  describe("invalid / malformed evidence coverage normalization", () => {
    it("normalizes invalid counts deterministically", () => {
      const stateWithBadCounts = {
        ...createEmptyLearnerSkillState("CAP-TEST"),
        evidenceByType: {
          recognition: Number.NaN,
          retrieval: -3,
          production: 2.7,
          transfer: ("five" as unknown as number),
        },
      };

      expect(readLearnerDimension(stateWithBadCounts, "recognition").status).toBe("unknown");
      expect(readLearnerDimension(stateWithBadCounts, "retrieval").status).toBe("unknown");
      expect(readLearnerDimension(stateWithBadCounts, "transfer").status).toBe("unknown");

      const production = readLearnerDimension(stateWithBadCounts, "production");
      expect(production.status).toBe("observed");
      expect(production.evidenceCount).toBe(2); // Math.floor(2.7)
    });
  });
});
