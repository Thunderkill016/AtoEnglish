import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — places in town + directions: Where is…? / next to / opposite / turn left
 * Core: bank · station · supermarket · hospital · post office ·
 * Where is…? · next to · opposite · turn left · go straight · on the left
 * Spiral: a1-08 cafe (I'd like / Can I have) + light shop (a1-07).
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA109: LessonSpec = {
  id: "l-a1-09",
  phase: "P1",
  cefr: "A1",
  title_vi: "Địa điểm & chỉ đường",
  estimatedMin: 35,
  canDo: [
    "Hỏi vị trí: Where is the bank / station?",
    "Mô tả vị trí: next to / opposite / on the left",
    "Chỉ đường ngắn: turn left / go straight / turn right",
  ],
  situation:
    "Bạn ở thành phố lạ (công tác / phỏng vấn): cần hỏi bank, station, hospital, supermarket; hiểu next to / opposite; làm theo turn left, go straight — không cần chỉ đường phức tạp nhiều đoạn.",
  culturalNote_vi:
    "Where is the + place? (có the với địa điểm cụ thể). Excuse me trước khi hỏi. next to = cạnh; opposite = đối diện (không «opposite to» trong bài này). turn left / right; go straight. Spiral cafe từ a1-08 khi hỏi đường tới cafe.",
  jobAngle: "Ask the way to a bank or meeting venue near the office",
  lexis: [
    {
      id: "v1",
      word: "bank",
      phonetic: "/bæŋk/",
      meaning_vi: "ngân hàng",
      example_en: "Where is the bank?",
      l1_note_vi:
        "bank = ngân hàng (không «băng»). the bank khi hỏi địa điểm cụ thể.",
    },
    {
      id: "v2",
      word: "station",
      phonetic: "/ˈsteɪʃn/",
      meaning_vi: "nhà ga / trạm",
      example_en: "Where is the station?",
      l1_note_vi:
        "station ≈ train/bus station. the station. Không: Where is station?",
    },
    {
      id: "v3",
      word: "supermarket",
      phonetic: "/ˈsuːpəmɑːkɪt/",
      meaning_vi: "siêu thị",
      example_en: "The supermarket is next to the bank.",
      l1_note_vi:
        "su-per-mar-ket 4 âm. Spiral shop (a1-07) — supermarket = siêu thị lớn.",
    },
    {
      id: "v4",
      word: "hospital",
      phonetic: "/ˈhɒspɪtl/",
      meaning_vi: "bệnh viện",
      example_en: "Where is the hospital?",
      l1_note_vi:
        "HOS-pi-tal — stress đầu. the hospital (BrE thường có the).",
    },
    {
      id: "v5",
      word: "post office",
      phonetic: "/ˈpəʊst ˌɒfɪs/",
      meaning_vi: "bưu điện",
      example_en: "The post office is opposite the bank.",
      l1_note_vi:
        "post office = bưu điện. the post office. Không: post office the.",
    },
    {
      id: "v6",
      word: "Where is…?",
      phonetic: "/weə ɪz/",
      meaning_vi: "…ở đâu?",
      example_en: "Where is the bank?",
      l1_note_vi:
        "Where is + the + place? Where's = rút gọn. Không: Where the bank is? (trật tự câu hỏi).",
    },
    {
      id: "v7",
      word: "next to",
      phonetic: "/nekst tuː/",
      meaning_vi: "cạnh / bên cạnh",
      example_en: "The cafe is next to the bank.",
      l1_note_vi:
        "next to + noun. ≈ beside. Không: next the bank (thiếu to).",
    },
    {
      id: "v8",
      word: "opposite",
      phonetic: "/ˈɒpəzɪt/",
      meaning_vi: "đối diện",
      example_en: "The hospital is opposite the station.",
      l1_note_vi:
        "opposite + place (không bắt buộc opposite to trong bài A1 này).",
    },
    {
      id: "v9",
      word: "turn left",
      phonetic: "/tɜːn left/",
      meaning_vi: "rẽ trái",
      example_en: "Turn left at the bank.",
      l1_note_vi:
        "turn left / turn right. left ≠ leave. Không: turn to left.",
    },
    {
      id: "v10",
      word: "turn right",
      phonetic: "/tɜːn raɪt/",
      meaning_vi: "rẽ phải",
      example_en: "Turn right at the station.",
      l1_note_vi:
        "turn right. on the right = bên phải (vị trí). right ≠ write.",
    },
    {
      id: "v11",
      word: "go straight",
      phonetic: "/ɡəʊ streɪt/",
      meaning_vi: "đi thẳng",
      example_en: "Go straight, then turn left.",
      l1_note_vi:
        "go straight (ahead). Không: go straightly. then = rồi / sau đó.",
    },
    {
      id: "v12",
      word: "on the left",
      phonetic: "/ɒn ðə left/",
      meaning_vi: "bên trái",
      example_en: "The bank is on the left.",
      l1_note_vi:
        "on the left / on the right. the + left/right. Không: in the left.",
    },
  ],
  grammar: {
    title: "Where is…? · next to / opposite · turn left",
    rule: "Where is the + place? It is next to / opposite X. Turn left / right. Go straight.",
    examples: [
      { en: "Where is the bank?", vi: "Ngân hàng ở đâu?" },
      { en: "It's next to the supermarket.", vi: "Nó cạnh siêu thị." },
      { en: "The post office is opposite the station.", vi: "Bưu điện đối diện nhà ga." },
      { en: "Turn left, then go straight.", vi: "Rẽ trái, rồi đi thẳng." },
      { en: "The cafe is on the left.", vi: "Quán cafe bên trái." },
    ],
    vnNote:
      "Where is the + place? Trả lời: It's + next to / opposite + place. Chỉ đường: Turn left/right · Go straight · on the left/right. Spiral: cafe (a1-08) khi hỏi đường tới cafe.",
    ccq: {
      question: "Hỏi ngân hàng ở đâu — chọn đúng:",
      options: [
        "Where is the bank?",
        "Where the bank is?",
        "Where is bank?",
        "The bank where is?",
      ],
      answer: "Where is the bank?",
      explanation_vi: "Where is + the + place? Có the; trật tự câu hỏi chuẩn.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Hỏi nhà ga ở đâu — câu đúng",
      options: [
        "Where is the station?",
        "Where the station is?",
        "Where is station?",
        "How much is the station?",
      ],
      answer: "Where is the station?",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: The cafe is _____ to the bank. (next / opposite / left)",
      stem: "The cafe is _____ to the bank.",
      answer: "next",
      explanation_vi: "next to = cạnh.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: is / Where / the / hospital",
      words: ["Where", "is", "the", "hospital"],
      answer: "Where is the hospital",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Đối diện — từ đúng",
      options: [
        "opposite",
        "next to",
        "turn left",
        "I'd like",
      ],
      answer: "opposite",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: Turn to left at the bank.",
      stem: "Turn to left at the bank.",
      answer: "Turn left at the bank.",
      explanation_vi: "turn left (không turn to left).",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Đi thẳng — cụm đúng",
      options: [
        "Go straight.",
        "Go straightly.",
        "Turn straight.",
        "Where is straight?",
      ],
      answer: "Go straight.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Hỏi đường tới bank & cafe",
        context_vi:
          "Linh công tác ở phố lạ; hỏi người qua đường bank và cafe gần office.",
        lines: [
          {
            id: "d1-1",
            speaker: "Linh",
            text: "Excuse me. Where is the bank?",
            translation_vi: "Xin lỗi. Ngân hàng ở đâu ạ?",
          },
          {
            id: "d1-2",
            speaker: "Local",
            text: "Go straight, then turn left. The bank is on the left.",
            translation_vi: "Đi thẳng, rồi rẽ trái. Ngân hàng bên trái.",
          },
          {
            id: "d1-3",
            speaker: "Linh",
            text: "Is it next to the supermarket?",
            translation_vi: "Nó cạnh siêu thị phải không?",
          },
          {
            id: "d1-4",
            speaker: "Local",
            text: "Yes. Next to the supermarket. The post office is opposite.",
            translation_vi: "Đúng. Cạnh siêu thị. Bưu điện đối diện.",
          },
          {
            id: "d1-5",
            speaker: "Linh",
            text: "And where is a cafe?",
            translation_vi: "Còn cafe thì ở đâu?",
          },
          {
            id: "d1-6",
            speaker: "Local",
            text: "Turn right at the bank. The cafe is next to the station.",
            translation_vi: "Rẽ phải ở ngân hàng. Cafe cạnh nhà ga.",
          },
          {
            id: "d1-7",
            speaker: "Linh",
            text: "Thank you! I'd like a coffee after the meeting.",
            translation_vi: "Cảm ơn! Tôi muốn uống cà phê sau họp.",
          },
          {
            id: "d1-8",
            speaker: "Local",
            text: "You're welcome. Have a good day!",
            translation_vi: "Không có gì. Chúc một ngày tốt lành!",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "Where is the bank",
        options: [
          "Where is the bank",
          "Where the bank is",
          "How much is the bank",
          "I'd like a bank",
        ],
        answer: "Where is the bank",
      },
      {
        id: "lac2",
        audio_text: "It's next to the supermarket",
        options: [
          "It's next to the supermarket",
          "It's opposite to left bank",
          "Turn left the supermarket",
          "Can I have a supermarket",
        ],
        answer: "It's next to the supermarket",
      },
      {
        id: "lac3",
        audio_text: "Turn left then go straight",
        options: [
          "Turn left then go straight",
          "Turn to left then go",
          "Go left the bank please",
          "Where is turn left",
        ],
        answer: "Turn left then go straight",
      },
      {
        id: "lac4",
        audio_text: "The hospital is opposite the station",
        options: [
          "The hospital is opposite the station",
          "The hospital is next the station",
          "How much is the hospital",
          "I'd like a hospital please",
        ],
        answer: "The hospital is opposite the station",
      },
    ],
  },
  fluency: {
    items: [
      { en: "Where is the bank?", vi: "Ngân hàng ở đâu?" },
      { en: "Where is the station?", vi: "Nhà ga ở đâu?" },
      { en: "It's next to the supermarket.", vi: "Nó cạnh siêu thị." },
      { en: "It's opposite the post office.", vi: "Nó đối diện bưu điện." },
      { en: "Turn left.", vi: "Rẽ trái." },
      { en: "Turn right.", vi: "Rẽ phải." },
      { en: "Go straight.", vi: "Đi thẳng." },
      { en: "The cafe is on the left.", vi: "Cafe bên trái." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Bạn hỏi đường. Nói 5–7 câu: Excuse me → Where is the bank/station/hospital? → nghe next to / opposite → turn left / go straight / on the left → cảm ơn; có thể nhắc cafe (spiral a1-08).",
    successCriteria_vi: [
      "Có Where is the + place?",
      "Có next to hoặc opposite",
      "Có turn left/right hoặc go straight hoặc on the left/right",
      "Có Excuse me hoặc Thank you",
    ],
    scaffold_en: [
      "Excuse me. Where is the bank?",
      "Where is the station?",
      "Is it next to the supermarket?",
      "Go straight, then turn left.",
      "The hospital is opposite the station.",
      "The cafe is on the left.",
      "Thank you!",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Hỏi bệnh viện ở đâu:",
        options: [
          "Where is the hospital?",
          "Where the hospital is?",
          "How much is the hospital?",
          "I'd like a hospital.",
        ],
        answer: "Where is the hospital?",
      },
      {
        id: "q2",
        type: "mcq",
        question: "The bank is _____ to the cafe.",
        options: ["next", "opposite", "turn", "straight"],
        answer: "next",
        explanation_vi: "next to = cạnh.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Turn to left là cách rẽ trái chuẩn trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: Turn left (không turn to left).",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Đối diện nhà ga:",
        options: [
          "opposite the station",
          "next the station",
          "turn station",
          "on the station left only",
        ],
        answer: "opposite the station",
      },
      {
        id: "q5",
        type: "cloze",
        question: "Go _____. (straight / leftly / bank)",
        answer: "straight",
      },
      {
        id: "q6",
        type: "mcq",
        question: "on the left nghĩa là…",
        options: ["bên trái", "rẽ phải", "đối diện", "mang đi"],
        answer: "bên trái",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-08) Order cà phê lịch sự:",
        options: [
          "I'd like a coffee, please.",
          "I like a coffee, please.",
          "Where is a coffee bank?",
          "Turn left a coffee.",
        ],
        answer: "I'd like a coffee, please.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-08) Mang đi — cụm:",
        options: [
          "To go, please.",
          "Go straight, please only.",
          "Opposite the bill.",
          "Where is to go bank?",
        ],
        answer: "To go, please.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-07) Hỏi giá:",
        options: [
          "How much is it?",
          "Where is it bank?",
          "Turn left how much?",
          "Next to the price?",
        ],
        answer: "How much is it?",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/weə/ Where · /eɪ/ station",
    description_vi:
      "Where /weə/ — không «qua». opposite: stress OP-posite /ˈɒpəzɪt/. station /ˈsteɪʃn/: /eɪ/ như «day».",
    examples: [
      {
        word: "Where is",
        ipa: "/weə ɪz/",
        tip_vi: "Where /weə/; nối nhẹ Where's khi nói nhanh.",
      },
      {
        word: "opposite",
        ipa: "/ˈɒpəzɪt/",
        tip_vi: "OP-posite — stress âm 1; không «óp-pò-dít» dài.",
      },
      {
        word: "station",
        ipa: "/ˈsteɪʃn/",
        tip_vi: "STAY-shən — /eɪ/ rõ.",
      },
    ],
  },
};
