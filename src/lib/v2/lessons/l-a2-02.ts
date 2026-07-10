import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 — future plans survival: will / going to.
 * Core: tomorrow / next week / this week · I'm going to… · I'll… ·
 * plan / meeting / finish / send · What are you going to do…?
 * Spiral: past simple (a2-01), routines (a1-04), job small talk (a1-12).
 * L1 notes 100% (A2 schema gate; task band ≥50% — we ship full).
 */
export const lessonA202: LessonSpec = {
  id: "l-a2-02",
  phase: "P2",
  cefr: "A2",
  title_vi: "Kế hoạch tương lai",
  estimatedMin: 40,
  canDo: [
    "Nói 4–6 câu về kế hoạch tuần này bằng going to / will",
    "Hỏi–đáp What are you going to do…? với câu trả lời ngắn",
    "Phân biệt plan đã định (going to) vs quyết định/offer (will) ở mức sống sót",
  ],
  situation:
    "Stand-up / planning meeting thứ Hai sáng. Lead hỏi: What are you going to do this week? Bạn cần nói kế hoạch: I'm going to finish the report, I'll send it on Friday, Maybe I'll join the client call — dùng going to cho plan đã có, will cho quyết định/offer, không chỉ gật đầu.",
  culturalNote_vi:
    "Ở văn phòng quốc tế, Monday planning rất phổ biến: share 2–4 plans rồi hỏi lại And you? going to = ý định/plan đã có (I'm going to…); will = quyết định lúc nói, offer, hoặc dự đoán nhẹ (I'll send it / I'll help). Đừng dịch máy “sẽ” luôn thành will — plan tuần này hay dùng going to. Tiếng Việt không chia thì tương lai rõ như EN.",
  jobAngle: "Monday planning — What are you going to do this week?",
  lexis: [
    {
      id: "v1",
      word: "tomorrow",
      phonetic: "/təˈmɒrəʊ/",
      meaning_vi: "ngày mai",
      example_en: "I'm going to work from home tomorrow.",
      l1_note_vi:
        "tomorrow = ngày mai (không the tomorrow). Cùng future: I'll call you tomorrow.",
    },
    {
      id: "v2",
      word: "next week",
      phonetic: "/nekst wiːk/",
      meaning_vi: "tuần sau",
      example_en: "We have a meeting next week.",
      l1_note_vi:
        "next week / next month — không the next week. next Monday = thứ Hai tuần sau.",
    },
    {
      id: "v3",
      word: "this week",
      phonetic: "/ðɪs wiːk/",
      meaning_vi: "tuần này",
      example_en: "I'm going to finish the report this week.",
      l1_note_vi:
        "this week = tuần đang diễn ra (kể cả phần còn lại). Không: the this week.",
    },
    {
      id: "v4",
      word: "going to",
      phonetic: "/ˈɡəʊɪŋ tə/",
      meaning_vi: "sẽ / định (kế hoạch đã có)",
      example_en: "I'm going to call the client tomorrow.",
      l1_note_vi:
        "be + going to + V1 = plan/ý định. I'm going to… không I going to… (thiếu am/is/are).",
    },
    {
      id: "v5",
      word: "will",
      phonetic: "/wɪl/",
      meaning_vi: "sẽ (quyết định / offer / dự đoán)",
      example_en: "I'll send the file after the meeting.",
      l1_note_vi:
        "I'll = I will. Dùng khi quyết định lúc nói hoặc hứa/offer. Không: I will to send.",
    },
    {
      id: "v6",
      word: "plan",
      phonetic: "/plæn/",
      meaning_vi: "kế hoạch / lên kế hoạch",
      example_en: "My plan is to finish early on Friday.",
      l1_note_vi:
        "plan (n) a plan; plan (v) plan to + V1. I plan to… ≈ I'm going to…",
    },
    {
      id: "v7",
      word: "meeting",
      phonetic: "/ˈmiːtɪŋ/",
      meaning_vi: "cuộc họp",
      example_en: "We have a meeting at 10 tomorrow.",
      l1_note_vi:
        "meeting = họp (noun). have a meeting / in a meeting. Không: have meeting (thiếu a).",
    },
    {
      id: "v8",
      word: "finish",
      phonetic: "/ˈfɪnɪʃ/",
      meaning_vi: "hoàn thành / xong",
      example_en: "I'm going to finish the slides today.",
      l1_note_vi:
        "finish + noun/V-ing. finish the report / finish working. Không: finish to work.",
    },
    {
      id: "v9",
      word: "send",
      phonetic: "/send/",
      meaning_vi: "gửi",
      example_en: "I'll send the email this afternoon.",
      l1_note_vi:
        "send something to someone. I'll send it to you. Không: send for you (sai nghĩa).",
    },
    {
      id: "v10",
      word: "maybe",
      phonetic: "/ˈmeɪbi/",
      meaning_vi: "có lẽ / có thể",
      example_en: "Maybe I'll join the call later.",
      l1_note_vi:
        "maybe + will cho ý chưa chắc. maybe ≠ may be (may be busy = có thể đang bận).",
    },
  ],
  grammar: {
    title: "Future — going to / will",
    rule: "Plan: be going to + V1. Decide/offer: will + V1 (I'll…)",
    examples: [
      {
        en: "I'm going to finish the report this week.",
        vi: "Tuần này tôi định xong báo cáo.",
      },
      {
        en: "What are you going to do tomorrow?",
        vi: "Ngày mai bạn định làm gì?",
      },
      {
        en: "I'll send it on Friday.",
        vi: "Tôi sẽ gửi vào thứ Sáu.",
      },
      {
        en: "Maybe I'll join the meeting.",
        vi: "Có lẽ tôi sẽ tham gia cuộc họp.",
      },
    ],
    vnNote:
      "Đừng gán “sẽ” = will mọi chỗ. Plan đã có → going to; quyết định lúc nói / hứa gửi file → will. Không: I going to / I will to finish.",
    ccq: {
      question: "Bạn đã có plan từ trước: chọn câu đúng",
      options: [
        "I will to finish the report.",
        "I'm going to finish the report.",
        "I going finish the report.",
        "I finish the report will.",
      ],
      answer: "I'm going to finish the report.",
      explanation_vi: "Plan đã định: be + going to + V1.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Plan đã có — chọn câu đúng",
      options: [
        "I going to call the client.",
        "I'm going to call the client.",
        "I will to call the client.",
        "I going call the client.",
      ],
      answer: "I'm going to call the client.",
      explanation_vi: "I'm / I am + going to + V1.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: What ___ you going to do this week?",
      stem: "What _____ you going to do this week?",
      answer: "are",
      explanation_vi: "What are you going to + V1?",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: send / I'll / Friday / it / on",
      words: ["I'll", "send", "it", "on", "Friday"],
      answer: "I'll send it on Friday",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Quyết định lúc nói (offer) — chọn will",
      options: [
        "I'll help you.",
        "I help you will.",
        "I going to will help.",
        "I will helping you.",
      ],
      answer: "I'll help you.",
      explanation_vi: "Offer/quyết định lúc nói: I'll + V1.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I going to finish the slides tomorrow.",
      stem: "I going to finish the slides tomorrow.",
      answer: "I'm going to finish the slides tomorrow.",
      explanation_vi: "Cần be: I'm / I am going to…",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Trả lời: What are you going to do tomorrow?",
      options: [
        "I'm going to work from home. I'll send the file at 3.",
        "I worked from home yesterday.",
        "I go to work every day only.",
        "I was busy last week.",
      ],
      answer: "I'm going to work from home. I'll send the file at 3.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Monday planning stand-up",
        context_vi: "Sam hỏi Linh kế hoạch tuần này.",
        lines: [
          {
            id: "d1-1",
            speaker: "Sam",
            text: "Hi Linh! What are you going to do this week?",
            translation_vi: "Chào Linh! Tuần này bạn định làm gì?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "I'm going to finish the report. We have a meeting on Wednesday.",
            translation_vi:
              "Mình định xong báo cáo. Thứ Tư tụi mình có cuộc họp.",
          },
          {
            id: "d1-3",
            speaker: "Sam",
            text: "Nice. Are you going to join the client call?",
            translation_vi: "Hay đấy. Bạn có định tham gia cuộc gọi khách không?",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "Maybe. I'll decide tomorrow. And you?",
            translation_vi: "Có lẽ. Mình sẽ quyết ngày mai. Còn bạn?",
          },
          {
            id: "d1-5",
            speaker: "Sam",
            text: "I'm going to plan the slides. I'll send them on Friday.",
            translation_vi:
              "Mình định lên plan slide. Mình sẽ gửi vào thứ Sáu.",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "Great. I'll help if you need me.",
            translation_vi: "Tuyệt. Mình sẽ giúp nếu bạn cần.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Coffee chat — kế hoạch tuần",
        context_vi: "Alex và Linh nói về tomorrow / next week.",
        lines: [
          {
            id: "d2-1",
            speaker: "Alex",
            text: "Are you free tomorrow?",
            translation_vi: "Ngày mai bạn có rảnh không?",
          },
          {
            id: "d2-2",
            speaker: "Linh",
            text: "I'm going to work from home tomorrow. I have a plan.",
            translation_vi: "Ngày mai mình định làm ở nhà. Mình đã có plan.",
          },
          {
            id: "d2-3",
            speaker: "Alex",
            text: "OK. I'll call you next week about the project.",
            translation_vi: "OK. Tuần sau mình sẽ gọi bạn về dự án.",
          },
          {
            id: "d2-4",
            speaker: "Linh",
            text: "Sounds good. Maybe I'll finish early on Friday.",
            translation_vi: "Được đấy. Có lẽ thứ Sáu mình xong sớm.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "What are you going to do this week?",
        options: [
          "What are you going to do this week?",
          "What did you do last week?",
          "What do you do every week?",
          "What are you doing right now?",
        ],
        answer: "What are you going to do this week?",
      },
      {
        id: "lac2",
        audio_text: "I'm going to finish the report",
        options: [
          "I finished the report yesterday",
          "I'm going to finish the report",
          "I go to finish the report",
          "I will to finish the report",
        ],
        answer: "I'm going to finish the report",
      },
      {
        id: "lac3",
        audio_text: "I'll send it on Friday",
        options: [
          "I sent it on Friday",
          "I'll send it on Friday",
          "I send it every Friday",
          "I going send it on Friday",
        ],
        answer: "I'll send it on Friday",
      },
      {
        id: "lac4",
        audio_text: "We have a meeting tomorrow",
        options: [
          "We have a meeting tomorrow",
          "We had a meeting yesterday",
          "We are meeting last week",
          "We have meeting the tomorrow",
        ],
        answer: "We have a meeting tomorrow",
      },
      {
        id: "lac5",
        audio_text: "Maybe I'll join the call later",
        options: [
          "Maybe I joined the call later",
          "Maybe I'll join the call later",
          "Maybe I going join the call",
          "Maybe I join will the call",
        ],
        answer: "Maybe I'll join the call later",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "What are you going to do this week?",
        vi: "Tuần này bạn định làm gì?",
      },
      {
        en: "I'm going to finish the report.",
        vi: "Mình định xong báo cáo.",
      },
      { en: "I'll send it on Friday.", vi: "Mình sẽ gửi vào thứ Sáu." },
      {
        en: "We have a meeting tomorrow.",
        vi: "Ngày mai tụi mình có họp.",
      },
      {
        en: "I'm going to work from home.",
        vi: "Mình định làm việc ở nhà.",
      },
      { en: "Maybe I'll join the call.", vi: "Có lẽ mình sẽ vào cuộc gọi." },
      { en: "I'll help if you need me.", vi: "Mình sẽ giúp nếu bạn cần." },
      { en: "And you?", vi: "Còn bạn?" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Tưởng tượng Sam hỏi What are you going to do this week? Nói 5–7 câu: ≥2 going to (plan) + ≥1 will (gửi/offer/quyết định) + tomorrow/this week/next week + hỏi lại And you?",
    successCriteria_vi: [
      "Có this week / tomorrow / next week",
      "≥2 câu be going to + V1 (plan)",
      "≥1 câu will / I'll… (send, help, decide…)",
      "Có hỏi lại And you? hoặc trả lời ngắn",
    ],
    scaffold_en: [
      "This week I'm going to…",
      "Tomorrow I'm going to…",
      "I'll send / call / help…",
      "Maybe I'll…",
      "And you? What are you going to do?",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "I _____ going to finish the slides today.",
        options: ["am", "is", "are", "be"],
        answer: "am",
        explanation_vi: "I am going to…",
      },
      {
        id: "q2",
        type: "mcq",
        question: "_____ you going to join the meeting?",
        options: ["Is", "Are", "Do", "Did"],
        answer: "Are",
        explanation_vi: "Are you going to + V1?",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I going to call the client. là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: I'm going to call the client.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Quyết định lúc nói — chọn:",
        options: [
          "I'll send the email now.",
          "I sent the email now.",
          "I going send the email.",
          "I will to send the email.",
        ],
        answer: "I'll send the email now.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I'll ___ the file after the meeting. (send)",
        answer: "send",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Plan tuần này — câu tự nhiên nhất:",
        options: [
          "I'm going to work on the report this week.",
          "I worked on the report this week only past.",
          "I will to work on the report.",
          "I going work on the report.",
        ],
        answer: "I'm going to work on the report this week.",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-01) I _____ to a café yesterday.",
        options: ["go", "went", "going", "goes"],
        answer: "went",
        explanation_vi: "yesterday → past simple: went.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn A1) Present simple: I _____ up at seven every day.",
        options: ["get", "got", "getting", "will get"],
        answer: "get",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn) Chọn future plan đúng",
        options: [
          "I going to finish tomorrow",
          "I'm going to finish tomorrow",
          "I finished tomorrow",
          "I did finish tomorrow",
        ],
        answer: "I'm going to finish tomorrow",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "I'll / going to (gonna light)",
    description_vi:
      "I'll = /aɪl/ (một âm, không I will rõ từng từ mỗi lần). going to trong nói nhanh hay /ˈɡənə/ (gonna) — hiểu được, viết formal vẫn going to.",
    examples: [
      {
        word: "I'll send",
        ipa: "/aɪl send/",
        tip_vi: "I'll dính một nhịp — không I… will… ngắt quãng.",
      },
      {
        word: "going to",
        ipa: "/ˈɡəʊɪŋ tə/",
        tip_vi: "Nói chậm: going to; nói nhanh: gonna (nghe).",
      },
      {
        word: "tomorrow",
        ipa: "/təˈmɒrəʊ/",
        tip_vi: "Nhấn -mor-, không to-MOR-row kiểu VN.",
      },
    ],
  },
};
