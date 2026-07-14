import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P3 B1 — present perfect continuous (light) for ongoing experience.
 * Core: have/has been + V-ing · for + duration · since + start point.
 * Work/career: role, project, skills stretch. Spiral: b1-09 get things done / requests.
 * L1 notes ≥50% (B1 schema gate); aim 100% for VN adults.
 */
export const lessonB110: LessonSpec = {
  id: "l-b1-10",
  phase: "P3",
  cefr: "B1",
  title_vi: "Kinh nghiệm dài (PPC)",
  estimatedMin: 40,
  canDo: [
    "Nói trải nghiệm đang kéo dài: have/has been + V-ing",
    "Dùng for (khoảng thời gian) và since (mốc bắt đầu)",
    "Work/career: role, project, skill — 45–60s stretch",
  ],
  situation:
    "Interview + standup career: bạn kể đang làm gì bao lâu. Nói 45–60 giây: 2 câu have been + V-ing (for/since), 1 skill/project, 1 ôn b1-09 (Could you… / get something done) nếu hợp ngữ cảnh.",
  culturalNote_vi:
    "Present perfect continuous = hành động bắt đầu trong quá khứ, vẫn đang / vừa mới ảnh hưởng hiện tại. for + duration (for 3 years). since + start (since 2021 / since Monday). Không: I am working here for 3 years / I have been work / for 2021 / since 3 years.",
  jobAngle:
    "Career stretch: I have been working as… for/since; project, role, develop skills, recently, so far",
  lexis: [
    {
      id: "v1",
      word: "have been + V-ing",
      phonetic: "/hæv biːn/",
      meaning_vi: "đã và đang… (kéo dài tới hiện tại)",
      example_en: "I have been working here for two years.",
      l1_note_vi:
        "have/has + been + V-ing. Không: have been work / am working for 2 years (sai khung thời gian dài).",
    },
    {
      id: "v2",
      word: "for",
      phonetic: "/fɔː/",
      meaning_vi: "trong / suốt (khoảng thời gian)",
      example_en: "She has been learning English for six months.",
      l1_note_vi:
        "for + duration: for 2 hours / for 3 years. Không: for 2020.",
    },
    {
      id: "v3",
      word: "since",
      phonetic: "/sɪns/",
      meaning_vi: "từ (mốc bắt đầu)",
      example_en: "We have been using Slack since 2022.",
      l1_note_vi:
        "since + start point: since Monday / since 2021. Không: since 3 years.",
    },
    {
      id: "v4",
      word: "work as",
      phonetic: "/wɜːk æz/",
      meaning_vi: "làm việc với vai trò…",
      example_en: "I have been working as a designer for three years.",
      l1_note_vi:
        "work as + job title. ≠ work like (trông giống / kiểu).",
    },
    {
      id: "v5",
      word: "role",
      phonetic: "/rəʊl/",
      meaning_vi: "vai trò / vị trí công việc",
      example_en: "My role has been growing since last year.",
      l1_note_vi:
        "role = job role. current role / take on a new role.",
    },
    {
      id: "v6",
      word: "project",
      phonetic: "/ˈprɒdʒekt/",
      meaning_vi: "dự án",
      example_en: "We have been building this project since January.",
      l1_note_vi:
        "project (n). work on a project. Không: make a project thay work on (thường).",
    },
    {
      id: "v7",
      word: "recently",
      phonetic: "/ˈriːsntli/",
      meaning_vi: "gần đây",
      example_en: "I have been learning Python recently.",
      l1_note_vi:
        "recently hay đi với present perfect / PPC. ≠ yesterday alone.",
    },
    {
      id: "v8",
      word: "so far",
      phonetic: "/səʊ fɑː/",
      meaning_vi: "cho đến nay",
      example_en: "So far, I have been enjoying the new role.",
      l1_note_vi:
        "so far = up to now. Thường với present perfect.",
    },
    {
      id: "v9",
      word: "develop",
      phonetic: "/dɪˈveləp/",
      meaning_vi: "phát triển (kỹ năng / sản phẩm)",
      example_en: "I have been developing my presentation skills.",
      l1_note_vi:
        "develop skills / a product. have been developing…",
    },
    {
      id: "v10",
      word: "experience",
      phonetic: "/ɪkˈspɪəriəns/",
      meaning_vi: "kinh nghiệm",
      example_en: "I have been gaining experience in customer support.",
      l1_note_vi:
        "experience (uncountable for skill). an experience = 1 trải nghiệm cụ thể.",
    },
    {
      id: "v11",
      word: "still",
      phonetic: "/stɪl/",
      meaning_vi: "vẫn còn",
      example_en: "I am still learning; I have been practicing every day.",
      l1_note_vi:
        "still = tiếp tục. I still work here / I am still waiting.",
    },
    {
      id: "v12",
      word: "career",
      phonetic: "/kəˈrɪə/",
      meaning_vi: "sự nghiệp",
      example_en: "I have been building my career in tech for five years.",
      l1_note_vi:
        "career path / career change. ≠ job (1 vị trí cụ thể).",
    },
  ],
  grammar: {
    title: "Present perfect continuous (light)",
    rule: "have/has been + V-ing · for + duration · since + start",
    examples: [
      {
        en: "I have been working as a designer for three years.",
        vi: "Tôi đã và đang làm designer được ba năm.",
      },
      {
        en: "She has been learning English since 2021.",
        vi: "Cô ấy học tiếng Anh từ năm 2021 (vẫn đang).",
      },
      {
        en: "We have been waiting for the client for twenty minutes.",
        vi: "Chúng tôi đã đợi client hai mươi phút rồi.",
      },
    ],
    vnNote:
      "PPC: have/has + been + V-ing — nhấn mạnh quá trình/kéo dài. for = bao lâu; since = từ khi nào. Sai hay gặp: I am working here for 3 years / I have been work / for 2021 / since 3 years / I work here since 2020.",
    ccq: {
      question: "Câu nào đúng khi nói đã làm designer 3 năm (vẫn đang)?",
      options: [
        "I have been working as a designer for three years.",
        "I am working as a designer for three years.",
        "I have been work as a designer for three years.",
        "I work as a designer since three years.",
      ],
      answer: "I have been working as a designer for three years.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "I ___ working here for two years.",
      options: ["have been", "am been", "have", "was been"],
      answer: "have been",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "She has been learning English ___ 2021.",
      options: ["since", "for", "during", "by"],
      answer: "since",
    },
    {
      id: "c3",
      type: "mcq",
      prompt_vi: "We have been waiting ___ twenty minutes.",
      options: ["for", "since", "from", "at"],
      answer: "for",
    },
    {
      id: "c4",
      type: "scramble",
      prompt_vi: "Sắp xếp: I / have / been / working / here / for / two / years",
      words: ["I", "have", "been", "working", "here", "for", "two", "years"],
      answer: "I have been working here for two years",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa: I am working in this company for 3 years.",
      stem: "I am working in this company for 3 years.",
      answer: "I have been working in this company for 3 years.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "since 3 years is:",
      options: [
        "sai — dùng for 3 years",
        "đúng chuẩn British",
        "chỉ dùng trong email",
        "đúng với past simple",
      ],
      answer: "sai — dùng for 3 years",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Interview — career stretch",
        context_vi: "Phỏng vấn: kể role + for/since + skill; PPC light.",
        lines: [
          {
            id: "1",
            speaker: "Interviewer",
            text: "Tell me about your recent experience.",
            translation_vi: "Hãy kể về kinh nghiệm gần đây của bạn.",
          },
          {
            id: "2",
            speaker: "Lan",
            text: "I have been working as a product designer for three years.",
            translation_vi:
              "Tôi đã và đang làm product designer được ba năm.",
          },
          {
            id: "3",
            speaker: "Interviewer",
            text: "How long have you been using Figma?",
            translation_vi: "Bạn dùng Figma bao lâu rồi?",
          },
          {
            id: "4",
            speaker: "Lan",
            text: "I have been using it since 2022. So far, I have been enjoying the new tools.",
            translation_vi:
              "Tôi dùng từ 2022. Cho đến nay tôi khá thích các tool mới.",
          },
          {
            id: "5",
            speaker: "Interviewer",
            text: "What have you been developing recently?",
            translation_vi: "Gần đây bạn đang phát triển gì?",
          },
          {
            id: "6",
            speaker: "Lan",
            text: "I have been developing my presentation skills for this role.",
            translation_vi:
              "Tôi đang rèn kỹ năng thuyết trình cho role này.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Standup — project stretch + request",
        context_vi: "Standup: project PPC + ôn b1-09 Could you / get done.",
        lines: [
          {
            id: "1",
            speaker: "Minh",
            text: "We have been building the onboarding flow since Monday.",
            translation_vi:
              "Chúng tôi xây onboarding flow từ thứ Hai (vẫn đang).",
          },
          {
            id: "2",
            speaker: "Hoa",
            text: "I have been testing the form for two days. Still a few bugs.",
            translation_vi:
              "Tôi test form được hai ngày. Vẫn còn vài bug.",
          },
          {
            id: "3",
            speaker: "Minh",
            text: "Could you get the QA checklist printed for the review?",
            translation_vi:
              "Bạn in giúp checklist QA cho buổi review được không?",
          },
          {
            id: "4",
            speaker: "Hoa",
            text: "Sure. I'll get it printed. Would you mind checking the API logs too?",
            translation_vi:
              "Được. Tôi sẽ in. Bạn kiểm tra log API giúp luôn được không?",
          },
          {
            id: "5",
            speaker: "Minh",
            text: "No problem. I have been watching the logs since this morning.",
            translation_vi:
              "Không sao. Tôi theo dõi log từ sáng nay.",
          },
          {
            id: "6",
            speaker: "Hoa",
            text: "Great. So far the project has been moving slowly, but we are still on track.",
            translation_vi:
              "Hay. Đến nay project hơi chậm nhưng vẫn on track.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I have been working here for two years",
        options: [
          "I have been working here for two years",
          "I am working here for two years",
          "I have been work here for two years",
          "I work here since two years",
        ],
        answer: "I have been working here for two years",
      },
      {
        id: "lac2",
        audio_text: "She has been learning English since 2021",
        options: [
          "She has been learning English since 2021",
          "She has been learning English for 2021",
          "She is learning English since 2021",
          "She has been learn English since 2021",
        ],
        answer: "She has been learning English since 2021",
      },
      {
        id: "lac3",
        audio_text: "We have been waiting for twenty minutes",
        options: [
          "We have been waiting for twenty minutes",
          "We have been waiting since twenty minutes",
          "We are waiting for twenty minutes already always",
          "We wait for twenty minutes since now",
        ],
        answer: "We have been waiting for twenty minutes",
      },
      {
        id: "lac4",
        audio_text: "I have been developing my presentation skills",
        options: [
          "I have been developing my presentation skills",
          "I have been develop my presentation skills",
          "I am develop my presentation skills for long",
          "I develop my presentation skills since long",
        ],
        answer: "I have been developing my presentation skills",
      },
      {
        id: "lac5",
        audio_text: "Could you get the checklist printed for the review",
        options: [
          "Could you get the checklist printed for the review",
          "Could you to get the checklist printed",
          "Would you mind get the checklist print",
          "I get print the checklist for review",
        ],
        answer: "Could you get the checklist printed for the review",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "I have been working as a designer for three years.",
        vi: "Tôi đã và đang làm designer được ba năm.",
      },
      {
        en: "She has been learning English since 2021.",
        vi: "Cô ấy học tiếng Anh từ năm 2021.",
      },
      {
        en: "We have been building this project since January.",
        vi: "Chúng tôi xây project này từ tháng Một.",
      },
      {
        en: "I have been developing my presentation skills recently.",
        vi: "Gần đây tôi đang rèn kỹ năng thuyết trình.",
      },
      {
        en: "So far, I have been enjoying the new role.",
        vi: "Cho đến nay tôi khá thích role mới.",
      },
      {
        en: "We have been waiting for the client for twenty minutes.",
        vi: "Chúng tôi đã đợi client hai mươi phút.",
      },
      {
        en: "I have been gaining experience in customer support.",
        vi: "Tôi đang tích lũy kinh nghiệm support khách hàng.",
      },
      {
        en: "I have been building my career in tech for five years.",
        vi: "Tôi xây sự nghiệp tech được năm năm.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Nói 45–60s career: (1) 2 câu have/has been + V-ing (dùng cả for và since nếu được); (2) 1 skill/project/role; (3) tùy chọn ôn b1-09: Could you… hoặc get something done 1 lần.",
    successCriteria_vi: [
      "Có ≥2 câu have/has been + V-ing",
      "Có for (duration) hoặc since (start) — tốt nhất cả hai",
      "Nói rõ role / project / skill career",
      "Phát âm been /bɪn/ rõ; không am working for 3 years",
    ],
    scaffold_en: [
      "I have been working as… for…",
      "I have been … since…",
      "Recently, I have been developing…",
      "Could you…? / I'll get … done (ôn b1-09)",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Correct ongoing career line",
        options: [
          "I have been working as a designer for three years.",
          "I am working as a designer for three years.",
          "I have been work as a designer for three years.",
          "I work as a designer since three years.",
        ],
        answer: "I have been working as a designer for three years.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "for is used with",
        options: [
          "a duration (how long)",
          "only a start year like 2021",
          "only past simple time",
          "only future will",
        ],
        answer: "a duration (how long)",
      },
      {
        id: "q3",
        type: "mcq",
        question: "since is used with",
        options: [
          "a start point (when it began)",
          "only a number of years alone",
          "only bare verb",
          "only adjectives",
        ],
        answer: "a start point (when it began)",
      },
      {
        id: "q4",
        type: "true-false",
        question: "I have been work here for two years. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
      {
        id: "q5",
        type: "mcq",
        question: "have been + V-ing means",
        options: [
          "started in the past and still continuing / recent stretch",
          "only finished in the distant past with no link now",
          "only future plans",
          "only passive get things done",
        ],
        answer:
          "started in the past and still continuing / recent stretch",
      },
      {
        id: "q6",
        type: "true-false",
        question: "She has been learning English for 2021. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn b1-09) Correct request line",
        options: [
          "Could you print this for me?",
          "Could you to print this for me?",
          "Would you mind print this for me?",
          "I get print this for me",
        ],
        answer: "Could you print this for me?",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn b1-09) Would you mind is followed by",
        options: [
          "V-ing",
          "bare must only",
          "than + adjective only",
          "located + place only",
        ],
        answer: "V-ing",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn b1-09) I got my laptop fixed means",
        options: [
          "someone fixed my laptop (I arranged it)",
          "I fixed someone else's laptop only",
          "I never used a laptop",
          "only future plan without help",
        ],
        answer: "someone fixed my laptop (I arranged it)",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn b1-09) I got fix my phone yesterday. (grammar OK)",
        options: ["True", "False"],
        answer: "False",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "been /bɪn/ · for /fə/ · since /sɪns/",
    description_vi:
      "been thường /bɪn/ (yếu). have been /həv bɪn/. for /fə/ khi không nhấn. since /sɪns/. Nối: have_been_working · for_three_years · since_2021 · developing_skills.",
    examples: [
      { word: "been", tip_vi: "/bɪn/ yếu, không /biːn/ mạnh mỗi lần" },
      { word: "for", tip_vi: "/fə/ nhanh trong for three years" },
      { word: "since", tip_vi: "/sɪns/" },
      { word: "working", tip_vi: "WOR-king — nhấn syllable 1" },
    ],
  },
};
