import { describe, expect, it } from "vitest";

import { GOLD_LESSONS } from "./gold-lessons";
import {
  validateLessonExerciseDosage,
  validateProductionLessonV2,
} from "./production-validator";
import type { LessonV2 } from "./schema";

describe("Lesson V2 production validator", () => {
  it("accepts all five gold lessons", () => {
    for (const lesson of GOLD_LESSONS) {
      expect(validateProductionLessonV2(lesson)).toEqual([]);
    }
  });

  it("rejects a core lesson with too few practice items", () => {
    const source = GOLD_LESSONS[1];
    const lesson: LessonV2 = {
      ...source,
      steps: source.steps.map((step) =>
        step.kind === "practice"
          ? { ...step, exercises: step.exercises.slice(0, 2) }
          : step,
      ),
    };

    expect(
      validateLessonExerciseDosage(lesson).some((violation) =>
        violation.message.includes("controlled items"),
      ),
    ).toBe(true);
  });

  it("rejects recognition-only practice without recall", () => {
    const source = GOLD_LESSONS[0];
    const lesson: LessonV2 = {
      ...source,
      steps: source.steps.map((step) =>
        step.kind === "practice"
          ? {
              ...step,
              exercises: step.exercises.map((exercise) =>
                exercise.kind === "recall"
                  ? {
                      id: exercise.id,
                      kind: "select" as const,
                      promptVi: exercise.promptVi,
                      options: [exercise.answer, "I do not know."],
                      answer: exercise.answer,
                      targetIds: exercise.targetIds,
                    }
                  : exercise,
              ),
            }
          : step,
      ),
    };

    expect(
      validateLessonExerciseDosage(lesson).some((violation) =>
        violation.message.includes("retrieval item"),
      ),
    ).toBe(true);
  });
});
