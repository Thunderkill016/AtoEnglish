import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — rules & obligation at work.
 * Core: must / have to / should (+ mustn't / don't have to light).
 * Office compliance / policy dialogues. Spiral: b1-03 (will / might / probably / trend).
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB104: LessonSpec = {
  id: "l-b1-04",
  phase: "P3",
  cefr: "B1",
  title_vi: "Quy định & nghĩa vụ",
  estimatedMin: 40,
  canDo: [
    "Nói quy định: must / have to + V1 (bắt buộc)",
    "Đưa lời khuyên / khuyến nghị: should + V1",
    "Giải thích policy / compliance ngắn (45–60s) tại office",
  ],
  situation:
    "Onboarding tuần đầu: HR/manager giải thích office rules. Đồng nghiệp hỏi: 'What must we do? What should we do?' Bạn cần trả lời 45–60 giây: 2–3 quy định (must / have to) + 1 lời khuyên (should) + 1 việc không được / không bắt buộc (mustn't hoặc don't have to).",
  culturalNote_vi:
    "Ở workplace quốc tế, must / have to = bắt buộc (policy, safety, legal); should = lời khuyên / best practice (mạnh hơn 'can' nhưng yếu hơn must). Soften khi nói với sếp: We have to… / The policy says we must…. Tránh: must to / should to / have to must… / You must can….",
  jobAngle: "Office compliance — safety, badge, WFO policy, deadlines for new hires",
  lexis: [
    {
      id: "v1",
      word: "must",
      phonetic: "/mʌst/",
      meaning_vi: "phải (bắt buộc mạnh)",
      example_en: "You must wear your badge in the office.",
      l1_note_vi:
        "must + V1 (không to). Strong rule/obligation. Không: must to wear / must wearing.",
    },
    {
      id: "v2",
      word: "have to",
      phonetic: "/hæv tuː/",
      meaning_vi: "phải (bắt buộc / quy định ngoài)",
      example_en: "We have to arrive by 9 a.m. on office days.",
      l1_note_vi:
        "have to + V1 ≈ must (external rule). he/she has to. Không: have to to / has to must.",
    },
    {
      id: "v3",
      word: "should",
      phonetic: "/ʃʊd/",
      meaning_vi: "nên (khuyến nghị)",
      example_en: "You should read the policy before day one.",
      l1_note_vi:
        "should + V1 = advice, not absolute law. Không: should to / should must.",
    },
    {
      id: "v4",
      word: "rule",
      phonetic: "/ruːl/",
      meaning_vi: "quy định / luật nội bộ",
      example_en: "One important rule is no food at desks.",
      l1_note_vi:
        "a rule / the rules. follow the rules. ≠ ruler (thước kẻ).",
    },
    {
      id: "v5",
      word: "policy",
      phonetic: "/ˈpɒləsi/",
      meaning_vi: "chính sách (công ty)",
      example_en: "Our hybrid policy says two office days.",
      l1_note_vi:
        "company policy / according to the policy. ≠ politics (chính trị).",
    },
    {
      id: "v6",
      word: "allowed",
      phonetic: "/əˈlaʊd/",
      meaning_vi: "được phép",
      example_en: "Phones are not allowed in the lab.",
      l1_note_vi:
        "be allowed to + V. not allowed = không được. Gần permitted.",
    },
    {
      id: "v7",
      word: "forbidden",
      phonetic: "/fəˈbɪdn/",
      meaning_vi: "bị cấm",
      example_en: "Smoking is forbidden in the building.",
      l1_note_vi:
        "forbidden ≈ not allowed / you must not. Formal hơn 'no'.",
    },
    {
      id: "v8",
      word: "compliance",
      phonetic: "/kəmˈplaɪəns/",
      meaning_vi: "tuân thủ quy định",
      example_en: "All staff must complete compliance training.",
      l1_note_vi:
        "compliance (n); comply with + rules. Workplace/legal tone.",
    },
    {
      id: "v9",
      word: "badge",
      phonetic: "/bædʒ/",
      meaning_vi: "thẻ nhân viên",
      example_en: "You must show your badge at the gate.",
      l1_note_vi:
        "ID badge / staff badge. wear / show your badge.",
    },
    {
      id: "v10",
      word: "deadline",
      phonetic: "/ˈdedlaɪn/",
      meaning_vi: "hạn chót",
      example_en: "We have to finish before the deadline.",
      l1_note_vi:
        "meet / miss a deadline. before the deadline (không: in the deadline).",
    },
    {
      id: "v11",
      word: "safety",
      phonetic: "/ˈseɪfti/",
      meaning_vi: "an toàn",
      example_en: "Safety rules must be followed every day.",
      l1_note_vi:
        "safety (n) · safe (adj). safety first / safety training.",
    },
    {
      id: "v12",
      word: "on time",
      phonetic: "/ɒn taɪm/",
      meaning_vi: "đúng giờ",
      example_en: "You should arrive on time for meetings.",
      l1_note_vi:
        "on time = đúng giờ. in time = kịp lúc (trước khi muộn). VN hay nhầm.",
    },
  ],
  grammar: {
    title: "must / have to / should — rules & advice",
    rule: "must / have to + V1 (obligation) · should + V1 (advice) · mustn't (ban) · don't have to (optional)",
    examples: [
      {
        en: "You must wear your badge in the office.",
        vi: "Bạn phải đeo thẻ trong văn phòng.",
      },
      {
        en: "We have to complete compliance training this week.",
        vi: "Chúng ta phải hoàn thành training tuân thủ tuần này.",
      },
      {
        en: "You should read the hybrid policy before Monday.",
        vi: "Bạn nên đọc policy hybrid trước thứ Hai.",
      },
    ],
    vnNote:
      "B1 nghĩa vụ: must / have to + V1 (bắt buộc) · should + V1 (nên). Cấm: must not / mustn't + V1. Không bắt buộc: don't have to + V1. Đừng: must to / should to / have to must / You must can…",
    ccq: {
      question: "Câu nào đúng cho lời khuyên (không phải luật cứng)?",
      options: [
        "You should arrive on time",
        "You must to arrive on time",
        "You should to arrive on time",
        "You have to must arrive on time",
      ],
      answer: "You should arrive on time",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Bắt buộc mạnh (safety): You ___ wear a helmet.",
      options: ["must", "must to", "shoulding", "are must"],
      answer: "must",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Khuyến nghị (advice):",
      options: ["should", "must always only", "have to must", "is should"],
      answer: "should",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: have / We / to / finish / before / the / deadline",
      words: ["We", "have", "to", "finish", "before", "the", "deadline"],
      answer: "We have to finish before the deadline",
    },
    {
      id: "c4",
      type: "correction",
      prompt_vi: "Sửa: You must to show your badge.",
      stem: "You must to show your badge.",
      answer: "You must show your badge.",
    },
    {
      id: "c5",
      type: "mcq",
      prompt_vi: "mustn't ≈",
      options: [
        "not allowed / forbidden",
        "optional / free choice",
        "maybe later",
        "only on weekends",
      ],
      answer: "not allowed / forbidden",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "policy ≈",
      options: ["chính sách công ty", "lương thưởng", "ngày nghỉ lẻ", "thẻ wifi"],
      answer: "chính sách công ty",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Onboarding — quy định an toàn & thẻ",
        context_vi: "HR giải thích safety + badge cho nhân viên mới ngày đầu.",
        lines: [
          {
            id: "1",
            speaker: "HR",
            text: "Welcome. First, you must wear your badge every day.",
            translation_vi: "Chào mừng. Trước hết, bạn phải đeo thẻ mỗi ngày.",
          },
          {
            id: "2",
            speaker: "Lan",
            text: "Do we have to show it at the gate?",
            translation_vi: "Chúng tôi có phải đưa thẻ ở cổng không?",
          },
          {
            id: "3",
            speaker: "HR",
            text: "Yes. You have to show your badge before you enter.",
            translation_vi: "Có. Bạn phải đưa thẻ trước khi vào.",
          },
          {
            id: "4",
            speaker: "HR",
            text: "Smoking is forbidden in the building. You mustn't smoke inside.",
            translation_vi: "Cấm hút thuốc trong tòa nhà. Bạn không được hút bên trong.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "Should we complete safety training this week?",
            translation_vi: "Chúng tôi có nên hoàn thành training an toàn tuần này không?",
          },
          {
            id: "6",
            speaker: "HR",
            text: "You must complete it. Compliance is required for all new staff.",
            translation_vi: "Bạn phải hoàn thành. Compliance là bắt buộc với mọi người mới.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Manager — hybrid policy & deadline",
        context_vi: "Manager giải thích ngày WFO + deadline form cho team.",
        lines: [
          {
            id: "1",
            speaker: "Manager",
            text: "Our hybrid policy says we have to come to the office two days a week.",
            translation_vi: "Policy hybrid nói chúng ta phải vào office hai ngày/tuần.",
          },
          {
            id: "2",
            speaker: "Minh",
            text: "Which days must we choose?",
            translation_vi: "Chúng tôi phải chọn ngày nào?",
          },
          {
            id: "3",
            speaker: "Manager",
            text: "Tuesday and Thursday. You should arrive on time for the stand-up.",
            translation_vi: "Thứ Ba và thứ Năm. Bạn nên đến đúng giờ cho stand-up.",
          },
          {
            id: "4",
            speaker: "Manager",
            text: "Phones are not allowed in the client meeting room.",
            translation_vi: "Không được dùng điện thoại trong phòng họp khách.",
          },
          {
            id: "5",
            speaker: "Minh",
            text: "Do we have to finish the compliance form today?",
            translation_vi: "Chúng tôi có phải xong form compliance hôm nay không?",
          },
          {
            id: "6",
            speaker: "Manager",
            text: "Yes. We have to submit it before the Friday deadline.",
            translation_vi: "Có. Chúng ta phải nộp trước hạn chót thứ Sáu.",
          },
          {
            id: "7",
            speaker: "Manager",
            text: "You don't have to print it — online is fine.",
            translation_vi: "Không bắt buộc in — online là được.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "You must wear your badge in the office",
        options: [
          "You must wear your badge in the office",
          "You must to wear your badge in the office",
          "You should must wear your badge in the office",
          "You have wear your badge in the office",
        ],
        answer: "You must wear your badge in the office",
      },
      {
        id: "lac2",
        audio_text: "We have to finish before the deadline",
        options: [
          "We have to finish before the deadline",
          "We have to finishing before the deadline",
          "We must to finish before the deadline",
          "We have finish before the deadline",
        ],
        answer: "We have to finish before the deadline",
      },
      {
        id: "lac3",
        audio_text: "You should read the policy before Monday",
        options: [
          "You should read the policy before Monday",
          "You should to read the policy before Monday",
          "You should reading the policy before Monday",
          "You must should read the policy before Monday",
        ],
        answer: "You should read the policy before Monday",
      },
      {
        id: "lac4",
        audio_text: "Smoking is forbidden in the building",
        options: [
          "Smoking is forbidden in the building",
          "Smoking is forbidden on the building only",
          "Smoking is allowed in the building",
          "Smoking was never forbidden anywhere",
        ],
        answer: "Smoking is forbidden in the building",
      },
      {
        id: "lac5",
        audio_text: "You don't have to print the form",
        options: [
          "You don't have to print the form",
          "You don't must print the form",
          "You mustn't have to print the form always",
          "You don't have print the form",
        ],
        answer: "You don't have to print the form",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "You must wear your badge.",
        vi: "Bạn phải đeo thẻ.",
      },
      {
        en: "We have to arrive by nine.",
        vi: "Chúng ta phải đến trước chín giờ.",
      },
      {
        en: "You should read the policy.",
        vi: "Bạn nên đọc policy.",
      },
      {
        en: "Smoking is forbidden inside.",
        vi: "Cấm hút thuốc bên trong.",
      },
      {
        en: "You mustn't use phones in the lab.",
        vi: "Bạn không được dùng điện thoại trong lab.",
      },
      {
        en: "We have to finish before the deadline.",
        vi: "Chúng ta phải xong trước hạn chót.",
      },
      {
        en: "You don't have to print it.",
        vi: "Bạn không bắt buộc phải in.",
      },
      {
        en: "Please arrive on time for the meeting.",
        vi: "Xin đến đúng giờ cho cuộc họp.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Giải thích 3–4 quy định office cho nhân viên mới (45–60s): ≥2 câu must hoặc have to → ≥1 should → ≥1 mustn't hoặc don't have to. Có thể nhắc policy / safety / badge / deadline.",
    successCriteria_vi: [
      "Có ≥2 câu must hoặc have to + V1",
      "Có ≥1 câu should + V1",
      "Có ≥1 mustn't hoặc don't have to",
      "Có từ policy / rule / safety / badge / deadline (ít nhất 1)",
    ],
    scaffold_en: [
      "You must… / We have to…",
      "You should…",
      "You mustn't… / You don't have to…",
      "According to the policy… / One important rule is…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Strong obligation: You ___ wear a helmet.",
        options: ["must", "must to", "are must", "musting"],
        answer: "must",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Advice (not a hard law)",
        options: ["should", "must always only", "have to must", "is should"],
        answer: "should",
      },
      {
        id: "q3",
        type: "mcq",
        question: "Correct form",
        options: [
          "have to finish",
          "have to finishing",
          "have finish to",
          "has to must finish",
        ],
        answer: "have to finish",
      },
      {
        id: "q4",
        type: "true-false",
        question: "You must to show your badge. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "mustn't ≈",
        options: [
          "not allowed / forbidden",
          "optional choice",
          "maybe later",
          "only weekends",
        ],
        answer: "not allowed / forbidden",
      },
      {
        id: "q6",
        type: "mcq",
        question: "don't have to ≈",
        options: [
          "not necessary / optional",
          "strictly forbidden",
          "must always",
          "should never ever",
        ],
        answer: "not necessary / optional",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-03) Prediction: Sales ___ grow next year.",
        options: ["will", "will to", "are will", "willing"],
        answer: "will",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-03) Possibility: Prices ___ rise.",
        options: ["might", "must always", "will can", "is must"],
        answer: "might",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-03) Soft prediction: We will ___ hire more staff.",
        options: ["probably", "probable", "probability", "prob"],
        answer: "probably",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-03) Demand is ___ this year.",
        options: ["growing", "grow", "grew always", "growsing"],
        answer: "growing",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "must /mʌst/ vs should /ʃʊd/",
    description_vi:
      "must /mʌst/ — /ʌ/ ngắn (như cup). should /ʃʊd/ — /ʃ/ + /ʊ/. have to thường nối /ˈhæftə/ nhanh. Stress: com-PLI-ance, PO-li-cy, DEAD-line.",
    examples: [
      { word: "must", tip_vi: "/mʌst/ không thành /mɑːst/" },
      { word: "should", tip_vi: "/ʃʊd/ /ʃ/ rõ" },
      { word: "have to", tip_vi: "nối /ˈhæftə/ khi nói nhanh" },
      { word: "policy", tip_vi: "stress PO-li-cy" },
    ],
  },
};
