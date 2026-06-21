import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-5 — Thông Tin Cá Nhân (Personal Information)
// Level 0 / Foundation — Pre-CEFR A0
// Grammar: Full verb BE paradigm (I am / You are / He is / She is…)
// L1 Alert: Vietnamese learners omit verb BE — "I 25 years old" is the #1 error
// Vietnamese research: be-deletion is the most frequent grammatical error for VN
//   beginners (Nguyen et al., dlu.edu.vn multiple studies)
// ─────────────────────────────────────────────────────────────────────────────

export const unitA05: UnitData = {
  unitId: "unit-a0-5",
  title: "Unit A0-5: Thông Tin Cá Nhân",
  level: "A0",
  xp: 60,
  estimatedTime: 45,
  description:
    "Học cách giới thiệu bản thân đầy đủ: tên, tuổi, quốc tịch và nơi sống — những thông tin cơ bản nhất trong mọi cuộc giao tiếp.",
  badgeName: "Người Giới Thiệu",
  badgeEmoji: "👤",

  situation:
    "Bạn vừa đến sân bay nước ngoài. Nhân viên hải quan hỏi: \"Where are you from?\" và \"How old are you?\" — bạn trả lời thế nào? Và làm sao tự giới thiệu với người ngồi cạnh trên máy bay?",

  learningOutcomes: [
    "Giới thiệu tên, tuổi và quốc tịch bằng tiếng Anh tự nhiên",
    "Chia động từ BE đúng cho mọi chủ ngữ (I am / You are / He is…)",
    "Hỏi và trả lời câu hỏi thông tin cá nhân cơ bản",
  ],

  culturalNote:
    'Người Mỹ thường <span class="text-emerald-400 font-semibold">không hỏi tuổi</span> ngay lần đầu gặp — đây là câu hỏi hơi riêng tư. Nhưng khi được hỏi, hãy trả lời thẳng: <span class="text-emerald-400 font-semibold">"I\'m 25"</span> thay vì né tránh. Khác với Việt Nam, người Mỹ không phân biệt thứ bậc theo tuổi — mọi người đều gọi nhau bằng tên!',

  warmupGreetings: [
    {
      emoji: "✈️",
      en: "I'm from Vietnam.",
      vn: "Tôi đến từ Việt Nam.",
      context: "Trả lời nhân viên hải quan",
    },
    {
      emoji: "🎂",
      en: "I'm 25 years old.",
      vn: "Tôi 25 tuổi.",
      context: "Trả lời câu hỏi về tuổi",
    },
    {
      emoji: "🏙️",
      en: "I live in Hanoi.",
      vn: "Tôi sống ở Hà Nội.",
      context: "Nói về nơi sống",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "name",
      emoji: "🏷️",
      phonetic: "/neɪm/",
      meaning: "Tên",
      example: "My name is Minh.",
      example2: "What's your name?",
      collocation: "first name / last name / full name",
      audio: "/audio/unit-a0-5/name.mp3",
    },
    {
      id: 2,
      word: "age",
      emoji: "🎂",
      phonetic: "/eɪdʒ/",
      meaning: "Tuổi",
      example: "My age is 25.",
      example2: "What is your age?",
      collocation: "age group / underage / middle-aged",
      audio: "/audio/unit-a0-5/age.mp3",
    },
    {
      id: 3,
      word: "country",
      emoji: "🌍",
      phonetic: "/ˈkʌntri/",
      meaning: "Quốc gia / Đất nước",
      example: "My country is Vietnam.",
      example2: "Which country are you from?",
      collocation: "home country / foreign country",
      audio: "/audio/unit-a0-5/country.mp3",
    },
    {
      id: 4,
      word: "city",
      emoji: "🏙️",
      phonetic: "/ˈsɪti/",
      meaning: "Thành phố",
      example: "I live in a big city.",
      example2: "Hanoi is a beautiful city.",
      collocation: "city centre / city centre / capital city",
      audio: "/audio/unit-a0-5/city.mp3",
    },
    {
      id: 5,
      word: "from",
      emoji: "📍",
      phonetic: "/frɒm/",
      meaning: "Từ / Đến từ",
      example: "I am from Vietnam.",
      example2: "She is from Japan.",
      collocation: "come from / be from",
      audio: "/audio/unit-a0-5/from.mp3",
    },
    {
      id: 6,
      word: "live",
      emoji: "🏠",
      phonetic: "/lɪv/",
      meaning: "Sống / Sinh sống",
      example: "I live in Hanoi.",
      example2: "Where do you live?",
      collocation: "live in / live with / live alone",
      audio: "/audio/unit-a0-5/live.mp3",
    },
    {
      id: 7,
      word: "year",
      emoji: "📅",
      phonetic: "/jɪər/",
      meaning: "Năm / Tuổi (years old)",
      example: "I am 25 years old.",
      example2: "This year is 2026.",
      collocation: "years old / this year / last year",
      audio: "/audio/unit-a0-5/year.mp3",
    },
    {
      id: 8,
      word: "old",
      emoji: "🕰️",
      phonetic: "/əʊld/",
      meaning: "Tuổi (… years old) / Già",
      example: "How old are you?",
      example2: "She is 30 years old.",
      collocation: "years old / how old / old friend",
      audio: "/audio/unit-a0-5/old.mp3",
    },
    {
      id: 9,
      word: "phone",
      emoji: "📱",
      phonetic: "/fəʊn/",
      meaning: "Điện thoại",
      example: "My phone number is 090...",
      example2: "Can I have your phone number?",
      collocation: "phone number / mobile phone / phone call",
      audio: "/audio/unit-a0-5/phone.mp3",
    },
    {
      id: 10,
      word: "email",
      emoji: "📧",
      phonetic: "/ˈiːmeɪl/",
      meaning: "Email / Thư điện tử",
      example: "My email is minh@gmail.com.",
      example2: "Please send me an email.",
      collocation: "email address / send an email / email account",
      audio: "/audio/unit-a0-5/email.mp3",
    },
  ],

  grammar: {
    title: "Động từ BE — Toàn bộ ngôi (I am / You are / He is…)",
    rule: "I AM  |  You/We/They ARE  |  He/She/It IS",
    conjugation: [
      { subject: "I",          form: "am",  example: "I am from Vietnam." },
      { subject: "You",        form: "are", example: "You are 25 years old." },
      { subject: "He / She",   form: "is",  example: "She is a student." },
      { subject: "We / They",  form: "are", example: "They are from Japan." },
      { subject: "It",         form: "is",  example: "It is a big city." },
    ],
    examples: [
      { en: "I am 25 years old.",     vn: "Tôi 25 tuổi." },
      { en: "She is from Vietnam.",   vn: "Cô ấy đến từ Việt Nam." },
      { en: "They are students.",     vn: "Họ là sinh viên." },
      { en: "My name is Linh.",       vn: "Tên tôi là Linh." },
    ],
    tip: "Mẹo nhớ: I → AM (chỉ dùng với I), He/She/It → IS (số ít, ngôi 3), còn lại → ARE. Hay dùng dạng rút gọn: I'm, You're, He's, She's, We're, They're.",

    vnNote:
      "⚠️ LỖI #1 CỦA NGƯỜI VIỆT: Bỏ qua động từ BE!\n\nTiếng Việt nói: \"Tôi 25 tuổi\" (không cần động từ).\nTiếng Anh BẮT BUỘC: \"I AM 25 years old.\"\n\n❌ SAI: \"I 25 years old.\" / \"She teacher.\" / \"He from Vietnam.\"\n✅ ĐÚNG: \"I AM 25.\" / \"She IS a teacher.\" / \"He IS from Vietnam.\"\n\nBE là động từ không thể thiếu — hãy luyện đến khi thành phản xạ!",

    dialogueExample: {
      speaker: "Linh",
      text: "I am from Vietnam. I am 22 years old.",
      translation: "Tôi đến từ Việt Nam. Tôi 22 tuổi.",
      highlight: "am",
    },

    ccq: {
      question: "Câu nào ĐÚNG ngữ pháp? (Chọn đáp án đúng)",
      options: [
        "She 25 years old.",
        "She are 25 years old.",
        "She is 25 years old. ✓",
        "She am 25 years old.",
      ],
      answer: "She is 25 years old. ✓",
    },
  },

  matchingExercise: {
    title: "Nối chủ ngữ với động từ BE đúng",
    pairs: [
      { left: "I",        right: "am" },
      { left: "She",      right: "is" },
      { left: "They",     right: "are" },
      { left: "He",       right: "is" },
      { left: "We",       right: "are" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq5-1",
      question: "Điền từ còn thiếu: 'I ___ from Vietnam.'",
      options: [],
      answer: "am",
      type: "cloze",
    },
    {
      id: "pq5-2",
      question: "'How old are you?' — Câu này hỏi về điều gì?",
      options: ["Tên của bạn", "Quê quán của bạn", "Tuổi của bạn", "Nghề nghiệp của bạn"],
      answer: "Tuổi của bạn",
      type: "multiple-choice",
    },
    {
      id: "pq5-3",
      question: "Điền từ còn thiếu: 'She ___ a student.'",
      options: [],
      answer: "is",
      type: "cloze",
    },
  ],

  practiceTranslate: [
    {
      id: "pt5-1",
      prompt_vn: "Tôi đến từ Việt Nam.",
      answer: "I am from Vietnam.",
    },
    {
      id: "pt5-2",
      prompt_vn: "Cô ấy 22 tuổi.",
      answer: "She is 22 years old.",
    },
    {
      id: "pt5-3",
      prompt_vn: "Tên tôi là Minh và tôi sống ở Hà Nội.",
      answer: "My name is Minh and I live in Hanoi.",
    },
  ],

  scrambleExercises: [
    {
      id: "s5-1",
      prompt_vn: "Tôi đến từ Việt Nam.",
      words: ["I", "am", "from", "Vietnam", "."],
      answer: "I am from Vietnam .",
    },
    {
      id: "s5-2",
      prompt_vn: "Cô ấy là sinh viên.",
      words: ["She", "is", "a", "student", "."],
      answer: "She is a student .",
    },
    {
      id: "s5-3",
      prompt_vn: "Họ đến từ Nhật Bản.",
      words: ["They", "are", "from", "Japan", "."],
      answer: "They are from Japan .",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Tại sân bay — Kiểm tra hải quan",
      audio: "/audio/unit-a0-5/dialogue_1.mp3",
      desc: "Linh đến cửa kiểm tra hải quan tại sân bay Bangkok.",
      lines: [
        {
          id: "d5-1-1",
          speaker: "Officer",
          text: "Good morning. Passport, please.",
          translation: "Chào buổi sáng. Hộ chiếu của bạn.",
        },
        {
          id: "d5-1-2",
          speaker: "Linh",
          text: "Here you are.",
          translation: "Đây ạ.",
        },
        {
          id: "d5-1-3",
          speaker: "Officer",
          text: "Where are you from?",
          translation: "Bạn đến từ đâu?",
        },
        {
          id: "d5-1-4",
          speaker: "Linh",
          text: "I am from Vietnam.",
          translation: "Tôi đến từ Việt Nam.",
        },
        {
          id: "d5-1-5",
          speaker: "Officer",
          text: "How old are you?",
          translation: "Bạn bao nhiêu tuổi?",
        },
        {
          id: "d5-1-6",
          speaker: "Linh",
          text: "I am 25 years old.",
          translation: "Tôi 25 tuổi.",
        },
        {
          id: "d5-1-7",
          speaker: "Officer",
          text: "What is your phone number?",
          translation: "Số điện thoại của bạn là gì?",
        },
        {
          id: "d5-1-8",
          speaker: "Linh",
          text: "It is zero nine zero, one two three, four five six.",
          translation: "Là 090-123-456.",
        },
      ],
    },
    {
      id: 2,
      title: "Trên máy bay — Gặp người ngồi cạnh",
      audio: "/audio/unit-a0-5/dialogue_2.mp3",
      desc: "Minh gặp Sarah, hành khách người Mỹ ngồi cạnh trên chuyến bay.",
      lines: [
        {
          id: "d5-2-1",
          speaker: "Sarah",
          text: "Hi! My name is Sarah. What's your name?",
          translation: "Xin chào! Tôi tên Sarah. Tên bạn là gì?",
        },
        {
          id: "d5-2-2",
          speaker: "Minh",
          text: "Hi Sarah! I'm Minh. Nice to meet you.",
          translation: "Chào Sarah! Tôi là Minh. Rất vui được gặp bạn.",
        },
        {
          id: "d5-2-3",
          speaker: "Sarah",
          text: "Where are you from, Minh?",
          translation: "Bạn đến từ đâu vậy, Minh?",
        },
        {
          id: "d5-2-4",
          speaker: "Minh",
          text: "I'm from Vietnam. I live in Ho Chi Minh City. And you?",
          translation: "Tôi đến từ Việt Nam. Tôi sống ở TP.HCM. Còn bạn?",
        },
        {
          id: "d5-2-5",
          speaker: "Sarah",
          text: "I'm from the USA — from New York City.",
          translation: "Tôi đến từ Mỹ — từ thành phố New York.",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac5-1",
      audio_text: "I am from Vietnam",
      options: ["I am from Vietnam", "I am from Japan", "I live in Vietnam", "She is from Vietnam"],
      answer: "I am from Vietnam",
    },
    {
      id: "lac5-2",
      audio_text: "She is 25 years old",
      options: ["She are 25", "She am 25", "She is 25 years old", "She is 20 years old"],
      answer: "She is 25 years old",
    },
    {
      id: "lac5-3",
      audio_text: "My name is Linh",
      options: ["My name Linh", "My name is Linh", "I name is Linh", "Name is Linh"],
      answer: "My name is Linh",
    },
  ],

  fluencyDrill: {
    title: "Phản xạ thông tin cá nhân",
    items: [
      { en: "I am from Vietnam.",     vn: "Tôi đến từ Việt Nam." },
      { en: "I am 25 years old.",     vn: "Tôi 25 tuổi." },
      { en: "My name is...",          vn: "Tên tôi là..." },
      { en: "I live in Hanoi.",       vn: "Tôi sống ở Hà Nội." },
      { en: "She is a student.",      vn: "Cô ấy là sinh viên." },
      { en: "They are from Japan.",   vn: "Họ đến từ Nhật Bản." },
      { en: "Where are you from?",    vn: "Bạn đến từ đâu?" },
      { en: "How old are you?",       vn: "Bạn bao nhiêu tuổi?" },
    ],
  },

  speaking: {
    level1Prompt: "I am {input} years old.",
    level1Placeholder: "Nhập tuổi của bạn (VD: 25)...",
    level2Situation:
      "Bạn đang ngồi trên máy bay và gặp hành khách nước ngoài ngồi cạnh. Hãy tự giới thiệu và hỏi thông tin của họ.",
    level2Hint:
      "Hi! My name is [tên]. I am [tuổi] years old. I am from Vietnam. I live in [thành phố]. What about you?",
  },

  quiz: [
    {
      id: "q5-1",
      question: "Câu nào đúng ngữ pháp?",
      options: [
        "She 25 years old.",
        "She are 25 years old.",
        "She is 25 years old.",
        "She am 25 years old.",
      ],
      answer: "She is 25 years old.",
      type: "multiple-choice",
    },
    {
      id: "q5-2",
      question: "'Where are you from?' — Câu trả lời đúng nhất là gì?",
      options: [
        "I am 25 years old.",
        "I am from Vietnam.",
        "I live in Hanoi.",
        "My name is Minh.",
      ],
      answer: "I am from Vietnam.",
      type: "multiple-choice",
    },
    {
      id: "q5-3",
      question: "Điền từ còn thiếu: 'They ___ from Japan.'",
      options: [],
      answer: "are",
      type: "cloze",
    },
    {
      id: "q5-4",
      question: "Điền từ còn thiếu: 'He ___ a student.'",
      options: [],
      answer: "is",
      type: "cloze",
    },
    {
      id: "q5-5",
      question: "Câu nào đúng ngữ pháp?",
      options: [
        "I from Vietnam.",
        "I is from Vietnam.",
        "I am from Vietnam.",
        "I are from Vietnam.",
      ],
      answer: "I am from Vietnam.",
      type: "multiple-choice",
    },
    {
      id: "q5-6",
      question: "Tôi đến từ Việt Nam. (Dịch sang tiếng Anh)",
      options: [],
      answer: "I am from Vietnam.",
      type: "translate",
    },
    {
      id: "q5-7",
      question: "Cô ấy 22 tuổi. (Dịch sang tiếng Anh)",
      options: [],
      answer: "She is 22 years old.",
      type: "translate",
    },
  ],
};

export default unitA05;
