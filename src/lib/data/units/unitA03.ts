import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-3 — Màu Sắc & Mô Tả (Colors & Basic Descriptions)
// Level 0 / Foundation — Pre-CEFR A0
// Grammar: Adjective BEFORE noun (e.g. "a red car" not "a car red")
// L1 Alert: Vietnamese puts adjective AFTER noun — directly opposite to English!
//   "xe đỏ" (car red) vs "red car" — the most universal A0 word order error
// ─────────────────────────────────────────────────────────────────────────────

export const unitA03: UnitData = {
  unitId: "unit-a0-3",
  title: "Unit A0-3: Màu Sắc & Mô Tả",
  level: "A0",
  xp: 60,
  estimatedTime: 40,
  description:
    "Học từ vựng về màu sắc và kích thước — nền tảng để mô tả mọi thứ xung quanh bạn.",
  badgeName: "Người Quan Sát",
  badgeEmoji: "🎨",

  situation:
    "Bạn đang mua áo tại H&M và nhân viên hỏi: \"Which color do you want?\" — bạn muốn chiếc áo xanh to. Nói gì?",

  learningOutcomes: [
    "Nói được 8 màu sắc cơ bản bằng tiếng Anh",
    "Mô tả vật bằng màu sắc + kích thước",
    "Dùng tính từ TRƯỚC danh từ (khác tiếng Việt!)",
  ],

  culturalNote:
    'Khác với tiếng Việt đặt tính từ <span class="text-emerald-400 font-semibold">SAU</span> danh từ (xe đỏ = car red), tiếng Anh LUÔN đặt tính từ <span class="text-emerald-400 font-semibold">TRƯỚC</span> danh từ: "a red car". Đây là điểm khác biệt quan trọng nhất trong từ vựng cơ bản cho người Việt học tiếng Anh!',

  warmupGreetings: [
    {
      emoji: "🔴",
      en: "I want the red shirt, please.",
      vn: "Tôi muốn cái áo đỏ, làm ơn.",
      context: "Chọn màu khi mua áo",
    },
    {
      emoji: "📦",
      en: "The big black bag is beautiful.",
      vn: "Cái túi đen to thật đẹp.",
      context: "Mô tả vật bằng màu + kích thước",
    },
    {
      emoji: "🚗",
      en: "He has a small blue car.",
      vn: "Anh ấy có một chiếc xe nhỏ màu xanh.",
      context: "Tính từ trước danh từ",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "red",
      emoji: "🔴",
      phonetic: "/red/",
      meaning: "Màu đỏ",
      example: "She wears a red dress.",
      example2: "The traffic light is red — stop!",
      collocation: "red light / red wine / red card",
      audio: "/audio/unit-a0-3/red.mp3",
    },
    {
      id: 2,
      word: "blue",
      emoji: "🔵",
      phonetic: "/bluː/",
      meaning: "Màu xanh dương",
      example: "The sky is blue.",
      example2: "I like blue jeans.",
      collocation: "blue sky / navy blue / blue eyes",
      audio: "/audio/unit-a0-3/blue.mp3",
    },
    {
      id: 3,
      word: "green",
      emoji: "🟢",
      phonetic: "/ɡriːn/",
      meaning: "Màu xanh lá",
      example: "The grass is green.",
      example2: "She has a green bag.",
      collocation: "green tea / green card / go green",
      audio: "/audio/unit-a0-3/green.mp3",
    },
    {
      id: 4,
      word: "yellow",
      emoji: "🟡",
      phonetic: "/ˈjeləʊ/",
      meaning: "Màu vàng",
      example: "The banana is yellow.",
      example2: "He drives a yellow taxi.",
      collocation: "yellow light / yellow fever / mellow yellow",
      audio: "/audio/unit-a0-3/yellow.mp3",
    },
    {
      id: 5,
      word: "white",
      emoji: "⬜",
      phonetic: "/waɪt/",
      meaning: "Màu trắng",
      example: "She wears a white dress at her wedding.",
      example2: "The walls are white.",
      collocation: "white rice / white wine / snow white",
      audio: "/audio/unit-a0-3/white.mp3",
    },
    {
      id: 6,
      word: "black",
      emoji: "⬛",
      phonetic: "/blæk/",
      meaning: "Màu đen",
      example: "He wears a black suit.",
      example2: "I drink black coffee.",
      collocation: "black coffee / black market / black and white",
      audio: "/audio/unit-a0-3/black.mp3",
    },
    {
      id: 7,
      word: "big",
      emoji: "🐘",
      phonetic: "/bɪɡ/",
      meaning: "To / Lớn",
      example: "That is a big elephant!",
      example2: "She has a big smile.",
      collocation: "big city / big deal / big brother",
      audio: "/audio/unit-a0-3/big.mp3",
    },
    {
      id: 8,
      word: "small",
      emoji: "🐭",
      phonetic: "/smɔːl/",
      meaning: "Nhỏ / Bé",
      example: "I live in a small apartment.",
      example2: "Can I have a small coffee?",
      collocation: "small talk / small business / small world",
      audio: "/audio/unit-a0-3/small.mp3",
    },
    {
      id: 9,
      word: "old",
      emoji: "🏚️",
      phonetic: "/əʊld/",
      meaning: "Cũ / Già",
      example: "This is an old building.",
      example2: "He has an old car but it works fine.",
      collocation: "old friend / old school / old-fashioned",
      audio: "/audio/unit-a0-3/old.mp3",
    },
    {
      id: 10,
      word: "new",
      emoji: "✨",
      phonetic: "/njuː/",
      meaning: "Mới",
      example: "I bought a new phone.",
      example2: "She has new shoes.",
      collocation: "brand new / new year / what's new",
      audio: "/audio/unit-a0-3/new.mp3",
    },
  ],

  grammar: {
    title: "Tính từ đứng TRƯỚC danh từ",
    rule: "Tiếng Anh: Tính từ + Danh từ → \"a red car\" | Tiếng Việt: Danh từ + Tính từ → \"xe đỏ\"",
    conjugation: [
      { subject: "✅ ĐÚNG",   form: "Adj + Noun",  example: "a RED car / a BIG bag / a NEW phone" },
      { subject: "❌ SAI",    form: "Noun + Adj",  example: "a car red / a bag big / a phone new" },
      { subject: "Nhiều adj", form: "Adj + Adj + Noun", example: "a big red bag / a small blue car" },
    ],
    examples: [
      { en: "I want the red shirt.",         vn: "Tôi muốn cái áo đỏ." },
      { en: "She has a big black bag.",      vn: "Cô ấy có một cái túi đen to." },
      { en: "He drives a small white car.",  vn: "Anh ấy lái một chiếc xe trắng nhỏ." },
      { en: "It is a new green bicycle.",    vn: "Đó là một chiếc xe đạp xanh mới." },
    ],
    tip: "Khi dùng nhiều tính từ, thứ tự chuẩn trong tiếng Anh: Kích thước → Tuổi → Màu sắc → Xuất xứ. Ví dụ: 'a big old black French car'. Ở A0 chỉ cần nhớ: tính từ đi TRƯỚC danh từ!",

    vnNote:
      "⚠️ LỖI ĐẶC TRƯNG CỦA NGƯỜI VIỆT: Đặt tính từ SAU danh từ!\n\nTiếng Việt: xe đỏ / túi to / áo xanh → danh từ trước\nTiếng Anh NGƯỢC HOÀN TOÀN: red car / big bag / blue shirt → tính từ trước\n\n❌ 'I want the shirt red.' (kiểu Việt Nam)\n✅ 'I want the RED shirt.' (tiếng Anh đúng)\n\n❌ 'She has a bag big black.'\n✅ 'She has a big black bag.'\n\nHãy luyện tập cho đến khi thứ tự này trở thành phản xạ!",

    dialogueExample: {
      speaker: "Customer",
      text: "Excuse me — I want the big blue bag, please.",
      translation: "Xin lỗi — tôi muốn cái túi xanh to, làm ơn.",
      highlight: "big blue bag",
    },

    ccq: {
      question: "Câu nào đặt tính từ ĐÚNG vị trí trong tiếng Anh?",
      options: [
        "I want the shirt red.",
        "I want the red shirt. ✓",
        "I want red the shirt.",
        "I want shirt the red.",
      ],
      answer: "I want the red shirt. ✓",
    },
  },

  matchingExercise: {
    title: "Nối màu sắc với vật thể cùng màu",
    pairs: [
      { left: "red",    right: "🍎 apple" },
      { left: "blue",   right: "🌊 ocean" },
      { left: "green",  right: "🌿 leaf" },
      { left: "yellow", right: "🍌 banana" },
      { left: "black",  right: "☕ black coffee" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq3-1",
      question: "Câu nào đúng ngữ pháp tiếng Anh?",
      options: [
        "I have a car red.",
        "I have a red car.",
        "I have car the red.",
        "Red I have car.",
      ],
      answer: "I have a red car.",
      type: "multiple-choice",
    },
    {
      id: "pq3-2",
      question: "Điền từ còn thiếu: 'She has a ___ black bag.' (to)",
      options: [],
      answer: "big",
      type: "cloze",
    },
    {
      id: "pq3-3",
      question: "Dịch: 'Cái áo xanh mới' sang tiếng Anh",
      options: [],
      answer: "a new blue shirt",
      type: "translate",
    },
  ],

  practiceTranslate: [
    {
      id: "pt3-1",
      prompt_vn: "Tôi muốn cái áo đỏ.",
      answer: "I want the red shirt.",
    },
    {
      id: "pt3-2",
      prompt_vn: "Cô ấy có một cái túi đen to.",
      answer: "She has a big black bag.",
    },
    {
      id: "pt3-3",
      prompt_vn: "Tôi sống trong một căn hộ nhỏ mới.",
      answer: "I live in a small new apartment.",
    },
  ],

  scrambleExercises: [
    {
      id: "s3-1",
      prompt_vn: "Đây là một chiếc xe hơi đỏ to.",
      words: ["It", "is", "a", "big", "red", "car", "."],
      answer: "It is a big red car .",
    },
    {
      id: "s3-2",
      prompt_vn: "Cô ấy mặc một cái áo xanh nhỏ.",
      words: ["She", "wears", "a", "small", "blue", "shirt", "."],
      answer: "She wears a small blue shirt .",
    },
    {
      id: "s3-3",
      prompt_vn: "Tôi muốn cái túi đen mới.",
      words: ["I", "want", "the", "new", "black", "bag", "."],
      answer: "I want the new black bag .",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Mua áo tại cửa hàng",
      audio: "/audio/unit-a0-3/dialogue_1.mp3",
      desc: "Linh mua áo tại H&M và nhân viên giúp cô chọn màu.",
      lines: [
        {
          id: "d3-1-1",
          speaker: "Staff",
          text: "Hello! Can I help you?",
          translation: "Xin chào! Tôi có thể giúp gì cho bạn?",
        },
        {
          id: "d3-1-2",
          speaker: "Linh",
          text: "Yes, please. I want a blue shirt.",
          translation: "Vâng, làm ơn. Tôi muốn một cái áo xanh.",
        },
        {
          id: "d3-1-3",
          speaker: "Staff",
          text: "Small or big?",
          translation: "Cỡ nhỏ hay to?",
        },
        {
          id: "d3-1-4",
          speaker: "Linh",
          text: "Big, please. How much is it?",
          translation: "To, làm ơn. Nó giá bao nhiêu?",
        },
        {
          id: "d3-1-5",
          speaker: "Staff",
          text: "The big blue shirt is twenty-five dollars.",
          translation: "Cái áo xanh to là hai mươi lăm đô la.",
        },
        {
          id: "d3-1-6",
          speaker: "Linh",
          text: "I'll take it!",
          translation: "Tôi lấy cái đó!",
        },
      ],
    },
    {
      id: 2,
      title: "Mô tả vật bị mất",
      audio: "/audio/unit-a0-3/dialogue_2.mp3",
      desc: "Minh báo mất túi cho nhân viên khách sạn.",
      lines: [
        {
          id: "d3-2-1",
          speaker: "Staff",
          text: "What does your bag look like?",
          translation: "Cái túi của bạn trông như thế nào?",
        },
        {
          id: "d3-2-2",
          speaker: "Minh",
          text: "It is a big black bag. It is new.",
          translation: "Đó là một cái túi đen to. Nó mới.",
        },
        {
          id: "d3-2-3",
          speaker: "Staff",
          text: "Is there anything else special?",
          translation: "Có gì đặc biệt khác không?",
        },
        {
          id: "d3-2-4",
          speaker: "Minh",
          text: "Yes — it has a small red logo.",
          translation: "Có — nó có logo đỏ nhỏ.",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac3-1",
      audio_text: "a big red car",
      options: ["a car big red", "a big red car", "a red big car", "a car red big"],
      answer: "a big red car",
    },
    {
      id: "lac3-2",
      audio_text: "She has a small blue bag",
      options: [
        "She has a bag small blue",
        "She has a blue small bag",
        "She has a small blue bag",
        "She has a small bag blue",
      ],
      answer: "She has a small blue bag",
    },
    {
      id: "lac3-3",
      audio_text: "yellow",
      options: ["yellow", "jello", "yell", "mellow"],
      answer: "yellow",
    },
  ],

  fluencyDrill: {
    title: "Phản xạ màu sắc & mô tả",
    items: [
      { en: "a red shirt",        vn: "một cái áo đỏ" },
      { en: "a big black bag",    vn: "một cái túi đen to" },
      { en: "a small blue car",   vn: "một chiếc xe xanh nhỏ" },
      { en: "a new green phone",  vn: "một chiếc điện thoại xanh mới" },
      { en: "the white house",    vn: "ngôi nhà trắng" },
      { en: "yellow and black",   vn: "vàng và đen" },
      { en: "I want the red one.", vn: "Tôi muốn cái màu đỏ." },
      { en: "What color is it?",  vn: "Nó màu gì vậy?" },
    ],
  },

  speaking: {
    level1Prompt: "I want the {input} shirt, please.",
    level1Placeholder: "Nhập màu sắc (VD: red, blue, green)...",
    level2Situation:
      "Bạn đến cửa hàng và tìm một món đồ cụ thể. Mô tả màu sắc và kích thước, hỏi giá và quyết định mua hay không.",
    level2Hint:
      "Excuse me. I want a [màu] [kích thước] [vật]. How much is it? I'll take it! / That's too expensive.",
  },

  quiz: [
    {
      id: "q3-1",
      question: "Câu nào ĐẶT TÍNH TỪ đúng vị trí?",
      options: [
        "I have a car red.",
        "I have a red car.",
        "I have car a red.",
        "Red I have car a.",
      ],
      answer: "I have a red car.",
      type: "multiple-choice",
    },
    {
      id: "q3-2",
      question: "Màu gì là màu của bầu trời?",
      options: ["red", "green", "blue", "yellow"],
      answer: "blue",
      type: "multiple-choice",
    },
    {
      id: "q3-3",
      question: "Điền từ còn thiếu: 'She has a ___ blue bag.' (to)",
      options: [],
      answer: "big",
      type: "cloze",
    },
    {
      id: "q3-4",
      question: "Điền từ còn thiếu: 'I want the ___ shirt.' (đỏ)",
      options: [],
      answer: "red",
      type: "cloze",
    },
    {
      id: "q3-5",
      question: "Cái áo đen mới đặt theo thứ tự tiếng Anh là gì?",
      options: [
        "a shirt new black",
        "a black new shirt",
        "a new black shirt",
        "a shirt black new",
      ],
      answer: "a new black shirt",
      type: "multiple-choice",
    },
    {
      id: "q3-6",
      question: "Tôi muốn cái áo xanh to. (Dịch sang tiếng Anh)",
      options: [],
      answer: "I want the big blue shirt.",
      type: "translate",
    },
    {
      id: "q3-7",
      question: "Cô ấy có một chiếc xe đỏ nhỏ. (Dịch sang tiếng Anh)",
      options: [],
      answer: "She has a small red car.",
      type: "translate",
    },
  ],
};

export default unitA03;
