import { UnitData } from "@/components/learn/UnitTemplate";

export const unit15: UnitData = {
  unitId: "unit-15",
  title: "Unit 15: Shopping & Comparing",
  level: "A2",
  xp: 90,
  estimatedTime: 45,
  description: "Học từ vựng mua sắm và cách so sánh bằng comparative & superlative adjectives.",
  badgeName: "Người Mua Sắm Thông Minh",
  badgeEmoji: "🛍️",
  situation: "Bạn đang giúp đồng nghiệp người nước ngoài mua đồ điện tử ở Hà Nội. Bạn cần so sánh các sản phẩm và thuyết phục họ chọn loại phù hợp với ngân sách.",
  learningOutcomes: [
    "So sánh hai đối tượng bằng comparative (-er/more)",
    "Chỉ ra đối tượng tốt nhất bằng superlative (-est/most)",
    "Dùng từ vựng mua sắm trong ngữ cảnh thực tế"
  ],
  warmupGreetings: [
    { emoji: "🛍️", en: "This laptop is cheaper than that one.", vn: "Chiếc laptop này rẻ hơn chiếc kia.", context: "So sánh giá cả" },
    { emoji: "🏆", en: "This is the best deal in the store.", vn: "Đây là ưu đãi tốt nhất trong cửa hàng.", context: "Superlative - tốt nhất" },
    { emoji: "💰", en: "Do you have anything cheaper?", vn: "Bạn có gì rẻ hơn không?", context: "Hỏi về giá" }
  ],
  culturalNote: "Khi mua sắm ở Việt Nam, bạn có thể <span class=\"text-emerald-400 font-semibold\">mặc cả (bargain)</span> ở chợ hoặc cửa hàng nhỏ, nhưng không mặc cả ở siêu thị lớn hay trung tâm thương mại. Với đồng nghiệp nước ngoài, hãy giải thích sự khác biệt này để họ không ngại thương lượng giá khi mua sắm ở chợ.",
  vocab: [
    { id: 1, word: "cheap", emoji: "💰", phonetic: "/tʃiːp/", meaning: "rẻ", example: "This phone is very cheap.", example2: "I'm looking for something cheap but good.", collocation: "cheap price / dirt cheap", audio: "/audio/unit15/cheap.mp3" },
    { id: 2, word: "expensive", emoji: "💎", phonetic: "/ɪkˈspensɪv/", meaning: "đắt tiền", example: "That watch is too expensive for me.", example2: "Luxury brands are always expensive.", collocation: "very expensive / too expensive", audio: "/audio/unit15/expensive.mp3" },
    { id: 3, word: "quality", emoji: "⭐", phonetic: "/ˈkwɒlɪti/", meaning: "chất lượng", example: "The quality of this product is excellent.", example2: "Don't sacrifice quality for price.", collocation: "high quality / good quality / quality product", audio: "/audio/unit15/quality.mp3" },
    { id: 4, word: "discount", emoji: "🏷️", phonetic: "/ˈdɪskaʊnt/", meaning: "giảm giá", example: "Is there a discount for students?", example2: "We offer a 20% discount on all items.", collocation: "get a discount / offer a discount", audio: "/audio/unit15/discount.mp3" },
    { id: 5, word: "receipt", emoji: "🧾", phonetic: "/rɪˈsiːt/", meaning: "hóa đơn", example: "Can I have a receipt, please?", example2: "Keep your receipt in case you need to return it.", collocation: "get a receipt / keep the receipt", audio: "/audio/unit15/receipt.mp3" },
    { id: 6, word: "refund", emoji: "💸", phonetic: "/ˈriːfʌnd/", meaning: "hoàn tiền", example: "Can I get a refund for this item?", example2: "The store gives refunds within 30 days.", collocation: "ask for a refund / full refund", audio: "/audio/unit15/refund.mp3" },
    { id: 7, word: "compare", emoji: "⚖️", phonetic: "/kəmˈpeər/", meaning: "so sánh", example: "Let me compare these two phones.", example2: "It's smart to compare prices before buying.", collocation: "compare prices / compare products", audio: "/audio/unit15/compare.mp3" },
    { id: 8, word: "better", emoji: "⬆️", phonetic: "/ˈbetər/", meaning: "tốt hơn (comparative của good)", example: "This laptop is better than that one.", example2: "Exercise makes you feel better.", collocation: "much better / a lot better", audio: "/audio/unit15/better.mp3" },
    { id: 9, word: "best", emoji: "🏆", phonetic: "/best/", meaning: "tốt nhất (superlative của good)", example: "This is the best deal in the shop.", example2: "She always does her best.", collocation: "the best option / best value", audio: "/audio/unit15/best.mp3" },
    { id: 10, word: "warranty", emoji: "📜", phonetic: "/ˈwɒrənti/", meaning: "bảo hành", example: "This product has a one-year warranty.", example2: "Is the warranty included in the price?", collocation: "under warranty / warranty period", audio: "/audio/unit15/warranty.mp3" },
    { id: 11, word: "brand", emoji: "™️", phonetic: "/brænd/", meaning: "thương hiệu", example: "What brand do you prefer?", example2: "I usually buy Korean brands.", collocation: "popular brand / brand name", audio: "/audio/unit15/brand.mp3" },
    { id: 12, word: "afford", emoji: "💳", phonetic: "/əˈfɔːrd/", meaning: "có khả năng chi trả", example: "I can't afford this laptop. It's too expensive.", example2: "Can you afford to travel this year?", collocation: "can afford / can't afford", audio: "/audio/unit15/afford.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Mua điện thoại",
      audio: "/audio/unit15/dialogue_1.mp3",
      desc: "Minh giúp đồng nghiệp Tom mua điện thoại ở cửa hàng.",
      lines: [
        { id: "d1-1", speaker: "Tom", text: "Minh, I need a new phone. Can you help me choose?", translation: "Minh, tôi cần điện thoại mới. Bạn có thể giúp tôi chọn không?" },
        { id: "d1-2", speaker: "Minh", text: "Sure! What's your budget?", translation: "Được chứ! Ngân sách của bạn là bao nhiêu?" },
        { id: "d1-3", speaker: "Tom", text: "Around 5 million VND. I want good quality but not too expensive.", translation: "Khoảng 5 triệu đồng. Tôi muốn chất lượng tốt nhưng không quá đắt." },
        { id: "d1-4", speaker: "Minh", text: "This Samsung is cheaper than the iPhone. It's only 4.5 million.", translation: "Chiếc Samsung này rẻ hơn iPhone. Chỉ 4.5 triệu thôi." },
        { id: "d1-5", speaker: "Tom", text: "Is the quality good? I need something durable.", translation: "Chất lượng có tốt không? Tôi cần cái gì đó bền." },
        { id: "d1-6", speaker: "Minh", text: "Yes! The camera is better than last year's model. And it has a two-year warranty. I think it's the best option for your budget!", translation: "Có! Camera tốt hơn model năm ngoái. Và có bảo hành hai năm. Tôi nghĩ đây là lựa chọn tốt nhất cho ngân sách của bạn!" },
      ]
    },
    {
      id: 2,
      title: "Hỏi giảm giá",
      audio: "/audio/unit15/dialogue_2.mp3",
      desc: "Lan thương lượng giá ở chợ điện tử.",
      lines: [
        { id: "d2-1", speaker: "Lan", text: "Excuse me, how much is this headphone?", translation: "Xin lỗi, chiếc tai nghe này giá bao nhiêu?" },
        { id: "d2-2", speaker: "Seller", text: "It's 800,000 VND, madam.", translation: "800,000 đồng, cô ơi." },
        { id: "d2-3", speaker: "Lan", text: "That's a bit expensive. The shop next door has a cheaper price.", translation: "Hơi đắt đó. Cửa hàng bên cạnh có giá rẻ hơn." },
        { id: "d2-4", speaker: "Seller", text: "OK, I can offer you a 10% discount. So it's 720,000 VND.", translation: "Vậy thì, tôi có thể giảm 10% cho cô. Tức là 720,000 đồng." },
        { id: "d2-5", speaker: "Lan", text: "Can I have a receipt? And what about the warranty?", translation: "Tôi có thể xin hóa đơn không? Còn bảo hành thì sao?" },
        { id: "d2-6", speaker: "Seller", text: "Of course! You get a one-year warranty and a receipt. This is the best quality in the market!", translation: "Tất nhiên! Cô được bảo hành một năm và có hóa đơn. Đây là chất lượng tốt nhất trên thị trường!" },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "This laptop is cheaper than that one", options: ["This laptop is cheap than that one", "This laptop is cheaper than that one", "This laptop is the cheapest one", "This laptop is more cheap than that one"], answer: "This laptop is cheaper than that one" },
    { id: "lac2", audio_text: "I think it's the best option for your budget", options: ["I think it's the better option for your budget", "I think it's the best option for your budget", "I think it's the most best option", "I think it's best option for your budget"], answer: "I think it's the best option for your budget" },
    { id: "lac3", audio_text: "Can I get a discount on this item", options: ["Can I get a discount on this item", "Can I got a discount on this item", "Can I have discount on this item", "Can I get discount on this item"], answer: "Can I get a discount on this item" },
    { id: "lac4", audio_text: "The camera is better than last year's model", options: ["The camera is more better than last year's model", "The camera is better than last year's model", "The camera is best than last year's model", "The camera is better than last years model"], answer: "The camera is better than last year's model" },
    { id: "lac5", audio_text: "I can't afford this. It's too expensive.", options: ["I can't afford this. It's too expensive.", "I couldn't afford this. It's too expensive.", "I can't afford this. It's very expensive.", "I can't afford this. It's the most expensive."], answer: "I can't afford this. It's too expensive." },
  ],
  speaking: {
    level1Prompt: "I think {input} is better than {input} because it's more affordable.",
    level1Placeholder: "Ví dụ: Samsung, iPhone — Korean food, Japanese food...",
    level2Situation: "Bạn đang tư vấn cho sếp người nước ngoài về việc mua thiết bị cho văn phòng. So sánh ít nhất 2 lựa chọn về giá, chất lượng và bảo hành. Đề xuất lựa chọn tốt nhất.",
    level2Hint: "I recommend [product A] because it's [comparative] than [product B]. The quality is [adjective] and the price is [adjective]. It also has [feature]. I think it's the best option because [reason].",
  },
  grammar: {
    title: "Comparative & Superlative — So sánh trong tiếng Anh",
    rule: "Comparative: adj + -er + than (short adj) / more + adj + than (long adj)\nSuperlative: the + adj + -est (short) / the most + adj (long)",
    examples: [
      { en: "cheap → cheaper → the cheapest", vn: "rẻ → rẻ hơn → rẻ nhất" },
      { en: "expensive → more expensive → the most expensive", vn: "đắt → đắt hơn → đắt nhất" },
      { en: "good → better → the best (irregular)", vn: "tốt → tốt hơn → tốt nhất (bất quy tắc)" },
      { en: "This phone is more durable than that one.", vn: "Chiếc điện thoại này bền hơn chiếc kia." },
    ],
    tip: "Quy tắc nhanh: Tính từ 1-2 âm tiết → thêm -er/-est. Tính từ ≥3 âm tiết → dùng more/most. Lưu ý đặc biệt: good/better/best, bad/worse/worst, far/further/furthest.",
    vnNote: "⚠️ Lưu ý: Comparatives có quy tắc phức tạp: tính từ ngắn thêm -er/est (fast→faster), tính từ dài dùng more/most (expensive→more expensive). Không thể nói 'more fast' hoặc 'expensiver'!",
    dialogueExample: {
      speaker: "Minh",
      text: "The camera is better than last year's model. It's the best option for your budget!",
      translation: "Camera tốt hơn model năm ngoái. Đây là lựa chọn tốt nhất cho ngân sách của bạn!",
      highlight: "better (comparative) / the best (superlative)",
    },
    ccq: {
      question: "Câu nào SO SÁNH đúng?",
      options: [
        "This laptop is more cheap than that one.",
        "This laptop is cheaper than that one. ✅",
        "This laptop is the cheapest than that one.",
        "This laptop is cheap more than that one.",
      ],
      answer: "This laptop is cheaper than that one. ✅",
      explanation: "'Cheap' là tính từ ngắn (1 âm tiết) → dùng 'cheaper + than', không dùng 'more cheap'.",
    },
  },
  practiceQuiz: [
    { id: "pq1", type: "multiple-choice", question: "Chọn đúng: 'This phone is ___ than that one.' (expensive)", options: ["more expensive", "expensiver", "the most expensive", "expensiveer"], answer: "more expensive" },
    { id: "pq2", type: "multiple-choice", question: "Điền đúng: 'She is the ___ student in the class.' (smart)", options: ["smarter", "more smart", "smartest", "most smart"], answer: "smartest" },
    { id: "pq3", type: "cloze", question: "Điền: 'This is the ___ (good) deal I've ever seen!'", answer: "best" },
    { id: "pq4", type: "multiple-choice", question: "Câu so sánh đúng: 'Toyota is ___ than BMW.'", options: ["more cheap", "cheapest", "cheaper", "cheap"], answer: "cheaper" },
    { id: "pq5", type: "cloze", question: "Điền: 'Samsung is ___ (affordable) than Apple.'", answer: "more affordable" },
  ],
  quiz: [
    { id: "fq1", type: "multiple-choice", question: "Dịch: 'Chiếc laptop này đắt hơn chiếc kia nhưng chất lượng tốt hơn.'", options: ["This laptop is expensive than that but quality good.", "This laptop is more expensive than that but the quality is better.", "This laptop is expensiver than that but the quality is more good.", "This laptop more expensive than that one."], answer: "This laptop is more expensive than that but the quality is better." },
    { id: "fq2", type: "cloze", question: "Điền: 'This is the ___ (cheap) option in the store.'", answer: "cheapest" },
    { id: "fq3", type: "multiple-choice", question: "Câu nào ĐÚNG ngữ pháp?", options: ["Is there a discount for students?", "Is there discounts for students?", "There is discount for students?", "Do there a discount for students?"], answer: "Is there a discount for students?" },
    { id: "fq4", type: "translate", question: "Dịch sang tiếng Anh: 'Tôi không đủ tiền mua cái này. Nó quá đắt.'", answer: "I can't afford this. It's too expensive." },
    { id: "fq5", type: "multiple-choice", question: "So sánh bất quy tắc: 'bad' → ___ → ___", options: ["badder / baddest", "more bad / most bad", "worse / worst", "badly / worst"], answer: "worse / worst" },
  ],

  cumulativeReviewQuestions: [
    {
      id: "cr15-1",
      question: "Chọn câu đúng về kế hoạch đã có sẵn: (Unit 14: Going to)",
      options: [
        "I will meet the client tomorrow (spontaneous)",
        "I am going to meet the client tomorrow (planned)",
        "Both are identical in meaning",
        "Neither is correct",
      ],
      answer: "I am going to meet the client tomorrow (planned)",
      type: "multiple-choice",
    },
    {
      id: "cr15-2",
      question: "Điền từ: 'She ___ present the results next Monday.' (Unit 14: Will)",
      options: [],
      answer: "will",
      type: "cloze",
    },
    {
      id: "cr15-3",
      question: "Anh ấy đã gặp khách hàng hôm qua. (Unit 13)",
      options: [],
      answer: "He met the client yesterday.",
      type: "translate",
    },
  ],

  fluencyDrill: {
    items: [
      { en: "cheaper", vn: "rẻ hơn" },
      { en: "more reliable", vn: "đáng tin hơn" },
      { en: "the best quality", vn: "chất lượng tốt nhất" },
      { en: "more convenient", vn: "tiện lợi hơn" },
      { en: "the cheapest option", vn: "lựa chọn rẻ nhất" },
      { en: "better value", vn: "giá trị tốt hơn" },
      { en: "the most popular", vn: "phổ biến nhất" },
      { en: "worse than expected", vn: "tệ hơn dự kiến" },
    ],
  },
};

export default unit15;
