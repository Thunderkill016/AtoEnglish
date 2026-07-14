import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — problem–solution language for work incidents.
 * Core: The problem is… / One solution is… / We could… (+ cause, issue, fix, try).
 * Work: outage, delay, client, meeting. Spiral: b1-10 PPC for/since stretch.
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB111: LessonSpec = {
  id: "l-b1-11",
  phase: "P3",
  cefr: "B1",
  title_vi: "Vấn đề & giải pháp",
  estimatedMin: 40,
  canDo: [
    "Nêu vấn đề rõ: The problem is… / The issue is…",
    "Đề xuất giải pháp: One solution is… / We could… / Let's try…",
    "Work incident: 45–60s — problem + cause + 1–2 solutions",
  ],
  situation:
    "Incident meeting + chat: server chậm, client delay, bug. Nói 45–60 giây: 1 câu The problem is…, 1 cause nếu biết, ≥1 One solution is… / We could…, 1 ôn b1-10 (have been + V-ing for/since) nếu hợp ngữ cảnh.",
  culturalNote_vi:
    "Ở work meeting, frame problem trước rồi solution — rõ, không chỉ than. The problem is + clause/noun. One solution is + to-V / noun. We could + bare V (đề xuất mềm). Không: The problem is is… / We could to fix / One solution is we will must…",
  jobAngle:
    "Work incidents: outage, delay, client, bug — The problem is…; One solution is…; We could…; fix, try, cause",
  lexis: [
    {
      id: "v1",
      word: "The problem is…",
      phonetic: "/ðə ˈprɒbləm ɪz/",
      meaning_vi: "Vấn đề là…",
      example_en: "The problem is the server is slow.",
      l1_note_vi:
        "The problem is + clause/noun. Không lặp is: The problem is is…",
    },
    {
      id: "v2",
      word: "One solution is…",
      phonetic: "/wʌn səˈluːʃn ɪz/",
      meaning_vi: "Một giải pháp là…",
      example_en: "One solution is to restart the service.",
      l1_note_vi:
        "One solution is + to-V / noun. Không: One solution is we must will…",
    },
    {
      id: "v3",
      word: "We could…",
      phonetic: "/wiː kʊd/",
      meaning_vi: "Chúng ta có thể… (đề xuất)",
      example_en: "We could call the client now.",
      l1_note_vi:
        "We could + bare verb. Không: We could to call / We can could…",
    },
    {
      id: "v4",
      word: "issue",
      phonetic: "/ˈɪʃuː/",
      meaning_vi: "vấn đề / sự cố (trang trọng hơn problem)",
      example_en: "The main issue is the payment delay.",
      l1_note_vi:
        "issue ≈ problem (work). raise an issue. ≠ tissue (khăn giấy).",
    },
    {
      id: "v5",
      word: "cause",
      phonetic: "/kɔːz/",
      meaning_vi: "nguyên nhân (n) / gây ra (v)",
      example_en: "The cause is a network error.",
      l1_note_vi:
        "the cause of X / What caused…? ≠ because alone as noun.",
    },
    {
      id: "v6",
      word: "fix",
      phonetic: "/fɪks/",
      meaning_vi: "sửa / khắc phục",
      example_en: "We need to fix the bug before launch.",
      l1_note_vi:
        "fix a bug / a problem. a quick fix (n). Không: fixs.",
    },
    {
      id: "v7",
      word: "try",
      phonetic: "/traɪ/",
      meaning_vi: "thử",
      example_en: "Let's try a different approach.",
      l1_note_vi:
        "try + to-V / try + V-ing. Let's try… = đề xuất hành động.",
    },
    {
      id: "v8",
      word: "delay",
      phonetic: "/dɪˈleɪ/",
      meaning_vi: "sự chậm trễ / làm chậm",
      example_en: "The problem is a two-hour delay.",
      l1_note_vi:
        "a delay (n) / delay something (v). without delay = ngay.",
    },
    {
      id: "v9",
      word: "outage",
      phonetic: "/ˈaʊtɪdʒ/",
      meaning_vi: "sự cố mất dịch vụ / mất điện mạng",
      example_en: "There was a short outage this morning.",
      l1_note_vi:
        "outage = service down. power outage / network outage.",
    },
    {
      id: "v10",
      word: "suggest",
      phonetic: "/səˈdʒest/",
      meaning_vi: "đề xuất",
      example_en: "I suggest we restart the server.",
      l1_note_vi:
        "suggest + clause / suggest + V-ing. Không: suggest to do (thường sai).",
    },
    {
      id: "v11",
      word: "resolve",
      phonetic: "/rɪˈzɒlv/",
      meaning_vi: "giải quyết (trang trọng)",
      example_en: "We need to resolve this before Friday.",
      l1_note_vi:
        "resolve an issue (formal). ≈ fix / solve. resolve ≠ decide only.",
    },
    {
      id: "v12",
      word: "workaround",
      phonetic: "/ˈwɜːkəraʊnd/",
      meaning_vi: "cách làm tạm thời",
      example_en: "One solution is a temporary workaround.",
      l1_note_vi:
        "workaround = tạm ổn, chưa fix gốc. a quick workaround.",
    },
  ],
  grammar: {
    title: "Problem–solution frames",
    rule: "The problem is… · One solution is… · We could…",
    examples: [
      {
        en: "The problem is the server is down.",
        vi: "Vấn đề là server đang down.",
      },
      {
        en: "One solution is to restart the service.",
        vi: "Một giải pháp là restart service.",
      },
      {
        en: "We could email the client and explain the delay.",
        vi: "Chúng ta có thể email client và giải thích delay.",
      },
    ],
    vnNote:
      "Frame: problem → cause (optional) → solution. The problem is + clause. One solution is + to-V. We could + bare V (mềm hơn We must). Sai hay gặp: The problem is is… / We could to fix / One solution is we will must / The problem are…",
    ccq: {
      question: "Câu nào đúng khi đề xuất giải pháp mềm?",
      options: [
        "We could restart the server.",
        "We could to restart the server.",
        "We must could restart the server.",
        "One solution is we will must restart.",
      ],
      answer: "We could restart the server.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "___ the payment page is broken.",
      options: [
        "The problem is",
        "The problem are",
        "The problem is is",
        "Problem is that only",
      ],
      answer: "The problem is",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "One solution is ___ the cache.",
      options: ["to clear", "clearing will must", "we could to", "clears"],
      answer: "to clear",
    },
    {
      id: "c3",
      type: "mcq",
      prompt_vi: "We ___ call the client now.",
      options: ["could", "could to", "must could", "are could"],
      answer: "could",
    },
    {
      id: "c4",
      type: "scramble",
      prompt_vi: "Sắp xếp: The / problem / is / the / server / is / slow",
      words: ["The", "problem", "is", "the", "server", "is", "slow"],
      answer: "The problem is the server is slow",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa: We could to fix the bug today.",
      stem: "We could to fix the bug today.",
      answer: "We could fix the bug today.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "The problem is is the delay. is:",
      options: [
        "sai — bỏ is thừa",
        "đúng chuẩn British",
        "chỉ dùng trong email",
        "đúng với past simple",
      ],
      answer: "sai — bỏ is thừa",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Incident — server outage",
        context_vi: "Incident call: problem + cause + solutions; work tech.",
        lines: [
          {
            id: "1",
            speaker: "Minh",
            text: "The problem is the app is down for many users.",
            translation_vi:
              "Vấn đề là app down với nhiều user.",
          },
          {
            id: "2",
            speaker: "Hoa",
            text: "What is the cause?",
            translation_vi: "Nguyên nhân là gì?",
          },
          {
            id: "3",
            speaker: "Minh",
            text: "The cause is a short network outage.",
            translation_vi: "Nguyên nhân là outage mạng ngắn.",
          },
          {
            id: "4",
            speaker: "Hoa",
            text: "One solution is to restart the service now.",
            translation_vi: "Một giải pháp là restart service ngay.",
          },
          {
            id: "5",
            speaker: "Minh",
            text: "We could also post a status update for the client.",
            translation_vi:
              "Chúng ta cũng có thể đăng status update cho client.",
          },
          {
            id: "6",
            speaker: "Hoa",
            text: "Good. Let's try the restart first, then the update.",
            translation_vi:
              "Hay. Thử restart trước, rồi update.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Standup — delay + PPC spiral",
        context_vi: "Standup: delivery delay + ôn b1-10 have been + for/since.",
        lines: [
          {
            id: "1",
            speaker: "Lan",
            text: "The issue is the report is late for the client.",
            translation_vi:
              "Vấn đề là report trễ cho client.",
          },
          {
            id: "2",
            speaker: "Tuan",
            text: "We have been waiting for the data since Monday.",
            translation_vi:
              "Chúng tôi đợi data từ thứ Hai (vẫn đang).",
          },
          {
            id: "3",
            speaker: "Lan",
            text: "One solution is to send a partial report today.",
            translation_vi:
              "Một giải pháp là gửi report một phần hôm nay.",
          },
          {
            id: "4",
            speaker: "Tuan",
            text: "We could email the client and explain the delay.",
            translation_vi:
              "Chúng ta có thể email client và giải thích delay.",
          },
          {
            id: "5",
            speaker: "Lan",
            text: "I have been drafting that email for twenty minutes.",
            translation_vi:
              "Tôi soạn email đó được hai mươi phút rồi.",
          },
          {
            id: "6",
            speaker: "Tuan",
            text: "Great. Let's try the partial report and the email.",
            translation_vi:
              "Hay. Thử report một phần và email.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "The problem is the server is slow",
        options: [
          "The problem is the server is slow",
          "The problem is is the server is slow",
          "The problem are the server is slow",
          "Problem is that server slow only must",
        ],
        answer: "The problem is the server is slow",
      },
      {
        id: "lac2",
        audio_text: "One solution is to restart the service",
        options: [
          "One solution is to restart the service",
          "One solution is we will must restart",
          "One solution are restart the service",
          "Solution is restarting will must only",
        ],
        answer: "One solution is to restart the service",
      },
      {
        id: "lac3",
        audio_text: "We could call the client now",
        options: [
          "We could call the client now",
          "We could to call the client now",
          "We must could call the client now",
          "We are could call the client now",
        ],
        answer: "We could call the client now",
      },
      {
        id: "lac4",
        audio_text: "The cause is a network error",
        options: [
          "The cause is a network error",
          "The cause are a network error",
          "The cause is is a network error",
          "Cause is network error only will",
        ],
        answer: "The cause is a network error",
      },
      {
        id: "lac5",
        audio_text: "We have been waiting for the data since Monday",
        options: [
          "We have been waiting for the data since Monday",
          "We are waiting for the data since Monday always",
          "We have been wait for the data for Monday",
          "We wait the data since three years",
        ],
        answer: "We have been waiting for the data since Monday",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "The problem is the server is down.",
        vi: "Vấn đề là server đang down.",
      },
      {
        en: "One solution is to restart the service.",
        vi: "Một giải pháp là restart service.",
      },
      {
        en: "We could email the client and explain.",
        vi: "Chúng ta có thể email client và giải thích.",
      },
      {
        en: "The main issue is the payment delay.",
        vi: "Vấn đề chính là delay thanh toán.",
      },
      {
        en: "The cause is a short network outage.",
        vi: "Nguyên nhân là outage mạng ngắn.",
      },
      {
        en: "Let's try a temporary workaround.",
        vi: "Hãy thử một workaround tạm.",
      },
      {
        en: "We need to fix the bug before launch.",
        vi: "Chúng ta cần fix bug trước launch.",
      },
      {
        en: "I suggest we resolve this before Friday.",
        vi: "Tôi đề xuất giải quyết trước thứ Sáu.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s work incident: (1) The problem is… / The issue is…; (2) cause nếu biết; (3) ≥1 One solution is… hoặc We could…; (4) tùy chọn ôn b1-10: 1 câu have been + V-ing (for/since).",
    successCriteria_vi: [
      "Có ≥1 câu The problem is… / The issue is…",
      "Có ≥1 One solution is… hoặc We could…",
      "Nói rõ work context (server, client, delay, bug…)",
      "Không We could to… / The problem is is…",
    ],
    scaffold_en: [
      "The problem is…",
      "The cause is…",
      "One solution is to…",
      "We could…",
      "We have been … for/since… (ôn b1-10)",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Correct problem frame",
        options: [
          "The problem is the server is slow.",
          "The problem is is the server is slow.",
          "The problem are the server is slow.",
          "Problem is that server slow only must.",
        ],
        answer: "The problem is the server is slow.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "One solution is usually followed by",
        options: [
          "to + verb or a noun phrase",
          "bare must only",
          "than + adjective only",
          "located + place only",
        ],
        answer: "to + verb or a noun phrase",
      },
      {
        id: "q3",
        type: "mcq",
        question: "We could is used to",
        options: [
          "softly suggest an action",
          "only state past finished facts",
          "only form passive get things done",
          "only mark for/since time",
        ],
        answer: "softly suggest an action",
      },
      {
        id: "q4",
        type: "true-false",
        question: "We could to fix the bug today. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "A workaround is",
        options: [
          "a temporary way to handle the issue",
          "only a permanent root-cause fix always",
          "only a past simple verb",
          "only a career title",
        ],
        answer: "a temporary way to handle the issue",
      },
      {
        id: "q6",
        type: "true-false",
        question: "The problem is is the delay. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-10) Correct ongoing stretch line",
        options: [
          "I have been working here for two years.",
          "I am working here for two years.",
          "I have been work here for two years.",
          "I work here since two years.",
        ],
        answer: "I have been working here for two years.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-10) since is used with",
        options: [
          "a start point (when it began)",
          "only a number of years alone",
          "only bare verb",
          "only adjectives",
        ],
        answer: "a start point (when it began)",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-10) for is used with",
        options: [
          "a duration (how long)",
          "only a start year like 2021",
          "only future will",
          "only passive get things done",
        ],
        answer: "a duration (how long)",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-10) She has been learning English for 2021. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "problem · solution · could",
    description_vi:
      "problem nhấn PRO-blem. solution /səˈluːʃn/ — syllable 2. could /kʊd/ ngắn, không /kuːld/. Nối: the_problem_is · one_solution_is · we_could_fix · network_outage.",
    examples: [
      { word: "problem", tip_vi: "PRO-blem — nhấn 1" },
      { word: "solution", tip_vi: "so-LU-tion — nhấn 2" },
      { word: "could", tip_vi: "/kʊd/ ngắn" },
      { word: "issue", tip_vi: "/ˈɪʃuː/ — không /ˈɪsjuː/ bắt buộc" },
    ],
  },
};
