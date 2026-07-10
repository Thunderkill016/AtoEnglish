import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — abilities: can / can't / Can you…?
 * Core: can · can't · Can you…? · swim · drive · cook · speak ·
 * play the guitar · use a computer · help · well
 * Spiral: a1-09 places/directions + a1-08 cafe + earlier A1 can-dos.
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA110: LessonSpec = {
  id: "l-a1-10",
  phase: "P1",
  cefr: "A1",
  title_vi: "Khả năng (can)",
  estimatedMin: 35,
  canDo: [
    "Nói khả năng: I can / I can't + verb",
    "Hỏi kỹ năng: Can you…?",
    "Nói điểm mạnh/yếu ngắn trong phỏng vấn hoặc gặp mặt",
  ],
  situation:
    "Phỏng vấn xin việc / CLB tình nguyện: interviewer hỏi What can you do? — bạn nói I can speak English, I can use a computer; I can't drive a car yet. Cần can/can't đúng form, không cans / can to.",
  culturalNote_vi:
    "can = modal: không -s (She can, không She cans). Sau can dùng bare infinitive (can swim, không can to swim / can swims). can't = cannot. Câu hỏi: Can you…? (không Do you can…?). play the guitar (the + nhạc cụ).",
  jobAngle: "Interview: What can you do? skills for the role",
  lexis: [
    {
      id: "v1",
      word: "can",
      phonetic: "/kæn/",
      meaning_vi: "có thể / biết (làm)",
      example_en: "I can speak English.",
      l1_note_vi:
        "can + V nguyên mẫu. Không can to / cans. She can swim (không She cans).",
    },
    {
      id: "v2",
      word: "can't",
      phonetic: "/kɑːnt/",
      meaning_vi: "không thể / không biết",
      example_en: "I can't drive a car yet.",
      l1_note_vi:
        "can't = cannot. I can't + V. Không: I don't can / I not can.",
    },
    {
      id: "v3",
      word: "Can you…?",
      phonetic: "/kæn juː/",
      meaning_vi: "Bạn có thể… không?",
      example_en: "Can you cook?",
      l1_note_vi:
        "Can + subject + V? Không: Do you can…? / Are you can…?",
    },
    {
      id: "v4",
      word: "swim",
      phonetic: "/swɪm/",
      meaning_vi: "bơi",
      example_en: "I can swim well.",
      l1_note_vi:
        "can swim (không can to swim). swim well / swim fast.",
    },
    {
      id: "v5",
      word: "drive",
      phonetic: "/draɪv/",
      meaning_vi: "lái xe",
      example_en: "She can drive a car.",
      l1_note_vi:
        "drive a car / a motorbike. Cần a khi nói chung một loại xe.",
    },
    {
      id: "v6",
      word: "cook",
      phonetic: "/kʊk/",
      meaning_vi: "nấu ăn",
      example_en: "I can cook Vietnamese food.",
      l1_note_vi:
        "cook (V) = nấu. a cook (N) = đầu bếp. Can you cook?",
    },
    {
      id: "v7",
      word: "speak",
      phonetic: "/spiːk/",
      meaning_vi: "nói (ngôn ngữ)",
      example_en: "I can speak English and Vietnamese.",
      l1_note_vi:
        "speak English (không the English). Spiral intro a1-01/a1-02.",
    },
    {
      id: "v8",
      word: "play the guitar",
      phonetic: "/pleɪ ðə ɡɪˈtɑː/",
      meaning_vi: "chơi guitar",
      example_en: "He can play the guitar.",
      l1_note_vi:
        "play the + nhạc cụ. play football = không the (thể thao).",
    },
    {
      id: "v9",
      word: "use a computer",
      phonetic: "/juːz ə kəmˈpjuːtə/",
      meaning_vi: "dùng máy tính",
      example_en: "I can use a computer well.",
      l1_note_vi:
        "use a computer — kỹ năng văn phòng phổ biến khi phỏng vấn.",
    },
    {
      id: "v10",
      word: "help",
      phonetic: "/help/",
      meaning_vi: "giúp đỡ",
      example_en: "Can you help me?",
      l1_note_vi:
        "Can you help me? lịch sự nhờ giúp. help + me/someone.",
    },
    {
      id: "v11",
      word: "well",
      phonetic: "/wel/",
      meaning_vi: "giỏi / tốt (trạng từ)",
      example_en: "I can cook very well.",
      l1_note_vi:
        "well sau động từ (cook well). good = tính từ (good food).",
    },
    {
      id: "v12",
      word: "yet",
      phonetic: "/jet/",
      meaning_vi: "chưa (trong phủ định)",
      example_en: "I can't drive a car yet.",
      l1_note_vi:
        "yet cuối câu phủ định = chưa… I can't … yet = chưa biết/làm được.",
    },
  ],
  grammar: {
    title: "can / can't / Can you…?",
    rule: "S + can + V | S + can't + V | Can + S + V? (no -s, no to)",
    examples: [
      { en: "I can speak English.", vi: "Tôi có thể nói tiếng Anh." },
      { en: "She can't drive a car yet.", vi: "Cô ấy chưa lái được ô tô." },
      { en: "Can you cook?", vi: "Bạn có thể nấu ăn không?" },
      { en: "He can play the guitar.", vi: "Anh ấy có thể chơi guitar." },
      { en: "I can use a computer well.", vi: "Tôi dùng máy tính khá giỏi." },
    ],
    vnNote:
      "can không chia -s. Sau can: bare infinitive. Hỏi: Can you…? (không Do you can). Phủ định: can't. Spiral: speak English (a1-01/02), hobbies (a1-05).",
    ccq: {
      question: "Câu nào đúng với chủ ngữ She?",
      options: [
        "She can swim.",
        "She cans swim.",
        "She can swims.",
        "She is can swim.",
      ],
      answer: "She can swim.",
      explanation_vi: "can không -s; sau can dùng V nguyên mẫu (swim).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Câu đúng với She",
      options: [
        "She can swim.",
        "She cans swim.",
        "She can swims.",
        "She is can swim.",
      ],
      answer: "She can swim.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: I _____ speak English. (can / cans / can to)",
      stem: "I _____ speak English.",
      answer: "can",
      explanation_vi: "can + V nguyên mẫu.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: you / Can / cook",
      words: ["Can", "you", "cook"],
      answer: "Can you cook",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Phủ định — chọn đúng",
      options: [
        "I can't drive.",
        "I don't can drive.",
        "I not can drive.",
        "I can not to drive.",
      ],
      answer: "I can't drive.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: He cans play the guitar.",
      stem: "He cans play the guitar.",
      answer: "He can play the guitar.",
      explanation_vi: "can không thêm -s.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Hỏi khả năng — câu đúng",
      options: [
        "Can you help me?",
        "Do you can help me?",
        "Are you can help me?",
        "You can help me?",
      ],
      answer: "Can you help me?",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Phỏng vấn kỹ năng",
        context_vi:
          "Minh phỏng vấn CLB tình nguyện / job nhẹ; interviewer hỏi can/can't.",
        lines: [
          {
            id: "d1-1",
            speaker: "Interviewer",
            text: "Hello! What can you do for our team?",
            translation_vi: "Xin chào! Bạn có thể làm gì cho nhóm chúng tôi?",
          },
          {
            id: "d1-2",
            speaker: "Minh",
            text: "I can speak English and I can use a computer well.",
            translation_vi: "Tôi nói được tiếng Anh và dùng máy tính khá giỏi.",
          },
          {
            id: "d1-3",
            speaker: "Interviewer",
            text: "Can you drive a car or a motorbike?",
            translation_vi: "Bạn lái được ô tô hay xe máy không?",
          },
          {
            id: "d1-4",
            speaker: "Minh",
            text: "I can drive a motorbike but I can't drive a car yet.",
            translation_vi: "Tôi lái được xe máy nhưng chưa lái được ô tô.",
          },
          {
            id: "d1-5",
            speaker: "Interviewer",
            text: "Can you cook?",
            translation_vi: "Bạn nấu ăn được không?",
          },
          {
            id: "d1-6",
            speaker: "Minh",
            text: "Yes! I can cook Vietnamese food very well.",
            translation_vi: "Có! Tôi nấu đồ Việt rất ngon.",
          },
          {
            id: "d1-7",
            speaker: "Interviewer",
            text: "Great. Can you help with events near the station?",
            translation_vi: "Tuyệt. Bạn giúp sự kiện gần nhà ga được không?",
          },
          {
            id: "d1-8",
            speaker: "Minh",
            text: "Yes, I can help. Where is the station? I can go there.",
            translation_vi: "Vâng, tôi giúp được. Nhà ga ở đâu? Tôi có thể đến.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I can swim very well",
        options: [
          "I can swim very well",
          "I can't swim very well",
          "She can swim very well",
          "I can run very well",
        ],
        answer: "I can swim very well",
      },
      {
        id: "lac2",
        audio_text: "She can drive a car",
        options: [
          "She can drive a car",
          "She can't drive a car",
          "He can drive a car",
          "She can drive a bus",
        ],
        answer: "She can drive a car",
      },
      {
        id: "lac3",
        audio_text: "I can't speak Japanese",
        options: [
          "I can't speak Japanese",
          "I can speak Japanese",
          "I can't speak Chinese",
          "She can't speak Japanese",
        ],
        answer: "I can't speak Japanese",
      },
      {
        id: "lac4",
        audio_text: "Can you cook Vietnamese food",
        options: [
          "Can you cook Vietnamese food",
          "Can you eat Vietnamese food",
          "Can she cook Vietnamese food",
          "Do you can cook food",
        ],
        answer: "Can you cook Vietnamese food",
      },
    ],
  },
  fluency: {
    items: [
      { en: "I can speak English.", vi: "Tôi có thể nói tiếng Anh." },
      { en: "I can't drive a car yet.", vi: "Tôi chưa lái được ô tô." },
      { en: "Can you cook?", vi: "Bạn nấu ăn được không?" },
      { en: "I can use a computer well.", vi: "Tôi dùng máy tính khá giỏi." },
      { en: "He can play the guitar.", vi: "Anh ấy chơi được guitar." },
      { en: "Can you help me?", vi: "Bạn giúp tôi được không?" },
      { en: "She can swim well.", vi: "Cô ấy bơi giỏi." },
      { en: "I can cook Vietnamese food.", vi: "Tôi nấu được đồ Việt." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Bạn tự giới thiệu kỹ năng (phỏng vấn / lớp mới). Nói 5–7 câu: I can… (2–3 kỹ năng) · I can't… yet (1–2) · Can you…? (hỏi lại) · có thể nối speak English / use a computer / cook; spiral Where is… nếu cần địa điểm event.",
    successCriteria_vi: [
      "Có I can + verb (ít nhất 1)",
      "Có I can't + verb (ít nhất 1)",
      "Có Can you…? hoặc trả lời Yes/No với can",
      "Không dùng cans / can to / Do you can",
    ],
    scaffold_en: [
      "I can speak English.",
      "I can use a computer well.",
      "I can cook Vietnamese food.",
      "I can't drive a car yet.",
      "I can drive a motorbike.",
      "Can you help me?",
      "Can you swim?",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Câu hỏi đúng về khả năng:",
        options: [
          "Can you cook?",
          "Do you can cook?",
          "Are you can cook?",
          "You can cook?",
        ],
        answer: "Can you cook?",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Lỗi nào SAI?",
        options: [
          "He cans sing.",
          "I can swim.",
          "She can't drive.",
          "Can you speak English?",
        ],
        answer: "He cans sing.",
        explanation_vi: "can không thêm -s.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "She can swims là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: She can swim (bare infinitive).",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Phủ định đúng:",
        options: [
          "I can't drive.",
          "I don't can drive.",
          "I not can drive.",
          "I can not to drive.",
        ],
        answer: "I can't drive.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "He ___ play the guitar. (can / cans / can to)",
        answer: "can",
      },
      {
        id: "q6",
        type: "mcq",
        question: "play the guitar — vì sao có the?",
        options: [
          "nhạc cụ thường có the",
          "mọi danh từ đều the",
          "can bắt buộc the",
          "không cần the bao giờ",
        ],
        answer: "nhạc cụ thường có the",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-09) Hỏi ngân hàng ở đâu:",
        options: [
          "Where is the bank?",
          "Can you the bank?",
          "I can bank?",
          "How much is the bank?",
        ],
        answer: "Where is the bank?",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-08) Order cà phê lịch sự:",
        options: [
          "I'd like a coffee, please.",
          "I can a coffee, please.",
          "Where is a coffee can?",
          "I can't coffee yet bank.",
        ],
        answer: "I'd like a coffee, please.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-07) Hỏi giá:",
        options: [
          "How much is it?",
          "Can you how much?",
          "Where is the price can?",
          "I can much it?",
        ],
        answer: "How much is it?",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn a1-05) Sở thích — mẫu like + V-ing:",
        options: [
          "I like swimming.",
          "I can like swim.",
          "I cans swimming.",
          "Do you can swimming?",
        ],
        answer: "I like swimming.",
      },
      {
        id: "s5",
        type: "mcq",
        question: "(Ôn a1-01) Chào & tên:",
        options: [
          "Hello! My name is Linh.",
          "I can Hello Linh.",
          "Where is my name can?",
          "Can you Hello?",
        ],
        answer: "Hello! My name is Linh.",
      },
      {
        id: "s6",
        type: "mcq",
        question: "(Ôn a1-04) Thói quen — Present Simple:",
        options: [
          "I work every day.",
          "I can work every days cans.",
          "I cans work every day.",
          "Do you can work every day only?",
        ],
        answer: "I work every day.",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/kæn/ can · /kɑːnt/ can't",
    description_vi:
      "can nhấn nhẹ trong câu affirmative (/kən/ yếu); can't /kɑːnt/ (BrE) rõ /t/. Can you…? nhấn can khi hỏi.",
    examples: [
      {
        word: "can",
        ipa: "/kæn/",
        tip_vi: "Strong form khi đứng một mình / nhấn; weak /kən/ trong câu nhanh.",
      },
      {
        word: "can't",
        ipa: "/kɑːnt/",
        tip_vi: "Phủ định — nghe rõ /t/ cuối; khác can.",
      },
      {
        word: "Can you",
        ipa: "/kæn juː/",
        tip_vi: "Nối nhẹ Can you → /kænjə/ khi nói nhanh.",
      },
    ],
  },
};
