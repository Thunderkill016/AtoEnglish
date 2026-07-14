import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — first conditional if/when + will.
 * Core: If + present, will + V1 · When + present, will · unless (light).
 * Work/life scenarios. Spiral: b1-04 (must / have to / should / mustn't).
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB105: LessonSpec = {
  id: "l-b1-05",
  phase: "P3",
  cefr: "B1",
  title_vi: "Điều kiện if/when",
  estimatedMin: 40,
  canDo: [
    "Nói điều kiện thực tế: If + present, will + V1",
    "Dùng when + present cho thói quen / kế hoạch chắc",
    "Nói 45–60s work/life: 2–3 câu if/when + will",
  ],
  situation:
    "Office + đời sống: manager hỏi 'What will you do if the client is late?' Đồng nghiệp: 'When you finish, will you join us?' Bạn trả lời 45–60 giây: ≥2 câu If + present + will · ≥1 when + will · 1 kế hoạch dự phòng (unless / if not).",
  culturalNote_vi:
    "First conditional = điều kiện thực / có thể xảy ra (không phải giả định quá khứ). If + present simple, will + V1. When = chắc hơn if. Soften với sếp: If we finish early, we will… Tránh: If I will go… / If it will rain… / When I will arrive… (sai: will trong mệnh đề if/when).",
  jobAngle: "Work plans — deadlines, overtime, client calls; life: rain, traffic, late",
  lexis: [
    {
      id: "v1",
      word: "if",
      phonetic: "/ɪf/",
      meaning_vi: "nếu (điều kiện)",
      example_en: "If the client calls, I will answer.",
      l1_note_vi:
        "if + present, will + V1. Không: If I will call… / If it will rain…",
    },
    {
      id: "v2",
      word: "when",
      phonetic: "/wen/",
      meaning_vi: "khi (chắc / thói quen)",
      example_en: "When you finish, we will review the file.",
      l1_note_vi:
        "when + present, will… (chắc xảy ra). Không: When I will finish…",
    },
    {
      id: "v3",
      word: "will",
      phonetic: "/wɪl/",
      meaning_vi: "sẽ (kết quả tương lai)",
      example_en: "If we start now, we will meet the deadline.",
      l1_note_vi:
        "will + V1 trong mệnh đề kết quả. Không will trong if/when clause.",
    },
    {
      id: "v4",
      word: "unless",
      phonetic: "/ənˈles/",
      meaning_vi: "trừ khi (= if not)",
      example_en: "Unless we hurry, we will miss the call.",
      l1_note_vi:
        "unless ≈ if not. Unless we hurry = If we don't hurry. Không: unless we will…",
    },
    {
      id: "v5",
      word: "deadline",
      phonetic: "/ˈdedlaɪn/",
      meaning_vi: "hạn chót",
      example_en: "If we work late, we will hit the deadline.",
      l1_note_vi:
        "meet / hit / miss a deadline. before the deadline.",
    },
    {
      id: "v6",
      word: "overtime",
      phonetic: "/ˈəʊvətaɪm/",
      meaning_vi: "làm thêm giờ",
      example_en: "If traffic is bad, I will work overtime at home.",
      l1_note_vi:
        "do overtime / work overtime. (không: make overtime).",
    },
    {
      id: "v7",
      word: "late",
      phonetic: "/leɪt/",
      meaning_vi: "muộn / trễ",
      example_en: "If the train is late, I will message you.",
      l1_note_vi:
        "be late / arrive late. late ≠ lately (gần đây).",
    },
    {
      id: "v8",
      word: "traffic",
      phonetic: "/ˈtræfɪk/",
      meaning_vi: "giao thông / kẹt xe",
      example_en: "If traffic is heavy, we will start online.",
      l1_note_vi:
        "heavy traffic / bad traffic. uncountable — không: a traffic.",
    },
    {
      id: "v9",
      word: "rain",
      phonetic: "/reɪn/",
      meaning_vi: "mưa",
      example_en: "If it rains, we will take a taxi.",
      l1_note_vi:
        "If it rains (present). Không: If it will rain…",
    },
    {
      id: "v10",
      word: "cancel",
      phonetic: "/ˈkænsəl/",
      meaning_vi: "hủy (cuộc họp / chuyến)",
      example_en: "If the client cancels, we will reschedule.",
      l1_note_vi:
        "cancel a meeting / call. US cancel · past canceled/cancelled.",
    },
    {
      id: "v11",
      word: "finish",
      phonetic: "/ˈfɪnɪʃ/",
      meaning_vi: "hoàn thành / xong",
      example_en: "When you finish the report, I will check it.",
      l1_note_vi:
        "finish + N / finish + V-ing. When you finish (present).",
    },
    {
      id: "v12",
      word: "plan",
      phonetic: "/plæn/",
      meaning_vi: "kế hoạch / lên kế hoạch",
      example_en: "If the plan changes, we will tell the team.",
      l1_note_vi:
        "a plan / make a plan / plan to + V. If the plan changes…",
    },
  ],
  grammar: {
    title: "First conditional — if / when + will",
    rule: "If/When + present simple, will + V1 · Unless = if not",
    examples: [
      {
        en: "If the client calls, I will answer right away.",
        vi: "Nếu khách gọi, tôi sẽ trả lời ngay.",
      },
      {
        en: "When you finish, we will review the file together.",
        vi: "Khi bạn xong, chúng ta sẽ review file cùng nhau.",
      },
      {
        en: "Unless we hurry, we will miss the deadline.",
        vi: "Trừ khi chúng ta nhanh lên, chúng ta sẽ lỡ hạn chót.",
      },
    ],
    vnNote:
      "First conditional: If/When + hiện tại đơn, will + V1 (kết quả tương lai thực). Unless = if not. Sai hay gặp: If I will go… / When I will arrive… — không dùng will trong mệnh đề if/when.",
    ccq: {
      question: "Câu first conditional đúng?",
      options: [
        "If it rains, we will take a taxi",
        "If it will rain, we take a taxi",
        "If it rains, we takes a taxi",
        "When I will finish, I call you",
      ],
      answer: "If it rains, we will take a taxi",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "First conditional: If the client ___, I will answer.",
      options: ["calls", "will call", "calling", "call will"],
      answer: "calls",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Kết quả tương lai: If we start now, we ___ the deadline.",
      options: ["will meet", "meet will", "meeting", "will meeting"],
      answer: "will meet",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: rains / If / it / we / will / take / a / taxi",
      words: ["If", "it", "rains", "we", "will", "take", "a", "taxi"],
      answer: "If it rains we will take a taxi",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: If I will finish early, I will join you.",
      stem: "If I will finish early, I will join you.",
      answer: "If I finish early, I will join you.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "unless ≈",
      options: ["if not", "always when", "must never", "only past"],
      answer: "if not",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "when (first conditional) thường =",
      options: [
        "chắc / thói quen xảy ra",
        "không bao giờ xảy ra",
        "chỉ quá khứ",
        "cấm tuyệt đối",
      ],
      answer: "chắc / thói quen xảy ra",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Manager — deadline & overtime",
        context_vi: "Manager bàn plan nếu client trễ / team xong sớm.",
        lines: [
          {
            id: "1",
            speaker: "Manager",
            text: "If the client is late, we will start without them.",
            translation_vi: "Nếu khách trễ, chúng ta sẽ bắt đầu không có họ.",
          },
          {
            id: "2",
            speaker: "Lan",
            text: "What will we do if we miss the deadline?",
            translation_vi: "Chúng ta sẽ làm gì nếu lỡ hạn chót?",
          },
          {
            id: "3",
            speaker: "Manager",
            text: "If we work overtime tonight, we will still hit it.",
            translation_vi: "Nếu làm thêm tối nay, chúng ta vẫn kịp.",
          },
          {
            id: "4",
            speaker: "Lan",
            text: "When I finish the slides, will you check them?",
            translation_vi: "Khi tôi xong slide, bạn sẽ check giúp chứ?",
          },
          {
            id: "5",
            speaker: "Manager",
            text: "Yes. When you finish, I will review them right away.",
            translation_vi: "Có. Khi bạn xong, tôi sẽ review ngay.",
          },
          {
            id: "6",
            speaker: "Manager",
            text: "Unless the plan changes, we will send the file by five.",
            translation_vi: "Trừ khi plan đổi, chúng ta sẽ gửi file trước năm giờ.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Colleague — mưa, kẹt xe & họp",
        context_vi: "Đồng nghiệp bàn plan nếu mưa / kẹt xe trước cuộc họp.",
        lines: [
          {
            id: "1",
            speaker: "Minh",
            text: "If it rains, will you still come to the office?",
            translation_vi: "Nếu mưa, bạn vẫn vào office chứ?",
          },
          {
            id: "2",
            speaker: "Hoa",
            text: "If it rains, I will take a taxi.",
            translation_vi: "Nếu mưa, tôi sẽ đi taxi.",
          },
          {
            id: "3",
            speaker: "Minh",
            text: "If traffic is heavy, we will join the call online.",
            translation_vi: "Nếu kẹt xe, chúng ta sẽ join call online.",
          },
          {
            id: "4",
            speaker: "Hoa",
            text: "When you arrive, message me — I will save you a seat.",
            translation_vi: "Khi bạn đến, nhắn tôi — tôi sẽ giữ chỗ.",
          },
          {
            id: "5",
            speaker: "Minh",
            text: "If the client cancels, we will reschedule for Friday.",
            translation_vi: "Nếu khách hủy, chúng ta sẽ dời sang thứ Sáu.",
          },
          {
            id: "6",
            speaker: "Hoa",
            text: "Unless they cancel, I will prepare the agenda tonight.",
            translation_vi: "Trừ khi họ hủy, tối nay tôi sẽ soạn agenda.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "If the client calls, I will answer",
        options: [
          "If the client calls, I will answer",
          "If the client will call, I answer",
          "If the client calling, I will answer",
          "If client calls, I answering",
        ],
        answer: "If the client calls, I will answer",
      },
      {
        id: "lac2",
        audio_text: "When you finish, we will review the file",
        options: [
          "When you finish, we will review the file",
          "When you will finish, we review the file",
          "When you finishing, we will review",
          "When finish you, we will review the file",
        ],
        answer: "When you finish, we will review the file",
      },
      {
        id: "lac3",
        audio_text: "If it rains, we will take a taxi",
        options: [
          "If it rains, we will take a taxi",
          "If it will rain, we take a taxi",
          "If it raining, we will take a taxi",
          "If rains it, we will take taxi",
        ],
        answer: "If it rains, we will take a taxi",
      },
      {
        id: "lac4",
        audio_text: "Unless we hurry, we will miss the deadline",
        options: [
          "Unless we hurry, we will miss the deadline",
          "Unless we will hurry, we miss the deadline",
          "Unless we hurry, we missing the deadline",
          "Unless hurry we, will miss the deadline",
        ],
        answer: "Unless we hurry, we will miss the deadline",
      },
      {
        id: "lac5",
        audio_text: "If traffic is heavy, we will start online",
        options: [
          "If traffic is heavy, we will start online",
          "If traffic will be heavy, we start online",
          "If traffic heavy is, we will start online",
          "If a traffic is heavy, we will start online",
        ],
        answer: "If traffic is heavy, we will start online",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "If the client calls, I will answer.",
        vi: "Nếu khách gọi, tôi sẽ trả lời.",
      },
      {
        en: "When you finish, we will review it.",
        vi: "Khi bạn xong, chúng ta sẽ review.",
      },
      {
        en: "If it rains, we will take a taxi.",
        vi: "Nếu mưa, chúng ta sẽ đi taxi.",
      },
      {
        en: "Unless we hurry, we will miss it.",
        vi: "Trừ khi nhanh lên, chúng ta sẽ lỡ.",
      },
      {
        en: "If traffic is heavy, we will join online.",
        vi: "Nếu kẹt xe, chúng ta sẽ join online.",
      },
      {
        en: "If we work overtime, we will hit the deadline.",
        vi: "Nếu làm thêm, chúng ta sẽ kịp hạn chót.",
      },
      {
        en: "When you arrive, I will message you.",
        vi: "Khi bạn đến, tôi sẽ nhắn.",
      },
      {
        en: "If the plan changes, we will tell the team.",
        vi: "Nếu plan đổi, chúng ta sẽ báo team.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s plan work/life: ≥2 câu If + present + will → ≥1 When + will → ≥1 unless hoặc if not. Có thể nhắc deadline / rain / traffic / overtime / client.",
    successCriteria_vi: [
      "Có ≥2 câu If + present simple + will",
      "Có ≥1 câu When + present + will",
      "Có ≥1 unless hoặc if … not … will",
      "Có từ deadline / rain / traffic / overtime / client (ít nhất 1)",
    ],
    scaffold_en: [
      "If …, I/we will…",
      "When …, I/we will…",
      "Unless …, we will…",
      "If the client is late / If it rains / When I finish…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "If clause uses:",
        options: [
          "present simple",
          "will always",
          "past perfect only",
          "going to only",
        ],
        answer: "present simple",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Correct first conditional",
        options: [
          "If it rains, we will take a taxi",
          "If it will rain, we take a taxi",
          "If it rains, we takes a taxi",
          "When I will finish, I call",
        ],
        answer: "If it rains, we will take a taxi",
      },
      {
        id: "q3",
        type: "mcq",
        question: "unless ≈",
        options: ["if not", "always must", "only past", "never when"],
        answer: "if not",
      },
      {
        id: "q4",
        type: "true-false",
        question: "If I will finish early, I will join you. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "When you finish, we ___ review the file.",
        options: ["will", "will to", "are will", "willing"],
        answer: "will",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Result clause often uses:",
        options: ["will + V1", "must to + V", "V-ing only", "did + V"],
        answer: "will + V1",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-04) Strong obligation: You ___ wear a badge.",
        options: ["must", "must to", "are must", "musting"],
        answer: "must",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-04) Advice: You ___ read the policy.",
        options: ["should", "should to", "must always only", "is should"],
        answer: "should",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-04) External rule: We ___ finish before Friday.",
        options: ["have to", "have to to", "has must", "are have"],
        answer: "have to",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-04) mustn't ≈",
        options: [
          "not allowed / forbidden",
          "optional choice",
          "maybe later",
          "only weekends",
        ],
        answer: "not allowed / forbidden",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "if /ɪf/ · when /wen/ · will /wɪl/",
    description_vi:
      "if /ɪf/ — /ɪ/ ngắn. when /wen/ — /w/ rõ, không thành /ven/. will /wɪl/ — /ɪ/ ngắn (khác we'll /wiːl/). Nối: If_it rains · When_you finish. Stress: DEAD-line, O-ver-time, un-LESS.",
    examples: [
      { word: "if", tip_vi: "/ɪf/ không thành /iːf/" },
      { word: "when", tip_vi: "/wen/ /w/ rõ" },
      { word: "will", tip_vi: "/wɪl/ ngắn; we'll = /wiːl/" },
      { word: "unless", tip_vi: "stress un-LESS" },
    ],
  },
};
