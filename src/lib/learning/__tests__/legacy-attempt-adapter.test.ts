import { describe, expect, it } from "vitest";

import { compileLegacyAttemptRpcArgs } from "@/lib/learning/legacy-attempt-adapter";

const baseAttempt = {
  activityId: "unit-a0-1:checkpoint:q1",
  status: "scored" as const,
  score: 100,
  errorTags: [],
  evaluator: "deterministic-answer-key",
  evaluatorVersion: "2.0.0",
  latencyMs: 1200,
};

describe("compileLegacyAttemptRpcArgs", () => {
  it("preserves a legacy checkpoint as attempt-only canonical history", () => {
    const result = compileLegacyAttemptRpcArgs({
      sessionId: "11111111-1111-4111-8111-111111111111",
      lessonId: "unit-a0-1",
      attempt: {
        ...baseAttempt,
        modality: "checkpoint",
      },
    });

    expect(result.p_knowledge_item_id).toBe(
      "legacy:unit-a0-1:checkpoint:q1",
    );
    expect(result.p_response_modality).toBe("choice");
    expect(result.p_correct).toBe(true);
    expect(result.p_evidence_type).toBeNull();
    expect(result.p_evidence_target_id).toBeNull();
    expect(result.p_capability_id).toBeNull();
    expect(result.p_metadata).toMatchObject({
      compatibilitySource: "legacy-learning-attempt-v1",
      lessonId: "unit-a0-1",
      legacyScore: 100,
    });
  });

  it("does not turn a partial mission score into binary correctness or mastery evidence", () => {
    const result = compileLegacyAttemptRpcArgs({
      sessionId: "11111111-1111-4111-8111-111111111111",
      lessonId: "unit-a0-1",
      attempt: {
        ...baseAttempt,
        activityId: "unit-a0-1:mission:mission-meet-new-colleague",
        modality: "speaking",
        score: 75,
        errorTags: ["missing_intent:ask_name"],
        evaluator: "deterministic-intent-match",
      },
    });

    expect(result.p_response_modality).toBe("speech");
    expect(result.p_correct).toBeNull();
    expect(result.p_response_text).toBeNull();
    expect(result.p_evidence_type).toBeNull();
    expect(result.p_metadata.legacyErrorTags).toEqual([
      "missing_intent:ask_name",
    ]);
  });

  it("does not infer an observable response modality for legacy listening-only activity metadata", () => {
    const result = compileLegacyAttemptRpcArgs({
      sessionId: "11111111-1111-4111-8111-111111111111",
      lessonId: "unit-a0-1",
      attempt: {
        ...baseAttempt,
        activityId: "unit-a0-1:listening:1",
        modality: "listening",
        score: 0,
      },
    });

    expect(result.p_response_modality).toBe("none");
    expect(result.p_correct).toBe(false);
    expect(result.p_evidence_type).toBeNull();
  });
});
