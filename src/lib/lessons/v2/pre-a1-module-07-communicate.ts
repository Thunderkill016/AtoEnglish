import { APPOINTMENT_TARGETS } from "./pre-a1-module-07-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M07_COMMUNICATE: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m07-communicate",
  missionId: "pre-a1-m07",
  legacyUnitId: "unit-a0-7",
  titleVi: "Hỏi, chọn và xác nhận một lịch hẹn",
  titleEn: "Ask, choose and confirm a simple appointment",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 11,
  primaryOutcome: {
    id: "pre-a1-m07-communicate-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can ask for a whole-hour time, accept a familiar day and confirm or correct a simple appointment.",
    statementVi:
      "Có thể hỏi giờ tròn, chấp nhận một ngày quen thuộc và xác nhận hoặc sửa lịch hẹn đơn giản.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 interaction for simple time arrangements",
  },
  prerequisiteLessonIds: ["pre-a1-m07-encounter"],
  targets: APPOINTMENT_TARGETS,
  steps: [
    {
      id: "m07c-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Đặt lịch gặp ngắn",
      roleVi: "Bạn và một người khác cần chọn ngày và giờ.",
      situationVi:
        "Người kia đề xuất ngày; bạn hỏi giờ, rồi hai bên nhắc lại lịch để tránh nhầm.",
      goalVi: "Hoàn thành lịch hẹn có xác nhận và một lần sửa thông tin.",
    },
    {
      id: "m07c-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe trao đổi có sửa lịch",
      replayRates: [0.8, 1],
      turns: [
        {
          speaker: "A",
          text: "Monday?",
          targetIds: ["m07-day-ok"],
        },
        {
          speaker: "B",
          text: "Monday is OK. What time?",
          targetIds: ["m07-day-ok", "m07-what-time"],
        },
        {
          speaker: "A",
          text: "At two o'clock.",
          targetIds: ["m07-at-oclock"],
        },
        {
          speaker: "B",
          text: "So, Monday at three?",
          targetIds: ["m07-confirm-slot"],
        },
        {
          speaker: "A",
          text: "No, Monday at two.",
          targetIds: ["m07-correct-slot"],
        },
      ],
    },
    {
      id: "m07c-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Xác nhận toàn bộ slot",
      targetIds: ["m07-confirm-slot", "m07-correct-slot"],
      explanationVi:
        "Khi xác nhận, nói lại cả ngày và giờ. Nếu sai, bắt đầu bằng No rồi nói lại đúng slot; không chỉ nói một con số rời.",
    },
    {
      id: "m07c-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Tạo từng lượt của cuộc hẹn",
      adaptive: true,
      exercises: [
        {
          id: "m07c-p1",
          kind: "listen",
          promptVi: "Người kia xác nhận sai chi tiết nào?",
          audioText: "At two o'clock. So, Monday at three?",
          options: ["Ngày", "Giờ", "Cả ngày và giờ"],
          answer: "Giờ",
          targetIds: ["m07-at-oclock", "m07-confirm-slot"],
        },
        {
          id: "m07c-p2",
          kind: "select",
          promptVi: "Chọn câu chấp nhận ngày.",
          options: ["Monday is OK.", "At Monday.", "What Monday?"],
          answer: "Monday is OK.",
          targetIds: ["m07-day-ok"],
        },
        {
          id: "m07c-p3",
          kind: "order",
          promptVi: "Xếp câu xác nhận lịch.",
          tokens: ["three", "Monday", "at", "So"],
          answer: "So Monday at three",
          targetIds: ["m07-confirm-slot"],
        },
        {
          id: "m07c-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu hỏi về giờ.",
          answer: "What time?",
          acceptedAnswers: ["What time"],
          targetIds: ["m07-what-time"],
        },
        {
          id: "m07c-p5",
          kind: "recall",
          promptVi: "Lịch đúng là Tuesday/3. Tự nói câu sửa.",
          answer: "No, Tuesday at three.",
          acceptedAnswers: ["No Tuesday at three", "No, Tuesday at three"],
          targetIds: ["m07-correct-slot"],
        },
      ],
    },
    {
      id: "m07c-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Chuẩn bị hai slot",
      promptVi:
        "Slot A: Monday/2. Slot B: Tuesday/3. Chỉ giữ từ khóa, không viết cả hội thoại.",
      keyWords: ["Monday — 2", "Tuesday — 3", "confirm", "correct"],
      targetIds: [
        "m07-day-ok",
        "m07-what-time",
        "m07-at-oclock",
        "m07-confirm-slot",
        "m07-correct-slot",
      ],
    },
    {
      id: "m07c-performance",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Đặt và xác nhận lịch hai lượt",
      task: {
        roleVi: "Hai người đang đặt lịch",
        contextVi:
          "Lượt một dùng Monday/2. Lượt hai dùng Tuesday/3 và người kia cố ý xác nhận sai giờ.",
        goalVi: "Chọn ngày, hỏi giờ, xác nhận và tự sửa lịch sai.",
        promptVi:
          "Không đọc kịch bản. Lượt hai phải nói lại đầy đủ Tuesday at three sau khi nghe xác nhận sai.",
        successCriteriaVi: [
          "Bạn hoàn thành đủ ngày, giờ và câu xác nhận.",
          "Người nghe ghi đúng slot cuối cùng.",
          "Bạn tự sửa được ngày hoặc giờ sai.",
        ],
        targetIds: [
          "m07-what-time",
          "m07-at-oclock",
          "m07-day-ok",
          "m07-confirm-slot",
          "m07-correct-slot",
        ],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 15,
        responseSeconds: 25,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "interaction_repair",
        ],
      },
    },
    {
      id: "m07c-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa một lỗi lịch rồi làm lại",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn có hỏi What time? thay vì đoán giờ không?",
        "Câu xác nhận có chứa cả ngày và giờ không?",
        "Khi slot sai, bạn có nói lại đầy đủ thông tin đúng không?",
      ],
    },
    {
      id: "m07c-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt lịch độc lập",
      canDoCheckVi:
        "Tôi hỏi, chọn, xác nhận và sửa được một lịch hẹn có ngày và giờ tròn.",
      reviewTargetIds: [
        "m07-what-time",
        "m07-at-oclock",
        "m07-day-ok",
        "m07-confirm-slot",
        "m07-correct-slot",
      ],
      confidencePromptVi:
        "Ở lượt hai, bạn có tự sửa slot sai mà không nhìn khung câu không?",
    },
  ],
  tags: ["pre-a1", "module-07", "communicate", "time", "appointments"],
};
