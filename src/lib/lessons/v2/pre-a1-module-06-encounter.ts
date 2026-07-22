import { FAMILY_TARGETS } from "./pre-a1-module-06-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M06_ENCOUNTER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m06-encounter",
  missionId: "pre-a1-m06",
  legacyUnitId: "unit-a0-6",
  titleVi: "Nhận ra người thân, mối quan hệ và tên",
  titleEn: "Recognise family relationships and names",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 10,
  primaryOutcome: {
    id: "pre-a1-m06-encounter-outcome",
    level: "PRE_A1",
    activity: "reception",
    domain: "personal",
    statementEn:
      "Can recognise who a familiar person is, the relationship word and a short statement of his or her name.",
    statementVi:
      "Có thể nhận ra một người quen là ai, từ chỉ quan hệ và câu ngắn nói tên của người đó.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 reception of basic personal and family information",
  },
  prerequisiteLessonIds: ["pre-a1-m05-retain-transfer"],
  targets: FAMILY_TARGETS,
  steps: [
    {
      id: "m06e-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Xem hai thẻ gia đình giả định",
      roleVi: "Bạn đang xem thẻ ảnh của hai nhân vật hư cấu.",
      situationVi:
        "Người nói chỉ vào từng ảnh và cho biết mối quan hệ cùng tên.",
      goalVi: "Nhận ra đúng người, quan hệ và tên mà không cần hiểu mọi từ.",
    },
    {
      id: "m06e-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe hai lượt giới thiệu người",
      replayRates: [0.65, 0.85],
      turns: [
        {
          speaker: "A",
          text: "Who is this?",
          translationVi: "Đây là ai?",
          targetIds: ["m06-who-this"],
        },
        {
          speaker: "B",
          text: "This is my brother.",
          translationVi: "Đây là anh/em trai tôi.",
          targetIds: ["m06-this-my"],
        },
        {
          speaker: "B",
          text: "His name is Minh.",
          translationVi: "Tên anh ấy là Minh.",
          targetIds: ["m06-his-name"],
        },
        {
          speaker: "A",
          text: "Who is this?",
          translationVi: "Đây là ai?",
          targetIds: ["m06-who-this"],
        },
        {
          speaker: "B",
          text: "This is my sister. Her name is Lan.",
          translationVi: "Đây là chị/em gái tôi. Tên cô ấy là Lan.",
          targetIds: ["m06-this-my", "m06-her-name"],
        },
      ],
    },
    {
      id: "m06e-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhìn dấu hiệu his và her",
      targetIds: ["m06-his-name", "m06-her-name", "m06-he-she"],
      explanationVi:
        "His name báo tên người nam; Her name báo tên người nữ. Hãy nghe cả từ quan hệ và his/her trước tên.",
    },
    {
      id: "m06e-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Nghe, chọn và tự nhớ",
      adaptive: true,
      exercises: [
        {
          id: "m06e-p1",
          kind: "listen",
          promptVi: "Người nói đang giới thiệu ai?",
          audioText: "This is my brother. His name is Minh.",
          options: ["Anh/em trai tên Minh", "Chị/em gái tên Minh", "Người bán tên Minh"],
          answer: "Anh/em trai tên Minh",
          targetIds: ["m06-this-my", "m06-his-name"],
        },
        {
          id: "m06e-p2",
          kind: "select",
          promptVi: "Chọn câu nói tên của một người nữ.",
          options: ["Her name is Lan.", "His name is Lan.", "My name Lan."],
          answer: "Her name is Lan.",
          targetIds: ["m06-her-name"],
        },
        {
          id: "m06e-p3",
          kind: "order",
          promptVi: "Xếp câu: Đây là chị/em gái tôi.",
          tokens: ["sister", "my", "is", "This"],
          answer: "This is my sister",
          targetIds: ["m06-this-my"],
        },
        {
          id: "m06e-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu hỏi: Đây là ai?",
          answer: "Who is this?",
          acceptedAnswers: ["Who is this"],
          targetIds: ["m06-who-this"],
        },
      ],
    },
    {
      id: "m06e-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Đổi người và tên",
      promptVi:
        "Đọc khung với brother/Minh, rồi đổi sang sister/Lan mà không nhìn bản dịch.",
      frameEn: "This is my ____. His/Her name is ____.",
      keyWords: ["brother — Minh", "sister — Lan"],
      targetIds: ["m06-this-my", "m06-his-name", "m06-her-name"],
    },
    {
      id: "m06e-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Giới thiệu hai thẻ trong 15 giây",
      task: {
        roleVi: "Người xem thẻ ảnh",
        contextVi: "Bạn có hai thẻ hư cấu: brother/Minh và sister/Lan.",
        goalVi: "Nói mối quan hệ và tên đúng cho từng thẻ.",
        promptVi:
          "Lượt một nói thẻ brother/Minh. Lượt hai đổi sang sister/Lan.",
        successCriteriaVi: [
          "Bạn dùng đúng This is my... cho mối quan hệ.",
          "Bạn dùng đúng His name hoặc Her name trước tên.",
        ],
        targetIds: ["m06-this-my", "m06-his-name", "m06-her-name"],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 10,
        responseSeconds: 15,
        rubric: ["task_achievement", "comprehensibility"],
      },
    },
    {
      id: "m06e-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa chỗ dễ nhầm",
      priorityOrder: ["task_achievement", "comprehensibility"],
      repairPromptsVi: [
        "Bạn có nói rõ từ quan hệ brother hoặc sister không?",
        "His và Her có khớp với người trên thẻ không?",
      ],
    },
    {
      id: "m06e-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt tín hiệu gia đình",
      canDoCheckVi:
        "Tôi nhận ra được người, mối quan hệ và tên trong lời giới thiệu rất ngắn.",
      reviewTargetIds: [
        "m06-who-this",
        "m06-this-my",
        "m06-his-name",
        "m06-her-name",
      ],
      confidencePromptVi:
        "Không nhìn mẫu, bạn phân biệt được His name và Her name chứ?",
    },
  ],
  tags: ["pre-a1", "module-06", "encounter", "family", "people"],
};
