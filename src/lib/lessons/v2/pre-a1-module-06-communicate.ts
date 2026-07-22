import { FAMILY_TARGETS } from "./pre-a1-module-06-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M06_COMMUNICATE: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m06-communicate",
  missionId: "pre-a1-m06",
  legacyUnitId: "unit-a0-6",
  titleVi: "Hỏi và giới thiệu hai người trong ảnh",
  titleEn: "Ask about and introduce two people",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 11,
  primaryOutcome: {
    id: "pre-a1-m06-communicate-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "personal",
    statementEn:
      "Can ask who a person is and give a familiar relationship and name in a short supported exchange.",
    statementVi:
      "Có thể hỏi một người là ai và nói mối quan hệ, tên trong một trao đổi ngắn có hỗ trợ.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 interaction about familiar people",
  },
  prerequisiteLessonIds: ["pre-a1-m06-encounter"],
  targets: FAMILY_TARGETS,
  steps: [
    {
      id: "m06c-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Cùng xem album nhân vật hư cấu",
      roleVi: "Bạn và một người bạn đang xem hai ảnh có nhiều người.",
      situationVi:
        "Bạn cần hỏi đúng người, nghe quan hệ và tên rồi xác nhận khi người kia chỉ chưa rõ.",
      goalVi: "Hoàn thành hỏi–đáp về hai người mà không đọc kịch bản.",
    },
    {
      id: "m06c-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe trao đổi có xác nhận người",
      replayRates: [0.8, 1],
      turns: [
        {
          speaker: "A",
          text: "Who is this?",
          targetIds: ["m06-who-this"],
        },
        {
          speaker: "B",
          text: "This is my brother. His name is Minh.",
          targetIds: ["m06-this-my", "m06-his-name"],
        },
        {
          speaker: "A",
          text: "This person?",
          targetIds: ["m06-confirm-person"],
        },
        {
          speaker: "B",
          text: "Yes. This is my sister. Her name is Lan.",
          targetIds: ["m06-this-my", "m06-her-name"],
        },
      ],
    },
    {
      id: "m06c-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Giữ chuỗi hỏi–quan hệ–tên",
      targetIds: [
        "m06-who-this",
        "m06-this-my",
        "m06-his-name",
        "m06-her-name",
        "m06-confirm-person",
      ],
      explanationVi:
        "Mỗi lượt chỉ cần ba việc: hỏi người, nói quan hệ, nói tên. Khi có nhiều người, chỉ và hỏi This person? trước khi tiếp tục.",
    },
    {
      id: "m06c-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Tạo từng lượt trao đổi",
      adaptive: true,
      exercises: [
        {
          id: "m06c-p1",
          kind: "listen",
          promptVi: "Tên người nữ được nhắc đến là gì?",
          audioText: "This is my sister. Her name is Lan.",
          options: ["Lan", "Minh", "Hoa"],
          answer: "Lan",
          targetIds: ["m06-this-my", "m06-her-name"],
        },
        {
          id: "m06c-p2",
          kind: "select",
          promptVi: "Chọn câu hỏi mở đầu để biết người trong ảnh.",
          options: ["Who is this?", "What color is it?", "How old is it?"],
          answer: "Who is this?",
          targetIds: ["m06-who-this"],
        },
        {
          id: "m06c-p3",
          kind: "order",
          promptVi: "Xếp câu nói tên người nam.",
          tokens: ["name", "Nam", "His", "is"],
          answer: "His name is Nam",
          targetIds: ["m06-his-name"],
        },
        {
          id: "m06c-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu: Đây là mẹ tôi.",
          answer: "This is my mother.",
          acceptedAnswers: ["This is my mother"],
          targetIds: ["m06-this-my"],
        },
        {
          id: "m06c-p5",
          kind: "recall",
          promptVi: "Ảnh có nhiều người. Tự nhớ câu xác nhận ngắn.",
          answer: "This person?",
          acceptedAnswers: ["This person"],
          targetIds: ["m06-confirm-person"],
        },
      ],
    },
    {
      id: "m06c-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Chuẩn bị hai cặp dữ kiện",
      promptVi:
        "Thẻ A: father/An. Thẻ B: mother/Hoa. Chỉ giữ từ khóa và quyết định dùng His hay Her.",
      keyWords: ["father — An — his", "mother — Hoa — her"],
      targetIds: ["m06-this-my", "m06-his-name", "m06-her-name"],
    },
    {
      id: "m06c-performance",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Hỏi–đáp về hai người",
      task: {
        roleVi: "Hai người xem album",
        contextVi:
          "Một người hỏi; người kia giới thiệu quan hệ và tên. Lượt hai có ba người trong ảnh.",
        goalVi:
          "Hỏi đúng người, cung cấp quan hệ và tên, rồi xác nhận khi chỉ chưa rõ.",
        promptVi:
          "Lượt một dùng father/An. Sau góp ý, lượt hai đổi sang mother/Hoa và dùng This person? trước khi trả lời.",
        successCriteriaVi: [
          "Bạn hoàn thành đủ câu hỏi, mối quan hệ và tên.",
          "His hoặc Her khớp với người được giới thiệu.",
          "Bạn dùng câu xác nhận khi ảnh có nhiều người.",
        ],
        targetIds: [
          "m06-who-this",
          "m06-this-my",
          "m06-his-name",
          "m06-her-name",
          "m06-confirm-person",
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
      id: "m06c-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa một lỗi rồi đổi ảnh",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn có nói cả mối quan hệ và tên không?",
        "His/Her có khớp với người được chỉ không?",
        "Khi có nhiều người, bạn có xác nhận đúng người trước không?",
      ],
    },
    {
      id: "m06c-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt trao đổi độc lập",
      canDoCheckVi:
        "Tôi hỏi và giới thiệu được hai người bằng mối quan hệ và tên.",
      reviewTargetIds: [
        "m06-who-this",
        "m06-this-my",
        "m06-his-name",
        "m06-her-name",
      ],
      confidencePromptVi:
        "Ở lượt hai, bạn có chọn đúng His/Her mà không nhìn khung không?",
    },
  ],
  tags: ["pre-a1", "module-06", "communicate", "family", "people"],
};
