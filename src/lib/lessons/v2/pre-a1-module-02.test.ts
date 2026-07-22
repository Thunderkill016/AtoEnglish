import { describe, expect, it } from "vitest";

import { validateProductionLessonV2 } from "./production-validator";
import { PRE_A1_MODULE_02_LESSONS } from "./pre-a1-module-02";

describe("Pre-A1 module 2 price and payment lessons", () => {
  it("ships three production-valid lessons", () => {
    expect(PRE_A1_MODULE_02_LESSONS).toHaveLength(3);

    for (const lesson of PRE_A1_MODULE_02_LESSONS) {
      expect(validateProductionLessonV2(lesson)).toEqual([]);
    }
  });

  it("moves from encounter to communication and delayed transfer", () => {
    expect(PRE_A1_MODULE_02_LESSONS.map((lesson) => lesson.id)).toEqual([
      "pre-a1-m02-encounter",
      "pre-a1-m02-communicate",
      "pre-a1-m02-retain-transfer",
    ]);
    expect(PRE_A1_MODULE_02_LESSONS[2].prerequisiteLessonIds).toContain(
      "pre-a1-m02-communicate",
    );
  });
});
