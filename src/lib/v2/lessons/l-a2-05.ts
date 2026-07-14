import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 — present perfect expand (for / since · yet / already light).
 * Core: How long have you…? · for + duration · since + point ·
 * already (đã rồi) · yet (chưa / đã…chưa?) in simple questions/negatives.
 * Angle: job experience duration + project status (done yet / already finished).
 * Spiral: a2-04 ever/never + been to; past (a2-01) contrast with time markers.
 * L1 notes 100% (A2 schema gate).
 */
export const lessonA205: LessonSpec = {
  id: "l-a2-05",
  phase: "P2",
  cefr: "A2",
  title_vi: "Kinh nghiệm (Present Perfect)",
  estimatedMin: 40,
  canDo: [
    "Hỏi/trả lời thời lượng: How long have you…? + for / since",
    "Dùng already / yet nhẹ: I've already… / Have you… yet? / I haven't… yet",
    "Nói kinh nghiệm công việc: I've worked here for… / since…",
  ],
  situation:
    "Phỏng vấn hoặc standup: How long have you worked here? I've worked here for two years / since 2022. Have you finished the report yet? Yes, I've already sent it. — nối ever/never (a2-04) với thời lượng và trạng thái việc.",
  culturalNote_vi:
    "for + khoảng (for two years, for a long time); since + mốc (since 2022, since Monday). VN hay nói «từ 2 năm» → *since two years (sai). Interview: How long have you…? tự nhiên hơn How many years did you…? khi kinh nghiệm còn liên quan hiện tại. already = đã xong (khẳng định); yet = chưa / đã…chưa? (câu hỏi & phủ định). Không nhồi just/ever vào mọi câu.",
  jobAngle: "Interview/standup — How long have you worked…? Have you finished… yet?",
  lexis: [
    {
      id: "v1",
      word: "for",
      phonetic: "/fɔː/",
      meaning_vi: "trong / suốt (khoảng thời gian)",
      example_en: "I've worked here for two years.",
      l1_note_vi:
        "for + duration (two years, a month). Không: for 2022 → dùng since 2022.",
    },
    {
      id: "v2",
      word: "since",
      phonetic: "/sɪns/",
      meaning_vi: "từ (mốc thời gian)",
      example_en: "I've lived here since 2020.",
      l1_note_vi:
        "since + point (2020, Monday, I graduated). Không: since two years (→ for two years).",
    },
    {
      id: "v3",
      word: "How long",
      phonetic: "/haʊ lɒŋ/",
      meaning_vi: "bao lâu",
      example_en: "How long have you worked in sales?",
      l1_note_vi:
        "How long + have/has + S + V3…? Không: How long time…? / How long do you work here? (khi hỏi kinh nghiệm đến nay).",
    },
    {
      id: "v4",
      word: "already",
      phonetic: "/ɔːlˈredi/",
      meaning_vi: "đã… rồi",
      example_en: "I've already finished the report.",
      l1_note_vi:
        "already thường giữa have và V3: I've already… Không: I already have finished (ít tự nhiên hơn).",
    },
    {
      id: "v5",
      word: "yet",
      phonetic: "/jet/",
      meaning_vi: "đã… chưa? / chưa (phủ định)",
      example_en: "Have you sent it yet? I haven't sent it yet.",
      l1_note_vi:
        "yet cuối câu hỏi/phủ định. Không: Have you yet sent it? (tránh ở A2). I've already ≠ I haven't yet.",
    },
    {
      id: "v6",
      word: "worked",
      phonetic: "/wɜːkt/",
      meaning_vi: "đã làm việc (V3)",
      example_en: "I've worked in a team for six months.",
      l1_note_vi:
        "Spiral a2-04: I've worked… + for/since (thời lượng), không chỉ ever worked.",
    },
    {
      id: "v7",
      word: "lived",
      phonetic: "/lɪvd/",
      meaning_vi: "đã sống (V3)",
      example_en: "I've lived in Hanoi since 2019.",
      l1_note_vi:
        "live → lived. I've lived… since/for. Không: I live here since 2019 (present simple + since).",
    },
    {
      id: "v8",
      word: "finished",
      phonetic: "/ˈfɪnɪʃt/",
      meaning_vi: "đã xong (V3)",
      example_en: "Have you finished the deck yet?",
      l1_note_vi:
        "finish → finished. Standup: Have you finished… yet? / I've already finished…",
    },
    {
      id: "v9",
      word: "a long time",
      phonetic: "/ə lɒŋ taɪm/",
      meaning_vi: "một thời gian dài",
      example_en: "I've known her for a long time.",
      l1_note_vi:
        "for a long time (không since a long time). known = V3 của know.",
    },
    {
      id: "v10",
      word: "experience",
      phonetic: "/ɪkˈspɪəriəns/",
      meaning_vi: "kinh nghiệm",
      example_en: "I have three years of experience in design.",
      l1_note_vi:
        "years of experience. I've had experience with… Spiral a2-04 interview lexis.",
    },
  ],
  grammar: {
    title: "Present perfect · for / since · yet / already",
    rule: "have/has + V3 + for/since · already · yet (Q/neg)",
    examples: [
      {
        en: "How long have you worked here?",
        vi: "Bạn làm ở đây bao lâu rồi?",
      },
      {
        en: "I've worked here for two years / since 2022.",
        vi: "Tôi làm ở đây được hai năm / từ 2022.",
      },
      {
        en: "Have you finished the report yet?",
        vi: "Bạn xong báo cáo chưa?",
      },
      {
        en: "I've already sent it. / I haven't sent it yet.",
        vi: "Tôi đã gửi rồi. / Tôi chưa gửi.",
      },
    ],
    vnNote:
      "for = khoảng thời gian; since = mốc bắt đầu. already (đã rồi) vs yet (chưa / đã…chưa?). Vẫn have/has + V3 như a2-04. Không dùng for/since với past simple khi nói «đến nay vẫn»: I worked here for 2 years (đã kết thúc) ≠ I've worked here for 2 years (vẫn làm).",
    ccq: {
      question: "Chọn câu đúng về thời lượng đến nay",
      options: [
        "I work here since 2022.",
        "I've worked here since 2022.",
        "I've worked here since two years.",
        "I worked here since 2022 and still.",
      ],
      answer: "I've worked here since 2022.",
      explanation_vi: "have + V3 + since + mốc (2022).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Điền: I've lived here _____ 2019.",
      options: ["since", "for", "ago", "yet"],
      answer: "since",
      explanation_vi: "2019 là mốc → since.",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Điền: I've worked here _____ three years.",
      options: ["for", "since", "ago", "already"],
      answer: "for",
      explanation_vi: "three years = khoảng → for.",
    },
    {
      id: "c3",
      type: "cloze",
      prompt_vi: "Điền: How long _____ you worked in sales?",
      stem: "How long _____ you worked in sales?",
      answer: "have",
      explanation_vi: "How long + have + S + V3.",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Standup — đã xong rồi",
      options: [
        "I've already finished the slides.",
        "I've finished yet the slides.",
        "I already finish the slides.",
        "I haven't already finished the slides.",
      ],
      answer: "I've already finished the slides.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I've worked here since two years.",
      stem: "I've worked here since two years.",
      answer: "I've worked here for two years.",
      explanation_vi: "khoảng thời gian → for, không since.",
    },
    {
      id: "c6",
      type: "scramble",
      prompt_vi: "Sắp xếp: finished / you / Have / yet / ?",
      words: ["Have", "you", "finished", "yet"],
      answer: "Have you finished yet",
    },
    {
      id: "c7",
      type: "mcq",
      prompt_vi: "Interview — câu tự nhiên nhất",
      options: [
        "How long have you worked with this tool?",
        "How long do you work with this tool since?",
        "How long time you worked with this tool?",
        "Since how long you work this tool?",
      ],
      answer: "How long have you worked with this tool?",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Job interview — How long / for / since",
        context_vi: "Interviewer hỏi An về kinh nghiệm làm việc.",
        lines: [
          {
            id: "d1-1",
            speaker: "Interviewer",
            text: "How long have you worked in marketing?",
            translation_vi: "Bạn làm marketing bao lâu rồi?",
          },
          {
            id: "d1-2",
            speaker: "An",
            text: "I've worked in marketing for three years.",
            translation_vi: "Em làm marketing được ba năm.",
          },
          {
            id: "d1-3",
            speaker: "Interviewer",
            text: "And how long have you used Excel?",
            translation_vi: "Còn Excel thì bạn dùng bao lâu?",
          },
          {
            id: "d1-4",
            speaker: "An",
            text: "I've used Excel since 2021.",
            translation_vi: "Em dùng Excel từ 2021.",
          },
          {
            id: "d1-5",
            speaker: "Interviewer",
            text: "Have you ever worked abroad?",
            translation_vi: "Bạn đã từng làm ở nước ngoài chưa? (ôn a2-04)",
          },
          {
            id: "d1-6",
            speaker: "An",
            text: "No, I haven't. But I've worked with foreign clients for a long time.",
            translation_vi:
              "Chưa ạ. Nhưng em làm với khách nước ngoài đã lâu.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Standup — already / yet",
        context_vi: "Minh và lead check tiến độ report.",
        lines: [
          {
            id: "d2-1",
            speaker: "Lead",
            text: "Have you finished the report yet?",
            translation_vi: "Bạn xong report chưa?",
          },
          {
            id: "d2-2",
            speaker: "Minh",
            text: "Yes. I've already finished it.",
            translation_vi: "Rồi. Mình đã xong rồi.",
          },
          {
            id: "d2-3",
            speaker: "Lead",
            text: "Great. Have you sent it to the client yet?",
            translation_vi: "Tốt. Bạn gửi cho client chưa?",
          },
          {
            id: "d2-4",
            speaker: "Minh",
            text: "Not yet. I haven't sent it yet.",
            translation_vi: "Chưa. Mình chưa gửi.",
          },
          {
            id: "d2-5",
            speaker: "Lead",
            text: "OK. Please send it today. I've already told them it's coming.",
            translation_vi:
              "OK. Gửi hôm nay nhé. Mình đã bảo họ rồi là sắp có.",
          },
          {
            id: "d2-6",
            speaker: "Minh",
            text: "Sure. I'll send it this afternoon.",
            translation_vi: "Vâng. Chiều mình gửi.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "How long have you worked here",
        options: [
          "How long have you worked here",
          "How long do you work here",
          "How long time you worked here",
          "How long you have work here",
        ],
        answer: "How long have you worked here",
      },
      {
        id: "lac2",
        audio_text: "I've worked here for two years",
        options: [
          "I've worked here for two years",
          "I've worked here since two years",
          "I work here for two years now",
          "I've work here for two years",
        ],
        answer: "I've worked here for two years",
      },
      {
        id: "lac3",
        audio_text: "I've lived here since 2020",
        options: [
          "I've lived here since 2020",
          "I've lived here for 2020",
          "I live here since 2020",
          "I've live here since 2020",
        ],
        answer: "I've lived here since 2020",
      },
      {
        id: "lac4",
        audio_text: "Have you finished yet",
        options: [
          "Have you finished yet",
          "Have you finished already yet",
          "Did you finished yet",
          "Have you yet finished already",
        ],
        answer: "Have you finished yet",
      },
      {
        id: "lac5",
        audio_text: "I've already sent the report",
        options: [
          "I've already sent the report",
          "I've sent already the report yet",
          "I already have send the report",
          "I've yet sent the report",
        ],
        answer: "I've already sent the report",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "How long have you worked here?",
        vi: "Bạn làm ở đây bao lâu rồi?",
      },
      {
        en: "I've worked here for two years.",
        vi: "Mình làm ở đây được hai năm.",
      },
      {
        en: "I've lived here since 2020.",
        vi: "Mình sống ở đây từ 2020.",
      },
      {
        en: "Have you finished yet?",
        vi: "Bạn xong chưa?",
      },
      {
        en: "I've already finished it.",
        vi: "Mình đã xong rồi.",
      },
      {
        en: "I haven't sent it yet.",
        vi: "Mình chưa gửi.",
      },
      {
        en: "I've used Excel for a long time.",
        vi: "Mình dùng Excel đã lâu.",
      },
      {
        en: "How long have you known her?",
        vi: "Bạn biết cô ấy bao lâu rồi?",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Chọn interview hoặc standup. Nói 5–7 câu: ≥1 How long have you…? (hoặc trả lời) + ≥1 for… hoặc since… + ≥1 already hoặc yet + 1 câu ôn ever/never (a2-04) nếu hợp cảnh.",
    successCriteria_vi: [
      "≥1 How long + have + V3 hoặc trả lời for/since đúng",
      "≥1 for + duration hoặc since + point",
      "≥1 already hoặc yet đúng chỗ",
      "Không: since two years / I work here since…",
    ],
    scaffold_en: [
      "How long have you worked…?",
      "I've … for two years / since 2022.",
      "Have you finished… yet?",
      "I've already… / I haven't… yet.",
      "Have you ever…? (spiral a2-04)",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "I've worked here _____ five years.",
        options: ["for", "since", "ago", "yet"],
        answer: "for",
        explanation_vi: "five years = khoảng → for.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "I've lived here _____ Monday.",
        options: ["since", "for", "ago", "already"],
        answer: "since",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I've worked here since two years. là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: for two years.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Chọn câu standup đúng:",
        options: [
          "Have you finished the deck yet?",
          "Have you finished the deck already yet?",
          "Did you finished the deck yet?",
          "Have you yet the deck finished?",
        ],
        answer: "Have you finished the deck yet?",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I've _____ sent the email. (already)",
        answer: "already",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Interview — chọn câu đúng:",
        options: [
          "How long have you worked with clients?",
          "How long do you worked with clients?",
          "How long time have you work with clients?",
          "Since how long you work with clients?",
        ],
        answer: "How long have you worked with clients?",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-04) Have you _____ been to Hue?",
        options: ["ever", "for", "since", "ago"],
        answer: "ever",
        explanation_vi: "ever trong câu hỏi kinh nghiệm (a2-04).",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a2-04) I've _____ tried bún chả.",
        options: ["never", "yet not", "since", "ago"],
        answer: "never",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a2-01) Yesterday I _____ the report.",
        options: ["finished", "have finished", "finish", "finishing"],
        answer: "finished",
        explanation_vi: "yesterday → past simple, không present perfect.",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "for /fə/ · since · already",
    description_vi:
      "for trong for two years thường yếu /fə/. since /sɪns/ — s rõ, không /z/. already nhấn -rea- /ˈredi/. yet /jet/ ngắn cuối câu. I've /aɪv/ + already dính: I've already…",
    examples: [
      {
        word: "for two years",
        ipa: "/fə tuː jɪəz/",
        tip_vi: "for yếu; nhấn two / years.",
      },
      {
        word: "since 2020",
        ipa: "/sɪns tuː ˈtwenti/",
        tip_vi: "since rõ; năm đọc tự nhiên.",
      },
      {
        word: "I've already",
        ipa: "/aɪv ɔːlˈredi/",
        tip_vi: "I've dính; nhấn -ready.",
      },
    ],
  },
};
