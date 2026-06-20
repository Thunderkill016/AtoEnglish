import { UnitData } from "@/components/learn/UnitTemplate";

export const unit8: UnitData = {
  unitId: "unit-8",
  title: "Unit 8: Food & Ordering",
  level: "A1",
  xp: 80,
  estimatedTime: 40,
  description: "Học từ vựng đồ ăn, cách gọi món và phân biệt Countable/Uncountable nouns trong tiếng Anh.",
  badgeName: "Người Sành Ăn",
  badgeEmoji: "🍜",
  warmupGreetings: [
    { emoji: "🍚", en: "I'd like some rice, please.", vn: "Cho tôi một ít cơm, làm ơn.", context: "Gọi món lịch sự" },
    { emoji: "🥤", en: "Can I have a glass of water?", vn: "Tôi có thể có một ly nước không?", context: "Yêu cầu đồ uống" },
    { emoji: "🍖", en: "Do you have any chicken?", vn: "Bạn có thịt gà không?", context: "Hỏi về món ăn" }
  ],
  culturalNote: "Trong tiếng Anh, <span class=\"text-emerald-400 font-semibold\">I'd like...</span> (= I would like...) lịch sự hơn <span class=\"text-emerald-400 font-semibold\">I want...</span> rất nhiều khi gọi món. Người Việt khi học tiếng Anh thường quên dùng 'I'd like' và nói thẳng 'I want' — điều này có thể nghe không lịch sự trong văn hóa phương Tây.",
  vocab: [
    { id: 1, word: "rice", emoji: "🍚", phonetic: "/raɪs/", meaning: "cơm / gạo", example: "I eat rice every day.", example2: "Can I have some rice, please?", collocation: "fried rice / steamed rice", audio: "/audio/unit8/rice.mp3" },
    { id: 2, word: "noodles", emoji: "🍜", phonetic: "/ˈnuːdəlz/", meaning: "mì / bún", example: "I love eating noodles for breakfast.", example2: "Vietnamese noodles are delicious.", collocation: "noodle soup", audio: "/audio/unit8/noodles.mp3" },
    { id: 3, word: "bread", emoji: "🍞", phonetic: "/brɛd/", meaning: "bánh mì", example: "I have bread and butter for breakfast.", example2: "Would you like some bread?", collocation: "slice of bread", audio: "/audio/unit8/bread.mp3" },
    { id: 4, word: "chicken", emoji: "🍗", phonetic: "/ˈtʃɪkɪn/", meaning: "thịt gà", example: "I'd like some chicken, please.", example2: "The chicken soup is very good.", collocation: "grilled chicken", audio: "/audio/unit8/chicken.mp3" },
    { id: 5, word: "vegetable", emoji: "🥦", phonetic: "/ˈvedʒtəbəl/", meaning: "rau củ", example: "Eat your vegetables!", example2: "I like fresh vegetables.", collocation: "fresh vegetables", audio: "/audio/unit8/vegetable.mp3" },
    { id: 6, word: "fruit", emoji: "🍎", phonetic: "/fruːt/", meaning: "hoa quả", example: "I eat fruit every morning.", example2: "There is some fruit on the table.", collocation: "fresh fruit / tropical fruit", audio: "/audio/unit8/fruit.mp3" },
    { id: 7, word: "water", emoji: "💧", phonetic: "/ˈwɔːtər/", meaning: "nước", example: "Can I have some water?", example2: "Drink eight glasses of water a day.", collocation: "a glass of water / mineral water", audio: "/audio/unit8/water.mp3" },
    { id: 8, word: "coffee", emoji: "☕", phonetic: "/ˈkɒfi/", meaning: "cà phê", example: "I drink coffee in the morning.", example2: "Do you want some coffee?", collocation: "black coffee / iced coffee", audio: "/audio/unit8/coffee.mp3" },
    { id: 9, word: "soup", emoji: "🍲", phonetic: "/suːp/", meaning: "súp", example: "This soup is delicious.", example2: "I'd like a bowl of soup.", collocation: "bowl of soup / chicken soup", audio: "/audio/unit8/soup.mp3" },
    { id: 10, word: "dessert", emoji: "🍮", phonetic: "/dɪˈzɜːt/", meaning: "món tráng miệng", example: "What would you like for dessert?", example2: "I love chocolate dessert.", collocation: "for dessert", audio: "/audio/unit8/dessert.mp3" },
    { id: 11, word: "menu", emoji: "📋", phonetic: "/ˈmenjuː/", meaning: "thực đơn", example: "Can I see the menu, please?", example2: "The menu has many Vietnamese dishes.", collocation: "look at the menu", audio: "/audio/unit8/menu.mp3" },
    { id: 12, word: "bill", emoji: "🧾", phonetic: "/bɪl/", meaning: "hóa đơn tiền ăn", example: "Can we have the bill, please?", example2: "The bill comes to fifty dollars.", collocation: "pay the bill / ask for the bill", audio: "/audio/unit8/bill.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Gọi món tại nhà hàng",
      audio: "/audio/unit8/dialogue_1.mp3",
      desc: "Minh và bạn gọi món tại một nhà hàng tiếng Anh.",
      lines: [
        { id: "d1-1", speaker: "Waiter", text: "Good evening! Are you ready to order?", translation: "Chào buổi tối! Quý khách đã sẵn sàng gọi món chưa?" },
        { id: "d1-2", speaker: "Minh", text: "Yes. I'd like some noodle soup, please.", translation: "Vâng. Cho tôi một tô phở, làm ơn." },
        { id: "d1-3", speaker: "Waiter", text: "Would you like any vegetables in your soup?", translation: "Quý khách có muốn thêm rau vào súp không?" },
        { id: "d1-4", speaker: "Minh", text: "Yes, please. And can I have some water?", translation: "Vâng, làm ơn. Và cho tôi một ít nước?" },
        { id: "d1-5", speaker: "Waiter", text: "Of course. Anything for dessert?", translation: "Dĩ nhiên. Quý khách dùng gì tráng miệng không?" },
        { id: "d1-6", speaker: "Minh", text: "No, thank you. Can we have the bill, please?", translation: "Không, cảm ơn. Cho chúng tôi tính tiền nhé?" },
      ]
    },
    {
      id: 2,
      title: "Sở thích ăn uống",
      audio: "/audio/unit8/dialogue_2.mp3",
      desc: "Lan và Sarah nói chuyện về thức ăn yêu thích.",
      lines: [
        { id: "d2-1", speaker: "Sarah", text: "What's your favourite Vietnamese food?", translation: "Món ăn Việt Nam yêu thích của bạn là gì?" },
        { id: "d2-2", speaker: "Lan", text: "I love pho! It's a noodle soup with beef or chicken.", translation: "Tôi thích phở! Đó là súp mì với thịt bò hoặc gà." },
        { id: "d2-3", speaker: "Sarah", text: "Is it countable or uncountable?", translation: "Nó là đếm được hay không đếm được?" },
        { id: "d2-4", speaker: "Lan", text: "Ha! Pho is uncountable. We say 'some pho', not 'a pho'.", translation: "Haha! Phở là không đếm được. Chúng ta nói 'some pho', không nói 'a pho'." },
        { id: "d2-5", speaker: "Sarah", text: "I see! Do you like any other food?", translation: "Tôi hiểu rồi! Bạn có thích đồ ăn nào khác không?" },
        { id: "d2-6", speaker: "Lan", text: "Yes! I love fresh fruit — mangoes and dragon fruit.", translation: "Có! Tôi thích hoa quả tươi — xoài và thanh long." },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "I'd like some rice please", options: ["I want some rice please", "I'd like some rice please", "I'd like a rice please", "I like some rice please"], answer: "I'd like some rice please" },
    { id: "lac2", audio_text: "Can I have some water", options: ["Can I have some water", "Can I have a water", "Can you give me water", "I'd like some water"], answer: "Can I have some water" },
    { id: "lac3", audio_text: "Do you have any chicken", options: ["Do you have some chicken", "Do you have any chicken", "Is there any chicken", "Do you have a chicken"], answer: "Do you have any chicken" },
    { id: "lac4", audio_text: "Can we have the bill please", options: ["Can we pay now please", "Can we have the menu please", "Can we have the bill please", "Can I have the bill please"], answer: "Can we have the bill please" },
    { id: "lac5", audio_text: "There is some fruit on the table", options: ["There are fruits on the table", "There is a fruit on the table", "There is some fruit on the table", "There is some fruits on the table"], answer: "There is some fruit on the table" },
  ],
  speaking: {
    level1Prompt: "I'd like some {input}, please.",
    level1Placeholder: "Ví dụ: rice, chicken, noodles, water...",
    level2Situation: "Bạn đang gọi món tại một nhà hàng. Hỏi thực đơn, gọi món chính và đồ uống, hỏi về tráng miệng và yêu cầu thanh toán.",
    level2Hint: "Excuse me, can I see the menu? I'd like [món ăn]. Can I have [đồ uống]? For dessert, I'd like [tráng miệng]. Can we have the bill, please?",
  },
  grammar: {
    title: "Countable & Uncountable Nouns — Danh từ đếm được và không đếm được",
    rule: "Countable: a/an + noun, some + noun-s  |  Uncountable: some + noun (no -s)",
    examples: [
      { en: "I'd like an egg and some bread.", vn: "Cho tôi một quả trứng và một ít bánh mì." },
      { en: "Can I have some water?", vn: "Tôi có thể có một ít nước không?" },
      { en: "There are two eggs in the fridge.", vn: "Có hai quả trứng trong tủ lạnh." },
      { en: "Do you have any rice?", vn: "Bạn có cơm không?" },
    ],
    tip: "Countable nouns có thể đếm được (one apple, two eggs). Uncountable nouns không đếm được và không dùng 'a/an' (some rice, some water). Dùng 'some' cho khẳng định và 'any' cho câu hỏi/phủ định.",
    dialogueExample: {
      speaker: "Lan",
      text: "We say 'some pho', not 'a pho'.",
      translation: "Chúng ta nói 'some pho', không nói 'a pho'.",
      highlight: "some pho",
    },
    ccq: {
      question: "Câu nào đúng với 'water' (uncountable)?",
      options: ["I'd like a water.", "I'd like two waters.", "I'd like some water.", "I'd like waters."],
      answer: "I'd like some water.",
    },
  },
  matchingExercise: {
    title: "Đếm được hay không đếm được?",
    pairs: [
      { left: "egg (có thể đếm)", right: "an egg / two eggs" },
      { left: "water (không đếm được)", right: "some water" },
      { left: "apple (có thể đếm)", right: "an apple / three apples" },
      { left: "rice (không đếm được)", right: "some rice" },
      { left: "bread (không đếm được)", right: "some bread" },
    ],
  },
  practiceQuiz: [
    { id: "pq1", question: "'Water' là loại danh từ gì?", options: ["Countable", "Uncountable", "Cả hai", "Không xác định"], answer: "Uncountable", type: "multiple-choice" },
    { id: "pq2", question: "Chọn câu đúng:", options: ["I'd like a rice.", "I'd like some rice.", "I'd like two rices.", "I'd like a rices."], answer: "I'd like some rice.", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ đúng: 'Do you have ___ chicken?'", options: [], answer: "any", type: "cloze" },
  ],

  practiceTranslate: [
    { id: "pt8-1", prompt_vn: "Tôi muốn gọi một tô phở.", answer: "I would like to order a bowl of pho." },
    { id: "pt8-2", prompt_vn: "Bạn có muốn uống gì không?", answer: "Would you like something to drink?" },
    { id: "pt8-3", prompt_vn: "Mang hóa đơn cho tôi với.", answer: "Can I have the bill, please?" },
  ],
  quiz: [
    { id: "q1", question: "Câu gọi món lịch sự nhất:", options: ["I want some soup.", "Give me some soup.", "I'd like some soup, please.", "Some soup for me."], answer: "I'd like some soup, please.", type: "multiple-choice" },
    { id: "q2", question: "'Egg' là countable. Chọn câu đúng:", options: ["some egg", "a eggs", "two eggs", "some eggs is"], answer: "two eggs", type: "multiple-choice" },
    { id: "q3", question: "Muốn tính tiền, bạn nói gì?", options: ["Can we have the bill, please?", "I want to pay now.", "Give me the money.", "The bill, now."], answer: "Can we have the bill, please?", type: "multiple-choice" },
    { id: "q4", question: "Điền từ vào: 'Can I have ___ bread, please?'", options: [], answer: "some", type: "cloze" },
    { id: "q5", question: "Điền từ vào: 'There isn't ___ coffee left.'", options: [], answer: "any", type: "cloze" },
    { id: "q6", question: "Cho tôi một tô phở, làm ơn.", options: [], answer: "I'd like some noodle soup, please.", type: "translate" },
    { id: "q7", question: "Bạn có muốn thêm rau không?", options: [], answer: "Would you like any vegetables?", type: "translate" },
  ],
  scrambleExercises: [
    {
      id: "s8-1",
      prompt_vn: "Cho tôi một ít cơm, làm ơn.",
      words: ["I'd", "like", "some", "rice", "please", "."],
      answer: "I'd like some rice please .",
    },
    {
      id: "s8-2",
      prompt_vn: "Bạn có thịt gà không?",
      words: ["Do", "you", "have", "any", "chicken", "?"],
      answer: "Do you have any chicken ?",
    },
    {
      id: "s8-3",
      prompt_vn: "Cho chúng tôi tính tiền nhé?",
      words: ["Can", "we", "have", "the", "bill", "please", "?"],
      answer: "Can we have the bill please ?",
    },
  ],
  cumulativeReviewQuestions: [
    {
      id: "cr8-1",
      question: "Hỏi giá một chiếc áo sơ mi: (Unit 7: Shopping)",
      options: ["How much are this shirt?", "How much is this shirt?", "How many is this shirt?", "How much this shirt?"],
      answer: "How much is this shirt?",
      type: "multiple-choice",
    },
    {
      id: "cr8-2",
      question: "Những đôi giày này giá bao nhiêu? (Unit 7)",
      options: [],
      answer: "How much are these shoes?",
      type: "translate",
    },
  ],
};

export default unit8;
