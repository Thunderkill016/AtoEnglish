import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — shopping / prices: How much is / are…?
 * Core: shop · buy · price · cheap · expensive · dollar ·
 * How much is…? · How much are…? · It's … dollars · I'll take it · Can I try this on?
 * Spiral: a1-02 personal (age / job / phone light — numbers reuse).
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA107: LessonSpec = {
  id: "l-a1-07",
  phase: "P1",
  cefr: "A1",
  title_vi: "Mua sắm",
  estimatedMin: 35,
  canDo: [
    "Hỏi giá: How much is this…? / How much are these…?",
    "Trả lời giá đơn giản: It's ten dollars / They are fifty dollars",
    "Mua hàng ngắn: Can I try this on? / I'll take it / pay by cash or card",
  ],
  situation:
    "Bạn đi cửa hàng / chợ khi đi công tác hoặc du lịch: cần hỏi giá áo, giày, túi; hiểu số tiền (ten / fifty / one hundred dollars); quyết định mua hoặc thôi — không cần mặc cả dài.",
  culturalNote_vi:
    "How much is + số ít (this shirt). How much are + số nhiều (these shoes). It's + số + dollars/dong. Siêu thị/mall: giá cố định; chợ có thể mặc cả (Can I have a discount? — light). pay by card / pay in cash. Spiral số từ a1-02 (phone) + P0 numbers.",
  jobAngle: "Buying work clothes / a gift for a colleague while traveling",
  lexis: [
    {
      id: "v1",
      word: "shop",
      phonetic: "/ʃɒp/",
      meaning_vi: "cửa hàng / mua sắm",
      example_en: "I go to the shop.",
      l1_note_vi:
        "shop (BrE cửa hàng) ≈ store (AmE). go shopping = đi mua sắm (V-ing).",
    },
    {
      id: "v2",
      word: "buy",
      phonetic: "/baɪ/",
      meaning_vi: "mua",
      example_en: "I want to buy a shirt.",
      l1_note_vi:
        "buy + danh từ. I buy / bought (quá khứ). Không: I buying a shirt (thiếu am/want to).",
    },
    {
      id: "v3",
      word: "price",
      phonetic: "/praɪs/",
      meaning_vi: "giá",
      example_en: "What is the price?",
      l1_note_vi:
        "price = giá. How much is…? tự nhiên hơn What is the price of…? trong hội thoại ngắn.",
    },
    {
      id: "v4",
      word: "cheap",
      phonetic: "/tʃiːp/",
      meaning_vi: "rẻ",
      example_en: "This bag is cheap.",
      l1_note_vi:
        "cheap = rẻ (giá). Stress một âm. Không: cheap price lặp (this is cheap là đủ).",
    },
    {
      id: "v5",
      word: "expensive",
      phonetic: "/ɪkˈspensɪv/",
      meaning_vi: "đắt",
      example_en: "These shoes are expensive.",
      l1_note_vi:
        "ex-PEN-sive (stress âm 2). too expensive = quá đắt. SAI stress EX-pen-sive.",
    },
    {
      id: "v6",
      word: "dollar",
      phonetic: "/ˈdɒlər/",
      meaning_vi: "đô la",
      example_en: "It is ten dollars.",
      l1_note_vi:
        "one dollar / two dollars (+s khi >1). Light money: ten, fifty, one hundred dollars.",
    },
    {
      id: "v7",
      word: "How much is",
      phonetic: "/haʊ mʌtʃ ɪz/",
      meaning_vi: "… giá bao nhiêu? (số ít)",
      example_en: "How much is this shirt?",
      l1_note_vi:
        "How much is + this/that + danh từ số ít. SAI: How much this shirt? (thiếu is).",
    },
    {
      id: "v8",
      word: "How much are",
      phonetic: "/haʊ mʌtʃ ɑː/",
      meaning_vi: "… giá bao nhiêu? (số nhiều)",
      example_en: "How much are these shoes?",
      l1_note_vi:
        "How much are + these/those + danh từ số nhiều. SAI: How much is these shoes?",
    },
    {
      id: "v9",
      word: "It's … dollars",
      phonetic: "/ɪts ˈdɒlərz/",
      meaning_vi: "Nó giá … đô",
      example_en: "It's fifty dollars.",
      l1_note_vi:
        "It's + số + dollars (số ít vật). They are + số + dollars (số nhiều). Light: ten / fifty / one hundred.",
    },
    {
      id: "v10",
      word: "I'll take it",
      phonetic: "/aɪl teɪk ɪt/",
      meaning_vi: "Tôi lấy cái này",
      example_en: "OK, I'll take it.",
      l1_note_vi:
        "I'll take it = quyết định mua. I'll take them (số nhiều). Không: I take it now (ít tự nhiên).",
    },
    {
      id: "v11",
      word: "Can I try this on?",
      phonetic: "/kæn aɪ traɪ ðɪs ɒn/",
      meaning_vi: "Tôi thử cái này được không?",
      example_en: "Can I try this on?",
      l1_note_vi:
        "try on = thử đồ (phrasal). try it on / try this on. Không chỉ try this (thiếu on).",
    },
    {
      id: "v12",
      word: "pay",
      phonetic: "/peɪ/",
      meaning_vi: "trả tiền",
      example_en: "I pay by card.",
      l1_note_vi:
        "pay by card / pay in cash. pay for the shirt (for + đồ). Không: I pay the shirt.",
    },
  ],
  grammar: {
    title: "How much is / are…? (prices)",
    rule: "How much is + singular? How much are + plural? It's / They are + number + dollars.",
    examples: [
      { en: "How much is this shirt?", vi: "Chiếc áo này giá bao nhiêu?" },
      { en: "How much are these shoes?", vi: "Đôi giày này giá bao nhiêu?" },
      { en: "It's ten dollars.", vi: "Nó giá mười đô." },
      { en: "They are fifty dollars.", vi: "Chúng giá năm mươi đô." },
      { en: "I'll take it.", vi: "Tôi lấy cái này." },
    ],
    vnNote:
      "is với số ít (this bag); are với số nhiều (these bags). Trả lời: It's + số + dollars (một món) / They are + số + dollars (nhiều món). Spiral số: ten, fifty, one hundred. Không: How much this? (thiếu is/are).",
    ccq: {
      question: "Câu nào đúng khi hỏi giá đôi giày?",
      options: [
        "How much are these shoes?",
        "How much is these shoes?",
        "How much these shoes?",
        "How many are these shoes?",
      ],
      answer: "How much are these shoes?",
      explanation_vi: "shoes = số nhiều → How much are…",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Hỏi giá một chiếc áo — câu đúng",
      options: [
        "How much is this shirt?",
        "How much are this shirt?",
        "How much this shirt?",
        "How many is this shirt?",
      ],
      answer: "How much is this shirt?",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: How much _____ these shoes? (is / are / have)",
      stem: "How much _____ these shoes?",
      answer: "are",
      explanation_vi: "these shoes = số nhiều → are.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: is / How / this / much / bag",
      words: ["How", "much", "is", "this", "bag"],
      answer: "How much is this bag",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Trả lời giá một món — câu đúng",
      options: [
        "It's fifty dollars.",
        "They is fifty dollars.",
        "It are fifty dollars.",
        "It's fifty dollar.",
      ],
      answer: "It's fifty dollars.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: How much is these shoes?",
      stem: "How much is these shoes?",
      answer: "How much are these shoes?",
      explanation_vi: "these shoes → are.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Muốn mua — câu tự nhiên",
      options: [
        "I'll take it.",
        "I take now.",
        "How old are you?",
        "There is a sofa.",
      ],
      answer: "I'll take it.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Clothes shop — ask the price",
        context_vi: "Linh mua áo khi đi công tác; staff hỏi và báo giá bằng dollars.",
        lines: [
          {
            id: "d1-1",
            speaker: "Staff",
            text: "Hello! Can I help you?",
            translation_vi: "Xin chào! Tôi giúp gì được cho bạn?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "Yes, please. How much is this shirt?",
            translation_vi: "Vâng. Chiếc áo này giá bao nhiêu?",
          },
          {
            id: "d1-3",
            speaker: "Staff",
            text: "It's twenty dollars.",
            translation_vi: "Hai mươi đô.",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "And how much are these shoes?",
            translation_vi: "Còn đôi giày này giá bao nhiêu?",
          },
          {
            id: "d1-5",
            speaker: "Staff",
            text: "They are fifty dollars. They're on sale.",
            translation_vi: "Năm mươi đô. Đang sale.",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "Hmm… a bit expensive. Can I try this shirt on?",
            translation_vi: "Hmm… hơi đắt. Tôi thử áo này được không?",
          },
          {
            id: "d1-7",
            speaker: "Staff",
            text: "Of course! The changing room is over there.",
            translation_vi: "Dĩ nhiên! Phòng thử ở đằng kia.",
          },
          {
            id: "d1-8",
            speaker: "Linh",
            text: "OK, I'll take the shirt. I pay by card.",
            translation_vi: "OK, tôi lấy áo. Tôi trả bằng thẻ.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "How much is this shirt",
        options: [
          "How much is this shirt",
          "How much are these shirts",
          "How much is that dress",
          "How many is this shirt",
        ],
        answer: "How much is this shirt",
      },
      {
        id: "lac2",
        audio_text: "How much are these shoes",
        options: [
          "How much are these shoes",
          "How much is these shoes",
          "How much is this shoe",
          "How many are these shoes",
        ],
        answer: "How much are these shoes",
      },
      {
        id: "lac3",
        audio_text: "It's fifty dollars",
        options: [
          "It's fifty dollars",
          "It's fifteen dollars",
          "They are fifty dollars",
          "It's fifty dollar",
        ],
        answer: "It's fifty dollars",
      },
      {
        id: "lac4",
        audio_text: "Can I try this on",
        options: [
          "Can I try this on",
          "Can I buy this on",
          "I'll take it",
          "How much is this",
        ],
        answer: "Can I try this on",
      },
    ],
  },
  fluency: {
    items: [
      { en: "How much is this shirt?", vi: "Chiếc áo này giá bao nhiêu?" },
      { en: "How much are these shoes?", vi: "Đôi giày này giá bao nhiêu?" },
      { en: "It's ten dollars.", vi: "Nó giá mười đô." },
      { en: "They are fifty dollars.", vi: "Chúng giá năm mươi đô." },
      { en: "This bag is cheap.", vi: "Túi này rẻ." },
      { en: "These shoes are expensive.", vi: "Giày này đắt." },
      { en: "Can I try this on?", vi: "Tôi thử cái này được không?" },
      { en: "I'll take it. I pay by card.", vi: "Tôi lấy. Tôi trả bằng thẻ." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Bạn ở cửa hàng. Nói 5–7 câu: hỏi giá 1 món số ít + 1 món số nhiều → nghe/báo giá (ten / fifty / one hundred dollars) → cheap/expensive → try on hoặc I'll take it + pay.",
    successCriteria_vi: [
      "Có How much is + danh từ số ít",
      "Có How much are + danh từ số nhiều",
      "Có giá với số + dollars (hoặc It's / They are…)",
      "Có quyết định mua hoặc try on / pay",
    ],
    scaffold_en: [
      "How much is this shirt?",
      "It's twenty dollars.",
      "How much are these shoes?",
      "They are fifty dollars.",
      "That's a bit expensive.",
      "Can I try this on?",
      "I'll take it.",
      "I pay by card.",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "How much _____ this bag?",
        options: ["is", "are", "have", "do"],
        answer: "is",
        explanation_vi: "this bag = số ít → is.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Câu đúng:",
        options: [
          "How much are these shoes?",
          "How much is these shoes?",
          "How much these shoes?",
          "How many is these shoes?",
        ],
        answer: "How much are these shoes?",
      },
      {
        id: "q3",
        type: "true-false",
        question: "It's fifty dollar (không s) là câu đúng trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "≥2 → dollars (có s). one dollar / fifty dollars.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Muốn thử đồ:",
        options: [
          "Can I try this on?",
          "Can I try this?",
          "How much try on?",
          "I'll try pay.",
        ],
        answer: "Can I try this on?",
      },
      {
        id: "q5",
        type: "cloze",
        question: "How much _____ these bags? (is / are / have)",
        answer: "are",
      },
      {
        id: "q6",
        type: "mcq",
        question: "expensive nghĩa là…",
        options: ["đắt", "rẻ", "cửa hàng", "tiền thối"],
        answer: "đắt",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-02) Hỏi tuổi:",
        options: [
          "How old are you?",
          "How much are you?",
          "How many are you?",
          "What do you price?",
        ],
        answer: "How old are you?",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-02) Nói tuổi — câu đúng:",
        options: [
          "I'm 28 years old.",
          "I have 28 years.",
          "I am 28 old years.",
          "It's 28 dollars old.",
        ],
        answer: "I'm 28 years old.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-02) What's your phone number? — trả lời liên quan:",
        options: [
          "My phone number is 090…",
          "How much is this shirt?",
          "There is a sofa.",
          "I like swimming.",
        ],
        answer: "My phone number is 090…",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/tʃ/ cheap · /ʃ/ shop · PEN stress",
    description_vi:
      "cheap /tʃiːp/: /tʃ/ như «ch» mềm. shop /ʃɒp/: /ʃ/ như «sh». expensive: stress âm 2 PEN — không EX-pen-sive. much /mʌtʃ/: /tʃ/ cuối rõ.",
    examples: [
      {
        word: "cheap",
        ipa: "/tʃiːp/",
        tip_vi: "/tʃ/ + /iː/ dài; không «chip» ngắn.",
      },
      {
        word: "shop",
        ipa: "/ʃɒp/",
        tip_vi: "/ʃ/ không /s/; không «sop».",
      },
      {
        word: "expensive",
        ipa: "/ɪkˈspensɪv/",
        tip_vi: "ex-PEN-sive — stress âm PEN.",
      },
    ],
  },
};
