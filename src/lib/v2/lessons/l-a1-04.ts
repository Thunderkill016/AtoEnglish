import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — daily routine present simple (I/you).
 * Core: get up / go to work / have breakfast·lunch / go home / go to bed /
 * usually · every day · at + time · in the morning.
 * Spiral: a0-06 time of day (morning, o'clock, What time is it?).
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA104: LessonSpec = {
  id: "l-a1-04",
  phase: "P1",
  cefr: "A1",
  title_vi: "Thói quen hàng ngày",
  estimatedMin: 35,
  canDo: [
    "Nói thói quen sáng–tối với present simple: I get up… / I go to work…",
    "Nói giờ thói quen: at seven o'clock / in the morning",
    "Hỏi–đáp What time do you…? / Do you… every day?",
  ],
  situation:
    "Coffee chat với đồng nghiệp nước ngoài: họ hỏi ngày thường của bạn thế nào. Bạn cần kể ngắn — I get up at…, I have breakfast, I go to work, I go home, I go to bed — dùng present simple I/you và giờ tròn (ôn a0-06).",
  culturalNote_vi:
    "Small talk về routine rất phổ biến (commute, sleep time). get up = dậy khỏi giường; wake up = tỉnh giấc (có thể còn nằm). go to work = đi làm (không go work). Người bản ngữ hay rút gòn: get up at seven. Bài này giữ full câu rõ cho A1.",
  jobAngle: "Coffee chat — describe your workday routine",
  lexis: [
    {
      id: "v1",
      word: "get up",
      phonetic: "/ɡet ʌp/",
      meaning_vi: "thức dậy / ra khỏi giường",
      example_en: "I get up at six o'clock.",
      l1_note_vi:
        "get up = dậy khỏi giường. Không: I get up the bed. Thường + at + giờ.",
    },
    {
      id: "v2",
      word: "go to work",
      phonetic: "/ɡoʊ tə wɜːrk/",
      meaning_vi: "đi làm",
      example_en: "I go to work at eight.",
      l1_note_vi:
        "go to work — có to. Không: I go work / I go to the work (trừ khi chỉ tòa nhà cụ thể).",
    },
    {
      id: "v3",
      word: "have breakfast",
      phonetic: "/hæv ˈbrekfəst/",
      meaning_vi: "ăn sáng",
      example_en: "I have breakfast at seven.",
      l1_note_vi:
        "have breakfast (không eat breakfast bắt buộc; cả hai nghe được). Không mạo từ a trước breakfast.",
    },
    {
      id: "v4",
      word: "have lunch",
      phonetic: "/hæv lʌntʃ/",
      meaning_vi: "ăn trưa",
      example_en: "I have lunch at twelve.",
      l1_note_vi:
        "have lunch — cùng khung have + bữa. dinner = bữa tối (A1+).",
    },
    {
      id: "v5",
      word: "go home",
      phonetic: "/ɡoʊ hoʊm/",
      meaning_vi: "về nhà",
      example_en: "I go home at six.",
      l1_note_vi:
        "go home — KHÔNG to: không I go to home. home như trạng từ ở đây.",
    },
    {
      id: "v6",
      word: "go to bed",
      phonetic: "/ɡoʊ tə bed/",
      meaning_vi: "đi ngủ / lên giường",
      example_en: "I go to bed at ten.",
      l1_note_vi:
        "go to bed = lên giường ngủ. ≠ get up. Có to + bed.",
    },
    {
      id: "v7",
      word: "usually",
      phonetic: "/ˈjuːʒuəli/",
      meaning_vi: "thường / thường xuyên",
      example_en: "I usually get up at six.",
      l1_note_vi:
        "usually đứng trước động từ chính: I usually get up… Không: I get up usually at six (kém tự nhiên).",
    },
    {
      id: "v8",
      word: "every day",
      phonetic: "/ˈevri deɪ/",
      meaning_vi: "mỗi ngày",
      example_en: "I go to work every day.",
      l1_note_vi:
        "every day = hai từ (mỗi ngày). everyday (một từ) = adj «thường ngày» — khác nghĩa.",
    },
    {
      id: "v9",
      word: "in the morning",
      phonetic: "/ɪn ðə ˈmɔːrnɪŋ/",
      meaning_vi: "vào buổi sáng",
      example_en: "I go to work in the morning.",
      l1_note_vi:
        "in the morning/afternoon/evening (ôn a0-06). at night. Không: in morning (thiếu the).",
    },
    {
      id: "v10",
      word: "at + time",
      phonetic: "/æt/",
      meaning_vi: "lúc (giờ)",
      example_en: "I get up at seven o'clock.",
      l1_note_vi:
        "at + giờ (at six, at seven o'clock). Ôn a0-06: It's seven o'clock ≠ I get up seven.",
    },
  ],
  grammar: {
    title: "Present simple — I/you + verb (habits)",
    rule: "I/You + verb (+ at time / every day). What time do you + verb?",
    examples: [
      { en: "I get up at six o'clock.", vi: "Tôi dậy lúc 6 giờ." },
      { en: "I go to work in the morning.", vi: "Tôi đi làm vào buổi sáng." },
      { en: "I usually have breakfast at seven.", vi: "Tôi thường ăn sáng lúc 7 giờ." },
      { en: "What time do you get up?", vi: "Bạn dậy lúc mấy giờ?" },
      { en: "Do you go to work every day?", vi: "Bạn có đi làm mỗi ngày không?" },
    ],
    vnNote:
      "Present simple = thói quen: I/You + V nguyên mẫu (không -s với I/you). Hỏi: Do you…? / What time do you…? Lỗi L1: I getting up; I go to home; I go work.",
    ccq: {
      question: "Câu nào đúng về thói quen?",
      options: [
        "I get up at six o'clock.",
        "I getting up at six o'clock.",
        "I get up to six o'clock.",
        "I am get up at six o'clock.",
      ],
      answer: "I get up at six o'clock.",
      explanation_vi: "I + get up (present simple) + at + giờ.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Dậy lúc 6 giờ — câu đúng",
      options: [
        "I get up at six o'clock.",
        "I get up to six o'clock.",
        "I getting up at six.",
        "I go up at six o'clock.",
      ],
      answer: "I get up at six o'clock.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: I _____ to work at eight. (go / goes / going)",
      stem: "I _____ to work at eight.",
      answer: "go",
      explanation_vi: "I/you + go (không goes).",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: up / I / at / get / seven",
      words: ["I", "get", "up", "at", "seven"],
      answer: "I get up at seven",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Về nhà — câu đúng",
      options: [
        "I go home at six.",
        "I go to home at six.",
        "I go the home at six.",
        "I going home at six.",
      ],
      answer: "I go home at six.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I go work every day.",
      stem: "I go work every day.",
      answer: "I go to work every day.",
      explanation_vi: "go to work — cần to.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "What time do you get up? → đáp",
      options: [
        "I get up at six o'clock.",
        "I'm fine, thanks.",
        "I'm from Vietnam.",
        "This is my friend.",
      ],
      answer: "I get up at six o'clock.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Coffee chat — thói quen ngày thường",
        context_vi: "Alex và Linh nói chuyện lúc nghỉ giữa buổi về routine.",
        lines: [
          {
            id: "d1-1",
            speaker: "Alex",
            text: "Hi Linh! What time do you get up?",
            translation_vi: "Chào Linh! Bạn dậy lúc mấy giờ?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "I usually get up at six o'clock.",
            translation_vi: "Mình thường dậy lúc 6 giờ.",
          },
          {
            id: "d1-3",
            speaker: "Alex",
            text: "Do you have breakfast every day?",
            translation_vi: "Bạn có ăn sáng mỗi ngày không?",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "Yes. I have breakfast, then I go to work in the morning.",
            translation_vi: "Có. Mình ăn sáng, rồi đi làm vào buổi sáng.",
          },
          {
            id: "d1-5",
            speaker: "Alex",
            text: "What time do you go home?",
            translation_vi: "Bạn về nhà lúc mấy giờ?",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "I go home at six. I go to bed at ten o'clock.",
            translation_vi: "Mình về lúc 6. Mình đi ngủ lúc 10 giờ.",
          },
          {
            id: "d1-7",
            speaker: "Alex",
            text: "Nice routine! See you later.",
            translation_vi: "Routine hay đấy! Hẹn gặp lại.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I get up at six o'clock",
        options: [
          "I get up at six o'clock",
          "I get up to six o'clock",
          "I go to bed at six o'clock",
          "I get up at six clock",
        ],
        answer: "I get up at six o'clock",
      },
      {
        id: "lac2",
        audio_text: "I go to work every day",
        options: [
          "I go to work every day",
          "I go work every day",
          "I go to home every day",
          "I go to bed every day",
        ],
        answer: "I go to work every day",
      },
      {
        id: "lac3",
        audio_text: "What time do you get up?",
        options: [
          "What time do you get up?",
          "What time is it?",
          "How are you?",
          "Where are you from?",
        ],
        answer: "What time do you get up?",
      },
      {
        id: "lac4",
        audio_text: "I go home at six",
        options: [
          "I go home at six",
          "I go to home at six",
          "I go to work at six",
          "I get up at six",
        ],
        answer: "I go home at six",
      },
    ],
  },
  fluency: {
    items: [
      { en: "I get up at six o'clock.", vi: "Tôi dậy lúc 6 giờ." },
      { en: "I have breakfast at seven.", vi: "Tôi ăn sáng lúc 7 giờ." },
      { en: "I go to work in the morning.", vi: "Tôi đi làm vào buổi sáng." },
      { en: "I have lunch at twelve.", vi: "Tôi ăn trưa lúc 12 giờ." },
      { en: "I go home at six.", vi: "Tôi về nhà lúc 6 giờ." },
      { en: "I go to bed at ten.", vi: "Tôi đi ngủ lúc 10 giờ." },
      { en: "I usually get up early.", vi: "Tôi thường dậy sớm." },
      { en: "What time do you get up?", vi: "Bạn dậy lúc mấy giờ?" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Alex hỏi về ngày thường. Nói 5–7 câu: I get up at… → have breakfast → go to work → have lunch / go home → go to bed → optional What time do you…? hoặc every day / usually.",
    successCriteria_vi: [
      "Có I get up + at + giờ (hoặc o'clock)",
      "Có go to work hoặc go home / go to bed",
      "Có usually hoặc every day hoặc in the morning",
      "Dùng present simple I + verb (không I going…)",
    ],
    scaffold_en: [
      "I usually get up at six o'clock.",
      "I have breakfast at seven.",
      "I go to work in the morning.",
      "I have lunch at twelve.",
      "I go home at six.",
      "I go to bed at ten.",
      "What time do you get up?",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "I _____ up at six o'clock.",
        options: ["get", "gets", "getting", "got"],
        answer: "get",
        explanation_vi: "I + get (present simple).",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Câu đi làm đúng:",
        options: [
          "I go to work every day.",
          "I go work every day.",
          "I goes to work every day.",
          "I going to work every day.",
        ],
        answer: "I go to work every day.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I go to home at six là câu đúng trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Dùng I go home (không to home).",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Hỏi giờ dậy:",
        options: [
          "What time do you get up?",
          "What time is get up?",
          "How old do you get up?",
          "Where do you get up?",
        ],
        answer: "What time do you get up?",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I go _____ bed at ten. (to / at / in)",
        answer: "to",
      },
      {
        id: "q6",
        type: "mcq",
        question: "usually nghĩa là…",
        options: ["thường", "không bao giờ", "hôm qua", "bây giờ"],
        answer: "thường",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a0-06) It's seven _____.",
        options: ["o'clock", "clock", "hours", "time"],
        answer: "o'clock",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a0-06) Chào buổi sáng:",
        options: [
          "Good morning!",
          "Good night!",
          "Good afternoon night!",
          "It's morning o'clock.",
        ],
        answer: "Good morning!",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-03) This is my friend. _____ name is Mai.",
        options: ["Her", "His", "He", "She"],
        answer: "Her",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "final /p/ /t/ in get up · at",
    description_vi:
      "get up: chặn hơi nhẹ ở cuối get (/t/) và up (/p/). at six: /æt/ ngắn, không «ét» dài. o'clock: trọng âm clock.",
    examples: [
      {
        word: "get up",
        ipa: "/ɡet ʌp/",
        tip_vi: "Hai phụ âm cuối rõ, không nuốt thành «ge-up».",
      },
      {
        word: "at six",
        ipa: "/æt sɪks/",
        tip_vi: "at + phụ âm: nối nhẹ at-six.",
      },
      {
        word: "o'clock",
        ipa: "/əˈklɒk/",
        tip_vi: "o' = schwa nhẹ; nhấn clock (ôn a0-06).",
      },
    ],
  },
};
