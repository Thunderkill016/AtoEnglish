import { UnitData } from "@/components/learn/UnitTemplate";

export const unit10: UnitData = {
  unitId: "unit-10",
  title: "Unit 10: Abilities & Daily Skills",
  level: "A1",
  xp: 80,
  estimatedTime: 40,
  description: "Học cách nói về khả năng bản thân bằng 'can/can't' và hỏi về kỹ năng của người khác.",
  badgeName: "Người Đa Tài",
  badgeEmoji: "⭐",
  warmupGreetings: [
    { emoji: "🏊", en: "I can swim very well.", vn: "Tôi có thể bơi rất giỏi.", context: "Nói về khả năng bản thân" },
    { emoji: "🎸", en: "Can you play the guitar?", vn: "Bạn có thể chơi guitar không?", context: "Hỏi về khả năng người khác" },
    { emoji: "❌", en: "I can't speak Japanese.", vn: "Tôi không thể nói tiếng Nhật.", context: "Phủ định khả năng" }
  ],
  culturalNote: "<span class=\"text-emerald-400 font-semibold\">Can</span> là modal verb — không thêm -s dù chủ ngữ là He/She/It. Sai: 'She cans swim'. Đúng: 'She can swim'. Người Việt hay mắc lỗi này vì quen với quy tắc thêm -s của Present Simple.",
  vocab: [
    { id: 1, word: "swim", emoji: "🏊", phonetic: "/swɪm/", meaning: "bơi lội", example: "I can swim across the river.", example2: "Can you swim in the sea?", collocation: "swim well / swim fast", audio: "/audio/unit10/swim.mp3" },
    { id: 2, word: "drive", emoji: "🚗", phonetic: "/draɪv/", meaning: "lái xe", example: "She can drive a car.", example2: "Can you drive a motorbike?", collocation: "drive a car / drive safely", audio: "/audio/unit10/drive.mp3" },
    { id: 3, word: "cook", emoji: "🍳", phonetic: "/kʊk/", meaning: "nấu ăn", example: "I can cook Vietnamese food.", example2: "My dad can cook very well.", collocation: "cook well / cook for someone", audio: "/audio/unit10/cook.mp3" },
    { id: 4, word: "sing", emoji: "🎤", phonetic: "/sɪŋ/", meaning: "hát", example: "He can sing beautifully.", example2: "Can you sing any English songs?", collocation: "sing a song / sing in tune", audio: "/audio/unit10/sing.mp3" },
    { id: 5, word: "play the guitar", emoji: "🎸", phonetic: "/pleɪ ðə ɡɪˈtɑːr/", meaning: "chơi guitar", example: "I can play the guitar.", example2: "She can play the guitar and the piano.", collocation: "play the guitar / play guitar well", audio: "/audio/unit10/play_guitar.mp3" },
    { id: 6, word: "speak", emoji: "🗣️", phonetic: "/spiːk/", meaning: "nói (ngôn ngữ)", example: "I can speak English and Vietnamese.", example2: "Can you speak slowly, please?", collocation: "speak English / speak fluently", audio: "/audio/unit10/speak.mp3" },
    { id: 7, word: "read", emoji: "📖", phonetic: "/riːd/", meaning: "đọc", example: "She can read English books.", example2: "I can read and write in French.", collocation: "read well / read fast", audio: "/audio/unit10/read.mp3" },
    { id: 8, word: "dance", emoji: "💃", phonetic: "/dɑːns/", meaning: "nhảy múa", example: "Can you dance?", example2: "I can't dance very well.", collocation: "dance well / dance to music", audio: "/audio/unit10/dance.mp3" },
    { id: 9, word: "fix", emoji: "🔧", phonetic: "/fɪks/", meaning: "sửa chữa", example: "My dad can fix a motorbike.", example2: "Can you fix my phone?", collocation: "fix a car / fix a problem", audio: "/audio/unit10/fix.mp3" },
    { id: 10, word: "use a computer", emoji: "💻", phonetic: "/juːz ə kəmˈpjuːtər/", meaning: "dùng máy tính", example: "I can use a computer well.", example2: "She can use a computer for her work.", collocation: "use a computer / use software", audio: "/audio/unit10/use_computer.mp3" },
    { id: 11, word: "draw", emoji: "✏️", phonetic: "/drɔː/", meaning: "vẽ", example: "He can draw portraits very well.", example2: "I can't draw at all!", collocation: "draw well / draw a picture", audio: "/audio/unit10/draw.mp3" },
    { id: 12, word: "take photos", emoji: "📷", phonetic: "/teɪk ˈfəʊtəʊz/", meaning: "chụp ảnh", example: "She can take beautiful photos.", example2: "Can you take a photo of us?", collocation: "take photos / take a photo of", audio: "/audio/unit10/take_photos.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Buổi phỏng vấn tình nguyện",
      audio: "/audio/unit10/dialogue_1.mp3",
      desc: "Minh đang phỏng vấn để tham gia một câu lạc bộ tình nguyện.",
      lines: [
        { id: "d1-1", speaker: "Interviewer", text: "Hello! What can you do for our club?", translation: "Xin chào! Bạn có thể làm gì cho câu lạc bộ chúng tôi?" },
        { id: "d1-2", speaker: "Minh", text: "I can speak English and I can use a computer.", translation: "Tôi có thể nói tiếng Anh và dùng máy tính." },
        { id: "d1-3", speaker: "Interviewer", text: "Can you drive a car or a motorbike?", translation: "Bạn có thể lái xe ô tô hay xe máy không?" },
        { id: "d1-4", speaker: "Minh", text: "I can drive a motorbike but I can't drive a car yet.", translation: "Tôi có thể lái xe máy nhưng chưa thể lái xe ô tô." },
        { id: "d1-5", speaker: "Interviewer", text: "Can you cook?", translation: "Bạn có thể nấu ăn không?" },
        { id: "d1-6", speaker: "Minh", text: "Yes! I can cook Vietnamese food very well.", translation: "Có! Tôi có thể nấu đồ ăn Việt Nam rất ngon." },
      ]
    },
    {
      id: 2,
      title: "Tìm người bạn học",
      audio: "/audio/unit10/dialogue_2.mp3",
      desc: "Lan tìm bạn học nhóm và hỏi về kỹ năng của nhau.",
      lines: [
        { id: "d2-1", speaker: "Lan", text: "Can you help me with my English homework?", translation: "Bạn có thể giúp tôi làm bài tập tiếng Anh không?" },
        { id: "d2-2", speaker: "Nam", text: "Sure! I can speak and read English well.", translation: "Được chứ! Tôi có thể nói và đọc tiếng Anh tốt." },
        { id: "d2-3", speaker: "Lan", text: "Great! Can you sing English songs too?", translation: "Tuyệt! Bạn có thể hát nhạc tiếng Anh không?" },
        { id: "d2-4", speaker: "Nam", text: "Ha! No, I can't sing at all. I'm terrible!", translation: "Haha! Không, tôi không thể hát chút nào. Tôi hát rất tệ!" },
        { id: "d2-5", speaker: "Lan", text: "That's OK! I can sing but I can't play guitar.", translation: "Không sao! Tôi có thể hát nhưng không biết chơi guitar." },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "I can swim very well", options: ["I can run very well", "She can swim very well", "I can swim very well", "I can't swim very well"], answer: "I can swim very well" },
    { id: "lac2", audio_text: "She can drive a car", options: ["She can drive a bus", "She can't drive a car", "He can drive a car", "She can drive a car"], answer: "She can drive a car" },
    { id: "lac3", audio_text: "I can't speak Japanese", options: ["I can speak Japanese", "I can't speak Chinese", "I can't speak Japanese", "She can't speak Japanese"], answer: "I can't speak Japanese" },
    { id: "lac4", audio_text: "Can you cook Vietnamese food", options: ["Can you eat Vietnamese food", "Can you cook Vietnamese food", "Can she cook Vietnamese food", "Can you cook Chinese food"], answer: "Can you cook Vietnamese food" },
    { id: "lac5", audio_text: "He can play the guitar", options: ["She can play the guitar", "He can play the piano", "He can't play the guitar", "He can play the guitar"], answer: "He can play the guitar" },
  ],
  speaking: {
    level1Prompt: "I can {input} very well.",
    level1Placeholder: "Ví dụ: swim, cook, sing, speak English...",
    level2Situation: "Bạn đang tham gia một buổi giới thiệu bản thân tại lớp học mới. Nói về 3 thứ bạn có thể làm tốt và 2 thứ bạn chưa thể làm.",
    level2Hint: "My name is [tên]. I can [kỹ năng 1] and [kỹ năng 2]. I can also [kỹ năng 3]. But I can't [chưa làm được 1] or [chưa làm được 2] yet.",
  },
  grammar: {
    title: "Can / Can't — Diễn đạt khả năng",
    rule: "Subject + can + verb (không thêm -s) | Subject + can't + verb | Can + subject + verb?",
    conjugation: [
      { subject: "I / You / He / She / It / We / They", form: "can + verb", example: "She can swim." },
      { subject: "I / You / He / She / It / We / They", form: "can't + verb", example: "He can't drive." },
    ],
    examples: [
      { en: "I can speak English.", vn: "Tôi có thể nói tiếng Anh." },
      { en: "She can't drive a car.", vn: "Cô ấy không thể lái xe ô tô." },
      { en: "Can you cook?", vn: "Bạn có thể nấu ăn không?" },
      { en: "He can play the guitar and sing.", vn: "Anh ấy có thể chơi guitar và hát." },
    ],
    tip: "Can là modal verb — KHÔNG thêm -s dù chủ ngữ là He/She/It. Sai: 'She cans swim'. Đúng: 'She can swim'. Phủ định: can't (= cannot). Câu hỏi: đảo 'Can' lên đầu câu.",
    dialogueExample: {
      speaker: "Minh",
      text: "I can drive a motorbike but I can't drive a car yet.",
      translation: "Tôi có thể lái xe máy nhưng chưa thể lái xe ô tô.",
      highlight: "can / can't",
    },
    ccq: {
      question: "Câu nào đúng với chủ ngữ 'She'?",
      options: ["She cans swim.", "She can swims.", "She can swim.", "She is can swim."],
      answer: "She can swim.",
    },
  },
  matchingExercise: {
    title: "Nối kỹ năng với nghĩa tiếng Việt",
    pairs: [
      { left: "swim", right: "bơi lội" },
      { left: "drive", right: "lái xe" },
      { left: "sing", right: "hát" },
      { left: "fix", right: "sửa chữa" },
      { left: "draw", right: "vẽ" },
    ],
  },
  practiceQuiz: [
    { id: "pq1", question: "Câu nào đúng với 'She'?", options: ["She cans swim.", "She can swims.", "She can swim.", "She is can swim."], answer: "She can swim.", type: "multiple-choice" },
    { id: "pq2", question: "Phủ định của 'I can sing' là gì?", options: ["I don't can sing.", "I can't sing.", "I cannot to sing.", "I not can sing."], answer: "I can't sing.", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ còn thiếu: 'He ___ play the guitar.'", options: [], answer: "can", type: "cloze" },
  ],

  practiceTranslate: [
    { id: "pt10-1", prompt_vn: "Tôi có thể nói tiếng Anh một chút.", answer: "I can speak a little English." },
    { id: "pt10-2", prompt_vn: "Anh ấy không thể lái xe.", answer: "He can't drive a car." },
    { id: "pt10-3", prompt_vn: "Bạn có thể giúp tôi không?", answer: "Can you help me?" },
  ],
  quiz: [
    { id: "q1", question: "Câu hỏi đúng về khả năng:", options: ["Do you can cook?", "Are you can cook?", "Can you cook?", "You can cook?"], answer: "Can you cook?", type: "multiple-choice" },
    { id: "q2", question: "Lỗi nào SAI?", options: ["I can swim.", "She can't drive.", "He cans sing.", "Can you speak English?"], answer: "He cans sing.", type: "multiple-choice" },
    { id: "q3", question: "Câu nào ĐÚNG?", options: ["She can speaks French.", "She can speak French.", "She cans speak French.", "She is can speak French."], answer: "She can speak French.", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: 'I ___ drive a car but I can ride a bike.'", options: [], answer: "can't", type: "cloze" },
    { id: "q5", question: "Điền từ: '___ you speak any other languages?'", options: [], answer: "Can", type: "cloze" },
    { id: "q6", question: "Anh ấy có thể hát và chơi guitar.", options: [], answer: "He can sing and play the guitar.", type: "translate" },
    { id: "q7", question: "Bạn có thể nói tiếng Anh không?", options: [], answer: "Can you speak English?", type: "translate" },
  ],
  scrambleExercises: [
    {
      id: "s10-1",
      prompt_vn: "Tôi có thể nói tiếng Anh rất tốt.",
      words: ["I", "can", "speak", "English", "very", "well", "."],
      answer: "I can speak English very well .",
    },
    {
      id: "s10-2",
      prompt_vn: "Cô ấy không thể lái xe ô tô.",
      words: ["She", "can't", "drive", "a", "car", "."],
      answer: "She can't drive a car .",
    },
    {
      id: "s10-3",
      prompt_vn: "Bạn có thể nấu ăn Việt Nam không?",
      words: ["Can", "you", "cook", "Vietnamese", "food", "?"],
      answer: "Can you cook Vietnamese food ?",
    },
  ],
  cumulativeReviewQuestions: [
    {
      id: "cr10-1",
      question: "Điền giới từ đúng: 'The bank is ___ the post office.' (ở cạnh) — Unit 9",
      options: ["opposite", "next to", "between", "near"],
      answer: "next to",
      type: "multiple-choice",
    },
    {
      id: "cr10-2",
      question: "Đi thẳng và rẽ trái tại đèn giao thông. (Unit 9)",
      options: [],
      answer: "Go straight and turn left at the traffic light.",
      type: "translate",
    },
  ],
};

export default unit10;
