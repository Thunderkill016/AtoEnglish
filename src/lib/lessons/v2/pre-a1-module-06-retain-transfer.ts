import { FAMILY_TARGETS } from "./pre-a1-module-06-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M06_RETAIN_TRANSFER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m06-retain-transfer",
  missionId: "pre-a1-m06",
  legacyUnitId: "unit-a0-6",
  titleVi: "Nhớ lại và xác định người liên hệ",
  titleEn: "Recall and identify a contact person",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 9,
  primaryOutcome: {
    id: "pre-a1-m06-retain-transfer-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can recall and use basic relationship and name phrases to identify the correct contact person in a new setting.",
    statementVi:
      "Có thể nhớ lại và dùng câu về mối quan hệ, tên để xác định đúng người liên hệ trong bối cảnh mới.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 transfer of basic personal information",
  },
  prerequisiteLessonIds: ["pre-a1-m06-communicate"],
  targets: FAMILY_TARGETS,
  steps: [
    {
      id: "m06r-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Chọn đúng người liên hệ trên thẻ",
      roleVi: "Bạn đang xác nhận người liên hệ cho một nhân vật hư cấu.",
      situationVi:
        "Có hai ảnh và hai tên. Nhân viên hỏi từng người là ai để chọn đúng thẻ.",
      goalVi: "Dùng lại câu quan hệ và tên trong bối cảnh biểu mẫu công cộng.",
    },
    {
      id: "m06r-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Nghe nhiệm vụ mới một lần",
      replayRates: [0.85],
      turns: [
        {
          speaker: "Staff",
          text: "Who is this?",
          targetIds: ["m06-who-this"],
        },
        {
          speaker: "Visitor",
          text: "This is my mother. Her name is Hoa.",
          targetIds: ["m06-this-my", "m06-her-name"],
        },
        {
          speaker: "Staff",
          text: "This person?",
          targetIds: ["m06-confirm-person"],
        },
        {
          speaker: "Visitor",
          text: "Yes. This is my father. His name is An.",
          targetIds: ["m06-this-my", "m06-his-name"],
        },
      ],
    },
    {
      id: "m06r-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Không nhìn lại album cũ",
      targetIds: [
        "m06-who-this",
        "m06-this-my",
        "m06-his-name",
        "m06-her-name",
      ],
      explanationVi:
        "Bối cảnh đã đổi sang xác nhận người liên hệ. Hãy tự nhớ cấu trúc, không đọc lại câu mẫu của bài trước.",
    },
    {
      id: "m06r-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Delayed recall và phân biệt người",
      adaptive: true,
      exercises: [
        {
          id: "m06r-p1",
          kind: "listen",
          promptVi: "Người liên hệ nào được nói tới?",
          audioText: "This is my mother. Her name is Hoa.",
          options: ["Mẹ tên Hoa", "Bố tên Hoa", "Chị gái tên An"],
          answer: "Mẹ tên Hoa",
          targetIds: ["m06-this-my", "m06-her-name"],
        },
        {
          id: "m06r-p2",
          kind: "select",
          promptVi: "Chọn câu đúng để nói tên người nam.",
          options: ["His name is An.", "Her name is An.", "He name is An."],
          answer: "His name is An.",
          targetIds: ["m06-his-name"],
        },
        {
          id: "m06r-p3",
          kind: "order",
          promptVi: "Xếp câu hỏi xác định người.",
          tokens: ["this", "is", "Who"],
          answer: "Who is this",
          targetIds: ["m06-who-this"],
        },
        {
          id: "m06r-p4",
          kind: "recall",
          promptVi: "Tự nhớ: Đây là bố tôi. Tên ông ấy là An.",
          answer: "This is my father. His name is An.",
          acceptedAnswers: [
            "This is my father His name is An",
            "This is my father. His name is An",
          ],
          targetIds: ["m06-this-my", "m06-his-name"],
        },
      ],
    },
    {
      id: "m06r-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Lập kế hoạch bằng dữ kiện",
      promptVi:
        "Thẻ 1: sister/Mai. Thẻ 2: brother/Nam. Chỉ nhìn dữ kiện và tự tạo câu.",
      keyWords: ["sister — Mai", "brother — Nam"],
      targetIds: ["m06-this-my", "m06-his-name", "m06-her-name"],
    },
    {
      id: "m06r-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Xác nhận người liên hệ hai lượt",
      task: {
        roleVi: "Người cung cấp thông tin liên hệ",
        contextVi:
          "Nhân viên chỉ vào một ảnh; bạn nói mối quan hệ và tên. Lượt hai nhân viên chỉ nhầm người.",
        goalVi:
          "Xác định đúng người và sửa việc chỉ nhầm trước khi nói tên.",
        promptVi:
          "Lượt một dùng sister/Mai. Lượt hai đổi sang brother/Nam và dùng This person? để xác nhận.",
        successCriteriaVi: [
          "Bạn nói đúng mối quan hệ và tên.",
          "Bạn chọn đúng His hoặc Her.",
          "Bạn xác nhận khi người kia chỉ chưa rõ.",
        ],
        targetIds: [
          "m06-this-my",
          "m06-his-name",
          "m06-her-name",
          "m06-confirm-person",
        ],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 10,
        responseSeconds: 20,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "interaction_repair",
        ],
      },
    },
    {
      id: "m06r-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Đánh dấu điều còn yếu",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn còn nhầm từ quan hệ nào?",
        "His/Her có làm người nghe hiểu sai người không?",
        "Bạn có xác nhận trước khi trả lời khi người kia chỉ nhầm không?",
      ],
    },
    {
      id: "m06r-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt retained và transfer",
      canDoCheckVi:
        "Tôi vẫn giới thiệu và xác định đúng người bằng mối quan hệ, tên trong bối cảnh mới.",
      reviewTargetIds: [
        "m06-who-this",
        "m06-this-my",
        "m06-his-name",
        "m06-her-name",
      ],
      confidencePromptVi:
        "Sau thời gian trì hoãn, bạn làm được lượt hai mà không xem lại bài cũ chứ?",
    },
  ],
  tags: ["pre-a1", "module-06", "retain-transfer", "family", "contact"],
};
