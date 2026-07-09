import type { LessonSpec } from "@/lib/v2/lesson-spec";

/** Pilot P0 — alphabet & core sounds (true beginner) */
export const lessonA001: LessonSpec = {
  id: "l-a0-01",
  phase: "P0",
  cefr: "A0",
  title_vi: "Chữ cái & âm cơ bản",
  estimatedMin: 30,
  canDo: [
    "Đọc to 10 chữ cái thông dụng trong tiếng Anh",
    "Nói được spelling tên mình bằng chữ cái Anh",
    "Phân biệt A E I O U cơ bản",
  ],
  situation:
    "Bạn đang điền form online bằng tiếng Anh. Ô Name yêu cầu ghi tên bằng chữ Latin. Nhân viên hỗ trợ hỏi: How do you spell your name? — bạn cần đánh vần tên mình.",
  culturalNote_vi:
    "Tiếng Anh đánh vần từng chữ (A-B-C), không theo vần như tiếng Việt. Số điện thoại cũng đọc từng chữ số: oh cho 0 đôi khi dùng thay zero.",
  jobAngle: "Điền form HR / email lần đầu",
  lexis: [
    {
      id: "v1",
      word: "alphabet",
      phonetic: "/ˈælfəbet/",
      meaning_vi: "bảng chữ cái",
      example_en: "The English alphabet has 26 letters.",
      l1_note_vi: "Không phải 'anphabet'. Âm /æ/ mở miệng ngang.",
    },
    {
      id: "v2",
      word: "letter",
      phonetic: "/ˈletər/",
      meaning_vi: "chữ cái (hoặc thư)",
      example_en: "B is a letter.",
      l1_note_vi: "letter = chữ cái HOẶC lá thư — trong bài này = chữ cái.",
    },
    {
      id: "v3",
      word: "spell",
      phonetic: "/spel/",
      meaning_vi: "đánh vần",
      example_en: "How do you spell your name?",
      l1_note_vi: "How do you spell…? — câu hỏi hay gặp khi điền form.",
    },
    {
      id: "v4",
      word: "name",
      phonetic: "/neɪm/",
      meaning_vi: "tên",
      example_en: "My name is Lan.",
    },
    {
      id: "v5",
      word: "A B C",
      phonetic: "/eɪ biː siː/",
      meaning_vi: "ba chữ cái đầu",
      example_en: "A, B, C — easy!",
      l1_note_vi: "A đọc /eɪ/ không phải /a/ như tiếng Việt.",
    },
    {
      id: "v6",
      word: "vowel",
      phonetic: "/ˈvaʊəl/",
      meaning_vi: "nguyên âm (A E I O U)",
      example_en: "A, E, I, O, U are vowels.",
    },
    {
      id: "v7",
      word: "repeat",
      phonetic: "/rɪˈpiːt/",
      meaning_vi: "lặp lại",
      example_en: "Please repeat: A, B, C.",
      l1_note_vi: "Please repeat — nhờ người kia nói lại, rất hữu ích.",
    },
    {
      id: "v8",
      word: "please",
      phonetic: "/pliːz/",
      meaning_vi: "làm ơn / xin",
      example_en: "Please spell your name.",
    },
  ],
  grammar: {
    title: "How do you spell…?",
    rule: "How do you spell + noun?",
    examples: [
      { en: "How do you spell your name?", vi: "Bạn đánh vần tên thế nào?" },
      { en: "How do you spell 'email'?", vi: "Đánh vần 'email' thế nào?" },
      { en: "It is L-A-N.", vi: "Nó là L-A-N." },
    ],
    vnNote:
      "Không nói How spell you name. Cấu trúc cố định: How do you spell…?",
    ccq: {
      question: "Câu nào đúng?",
      options: [
        "How spell your name?",
        "How do you spell your name?",
        "How you spell name?",
        "Spell how name?",
      ],
      answer: "How do you spell your name?",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Chọn nguyên âm",
      options: ["B", "C", "A", "D"],
      answer: "A",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Hỏi đánh vần tên",
      options: [
        "How do you spell your name?",
        "What your name spell?",
        "Spell me name?",
        "Name how?",
      ],
      answer: "How do you spell your name?",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: spell / you / do / How / it",
      words: ["How", "do", "you", "spell", "it"],
      answer: "How do you spell it",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Please ___ : A B C",
      options: ["repeat", "from", "meet", "fine"],
      answer: "repeat",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Điền form",
        context_vi: "Nhân viên hỏi đánh vần tên.",
        lines: [
          {
            id: "1",
            speaker: "Staff",
            text: "Hello. What is your name?",
            translation_vi: "Xin chào. Tên bạn là gì?",
          },
          {
            id: "2",
            speaker: "Lan",
            text: "My name is Lan.",
            translation_vi: "Tên tôi là Lan.",
          },
          {
            id: "3",
            speaker: "Staff",
            text: "How do you spell your name?",
            translation_vi: "Bạn đánh vần tên thế nào?",
          },
          {
            id: "4",
            speaker: "Lan",
            text: "L-A-N. L, A, N.",
            translation_vi: "L-A-N. L, A, N.",
          },
          {
            id: "5",
            speaker: "Staff",
            text: "Please repeat.",
            translation_vi: "Làm ơn nói lại.",
          },
          {
            id: "6",
            speaker: "Lan",
            text: "L-A-N.",
            translation_vi: "L-A-N.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "How do you spell your name?",
        options: [
          "How do you spell your name?",
          "What is your name?",
          "Where are you from?",
          "How are you?",
        ],
        answer: "How do you spell your name?",
      },
      {
        id: "lac2",
        audio_text: "Please repeat",
        options: ["Please sit", "Please repeat", "Please eat", "Please meet"],
        answer: "Please repeat",
      },
      {
        id: "lac3",
        audio_text: "My name is Lan",
        options: ["My name is Lan", "My game is Lan", "My name is Man", "By name is Lan"],
        answer: "My name is Lan",
      },
    ],
  },
  fluency: {
    items: [
      { en: "A, B, C", vi: "A, B, C" },
      { en: "My name is Lan.", vi: "Tên tôi là Lan." },
      { en: "How do you spell it?", vi: "Đánh vần thế nào?" },
      { en: "Please repeat.", vi: "Làm ơn nói lại." },
      { en: "L-A-N", vi: "L-A-N" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói to: (1) My name is + tên bạn (2) Đánh vần tên bằng chữ cái Anh (3) Please repeat nếu cần.",
    successCriteria_vi: [
      "Nói được My name is…",
      "Đánh vần ít nhất 2 chữ cái bằng tiếng Anh",
      "Dùng Please repeat hoặc How do you spell…?",
    ],
    scaffold_en: ["My name is…", "How do you spell…?", "A, B, C…", "Please repeat."],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "How do you ___ your name?",
        options: ["spell", "from", "fine", "meet"],
        answer: "spell",
      },
      {
        id: "q2",
        type: "mcq",
        question: "A, E, I, O, U are…",
        options: ["vowels", "names", "countries", "numbers"],
        answer: "vowels",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Please repeat = làm ơn nói lại",
        options: ["True", "False"],
        answer: "True",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Chữ cái đầu alphabet",
        options: ["A", "Z", "M", "Q"],
        answer: "A",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "My ___ is Lan.",
        options: ["name", "spell", "letter", "vowel"],
        answer: "name",
      },
      {
        id: "s2",
        type: "mcq",
        question: "Please ___ .",
        options: ["repeat", "alphabet", "vowel", "from"],
        answer: "repeat",
      },
    ],
  },
};
