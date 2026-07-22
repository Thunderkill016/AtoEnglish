import { describe, expect, it } from "vitest";

import {
  getLessonsForModuleV2,
  getNextLessonV2,
  getRegisteredLessonV2,
  getReviewDelayAfterLessonV2,
  LESSON_V2_MODULES,
  LESSON_V2_REGISTRY,
} from "./lesson-registry";
import { validateProductionLessonV2 } from "./production-validator";

describe("Lesson V2 runtime registry", () => {
  it("registers the first four complete Pre-A1 modules", () => {
    expect(LESSON_V2_MODULES).toHaveLength(4);
    expect(LESSON_V2_REGISTRY).toHaveLength(12);

    for (const moduleId of [
      "pre-a1-m01",
      "pre-a1-m02",
      "pre-a1-m03",
      "pre-a1-m04",
    ]) {
      expect(
        getLessonsForModuleV2(moduleId).map((entry) => entry.sessionKind),
      ).toEqual(["encounter", "communicate", "retain_transfer"]);
    }
  });

  it("keeps every registered lesson production-valid", () => {
    for (const entry of LESSON_V2_REGISTRY) {
      expect(validateProductionLessonV2(entry.lesson)).toEqual([]);
    }
  });

  it("resolves the next lesson across module boundaries", () => {
    const first = getRegisteredLessonV2("pre-a1-m01-encounter");
    expect(first?.orderInModule).toBe(1);
    expect(
      getNextLessonV2("pre-a1-m01-encounter")?.lesson.id,
    ).toBe("pre-a1-m01-communicate");
    expect(
      getNextLessonV2("pre-a1-m01-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-m02-encounter");
    expect(
      getNextLessonV2("pre-a1-m02-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-m03-encounter");
    expect(
      getNextLessonV2("pre-a1-m03-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-m04-encounter");
    expect(getNextLessonV2("pre-a1-m04-retain-transfer")).toBeUndefined();
  });

  it("uses a real 24-hour delay before each retain-transfer lesson", () => {
    expect(getReviewDelayAfterLessonV2("pre-a1-m01-communicate")).toBe(24);
    expect(getReviewDelayAfterLessonV2("pre-a1-m02-communicate")).toBe(24);
    expect(getReviewDelayAfterLessonV2("pre-a1-m03-communicate")).toBe(24);
    expect(getReviewDelayAfterLessonV2("pre-a1-m04-communicate")).toBe(24);
  });
});
