import { describe, it, expect } from "vitest";
import {
  canMarkLessonComplete,
  meetsQuizFloor,
  QUIZ_FLOOR_RATIO,
} from "@/lib/v2/progress";

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
