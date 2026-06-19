import { UnitData } from "@/components/learn/UnitTemplate";

export const unit3: UnitData = {
  unitId: "unit-3",
  title: "Unit 3: Family & Friends",
  level: "A1",
  xp: 80,
  estimatedTime: 45,
  description: "Học từ vựng mô tả gia đình, bạn bè và cách sử dụng đại từ sở hữu cơ bản.",
  badgeName: "Người Thân Thiện",
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
      word: "mother",
      phonetic: "/ˈmʌð.ər/",
      meaning: "Mẹ",
      example: "My mother is a teacher.",
      audio: "/audio/unit3/mother.mp3"
    },
    {
      id: 2,
      word: "father",
      phonetic: "/ˈfɑː.ðər/",
      meaning: "Bố",
      example: "My father loves cooking.",
      audio: "/audio/unit3/father.mp3"
    },
    {
      id: 3,
      word: "brother",
      phonetic: "/ˈbrʌð.ər/",
      meaning: "Anh/Em trai",
      example: "I have one older brother.",
      audio: "/audio/unit3/brother.mp3"
    },
    {
      id: 4,
      word: "sister",
      phonetic: "/ˈsɪs.tər/",
      meaning: "Chị/Em gái",
      example: "She is my younger sister.",
      audio: "/audio/unit3/sister.mp3"
    },
    {
      id: 5,
      word: "parents",
      phonetic: "/ˈpeə.rənts/",
      meaning: "Bố mẹ",
      example: "My parents live in Da Nang.",
      audio: "/audio/unit3/parents.mp3"
    },
    {
      id: 6,
      word: "friend",
      phonetic: "/frend/",
      meaning: "Bạn bè",
      example: "We are good friends.",
      audio: "/audio/unit3/friend.mp3"
    },
    {
      id: 7,
      word: "classmate",
      phonetic: "/ˈklɑːs.meɪt/",
      meaning: "Bạn cùng lớp",
      example: "Minh is my classmate.",
      audio: "/audio/unit3/classmate.mp3"
    },
    {
      id: 8,
      word: "happy",
      phonetic: "/ˈhæp.i/",
      meaning: "Hạnh phúc",
      example: "They are a happy family.",
      audio: "/audio/unit3/happy.mp3"
    },
    {
      id: 9,
      word: "my",
      phonetic: "/maɪ/",
      meaning: "Của tôi",
      example: "This is my book.",
      audio: "/audio/unit3/my.mp3"
    },
    {
      id: 10,
      word: "your",
      phonetic: "/jɔːr/",
      meaning: "Của bạn",
      example: "What is your phone number?",
      audio: "/audio/unit3/your.mp3"
    },
    {
      id: 11,
      word: "his",
      phonetic: "/hɪz/",
      meaning: "Của anh ấy",
      example: "His name is Peter.",
      audio: "/audio/unit3/his.mp3"
    },
    {
      id: 12,
      word: "her",
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
    }
  ],
  speaking: {
    level1Prompt: "This is my mother. Her name is {input}.",
    level1Placeholder: "Ví dụ: Lan",
    level2Situation: "Hãy giới thiệu một thành viên trong gia đình bạn (bố, mẹ, anh hoặc em) cho giáo viên nghe.",
    level2Hint: "This is my father. His name is [tên]. He is [tuổi] years old and he is very kind."
  },
  quiz: [
    {
      id: "q1",
      question: "Từ nào có nghĩa là 'Bố mẹ'?",
      options: ["Brothers", "Sisters", "Parents", "Classmates"],
      answer: "Parents",
      type: "multiple-choice"
    },
    {
      id: "q2",
      question: "Đại từ sở hữu 'Của cô ấy' là gì?",
      options: ["His", "Her", "My", "Your"],
      answer: "Her",
      type: "multiple-choice"
    },
    {
      id: "q3",
      question: "Từ nào có nghĩa là 'Bạn cùng lớp'?",
      options: ["Friend", "Classmate", "Brother", "Sister"],
      answer: "Classmate",
      type: "multiple-choice"
    },
    {
      id: "q4",
      question: "Điền từ còn thiếu: 'This is my brother. ___ name is Tom.'",
      options: ["His", "Her", "My", "Your"],
      answer: "His",
      type: "multiple-choice"
    },
    {
      id: "q5",
      question: "Tom: 'Who is that?' - Anna: 'That is ___ best friend, Lucy.'",
      options: ["my", "his", "her", "their"],
      answer: "my",
      type: "multiple-choice"
    }
  ]
};

export default unit3;
