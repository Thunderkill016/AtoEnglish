import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-1 — Bảng Chữ Cái & Âm Cơ Bản (The Alphabet & Basic Sounds)
// Level 0 / Foundation — Pre-CEFR A0  [FIRST UNIT — Entry Point]
// Grammar: Verb BE — "My name is..." (simplest possible first grammar)
// L1 Alert: "My name Minh" (missing IS) — be-deletion is the #1 VN error
// ─────────────────────────────────────────────────────────────────────────────

export const unitA01: UnitData = {
  unitId: "unit-a0-1",
  title: "Unit A0-1: Bảng Chữ Cái & Âm Cơ Bản",
  level: "A0",
  xp: 60,
  estimatedTime: 45,
  description:
    "Học 26 chữ cái tiếng Anh và cách phát âm cơ bản — nền tảng đầu tiên của hành trình học tiếng Anh.",
  badgeName: "Người Khám Phá",
  badgeEmoji: "🔤",

  situation:
    "Bạn cần điền tên vào form đăng ký bằng tiếng Anh — nhân viên hỏi: \"Can you spell your name, please?\" Làm sao bạn đánh vần tên của mình?",

  learningOutcomes: [
    "Nhận biết và đọc được 26 chữ cái tiếng Anh",
    "Đánh vần tên của mình bằng tiếng Anh",
    "Nói câu giới thiệu đầu tiên: My name is...",
  ],

  culturalNote:
    'Người bản ngữ thường hỏi <span class="text-emerald-400 font-semibold">"How do you spell that?"</span> khi nghe tên lạ. Biết đánh vần tên mình là kỹ năng thiết yếu! Tên Việt Nam như Nguyễn, Phạm, Trần thường được người nước ngoài yêu cầu đánh vần để ghi chú đúng.',

  warmupGreetings: [
    {
      emoji: "🔤",
      en: "My name is Minh. M-I-N-H.",
      vn: "Tên tôi là Minh. M-I-N-H.",
      context: "Giới thiệu và đánh vần tên",
    },
    {
      emoji: "❓",
      en: "How do you spell your name?",
      vn: "Bạn đánh vần tên như thế nào?",
      context: "Hỏi cách đánh vần tên",
    },
    {
      emoji: "✍️",
      en: "Can you spell that for me, please?",
      vn: "Bạn có thể đánh vần cái đó cho tôi không?",
      context: "Nhờ ai đó đánh vần",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "apple",
      emoji: "🍎",
      phonetic: "/ˈæpəl/",
      meaning: "Quả táo [A /æ/]",
      example: "An apple a day keeps the doctor away.",
      example2: "I eat an apple every morning.",
      collocation: "apple juice / apple pie / Big Apple (New York)",
      audio: "/audio/unit-a0-1/apple.mp3",
    },
    {
      id: 2,
      word: "ball",
      emoji: "⚽",
      phonetic: "/bɔːl/",
      meaning: "Quả bóng [B /b/]",
      example: "Kick the ball!",
      example2: "He has a red ball.",
      collocation: "play ball / ball game / basketball",
      audio: "/audio/unit-a0-1/ball.mp3",
    },
    {
      id: 3,
      word: "cat",
      emoji: "🐱",
      phonetic: "/kæt/",
      meaning: "Con mèo [C /k/]",
      example: "The cat is on the table.",
      example2: "My cat is black and white.",
      collocation: "black cat / cat and mouse / copy cat",
      audio: "/audio/unit-a0-1/cat.mp3",
    },
    {
      id: 4,
      word: "dog",
      emoji: "🐶",
      phonetic: "/dɒɡ/",
      meaning: "Con chó [D /d/]",
      example: "My dog is very friendly.",
      example2: "Dogs are loyal animals.",
      collocation: "hot dog / dog park / guide dog",
      audio: "/audio/unit-a0-1/dog.mp3",
    },
    {
      id: 5,
      word: "egg",
      emoji: "🥚",
      phonetic: "/eɡ/",
      meaning: "Quả trứng [E /ɛ/]",
      example: "I have an egg for breakfast.",
      example2: "She eats two eggs every day.",
      collocation: "fried egg / boiled egg / egg white",
      audio: "/audio/unit-a0-1/egg.mp3",
    },
    {
      id: 6,
      word: "fish",
      emoji: "🐟",
      phonetic: "/fɪʃ/",
      meaning: "Con cá [F /f/]",
      example: "We eat fish every Friday.",
      example2: "The fish is fresh from the market.",
      collocation: "fish and chips / fish market / goldfish",
      audio: "/audio/unit-a0-1/fish.mp3",
    },
    {
      id: 7,
      word: "good",
      emoji: "👍",
      phonetic: "/ɡʊd/",
      meaning: "Tốt / Giỏi [G /ɡ/]",
      example: "Good morning! Have a good day!",
      example2: "This food is very good.",
      collocation: "good morning / good idea / feel good",
      audio: "/audio/unit-a0-1/good.mp3",
    },
    {
      id: 8,
      word: "hat",
      emoji: "🎩",
      phonetic: "/hæt/",
      meaning: "Cái mũ [H /h/]",
      example: "She wears a red hat.",
      example2: "Put on your hat — it's cold!",
      collocation: "wear a hat / baseball hat / hat trick",
      audio: "/audio/unit-a0-1/hat.mp3",
    },
    {
      id: 9,
      word: "ice",
      emoji: "🧊",
      phonetic: "/aɪs/",
      meaning: "Đá (lạnh) [I /aɪ/]",
      example: "I want some ice in my drink.",
      example2: "The roads are icy today.",
      collocation: "ice cream / ice water / break the ice",
      audio: "/audio/unit-a0-1/ice.mp3",
    },
    {
      id: 10,
      word: "jump",
      emoji: "🦘",
      phonetic: "/dʒʌmp/",
      meaning: "Nhảy [J /dʒ/]",
      example: "Jump as high as you can!",
      example2: "The children jump and play.",
      collocation: "jump rope / high jump / long jump",
      audio: "/audio/unit-a0-1/jump.mp3",
    },
  ],

  grammar: {
    title: "Verb BE — \"My name is...\" (Câu giới thiệu đầu tiên)",
    rule: "My name IS [tên]. — I AM [tên].",
    conjugation: [
      { subject: "My name",  form: "is",  example: "My name is Minh." },
      { subject: "I",        form: "am",  example: "I am from Vietnam." },
      { subject: "Nice to",  form: "meet you",  example: "Nice to meet you!" },
    ],
    examples: [
      { en: "My name is Linh.", vn: "Tên tôi là Linh." },
      { en: "I am from Vietnam.", vn: "Tôi đến từ Việt Nam." },
      { en: "How do you spell your name?", vn: "Bạn đánh vần tên như thế nào?" },
      { en: "Nice to meet you!", vn: "Rất vui được gặp bạn!" },
    ],
    tip: "Dạng rút gọn: My name IS → Thường không rút gọn. I AM → I'M. Trong lần đầu gặp gỡ, cả hai đều được dùng. 'I'm Minh' nghe tự nhiên và thân thiện hơn.",

    vnNote:
      "⚠️ LỖI PHỔ BIẾN NHẤT của người Việt: Bỏ qua động từ IS!\n\nTiếng Việt: 'Tên tôi Minh' — không cần động từ.\nTiếng Anh BẮT BUỘC có IS: 'My name IS Minh.'\n\n❌ SAI: 'My name Minh.' / 'I Minh.'\n✅ ĐÚNG: 'My name IS Minh.' / 'I AM Minh.'\n\nHãy luyện tập cho đến khi IS và AM trở thành phản xạ tự nhiên!",

    dialogueExample: {
      speaker: "Minh",
      text: "My name is Minh. M-I-N-H. Nice to meet you!",
      translation: "Tên tôi là Minh. M-I-N-H. Rất vui được gặp bạn!",
      highlight: "is",
    },

    ccq: {
      question: "Câu nào ĐÚNG ngữ pháp?",
      options: [
        "My name Minh.",
        "Name is Minh.",
        "My name is Minh. ✓",
        "I name is Minh.",
      ],
      answer: "My name is Minh. ✓",
    },
  },

  matchingExercise: {
    title: "Nối chữ cái với từ bắt đầu bằng chữ đó",
    pairs: [
      { left: "A", right: "apple" },
      { left: "B", right: "ball" },
      { left: "C", right: "cat" },
      { left: "D", right: "dog" },
      { left: "E", right: "egg" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq1-1",
      question: "Chữ cái nào bắt đầu từ 'apple'?",
      options: ["E", "A", "O", "I"],
      answer: "A",
      type: "multiple-choice",
    },
    {
      id: "pq1-2",
      question: "Điền từ còn thiếu: 'My name ___ Linh.'",
      options: [],
      answer: "is",
      type: "cloze",
    },
    {
      id: "pq1-3",
      question: "Câu nào đúng?",
      options: [
        "My name Minh.",
        "My name is Minh.",
        "Name is my Minh.",
        "I name Minh.",
      ],
      answer: "My name is Minh.",
      type: "multiple-choice",
    },
  ],

  practiceTranslate: [
    {
      id: "pt1-1",
      prompt_vn: "Tên tôi là Minh.",
      answer: "My name is Minh.",
    },
    {
      id: "pt1-2",
      prompt_vn: "Tôi đến từ Việt Nam.",
      answer: "I am from Vietnam.",
    },
    {
      id: "pt1-3",
      prompt_vn: "Rất vui được gặp bạn.",
      answer: "Nice to meet you.",
    },
  ],

  scrambleExercises: [
    {
      id: "s1-1",
      prompt_vn: "Tên tôi là Alex.",
      words: ["My", "name", "is", "Alex", "."],
      answer: "My name is Alex .",
    },
    {
      id: "s1-2",
      prompt_vn: "Tôi đến từ Việt Nam.",
      words: ["I", "am", "from", "Vietnam", "."],
      answer: "I am from Vietnam .",
    },
    {
      id: "s1-3",
      prompt_vn: "Rất vui được gặp bạn.",
      words: ["Nice", "to", "meet", "you", "."],
      answer: "Nice to meet you .",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Đánh vần tên khi đăng ký",
      audio: "/audio/unit-a0-1/dialogue_1.mp3",
      desc: "Minh đăng ký tham dự khóa học tiếng Anh và cần đánh vần tên.",
      lines: [
        {
          id: "d1-1-1",
          speaker: "Staff",
          text: "Good morning! What's your name?",
          translation: "Chào buổi sáng! Tên bạn là gì?",
        },
        {
          id: "d1-1-2",
          speaker: "Minh",
          text: "My name is Minh.",
          translation: "Tên tôi là Minh.",
        },
        {
          id: "d1-1-3",
          speaker: "Staff",
          text: "Can you spell that, please?",
          translation: "Bạn có thể đánh vần không?",
        },
        {
          id: "d1-1-4",
          speaker: "Minh",
          text: "Yes! M-I-N-H. Minh.",
          translation: "Vâng! M-I-N-H. Minh.",
        },
        {
          id: "d1-1-5",
          speaker: "Staff",
          text: "Thank you, Minh! Nice to meet you.",
          translation: "Cảm ơn, Minh! Rất vui được gặp bạn.",
        },
        {
          id: "d1-1-6",
          speaker: "Minh",
          text: "Nice to meet you too!",
          translation: "Tôi cũng rất vui được gặp bạn!",
        },
      ],
    },
    {
      id: 2,
      title: "Gặp lần đầu",
      audio: "/audio/unit-a0-1/dialogue_2.mp3",
      desc: "Hai người gặp nhau lần đầu tại một sự kiện.",
      lines: [
        {
          id: "d1-2-1",
          speaker: "Sara",
          text: "Hi! I'm Sara. What's your name?",
          translation: "Xin chào! Tôi là Sara. Tên bạn là gì?",
        },
        {
          id: "d1-2-2",
          speaker: "Linh",
          text: "Hi Sara! My name is Linh. Nice to meet you.",
          translation: "Xin chào Sara! Tên tôi là Linh. Rất vui được gặp bạn.",
        },
        {
          id: "d1-2-3",
          speaker: "Sara",
          text: "How do you spell Linh?",
          translation: "Linh đánh vần như thế nào?",
        },
        {
          id: "d1-2-4",
          speaker: "Linh",
          text: "L-I-N-H.",
          translation: "L-I-N-H.",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac1-1",
      audio_text: "My name is Minh",
      options: ["My name Minh", "My name is Minh", "I name is Minh", "Name is Minh"],
      answer: "My name is Minh",
    },
    {
      id: "lac1-2",
      audio_text: "apple",
      options: ["apple", "awful", "able", "uncle"],
      answer: "apple",
    },
    {
      id: "lac1-3",
      audio_text: "Nice to meet you",
      options: ["Nice to meet you", "Nice to see you", "Nice to know you", "Good to meet you"],
      answer: "Nice to meet you",
    },
  ],

  fluencyDrill: {
    title: "Đọc chữ cái & phát âm",
    items: [
      { en: "A — apple /æ/",      vn: "Chữ A — quả táo" },
      { en: "B — ball /b/",       vn: "Chữ B — quả bóng" },
      { en: "C — cat /k/",        vn: "Chữ C — con mèo" },
      { en: "D — dog /d/",        vn: "Chữ D — con chó" },
      { en: "My name is...",      vn: "Tên tôi là..." },
      { en: "I am from...",       vn: "Tôi đến từ..." },
      { en: "Nice to meet you!",  vn: "Rất vui được gặp bạn!" },
      { en: "How do you spell it?", vn: "Bạn đánh vần nó như thế nào?" },
    ],
  },

  speaking: {
    level1Prompt: "My name is {input}.",
    level1Placeholder: "Nhập tên của bạn...",
    level2Situation:
      "Bạn đang điền form đăng ký tại một công ty nước ngoài. Nhân viên yêu cầu tên, và bạn cần đánh vần tên của mình chính xác.",
    level2Hint: "My name is [tên]. That's [chữ cái 1]-[chữ cái 2]-[chữ cái 3]...",
  },

  quiz: [
    {
      id: "q1-1",
      question: "Chữ cái nào bắt đầu từ 'fish'?",
      options: ["E", "F", "V", "P"],
      answer: "F",
      type: "multiple-choice",
    },
    {
      id: "q1-2",
      question: "Câu nào ĐÚNG ngữ pháp?",
      options: [
        "My name Linh.",
        "My name is Linh.",
        "I name is Linh.",
        "Name Linh is.",
      ],
      answer: "My name is Linh.",
      type: "multiple-choice",
    },
    {
      id: "q1-3",
      question: "Điền từ còn thiếu: 'My name ___ Minh.'",
      options: [],
      answer: "is",
      type: "cloze",
    },
    {
      id: "q1-4",
      question: "Điền từ còn thiếu: 'I ___ from Vietnam.'",
      options: [],
      answer: "am",
      type: "cloze",
    },
    {
      id: "q1-5",
      question: "Từ nào bắt đầu bằng chữ 'D'?",
      options: ["cat", "egg", "dog", "hat"],
      answer: "dog",
      type: "multiple-choice",
    },
    {
      id: "q1-6",
      question: "Tên tôi là Linh. (Dịch sang tiếng Anh)",
      options: [],
      answer: "My name is Linh.",
      type: "translate",
    },
    {
      id: "q1-7",
      question: "Rất vui được gặp bạn. (Dịch sang tiếng Anh)",
      options: [],
      answer: "Nice to meet you.",
      type: "translate",
    },
  ],
};

export default unitA01;
