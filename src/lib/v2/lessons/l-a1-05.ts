import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — hobbies: like / love / hate + -ing.
 * Core: free time · hobby · reading · listening to music · watching movies ·
 * cooking · swimming · playing football · like / love / hate + V-ing ·
 * What do you like doing?
 * Spiral: a1-04 routine (every day / usually light) + a1-01 greetings.
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA105: LessonSpec = {
  id: "l-a1-05",
  phase: "P1",
  cefr: "A1",
  title_vi: "Sở thích",
  estimatedMin: 35,
  canDo: [
    "Nói sở thích với like/love/hate + V-ing: I like reading…",
    "Hỏi–đáp What do you like doing? / Do you like…?",
    "Kể 2–3 hobbies trong free time (networking / coffee chat)",
  ],
  situation:
    "Networking / coffee chat với đồng nghiệp nước ngoài: họ hỏi What do you like doing in your free time? Bạn cần trả lời ngắn — I like…, I love…, I hate… + V-ing — và hỏi lại họ.",
  culturalNote_vi:
    "Small talk về hobbies rất phổ biến sau chào hỏi. What do you like doing? và What are your hobbies? đều lịch sự. like/love/hate + V-ing (không to-V). I like read — lỗi L1 phổ biến. go swimming (không play swimming).",
  jobAngle: "Networking — share hobbies in free time small talk",
  lexis: [
    {
      id: "v1",
      word: "free time",
      phonetic: "/friː taɪm/",
      meaning_vi: "thời gian rảnh",
      example_en: "What do you like doing in your free time?",
      l1_note_vi:
        "free time = thời gian rảnh (hai từ). in your free time — không in free time (thiếu your).",
    },
    {
      id: "v2",
      word: "hobby",
      phonetic: "/ˈhɒbi/",
      meaning_vi: "sở thích / thú vui",
      example_en: "My hobby is reading.",
      l1_note_vi:
        "hobby (số ít) / hobbies (số nhiều). What are your hobbies? — rất hay dùng.",
    },
    {
      id: "v3",
      word: "like + -ing",
      phonetic: "/laɪk/",
      meaning_vi: "thích (làm gì)",
      example_en: "I like reading books.",
      l1_note_vi:
        "like + V-ing. SAI: I like read / I like to reading. ĐÚNG: I like reading.",
    },
    {
      id: "v4",
      word: "love + -ing",
      phonetic: "/lʌv/",
      meaning_vi: "rất thích / yêu thích (làm gì)",
      example_en: "I love cooking.",
      l1_note_vi:
        "love + V-ing (cùng khung like). Mạnh hơn like. Không: I love cook.",
    },
    {
      id: "v5",
      word: "hate + -ing",
      phonetic: "/heɪt/",
      meaning_vi: "ghét (làm gì)",
      example_en: "I hate getting up early.",
      l1_note_vi:
        "hate + V-ing. Có thể lịch sự hơn: I don't like… (A1+). Không: I hate get up.",
    },
    {
      id: "v6",
      word: "reading",
      phonetic: "/ˈriːdɪŋ/",
      meaning_vi: "đọc (sách)",
      example_en: "I like reading every night.",
      l1_note_vi:
        "reading = V-ing của read. I like reading books — không I like read books.",
    },
    {
      id: "v7",
      word: "listening to music",
      phonetic: "/ˈlɪsənɪŋ tə ˈmjuːzɪk/",
      meaning_vi: "nghe nhạc",
      example_en: "I love listening to music.",
      l1_note_vi:
        "listen TO music — cần to. SAI: listen music / listening music.",
    },
    {
      id: "v8",
      word: "watching movies",
      phonetic: "/ˈwɒtʃɪŋ ˈmuːviz/",
      meaning_vi: "xem phim",
      example_en: "I like watching movies on Friday.",
      l1_note_vi:
        "watch movies (ở nhà). after like: watching (V-ing), không watch movies bare sau like.",
    },
    {
      id: "v9",
      word: "cooking",
      phonetic: "/ˈkʊkɪŋ/",
      meaning_vi: "nấu ăn",
      example_en: "I love cooking Vietnamese food.",
      l1_note_vi:
        "like/love + cooking. SAI: I like cook. enjoy cooking cũng đúng (A1+).",
    },
    {
      id: "v10",
      word: "swimming",
      phonetic: "/ˈswɪmɪŋ/",
      meaning_vi: "bơi lội",
      example_en: "I like swimming in the summer.",
      l1_note_vi:
        "go swimming (không play swimming). I like swimming — V-ing sau like.",
    },
    {
      id: "v11",
      word: "playing football",
      phonetic: "/ˈpleɪɪŋ ˈfʊtbɔːl/",
      meaning_vi: "chơi bóng đá",
      example_en: "I like playing football with friends.",
      l1_note_vi:
        "play football — không the (môn thể thao). SAI: play the football / I like play football.",
    },
    {
      id: "v12",
      word: "What do you like doing?",
      phonetic: "/wɒt də ju laɪk ˈduːɪŋ/",
      meaning_vi: "Bạn thích làm gì?",
      example_en: "What do you like doing in your free time?",
      l1_note_vi:
        "like doing (V-ing). SAI: What do you like do? / What you like doing?",
    },
  ],
  grammar: {
    title: "like / love / hate + V-ing (hobbies)",
    rule: "I/You + like/love/hate + V-ing. What do you like doing?",
    examples: [
      { en: "I like reading books.", vi: "Tôi thích đọc sách." },
      { en: "I love cooking.", vi: "Tôi rất thích nấu ăn." },
      { en: "I hate getting up early.", vi: "Tôi ghét dậy sớm." },
      { en: "What do you like doing in your free time?", vi: "Bạn thích làm gì lúc rảnh?" },
      { en: "Do you like swimming?", vi: "Bạn có thích bơi không?" },
    ],
    vnNote:
      "Sau like/love/hate dùng V-ing, KHÔNG nguyên mẫu: I like swim ✗ → I like swimming ✓. He/She likes (có -s) — bài này tập trung I/you cho speak task. Lỗi L1: listen music; play swimming; I like read.",
    ccq: {
      question: "Câu nào đúng?",
      options: [
        "I like reading books.",
        "I like read books.",
        "I like to reading books.",
        "I liking read books.",
      ],
      answer: "I like reading books.",
      explanation_vi: "like + V-ing (reading).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Thích đọc sách — câu đúng",
      options: [
        "I like reading books.",
        "I like read books.",
        "I like to reading books.",
        "I liking reading books.",
      ],
      answer: "I like reading books.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: I love _____ to music. (listen / listening / listens)",
      stem: "I love _____ to music.",
      answer: "listening",
      explanation_vi: "love + V-ing; listen TO music.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: like / I / cooking / Vietnamese / food",
      words: ["I", "like", "cooking", "Vietnamese", "food"],
      answer: "I like cooking Vietnamese food",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Hỏi sở thích — câu đúng",
      options: [
        "What do you like doing?",
        "What do you like do?",
        "What you like doing?",
        "What are you like doing?",
      ],
      answer: "What do you like doing?",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I like play football.",
      stem: "I like play football.",
      answer: "I like playing football.",
      explanation_vi: "like + V-ing → playing.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Do you like swimming? → đáp có",
      options: [
        "Yes, I love swimming.",
        "I'm from Vietnam.",
        "I get up at six.",
        "This is my friend.",
      ],
      answer: "Yes, I love swimming.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Coffee chat — free time & hobbies",
        context_vi: "Alex và Linh nói chuyện lúc nghỉ giữa buổi về sở thích.",
        lines: [
          {
            id: "d1-1",
            speaker: "Alex",
            text: "Hi Linh! What do you like doing in your free time?",
            translation_vi: "Chào Linh! Bạn thích làm gì lúc rảnh?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "I like reading and listening to music. And you?",
            translation_vi: "Mình thích đọc sách và nghe nhạc. Còn bạn?",
          },
          {
            id: "d1-3",
            speaker: "Alex",
            text: "I love playing football with friends.",
            translation_vi: "Mình rất thích chơi bóng đá với bạn bè.",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "Do you like swimming too?",
            translation_vi: "Bạn có thích bơi không?",
          },
          {
            id: "d1-5",
            speaker: "Alex",
            text: "Yes! I go swimming every Saturday. I hate getting up early, though.",
            translation_vi: "Có! Mình đi bơi mỗi thứ Bảy. Nhưng ghét dậy sớm.",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "Ha! I like watching movies on Friday nights.",
            translation_vi: "Ha! Mình thích xem phim tối thứ Sáu.",
          },
          {
            id: "d1-7",
            speaker: "Alex",
            text: "Nice hobbies! See you later.",
            translation_vi: "Sở thích hay đấy! Hẹn gặp lại.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I like reading books",
        options: [
          "I like reading books",
          "I like read books",
          "I like cooking books",
          "I love reading books",
        ],
        answer: "I like reading books",
      },
      {
        id: "lac2",
        audio_text: "I love listening to music",
        options: [
          "I love listening to music",
          "I love listen to music",
          "I like listening music",
          "I hate listening to music",
        ],
        answer: "I love listening to music",
      },
      {
        id: "lac3",
        audio_text: "What do you like doing?",
        options: [
          "What do you like doing?",
          "What do you like do?",
          "What are your name?",
          "What time do you get up?",
        ],
        answer: "What do you like doing?",
      },
      {
        id: "lac4",
        audio_text: "I like playing football",
        options: [
          "I like playing football",
          "I like play football",
          "I like playing the football",
          "I hate playing football",
        ],
        answer: "I like playing football",
      },
    ],
  },
  fluency: {
    items: [
      { en: "I like reading books.", vi: "Tôi thích đọc sách." },
      { en: "I love listening to music.", vi: "Tôi rất thích nghe nhạc." },
      { en: "I like watching movies.", vi: "Tôi thích xem phim." },
      { en: "I love cooking.", vi: "Tôi rất thích nấu ăn." },
      { en: "I like swimming.", vi: "Tôi thích bơi." },
      { en: "I like playing football.", vi: "Tôi thích chơi bóng đá." },
      { en: "I hate getting up early.", vi: "Tôi ghét dậy sớm." },
      { en: "What do you like doing in your free time?", vi: "Bạn thích làm gì lúc rảnh?" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Alex hỏi free time. Nói 5–7 câu: What do you like doing? → I like… / I love… (+ V-ing hobbies) → optional I hate… → hỏi lại Do you like…? hoặc And you?",
    successCriteria_vi: [
      "Có like hoặc love + V-ing (reading / cooking / swimming…)",
      "Có ít nhất 2 hobbies khác nhau",
      "Có free time hoặc What do you like doing?",
      "Không dùng I like + nguyên mẫu (I like read ✗)",
    ],
    scaffold_en: [
      "What do you like doing in your free time?",
      "I like reading books.",
      "I love listening to music.",
      "I like watching movies on Friday.",
      "I love cooking.",
      "I like swimming.",
      "I hate getting up early.",
      "Do you like playing football?",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "I _____ reading books.",
        options: ["like", "likes", "liking", "liked"],
        answer: "like",
        explanation_vi: "I + like (present simple) + V-ing.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Câu đúng:",
        options: [
          "I love cooking.",
          "I love cook.",
          "I love to cooking.",
          "I loving cook.",
        ],
        answer: "I love cooking.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I like read books là câu đúng trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Cần V-ing: I like reading books.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Hỏi sở thích:",
        options: [
          "What do you like doing?",
          "What do you like do?",
          "How old do you like?",
          "Where are you hobbies?",
        ],
        answer: "What do you like doing?",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I love listening _____ music. (to / at / in)",
        answer: "to",
      },
      {
        id: "q6",
        type: "mcq",
        question: "hate + -ing nghĩa là…",
        options: ["ghét (làm gì)", "thích vừa phải", "hỏi giờ", "chào hỏi"],
        answer: "ghét (làm gì)",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-04) I _____ up at six o'clock.",
        options: ["get", "getting", "gets", "got"],
        answer: "get",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-04) Câu đi làm đúng:",
        options: [
          "I go to work every day.",
          "I go work every day.",
          "I goes to work every day.",
          "I going to work every day.",
        ],
        answer: "I go to work every day.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-01) Chào hỏi cơ bản:",
        options: [
          "Hi! How are you?",
          "I like reading books.",
          "I get up at six.",
          "I go home at six.",
        ],
        answer: "Hi! How are you?",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/ŋ/ in -ing · /l/ in like/love",
    description_vi:
      "V-ing: âm cuối /ŋ/ (ng) — reading, cooking, swimming — không nuốt thành «in». like /laɪk/: /l/ đầu lưỡi chạm nướu; love /lʌv/: nguyên âm ngắn /ʌ/.",
    examples: [
      {
        word: "reading",
        ipa: "/ˈriːdɪŋ/",
        tip_vi: "Nhấn rea-; cuối /ŋ/ rõ, không «read-in».",
      },
      {
        word: "like",
        ipa: "/laɪk/",
        tip_vi: "/l/ + /aɪ/ + /k/ — không «lai» dài không /k/.",
      },
      {
        word: "swimming",
        ipa: "/ˈswɪmɪŋ/",
        tip_vi: "Hai m nhẹ (AmE); cuối /ŋ/.",
      },
    ],
  },
};
