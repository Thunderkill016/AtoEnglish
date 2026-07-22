import type { LessonV2 } from "./schema";

const sharedTargets = {
  name: {
    id: "m01-name",
    kind: "chunk" as const,
    form: "My name is ...",
    meaningVi: "Tên tôi là...",
    exampleEn: "My name is Lan.",
    exampleVi: "Tên tôi là Lan.",
    priority: "core" as const,
  },
  spell: {
    id: "m01-spell",
    kind: "chunk" as const,
    form: "It is L-A-N.",
    meaningVi: "Tên đó được đánh vần là L-A-N.",
    exampleEn: "It is L-A-N.",
    exampleVi: "Đánh vần là L-A-N.",
    priority: "core" as const,
    pronunciationGoal: "Đọc từng chữ cái tách rõ, không nuốt chữ.",
  },
  repeat: {
    id: "m01-repeat",
    kind: "repair_strategy" as const,
    form: "Please say that again.",
    meaningVi: "Xin hãy nói lại.",
    exampleEn: "Sorry. Please say that again.",
    exampleVi: "Xin lỗi. Xin hãy nói lại.",
    priority: "core" as const,
  },
  slow: {
    id: "m01-slow",
    kind: "repair_strategy" as const,
    form: "Please speak slowly.",
    meaningVi: "Xin hãy nói chậm.",
    exampleEn: "Please speak slowly.",
    exampleVi: "Xin hãy nói chậm.",
    priority: "core" as const,
  },
};

export const PRE_A1_M01_ENCOUNTER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m01-encounter",
  missionId: "pre-a1-m01",
  legacyUnitId: "unit-a0-1",
  titleVi: "Nhận ra câu nói tên và câu cứu nguy",
  titleEn: "Recognise name and repair phrases",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 10,
  primaryOutcome: {
    id: "pre-a1-m01-encounter-outcome",
    level: "PRE_A1",
    activity: "reception",
    domain: "occupational",
    statementEn:
      "Can recognise a person's name, a spelling sequence and two basic requests for repetition or slower speech.",
    statementVi:
      "Có thể nhận ra tên, chuỗi đánh vần và hai câu yêu cầu nói lại hoặc nói chậm.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 reception and interaction repair",
  },
  prerequisiteLessonIds: [],
  targets: [
    sharedTargets.name,
    sharedTargets.spell,
    sharedTargets.repeat,
    sharedTargets.slow,
  ],
  steps: [
    {
      id: "m01e-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Ngày đầu nhận thẻ tên",
      roleVi: "Bạn là nhân viên mới.",
      situationVi:
        "Lễ tân hỏi tên và cách đánh vần. Họ nói nhanh hơn mức bạn hiểu.",
      goalVi:
        "Nhận ra câu hỏi về tên, chuỗi chữ cái và câu dùng khi cần hỗ trợ.",
    },
    {
      id: "m01e-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe cuộc trao đổi ngắn",
      replayRates: [0.65, 0.85],
      turns: [
        {
          speaker: "Receptionist",
          text: "What is your name?",
          translationVi: "Tên bạn là gì?",
        },
        {
          speaker: "Learner",
          text: "My name is Lan.",
          translationVi: "Tên tôi là Lan.",
          targetIds: ["m01-name"],
        },
        {
          speaker: "Receptionist",
          text: "How do you spell that?",
          translationVi: "Tên đó đánh vần thế nào?",
        },
        {
          speaker: "Learner",
          text: "Please speak slowly.",
          translationVi: "Xin hãy nói chậm.",
          targetIds: ["m01-slow"],
        },
        {
          speaker: "Learner",
          text: "It is L-A-N.",
          translationVi: "Đánh vần là L-A-N.",
          targetIds: ["m01-spell"],
        },
      ],
    },
    {
      id: "m01e-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhìn bốn tín hiệu quan trọng",
      targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
      explanationVi:
        "Đừng cố dịch mọi từ. Chỉ cần nhận ra câu nói tên, chuỗi chữ cái và hai câu cứu nguy.",
    },
    {
      id: "m01e-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Nghe, chọn và tự nhớ",
      adaptive: true,
      exercises: [
        {
          id: "m01e-p1",
          kind: "listen",
          promptVi: "Người nói đang làm gì?",
          audioText: "My name is Minh.",
          options: ["Nói tên", "Xin nói chậm", "Tạm biệt"],
          answer: "Nói tên",
          targetIds: ["m01-name"],
        },
        {
          id: "m01e-p2",
          kind: "select",
          promptVi: "Chọn câu xin người khác nói lại.",
          options: [
            "Please say that again.",
            "My name is Lan.",
            "It is L-A-N.",
          ],
          answer: "Please say that again.",
          targetIds: ["m01-repeat"],
        },
        {
          id: "m01e-p3",
          kind: "order",
          promptVi: "Xếp câu yêu cầu nói chậm.",
          tokens: ["slowly", "Please", "speak"],
          answer: "Please speak slowly",
          targetIds: ["m01-slow"],
        },
        {
          id: "m01e-p4",
          kind: "recall",
          promptVi: "Nói bằng tiếng Anh: Tên tôi là An.",
          answer: "My name is An.",
          targetIds: ["m01-name"],
        },
      ],
    },
    {
      id: "m01e-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Thử với tên thật",
      promptVi:
        "Thay tên thật vào khung. Đọc một lần rồi che câu và nói lại.",
      frameEn: "My name is ____. It is __-__-__.",
      keyWords: ["name", "spell"],
      targetIds: ["m01-name", "m01-spell"],
    },
    {
      id: "m01e-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Phản xạ 15 giây",
      task: {
        roleVi: "Nhân viên mới",
        contextVi:
          "Bạn nghe câu hỏi về tên, sau đó người đối diện hỏi cách đánh vần.",
        goalVi: "Nói tên và đánh vần đủ để người nghe ghi lại.",
        promptVi:
          "Trả lời hai câu hỏi. Lượt hai, người đối diện nói nhanh hơn.",
        successCriteriaVi: [
          "Người nghe nhận được đúng tên.",
          "Bạn đọc từng chữ cái đủ rõ.",
          "Bạn nhận ra lúc cần yêu cầu nói chậm hoặc nói lại.",
        ],
        targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 20,
        responseSeconds: 15,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "interaction_repair",
        ],
      },
    },
    {
      id: "m01e-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa một điểm cản trở nghĩa",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Tên hoặc chữ cái nào người nghe chưa nhận ra?",
        "Bạn có nhận ra lúc cần dùng câu cứu nguy không?",
      ],
    },
    {
      id: "m01e-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Chốt điều đã nhận ra",
      canDoCheckVi:
        "Tôi nhận ra câu nói tên, chuỗi đánh vần và câu yêu cầu nói lại hoặc nói chậm.",
      reviewTargetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
      confidencePromptVi: "Không nhìn bản dịch, bạn nhận ra được mấy câu?",
    },
  ],
  tags: ["pre-a1", "module-01", "encounter", "occupational"],
};

export const PRE_A1_M01_COMMUNICATE: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m01-communicate",
  missionId: "pre-a1-m01",
  legacyUnitId: "unit-a0-1",
  titleVi: "Nói và đánh vần tên trong trao đổi thật",
  titleEn: "Say and spell your name",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 10,
  primaryOutcome: {
    id: "pre-a1-m01-communicate-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "occupational",
    statementEn:
      "Can give a name, spell it and ask a cooperative listener to repeat or speak slowly.",
    statementVi:
      "Có thể nói tên, đánh vần và xin người đối diện lặp lại hoặc nói chậm.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 interaction and phonological control",
  },
  prerequisiteLessonIds: ["pre-a1-m01-encounter"],
  targets: [
    sharedTargets.name,
    sharedTargets.spell,
    sharedTargets.repeat,
    sharedTargets.slow,
  ],
  steps: [
    {
      id: "m01c-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Lễ tân nhập sai tên",
      roleVi: "Bạn là nhân viên mới.",
      situationVi:
        "Lễ tân nghe nhầm một chữ cái trong tên và cần bạn sửa lại.",
      goalVi:
        "Nói tên, đánh vần và chủ động dùng câu cứu nguy khi nghe chưa rõ.",
    },
    {
      id: "m01c-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Xem cách sửa hiểu nhầm",
      replayRates: [0.7, 0.9],
      turns: [
        {
          speaker: "Receptionist",
          text: "Is your name Lan?",
          translationVi: "Tên bạn là Lan phải không?",
        },
        {
          speaker: "Learner",
          text: "No. My name is Nam. It is N-A-M.",
          translationVi: "Không. Tên tôi là Nam. Đánh vần N-A-M.",
          targetIds: ["m01-name", "m01-spell"],
        },
        {
          speaker: "Receptionist",
          text: "N-E-M?",
          translationVi: "N-E-M phải không?",
        },
        {
          speaker: "Learner",
          text: "Please say that again.",
          translationVi: "Xin hãy nói lại.",
          targetIds: ["m01-repeat"],
        },
      ],
    },
    {
      id: "m01c-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Phân biệt trả lời và sửa thông tin",
      targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
      explanationVi:
        "Khi bị nghe sai, nói lại tên trước, sau đó đánh vần. Nếu câu hỏi quá nhanh, dùng câu cứu nguy trước khi trả lời.",
    },
    {
      id: "m01c-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Lấy lại câu không nhìn mẫu",
      adaptive: true,
      exercises: [
        {
          id: "m01c-p1",
          kind: "listen",
          promptVi: "Tên nào được đánh vần?",
          audioText: "It is M-I-N-H.",
          options: ["Minh", "Mai", "Nam"],
          answer: "Minh",
          targetIds: ["m01-spell"],
        },
        {
          id: "m01c-p2",
          kind: "recall",
          promptVi: "Nói bằng tiếng Anh: Xin hãy nói lại.",
          answer: "Please say that again.",
          targetIds: ["m01-repeat"],
        },
        {
          id: "m01c-p3",
          kind: "recall",
          promptVi: "Nói bằng tiếng Anh: Xin hãy nói chậm.",
          answer: "Please speak slowly.",
          targetIds: ["m01-slow"],
        },
        {
          id: "m01c-p4",
          kind: "order",
          promptVi: "Xếp câu sửa tên.",
          tokens: ["Nam", "is", "name", "My"],
          answer: "My name is Nam",
          targetIds: ["m01-name"],
        },
      ],
    },
    {
      id: "m01c-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Chuẩn bị ba từ khóa",
      promptVi:
        "Chỉ ghi tên, chuỗi chữ cái và một câu cứu nguy. Không viết cả đoạn.",
      frameEn:
        "My name is ____. It is __-__-__. Please say that again / speak slowly.",
      keyWords: ["name", "letters", "repair"],
      targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
    },
    {
      id: "m01c-performance",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Trao đổi 20 giây — hai lượt",
      task: {
        roleVi: "Người nhận thẻ tên",
        contextVi:
          "Lễ tân hỏi tên, nghe sai một chữ cái và nói nhanh ở câu tiếp theo.",
        goalVi:
          "Đưa đúng tên, sửa chữ cái sai và dùng câu hỗ trợ đúng lúc.",
        promptVi:
          "Lượt một nhìn ba từ khóa. Sau góp ý, lượt hai chỉ nhìn tên thật.",
        successCriteriaVi: [
          "Nói tên không thiếu động từ is.",
          "Đánh vần đủ các chữ cái.",
          "Sửa được ít nhất một hiểu nhầm.",
          "Dùng được một câu xin lặp lại hoặc nói chậm.",
        ],
        targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
        evidence: ["task_checklist", "self_assessment"],
        attempts: 2,
        preparationSeconds: 20,
        responseSeconds: 20,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "interaction_repair",
        ],
      },
    },
    {
      id: "m01c-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa tối đa hai lỗi",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn có đưa đúng toàn bộ tên không?",
        "Tách các chữ cái rõ hơn.",
        "Dùng câu cứu nguy trước khi đoán.",
      ],
    },
    {
      id: "m01c-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Tự đánh giá khả năng giao tiếp",
      canDoCheckVi:
        "Tôi có thể nói và đánh vần tên, đồng thời sửa trao đổi khi nghe chưa rõ.",
      reviewTargetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
      confidencePromptVi:
        "Không nhìn cả câu, bạn có thể làm đủ ba hành động không?",
    },
  ],
  tags: ["pre-a1", "module-01", "communicate", "repair"],
};

export const PRE_A1_M01_RETAIN_TRANSFER: LessonV2 = {
  schemaVersion: 2,
  id: "pre-a1-m01-retain-transfer",
  missionId: "pre-a1-m01",
  legacyUnitId: "unit-a0-1",
  titleVi: "Nhớ lại và dùng tên trong tình huống mới",
  titleEn: "Recall and transfer your name exchange",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 9,
  primaryOutcome: {
    id: "pre-a1-m01-transfer-outcome",
    level: "PRE_A1",
    activity: "interaction",
    domain: "public",
    statementEn:
      "Can independently reuse a name and spelling exchange with a different person and recover from one communication problem.",
    statementVi:
      "Có thể tự dùng lại trao đổi tên và đánh vần với người khác, đồng thời xử lý một trục trặc giao tiếp.",
    source: "ato-adapted",
    sourceReference: "CEFR Pre-A1 interaction with delayed retrieval",
  },
  prerequisiteLessonIds: [
    "pre-a1-m01-encounter",
    "pre-a1-m01-communicate",
  ],
  targets: [
    sharedTargets.name,
    sharedTargets.spell,
    sharedTargets.repeat,
    sharedTargets.slow,
  ],
  steps: [
    {
      id: "m01t-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Đăng ký nhận hàng",
      roleVi: "Bạn đến quầy nhận hàng.",
      situationVi:
        "Nhân viên cần tên để tìm đơn. Đây không còn là tình huống làm thẻ tên.",
      goalVi:
        "Tự nhớ câu nói tên, đánh vần và xử lý khi nhân viên nghe nhầm.",
    },
    {
      id: "m01t-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Nghe biến thể mới một lần",
      replayRates: [0.85],
      turns: [
        {
          speaker: "Clerk",
          text: "Name, please?",
          translationVi: "Xin cho biết tên?",
        },
        {
          speaker: "Customer",
          text: "My name is Hoa. It is H-O-A.",
          translationVi: "Tên tôi là Hoa. Đánh vần H-O-A.",
          targetIds: ["m01-name", "m01-spell"],
        },
        {
          speaker: "Clerk",
          text: "Sorry, H-O-R?",
          translationVi: "Xin lỗi, H-O-R phải không?",
        },
        {
          speaker: "Customer",
          text: "Please say that again.",
          translationVi: "Xin hãy nói lại.",
          targetIds: ["m01-repeat"],
        },
      ],
    },
    {
      id: "m01t-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhận ra kiến thức không đổi",
      targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
      explanationVi:
        "Người và địa điểm đã đổi, nhưng bốn hành động cốt lõi vẫn giữ nguyên. Đây là chuyển giao, không phải học thuộc hội thoại cũ.",
    },
    {
      id: "m01t-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Kiểm tra nhớ lại sau trì hoãn",
      adaptive: true,
      exercises: [
        {
          id: "m01t-p1",
          kind: "recall",
          promptVi: "Không nhìn mẫu: nói 'Tên tôi là Hoa'.",
          answer: "My name is Hoa.",
          acceptedAnswers: ["I'm Hoa."],
          targetIds: ["m01-name"],
        },
        {
          id: "m01t-p2",
          kind: "listen",
          promptVi: "Nhân viên nghe chữ cuối là gì?",
          audioText: "Is that H-O-R?",
          options: ["R", "A", "N"],
          answer: "R",
          targetIds: ["m01-spell"],
        },
        {
          id: "m01t-p3",
          kind: "select",
          promptVi: "Bạn chưa nghe rõ. Chọn phản ứng an toàn.",
          options: [
            "Please say that again.",
            "Yes.",
            "My name is wrong.",
          ],
          answer: "Please say that again.",
          targetIds: ["m01-repeat"],
        },
        {
          id: "m01t-p4",
          kind: "order",
          promptVi: "Xếp câu yêu cầu nói chậm.",
          tokens: ["speak", "Please", "slowly"],
          answer: "Please speak slowly",
          targetIds: ["m01-slow"],
        },
      ],
    },
    {
      id: "m01t-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Không dùng lại đoạn cũ",
      promptVi:
        "Chọn một bối cảnh mới: nhận hàng, phòng khám hoặc khách sạn. Chỉ giữ tên thật và bốn hành động.",
      keyWords: ["new place", "name", "spell", "repair"],
      targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
    },
    {
      id: "m01t-performance",
      kind: "performance",
      estimatedMinutes: 1,
      titleVi: "Transfer task 20 giây",
      task: {
        roleVi: "Khách hàng hoặc bệnh nhân",
        contextVi:
          "Hệ thống chọn ngẫu nhiên quầy nhận hàng, phòng khám hoặc khách sạn. Nhân viên nghe sai một chữ cái.",
        goalVi:
          "Đưa đúng tên và sửa được hiểu nhầm mà không nhìn câu mẫu.",
        promptVi:
          "Lượt một làm ngay. Sau phản hồi, lượt hai đổi người đối diện và tốc độ nói.",
        successCriteriaVi: [
          "Tự nói tên không cần khung.",
          "Đánh vần đủ và rõ.",
          "Dùng câu sửa giao tiếp phù hợp thay vì đoán.",
        ],
        targetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
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
      id: "m01t-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Xác nhận retained hay cần ôn bù",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Bạn có cần xem lại cả câu không?",
        "Nếu quên một phần, hệ thống chỉ lên lịch ôn đúng phần đó.",
      ],
    },
    {
      id: "m01t-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Ghi bằng chứng chuyển giao",
      canDoCheckVi:
        "Tôi vẫn nói và đánh vần tên được trong bối cảnh mới, không cần đọc lại hội thoại cũ.",
      reviewTargetIds: ["m01-name", "m01-spell", "m01-repeat", "m01-slow"],
      confidencePromptVi:
        "Bạn làm độc lập hay vẫn cần nhìn từ khóa? Hãy trả lời đúng thực tế.",
    },
  ],
  tags: ["pre-a1", "module-01", "retain", "transfer", "public"],
};

export const PRE_A1_MODULE_01_LESSONS = [
  PRE_A1_M01_ENCOUNTER,
  PRE_A1_M01_COMMUNICATE,
  PRE_A1_M01_RETAIN_TRANSFER,
] as const;
