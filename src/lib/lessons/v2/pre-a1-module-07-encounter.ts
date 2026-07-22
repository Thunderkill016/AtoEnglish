import { APPOINTMENT_TARGETS } from "./pre-a1-module-07-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M07_ENCOUNTER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m07-encounter",
  missionId: "pre-a1-m07",
  legacyUnitId: "unit-a0-7",
  titleVi: "Nhận ra ngày và giờ của một lịch hẹn",
  titleEn: "Recognise a simple appointment day and time",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 10,
  primaryOutcome: {
    id: "pre-a1-m07-encounter-outcome",
    level: "PRE_A1",
    activity: "reception",
    domain: "public",
    statementEn:
      "Can recognise a familiar day and whole-hour time in a very short supported appointment exchange.",
    statementVi:
      "Có thể nhận ra ngày quen thuộc và giờ tròn trong trao đổi lịch hẹn rất ngắn có hỗ trợ.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 reception of simple time and appointment information",
  },
  prerequisiteLessonIds: ["pre-a1-m06-retain-transfer"],
  targets: APPOINTMENT_TARGETS,
  steps: [
    {
      id: "m07e-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Nghe một lịch hẹn ngắn",
      roleVi: "Bạn cần ghi lại lịch hẹn từ một cuộc nói chuyện ngắn.",
      situationVi:
        "Người nói đề xuất một ngày và giờ tròn; sau đó nhắc lại để xác nhận.",
      goalVi: "Nhận ra đúng ngày, giờ và câu xác nhận.",
    },
    {
      id: "m07e-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe ngày và giờ hai tốc độ",
      replayRates: [0.65, 0.85],
      turns: [
        {
          speaker: "A",
          text: "Monday is OK.",
          translationVi: "Thứ Hai được.",
          targetIds: ["m07-day-ok"],
        },
        {
          speaker: "B",
          text: "What time?",
          translationVi: "Mấy giờ?",
          targetIds: ["m07-what-time"],
        },
        {
          speaker: "A",
          text: "At three o'clock.",
          translationVi: "Lúc ba giờ.",
          targetIds: ["m07-at-oclock"],
        },
        {
          speaker: "B",
          text: "So, Monday at three?",
          translationVi: "Vậy là thứ Hai lúc ba giờ nhé?",
          targetIds: ["m07-confirm-slot"],
        },
      ],
    },
    {
      id: "m07e-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nghe hai mốc: ngày và giờ",
      targetIds: ["m07-day-ok", "m07-at-oclock", "m07-time-clarity"],
      explanationVi:
        "Đừng cố nghe mọi từ. Trước tiên bắt ngày, sau đó bắt số giờ; câu So... ghép lại hai thông tin để xác nhận.",
    },
    {
      id: "m07e-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Nghe, chọn và tự nhớ",
      adaptive: true,
      exercises: [
        {
          id: "m07e-p1",
          kind: "listen",
          promptVi: "Lịch hẹn là khi nào?",
          audioText: "Tuesday at two o'clock.",
          options: ["Thứ Hai lúc 2 giờ", "Thứ Ba lúc 2 giờ", "Thứ Ba lúc 3 giờ"],
          answer: "Thứ Ba lúc 2 giờ",
          targetIds: ["m07-at-oclock", "m07-time-clarity"],
        },
        {
          id: "m07e-p2",
          kind: "select",
          promptVi: "Chọn câu hỏi về giờ.",
          options: ["What time?", "Who is this?", "What color is it?"],
          answer: "What time?",
          targetIds: ["m07-what-time"],
        },
        {
          id: "m07e-p3",
          kind: "order",
          promptVi: "Xếp câu: Lúc ba giờ.",
          tokens: ["o'clock", "three", "At"],
          answer: "At three o'clock",
          targetIds: ["m07-at-oclock"],
        },
        {
          id: "m07e-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu: Thứ Hai được.",
          answer: "Monday is OK.",
          acceptedAnswers: ["Monday is OK", "Monday is okay", "Monday is okay."],
          targetIds: ["m07-day-ok"],
        },
      ],
    },
    {
      id: "m07e-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Đổi ngày và giờ",
      promptVi:
        "Đọc khung Monday/three, rồi đổi sang Tuesday/two mà không nhìn bản dịch.",
      frameEn: "____ is OK. At ____ o'clock.",
      keyWords: ["Monday — three", "Tuesday — two"],
      targetIds: ["m07-day-ok", "m07-at-oclock"],
    },
    {
      id: "m07e-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Nói hai lịch trong 15 giây",
      task: {
        roleVi: "Người ghi lịch",
        contextVi: "Bạn có hai thẻ: Monday/3 và Tuesday/2.",
        goalVi: "Nói rõ ngày và giờ của từng thẻ.",
        promptVi:
          "Lượt một nói Monday/3. Lượt hai đổi sang Tuesday/2 và nhấn rõ số giờ.",
        successCriteriaVi: [
          "Bạn nói đúng ngày và giờ của từng thẻ.",
          "Người nghe phân biệt được two và three.",
        ],
        targetIds: ["m07-day-ok", "m07-at-oclock", "m07-time-clarity"],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 10,
        responseSeconds: 15,
        rubric: ["task_achievement", "comprehensibility"],
      },
    },
    {
      id: "m07e-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa tín hiệu ngày và giờ",
      priorityOrder: ["task_achievement", "comprehensibility"],
      repairPromptsVi: [
        "Bạn có nói đủ ngày trước giờ không?",
        "Số two/three có đủ rõ để người nghe ghi đúng không?",
      ],
    },
    {
      id: "m07e-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt thông tin lịch",
      canDoCheckVi:
        "Tôi nhận ra và nói được một ngày cùng giờ tròn trong lịch hẹn rất ngắn.",
      reviewTargetIds: [
        "m07-what-time",
        "m07-at-oclock",
        "m07-day-ok",
        "m07-confirm-slot",
      ],
      confidencePromptVi:
        "Không nhìn mẫu, bạn phân biệt được Tuesday at two và Monday at three chứ?",
    },
  ],
  tags: ["pre-a1", "module-07", "encounter", "time", "appointments"],
};
