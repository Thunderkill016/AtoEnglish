import { describe, expect, it } from "vitest";

import { compileLegacyAttemptRpcArgs } from "@/lib/learning/legacy-attempt-adapter";

const baseAttempt = {
  activityId: "unit-a0-1:checkpoint:q1",
  modality: "checkpoint" as const,
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

  it("maps a failed checkpoint (score 0) to binary false while keeping evidence null", () => {
    const result = compileLegacyAttemptRpcArgs({
      sessionId: "11111111-1111-4111-8111-111111111111",
      lessonId: "unit-a0-1",
      attempt: {
        ...baseAttempt,
        modality: "checkpoint",
        score: 0,
        errorTags: ["answer_mismatch"],
      },
    });

    expect(result.p_correct).toBe(false);
    expect(result.p_response_modality).toBe("choice");
    expect(result.p_evidence_type).toBeNull();
    expect(result.p_response_text).toBeNull();
  });

  it("maps speaking and shadowing to speech modality without oral evidence or response text", () => {
    for (const modality of ["speaking", "shadowing"] as const) {
      const result = compileLegacyAttemptRpcArgs({
        sessionId: "11111111-1111-4111-8111-111111111111",
        lessonId: "unit-a0-1",
        attempt: {
          ...baseAttempt,
          activityId: `unit-a0-1:${modality}:1`,
          modality,
          score: 100,
        },
      });

      expect(result.p_response_modality).toBe("speech");
      expect(result.p_response_text).toBeNull();
      expect(result.p_evidence_type).toBeNull();
      expect(result.p_evidence_target_id).toBeNull();
      expect(result.p_capability_id).toBeNull();
      expect(result.p_metadata.legacyModality).toBe(modality);
    }
  });

  it("maps writing to text modality and quiz/checkpoint to choice modality", () => {
    const writing = compileLegacyAttemptRpcArgs({
      sessionId: "11111111-1111-4111-8111-111111111111",
      lessonId: "unit-a0-1",
      attempt: { ...baseAttempt, modality: "writing", score: 100 },
    });
    expect(writing.p_response_modality).toBe("text");
    expect(writing.p_response_text).toBeNull();

    const quiz = compileLegacyAttemptRpcArgs({
      sessionId: "11111111-1111-4111-8111-111111111111",
      lessonId: "unit-a0-1",
      attempt: { ...baseAttempt, modality: "quiz", score: 100 },
    });
    expect(quiz.p_response_modality).toBe("choice");
    expect(quiz.p_response_text).toBeNull();
  });

  it("does not infer observable response modalities for non-interactive passive modalities", () => {
    for (const modality of ["listening", "reading", "vocabulary", "grammar"] as const) {
      const result = compileLegacyAttemptRpcArgs({
        sessionId: "11111111-1111-4111-8111-111111111111",
        lessonId: "unit-a0-1",
        attempt: {
          ...baseAttempt,
          activityId: `unit-a0-1:${modality}:1`,
          modality,
          score: 100,
        },
      });

      expect(result.p_response_modality).toBe("none");
      expect(result.p_response_text).toBeNull();
      expect(result.p_evidence_type).toBeNull();
    }
  });

  it("keeps p_correct null for unscored attempts regardless of score value", () => {
    for (const status of ["unscored", "skipped", "unavailable"] as const) {
      const result = compileLegacyAttemptRpcArgs({
        sessionId: "11111111-1111-4111-8111-111111111111",
        lessonId: "unit-a0-1",
        attempt: {
          ...baseAttempt,
          status,
          score: 100,
        },
      });

      expect(result.p_correct).toBeNull();
      expect(result.p_evidence_type).toBeNull();
      expect(result.p_metadata.legacyStatus).toBe(status);
    }
  });

  it("guarantees universal null evidence fields and null capability_id across all calls", () => {
    const result = compileLegacyAttemptRpcArgs({
      sessionId: "11111111-1111-4111-8111-111111111111",
      lessonId: "unit-a0-1",
      attempt: baseAttempt,
    });

    expect(result.p_capability_id).toBeNull();
    expect(result.p_evidence_type).toBeNull();
    expect(result.p_evidence_target_id).toBeNull();
    expect(result.p_evidence_success).toBeNull();
    expect(result.p_evidence_confidence).toBeNull();
    expect(result.p_evidence_context_id).toBeNull();
    expect(result.p_evaluator).toBeNull();
    expect(result.p_evidence_metadata).toEqual({});
    expect(result.p_response_text).toBeNull();
    expect(result.p_context_id).toBeNull();
    expect(result.p_hint_count).toBe(0);
    expect(result.p_reveal_used).toBe(false);
    expect(result.p_support_level).toBe(0);
  });
});
