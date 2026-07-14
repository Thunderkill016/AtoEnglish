import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 — problem / help requests for service + job scenarios.
 * Core: Can you help me? · Could you…? · There's a problem…
 * It doesn't work · Can you fix…? · Excuse me · Thanks for your help.
 * Angle: IT desk / service counter / ask a colleague when something breaks.
 * Spiral: a2-06 work routines (What do you do? / I work as…); a2-05 for/since light.
 * L1 notes 100% (A2 schema gate).
 */
export const lessonA207: LessonSpec = {
  id: "l-a2-07",
  phase: "P2",
  cefr: "A2",
  title_vi: "Vấn đề nhỏ & nhờ giúp",
  estimatedMin: 40,
  canDo: [
    "Nhờ giúp: Can you help me? / Could you…? / Excuse me…",
    "Mô tả vấn đề: There's a problem… / It doesn't work / It's broken",
    "Trong service/job: Can you fix…? / Please wait a moment / Thanks for your help",
  ],
  situation:
    "Máy in kẹt, Wi‑Fi chết, hoặc app không mở ở văn phòng / quầy dịch vụ. Bạn cần nói: Excuse me — there's a problem. Can you help me? It doesn't work. Could you fix it? — lịch sự, rõ ràng, chưa cần giải thích kỹ thuật dài.",
  culturalNote_vi:
    "Can you help me? lịch sự chuẩn A2; Could you…? lịch sự hơn một chút. There's a problem with… + noun. It doesn't work / It's broken = hỏng / không chạy (không: It not work). Excuse me trước khi ngắt. Please wait a moment khi bên kia cần thời gian. Thanks / Thank you for your help khi xong. Tránh quá abrupt: Help me! (thô trong office).",
  jobAngle: "IT desk / service — There's a problem. Can you help? It doesn't work.",
  lexis: [
    {
      id: "v1",
      word: "Can you help me?",
      phonetic: "/kæn juː help miː/",
      meaning_vi: "Bạn có thể giúp tôi không?",
      example_en: "Excuse me — can you help me?",
      l1_note_vi:
        "Cấu trúc nhờ giúp cơ bản. Could you help me? lịch sự hơn. Không: You can help me? (sai trật tự).",
    },
    {
      id: "v2",
      word: "There's a problem",
      phonetic: "/ðeəz ə ˈprɒbləm/",
      meaning_vi: "Có một vấn đề",
      example_en: "There's a problem with the printer.",
      l1_note_vi:
        "There's = There is. There's a problem with + noun. Không: Have a problem the printer.",
    },
    {
      id: "v3",
      word: "It doesn't work",
      phonetic: "/ɪt ˈdʌznt wɜːk/",
      meaning_vi: "Nó không hoạt động",
      example_en: "The Wi‑Fi doesn't work.",
      l1_note_vi:
        "doesn't = does not (he/she/it). Không: It not work / It don't work.",
    },
    {
      id: "v4",
      word: "broken",
      phonetic: "/ˈbrəʊkən/",
      meaning_vi: "hỏng / bị gãy",
      example_en: "The mouse is broken.",
      l1_note_vi:
        "It's broken = hỏng. break → broke → broken. Không: It's break.",
    },
    {
      id: "v5",
      word: "Can you fix…?",
      phonetic: "/kæn juː fɪks/",
      meaning_vi: "Bạn sửa… được không?",
      example_en: "Can you fix the printer?",
      l1_note_vi:
        "fix = sửa. Could you fix it, please? lịch sự hơn trong office.",
    },
    {
      id: "v6",
      word: "Excuse me",
      phonetic: "/ɪkˈskjuːz miː/",
      meaning_vi: "Xin lỗi (gọi / ngắt lời)",
      example_en: "Excuse me — I need help.",
      l1_note_vi:
        "Gọi chú ý / xin lỗi trước. Sorry = xin lỗi vì lỗi; Excuse me = mở lời.",
    },
    {
      id: "v7",
      word: "wait a moment",
      phonetic: "/weɪt ə ˈməʊmənt/",
      meaning_vi: "đợi một chút",
      example_en: "Please wait a moment.",
      l1_note_vi:
        "Please wait a moment / Just a moment. Không: Wait one moment only always (dài dòng).",
    },
    {
      id: "v8",
      word: "I need help",
      phonetic: "/aɪ niːd help/",
      meaning_vi: "Tôi cần giúp đỡ",
      example_en: "I need help with my email.",
      l1_note_vi:
        "need + noun: I need help. need + to V: I need to call IT. Không: I need helping.",
    },
    {
      id: "v9",
      word: "Could you…?",
      phonetic: "/kʊd juː/",
      meaning_vi: "Bạn có thể… không? (lịch sự)",
      example_en: "Could you check the cable, please?",
      l1_note_vi:
        "Could you…? lịch sự hơn Can you…? Rất hay với please ở cuối.",
    },
    {
      id: "v10",
      word: "Thanks for your help",
      phonetic: "/θæŋks fɔː jɔː help/",
      meaning_vi: "Cảm ơn vì đã giúp",
      example_en: "Thanks for your help!",
      l1_note_vi:
        "Thank you for your help (formal hơn). Thanks a lot cũng OK thân mật.",
    },
  ],
  grammar: {
    title: "Help requests · state a problem",
    rule: "Can/Could you + V…? · There's a problem with… · It doesn't work",
    examples: [
      {
        en: "Can you help me? There's a problem with my laptop.",
        vi: "Bạn giúp mình được không? Máy mình có vấn đề.",
      },
      {
        en: "It doesn't work. Can you fix it?",
        vi: "Nó không chạy. Bạn sửa được không?",
      },
      {
        en: "Excuse me — could you check the printer, please?",
        vi: "Xin lỗi — bạn kiểm tra máy in giúp mình được không?",
      },
      {
        en: "Please wait a moment. Thanks for your help!",
        vi: "Vui lòng đợi một chút. Cảm ơn vì đã giúp!",
      },
    ],
    vnNote:
      "Nhờ giúp: Can you + V? / Could you + V? (lịch sự hơn). Mô tả: There's a problem with + N · It doesn't work · It's broken. Phủ định he/she/it: doesn't (không don't). Please + V: Please wait a moment. Kết: Thanks / Thank you for your help. Không: Help me now! (thô với đồng nghiệp).",
    ccq: {
      question: "Chọn câu nhờ giúp lịch sự đúng",
      options: [
        "You can help me the printer?",
        "Can you help me with the printer?",
        "Can you helping me with the printer?",
        "Help me the printer now!",
      ],
      answer: "Can you help me with the printer?",
      explanation_vi: "Can you + V + (with + noun).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Nhờ giúp — chọn câu đúng",
      options: [
        "Can you help me?",
        "You can help me?",
        "Can you helping me?",
        "Can help you me?",
      ],
      answer: "Can you help me?",
      explanation_vi: "Can you + base verb.",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Mô tả vấn đề",
      options: [
        "There's a problem with the Wi‑Fi.",
        "There have a problem with the Wi‑Fi.",
        "It have a problem the Wi‑Fi.",
        "Problem is the Wi‑Fi have.",
      ],
      answer: "There's a problem with the Wi‑Fi.",
    },
    {
      id: "c3",
      type: "cloze",
      prompt_vi: "Điền: It _____ work. (doesn't)",
      stem: "It _____ work.",
      answer: "doesn't",
      explanation_vi: "it + doesn't + V.",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Yêu cầu sửa — lịch sự",
      options: [
        "Could you fix it, please?",
        "You fix it now please can?",
        "Fix you it please?",
        "Can you fixing it please?",
      ],
      answer: "Could you fix it, please?",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: It don't work.",
      stem: "It don't work.",
      answer: "It doesn't work.",
      explanation_vi: "it → doesn't, không don't.",
    },
    {
      id: "c6",
      type: "scramble",
      prompt_vi: "Sắp xếp: help / me / Can / you / ?",
      words: ["Can", "you", "help", "me"],
      answer: "Can you help me",
    },
    {
      id: "c7",
      type: "mcq",
      prompt_vi: "Kết thúc lịch sự sau khi được giúp",
      options: [
        "Thanks for your help!",
        "Thanks for you help!",
        "Thank you for help me!",
        "Thanks you for helping!",
      ],
      answer: "Thanks for your help!",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "IT desk — printer problem",
        context_vi: "An mang máy in kẹt giấy đến quầy IT nội bộ.",
        lines: [
          {
            id: "d1-1",
            speaker: "An",
            text: "Excuse me — can you help me?",
            translation_vi: "Xin lỗi — bạn giúp mình được không?",
          },
          {
            id: "d1-2",
            speaker: "IT",
            text: "Sure. What's the problem?",
            translation_vi: "Được. Vấn đề gì vậy?",
          },
          {
            id: "d1-3",
            speaker: "An",
            text: "There's a problem with the printer. It doesn't work.",
            translation_vi: "Máy in có vấn đề. Nó không chạy.",
          },
          {
            id: "d1-4",
            speaker: "IT",
            text: "OK. Is it broken, or is there a paper jam?",
            translation_vi: "OK. Hỏng hẳn hay kẹt giấy?",
          },
          {
            id: "d1-5",
            speaker: "An",
            text: "I think there's a paper jam. Can you fix it?",
            translation_vi: "Mình nghĩ kẹt giấy. Bạn sửa được không?",
          },
          {
            id: "d1-6",
            speaker: "IT",
            text: "Please wait a moment… Done. Try it now.",
            translation_vi: "Đợi một chút… Xong. Thử lại đi.",
          },
          {
            id: "d1-7",
            speaker: "An",
            text: "It works! Thanks for your help!",
            translation_vi: "Chạy rồi! Cảm ơn vì đã giúp!",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Colleague — Wi‑Fi & email",
        context_vi: "Minh nhờ Lan (đồng nghiệp) khi Wi‑Fi và email lỗi trước họp.",
        lines: [
          {
            id: "d2-1",
            speaker: "Minh",
            text: "Lan, I need help. There's a problem with the Wi‑Fi.",
            translation_vi: "Lan, mình cần giúp. Wi‑Fi có vấn đề.",
          },
          {
            id: "d2-2",
            speaker: "Lan",
            text: "Oh no. Does your email work?",
            translation_vi: "Ối. Email bạn chạy không?",
          },
          {
            id: "d2-3",
            speaker: "Minh",
            text: "No. It doesn't work. Could you check the cable, please?",
            translation_vi: "Không. Không chạy. Bạn kiểm tra cáp giúp được không?",
          },
          {
            id: "d2-4",
            speaker: "Lan",
            text: "Sure. Please wait a moment… The cable is loose.",
            translation_vi: "Được. Đợi một chút… Cáp lỏng.",
          },
          {
            id: "d2-5",
            speaker: "Minh",
            text: "Is it broken?",
            translation_vi: "Hỏng hẳn à?",
          },
          {
            id: "d2-6",
            speaker: "Lan",
            text: "No — just loose. Try again. Can you open the file now?",
            translation_vi: "Không — chỉ lỏng. Thử lại. Mở file được chưa?",
          },
          {
            id: "d2-7",
            speaker: "Minh",
            text: "Yes! Thanks for your help. See you at the meeting.",
            translation_vi: "Được rồi! Cảm ơn. Gặp ở meeting nhé.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "Can you help me",
        options: [
          "Can you help me",
          "Can you helping me",
          "You can help me always",
          "Can help you me",
        ],
        answer: "Can you help me",
      },
      {
        id: "lac2",
        audio_text: "There's a problem with the printer",
        options: [
          "There's a problem with the printer",
          "There have a problem with the printer",
          "It's a problem the printer have",
          "There is problem printer with",
        ],
        answer: "There's a problem with the printer",
      },
      {
        id: "lac3",
        audio_text: "It doesn't work",
        options: [
          "It doesn't work",
          "It don't work",
          "It not work",
          "It doesn't working",
        ],
        answer: "It doesn't work",
      },
      {
        id: "lac4",
        audio_text: "Could you fix it please",
        options: [
          "Could you fix it please",
          "Could you fixing it please",
          "You could fix it always please",
          "Could fix you it please",
        ],
        answer: "Could you fix it please",
      },
      {
        id: "lac5",
        audio_text: "Thanks for your help",
        options: [
          "Thanks for your help",
          "Thanks for you help",
          "Thank you for help me",
          "Thanks you for helping always",
        ],
        answer: "Thanks for your help",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "Can you help me?",
        vi: "Bạn giúp mình được không?",
      },
      {
        en: "There's a problem with the printer.",
        vi: "Máy in có vấn đề.",
      },
      {
        en: "It doesn't work.",
        vi: "Nó không chạy.",
      },
      {
        en: "It's broken.",
        vi: "Nó hỏng rồi.",
      },
      {
        en: "Can you fix it?",
        vi: "Bạn sửa được không?",
      },
      {
        en: "Excuse me — I need help.",
        vi: "Xin lỗi — mình cần giúp.",
      },
      {
        en: "Could you check this, please?",
        vi: "Bạn kiểm tra giúp được không?",
      },
      {
        en: "Thanks for your help!",
        vi: "Cảm ơn vì đã giúp!",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Bạn gặp sự cố nhỏ ở văn phòng hoặc quầy dịch vụ (30–45 giây). Nói 5–7 câu: ≥1 Excuse me / Can you help… / Could you… + ≥1 There's a problem… hoặc It doesn't work / It's broken + ≥1 Can you fix…? hoặc Please wait… + Thanks for your help. Có thể ôn 1 câu job (a2-06): I work in… nếu giới thiệu.",
    successCriteria_vi: [
      "≥1 Can you help…? / Could you…? / Excuse me…",
      "≥1 There's a problem… / It doesn't work / It's broken / I need help",
      "≥1 Can you fix…? / Please wait a moment / Thanks for your help",
      "doesn't (không don't) với it; không: It not work",
    ],
    scaffold_en: [
      "Excuse me — can you help me?",
      "There's a problem with…",
      "It doesn't work. / It's broken.",
      "Could you fix it, please?",
      "Thanks for your help!",
      "I work in… (spiral a2-06)",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Nhờ giúp:",
        options: [
          "Can you help me?",
          "You can help me?",
          "Can you helping me?",
          "Help you can me?",
        ],
        answer: "Can you help me?",
        explanation_vi: "Can you + V?",
      },
      {
        id: "q2",
        type: "mcq",
        question: "There's a _____ with the Wi‑Fi.",
        options: ["problem", "problems is", "problematic", "probleming"],
        answer: "problem",
      },
      {
        id: "q3",
        type: "true-false",
        question: "It don't work. là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: It doesn't work.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Chọn câu lịch sự nhờ sửa:",
        options: [
          "Could you fix it, please?",
          "Fix it you can please?",
          "You fixing it now?",
          "Can you fixing it please?",
        ],
        answer: "Could you fix it, please?",
      },
      {
        id: "q5",
        type: "cloze",
        question: "Please wait a _____. (moment)",
        answer: "moment",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Cảm ơn sau khi được giúp:",
        options: [
          "Thanks for your help!",
          "Thanks for you help!",
          "Thank for your helping!",
          "Thanks you help me!",
        ],
        answer: "Thanks for your help!",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-06) What do you do? — trả lời đúng:",
        options: [
          "I work as a designer.",
          "I works as a designer.",
          "I am work as a designer.",
          "I working as designer every days.",
        ],
        answer: "I work as a designer.",
        explanation_vi: "I + work as… (a2-06).",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a2-06) She _____ in marketing.",
        options: ["works", "work", "working", "is work"],
        answer: "works",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a2-05) I've worked here _____ two years.",
        options: ["for", "since", "ago", "at"],
        answer: "for",
        explanation_vi: "for + duration (a2-05).",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "doesn't /ˈdʌznt/ · problem · broken",
    description_vi:
      "doesn't: /ˈdʌznt/ — z + n nối, không đọc do-es-not từng từ. problem: nhấn pro- /ˈprɒbləm/. broken: /ˈbrəʊkən/ (bro-ken). Can you…? nhịp nhanh: /kən juː/ (can yếu).",
    examples: [
      {
        word: "doesn't",
        ipa: "/ˈdʌznt/",
        tip_vi: "một nhịp; không nuốt z.",
      },
      {
        word: "problem",
        ipa: "/ˈprɒbləm/",
        tip_vi: "nhấn âm 1; o ngắn BrE.",
      },
      {
        word: "broken",
        ipa: "/ˈbrəʊkən/",
        tip_vi: "o dài /əʊ/; -en nhẹ.",
      },
    ],
  },
};
