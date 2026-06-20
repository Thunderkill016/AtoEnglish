import { UnitData } from "@/components/learn/UnitTemplate";

export const unit4: UnitData = {
  unitId: "unit-4",
  title: "Unit 4: Technology & Society",
  level: "B1",
  xp: 80,
  estimatedTime: 50,
  description: "Phân tích cấu trúc câu nâng cao và ý nghĩa của động từ khuyết thiếu trong văn cảnh thời đại số. Thực hành diễn đạt ý kiến trái chiều về tiến bộ công nghệ.",
  badgeName: "Nhà Công Nghệ",
  badgeEmoji: "💻",
  warmupGreetings: [
    {
      emoji: "🤖",
      en: "Artificial intelligence is changing the world.",
      vn: "Trí tuệ nhân tạo đang thay đổi thế giới.",
      context: "Nói về công nghệ"
    },
    {
      emoji: "📱",
      en: "Smartphones are omnipresent nowadays.",
      vn: "Điện thoại thông minh hiện nay có mặt ở khắp mọi nơi.",
      context: "Sự phổ biến của điện thoại"
    },
    {
      emoji: "🚀",
      en: "New innovations revolutionize our lives.",
      vn: "Những đổi mới mới cách mạng hóa cuộc sống của chúng ta.",
      context: "Sự thay đổi của cuộc sống"
    }
  ],
  culturalNote: "Trong văn hóa phương Tây, các cuộc thảo luận về công nghệ thường đi kèm với các câu hỏi về đạo đức (ethics) và bảo mật dữ liệu riêng tư (data privacy). Hãy học cách bày tỏ quan điểm cá nhân một cách cởi mở nhưng tôn trọng sự riêng tư của người khác nhé!",
  vocab: [
    {
      id: 1,
      word: "artificial intelligence",
      phonetic: "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/",
      meaning: "Trí tuệ nhân tạo",
      example: "AI has become a part of our daily lives.",
      audio: "/audio/unit4/artificial_intelligence.mp3"
    },
    {
      id: 2,
      word: "omnipresent",
      phonetic: "/ˌɒm.nɪˈprez.ənt/",
      meaning: "Có mặt ở khắp mọi nơi",
      example: "Smartphones have become omnipresent in modern society.",
      audio: "/audio/unit4/omnipresent.mp3"
    },
    {
      id: 3,
      word: "revolutionize",
      phonetic: "/ˌrev.əˈluː.ʃən.aɪz/",
      meaning: "Cách mạng hóa",
      example: "AI will revolutionize how we learn languages.",
      audio: "/audio/unit4/revolutionize.mp3"
    },
    {
      id: 4,
      word: "ethics",
      phonetic: "/ˈeθ.ɪks/",
      meaning: "Đạo đức",
      example: "We need to discuss the ethics of artificial intelligence.",
      audio: "/audio/unit4/ethics.mp3"
    },
    {
      id: 5,
      word: "security",
      phonetic: "/sɪˈkjʊə.rə.ti/",
      meaning: "Bảo mật / An ninh",
      example: "Data security is very important online.",
      audio: "/audio/unit4/security.mp3"
    },
    {
      id: 6,
      word: "algorithm",
      phonetic: "/ˈæl.ɡə.rɪ.ðəm/",
      meaning: "Thuật toán",
      example: "The search engine uses a complex algorithm.",
      audio: "/audio/unit4/algorithm.mp3"
    },
    {
      id: 7,
      word: "integrate",
      phonetic: "/ˈɪn.tɪ.ɡreɪt/",
      meaning: "Tích hợp",
      example: "We should integrate technology into our classroom.",
      audio: "/audio/unit4/integrate.mp3"
    },
    {
      id: 8,
      word: "fabric",
      phonetic: "/ˈfæb.rɪk/",
      meaning: "Cấu trúc / Sợi vải",
      example: "Technology is woven into our social fabric.",
      audio: "/audio/unit4/fabric.mp3"
    }
  ],
  dialogues: [
    {
      id: 1,
      title: "Hội thoại: The Rise of AI",
      audio: "/audio/unit4/dialogue1.mp3",
      desc: "Alex và Sarah tranh luận về lợi ích và thách thức của trí tuệ nhân tạo.",
      lines: [
        {
          id: "l1",
          speaker: "Alex",
          text: "AI is becoming omnipresent in our lives.",
          translation: "AI đang trở nên phổ biến ở khắp mọi nơi trong cuộc sống chúng ta."
        },
        {
          id: "l2",
          speaker: "Sarah",
          text: "Yes, it will revolutionize how we work.",
          translation: "Đúng vậy, nó sẽ cách mạng hóa cách chúng ta làm việc."
        },
        {
          id: "l3",
          speaker: "Alex",
          text: "But what about job security and ethics?",
          translation: "Nhưng còn về bảo mật việc làm và đạo đức thì sao?"
        },
        {
          id: "l4",
          speaker: "Sarah",
          text: "We need clear rules to guide technology.",
          translation: "Chúng ta cần các quy tắc rõ ràng để định hướng công nghệ."
        }
      ]
    }
  ],
  listenAndChoose: [
    {
      id: "lc1",
      audio_text: "AI has become omnipresent in modern society.",
      options: ["AI có mặt ở khắp mọi nơi", "AI chỉ dành cho chuyên gia", "AI là công nghệ tương lai", "AI chưa phổ biến"],
      answer: "AI có mặt ở khắp mọi nơi"
    },
    {
      id: "lc2",
      audio_text: "We must protect our data security.",
      options: ["Phải bảo vệ môi trường", "Phải bảo mật dữ liệu", "Phải phát triển thuật toán", "Phải học lập trình"],
      answer: "Phải bảo mật dữ liệu"
    },
    {
      id: "lc3",
      audio_text: "Technology will revolutionize how we learn.",
      options: ["Công nghệ thay đổi cách ta học", "Công nghệ làm giảm tương tác", "Ta phải học công nghệ", "Học tập không cần công nghệ"],
      answer: "Công nghệ thay đổi cách ta học"
    }
  ],
  speaking: {
    level1Prompt: "Technology will revolutionize how we {input}.",
    level1Placeholder: "Ví dụ: learn / work / communicate",
    level2Situation: "Hãy chia sẻ quan điểm của bạn về lợi ích của trí tuệ nhân tạo đối với việc học tập.",
    level2Hint: "AI is very useful. It helps me translate sentences and practice English speaking anytime."
  },

  grammar: {
    title: "Modal Verbs — Động từ khuyết thiếu",
    rule: "Subject + modal (can/should/must/will) + verb (base form)",
    conjugation: [
      { subject: "can", form: "khả năng / cho phép", example: "AI can translate languages instantly." },
      { subject: "should", form: "lời khuyên", example: "We should protect our data." },
      { subject: "must", form: "bắt buộc / mạnh", example: "Developers must consider ethics." },
      { subject: "will", form: "tương lai", example: "Technology will change our lives." },
    ],
    examples: [
      { en: "You can use AI to learn faster.", vn: "Bạn có thể dùng AI để học nhanh hơn." },
      { en: "We should discuss the ethics of AI.", vn: "Chúng ta nên thảo luận về đạo đức của AI." },
      { en: "Companies must protect user data.", vn: "Các công ty phải bảo vệ dữ liệu người dùng." },
      { en: "AI will revolutionize healthcare.", vn: "AI sẽ cách mạng hóa ngành y tế." },
    ],
    tip: "Sau modal verb, LUÔN dùng động từ nguyên thể (base form). Không nói 'can changes' — phải là 'can change'.",
  },

  matchingExercise: {
    title: "Nối từ công nghệ với nghĩa tiếng Việt",
    pairs: [
      { left: "Algorithm", right: "Thuật toán" },
      { left: "Security", right: "Bảo mật" },
      { left: "Ethics", right: "Đạo đức" },
      { left: "Integrate", right: "Tích hợp" },
      { left: "Revolutionize", right: "Cách mạng hóa" },
    ],
  },

  practiceQuiz: [
    { id: "pq1", question: "Chọn modal verb đúng: 'We ___ discuss the ethics of AI.' (lời khuyên)", options: ["can", "should", "must", "will"], answer: "should", type: "multiple-choice" },
    { id: "pq2", question: "Sau modal verb, động từ ở dạng nào?", options: ["V-ing", "V-ed", "Base form", "V-s"], answer: "Base form", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ còn thiếu: 'AI ___ translate any language.' (khả năng)", options: [], answer: "can", type: "cloze" },
  ],

  quiz: [
    {
      id: "q1",
      question: "Từ nào có nghĩa là 'Trí tuệ nhân tạo'?",
      options: ["Artificial intelligence", "Social media", "Cybersecurity", "Virtual reality"],
      answer: "Artificial intelligence",
      type: "multiple-choice"
    },
    {
      id: "q2",
      question: "Từ 'omnipresent' có nghĩa là gì?",
      options: ["Hiếm gặp", "Có mặt khắp nơi", "Tương lai", "Lỗi thời"],
      answer: "Có mặt khắp nơi",
      type: "multiple-choice"
    },
    {
      id: "q3",
      question: "Chọn câu đúng với modal verb:",
      options: ["AI can changes our lives.", "AI can change our lives.", "AI cans change our lives.", "AI can changing our lives."],
      answer: "AI can change our lives.",
      type: "multiple-choice"
    },
    {
      id: "q4",
      question: "Điền từ còn thiếu: 'Companies ___ protect user data.' (bắt buộc)",
      options: [],
      answer: "must",
      type: "cloze"
    },
    {
      id: "q5",
      question: "Alex: 'Do you support AI?' - Sarah: 'Yes, but we must discuss its ___.'",
      options: ["ethics", "fabric", "phone", "cloth"],
      answer: "ethics",
      type: "multiple-choice"
    }
  ]
};

export default unit4;
