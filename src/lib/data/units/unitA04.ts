import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-4 — Chào Hỏi & Câu Xã Giao (Greetings & Social Phrases)
// Level 0 / Foundation — Pre-CEFR A0
// Grammar: How + BE for questions (rising intonation — different from VN particles)
// Pronunciation spotlight: /θ/ in "thank you" — no equivalent in Vietnamese
// L1 Alert: "How are you?" ≠ câu hỏi thật sự — chỉ cần trả lời ngắn!
// ─────────────────────────────────────────────────────────────────────────────

export const unitA04: UnitData = {
  unitId: "unit-a0-4",
  title: "Unit A0-4: Chào Hỏi & Câu Xã Giao",
  level: "A0",
  xp: 60,
  estimatedTime: 40,
  description:
    "Học cách chào hỏi lịch sự và những câu xã giao thiết yếu — ấn tượng đầu tiên là ấn tượng quan trọng nhất!",
  badgeName: "Người Lịch Sự",
  badgeEmoji: "🤝",

  situation:
    "Buổi sáng đầu tiên đi làm tại công ty có đồng nghiệp nước ngoài. Họ đi qua và nói \"Good morning!\" — bạn phản ứng thế nào? Và làm thế nào để chào từ biệt cho đúng?",

  learningOutcomes: [
    "Chào hỏi đúng cách theo thời gian trong ngày",
    "Hỏi thăm sức khỏe và trả lời tự nhiên",
    "Tạm biệt lịch sự trong các tình huống khác nhau",
  ],

  culturalNote:
    'Người Mỹ hay nói <span class="text-emerald-400 font-semibold">"How are you?"</span> nhưng KHÔNG thực sự muốn nghe câu trả lời dài! Chỉ cần nói <span class="text-emerald-400 font-semibold">"Fine, thanks!"</span> hay <span class="text-emerald-400 font-semibold">"Good, thanks!"</span> là đủ lịch sự. Không nên kể chuyện khổ tâm! Đây là câu chào xã giao, không phải câu hỏi thật sự về sức khỏe.',

  warmupGreetings: [
    {
      emoji: "🌅",
      en: "Good morning! How are you?",
      vn: "Chào buổi sáng! Bạn có khỏe không?",
      context: "Chào đồng nghiệp buổi sáng",
    },
    {
      emoji: "👋",
      en: "Fine, thanks! And you?",
      vn: "Khỏe, cảm ơn! Còn bạn?",
      context: "Trả lời 'How are you?' tự nhiên",
    },
    {
      emoji: "🙏",
      en: "Thank you so much!",
      vn: "Cảm ơn bạn rất nhiều!",
      context: "Cảm ơn với từ /θ/ đặc biệt",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "Hello",
      emoji: "👋",
      phonetic: "/həˈləʊ/",
      meaning: "Xin chào (trang trọng/thân thiện)",
      example: "Hello! My name is Minh.",
      example2: "Hello, everyone! Welcome to our meeting.",
      collocation: "say hello / hello there / hello again",
      audio: "/audio/unit-a0-4/hello.mp3",
    },
    {
      id: 2,
      word: "Hi",
      emoji: "😊",
      phonetic: "/haɪ/",
      meaning: "Chào (thân mật, không trang trọng)",
      example: "Hi! How are you doing?",
      example2: "Hi there! Long time no see!",
      collocation: "say hi / hi there / hi guys",
      audio: "/audio/unit-a0-4/hi.mp3",
    },
    {
      id: 3,
      word: "Good morning",
      emoji: "🌅",
      phonetic: "/ɡʊd ˈmɔːrnɪŋ/",
      meaning: "Chào buổi sáng (trước 12 giờ trưa)",
      example: "Good morning, everyone! Ready for the meeting?",
      example2: "Good morning, sir. How can I help you?",
      collocation: "good morning meeting / wish someone good morning",
      audio: "/audio/unit-a0-4/good_morning.mp3",
    },
    {
      id: 4,
      word: "Good afternoon",
      emoji: "☀️",
      phonetic: "/ɡʊd ˌɑːftərˈnuːn/",
      meaning: "Chào buổi chiều (12–6 giờ chiều)",
      example: "Good afternoon! Is Mr. Smith available?",
      example2: "Good afternoon, class. Let's start our lesson.",
      collocation: "good afternoon everyone / good afternoon sir",
      audio: "/audio/unit-a0-4/good_afternoon.mp3",
    },
    {
      id: 5,
      word: "Good evening",
      emoji: "🌆",
      phonetic: "/ɡʊd ˈiːvnɪŋ/",
      meaning: "Chào buổi tối (sau 6 giờ chiều)",
      example: "Good evening! Welcome to our restaurant.",
      example2: "Good evening, ladies and gentlemen.",
      collocation: "good evening everyone / good evening sir",
      audio: "/audio/unit-a0-4/good_evening.mp3",
    },
    {
      id: 6,
      word: "Goodbye",
      emoji: "👋",
      phonetic: "/ˌɡʊdˈbaɪ/",
      meaning: "Tạm biệt (trang trọng)",
      example: "Goodbye! See you tomorrow.",
      example2: "It was nice meeting you. Goodbye!",
      collocation: "say goodbye / goodbye for now",
      audio: "/audio/unit-a0-4/goodbye.mp3",
    },
    {
      id: 7,
      word: "Bye",
      emoji: "✌️",
      phonetic: "/baɪ/",
      meaning: "Tạm biệt (thân mật)",
      example: "Bye! Have a great day!",
      example2: "Bye everyone! See you next week.",
      collocation: "bye bye / say bye / bye for now",
      audio: "/audio/unit-a0-4/bye.mp3",
    },
    {
      id: 8,
      word: "Thank you",
      emoji: "🙏",
      phonetic: "/θæŋk juː/",
      meaning: "Cảm ơn",
      example: "Thank you for your help!",
      example2: "Thank you so much! That's very kind.",
      collocation: "thank you very much / many thanks / thank you for",
      audio: "/audio/unit-a0-4/thank_you.mp3",
    },
    {
      id: 9,
      word: "You're welcome",
      emoji: "😊",
      phonetic: "/jɔːr ˈwelkəm/",
      meaning: "Không có gì / Không sao",
      example: "\"Thank you!\" \"You're welcome!\"",
      example2: "\"Thanks for the gift!\" \"You're so welcome!\"",
      collocation: "you're very welcome / most welcome",
      audio: "/audio/unit-a0-4/youre_welcome.mp3",
    },
    {
      id: 10,
      word: "Sorry",
      emoji: "😔",
      phonetic: "/ˈsɒri/",
      meaning: "Xin lỗi",
      example: "Sorry I'm late!",
      example2: "Sorry, I don't understand.",
      collocation: "I'm sorry / so sorry / say sorry",
      audio: "/audio/unit-a0-4/sorry.mp3",
    },
  ],

  grammar: {
    title: "Câu hỏi với How + BE (Hỏi thăm sức khỏe)",
    rule: "How are you? / How is he/she? — Ngữ điệu LÊN cuối câu hỏi (khác tiếng Việt!)",
    conjugation: [
      { subject: "How are",  form: "you?",         example: "How are you? → I'm fine, thanks!" },
      { subject: "How is",   form: "he/she?",       example: "How is your mother? → She's great!" },
      { subject: "How are",  form: "things?",       example: "How are things? → Good, thanks!" },
    ],
    examples: [
      { en: "Good morning! How are you?",     vn: "Chào buổi sáng! Bạn có khỏe không?" },
      { en: "I'm fine, thank you. And you?",  vn: "Tôi khỏe, cảm ơn. Còn bạn?" },
      { en: "Not bad! And yourself?",         vn: "Cũng được! Còn bạn thì sao?" },
      { en: "Pretty good, thanks!",           vn: "Khá tốt, cảm ơn!" },
    ],
    tip: "Phát âm /θ/ trong 'thank': đặt đầu lưỡi giữa 2 hàng răng trên-dưới, thổi hơi ra. Tiếng Việt không có âm này nên người Việt hay nói /t/ thay thế. Luyện tập: \"thank → /θæŋk/\" — không phải /tæŋk/!",

    vnNote:
      "📌 VĂN HÓA QUAN TRỌNG: 'How are you?' KHÔNG phải câu hỏi thật!\n\nNgười Mỹ nói 'How are you?' như câu chào, không hỏi thật sự về sức khỏe.\n\n❌ TRÁNH: Kể dài về việc bạn đang bệnh hay mệt mỏi.\n✅ ĐÚNG: Chỉ cần nói 'Fine, thanks!' / 'Good, thanks!' / 'Pretty good!'\n\nVà luôn hỏi lại 'And you?' để thể hiện lịch sự!\n\n⚠️ Phát âm: 'Thank you' = /θæŋk juː/ — lưỡi phải chạm vào răng để tạo âm /θ/!",

    dialogueExample: {
      speaker: "Colleague",
      text: "Good morning, Minh! How are you?",
      translation: "Chào buổi sáng, Minh! Bạn có khỏe không?",
      highlight: "How are you",
    },

    ccq: {
      question: "Khi đồng nghiệp hỏi 'How are you?' — câu trả lời tự nhiên nhất là gì?",
      options: [
        "I am very sick and tired today.",
        "Fine, thanks! And you? ✓",
        "I am 25 years old.",
        "My name is Minh.",
      ],
      answer: "Fine, thanks! And you? ✓",
    },
  },

  matchingExercise: {
    title: "Nối lời chào với thời điểm phù hợp",
    pairs: [
      { left: "Good morning",   right: "7:00 AM — đi làm" },
      { left: "Good afternoon", right: "2:00 PM — sau bữa trưa" },
      { left: "Good evening",   right: "7:00 PM — đến nhà hàng" },
      { left: "Goodbye",        right: "Kết thúc cuộc họp trang trọng" },
      { left: "Bye",            right: "Tan làm, về nhà gặp bạn bè" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq4-1",
      question: "Bạn gặp sếp lúc 9 giờ sáng — dùng câu chào nào?",
      options: ["Good evening!", "Good afternoon!", "Good morning!", "Good night!"],
      answer: "Good morning!",
      type: "multiple-choice",
    },
    {
      id: "pq4-2",
      question: "Điền từ còn thiếu: 'How ___ you?' (hỏi thăm sức khỏe)",
      options: [],
      answer: "are",
      type: "cloze",
    },
    {
      id: "pq4-3",
      question: "Khi ai đó cảm ơn bạn, bạn nói gì?",
      options: ["Thank you!", "Sorry!", "You're welcome!", "Goodbye!"],
      answer: "You're welcome!",
      type: "multiple-choice",
    },
  ],

  practiceTranslate: [
    {
      id: "pt4-1",
      prompt_vn: "Chào buổi sáng! Bạn có khỏe không?",
      answer: "Good morning! How are you?",
    },
    {
      id: "pt4-2",
      prompt_vn: "Tôi khỏe, cảm ơn. Còn bạn thì sao?",
      answer: "I'm fine, thank you. And you?",
    },
    {
      id: "pt4-3",
      prompt_vn: "Xin lỗi tôi đến trễ!",
      answer: "Sorry I'm late!",
    },
  ],

  scrambleExercises: [
    {
      id: "s4-1",
      prompt_vn: "Chào buổi sáng! Bạn có khỏe không?",
      words: ["Good", "morning", "!", "How", "are", "you", "?"],
      answer: "Good morning ! How are you ?",
    },
    {
      id: "s4-2",
      prompt_vn: "Tôi khỏe, cảm ơn.",
      words: ["I'm", "fine", ",", "thank", "you", "."],
      answer: "I'm fine , thank you .",
    },
    {
      id: "s4-3",
      prompt_vn: "Tạm biệt! Hẹn gặp lại ngày mai.",
      words: ["Goodbye", "!", "See", "you", "tomorrow", "."],
      answer: "Goodbye ! See you tomorrow .",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Buổi sáng ở văn phòng — Gặp sếp",
      audio: "/audio/unit-a0-4/dialogue_1.mp3",
      desc: "Minh gặp sếp người Mỹ buổi sáng khi đến công ty.",
      lines: [
        {
          id: "d4-1-1",
          speaker: "Manager (Mr. John)",
          text: "Good morning, Minh! How are you?",
          translation: "Chào buổi sáng, Minh! Bạn có khỏe không?",
        },
        {
          id: "d4-1-2",
          speaker: "Minh",
          text: "Good morning, Mr. John! I'm fine, thank you. And you?",
          translation: "Chào buổi sáng, anh John! Tôi khỏe, cảm ơn anh. Còn anh thì sao?",
        },
        {
          id: "d4-1-3",
          speaker: "Manager",
          text: "Pretty good, thanks! Ready for today's meeting?",
          translation: "Cũng tốt, cảm ơn! Sẵn sàng cho cuộc họp hôm nay chưa?",
        },
        {
          id: "d4-1-4",
          speaker: "Minh",
          text: "Yes, I'm ready! See you at nine.",
          translation: "Vâng, tôi sẵn sàng! Hẹn gặp anh lúc 9 giờ.",
        },
      ],
    },
    {
      id: 2,
      title: "Gặp bạn bè — Không trang trọng",
      audio: "/audio/unit-a0-4/dialogue_2.mp3",
      desc: "Linh gặp người bạn học cũ ở quán cà phê.",
      lines: [
        {
          id: "d4-2-1",
          speaker: "Linh",
          text: "Hi Tom! Long time no see!",
          translation: "Chào Tom! Lâu ngày không gặp!",
        },
        {
          id: "d4-2-2",
          speaker: "Tom",
          text: "Linh! Hi! How are you doing?",
          translation: "Linh! Chào! Bạn sao rồi?",
        },
        {
          id: "d4-2-3",
          speaker: "Linh",
          text: "Great, thanks! How about you?",
          translation: "Tuyệt vời, cảm ơn! Còn bạn thì sao?",
        },
        {
          id: "d4-2-4",
          speaker: "Tom",
          text: "Not bad! I'm really busy these days.",
          translation: "Cũng được! Tôi khá bận dạo này.",
        },
        {
          id: "d4-2-5",
          speaker: "Linh",
          text: "Me too! Anyway, it was great to see you! Bye!",
          translation: "Tôi cũng vậy! Thôi, rất vui được gặp bạn! Tạm biệt!",
        },
        {
          id: "d4-2-6",
          speaker: "Tom",
          text: "You too! Take care. Bye!",
          translation: "Bạn cũng vậy! Giữ gìn sức khỏe. Tạm biệt!",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac4-1",
      audio_text: "Good morning",
      options: ["Good night", "Good morning", "Good afternoon", "Good evening"],
      answer: "Good morning",
    },
    {
      id: "lac4-2",
      audio_text: "Fine thanks and you",
      options: [
        "Fine thanks and you",
        "I am sick thank you",
        "Fine thank and you",
        "Good thanks and you",
      ],
      answer: "Fine thanks and you",
    },
    {
      id: "lac4-3",
      audio_text: "Thank you",
      options: ["tank you", "thank you", "think you", "thank few"],
      answer: "thank you",
    },
  ],

  fluencyDrill: {
    title: "Phản xạ chào hỏi — Học thuộc cho đến khi tự động!",
    items: [
      { en: "Good morning!",          vn: "Chào buổi sáng!" },
      { en: "How are you?",           vn: "Bạn có khỏe không?" },
      { en: "Fine, thanks! And you?", vn: "Khỏe, cảm ơn! Còn bạn?" },
      { en: "Not bad, thanks!",       vn: "Cũng được, cảm ơn!" },
      { en: "Thank you so much!",     vn: "Cảm ơn bạn rất nhiều!" },
      { en: "You're welcome!",        vn: "Không có gì!" },
      { en: "Sorry I'm late!",        vn: "Xin lỗi tôi đến trễ!" },
      { en: "See you tomorrow!",      vn: "Hẹn gặp lại ngày mai!" },
    ],
  },

  speaking: {
    level1Prompt: "Good {input}! How are you?",
    level1Placeholder: "Nhập buổi (morning, afternoon, evening)...",
    level2Situation:
      "Bạn đến văn phòng lần đầu tiên. Chào sếp và 2-3 đồng nghiệp, hỏi thăm sức khỏe họ, rồi tạm biệt khi kết thúc ngày làm.",
    level2Hint:
      "Good morning, [tên]! How are you? / Fine, thanks! And you? / It was nice meeting you. Goodbye! / See you tomorrow!",
  },

  quiz: [
    {
      id: "q4-1",
      question: "Câu chào nào phù hợp lúc 3 giờ chiều?",
      options: ["Good morning!", "Good evening!", "Good afternoon!", "Good night!"],
      answer: "Good afternoon!",
      type: "multiple-choice",
    },
    {
      id: "q4-2",
      question: "Khi ai đó nói 'How are you?' — câu trả lời TỰ NHIÊN nhất là?",
      options: [
        "My name is Minh.",
        "I am from Vietnam.",
        "Fine, thanks! And you?",
        "I am very sick today.",
      ],
      answer: "Fine, thanks! And you?",
      type: "multiple-choice",
    },
    {
      id: "q4-3",
      question: "Điền từ còn thiếu: 'Good ___! How are you?' (buổi sáng)",
      options: [],
      answer: "morning",
      type: "cloze",
    },
    {
      id: "q4-4",
      question: "Điền từ còn thiếu: 'Thank you!' → '___ welcome!'",
      options: [],
      answer: "You're",
      type: "cloze",
    },
    {
      id: "q4-5",
      question: "Cách từ biệt trang trọng nhất?",
      options: ["Bye!", "See ya!", "Goodbye!", "Later!"],
      answer: "Goodbye!",
      type: "multiple-choice",
    },
    {
      id: "q4-6",
      question: "Chào buổi sáng! Bạn có khỏe không? (Dịch sang tiếng Anh)",
      options: [],
      answer: "Good morning! How are you?",
      type: "translate",
    },
    {
      id: "q4-7",
      question: "Tôi khỏe, cảm ơn. Còn bạn thì sao? (Dịch sang tiếng Anh)",
      options: [],
      answer: "I'm fine, thank you. And you?",
      type: "translate",
    },
  ],
};

export default unitA04;
