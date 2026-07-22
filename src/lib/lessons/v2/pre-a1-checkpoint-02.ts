import type { LanguageTarget, LessonV2 } from "./schema";

const CHECKPOINT_02_TARGETS: LanguageTarget[] = [
  {
    id: "cp02-personal",
    kind: "discourse_move",
    form: "I am ... years old. I am from ... I live in ...",
    meaningVi: "Cung cấp ba thông tin cá nhân cơ bản.",
    exampleEn: "I am twenty years old. I am from Vietnam. I live in Hue.",
    exampleVi: "Tôi 20 tuổi. Tôi đến từ Việt Nam. Tôi sống ở Huế.",
    priority: "core",
  },
  {
    id: "cp02-contact",
    kind: "discourse_move",
    form: "This is my ... His/Her name is ...",
    meaningVi: "Xác định một người liên hệ và nói tên.",
    exampleEn: "This is my sister. Her name is Lan.",
    exampleVi: "Đây là chị/em gái tôi. Tên cô ấy là Lan.",
    priority: "core",
  },
  {
    id: "cp02-appointment",
    kind: "discourse_move",
    form: "Monday is OK. At two o'clock. So, Monday at two?",
    meaningVi: "Chọn và xác nhận ngày–giờ.",
    exampleEn: "Monday is OK. At two o'clock.",
    exampleVi: "Thứ Hai được. Lúc hai giờ.",
    priority: "core",
  },
  {
    id: "cp02-help",
    kind: "discourse_move",
    form: "Help, please. I am lost/hurt. Call ..., please.",
    meaningVi: "Nói vấn đề và yêu cầu loại hỗ trợ cần thiết.",
    exampleEn: "Help, please. I am hurt. Call a doctor, please.",
    exampleVi: "Làm ơn giúp tôi. Tôi bị đau. Làm ơn gọi bác sĩ.",
    priority: "core",
  },
  {
    id: "cp02-location-repair",
    kind: "repair_strategy",
    form: "I am at ... No, at the ...",
    meaningVi: "Nói và sửa lại vị trí khi bị nghe nhầm.",
    exampleEn: "I am at the park. No, at the park.",
    exampleVi: "Tôi ở công viên. Không, ở công viên.",
    priority: "core",
  },
];

export const PRE_A1_CHECKPOINT_02: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-checkpoint-02",
  missionId: "pre-a1-checkpoint-02",
  titleVi: "Checkpoint 2: Hoàn thành nhiệm vụ tại quầy hỗ trợ",
  titleEn: "Checkpoint 2: Complete a community help-desk mission",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 12,
  primaryOutcome: {
    id: "pre-a1-checkpoint-02-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can give basic personal and contact details, confirm a simple appointment, and report a help need with a location.",
    statementVi:
      "Có thể cung cấp thông tin cá nhân và người liên hệ, xác nhận lịch hẹn đơn giản và báo nhu cầu trợ giúp kèm vị trí.",
    source: "ato-adapted",
    sourceReference: "Integrated Pre-A1 checkpoint for modules 5 to 8",
  },
  prerequisiteLessonIds: [
    "pre-a1-m05-retain-transfer",
    "pre-a1-m06-retain-transfer",
    "pre-a1-m07-retain-transfer",
    "pre-a1-m08-retain-transfer",
  ],
  targets: CHECKPOINT_02_TARGETS,
  steps: [
    {
      id: "cp02-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Hoàn thành hồ sơ và xử lý tình huống",
      roleVi: "Bạn đang làm việc với quầy hỗ trợ cộng đồng.",
      situationVi:
        "Bạn cung cấp thông tin cá nhân, chỉ người liên hệ, xác nhận lịch rồi báo một tình huống cần giúp.",
      goalVi: "Kết hợp bốn module cuối trong một nhiệm vụ có thay đổi dữ kiện.",
    },
    {
      id: "cp02-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe toàn bộ nhiệm vụ một lần",
      replayRates: [0.85],
      turns: [
        {
          speaker: "Visitor",
          text: "I am twenty years old. I am from Vietnam. I live in Hue.",
          targetIds: ["cp02-personal"],
        },
        {
          speaker: "Visitor",
          text: "This is my sister. Her name is Lan.",
          targetIds: ["cp02-contact"],
        },
        {
          speaker: "Desk",
          text: "Monday?",
          targetIds: ["cp02-appointment"],
        },
        {
          speaker: "Visitor",
          text: "Monday is OK. At two o'clock.",
          targetIds: ["cp02-appointment"],
        },
        {
          speaker: "Visitor",
          text: "Help, please. I am lost. I am at the bus station.",
          targetIds: ["cp02-help", "cp02-location-repair"],
        },
        {
          speaker: "Desk",
          text: "At the train station?",
          targetIds: ["cp02-location-repair"],
        },
        {
          speaker: "Visitor",
          text: "No, at the bus station.",
          targetIds: ["cp02-location-repair"],
        },
      ],
    },
    {
      id: "cp02-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Không học câu mới, chỉ chọn đúng chức năng",
      targetIds: [
        "cp02-personal",
        "cp02-contact",
        "cp02-appointment",
        "cp02-help",
        "cp02-location-repair",
      ],
      explanationVi:
        "Checkpoint yêu cầu chuyển nhanh giữa bốn nhiệm vụ: hồ sơ — người liên hệ — lịch — trợ giúp. Dữ kiện thay đổi ở lượt hai.",
    },
    {
      id: "cp02-practice",
      kind: "practice",
      estimatedMinutes: 3,
      titleVi: "Retrieval xen kẽ Modules 5–8",
      exercises: [
        {
          id: "cp02-p1",
          kind: "listen",
          promptVi: "Người nói sống ở đâu?",
          audioText:
            "I am twenty years old. I am from Vietnam. I live in Hue.",
          options: ["Huế", "Việt Nam", "20 tuổi"],
          answer: "Huế",
          targetIds: ["cp02-personal"],
        },
        {
          id: "cp02-p2",
          kind: "select",
          promptVi: "Chọn câu giới thiệu người liên hệ nữ.",
          options: [
            "This is my sister. Her name is Lan.",
            "This is my brother. Her name is Lan.",
            "I live in Lan.",
          ],
          answer: "This is my sister. Her name is Lan.",
          targetIds: ["cp02-contact"],
        },
        {
          id: "cp02-p3",
          kind: "order",
          promptVi: "Xếp câu xác nhận lịch.",
          tokens: ["two", "Monday", "at", "So"],
          answer: "So Monday at two",
          targetIds: ["cp02-appointment"],
        },
        {
          id: "cp02-p4",
          kind: "recall",
          promptVi: "Tự nhớ câu nói bạn bị lạc.",
          answer: "I am lost.",
          acceptedAnswers: ["I am lost"],
          targetIds: ["cp02-help"],
        },
        {
          id: "cp02-p5",
          kind: "recall",
          promptVi: "Vị trí đúng là park, người kia nghe hotel. Tự nói câu sửa.",
          answer: "No, at the park.",
          acceptedAnswers: ["No at the park", "No, at the park"],
          targetIds: ["cp02-location-repair"],
        },
      ],
    },
    {
      id: "cp02-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Lập kế hoạch bằng bốn cụm dữ kiện",
      promptVi:
        "A: 20/Vietnam/Hue — sister/Lan — Monday/2 — lost/bus station. B: 22/Japan/Osaka — brother/Ken — Tuesday/3 — hurt/park/doctor.",
      keyWords: [
        "personal",
        "contact",
        "day/time",
        "help/location/correct",
      ],
      targetIds: [
        "cp02-personal",
        "cp02-contact",
        "cp02-appointment",
        "cp02-help",
        "cp02-location-repair",
      ],
    },
    {
      id: "cp02-performance",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Thực hiện checkpoint cuối hai lượt",
      task: {
        roleVi: "Khách tại quầy hỗ trợ cộng đồng",
        contextVi:
          "Lượt một dùng bộ A. Lượt hai dùng bộ B; nhân viên xác nhận sai giờ và sai địa điểm.",
        goalVi:
          "Cung cấp thông tin, xác định người liên hệ, xác nhận lịch và báo tình huống trợ giúp.",
        promptVi:
          "Không đọc kịch bản. Lượt hai phải sửa Tuesday at three và No, at the park.",
        successCriteriaVi: [
          "Người nghe ghi đúng thông tin cá nhân và người liên hệ.",
          "Ngày–giờ cuối cùng được xác nhận chính xác.",
          "Vấn đề, loại trợ giúp và địa điểm cuối cùng đều rõ.",
          "Bạn tự sửa được thông tin bị nghe nhầm.",
        ],
        targetIds: [
          "cp02-personal",
          "cp02-contact",
          "cp02-appointment",
          "cp02-help",
          "cp02-location-repair",
        ],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 20,
        responseSeconds: 25,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "interaction_repair",
        ],
      },
    },
    {
      id: "cp02-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Xác định module cần học bù",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn thiếu nhóm thông tin cá nhân, người liên hệ, lịch hay trợ giúp?",
        "Ngày–giờ hoặc địa điểm nào người nghe ghi sai?",
        "Bạn có tự sửa cả cụm thông tin thay vì chỉ nói một từ không?",
      ],
    },
    {
      id: "cp02-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Hoàn tất Pre-A1",
      canDoCheckVi:
        "Tôi kết hợp được thông tin cá nhân, gia đình, lịch hẹn và câu cứu nguy trong nhiệm vụ mới.",
      reviewTargetIds: [
        "cp02-personal",
        "cp02-contact",
        "cp02-appointment",
        "cp02-help",
        "cp02-location-repair",
      ],
      confidencePromptVi:
        "Bạn hoàn thành lượt hai chỉ bằng dữ kiện và tự sửa được cả giờ lẫn địa điểm chứ?",
    },
  ],
  tags: [
    "pre-a1",
    "checkpoint",
    "integration",
    "modules-05-08",
    "level-complete",
  ],
};
