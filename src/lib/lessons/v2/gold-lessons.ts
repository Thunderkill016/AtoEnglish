import type { LessonV2 } from "./schema";

export const GOLD_LESSON_PRE_A1: LessonV2 = {
  schemaVersion: 2,
  id: "v2-pre-a1-introduce-and-repair",
  missionId: "unit-a0-1",
  legacyUnitId: "unit-a0-1",
  titleVi: "Nói tên, đánh vần và xin người khác nói chậm",
  titleEn: "Say and spell your name",
  level: "PRE_A1",
  legacyLevel: "A0",
  estimatedMinutes: 10,
  primaryOutcome: {
    id: "pre-a1-name-repair",
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
  prerequisiteLessonIds: [],
  targets: [
    {
      id: "p0-name",
      kind: "chunk",
      form: "My name is ...",
      meaningVi: "Tên tôi là...",
      exampleEn: "My name is Lan.",
      exampleVi: "Tên tôi là Lan.",
      priority: "core",
    },
    {
      id: "p0-spell",
      kind: "chunk",
      form: "It is L-A-N.",
      meaningVi: "Tên đó được đánh vần là L-A-N.",
      exampleEn: "It is L-A-N.",
      exampleVi: "Đánh vần là L-A-N.",
      priority: "core",
      pronunciationGoal: "Nói từng chữ cái tách rõ, có khoảng dừng ngắn.",
    },
    {
      id: "p0-repeat",
      kind: "repair_strategy",
      form: "Please say that again.",
      meaningVi: "Xin hãy nói lại.",
      exampleEn: "Sorry. Please say that again.",
      exampleVi: "Xin lỗi. Xin hãy nói lại.",
      priority: "core",
    },
    {
      id: "p0-slow",
      kind: "repair_strategy",
      form: "Please speak slowly.",
      meaningVi: "Xin hãy nói chậm.",
      exampleEn: "Please speak slowly.",
      exampleVi: "Xin hãy nói chậm.",
      priority: "core",
    },
    {
      id: "p0-polite",
      kind: "pragmatics",
      form: "Sorry / please / thank you",
      meaningVi: "Các từ giúp yêu cầu lịch sự.",
      exampleEn: "Sorry. Please speak slowly. Thank you.",
      exampleVi: "Xin lỗi. Xin hãy nói chậm. Cảm ơn.",
      priority: "support",
    },
  ],
  steps: [
    {
      id: "p0-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Nhận thẻ tên ngày đầu đi làm",
      roleVi: "Bạn là nhân viên mới.",
      situationVi:
        "Lễ tân hỏi tên để làm thẻ. Họ nghe chưa rõ và nói hơi nhanh.",
      goalVi: "Nói tên, đánh vần và dùng một câu sửa hiểu nhầm.",
    },
    {
      id: "p0-model",
      kind: "model",
      estimatedMinutes: 1,
      titleVi: "Nghe cuộc trao đổi mẫu",
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
          targetIds: ["p0-name"],
        },
        {
          speaker: "Receptionist",
          text: "How do you spell that?",
          translationVi: "Tên đó đánh vần thế nào?",
        },
        {
          speaker: "Learner",
          text: "Sorry. Please speak slowly.",
          translationVi: "Xin lỗi. Xin hãy nói chậm.",
          targetIds: ["p0-slow", "p0-polite"],
        },
        {
          speaker: "Learner",
          text: "It is L-A-N.",
          translationVi: "Đánh vần là L-A-N.",
          targetIds: ["p0-spell"],
        },
      ],
    },
    {
      id: "p0-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhìn ba hành động quan trọng",
      targetIds: ["p0-name", "p0-spell", "p0-slow", "p0-repeat"],
      explanationVi:
        "Không cần hiểu mọi từ. Hãy nhận ra câu nói tên, cách đọc từng chữ cái và hai câu cứu nguy.",
    },
    {
      id: "p0-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Nhận ra rồi tự nhớ",
      adaptive: true,
      exercises: [
        {
          id: "p0-e1",
          kind: "select",
          promptVi: "Chọn câu nói tên.",
          options: ["My name is Lan.", "Please speak slowly.", "Thank you."],
          answer: "My name is Lan.",
          targetIds: ["p0-name"],
        },
        {
          id: "p0-e2",
          kind: "listen",
          promptVi: "Người nói cần bạn làm gì?",
          audioText: "Please say that again.",
          options: ["Nói lại", "Nói tên", "Tạm biệt"],
          answer: "Nói lại",
          targetIds: ["p0-repeat"],
        },
        {
          id: "p0-e3",
          kind: "order",
          promptVi: "Xếp câu yêu cầu nói chậm.",
          tokens: ["slowly", "Please", "speak"],
          answer: "Please speak slowly",
          targetIds: ["p0-slow"],
        },
        {
          id: "p0-e4",
          kind: "recall",
          promptVi: "Nói bằng tiếng Anh: Tên tôi là Minh.",
          answer: "My name is Minh.",
          targetIds: ["p0-name"],
        },
      ],
    },
    {
      id: "p0-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 1,
      titleVi: "Thay bằng tên thật của bạn",
      promptVi:
        "Điền tên, nhìn khung một lần, sau đó che khung và nói lại.",
      frameEn:
        "My name is ____. It is __-__-__. Sorry. Please speak slowly.",
      keyWords: ["name", "spell", "slowly"],
      targetIds: ["p0-name", "p0-spell", "p0-slow"],
    },
    {
      id: "p0-performance",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Làm thẻ tên — nói hai lần",
      task: {
        roleVi: "Nhân viên mới",
        contextVi:
          "Lễ tân hỏi tên, hỏi cách đánh vần rồi cố ý nói nhanh ở lượt tiếp theo.",
        goalVi:
          "Đưa đúng tên và đánh vần; dùng một câu yêu cầu hỗ trợ khi cần.",
        promptVi:
          "Trả lời lễ tân. Lần hai, không nhìn cả câu; chỉ nhìn ba từ khóa.",
        successCriteriaVi: [
          "Người nghe nhận được đúng tên.",
          "Bạn đánh vần từng chữ cái đủ rõ.",
          "Bạn dùng được 'say that again' hoặc 'speak slowly'.",
        ],
        targetIds: ["p0-name", "p0-spell", "p0-repeat", "p0-slow"],
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
      id: "p0-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa đúng một điểm quan trọng",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Tên hoặc chữ cái nào người nghe chưa nhận ra? Nói lại riêng phần đó.",
        "Bạn đã dùng câu cứu nguy chưa?",
      ],
    },
    {
      id: "p0-exit",
      kind: "exit",
      estimatedMinutes: 1,
      titleVi: "Tự kiểm tra và hẹn ôn",
      canDoCheckVi:
        "Tôi có thể nói và đánh vần tên, đồng thời xin người khác nói lại hoặc nói chậm.",
      reviewTargetIds: ["p0-name", "p0-spell", "p0-repeat", "p0-slow"],
      confidencePromptVi: "Không nhìn khung, bạn làm được bao nhiêu phần?",
    },
  ],
  tags: ["gold", "pre-a1", "interaction", "repair", "occupational"],
};

export const GOLD_LESSON_A1: LessonV2 = {
  schemaVersion: 2,
  id: "v2-a1-meet-a-colleague",
  missionId: "unit-1",
  legacyUnitId: "unit-1",
  titleVi: "Làm quen với một đồng nghiệp mới",
  titleEn: "Meet a new colleague",
  level: "A1",
  legacyLevel: "A1",
  estimatedMinutes: 13,
  primaryOutcome: {
    id: "a1-colleague-intro",
    level: "A1",
    activity: "interaction",
    domain: "occupational",
    statementEn:
      "Can greet a new colleague, give basic personal and work information and ask a simple follow-up question.",
    statementVi:
      "Có thể chào đồng nghiệp mới, nói thông tin cá nhân/công việc và hỏi lại một câu đơn giản.",
    source: "ato-adapted",
    sourceReference: "CEFR A1 conversation and information exchange",
  },
  prerequisiteLessonIds: ["v2-pre-a1-introduce-and-repair"],
  targets: [
    {
      id: "a1-greet",
      kind: "chunk",
      form: "Hi, I am ... Nice to meet you.",
      meaningVi: "Chào, tôi là... Rất vui được gặp bạn.",
      exampleEn: "Hi, I am Mai. Nice to meet you.",
      exampleVi: "Chào, tôi là Mai. Rất vui được gặp bạn.",
      priority: "core",
    },
    {
      id: "a1-role",
      kind: "grammar_pattern",
      form: "I work as a/an ...",
      meaningVi: "Tôi làm nghề/vị trí...",
      exampleEn: "I work as a designer.",
      exampleVi: "Tôi làm thiết kế.",
      priority: "core",
      l1NoteVi:
        "Dùng a/an trước một nghề số ít: a designer, an engineer.",
    },
    {
      id: "a1-company",
      kind: "chunk",
      form: "I work at/for ...",
      meaningVi: "Tôi làm tại/cho...",
      exampleEn: "I work at AtoTech.",
      exampleVi: "Tôi làm tại AtoTech.",
      priority: "core",
    },
    {
      id: "a1-from",
      kind: "chunk",
      form: "I am from ...",
      meaningVi: "Tôi đến từ...",
      exampleEn: "I am from Da Nang.",
      exampleVi: "Tôi đến từ Đà Nẵng.",
      priority: "core",
    },
    {
      id: "a1-followup",
      kind: "discourse_move",
      form: "What about you? / What do you do?",
      meaningVi: "Còn bạn? / Bạn làm công việc gì?",
      exampleEn: "I am a designer. What about you?",
      exampleVi: "Tôi là nhà thiết kế. Còn bạn?",
      priority: "core",
    },
    {
      id: "a1-repair",
      kind: "repair_strategy",
      form: "Sorry, do you mean ...?",
      meaningVi: "Xin lỗi, ý bạn là...?",
      exampleEn: "Sorry, do you mean the sales team?",
      exampleVi: "Xin lỗi, ý bạn là nhóm kinh doanh phải không?",
      priority: "core",
    },
    {
      id: "a1-stress",
      kind: "pronunciation",
      form: "Stress the name, role and company",
      meaningVi: "Nhấn tên, vị trí và công ty — các thông tin mới.",
      exampleEn: "I am MAI. I work as a DEsigner at ATOtech.",
      exampleVi: "Nhấn các từ mang thông tin chính.",
      priority: "support",
      pronunciationGoal: "Chia lời giới thiệu thành 2–3 cụm nghĩa ngắn.",
    },
  ],
  steps: [
    {
      id: "a1-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Gặp đồng nghiệp trong ngày đầu",
      roleVi: "Bạn là nhân viên mới trong một nhóm quốc tế.",
      situationVi:
        "Một đồng nghiệp đến chào. Hai người có khoảng một phút trước khi cuộc họp bắt đầu.",
      goalVi:
        "Giới thiệu tên, vai trò, nơi làm việc/quê quán và hỏi lại ít nhất một câu.",
    },
    {
      id: "a1-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe một cuộc làm quen tự nhiên",
      replayRates: [0.75, 0.95],
      turns: [
        {
          speaker: "Alex",
          text: "Hi, I am Alex. Nice to meet you.",
          translationVi: "Chào, tôi là Alex. Rất vui được gặp bạn.",
          targetIds: ["a1-greet"],
        },
        {
          speaker: "Mai",
          text: "Hi, I am Mai. Nice to meet you too.",
          translationVi: "Chào, tôi là Mai. Tôi cũng rất vui được gặp bạn.",
          targetIds: ["a1-greet"],
        },
        {
          speaker: "Alex",
          text: "What do you do?",
          translationVi: "Bạn làm công việc gì?",
          targetIds: ["a1-followup"],
        },
        {
          speaker: "Mai",
          text: "I work as a designer at AtoTech. I am from Da Nang. What about you?",
          translationVi:
            "Tôi làm thiết kế tại AtoTech. Tôi đến từ Đà Nẵng. Còn bạn?",
          targetIds: [
            "a1-role",
            "a1-company",
            "a1-from",
            "a1-followup",
          ],
        },
        {
          speaker: "Alex",
          text: "I work in the product team.",
          translationVi: "Tôi làm trong nhóm sản phẩm.",
        },
        {
          speaker: "Mai",
          text: "Sorry, do you mean the product design team?",
          translationVi: "Xin lỗi, ý bạn là nhóm thiết kế sản phẩm phải không?",
          targetIds: ["a1-repair"],
        },
      ],
    },
    {
      id: "a1-notice",
      kind: "notice",
      estimatedMinutes: 1,
      titleVi: "Nhận ra cấu trúc của lượt nói",
      targetIds: [
        "a1-greet",
        "a1-role",
        "a1-company",
        "a1-from",
        "a1-followup",
        "a1-repair",
      ],
      explanationVi:
        "Một lượt giới thiệu tốt có: chào → tên → vai trò/nơi làm → một thông tin cá nhân → hỏi lại. Không cần dùng tất cả trong một câu dài.",
    },
    {
      id: "a1-practice",
      kind: "practice",
      estimatedMinutes: 2,
      titleVi: "Xây câu và chọn phản hồi",
      adaptive: true,
      exercises: [
        {
          id: "a1-e1",
          kind: "select",
          promptVi: "Chọn câu nói nghề đúng.",
          options: [
            "I work as a designer.",
            "I am work designer.",
            "I work designer as.",
          ],
          answer: "I work as a designer.",
          targetIds: ["a1-role"],
        },
        {
          id: "a1-e2",
          kind: "order",
          promptVi: "Xếp câu hỏi lại người đối diện.",
          tokens: ["about", "What", "you"],
          answer: "What about you",
          targetIds: ["a1-followup"],
        },
        {
          id: "a1-e3",
          kind: "listen",
          promptVi: "Đồng nghiệp làm ở đâu?",
          audioText: "I work at Green Foods in the sales team.",
          options: ["Green Foods", "AtoTech", "Da Nang"],
          answer: "Green Foods",
          targetIds: ["a1-company"],
        },
        {
          id: "a1-e4",
          kind: "recall",
          promptVi: "Nói: Tôi đến từ Cần Thơ.",
          answer: "I am from Can Tho.",
          acceptedAnswers: ["I'm from Can Tho."],
          targetIds: ["a1-from"],
        },
        {
          id: "a1-e5",
          kind: "select",
          promptVi: "Bạn nghe chưa rõ 'sales team'. Chọn câu xác nhận.",
          options: [
            "Sorry, do you mean the sales team?",
            "What about you?",
            "I work as sales team.",
          ],
          answer: "Sorry, do you mean the sales team?",
          targetIds: ["a1-repair"],
        },
      ],
    },
    {
      id: "a1-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 2,
      titleVi: "Chuẩn bị thông tin thật",
      promptVi:
        "Điền tên, vai trò, nơi làm/học và quê quán. Chuẩn bị một câu hỏi lại. Lần đầu có khung; lần sau chỉ nhìn từ khóa.",
      frameEn:
        "Hi, I am ____. I work/study as/at ____. I am from ____. What about you?",
      keyWords: ["name", "role", "place", "from", "question"],
      targetIds: [
        "a1-greet",
        "a1-role",
        "a1-company",
        "a1-from",
        "a1-followup",
      ],
    },
    {
      id: "a1-performance",
      kind: "performance",
      estimatedMinutes: 2,
      titleVi: "Cuộc làm quen 40 giây",
      task: {
        roleVi: "Nhân viên hoặc học viên mới",
        contextVi:
          "Bạn gặp một đồng nghiệp mới. Ở lượt hai, họ thay đổi một chi tiết hoặc nói một từ bạn chưa nghe rõ.",
        goalVi:
          "Tự giới thiệu, hỏi lại một câu và xử lý một chi tiết chưa rõ.",
        promptEn: "Hi, I am Sam. I work in operations. What do you do?",
        promptVi:
          "Trả lời Sam và duy trì cuộc trao đổi. Lượt hai không nhìn câu mẫu.",
        successCriteriaVi: [
          "Nói được ít nhất ba thông tin: tên, vai trò/nơi làm, quê quán hoặc nơi sống.",
          "Hỏi lại ít nhất một câu phù hợp.",
          "Dùng câu xác nhận nếu xuất hiện chi tiết chưa rõ.",
          "Nói thành các cụm ngắn, người nghe hiểu được thông tin chính.",
        ],
        targetIds: [
          "a1-greet",
          "a1-role",
          "a1-company",
          "a1-from",
          "a1-followup",
          "a1-repair",
        ],
        evidence: ["task_checklist", "asr_transcript", "self_assessment"],
        attempts: 2,
        preparationSeconds: 30,
        responseSeconds: 40,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "language_control",
          "interaction_repair",
        ],
      },
    },
    {
      id: "a1-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Ưu tiên sửa nhiệm vụ trước ngữ pháp nhỏ",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
        "language_control",
      ],
      repairPromptsVi: [
        "Bạn còn thiếu thông tin nào người nghe cần?",
        "Hãy chia câu dài thành hai cụm.",
        "Thêm a/an trước nghề nếu cần.",
      ],
    },
    {
      id: "a1-exit",
      kind: "exit",
      estimatedMinutes: 2,
      titleVi: "Kiểm tra can-do và biến thể ngày sau",
      canDoCheckVi:
        "Tôi có thể làm quen với đồng nghiệp mới bằng vài câu đơn giản và hỏi lại một câu.",
      reviewTargetIds: [
        "a1-greet",
        "a1-role",
        "a1-company",
        "a1-followup",
        "a1-repair",
      ],
      confidencePromptVi:
        "Ngày mai, bạn có thể giới thiệu với một người khác mà không dùng đúng thông tin hôm nay không?",
    },
  ],
  tags: ["gold", "a1", "interaction", "work", "follow-up"],
};

export const GOLD_LESSON_A2: LessonV2 = {
  schemaVersion: 2,
  id: "v2-a2-tell-a-past-event",
  missionId: "unit-13",
  legacyUnitId: "unit-13",
  titleVi: "Kể lại một cuối tuần hoặc sự kiện công việc",
  titleEn: "Tell a short past-event story",
  level: "A2",
  legacyLevel: "A2",
  estimatedMinutes: 16,
  primaryOutcome: {
    id: "a2-past-story",
    level: "A2",
    activity: "production",
    domain: "personal",
    statementEn:
      "Can give a short connected account of a familiar past event, including sequence, key details and a personal reaction.",
    statementVi:
      "Có thể kể ngắn một sự kiện quen thuộc trong quá khứ, có trình tự, chi tiết chính và cảm nhận.",
    source: "ato-adapted",
    sourceReference: "CEFR A2 sustained monologue: describing experience",
  },
  secondaryOutcomes: [
    {
      id: "a2-followup-past",
      level: "A2",
      activity: "interaction",
      domain: "personal",
      statementEn:
        "Can answer predictable follow-up questions about a familiar past event.",
      statementVi:
        "Có thể trả lời các câu hỏi tiếp nối quen thuộc về một sự kiện đã xảy ra.",
      source: "ato-adapted",
    },
  ],
  prerequisiteLessonIds: ["v2-a1-meet-a-colleague"],
  targets: [
    {
      id: "a2-open",
      kind: "discourse_move",
      form: "Last ..., I ...",
      meaningVi: "Mở đầu bằng thời gian và sự kiện chính.",
      exampleEn: "Last Saturday, I visited my parents.",
      exampleVi: "Thứ Bảy trước, tôi đã thăm bố mẹ.",
      priority: "core",
    },
    {
      id: "a2-sequence",
      kind: "discourse_move",
      form: "First ..., then ..., after that ..., finally ...",
      meaningVi: "Sắp xếp các sự kiện theo trình tự.",
      exampleEn: "First we had lunch. Then we went for a walk.",
      exampleVi: "Đầu tiên chúng tôi ăn trưa. Sau đó đi dạo.",
      priority: "core",
    },
    {
      id: "a2-past-regular",
      kind: "grammar_pattern",
      form: "regular past: visited, worked, watched",
      meaningVi: "Động từ quá khứ có -ed.",
      exampleEn: "We visited a museum and watched a show.",
      exampleVi: "Chúng tôi thăm bảo tàng và xem một chương trình.",
      priority: "core",
      pronunciationGoal: "Giữ âm cuối -ed ở các từ cần thiết.",
    },
    {
      id: "a2-past-irregular",
      kind: "grammar_pattern",
      form: "common irregular past: went, had, met, saw",
      meaningVi: "Các động từ quá khứ bất quy tắc thường dùng.",
      exampleEn: "I went to Hue and met an old friend.",
      exampleVi: "Tôi đi Huế và gặp một người bạn cũ.",
      priority: "core",
    },
    {
      id: "a2-detail",
      kind: "chunk",
      form: "with ..., at ..., for ...",
      meaningVi: "Thêm người, nơi và thời lượng.",
      exampleEn: "I went with my team and stayed for two hours.",
      exampleVi: "Tôi đi cùng nhóm và ở lại hai giờ.",
      priority: "core",
    },
    {
      id: "a2-reaction",
      kind: "chunk",
      form: "It was ... because ...",
      meaningVi: "Nêu cảm nhận kèm lý do.",
      exampleEn: "It was useful because I learned a new process.",
      exampleVi: "Nó hữu ích vì tôi học được một quy trình mới.",
      priority: "core",
    },
    {
      id: "a2-followup",
      kind: "repair_strategy",
      form: "Do you mean when/where/who?",
      meaningVi: "Xác nhận câu hỏi tiếp nối chưa rõ.",
      exampleEn: "Do you mean where the meeting was?",
      exampleVi: "Ý bạn là cuộc họp ở đâu phải không?",
      priority: "core",
    },
    {
      id: "a2-past-pronunciation",
      kind: "pronunciation",
      form: "Past-time markers and -ed endings",
      meaningVi: "Nhấn mốc thời gian, không bỏ âm cuối mang nghĩa quá khứ.",
      exampleEn: "LAST week, we VISITed a CLIENT.",
      exampleVi: "Nhấn mốc thời gian và từ nội dung.",
      priority: "support",
      pronunciationGoal: "Người nghe nhận ra sự kiện đã xảy ra trong quá khứ.",
    },
  ],
  steps: [
    {
      id: "a2-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Câu hỏi trong giờ nghỉ trưa",
      roleVi: "Bạn nói chuyện với đồng nghiệp sau cuối tuần.",
      situationVi:
        "Đồng nghiệp hỏi cuối tuần của bạn thế nào hoặc chuyện gì xảy ra trong buổi đào tạo hôm qua.",
      goalVi: "Kể sự kiện theo trình tự và trả lời một câu hỏi tiếp nối.",
    },
    {
      id: "a2-model",
      kind: "model",
      estimatedMinutes: 2,
      titleVi: "Nghe một câu chuyện ngắn có cấu trúc",
      replayRates: [0.8, 1],
      turns: [
        {
          speaker: "Linh",
          text: "How was the training yesterday?",
          translationVi: "Buổi đào tạo hôm qua thế nào?",
        },
        {
          speaker: "Nam",
          text: "It was useful. First, the trainer showed us the new system.",
          translationVi:
            "Nó hữu ích. Đầu tiên, người hướng dẫn cho chúng tôi xem hệ thống mới.",
          targetIds: ["a2-reaction", "a2-sequence", "a2-past-irregular"],
        },
        {
          speaker: "Nam",
          text: "Then we practised with a customer example. After that, we worked in pairs.",
          translationVi:
            "Sau đó chúng tôi luyện với một ví dụ khách hàng. Tiếp theo, chúng tôi làm theo cặp.",
          targetIds: ["a2-sequence", "a2-past-regular", "a2-detail"],
        },
        {
          speaker: "Nam",
          text: "Finally, I asked two questions. It was helpful because I understood the process better.",
          translationVi:
            "Cuối cùng tôi hỏi hai câu. Nó hữu ích vì tôi hiểu quy trình rõ hơn.",
          targetIds: ["a2-sequence", "a2-reaction"],
        },
        {
          speaker: "Linh",
          text: "Who did you work with?",
          translationVi: "Bạn làm cùng ai?",
        },
        {
          speaker: "Nam",
          text: "Do you mean my partner? I worked with An from the sales team.",
          translationVi:
            "Ý bạn là người làm cặp với tôi phải không? Tôi làm với An từ nhóm kinh doanh.",
          targetIds: ["a2-followup", "a2-detail"],
        },
      ],
    },
    {
      id: "a2-notice",
      kind: "notice",
      estimatedMinutes: 2,
      titleVi: "Nhận ra bộ xương của câu chuyện",
      targetIds: [
        "a2-open",
        "a2-sequence",
        "a2-past-regular",
        "a2-past-irregular",
        "a2-detail",
        "a2-reaction",
      ],
      explanationVi:
        "Câu chuyện A2 cần trả lời: khi nào → chuyện chính → 2–4 bước → chi tiết → cảm nhận/lý do. Không cần kể mọi thứ.",
    },
    {
      id: "a2-practice",
      kind: "practice",
      estimatedMinutes: 3,
      titleVi: "Từ nhận biết sang tự tạo chuỗi",
      adaptive: true,
      exercises: [
        {
          id: "a2-e1",
          kind: "order",
          promptVi: "Xếp trình tự câu chuyện.",
          tokens: [
            "First, we checked in",
            "Then, we met the client",
            "Finally, we wrote the report",
          ],
          answer:
            "First, we checked in Then, we met the client Finally, we wrote the report",
          targetIds: ["a2-sequence"],
        },
        {
          id: "a2-e2",
          kind: "select",
          promptVi: "Chọn quá khứ đúng.",
          options: ["We went to the office.", "We goed to the office.", "We go yesterday."],
          answer: "We went to the office.",
          targetIds: ["a2-past-irregular"],
        },
        {
          id: "a2-e3",
          kind: "listen",
          promptVi: "Vì sao người nói thấy buổi họp hữu ích?",
          audioText:
            "The meeting was useful because we agreed on the next steps.",
          options: [
            "Họ thống nhất bước tiếp theo",
            "Họ hủy cuộc họp",
            "Họ gặp khách hàng mới",
          ],
          answer: "Họ thống nhất bước tiếp theo",
          targetIds: ["a2-reaction"],
        },
        {
          id: "a2-e4",
          kind: "recall",
          promptVi: "Nói: Sau đó chúng tôi làm việc theo cặp.",
          answer: "Then we worked in pairs.",
          acceptedAnswers: ["After that, we worked in pairs."],
          targetIds: ["a2-sequence", "a2-past-regular"],
        },
        {
          id: "a2-e5",
          kind: "select",
          promptVi: "Bạn chưa rõ câu hỏi hỏi người hay nơi. Chọn câu xác nhận.",
          options: [
            "Do you mean who I worked with?",
            "It was very useful.",
            "Finally, I went home.",
          ],
          answer: "Do you mean who I worked with?",
          targetIds: ["a2-followup"],
        },
      ],
    },
    {
      id: "a2-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 2,
      titleVi: "Lập bản đồ 5 điểm, không viết cả đoạn",
      promptVi:
        "Chọn một cuối tuần, buổi đào tạo hoặc sự kiện công việc thật. Ghi 5 từ khóa: thời gian, sự kiện, bước 1–2–3, cảm nhận.",
      frameEn:
        "Last ____, I ____. First, ____. Then, ____. After that, ____. Finally, ____. It was ____ because ____.",
      keyWords: ["when", "event", "first", "then", "reaction"],
      targetIds: [
        "a2-open",
        "a2-sequence",
        "a2-past-regular",
        "a2-past-irregular",
        "a2-detail",
        "a2-reaction",
      ],
    },
    {
      id: "a2-performance",
      kind: "performance",
      estimatedMinutes: 3,
      titleVi: "Kể 70 giây và xử lý câu hỏi",
      task: {
        roleVi: "Đồng nghiệp kể lại sự kiện",
        contextVi:
          "Bạn kể cho đồng nghiệp một sự kiện gần đây. Sau đó họ hỏi một câu về người, nơi hoặc lý do.",
        goalVi:
          "Kể có trình tự, thêm chi tiết và cảm nhận; trả lời hoặc xác nhận câu hỏi tiếp nối.",
        promptVi:
          "Lần một dùng bản đồ từ khóa. Sau góp ý, lần hai đổi ít nhất một chi tiết và không đọc nguyên đoạn.",
        successCriteriaVi: [
          "Nêu rõ thời gian và sự kiện chính.",
          "Dùng ít nhất ba mốc trình tự.",
          "Dùng quá khứ đủ để người nghe theo dõi.",
          "Nêu một cảm nhận kèm lý do.",
          "Trả lời hoặc làm rõ câu hỏi tiếp nối.",
        ],
        targetIds: [
          "a2-open",
          "a2-sequence",
          "a2-past-regular",
          "a2-past-irregular",
          "a2-detail",
          "a2-reaction",
          "a2-followup",
        ],
        evidence: ["task_checklist", "asr_transcript", "self_assessment"],
        attempts: 2,
        preparationSeconds: 45,
        responseSeconds: 70,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "fluency",
          "language_control",
          "interaction_repair",
        ],
      },
    },
    {
      id: "a2-feedback",
      kind: "feedback",
      estimatedMinutes: 1,
      titleVi: "Sửa điểm làm câu chuyện khó theo dõi nhất",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "fluency",
        "language_control",
        "interaction_repair",
      ],
      repairPromptsVi: [
        "Người nghe có biết khi nào và chuyện gì xảy ra không?",
        "Thêm một từ nối trước chỗ chuyển sự kiện.",
        "Sửa tối đa hai động từ quá khứ cản trở nghĩa.",
      ],
    },
    {
      id: "a2-exit",
      kind: "exit",
      estimatedMinutes: 2,
      titleVi: "Lên lịch kể lại với tình huống mới",
      canDoCheckVi:
        "Tôi có thể kể một sự kiện quen thuộc thành đoạn ngắn có trình tự, chi tiết và cảm nhận.",
      reviewTargetIds: [
        "a2-open",
        "a2-sequence",
        "a2-past-regular",
        "a2-past-irregular",
        "a2-reaction",
      ],
      confidencePromptVi:
        "Ba ngày nữa, bạn có thể kể một sự kiện khác mà không dùng lại đúng nội dung này không?",
    },
  ],
  tags: ["gold", "a2", "narrative", "past", "transfer"],
};

export const GOLD_LESSON_B1: LessonV2 = {
  schemaVersion: 2,
  id: "v2-b1-workplace-challenge-story",
  missionId: "unit-19",
  legacyUnitId: "unit-19",
  titleVi: "Kể một tình huống khó tại nơi làm việc",
  titleEn: "Tell a workplace challenge story",
  level: "B1",
  legacyLevel: "B1",
  estimatedMinutes: 19,
  primaryOutcome: {
    id: "b1-challenge-story",
    level: "B1",
    activity: "production",
    domain: "occupational",
    statementEn:
      "Can give a connected account of a familiar workplace challenge, explaining the background, actions, result and lesson learned.",
    statementVi:
      "Có thể kể mạch lạc một tình huống khó tại nơi làm việc, gồm bối cảnh, hành động, kết quả và bài học.",
    source: "ato-adapted",
    sourceReference: "CEFR B1 sustained monologue and connected discourse",
  },
  secondaryOutcomes: [
    {
      id: "b1-clarify-story",
      level: "B1",
      activity: "interaction",
      domain: "occupational",
      statementEn:
        "Can clarify a detail and answer follow-up questions about a familiar work problem.",
      statementVi:
        "Có thể làm rõ chi tiết và trả lời câu hỏi tiếp nối về một vấn đề công việc quen thuộc.",
      source: "ato-adapted",
    },
  ],
  prerequisiteLessonIds: ["v2-a2-tell-a-past-event"],
  targets: [
    {
      id: "b1-context",
      kind: "discourse_move",
      form: "At the time, we were ...",
      meaningVi: "Thiết lập bối cảnh đang diễn ra.",
      exampleEn: "At the time, we were preparing a client launch.",
      exampleVi: "Lúc đó, chúng tôi đang chuẩn bị ra mắt cho khách hàng.",
      priority: "core",
    },
    {
      id: "b1-problem",
      kind: "discourse_move",
      form: "The main problem was that ...",
      meaningVi: "Xác định vấn đề chính.",
      exampleEn: "The main problem was that the data was incomplete.",
      exampleVi: "Vấn đề chính là dữ liệu chưa đầy đủ.",
      priority: "core",
    },
    {
      id: "b1-interruption",
      kind: "grammar_pattern",
      form: "was/were -ing when + past event",
      meaningVi: "Bối cảnh đang diễn ra thì sự kiện chen vào.",
      exampleEn: "We were testing the system when it suddenly stopped.",
      exampleVi: "Chúng tôi đang kiểm thử thì hệ thống đột ngột dừng.",
      priority: "core",
    },
    {
      id: "b1-action",
      kind: "discourse_move",
      form: "First I ..., so that ...",
      meaningVi: "Nêu hành động và mục đích.",
      exampleEn: "First I contacted support so that we could identify the cause.",
      exampleVi: "Đầu tiên tôi liên hệ hỗ trợ để xác định nguyên nhân.",
      priority: "core",
    },
    {
      id: "b1-collaboration",
      kind: "chunk",
      form: "I worked with ... to ...",
      meaningVi: "Nêu cách phối hợp với người khác.",
      exampleEn: "I worked with the sales team to update the client.",
      exampleVi: "Tôi phối hợp với nhóm kinh doanh để cập nhật khách hàng.",
      priority: "core",
    },
    {
      id: "b1-result",
      kind: "discourse_move",
      form: "As a result, ...",
      meaningVi: "Nêu kết quả của hành động.",
      exampleEn: "As a result, we delivered the update on time.",
      exampleVi: "Kết quả là chúng tôi giao bản cập nhật đúng hạn.",
      priority: "core",
    },
    {
      id: "b1-lesson",
      kind: "discourse_move",
      form: "What I learned was ...",
      meaningVi: "Nêu bài học hoặc thay đổi sau sự việc.",
      exampleEn: "What I learned was to check the data earlier.",
      exampleVi: "Điều tôi học được là phải kiểm tra dữ liệu sớm hơn.",
      priority: "core",
    },
    {
      id: "b1-clarify",
      kind: "repair_strategy",
      form: "Let me clarify what happened ...",
      meaningVi: "Làm rõ hoặc sửa cách người nghe hiểu câu chuyện.",
      exampleEn: "Let me clarify: the client did not cancel; they delayed the launch.",
      exampleVi:
        "Để tôi làm rõ: khách hàng không hủy; họ chỉ hoãn ra mắt.",
      priority: "core",
    },
    {
      id: "b1-prominence",
      kind: "pronunciation",
      form: "Prominence on problem, action and result",
      meaningVi: "Nhấn ba điểm giúp người nghe theo dõi câu chuyện.",
      exampleEn: "The PROBLEM was data. I CHECKED it. We DELIVERED on time.",
      exampleVi: "Nhấn vấn đề, hành động và kết quả.",
      priority: "support",
      pronunciationGoal:
        "Dùng khoảng dừng giữa bối cảnh, vấn đề, hành động và kết quả.",
    },
  ],
  steps: [
    {
      id: "b1-scenario",
      kind: "scenario",
      estimatedMinutes: 1,
      titleVi: "Câu hỏi phỏng vấn hành vi",
      roleVi: "Bạn là ứng viên hoặc nhân viên báo cáo sau sự cố.",
      situationVi:
        "Người nghe hỏi về một tình huống khó bạn từng xử lý và muốn biết cụ thể bạn đã làm gì.",
      goalVi:
        "Kể thành câu chuyện có bối cảnh, vấn đề, hành động, phối hợp, kết quả và bài học.",
    },
    {
      id: "b1-model",
      kind: "model",
      estimatedMinutes: 3,
      titleVi: "Phân tích một câu trả lời có cấu trúc",
      replayRates: [0.85, 1],
      turns: [
        {
          speaker: "Interviewer",
          text: "Tell me about a difficult situation you handled at work.",
          translationVi:
            "Hãy kể về một tình huống khó bạn đã xử lý tại nơi làm việc.",
        },
        {
          speaker: "Candidate",
          text: "At the time, we were preparing a product launch for an important client.",
          translationVi:
            "Lúc đó, chúng tôi đang chuẩn bị ra mắt sản phẩm cho một khách hàng quan trọng.",
          targetIds: ["b1-context"],
        },
        {
          speaker: "Candidate",
          text: "The main problem was that the final customer data was incomplete. We were testing the campaign when the system suddenly rejected the file.",
          translationVi:
            "Vấn đề chính là dữ liệu khách hàng cuối cùng chưa đầy đủ. Chúng tôi đang kiểm thử chiến dịch thì hệ thống đột ngột từ chối tệp.",
          targetIds: ["b1-problem", "b1-interruption"],
        },
        {
          speaker: "Candidate",
          text: "First, I contacted the data team so that we could identify the missing fields. I also worked with sales to update the client.",
          translationVi:
            "Đầu tiên, tôi liên hệ nhóm dữ liệu để xác định các trường bị thiếu. Tôi cũng phối hợp với kinh doanh để cập nhật khách hàng.",
          targetIds: ["b1-action", "b1-collaboration"],
        },
        {
          speaker: "Candidate",
          text: "As a result, we fixed the file in two hours and launched on time. What I learned was to validate the data one day earlier.",
          translationVi:
            "Kết quả là chúng tôi sửa tệp trong hai giờ và ra mắt đúng hạn. Tôi học được rằng phải xác thực dữ liệu sớm hơn một ngày.",
          targetIds: ["b1-result", "b1-lesson"],
        },
        {
          speaker: "Interviewer",
          text: "So the client nearly cancelled the project?",
          translationVi: "Vậy khách hàng suýt hủy dự án phải không?",
        },
        {
          speaker: "Candidate",
          text: "Let me clarify: they did not plan to cancel. They needed a clear update before the deadline.",
          translationVi:
            "Để tôi làm rõ: họ không định hủy. Họ cần một cập nhật rõ trước hạn.",
          targetIds: ["b1-clarify"],
        },
      ],
    },
    {
      id: "b1-notice",
      kind: "notice",
      estimatedMinutes: 2,
      titleVi: "Tách câu chuyện thành sáu chức năng",
      targetIds: [
        "b1-context",
        "b1-problem",
        "b1-interruption",
        "b1-action",
        "b1-collaboration",
        "b1-result",
        "b1-lesson",
        "b1-clarify",
      ],
      explanationVi:
        "B1 không chỉ kể 'rồi... rồi...'. Người nghe cần hiểu bối cảnh, vấn đề trung tâm, hành động của chính bạn, phối hợp, kết quả và điều bạn học được.",
    },
    {
      id: "b1-practice",
      kind: "practice",
      estimatedMinutes: 3,
      titleVi: "Chọn cấu trúc theo chức năng",
      adaptive: true,
      exercises: [
        {
          id: "b1-e1",
          kind: "select",
          promptVi: "Câu nào thiết lập bối cảnh tốt nhất?",
          options: [
            "At the time, we were preparing a client presentation.",
            "The result was successful.",
            "Let me clarify the deadline.",
          ],
          answer: "At the time, we were preparing a client presentation.",
          targetIds: ["b1-context"],
        },
        {
          id: "b1-e2",
          kind: "order",
          promptVi: "Xếp logic câu chuyện.",
          tokens: [
            "The main problem was a missing file",
            "First, I checked the backup",
            "As a result, we restored the report",
            "What I learned was to automate backups",
          ],
          answer:
            "The main problem was a missing file First, I checked the backup As a result, we restored the report What I learned was to automate backups",
          targetIds: ["b1-problem", "b1-action", "b1-result", "b1-lesson"],
        },
        {
          id: "b1-e3",
          kind: "listen",
          promptVi: "Hành động của người nói là gì?",
          audioText:
            "I worked with the warehouse team to check every order before delivery.",
          options: [
            "Phối hợp với kho để kiểm tra đơn",
            "Hủy mọi đơn hàng",
            "Gửi dữ liệu cho khách hàng",
          ],
          answer: "Phối hợp với kho để kiểm tra đơn",
          targetIds: ["b1-collaboration"],
        },
        {
          id: "b1-e4",
          kind: "recall",
          promptVi: "Nói: Kết quả là chúng tôi hoàn thành đúng hạn.",
          answer: "As a result, we finished on time.",
          targetIds: ["b1-result"],
        },
        {
          id: "b1-e5",
          kind: "select",
          promptVi: "Người nghe hiểu sai rằng dự án bị hủy. Bạn làm gì?",
          options: [
            "Let me clarify: it was delayed, not cancelled.",
            "The main problem was difficult.",
            "At the time, we were working.",
          ],
          answer: "Let me clarify: it was delayed, not cancelled.",
          targetIds: ["b1-clarify"],
        },
      ],
    },
    {
      id: "b1-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 2,
      titleVi: "Lập sơ đồ STAR mở rộng",
      promptVi:
        "Ghi từ khóa cho bối cảnh, vấn đề, hành động của bạn, người phối hợp, kết quả và bài học. Không viết nguyên bài.",
      frameEn:
        "At the time... The main problem was... First, I... I worked with... As a result... What I learned was...",
      keyWords: ["context", "problem", "my action", "team", "result", "lesson"],
      targetIds: [
        "b1-context",
        "b1-problem",
        "b1-action",
        "b1-collaboration",
        "b1-result",
        "b1-lesson",
      ],
    },
    {
      id: "b1-performance",
      kind: "performance",
      estimatedMinutes: 4,
      titleVi: "Câu chuyện 110 giây và câu hỏi phản biện",
      task: {
        roleVi: "Ứng viên hoặc nhân viên báo cáo",
        contextVi:
          "Kể một tình huống thật hoặc role-play. Người nghe sẽ hỏi một câu để kiểm tra vai trò của bạn hoặc hiểu sai một chi tiết.",
        goalVi:
          "Kể mạch lạc và làm rõ câu chuyện mà không quay về đọc toàn bộ khung.",
        promptEn:
          "Tell me about a workplace problem you handled and what you learned from it.",
        promptVi:
          "Lượt một dùng sáu từ khóa. Sau phản hồi, lượt hai rút gọn phần nền và làm rõ hành động/kết quả hơn.",
        successCriteriaVi: [
          "Câu chuyện có bối cảnh và vấn đề chính rõ.",
          "Nêu cụ thể hành động của bạn và sự phối hợp.",
          "Nêu kết quả có thể kiểm chứng và bài học.",
          "Dùng từ nối để người nghe theo dõi được quan hệ giữa các phần.",
          "Làm rõ được một chi tiết bị hiểu sai hoặc câu hỏi chưa rõ.",
        ],
        targetIds: [
          "b1-context",
          "b1-problem",
          "b1-interruption",
          "b1-action",
          "b1-collaboration",
          "b1-result",
          "b1-lesson",
          "b1-clarify",
        ],
        evidence: ["task_checklist", "audio_recording", "self_assessment"],
        attempts: 2,
        preparationSeconds: 60,
        responseSeconds: 110,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "fluency",
          "language_control",
          "interaction_repair",
        ],
      },
    },
    {
      id: "b1-feedback",
      kind: "feedback",
      estimatedMinutes: 2,
      titleVi: "Sửa cấu trúc và khả năng theo dõi",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "fluency",
        "interaction_repair",
        "language_control",
      ],
      repairPromptsVi: [
        "Cắt chi tiết nền không phục vụ vấn đề chính.",
        "Làm rõ 'tôi đã làm gì', không chỉ 'chúng tôi'.",
        "Thêm một câu kết quả và một câu bài học.",
        "Đặt khoảng dừng sau mỗi phần lớn.",
      ],
    },
    {
      id: "b1-exit",
      kind: "exit",
      estimatedMinutes: 2,
      titleVi: "Đánh dấu mức độc lập và lịch chuyển giao",
      canDoCheckVi:
        "Tôi có thể kể một tình huống khó thành câu chuyện kết nối và trả lời câu hỏi làm rõ.",
      reviewTargetIds: [
        "b1-context",
        "b1-problem",
        "b1-action",
        "b1-result",
        "b1-lesson",
        "b1-clarify",
      ],
      confidencePromptVi:
        "Tuần sau, bạn có thể dùng cùng cấu trúc để kể một tình huống khác mà không học thuộc bài này không?",
    },
  ],
  tags: ["gold", "b1", "narrative", "workplace", "repair"],
};

export const GOLD_LESSON_B2: LessonV2 = {
  schemaVersion: 2,
  id: "v2-b2-hypothetical-interview",
  missionId: "unit-33",
  legacyUnitId: "unit-33",
  titleVi: "Ứng phó với câu hỏi giả định trong phỏng vấn",
  titleEn: "Handle a hypothetical interview case",
  level: "B2",
  legacyLevel: "B2",
  estimatedMinutes: 23,
  primaryOutcome: {
    id: "b2-hypothetical-case",
    level: "B2",
    activity: "interaction",
    domain: "occupational",
    statementEn:
      "Can analyse a hypothetical workplace case, prioritise actions, qualify assumptions, explain consequences and respond to follow-up challenges.",
    statementVi:
      "Có thể phân tích tình huống công việc giả định, ưu tiên hành động, nêu giả định/hệ quả và phản hồi câu hỏi phản biện.",
    source: "ato-adapted",
    sourceReference: "CEFR B2 discussion, argument and turn management",
  },
  secondaryOutcomes: [
    {
      id: "b2-negotiate-assumptions",
      level: "B2",
      activity: "mediation",
      domain: "occupational",
      statementEn:
        "Can restate constraints and make assumptions explicit before recommending a course of action.",
      statementVi:
        "Có thể diễn đạt lại ràng buộc và làm rõ giả định trước khi đề xuất phương án.",
      source: "ato-adapted",
    },
  ],
  prerequisiteLessonIds: ["v2-b1-workplace-challenge-story"],
  targets: [
    {
      id: "b2-frame",
      kind: "discourse_move",
      form: "The key issue I would focus on is ...",
      meaningVi: "Đóng khung vấn đề trung tâm.",
      exampleEn: "The key issue I would focus on is service continuity.",
      exampleVi: "Vấn đề chính tôi sẽ tập trung là tính liên tục của dịch vụ.",
      priority: "core",
    },
    {
      id: "b2-priority",
      kind: "discourse_move",
      form: "My first priority would be ...",
      meaningVi: "Nêu hành động ưu tiên đầu tiên.",
      exampleEn: "My first priority would be to protect customer data.",
      exampleVi: "Ưu tiên đầu tiên của tôi là bảo vệ dữ liệu khách hàng.",
      priority: "core",
    },
    {
      id: "b2-hypothetical",
      kind: "grammar_pattern",
      form: "If + past, would/could/might ...",
      meaningVi: "Phân tích tình huống giả định hiện tại/tương lai.",
      exampleEn: "If a key engineer resigned, I would review the critical tasks first.",
      exampleVi:
        "Nếu một kỹ sư chủ chốt nghỉ việc, trước tiên tôi sẽ rà soát các nhiệm vụ quan trọng.",
      priority: "core",
    },
    {
      id: "b2-assumption",
      kind: "discourse_move",
      form: "This assumes that ... / If that is not the case ...",
      meaningVi: "Làm rõ và điều chỉnh giả định.",
      exampleEn:
        "This assumes that we have access to temporary support. If that is not the case, I would reduce the scope.",
      exampleVi:
        "Điều này giả định rằng chúng ta có hỗ trợ tạm thời. Nếu không, tôi sẽ giảm phạm vi.",
      priority: "core",
    },
    {
      id: "b2-consequence",
      kind: "discourse_move",
      form: "That could lead to ... / The likely impact would be ...",
      meaningVi: "Nêu hệ quả và mức độ chắc chắn.",
      exampleEn: "That could lead to a delay, but the likely impact would be limited.",
      exampleVi:
        "Điều đó có thể gây chậm, nhưng tác động có khả năng sẽ hạn chế.",
      priority: "core",
    },
    {
      id: "b2-options",
      kind: "discourse_move",
      form: "I would consider two options ...",
      meaningVi: "Đưa ra và so sánh nhiều phương án.",
      exampleEn:
        "I would consider two options: reallocating staff or reducing the launch scope.",
      exampleVi:
        "Tôi sẽ cân nhắc hai phương án: điều chuyển nhân sự hoặc giảm phạm vi ra mắt.",
      priority: "core",
    },
    {
      id: "b2-tradeoff",
      kind: "discourse_move",
      form: "Although ..., the advantage is ...",
      meaningVi: "Thừa nhận hạn chế và nêu lợi ích.",
      exampleEn:
        "Although the smaller launch would reduce revenue, the advantage is lower operational risk.",
      exampleVi:
        "Dù ra mắt nhỏ hơn làm giảm doanh thu, lợi ích là rủi ro vận hành thấp hơn.",
      priority: "core",
    },
    {
      id: "b2-recommend",
      kind: "discourse_move",
      form: "On balance, I would recommend ... because ...",
      meaningVi: "Đưa ra kết luận có cân nhắc.",
      exampleEn:
        "On balance, I would recommend a phased launch because it protects quality and the deadline.",
      exampleVi:
        "Sau khi cân nhắc, tôi đề xuất ra mắt theo giai đoạn vì bảo vệ chất lượng và thời hạn.",
      priority: "core",
    },
    {
      id: "b2-reformulate",
      kind: "repair_strategy",
      form: "Let me rephrase that more precisely ...",
      meaningVi: "Diễn đạt lại chính xác hơn khi bị hiểu sai hoặc câu trả lời mơ hồ.",
      exampleEn:
        "Let me rephrase that more precisely: I would delay one feature, not the whole launch.",
      exampleVi:
        "Để tôi diễn đạt chính xác hơn: tôi sẽ hoãn một tính năng, không phải toàn bộ đợt ra mắt.",
      priority: "core",
    },
    {
      id: "b2-stance-pronunciation",
      kind: "pronunciation",
      form: "Prominence and intonation for certainty and contrast",
      meaningVi: "Dùng nhấn và ngữ điệu để phân biệt ưu tiên, khả năng và phản biện.",
      exampleEn:
        "I WOULD reduce the SCOPE; I would NOT cancel the LAUNCH.",
      exampleVi:
        "Nhấn phần đối lập để người nghe hiểu chính xác quyết định.",
      priority: "core",
      pronunciationGoal:
        "Chia câu phức thành thought groups; dừng có chủ đích trước kết luận.",
    },
    {
      id: "b2-register",
      kind: "pragmatics",
      form: "firm but qualified recommendation",
      meaningVi: "Đề xuất rõ nhưng không giả vờ chắc chắn tuyệt đối.",
      exampleEn:
        "Based on the information available, I would recommend a phased response.",
      exampleVi:
        "Dựa trên thông tin hiện có, tôi đề xuất phản ứng theo giai đoạn.",
      priority: "support",
    },
  ],
  steps: [
    {
      id: "b2-scenario",
      kind: "scenario",
      estimatedMinutes: 2,
      titleVi: "Case phỏng vấn có ràng buộc",
      roleVi: "Bạn ứng tuyển vị trí quản lý dự án hoặc trưởng nhóm.",
      situationVi:
        "Một thành viên chủ chốt nghỉ trước ngày ra mắt hai tuần. Ngân sách hạn chế, nhóm còn lại đã bận và khách hàng không muốn đổi ngày.",
      goalVi:
        "Phân tích vấn đề, làm rõ giả định, so sánh phương án, đề xuất và bảo vệ quyết định.",
    },
    {
      id: "b2-model",
      kind: "model",
      estimatedMinutes: 3,
      titleVi: "Nghe câu trả lời có ưu tiên và trade-off",
      replayRates: [0.9, 1],
      turns: [
        {
          speaker: "Interviewer",
          text: "What would you do if a key team member resigned two weeks before launch?",
          translationVi:
            "Bạn sẽ làm gì nếu một thành viên chủ chốt nghỉ hai tuần trước ngày ra mắt?",
        },
        {
          speaker: "Candidate",
          text: "The key issue I would focus on is whether the remaining team can protect the critical scope. My first priority would be to map the tasks and risks within one day.",
          translationVi:
            "Vấn đề chính tôi tập trung là liệu nhóm còn lại có bảo vệ được phạm vi quan trọng không. Ưu tiên đầu tiên là lập bản đồ nhiệm vụ và rủi ro trong một ngày.",
          targetIds: ["b2-frame", "b2-priority"],
        },
        {
          speaker: "Candidate",
          text: "If the critical knowledge were documented, I would consider two options: reallocating an internal specialist or reducing the launch scope.",
          translationVi:
            "Nếu kiến thức quan trọng đã được tài liệu hóa, tôi sẽ cân nhắc hai phương án: điều chuyển chuyên gia nội bộ hoặc giảm phạm vi ra mắt.",
          targetIds: ["b2-hypothetical", "b2-options"],
        },
        {
          speaker: "Candidate",
          text: "This assumes that another team can support us temporarily. If that is not the case, the likely impact would be a short delay or lower scope.",
          translationVi:
            "Điều này giả định nhóm khác có thể hỗ trợ tạm thời. Nếu không, tác động có khả năng là chậm ngắn hoặc giảm phạm vi.",
          targetIds: ["b2-assumption", "b2-consequence"],
        },
        {
          speaker: "Candidate",
          text: "Although a smaller launch could reduce short-term revenue, the advantage is that quality and customer trust are protected. On balance, I would recommend a phased launch.",
          translationVi:
            "Dù ra mắt nhỏ hơn có thể giảm doanh thu ngắn hạn, lợi ích là chất lượng và niềm tin khách hàng được bảo vệ. Sau khi cân nhắc, tôi đề xuất ra mắt theo giai đoạn.",
          targetIds: ["b2-tradeoff", "b2-recommend"],
        },
        {
          speaker: "Interviewer",
          text: "So you would cancel the original launch?",
          translationVi: "Vậy bạn sẽ hủy đợt ra mắt ban đầu?",
        },
        {
          speaker: "Candidate",
          text: "Let me rephrase that more precisely: I would keep the date for the core product and delay only non-critical features.",
          translationVi:
            "Để tôi diễn đạt chính xác hơn: tôi sẽ giữ ngày cho sản phẩm cốt lõi và chỉ hoãn các tính năng không quan trọng.",
          targetIds: ["b2-reformulate", "b2-stance-pronunciation"],
        },
      ],
    },
    {
      id: "b2-notice",
      kind: "notice",
      estimatedMinutes: 2,
      titleVi: "Theo dõi các discourse moves, không săn cấu trúc khó",
      targetIds: [
        "b2-frame",
        "b2-priority",
        "b2-hypothetical",
        "b2-assumption",
        "b2-consequence",
        "b2-options",
        "b2-tradeoff",
        "b2-recommend",
        "b2-reformulate",
      ],
      explanationVi:
        "Câu trả lời B2 mạnh vì quản lý tư duy: đóng khung → ưu tiên → giả định → phương án → hệ quả/trade-off → khuyến nghị → diễn đạt lại. Cấu trúc ngữ pháp chỉ phục vụ các bước đó.",
    },
    {
      id: "b2-practice",
      kind: "practice",
      estimatedMinutes: 4,
      titleVi: "Chọn move phù hợp với dữ kiện",
      adaptive: true,
      exercises: [
        {
          id: "b2-e1",
          kind: "select",
          promptVi: "Câu nào làm rõ giả định?",
          options: [
            "This assumes that temporary support is available.",
            "My first priority would be quality.",
            "On balance, I recommend option A.",
          ],
          answer: "This assumes that temporary support is available.",
          targetIds: ["b2-assumption"],
        },
        {
          id: "b2-e2",
          kind: "order",
          promptVi: "Xếp logic đề xuất.",
          tokens: [
            "The key issue is capacity",
            "I would consider two options",
            "Although option A costs more, it reduces risk",
            "On balance, I recommend option A",
          ],
          answer:
            "The key issue is capacity I would consider two options Although option A costs more, it reduces risk On balance, I recommend option A",
          targetIds: ["b2-frame", "b2-options", "b2-tradeoff", "b2-recommend"],
        },
        {
          id: "b2-e3",
          kind: "listen",
          promptVi: "Người nói chắc chắn đến mức nào?",
          audioText:
            "That might lead to a delay, but the impact would probably be limited.",
          options: ["Khả năng, chưa chắc chắn", "Chắc chắn tuyệt đối", "Không có hệ quả"],
          answer: "Khả năng, chưa chắc chắn",
          targetIds: ["b2-consequence"],
        },
        {
          id: "b2-e4",
          kind: "recall",
          promptVi: "Nói: Sau khi cân nhắc, tôi đề xuất phương án theo giai đoạn.",
          answer: "On balance, I would recommend a phased approach.",
          targetIds: ["b2-recommend"],
        },
        {
          id: "b2-e5",
          kind: "select",
          promptVi: "Người nghe hiểu 'hoãn một phần' thành 'hủy'. Chọn cách sửa.",
          options: [
            "Let me rephrase that more precisely: I would delay one part, not cancel the project.",
            "The key issue is cancellation.",
            "Although cancellation is difficult.",
          ],
          answer:
            "Let me rephrase that more precisely: I would delay one part, not cancel the project.",
          targetIds: ["b2-reformulate"],
        },
      ],
    },
    {
      id: "b2-rehearsal",
      kind: "rehearsal",
      estimatedMinutes: 3,
      titleVi: "Lập decision map từ dữ kiện, không viết bài văn",
      promptVi:
        "Ghi: vấn đề chính, 2 giả định, ưu tiên, 2 phương án, trade-off, đề xuất và rủi ro còn lại. Chuẩn bị một câu để sửa hiểu nhầm.",
      frameEn:
        "The key issue is... My first priority would be... This assumes... I would consider... Although... On balance...",
      keyWords: [
        "issue",
        "priority",
        "assumptions",
        "options",
        "trade-off",
        "recommendation",
      ],
      targetIds: [
        "b2-frame",
        "b2-priority",
        "b2-assumption",
        "b2-options",
        "b2-tradeoff",
        "b2-recommend",
      ],
    },
    {
      id: "b2-performance",
      kind: "performance",
      estimatedMinutes: 5,
      titleVi: "Case 170 giây với câu hỏi phản biện",
      task: {
        roleVi: "Ứng viên quản lý",
        contextVi:
          "Bạn nhận một case mới với ba ràng buộc. Sau 90 giây chuẩn bị, trình bày quyết định. Người phỏng vấn sẽ thay đổi một giả định và phản biện khuyến nghị.",
        goalVi:
          "Đưa ra phân tích có cấu trúc, điều chỉnh theo thông tin mới và bảo vệ quyết định mà không tuyệt đối hóa.",
        promptEn:
          "A critical supplier may miss the deadline, the budget cannot increase, and the client expects the original launch date. What would you do?",
        promptVi:
          "Lượt một trả lời case. Sau phản hồi, lượt hai nhận biến thể: nguồn lực nội bộ cũng không còn. Điều chỉnh phương án và diễn đạt lại điểm người nghe hiểu sai.",
        successCriteriaVi: [
          "Đóng khung đúng vấn đề và nêu ưu tiên.",
          "Nêu rõ ít nhất một giả định và điều chỉnh nếu giả định thay đổi.",
          "So sánh ít nhất hai phương án hoặc trade-off.",
          "Nêu hệ quả với mức độ chắc chắn phù hợp.",
          "Đưa ra khuyến nghị có lý do và giới hạn.",
          "Phản hồi câu hỏi phản biện hoặc reformulate khi bị hiểu sai.",
          "Tổ chức lượt nói thành thought groups để người nghe theo dõi.",
        ],
        targetIds: [
          "b2-frame",
          "b2-priority",
          "b2-hypothetical",
          "b2-assumption",
          "b2-consequence",
          "b2-options",
          "b2-tradeoff",
          "b2-recommend",
          "b2-reformulate",
          "b2-stance-pronunciation",
        ],
        evidence: ["task_checklist", "audio_recording", "self_assessment"],
        attempts: 2,
        preparationSeconds: 90,
        responseSeconds: 170,
        rubric: [
          "task_achievement",
          "comprehensibility",
          "fluency",
          "language_control",
          "interaction_repair",
        ],
      },
    },
    {
      id: "b2-feedback",
      kind: "feedback",
      estimatedMinutes: 2,
      titleVi: "Ưu tiên logic, stance và khả năng điều chỉnh",
      priorityOrder: [
        "task_achievement",
        "comprehensibility",
        "interaction_repair",
        "fluency",
        "language_control",
      ],
      repairPromptsVi: [
        "Giả định nào đang ẩn nhưng ảnh hưởng quyết định?",
        "Trade-off nào chưa được thừa nhận?",
        "Đổi câu chắc chắn tuyệt đối thành might/probably/based on current information nếu phù hợp.",
        "Reformulate kết luận trong một câu ngắn hơn.",
      ],
    },
    {
      id: "b2-exit",
      kind: "exit",
      estimatedMinutes: 2,
      titleVi: "Tách thành bằng chứng độc lập và chuyển giao",
      canDoCheckVi:
        "Tôi có thể phân tích case giả định, nêu giả định/trade-off và điều chỉnh đề xuất khi dữ kiện thay đổi.",
      reviewTargetIds: [
        "b2-frame",
        "b2-assumption",
        "b2-options",
        "b2-tradeoff",
        "b2-recommend",
        "b2-reformulate",
      ],
      confidencePromptVi:
        "Bạn có thể dùng cùng discourse moves cho một case khác mà không dùng lại đúng từ vựng dự án này không?",
    },
  ],
  tags: ["gold", "b2", "hypothetical", "argument", "interview"],
};

export const GOLD_LESSONS: LessonV2[] = [
  GOLD_LESSON_PRE_A1,
  GOLD_LESSON_A1,
  GOLD_LESSON_A2,
  GOLD_LESSON_B1,
  GOLD_LESSON_B2,
];
