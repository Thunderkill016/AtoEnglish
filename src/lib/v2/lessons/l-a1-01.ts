import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * Gold pilot lesson v2 — A1 Greetings & self-intro.
 * Proves LessonSpec balance: sparingly lexis, task outcome, L1, fluency known-only.
 */
export const lessonA101: LessonSpec = {
  id: "l-a1-01",
  phase: "P1",
  cefr: "A1",
  title_vi: "Chào hỏi & giới thiệu",
  estimatedMin: 35,
  canDo: [
    "Tự giới thiệu tên và nơi đến bằng 1–2 câu",
    "Chào hỏi và hỏi thăm sức khỏe đơn giản",
    "Tạm biệt lịch sự trong tình huống gặp mặt lần đầu",
  ],
  situation:
    "Ngày đầu đi làm tại công ty có đồng nghiệp nước ngoài. Một người Mỹ tên Alex chìa tay và mỉm cười. Bạn cần chào, nói tên, và hỏi thăm lại — bạn sẽ nói gì?",
  culturalNote_vi:
    "Người bản ngữ dùng Hi! rất thường xuyên, kể cả ở văn phòng. Hello hơi trang trọng hơn. Bắt tay thường ngắn, một cái — không lắc lâu như nhiều tình huống ở Việt Nam.",
  jobAngle: "First day at an international office",
  lexis: [
    {
      id: "v1",
      word: "Hello",
      phonetic: "/həˈloʊ/",
      meaning_vi: "xin chào",
      example_en: "Hello! My name is Linh.",
      l1_note_vi: "Dùng được mọi lúc. Trang trọng hơn Hi một chút khi gặp sếp/khách lần đầu.",
    },
    {
      id: "v2",
      word: "Hi",
      phonetic: "/haɪ/",
      meaning_vi: "chào (thân mật)",
      example_en: "Hi Alex! Nice to meet you.",
      l1_note_vi: "Thân mật, dùng nhiều hơn Hello trong đời thường và team trẻ.",
    },
    {
      id: "v3",
      word: "My name is",
      phonetic: "/maɪ neɪm ɪz/",
      meaning_vi: "tên tôi là",
      example_en: "My name is Minh.",
      l1_note_vi: "Formal hơn I'm Minh. Cả hai đều đúng; I'm phổ biến khi gặp gỡ.",
    },
    {
      id: "v4",
      word: "I'm from",
      phonetic: "/aɪm frɒm/",
      meaning_vi: "tôi đến từ",
      example_en: "I'm from Vietnam.",
      l1_note_vi: "Không nói I from Vietnam (thiếu am/'m) — lỗi hay gặp vì tiếng Việt không có BE.",
    },
    {
      id: "v5",
      word: "Nice to meet you",
      phonetic: "/naɪs tə miːt juː/",
      meaning_vi: "rất vui được gặp bạn",
      example_en: "Nice to meet you too!",
      l1_note_vi: "Nói khi GẶP LẦN ĐẦU. Lần sau dùng Nice to see you.",
    },
    {
      id: "v6",
      word: "How are you?",
      phonetic: "/haʊ ɑːr juː/",
      meaning_vi: "bạn khỏe không?",
      example_en: "Hi! How are you today?",
      l1_note_vi: "Thường là xã giao. Trả lời ngắn: I'm fine, thanks. And you?",
    },
    {
      id: "v7",
      word: "I'm fine",
      phonetic: "/aɪm faɪn/",
      meaning_vi: "tôi khỏe",
      example_en: "I'm fine, thank you.",
      l1_note_vi: "Fine ở đây = ổn/khỏe, không phải 'phạt' hay 'tiền phạt'.",
    },
    {
      id: "v8",
      word: "Goodbye",
      phonetic: "/ɡʊdˈbaɪ/",
      meaning_vi: "tạm biệt",
      example_en: "Goodbye! See you later.",
      l1_note_vi: "Bye ngắn hơn. See you later thân mật khi sẽ gặp lại.",
    },
    {
      id: "v9",
      word: "See you later",
      phonetic: "/siː juː ˈleɪtər/",
      meaning_vi: "hẹn gặp lại",
      example_en: "Bye! See you later!",
      l1_note_vi: "Không cần đúng 'lát nữa' — công thức xã giao khi chia tay.",
    },
    {
      id: "v10",
      word: "Thank you",
      phonetic: "/ˈθæŋk juː/",
      meaning_vi: "cảm ơn",
      example_en: "I'm fine, thank you.",
      l1_note_vi: "Âm th (/θ/) dễ thành t — tập thổi hơi nhẹ: thank, not tank.",
    },
  ],
  grammar: {
    title: "BE — I am / I'm",
    rule: "I + am/'m + name/place/feeling",
    examples: [
      { en: "I am Linh.", vi: "Tôi là Linh." },
      { en: "I'm from Vietnam.", vi: "Tôi đến từ Việt Nam." },
      { en: "I'm fine.", vi: "Tôi khỏe." },
    ],
    vnNote:
      "Tiếng Việt không chia BE. Đừng nói I Linh / I from Vietnam — luôn cần am/'m với I.",
    ccq: {
      question: "Câu nào đúng?",
      options: ["I from Vietnam", "I'm from Vietnam", "I be from Vietnam", "Me from Vietnam"],
      answer: "I'm from Vietnam",
      explanation_vi: "I + 'm (am) + from + place.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Chọn lời chào thân mật với đồng nghiệp trẻ",
      options: ["Hi!", "Dear Sir", "To whom it may concern", "Farewell"],
      answer: "Hi!",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: ___ from Hanoi.",
      stem: "I'm _____ Hanoi.",
      answer: "from",
      explanation_vi: "I'm from + place.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: meet / to / Nice / you",
      words: ["Nice", "to", "meet", "you"],
      answer: "Nice to meet you",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Trả lời How are you?",
      options: ["I'm fine, thanks.", "I'm 25 years old.", "I'm from Vietnam.", "My name is Alex."],
      answer: "I'm fine, thanks.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I from Vietnam.",
      stem: "I from Vietnam.",
      answer: "I'm from Vietnam.",
      explanation_vi: "Thiếu am/'m.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Ngày đầu ở văn phòng",
        context_vi: "Alex gặp Linh lần đầu.",
        lines: [
          {
            id: "d1-1",
            speaker: "Alex",
            text: "Hello! My name is Alex. Nice to meet you.",
            translation_vi: "Xin chào! Mình tên Alex. Rất vui được gặp bạn.",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "Hi Alex! I'm Linh. Nice to meet you too.",
            translation_vi: "Chào Alex! Mình là Linh. Mình cũng rất vui được gặp bạn.",
          },
          {
            id: "d1-3",
            speaker: "Alex",
            text: "Where are you from, Linh?",
            translation_vi: "Bạn đến từ đâu, Linh?",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "I'm from Vietnam. And you?",
            translation_vi: "Mình đến từ Việt Nam. Còn bạn?",
          },
          {
            id: "d1-5",
            speaker: "Alex",
            text: "I'm from the USA. How are you today?",
            translation_vi: "Mình đến từ Mỹ. Hôm nay bạn khỏe không?",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "I'm fine, thank you!",
            translation_vi: "Mình khỏe, cảm ơn!",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "Nice to meet you",
        options: ["How are you?", "Nice to meet you", "Goodbye", "Thank you"],
        answer: "Nice to meet you",
      },
      {
        id: "lac2",
        audio_text: "I'm from Vietnam",
        options: ["I'm fine", "I'm from Vietnam", "My name is Linh", "See you later"],
        answer: "I'm from Vietnam",
      },
      {
        id: "lac3",
        audio_text: "How are you?",
        options: ["How are you?", "Who are you?", "Where are you?", "How old are you?"],
        answer: "How are you?",
      },
      {
        id: "lac4",
        audio_text: "See you later",
        options: ["See you later", "See you yesterday", "Sit you later", "Sea you later"],
        answer: "See you later",
      },
    ],
  },
  fluency: {
    items: [
      { en: "Hello!", vi: "Xin chào!" },
      { en: "Hi! I'm Linh.", vi: "Chào! Mình là Linh." },
      { en: "Nice to meet you.", vi: "Rất vui được gặp bạn." },
      { en: "I'm from Vietnam.", vi: "Mình đến từ Việt Nam." },
      { en: "I'm fine, thank you.", vi: "Mình khỏe, cảm ơn." },
      { en: "See you later!", vi: "Hẹn gặp lại!" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Tưởng tượng bạn gặp Alex. Nói 4–6 câu: chào → tên → đến từ đâu → hỏi How are you? → tạm biệt.",
    successCriteria_vi: [
      "Có chào (Hi/Hello)",
      "Nói được tên (I'm… / My name is…)",
      "Nói được I'm from…",
      "Có hỏi hoặc đáp How are you?",
    ],
    scaffold_en: [
      "Hi! My name is…",
      "I'm from…",
      "Nice to meet you.",
      "How are you?",
      "I'm fine, thanks. Goodbye!",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "_____ name is Alex.",
        options: ["I", "My", "Me", "I'm"],
        answer: "My",
        explanation_vi: "My name is + tên.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "I'm _____ Da Nang.",
        options: ["for", "from", "form", "front"],
        answer: "from",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Nice to meet you dùng khi gặp lần đầu.",
        options: ["True", "False"],
        answer: "True",
      },
      {
        id: "q4",
        type: "mcq",
        question: "How are you? → đáp phù hợp",
        options: ["I'm fine, thanks.", "I'm teacher.", "I'm Vietnam.", "Yes, I am."],
        answer: "I'm fine, thanks.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I ___ Linh. (am / is / are)",
        answer: "am",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn) Chọn lời tạm biệt",
        options: ["See you later", "Nice to meet you", "How are you", "I'm from"],
        answer: "See you later",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn) Câu nào có BE đúng?",
        options: ["I'm fine", "I fine", "I is fine", "Me fine"],
        answer: "I'm fine",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "th /θ/ in thank",
    description_vi: "thank: lưỡi chạm nhẹ răng, thổi hơi — không nói tank.",
    examples: [
      { word: "thank", ipa: "/θæŋk/", tip_vi: "Thổi hơi, không rung dây thanh." },
      { word: "three", ipa: "/θriː/", tip_vi: "Cùng âm th vô thanh." },
    ],
  },
};
