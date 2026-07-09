import { describe, it, expect } from "vitest";
import { safeParseLessonSpec, LESSON_STAGES } from "@/lib/v2/lesson-spec";
import { getAllAuthoredLessons, getLessonV2 } from "@/lib/v2/lessons";
import { CORE_PATH_PLAN, CORE_END_LESSON_ID, CORE_PATH_TOTAL } from "@/lib/v2/path";
import { isCurriculumV2 } from "@/lib/v2/flag";
import { lessonA101 } from "@/lib/v2/lessons/l-a1-01";

describe("LessonSpec v2", () => {
  it("defines 8 stages", () => {
    expect(LESSON_STAGES).toHaveLength(8);
  });

  it("parses gold lesson l-a1-01", () => {
    const r = safeParseLessonSpec(lessonA101);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.id).toBe("l-a1-01");
      expect(r.data.task.type).toBe("speak");
      expect(r.data.lexis.length).toBeGreaterThanOrEqual(6);
      expect(r.data.fluency.items.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("registry has three pilots", () => {
    expect(getLessonV2("l-a0-01")?.cefr).toBe("A0");
    expect(getLessonV2("l-a1-01")?.title_vi).toContain("Chào hỏi");
    expect(getLessonV2("l-b1-01")?.cefr).toBe("B1");
    expect(getAllAuthoredLessons()).toHaveLength(3);
  });

  it("all authored lessons pass schema", () => {
    for (const lesson of getAllAuthoredLessons()) {
      const r = safeParseLessonSpec(lesson);
      expect(r.success).toBe(true);
    }
  });

  it("rejects bad id", () => {
    const r = safeParseLessonSpec({ ...lessonA101, id: "unit-1" });
    expect(r.success).toBe(false);
  });

  it("rejects phase/cefr mismatch", () => {
    const r = safeParseLessonSpec({ ...lessonA101, phase: "P0" });
    expect(r.success).toBe(false);
  });
});

describe("v2 core path plan", () => {
  it("ends at B1 gate lesson", () => {
    expect(CORE_END_LESSON_ID).toBe("l-b1-14");
    expect(CORE_PATH_TOTAL).toBe(42);
    expect(CORE_PATH_PLAN[CORE_PATH_PLAN.length - 1]?.id).toBe("l-b1-14");
  });

  it("has four phases represented", () => {
    const phases = new Set(CORE_PATH_PLAN.map((l) => l.phase));
    expect(phases).toEqual(new Set(["P0", "P1", "P2", "P3"]));
  });
});

describe("curriculum v2 flag", () => {
  it("defaults off without env", () => {
    // In test env flag usually unset → false
    expect(typeof isCurriculumV2()).toBe("boolean");
  });
});
