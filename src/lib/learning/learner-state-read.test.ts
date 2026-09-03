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
});
