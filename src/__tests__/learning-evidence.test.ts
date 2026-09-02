import { describe, expect, it } from "vitest";
import {
  applyEvidenceToSkillState,
  createEmptyLearnerSkillState,
  materializeEvidence,
  type LearningAttemptInput,
} from "@/lib/learning/evidence";

const baseAttempt: LearningAttemptInput = {
  knowledgeItemId: "word:borrow",
  exerciseType: "recall",
  responseModality: "text",
  correct: true,
  contextId: "ctx-a",
  revealUsed: false,
  supportLevel: 0,
};

const observedSpeech = {
  responseSource: "speech",
  responseLength: 18,
  rawResponsePersisted: false,
};

describe("learning evidence invariants", () => {
  it("does not award retrieval after reveal", () => {
    const event = materializeEvidence({
      attempt: { ...baseAttempt, revealUsed: true },
      candidate: { type: "retrieval", targetId: "word:borrow", success: true },
    });
    expect(event).toBeNull();
  });

  it("does not award evidence to a target the attempt did not address", () => {
    const event = materializeEvidence({
      attempt: baseAttempt,
      candidate: { type: "retrieval", targetId: "word:lend", success: true },
    });
    expect(event).toBeNull();
  });

  it("does not award oral production from typed fallback", () => {
    const event = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "text",
      },
      candidate: { type: "production", targetId: "cap:introduce-self", success: true },
    });
    expect(event).toBeNull();
  });

  it("does not award oral evidence when speech modality has no observed response", () => {
    const event = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
      },
      candidate: { type: "production", targetId: "cap:introduce-self", success: false },
    });
    expect(event).toBeNull();
  });

  it("awards production from privacy-safe derived speech observation without raw text", () => {
    const event = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
        responseText: null,
        metadata: observedSpeech,
      },
      candidate: { type: "production", targetId: "cap:introduce-self", success: true },
    });
    expect(event?.type).toBe("production");
    expect(event?.success).toBe(true);
  });

  it("also accepts an explicit captured response when a caller intentionally persists one", () => {
    const event = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
        responseText: "Hi, I'm Hoang.",
      },
      candidate: { type: "production", targetId: "cap:introduce-self", success: true },
    });
    expect(event?.type).toBe("production");
  });

  it("requires a changed context for transfer by default", () => {
    const missingHistory = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
        metadata: observedSpeech,
      },
      candidate: { type: "transfer", targetId: "cap:introduce-self", success: true },
    });
    expect(missingHistory).toBeNull();

    const sameContext = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
        metadata: observedSpeech,
      },
      candidate: { type: "transfer", targetId: "cap:introduce-self", success: true },
      previousSuccessfulContextId: "ctx-a",
    });
    expect(sameContext).toBeNull();

    const changedContext = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
        contextId: "ctx-b",
        metadata: observedSpeech,
      },
      candidate: { type: "transfer", targetId: "cap:introduce-self", success: true },
      previousSuccessfulContextId: "ctx-a",
    });
    expect(changedContext?.type).toBe("transfer");
  });

  it("can defer only the transfer-history check to the database boundary", () => {
    const event = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
        contextId: "ctx-b",
        responseText: null,
        metadata: observedSpeech,
      },
      candidate: { type: "transfer", targetId: "cap:introduce-self", success: true },
      deferTransferContextCheck: true,
    });

    expect(event?.type).toBe("transfer");
    expect(event?.contextId).toBe("ctx-b");
  });

  it("still rejects typed transfer even when history validation is deferred", () => {
    const event = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "text",
        contextId: "ctx-b",
      },
      candidate: { type: "transfer", targetId: "cap:introduce-self", success: true },
      deferTransferContextCheck: true,
    });

    expect(event).toBeNull();
  });

  it("keeps evidence channels independent in the learner snapshot", () => {
    const state = createEmptyLearnerSkillState("cap:introduce-self");
    const event = materializeEvidence({
      attempt: {
        ...baseAttempt,
        capabilityId: "cap:introduce-self",
        responseModality: "speech",
        metadata: observedSpeech,
      },
      candidate: { type: "production", targetId: "cap:introduce-self", success: true },
    });
    expect(event).not.toBeNull();

    const next = applyEvidenceToSkillState(state, event!, "2026-09-02T12:00:00.000Z");
    expect(next.production).toBeGreaterThan(0);
    expect(next.retrieval).toBe(0);
    expect(next.transfer).toBe(0);
    expect(next.evidenceCount).toBe(1);
  });

  it("discounts supported evidence instead of treating it as independent performance", () => {
    const state = createEmptyLearnerSkillState("word:borrow");
    const independent = materializeEvidence({
      attempt: { ...baseAttempt, supportLevel: 0 },
      candidate: { type: "retrieval", targetId: "word:borrow", success: true },
    });
    const supported = materializeEvidence({
      attempt: { ...baseAttempt, supportLevel: 3 },
      candidate: { type: "retrieval", targetId: "word:borrow", success: true },
    });

    const independentState = applyEvidenceToSkillState(state, independent!, "2026-09-02T12:00:00.000Z");
    const supportedState = applyEvidenceToSkillState(state, supported!, "2026-09-02T12:00:00.000Z");
    expect(supportedState.retrieval).toBeLessThan(independentState.retrieval);
  });
});
