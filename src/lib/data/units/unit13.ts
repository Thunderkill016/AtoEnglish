import { UnitData } from "@/components/learn/UnitTemplate";

export const unit13: UnitData = {
  unitId: "unit-13",
  title: "Unit 13: Past Experiences",
  level: "A2",
  xp: 90,
  estimatedTime: 45,
  description: "Học cách kể về các sự kiện và trải nghiệm trong quá khứ bằng Past Simple.",
  badgeName: "Người Kể Chuyện",
  badgeEmoji: "📖",
  situation: "Bạn đang ăn trưa cùng đồng nghiệp người nước ngoài. Họ hỏi về kỳ nghỉ cuối tuần của bạn. Bạn cần kể lại những việc đã làm bằng Past Simple.",
  learningOutcomes: [
    "Kể về sự kiện đã xảy ra trong quá khứ",
    "Hỏi và trả lời về kỳ nghỉ, cuối tuần",
    "Dùng đúng Past Simple regular và irregular verbs"
  ],
  warmupGreetings: [
    { emoji: "📅", en: "I went to the beach last weekend.", vn: "Cuối tuần trước tôi đã đi biển.", context: "Kể chuyện quá khứ" },
    { emoji: "🍜", en: "We had pho for lunch yesterday.", vn: "Hôm qua chúng tôi ăn phở buổi trưa.", context: "Mô tả bữa ăn qua khứ" },
    { emoji: "✈️", en: "She traveled to Singapore last year.", vn: "Năm ngoái cô ấy đã du lịch Singapore.", context: "Kể về chuyến đi" }
  ],
  culturalNote: "Khi nói về quá khứ trong tiếng Anh, hãy chú ý đến <span class=\"text-emerald-400 font-semibold\">time markers</span>: yesterday (hôm qua), last week/month/year (tuần/tháng/năm trước), ago (... trước). Những từ này giúp người nghe hiểu rõ thời điểm xảy ra sự kiện.",
  vocab: [
    { id: 1, word: "went", emoji: "🚶", phonetic: "/went/", meaning: "đã đi (quá khứ của go)", example: "I went to work by bus.", example2: "We went shopping yesterday.", collocation: "went to / went shopping / went swimming", audio: "/audio/unit13/went.mp3" },
    { id: 2, word: "had", emoji: "🍽️", phonetic: "/hæd/", meaning: "đã có / đã ăn (quá khứ của have)", example: "I had lunch at 12.", example2: "She had a great time.", collocation: "had lunch / had fun / had a meeting", audio: "/audio/unit13/had.mp3" },
    { id: 3, word: "visited", emoji: "🏛️", phonetic: "/ˈvɪzɪtɪd/", meaning: "đã thăm / đã ghé thăm", example: "I visited my parents last Sunday.", example2: "We visited the museum.", collocation: "visit a place / visit family", audio: "/audio/unit13/visited.mp3" },
    { id: 4, word: "traveled", emoji: "✈️", phonetic: "/ˈtrævəld/", meaning: "đã du lịch", example: "She traveled to Japan last year.", example2: "We traveled by train.", collocation: "travel to / travel by", audio: "/audio/unit13/traveled.mp3" },
    { id: 5, word: "stayed", emoji: "🏨", phonetic: "/steɪd/", meaning: "đã ở lại", example: "We stayed at a hotel near the beach.", example2: "He stayed home all weekend.", collocation: "stay at / stay home / stay overnight", audio: "/audio/unit13/stayed.mp3" },
    { id: 6, word: "met", emoji: "🤝", phonetic: "/met/", meaning: "đã gặp (quá khứ của meet)", example: "I met an old friend yesterday.", example2: "We met at the coffee shop.", collocation: "met a friend / met for coffee", audio: "/audio/unit13/met.mp3" },
    { id: 7, word: "watched", emoji: "📺", phonetic: "/wɒtʃt/", meaning: "đã xem", example: "I watched a movie last night.", example2: "We watched the football match.", collocation: "watch a film / watch TV", audio: "/audio/unit13/watched.mp3" },
    { id: 8, word: "cooked", emoji: "🍳", phonetic: "/kʊkt/", meaning: "đã nấu ăn", example: "She cooked a delicious dinner.", example2: "I cooked rice and vegetables.", collocation: "cook dinner / cook for friends", audio: "/audio/unit13/cooked.mp3" },
    { id: 9, word: "enjoyed", emoji: "😊", phonetic: "/ɪnˈdʒɔɪd/", meaning: "đã thích / đã thưởng thức", example: "I enjoyed the trip very much.", example2: "We enjoyed the food.", collocation: "enjoy a trip / enjoy oneself", audio: "/audio/unit13/enjoyed.mp3" },
    { id: 10, word: "ago", emoji: "⏰", phonetic: "/əˈɡəʊ/", meaning: "trước đây", example: "I moved here two years ago.", example2: "She called me an hour ago.", collocation: "two days ago / a week ago", audio: "/audio/unit13/ago.mp3" },
    { id: 11, word: "last", emoji: "📅", phonetic: "/lɑːst/", meaning: "trước (tuần/tháng/năm)", example: "I saw her last week.", example2: "He visited last month.", collocation: "last week / last year / last night", audio: "/audio/unit13/last.mp3" },
    { id: 12, word: "yesterday", emoji: "📆", phonetic: "/ˈjestədeɪ/", meaning: "hôm qua", example: "I worked from home yesterday.", example2: "Yesterday was a holiday.", collocation: "yesterday morning / yesterday evening", audio: "/audio/unit13/yesterday.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Kể về cuối tuần",
      audio: "/audio/unit13/dialogue_1.mp3",
      desc: "Minh và Sarah nói chuyện về những việc đã làm cuối tuần.",
      lines: [
        { id: "d1-1", speaker: "Sarah", text: "How was your weekend, Minh?", translation: "Cuối tuần của bạn thế nào, Minh?" },
        { id: "d1-2", speaker: "Minh", text: "It was great! I went to Ha Long Bay with my family.", translation: "Rất tuyệt! Tôi đã đi Vịnh Hạ Long cùng gia đình." },
        { id: "d1-3", speaker: "Sarah", text: "Oh wow! How long did you stay?", translation: "Ồ tuyệt vời! Bạn ở lại bao lâu?" },
        { id: "d1-4", speaker: "Minh", text: "We stayed for two days. We visited many beautiful islands.", translation: "Chúng tôi ở lại hai ngày. Chúng tôi đã thăm nhiều hòn đảo đẹp." },
        { id: "d1-5", speaker: "Sarah", text: "Did you eat seafood?", translation: "Bạn có ăn hải sản không?" },
        { id: "d1-6", speaker: "Minh", text: "Yes! We had fresh seafood every meal. I enjoyed it so much!", translation: "Có! Chúng tôi ăn hải sản tươi mỗi bữa. Tôi thích lắm!" },
      ]
    },
    {
      id: 2,
      title: "Chuyến công tác",
      audio: "/audio/unit13/dialogue_2.mp3",
      desc: "Tom kể về chuyến công tác tuần trước.",
      lines: [
        { id: "d2-1", speaker: "Lan", text: "Tom, where were you last week? I didn't see you.", translation: "Tom, tuần trước anh ở đâu vậy? Tôi không thấy anh." },
        { id: "d2-2", speaker: "Tom", text: "I traveled to Ho Chi Minh City for a business meeting.", translation: "Tôi đã đi TP. Hồ Chí Minh để họp kinh doanh." },
        { id: "d2-3", speaker: "Lan", text: "How was it? Did you enjoy the trip?", translation: "Chuyến đi thế nào? Anh có thích không?" },
        { id: "d2-4", speaker: "Tom", text: "Yes, very much. I met many new clients and visited their offices.", translation: "Có, rất thích. Tôi đã gặp nhiều khách hàng mới và thăm văn phòng của họ." },
        { id: "d2-5", speaker: "Lan", text: "Did you have time to explore the city?", translation: "Anh có thời gian khám phá thành phố không?" },
        { id: "d2-6", speaker: "Tom", text: "A little. I watched the sunset from the Bitexco Tower. It was amazing!", translation: "Một chút. Tôi đã xem hoàng hôn từ Tòa nhà Bitexco. Thật tuyệt vời!" },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "I went to Ha Long Bay last weekend", options: ["I go to Ha Long Bay last weekend", "I went to Ha Long Bay last weekend", "She went to Ha Long Bay last weekend", "I went to Ha Long Bay this weekend"], answer: "I went to Ha Long Bay last weekend" },
    { id: "lac2", audio_text: "We stayed at a hotel near the beach", options: ["We stay at a hotel near the beach", "They stayed at a hotel near the beach", "We stayed at a hotel near the beach", "We stayed in a hotel near the beach"], answer: "We stayed at a hotel near the beach" },
    { id: "lac3", audio_text: "I met an old friend yesterday", options: ["I meet an old friend yesterday", "I met an old friend yesterday", "I met a new friend yesterday", "She met an old friend yesterday"], answer: "I met an old friend yesterday" },
    { id: "lac4", audio_text: "She traveled to Japan two years ago", options: ["She travel to Japan two years ago", "She traveled to Japan two years ago", "She traveled to Japan last year", "He traveled to Japan two years ago"], answer: "She traveled to Japan two years ago" },
    { id: "lac5", audio_text: "We had fresh seafood every meal", options: ["We have fresh seafood every meal", "We had fresh seafood every meal", "We had fresh seafood every day", "They had fresh seafood every meal"], answer: "We had fresh seafood every meal" },
  ],
  speaking: {
    level1Prompt: "Last weekend, I {input}.",
    level1Placeholder: "Ví dụ: went to the beach, cooked dinner at home, watched a movie...",
    level2Situation: "Đồng nghiệp người nước ngoài hỏi bạn về kỳ nghỉ Tết hoặc cuối tuần vừa rồi. Kể lại những việc bạn đã làm, nơi bạn đã đến, và cảm xúc của bạn.",
    level2Hint: "Last [time period], I went to [place] with [person]. We stayed at [accommodation]. I visited [place], had [food], and met [person]. I enjoyed it because [reason].",
  },
  grammar: {
    title: "Past Simple — Nói về quá khứ",
    rule: "Subject + V-ed (regular) / irregular verb + time marker\nNegative: Subject + did not (didn't) + V\nQuestion: Did + Subject + V?",
    examples: [
      { en: "I worked yesterday. (regular)", vn: "Tôi đã làm việc hôm qua." },
      { en: "She went to school. (irregular)", vn: "Cô ấy đã đi học." },
      { en: "I didn't watch TV last night.", vn: "Tối qua tôi không xem TV." },
      { en: "Did you enjoy the trip?", vn: "Bạn có thích chuyến đi không?" },
    ],
    tip: "Động từ bất quy tắc (irregular verbs) cần học thuộc: go→went, have→had, see→saw, meet→met, eat→ate. Đây là những động từ thông dụng nhất trong tiếng Anh!",
    vnNote: "⚠️ Lưu ý: Past Simple - PHẢI chia động từ. Động từ bất quy tắc phải học thuộc: go→went, see→saw, have→had. Không thể nói 'I goed' hay 'I sawed' — tiếng Anh không đơn giản như tiếng Việt ở điểm này!",
    dialogueExample: {
      speaker: "Minh",
      text: "I went to Ha Long Bay. We stayed for two days and I enjoyed it so much!",
      translation: "Tôi đã đi Vịnh Hạ Long. Chúng tôi ở lại hai ngày và tôi rất thích!",
      highlight: "went / stayed / enjoyed",
    },
    ccq: {
      question: "Câu nào dùng Past Simple ĐÚNG?",
      options: [
        "I go to the beach yesterday.",
        "I went to the beach yesterday. ✅",
        "I goed to the beach yesterday.",
        "I was go to the beach yesterday.",
      ],
      answer: "I went to the beach yesterday. ✅",
      explanation: "Past Simple dùng dạng quá khứ của động từ. 'Go' là irregular verb nên quá khứ là 'went', không thêm -ed.",
    },
  },
  practiceQuiz: [
    { id: "pq1", type: "multiple-choice", question: "Chọn dạng quá khứ đúng: 'She ___ to the market this morning.'", options: ["go", "goes", "went", "going"], answer: "went" },
    { id: "pq2", type: "multiple-choice", question: "Điền đúng: 'We ___ at a 5-star hotel.'", options: ["stay", "stays", "stayed", "staying"], answer: "stayed" },
    { id: "pq3", type: "cloze", question: "Điền: 'I ___ (have) pho for breakfast yesterday.'", answer: "had" },
    { id: "pq4", type: "multiple-choice", question: "Câu phủ định đúng: 'I ___ TV last night.'", options: ["didn't watched", "didn't watch", "not watched", "don't watch"], answer: "didn't watch" },
    { id: "pq5", type: "cloze", question: "Điền: 'She ___ (meet) her boss two days ago.'", answer: "met" },
  ],

  matchingExercise: {
    title: "Nối động từ quá khứ với nghĩa đúng",
    pairs: [
      { left: "went", right: "đã đi" },
      { left: "visited", right: "đã thăm" },
      { left: "traveled", right: "đã du lịch" },
      { left: "stayed", right: "đã ở lại" },
      { left: "enjoyed", right: "đã thích" },
    ],
  },

  scrambleExercises: [
    {
      id: "s13-1",
      prompt_vn: "Tôi đã đi biển cuối tuần trước.",
      words: ["I", "went", "to", "the", "beach", "last", "weekend", "."],
      answer: "I went to the beach last weekend .",
    },
    {
      id: "s13-2",
      prompt_vn: "Chúng tôi đã ở lại khách sạn hai ngày.",
      words: ["We", "stayed", "at", "a", "hotel", "for", "two", "days", "."],
      answer: "We stayed at a hotel for two days .",
    },
    {
      id: "s13-3",
      prompt_vn: "Cô ấy đã gặp bạn cũ hôm qua.",
      words: ["She", "met", "an", "old", "friend", "yesterday", "."],
      answer: "She met an old friend yesterday .",
    },
  ],

  quiz: [
    { id: "fq1", type: "multiple-choice", question: "Dịch: 'Tôi đã ghé thăm cha mẹ tôi tuần trước.'", options: ["I visit my parents last week.", "I visited my parents last week.", "I was visited my parents last week.", "I visits my parents last week."], answer: "I visited my parents last week." },
    { id: "fq2", type: "cloze", question: "Điền: 'She ___ (go) to Singapore three years ago.'", answer: "went" },
    { id: "fq3", type: "multiple-choice", question: "Chọn câu hỏi đúng: 'Bạn có thích chuyến đi không?'", options: ["Did you enjoyed the trip?", "Did you enjoy the trip?", "Do you enjoyed the trip?", "Were you enjoy the trip?"], answer: "Did you enjoy the trip?" },
    { id: "fq4", type: "translate", question: "Dịch sang tiếng Anh: 'Chúng tôi đã ăn hải sản tươi mỗi bữa.'", answer: "We had fresh seafood every meal." },
    { id: "fq5", type: "multiple-choice", question: "Điền: 'I ___ a movie last night. It was great!'", options: ["watch", "watches", "watched", "watching"], answer: "watched" },
  ],

  cumulativeReviewQuestions: [
    {
      id: "cr13-1",
      question: "Chọn dạng đúng: 'This hotel is ___ than that one.' (Unit 12: Comparatives)",
      options: ["more cheap", "cheaper", "cheapest", "cheap"],
      answer: "cheaper",
      type: "multiple-choice",
    },
    {
      id: "cr13-2",
      question: "Điền từ: 'She ___ emails right now.' (Unit 11: Present Continuous)",
      options: [],
      answer: "is writing",
      type: "cloze",
    },
    {
      id: "cr13-3",
      question: "Sản phẩm này phổ biến nhất. (Unit 12: Superlative)",
      options: [],
      answer: "This product is the most popular.",
      type: "translate",
    },
  ],

  fluencyDrill: {
    items: [
      { en: "I went", vn: "Tôi đã đi" },
      { en: "She saw", vn: "Cô ấy đã thấy" },
      { en: "We had", vn: "Chúng tôi đã có" },
      { en: "He made", vn: "Anh ấy đã làm" },
      { en: "They came", vn: "Họ đã đến" },
      { en: "I didn't go", vn: "Tôi đã không đi" },
      { en: "Did you see?", vn: "Bạn có thấy không?" },
      { en: "She didn't know", vn: "Cô ấy đã không biết" },
    ],
  },

  readingPassage: {
    id: "unit13-reading-1",
    title: "A Weekend in Ha Long Bay",
    title_vn: "Một Cuối Tuần Tại Vịnh Hạ Long",
    level: "A2" as const,
    text: `Last weekend, Minh and his family traveled to Ha Long Bay. They stayed at a small hotel near the beach for two nights. On the first day, they visited many beautiful islands and enjoyed the stunning scenery. Minh met a friendly local guide who showed them the best spots. In the evening, they had fresh seafood for dinner and cooked some traditional dishes together. On the second day, they watched the sunrise from the boat. It was amazing! They went back home yesterday afternoon. Minh enjoyed the trip very much and took many photos. His family had a wonderful time and felt very happy.`,
    questions: [
      {
        id: "unit13-q1",
        question_vn: "Minh và gia đình đã đi đâu cuối tuần trước?",
        options: [
          "They went to Da Nang.",
          "They went to Ha Long Bay.",
          "They traveled to Ho Chi Minh City.",
          "They visited Hoi An.",
        ],
        answer: "They went to Ha Long Bay.",
        explanation_vn: "Đoạn văn nói 'Minh and his family traveled to Ha Long Bay' — họ đã đi Vịnh Hạ Long.",
      },
      {
        id: "unit13-q2",
        question_vn: "Họ đã ở lại bao nhiêu đêm?",
        options: [
          "They stayed for one night.",
          "They stayed for two nights.",
          "They stayed for three nights.",
          "They stayed for a week.",
        ],
        answer: "They stayed for two nights.",
        explanation_vn: "Đoạn văn ghi 'stayed at a small hotel near the beach for two nights' — hai đêm.",
      },
      {
        id: "unit13-q3",
        question_vn: "Họ đã làm gì vào buổi tối ngày đầu tiên?",
        options: [
          "They watched a movie.",
          "They cooked rice and vegetables only.",
          "They had fresh seafood and cooked traditional dishes.",
          "They visited the market.",
        ],
        answer: "They had fresh seafood and cooked traditional dishes.",
        explanation_vn: "'had fresh seafood for dinner and cooked some traditional dishes together' — ăn hải sản và nấu các món truyền thống.",
      },
      {
        id: "unit13-q4",
        question_vn: "Minh cảm thấy thế nào về chuyến đi?",
        options: [
          "He was bored and tired.",
          "He enjoyed the trip very much.",
          "He did not like the food.",
          "He wanted to go home early.",
        ],
        answer: "He enjoyed the trip very much.",
        explanation_vn: "'Minh enjoyed the trip very much' — anh ấy rất thích chuyến đi.",
      },
    ],
  },
};

export default unit13;
