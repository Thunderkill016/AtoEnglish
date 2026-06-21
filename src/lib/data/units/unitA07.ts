import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-7 — Thời Gian, Ngày & Tháng (Time, Days & Months)
// Level 0 / Foundation — Pre-CEFR A0
// Grammar: Prepositions of time — AT / ON / IN (no equivalent in Vietnamese)
// L1 Alert: Vietnamese omits time prepositions entirely — systematic source
//   of errors in ALL Vietnamese EFL learners (multiple empirical studies)
// ─────────────────────────────────────────────────────────────────────────────

export const unitA07: UnitData = {
  unitId: "unit-a0-7",
  title: "Unit A0-7: Thời Gian, Ngày & Tháng",
  level: "A0",
  xp: 60,
  estimatedTime: 40,
  description:
    "Học cách nói giờ giấc, ngày trong tuần và các buổi trong ngày — thiết yếu để đặt lịch và hẹn hò bằng tiếng Anh.",
  badgeName: "Người Đúng Giờ",
  badgeEmoji: "🕐",

  situation:
    "Sếp người Mỹ hỏi: \"Are you free on Monday morning at 9?\" — bạn đồng ý thế nào? Và nếu bận, bạn đề xuất thời gian khác ra sao?",

  learningOutcomes: [
    "Nói ngày trong tuần và các buổi trong ngày bằng tiếng Anh",
    "Dùng đúng giới từ thời gian: AT (giờ), ON (ngày), IN (buổi/tháng)",
    "Hỏi và trả lời về lịch trình đơn giản",
  ],

  culturalNote:
    'Mỹ viết ngày tháng theo thứ tự: <span class="text-emerald-400 font-semibold">MONTH/DAY/YEAR</span> — ví dụ 6/21/2026 = ngày 21 tháng 6 năm 2026. Ngược với Việt Nam viết DAY/MONTH/YEAR (21/6/2026). Cẩn thận khi đọc ngày tháng trong hợp đồng hay vé máy bay!',

  warmupGreetings: [
    {
      emoji: "📅",
      en: "See you on Monday!",
      vn: "Hẹn gặp vào thứ Hai!",
      context: "Hẹn gặp cuối cuộc trò chuyện",
    },
    {
      emoji: "⏰",
      en: "The meeting is at 9 AM.",
      vn: "Cuộc họp lúc 9 giờ sáng.",
      context: "Thông báo lịch họp",
    },
    {
      emoji: "🌅",
      en: "I work in the morning.",
      vn: "Tôi làm việc vào buổi sáng.",
      context: "Nói về thói quen buổi sáng",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "Monday",
      emoji: "📅",
      phonetic: "/ˈmʌndeɪ/",
      meaning: "Thứ Hai",
      example: "I have a meeting on Monday.",
      example2: "Monday is the first day of the work week.",
      collocation: "on Monday / every Monday / Monday morning",
      audio: "/audio/unit-a0-7/monday.mp3",
    },
    {
      id: 2,
      word: "Tuesday",
      emoji: "📅",
      phonetic: "/ˈtjuːzdeɪ/",
      meaning: "Thứ Ba",
      example: "We have class on Tuesday.",
      example2: "Are you free on Tuesday afternoon?",
      collocation: "on Tuesday / every Tuesday",
      audio: "/audio/unit-a0-7/tuesday.mp3",
    },
    {
      id: 3,
      word: "Wednesday",
      emoji: "📅",
      phonetic: "/ˈwenzdeɪ/",
      meaning: "Thứ Tư",
      example: "Wednesday is in the middle of the week.",
      example2: "I go to the gym on Wednesday.",
      collocation: "on Wednesday / last Wednesday",
      audio: "/audio/unit-a0-7/wednesday.mp3",
    },
    {
      id: 4,
      word: "Thursday",
      emoji: "📅",
      phonetic: "/ˈθɜːrzdeɪ/",
      meaning: "Thứ Năm",
      example: "The deadline is on Thursday.",
      example2: "Let's meet on Thursday evening.",
      collocation: "on Thursday / this Thursday",
      audio: "/audio/unit-a0-7/thursday.mp3",
    },
    {
      id: 5,
      word: "Friday",
      emoji: "🎉",
      phonetic: "/ˈfraɪdeɪ/",
      meaning: "Thứ Sáu",
      example: "Friday is my favorite day!",
      example2: "We finish work early on Friday.",
      collocation: "on Friday / TGIF (Thank God It's Friday)",
      audio: "/audio/unit-a0-7/friday.mp3",
    },
    {
      id: 6,
      word: "morning",
      emoji: "🌅",
      phonetic: "/ˈmɔːrnɪŋ/",
      meaning: "Buổi sáng",
      example: "I exercise in the morning.",
      example2: "Good morning! How are you?",
      collocation: "in the morning / this morning / early morning",
      audio: "/audio/unit-a0-7/morning.mp3",
    },
    {
      id: 7,
      word: "afternoon",
      emoji: "☀️",
      phonetic: "/ˌɑːftərˈnuːn/",
      meaning: "Buổi chiều",
      example: "I have lunch in the afternoon.",
      example2: "Good afternoon, everyone!",
      collocation: "in the afternoon / this afternoon / early afternoon",
      audio: "/audio/unit-a0-7/afternoon.mp3",
    },
    {
      id: 8,
      word: "evening",
      emoji: "🌆",
      phonetic: "/ˈiːvnɪŋ/",
      meaning: "Buổi tối sớm (6–9 PM)",
      example: "I watch TV in the evening.",
      example2: "Good evening! Welcome to our restaurant.",
      collocation: "in the evening / this evening / every evening",
      audio: "/audio/unit-a0-7/evening.mp3",
    },
    {
      id: 9,
      word: "today",
      emoji: "📆",
      phonetic: "/təˈdeɪ/",
      meaning: "Hôm nay",
      example: "What day is it today?",
      example2: "Today is Monday, June 21st.",
      collocation: "today is / as of today / today's meeting",
      audio: "/audio/unit-a0-7/today.mp3",
    },
    {
      id: 10,
      word: "tomorrow",
      emoji: "🔮",
      phonetic: "/təˈmɒrəʊ/",
      meaning: "Ngày mai",
      example: "See you tomorrow!",
      example2: "The meeting is tomorrow morning.",
      collocation: "tomorrow morning / tomorrow afternoon / by tomorrow",
      audio: "/audio/unit-a0-7/tomorrow.mp3",
    },
  ],

  grammar: {
    title: "Giới từ thời gian: AT / ON / IN",
    rule: "AT + giờ cụ thể | ON + ngày/thứ | IN + buổi / tháng / năm",
    conjugation: [
      { subject: "AT",  form: "+ giờ cụ thể",         example: "at 9 o'clock / at 8 AM / at noon" },
      { subject: "ON",  form: "+ ngày/thứ",            example: "on Monday / on Tuesday / on June 21st" },
      { subject: "IN",  form: "+ buổi/tháng/năm",      example: "in the morning / in June / in 2026" },
    ],
    examples: [
      { en: "The meeting is at 9 AM on Monday.",    vn: "Cuộc họp lúc 9 giờ sáng vào thứ Hai." },
      { en: "I work in the morning.",               vn: "Tôi làm việc vào buổi sáng." },
      { en: "Are you free on Friday afternoon?",    vn: "Bạn có rảnh vào chiều thứ Sáu không?" },
      { en: "The class starts at 8 o'clock.",       vn: "Lớp học bắt đầu lúc 8 giờ." },
    ],
    tip: "Mẹo nhớ: AT = kim đồng hồ chỉ đúng 1 điểm thời gian. ON = đặt lên tờ lịch (ngày/thứ). IN = bên trong khoảng thời gian rộng (buổi/tháng/năm).",

    vnNote:
      "⚠️ LỖI RẤT PHỔ BIẾN: Người Việt hay BỎ QUA giới từ thời gian!\n\nTiếng Việt: 'Tôi làm việc thứ Hai buổi sáng' — không cần giới từ.\nTiếng Anh BẮT BUỘC: 'I work ON Monday IN the morning.'\n\n❌ SAI: 'I work Monday morning.'\n✅ ĐÚNG: 'I work ON Monday IN the morning.'\n\n❌ SAI: 'The meeting 9 o'clock.'\n✅ ĐÚNG: 'The meeting is AT 9 o'clock.'\n\nQuy tắc vàng: Giờ → AT, Ngày/Thứ → ON, Buổi/Tháng/Năm → IN",

    dialogueExample: {
      speaker: "Manager",
      text: "Are you free on Monday at 9 in the morning?",
      translation: "Bạn có rảnh vào thứ Hai lúc 9 giờ sáng không?",
      highlight: "on / at / in",
    },

    ccq: {
      question: "Điền giới từ đúng: 'The class is ___ 8 AM ___ Monday.'",
      options: [
        "in / on",
        "on / at",
        "at / on ✓",
        "at / in",
      ],
      answer: "at / on ✓",
    },
  },

  matchingExercise: {
    title: "Nối thời gian với giới từ đúng",
    pairs: [
      { left: "9 o'clock",     right: "at" },
      { left: "Monday",        right: "on" },
      { left: "the morning",   right: "in" },
      { left: "June",          right: "in" },
      { left: "Friday",        right: "on" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq7-1",
      question: "Điền từ còn thiếu: 'I work ___ the morning.'",
      options: ["at", "on", "in", "by"],
      answer: "in",
      type: "multiple-choice",
    },
    {
      id: "pq7-2",
      question: "Điền từ còn thiếu: 'The meeting is ___ 9 AM.'",
      options: [],
      answer: "at",
      type: "cloze",
    },
    {
      id: "pq7-3",
      question: "Điền từ còn thiếu: 'Are you free ___ Monday?'",
      options: [],
      answer: "on",
      type: "cloze",
    },
  ],

  practiceTranslate: [
    {
      id: "pt7-1",
      prompt_vn: "Cuộc họp lúc 9 giờ sáng vào thứ Hai.",
      answer: "The meeting is at 9 AM on Monday.",
    },
    {
      id: "pt7-2",
      prompt_vn: "Tôi làm việc vào buổi sáng.",
      answer: "I work in the morning.",
    },
    {
      id: "pt7-3",
      prompt_vn: "Bạn có rảnh vào chiều thứ Sáu không?",
      answer: "Are you free on Friday afternoon?",
    },
  ],

  scrambleExercises: [
    {
      id: "s7-1",
      prompt_vn: "Tôi làm việc vào thứ Hai buổi sáng lúc 9 giờ.",
      words: ["I", "work", "on", "Monday", "morning", "at", "9", "."],
      answer: "I work on Monday morning at 9 .",
    },
    {
      id: "s7-2",
      prompt_vn: "Cuộc họp vào thứ Sáu lúc 2 giờ chiều.",
      words: ["The", "meeting", "is", "on", "Friday", "at", "2", "PM", "."],
      answer: "The meeting is on Friday at 2 PM .",
    },
    {
      id: "s7-3",
      prompt_vn: "Bạn có rảnh vào thứ Ba không?",
      words: ["Are", "you", "free", "on", "Tuesday", "?"],
      answer: "Are you free on Tuesday ?",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Đặt lịch họp",
      audio: "/audio/unit-a0-7/dialogue_1.mp3",
      desc: "Minh và sếp người Mỹ đang đặt lịch cuộc họp tuần tới.",
      lines: [
        {
          id: "d7-1-1",
          speaker: "Manager",
          text: "Minh, are you free on Monday?",
          translation: "Minh, bạn có rảnh vào thứ Hai không?",
        },
        {
          id: "d7-1-2",
          speaker: "Minh",
          text: "Yes, I'm free in the morning. What time?",
          translation: "Vâng, tôi rảnh buổi sáng ạ. Mấy giờ ạ?",
        },
        {
          id: "d7-1-3",
          speaker: "Manager",
          text: "How about at 9 AM?",
          translation: "Lúc 9 giờ sáng thì sao?",
        },
        {
          id: "d7-1-4",
          speaker: "Minh",
          text: "9 AM on Monday is perfect!",
          translation: "9 giờ sáng thứ Hai là hoàn hảo!",
        },
        {
          id: "d7-1-5",
          speaker: "Manager",
          text: "Great! See you then.",
          translation: "Tuyệt! Hẹn gặp lại.",
        },
      ],
    },
    {
      id: 2,
      title: "Hỏi lịch trình hàng tuần",
      audio: "/audio/unit-a0-7/dialogue_2.mp3",
      desc: "Sarah hỏi Linh về lịch học tiếng Anh của cô.",
      lines: [
        {
          id: "d7-2-1",
          speaker: "Sarah",
          text: "When do you study English?",
          translation: "Bạn học tiếng Anh khi nào?",
        },
        {
          id: "d7-2-2",
          speaker: "Linh",
          text: "I study every day in the evening — at about 8 PM.",
          translation: "Tôi học mỗi ngày vào buổi tối — khoảng 8 giờ.",
        },
        {
          id: "d7-2-3",
          speaker: "Sarah",
          text: "That's great! And on weekends?",
          translation: "Tuyệt vời! Còn cuối tuần thì sao?",
        },
        {
          id: "d7-2-4",
          speaker: "Linh",
          text: "On Saturday I study for two hours in the morning.",
          translation: "Vào thứ Bảy tôi học hai tiếng vào buổi sáng.",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac7-1",
      audio_text: "The meeting is at 9 AM",
      options: [
        "The meeting is at 9 AM",
        "The meeting is on 9 AM",
        "The meeting is in 9 AM",
        "The meeting at 9 AM",
      ],
      answer: "The meeting is at 9 AM",
    },
    {
      id: "lac7-2",
      audio_text: "Are you free on Monday",
      options: [
        "Are you free in Monday",
        "Are you free at Monday",
        "Are you free on Monday",
        "Are you free by Monday",
      ],
      answer: "Are you free on Monday",
    },
    {
      id: "lac7-3",
      audio_text: "I work in the morning",
      options: [
        "I work at the morning",
        "I work on the morning",
        "I work in the morning",
        "I work by the morning",
      ],
      answer: "I work in the morning",
    },
  ],

  fluencyDrill: {
    title: "Phản xạ thời gian",
    items: [
      { en: "at 9 AM",             vn: "lúc 9 giờ sáng" },
      { en: "on Monday",           vn: "vào thứ Hai" },
      { en: "in the morning",      vn: "vào buổi sáng" },
      { en: "on Friday afternoon", vn: "vào chiều thứ Sáu" },
      { en: "at noon",             vn: "vào lúc 12 giờ trưa" },
      { en: "in the evening",      vn: "vào buổi tối" },
      { en: "on weekdays",         vn: "vào các ngày trong tuần" },
      { en: "Are you free on...?", vn: "Bạn có rảnh vào...?" },
    ],
  },

  speaking: {
    level1Prompt: "I am free on {input}.",
    level1Placeholder: "Nhập ngày trong tuần (VD: Monday, Tuesday)...",
    level2Situation:
      "Sếp người Mỹ muốn đặt lịch họp với bạn tuần sau. Hỏi thời gian phù hợp, đề xuất lịch của mình và xác nhận.",
    level2Hint:
      "Are you free on [ngày]? / I am free on [ngày] at [giờ]. / How about [ngày] in the [buổi]?",
  },

  quiz: [
    {
      id: "q7-1",
      question: "Điền giới từ đúng: 'The class starts ___ 8 o'clock.'",
      options: ["on", "in", "at", "by"],
      answer: "at",
      type: "multiple-choice",
    },
    {
      id: "q7-2",
      question: "Điền giới từ đúng: 'I have a meeting ___ Monday.'",
      options: ["at", "in", "by", "on"],
      answer: "on",
      type: "multiple-choice",
    },
    {
      id: "q7-3",
      question: "Điền từ còn thiếu: 'She exercises ___ the evening.'",
      options: [],
      answer: "in",
      type: "cloze",
    },
    {
      id: "q7-4",
      question: "Điền từ còn thiếu: 'Are you free ___ Friday?'",
      options: [],
      answer: "on",
      type: "cloze",
    },
    {
      id: "q7-5",
      question: "Câu nào đúng?",
      options: [
        "I work in Monday morning.",
        "I work on Monday in the morning.",
        "I work at Monday morning.",
        "I work on Monday at the morning.",
      ],
      answer: "I work on Monday in the morning.",
      type: "multiple-choice",
    },
    {
      id: "q7-6",
      question: "Cuộc họp lúc 9 giờ sáng vào thứ Hai. (Dịch sang tiếng Anh)",
      options: [],
      answer: "The meeting is at 9 AM on Monday.",
      type: "translate",
    },
    {
      id: "q7-7",
      question: "Bạn có rảnh vào chiều thứ Sáu không? (Dịch sang tiếng Anh)",
      options: [],
      answer: "Are you free on Friday afternoon?",
      type: "translate",
    },
  ],
};

export default unitA07;
