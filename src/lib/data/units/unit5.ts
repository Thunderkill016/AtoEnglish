import { UnitData } from "@/components/learn/UnitTemplate";

export const unit5: UnitData = {
  unitId: "unit-5",
  title: "Unit 5: Free Time & Hobbies",
  level: "A1",
  xp: 80,
  estimatedTime: 40,
  description: "Học cách nói về sở thích và hoạt động giải trí bằng cấu trúc 'like + V-ing'.",
  badgeName: "Người Năng Động",
  badgeEmoji: "🎮",
  warmupGreetings: [
    { emoji: "📚", en: "I like reading books.", vn: "Tôi thích đọc sách.", context: "Nói về sở thích cá nhân" },
    { emoji: "⚽", en: "He likes playing football.", vn: "Anh ấy thích chơi bóng đá.", context: "Dùng 'likes' với He/She/It" },
    { emoji: "🎵", en: "What do you like doing?", vn: "Bạn thích làm gì?", context: "Câu hỏi về sở thích" }
  ],
  culturalNote: "Người Việt thường hỏi <span class=\"text-emerald-400 font-semibold\">What do you like doing in your free time?</span> hoặc ngắn hơn <span class=\"text-emerald-400 font-semibold\">What are your hobbies?</span>. Cả hai cách đều tự nhiên và lịch sự.",
  vocab: [
    { id: 1, word: "reading", emoji: "📚", phonetic: "/ˈriːdɪŋ/", meaning: "đọc sách", example: "I like reading every night.", example2: "Reading is my favourite hobby.", collocation: "like reading books", audio: "/audio/unit5/reading.mp3" },
    { id: 2, word: "listening to music", emoji: "🎵", phonetic: "/ˈlɪsənɪŋ tə ˈmjuːzɪk/", meaning: "nghe nhạc", example: "She likes listening to music.", example2: "I enjoy listening to music while studying.", collocation: "listen to music / pop music", audio: "/audio/unit5/listening_to_music.mp3" },
    { id: 3, word: "playing football", emoji: "⚽", phonetic: "/ˈpleɪɪŋ ˈfʊtbɔːl/", meaning: "chơi bóng đá", example: "He likes playing football on weekends.", example2: "Playing football keeps me fit.", collocation: "play football with friends", audio: "/audio/unit5/playing_football.mp3" },
    { id: 4, word: "swimming", emoji: "🏊", phonetic: "/ˈswɪmɪŋ/", meaning: "bơi lội", example: "I like swimming in the summer.", example2: "Swimming is good for your health.", collocation: "go swimming", audio: "/audio/unit5/swimming.mp3" },
    { id: 5, word: "cooking", emoji: "🍳", phonetic: "/ˈkʊkɪŋ/", meaning: "nấu ăn", example: "My mum likes cooking Vietnamese food.", example2: "I enjoy cooking for my family.", collocation: "love cooking", audio: "/audio/unit5/cooking.mp3" },
    { id: 6, word: "drawing", emoji: "✏️", phonetic: "/ˈdrɔːɪŋ/", meaning: "vẽ", example: "She likes drawing portraits.", example2: "I like drawing in my free time.", collocation: "like drawing / enjoy drawing", audio: "/audio/unit5/drawing.mp3" },
    { id: 7, word: "traveling", emoji: "✈️", phonetic: "/ˈtrævəlɪŋ/", meaning: "du lịch", example: "They like traveling to new places.", example2: "Traveling helps me learn about new cultures.", collocation: "enjoy traveling", audio: "/audio/unit5/traveling.mp3" },
    { id: 8, word: "gaming", emoji: "🎮", phonetic: "/ˈɡeɪmɪŋ/", meaning: "chơi game", example: "He likes gaming in the evening.", example2: "Gaming is a popular hobby for young people.", collocation: "enjoy gaming online", audio: "/audio/unit5/gaming.mp3" },
    { id: 9, word: "dancing", emoji: "💃", phonetic: "/ˈdɑːnsɪŋ/", meaning: "nhảy múa", example: "She likes dancing in her free time.", example2: "We enjoy dancing together.", collocation: "love dancing", audio: "/audio/unit5/dancing.mp3" },
    { id: 10, word: "cycling", emoji: "🚲", phonetic: "/ˈsaɪklɪŋ/", meaning: "đạp xe", example: "I like cycling to work.", example2: "Cycling is a great way to exercise.", collocation: "go cycling / enjoy cycling", audio: "/audio/unit5/cycling.mp3" },
    { id: 11, word: "photography", emoji: "📷", phonetic: "/fəˈtɒɡrəfi/", meaning: "chụp ảnh", example: "He likes photography on weekends.", example2: "Photography is her main hobby.", collocation: "enjoy photography", audio: "/audio/unit5/photography.mp3" },
    { id: 12, word: "watching movies", emoji: "🎬", phonetic: "/ˈwɒtʃɪŋ ˈmuːviz/", meaning: "xem phim", example: "I like watching movies on Friday nights.", example2: "We enjoy watching movies together at home.", collocation: "love watching movies", audio: "/audio/unit5/watching_movies.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Sở thích cuối tuần",
      audio: "/audio/unit5/dialogue_1.mp3",
      desc: "Mai và Tom nói chuyện về sở thích và hoạt động cuối tuần.",
      lines: [
        { id: "d1-1", speaker: "Tom", text: "What do you like doing in your free time?", translation: "Bạn thích làm gì trong thời gian rảnh?" },
        { id: "d1-2", speaker: "Mai", text: "I like reading and listening to music. And you?", translation: "Tôi thích đọc sách và nghe nhạc. Còn bạn?" },
        { id: "d1-3", speaker: "Tom", text: "I like playing football with my friends.", translation: "Tôi thích chơi bóng đá với bạn bè." },
        { id: "d1-4", speaker: "Mai", text: "Do you like swimming too?", translation: "Bạn có thích bơi lội không?" },
        { id: "d1-5", speaker: "Tom", text: "Yes! I go swimming every Saturday morning.", translation: "Có! Tôi đi bơi mỗi sáng thứ Bảy." },
      ]
    },
    {
      id: 2,
      title: "Câu lạc bộ sở thích",
      audio: "/audio/unit5/dialogue_2.mp3",
      desc: "Lan đang tìm câu lạc bộ sở thích tại trường và hỏi bạn cùng lớp.",
      lines: [
        { id: "d2-1", speaker: "Lan", text: "Hi! Do you have any hobbies?", translation: "Chào! Bạn có sở thích gì không?" },
        { id: "d2-2", speaker: "Nam", text: "Yes! I really like drawing and photography.", translation: "Có! Tôi rất thích vẽ và chụp ảnh." },
        { id: "d2-3", speaker: "Lan", text: "That's great! I like cooking and dancing.", translation: "Tuyệt vời! Tôi thích nấu ăn và nhảy múa." },
        { id: "d2-4", speaker: "Nam", text: "We should join the art club together!", translation: "Chúng mình nên tham gia câu lạc bộ nghệ thuật cùng nhau!" },
        { id: "d2-5", speaker: "Lan", text: "Great idea! I also like watching movies.", translation: "Ý tưởng hay đấy! Tôi cũng thích xem phim." },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "I like reading books", options: ["I like cooking food", "I like reading books", "I like playing games", "I like swimming"], answer: "I like reading books" },
    { id: "lac2", audio_text: "She likes dancing", options: ["She likes singing", "He likes dancing", "She likes dancing", "She likes drawing"], answer: "She likes dancing" },
    { id: "lac3", audio_text: "We like traveling to new places", options: ["We like traveling to new places", "We like staying at home", "They like traveling", "We like playing football"], answer: "We like traveling to new places" },
    { id: "lac4", audio_text: "Do you like swimming", options: ["Do you like cooking", "Do you like swimming", "Does she like swimming", "Do you like running"], answer: "Do you like swimming" },
    { id: "lac5", audio_text: "He likes playing football on weekends", options: ["He likes playing football every day", "She likes playing football on weekends", "He likes playing football on weekends", "He likes watching football on weekends"], answer: "He likes playing football on weekends" },
  ],
  speaking: {
    level1Prompt: "I like {input} in my free time.",
    level1Placeholder: "Ví dụ: reading, swimming, cooking...",
    level2Situation: "Bạn đang trò chuyện với một người bạn ngoại quốc về sở thích. Kể cho họ nghe bạn thích làm gì, khi nào và tại sao.",
    level2Hint: "I like [sở thích] in my free time. I also enjoy [sở thích khác]. My favourite hobby is [sở thích yêu thích nhất] because [lý do].",
  },
  grammar: {
    title: "like + V-ing — Diễn đạt sở thích",
    rule: "I/You/We/They like + V-ing  |  He/She/It likes + V-ing",
    conjugation: [
      { subject: "I / You / We / They", form: "like + V-ing", example: "I like reading books." },
      { subject: "He / She / It", form: "likes + V-ing", example: "She likes swimming every day." },
    ],
    examples: [
      { en: "I like listening to music.", vn: "Tôi thích nghe nhạc." },
      { en: "He likes playing football.", vn: "Anh ấy thích chơi bóng đá." },
      { en: "Do you like cooking?", vn: "Bạn có thích nấu ăn không?" },
      { en: "She doesn't like watching TV.", vn: "Cô ấy không thích xem TV." },
    ],
    tip: "Sau 'like/likes' luôn dùng V-ing (không dùng động từ nguyên thể). Sai: 'I like swim'. Đúng: 'I like swimming'. Cũng có thể dùng 'enjoy + V-ing' với nghĩa tương tự.",
    dialogueExample: {
      speaker: "Mai",
      text: "I like reading and listening to music. And you?",
      translation: "Tôi thích đọc sách và nghe nhạc. Còn bạn?",
      highlight: "I like reading",
    },
    ccq: {
      question: "Câu nào đúng cấu trúc?",
      options: ["She like swim.", "She likes to swimming.", "She likes swimming.", "She like swimming."],
      answer: "She likes swimming.",
    },
  },
  matchingExercise: {
    title: "Nối sở thích với nghĩa tiếng Việt",
    pairs: [
      { left: "reading", right: "đọc sách" },
      { left: "swimming", right: "bơi lội" },
      { left: "cooking", right: "nấu ăn" },
      { left: "drawing", right: "vẽ" },
      { left: "traveling", right: "du lịch" },
    ],
  },
  practiceQuiz: [
    { id: "pq1", question: "Chọn dạng đúng: 'He ___ football every day.'", options: ["like playing", "likes playing", "likes play", "like play"], answer: "likes playing", type: "multiple-choice" },
    { id: "pq2", question: "'I like cooking.' — Từ 'cooking' là gì?", options: ["Tính từ", "Danh từ", "Động từ dạng -ing", "Trạng từ"], answer: "Động từ dạng -ing", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ còn thiếu: 'She ___ dancing very much.'", options: [], answer: "likes", type: "cloze" },
  ],
  quiz: [
    { id: "q1", question: "Câu nào đúng với chủ ngữ 'He'?", options: ["He like reading.", "He likes reading.", "He liking reading.", "He liked reading."], answer: "He likes reading.", type: "multiple-choice" },
    { id: "q2", question: "'Do you like swimming?' — Trả lời phủ định:", options: ["No, I don't like swim.", "No, I don't like swimming.", "No, I doesn't like swimming.", "No, I not like swimming."], answer: "No, I don't like swimming.", type: "multiple-choice" },
    { id: "q3", question: "Sở thích nào KHÔNG phải là thể thao?", options: ["swimming", "cycling", "playing football", "reading"], answer: "reading", type: "multiple-choice" },
    { id: "q4", question: "Điền vào chỗ trống: 'They like ___ to music every evening.'", options: [], answer: "listening", type: "cloze" },
    { id: "q5", question: "Điền vào chỗ trống: 'She ___ playing chess.'", options: [], answer: "likes", type: "cloze" },
    { id: "q6", question: "Tôi thích chụp ảnh vào cuối tuần.", options: [], answer: "I like taking photos on weekends.", type: "translate" },
    { id: "q7", question: "Bạn có thích du lịch không?", options: [], answer: "Do you like traveling?", type: "translate" },
  ],
  scrambleExercises: [
    {
      id: "s5-1",
      prompt_vn: "Tôi thích chơi bóng đá.",
      words: ["I", "like", "playing", "football", "."],
      answer: "I like playing football .",
    },
    {
      id: "s5-2",
      prompt_vn: "Cô ấy thích đọc sách mỗi tối.",
      words: ["She", "likes", "reading", "books", "every", "evening", "."],
      answer: "She likes reading books every evening .",
    },
    {
      id: "s5-3",
      prompt_vn: "Chúng tôi thích nghe nhạc.",
      words: ["We", "like", "listening", "to", "music", "."],
      answer: "We like listening to music .",
    },
  ],
  cumulativeReviewQuestions: [
    {
      id: "cr5-1",
      question: "Chọn dạng đúng: 'He ___ to work by bus every day.' (Unit 4: Present Simple)",
      options: ["go", "goes", "going", "gone"],
      answer: "goes",
      type: "multiple-choice",
    },
    {
      id: "cr5-2",
      question: "Cô ấy đánh răng mỗi buổi sáng. (Unit 4)",
      options: [],
      answer: "She brushes her teeth every morning.",
      type: "translate",
    },
  ],
};

export default unit5;
