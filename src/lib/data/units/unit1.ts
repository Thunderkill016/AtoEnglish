import { UnitData } from "@/components/learn/UnitTemplate";

export const unit1: UnitData = {
  unitId: "unit-1",
  title: "Unit 1: Greetings & Self-Introduction",
  level: "A1",
  xp: 80,
  estimatedTime: 40,
  description: "Học cách chào hỏi, giới thiệu bản thân và phản hồi lịch sự trong giao tiếp cơ bản.",
  badgeName: "Người Khởi Đầu",
  badgeEmoji: "👋",
  warmupGreetings: [
    {
      emoji: "👋",
      en: "Hello! My name is Minh.",
      vn: "Xin chào! Tên tôi là Minh.",
      context: "Tự giới thiệu lần đầu gặp mặt"
    },
    {
      emoji: "🤝",
      en: "Nice to meet you!",
      vn: "Rất vui được gặp bạn!",
      context: "Câu nói khi bắt tay làm quen"
    },
    {
      emoji: "🌞",
      en: "Good morning! How are you?",
      vn: "Chào buổi sáng! Bạn có khỏe không?",
      context: "Chào hỏi thân thiện vào buổi sáng"
    }
  ],
  culturalNote: "Người bản xứ thường nói <span class=\"text-emerald-400 font-semibold\">Hi!</span> thay vì <span class=\"text-emerald-400 font-semibold\">Hello!</span> trong giao tiếp thân mật hàng ngày. <span class=\"text-emerald-400 font-semibold\">Hello</span> nghe trang trọng hơn và thường dùng trong môi trường công sở hoặc khi gặp người lạ lần đầu.",
  vocab: [
    { id: 1, word: "Hello", phonetic: "/həˈləʊ/", meaning: "Xin chào", example: "Hello, I'm Lan.", audio: "/audio/unit1/hello.mp3" },
    { id: 2, word: "Hi", phonetic: "/haɪ/", meaning: "Chào (thân mật)", example: "Hi, how are you?", audio: "/audio/unit1/hi.mp3" },
    { id: 3, word: "Good morning", phonetic: "/ɡʊd ˈmɔːnɪŋ/", meaning: "Chào buổi sáng", example: "Good morning, teacher!", audio: "/audio/unit1/good_morning.mp3" },
    { id: 4, word: "Goodbye", phonetic: "/ˌɡʊdˈbaɪ/", meaning: "Tạm biệt", example: "Goodbye, see you later.", audio: "/audio/unit1/goodbye.mp3" },
    { id: 5, word: "Nice to meet you", phonetic: "/naɪs tə miːt ju/", meaning: "Rất vui được gặp bạn", example: "Nice to meet you.", audio: "/audio/unit1/nice_to_meet_you.mp3" },
    { id: 6, word: "My name is", phonetic: "/maɪ neɪm ɪz/", meaning: "Tên tôi là", example: "My name is Minh.", audio: "/audio/unit1/my_name_is.mp3" },
    { id: 7, word: "I'm from", phonetic: "/aɪm frɒm/", meaning: "Tôi đến từ", example: "I'm from Vietnam.", audio: "/audio/unit1/im_from.mp3" },
    { id: 8, word: "How are you?", phonetic: "/haʊ ɑːr ju/", meaning: "Bạn khỏe không?", example: "How are you?", audio: "/audio/unit1/how_are_you.mp3" },
    { id: 9, word: "I'm fine, thank you", phonetic: "/aɪm faɪn θæŋk ju/", meaning: "Tôi khỏe, cảm ơn", example: "I'm fine, thank you.", audio: "/audio/unit1/im_fine_thank_you.mp3" },
    { id: 10, word: "And you?", phonetic: "/ænd ju/", meaning: "Còn bạn?", example: "I'm good. And you?", audio: "/audio/unit1/and_you.mp3" },
    { id: 11, word: "Thank you", phonetic: "/θæŋk ju/", meaning: "Cảm ơn", example: "Thank you very much.", audio: "/audio/unit1/thank_you.mp3" },
    { id: 12, word: "Please", phonetic: "/pliːz/", meaning: "Làm ơn", example: "Please sit down.", audio: "/audio/unit1/please.mp3" }
  ],
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
  listenAndChoose: [
    { id: "lac1", audio_text: "Good morning", options: ["Good morning", "Good afternoon", "Good evening", "Goodbye"], answer: "Good morning" },
    { id: "lac2", audio_text: "Nice to meet you", options: ["Hello", "Nice to meet you", "How are you", "Please"], answer: "Nice to meet you" },
    { id: "lac3", audio_text: "I am from Vietnam", options: ["I am fine thank you", "My name is Linh", "I am from Vietnam", "See you later"], answer: "I am from Vietnam" },
    { id: "lac4", audio_text: "How are you", options: ["And you", "How are you", "Thank you", "Goodbye"], answer: "How are you" },
    { id: "lac5", audio_text: "See you later", options: ["Good afternoon", "Goodbye", "Bye", "See you later"], answer: "See you later" }
  ],
  speaking: {
    level1Prompt: "Hello! My name is {input}.",
    level1Placeholder: "Ví dụ: Minh, Lan, Nam...",
    level2Situation: "Bạn vừa gặp một người bạn mới tên là Alex. Hãy tự giới thiệu bản thân và hỏi thăm Alex.",
    level2Hint: "Hello! My name is [tên bạn]. Nice to meet you! Where are you from?"
  },
  quiz: [
    { id: "q1", question: "Câu nào dùng để nói 'Rất vui được gặp bạn'?", options: ["Goodbye, see you later", "Nice to meet you", "How old are you?", "Where are you from?"], answer: "Nice to meet you", type: "multiple-choice" },
    { id: "q2", question: "Cách chào hỏi trang trọng nhất vào buổi sáng là gì?", options: ["Hi!", "Good morning", "Goodbye", "See you later"], answer: "Good morning", type: "multiple-choice" },
    { id: "q3", question: "Từ nào là cách nói tạm biệt thân mật?", options: ["Good morning", "Hello", "Bye", "Nice to meet you"], answer: "Bye", type: "multiple-choice" },
    { id: "q4", question: "Khi ai đó nói 'How are you?', câu trả lời phù hợp nhất là gì?", options: ["Nice to meet you", "I am fine thank you", "My name is Linh", "Goodbye"], answer: "I am fine thank you", type: "multiple-choice" },
    { id: "q5", question: "Điền từ còn thiếu: 'I ___ from Vietnam.'", options: [], answer: "am", type: "cloze" }
  ]
};

export default unit1;
