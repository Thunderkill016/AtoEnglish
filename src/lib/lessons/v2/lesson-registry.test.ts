import { describe, expect, it } from "vitest";

import {
  getLessonsForModuleV2,
  getLessonsForSectionV2,
  getNextLessonV2,
  getRegisteredLessonV2,
  getReviewDelayAfterLessonV2,
  LESSON_V2_MODULES,
  LESSON_V2_REGISTRY,
  LESSON_V2_SECTIONS,
} from "./lesson-registry";
import { validateProductionLessonV2 } from "./production-validator";

describe("Lesson V2 runtime registry", () => {
  it("registers the complete 26-session Pre-A1 curriculum", () => {
    expect(LESSON_V2_MODULES).toHaveLength(8);
    expect(LESSON_V2_SECTIONS).toHaveLength(10);
    expect(LESSON_V2_REGISTRY).toHaveLength(26);

    for (const moduleId of [
      "pre-a1-m01",
      "pre-a1-m02",
      "pre-a1-m03",
      "pre-a1-m04",
      "pre-a1-m05",
      "pre-a1-m06",
      "pre-a1-m07",
      "pre-a1-m08",
    ]) {
      expect(
        getLessonsForModuleV2(moduleId).map((entry) => entry.sessionKind),
      ).toEqual(["encounter", "communicate", "retain_transfer"]);
    }

    for (const checkpointId of [
      "pre-a1-checkpoint-01",
      "pre-a1-checkpoint-02",
    ]) {
      expect(
        getLessonsForSectionV2(checkpointId).map(
          (entry) => entry.sessionKind,
        ),
      ).toEqual(["checkpoint"]);
    }
  });

  it("keeps every registered lesson production-valid", () => {
    for (const entry of LESSON_V2_REGISTRY) {
      expect(validateProductionLessonV2(entry.lesson)).toEqual([]);
    }
  });

  it("resolves the final progression through checkpoint 2", () => {
    const first = getRegisteredLessonV2("pre-a1-m01-encounter");
    expect(first?.orderInModule).toBe(1);
    expect(
      getNextLessonV2("pre-a1-m04-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-checkpoint-01");
    expect(
      getNextLessonV2("pre-a1-checkpoint-01")?.lesson.id,
    ).toBe("pre-a1-m05-encounter");
    expect(
      getNextLessonV2("pre-a1-m05-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-m06-encounter");
    expect(
      getNextLessonV2("pre-a1-m06-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-m07-encounter");
    expect(
      getNextLessonV2("pre-a1-m07-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-m08-encounter");
    expect(
      getNextLessonV2("pre-a1-m08-retain-transfer")?.lesson.id,
    ).toBe("pre-a1-checkpoint-02");
    expect(getNextLessonV2("pre-a1-checkpoint-02")).toBeUndefined();
  });

  it("keeps milestone prerequisites explicit", () => {
    expect(
      getRegisteredLessonV2("pre-a1-m05-encounter")?.lesson
        .prerequisiteLessonIds,
    ).toEqual(["pre-a1-checkpoint-01"]);
    expect(
      getRegisteredLessonV2("pre-a1-m08-encounter")?.lesson
        .prerequisiteLessonIds,
    ).toEqual(["pre-a1-m07-retain-transfer"]);
    expect(
      getRegisteredLessonV2("pre-a1-checkpoint-02")?.lesson
        .prerequisiteLessonIds,
    ).toEqual([
      "pre-a1-m05-retain-transfer",
      "pre-a1-m06-retain-transfer",
      "pre-a1-m07-retain-transfer",
      "pre-a1-m08-retain-transfer",
    ]);
  });

  it("keeps lesson and section ids unique with contiguous order", () => {
    expect(
      new Set(LESSON_V2_REGISTRY.map((entry) => entry.lesson.id)).size,
    ).toBe(LESSON_V2_REGISTRY.length);
    expect(
      new Set(LESSON_V2_SECTIONS.map((section) => section.id)).size,
    ).toBe(LESSON_V2_SECTIONS.length);
    expect(LESSON_V2_REGISTRY.map((entry) => entry.levelOrder)).toEqual(
      Array.from(
        { length: LESSON_V2_REGISTRY.length },
        (_, index) => index + 1,
      ),
    );
    expect(LESSON_V2_SECTIONS.map((section) => section.order)).toEqual(
      Array.from(
        { length: LESSON_V2_SECTIONS.length },
        (_, index) => index + 1,
      ),
    );
  });

  it("uses a real 24-hour delay before every retain-transfer lesson", () => {
    for (let moduleNumber = 1; moduleNumber <= 8; moduleNumber += 1) {
      const moduleId = String(moduleNumber).padStart(2, "0");
      expect(
        getReviewDelayAfterLessonV2(
          `pre-a1-m${moduleId}-communicate`,
        ),
      ).toBe(24);
    }

    expect(
      getReviewDelayAfterLessonV2("pre-a1-checkpoint-01"),
    ).toBeUndefined();
    expect(
      getReviewDelayAfterLessonV2("pre-a1-checkpoint-02"),
    ).toBeUndefined();
  });
});
