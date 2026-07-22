import { PRICE_TARGETS } from "./pre-a1-module-02-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M02_RETAIN_TRANSFER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m02-retain-transfer",
  missionId: "pre-a1-m02",
  legacyUnitId: "unit-a0-2",
  titleVi: "Nhớ lại giá và thanh toán trong bối cảnh mới",
  titleEn: "Recall and transfer a simple payment exchange",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 9,
  primaryOutcome: {
    id: "pre-a1-m02-retain-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can recall and reuse a short price and payment exchange in a different everyday purchase.",
    statementVi:
      "Có thể tự nhớ và dùng lại trao đổi hỏi giá, nghe số tiền và thanh toán trong tình huống mua hàng khác.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 transaction transfer",
  },
  prerequisiteLessonIds: ["pre-a1-m02-communicate"],
  targets: PRICE_TARGETS,
  steps: [
    {
      id: "m02r-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Gọi món ở quán ăn",
      roleVi: "Bạn là khách tại quán.",
      situationVi: "Bối cảnh đã đổi từ cửa hàng sang quán ăn và không còn khung câu.",
      goalVi: "Tự hỏi giá và chọn cách trả trong bối cảnh mới.",
    },
    {
      id: "m02r-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Nghe một mẫu mới duy nhất",
      replayRates: [0.9],
      turns: [
        {
          speaker: "Customer",
          text: "How much is it?",
          targetIds: ["m02-how-much"],
        },
        {
          speaker: "Server",
          text: "It is ten dollars.",
          targetIds: ["m02-price"],
        },
        {
          speaker: "Customer",
          text: "Card, please.",
          targetIds: ["m02-card"],
        },
      ],
    },
    {
      id: "m02r-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhận ra điều không đổi",
      targetIds: ["m02-how-much", "m02-price", "m02-cash", "m02-card"],
      explanationVi:
        "Địa điểm và giá thay đổi, nhưng ba chức năng vẫn là hỏi giá, nhận số tiền và chọn cách trả.",
    },
    {
      id: "m02r-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Delayed recall không nhìn mẫu",
      exercises: [
        {
          id: "m02r-p1",
          kind: "recall",
          promptVi: "Tự nhớ câu hỏi giá.",
          answer: "How much is it?",
          acceptedAnswers: ["How much is it"],
          targetIds: ["m02-how-much"],
        },
        {
          id: "m02r-p2",
          kind: "listen",
          promptVi: "Số tiền nào được nói?",
          audioText: "It is ten dollars.",
          options: ["2 đô-la", "10 đô-la", "20 đô-la"],
          answer: "10 đô-la",
          targetIds: ["m02-price"],
        },
        {
          id: "m02r-p3",
          kind: "select",
          promptVi: "Chọn câu thanh toán bằng thẻ.",
          options: ["Card, please.", "Cash, please.", "It is five dollars."],
          answer: "Card, please.",
          targetIds: ["m02-card"],
        },
        {
          id: "m02r-p4",
          kind: "order",
          promptVi: "Xếp câu trả tiền mặt.",
          tokens: ["please", "Cash"],
          answer: "Cash please",
          targetIds: ["m02-cash"],
        },
      ],
    },
    {
      id: "m02r-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Chuẩn bị bằng từ khóa thôi",
      promptVi:
        "Chỉ nhìn ba từ khóa rồi tự tạo trao đổi đầy đủ. Không quay lại bài trước.",
      keyWords: ["price", "ten", "card"],
      targetIds: ["m02-how-much", "m02-price", "m02-card"],
    },
    {
      id: "m02r-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Transfer sang quán ăn",
      task: {
        roleVi: "Khách tại quán ăn",
        contextVi: "Bạn hỏi giá hai món khác nhau; lần hai máy thẻ không hoạt động.",
        goalVi: "Tự hỏi giá và đổi từ card sang cash khi tình huống thay đổi.",
        promptVi:
          "Lượt một trả bằng thẻ. Lượt hai nghe giá mới rồi chuyển sang tiền mặt.",
        successCriteriaVi: [
          "Bạn tự tạo được câu hỏi giá trong bối cảnh mới.",
          "Bạn đổi cách thanh toán đúng khi máy thẻ không hoạt động.",
        ],
        targetIds: ["m02-how-much", "m02-price", "m02-cash", "m02-card"],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 10,
        responseSeconds: 20,
        rubric: ["task_achievement", "comprehensibility", "interaction_repair"],
      },
    },
    {
      id: "m02r-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Đánh giá giữ được và chuyển được",
      priorityOrder: ["task_achievement", "comprehensibility", "interaction_repair"],
      repairPromptsVi: [
        "Bạn có tự nhớ câu mà không mở bài cũ không?",
        "Bạn có đổi được card sang cash khi bối cảnh thay đổi không?",
      ],
    },
    {
      id: "m02r-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt evidence transfer",
      canDoCheckVi:
        "Tôi tự hỏi giá và chọn cách thanh toán trong một bối cảnh mua hàng mới.",
      reviewTargetIds: ["m02-how-much", "m02-price", "m02-cash", "m02-card"],
      confidencePromptVi: "Bạn làm được mà không cần mở lại bài communicate chứ?",
    },
  ],
  tags: ["pre-a1", "module-02", "retain-transfer", "transaction"],
};
