import { describe, expect, it } from "vitest";

import {
  calculateLessonSessionProgress,
  completeLessonStep,
  createLessonSessionState,
  markExerciseCorrect,
  normaliseLessonSessionState,
  recordPerformanceAttempt,
  updateLessonAnswer,
} from "./session-progress";

describe("Lesson V2 session progress", () => {
  it("tracks answers, correct retrieval and performance attempts", () => {
    let state = createLessonSessionState(
      "pre-a1-m01-encounter",
      new Date("2026-07-22T00:00:00.000Z"),
    );

    state = updateLessonAnswer(
      state,
      "m01e-p1",
      "Nói tên",
      new Date("2026-07-22T00:01:00.000Z"),
    );
    state = markExerciseCorrect(
      state,
      "m01e-p1",
      new Date("2026-07-22T00:02:00.000Z"),
    );
    state = recordPerformanceAttempt(
      state,
      new Date("2026-07-22T00:03:00.000Z"),
    );

    expect(state.answers["m01e-p1"]).toBe("Nói tên");
    expect(state.correctExerciseIds).toContain("m01e-p1");
    expect(state.performanceAttempts).toBe(1);
  });

  it("derives progress from completed steps and final completion", () => {
    let state = createLessonSessionState("lesson");
    state = completeLessonStep(state, "one", 1, false);
    state = completeLessonStep(state, "two", 2, false);

    expect(calculateLessonSessionProgress(state, 8)).toBe(25);

    state = completeLessonStep(state, "eight", 7, true);
    expect(calculateLessonSessionProgress(state, 8)).toBe(100);
  });

  it("rejects incompatible stored versions instead of crashing", () => {
    const state = normaliseLessonSessionState(
      {
        version: 999,
        lessonId: "lesson",
        completedStepIds: ["bad"],
      },
      "lesson",
    );

    expect(state.version).toBe(1);
    expect(state.completedStepIds).toEqual([]);
  });
});
