import { UnitData } from "@/components/learn/UnitTemplate";

export const unit9: UnitData = {
  unitId: "unit-9",
  title: "Unit 9: Places & Directions",
  level: "A1",
  xp: 80,
  estimatedTime: 45,
  description: "Học từ vựng địa điểm, cách hỏi và chỉ đường bằng tiếng Anh sử dụng giới từ nơi chốn.",
  badgeName: "Người Dẫn Đường",
  situation: "Khách du lịch nước ngoài hỏi bạn đường đến bưu điện — bạn cần hỏi lại và chỉ đường rõ ràng bằng tiếng Anh.",
  learningOutcomes: [
    "Hỏi đường và mô tả vị trí địa điểm bằng tiếng Anh",
    "Chỉ đường rõ ràng với các hướng left/right/straight",
    "Nói về các địa điểm quen thuộc gần chỗ bạn sống"
  ],
  badgeEmoji: "🗺️",
  warmupGreetings: [
    { emoji: "📍", en: "The bank is next to the post office.", vn: "Ngân hàng ở cạnh bưu điện.", context: "Mô tả vị trí địa điểm" },
    { emoji: "❓", en: "Excuse me, where is the nearest café?", vn: "Xin lỗi, quán cà phê gần nhất ở đâu?", context: "Hỏi đường lịch sự" },
    { emoji: "➡️", en: "Go straight and turn left.", vn: "Đi thẳng và rẽ trái.", context: "Hướng dẫn đường đơn giản" }
  ],
  culturalNote: "Khi hỏi đường bằng tiếng Anh, luôn bắt đầu bằng <span class=\"text-emerald-400 font-semibold\">Excuse me...</span> hoặc <span class=\"text-emerald-400 font-semibold\">Sorry to bother you...</span> trước khi hỏi. Nói thẳng 'Where is...?' mà không có lời mở đầu có thể bị coi là thiếu lịch sự ở các nước nói tiếng Anh.",
  vocab: [
    { id: 1, word: "bank", emoji: "🏦", phonetic: "/bæŋk/", meaning: "ngân hàng", example: "The bank is on the main street.", example2: "I need to go to the bank today.", collocation: "go to the bank", audio: "/audio/unit9/bank.mp3" },
    { id: 2, word: "hospital", emoji: "🏥", phonetic: "/ˈhɒspɪtəl/", meaning: "bệnh viện", example: "The hospital is opposite the park.", example2: "She works at the hospital.", collocation: "go to hospital / local hospital", audio: "/audio/unit9/hospital.mp3" },
    { id: 3, word: "supermarket", emoji: "🛒", phonetic: "/ˈsuːpəmɑːkɪt/", meaning: "siêu thị", example: "The supermarket is between the bank and the café.", example2: "I go to the supermarket every week.", collocation: "local supermarket", audio: "/audio/unit9/supermarket.mp3" },
    { id: 4, word: "park", emoji: "🌳", phonetic: "/pɑːk/", meaning: "công viên", example: "The park is near my house.", example2: "We like to walk in the park.", collocation: "city park / national park", audio: "/audio/unit9/park.mp3" },
    { id: 5, word: "school", emoji: "🏫", phonetic: "/skuːl/", meaning: "trường học", example: "The school is next to the library.", example2: "My sister goes to that school.", collocation: "primary school / go to school", audio: "/audio/unit9/school.mp3" },
    { id: 6, word: "post office", emoji: "📮", phonetic: "/pəʊst ˈɒfɪs/", meaning: "bưu điện", example: "Is there a post office near here?", example2: "I sent a letter at the post office.", collocation: "local post office", audio: "/audio/unit9/post_office.mp3" },
    { id: 7, word: "next to", emoji: "↔️", phonetic: "/nɛkst tə/", meaning: "cạnh bên / kế bên", example: "The café is next to the bank.", example2: "My house is next to the park.", collocation: "right next to", audio: "/audio/unit9/next_to.mp3" },
    { id: 8, word: "opposite", emoji: "⬅️➡️", phonetic: "/ˈɒpəzɪt/", meaning: "đối diện", example: "The hospital is opposite the school.", example2: "The bus stop is opposite the supermarket.", collocation: "directly opposite", audio: "/audio/unit9/opposite.mp3" },
    { id: 9, word: "between", emoji: "🔀", phonetic: "/bɪˈtwiːn/", meaning: "giữa (hai thứ)", example: "The park is between the bank and the school.", example2: "Our office is between two big buildings.", collocation: "between...and...", audio: "/audio/unit9/between.mp3" },
    { id: 10, word: "turn left", emoji: "⬅️", phonetic: "/tɜːn lɛft/", meaning: "rẽ trái", example: "Turn left at the traffic light.", example2: "Turn left and you will see the hotel.", collocation: "turn left at the corner", audio: "/audio/unit9/turn_left.mp3" },
    { id: 11, word: "turn right", emoji: "➡️", phonetic: "/tɜːn raɪt/", meaning: "rẽ phải", example: "Turn right after the bridge.", example2: "Turn right and the bank is on your left.", collocation: "turn right at the crossroads", audio: "/audio/unit9/turn_right.mp3" },
    { id: 12, word: "straight ahead", emoji: "⬆️", phonetic: "/streɪt əˈhɛd/", meaning: "đi thẳng", example: "Go straight ahead for two blocks.", example2: "The hotel is straight ahead.", collocation: "go straight ahead", audio: "/audio/unit9/straight_ahead.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Hỏi đường đến bệnh viện",
      audio: "/audio/unit9/dialogue_1.mp3",
      desc: "Tom hỏi đường đến bệnh viện từ một người địa phương.",
      lines: [
        { id: "d1-1", speaker: "Tom", text: "Excuse me, where is the nearest hospital?", translation: "Xin lỗi, bệnh viện gần nhất ở đâu?" },
        { id: "d1-2", speaker: "Local", text: "Go straight ahead for two blocks.", translation: "Đi thẳng hai dãy nhà." },
        { id: "d1-3", speaker: "Tom", text: "Then what?", translation: "Sau đó thì sao?" },
        { id: "d1-4", speaker: "Local", text: "Turn left at the traffic light. The hospital is opposite the park.", translation: "Rẽ trái tại đèn giao thông. Bệnh viện đối diện công viên." },
        { id: "d1-5", speaker: "Tom", text: "Is there a pharmacy next to the hospital?", translation: "Có nhà thuốc nào cạnh bệnh viện không?" },
        { id: "d1-6", speaker: "Local", text: "Yes, there is one between the hospital and the supermarket.", translation: "Có, có một cái giữa bệnh viện và siêu thị." },
        { id: "d1-7", speaker: "Tom", text: "Thank you so much!", translation: "Cảm ơn bạn rất nhiều!" },
      ]
    },
    {
      id: 2,
      title: "Mô tả khu phố",
      audio: "/audio/unit9/dialogue_2.mp3",
      desc: "Lan giới thiệu khu phố của mình cho người bạn mới.",
      lines: [
        { id: "d2-1", speaker: "Sarah", text: "What is your neighbourhood like?", translation: "Khu phố của bạn như thế nào?" },
        { id: "d2-2", speaker: "Lan", text: "It's great! There is a park next to my house.", translation: "Rất tuyệt! Có một công viên cạnh nhà tôi." },
        { id: "d2-3", speaker: "Sarah", text: "Is there a supermarket nearby?", translation: "Có siêu thị gần đó không?" },
        { id: "d2-4", speaker: "Lan", text: "Yes, the supermarket is between the post office and the bank.", translation: "Có, siêu thị nằm giữa bưu điện và ngân hàng." },
        { id: "d2-5", speaker: "Sarah", text: "That's very convenient!", translation: "Tiện lợi thật!" },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "The bank is next to the post office", options: ["The bank is opposite the post office", "The bank is next to the post office", "The bank is between the post offices", "The post office is next to the bank"], answer: "The bank is next to the post office" },
    { id: "lac2", audio_text: "Turn left at the traffic light", options: ["Turn right at the traffic light", "Go straight at the traffic light", "Turn left at the corner", "Turn left at the traffic light"], answer: "Turn left at the traffic light" },
    { id: "lac3", audio_text: "The hospital is opposite the park", options: ["The hospital is next to the park", "The park is opposite the hospital", "The hospital is opposite the park", "The hospital is between the park"], answer: "The hospital is opposite the park" },
    { id: "lac4", audio_text: "Go straight ahead for two blocks", options: ["Turn left for two blocks", "Go straight ahead for two blocks", "Go straight for one block", "Go ahead two streets"], answer: "Go straight ahead for two blocks" },
    { id: "lac5", audio_text: "The supermarket is between the bank and the school", options: ["The supermarket is next to the bank and school", "The school is between the supermarket and bank", "The supermarket is between the bank and the school", "The bank is between the supermarket and school"], answer: "The supermarket is between the bank and the school" },
  ],
  speaking: {
    level1Prompt: "The {input} is next to the park.",
    level1Placeholder: "Ví dụ: bank, school, hospital, supermarket...",
    level2Situation: "Bạn đang giúp một khách du lịch tìm đường đến siêu thị gần nhất. Chỉ đường từ đây, qua một vài địa điểm nổi tiếng.",
    level2Hint: "Go straight ahead for [số] blocks. Turn [left/right] at [địa điểm]. The [nơi] is [opposite/next to/between] [địa điểm khác].",
  },
  grammar: {
    title: "Prepositions of Place — Giới từ chỉ nơi chốn",
    rule: "next to (cạnh) | opposite (đối diện) | between...and... (giữa...và...)",
    examples: [
      { en: "The café is next to the bank.", vn: "Quán cà phê ở cạnh ngân hàng." },
      { en: "The school is opposite the hospital.", vn: "Trường học đối diện bệnh viện." },
      { en: "The park is between the school and the bank.", vn: "Công viên nằm giữa trường học và ngân hàng." },
      { en: "Go straight and turn right at the traffic light.", vn: "Đi thẳng và rẽ phải tại đèn giao thông." },
    ],
    tip: "Giới từ nơi chốn giúp bạn mô tả vị trí rõ ràng. 'next to' = ngay cạnh, 'opposite' = đối diện (qua đường), 'between A and B' = giữa A và B (cần hai điểm tham chiếu).",
    vnNote: "⚠️ Lưu ý: Tiếng Việt dùng từ chỉ thời gian (hôm qua, đã) thay vì chia động từ. Tiếng Anh chia động từ theo thì: không thể nói 'I work yesterday' (SAI) — phải chia: 'I worked yesterday' (ĐÚNG)!",
    dialogueExample: {
      speaker: "Local",
      text: "The hospital is opposite the park.",
      translation: "Bệnh viện đối diện công viên.",
      highlight: "opposite",
    },
    ccq: {
      question: "'The café is ___ the bank and the school.' — điền đúng:",
      options: ["next to", "opposite", "between", "near to"],
      answer: "between",
    },
  },
  matchingExercise: {
    title: "Nối giới từ với nghĩa tiếng Việt",
    pairs: [
      { left: "next to", right: "cạnh bên" },
      { left: "opposite", right: "đối diện" },
      { left: "between", right: "ở giữa" },
      { left: "turn left", right: "rẽ trái" },
      { left: "straight ahead", right: "đi thẳng" },
    ],
  },
  practiceQuiz: [
    { id: "pq1", question: "Điền giới từ đúng: 'The park is ___ the school and the bank.'", options: ["next to", "opposite", "between", "near"], answer: "between", type: "multiple-choice" },
    { id: "pq2", question: "Để hỏi đường lịch sự, bạn bắt đầu bằng:", options: ["Where is...?", "Tell me where...!", "Excuse me, where is...?", "I need to know..."], answer: "Excuse me, where is...?", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ còn thiếu: 'The bank is ___ the post office.'", options: [], answer: "next to", type: "cloze" },
  ],

  practiceTranslate: [
    { id: "pt9-1", prompt_vn: "Bưu điện ở đâu?", answer: "Where is the post office?" },
    { id: "pt9-2", prompt_vn: "Đi thẳng rồi rẽ trái.", answer: "Go straight and then turn left." },
    { id: "pt9-3", prompt_vn: "Siêu thị cách đây bao xa?", answer: "How far is the supermarket from here?" },
  ],
  quiz: [
    { id: "q1", question: "Chọn câu mô tả đúng vị trí:", options: ["The hospital is next the park.", "The hospital is opposite the park.", "The hospital is between park.", "The park is next to hospital."], answer: "The hospital is opposite the park.", type: "multiple-choice" },
    { id: "q2", question: "'Between A and B' có nghĩa là:", options: ["Cạnh A", "Đối diện B", "Giữa A và B", "Gần A"], answer: "Giữa A và B", type: "multiple-choice" },
    { id: "q3", question: "Chỉ đường: bạn nói gì khi muốn người ta rẽ phải?", options: ["Go straight ahead.", "Turn left.", "Turn right.", "Go back."], answer: "Turn right.", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: 'Go ___ ahead for two blocks.'", options: [], answer: "straight", type: "cloze" },
    { id: "q5", question: "Điền từ: 'Turn ___ at the traffic light.'", options: [], answer: "left", type: "cloze" },
    { id: "q6", question: "Ngân hàng đối diện bưu điện.", options: [], answer: "The bank is opposite the post office.", type: "translate" },
    { id: "q7", question: "Xin lỗi, siêu thị gần nhất ở đâu?", options: [], answer: "Excuse me, where is the nearest supermarket?", type: "translate" },
  ],
  scrambleExercises: [
    {
      id: "s9-1",
      prompt_vn: "Ngân hàng ở cạnh bưu điện.",
      words: ["The", "bank", "is", "next", "to", "the", "post", "office", "."],
      answer: "The bank is next to the post office .",
    },
    {
      id: "s9-2",
      prompt_vn: "Đi thẳng và rẽ trái.",
      words: ["Go", "straight", "and", "turn", "left", "."],
      answer: "Go straight and turn left .",
    },
    {
      id: "s9-3",
      prompt_vn: "Siêu thị nằm giữa ngân hàng và trường học.",
      words: ["The", "supermarket", "is", "between", "the", "bank", "and", "the", "school", "."],
      answer: "The supermarket is between the bank and the school .",
    },
  ],
  cumulativeReviewQuestions: [
    {
      id: "cr9-1",
      question: "Gọi món lịch sự bằng cách nào? (Unit 8: Food)",
      options: ["I want some soup.", "I'd like some soup, please.", "Give me some soup.", "Some soup for me."],
      answer: "I'd like some soup, please.",
      type: "multiple-choice",
    },
    {
      id: "cr9-2",
      question: "Bạn có thịt gà không? (Unit 8)",
      options: [],
      answer: "Do you have any chicken?",
      type: "translate",
    },
  ],

  fluencyDrill: {
    items: [
      { en: "I worked yesterday", vn: "Tôi đã làm việc hôm qua" },
      { en: "She went to the office", vn: "Cô ấy đã đến văn phòng" },
      { en: "We had a meeting", vn: "Chúng tôi đã có cuộc họp" },
      { en: "He sent the email", vn: "Anh ấy đã gửi email" },
      { en: "I didn't finish", vn: "Tôi đã không hoàn thành" },
      { en: "Did you call him?", vn: "Bạn có gọi cho anh ấy không?" },
      { en: "She wrote the report", vn: "Cô ấy đã viết báo cáo" },
      { en: "They came on time", vn: "Họ đã đến đúng giờ" },
    ],
  },
};

export default unit9;