import { UnitData } from "@/components/learn/UnitTemplate";

export const unit17: UnitData = {
  unitId: "unit-17",
  title: "Unit 17: Experiences & Present Perfect",
  level: "A2",
  xp: 90,
  estimatedTime: 45,
  description: "Học Present Perfect để nói về kinh nghiệm sống và thành tích của bản thân.",
  badgeName: "Người Nhiều Trải Nghiệm",
  badgeEmoji: "🌟",
  situation: "Buổi phỏng vấn xin việc hoặc buổi trà dư tửu hậu với đội nhóm quốc tế. Bạn cần chia sẻ về kinh nghiệm, những nơi bạn đã đến, và những thành tích bạn đã đạt được.",
  learningOutcomes: [
    "Nói về kinh nghiệm trong cuộc sống bằng Present Perfect",
    "Phân biệt Present Perfect với Past Simple",
    "Hỏi về kinh nghiệm của người khác một cách tự nhiên"
  ],
  warmupGreetings: [
    { emoji: "🌍", en: "Have you ever traveled abroad?", vn: "Bạn đã từng đi nước ngoài chưa?", context: "Hỏi về kinh nghiệm" },
    { emoji: "🏆", en: "I've won a sales award three times.", vn: "Tôi đã giành được giải thưởng bán hàng ba lần.", context: "Thành tích" },
    { emoji: "🍣", en: "I have never eaten sushi before.", vn: "Tôi chưa bao giờ ăn sushi.", context: "Chưa từng làm gì" }
  ],
  culturalNote: "Present Perfect (<span class=\"text-emerald-400 font-semibold\">have/has + past participle</span>) thường gây nhầm lẫn cho người học tiếng Việt vì tiếng Việt không có thì này. Quy tắc nhớ nhanh: dùng Present Perfect khi <strong>thời điểm cụ thể không quan trọng</strong>, chỉ quan trọng là <strong>đã từng làm chưa</strong>. Ngược lại, Past Simple dùng khi có thời điểm cụ thể.",
  vocab: [
    { id: 1, word: "experience", emoji: "🌟", phonetic: "/ɪkˈspɪəriəns/", meaning: "kinh nghiệm / trải nghiệm", example: "I have three years of experience in marketing.", example2: "It was an amazing experience.", collocation: "work experience / life experience", audio: "/audio/unit17/experience.mp3" },
    { id: 2, word: "ever", emoji: "❓", phonetic: "/ˈevər/", meaning: "từng / bao giờ", example: "Have you ever worked abroad?", example2: "It's the best meal I've ever had!", collocation: "have you ever / best ever", audio: "/audio/unit17/ever.mp3" },
    { id: 3, word: "never", emoji: "❌", phonetic: "/ˈnevər/", meaning: "chưa bao giờ", example: "I have never been to Europe.", example2: "She has never tried Vietnamese coffee.", collocation: "have never / never before", audio: "/audio/unit17/never.mp3" },
    { id: 4, word: "already", emoji: "✅", phonetic: "/ɔːlˈredi/", meaning: "đã (rồi)", example: "I've already sent the report.", example2: "She has already left the office.", collocation: "have already / already done", audio: "/audio/unit17/already.mp3" },
    { id: 5, word: "yet", emoji: "⏳", phonetic: "/jet/", meaning: "chưa / rồi chưa (trong câu hỏi)", example: "Have you finished yet?", example2: "I haven't replied yet.", collocation: "not yet / have you... yet", audio: "/audio/unit17/yet.mp3" },
    { id: 6, word: "just", emoji: "⚡", phonetic: "/dʒʌst/", meaning: "vừa mới", example: "I've just arrived at the office.", example2: "She has just sent the email.", collocation: "have just / just finished", audio: "/audio/unit17/just.mp3" },
    { id: 7, word: "achieve", emoji: "🏆", phonetic: "/əˈtʃiːv/", meaning: "đạt được", example: "She has achieved excellent results.", example2: "I've achieved my sales target.", collocation: "achieve a goal / achieve results", audio: "/audio/unit17/achieve.mp3" },
    { id: 8, word: "since", emoji: "📅", phonetic: "/sɪns/", meaning: "từ khi (mốc thời gian)", example: "I've worked here since 2020.", example2: "She has lived in Hanoi since she was a child.", collocation: "since then / since last year", audio: "/audio/unit17/since.mp3" },
    { id: 9, word: "for", emoji: "⏱️", phonetic: "/fɔːr/", meaning: "trong (khoảng thời gian)", example: "I've lived here for five years.", example2: "We've been partners for a long time.", collocation: "for years / for a long time", audio: "/audio/unit17/for.mp3" },
    { id: 10, word: "recently", emoji: "🕐", phonetic: "/ˈriːsəntli/", meaning: "gần đây", example: "I've recently started learning Spanish.", example2: "Have you read any good books recently?", collocation: "recently completed / recently joined", audio: "/audio/unit17/recently.mp3" },
    { id: 11, word: "accomplished", emoji: "✨", phonetic: "/əˈkʌmplɪʃt/", meaning: "có thành tích / đã hoàn thành", example: "She is a very accomplished engineer.", example2: "I've accomplished all my goals this year.", collocation: "accomplished professional / feel accomplished", audio: "/audio/unit17/accomplished.mp3" },
    { id: 12, word: "certificate", emoji: "🎓", phonetic: "/sərˈtɪfɪkət/", meaning: "chứng chỉ / chứng nhận", example: "I have a certificate in project management.", example2: "She received a certificate for her work.", collocation: "get a certificate / certified professional", audio: "/audio/unit17/certificate.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Phỏng vấn xin việc",
      audio: "/audio/unit17/dialogue_1.mp3",
      desc: "Minh tham gia phỏng vấn và chia sẻ kinh nghiệm của mình.",
      lines: [
        { id: "d1-1", speaker: "Interviewer", text: "Tell me about yourself. Have you ever worked in an international environment?", translation: "Hãy kể về bản thân bạn. Bạn đã từng làm việc trong môi trường quốc tế chưa?" },
        { id: "d1-2", speaker: "Minh", text: "Yes, I have. I've worked with foreign clients for three years at my current company.", translation: "Vâng, đã từng. Tôi đã làm việc với khách hàng nước ngoài được ba năm tại công ty hiện tại." },
        { id: "d1-3", speaker: "Interviewer", text: "Impressive! Have you ever led a team?", translation: "Ấn tượng! Bạn đã từng dẫn dắt một nhóm chưa?" },
        { id: "d1-4", speaker: "Minh", text: "Yes, I've led a team of five people since 2022. We've achieved excellent sales results.", translation: "Vâng, tôi đã dẫn dắt nhóm năm người từ năm 2022. Chúng tôi đã đạt được kết quả bán hàng xuất sắc." },
        { id: "d1-5", speaker: "Interviewer", text: "Have you finished your project management certificate yet?", translation: "Bạn đã hoàn thành chứng chỉ quản lý dự án chưa?" },
        { id: "d1-6", speaker: "Minh", text: "Yes! I've just received it last month. I've never stopped learning!", translation: "Rồi! Tôi vừa nhận được nó tháng trước. Tôi chưa bao giờ ngừng học hỏi!" },
      ]
    },
    {
      id: 2,
      title: "Khám phá ẩm thực",
      audio: "/audio/unit17/dialogue_2.mp3",
      desc: "Tom và Lan nói chuyện về những trải nghiệm ẩm thực.",
      lines: [
        { id: "d2-1", speaker: "Tom", text: "Lan, have you ever tried Japanese food?", translation: "Lan, bạn đã từng ăn thức ăn Nhật Bản chưa?" },
        { id: "d2-2", speaker: "Lan", text: "Yes! I've tried sushi many times. I love it! Have you ever had Vietnamese pho?", translation: "Rồi! Tôi đã ăn sushi nhiều lần. Tôi thích lắm! Bạn đã từng ăn phở Việt Nam chưa?" },
        { id: "d2-3", speaker: "Tom", text: "Yes, I've already tried pho. I had it at a restaurant near the hotel.", translation: "Rồi, tôi đã thử phở rồi. Tôi ăn ở nhà hàng gần khách sạn." },
        { id: "d2-4", speaker: "Lan", text: "What did you think? Did you enjoy it?", translation: "Bạn thấy thế nào? Có thích không?" },
        { id: "d2-5", speaker: "Tom", text: "It was delicious! I've never tasted anything so fresh. I've been to 12 countries but Vietnamese food is the best I've ever had!", translation: "Ngon tuyệt! Tôi chưa bao giờ nếm thứ gì tươi ngon đến vậy. Tôi đã đến 12 quốc gia nhưng đồ ăn Việt Nam là ngon nhất tôi từng ăn!" },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "Have you ever worked in an international environment", options: ["Did you ever work in an international environment", "Have you ever worked in an international environment", "Have you ever work in an international environment", "Do you ever work in international environment"], answer: "Have you ever worked in an international environment" },
    { id: "lac2", audio_text: "I've worked here since 2020", options: ["I've worked here since 2020", "I've worked here for 2020", "I work here since 2020", "I worked here since 2020"], answer: "I've worked here since 2020" },
    { id: "lac3", audio_text: "I've never tasted anything so fresh", options: ["I never tasted anything so fresh", "I've never tasted anything so fresh", "I've never taste anything so fresh", "I've never tasted something so fresh"], answer: "I've never tasted anything so fresh" },
    { id: "lac4", audio_text: "Have you finished the report yet", options: ["Have you finished the report yet", "Have you finish the report yet", "Did you finish the report yet", "Have you yet finished the report"], answer: "Have you finished the report yet" },
    { id: "lac5", audio_text: "I've just received my certificate", options: ["I just received my certificate", "I've just received my certificate", "I've just receive my certificate", "I just have received my certificate"], answer: "I've just received my certificate" },
  ],
  speaking: {
    level1Prompt: "I have {input} in my career.",
    level1Placeholder: "Ví dụ: led a team of five people, completed three projects, received an award...",
    level2Situation: "Trong buổi networking với chuyên gia quốc tế, hãy chia sẻ về kinh nghiệm của bạn: nước ngoài bạn đã đến, loại công việc bạn đã làm, và thành tích bạn đã đạt được trong sự nghiệp.",
    level2Hint: "I've worked in [field] for [duration] years. I've [achievement 1]. Have you ever [experience]? I've never [thing], but I hope to [goal]. Recently, I've [recent achievement].",
  },
  grammar: {
    title: "Present Perfect — Kinh nghiệm và thành tích",
    rule: "Have/Has + past participle\nKeywords: ever, never, already, yet, just, since, for, recently",
    examples: [
      { en: "I have worked here for 3 years.", vn: "Tôi đã làm việc ở đây được 3 năm. (for = khoảng thời gian)" },
      { en: "She has worked here since 2021.", vn: "Cô ấy làm ở đây từ năm 2021. (since = mốc thời gian)" },
      { en: "Have you ever visited Japan?", vn: "Bạn đã từng đến Nhật Bản chưa? (ever = từng)" },
      { en: "I've just finished the report.", vn: "Tôi vừa hoàn thành báo cáo. (just = vừa mới)" },
    ],
    tip: "Phân biệt FOR và SINCE: <strong>For</strong> + khoảng thời gian (for 3 years, for a week). <strong>Since</strong> + mốc thời điểm cụ thể (since 2020, since Monday). Cách nhớ: 'for a period, since a point'.",
    vnNote: "⚠️ Lưu ý: Present Perfect (have/has + V3) không có tương đương trực tiếp trong tiếng Việt. Người Việt hay dùng Past Simple thay vì Present Perfect. 'I saw him before' (quá khứ đơn) vs 'I have seen him' (kinh nghiệm, thời điểm không xác định).",
    dialogueExample: {
      speaker: "Minh",
      text: "I've worked with foreign clients for three years. I've led a team since 2022.",
      translation: "Tôi đã làm với khách hàng nước ngoài được ba năm. Tôi dẫn dắt nhóm từ năm 2022.",
      highlight: "for (duration) / since (starting point)",
    },
    ccq: {
      question: "Câu nào dùng Present Perfect ĐÚNG?",
      options: [
        "I have went to Japan last year.",
        "I have been to Japan. ✅",
        "I have go to Japan.",
        "I been to Japan.",
      ],
      answer: "I have been to Japan. ✅",
      explanation: "Present Perfect: have/has + past participle. 'Go' → past participle là 'been' (khi nói về địa điểm). 'I went to Japan last year' cũng đúng nhưng đó là Past Simple với thời điểm cụ thể.",
    },
  },
  practiceQuiz: [
    { id: "pq1", type: "multiple-choice", question: "Chọn đúng: 'She ___ a team for two years.'", options: ["lead", "led", "has led", "have led"], answer: "has led" },
    { id: "pq2", type: "multiple-choice", question: "Điền đúng: 'I've worked here ___ 2019.'", options: ["for", "since", "from", "at"], answer: "since" },
    { id: "pq3", type: "cloze", question: "Điền: 'Have you ___ (finish) the proposal yet?'", answer: "finished" },
    { id: "pq4", type: "multiple-choice", question: "Câu nào ĐÚNG? Bạn vừa gửi email xong.", options: ["I sent the email just.", "I just sent the email.", "I've just sent the email.", "I have just send the email."], answer: "I've just sent the email." },
    { id: "pq5", type: "cloze", question: "Điền: 'I have ___ been to Europe before. (chưa bao giờ)'", answer: "never" },
  ],

  matchingExercise: {
    title: "Nối từ với nghĩa đúng",
    pairs: [
      { left: "ever", right: "từng / bao giờ" },
      { left: "never", right: "chưa bao giờ" },
      { left: "already", right: "đã (rồi)" },
      { left: "yet", right: "chưa / rồi chưa" },
      { left: "just", right: "vừa mới" },
    ],
  },

  scrambleExercises: [
    {
      id: "s17-1",
      prompt_vn: "Bạn đã từng đến Nhật Bản chưa?",
      words: ["Have", "you", "ever", "been", "to", "Japan", "?"],
      answer: "Have you ever been to Japan ?",
    },
    {
      id: "s17-2",
      prompt_vn: "Tôi vừa mới gửi báo cáo xong.",
      words: ["I", "have", "just", "sent", "the", "report", "."],
      answer: "I have just sent the report .",
    },
    {
      id: "s17-3",
      prompt_vn: "Cô ấy đã làm việc ở đây từ năm 2020.",
      words: ["She", "has", "worked", "here", "since", "2020", "."],
      answer: "She has worked here since 2020 .",
    },
  ],

  quiz: [
    { id: "fq1", type: "multiple-choice", question: "Dịch: 'Tôi đã làm việc với khách hàng nước ngoài được ba năm.'", options: ["I worked with foreign clients for three years.", "I've worked with foreign clients for three years.", "I've worked with foreign clients since three years.", "I work with foreign clients for three years."], answer: "I've worked with foreign clients for three years." },
    { id: "fq2", type: "cloze", question: "Điền: 'Have you ___ tried Vietnamese pho? (từng)'", answer: "ever" },
    { id: "fq3", type: "multiple-choice", question: "Câu nào ĐÚNG về FOR và SINCE?", options: ["I've lived here since five years.", "I've lived here for five years.", "I've lived here since five years ago.", "I've lived here for since 2019."], answer: "I've lived here for five years." },
    { id: "fq4", type: "translate", question: "Dịch sang tiếng Anh: 'Bạn đã hoàn thành báo cáo chưa?'", answer: "Have you finished the report yet?" },
    { id: "fq5", type: "multiple-choice", question: "Chọn câu ĐÚNG: Mô tả kinh nghiệm của bạn", options: ["I have never went abroad.", "I have never been abroad.", "I never have been abroad.", "I haven't never been abroad."], answer: "I have never been abroad." },
  ],

  cumulativeReviewQuestions: [
    {
      id: "cr17-1",
      question: "Chọn câu đúng về vị trí: (Unit 16: Prepositions of Place)",
      options: [
        "The office is in the corner of Main Street.",
        "The office is at the corner of Main Street.",
        "The office is on the corner at Main Street.",
        "The office is by of the corner.",
      ],
      answer: "The office is at the corner of Main Street.",
      type: "multiple-choice",
    },
    {
      id: "cr17-2",
      question: "Điền từ: 'Turn ___ at the traffic lights.' (Unit 16: Directions)",
      options: [],
      answer: "left",
      type: "cloze",
    },
    {
      id: "cr17-3",
      question: "Đi thẳng rồi rẽ phải ở ngã tư. (Unit 16)",
      options: [],
      answer: "Go straight and turn right at the intersection.",
      type: "translate",
    },
  ],

  fluencyDrill: {
    items: [
      { en: "I have worked here for 2 years", vn: "Tôi đã làm việc ở đây 2 năm" },
      { en: "She has never been to London", vn: "Cô ấy chưa bao giờ đến London" },
      { en: "Have you ever tried?", vn: "Bạn đã bao giờ thử chưa?" },
      { en: "He has just arrived", vn: "Anh ấy vừa mới đến" },
      { en: "We have already finished", vn: "Chúng tôi đã hoàn thành rồi" },
      { en: "I haven't eaten yet", vn: "Tôi chưa ăn" },
      { en: "She has worked here since 2020", vn: "Cô ấy đã làm ở đây từ 2020" },
      { en: "They have been friends for years", vn: "Họ đã là bạn bè nhiều năm" },
    ],
  },
};

export default unit17;
