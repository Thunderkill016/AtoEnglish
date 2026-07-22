import { APPOINTMENT_TARGETS } from "./pre-a1-module-07-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M07_RETAIN_TRANSFER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m07-retain-transfer",
  missionId: "pre-a1-m07",
  legacyUnitId: "unit-a0-7",
  titleVi: "Nhớ lại và xác nhận giờ nhận đồ",
  titleEn: "Recall and confirm a collection time",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 9,
  primaryOutcome: {
    id: "pre-a1-m07-retain-transfer-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can recall and transfer simple day-and-time language to confirm or correct a collection appointment after a delay.",
    statementVi:
      "Có thể nhớ lại và chuyển ngôn ngữ ngày–giờ sang tình huống xác nhận hoặc sửa lịch nhận đồ sau một khoảng trì hoãn.",
    source: "ato-adapted",
    sourceReference: "Delayed Pre-A1 transfer of simple appointment language",
  },
  prerequisiteLessonIds: ["pre-a1-m07-communicate"],
  targets: APPOINTMENT_TARGETS,
  steps: [
    {
      id: "m07r-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Xác nhận lịch nhận đồ",
      roleVi: "Bạn gọi để xác nhận thời gian nhận một món đồ đã sửa.",
      situationVi:
        "Nhân viên nói một ngày và giờ, sau đó nhắc lại sai ngày; bạn phải sửa.",
      goalVi: "Nhớ lại câu cũ trong bối cảnh mới mà không xem lại hội thoại trước.",
    },
    {
      id: "m07r-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Nghe bối cảnh mới một lần",
      replayRates: [0.85],
      turns: [
        { speaker: "Staff", text: "Tuesday is OK.", targetIds: ["m07-day-ok"] },
        { speaker: "Customer", text: "What time?", targetIds: ["m07-what-time"] },
        { speaker: "Staff", text: "At four o'clock.", targetIds: ["m07-at-oclock"] },
        { speaker: "Customer", text: "So, Tuesday at four?", targetIds: ["m07-confirm-slot"] },
      ],
    },
    {
      id: "m07r-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Giữ chức năng, đổi bối cảnh",
      targetIds: ["m07-what-time", "m07-at-oclock", "m07-confirm-slot", "m07-correct-slot"],
      explanationVi:
        "Câu hỏi và xác nhận không đổi dù đây là lịch nhận đồ thay vì lịch gặp. Chỉ ngày, giờ và vai giao tiếp thay đổi.",
    },
    {
      id: "m07r-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Delayed retrieval không nhìn mẫu",
      exercises: [
        {
          id: "m07r-p1",
          kind: "listen",
          promptVi: "Lịch nhận đồ là khi nào?",
          audioText: "Friday at four o'clock.",
          options: ["Thứ Năm lúc 4 giờ", "Thứ Sáu lúc 4 giờ", "Thứ Sáu lúc 5 giờ"],
          answer: "Thứ Sáu lúc 4 giờ",
          targetIds: ["m07-at-oclock", "m07-time-clarity"],
        },
        {
          id: "m07r-p2",
          kind: "select",
          promptVi: "Chọn câu xác nhận đầy đủ.",
          options: ["So, Friday at four?", "Friday?", "At four."],
          answer: "So, Friday at four?",
          targetIds: ["m07-confirm-slot"],
        },
        {
          id: "m07r-p3",
          kind: "order",
          promptVi: "Xếp câu: Thứ Sáu được.",
          tokens: ["OK", "Friday", "is"],
          answer: "Friday is OK",
          targetIds: ["m07-day-ok"],
        },
        {
          id: "m07r-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu hỏi giờ.",
          answer: "What time?",
          acceptedAnswers: ["What time"],
          targetIds: ["m07-what-time"],
        },
        {
          id: "m07r-p5",
          kind: "recall",
          promptVi: "Người kia nói nhầm Thursday/4; lịch đúng Friday/4. Tự sửa.",
          answer: "No, Friday at four.",
          acceptedAnswers: ["No Friday at four", "No, Friday at four"],
          targetIds: ["m07-correct-slot"],
        },
      ],
    },
    {
      id: "m07r-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Lập kế hoạch bằng ba ý",
      promptVi:
        "Chỉ nhìn ba ý: Friday — four — correct Thursday. Tự tạo lượt hỏi và xác nhận.",
      keyWords: ["Friday", "four", "not Thursday"],
      targetIds: ["m07-what-time", "m07-at-oclock", "m07-confirm-slot", "m07-correct-slot"],
    },
    {
      id: "m07r-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Transfer sang cuộc gọi nhận đồ",
      task: {
        roleVi: "Khách nhận đồ",
        contextVi:
          "Lượt một xác nhận Friday/4. Lượt hai đổi sang Saturday/2; nhân viên nhắc lại sai ngày.",
        goalVi: "Hỏi giờ, xác nhận slot và sửa sai trong cuộc gọi ngắn.",
        promptVi:
          "Không xem bài cũ. Lượt hai phải nói No rồi nhắc lại đầy đủ Saturday at two.",
        successCriteriaVi: [
          "Bạn hỏi và xác nhận được ngày cùng giờ.",
          "Người nghe biết chính xác slot cuối.",
          "Bạn sửa được thông tin sai mà không bỏ cuộc.",
        ],
        targetIds: ["m07-what-time", "m07-at-oclock", "m07-day-ok", "m07-confirm-slot", "m07-correct-slot"],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 10,
        responseSeconds: 25,
        rubric: ["task_achievement", "comprehensibility", "interaction_repair"],
      },
    },
    {
      id: "m07r-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Chẩn đoán lỗi transfer",
      priorityOrder: ["task_achievement", "comprehensibility", "interaction_repair"],
      repairPromptsVi: [
        "Bạn có giữ đúng thứ tự hỏi giờ → xác nhận → sửa không?",
        "Ngày và số giờ nào người nghe có thể ghi nhầm?",
        "Bạn có nói lại đầy đủ slot sau No không?",
      ],
    },
    {
      id: "m07r-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt nhớ lại và chuyển giao",
      canDoCheckVi:
        "Sau thời gian trì hoãn, tôi dùng lại được ngày–giờ để xác nhận và sửa lịch trong bối cảnh mới.",
      reviewTargetIds: ["m07-what-time", "m07-at-oclock", "m07-confirm-slot", "m07-correct-slot"],
      confidencePromptVi:
        "Bạn hoàn thành lượt hai mà không xem lại bài giao tiếp trước chứ?",
    },
  ],
  tags: ["pre-a1", "module-07", "retain-transfer", "time", "appointments"],
};
