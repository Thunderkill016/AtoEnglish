import { UnitData } from "@/components/learn/UnitTemplate";

export const unit5: UnitData = {
  unitId: "unit-5",
  title: "Unit 5: Shopping & Prices",
  level: "A2",
  xp: 90,
  estimatedTime: 45,
  description:
    "Học từ vựng mua sắm, cách hỏi giá và sử dụng tính từ so sánh (Comparatives) để mô tả sản phẩm.",
  badgeName: "Smart Shopper",
  badgeEmoji: "🛒",

  // ── Section 1: Warm-up greetings ───────────────────────────────────────────
  warmupGreetings: [
    {
      emoji: "🛍️",
      en: "How much does this cost?",
      vn: "Cái này giá bao nhiêu?",
      context: "Hỏi giá sản phẩm",
    },
    {
      emoji: "💰",
      en: "That's too expensive.",
      vn: "Đắt quá.",
      context: "Phản ứng khi giá cao",
    },
    {
      emoji: "🤑",
      en: "Can you give me a discount?",
      vn: "Bạn có thể giảm giá cho tôi không?",
      context: "Xin giảm giá",
    },
    {
      emoji: "✅",
      en: "I'll take it.",
      vn: "Tôi mua cái này.",
      context: "Đồng ý mua hàng",
    },
  ],

  culturalNote:
    "🇻🇳 Tại chợ truyền thống Việt Nam, mặc cả (bargaining) là điều hoàn toàn bình thường và được khuyến khích. Tuy nhiên tại siêu thị và cửa hàng hiện đại, giá đã niêm yết và thường không thương lượng.",

  // ── Section 2: Vocabulary ─────────────────────────────────────────────────
  vocab: [
    { id: 1, word: "buy", emoji: "🛒", phonetic: "/baɪ/", meaning: "mua", example: "I want to buy some fruit." },
    { id: 2, word: "sell", emoji: "💼", phonetic: "/sɛl/", meaning: "bán", example: "They sell vegetables here." },
    { id: 3, word: "price", emoji: "🏷️", phonetic: "/praɪs/", meaning: "giá cả", example: "What is the price of this shirt?" },
    { id: 4, word: "cheap", emoji: "💚", phonetic: "/tʃiːp/", meaning: "rẻ", example: "This market is cheap and fresh." },
    { id: 5, word: "expensive", emoji: "💎", phonetic: "/ɪkˈspɛnsɪv/", meaning: "đắt tiền", example: "That bag is too expensive for me." },
    { id: 6, word: "discount", emoji: "🏷️", phonetic: "/ˈdɪskaʊnt/", meaning: "giảm giá", example: "Is there a discount for students?" },
    { id: 7, word: "market", emoji: "🏪", phonetic: "/ˈmɑːrkɪt/", meaning: "chợ / thị trường", example: "The night market opens at 6 PM." },
    { id: 8, word: "money", emoji: "💵", phonetic: "/ˈmʌni/", meaning: "tiền", example: "I don't have enough money today." },
  ],

  // ── Section 3: Grammar ───────────────────────────────────────────────────
  grammar: {
    title: "Comparatives — So sánh hơn",
    rule: "Short adj: adj + -er + than | Long adj: more + adj + than",
    conjugation: [
      { subject: "Short adj", form: "cheap → cheaper", example: "This bag is cheaper than that one." },
      { subject: "Short adj", form: "big → bigger", example: "The market is bigger than the mall." },
      { subject: "Long adj", form: "expensive → more expensive", example: "Gold is more expensive than silver." },
      { subject: "Irregular", form: "good → better", example: "This product is better than before." },
    ],
    examples: [
      { en: "This phone is cheaper than that laptop.", vn: "Chiếc điện thoại này rẻ hơn chiếc laptop kia." },
      { en: "Fresh food is more expensive than canned food.", vn: "Thức ăn tươi đắt hơn thức ăn đóng hộp." },
      { en: "Online shopping is more convenient than going to the market.", vn: "Mua sắm online tiện lợi hơn đi chợ." },
      { en: "Is this bag better than the other one?", vn: "Chiếc túi này có tốt hơn chiếc kia không?" },
    ],
    tip: "Với tính từ ngắn (1-2 âm tiết): thêm '-er' (cheap → cheaper). Với tính từ dài (3+ âm tiết): dùng 'more' phía trước (expensive → more expensive). Ngoại lệ: good → better, bad → worse.",
    ccq: {
      question: "Câu so sánh nào ĐÚNG ngữ pháp?",
      options: [
        "This is more cheap than that.",
        "Gold is expensiver than silver.",
        "This laptop is more expensive than that phone.",
        "She is more tall than her sister.",
      ],
      answer: "This laptop is more expensive than that phone.",
    },
  },

  // ── Section 4: Matching exercise ─────────────────────────────────────────
  matchingExercise: {
    title: "Nối từ vựng mua sắm với nghĩa tiếng Việt",
    pairs: [
      { left: "buy", right: "mua" },
      { left: "price", right: "giá cả" },
      { left: "cheap", right: "rẻ" },
      { left: "discount", right: "giảm giá" },
      { left: "expensive", right: "đắt tiền" },
      { left: "market", right: "chợ" },
    ],
  },

  // ── Section 4: Practice quiz ─────────────────────────────────────────────
  practiceQuiz: [
    {
      id: "pq5-1",
      type: "multiple-choice",
      question: "Câu nào đúng nghĩa 'đắt hơn'?",
      options: ["cheaper than", "more expensive than", "expensiver than", "most expensive"],
      answer: "more expensive than",
    },
    {
      id: "pq5-2",
      type: "multiple-choice",
      question: "Từ nào có nghĩa là 'giảm giá'?",
      options: ["market", "money", "discount", "price"],
      answer: "discount",
    },
    {
      id: "pq5-3",
      type: "cloze",
      question: "Điền từ: 'This bag is ___ than that one.' (rẻ hơn)",
      options: [],
      answer: "cheaper",
    },
  ],

  // ── Section 5: Dialogue (Listening) ──────────────────────────────────────
  dialogues: [
    {
      id: 1,
      title: "At the Night Market",
      audio: "",
      desc: "A tourist negotiates the price of a souvenir at a Vietnamese night market.",
      lines: [
        { id: "d5-1", speaker: "Customer", text: "Excuse me, how much is this scarf?", translation: "Xin lỗi, khăn này giá bao nhiêu?" },
        { id: "d5-2", speaker: "Seller", text: "It's 150,000 dong.", translation: "150.000 đồng ạ." },
        { id: "d5-3", speaker: "Customer", text: "That's too expensive. Can you give me a discount?", translation: "Đắt quá. Bạn có thể giảm giá cho tôi không?" },
        { id: "d5-4", speaker: "Seller", text: "Okay, 100,000 dong. That's the best price!", translation: "Được, 100.000 đồng. Đó là giá tốt nhất rồi!" },
        { id: "d5-5", speaker: "Customer", text: "Great, I'll take two. This market is cheaper than the mall.", translation: "Tuyệt, tôi mua hai cái. Chợ này rẻ hơn trung tâm thương mại." },
      ],
    },
  ],

  // ── Section 5: Listen & Choose ───────────────────────────────────────────
  listenAndChoose: [
    {
      id: "lac5-1",
      audio_text: "It's too expensive. Can you give me a discount?",
      options: ["Hỏi giá sản phẩm", "Xin giảm giá vì giá quá đắt", "Từ chối mua hàng", "Hỏi địa chỉ cửa hàng"],
      answer: "Xin giảm giá vì giá quá đắt",
    },
    {
      id: "lac5-2",
      audio_text: "This market is cheaper than the shopping mall.",
      options: ["Chợ đắt hơn trung tâm thương mại", "Hai nơi cùng giá", "Chợ rẻ hơn trung tâm thương mại", "Trung tâm thương mại rẻ hơn"],
      answer: "Chợ rẻ hơn trung tâm thương mại",
    },
    {
      id: "lac5-3",
      audio_text: "Fresh vegetables are more expensive than frozen ones.",
      options: ["Rau tươi rẻ hơn rau đông lạnh", "Rau đông lạnh đắt hơn", "Rau tươi đắt hơn rau đông lạnh", "Cả hai cùng giá"],
      answer: "Rau tươi đắt hơn rau đông lạnh",
    },
  ],

  // ── Section 7: Speaking ───────────────────────────────────────────────────
  speaking: {
    level1Prompt: "Hãy điền tên của bạn: 'My name is {input} and I love shopping at the local market!'",
    level1Placeholder: "Tên của bạn",
    level2Situation: "Bạn đang ở chợ và muốn mua một chiếc áo. Hãy hỏi giá và thương lượng.",
    level2Hint:
      "Try saying: <strong>'How much is this shirt? That's a bit expensive. Can you make it cheaper? Okay, I'll take it!'</strong>",
  },

  // ── Section 8: Final quiz ─────────────────────────────────────────────────
  quiz: [
    {
      id: "q5-1",
      type: "multiple-choice",
      question: "Which sentence uses the comparative correctly?",
      options: [
        "This is more cheap than that.",
        "Online shopping is more convenient than going to the market.",
        "Gold is expensiver than silver.",
        "She is more tall than her friend.",
      ],
      answer: "Online shopping is more convenient than going to the market.",
    },
    {
      id: "q5-2",
      type: "multiple-choice",
      question: "'Giảm giá' trong tiếng Anh là gì?",
      options: ["price", "market", "discount", "money"],
      answer: "discount",
    },
    {
      id: "q5-3",
      type: "multiple-choice",
      question: "Câu nào đúng để hỏi giá?",
      options: [
        "How many is this?",
        "How much does this cost?",
        "What price you want?",
        "This cost how much?",
      ],
      answer: "How much does this cost?",
    },
    {
      id: "q5-4",
      type: "cloze",
      question: "Điền từ: 'This phone is ___ than that laptop.' (rẻ hơn)",
      options: [],
      answer: "cheaper",
    },
    {
      id: "q5-5",
      type: "multiple-choice",
      question: "Từ 'expensive' so sánh hơn là gì?",
      options: ["more expensive", "expensiver", "most expensive", "expensivest"],
      answer: "more expensive",
    },
  ],
};
