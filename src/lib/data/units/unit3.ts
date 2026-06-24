import { UnitData } from "@/components/learn/UnitTemplate";

export const unit3: UnitData = {
  unitId: "unit-3",
  title: "Unit 3: Family & Friends",
  level: "A1",
  xp: 80,
  estimatedTime: 45,
  description: "Học từ vựng mô tả gia đình, bạn bè và cách sử dụng đại từ sở hữu cơ bản.",
  badgeName: "Người Thân Thiện",
  situation: "Đồng nghiệp nước ngoài hỏi bạn về gia đình trong buổi teambuilding — bạn cần mô tả các thành viên và mối quan hệ.",
  learningOutcomes: [
    "Giới thiệu và mô tả các thành viên trong gia đình",
    "Dùng đại từ sở hữu my/your/his/her/our/their đúng",
    "Kể về bạn bè thân thiết một cách tự nhiên"
  ],
  badgeEmoji: "👥",
  warmupGreetings: [
    {
      emoji: "👨‍👩‍👧‍👦",
      en: "This is my family.",
      vn: "Đây là gia đình của tôi.",
      context: "Giới thiệu gia đình"
    },
    {
      emoji: "🤝",
      en: "She is my best friend.",
      vn: "Cô ấy là bạn thân của tôi.",
      context: "Giới thiệu bạn bè"
    },
    {
      emoji: "🏠",
      en: "Where does your family live?",
      vn: "Gia đình bạn sống ở đâu?",
      context: "Hỏi về nơi sống của gia đình"
    }
  ],
  culturalNote: "Trong tiếng Anh, từ <span class=\"text-emerald-400 font-semibold\">family</span> có thể đi với động từ số ít hoặc số nhiều tùy thuộc vào việc bạn muốn nói về gia đình như một tổ ấm tập thể hay nói về từng cá nhân trong gia đình đó. Cả hai cách dùng đều được chấp nhận rộng rãi!",
  vocab: [
    {
      id: 1,
      word: "mother", emoji: "👩",
      phonetic: "/ˈmʌð.ər/",
      meaning: "Mẹ",
      example: "My mother is a teacher.",
      audio: "/audio/unit3/mother.mp3"
    , l1_interference_vn: "⚠️ Âm /ð/ trong 'mo-THER' — lưỡi chạm răng có rung. Người Việt hay đọc thành /mɒdər/." },
    {
      id: 2,
      word: "father", emoji: "👨",
      phonetic: "/ˈfɑː.ðər/",
      meaning: "Bố",
      example: "My father loves cooking.",
      audio: "/audio/unit3/father.mp3"
    , l1_interference_vn: "⚠️ Âm /ð/ trong 'fa-THER'. Âm /f/ đầu cũng hay bị đọc thành /ph/ như tiếng Việt." },
    {
      id: 3,
      word: "brother", emoji: "👦",
      phonetic: "/ˈbrʌð.ər/",
      meaning: "Anh/Em trai",
      example: "I have one older brother.",
      audio: "/audio/unit3/brother.mp3"
    , l1_interference_vn: "⚠️ 'Brother' = cả anh lẫn em trai. Cần 'older/younger brother' để phân biệt như tiếng Việt." },
    {
      id: 4,
      word: "sister", emoji: "👧",
      phonetic: "/ˈsɪs.tər/",
      meaning: "Chị/Em gái",
      example: "She is my younger sister.",
      audio: "/audio/unit3/sister.mp3"
    , l1_interference_vn: "⚠️ 'Sister' = cả chị lẫn em gái. Thêm 'older/younger sister' khi cần phân biệt." },
    {
      id: 5,
      word: "parents", emoji: "👨‍👩‍👧",
      phonetic: "/ˈpeə.rənts/",
      meaning: "Bố mẹ",
      example: "My parents live in Da Nang.",
      audio: "/audio/unit3/parents.mp3"
    , l1_interference_vn: "⚠️ 'Parents' luôn số nhiều — không nói 'my parent' để chỉ cả bố và mẹ." },
    {
      id: 6,
      word: "friend", emoji: "🤝",
      phonetic: "/frend/",
      meaning: "Bạn bè",
      example: "We are good friends.",
      audio: "/audio/unit3/friend.mp3"
    },
    {
      id: 7,
      word: "classmate", emoji: "🧑‍🎓",
      phonetic: "/ˈklɑːs.meɪt/",
      meaning: "Bạn cùng lớp",
      example: "Minh is my classmate.",
      audio: "/audio/unit3/classmate.mp3"
    },
    {
      id: 8,
      word: "happy", emoji: "😊",
      phonetic: "/ˈhæp.i/",
      meaning: "Hạnh phúc",
      example: "They are a happy family.",
      audio: "/audio/unit3/happy.mp3"
    },
    {
      id: 9,
      word: "my", emoji: "🏷️",
      phonetic: "/maɪ/",
      meaning: "Của tôi",
      example: "This is my book.",
      audio: "/audio/unit3/my.mp3"
    },
    {
      id: 10,
      word: "your", emoji: "👉",
      phonetic: "/jɔːr/",
      meaning: "Của bạn",
      example: "What is your phone number?",
      audio: "/audio/unit3/your.mp3"
    },
    {
      id: 11,
      word: "his", emoji: "👨",
      phonetic: "/hɪz/",
      meaning: "Của anh ấy",
      example: "His name is Peter.",
      audio: "/audio/unit3/his.mp3"
    },
    {
      id: 12,
      word: "her", emoji: "👩",
      phonetic: "/hɜːr/",
      meaning: "Của cô ấy",
      example: "Her hair is brown.",
      audio: "/audio/unit3/her.mp3"
    }
  ],
  dialogues: [
    {
      id: 1,
      title: "Hội thoại: Meet My Family",
      audio: "/audio/unit3/dialogue1.mp3",
      desc: "Tom và Anna trò chuyện về bức ảnh chụp gia đình của Anna.",
      lines: [
        {
          id: "l1",
          speaker: "Tom",
          text: "Who is that in the photo, Anna?",
          translation: "Ai trong ảnh đấy Anna?"
        },
        {
          id: "l2",
          speaker: "Anna",
          text: "This is my mother, and this is my father.",
          translation: "Đây là mẹ tớ, còn đây là bố tớ."
        },
        {
          id: "l3",
          speaker: "Tom",
          text: "They look very happy! Do you have any brothers or sisters?",
          translation: "Họ trông hạnh phúc thật đấy! Cậu có anh hay em gái không?"
        },
        {
          id: "l4",
          speaker: "Anna",
          text: "Yes, I have one younger brother. His name is Ben.",
          translation: "Có, tớ có một em trai. Tên em ấy là Ben."
        },
        {
          id: "l5",
          speaker: "Tom",
          text: "How old is he?",
          translation: "Em ấy bao nhiêu tuổi rồi?"
        },
        {
          id: "l6",
          speaker: "Anna",
          text: "He is ten years old. He is very friendly.",
          translation: "Em ấy 10 tuổi rồi. Em ấy thân thiện lắm."
        }
      ]
    }
  ],
  listenAndChoose: [
    {
      id: "lc1",
      audio_text: "My mother is a doctor.",
      options: ["Mẹ tôi là bác sĩ", "Mẹ tôi là giáo viên", "Bố tôi là bác sĩ", "Bố tôi là giáo viên"],
      answer: "Mẹ tôi là bác sĩ"
    },
    {
      id: "lc2",
      audio_text: "His name is Ben and he is ten.",
      options: ["Ben 9 tuổi", "Ben 10 tuổi", "Ben 11 tuổi", "Ben 12 tuổi"],
      answer: "Ben 10 tuổi"
    },
    {
      id: "lc3",
      audio_text: "This is her sister, Lucy.",
      options: ["Lucy là em trai cô ấy", "Lucy là chị gái cô ấy", "Lucy là bạn cô ấy", "Lucy là mẹ cô ấy"],
      answer: "Lucy là chị gái cô ấy"
    },
    {
      id: "lc4",
      audio_text: "My brother is a student.",
      options: ["Anh trai tôi là học sinh", "Em trai tôi là bác sĩ", "Bố tôi là học sinh", "Anh trai tôi là giáo viên"],
      answer: "Anh trai tôi là học sinh"
    },
    {
      id: "lc5",
      audio_text: "Her parents live in Ha Noi.",
      options: ["Bố mẹ cô ấy sống ở Hà Nội", "Bố mẹ cô ấy sống ở Đà Nẵng", "Bạn bè cô ấy sống ở Hà Nội", "Bố mẹ anh ấy sống ở Hà Nội"],
      answer: "Bố mẹ cô ấy sống ở Hà Nội"
    }
  ],
  speaking: {
    level1Prompt: "This is my mother. Her name is {input}.",
    level1Placeholder: "Ví dụ: Lan",
    level2Situation: "Hãy giới thiệu một thành viên trong gia đình bạn (bố, mẹ, anh hoặc em) cho giáo viên nghe.",
    level2Hint: "This is my father. His name is [tên]. He is [tuổi] years old and he is very kind."
  },

  grammar: {
    title: "Đại từ sở hữu — Possessive Adjectives",
    rule: "my / your / his / her / our / their + danh từ",
    conjugation: [
      { subject: "I", form: "my", example: "My name is Minh." },
      { subject: "You", form: "your", example: "What is your brother's name?" },
      { subject: "He", form: "his", example: "His sister is very kind." },
      { subject: "She", form: "her", example: "Her mother is a doctor." },
      { subject: "We / They", form: "our / their", example: "Their parents live in Hanoi." },
    ],
    examples: [
      { en: "This is my family.", vn: "Đây là gia đình của tôi." },
      { en: "His name is Ben.", vn: "Tên anh ấy là Ben." },
      { en: "Her hair is beautiful.", vn: "Tóc của cô ấy rất đẹp." },
      { en: "Their house is big.", vn: "Nhà của họ rất to." },
    ],
    tip: "Đại từ sở hữu luôn đứng TRƯỚC danh từ. Không bao giờ nói 'name his is Ben' — phải là 'his name is Ben'.",
    vnNote: "⚠️ Lưu ý: Tiếng Việt dùng từ sở hữu SAU danh từ ('bàn của tôi'). Tiếng Anh đặt TRƯỚC: 'my table'. Không bao giờ nói 'the book of me' — phải nói 'my book'.",
    dialogueExample: {
      speaker: "Anna",
      text: "His name is Ben. He is my best friend.",
      translation: "Tên anh ấy là Ben. Anh ấy là bạn thân nhất của mình.",
      highlight: "my best friend",
    },
    ccq: {
      question: "Điền vào chỗ trống: '___ name is Lucy.' (của cô ấy)",
      options: ["My", "His", "Her", "Their"],
      answer: "Her",
    },
  },

  matchingExercise: {
    title: "Nối đại từ sở hữu với chủ ngữ tương ứng",
    pairs: [
      { left: "I → ___", right: "my" },
      { left: "He → ___", right: "his" },
      { left: "She → ___", right: "her" },
      { left: "They → ___", right: "their" },
      { left: "We → ___", right: "our" },
    ],
  },

  practiceQuiz: [
    { id: "pq1", question: "Điền đại từ đúng: 'This is ___ mother.' (của tôi)", options: ["my", "his", "her", "your"], answer: "my", type: "multiple-choice" },
    { id: "pq2", question: "Đại từ sở hữu của 'She' là gì?", options: ["his", "my", "her", "their"], answer: "her", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ còn thiếu: 'His ___ is Tom.' (tên)", options: [], answer: "name", type: "cloze" },
  ],

  practiceTranslate: [
    { id: "pt3-1", prompt_vn: "Đây là em gái tôi.", answer: "This is my sister." },
    { id: "pt3-2", prompt_vn: "Bố tôi là giáo viên.", answer: "My father is a teacher." },
    { id: "pt3-3", prompt_vn: "Chúng tôi có một gia đình nhỏ.", answer: "We have a small family." },
  ],


  quiz: [
    {
      id: "q1",
      question: "Từ nào có nghĩa là 'Bố mẹ'?",
      options: ["Brothers", "Sisters", "Parents", "Classmates"],
      answer: "Parents",
      type: "multiple-choice",
      explanation_vn: "'Parents' = bố mẹ. Brothers = anh/em trai, Sisters = chị/em gái, Classmates = bạn cùng lớp.",
    },
    {
      id: "q2",
      question: "Đại từ sở hữu 'Của cô ấy' là gì?",
      options: ["His", "Her", "My", "Your"],
      answer: "Her",
      type: "multiple-choice",
      explanation_vn: "'Của cô ấy' = 'her' (nữ). His = của anh ấy, My = của tôi, Your = của bạn.",
    },
    {
      id: "q3",
      question: "Từ nào có nghĩa là 'Bạn cùng lớp'?",
      options: ["Friend", "Classmate", "Brother", "Sister"],
      answer: "Classmate",
      type: "multiple-choice",
      explanation_vn: "'Classmate' = bạn cùng lớp. 'Friend' là bạn bè nói chung, không nhất thiết cùng lớp.",
    },
    {
      id: "q4",
      question: "Điền từ còn thiếu: 'This is my brother. ___ name is Tom.'",
      options: [],
      answer: "His",
      type: "cloze"
    },
    {
      id: "q5",
      question: "Tom: 'Who is that?' - Anna: 'That is ___ best friend, Lucy.'",
      options: ["my", "his", "her", "their"],
      answer: "my",
      type: "multiple-choice",
      explanation_vn: "Anna nói về bạn CỦA MÌNH → dùng 'my'. 'Her' là bạn của người khác.",
    },
    { id: "q6", question: "Mẹ tôi là một giáo viên.", options: [], answer: "My mother is a teacher.", type: "translate" },
    { id: "q7", question: "Anh trai của tôi là bác sĩ.", options: [], answer: "My brother is a doctor.", type: "translate" },
  ],

  listenAndArrangeExercises: [
    {
      id: "la3-1",
      audio_text: "She is a nurse and she works at a hospital.",
      prompt_vn: "Cô ấy là y tá và làm việc ở bệnh viện.",
      words: ["She", "is", "a", "nurse", "and", "she", "works", "at", "a", "hospital", ".", "doctor", "he"],
      answer: "She is a nurse and she works at a hospital .",
    },
    {
      id: "la3-2",
      audio_text: "What do you do for a living?",
      prompt_vn: "Bạn làm nghề gì?",
      words: ["What", "do", "you", "do", "for", "a", "living", "?", "does", "work"],
      answer: "What do you do for a living ?",
    },
  ],


  wordBankExercises: [
    {
      id: "wb1",
      prompt_vn: "Mẹ tôi là giáo viên.",
      words: ["My", "mother", "is", "a", "teacher", ".", "was", "were"],
      answer: "My mother is a teacher .",
    },
    {
      id: "wb2",
      prompt_vn: "Anh ấy có hai em gái.",
      words: ["He", "has", "two", "younger", "sisters", ".", "was", "were"],
      answer: "He has two younger sisters .",
    },
    {
      id: "wb3",
      prompt_vn: "Đây là bạn thân nhất của tôi.",
      words: ["This", "is", "my", "best", "friend", ".", "was", "were"],
      answer: "This is my best friend .",
    },
  ],

  scrambleExercises: [
    {
      id: "s3-1",
      prompt_vn: "Mẹ tôi là giáo viên.",
      words: ["My", "mother", "is", "a", "teacher", "."],
      answer: "My mother is a teacher .",
    },
    {
      id: "s3-2",
      prompt_vn: "Anh ấy có hai em gái.",
      words: ["He", "has", "two", "younger", "sisters", "."],
      answer: "He has two younger sisters .",
    },
    {
      id: "s3-3",
      prompt_vn: "Đây là bạn thân nhất của tôi.",
      words: ["This", "is", "my", "best", "friend", "."],
      answer: "This is my best friend .",
    },
  ],

  sentenceCorrectionExercises: [
    {
      id: "sc3-1",
      sentence: "His name are Tom.",
      errorWord: "are",
      correction: "is",
      explanation_vn: "'His name' là chủ ngữ số ít → dùng 'IS'. 'Are' dùng cho you/we/they (số nhiều).",
    },
    {
      id: "sc3-2",
      sentence: "I have two younger sister.",
      errorWord: "sister",
      correction: "sisters",
      explanation_vn: "'Two' (số nhiều) → danh từ phải thêm 's': 'two sisters'. 'Sister' là số ít (chỉ 1 người).",
    },
  ],

  cumulativeReviewQuestions: [
    {
      id: "cr3-1",
      question: "Chọn dạng đúng: 'She ___ to school every day.' (Unit 2: Present Simple)",
      options: ["go", "goes", "going", "gone"],
      answer: "goes",
      type: "multiple-choice",
    },
    {
      id: "cr3-2",
      question: "Cô ấy đi làm bằng xe buýt mỗi ngày.",
      options: [],
      answer: "She goes to work by bus every day.",
      type: "translate",
    },
  ],

  fluencyDrill: {
    items: [
      { en: "my family", vn: "gia đình của tôi" },
      { en: "his job", vn: "công việc của anh ấy" },
      { en: "her name", vn: "tên của cô ấy" },
      { en: "our team", vn: "đội của chúng tôi" },
      { en: "their office", vn: "văn phòng của họ" },
      { en: "my colleague", vn: "đồng nghiệp của tôi" },
      { en: "your boss", vn: "sếp của bạn" },
      { en: "our company", vn: "công ty của chúng tôi" },
    ],
  },

  readingPassage: {
    id: "unit3-reading-1",
    title: "My Family",
    title_vn: "Đọc đoạn giới thiệu về gia đình",
    level: "A1" as const,
    text:
      "My name is Hoa. I have a small family. " +
      "My father is a doctor. His name is Minh. " +
      "My mother is a teacher. Her name is Lan. " +
      "I have one brother. His name is Nam. He is a student. " +
      "We live together in a house in Da Nang. " +
      "We are a happy family!",
    questions: [
      {
        id: "u3r-q1",
        question_vn: "Bố của Hoa làm nghề gì?",
        options: ["A teacher", "A doctor", "An engineer", "A student"],
        answer: "A doctor",
        explanation_vn: "Đoạn văn nói 'My father is a doctor.'",
      },
      {
        id: "u3r-q2",
        question_vn: "Tên của mẹ Hoa là gì?",
        options: ["Minh", "Nam", "Hoa", "Lan"],
        answer: "Lan",
        explanation_vn: "Đoạn văn nói 'My mother\'s name is Lan.'",
      },
      {
        id: "u3r-q3",
        question_vn: "Nam đang làm gì?",
        options: ["Working at a hospital", "Teaching at a school", "Studying as a student", "Living in Hanoi"],
        answer: "Studying as a student",
        explanation_vn: "Đoạn văn nói 'He is a student.'",
      },
      {
        id: "u3r-q4",
        question_vn: "Gia đình Hoa sống ở đâu?",
        options: ["Hanoi", "Ho Chi Minh City", "Hue", "Da Nang"],
        answer: "Da Nang",
        explanation_vn: "Đoạn văn nói 'We live together in a house in Da Nang.'",
      },
    ],
  },
  shadowingVideoId: "8U40yQ7IVqY", // BBC Learning English — Daily Routines
};

export default unit3;