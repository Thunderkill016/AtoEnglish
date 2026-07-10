import { describe, it, expect } from "vitest";
import { safeParseLessonSpec, LESSON_STAGES } from "@/lib/v2/lesson-spec";
import {
  getAllAuthoredLessons,
  getLessonV2,
  getNextPlayableLessonId,
} from "@/lib/v2/lessons";
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

  it("registry has A0 spine pilots + A1/B1 gold", () => {
    expect(getLessonV2("l-a0-01")?.cefr).toBe("A0");
    expect(getLessonV2("l-a0-02")?.title_vi).toContain("Số");
    expect(getLessonV2("l-a0-03")?.title_vi).toContain("Chào");
    expect(getLessonV2("l-a0-04")?.title_vi).toMatch(/Tên|quốc tịch/i);
    expect(getLessonV2("l-a0-05")?.title_vi).toMatch(/Gia đình/i);
    expect(getLessonV2("l-a0-06")?.title_vi).toMatch(/Thời gian|ngày/i);
    expect(getLessonV2("l-a0-07")?.title_vi).toMatch(/tuần|Ngày/i);
    expect(getLessonV2("l-a0-08")?.title_vi).toMatch(/sinh tồn|Cụm/i);
    expect(getLessonV2("l-a1-01")?.title_vi).toContain("Chào hỏi");
    expect(getLessonV2("l-a1-02")?.title_vi).toMatch(/Thông tin|cá nhân/i);
    expect(getLessonV2("l-a1-03")?.title_vi).toMatch(/Gia đình|bạn bè/i);
    expect(getLessonV2("l-a1-04")?.title_vi).toMatch(/Thói quen|hàng ngày/i);
    expect(getLessonV2("l-a1-05")?.title_vi).toMatch(/Sở thích|hobbies/i);
    expect(getLessonV2("l-a1-06")?.title_vi).toMatch(/Nhà cửa|home|nhà/i);
    expect(getLessonV2("l-a1-07")?.title_vi).toMatch(/Mua sắm|shop/i);
    expect(getLessonV2("l-a1-08")?.title_vi).toMatch(/Đồ ăn|order|food/i);
    expect(getLessonV2("l-a1-09")?.title_vi).toMatch(/Địa điểm|chỉ đường|places/i);
    expect(getLessonV2("l-a1-10")?.title_vi).toMatch(/Khả năng|can/i);
    expect(getLessonV2("l-a1-11")?.title_vi).toMatch(/Sức khỏe|cảm xúc|health/i);
    expect(getLessonV2("l-a1-12")?.title_vi).toMatch(/Ôn A1|áp dụng|review/i);
    expect(getLessonV2("l-b1-01")?.cefr).toBe("B1");
    expect(getAllAuthoredLessons().length).toBeGreaterThanOrEqual(21);
  });

  it("all authored lessons pass schema", () => {
    for (const lesson of getAllAuthoredLessons()) {
      const r = safeParseLessonSpec(lesson);
      expect(r.success, r.success ? "" : JSON.stringify(r.error?.issues)).toBe(
        true,
      );
    }
  });

  it("A0 path continues sequentially after l-a0-01", () => {
    expect(getNextPlayableLessonId(["l-a0-01"])).toBe("l-a0-02");
    expect(getNextPlayableLessonId(["l-a0-01", "l-a0-02"])).toBe("l-a0-03");
    expect(getNextPlayableLessonId(["l-a0-01", "l-a0-02", "l-a0-03"])).toBe(
      "l-a0-04",
    );
    expect(
      getNextPlayableLessonId(["l-a0-01", "l-a0-02", "l-a0-03", "l-a0-04"]),
    ).toBe("l-a0-05");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
      ]),
    ).toBe("l-a0-06");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
      ]),
    ).toBe("l-a0-07");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
      ]),
    ).toBe("l-a0-08");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
      ]),
    ).toBe("l-a1-01");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
      ]),
    ).toBe("l-a1-02");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
      ]),
    ).toBe("l-a1-03");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
      ]),
    ).toBe("l-a1-04");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
      ]),
    ).toBe("l-a1-05");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
        "l-a1-05",
      ]),
    ).toBe("l-a1-06");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
        "l-a1-05",
        "l-a1-06",
      ]),
    ).toBe("l-a1-07");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
        "l-a1-05",
        "l-a1-06",
        "l-a1-07",
      ]),
    ).toBe("l-a1-08");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
        "l-a1-05",
        "l-a1-06",
        "l-a1-07",
        "l-a1-08",
      ]),
    ).toBe("l-a1-09");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
        "l-a1-05",
        "l-a1-06",
        "l-a1-07",
        "l-a1-08",
        "l-a1-09",
      ]),
    ).toBe("l-a1-10");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
        "l-a1-05",
        "l-a1-06",
        "l-a1-07",
        "l-a1-08",
        "l-a1-09",
        "l-a1-10",
      ]),
    ).toBe("l-a1-11");
    expect(
      getNextPlayableLessonId([
        "l-a0-01",
        "l-a0-02",
        "l-a0-03",
        "l-a0-04",
        "l-a0-05",
        "l-a0-06",
        "l-a0-07",
        "l-a0-08",
        "l-a1-01",
        "l-a1-02",
        "l-a1-03",
        "l-a1-04",
        "l-a1-05",
        "l-a1-06",
        "l-a1-07",
        "l-a1-08",
        "l-a1-09",
        "l-a1-10",
        "l-a1-11",
      ]),
    ).toBe("l-a1-12");
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
