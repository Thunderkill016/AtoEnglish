import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-8 — Khẩn Cấp & Cụm Từ Sinh Tồn (Emergency & Survival Phrases)
// Level 0 / Foundation — Pre-CEFR A0  [LEVEL COMPLETION UNIT]
// Grammar: Imperative + Please (no subject needed — clearest grammar for A0)
// Goal: Learner can handle the most critical real-life English situations
//   even with minimal vocabulary. Confidence-building milestone.
// ─────────────────────────────────────────────────────────────────────────────

export const unitA08: UnitData = {
  unitId: "unit-a0-8",
  title: "Unit A0-8: Khẩn Cấp & Cụm Từ Sinh Tồn",
  level: "A0",
  xp: 80,
  estimatedTime: 45,
  description:
    "Học những câu tiếng Anh quan trọng nhất trong tình huống khẩn cấp — kiến thức có thể cứu mạng bạn khi ở nước ngoài!",
  badgeName: "Người Sống Sót 🎉",
  badgeEmoji: "🆘",

  situation:
    "Bạn đang ở Bangkok và bị lạc đường, điện thoại sắp hết pin. Một người đi đường nhìn có vẻ thân thiện. Bạn cần hỏi gì? Và nếu bạn bị ốm tại khách sạn, bạn nói gì với lễ tân?",

  learningOutcomes: [
    "Gọi cấp cứu và xin giúp đỡ bằng tiếng Anh",
    "Hỏi đường khi bị lạc một cách lịch sự",
    "Đề nghị người khác nói chậm lại khi không hiểu",
  ],

  culturalNote:
    'Số khẩn cấp quốc tế: <span class="text-emerald-400 font-semibold">911</span> (Mỹ) · <span class="text-emerald-400 font-semibold">999</span> (Anh) · <span class="text-emerald-400 font-semibold">112</span> (EU) · <span class="text-emerald-400 font-semibold">191</span> (Thái Lan). Khi gọi: nói RÕ vị trí của bạn TRƯỚC TIÊN — tên đường, số nhà, thành phố. Nói "I need an ambulance" / "I need the police." Không cần giải thích dài!',

  warmupGreetings: [
    {
      emoji: "🆘",
      en: "Help! I need a doctor!",
      vn: "Giúp tôi với! Tôi cần bác sĩ!",
      context: "Tình huống y tế khẩn cấp",
    },
    {
      emoji: "🗺️",
      en: "Excuse me, where is the hospital?",
      vn: "Xin lỗi, bệnh viện ở đâu?",
      context: "Hỏi đường khi cần giúp đỡ",
    },
    {
      emoji: "🐢",
      en: "Please speak slowly.",
      vn: "Làm ơn nói chậm thôi.",
      context: "Khi không theo kịp tốc độ nói",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "help",
      emoji: "🆘",
      phonetic: "/help/",
      meaning: "Giúp đỡ / Cứu",
      example: "Help! I need a doctor!",
      example2: "Can you help me, please?",
      collocation: "need help / ask for help / help yourself",
      audio: "/audio/unit-a0-8/help.mp3",
    },
    {
      id: 2,
      word: "need",
      emoji: "❗",
      phonetic: "/niːd/",
      meaning: "Cần",
      example: "I need a doctor.",
      example2: "We need water.",
      collocation: "need help / need to / in need of",
      audio: "/audio/unit-a0-8/need.mp3",
    },
    {
      id: 3,
      word: "where",
      emoji: "📍",
      phonetic: "/weər/",
      meaning: "Ở đâu",
      example: "Where is the hospital?",
      example2: "Where is the nearest pharmacy?",
      collocation: "where is / where are / somewhere / anywhere",
      audio: "/audio/unit-a0-8/where.mp3",
    },
    {
      id: 4,
      word: "understand",
      emoji: "🤔",
      phonetic: "/ˌʌndəˈstænd/",
      meaning: "Hiểu",
      example: "I don't understand.",
      example2: "Do you understand?",
      collocation: "understand English / make yourself understood",
      audio: "/audio/unit-a0-8/understand.mp3",
    },
    {
      id: 5,
      word: "please",
      emoji: "🙏",
      phonetic: "/pliːz/",
      meaning: "Làm ơn / Xin",
      example: "Please call a doctor!",
      example2: "Speak slowly, please.",
      collocation: "please + verb / yes please / please help",
      audio: "/audio/unit-a0-8/please.mp3",
    },
    {
      id: 6,
      word: "repeat",
      emoji: "🔁",
      phonetic: "/rɪˈpiːt/",
      meaning: "Lặp lại / Nói lại",
      example: "Can you repeat that, please?",
      example2: "Please repeat the question.",
      collocation: "repeat after me / can you repeat",
      audio: "/audio/unit-a0-8/repeat.mp3",
    },
    {
      id: 7,
      word: "slowly",
      emoji: "🐢",
      phonetic: "/ˈsləʊli/",
      meaning: "Chậm / Từ từ",
      example: "Please speak slowly.",
      example2: "Can you say that more slowly?",
      collocation: "speak slowly / go slowly / slowly but surely",
      audio: "/audio/unit-a0-8/slowly.mp3",
    },
    {
      id: 8,
      word: "lost",
      emoji: "🗺️",
      phonetic: "/lɒst/",
      meaning: "Bị lạc",
      example: "I am lost. Can you help me?",
      example2: "We are lost. Where are we?",
      collocation: "get lost / be lost / lost and found",
      audio: "/audio/unit-a0-8/lost.mp3",
    },
    {
      id: 9,
      word: "doctor",
      emoji: "👨‍⚕️",
      phonetic: "/ˈdɒktər/",
      meaning: "Bác sĩ",
      example: "I need a doctor urgently.",
      example2: "Please call the doctor.",
      collocation: "see a doctor / call a doctor / doctor's appointment",
      audio: "/audio/unit-a0-8/doctor.mp3",
    },
    {
      id: 10,
      word: "police",
      emoji: "👮",
      phonetic: "/pəˈliːs/",
      meaning: "Cảnh sát",
      example: "Please call the police!",
      example2: "The police are coming.",
      collocation: "call the police / police station / police officer",
      audio: "/audio/unit-a0-8/police.mp3",
    },
  ],

  grammar: {
    title: "Câu mệnh lệnh + Please (Imperative)",
    rule: "Động từ nguyên thể (+ Please) = mệnh lệnh lịch sự — KHÔNG cần chủ ngữ!",
    conjugation: [
      { subject: "Cơ bản",          form: "[Verb]!",           example: "Help! / Stop! / Come here!" },
      { subject: "Lịch sự",         form: "Please + [Verb]",   example: "Please call a doctor." },
      { subject: "Lịch sự hơn",     form: "[Verb] + please",   example: "Speak slowly, please." },
      { subject: "Phủ định",        form: "Don't + [Verb]",    example: "Don't worry! / Don't panic!" },
    ],
    examples: [
      { en: "Please call a doctor!",          vn: "Làm ơn gọi bác sĩ!" },
      { en: "Speak slowly, please.",          vn: "Nói chậm thôi, xin vui lòng." },
      { en: "Can you repeat that, please?",   vn: "Bạn có thể nói lại được không?" },
      { en: "Don't worry — I can help you.",  vn: "Đừng lo — tôi có thể giúp bạn." },
    ],
    tip: "Câu mệnh lệnh tiếng Anh rất đơn giản: bắt đầu bằng động từ nguyên thể, không cần chủ ngữ. Thêm 'please' để lịch sự. Ví dụ: 'Call!' → 'Please call!' / 'Sit!' → 'Please sit down.'",

    vnNote:
      "Tiếng Việt cũng có câu mệnh lệnh tương tự: 'Gọi bác sĩ đi!' ↔ 'Call a doctor!'\nĐiểm khác biệt: Tiếng Anh đặt 'please' ngay đầu câu hoặc cuối câu, tiếng Việt hay dùng 'xin' hay 'làm ơn' ở đầu.\n\n✅ 'Please help me!' = 'Xin hãy giúp tôi!'\n✅ 'Call a doctor, please!' = 'Gọi bác sĩ đi, xin vui lòng!'\n\nTrong tình huống khẩn cấp, bạn không cần ngữ pháp phức tạp — câu mệnh lệnh đơn giản là đủ!",

    dialogueExample: {
      speaker: "Minh",
      text: "Excuse me! Please help me. I am lost. Can you speak slowly, please?",
      translation:
        "Xin lỗi! Làm ơn giúp tôi. Tôi bị lạc. Bạn có thể nói chậm thôi không?",
      highlight: "Please / please",
    },

    ccq: {
      question: "Câu mệnh lệnh lịch sự nhất là câu nào?",
      options: [
        "Doctor call!",
        "I want you call doctor.",
        "Please call a doctor. ✓",
        "You please call doctor.",
      ],
      answer: "Please call a doctor. ✓",
    },
  },

  matchingExercise: {
    title: "Nối tình huống khẩn cấp với câu nói phù hợp",
    pairs: [
      { left: "Bị lạc đường",              right: "I am lost. Can you help me?" },
      { left: "Không hiểu người kia nói",  right: "Please speak slowly." },
      { left: "Cần bác sĩ ngay",           right: "Please call a doctor!" },
      { left: "Muốn nghe lại câu vừa nói", right: "Can you repeat that?" },
      { left: "Cần cảnh sát",              right: "Please call the police!" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq8-1",
      question: "Câu nào lịch sự và đúng ngữ pháp nhất?",
      options: [
        "You speak slowly!",
        "Please speak slowly.",
        "Speak you slowly please.",
        "I want slowly speak.",
      ],
      answer: "Please speak slowly.",
      type: "multiple-choice",
    },
    {
      id: "pq8-2",
      question: "Điền từ còn thiếu: 'I ___ a doctor. Please call one!'",
      options: [],
      answer: "need",
      type: "cloze",
    },
    {
      id: "pq8-3",
      question: "'Tôi không hiểu.' — Dịch sang tiếng Anh",
      options: [],
      answer: "I don't understand.",
      type: "translate",
    },
  ],

  practiceTranslate: [
    {
      id: "pt8-1",
      prompt_vn: "Làm ơn gọi bác sĩ!",
      answer: "Please call a doctor!",
    },
    {
      id: "pt8-2",
      prompt_vn: "Tôi bị lạc. Bệnh viện ở đâu?",
      answer: "I am lost. Where is the hospital?",
    },
    {
      id: "pt8-3",
      prompt_vn: "Bạn có thể nói chậm thôi không? Tôi không hiểu.",
      answer: "Can you speak slowly, please? I don't understand.",
    },
  ],

  scrambleExercises: [
    {
      id: "s8-1",
      prompt_vn: "Làm ơn gọi cảnh sát!",
      words: ["Please", "call", "the", "police", "!"],
      answer: "Please call the police !",
    },
    {
      id: "s8-2",
      prompt_vn: "Tôi bị lạc. Bạn có thể giúp tôi không?",
      words: ["I", "am", "lost", ".", "Can", "you", "help", "me", "?"],
      answer: "I am lost . Can you help me ?",
    },
    {
      id: "s8-3",
      prompt_vn: "Nói chậm thôi nhé.",
      words: ["Speak", "slowly", ",", "please", "."],
      answer: "Speak slowly , please .",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Bị lạc đường ở thành phố lạ",
      audio: "/audio/unit-a0-8/dialogue_1.mp3",
      desc: "Minh bị lạc ở Bangkok và hỏi người đi đường.",
      lines: [
        {
          id: "d8-1-1",
          speaker: "Minh",
          text: "Excuse me! Can you help me, please?",
          translation: "Xin lỗi! Bạn có thể giúp tôi được không?",
        },
        {
          id: "d8-1-2",
          speaker: "Stranger",
          text: "Sure! What's wrong?",
          translation: "Tất nhiên! Bạn có vấn đề gì vậy?",
        },
        {
          id: "d8-1-3",
          speaker: "Minh",
          text: "I am lost. Where is the hospital?",
          translation: "Tôi bị lạc. Bệnh viện ở đâu vậy?",
        },
        {
          id: "d8-1-4",
          speaker: "Stranger",
          text: "Go straight for two minutes, then turn left at the traffic light.",
          translation: "Đi thẳng hai phút, rồi rẽ trái tại đèn giao thông.",
        },
        {
          id: "d8-1-5",
          speaker: "Minh",
          text: "Sorry, can you repeat that? Please speak slowly.",
          translation: "Xin lỗi, bạn có thể nói lại không? Nói chậm thôi nhé.",
        },
        {
          id: "d8-1-6",
          speaker: "Stranger",
          text: "Of course. Go STRAIGHT. Then turn LEFT. The hospital is there.",
          translation: "Tất nhiên. Đi THẲNG. Rồi rẽ TRÁI. Bệnh viện ở đó.",
        },
        {
          id: "d8-1-7",
          speaker: "Minh",
          text: "Thank you so much!",
          translation: "Cảm ơn bạn rất nhiều!",
        },
      ],
    },
    {
      id: 2,
      title: "Bị ốm tại khách sạn",
      audio: "/audio/unit-a0-8/dialogue_2.mp3",
      desc: "Linh gọi điện cho lễ tân khách sạn vì bị ốm.",
      lines: [
        {
          id: "d8-2-1",
          speaker: "Linh",
          text: "Hello? I need help. I am sick.",
          translation: "Alô? Tôi cần giúp đỡ. Tôi bị ốm.",
        },
        {
          id: "d8-2-2",
          speaker: "Receptionist",
          text: "I understand. What is your room number?",
          translation: "Tôi hiểu rồi. Số phòng của bạn là bao nhiêu?",
        },
        {
          id: "d8-2-3",
          speaker: "Linh",
          text: "Room 305. Please call a doctor.",
          translation: "Phòng 305. Xin hãy gọi bác sĩ cho tôi.",
        },
        {
          id: "d8-2-4",
          speaker: "Receptionist",
          text: "Of course. The doctor will come in 10 minutes. Don't worry!",
          translation: "Tất nhiên. Bác sĩ sẽ đến trong 10 phút. Đừng lo!",
        },
        {
          id: "d8-2-5",
          speaker: "Linh",
          text: "Thank you. Please hurry!",
          translation: "Cảm ơn. Làm ơn nhanh lên!",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac8-1",
      audio_text: "Please call a doctor",
      options: [
        "Please call a doctor",
        "Please call the police",
        "Please call a friend",
        "Please see a doctor",
      ],
      answer: "Please call a doctor",
    },
    {
      id: "lac8-2",
      audio_text: "I am lost",
      options: [
        "I am tired",
        "I am lost",
        "I am late",
        "I am sick",
      ],
      answer: "I am lost",
    },
    {
      id: "lac8-3",
      audio_text: "Can you repeat that please",
      options: [
        "Can you repeat that please",
        "Can you speak slowly please",
        "Can you help me please",
        "Can you understand me please",
      ],
      answer: "Can you repeat that please",
    },
  ],

  fluencyDrill: {
    title: "Phản xạ sinh tồn — Học thuộc 8 câu này!",
    items: [
      { en: "Help!",                         vn: "Cứu tôi với!" },
      { en: "I need a doctor.",              vn: "Tôi cần bác sĩ." },
      { en: "Please call the police!",       vn: "Làm ơn gọi cảnh sát!" },
      { en: "I am lost.",                    vn: "Tôi bị lạc." },
      { en: "I don't understand.",           vn: "Tôi không hiểu." },
      { en: "Please speak slowly.",          vn: "Làm ơn nói chậm thôi." },
      { en: "Can you repeat that?",          vn: "Bạn có thể nói lại không?" },
      { en: "Where is the hospital?",        vn: "Bệnh viện ở đâu?" },
    ],
  },

  speaking: {
    level1Prompt: "I am lost. Where is the {input}?",
    level1Placeholder: "Nhập nơi bạn cần tìm (VD: hospital, police station)...",
    level2Situation:
      "Bạn đang du lịch một mình ở nước ngoài và gặp tình huống khẩn cấp: bị ốm, bị lạc, hoặc bị mất ví. Xử lý tình huống bằng tiếng Anh.",
    level2Hint:
      "Excuse me! Help! I need... / I am... / Please call... / Where is...? / Can you repeat that? Please speak slowly.",
  },

  quiz: [
    {
      id: "q8-1",
      question: "Câu mệnh lệnh lịch sự nhất trong tình huống khẩn cấp?",
      options: [
        "You must call doctor.",
        "Please call a doctor!",
        "I want doctor call.",
        "Doctor please you call.",
      ],
      answer: "Please call a doctor!",
      type: "multiple-choice",
    },
    {
      id: "q8-2",
      question: "Điền từ còn thiếu: 'I ___ understand. Can you speak slowly?'",
      options: ["am not", "not", "don't", "doesn't"],
      answer: "don't",
      type: "multiple-choice",
    },
    {
      id: "q8-3",
      question: "Điền từ còn thiếu: 'I am ___. Where is the hospital?'",
      options: [],
      answer: "lost",
      type: "cloze",
    },
    {
      id: "q8-4",
      question: "Điền từ còn thiếu: 'Can you ___ that, please? I don't understand.'",
      options: [],
      answer: "repeat",
      type: "cloze",
    },
    {
      id: "q8-5",
      question: "Cách lịch sự nhất để nhờ ai đó nói chậm lại?",
      options: [
        "Talk slow!",
        "You slow!",
        "Please speak slowly.",
        "More slow please you.",
      ],
      answer: "Please speak slowly.",
      type: "multiple-choice",
    },
    {
      id: "q8-6",
      question: "Làm ơn gọi cảnh sát! (Dịch sang tiếng Anh)",
      options: [],
      answer: "Please call the police!",
      type: "translate",
    },
    {
      id: "q8-7",
      question: "Tôi bị lạc. Bạn có thể giúp tôi không? (Dịch sang tiếng Anh)",
      options: [],
      answer: "I am lost. Can you help me?",
      type: "translate",
    },
  ],
};

export default unitA08;
