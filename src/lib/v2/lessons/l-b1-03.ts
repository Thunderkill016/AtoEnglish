import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — predictions & trends.
 * Core: will (prediction) + might (possibility) + probably + trend talk
 * (grow / more people will… / demand is rising). Job/news angle.
 * Spiral: b1-02 (according to / announced / main idea / I think / currently).
 * L1 notes ≥50% (B1 schema gate); aim high for VN adults.
 */
export const lessonB103: LessonSpec = {
  id: "l-b1-03",
  phase: "P3",
  cefr: "B1",
  title_vi: "Dự đoán & xu hướng",
  estimatedMin: 40,
  canDo: [
    "Dự đoán tương lai: will / might / probably + will",
    "Nói về xu hướng: is growing / more people will… / demand is rising",
    "Kết hợp tin ngắn + dự đoán trong small talk công việc (45–60s)",
  ],
  situation:
    "Đồng nghiệp nước ngoài vừa đọc tin: 'Remote work is growing.' Họ hỏi: 'What do you think will happen next year?' Bạn cần trả lời 45–60 giây: xu hướng hiện tại + dự đoán chắc (will / probably) + khả năng (might) + lý do ngắn.",
  culturalNote_vi:
    "Ở meeting / networking quốc tế, 'What will happen…?' thường cần softener: I think… / It might… / It will probably…. will = khá chắc; might = có thể; probably + will = gần chắc. Tránh: It will can… / Maybe it will maybe… / Trend is grow (thiếu -ing).",
  jobAngle: "Office / news small talk — forecast trends for team or market",
  lexis: [
    {
      id: "v1",
      word: "will",
      phonetic: "/wɪl/",
      meaning_vi: "sẽ (dự đoán)",
      example_en: "I think remote work will keep growing.",
      l1_note_vi:
        "will + V1 (không to). Prediction: I think it will… Không: will to go / will going.",
    },
    {
      id: "v2",
      word: "might",
      phonetic: "/maɪt/",
      meaning_vi: "có thể (khả năng)",
      example_en: "Prices might rise next quarter.",
      l1_note_vi:
        "might + V1 = possibility (yếu hơn will). Không: might to / might can.",
    },
    {
      id: "v3",
      word: "probably",
      phonetic: "/ˈprɒbəbli/",
      meaning_vi: "có lẽ / gần như chắc",
      example_en: "We will probably hire more staff.",
      l1_note_vi:
        "will probably + V / probably will + V. Soften prediction. Stress PROB-ably.",
    },
    {
      id: "v4",
      word: "trend",
      phonetic: "/trend/",
      meaning_vi: "xu hướng",
      example_en: "The main trend is more hybrid work.",
      l1_note_vi:
        "a trend / the trend is…. trend (n) ≠ trendy (adj thời trang).",
    },
    {
      id: "v5",
      word: "grow",
      phonetic: "/ɡrəʊ/",
      meaning_vi: "tăng / phát triển",
      example_en: "Demand is growing this year.",
      l1_note_vi:
        "grow (v) → growth (n). is growing = đang tăng. Không: is grow.",
    },
    {
      id: "v6",
      word: "likely",
      phonetic: "/ˈlaɪkli/",
      meaning_vi: "có khả năng",
      example_en: "It is likely that sales will increase.",
      l1_note_vi:
        "be likely to + V / It is likely that…. ≠ like (thích).",
    },
    {
      id: "v7",
      word: "expect",
      phonetic: "/ɪkˈspekt/",
      meaning_vi: "kỳ vọng / dự kiến",
      example_en: "We expect demand will rise.",
      l1_note_vi:
        "expect + that / expect + object + to. Không: expect for (thừa for).",
    },
    {
      id: "v8",
      word: "in the future",
      phonetic: "/ɪn ðə ˈfjuːtʃə/",
      meaning_vi: "trong tương lai",
      example_en: "In the future, more meetings will be online.",
      l1_note_vi:
        "in the future (khung thời gian). future (n). Không: in future luôn = always (UK formal khác nghĩa).",
    },
    {
      id: "v9",
      word: "demand",
      phonetic: "/dɪˈmɑːnd/",
      meaning_vi: "nhu cầu",
      example_en: "Demand for English is rising.",
      l1_note_vi:
        "demand for + N. high/low demand. ≠ 'require' mọi chỗ.",
    },
    {
      id: "v10",
      word: "forecast",
      phonetic: "/ˈfɔːkɑːst/",
      meaning_vi: "dự báo",
      example_en: "The forecast says sales will grow.",
      l1_note_vi:
        "forecast (n/v). sales forecast. Gần prediction nhưng formal hơn (business).",
    },
    {
      id: "v11",
      word: "rise",
      phonetic: "/raɪz/",
      meaning_vi: "tăng (tự tăng)",
      example_en: "Costs might rise next year.",
      l1_note_vi:
        "rise (nội) — prices rise. raise (ngoại) — raise prices. VN hay nhầm hai từ.",
    },
    {
      id: "v12",
      word: "prediction",
      phonetic: "/prɪˈdɪkʃn/",
      meaning_vi: "dự đoán",
      example_en: "My prediction is that hybrid work will stay.",
      l1_note_vi:
        "prediction (n); predict (v). make a prediction. Không: prediction about luôn bắt buộc.",
    },
  ],
  grammar: {
    title: "will / might / probably + trend talk",
    rule: "will (sure-ish) · might (possible) · will probably · trend: is growing",
    examples: [
      {
        en: "I think remote work will keep growing.",
        vi: "Tôi nghĩ remote work sẽ tiếp tục tăng.",
      },
      {
        en: "Prices might rise next quarter.",
        vi: "Giá có thể tăng quý tới.",
      },
      {
        en: "We will probably hire more support staff.",
        vi: "Chúng ta có lẽ sẽ tuyển thêm người support.",
      },
    ],
    vnNote:
      "B1 dự đoán: will + V1 (khá chắc) · might + V1 (có thể) · will probably (gần chắc). Xu hướng: is growing / more people will…. Đừng: will can / might to / is grow / It will maybe can…",
    ccq: {
      question: "Câu nào đúng khi nói khả năng (chưa chắc)?",
      options: [
        "Prices might rise next year",
        "Prices will can rise next year",
        "Prices might to rise next year",
        "Prices is rise next year",
      ],
      answer: "Prices might rise next year",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Dự đoán khá chắc: Demand ___ grow.",
      options: ["will", "will to", "wills", "is will"],
      answer: "will",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Khả năng (yếu hơn will):",
      options: ["might", "must always", "will can", "is must"],
      answer: "might",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: probably / will / hire / We / more / staff",
      words: ["We", "will", "probably", "hire", "more", "staff"],
      answer: "We will probably hire more staff",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: The trend is grow this year.",
      stem: "The trend is grow this year.",
      answer: "The trend is growing this year.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "rise vs raise — câu đúng:",
      options: [
        "Prices might rise",
        "Prices might raise",
        "Prices might rising",
        "Prices might to rise",
      ],
      answer: "Prices might rise",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "trend ≈",
      options: ["xu hướng", "hợp đồng", "lương", "ngày nghỉ"],
      answer: "xu hướng",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Small talk tin remote work",
        context_vi: "Hai đồng nghiệp nói về xu hướng remote trước stand-up.",
        lines: [
          {
            id: "1",
            speaker: "Alex",
            text: "Did you see the news? Remote work is growing again.",
            translation_vi: "Bạn thấy tin chưa? Remote work lại đang tăng.",
          },
          {
            id: "2",
            speaker: "Lan",
            text: "Yes. According to the report, more companies will go hybrid.",
            translation_vi: "Rồi. Theo báo cáo, nhiều công ty sẽ hybrid.",
          },
          {
            id: "3",
            speaker: "Alex",
            text: "What do you think will happen next year?",
            translation_vi: "Bạn nghĩ năm sau sẽ thế nào?",
          },
          {
            id: "4",
            speaker: "Lan",
            text: "I think our team will probably work from home three days.",
            translation_vi: "Tôi nghĩ team ta có lẽ remote ba ngày.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "But the office might stay open for big meetings.",
            translation_vi: "Nhưng văn phòng có thể vẫn mở cho họp lớn.",
          },
          {
            id: "6",
            speaker: "Alex",
            text: "That sounds fair. Demand for online tools will keep rising.",
            translation_vi: "Hợp lý. Nhu cầu tool online sẽ tiếp tục tăng.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Dự báo sales cho manager",
        context_vi: "Manager hỏi forecast ngắn trước review quý.",
        lines: [
          {
            id: "1",
            speaker: "Manager",
            text: "Can you share a short forecast for next quarter?",
            translation_vi: "Bạn chia sẻ forecast ngắn quý tới được không?",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "Sure. The main trend is that demand is growing in the south.",
            translation_vi: "Được. Xu hướng chính là nhu cầu đang tăng ở miền Nam.",
          },
          {
            id: "3",
            speaker: "Minh",
            text: "I expect sales will increase by about ten percent.",
            translation_vi: "Tôi kỳ vọng sales sẽ tăng khoảng mười phần trăm.",
          },
          {
            id: "4",
            speaker: "Minh",
            text: "We will probably hire two more support staff.",
            translation_vi: "Chúng ta có lẽ sẽ tuyển thêm hai người support.",
          },
          {
            id: "5",
            speaker: "Manager",
            text: "Any risks?",
            translation_vi: "Có rủi ro không?",
          },
          {
            id: "6",
            speaker: "Minh",
            text: "Costs might rise if shipping gets slower.",
            translation_vi: "Chi phí có thể tăng nếu ship chậm hơn.",
          },
          {
            id: "7",
            speaker: "Minh",
            text: "In the future, more customers will order online.",
            translation_vi: "Trong tương lai, nhiều khách sẽ order online hơn.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I think remote work will keep growing",
        options: [
          "I think remote work will keep growing",
          "I think remote work will to keep growing",
          "I think remote work might keep grew",
          "I think remote work is grow",
        ],
        answer: "I think remote work will keep growing",
      },
      {
        id: "lac2",
        audio_text: "Prices might rise next quarter",
        options: [
          "Prices might rise next quarter",
          "Prices might raise next quarter",
          "Prices will can rise next quarter",
          "Prices might to rise next quarter",
        ],
        answer: "Prices might rise next quarter",
      },
      {
        id: "lac3",
        audio_text: "We will probably hire more staff",
        options: [
          "We will probably hire more staff",
          "We will probably hiring more staff",
          "We probably will can hire more staff",
          "We will probably hired more staff",
        ],
        answer: "We will probably hire more staff",
      },
      {
        id: "lac4",
        audio_text: "The main trend is more hybrid work",
        options: [
          "The main trend is more hybrid work",
          "The main trend is more hybrid worked",
          "The main idea is less hybrid work only",
          "The main trend was no hybrid work ever",
        ],
        answer: "The main trend is more hybrid work",
      },
      {
        id: "lac5",
        audio_text: "Demand for online tools is growing",
        options: [
          "Demand for online tools is growing",
          "Demand for online tools is grow",
          "Demand of online tools is growing",
          "Demand for online tools was never grow",
        ],
        answer: "Demand for online tools is growing",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "I think it will grow.",
        vi: "Tôi nghĩ nó sẽ tăng.",
      },
      {
        en: "It might rise next year.",
        vi: "Nó có thể tăng năm sau.",
      },
      {
        en: "We will probably hire more staff.",
        vi: "Chúng ta có lẽ sẽ tuyển thêm người.",
      },
      {
        en: "The main trend is hybrid work.",
        vi: "Xu hướng chính là hybrid work.",
      },
      {
        en: "Demand is growing this year.",
        vi: "Nhu cầu đang tăng năm nay.",
      },
      {
        en: "In the future, more meetings will be online.",
        vi: "Trong tương lai, nhiều cuộc họp sẽ online.",
      },
      {
        en: "I expect sales will increase.",
        vi: "Tôi kỳ vọng sales sẽ tăng.",
      },
      {
        en: "It is likely that costs will rise.",
        vi: "Có khả năng chi phí sẽ tăng.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Chọn 1 xu hướng (remote/hybrid, sales, tech, giá…). Nói 45–60 giây: trend hiện tại → will / will probably (dự đoán khá chắc) → might (rủi ro/khả năng) → lý do ngắn (because…).",
    successCriteria_vi: [
      "Nêu được ≥1 trend / situation hiện tại (is growing / currently…)",
      "Có ≥1 câu will hoặc will probably",
      "Có ≥1 câu might",
      "Có because / lý do ngắn hoặc expect/likely",
    ],
    scaffold_en: [
      "The main trend is… / … is growing.",
      "I think… will…",
      "We will probably…",
      "… might…",
      "because… / I expect…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Prediction (quite sure): Sales ___ grow.",
        options: ["will", "will to", "are will", "willing"],
        answer: "will",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Possibility (softer than will)",
        options: ["might", "must always", "will can", "is must"],
        answer: "might",
      },
      {
        id: "q3",
        type: "mcq",
        question: "Correct form",
        options: [
          "will probably hire",
          "will probably hiring",
          "probably will can hire",
          "will to probably hire",
        ],
        answer: "will probably hire",
      },
      {
        id: "q4",
        type: "true-false",
        question: "Prices might raise next year. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "trend ≈",
        options: ["xu hướng", "hợp đồng", "ngày nghỉ", "lương cứng"],
        answer: "xu hướng",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Demand ___ English is rising.",
        options: ["for", "to", "of the", "at"],
        answer: "for",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-02) ___ to the news, sales rose.",
        options: ["According", "Accordingly", "Account", "Across"],
        answer: "According",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-02) Past: They ___ a new policy yesterday.",
        options: ["announced", "announce", "announcing", "announces"],
        answer: "announced",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-02) Light opinion: ___ it's fair.",
        options: ["I think", "I thinking", "According to me", "Me opinion"],
        answer: "I think",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-02) Now situation: ___, staff work hybrid.",
        options: ["Currently", "Yesterday", "Last year", "Once"],
        answer: "Currently",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "will /wɪl/ vs we'll /wiːl/",
    description_vi:
      "will /wɪl/ ngắn; we'll (= we will) /wiːl/ dài hơn. might /maɪt/ — /aɪ/. Stress: PROB-ably, pre-DIC-tion, de-MAND.",
    examples: [
      { word: "will", tip_vi: "/wɪl/ không thành /vi/" },
      { word: "might", tip_vi: "/maɪt/ diphthong" },
      { word: "probably", tip_vi: "stress PROB" },
      { word: "trend", tip_vi: "/trend/ final /d/ rõ" },
    ],
  },
};
