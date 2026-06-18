export interface VocabItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  audio: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  translation: string;
}

export interface Dialogue {
  id: number;
  title: string;
  audio: string;
  desc: string;
  lines: DialogueLine[];
}

export interface MatchingGreeting {
  id: string;
  en: string;
  vn: string;
  emoji: string;
}

export interface ToBeExercise {
  id: string;
  sentence_before: string;
  sentence_after: string;
  options: string[];
  answer: string;
}

export interface ClozeItem {
  id: string;
  sentence_before: string;
  sentence_after: string;
  answer: string;
  full_sentence: string;
}

export interface ListenAndChooseItem {
  id: string;
  audio_text: string;
  options: string[];
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
  type: "multiple-choice" | "cloze";
}

export interface UnitData {
  unitId: string;
  title: string;
  level: string;
  xp: number;
  estimatedTime: number;
  description: string;
  vocab: VocabItem[];
  dialogues: Dialogue[];
  matchingGreetings: MatchingGreeting[];
  toBeExercises: ToBeExercise[];
  cloze: ClozeItem[];
  listenAndChoose: ListenAndChooseItem[];
  quiz: QuizQuestion[];
  exercises: {
    micro1_input: {
      type: string;
      activities: { type: string; title: string; items?: number }[];
    };
    micro2_processing: {
      type: string;
      activities: { type: string; title: string; items?: number }[];
    };
    micro3_output: {
      type: string;
      activities: { type: string; title: string; dialogues?: number[]; items?: number; scenarios?: string[] }[];
    };
    micro4_review: {
      type: string;
      activities: { type: string; title: string; totalQuestions?: number }[];
    };
  };
}

export const unit1: UnitData = {
  unitId: "unit-1",
  title: "Greetings & Self-Introduction",
  level: "A1",
  xp: 80,
  estimatedTime: 40,
  description: "Học cách chào hỏi, giới thiệu bản thân và phản hồi lịch sự trong giao tiếp cơ bản.",
  
  // ==================== TỪ VỰNG ====================
  vocab: [
    {
      id: 1,
      word: "Hello",
      phonetic: "/həˈləʊ/",
      meaning: "Xin chào",
      example: "Hello, I'm Lan.",
      audio: "/audio/unit1/hello.mp3"
    },
    {
      id: 2,
      word: "Hi",
      phonetic: "/haɪ/",
      meaning: "Chào (thân mật)",
      example: "Hi, how are you?",
      audio: "/audio/unit1/hi.mp3"
    },
    {
      id: 3,
      word: "Good morning",
      phonetic: "/ɡʊd ˈmɔːnɪŋ/",
      meaning: "Chào buổi sáng",
      example: "Good morning, teacher!",
      audio: "/audio/unit1/good_morning.mp3"
    },
    {
      id: 4,
      word: "Goodbye",
      phonetic: "/ˌɡʊdˈbaɪ/",
      meaning: "Tạm biệt",
      example: "Goodbye, see you later.",
      audio: "/audio/unit1/goodbye.mp3"
    },
    {
      id: 5,
      word: "Nice to meet you",
      phonetic: "/naɪs tə miːt ju/",
      meaning: "Rất vui được gặp bạn",
      example: "Nice to meet you.",
      audio: "/audio/unit1/nice_to_meet_you.mp3"
    },
    {
      id: 6,
      word: "My name is",
      phonetic: "/maɪ neɪm ɪz/",
      meaning: "Tên tôi là",
      example: "My name is Minh.",
      audio: "/audio/unit1/my_name_is.mp3"
    },
    {
      id: 7,
      word: "I'm from",
      phonetic: "/aɪm frɒm/",
      meaning: "Tôi đến từ",
      example: "I'm from Vietnam.",
      audio: "/audio/unit1/im_from.mp3"
    },
    {
      id: 8,
      word: "How are you?",
      phonetic: "/haʊ ɑːr ju/",
      meaning: "Bạn khỏe không?",
      example: "How are you?",
      audio: "/audio/unit1/how_are_you.mp3"
    },
    {
      id: 9,
      word: "I'm fine, thank you",
      phonetic: "/aɪm faɪn θæŋk ju/",
      meaning: "Tôi khỏe, cảm ơn",
      example: "I'm fine, thank you.",
      audio: "/audio/unit1/im_fine_thank_you.mp3"
    },
    {
      id: 10,
      word: "And you?",
      phonetic: "/ænd ju/",
      meaning: "Còn bạn?",
      example: "I'm good. And you?",
      audio: "/audio/unit1/and_you.mp3"
    },
    {
      id: 11,
      word: "Thank you",
      phonetic: "/θæŋk ju/",
      meaning: "Cảm ơn",
      example: "Thank you very much.",
      audio: "/audio/unit1/thank_you.mp3"
    },
    {
      id: 12,
      word: "Please",
      phonetic: "/pliːz/",
      meaning: "Làm ơn",
      example: "Please sit down.",
      audio: "/audio/unit1/please.mp3"
    }
  ],

  // ==================== HỘI THOẠI (Dùng cho Shadowing & Roleplay) ====================
  dialogues: [
    {
      id: 1,
      title: "Gặp lần đầu",
      audio: "/audio/unit1/dialogue_1.mp3",
      desc: "Alex và Linh gặp nhau lần đầu tiên và làm quen với nhau.",
      lines: [
        { id: "d1-1", speaker: "Alex", text: "Hello! My name is Alex. Nice to meet you.", translation: "Xin chào! Mình tên là Alex. Rất vui được gặp bạn." },
        { id: "d1-2", speaker: "Linh", text: "Hi Alex! I'm Lan. Nice to meet you too.", translation: "Chào Alex! Mình là Lan. Mình cũng rất vui được gặp bạn." },
        { id: "d1-3", speaker: "Alex", text: "Where are you from?", translation: "Bạn đến từ đâu?" },
        { id: "d1-4", speaker: "Linh", text: "I'm from Vietnam. And you?", translation: "Mình đến từ Việt Nam. Còn bạn?" },
        { id: "d1-5", speaker: "Alex", text: "I'm from America.", translation: "Mình đến từ Mỹ." }
      ]
    },
    {
      id: 2,
      title: "Gặp bạn cũ",
      audio: "/audio/unit1/dialogue_2.mp3",
      desc: "Bob gặp lại người bạn cũ Alice ở trên đường và hỏi thăm sức khỏe.",
      lines: [
        { id: "d2-1", speaker: "Bob", text: "Hi! How are you?", translation: "Chào cậu! Cậu có khỏe không?" },
        { id: "d2-2", speaker: "Alice", text: "I'm fine, thank you. And you?", translation: "Mình khỏe, cảm ơn cậu. Còn cậu?" },
        { id: "d2-3", speaker: "Bob", text: "I'm good, thanks.", translation: "Mình tốt, cảm ơn cậu." },
        { id: "d2-4", speaker: "Alice", text: "See you later!", translation: "Hẹn gặp lại cậu sau nhé!" },
        { id: "d2-5", speaker: "Bob", text: "Bye!", translation: "Tạm biệt cậu!" }
      ]
    },
    {
      id: 3,
      title: "Gặp giáo viên",
      audio: "/audio/unit1/dialogue_3.mp3",
      desc: "Học sinh gặp thầy giáo Brown vào buổi sáng trước khi vào lớp.",
      lines: [
        { id: "d3-1", speaker: "Student", text: "Good morning, teacher!", translation: "Chào buổi sáng thầy ạ!" },
        { id: "d3-2", speaker: "Mr. Brown", text: "Good morning! What's your name?", translation: "Chào buổi sáng em! Tên em là gì?" },
        { id: "d3-3", speaker: "Student", text: "My name is Minh.", translation: "Tên em là Minh ạ." },
        { id: "d3-4", speaker: "Mr. Brown", text: "Nice to meet you, Minh.", translation: "Rất vui được gặp em, Minh." },
        { id: "d3-5", speaker: "Student", text: "Nice to meet you too.", translation: "Em cũng rất vui được gặp thầy ạ." }
      ]
    }
  ],

  // ==================== BÀI TẬP BỔ TRỢ ====================
  matchingGreetings: [
    { id: "m1", en: "Hello", vn: "Xin chào", emoji: "👋" },
    { id: "m2", en: "Hi", vn: "Chào (thân mật)", emoji: "😊" },
    { id: "m3", en: "Good morning", vn: "Chào buổi sáng", emoji: "☀️" },
    { id: "m4", en: "Good afternoon", vn: "Chào buổi chiều", emoji: "🌅" },
    { id: "m5", en: "Good evening", vn: "Chào buổi tối", emoji: "🌙" },
    { id: "m6", en: "Goodbye", vn: "Tạm biệt", emoji: "🚶‍♂️" },
    { id: "m7", en: "Bye", vn: "Tạm biệt (thân mật)", emoji: "👋" },
    { id: "m8", en: "See you later", vn: "Hẹn gặp lại sau", emoji: "⏰" },
  ],
  toBeExercises: [
    {
      id: "tb1",
      sentence_before: "I ",
      sentence_after: " Lan.",
      options: ["am", "is", "are"],
      answer: "am",
    },
    {
      id: "tb2",
      sentence_before: "She ",
      sentence_after: " from Japan.",
      options: ["am", "is", "are"],
      answer: "is",
    },
    {
      id: "tb3",
      sentence_before: "They ",
      sentence_after: " my friends.",
      options: ["am", "is", "are"],
      answer: "are",
    },
    {
      id: "tb4",
      sentence_before: "I ",
      sentence_after: " a student.",
      options: ["am", "is", "are"],
      answer: "am",
    },
    {
      id: "tb5",
      sentence_before: "We ",
      sentence_after: " from Vietnam.",
      options: ["am", "is", "are"],
      answer: "are",
    },
    {
      id: "tb6",
      sentence_before: "He ",
      sentence_after: " a teacher.",
      options: ["am", "is", "are"],
      answer: "is",
    },
  ],
  cloze: [
    {
      id: "c1",
      sentence_before: "Nice ",
      sentence_after: " to meet you.",
      answer: "meet",
      full_sentence: "Nice to meet you.",
    },
    {
      id: "c2",
      sentence_before: "My ",
      sentence_after: " is Minh.",
      answer: "name",
      full_sentence: "My name is Minh.",
    },
    {
      id: "c3",
      sentence_before: "I am ",
      sentence_after: " Vietnam.",
      answer: "from",
      full_sentence: "I am from Vietnam.",
    },
    {
      id: "c4",
      sentence_before: "Good ",
      sentence_after: " , teacher! How are you?",
      answer: "morning",
      full_sentence: "Good morning, teacher! How are you?",
    },
    {
      id: "c5",
      sentence_before: "How ",
      sentence_after: " you?",
      answer: "are",
      full_sentence: "How are you?",
    },
    {
      id: "c6",
      sentence_before: "I am fine, thank ",
      sentence_after: " .",
      answer: "you",
      full_sentence: "I am fine, thank you.",
    },
    {
      id: "c7",
      sentence_before: "Please ",
      sentence_after: " me.",
      answer: "excuse",
      full_sentence: "Please excuse me.",
    },
    {
      id: "c8",
      sentence_before: "See you ",
      sentence_after: " .",
      answer: "later",
      full_sentence: "See you later.",
    },
  ],
  listenAndChoose: [
    {
      id: "lac1",
      audio_text: "Good morning",
      options: ["Good morning", "Good afternoon", "Good evening", "Goodbye"],
      answer: "Good morning",
    },
    {
      id: "lac2",
      audio_text: "Nice to meet you",
      options: ["Hello", "Nice to meet you", "How are you", "Please"],
      answer: "Nice to meet you",
    },
    {
      id: "lac3",
      audio_text: "I am from Vietnam",
      options: ["I am fine thank you", "My name is Linh", "I am from Vietnam", "See you later"],
      answer: "I am from Vietnam",
    },
    {
      id: "lac4",
      audio_text: "How are you",
      options: ["And you", "How are you", "Thank you", "Goodbye"],
      answer: "How are you",
    },
    {
      id: "lac5",
      audio_text: "See you later",
      options: ["Good afternoon", "Goodbye", "Bye", "See you later"],
      answer: "See you later",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "Câu nào dùng để chào hỏi lịch sự và nói 'Rất vui được gặp bạn'?",
      options: [
        "Goodbye, see you later",
        "Nice to meet you",
        "How old are you?",
        "Where are you from?",
      ],
      answer: "Nice to meet you",
      type: "multiple-choice",
    },
    {
      id: "q2",
      question: "Cách chào hỏi trang trọng nhất vào buổi sáng là gì?",
      options: ["Hi!", "Good morning", "Goodbye", "See you later"],
      answer: "Good morning",
      type: "multiple-choice",
    },
    {
      id: "q3",
      question: "Từ nào là cách nói tạm biệt thân mật?",
      options: ["Good morning", "Hello", "Bye", "Nice to meet you"],
      answer: "Bye",
      type: "multiple-choice",
    },
    {
      id: "q4",
      question: "Phát âm phiên âm của từ 'meet' là gì?",
      options: ["/maɪˈself/", "/həˈləʊ/", "/neɪm/", "/miːt/"],
      answer: "/miːt/",
      type: "multiple-choice",
    },
    {
      id: "q5",
      question: "Cách lịch sự để nói lời cảm ơn bằng tiếng Anh là gì?",
      options: ["Please", "Hello", "Thank you", "Nice"],
      answer: "Thank you",
      type: "multiple-choice",
    },
    {
      id: "q6",
      question: "Khi ai đó nói 'How are you?', câu trả lời phù hợp nhất là gì?",
      options: ["Nice to meet you", "I am fine thank you", "My name is Linh", "Goodbye"],
      answer: "I am fine thank you",
      type: "multiple-choice",
    },
    {
      id: "q7",
      question: "Điền từ còn thiếu: 'I ___ from Vietnam.'",
      options: [],
      answer: "am",
      type: "cloze",
    },
    {
      id: "q8",
      question: "Điền từ còn thiếu: 'What ___ your name?'",
      options: [],
      answer: "is",
      type: "cloze",
    },
    {
      id: "q9",
      question: "Điền từ còn thiếu: 'They ___ nice friends.'",
      options: [],
      answer: "are",
      type: "cloze",
    },
    {
      id: "q10",
      question: "Điền từ còn thiếu: 'Please excuse ___.'",
      options: [],
      answer: "me",
      type: "cloze",
    },
  ],

  // ==================== BÀI TẬP THEO MICRO-LESSON ====================
  exercises: {
    micro1_input: {
      type: "input",
      activities: [
        {
          type: "listen_and_match",
          title: "Nghe và chọn hình ảnh",
          items: 6
        },
        {
          type: "shadowing",
          title: "Shadowing cơ bản",
          items: 8
        }
      ]
    },

    micro2_processing: {
      type: "processing",
      activities: [
        {
          type: "flashcard",
          title: "Học từ vựng",
          items: 12
        },
        {
          type: "cloze_test",
          title: "Điền từ vào chỗ trống",
          items: 8
        },
        {
          type: "grammar_drag_drop",
          title: "Kéo thả am / is / are",
          items: 6
        }
      ]
    },

    micro3_output: {
      type: "output",
      activities: [
        {
          type: "shadowing_advanced",
          title: "Shadowing nâng cao",
          dialogues: [1, 2, 3]
        },
        {
          type: "record_and_compare",
          title: "Ghi âm và so sánh",
          items: 4
        },
        {
          type: "roleplay",
          title: "Roleplay đơn giản",
          scenarios: [
            "Bạn gặp một người nước ngoài lần đầu tiên.",
            "Bạn gặp bạn cũ sau 2 năm."
          ]
        }
      ]
    },

    micro4_review: {
      type: "review",
      activities: [
        {
          type: "quiz",
          title: "Quiz nhanh",
          totalQuestions: 10
        },
        {
          type: "self_check",
          title: "Tự đánh giá"
        }
      ]
    }
  }
};

export default unit1;
