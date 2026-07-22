import { describe, expect, it } from "vitest";

import type { LessonV2 } from "./schema";
import { calculateLessonMinutes, validateLessonV2 } from "./validate";

const validPreA1Lesson: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-introduce-yourself-core",
  missionId: "mission-pre-a1-introduce-yourself",
  legacyUnitId: "unit-a0-1",
  titleVi: "Giới thiệu tên và công việc",
  titleEn: "Introduce your name and job",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 11,
  primaryOutcome: {
    id: "pre-a1-spoken-production-personal-info",
    level: "PRE_A1",
    activity: "production",
    domain: "occupational",
    statementEn:
      "Can use isolated words and basic expressions to give simple information about their name and job.",
    statementVi:
      "Có thể dùng từ và cụm từ cơ bản để nói tên và công việc của mình.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 general linguistic range",
  },
  prerequisiteLessonIds: [],
  targets: [
    {
      id: "name",
      kind: "chunk",
      form: "My name is ...",
      meaningVi: "Tên tôi là...",
      exampleEn: "My name is Minh.",
      exampleVi: "Tên tôi là Minh.",
      priority: "core",
      l1NoteVi: "Không bỏ động từ is.",
    },
    {
      id: "job",
      kind: "chunk",
      form: "I work as ...",
      meaningVi: "Tôi làm nghề...",
      exampleEn: "I work as a delivery driver.",
      exampleVi: "Tôi làm tài xế giao hàng.",
      priority: "core",
    },
    {
      id: "slowly",
      kind: "repair_strategy",
      form: "Could you speak more slowly, please?",
      meaningVi: "Bạn có thể nói chậm hơn được không?",
      exampleEn: "Could you speak more slowly, please?",
      exampleVi: "Bạn có thể nói chậm hơn được không?",
      priority: "core",
    },
  ],
  steps: [
    {
      id: "need",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Ngày đầu đi làm",
      roleVi: "Bạn là nhân viên mới",
      situationVi: "Một đồng nghiệp nước ngoài hỏi tên và công việc của bạn.",
      goalVi: "Giới thiệu tên, nghề và biết cách nhờ họ nói chậm hơn.",
    },
    {
      id: "model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe đoạn mẫu",
      replayRates: [0.7, 0.9],
      turns: [
        {
          speaker: "Alex",
          text: "Hello. What is your name?",
          translationVi: "Xin chào. Bạn tên là gì?",
        },
        {
          speaker: "Minh",
          text: "My name is Minh. I work as a delivery driver.",
          translationVi: "Tên tôi là Minh. Tôi làm tài xế giao hàng.",
          targetIds: ["name", "job"],
        },
      ],
    },
    {
      id: "notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhận ra ba cụm quan trọng",
      targetIds: ["name", "job", "slowly"],
    },
    {
      id: "practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Nhớ và ghép câu",
      adaptive: true,
      exercises: [
        {
          id: "select-name",
          kind: "select",
          promptVi: "Chọn câu nói tên đúng.",
          options: ["My name is Minh.", "My name Minh."],
          answer: "My name is Minh.",
          targetIds: ["name"],
        },
        {
          id: "recall-job",
          kind: "recall",
          promptVi: "Tôi làm tài xế giao hàng.",
          answer: "I work as a delivery driver.",
          targetIds: ["job"],
        },
      ],
    },
    {
      id: "rehearse",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Tạo câu của bạn",
      promptVi: "Thay tên và nghề của bạn vào khung.",
      frameEn: "My name is ____. I work as ____.",
      targetIds: ["name", "job"],
    },
    {
      id: "perform",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Nói hai lần",
      task: {
        roleVi: "Nhân viên mới",
        contextVi: "Gặp đồng nghiệp quốc tế lần đầu",
        goalVi: "Nói tên, nghề và dùng câu cứu nguy nếu cần",
        promptVi: "Giới thiệu bản thân trong 10–20 giây.",
        successCriteriaVi: [
          "Người nghe biết tên của bạn",
          "Người nghe biết công việc của bạn",
        ],
        targetIds: ["name", "job", "slowly"],
        evidence: ["asr_transcript", "task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 20,
        responseSeconds: 20,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "language_control",
        ],
      },
    },
    {
      id: "feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa một điểm quan trọng",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "language_control",
      ],
      repairPromptsVi: [
        "Bạn đã nói đủ tên và nghề chưa?",
        "Thử nói chậm hơn và giữ âm cuối rõ hơn.",
      ],
    },
    {
      id: "exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Tự kiểm tra",
      canDoCheckVi: "Tôi có thể nói tên và nghề của mình mà không cần đọc cả câu.",
      reviewTargetIds: ["name", "job", "slowly"],
      confidencePromptVi: "Bạn tự tin dùng đoạn này ngoài đời ở mức nào?",
    },
  ],
  tags: ["speaking-first", "occupational", "pre-a1"],
};

describe("Lesson System V2 validator", () => {
  it("accepts an aligned Pre-A1 speaking lesson", () => {
    expect(calculateLessonMinutes(validPreA1Lesson)).toBe(11);
    expect(validateLessonV2(validPreA1Lesson)).toEqual([]);
  });

  it("rejects bulk that exceeds the level target budget", () => {
    const lesson: LessonV2 = {
      ...validPreA1Lesson,
      targets: [
        ...validPreA1Lesson.targets,
        ...["a", "b", "c"].map((id) => ({
          id,
          kind: "chunk" as const,
          form: id,
          meaningVi: id,
          exampleEn: `Example ${id}`,
          exampleVi: `Ví dụ ${id}`,
          priority: "core" as const,
        })),
      ],
    };

    expect(validateLessonV2(lesson).some((v) => v.path === "targets")).toBe(true);
  });

  it("rejects a speaking lesson with only one attempt", () => {
    const lesson: LessonV2 = {
      ...validPreA1Lesson,
      steps: validPreA1Lesson.steps.map((step) =>
        step.kind === "performance"
          ? { ...step, task: { ...step.task, attempts: 1 } }
          : step,
      ),
    };

    expect(
      validateLessonV2(lesson).some((v) =>
        v.path.includes("performance.task.attempts"),
      ),
    ).toBe(true);
  });

  it("rejects references to missing targets", () => {
    const lesson: LessonV2 = {
      ...validPreA1Lesson,
      steps: validPreA1Lesson.steps.map((step) =>
        step.kind === "notice"
          ? { ...step, targetIds: [...step.targetIds, "missing"] }
          : step,
      ),
    };

    expect(
      validateLessonV2(lesson).some((v) => v.message.includes("missing")),
    ).toBe(true);
  });
});
