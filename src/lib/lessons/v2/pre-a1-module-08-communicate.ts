import { SURVIVAL_HELP_TARGETS } from "./pre-a1-module-08-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M08_COMMUNICATE: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m08-communicate",
  missionId: "pre-a1-m08",
  legacyUnitId: "unit-a0-8",
  titleVi: "Xin giúp và sửa lại vị trí",
  titleEn: "Ask for help and correct a location",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 11,
  primaryOutcome: {
    id: "pre-a1-m08-communicate-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can state a basic urgent need and location, request appropriate help, and correct one misunderstood place.",
    statementVi:
      "Có thể nói nhu cầu khẩn cấp cơ bản và vị trí, yêu cầu hỗ trợ phù hợp và sửa một địa điểm bị nghe nhầm.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 supported survival interaction",
  },
  prerequisiteLessonIds: ["pre-a1-m08-encounter"],
  targets: SURVIVAL_HELP_TARGETS,
  steps: [
    {
      id: "m08c-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Gọi quầy hỗ trợ",
      roleVi: "Bạn cần người trực quầy giúp chuyển thông tin.",
      situationVi:
        "Bạn nói vấn đề, địa điểm và người cần gọi; người trực quầy nghe nhầm địa điểm.",
      goalVi: "Sửa địa điểm để hỗ trợ đến đúng nơi.",
    },
    {
      id: "m08c-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe trao đổi có xác nhận sai",
      replayRates: [0.8, 1],
      turns: [
        {
          speaker: "Caller",
          text: "Help, please. I am hurt.",
          targetIds: ["m08-help", "m08-hurt"],
        },
        {
          speaker: "Caller",
          text: "I am at the park. Call a doctor, please.",
          targetIds: ["m08-location", "m08-call"],
        },
        {
          speaker: "Desk",
          text: "At the train station?",
          targetIds: ["m08-repeat-place"],
        },
        {
          speaker: "Caller",
          text: "No, at the park.",
          targetIds: ["m08-correct-place"],
        },
      ],
    },
    {
      id: "m08c-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Sửa bằng địa điểm đầy đủ",
      targetIds: ["m08-location", "m08-correct-place"],
      explanationVi:
        "Khi người kia nghe sai, nói No rồi nhắc lại cả cụm at the + place; không chỉ nói một từ rời.",
    },
    {
      id: "m08c-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Tạo từng lượt của cuộc gọi",
      adaptive: true,
      exercises: [
        {
          id: "m08c-p1",
          kind: "listen",
          promptVi: "Người trực quầy nghe nhầm điều gì?",
          audioText: "I am at the park. At the train station?",
          options: ["Vấn đề", "Địa điểm", "Người cần gọi"],
          answer: "Địa điểm",
          targetIds: ["m08-location", "m08-correct-place"],
        },
        {
          id: "m08c-p2",
          kind: "select",
          promptVi: "Chọn yêu cầu phù hợp khi một người bị đau.",
          options: [
            "Call a doctor, please.",
            "Call the bus station, please.",
            "Monday is OK.",
          ],
          answer: "Call a doctor, please.",
          targetIds: ["m08-hurt", "m08-call"],
        },
        {
          id: "m08c-p3",
          kind: "order",
          promptVi: "Xếp câu sửa vị trí.",
          tokens: ["park", "the", "at", "No"],
          answer: "No at the park",
          targetIds: ["m08-correct-place"],
        },
        {
          id: "m08c-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu yêu cầu nhắc lại địa điểm.",
          answer: "Please say the place again.",
          acceptedAnswers: ["Please say the place again"],
          targetIds: ["m08-repeat-place"],
        },
        {
          id: "m08c-p5",
          kind: "recall",
          promptVi: "Bạn bị lạc ở khách sạn. Tự nói hai câu ngắn.",
          answer: "I am lost. I am at the hotel.",
          acceptedAnswers: [
            "I am lost I am at the hotel",
            "I am lost. I am at the hotel",
          ],
          targetIds: ["m08-lost", "m08-location"],
        },
      ],
    },
    {
      id: "m08c-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Chuẩn bị hai tình huống",
      promptVi:
        "A: lost — hotel — police. B: hurt — park — doctor — desk hears station.",
      keyWords: [
        "lost / hotel / police",
        "hurt / park / doctor / correct station",
      ],
      targetIds: [
        "m08-help",
        "m08-lost",
        "m08-hurt",
        "m08-call",
        "m08-location",
        "m08-correct-place",
      ],
    },
    {
      id: "m08c-performance",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Hoàn thành cuộc gọi hai lượt",
      task: {
        roleVi: "Người gọi quầy hỗ trợ",
        contextVi:
          "Lượt một: lost/hotel/call police. Lượt hai: hurt/park/call doctor; người trực quầy xác nhận nhầm train station.",
        goalVi: "Nói đủ nhu cầu, vị trí, loại hỗ trợ và tự sửa địa điểm.",
        promptVi:
          "Không đọc kịch bản. Ở lượt hai phải nói No, at the park sau khi nghe nhầm.",
        successCriteriaVi: [
          "Người trực quầy hiểu đúng vấn đề và loại hỗ trợ.",
          "Địa điểm cuối cùng được xác nhận chính xác.",
          "Bạn tự sửa được địa điểm bị nghe nhầm.",
        ],
        targetIds: [
          "m08-help",
          "m08-lost",
          "m08-hurt",
          "m08-call",
          "m08-location",
          "m08-correct-place",
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
      id: "m08c-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa một lỗi rồi gọi lại",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn có nói vấn đề trước khi yêu cầu gọi hỗ trợ không?",
        "Địa điểm có đủ cụm at the + place không?",
        "Khi bị nghe nhầm, bạn có nói lại địa điểm đầy đủ không?",
      ],
    },
    {
      id: "m08c-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt cuộc gọi trợ giúp",
      canDoCheckVi:
        "Tôi nói được vấn đề, vị trí, yêu cầu trợ giúp và sửa một địa điểm bị nghe nhầm.",
      reviewTargetIds: [
        "m08-help",
        "m08-lost",
        "m08-hurt",
        "m08-call",
        "m08-location",
      ],
      confidencePromptVi:
        "Ở lượt hai, bạn tự sửa địa điểm mà không nhìn mẫu được không?",
    },
  ],
  tags: ["pre-a1", "module-08", "communicate", "survival", "repair"],
};
