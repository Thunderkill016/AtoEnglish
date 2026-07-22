import { SURVIVAL_HELP_TARGETS } from "./pre-a1-module-08-targets";
import type { LessonV2 } from "./schema";

export const PRE_A1_M08_ENCOUNTER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m08-encounter",
  missionId: "pre-a1-m08",
  legacyUnitId: "unit-a0-8",
  titleVi: "Nhận ra nhu cầu trợ giúp và vị trí",
  titleEn: "Recognise a basic help request and location",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 10,
  primaryOutcome: {
    id: "pre-a1-m08-encounter-outcome",
    level: "PRE_A1",
    activity: "reception",
    domain: "public",
    statementEn:
      "Can recognise a very short request for help, whether a person is lost or hurt, and a familiar location.",
    statementVi:
      "Có thể nhận ra lời xin giúp rất ngắn, người nói đang bị lạc hay bị đau và một vị trí quen thuộc.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 reception of basic survival information",
  },
  prerequisiteLessonIds: ["pre-a1-m07-retain-transfer"],
  targets: SURVIVAL_HELP_TARGETS,
  steps: [
    {
      id: "m08e-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Nghe một người cần giúp",
      roleVi: "Bạn đang ở quầy thông tin công cộng.",
      situationVi:
        "Một người dùng các câu rất ngắn để nói vấn đề và vị trí.",
      goalVi: "Nhận ra họ cần gì và đang ở đâu.",
    },
    {
      id: "m08e-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe hai tình huống sinh tồn ngắn",
      replayRates: [0.65, 0.85],
      turns: [
        {
          speaker: "A",
          text: "Help, please. I am lost.",
          translationVi: "Làm ơn giúp tôi. Tôi đang bị lạc.",
          targetIds: ["m08-help", "m08-lost"],
        },
        {
          speaker: "B",
          text: "Where are you?",
          translationVi: "Bạn đang ở đâu?",
        },
        {
          speaker: "A",
          text: "I am at the bus station.",
          translationVi: "Tôi đang ở bến xe buýt.",
          targetIds: ["m08-location"],
        },
        {
          speaker: "C",
          text: "Help, please. I am hurt.",
          translationVi: "Làm ơn giúp tôi. Tôi đang bị đau.",
          targetIds: ["m08-help", "m08-hurt"],
        },
        {
          speaker: "C",
          text: "Call a doctor, please.",
          translationVi: "Làm ơn gọi bác sĩ.",
          targetIds: ["m08-call"],
        },
      ],
    },
    {
      id: "m08e-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nghe từ khóa vấn đề và địa điểm",
      targetIds: ["m08-lost", "m08-hurt", "m08-location"],
      explanationVi:
        "lost báo bị lạc; hurt báo bị đau. Sau I am at, hãy nghe từ địa điểm quan trọng.",
    },
    {
      id: "m08e-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Nghe, chọn và tự nhớ câu cứu nguy",
      adaptive: true,
      exercises: [
        {
          id: "m08e-p1",
          kind: "listen",
          promptVi: "Người nói đang gặp vấn đề gì?",
          audioText: "Help, please. I am lost.",
          options: ["Bị lạc", "Bị đau", "Muốn đặt lịch"],
          answer: "Bị lạc",
          targetIds: ["m08-help", "m08-lost"],
        },
        {
          id: "m08e-p2",
          kind: "select",
          promptVi: "Chọn câu yêu cầu gọi bác sĩ.",
          options: [
            "Call a doctor, please.",
            "I am at the doctor.",
            "What time, doctor?",
          ],
          answer: "Call a doctor, please.",
          targetIds: ["m08-call"],
        },
        {
          id: "m08e-p3",
          kind: "order",
          promptVi: "Xếp câu: Tôi đang ở công viên.",
          tokens: ["park", "the", "at", "am", "I"],
          answer: "I am at the park",
          targetIds: ["m08-location"],
        },
        {
          id: "m08e-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu: Tôi đang bị đau.",
          answer: "I am hurt.",
          acceptedAnswers: ["I am hurt"],
          targetIds: ["m08-hurt"],
        },
      ],
    },
    {
      id: "m08e-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Đổi vấn đề và địa điểm",
      promptVi:
        "Thẻ A: lost — bus station. Thẻ B: hurt — park — doctor. Chỉ dùng từ khóa.",
      frameEn: "Help, please. I am ____. I am at ____. Call ____, please.",
      keyWords: ["lost — bus station", "hurt — park — doctor"],
      targetIds: [
        "m08-help",
        "m08-lost",
        "m08-hurt",
        "m08-call",
        "m08-location",
      ],
    },
    {
      id: "m08e-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Nói thông điệp cứu nguy hai lượt",
      task: {
        roleVi: "Người cần trợ giúp",
        contextVi:
          "Lượt một dùng lost/bus station. Lượt hai dùng hurt/park/doctor.",
        goalVi: "Nói rõ vấn đề, vị trí và loại hỗ trợ cần thiết.",
        promptVi:
          "Mỗi lượt nói một thông điệp ngắn, không đọc nguyên câu mẫu.",
        successCriteriaVi: [
          "Người nghe xác định đúng bạn bị lạc hay bị đau.",
          "Người nghe xác định đúng vị trí và hỗ trợ cần gọi.",
        ],
        targetIds: [
          "m08-help",
          "m08-lost",
          "m08-hurt",
          "m08-call",
          "m08-location",
        ],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 10,
        responseSeconds: 15,
        rubric: ["task_achievement", "comprehensibility"],
      },
    },
    {
      id: "m08e-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa thông tin sống còn",
      priorityOrder: ["task_achievement", "comprehensibility"],
      repairPromptsVi: [
        "Bạn có nói rõ lost hay hurt không?",
        "Địa điểm có đứng sau I am at không?",
        "Loại hỗ trợ cần gọi có được nói rõ không?",
      ],
    },
    {
      id: "m08e-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt thông điệp trợ giúp",
      canDoCheckVi:
        "Tôi nhận ra và nói được một thông điệp rất ngắn về vấn đề, vị trí và trợ giúp.",
      reviewTargetIds: [
        "m08-help",
        "m08-lost",
        "m08-hurt",
        "m08-call",
        "m08-location",
      ],
      confidencePromptVi:
        "Không nhìn mẫu, bạn nói được vấn đề và vị trí trong một lượt chứ?",
    },
  ],
  tags: ["pre-a1", "module-08", "encounter", "survival", "help"],
};
