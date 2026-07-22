import { describe, expect, it } from "vitest";

import { buildLessonEvidence } from "./lesson-evidence-client";
import { PRE_A1_M01_ENCOUNTER } from "./pre-a1-module-01";
import { createLessonSessionState } from "./session-progress";

describe("Lesson V2 evidence payload", () => {
  it("stores observable evidence without storing raw learner answers", () => {
    const state = {
      ...createLessonSessionState(
        PRE_A1_M01_ENCOUNTER.id,
        new Date("2026-07-22T09:00:00.000Z"),
      ),
      completedStepIds: PRE_A1_M01_ENCOUNTER.steps.map((step) => step.id),
      correctExerciseIds: ["m01e-p1", "m01e-p2"],
      performanceAttempts: 2,
      answers: { "m01e-p4": "My name is private" },
      completed: true,
      completedAt: "2026-07-22T09:10:00.000Z",
      updatedAt: "2026-07-22T09:10:00.000Z",
    };

    const evidence = buildLessonEvidence(PRE_A1_M01_ENCOUNTER, state);

    expect(evidence.durationSeconds).toBe(600);
    expect(evidence.performanceAttempts).toBe(2);
    expect(evidence).not.toHaveProperty("answers");
  });
});
