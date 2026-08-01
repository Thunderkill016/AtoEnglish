import { describe, expect, it } from "vitest";

import { UNITS } from "@/lib/constants/units";
import { PILOT_LESSON_SPECS } from "@/lib/lessons/pilot-lessons";

describe("canonical unit metadata", () => {
  it("keeps every pilot surface aligned with the lesson specification", () => {
    for (const [unitId, lesson] of Object.entries(PILOT_LESSON_SPECS)) {
      const metadata = UNITS.find((unit) => unit.id === unitId);

      expect(metadata, `${unitId} must exist in UNITS`).toBeDefined();
      expect(metadata).toMatchObject({
        title: lesson.title,
        description: lesson.description,
        estimatedTime: lesson.estimatedTime,
      });
      expect(metadata?.tags[0]).toBe("Nhiệm vụ giao tiếp");
      expect(metadata?.tags.slice(1)).toEqual(
        lesson.mission?.targetChunks.slice(0, 2).map((chunk) => chunk.english),
      );
    }
  });

  it("preserves metadata for lessons outside the pilot", () => {
    expect(UNITS.find((unit) => unit.id === "unit-a0-7")).toMatchObject({
      title: "Unit A0-7: Thời Gian, Ngày & Tháng",
      estimatedTime: 40,
    });
  });
});
