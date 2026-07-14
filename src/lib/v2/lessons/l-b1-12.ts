import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — health & social language.
 * Core: symptoms (I have a… / My … hurts) · advice should/ought to · social plans (How about… / Shall we…).
 * Work wellness + life. Spiral: b1-11 problem–solution frames.
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB112: LessonSpec = {
  id: "l-b1-12",
  phase: "P3",
  cefr: "B1",
  title_vi: "Sức khỏe & xã hội",
  estimatedMin: 40,
  canDo: [
    "Mô tả triệu chứng: I have a… / My … hurts / I feel…",
    "Đưa lời khuyên: You should… / You ought to…",
    "Lên kế hoạch xã hội: How about… / Shall we… / Why don't we…",
  ],
  situation:
    "Work wellness + đời sống: đồng nghiệp mệt, nghỉ ốm, plan cuối tuần. Nói 45–60 giây: 1–2 câu triệu chứng hoặc lời khuyên (should/ought to), 1 câu social plan, 1 ôn b1-11 (The problem is… / One solution is… / We could…) nếu hợp ngữ cảnh.",
  culturalNote_vi:
    "Ở VN hay nói 'mệt quá' chung chung; tiếng Anh work/life cần cụ thể hơn: headache, fever, tired. Advice: You should + bare V (mềm); ought to formal hơn một chút. Social plan: How about + V-ing / noun; Shall we + bare V. Không: You should to rest / How about we to go / I have headache (thiếu a).",
  jobAngle:
    "Work wellness: sick day, rest, appointment, feel better — You should…; How about…; The problem is… (ôn b1-11)",
  lexis: [
    {
      id: "v1",
      word: "I have a…",
      phonetic: "/aɪ hæv ə/",
      meaning_vi: "Tôi bị / có… (triệu chứng)",
      example_en: "I have a headache.",
      l1_note_vi:
        "I have a + countable symptom. Không: I have headache (thiếu a).",
    },
    {
      id: "v2",
      word: "My … hurts",
      phonetic: "/maɪ … hɜːts/",
      meaning_vi: "… của tôi đau",
      example_en: "My back hurts after sitting all day.",
      l1_note_vi:
        "My + body part + hurts. Không: My back is hurt (trừ passive khác nghĩa).",
    },
    {
      id: "v3",
      word: "should",
      phonetic: "/ʃʊd/",
      meaning_vi: "nên (lời khuyên)",
      example_en: "You should rest today.",
      l1_note_vi:
        "should + bare verb. Không: You should to rest / You should resting.",
    },
    {
      id: "v4",
      word: "ought to",
      phonetic: "/ˈɔːt tuː/",
      meaning_vi: "nên (hơi trang trọng hơn should)",
      example_en: "You ought to see a doctor.",
      l1_note_vi:
        "ought to + bare V. ≈ should. Không: You ought rest (thiếu to).",
    },
    {
      id: "v5",
      word: "headache",
      phonetic: "/ˈhedeɪk/",
      meaning_vi: "đau đầu",
      example_en: "I have a bad headache this morning.",
      l1_note_vi:
        "a headache (countable). get a headache. ≠ head ache (tách sai).",
    },
    {
      id: "v6",
      word: "fever",
      phonetic: "/ˈfiːvə/",
      meaning_vi: "sốt",
      example_en: "She has a fever and should stay home.",
      l1_note_vi:
        "a fever / a high fever. have a fever. ≠ temperature alone = sốt.",
    },
    {
      id: "v7",
      word: "tired",
      phonetic: "/ˈtaɪəd/",
      meaning_vi: "mệt",
      example_en: "I feel tired after the long meeting.",
      l1_note_vi:
        "feel/be tired. exhausted = rất mệt. Không: I have tired.",
    },
    {
      id: "v8",
      word: "rest",
      phonetic: "/rest/",
      meaning_vi: "nghỉ ngơi",
      example_en: "You should rest and drink water.",
      l1_note_vi:
        "rest (v/n). get some rest. rest day. ≠ rest = còn lại (the rest).",
    },
    {
      id: "v9",
      word: "How about…",
      phonetic: "/haʊ əˈbaʊt/",
      meaning_vi: "… thì sao? (đề xuất)",
      example_en: "How about meeting on Saturday?",
      l1_note_vi:
        "How about + V-ing / noun. Không: How about we to go…",
    },
    {
      id: "v10",
      word: "Shall we…",
      phonetic: "/ʃæl wiː/",
      meaning_vi: "Chúng ta… nhé? (đề xuất cùng làm)",
      example_en: "Shall we cancel the dinner?",
      l1_note_vi:
        "Shall we + bare V. lịch sự, British-friendly. ≠ Will we always.",
    },
    {
      id: "v11",
      word: "appointment",
      phonetic: "/əˈpɔɪntmənt/",
      meaning_vi: "cuộc hẹn (bác sĩ / lịch)",
      example_en: "I have a doctor appointment at three.",
      l1_note_vi:
        "make/have an appointment. ≠ date (hẹn hò) / meeting only.",
    },
    {
      id: "v12",
      word: "feel better",
      phonetic: "/fiːl ˈbetə/",
      meaning_vi: "cảm thấy khỏe hơn",
      example_en: "I hope you feel better soon.",
      l1_note_vi:
        "feel better / get better. Hope you feel better. Không: feel more good.",
    },
  ],
  grammar: {
    title: "Advice & social plans",
    rule: "should / ought to · symptoms · How about… / Shall we…",
    examples: [
      {
        en: "You should rest if you have a fever.",
        vi: "Bạn nên nghỉ nếu bị sốt.",
      },
      {
        en: "You ought to see a doctor tomorrow.",
        vi: "Bạn nên đi khám bác sĩ ngày mai.",
      },
      {
        en: "How about coffee after work on Friday?",
        vi: "Uống cà phê sau giờ làm thứ Sáu thì sao?",
      },
    ],
    vnNote:
      "Advice: should + bare V; ought to + bare V (hơi formal). Symptom: I have a headache / My back hurts / I feel tired. Social: How about + V-ing/noun; Shall we + bare V; Why don't we + bare V. Sai hay gặp: You should to rest / I have headache / How about we to go / Shall we to meet.",
    ccq: {
      question: "Câu nào đúng khi khuyên nghỉ?",
      options: [
        "You should rest today.",
        "You should to rest today.",
        "You ought rest today.",
        "You should resting today.",
      ],
      answer: "You should rest today.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "I have ___ headache.",
      options: ["a", "an", "the only always", "— (no article)"],
      answer: "a",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "You ___ rest and drink water.",
      options: ["should", "should to", "ought", "are should"],
      answer: "should",
    },
    {
      id: "c3",
      type: "mcq",
      prompt_vi: "You ought ___ see a doctor.",
      options: ["to", "— (no to)", "for", "ing"],
      answer: "to",
    },
    {
      id: "c4",
      type: "scramble",
      prompt_vi: "Sắp xếp: How / about / meeting / on / Saturday",
      words: ["How", "about", "meeting", "on", "Saturday"],
      answer: "How about meeting on Saturday",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa: You should to rest today.",
      stem: "You should to rest today.",
      answer: "You should rest today.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Shall we ___ the dinner?",
      options: ["cancel", "to cancel", "cancelling", "cancels"],
      answer: "cancel",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Work wellness — colleague unwell",
        context_vi:
          "Chat/standup: đồng nghiệp mệt; advice + optional sick day; work wellness.",
        lines: [
          {
            id: "1",
            speaker: "Minh",
            text: "I have a bad headache and I feel tired.",
            translation_vi: "Tôi bị đau đầu nặng và cảm thấy mệt.",
          },
          {
            id: "2",
            speaker: "Hoa",
            text: "You should rest. You ought to go home early.",
            translation_vi: "Bạn nên nghỉ. Bạn nên về sớm.",
          },
          {
            id: "3",
            speaker: "Minh",
            text: "My throat hurts too. Maybe I have a fever.",
            translation_vi: "Cổ họng tôi cũng đau. Có lẽ tôi bị sốt.",
          },
          {
            id: "4",
            speaker: "Hoa",
            text: "Then you should take a sick day and see a doctor.",
            translation_vi: "Vậy bạn nên nghỉ ốm và đi khám.",
          },
          {
            id: "5",
            speaker: "Minh",
            text: "I have an appointment at four. I hope I feel better soon.",
            translation_vi: "Tôi có hẹn lúc bốn. Mong sớm khỏe hơn.",
          },
          {
            id: "6",
            speaker: "Hoa",
            text: "Good. Drink water and rest. Message me if you need help.",
            translation_vi: "Hay. Uống nước và nghỉ. Nhắn nếu cần giúp.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Social plan + problem–solution spiral",
        context_vi:
          "Bạn bè plan cuối tuần; một người ốm → ôn b1-11 problem/solution.",
        lines: [
          {
            id: "1",
            speaker: "Lan",
            text: "How about dinner on Saturday?",
            translation_vi: "Tối thứ Bảy đi ăn thì sao?",
          },
          {
            id: "2",
            speaker: "Tuan",
            text: "I would love to, but I have a fever today.",
            translation_vi: "Muốn lắm, nhưng hôm nay tôi bị sốt.",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "The problem is you need rest first.",
            translation_vi: "Vấn đề là bạn cần nghỉ trước.",
          },
          {
            id: "4",
            speaker: "Tuan",
            text: "One solution is to move dinner to next week.",
            translation_vi: "Một giải pháp là dời dinner sang tuần sau.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "We could do a short video call instead this weekend.",
            translation_vi:
              "Cuối tuần này chúng ta có thể gọi video ngắn.",
          },
          {
            id: "6",
            speaker: "Tuan",
            text: "Shall we plan for next Saturday then? You should not worry.",
            translation_vi:
              "Vậy plan thứ Bảy tuần sau nhé? Bạn đừng lo.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I have a headache",
        options: [
          "I have a headache",
          "I have headache",
          "I has a headache",
          "I am have a headache",
        ],
        answer: "I have a headache",
      },
      {
        id: "lac2",
        audio_text: "You should rest today",
        options: [
          "You should rest today",
          "You should to rest today",
          "You ought rest today",
          "You should resting today",
        ],
        answer: "You should rest today",
      },
      {
        id: "lac3",
        audio_text: "You ought to see a doctor",
        options: [
          "You ought to see a doctor",
          "You ought see a doctor",
          "You should to see a doctor",
          "You oughting to see a doctor",
        ],
        answer: "You ought to see a doctor",
      },
      {
        id: "lac4",
        audio_text: "How about meeting on Saturday",
        options: [
          "How about meeting on Saturday",
          "How about we to meet on Saturday",
          "How about meet on Saturday always",
          "How about to meeting on Saturday",
        ],
        answer: "How about meeting on Saturday",
      },
      {
        id: "lac5",
        audio_text: "One solution is to move dinner to next week",
        options: [
          "One solution is to move dinner to next week",
          "One solution is we will must move dinner",
          "One solution are move dinner to next week",
          "Solution is moving will must only",
        ],
        answer: "One solution is to move dinner to next week",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "I have a bad headache.",
        vi: "Tôi bị đau đầu nặng.",
      },
      {
        en: "My back hurts after sitting all day.",
        vi: "Lưng tôi đau sau khi ngồi cả ngày.",
      },
      {
        en: "You should rest and drink water.",
        vi: "Bạn nên nghỉ và uống nước.",
      },
      {
        en: "You ought to see a doctor.",
        vi: "Bạn nên đi khám bác sĩ.",
      },
      {
        en: "How about coffee after work?",
        vi: "Uống cà phê sau giờ làm thì sao?",
      },
      {
        en: "Shall we cancel the dinner?",
        vi: "Chúng ta hủy dinner nhé?",
      },
      {
        en: "I hope you feel better soon.",
        vi: "Mong bạn sớm khỏe hơn.",
      },
      {
        en: "I have a doctor appointment at three.",
        vi: "Tôi có hẹn bác sĩ lúc ba giờ.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s health & social: (1) 1–2 câu triệu chứng (I have a… / My … hurts / I feel…) hoặc lời khuyên (should/ought to); (2) 1 câu social plan (How about… / Shall we…); (3) tùy chọn ôn b1-11: The problem is… + One solution is… / We could…",
    successCriteria_vi: [
      "Có ≥1 symptom frame hoặc should/ought to advice",
      "Có ≥1 How about… / Shall we… / Why don't we…",
      "Ngữ cảnh work wellness hoặc life social rõ",
      "Không You should to… / I have headache (thiếu a) / How about we to…",
    ],
    scaffold_en: [
      "I have a… / My … hurts / I feel…",
      "You should… / You ought to…",
      "How about… / Shall we…",
      "The problem is… (ôn b1-11)",
      "One solution is… / We could… (ôn b1-11)",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Correct symptom line",
        options: [
          "I have a headache.",
          "I have headache.",
          "I has a headache.",
          "I am have a headache.",
        ],
        answer: "I have a headache.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "You should is usually followed by",
        options: [
          "a bare verb (rest, go, drink)",
          "to + verb only always wrong",
          "than + adjective only",
          "located + place only",
        ],
        answer: "a bare verb (rest, go, drink)",
      },
      {
        id: "q3",
        type: "mcq",
        question: "How about is often followed by",
        options: [
          "V-ing or a noun phrase",
          "only bare must",
          "only past simple always",
          "only passive get things done",
        ],
        answer: "V-ing or a noun phrase",
      },
      {
        id: "q4",
        type: "true-false",
        question: "You should to rest today. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "ought to means roughly",
        options: [
          "should (a bit more formal)",
          "only past finished action",
          "only future will always",
          "only a body part noun",
        ],
        answer: "should (a bit more formal)",
      },
      {
        id: "q6",
        type: "true-false",
        question: "I have headache this morning. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-11) Correct problem frame",
        options: [
          "The problem is you need rest first.",
          "The problem is is you need rest first.",
          "The problem are you need rest first.",
          "Problem is that rest only must.",
        ],
        answer: "The problem is you need rest first.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-11) One solution is usually followed by",
        options: [
          "to + verb or a noun phrase",
          "bare must only",
          "than + adjective only",
          "only past continuous always",
        ],
        answer: "to + verb or a noun phrase",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-11) We could is used to",
        options: [
          "softly suggest an action",
          "only state past finished facts",
          "only form passive get things done",
          "only mark for/since time",
        ],
        answer: "softly suggest an action",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-11) We could to move dinner. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "should · ought · headache",
    description_vi:
      "should /ʃʊd/ ngắn, không /ʃuːld/. ought /ɔːt/ + to nối nhẹ. headache HEADache — nhấn 1. Nối: you_should_rest · ought_to_see · how_about_meeting · feel_better.",
    examples: [
      { word: "should", tip_vi: "/ʃʊd/ ngắn" },
      { word: "ought", tip_vi: "/ɔːt/ — không /aʊt/" },
      { word: "headache", tip_vi: "HEAD-ache — nhấn 1" },
      { word: "fever", tip_vi: "FEE-ver — nhấn 1" },
    ],
  },
};
