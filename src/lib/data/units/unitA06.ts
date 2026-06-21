import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-6 — Gia Đình & Những Người Thân (Family & People)
// Level 0 / Foundation — Pre-CEFR A0
// Grammar: He / She / They + BE — gender pronouns (absent in Vietnamese)
// L1 Alert: Vietnamese "anh ấy/cô ấy" is context-dependent; English He/She
//   is mandatory gender marking — systematic confusion for VN learners
// ─────────────────────────────────────────────────────────────────────────────

export const unitA06: UnitData = {
  unitId: "unit-a0-6",
  title: "Unit A0-6: Gia Đình & Những Người Thân",
  level: "A0",
  xp: 60,
  estimatedTime: 40,
  description:
    "Học từ vựng về gia đình và cách mô tả người thân — nội dung giao tiếp hàng ngày không thể thiếu khi gặp gỡ người nước ngoài.",
  badgeName: "Người Yêu Gia Đình",
  badgeEmoji: "👨‍👩‍👧",

  situation:
    "Đồng nghiệp người Mỹ hỏi: \"Do you have brothers or sisters?\" và \"What does your mother do?\" — bạn mô tả gia đình mình thế nào bằng tiếng Anh?",

  learningOutcomes: [
    "Nói tên các thành viên gia đình bằng tiếng Anh chính xác",
    "Dùng He/She/They đúng theo giới tính",
    "Mô tả gia đình trong 3–4 câu đơn giản",
  ],

  culturalNote:
    'Tiếng Anh phân biệt giới tính qua đại từ: <span class="text-emerald-400 font-semibold">HE</span> = anh/chú/ông/bố (nam); <span class="text-emerald-400 font-semibold">SHE</span> = chị/cô/bà/mẹ (nữ). Tiếng Việt dùng "họ" hay tên riêng. Đây là điểm hay nhầm lẫn! Thú vị: người Mỹ thường gọi bố mẹ bằng tên riêng (Dad/Mom) thay vì dùng họ và tên trang trọng như ở Việt Nam.',

  warmupGreetings: [
    {
      emoji: "👨‍👩‍👧",
      en: "I have a big family.",
      vn: "Tôi có một gia đình đông người.",
      context: "Mô tả quy mô gia đình",
    },
    {
      emoji: "👩",
      en: "She is my mother.",
      vn: "Cô ấy là mẹ tôi.",
      context: "Giới thiệu thành viên nữ",
    },
    {
      emoji: "👦",
      en: "He is my younger brother.",
      vn: "Anh ấy là em trai tôi.",
      context: "Giới thiệu thành viên nam",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "mother",
      emoji: "👩",
      phonetic: "/ˈmʌðər/",
      meaning: "Mẹ",
      example: "My mother is a teacher.",
      example2: "She is my mother.",
      collocation: "mother tongue / mother country",
      audio: "/audio/unit-a0-6/mother.mp3",
    },
    {
      id: 2,
      word: "father",
      emoji: "👨",
      phonetic: "/ˈfɑːðər/",
      meaning: "Bố / Cha",
      example: "My father is an engineer.",
      example2: "He is my father.",
      collocation: "father figure / father-in-law",
      audio: "/audio/unit-a0-6/father.mp3",
    },
    {
      id: 3,
      word: "brother",
      emoji: "👦",
      phonetic: "/ˈbrʌðər/",
      meaning: "Anh / Em trai",
      example: "I have one brother.",
      example2: "My brother is 20 years old.",
      collocation: "older brother / younger brother",
      audio: "/audio/unit-a0-6/brother.mp3",
    },
    {
      id: 4,
      word: "sister",
      emoji: "👧",
      phonetic: "/ˈsɪstər/",
      meaning: "Chị / Em gái",
      example: "My sister lives in Hanoi.",
      example2: "She is my older sister.",
      collocation: "older sister / younger sister",
      audio: "/audio/unit-a0-6/sister.mp3",
    },
    {
      id: 5,
      word: "husband",
      emoji: "🤵",
      phonetic: "/ˈhʌzbənd/",
      meaning: "Chồng",
      example: "My husband is a doctor.",
      example2: "Her husband works in Hanoi.",
      collocation: "ex-husband / husband and wife",
      audio: "/audio/unit-a0-6/husband.mp3",
    },
    {
      id: 6,
      word: "wife",
      emoji: "👰",
      phonetic: "/waɪf/",
      meaning: "Vợ",
      example: "His wife is very kind.",
      example2: "My wife is a nurse.",
      collocation: "ex-wife / wife and husband",
      audio: "/audio/unit-a0-6/wife.mp3",
    },
    {
      id: 7,
      word: "son",
      emoji: "👦",
      phonetic: "/sʌn/",
      meaning: "Con trai",
      example: "They have one son.",
      example2: "Their son is five years old.",
      collocation: "only son / son-in-law",
      audio: "/audio/unit-a0-6/son.mp3",
    },
    {
      id: 8,
      word: "daughter",
      emoji: "👧",
      phonetic: "/ˈdɔːtər/",
      meaning: "Con gái",
      example: "She has two daughters.",
      example2: "Their daughter studies in the US.",
      collocation: "only daughter / daughter-in-law",
      audio: "/audio/unit-a0-6/daughter.mp3",
    },
    {
      id: 9,
      word: "friend",
      emoji: "🤝",
      phonetic: "/frend/",
      meaning: "Bạn bè / Bạn thân",
      example: "He is my best friend.",
      example2: "I have many friends at work.",
      collocation: "best friend / old friend / make friends",
      audio: "/audio/unit-a0-6/friend.mp3",
    },
    {
      id: 10,
      word: "colleague",
      emoji: "👔",
      phonetic: "/ˈkɒliːɡ/",
      meaning: "Đồng nghiệp",
      example: "She is my colleague.",
      example2: "My colleagues are very helpful.",
      collocation: "work colleague / former colleague",
      audio: "/audio/unit-a0-6/colleague.mp3",
    },
  ],

  grammar: {
    title: "HE / SHE / THEY + BE — Đại từ ngôi 3 có giới tính",
    rule: "HE IS (nam giới) | SHE IS (nữ giới) | THEY ARE (nhiều người)",
    conjugation: [
      { subject: "He",   form: "is",  example: "He is my father." },
      { subject: "She",  form: "is",  example: "She is my mother." },
      { subject: "They", form: "are", example: "They are my parents." },
    ],
    examples: [
      { en: "He is my older brother.",    vn: "Anh ấy là anh trai tôi." },
      { en: "She is a doctor.",           vn: "Cô ấy là bác sĩ." },
      { en: "They are my colleagues.",    vn: "Họ là đồng nghiệp của tôi." },
      { en: "Is she your sister?",        vn: "Cô ấy có phải là chị/em gái bạn không?" },
    ],
    tip: "Mẹo: HE = đàn ông (father, brother, son, husband). SHE = phụ nữ (mother, sister, daughter, wife). THEY = nhiều người (dù nam hay nữ). Không có dạng trung lập như 'họ' trong tiếng Việt!",

    vnNote:
      "⚠️ LỖI PHỔ BIẾN của người Việt: Nhầm HE và SHE!\n\nTiếng Việt dùng 'anh ấy' / 'cô ấy' tùy ngữ cảnh — không bắt buộc trong câu.\nTiếng Anh BẮT BUỘC dùng HE cho nam, SHE cho nữ — LUÔN LUÔN.\n\n❌ SAI: 'He is my mother.' / 'She is my brother.'\n✅ ĐÚNG: 'She is my mother.' / 'He is my brother.'\n\nCách nhớ: Nhìn ảnh → con trai/đàn ông → HE, con gái/phụ nữ → SHE",

    dialogueExample: {
      speaker: "Minh",
      text: "She is my mother. He is my father. They are both teachers.",
      translation: "Cô ấy là mẹ tôi. Anh ấy là bố tôi. Cả hai đều là giáo viên.",
      highlight: "She / He / They",
    },

    ccq: {
      question: "Chọn đại từ đúng cho: 'Cô ấy là chị gái tôi' (your sister = nữ)",
      options: [
        "He is my sister.",
        "They is my sister.",
        "She is my sister. ✓",
        "It is my sister.",
      ],
      answer: "She is my sister. ✓",
    },
  },

  matchingExercise: {
    title: "Nối thành viên gia đình với đại từ đúng",
    pairs: [
      { left: "mother",   right: "She" },
      { left: "father",   right: "He" },
      { left: "parents",  right: "They" },
      { left: "sister",   right: "She" },
      { left: "brothers", right: "They" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq6-1",
      question: "Điền từ còn thiếu: '___ is my mother. She is a doctor.'",
      options: ["He", "She", "They", "It"],
      answer: "She",
      type: "multiple-choice",
    },
    {
      id: "pq6-2",
      question: "Điền từ còn thiếu: '___ are my parents. They live in Hanoi.'",
      options: [],
      answer: "They",
      type: "cloze",
    },
    {
      id: "pq6-3",
      question: "'Anh ấy là anh trai tôi.' — Dịch sang tiếng Anh",
      options: [],
      answer: "He is my brother.",
      type: "translate",
    },
  ],

  practiceTranslate: [
    {
      id: "pt6-1",
      prompt_vn: "Anh ấy là bố tôi.",
      answer: "He is my father.",
    },
    {
      id: "pt6-2",
      prompt_vn: "Cô ấy là chị gái tôi và cô ấy là giáo viên.",
      answer: "She is my sister and she is a teacher.",
    },
    {
      id: "pt6-3",
      prompt_vn: "Họ là bạn bè của tôi. Họ sống ở Hà Nội.",
      answer: "They are my friends. They live in Hanoi.",
    },
  ],

  scrambleExercises: [
    {
      id: "s6-1",
      prompt_vn: "Anh ấy là anh trai tôi.",
      words: ["He", "is", "my", "brother", "."],
      answer: "He is my brother .",
    },
    {
      id: "s6-2",
      prompt_vn: "Cô ấy là bác sĩ.",
      words: ["She", "is", "a", "doctor", "."],
      answer: "She is a doctor .",
    },
    {
      id: "s6-3",
      prompt_vn: "Họ là bố mẹ tôi.",
      words: ["They", "are", "my", "parents", "."],
      answer: "They are my parents .",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Kể về gia đình",
      audio: "/audio/unit-a0-6/dialogue_1.mp3",
      desc: "Sarah hỏi Minh về gia đình trong bữa ăn trưa ở công ty.",
      lines: [
        {
          id: "d6-1-1",
          speaker: "Sarah",
          text: "Minh, do you have brothers or sisters?",
          translation: "Minh, bạn có anh chị em không?",
        },
        {
          id: "d6-1-2",
          speaker: "Minh",
          text: "Yes! I have one brother and one sister.",
          translation: "Có! Tôi có một anh trai và một em gái.",
        },
        {
          id: "d6-1-3",
          speaker: "Sarah",
          text: "How old is your brother?",
          translation: "Anh trai bạn bao nhiêu tuổi?",
        },
        {
          id: "d6-1-4",
          speaker: "Minh",
          text: "He is 28. He is an engineer in Hanoi.",
          translation: "Anh ấy 28 tuổi. Anh ấy là kỹ sư ở Hà Nội.",
        },
        {
          id: "d6-1-5",
          speaker: "Sarah",
          text: "And your sister?",
          translation: "Còn em gái bạn thì sao?",
        },
        {
          id: "d6-1-6",
          speaker: "Minh",
          text: "She is 19. She is a student at university.",
          translation: "Cô ấy 19 tuổi. Cô ấy là sinh viên đại học.",
        },
      ],
    },
    {
      id: 2,
      title: "Ảnh gia đình",
      audio: "/audio/unit-a0-6/dialogue_2.mp3",
      desc: "Linh cho đồng nghiệp xem ảnh gia đình trên điện thoại.",
      lines: [
        {
          id: "d6-2-1",
          speaker: "Tom",
          text: "Is this your family photo?",
          translation: "Đây là ảnh gia đình bạn à?",
        },
        {
          id: "d6-2-2",
          speaker: "Linh",
          text: "Yes! This is my mother. She is a nurse.",
          translation: "Đúng vậy! Đây là mẹ tôi. Bà ấy là y tá.",
        },
        {
          id: "d6-2-3",
          speaker: "Tom",
          text: "And who is this man?",
          translation: "Còn người đàn ông này là ai?",
        },
        {
          id: "d6-2-4",
          speaker: "Linh",
          text: "He is my father. He is a teacher.",
          translation: "Anh ấy là bố tôi. Ông ấy là giáo viên.",
        },
        {
          id: "d6-2-5",
          speaker: "Tom",
          text: "Your family is lovely!",
          translation: "Gia đình bạn thật dễ thương!",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac6-1",
      audio_text: "She is my mother",
      options: ["He is my mother", "She is my mother", "They are my mother", "She is my sister"],
      answer: "She is my mother",
    },
    {
      id: "lac6-2",
      audio_text: "He is my brother",
      options: ["She is my brother", "He is my sister", "He is my brother", "They are my brother"],
      answer: "He is my brother",
    },
    {
      id: "lac6-3",
      audio_text: "They are my parents",
      options: ["He is my parents", "She is my parents", "They is my parents", "They are my parents"],
      answer: "They are my parents",
    },
  ],

  fluencyDrill: {
    title: "Phản xạ gia đình",
    items: [
      { en: "She is my mother.",      vn: "Cô ấy là mẹ tôi." },
      { en: "He is my father.",       vn: "Anh ấy là bố tôi." },
      { en: "They are my parents.",   vn: "Họ là bố mẹ tôi." },
      { en: "He is my brother.",      vn: "Anh ấy là anh/em trai tôi." },
      { en: "She is my sister.",      vn: "Cô ấy là chị/em gái tôi." },
      { en: "He is my husband.",      vn: "Anh ấy là chồng tôi." },
      { en: "She is my wife.",        vn: "Cô ấy là vợ tôi." },
      { en: "They are my friends.",   vn: "Họ là bạn bè của tôi." },
    ],
  },

  speaking: {
    level1Prompt: "She is my {input}.",
    level1Placeholder: "Nhập thành viên gia đình (VD: mother, sister)...",
    level2Situation:
      "Bạn đang cho đồng nghiệp người Mỹ xem ảnh gia đình trên điện thoại. Giới thiệu ít nhất 3 thành viên, dùng đúng He/She/They.",
    level2Hint:
      "This is my [thành viên]. He/She is [tuổi] years old. He/She is a [nghề nghiệp]. They are my [thành viên số nhiều].",
  },

  quiz: [
    {
      id: "q6-1",
      question: "Cô ấy là y tá. Câu nào đúng?",
      options: ["He is a nurse.", "She is a nurse.", "They is a nurse.", "It is a nurse."],
      answer: "She is a nurse.",
      type: "multiple-choice",
    },
    {
      id: "q6-2",
      question: "Điền từ còn thiếu: '___ is my father. He is an engineer.'",
      options: ["She", "They", "He", "It"],
      answer: "He",
      type: "multiple-choice",
    },
    {
      id: "q6-3",
      question: "Điền từ còn thiếu: '___ are my parents. They live in Da Nang.'",
      options: [],
      answer: "They",
      type: "cloze",
    },
    {
      id: "q6-4",
      question: "Điền từ còn thiếu: 'My sister ___ a student.'",
      options: [],
      answer: "is",
      type: "cloze",
    },
    {
      id: "q6-5",
      question: "Câu nào đúng ngữ pháp?",
      options: [
        "He is my mother.",
        "She is my brother.",
        "They is my parents.",
        "She is my daughter.",
      ],
      answer: "She is my daughter.",
      type: "multiple-choice",
    },
    {
      id: "q6-6",
      question: "Anh ấy là bố tôi và anh ấy là kỹ sư. (Dịch sang tiếng Anh)",
      options: [],
      answer: "He is my father and he is an engineer.",
      type: "translate",
    },
    {
      id: "q6-7",
      question: "Cô ấy là em gái tôi. Cô ấy 19 tuổi. (Dịch sang tiếng Anh)",
      options: [],
      answer: "She is my sister. She is 19 years old.",
      type: "translate",
    },
  ],
};

export default unitA06;
