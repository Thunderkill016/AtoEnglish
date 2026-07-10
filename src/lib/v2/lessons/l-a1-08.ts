import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — food/drink cafe order: I'd like… / Can I have…?
 * Core: menu · coffee · water · tea · sandwich · bill ·
 * I'd like… · Can I have…? · Here you are · Anything else? · for here / to go
 * Spiral: a1-07 shopping (How much is…? · dollars · I'll take it).
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA108: LessonSpec = {
  id: "l-a1-08",
  phase: "P1",
  cefr: "A1",
  title_vi: "Đồ ăn & order",
  estimatedMin: 35,
  canDo: [
    "Order đồ uống/ăn: I'd like a coffee / Can I have a sandwich?",
    "Hiểu menu + phản hồi staff: Here you are / Anything else?",
    "Hỏi bill / giá nhẹ: The bill, please / How much is it?",
  ],
  situation:
    "Bạn vào cafe / quán ăn khi đi công tác hoặc gặp đồng nghiệp: cần order coffee, water, sandwich; nói for here hoặc to go; xin bill — không cần giải thích món phức tạp.",
  culturalNote_vi:
    "I'd like + a/an + món = lịch sự hơn I want. Can I have…? cũng lịch sự. for here = uống/ăn tại quán; to go / takeaway = mang đi. The bill, please (BrE) / check (AmE). Spiral How much is…? từ a1-07 khi hỏi giá.",
  jobAngle: "Coffee with a colleague or client after a short meeting",
  lexis: [
    {
      id: "v1",
      word: "menu",
      phonetic: "/ˈmenjuː/",
      meaning_vi: "thực đơn",
      example_en: "Can I see the menu, please?",
      l1_note_vi:
        "menu = thực đơn. Can I see the menu? tự nhiên. Không: Can I see menu? (thiếu the).",
    },
    {
      id: "v2",
      word: "coffee",
      phonetic: "/ˈkɒfi/",
      meaning_vi: "cà phê",
      example_en: "I'd like a coffee, please.",
      l1_note_vi:
        "a coffee = một ly cà phê (countable khi order). black coffee / iced coffee.",
    },
    {
      id: "v3",
      word: "water",
      phonetic: "/ˈwɔːtər/",
      meaning_vi: "nước",
      example_en: "Can I have some water?",
      l1_note_vi:
        "some water (uncountable). a bottle of water / a glass of water khi cần cụ thể.",
    },
    {
      id: "v4",
      word: "tea",
      phonetic: "/tiː/",
      meaning_vi: "trà",
      example_en: "I'd like a tea, please.",
      l1_note_vi:
        "a tea = một tách trà khi order. green tea / iced tea. Không: one tea water.",
    },
    {
      id: "v5",
      word: "sandwich",
      phonetic: "/ˈsænwɪtʃ/",
      meaning_vi: "bánh mì kẹp",
      example_en: "Can I have a sandwich?",
      l1_note_vi:
        "san-wich /ˈsænwɪtʃ/ — không «săn-uých» quá dài. a sandwich (countable).",
    },
    {
      id: "v6",
      word: "bill",
      phonetic: "/bɪl/",
      meaning_vi: "hóa đơn",
      example_en: "The bill, please.",
      l1_note_vi:
        "the bill (BrE) = check (AmE). Can I have the bill? / The bill, please.",
    },
    {
      id: "v7",
      word: "I'd like",
      phonetic: "/aɪd laɪk/",
      meaning_vi: "Tôi muốn… (lịch sự)",
      example_en: "I'd like a coffee, please.",
      l1_note_vi:
        "I'd like = I would like — lịch sự hơn I want. + a/an + món. Không: I like a coffee (khác nghĩa).",
    },
    {
      id: "v8",
      word: "Can I have",
      phonetic: "/kæn aɪ hæv/",
      meaning_vi: "Cho tôi… được không?",
      example_en: "Can I have a sandwich, please?",
      l1_note_vi:
        "Can I have + a/an + món (+ please). Tương đương I'd like; không: Can I has…",
    },
    {
      id: "v9",
      word: "Here you are",
      phonetic: "/hɪə juː ɑː/",
      meaning_vi: "Của bạn đây",
      example_en: "Here you are. One coffee.",
      l1_note_vi:
        "Here you are = đưa đồ. Here it is cũng OK. Không: Here are you.",
    },
    {
      id: "v10",
      word: "Anything else?",
      phonetic: "/ˈeniθɪŋ els/",
      meaning_vi: "Còn gì nữa không?",
      example_en: "Anything else?",
      l1_note_vi:
        "Staff hỏi sau order. Trả lời: No, thank you / Yes, a water please.",
    },
    {
      id: "v11",
      word: "for here",
      phonetic: "/fɔː hɪə/",
      meaning_vi: "dùng tại quán",
      example_en: "For here, please.",
      l1_note_vi:
        "for here = ngồi uống/ăn. Đối: to go / takeaway = mang đi.",
    },
    {
      id: "v12",
      word: "to go",
      phonetic: "/tə ɡəʊ/",
      meaning_vi: "mang đi",
      example_en: "To go, please.",
      l1_note_vi:
        "to go (AmE) ≈ takeaway (BrE). For here or to go? — câu staff hay hỏi.",
    },
  ],
  grammar: {
    title: "I'd like… / Can I have…? (ordering)",
    rule: "I'd like + a/an + item. Can I have + a/an + item? Add please. for here / to go.",
    examples: [
      { en: "I'd like a coffee, please.", vi: "Cho tôi một cà phê." },
      { en: "Can I have a sandwich?", vi: "Cho tôi một sandwich được không?" },
      { en: "Can I have some water?", vi: "Cho tôi ít nước?" },
      { en: "For here, please.", vi: "Uống tại quán ạ." },
      { en: "The bill, please.", vi: "Cho hóa đơn ạ." },
    ],
    vnNote:
      "I'd like / Can I have + a/an + món (+ please). I want cũng hiểu nhưng kém lịch sự. some + uncountable (water). for here / to go. Spiral: How much is it? khi hỏi giá (a1-07).",
    ccq: {
      question: "Câu order lịch sự — chọn đúng:",
      options: [
        "I'd like a coffee, please.",
        "I like a coffee, please.",
        "Can I has a coffee?",
        "Give me coffee now.",
      ],
      answer: "I'd like a coffee, please.",
      explanation_vi: "I'd like = I would like (lịch sự); không I like khi order.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Order cà phê lịch sự — câu đúng",
      options: [
        "I'd like a coffee, please.",
        "I like a coffee, please.",
        "How much are coffee?",
        "There is a coffee sofa.",
      ],
      answer: "I'd like a coffee, please.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: Can I _____ a sandwich? (have / has / having)",
      stem: "Can I _____ a sandwich?",
      answer: "have",
      explanation_vi: "Can I have + món.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: like / I'd / a / coffee / please",
      words: ["I'd", "like", "a", "coffee", "please"],
      answer: "I'd like a coffee please",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Mang đi — cụm đúng",
      options: [
        "To go, please.",
        "For go, please.",
        "To here, please.",
        "How much to go?",
      ],
      answer: "To go, please.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: Can I has a tea?",
      stem: "Can I has a tea?",
      answer: "Can I have a tea?",
      explanation_vi: "have (không has) sau Can I.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Xin hóa đơn",
      options: [
        "The bill, please.",
        "I'll take it shirt.",
        "How old is the bill?",
        "There is a bill sofa.",
      ],
      answer: "The bill, please.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Cafe — order with a colleague",
        context_vi:
          "Linh và đồng nghiệp vào cafe sau họp ngắn; staff nhận order.",
        lines: [
          {
            id: "d1-1",
            speaker: "Staff",
            text: "Hi! Can I help you?",
            translation_vi: "Chào! Tôi giúp gì được ạ?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "Yes. Can I see the menu, please?",
            translation_vi: "Vâng. Cho xem menu được không?",
          },
          {
            id: "d1-3",
            speaker: "Staff",
            text: "Here you are.",
            translation_vi: "Của bạn đây.",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "I'd like a coffee, please. And a sandwich.",
            translation_vi: "Cho tôi một cà phê và một sandwich.",
          },
          {
            id: "d1-5",
            speaker: "Staff",
            text: "For here or to go?",
            translation_vi: "Uống tại quán hay mang đi?",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "For here, please.",
            translation_vi: "Tại quán ạ.",
          },
          {
            id: "d1-7",
            speaker: "Staff",
            text: "Anything else?",
            translation_vi: "Còn gì nữa không?",
          },
          {
            id: "d1-8",
            speaker: "Linh",
            text: "Can I have some water? That's all. How much is it?",
            translation_vi: "Cho ít nước. Vậy thôi. Bao nhiêu tiền?",
          },
          {
            id: "d1-9",
            speaker: "Staff",
            text: "It's eight dollars. I'll bring it soon.",
            translation_vi: "Tám đô. Tôi mang ra ngay.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I'd like a coffee please",
        options: [
          "I'd like a coffee please",
          "I like a coffee please",
          "I'd like a tea please",
          "Can I try this on",
        ],
        answer: "I'd like a coffee please",
      },
      {
        id: "lac2",
        audio_text: "Can I have a sandwich",
        options: [
          "Can I have a sandwich",
          "Can I has a sandwich",
          "How much are these shoes",
          "I'll take it",
        ],
        answer: "Can I have a sandwich",
      },
      {
        id: "lac3",
        audio_text: "For here or to go",
        options: [
          "For here or to go",
          "For go or to here",
          "How much is this shirt",
          "Anything else for shop",
        ],
        answer: "For here or to go",
      },
      {
        id: "lac4",
        audio_text: "The bill please",
        options: [
          "The bill please",
          "The cheap please",
          "I'll take the bill shirt",
          "How old is the bill",
        ],
        answer: "The bill please",
      },
    ],
  },
  fluency: {
    items: [
      { en: "I'd like a coffee, please.", vi: "Cho tôi một cà phê." },
      { en: "Can I have a sandwich?", vi: "Cho tôi một sandwich?" },
      { en: "Can I have some water?", vi: "Cho tôi ít nước?" },
      { en: "For here, please.", vi: "Uống tại quán ạ." },
      { en: "To go, please.", vi: "Mang đi ạ." },
      { en: "Anything else? — No, thank you.", vi: "Còn gì nữa? — Không, cảm ơn." },
      { en: "The bill, please.", vi: "Cho hóa đơn ạ." },
      { en: "How much is it?", vi: "Bao nhiêu tiền?" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Bạn ở cafe. Nói 5–7 câu: xem menu → order drink + food (I'd like / Can I have) → for here hoặc to go → Anything else? → bill / How much is it?",
    successCriteria_vi: [
      "Có I'd like… hoặc Can I have… + món",
      "Có for here hoặc to go",
      "Có bill hoặc How much is it?",
      "Có please hoặc No, thank you / Anything else phản hồi",
    ],
    scaffold_en: [
      "Can I see the menu, please?",
      "I'd like a coffee, please.",
      "Can I have a sandwich?",
      "For here, please.",
      "Can I have some water?",
      "No, thank you.",
      "The bill, please.",
      "How much is it?",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Order lịch sự:",
        options: [
          "I'd like a tea, please.",
          "I like a tea, please.",
          "Can I has a tea?",
          "How much are tea?",
        ],
        answer: "I'd like a tea, please.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Can I _____ a coffee?",
        options: ["have", "has", "having", "had"],
        answer: "have",
        explanation_vi: "Can I have + món.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I like a coffee, please là cách order chuẩn trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "I like = thích (sở thích). Order: I'd like…",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Mang đồ đi:",
        options: [
          "To go, please.",
          "For go, please.",
          "I'll take it on.",
          "How much are these shoes?",
        ],
        answer: "To go, please.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "The _____, please. (bill / cheap / shop)",
        answer: "bill",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Here you are nghĩa là…",
        options: ["Của bạn đây", "Bao nhiêu tiền?", "Mang đi", "Rẻ"],
        answer: "Của bạn đây",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-07) Hỏi giá một ly coffee:",
        options: [
          "How much is it?",
          "How much are it?",
          "How old is it?",
          "There is a coffee?",
        ],
        answer: "How much is it?",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-07) It's eight dollars — câu đúng khi…",
        options: [
          "Báo giá một món / hóa đơn",
          "Hỏi tuổi",
          "Order sandwich",
          "Nói for here",
        ],
        answer: "Báo giá một món / hóa đơn",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-07) Muốn mua (shop) — cụm:",
        options: [
          "I'll take it.",
          "I'd like a coffee only for shoes.",
          "How old are these shoes?",
          "There is a sofa bill.",
        ],
        answer: "I'll take it.",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/aɪd/ I'd · /æ/ sandwich · weak to",
    description_vi:
      "I'd /aɪd/ = I would (nối nhanh, không «I would» đầy đủ). sandwich /ˈsænwɪtʃ/: /æ/ như «cat», /w/ nhẹ. to go: to yếu /tə/.",
    examples: [
      {
        word: "I'd like",
        ipa: "/aɪd laɪk/",
        tip_vi: "I'd dính; không tách I + would rõ từng từ.",
      },
      {
        word: "sandwich",
        ipa: "/ˈsænwɪtʃ/",
        tip_vi: "SAN-wich — /æ/ ngắn; /w/ không bỏ.",
      },
      {
        word: "to go",
        ipa: "/tə ɡəʊ/",
        tip_vi: "to yếu /tə/ + go /ɡəʊ/.",
      },
    ],
  },
};
