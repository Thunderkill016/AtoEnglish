import { describe, expect, it } from "vitest";

import {
  getLessonsForModuleV2,
  getNextLessonV2,
  getRegisteredLessonV2,
  LESSON_V2_REGISTRY,
} from "./lesson-registry";
import { validateProductionLessonV2 } from "./production-validator";

describe("Lesson V2 runtime registry", () => {
  it("registers the complete first Pre-A1 module", () => {
    expect(LESSON_V2_REGISTRY).toHaveLength(3);
    expect(
      getLessonsForModuleV2("pre-a1-m01").map(
        (entry) => entry.sessionKind,
      ),
    ).toEqual(["encounter", "communicate", "retain_transfer"]);
  });

  it("keeps every registered lesson production-valid", () => {
    for (const entry of LESSON_V2_REGISTRY) {
      expect(validateProductionLessonV2(entry.lesson)).toEqual([]);
    }
  });

  it("resolves the next lesson without hard-coded routes", () => {
    const first = getRegisteredLessonV2("pre-a1-m01-encounter");
    expect(first?.orderInModule).toBe(1);
    expect(
      getNextLessonV2("pre-a1-m01-encounter")?.lesson.id,
    ).toBe("pre-a1-m01-communicate");
    expect(getNextLessonV2("pre-a1-m01-retain-transfer")).toBeUndefined();
  });
});
