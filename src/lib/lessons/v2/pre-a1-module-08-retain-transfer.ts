import { SURVIVAL_HELP_TARGETS } from "./pre-a1-module-08-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M08_RETAIN_TRANSFER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m08-retain-transfer",
  missionId: "pre-a1-m08",
  legacyUnitId: "unit-a0-8",
  titleVi: "Nhớ lại và báo tình huống tại nơi mới",
  titleEn: "Recall and report a help situation in a new place",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 9,
  primaryOutcome: {
    id: "pre-a1-m08-retain-transfer-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can recall and transfer a short help message to a different public setting after a delay.",
    statementVi:
      "Có thể nhớ lại và chuyển một thông điệp xin giúp ngắn sang bối cảnh công cộng khác sau một khoảng trì hoãn.",
    source: "ato-adapted",
    sourceReference: "Ato delayed recall and transfer of Pre-A1 survival language",
  },
  prerequisiteLessonIds: ["pre-a1-m08-communicate"],
  targets: SURVIVAL_HELP_TARGETS,
  steps: [
    {
      id: "m08r-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Báo sự cố tại trung tâm cộng đồng",
      roleVi: "Bạn tìm thấy điện thoại hỗ trợ ở một địa điểm mới.",
      situationVi:
        "Bạn phải tự nhớ câu cứu nguy, nói vị trí và sửa lại khi đầu dây nghe sai.",
      goalVi: "Dùng lại ngôn ngữ cũ mà không nhìn khung của bài trước.",
    },
    {
      id: "m08r-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Nghe một mẫu transfer ngắn",
      replayRates: [0.9],
      turns: [
        {
          speaker: "Caller",
          text: "Help, please. I am lost. I am at the market.",
          targetIds: ["m08-help", "m08-lost", "m08-location"],
        },
        {
          speaker: "Desk",
          text: "At the hotel?",
          targetIds: ["m08-repeat-place"],
        },
        {
          speaker: "Caller",
          text: "No, at the market.",
          targetIds: ["m08-correct-place"],
        },
      ],
    },
    {
      id: "m08r-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Đổi bối cảnh, giữ chức năng",
      targetIds: ["m08-help", "m08-location", "m08-correct-place"],
      explanationVi:
        "Bối cảnh và địa điểm thay đổi nhưng chuỗi chức năng vẫn là: xin giúp — nói vấn đề — nói vị trí — yêu cầu hoặc sửa.",
    },
    {
      id: "m08r-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Delayed recall không nhìn bài cũ",
      adaptive: true,
      exercises: [
        {
          id: "m08r-p1",
          kind: "listen",
          promptVi: "Vị trí cuối cùng đúng là đâu?",
          audioText: "I am at the market. At the hotel? No, at the market.",
          options: ["Chợ", "Khách sạn", "Công viên"],
          answer: "Chợ",
          targetIds: ["m08-location", "m08-correct-place"],
        },
        {
          id: "m08r-p2",
          kind: "select",
          promptVi: "Chọn thông điệp phù hợp khi bị đau ở nhà ga.",
          options: [
            "I am hurt. I am at the train station.",
            "I am lost. Monday is OK.",
            "I live in the train station.",
          ],
          answer: "I am hurt. I am at the train station.",
          targetIds: ["m08-hurt", "m08-location"],
        },
        {
          id: "m08r-p3",
          kind: "order",
          promptVi: "Xếp câu yêu cầu gọi cảnh sát.",
          tokens: ["please", "police", "the", "Call"],
          answer: "Call the police please",
          targetIds: ["m08-call"],
        },
        {
          id: "m08r-p4",
          kind: "recall",
          promptVi: "Tự nói: Làm ơn giúp tôi. Tôi bị lạc.",
          answer: "Help, please. I am lost.",
          acceptedAnswers: [
            "Help please I am lost",
            "Help, please. I am lost",
          ],
          targetIds: ["m08-help", "m08-lost"],
        },
      ],
    },
    {
      id: "m08r-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Chuẩn bị bằng bốn từ khóa",
      promptVi:
        "Tình huống A: lost/market/police. Tình huống B: hurt/train station/doctor; đầu dây nghe bus station.",
      keyWords: [
        "lost — market — police",
        "hurt — train station — doctor — correct",
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
      id: "m08r-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Transfer thông điệp hai lượt",
      task: {
        roleVi: "Người cần trợ giúp ở địa điểm mới",
        contextVi:
          "Lượt một: lost/market/call police. Lượt hai: hurt/train station/call doctor; đầu dây nghe nhầm bus station.",
        goalVi: "Tự tạo thông điệp và sửa địa điểm sai.",
        promptVi:
          "Không xem lại bài communicate. Chỉ dùng thẻ dữ kiện và nói trong tối đa 25 giây.",
        successCriteriaVi: [
          "Thông điệp có vấn đề, vị trí và loại hỗ trợ.",
          "Người nghe ghi đúng địa điểm cuối cùng.",
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
        preparationSeconds: 10,
        responseSeconds: 25,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "interaction_repair",
        ],
      },
    },
    {
      id: "m08r-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Đánh dấu phần chưa giữ được",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn quên vấn đề, vị trí hay loại hỗ trợ?",
        "Từ khóa sống còn nào chưa đủ rõ?",
        "Bạn có sửa lại cả cụm địa điểm không?",
      ],
    },
    {
      id: "m08r-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt retained và transfer",
      canDoCheckVi:
        "Sau trì hoãn, tôi vẫn tự tạo được thông điệp xin giúp ở một địa điểm mới.",
      reviewTargetIds: [
        "m08-help",
        "m08-lost",
        "m08-hurt",
        "m08-call",
        "m08-location",
      ],
      confidencePromptVi:
        "Bạn hoàn thành lượt hai chỉ bằng thẻ dữ kiện và có tự sửa được không?",
    },
  ],
  tags: [
    "pre-a1",
    "module-08",
    "retain-transfer",
    "survival",
    "delayed-recall",
  ],
};
