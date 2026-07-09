import type { LessonSpec } from "@/lib/v2/lesson-spec";

/** P0 — numbers 0–10 & basic price / phone survival */
export const lessonA002: LessonSpec = {
  id: "l-a0-02",
  phase: "P0",
  cefr: "A0",
  title_vi: "Số đếm & giá cơ bản",
  estimatedMin: 32,
  canDo: [
    "Đếm và nói số 0–10 bằng tiếng Anh",
    "Hỏi giá đơn giản: How much is it?",
    "Nói số điện thoại / số phòng theo từng chữ số",
  ],
  situation:
    "Bạn đang ở quầy bán nước hoặc cửa hàng tiện lợi. Nhân viên chỉ vào món và hỏi bằng tiếng Anh. Bạn cần hiểu số, hỏi giá, và nghe số tiền (hoặc số bàn / số phòng) để không nhầm.",
  culturalNote_vi:
    "Giá thường nói theo số: five dollars / fifty thousand. Số điện thoại đọc từng chữ số: 0 đôi khi là oh, không phải zero. Khi nghe giá, nghe kỹ ten vs teen (thirteen / thirty).",
  jobAngle: "Hỏi giá / đọc số bàn khi order, tiếp khách",
  lexis: [
    {
      id: "v1",
      word: "zero",
      phonetic: "/ˈzɪroʊ/",
      meaning_vi: "số 0",
      example_en: "Zero, one, two.",
      l1_note_vi: "Trong số điện thoại người bản ngữ hay nói oh thay zero: 09 = oh-nine.",
    },
    {
      id: "v2",
      word: "one two three",
      phonetic: "/wʌn tuː θriː/",
      meaning_vi: "1, 2, 3",
      example_en: "One, two, three — easy!",
      l1_note_vi: "three có /θ/ (lưỡi giữa răng), không đọc 'tri' như tiếng Việt.",
    },
    {
      id: "v3",
      word: "four five",
      phonetic: "/fɔːr faɪv/",
      meaning_vi: "4, 5",
      example_en: "Four coffees, please.",
    },
    {
      id: "v4",
      word: "six seven",
      phonetic: "/sɪks ˈsevən/",
      meaning_vi: "6, 7",
      example_en: "Room six or room seven?",
    },
    {
      id: "v5",
      word: "eight nine ten",
      phonetic: "/eɪt naɪn ten/",
      meaning_vi: "8, 9, 10",
      example_en: "It is ten dollars.",
      l1_note_vi: "eight không phát âm gh; ten ≠ teen (thirteen, fourteen…).",
    },
    {
      id: "v6",
      word: "number",
      phonetic: "/ˈnʌmbər/",
      meaning_vi: "số / con số",
      example_en: "What is your phone number?",
      l1_note_vi: "phone number = số điện thoại. Không nói number phone.",
    },
    {
      id: "v7",
      word: "How much",
      phonetic: "/haʊ mʌtʃ/",
      meaning_vi: "bao nhiêu (tiền / giá)",
      example_en: "How much is it?",
      l1_note_vi: "How much + không đếm được / giá. How many + đếm được (how many cups?).",
    },
    {
      id: "v8",
      word: "dollar",
      phonetic: "/ˈdɑːlər/",
      meaning_vi: "đô la (đơn vị tiền hay gặp)",
      example_en: "Five dollars, please.",
      l1_note_vi: "1 dollar / 2 dollars (có s). Việt Nam hay nói 'đô' — bản ngữ nói dollars.",
    },
    {
      id: "v9",
      word: "please",
      phonetic: "/pliːz/",
      meaning_vi: "làm ơn / xin",
      example_en: "Two waters, please.",
    },
    {
      id: "v10",
      word: "It is",
      phonetic: "/ɪt ɪz/",
      meaning_vi: "nó là / giá là",
      example_en: "It is five dollars.",
      l1_note_vi: "Trả lời giá: It is five dollars. Không: Is five dollars (thiếu chủ ngữ).",
    },
  ],
  grammar: {
    title: "How much is it?",
    rule: "How much is + noun? → It is + number + dollars.",
    examples: [
      { en: "How much is it?", vi: "Cái này bao nhiêu tiền?" },
      { en: "It is five dollars.", vi: "Năm đô." },
      { en: "How much is the coffee?", vi: "Cà phê bao nhiêu?" },
      { en: "Two waters, please.", vi: "Cho hai nước, làm ơn." },
    ],
    vnNote:
      "How much is it? — câu hỏi giá cố định. Trả lời: It is + số + đơn vị. Không nói How much it? (thiếu is).",
    ccq: {
      question: "Hỏi giá đúng cách?",
      options: [
        "How much it?",
        "How much is it?",
        "How many is it?",
        "What money?",
      ],
      answer: "How much is it?",
      explanation_vi: "Cần is; much cho giá/tiền, không dùng many.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Số sau nine là…",
      options: ["eight", "ten", "seven", "zero"],
      answer: "ten",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Hỏi giá món hàng",
      options: [
        "How much is it?",
        "How many is it?",
        "What price you?",
        "Money how?",
      ],
      answer: "How much is it?",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: is / five / It / dollars",
      words: ["It", "is", "five", "dollars"],
      answer: "It is five dollars",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Hai nước, làm ơn",
      options: [
        "Two waters, please.",
        "Two water please.",
        "Please two water.",
        "Waters two, please.",
      ],
      answer: "Two waters, please.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "phone ___ = số điện thoại",
      stem: "phone ___",
      options: ["number", "name", "letter", "dollar"],
      answer: "number",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Hỏi giá nước",
        context_vi: "Quầy bán đồ uống — hỏi giá và order.",
        lines: [
          {
            id: "1",
            speaker: "Staff",
            text: "Hello! How can I help you?",
            translation_vi: "Xin chào! Tôi giúp gì được ạ?",
          },
          {
            id: "2",
            speaker: "You",
            text: "How much is the water?",
            translation_vi: "Nước bao nhiêu tiền?",
          },
          {
            id: "3",
            speaker: "Staff",
            text: "It is two dollars.",
            translation_vi: "Hai đô.",
          },
          {
            id: "4",
            speaker: "You",
            text: "Two waters, please.",
            translation_vi: "Cho hai nước, làm ơn.",
          },
          {
            id: "5",
            speaker: "Staff",
            text: "Four dollars. Thank you!",
            translation_vi: "Bốn đô. Cảm ơn!",
          },
          {
            id: "6",
            speaker: "You",
            text: "Thank you. Room five.",
            translation_vi: "Cảm ơn. Phòng năm.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "How much is it?",
        options: [
          "How much is it?",
          "How many is it?",
          "What is your name?",
          "How are you?",
        ],
        answer: "How much is it?",
      },
      {
        id: "lac2",
        audio_text: "It is five dollars",
        options: [
          "It is five dollars",
          "It is fine dollars",
          "It is five doors",
          "Is five dollars",
        ],
        answer: "It is five dollars",
      },
      {
        id: "lac3",
        audio_text: "Two waters, please",
        options: [
          "Two waters, please",
          "Too waters, please",
          "Two water please",
          "Ten waters, please",
        ],
        answer: "Two waters, please",
      },
      {
        id: "lac4",
        audio_text: "zero one two three",
        options: [
          "zero one two three",
          "hero one two three",
          "zero one too free",
          "seven one two three",
        ],
        answer: "zero one two three",
      },
    ],
  },
  fluency: {
    items: [
      { en: "Zero, one, two, three.", vi: "0, 1, 2, 3." },
      { en: "Four, five, six.", vi: "4, 5, 6." },
      { en: "Seven, eight, nine, ten.", vi: "7, 8, 9, 10." },
      { en: "How much is it?", vi: "Bao nhiêu tiền?" },
      { en: "It is five dollars.", vi: "Năm đô." },
      { en: "Two waters, please.", vi: "Hai nước, làm ơn." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói to: (1) Đếm 0–10 (2) How much is it? (3) It is + số + dollars (4) Two waters, please.",
    successCriteria_vi: [
      "Đếm được ít nhất 0–5 liên tục",
      "Hỏi How much is it?",
      "Trả lời giá với It is + số",
    ],
    scaffold_en: [
      "Zero, one, two…",
      "How much is it?",
      "It is five dollars.",
      "Two waters, please.",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "How ___ is it?",
        options: ["much", "many", "more", "name"],
        answer: "much",
      },
      {
        id: "q2",
        type: "mcq",
        question: "It is ___ dollars.",
        options: ["five", "fine", "live", "file"],
        answer: "five",
      },
      {
        id: "q3",
        type: "true-false",
        question: "How much is it? = hỏi giá",
        options: ["True", "False"],
        answer: "True",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Số sau eight",
        options: ["nine", "seven", "ten", "six"],
        answer: "nine",
      },
      {
        id: "q5",
        type: "mcq",
        question: "Two waters, ___ .",
        options: ["please", "spell", "from", "meet"],
        answer: "please",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "How do you ___ your name? (bài trước)",
        options: ["spell", "much", "number", "dollar"],
        answer: "spell",
      },
      {
        id: "s2",
        type: "mcq",
        question: "phone ___",
        options: ["number", "dollar", "water", "spell"],
        answer: "number",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/θ/ in three",
    description_vi:
      "three: lưỡi chạm nhẹ giữa răng, thổi hơi — không đọc 'tri' hay 'sri'.",
    examples: [
      { word: "three", ipa: "/θriː/", tip_vi: "Không phải tree (/triː/)." },
      { word: "thanks", ipa: "/θæŋks/", tip_vi: "Cùng /θ/ như three." },
    ],
  },
};
