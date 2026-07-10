import { describe, it, expect } from "vitest";
import {
  canMarkLessonComplete,
  meetsQuizFloor,
  mergeLessonRecords,
  QUIZ_FLOOR_RATIO,
  type LessonProgressRecord,
  type V2ProgressState,
} from "@/lib/v2/progress";
import {
  CompleteV2LessonSchema,
  SyncV2ProgressSchema,
} from "@/lib/security/validation";

describe("v2 quiz floor (TASK-187)", () => {
  it("exports soft floor 50%", () => {
    expect(QUIZ_FLOOR_RATIO).toBe(0.5);
  });

  it("meetsQuizFloor at and above half", () => {
    expect(meetsQuizFloor(2, 4)).toBe(true);
    expect(meetsQuizFloor(3, 5)).toBe(true);
    expect(meetsQuizFloor(5, 5)).toBe(true);
    expect(meetsQuizFloor(1, 2)).toBe(true);
  });

  it("fails below half or empty totals", () => {
    expect(meetsQuizFloor(1, 4)).toBe(false);
    expect(meetsQuizFloor(0, 5)).toBe(false);
    expect(meetsQuizFloor(2, 5)).toBe(false);
    expect(meetsQuizFloor(0, 0)).toBe(false);
    expect(meetsQuizFloor(-1, 4)).toBe(false);
  });

  it("canMarkLessonComplete blocks no task", () => {
    const r = canMarkLessonComplete({
      taskDone: false,
      quizCorrect: 5,
      quizTotal: 5,
      answeredCount: 5,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("no_task");
      expect(r.message_vi.length).toBeGreaterThan(10);
    }
  });

  it("canMarkLessonComplete blocks zero answers", () => {
    const r = canMarkLessonComplete({
      taskDone: true,
      quizCorrect: 0,
      quizTotal: 5,
      answeredCount: 0,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("no_answers");
      expect(r.message_vi).toMatch(/quiz|trả lời/i);
    }
  });

  it("canMarkLessonComplete blocks below floor with retry copy", () => {
    const r = canMarkLessonComplete({
      taskDone: true,
      quizCorrect: 1,
      quizTotal: 5,
      answeredCount: 5,
    });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.reason).toBe("below_floor");
      expect(r.message_vi).toMatch(/50%|Làm lại/i);
    }
  });

  it("canMarkLessonComplete allows task + floor met", () => {
    const r = canMarkLessonComplete({
      taskDone: true,
      quizCorrect: 3,
      quizTotal: 5,
      answeredCount: 5,
    });
    expect(r).toEqual({ ok: true });
  });
});

describe("v2 progress merge + schemas (TASK-279)", () => {
  const localBase: V2ProgressState = {
    completed: {
      "l-a1-01": {
        lessonId: "l-a1-01",
        completedAt: "2026-07-01T10:00:00.000Z",
        quizCorrect: 3,
        quizTotal: 5,
        taskDone: true,
      },
    },
    lastLessonId: "l-a1-01",
  };

  it("mergeLessonRecords unions remote-only lessons", () => {
    const remote: LessonProgressRecord[] = [
      {
        lessonId: "l-a1-02",
        completedAt: "2026-07-02T12:00:00.000Z",
        quizCorrect: 4,
        quizTotal: 5,
        taskDone: true,
      },
    ];
    const m = mergeLessonRecords(localBase, remote);
    expect(Object.keys(m.completed).sort()).toEqual(["l-a1-01", "l-a1-02"]);
    expect(m.lastLessonId).toBe("l-a1-02");
  });

  it("mergeLessonRecords keeps earlier completedAt and max quiz", () => {
    const remote: LessonProgressRecord[] = [
      {
        lessonId: "l-a1-01",
        completedAt: "2026-07-03T00:00:00.000Z",
        quizCorrect: 5,
        quizTotal: 5,
        taskDone: false,
      },
    ];
    const m = mergeLessonRecords(localBase, remote);
    const row = m.completed["l-a1-01"];
    expect(row.completedAt).toBe("2026-07-01T10:00:00.000Z");
    expect(row.quizCorrect).toBe(5);
    expect(row.quizTotal).toBe(5);
    expect(row.taskDone).toBe(true);
  });

  it("CompleteV2LessonSchema accepts valid payload", () => {
    const r = CompleteV2LessonSchema.safeParse({
      lessonId: "l-a0-03",
      quizCorrect: 2,
      quizTotal: 4,
      taskDone: true,
    });
    expect(r.success).toBe(true);
  });

  it("CompleteV2LessonSchema rejects bad lesson id", () => {
    const r = CompleteV2LessonSchema.safeParse({
      lessonId: "unit-1",
      quizCorrect: 1,
      quizTotal: 1,
      taskDone: true,
    });
    expect(r.success).toBe(false);
  });

  it("SyncV2ProgressSchema caps bulk records", () => {
    const records = Array.from({ length: 81 }, (_, i) => ({
      lessonId: `l-a1-${String((i % 12) + 1).padStart(2, "0")}`,
      completedAt: "2026-07-01T00:00:00.000Z",
      quizCorrect: 1,
      quizTotal: 1,
      taskDone: true,
    }));
    expect(SyncV2ProgressSchema.safeParse({ records }).success).toBe(false);
    expect(
      SyncV2ProgressSchema.safeParse({ records: records.slice(0, 2) }).success,
    ).toBe(true);
  });
});
