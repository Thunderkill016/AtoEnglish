import { OBJECT_TARGETS } from "./pre-a1-module-03-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M03_RETAIN_TRANSFER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m03-retain-transfer",
  missionId: "pre-a1-m03",
  legacyUnitId: "unit-a0-3",
  titleVi: "Nhớ lại và mô tả đồ thất lạc",
  titleEn: "Recall and describe a lost object",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 9,
  primaryOutcome: {
    id: "pre-a1-m03-retain-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can recall and reuse a short object-and-colour exchange to identify a lost item in a new setting.",
    statementVi:
      "Có thể tự nhớ và dùng lại trao đổi về tên, màu để nhận diện đồ thất lạc ở bối cảnh mới.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 transfer with familiar concrete objects",
  },
  prerequisiteLessonIds: ["pre-a1-m03-communicate"],
  targets: OBJECT_TARGETS,
  steps: [
    {
      id: "m03r-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Quầy đồ thất lạc",
      roleVi: "Bạn đang tìm đồ bị bỏ quên.",
      situationVi:
        "Nhân viên chỉ vào nhiều món đồ. Bạn không còn khung câu từ bài trước.",
      goalVi: "Tự nhận diện đúng đồ vật bằng tên và màu.",
    },
    {
      id: "m03r-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Nghe một mẫu trong bối cảnh mới",
      replayRates: [0.9],
      turns: [
        {
          speaker: "Staff",
          text: "What is this?",
          targetIds: ["m03-what-this"],
        },
        {
          speaker: "Learner",
          text: "This is a phone.",
          targetIds: ["m03-this-is"],
        },
        {
          speaker: "Staff",
          text: "What color is it?",
          targetIds: ["m03-what-color"],
        },
        {
          speaker: "Learner",
          text: "It is blue.",
          targetIds: ["m03-it-is-color"],
        },
      ],
    },
    {
      id: "m03r-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhận ra phần có thể thay đổi",
      targetIds: [
        "m03-what-this",
        "m03-this-is",
        "m03-what-color",
        "m03-it-is-color",
      ],
      explanationVi:
        "Bối cảnh đổi sang quầy đồ thất lạc, nhưng hai câu hỏi và hai khung trả lời vẫn giữ nguyên.",
    },
    {
      id: "m03r-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Delayed recall không mở bài cũ",
      exercises: [
        {
          id: "m03r-p1",
          kind: "recall",
          promptVi: "Tự nhớ câu hỏi tên đồ vật.",
          answer: "What is this?",
          acceptedAnswers: ["What is this"],
          targetIds: ["m03-what-this"],
        },
        {
          id: "m03r-p2",
          kind: "listen",
          promptVi: "Đồ vật có màu gì?",
          audioText: "It is blue.",
          options: ["Đỏ", "Đen", "Xanh dương"],
          answer: "Xanh dương",
          targetIds: ["m03-it-is-color"],
        },
        {
          id: "m03r-p3",
          kind: "select",
          promptVi: "Chọn câu xác nhận món đang được chỉ.",
          options: ["This one?", "How much is it?", "Cash, please."],
          answer: "This one?",
          targetIds: ["m03-this-one"],
        },
        {
          id: "m03r-p4",
          kind: "order",
          promptVi: "Xếp câu: Đây là một chiếc điện thoại.",
          tokens: ["phone", "a", "is", "This"],
          answer: "This is a phone",
          targetIds: ["m03-this-is"],
        },
      ],
    },
    {
      id: "m03r-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Chuẩn bị chỉ bằng ba từ khóa",
      promptVi:
        "Nhìn ba từ khóa rồi tự tạo trao đổi đầy đủ. Không quay lại bài communicate.",
      keyWords: ["bag", "black", "this one"],
      targetIds: ["m03-this-is", "m03-it-is-color", "m03-this-one"],
    },
    {
      id: "m03r-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Transfer sang quầy đồ thất lạc",
      task: {
        roleVi: "Người tìm đồ thất lạc",
        contextVi:
          "Nhân viên đưa ra hai chiếc túi giống nhau nhưng khác màu.",
        goalVi: "Nói tên, màu và xác nhận đúng chiếc túi của bạn.",
        promptVi:
          "Lượt một chọn túi đen. Lượt hai đổi sang điện thoại xanh và dùng This one? khi nhân viên chỉ nhầm.",
        successCriteriaVi: [
          "Bạn tự nói được tên và màu mà không mở bài cũ.",
          "Bạn dùng This one? để sửa việc chỉ nhầm đồ.",
        ],
        targetIds: ["m03-this-is", "m03-it-is-color", "m03-this-one"],
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
      id: "m03r-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Đánh giá nhớ và chuyển được",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn có tự nhớ đủ khung This is a... và It is... không?",
        "Người nghe có phân biệt được màu bạn nói không?",
        "Bạn có xác nhận lại khi nhân viên chỉ sai đồ không?",
      ],
    },
    {
      id: "m03r-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt evidence transfer",
      canDoCheckVi:
        "Tôi tự mô tả được tên, màu và xác nhận một đồ vật trong bối cảnh mới.",
      reviewTargetIds: [
        "m03-what-this",
        "m03-this-is",
        "m03-what-color",
        "m03-it-is-color",
      ],
      confidencePromptVi:
        "Bạn làm được mà không cần mở lại bài communicate chứ?",
    },
  ],
  tags: ["pre-a1", "module-03", "retain-transfer", "objects", "lost-property"],
};
