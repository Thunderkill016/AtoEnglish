import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 — workplace survival lexis + simple present work routines.
 * Core: What do you do? · I work as… / I work in… · start/finish at ·
 * he/she works · every day / usually · meeting · deadline · remote.
 * Angle: office small talk + introduce job routine to a colleague.
 * Spiral: a2-05 for/since experience; a1-04 daily routines; past (a2-01) contrast.
 * L1 notes 100% (A2 schema gate).
 */
export const lessonA206: LessonSpec = {
  id: "l-a2-06",
  phase: "P2",
  cefr: "A2",
  title_vi: "Công việc cơ bản",
  estimatedMin: 40,
  canDo: [
    "Giới thiệu công việc: What do you do? / I work as… / I work in…",
    "Nói routine văn phòng: I start at… / I finish at… / I usually…",
    "Dùng workplace lexis: meeting, deadline, colleague, manager, remote",
  ],
  situation:
    "Ngày đầu ở văn phòng hoặc coffee với đồng nghiệp nước ngoài. Họ hỏi: What do you do? When do you start? Do you work remote? Bạn trả lời bằng simple present: I work as a designer. I start at 9. We have a meeting every Monday. — sống sót small talk công việc, chưa cần present perfect (a2-05) cho mọi câu.",
  culturalNote_vi:
    "What do you do? = hỏi nghề (không What are you doing? khi muốn biết job). I work as a teacher / I work in marketing / I work for a bank. Simple present = thói quen & sự thật hiện tại (every day, usually, on Mondays). he/she + -s: She works… (lỗi VN hay quên -s). remote / hybrid / full-time rất hay trong office EN. Don't overuse present continuous for permanent job: I am working as… chỉ khi tạm thời.",
  jobAngle: "Office small talk — What do you do? When do you start? Meeting today?",
  lexis: [
    {
      id: "v1",
      word: "What do you do?",
      phonetic: "/wɒt duː juː duː/",
      meaning_vi: "Bạn làm nghề gì?",
      example_en: "What do you do? I work in sales.",
      l1_note_vi:
        "Hỏi nghề/việc. Không: What are you doing? (hỏi đang làm gì lúc này).",
    },
    {
      id: "v2",
      word: "work as",
      phonetic: "/wɜːk æz/",
      meaning_vi: "làm nghề / làm với tư cách",
      example_en: "I work as a designer.",
      l1_note_vi:
        "work as + job title. work in + field (marketing). work for + company.",
    },
    {
      id: "v3",
      word: "colleague",
      phonetic: "/ˈkɒliːɡ/",
      meaning_vi: "đồng nghiệp",
      example_en: "My colleagues are friendly.",
      l1_note_vi:
        "colleague = đồng nghiệp (formal hơn work friend). co-worker cũng OK.",
    },
    {
      id: "v4",
      word: "manager",
      phonetic: "/ˈmænɪdʒə/",
      meaning_vi: "quản lý / sếp",
      example_en: "My manager starts at eight.",
      l1_note_vi:
        "manager = người quản lý. boss thân mật hơn. She manages the team.",
    },
    {
      id: "v5",
      word: "meeting",
      phonetic: "/ˈmiːtɪŋ/",
      meaning_vi: "cuộc họp",
      example_en: "We have a meeting every Monday.",
      l1_note_vi:
        "have a meeting / in a meeting. Không: make a meeting (→ schedule/have).",
    },
    {
      id: "v6",
      word: "deadline",
      phonetic: "/ˈdedlaɪn/",
      meaning_vi: "hạn chót",
      example_en: "The deadline is Friday.",
      l1_note_vi:
        "meet the deadline = đúng hạn. miss the deadline = trễ hạn.",
    },
    {
      id: "v7",
      word: "start at",
      phonetic: "/stɑːt æt/",
      meaning_vi: "bắt đầu lúc (giờ)",
      example_en: "I start at nine.",
      l1_note_vi:
        "start/finish at + time. I start work at 9. Không: I start from 9 (ít tự nhiên).",
    },
    {
      id: "v8",
      word: "finish at",
      phonetic: "/ˈfɪnɪʃ æt/",
      meaning_vi: "tan / kết thúc lúc",
      example_en: "I usually finish at six.",
      l1_note_vi:
        "finish at + time. finish work = tan làm. finish the report = xong báo cáo.",
    },
    {
      id: "v9",
      word: "remote",
      phonetic: "/rɪˈməʊt/",
      meaning_vi: "làm từ xa",
      example_en: "I work remote on Fridays.",
      l1_note_vi:
        "work remote / work from home / hybrid. remote work = làm remote.",
    },
    {
      id: "v10",
      word: "full-time",
      phonetic: "/ˌfʊlˈtaɪm/",
      meaning_vi: "toàn thời gian",
      example_en: "I work full-time in an office.",
      l1_note_vi:
        "full-time vs part-time. I have a full-time job. (không full time job thiếu gạch vẫn OK).",
    },
  ],
  grammar: {
    title: "Simple present · work routines",
    rule: "I/you/we/they + V · he/she/it + V-s · What do/does…?",
    examples: [
      {
        en: "What do you do? I work as a teacher.",
        vi: "Bạn làm nghề gì? Tôi là giáo viên / làm giáo viên.",
      },
      {
        en: "She works in marketing. He works for a bank.",
        vi: "Cô ấy làm marketing. Anh ấy làm cho một ngân hàng.",
      },
      {
        en: "I start at 9 and finish at 6.",
        vi: "Tôi bắt đầu lúc 9 và tan lúc 6.",
      },
      {
        en: "We have a meeting every Monday.",
        vi: "Chúng tôi họp mỗi thứ Hai.",
      },
    ],
    vnNote:
      "Simple present = thói quen / sự thật (every day, usually, on Mondays). he/she/it + -s: works, starts, finishes. Câu hỏi: What do you do? / What does she do? / When do you start? Phủ định: I don't work on Sundays. / She doesn't work remote. Không nhầm với present continuous cho job cố định: I work as… (ổn định) ≠ I'm working as… (tạm).",
    ccq: {
      question: "Chọn câu đúng về công việc cố định",
      options: [
        "She work in an office.",
        "She works in an office.",
        "She working in an office every day.",
        "She is work in an office.",
      ],
      answer: "She works in an office.",
      explanation_vi: "he/she + V-s (works).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Hỏi nghề — chọn câu đúng",
      options: [
        "What do you do?",
        "What are you do?",
        "What you doing for job?",
        "What does you do?",
      ],
      answer: "What do you do?",
      explanation_vi: "What do you do? = hỏi nghề.",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Điền: She _____ in sales.",
      options: ["works", "work", "working", "is works"],
      answer: "works",
      explanation_vi: "she + works.",
    },
    {
      id: "c3",
      type: "cloze",
      prompt_vi: "Điền: I _____ at nine every day. (start)",
      stem: "I _____ at nine every day.",
      answer: "start",
      explanation_vi: "I/you/we/they + V (không -s).",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Office — họp định kỳ",
      options: [
        "We have a meeting every Monday.",
        "We are have a meeting every Monday.",
        "We has a meeting every Monday.",
        "We having meeting every Mondays.",
      ],
      answer: "We have a meeting every Monday.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: He work as a manager.",
      stem: "He work as a manager.",
      answer: "He works as a manager.",
      explanation_vi: "he + works.",
    },
    {
      id: "c6",
      type: "scramble",
      prompt_vi: "Sắp xếp: at / I / finish / six / usually",
      words: ["I", "usually", "finish", "at", "six"],
      answer: "I usually finish at six",
    },
    {
      id: "c7",
      type: "mcq",
      prompt_vi: "Giới thiệu job — tự nhiên nhất",
      options: [
        "I work as a designer in a small team.",
        "I am work as a designer in a small team.",
        "I working as designer every days.",
        "I works as a designer in a small team.",
      ],
      answer: "I work as a designer in a small team.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Office — What do you do?",
        context_vi: "Ngày đầu, An gặp đồng nghiệp mới Lan ở pantry.",
        lines: [
          {
            id: "d1-1",
            speaker: "Lan",
            text: "Hi! I'm Lan. What do you do here?",
            translation_vi: "Chào! Mình là Lan. Bạn làm gì ở đây?",
          },
          {
            id: "d1-2",
            speaker: "An",
            text: "I work as a designer. I work in the product team.",
            translation_vi: "Mình làm designer. Mình ở team product.",
          },
          {
            id: "d1-3",
            speaker: "Lan",
            text: "Nice. Do you work full-time?",
            translation_vi: "Hay đấy. Bạn làm full-time à?",
          },
          {
            id: "d1-4",
            speaker: "An",
            text: "Yes. I work full-time. I start at nine.",
            translation_vi: "Ừ. Mình full-time. Bắt đầu lúc 9.",
          },
          {
            id: "d1-5",
            speaker: "Lan",
            text: "I usually finish at six. My manager finishes later.",
            translation_vi: "Mình thường tan lúc 6. Sếp mình tan muộn hơn.",
          },
          {
            id: "d1-6",
            speaker: "An",
            text: "Same here. See you at the meeting!",
            translation_vi: "Mình cũng vậy. Gặp ở meeting nhé!",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Standup light — routine & deadline",
        context_vi: "Minh và lead check lịch tuần (simple present, không perfect).",
        lines: [
          {
            id: "d2-1",
            speaker: "Lead",
            text: "Do you work remote this week?",
            translation_vi: "Tuần này bạn remote không?",
          },
          {
            id: "d2-2",
            speaker: "Minh",
            text: "I work remote on Fridays. Other days I work in the office.",
            translation_vi: "Thứ Sáu mình remote. Các ngày khác mình vào office.",
          },
          {
            id: "d2-3",
            speaker: "Lead",
            text: "OK. We have a meeting every Monday at ten.",
            translation_vi: "OK. Mỗi thứ Hai mình họp lúc 10.",
          },
          {
            id: "d2-4",
            speaker: "Minh",
            text: "Got it. What's the deadline for the report?",
            translation_vi: "Rõ. Deadline report là khi nào?",
          },
          {
            id: "d2-5",
            speaker: "Lead",
            text: "The deadline is Friday. My colleagues need it then.",
            translation_vi: "Deadline là thứ Sáu. Đồng nghiệp cần lúc đó.",
          },
          {
            id: "d2-6",
            speaker: "Minh",
            text: "I'll finish it before Friday. Thanks!",
            translation_vi: "Mình sẽ xong trước thứ Sáu. Cảm ơn!",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "What do you do",
        options: [
          "What do you do",
          "What are you do",
          "What you doing",
          "What does you do",
        ],
        answer: "What do you do",
      },
      {
        id: "lac2",
        audio_text: "I work as a designer",
        options: [
          "I work as a designer",
          "I works as a designer",
          "I am work as a designer",
          "I working as a designer always",
        ],
        answer: "I work as a designer",
      },
      {
        id: "lac3",
        audio_text: "She works in marketing",
        options: [
          "She works in marketing",
          "She work in marketing",
          "She working in marketing",
          "She is works in marketing",
        ],
        answer: "She works in marketing",
      },
      {
        id: "lac4",
        audio_text: "I start at nine",
        options: [
          "I start at nine",
          "I starts at nine",
          "I starting at nine",
          "I start from nine o'clock alwaysing",
        ],
        answer: "I start at nine",
      },
      {
        id: "lac5",
        audio_text: "We have a meeting every Monday",
        options: [
          "We have a meeting every Monday",
          "We has a meeting every Monday",
          "We are have a meeting every Monday",
          "We having meeting every Monday",
        ],
        answer: "We have a meeting every Monday",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "What do you do?",
        vi: "Bạn làm nghề gì?",
      },
      {
        en: "I work as a designer.",
        vi: "Mình làm designer.",
      },
      {
        en: "I work in marketing.",
        vi: "Mình làm marketing.",
      },
      {
        en: "I start at nine.",
        vi: "Mình bắt đầu lúc 9.",
      },
      {
        en: "I usually finish at six.",
        vi: "Mình thường tan lúc 6.",
      },
      {
        en: "She works for a bank.",
        vi: "Cô ấy làm cho một ngân hàng.",
      },
      {
        en: "We have a meeting every Monday.",
        vi: "Chúng tôi họp mỗi thứ Hai.",
      },
      {
        en: "I work remote on Fridays.",
        vi: "Thứ Sáu mình remote.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Giới thiệu công việc với đồng nghiệp mới (30–45 giây). Nói 5–7 câu: ≥1 What do you do? hoặc trả lời I work as/in… + ≥1 start/finish at… + ≥1 meeting / deadline / remote / colleague + 1 câu ôn for/since (a2-05) nếu hợp (I've worked here for…).",
    successCriteria_vi: [
      "≥1 I work as… / I work in… / I work for…",
      "≥1 start at… hoặc finish at… (hoặc usually…)",
      "≥1 workplace word: meeting, deadline, colleague, manager, remote, full-time",
      "he/she + -s đúng nếu nói về người khác; không: She work…",
    ],
    scaffold_en: [
      "What do you do? I work as… / in…",
      "I start at… / I finish at…",
      "We have a meeting every…",
      "I work remote on…",
      "I've worked here for… (spiral a2-05)",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Hỏi nghề:",
        options: [
          "What do you do?",
          "What are you doing for always job?",
          "What you work?",
          "What does you do?",
        ],
        answer: "What do you do?",
        explanation_vi: "What do you do? = nghề nghiệp.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "She _____ in an office.",
        options: ["works", "work", "working", "is work"],
        answer: "works",
      },
      {
        id: "q3",
        type: "true-false",
        question: "He work as a manager. là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: He works as a manager.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Chọn câu routine đúng:",
        options: [
          "I start at nine and finish at six.",
          "I starts at nine and finish at six.",
          "I am start at nine and finish at six.",
          "I starting at nine every day always.",
        ],
        answer: "I start at nine and finish at six.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "We have a _____ every Monday. (meeting)",
        answer: "meeting",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Deadline — chọn câu đúng:",
        options: [
          "The deadline is Friday.",
          "The deadline are Friday.",
          "The deadline be Friday.",
          "Deadline is on the Fridays always.",
        ],
        answer: "The deadline is Friday.",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-05) I've worked here _____ two years.",
        options: ["for", "since", "ago", "at"],
        answer: "for",
        explanation_vi: "for + duration (a2-05).",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a2-05) I've lived here _____ 2020.",
        options: ["since", "for", "ago", "at"],
        answer: "since",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a2-01) Yesterday I _____ late.",
        options: ["finished", "finish", "have finished", "finishes"],
        answer: "finished",
        explanation_vi: "yesterday → past simple, không simple present routine.",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "works /wɜːks/ · meeting · deadline",
    description_vi:
      "works: /s/ cuối rõ (không work). meeting: nhấn mee- /ˈmiːtɪŋ/. deadline: hai âm, nhấn dead- /ˈdedlaɪn/. What do you do? nhịp nhanh: /wɒt djuː duː/ (do you → d'you).",
    examples: [
      {
        word: "works",
        ipa: "/wɜːks/",
        tip_vi: "k + s rõ; không nuốt -s.",
      },
      {
        word: "meeting",
        ipa: "/ˈmiːtɪŋ/",
        tip_vi: "nhấn âm 1; -ing nhẹ.",
      },
      {
        word: "deadline",
        ipa: "/ˈdedlaɪn/",
        tip_vi: "dead + line; không /det/.",
      },
    ],
  },
};
