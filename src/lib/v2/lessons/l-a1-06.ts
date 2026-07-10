import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — home / rooms / furniture: there is / there are.
 * Core: house · apartment · room · bedroom · living room · kitchen · bathroom ·
 * sofa · bed · there is / there are · This is my room…
 * Spiral: a1-03 family (This is my family / brother light).
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA106: LessonSpec = {
  id: "l-a1-06",
  phase: "P1",
  cefr: "A1",
  title_vi: "Nhà cửa",
  estimatedMin: 35,
  canDo: [
    "Mô tả nhà/phòng với there is / there are: There is a sofa…",
    "Giới thiệu phòng: This is my room / living room…",
    "Kể 3–5 chi tiết về nhà (rooms + furniture) khi guest visit / small talk",
  ],
  situation:
    "Đồng nghiệp nước ngoài ghé nhà (hoặc video call tour): họ hỏi Tell me about your place. Bạn cần mô tả ngắn — This is my living room, There is a sofa, There are two bedrooms — và hỏi lại họ.",
  culturalNote_vi:
    "apartment (AmE) ≈ flat (BrE). living room = phòng khách (hai từ, không livingroom). there is + số ít; there are + số nhiều. How many bedrooms are there? rất hay hỏi khi nói về nhà. VN hay nhầm There have → There is/are.",
  jobAngle: "Hosting a colleague / describing your place in small talk",
  lexis: [
    {
      id: "v1",
      word: "house",
      phonetic: "/haʊs/",
      meaning_vi: "ngôi nhà",
      example_en: "I live in a small house.",
      l1_note_vi:
        "house = nhà (thường có sân/đất). apartment = căn hộ. Không: my houses khi chỉ một nhà.",
    },
    {
      id: "v2",
      word: "apartment",
      phonetic: "/əˈpɑːtmənt/",
      meaning_vi: "căn hộ",
      example_en: "This is my apartment.",
      l1_note_vi:
        "apartment (AmE) ≈ flat (BrE). in my apartment — không on my apartment.",
    },
    {
      id: "v3",
      word: "room",
      phonetic: "/ruːm/",
      meaning_vi: "phòng",
      example_en: "This is my room.",
      l1_note_vi:
        "room = phòng. This is my room — không This is room (thiếu my/a).",
    },
    {
      id: "v4",
      word: "bedroom",
      phonetic: "/ˈbedruːm/",
      meaning_vi: "phòng ngủ",
      example_en: "There are two bedrooms.",
      l1_note_vi:
        "bedroom (một từ). There IS a bedroom (số ít) / There ARE two bedrooms (số nhiều).",
    },
    {
      id: "v5",
      word: "living room",
      phonetic: "/ˈlɪvɪŋ ruːm/",
      meaning_vi: "phòng khách",
      example_en: "This is the living room.",
      l1_note_vi:
        "living room = hai từ. SAI: livingroom. Stress: LIV-ing room.",
    },
    {
      id: "v6",
      word: "kitchen",
      phonetic: "/ˈkɪtʃɪn/",
      meaning_vi: "nhà bếp",
      example_en: "There is a kitchen.",
      l1_note_vi:
        "kitchen — stress KI-tchen. There is a kitchen (số ít + a).",
    },
    {
      id: "v7",
      word: "bathroom",
      phonetic: "/ˈbɑːθruːm/",
      meaning_vi: "phòng tắm / nhà vệ sinh",
      example_en: "Is there a bathroom?",
      l1_note_vi:
        "bathroom thường = toilet + tắm (AmE). Is there a…? — đảo there is.",
    },
    {
      id: "v8",
      word: "sofa",
      phonetic: "/ˈsəʊfə/",
      meaning_vi: "ghế sofa",
      example_en: "There is a big sofa in the living room.",
      l1_note_vi:
        "sofa / couch (AmE). There is a sofa — không There have a sofa.",
    },
    {
      id: "v9",
      word: "bed",
      phonetic: "/bed/",
      meaning_vi: "giường",
      example_en: "There is a bed in my bedroom.",
      l1_note_vi:
        "bed = giường. in my bedroom — vị trí phòng. Không: There are a bed.",
    },
    {
      id: "v10",
      word: "there is",
      phonetic: "/ðeər ɪz/",
      meaning_vi: "có (số ít)",
      example_en: "There is a sofa in the living room.",
      l1_note_vi:
        "there is + danh từ số ít. SAI: There have a sofa / There is two sofas.",
    },
    {
      id: "v11",
      word: "there are",
      phonetic: "/ðeər ɑː/",
      meaning_vi: "có (số nhiều)",
      example_en: "There are two bedrooms.",
      l1_note_vi:
        "there are + danh từ số nhiều. SAI: There is two bedrooms / There have two bedrooms.",
    },
    {
      id: "v12",
      word: "This is my room",
      phonetic: "/ðɪs ɪz maɪ ruːm/",
      meaning_vi: "Đây là phòng của tôi",
      example_en: "This is my room. Come in!",
      l1_note_vi:
        "This is + my + room. SAI: This my room / This is room of me.",
    },
  ],
  grammar: {
    title: "there is / there are (home & rooms)",
    rule: "There is + singular. There are + plural. This is my room…",
    examples: [
      { en: "There is a sofa in the living room.", vi: "Có một ghế sofa trong phòng khách." },
      { en: "There are two bedrooms.", vi: "Có hai phòng ngủ." },
      { en: "This is my room.", vi: "Đây là phòng của tôi." },
      { en: "Is there a bathroom?", vi: "Có phòng tắm không?" },
      { en: "There isn't a balcony.", vi: "Không có ban công." },
    ],
    vnNote:
      "there is (số ít) / there are (số nhiều). Không dùng There have như «có». Câu hỏi: Is there…? / Are there…? Phủ định: There isn't / There aren't. This is my room — giới thiệu phòng (không dùng there is khi chỉ tay «đây là»).",
    ccq: {
      question: "Câu nào đúng?",
      options: [
        "There are two bedrooms.",
        "There is two bedrooms.",
        "There have two bedrooms.",
        "There are a bedrooms.",
      ],
      answer: "There are two bedrooms.",
      explanation_vi: "two bedrooms = số nhiều → there are.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Có một ghế sofa — câu đúng",
      options: [
        "There is a sofa.",
        "There are a sofa.",
        "There have a sofa.",
        "There is sofa.",
      ],
      answer: "There is a sofa.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: There _____ two bedrooms. (is / are / have)",
      stem: "There _____ two bedrooms.",
      answer: "are",
      explanation_vi: "two bedrooms = số nhiều → are.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: is / There / a / living / sofa / in / the / room",
      words: ["There", "is", "a", "sofa", "in", "the", "living", "room"],
      answer: "There is a sofa in the living room",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Giới thiệu phòng — câu đúng",
      options: [
        "This is my room.",
        "This my room.",
        "There is my room.",
        "This is room my.",
      ],
      answer: "This is my room.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: There is two bedrooms.",
      stem: "There is two bedrooms.",
      answer: "There are two bedrooms.",
      explanation_vi: "two bedrooms → there are.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Is there a kitchen? → đáp có",
      options: [
        "Yes, there is.",
        "Yes, there are.",
        "I like cooking.",
        "This is my brother.",
      ],
      answer: "Yes, there is.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Guest visit — tour the apartment",
        context_vi: "Alex ghé nhà Linh lần đầu; Linh giới thiệu các phòng.",
        lines: [
          {
            id: "d1-1",
            speaker: "Alex",
            text: "Wow, nice place! Is this your apartment?",
            translation_vi: "Ồ, nhà đẹp! Đây là căn hộ của bạn à?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "Yes! This is the living room. There is a big sofa.",
            translation_vi: "Đúng! Đây là phòng khách. Có một ghế sofa lớn.",
          },
          {
            id: "d1-3",
            speaker: "Alex",
            text: "How many bedrooms are there?",
            translation_vi: "Có bao nhiêu phòng ngủ?",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "There are two bedrooms and one bathroom.",
            translation_vi: "Có hai phòng ngủ và một phòng tắm.",
          },
          {
            id: "d1-5",
            speaker: "Alex",
            text: "Is there a kitchen?",
            translation_vi: "Có nhà bếp không?",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "Yes, there is. Come — this is my room!",
            translation_vi: "Có. Vào đây — đây là phòng của mình!",
          },
          {
            id: "d1-7",
            speaker: "Alex",
            text: "Nice! There is a big bed and a window.",
            translation_vi: "Hay! Có giường lớn và cửa sổ.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "There is a sofa in the living room",
        options: [
          "There is a sofa in the living room",
          "There are sofas in the living room",
          "There is a bed in the living room",
          "There have a sofa in the living room",
        ],
        answer: "There is a sofa in the living room",
      },
      {
        id: "lac2",
        audio_text: "There are two bedrooms",
        options: [
          "There are two bedrooms",
          "There is two bedrooms",
          "There are two bathrooms",
          "There have two bedrooms",
        ],
        answer: "There are two bedrooms",
      },
      {
        id: "lac3",
        audio_text: "This is my room",
        options: [
          "This is my room",
          "This my room",
          "There is my room",
          "This is my brother",
        ],
        answer: "This is my room",
      },
      {
        id: "lac4",
        audio_text: "Is there a bathroom",
        options: [
          "Is there a bathroom",
          "Are there a bathroom",
          "Is there a bedroom",
          "There is a bathroom",
        ],
        answer: "Is there a bathroom",
      },
    ],
  },
  fluency: {
    items: [
      { en: "This is my apartment.", vi: "Đây là căn hộ của tôi." },
      { en: "This is the living room.", vi: "Đây là phòng khách." },
      { en: "There is a sofa in the living room.", vi: "Có một ghế sofa trong phòng khách." },
      { en: "There are two bedrooms.", vi: "Có hai phòng ngủ." },
      { en: "There is a kitchen.", vi: "Có một nhà bếp." },
      { en: "Is there a bathroom?", vi: "Có phòng tắm không?" },
      { en: "This is my room.", vi: "Đây là phòng của tôi." },
      { en: "There is a bed in my bedroom.", vi: "Có một giường trong phòng ngủ của tôi." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Alex ghé nhà. Nói 5–7 câu: This is my apartment/house → rooms (living room, bedroom…) → There is… / There are… (furniture) → optional Is there…? hỏi lại.",
    successCriteria_vi: [
      "Có This is my room / living room / apartment (giới thiệu)",
      "Có there is + danh từ số ít",
      "Có there are + danh từ số nhiều (hoặc số: two bedrooms…)",
      "Không dùng There have thay there is/are",
    ],
    scaffold_en: [
      "This is my apartment.",
      "This is the living room.",
      "There is a big sofa.",
      "There are two bedrooms.",
      "There is a kitchen.",
      "Is there a bathroom?",
      "Yes, there is.",
      "This is my room.",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "There _____ a sofa in the living room.",
        options: ["is", "are", "have", "has"],
        answer: "is",
        explanation_vi: "a sofa = số ít → there is.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Câu đúng:",
        options: [
          "There are two bedrooms.",
          "There is two bedrooms.",
          "There have two bedrooms.",
          "There are a bedrooms.",
        ],
        answer: "There are two bedrooms.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "There have a kitchen là câu đúng trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Dùng There is a kitchen — không There have.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Giới thiệu phòng ngủ:",
        options: [
          "This is my bedroom.",
          "There is my bedroom.",
          "This my bedroom.",
          "There are my bedroom.",
        ],
        answer: "This is my bedroom.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "There _____ two chairs. (is / are / have)",
        answer: "are",
      },
      {
        id: "q6",
        type: "mcq",
        question: "living room nghĩa là…",
        options: ["phòng khách", "phòng ngủ", "nhà bếp", "phòng tắm"],
        answer: "phòng khách",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-03) Giới thiệu người nhà:",
        options: [
          "This is my brother.",
          "There is my brother.",
          "I like my brother reading.",
          "There are a brother.",
        ],
        answer: "This is my brother.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-03) Do you have any brothers or sisters?",
        options: [
          "Yes, I have one sister.",
          "There is a sofa.",
          "I like swimming.",
          "This is the kitchen.",
        ],
        answer: "Yes, I have one sister.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-03) His name is… / Her name is… dùng khi:",
        options: [
          "Nói tên người (he/she)",
          "Mô tả đồ đạc trong nhà",
          "Hỏi giá tiền",
          "Nói sở thích V-ing",
        ],
        answer: "Nói tên người (he/she)",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/ð/ in there · /r/ in room",
    description_vi:
      "there /ðeə/: /ð/ lưỡi chạm răng nhẹ (không «de» hay «ze» cứng). room /ruːm/: /r/ Anh-Mỹ + nguyên âm dài /uː/. living /ˈlɪvɪŋ/: /ŋ/ cuối rõ.",
    examples: [
      {
        word: "there",
        ipa: "/ðeə/",
        tip_vi: "/ð/ mềm — không «dea» không /ð/.",
      },
      {
        word: "room",
        ipa: "/ruːm/",
        tip_vi: "/uː/ dài; không «rum» ngắn.",
      },
      {
        word: "living",
        ipa: "/ˈlɪvɪŋ/",
        tip_vi: "LIV-ing; cuối /ŋ/ như -ing.",
      },
    ],
  },
};
