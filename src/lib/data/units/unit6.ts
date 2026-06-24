import { UnitData } from "@/components/learn/UnitTemplate";

export const unit6: UnitData = {
  unitId: "unit-6",
  title: "Unit 6: Home & Daily Life",
  level: "A1",
  xp: 80,
  estimatedTime: 40,
  description: "Học từ vựng về nhà ở, đồ đạc và cách dùng 'There is/are' để mô tả không gian.",
  badgeName: "Người Giữ Nhà",
  situation: "Bạn bè quốc tế đến thăm nhà lần đầu — bạn cần dẫn họ tham quan và mô tả các phòng, đồ vật trong nhà.",
  learningOutcomes: [
    "Mô tả các phòng và đồ dùng trong nhà bằng tiếng Anh",
    "Dùng there is / there are để nói về không gian",
    "Hỏi về nhà và chỗ ở của người khác"
  ],
  badgeEmoji: "🏠",
  warmupGreetings: [
    { emoji: "🛋️", en: "There is a sofa in the living room.", vn: "Có một chiếc ghế sofa trong phòng khách.", context: "Mô tả đồ đạc trong nhà" },
    { emoji: "🛏️", en: "There are two beds in the bedroom.", vn: "Có hai chiếc giường trong phòng ngủ.", context: "Dùng 'are' với số nhiều" },
    { emoji: "❓", en: "Is there a bathroom upstairs?", vn: "Có phòng tắm ở tầng trên không?", context: "Câu hỏi với There is/are" }
  ],
  culturalNote: "Người Việt thường nói <span class=\"text-emerald-400 font-semibold\">living room</span> (phòng khách) hoặc <span class=\"text-emerald-400 font-semibold\">sitting room</span> (British English). <span class=\"text-emerald-400 font-semibold\">There is/are</span> được dùng rất nhiều khi mô tả địa điểm và không gian — rất thực tế cho giao tiếp hàng ngày.",
  vocab: [
    { id: 1, word: "bedroom", emoji: "🛏️", phonetic: "/ˈbɛdruːm/", meaning: "phòng ngủ", example: "There are two bedrooms in my house.", example2: "My bedroom is on the second floor.", collocation: "master bedroom", audio: "/audio/unit6/bedroom.mp3" },
    { id: 2, word: "kitchen", emoji: "🍳", phonetic: "/ˈkɪtʃɪn/", meaning: "nhà bếp", example: "The kitchen is next to the dining room.", example2: "She cooks in the kitchen every morning.", collocation: "kitchen table", audio: "/audio/unit6/kitchen.mp3" },
    { id: 3, word: "living room", emoji: "🛋️", phonetic: "/ˈlɪvɪŋ ruːm/", meaning: "phòng khách", example: "We watch TV in the living room.", example2: "The living room has a big sofa.", collocation: "living room sofa", audio: "/audio/unit6/living_room.mp3" },
    { id: 4, word: "bathroom", emoji: "🚿", phonetic: "/ˈbɑːθruːm/", meaning: "phòng tắm", example: "There is one bathroom on each floor.", example2: "He takes a shower in the bathroom.", collocation: "bathroom mirror", audio: "/audio/unit6/bathroom.mp3" },
    { id: 5, word: "table", emoji: "🪑", phonetic: "/ˈteɪbəl/", meaning: "cái bàn", example: "There is a table in the kitchen.", example2: "We eat dinner at the table.", collocation: "dining table", audio: "/audio/unit6/table.mp3" },
    { id: 6, word: "chair", emoji: "🪑", phonetic: "/tʃɛər/", meaning: "cái ghế", example: "There are four chairs around the table.", example2: "Please sit on the chair.", collocation: "wooden chair", audio: "/audio/unit6/chair.mp3" },
    { id: 7, word: "sofa", emoji: "🛋️", phonetic: "/ˈsəʊfə/", meaning: "ghế sofa", example: "I like sitting on the sofa to relax.", example2: "The sofa is very comfortable.", collocation: "comfortable sofa", audio: "/audio/unit6/sofa.mp3" },
    { id: 8, word: "window", emoji: "🪟", phonetic: "/ˈwɪndəʊ/", meaning: "cửa sổ", example: "There is a big window in my bedroom.", example2: "Please open the window for fresh air.", collocation: "open the window", audio: "/audio/unit6/window.mp3" },
    { id: 9, word: "door", emoji: "🚪", phonetic: "/dɔːr/", meaning: "cánh cửa", example: "Please close the door.", example2: "There is a door between the rooms.", collocation: "front door / back door", audio: "/audio/unit6/door.mp3" },
    { id: 10, word: "lamp", emoji: "💡", phonetic: "/læmp/", meaning: "đèn", example: "There is a lamp on the desk.", example2: "The lamp gives warm light.", collocation: "bedside lamp", audio: "/audio/unit6/lamp.mp3" },
    { id: 11, word: "wardrobe", emoji: "🪞", phonetic: "/ˈwɔːdrəʊb/", meaning: "tủ quần áo", example: "There is a wardrobe in the corner.", example2: "My clothes are in the wardrobe.", collocation: "built-in wardrobe", audio: "/audio/unit6/wardrobe.mp3" },
    { id: 12, word: "garden", emoji: "🌿", phonetic: "/ˈɡɑːdən/", meaning: "khu vườn", example: "There is a small garden behind the house.", example2: "I love sitting in the garden.", collocation: "flower garden / back garden", audio: "/audio/unit6/garden.mp3" },
  ],
  dialogues: [
    {
      id: 1,
      title: "Mô tả căn hộ mới",
      audio: "/audio/unit6/dialogue_1.mp3",
      desc: "Hoa cho bạn xem căn hộ mới của cô ấy qua video call.",
      lines: [
        { id: "d1-1", speaker: "Hoa", text: "Welcome to my new apartment! This is the living room.", translation: "Chào mừng đến với căn hộ mới của mình! Đây là phòng khách." },
        { id: "d1-2", speaker: "Tom", text: "Wow! It's nice. Is there a sofa?", translation: "Ồ! Đẹp quá. Có ghế sofa không?" },
        { id: "d1-3", speaker: "Hoa", text: "Yes, there is a big blue sofa and two chairs.", translation: "Có, có một chiếc sofa xanh lớn và hai chiếc ghế." },
        { id: "d1-4", speaker: "Tom", text: "How many bedrooms are there?", translation: "Có bao nhiêu phòng ngủ?" },
        { id: "d1-5", speaker: "Hoa", text: "There are two bedrooms and one bathroom.", translation: "Có hai phòng ngủ và một phòng tắm." },
        { id: "d1-6", speaker: "Tom", text: "Is there a garden?", translation: "Có khu vườn không?" },
        { id: "d1-7", speaker: "Hoa", text: "No, there isn't. But there is a big balcony!", translation: "Không. Nhưng có một ban công rộng!" },
      ]
    },
    {
      id: 2,
      title: "Tìm đồ trong nhà",
      audio: "/audio/unit6/dialogue_2.mp3",
      desc: "Minh đang hỏi mẹ về vị trí đồ vật trong nhà.",
      lines: [
        { id: "d2-1", speaker: "Minh", text: "Mum, where is my bag?", translation: "Mẹ ơi, túi của con ở đâu vậy?" },
        { id: "d2-2", speaker: "Mum", text: "There is a bag on the chair in the kitchen.", translation: "Có một chiếc túi trên chiếc ghế trong bếp." },
        { id: "d2-3", speaker: "Minh", text: "Is there a book on the table?", translation: "Có quyển sách nào trên bàn không?" },
        { id: "d2-4", speaker: "Mum", text: "Yes, there are three books on the table.", translation: "Có, có ba quyển sách trên bàn." },
      ]
    },
  ],
  listenAndChoose: [
    { id: "lac1", audio_text: "There is a sofa in the living room", options: ["There is a bed in the living room", "There is a sofa in the living room", "There are sofas in the living room", "There is a sofa in the bedroom"], answer: "There is a sofa in the living room" },
    { id: "lac2", audio_text: "There are two chairs in the kitchen", options: ["There is one chair in the kitchen", "There are two chairs in the kitchen", "There are two tables in the kitchen", "There are three chairs in the kitchen"], answer: "There are two chairs in the kitchen" },
    { id: "lac3", audio_text: "Is there a bathroom", options: ["Is there a bedroom", "Are there bathrooms", "Is there a bathroom", "Is there a balcony"], answer: "Is there a bathroom" },
    { id: "lac4", audio_text: "There isn't a garden", options: ["There is a garden", "There are gardens", "There isn't a garden", "There aren't gardens"], answer: "There isn't a garden" },
    { id: "lac5", audio_text: "There are three bedrooms in my house", options: ["There is one bedroom in my house", "There are three bedrooms in my house", "There are three bathrooms in my house", "There are three bedrooms in the hotel"], answer: "There are three bedrooms in my house" },
  ],
  speaking: {
    level1Prompt: "In my house, there is a {input}.",
    level1Placeholder: "Ví dụ: kitchen, living room, garden...",
    level2Situation: "Mô tả nhà của bạn cho một người bạn. Nói về các phòng, đồ đạc và những gì bạn thích nhất trong ngôi nhà.",
    level2Hint: "In my house, there are [số] rooms. There is a [phòng] and a [phòng]. In the [phòng], there is/are [đồ đạc]. My favourite room is the [phòng] because [lý do].",
  },
  grammar: {
    title: "There is / There are — Mô tả không gian",
    rule: "There is + singular  |  There are + plural  |  There isn't / There aren't",
    examples: [
      { en: "There is a table in the kitchen.", vn: "Có một chiếc bàn trong bếp." },
      { en: "There are two chairs in the room.", vn: "Có hai chiếc ghế trong phòng." },
      { en: "Is there a bathroom upstairs?", vn: "Có phòng tắm ở tầng trên không?" },
      { en: "There aren't any windows in this room.", vn: "Phòng này không có cửa sổ nào." },
    ],
    tip: "Dùng 'There IS' với danh từ số ít và 'There ARE' với danh từ số nhiều. Phủ định: 'There ISN'T' và 'There AREN'T'. Câu hỏi: đảo 'Is/Are there...?'",
    vnNote: "⚠️ Lưu ý: 'There is/There are' không có tương đương trực tiếp trong tiếng Việt. Lỗi phổ biến: dùng 'There is' với số nhiều — 'There is chairs' (SAI) → 'There are chairs' (ĐÚNG).",
    dialogueExample: {
      speaker: "Hoa",
      text: "There are two bedrooms and one bathroom.",
      translation: "Có hai phòng ngủ và một phòng tắm.",
      highlight: "There are",
    },
    ccq: {
      question: "Câu nào đúng khi mô tả nhiều đồ đạc?",
      options: ["There is two chairs.", "There are two chair.", "There are two chairs.", "There is a two chairs."],
      answer: "There are two chairs.",
    },
  },
  matchingExercise: {
    title: "Nối phòng với đồ đạc phù hợp",
    pairs: [
      { left: "bedroom", right: "bed" },
      { left: "kitchen", right: "table" },
      { left: "living room", right: "sofa" },
      { left: "bathroom", right: "mirror" },
      { left: "garden", right: "flowers" },
    ],
  },
  practiceQuiz: [
    { id: "pq1", question: "Chọn câu đúng mô tả nhiều ghế:", options: ["There is two chairs.", "There are two chairs.", "There be two chairs.", "Is there two chairs."], answer: "There are two chairs.", type: "multiple-choice" },
    { id: "pq2", question: "Câu hỏi đúng về phòng ngủ:", options: ["Is there a bedroom?", "There is a bedroom?", "Are there a bedroom?", "Is a bedroom there?"], answer: "Is there a bedroom?", type: "multiple-choice" },
    { id: "pq3", question: "Điền vào chỗ trống: 'There ___ a lamp on the table.'", options: [], answer: "is", type: "cloze" },
  ],

  practiceTranslate: [
    { id: "pt6-1", prompt_vn: "Có một cái bàn trong phòng bếp.", answer: "There is a table in the kitchen." },
    { id: "pt6-2", prompt_vn: "Không có ghế sofa trong phòng ngủ.", answer: "There isn't a sofa in the bedroom." },
    { id: "pt6-3", prompt_vn: "Có hai phòng ngủ trong căn hộ của tôi.", answer: "There are two bedrooms in my apartment." },
  ],
  quiz: [
    { id: "q1", question: "Chọn câu đúng với 'two windows':", options: ["There is two windows.", "There are two windows.", "There have two windows.", "There be two windows."], answer: "There are two windows.", type: "multiple-choice" },
    { id: "q2", question: "Cách nói phủ định của 'There is a garden':", options: ["There isn't a garden.", "There aren't a garden.", "There isn't any gardens.", "There are no garden."], answer: "There isn't a garden.", type: "multiple-choice" },
    { id: "q3", question: "Phòng nào thường có sofa?", options: ["bedroom", "kitchen", "living room", "bathroom"], answer: "living room", type: "multiple-choice" },
    { id: "q4", question: "Điền từ còn thiếu: 'There ___ a wardrobe in the corner.'", options: [], answer: "is", type: "cloze" },
    { id: "q5", question: "Điền từ còn thiếu: 'Are there ___ chairs in the room?'", options: [], answer: "any", type: "cloze" },
    { id: "q6", question: "Có hai phòng ngủ trong ngôi nhà của tôi.", options: [], answer: "There are two bedrooms in my house.", type: "translate" },
    { id: "q7", question: "Có phòng tắm nào ở tầng dưới không?", options: [], answer: "Is there a bathroom downstairs?", type: "translate" },
  ],
  scrambleExercises: [
    {
      id: "s6-1",
      prompt_vn: "Có một chiếc bàn trong bếp.",
      words: ["There", "is", "a", "table", "in", "the", "kitchen", "."],
      answer: "There is a table in the kitchen .",
    },
    {
      id: "s6-2",
      prompt_vn: "Có hai chiếc ghế trong phòng.",
      words: ["There", "are", "two", "chairs", "in", "the", "room", "."],
      answer: "There are two chairs in the room .",
    },
    {
      id: "s6-3",
      prompt_vn: "Có phòng tắm ở tầng trên không?",
      words: ["Is", "there", "a", "bathroom", "upstairs", "?"],
      answer: "Is there a bathroom upstairs ?",
    },
  ],
  cumulativeReviewQuestions: [
    {
      id: "cr6-1",
      question: "Chọn câu đúng: 'I like ___ in my free time.' (Unit 5: Hobbies)",
      options: ["swim", "to swimming", "swimming", "swims"],
      answer: "swimming",
      type: "multiple-choice",
    },
    {
      id: "cr6-2",
      question: "Cô ấy thích chụp ảnh vào cuối tuần. (Unit 5)",
      options: [],
      answer: "She likes taking photos on weekends.",
      type: "translate",
    },
  ],

  fluencyDrill: {
    items: [
      { en: "There is a meeting room", vn: "Có một phòng họp" },
      { en: "There are 10 employees", vn: "Có 10 nhân viên" },
      { en: "There isn't a printer", vn: "Không có máy in" },
      { en: "There aren't any desks", vn: "Không có bàn làm việc" },
      { en: "Is there a bathroom?", vn: "Có nhà vệ sinh không?" },
      { en: "Are there any chairs?", vn: "Có ghế không?" },
      { en: "There is a problem", vn: "Có một vấn đề" },
      { en: "There are many options", vn: "Có nhiều lựa chọn" },
    ],
  },
  readingPassage: {
    id: "unit6-reading-1",
    title: "My New Apartment",
    title_vn: "Đọc đoạn về căn hộ mới",
    level: "A1" as const,
    text:
      "My name is Linh. I have a new apartment in Ho Chi Minh City. " +
      "There are three rooms: a bedroom, a kitchen, and a living room. " +
      "In the living room, there is a big sofa and two chairs. " +
      "There is also a lamp on the table near the window. " +
      "My bedroom has a wardrobe and a door to the balcony. " +
      "There is no garden, but I put flowers on the balcony. " +
      "I love my new home!",
    questions: [
      {
        id: "u6r-q1",
        question_vn: "Linh có bao nhiêu phòng trong căn hộ?",
        options: ["Two rooms", "Three rooms", "Four rooms", "Five rooms"],
        answer: "Three rooms",
        explanation_vn: "Đoạn văn nói 'There are three rooms: a bedroom, a kitchen, and a living room.'",
      },
      {
        id: "u6r-q2",
        question_vn: "Trong phòng khách có gì?",
        options: [
          "A wardrobe and a lamp",
          "A big sofa and two chairs",
          "A table and four chairs",
          "A garden and a balcony",
        ],
        answer: "A big sofa and two chairs",
        explanation_vn: "'In the living room, there is a big sofa and two chairs.'",
      },
      {
        id: "u6r-q3",
        question_vn: "Căn hộ của Linh có vườn không?",
        options: [
          "Yes, there is a big garden",
          "Yes, there is a small garden",
          "No, but there is a balcony",
          "No, and there is no balcony either",
        ],
        answer: "No, but there is a balcony",
        explanation_vn: "'There is no garden, but I put flowers on the balcony.'",
      },
      {
        id: "u6r-q4",
        question_vn: "Đèn (lamp) ở đâu?",
        options: [
          "On the sofa",
          "In the bedroom",
          "On the table near the window",
          "On the balcony",
        ],
        answer: "On the table near the window",
        explanation_vn: "'There is also a lamp on the table near the window.'",
      },
    ],
  },
};

export default unit6;