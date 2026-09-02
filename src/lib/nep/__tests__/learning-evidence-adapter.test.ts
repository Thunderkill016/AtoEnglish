import { describe, expect, it } from "vitest";

import { materializeEvidence } from "../../learning/evidence";
import { firstMeetingLessonV1 } from "../lesson-contract";
import { toLearningAttemptRecord } from "../learning-evidence-adapter";

function action(kind: "comprehend" | "produce" | "repair" | "retry" | "transfer") {
  return firstMeetingLessonV1.actions.find((item) => item.kind === kind)!;
}

describe("Nếp → learning-core adapter", () => {
  it("maps repair to CAP-003 while production and transfer stay on CAP-002", () => {
    const production = toLearningAttemptRecord({
      lesson: firstMeetingLessonV1,
      action: action("produce"),
      response: "My name is Hoang",
      responseSource: "speech",
      correct: true,
      supportUsed: false,
      latencyMs: 1200,
    });
    const repair = toLearningAttemptRecord({
      lesson: firstMeetingLessonV1,
      action: action("repair"),
      response: "Could you say that again?",
      responseSource: "speech",
      correct: true,
      supportUsed: false,
      latencyMs: 900,
    });
    const transfer = toLearningAttemptRecord({
      lesson: firstMeetingLessonV1,
      action: action("transfer"),
      response: "Could you say that again? My name is Hoang.",
      responseSource: "speech",
      correct: true,
      supportUsed: false,
      latencyMs: 1500,
    });

    expect(production?.attempt.capabilityId).toBe("CAP-002");
    expect(production?.candidate?.type).toBe("production");
    expect(repair?.attempt.capabilityId).toBe("CAP-003");
    expect(repair?.candidate?.type).toBe("repair");
    expect(transfer?.attempt.capabilityId).toBe("CAP-002");
    expect(transfer?.candidate?.type).toBe("transfer");
  });

  it("maps product-level comprehension choice to low-level recognition evidence", () => {
    const record = toLearningAttemptRecord({
      lesson: firstMeetingLessonV1,
      action: action("comprehend"),
      response: "name",
      responseSource: "text",
      correct: true,
      supportUsed: false,
      latencyMs: 500,
    });

    expect(record?.attempt.responseModality).toBe("choice");
    expect(record?.candidate).toMatchObject({ type: "recognition", targetId: "CAP-002", success: true });
  });

  it("never persists the raw speech transcript", () => {
    const record = toLearningAttemptRecord({
      lesson: firstMeetingLessonV1,
      action: action("produce"),
      response: "My name is Hoang and this is raw learner speech",
      responseSource: "speech",
      correct: true,
      supportUsed: false,
      latencyMs: 1000,
    });

    expect(record?.attempt.responseText).toBeNull();
    expect(record?.attempt.metadata).toMatchObject({ rawResponsePersisted: false });
    expect(JSON.stringify(record)).not.toContain("raw learner speech");
  });

  it("lets the canonical evidence policy reject typed fallback as speaking evidence", () => {
    const record = toLearningAttemptRecord({
      lesson: firstMeetingLessonV1,
      action: action("produce"),
      response: "My name is Hoang",
      responseSource: "text",
      correct: true,
      supportUsed: false,
      latencyMs: 700,
    });

    expect(record?.attempt.responseModality).toBe("text");
    expect(record?.candidate).not.toBeNull();
    expect(materializeEvidence({ attempt: record!.attempt, candidate: record!.candidate! })).toBeNull();
  });

  it("stores supported retry as attempt-only after reveal", () => {
    const record = toLearningAttemptRecord({
      lesson: firstMeetingLessonV1,
      action: action("retry"),
      response: "Could you say that again? My name is Hoang.",
      responseSource: "speech",
      correct: true,
      supportUsed: true,
      latencyMs: 1000,
    });

    expect(record?.attempt.supportLevel).toBe(1);
    expect(record?.candidate).toBeNull();
  });
});
