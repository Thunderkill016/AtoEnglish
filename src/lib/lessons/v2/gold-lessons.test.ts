import { describe, expect, it } from "vitest";

import { validateLessonV2 } from "./validate";
import { GOLD_LESSONS } from "./gold-lessons";

describe("Lesson V2 gold standards", () => {
  it("contains one valid production model for every level", () => {
    expect(GOLD_LESSONS.map((lesson) => lesson.level)).toEqual([
      "PRE_A1",
      "A1",
      "A2",
      "B1",
      "B2",
    ]);

    for (const lesson of GOLD_LESSONS) {
      expect(validateLessonV2(lesson)).toEqual([]);
    }
  });

  it("raises discourse length and target load progressively", () => {
    const performanceSeconds = GOLD_LESSONS.map((lesson) => {
      const performance = lesson.steps.find(
        (step) => step.kind === "performance",
      );
      if (!performance || performance.kind !== "performance") return 0;
      return performance.task.responseSeconds ?? 0;
    });

    const coreTargetCounts = GOLD_LESSONS.map(
      (lesson) =>
        lesson.targets.filter((target) => target.priority === "core").length,
    );

    expect(performanceSeconds).toEqual([20, 40, 70, 110, 170]);
    expect(coreTargetCounts).toEqual([4, 6, 7, 8, 10]);
  });

  it("keeps repair, repeated performance and delayed review in every model", () => {
    for (const lesson of GOLD_LESSONS) {
      expect(
        lesson.targets.some((target) => target.kind === "repair_strategy"),
      ).toBe(true);

      const performance = lesson.steps.find(
        (step) => step.kind === "performance",
      );
      expect(performance?.kind).toBe("performance");
      if (performance?.kind === "performance") {
        expect(performance.task.attempts).toBeGreaterThanOrEqual(2);
      }

      const exit = lesson.steps.find((step) => step.kind === "exit");
      expect(exit?.kind).toBe("exit");
      if (exit?.kind === "exit") {
        expect(exit.reviewTargetIds.length).toBeGreaterThan(0);
      }
    }
  });
});
