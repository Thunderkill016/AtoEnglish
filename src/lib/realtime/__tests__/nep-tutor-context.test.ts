import { describe, expect, it } from "vitest";

import {
  buildNếpRealtimeTutorInstructions,
  resolveNếpRealtimeTutorContext,
} from "@/lib/realtime/nep-tutor-context";

const lessonId = "LESSON-CAP002-FIRST-MEETING-V1";

describe("Nếp realtime tutor context", () => {
  it("resolves a canonical production action using learner-safe roleplay context", () => {
    const context = resolveNếpRealtimeTutorContext({
      lessonId,
      lessonVersion: 1,
      actionId: "produce",
    });

    expect(context).not.toBeNull();
    expect(context).toMatchObject({
      lessonId,
      lessonVersion: 1,
      actionId: "produce",
      actionKind: "produce",
      partnerCue: "Hi, I'm Maya. What's your name?",
      changedContext: false,
    });
    expect(context).not.toHaveProperty("targetSignals");
    expect(context).not.toHaveProperty("requiredSignalGroups");
    expect(context).not.toHaveProperty("assessment");
  });

  it("allows repair and changed-context transfer but rejects retrieval and unknown actions", () => {
    expect(
      resolveNếpRealtimeTutorContext({
        lessonId,
        lessonVersion: 1,
        actionId: "repair",
      }),
    ).toMatchObject({ actionKind: "repair" });

    expect(
      resolveNếpRealtimeTutorContext({
        lessonId,
        lessonVersion: 1,
        actionId: "transfer",
      }),
    ).toMatchObject({ actionKind: "transfer", changedContext: true });

    expect(
      resolveNếpRealtimeTutorContext({
        lessonId,
        lessonVersion: 1,
        actionId: "retrieve",
      }),
    ).toBeNull();

    expect(
      resolveNếpRealtimeTutorContext({
        lessonId,
        lessonVersion: 1,
        actionId: "missing",
      }),
    ).toBeNull();
  });

  it("instructs the model to act as a partner without teaching or grading", () => {
    const context = resolveNếpRealtimeTutorContext({
      lessonId,
      lessonVersion: 1,
      actionId: "repair",
    });
    expect(context).not.toBeNull();
    if (!context) return;

    const instructions = buildNếpRealtimeTutorInstructions(context);
    expect(instructions).toContain("roleplay partner, not the teacher or grader");
    expect(instructions).toContain(context.partnerCue);
    expect(instructions).toContain("never read bracketed text aloud");
    expect(instructions).toContain("Do not correct, coach, reveal an ideal answer");
    expect(instructions).toContain("trusted server evaluates the captured learner response separately");
  });
});
