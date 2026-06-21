import { UnitData } from "@/components/learn/UnitTemplate";

// ─────────────────────────────────────────────────────────────────────────────
// UNIT A0-2 — Số Đếm & Đếm Số (Numbers & Counting)
// Level 0 / Foundation — Pre-CEFR A0
// Grammar: How much? / How many? — count vs non-count (intro only)
// L1 Alert: Vietnamese uses "bao nhiêu" for ALL quantities; English
//   requires choosing "much" (uncountable) vs "many" (countable)
// ─────────────────────────────────────────────────────────────────────────────

export const unitA02: UnitData = {
  unitId: "unit-a0-2",
  title: "Unit A0-2: Số Đếm & Đếm Số",
  level: "A0",
  xp: 60,
  estimatedTime: 40,
  description:
    "Học số từ 1 đến 20 và cách hỏi giá tiền — từ vựng thiết yếu trong mọi giao dịch hàng ngày.",
  badgeName: "Người Đếm Số",
  badgeEmoji: "🔢",

  situation:
    "Bạn đang mua hàng tại cửa hàng tiện lợi có thu ngân người nước ngoài. Giá hiển thị là $12. Làm sao bạn hỏi và trả lời về giá?",

  learningOutcomes: [
    "Đếm và đọc số từ 1 đến 20 bằng tiếng Anh",
    "Hỏi giá bằng \"How much is it?\"",
    "Nói số điện thoại đơn giản",
  ],

  culturalNote:
    'Người Mỹ đọc số điện thoại <span class="text-emerald-400 font-semibold">từng chữ số một</span>: 090-123-456 → "zero nine zero, one two three, four five six". Không đọc theo cụm như "không chín không" mà đọc "zero nine zero". Số 0 trong điện thoại đọc là "zero" hoặc "oh".',

  warmupGreetings: [
    {
      emoji: "💰",
      en: "How much is it?",
      vn: "Cái này giá bao nhiêu?",
      context: "Hỏi giá khi mua hàng",
    },
    {
      emoji: "📱",
      en: "My phone number is zero nine zero...",
      vn: "Số điện thoại tôi là 090...",
      context: "Đọc số điện thoại bằng tiếng Anh",
    },
    {
      emoji: "🛒",
      en: "I want two, please.",
      vn: "Tôi muốn hai cái.",
      context: "Nói số lượng khi mua hàng",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "one",
      emoji: "1️⃣",
      phonetic: "/wʌn/",
      meaning: "Một (1)",
      example: "I have one sister.",
      example2: "One coffee, please.",
      collocation: "number one / one by one / one more",
      audio: "/audio/unit-a0-2/one.mp3",
    },
    {
      id: 2,
      word: "two",
      emoji: "2️⃣",
      phonetic: "/tuː/",
      meaning: "Hai (2)",
      example: "I have two cats.",
      example2: "Give me two tickets, please.",
      collocation: "two of us / number two / just the two of us",
      audio: "/audio/unit-a0-2/two.mp3",
    },
    {
      id: 3,
      word: "three",
      emoji: "3️⃣",
      phonetic: "/θriː/",
      meaning: "Ba (3)",
      example: "There are three people.",
      example2: "I wake up at three AM sometimes.",
      collocation: "three times / the three of us",
      audio: "/audio/unit-a0-2/three.mp3",
    },
    {
      id: 4,
      word: "five",
      emoji: "5️⃣",
      phonetic: "/faɪv/",
      meaning: "Năm (5)",
      example: "I have five minutes.",
      example2: "The coffee costs five dollars.",
      collocation: "high five / five-star / five minutes",
      audio: "/audio/unit-a0-2/five.mp3",
    },
    {
      id: 5,
      word: "ten",
      emoji: "🔟",
      phonetic: "/ten/",
      meaning: "Mười (10)",
      example: "I work ten hours a day.",
      example2: "Ten people are waiting.",
      collocation: "ten minutes / ten percent / top ten",
      audio: "/audio/unit-a0-2/ten.mp3",
    },
    {
      id: 6,
      word: "twenty",
      emoji: "2️⃣0️⃣",
      phonetic: "/ˈtwenti/",
      meaning: "Hai mươi (20)",
      example: "I am twenty years old.",
      example2: "Twenty minutes to go.",
      collocation: "twenty-four seven / twenty dollars",
      audio: "/audio/unit-a0-2/twenty.mp3",
    },
    {
      id: 7,
      word: "hundred",
      emoji: "💯",
      phonetic: "/ˈhʌndrəd/",
      meaning: "Một trăm (100)",
      example: "It costs one hundred dollars.",
      example2: "There are a hundred people here.",
      collocation: "a hundred / one hundred percent / hundreds of",
      audio: "/audio/unit-a0-2/hundred.mp3",
    },
    {
      id: 8,
      word: "dollar",
      emoji: "💵",
      phonetic: "/ˈdɒlər/",
      meaning: "Đô la",
      example: "It costs fifteen dollars.",
      example2: "Do you have a dollar?",
      collocation: "US dollar / a dollar bill / dollar store",
      audio: "/audio/unit-a0-2/dollar.mp3",
    },
    {
      id: 9,
      word: "price",
      emoji: "🏷️",
      phonetic: "/praɪs/",
      meaning: "Giá / Giá cả",
      example: "What is the price?",
      example2: "The price is too high.",
      collocation: "price tag / full price / half price",
      audio: "/audio/unit-a0-2/price.mp3",
    },
    {
      id: 10,
      word: "change",
      emoji: "🪙",
      phonetic: "/tʃeɪndʒ/",
      meaning: "Tiền thối / Tiền lẻ",
      example: "Here is your change.",
      example2: "Do you have change for a twenty?",
      collocation: "give change / keep the change / small change",
      audio: "/audio/unit-a0-2/change.mp3",
    },
  ],

  grammar: {
    title: "How much? / How many? — Hỏi số lượng và giá",
    rule: "How MUCH + danh từ không đếm được (tiền, nước…) | How MANY + danh từ đếm được (táo, người…)",
    conjugation: [
      { subject: "How MUCH",  form: "+ uncountable",  example: "How much is it? / How much water?" },
      { subject: "How MANY",  form: "+ countable",    example: "How many apples? / How many people?" },
      { subject: "It costs",  form: "+ số tiền",      example: "It costs $15. / It's $20." },
    ],
    examples: [
      { en: "How much is this shirt?",   vn: "Cái áo này giá bao nhiêu?" },
      { en: "It costs twenty dollars.",  vn: "Nó giá hai mươi đô la." },
      { en: "How many do you want?",     vn: "Bạn muốn bao nhiêu cái?" },
      { en: "I want two, please.",       vn: "Tôi muốn hai cái, làm ơn." },
    ],
    tip: "Mẹo nhớ: Nếu bạn đếm được (one apple, two apples…) → dùng MANY. Nếu không đếm được (water, money, rice…) → dùng MUCH. Khi hỏi giá LUÔN LUÔN dùng 'How much?' vì tiền là uncountable!",

    vnNote:
      "⚠️ LỖI PHỔ BIẾN: Người Việt hay dùng 'How much apples?' — SAI!\n\nTiếng Việt chỉ có 'bao nhiêu' cho tất cả → Tiếng Anh phải chọn:\n- Apples = đếm được → 'How MANY apples?'\n- Money/water/rice = không đếm được → 'How MUCH money?'\n\n❌ 'How much apples do you want?'\n✅ 'How MANY apples do you want?'\n\n❌ 'How many is the bag?'\n✅ 'How MUCH is the bag?'",

    dialogueExample: {
      speaker: "Customer",
      text: "How much is this bag? It costs fifteen dollars.",
      translation: "Cái túi này giá bao nhiêu? Nó giá mười lăm đô.",
      highlight: "How much / costs",
    },

    ccq: {
      question: "Hỏi giá một chiếc áo — câu nào đúng?",
      options: [
        "How many is the shirt?",
        "How much is the shirt? ✓",
        "How much are the shirt?",
        "How many costs the shirt?",
      ],
      answer: "How much is the shirt? ✓",
    },
  },

  matchingExercise: {
    title: "Nối số với chữ số",
    pairs: [
      { left: "one",     right: "1" },
      { left: "five",    right: "5" },
      { left: "ten",     right: "10" },
      { left: "twenty",  right: "20" },
      { left: "hundred", right: "100" },
    ],
  },

  practiceQuiz: [
    {
      id: "pq2-1",
      question: "Hỏi giá một cái túi — câu nào đúng?",
      options: [
        "How many is the bag?",
        "How much is the bag?",
        "How much are the bag?",
        "What price the bag?",
      ],
      answer: "How much is the bag?",
      type: "multiple-choice",
    },
    {
      id: "pq2-2",
      question: "Điền từ còn thiếu: 'It ___ fifteen dollars.'",
      options: [],
      answer: "costs",
      type: "cloze",
    },
    {
      id: "pq2-3",
      question: "'$20' đọc bằng tiếng Anh là gì?",
      options: [
        "Twenty dollar",
        "Twenty dollars",
        "Twenti dollars",
        "Dollar twenty",
      ],
      answer: "Twenty dollars",
      type: "multiple-choice",
    },
  ],

  practiceTranslate: [
    {
      id: "pt2-1",
      prompt_vn: "Cái áo này giá bao nhiêu?",
      answer: "How much is this shirt?",
    },
    {
      id: "pt2-2",
      prompt_vn: "Nó giá hai mươi đô la.",
      answer: "It costs twenty dollars.",
    },
    {
      id: "pt2-3",
      prompt_vn: "Tôi muốn hai cái, làm ơn.",
      answer: "I want two, please.",
    },
  ],

  scrambleExercises: [
    {
      id: "s2-1",
      prompt_vn: "Cái áo này giá bao nhiêu?",
      words: ["How", "much", "is", "this", "shirt", "?"],
      answer: "How much is this shirt ?",
    },
    {
      id: "s2-2",
      prompt_vn: "Nó giá mười lăm đô la.",
      words: ["It", "costs", "fifteen", "dollars", "."],
      answer: "It costs fifteen dollars .",
    },
    {
      id: "s2-3",
      prompt_vn: "Bạn muốn bao nhiêu cái?",
      words: ["How", "many", "do", "you", "want", "?"],
      answer: "How many do you want ?",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Mua hàng tại cửa hàng",
      audio: "/audio/unit-a0-2/dialogue_1.mp3",
      desc: "Minh mua quần áo tại cửa hàng có nhân viên người nước ngoài.",
      lines: [
        {
          id: "d2-1-1",
          speaker: "Minh",
          text: "Excuse me. How much is this shirt?",
          translation: "Xin lỗi. Cái áo này giá bao nhiêu?",
        },
        {
          id: "d2-1-2",
          speaker: "Staff",
          text: "It costs twenty dollars.",
          translation: "Nó giá hai mươi đô la.",
        },
        {
          id: "d2-1-3",
          speaker: "Minh",
          text: "And the bag? How much is it?",
          translation: "Còn cái túi? Nó giá bao nhiêu?",
        },
        {
          id: "d2-1-4",
          speaker: "Staff",
          text: "The bag is fifteen dollars.",
          translation: "Cái túi giá mười lăm đô la.",
        },
        {
          id: "d2-1-5",
          speaker: "Minh",
          text: "I'll take the shirt. Here is twenty dollars.",
          translation: "Tôi lấy cái áo. Đây là hai mươi đô la.",
        },
        {
          id: "d2-1-6",
          speaker: "Staff",
          text: "Thank you! Here is your change — five dollars.",
          translation: "Cảm ơn! Đây là tiền thối — năm đô la.",
        },
      ],
    },
    {
      id: 2,
      title: "Hỏi số điện thoại",
      audio: "/audio/unit-a0-2/dialogue_2.mp3",
      desc: "Linh và Sarah trao đổi số điện thoại.",
      lines: [
        {
          id: "d2-2-1",
          speaker: "Sarah",
          text: "Can I have your phone number?",
          translation: "Tôi có thể có số điện thoại của bạn không?",
        },
        {
          id: "d2-2-2",
          speaker: "Linh",
          text: "Sure! It's zero nine zero, one two three, four five six.",
          translation: "Tất nhiên! Là 090-123-456.",
        },
        {
          id: "d2-2-3",
          speaker: "Sarah",
          text: "Zero nine zero, one two three, four five six?",
          translation: "Zero chín zero, một hai ba, bốn năm sáu?",
        },
        {
          id: "d2-2-4",
          speaker: "Linh",
          text: "Yes, that's right!",
          translation: "Đúng rồi!",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "lac2-1",
      audio_text: "How much is it",
      options: ["How much is it", "How many is it", "How much are it", "What is the price"],
      answer: "How much is it",
    },
    {
      id: "lac2-2",
      audio_text: "It costs twenty dollars",
      options: ["It costs ten dollars", "It costs twelve dollars", "It costs twenty dollars", "It costs two dollars"],
      answer: "It costs twenty dollars",
    },
    {
      id: "lac2-3",
      audio_text: "three",
      options: ["free", "three", "tree", "green"],
      answer: "three",
    },
  ],

  fluencyDrill: {
    title: "Đếm số & hỏi giá",
    items: [
      { en: "one, two, three",        vn: "một, hai, ba" },
      { en: "four, five, six",        vn: "bốn, năm, sáu" },
      { en: "seven, eight, nine",     vn: "bảy, tám, chín" },
      { en: "ten, twenty, hundred",   vn: "mười, hai mươi, một trăm" },
      { en: "How much is it?",        vn: "Cái này giá bao nhiêu?" },
      { en: "It costs $15.",          vn: "Nó giá 15 đô la." },
      { en: "Here is your change.",   vn: "Đây là tiền thối của bạn." },
      { en: "I want two, please.",    vn: "Tôi muốn hai cái, làm ơn." },
    ],
  },

  speaking: {
    level1Prompt: "It costs {input} dollars.",
    level1Placeholder: "Nhập số tiền (VD: 15, 20, 100)...",
    level2Situation:
      "Bạn đang mua sắm tại cửa hàng của người bản ngữ. Hỏi giá ít nhất 3 mặt hàng, nhận tiền thối và cảm ơn.",
    level2Hint:
      "Excuse me. How much is this [item]? / It costs [số] dollars. / Here is [số] dollars. / Thank you!",
  },

  quiz: [
    {
      id: "q2-1",
      question: "Câu nào ĐÚNG khi hỏi giá?",
      options: [
        "How many is the bag?",
        "How much is the bag?",
        "How much are the bag?",
        "What much is the bag?",
      ],
      answer: "How much is the bag?",
      type: "multiple-choice",
    },
    {
      id: "q2-2",
      question: "Điền từ còn thiếu: 'It ___ fifteen dollars.'",
      options: ["is", "costs", "have", "price"],
      answer: "costs",
      type: "multiple-choice",
    },
    {
      id: "q2-3",
      question: "Số 20 viết bằng chữ là gì?",
      options: ["twelve", "twenty", "two", "tweny"],
      answer: "twenty",
      type: "multiple-choice",
    },
    {
      id: "q2-4",
      question: "Điền từ còn thiếu: 'How ___ apples do you want?' (táo = đếm được)",
      options: [],
      answer: "many",
      type: "cloze",
    },
    {
      id: "q2-5",
      question: "Điền từ còn thiếu: 'How ___ is the coffee?' (coffee = không đếm được)",
      options: [],
      answer: "much",
      type: "cloze",
    },
    {
      id: "q2-6",
      question: "Cái áo này giá bao nhiêu? (Dịch sang tiếng Anh)",
      options: [],
      answer: "How much is this shirt?",
      type: "translate",
    },
    {
      id: "q2-7",
      question: "Nó giá hai mươi đô la. (Dịch sang tiếng Anh)",
      options: [],
      answer: "It costs twenty dollars.",
      type: "translate",
    },
  ],
};

export default unitA02;
