import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — describe people & places: appearance, personality, location.
 * Core: look / look like · be + adj · located in/near · there is/are.
 * Work/life: teammate intro, office/venue description. Spiral: b1-06 process.
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB107: LessonSpec = {
  id: "l-b1-07",
  phase: "P3",
  cefr: "B1",
  title_vi: "Mô tả người & nơi",
  estimatedMin: 40,
  canDo: [
    "Mô tả người: appearance + personality (look / look like / be + adj)",
    "Mô tả nơi: location + atmosphere (located / near / spacious / quiet)",
    "Nói 45–60s work/life: 1 người + 1 nơi, rõ chi tiết và cảm nhận",
  ],
  situation:
    "Office + client visit: đồng nghiệp hỏi 'What's the new teammate like?' / 'Where is the office?' Bạn trả lời 45–60 giây: appearance + personality · location + look/feel · ≥1 look like / located / reliable.",
  culturalNote_vi:
    "Describe people: look (ngoại hình tạm) · look like (giống ai / trông như) · be + adj (personality ổn định). Describe places: located in/near · there is/are · spacious / modern / quiet. Soften: quite / rather / a bit. Tránh: He look tall / She is look like kind / The office locate in…",
  jobAngle:
    "Teammate intro, client venue, office location — reliable, patient, spacious, near metro",
  lexis: [
    {
      id: "v1",
      word: "tall",
      phonetic: "/tɔːl/",
      meaning_vi: "cao (người)",
      example_en: "She is quite tall and well-dressed.",
      l1_note_vi:
        "tall (người/cây) ≠ high (núi/tòa nhà). quite tall = khá cao.",
    },
    {
      id: "v2",
      word: "well-dressed",
      phonetic: "/ˌwel ˈdrest/",
      meaning_vi: "ăn mặc chỉn chu",
      example_en: "He always looks well-dressed in meetings.",
      l1_note_vi:
        "hyphen well-dressed. look + adj. Không: well dress.",
    },
    {
      id: "v3",
      word: "friendly",
      phonetic: "/ˈfrendli/",
      meaning_vi: "thân thiện",
      example_en: "Our new teammate is friendly and open.",
      l1_note_vi:
        "friendly (adj) — không friendful. be friendly to + N.",
    },
    {
      id: "v4",
      word: "reliable",
      phonetic: "/rɪˈlaɪəbl/",
      meaning_vi: "đáng tin cậy",
      example_en: "She is reliable — she never misses a deadline.",
      l1_note_vi:
        "reliable (adj) · rely on + N. stress re-LI-able.",
    },
    {
      id: "v5",
      word: "patient",
      phonetic: "/ˈpeɪʃnt/",
      meaning_vi: "kiên nhẫn",
      example_en: "He is patient with new clients.",
      l1_note_vi:
        "patient (adj) ≠ patient (n = bệnh nhân, ngữ cảnh y). be patient with…",
    },
    {
      id: "v6",
      word: "hardworking",
      phonetic: "/ˌhɑːdˈwɜːkɪŋ/",
      meaning_vi: "chăm chỉ / siêng năng",
      example_en: "They are hardworking and calm under pressure.",
      l1_note_vi:
        "hardworking (1 word). hard-working cũng ok. ≠ hard work (n).",
    },
    {
      id: "v7",
      word: "look like",
      phonetic: "/lʊk laɪk/",
      meaning_vi: "trông giống / trông như",
      example_en: "She looks like her manager in photos.",
      l1_note_vi:
        "look like + N/clause. look + adj (tall). Không: look likes.",
    },
    {
      id: "v8",
      word: "personality",
      phonetic: "/ˌpɜːsəˈnæləti/",
      meaning_vi: "tính cách",
      example_en: "His personality is calm and reliable.",
      l1_note_vi:
        "personality ≠ appearance. What is he like? = tính cách.",
    },
    {
      id: "v9",
      word: "located",
      phonetic: "/ləʊˈkeɪtɪd/",
      meaning_vi: "nằm / tọa lạc",
      example_en: "The office is located near the metro.",
      l1_note_vi:
        "be located in/near/on. Không: is locate / locates in.",
    },
    {
      id: "v10",
      word: "spacious",
      phonetic: "/ˈspeɪʃəs/",
      meaning_vi: "rộng rãi",
      example_en: "The meeting room is spacious and bright.",
      l1_note_vi:
        "spacious (adj) · space (n). Không: spacely.",
    },
    {
      id: "v11",
      word: "modern",
      phonetic: "/ˈmɒdn/",
      meaning_vi: "hiện đại",
      example_en: "It is a modern co-working space.",
      l1_note_vi:
        "modern (adj). modern office / design. stress MOD-ern.",
    },
    {
      id: "v12",
      word: "quiet",
      phonetic: "/ˈkwaɪət/",
      meaning_vi: "yên tĩnh",
      example_en: "The venue is quiet and good for calls.",
      l1_note_vi:
        "quiet (adj) ≠ quite (khá). /ˈkwaɪət/ vs /kwaɪt/.",
    },
  ],
  grammar: {
    title: "Describe people & places",
    rule: "look + adj · look like + N · be + personality · be located + place",
    examples: [
      {
        en: "She is tall and well-dressed. She looks friendly.",
        vi: "Cô ấy cao và ăn mặc chỉn chu. Trông thân thiện.",
      },
      {
        en: "He is reliable and patient with clients.",
        vi: "Anh ấy đáng tin và kiên nhẫn với khách.",
      },
      {
        en: "The office is located near the metro. It is spacious and quiet.",
        vi: "Văn phòng nằm gần metro. Rộng và yên tĩnh.",
      },
    ],
    vnNote:
      "Người: be + adj (personality) · look + adj (ngoại hình) · look like + N (giống). Nơi: be located in/near · there is/are · spacious/modern/quiet. Sai hay gặp: He look tall / She is look like kind / Office locate in… / quiet vs quite.",
    ccq: {
      question: "Câu nào đúng khi mô tả tính cách?",
      options: [
        "She is reliable and patient",
        "She look reliable and patient",
        "She is look like reliable",
        "She locates reliable",
      ],
      answer: "She is reliable and patient",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Ngoại hình tạm thời: She ___ well-dressed today.",
      options: ["looks", "look like", "is locate", "looks like"],
      answer: "looks",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Giống ai: He ___ his brother.",
      options: ["looks like", "looks", "is look", "locate"],
      answer: "looks like",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: The / office / is / located / near / the / metro",
      words: ["The", "office", "is", "located", "near", "the", "metro"],
      answer: "The office is located near the metro",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: She look tall and friendly.",
      stem: "She look tall and friendly.",
      answer: "She looks tall and friendly.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "What is he like? hỏi về:",
      options: [
        "tính cách / personality",
        "chỉ chiều cao",
        "chỉ địa chỉ",
        "chỉ thời tiết",
      ],
      answer: "tính cách / personality",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Nơi rộng rãi:",
      options: [
        "The room is spacious",
        "The room is locate spacious",
        "The room looks like spacious person",
        "The room are spacious",
      ],
      answer: "The room is spacious",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Colleague — teammate mới",
        context_vi: "Đồng nghiệp mô tả teammate mới: appearance + personality.",
        lines: [
          {
            id: "1",
            speaker: "Lan",
            text: "What's the new teammate like?",
            translation_vi: "Teammate mới thế nào?",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "She is tall and well-dressed. She looks friendly.",
            translation_vi: "Cô ấy cao, ăn mặc chỉn chu. Trông thân thiện.",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "And her personality?",
            translation_vi: "Còn tính cách thì sao?",
          },
          {
            id: "4",
            speaker: "Minh",
            text: "She is reliable and hardworking. She is also patient with clients.",
            translation_vi:
              "Cô ấy đáng tin và chăm chỉ. Cũng kiên nhẫn với khách.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "Does she look like anyone on the team?",
            translation_vi: "Cô ấy trông giống ai trong team không?",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "A bit. She looks like our last project lead in photos.",
            translation_vi:
              "Một chút. Cô ấy trông giống project lead cũ trong ảnh.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Client visit — mô tả văn phòng / venue",
        context_vi: "Hướng dẫn khách: vị trí office + không gian họp.",
        lines: [
          {
            id: "1",
            speaker: "Client",
            text: "Where is your office?",
            translation_vi: "Văn phòng các bạn ở đâu?",
          },
          {
            id: "2",
            speaker: "Hoa",
            text: "It is located near the metro, about five minutes on foot.",
            translation_vi: "Nằm gần metro, đi bộ khoảng năm phút.",
          },
          {
            id: "3",
            speaker: "Client",
            text: "What does the meeting space look like?",
            translation_vi: "Không gian họp trông thế nào?",
          },
          {
            id: "4",
            speaker: "Hoa",
            text: "It is modern and spacious. There is a quiet room for calls.",
            translation_vi:
              "Hiện đại và rộng. Có phòng yên tĩnh để gọi điện.",
          },
          {
            id: "5",
            speaker: "Client",
            text: "Sounds good. Is it easy to find?",
            translation_vi: "Nghe ổn. Có dễ tìm không?",
          },
          {
            id: "6",
            speaker: "Hoa",
            text: "Yes. First, exit the metro. Then follow the main street. Finally, look for the glass building.",
            translation_vi:
              "Có. Trước tiên ra khỏi metro. Rồi đi theo đường chính. Cuối cùng tìm tòa kính.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "She is tall and well-dressed",
        options: [
          "She is tall and well-dressed",
          "She look tall and well-dressed",
          "She is locate tall and well-dressed",
          "She looks like tall and well-dressed",
        ],
        answer: "She is tall and well-dressed",
      },
      {
        id: "lac2",
        audio_text: "He is reliable and patient with clients",
        options: [
          "He is reliable and patient with clients",
          "He look reliable and patient with clients",
          "He is look like reliable with clients",
          "He locates reliable and patient",
        ],
        answer: "He is reliable and patient with clients",
      },
      {
        id: "lac3",
        audio_text: "She looks like her manager in photos",
        options: [
          "She looks like her manager in photos",
          "She looks her manager in photos",
          "She is look like her manager",
          "She look likes her manager in photos",
        ],
        answer: "She looks like her manager in photos",
      },
      {
        id: "lac4",
        audio_text: "The office is located near the metro",
        options: [
          "The office is located near the metro",
          "The office locate near the metro",
          "The office is locate near the metro",
          "The office looks like near the metro",
        ],
        answer: "The office is located near the metro",
      },
      {
        id: "lac5",
        audio_text: "The meeting room is spacious and quiet",
        options: [
          "The meeting room is spacious and quiet",
          "The meeting room is spacely and quite",
          "The meeting room look spacious and quiet",
          "The meeting room are spacious and quiet",
        ],
        answer: "The meeting room is spacious and quiet",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "She is tall and well-dressed.",
        vi: "Cô ấy cao và ăn mặc chỉn chu.",
      },
      {
        en: "He is reliable and hardworking.",
        vi: "Anh ấy đáng tin và chăm chỉ.",
      },
      {
        en: "She looks friendly in meetings.",
        vi: "Cô ấy trông thân thiện trong họp.",
      },
      {
        en: "He is patient with new clients.",
        vi: "Anh ấy kiên nhẫn với khách mới.",
      },
      {
        en: "She looks like our last project lead.",
        vi: "Cô ấy trông giống project lead cũ.",
      },
      {
        en: "The office is located near the metro.",
        vi: "Văn phòng nằm gần metro.",
      },
      {
        en: "The room is modern and spacious.",
        vi: "Phòng hiện đại và rộng rãi.",
      },
      {
        en: "There is a quiet room for calls.",
        vi: "Có phòng yên tĩnh để gọi điện.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s: (1) mô tả 1 người work (teammate / manager / client) — appearance + personality; (2) mô tả 1 nơi (office / venue) — location + atmosphere. Dùng look / look like / located / reliable hoặc spacious.",
    successCriteria_vi: [
      "Có be + ≥2 personality/appearance adjectives",
      "Có look hoặc look like",
      "Có located / near / there is (mô tả nơi)",
      "Có spacious / modern / quiet hoặc reliable / patient / friendly",
    ],
    scaffold_en: [
      "She/He is … and … · She/He looks …",
      "She/He looks like …",
      "The office is located near …",
      "It is modern / spacious / quiet …",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Correct appearance line",
        options: [
          "She looks well-dressed today",
          "She look well-dressed today",
          "She is look well-dressed today",
          "She looks like well-dressed today",
        ],
        answer: "She looks well-dressed today",
      },
      {
        id: "q2",
        type: "mcq",
        question: "look like means",
        options: [
          "trông giống / trông như",
          "chỉ chiều cao",
          "nằm ở đâu",
          "luôn là quá khứ",
        ],
        answer: "trông giống / trông như",
      },
      {
        id: "q3",
        type: "mcq",
        question: "Correct place line",
        options: [
          "The office is located near the metro",
          "The office locate near the metro",
          "The office is locate near the metro",
          "The office looks near the metro only",
        ],
        answer: "The office is located near the metro",
      },
      {
        id: "q4",
        type: "true-false",
        question: "She look tall and friendly. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "quiet ≠",
        options: [
          "quite (khá)",
          "yên tĩnh",
          "not noisy",
          "calm place feeling",
        ],
        answer: "quite (khá)",
      },
      {
        id: "q6",
        type: "mcq",
        question: "What is she like? mainly asks about",
        options: [
          "personality",
          "only GPS location",
          "only height number",
          "only past tense",
        ],
        answer: "personality",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-06) First step marker:",
        options: ["First,", "Finally,", "After only,", "Unless,"],
        answer: "First,",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-06) Correct process line",
        options: [
          "After that, attach the file",
          "After that, you must to attach",
          "After that attach to the file",
          "After that, attaching will",
        ],
        answer: "After that, attach the file",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-06) Last step often uses:",
        options: ["Finally,", "First,", "Before first,", "If not ever,"],
        answer: "Finally,",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-06) Before to submit, check the file. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "look /lʊk/ · quiet /ˈkwaɪət/",
    description_vi:
      "look /lʊk/ — /ʊ/ ngắn (không /uː/). quiet /ˈkwaɪət/ ≠ quite /kwaɪt/. reliable stress re-LI-able. located /ləʊˈkeɪtɪd/. spacious /ˈspeɪʃəs/. Nối: looks_like · located_near.",
    examples: [
      { word: "look", tip_vi: "/lʊk/ /ʊ/ ngắn" },
      { word: "quiet", tip_vi: "/ˈkwaɪət/ ≠ quite" },
      { word: "reliable", tip_vi: "re-LI-able" },
      { word: "located", tip_vi: "lo-CA-ted" },
    ],
  },
};
