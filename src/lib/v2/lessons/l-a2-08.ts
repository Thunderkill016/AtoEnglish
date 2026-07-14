import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 gate — review spiral + freer apply (end of A2 block / gate to B1).
 * Core: past simple · will/going to · comparatives · present perfect
 * (ever/never, for/since) · work routines · help requests — combine only.
 * Spiral: a2-01…a2-07 sample. Freer task = multi-topic monologue / chat.
 * L1 notes 100% (A2 schema gate). No new grammar forms.
 */
export const lessonA208: LessonSpec = {
  id: "l-a2-08",
  phase: "P2",
  cefr: "A2",
  title_vi: "Cổng A2",
  estimatedMin: 45,
  canDo: [
    "Ghép past, future, experience, work & help trong 1 đoạn nói A2",
    "Dùng đúng form: past simple · going to/will · PP · comparative · Can you…?",
    "Tự tin “cổng” sang B1: small talk công việc + kể chuyện + nhờ giúp",
  ],
  situation:
    "Coffee với đồng nghiệp / mentor nước ngoài sau vài tháng học. Họ hỏi về weekend trước, kế hoạch tuần này, kinh nghiệm, công việc, và một lần bạn nhờ IT giúp. Bạn cần ghép kỹ năng A2 (a2-01…07) thành cuộc chat tự nhiên — không học form mới, chỉ ôn và áp dụng.",
  culturalNote_vi:
    "Sau A2 survival bạn có thể: kể quá khứ (yesterday/last…), plan (going to/will), so sánh & recommend, ever/never + for/since, nói job routine, nhờ giúp khi hỏng máy. Bản ngữ hay nhảy topic trong 1 chat — luyện chuyển: Last weekend… / This week I'm going to… / Have you ever…? / By the way, can you help…? Lỗi hay lặp: I go yesterday; I going to; more cheaper; Did you ever…?; since two years; She work; It don't work.",
  jobAngle:
    "Networking gate — past weekend + week plan + experience + job + help request",
  lexis: [
    {
      id: "v1",
      word: "review",
      phonetic: "/rɪˈvjuː/",
      meaning_vi: "ôn tập / xem lại",
      example_en: "Let's review what we learned at A2.",
      l1_note_vi:
        "review (v/n). Stress re-VIEW. Không: review about (thừa about).",
    },
    {
      id: "v2",
      word: "confident",
      phonetic: "/ˈkɒnfɪdənt/",
      meaning_vi: "tự tin",
      example_en: "I feel more confident speaking at work.",
      l1_note_vi:
        "feel confident / confident about…. Stress CON-fi-dent.",
    },
    {
      id: "v3",
      word: "experience",
      phonetic: "/ɪkˈspɪəriəns/",
      meaning_vi: "kinh nghiệm / trải nghiệm",
      example_en: "I have experience with client calls.",
      l1_note_vi:
        "have experience with/in…. Work experience = kinh nghiệm làm việc.",
    },
    {
      id: "v4",
      word: "improve",
      phonetic: "/ɪmˈpruːv/",
      meaning_vi: "cải thiện",
      example_en: "I want to improve my English for meetings.",
      l1_note_vi:
        "improve your English. Không: improve up / improve more better.",
    },
    {
      id: "v5",
      word: "goal",
      phonetic: "/ɡəʊl/",
      meaning_vi: "mục tiêu",
      example_en: "My goal is to reach B1.",
      l1_note_vi: "set/reach a goal. My goal is to + V.",
    },
    {
      id: "v6",
      word: "practice",
      phonetic: "/ˈpræktɪs/",
      meaning_vi: "luyện tập",
      example_en: "I practice English every day.",
      l1_note_vi:
        "practice speaking. US practice n+v; UK practise (v).",
    },
    {
      id: "v7",
      word: "recommend",
      phonetic: "/ˌrekəˈmend/",
      meaning_vi: "đề xuất / giới thiệu",
      example_en: "I recommend this option. It's cheaper.",
      l1_note_vi:
        "I recommend + noun / recommend that…. Không: I recommend to you buy.",
    },
    {
      id: "v8",
      word: "deadline",
      phonetic: "/ˈdedlaɪn/",
      meaning_vi: "hạn chót",
      example_en: "The deadline is Friday.",
      l1_note_vi:
        "meet a deadline / before the deadline. Stress DEAD-line.",
    },
    {
      id: "v9",
      word: "already",
      phonetic: "/ɔːlˈredi/",
      meaning_vi: "đã rồi",
      example_en: "I've already finished the report.",
      l1_note_vi:
        "already = đã xong (khẳng định PP). yet = chưa / đã…chưa?",
    },
    {
      id: "v10",
      word: "problem",
      phonetic: "/ˈprɒbləm/",
      meaning_vi: "vấn đề",
      example_en: "There's a problem with the printer.",
      l1_note_vi:
        "There's a problem with + N. Không: Have a problem the printer.",
    },
    {
      id: "v11",
      word: "colleague",
      phonetic: "/ˈkɒliːɡ/",
      meaning_vi: "đồng nghiệp",
      example_en: "I asked a colleague for help.",
      l1_note_vi:
        "colleague = đồng nghiệp (không college = trường). Stress COL-league.",
    },
    {
      id: "v12",
      word: "achieve",
      phonetic: "/əˈtʃiːv/",
      meaning_vi: "đạt được",
      example_en: "You achieved your A2 goal!",
      l1_note_vi:
        "achieve a goal. Stress a-CHIEVE. Âm /tʃ/ — không /ʃ/.",
    },
  ],
  grammar: {
    title: "Ôn ngữ pháp A2 — ghép nhiều cấu trúc",
    rule: "past · going to/will · comparative · PP · work present · help",
    examples: [
      {
        en: "Last weekend I went to a café and met a friend.",
        vi: "past simple + time marker (a2-01)",
      },
      {
        en: "This week I'm going to finish the report. I'll send it Friday.",
        vi: "going to (plan) · will (quyết định) (a2-02)",
      },
      {
        en: "This option is cheaper. I recommend it.",
        vi: "comparative + recommend (a2-03)",
      },
      {
        en: "Have you ever worked remote? I've worked here for two years.",
        vi: "ever + for/since (a2-04/05)",
      },
      {
        en: "I work as a designer. There's a problem — can you help me?",
        vi: "job present · help request (a2-06/07)",
      },
    ],
    vnNote:
      "Bài cổng: không form mới. Lỗi hay lặp: I go yesterday; I going to; more cheaper; Did you ever…?; since two years; She work; It don't work; You can help me? (trật tự). Ghép câu đúng trước khi nói dài.",
    ccq: {
      question: "Câu nào ghép đúng NHIỀU cấu trúc A2?",
      options: [
        "Last week I went to a meeting. This week I'm going to finish the report. I've worked here for a year.",
        "I go yesterday and I going to finish. I work here since two years.",
        "She work as designer and it don't work the printer.",
        "More cheaper option I recommend and Did you ever been Japan?",
      ],
      answer:
        "Last week I went to a meeting. This week I'm going to finish the report. I've worked here for a year.",
      explanation_vi:
        "past + time · be going to · PP + for — cả ba form đúng.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Past simple (a2-01)",
      options: [
        "I went to a café yesterday.",
        "I go to a café yesterday.",
        "I going to a café yesterday.",
        "I have go to a café yesterday.",
      ],
      answer: "I went to a café yesterday.",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "Future plan (a2-02)",
      options: [
        "I'm going to finish the report this week.",
        "I going to finish the report this week.",
        "I will to finish the report this week.",
        "I am go finish the report this week.",
      ],
      answer: "I'm going to finish the report this week.",
    },
    {
      id: "c3",
      type: "cloze",
      prompt_vi: "Điền: This phone is _____ than that one. (cheaper)",
      stem: "This phone is _____ than that one.",
      answer: "cheaper",
      explanation_vi: "cheap → cheaper (không more cheap).",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Present perfect ever (a2-04)",
      options: [
        "Have you ever been to Japan?",
        "Did you ever been to Japan?",
        "Have you ever go to Japan?",
        "Do you ever been to Japan?",
      ],
      answer: "Have you ever been to Japan?",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I've worked here since two years.",
      stem: "I've worked here since two years.",
      answer: "I've worked here for two years.",
      explanation_vi: "for + duration; since + point (a2-05).",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Job routine (a2-06)",
      options: [
        "I work as a designer. I start at nine.",
        "I works as a designer. I start at nine.",
        "I am work as a designer every days.",
        "I working as designer at nine.",
      ],
      answer: "I work as a designer. I start at nine.",
    },
    {
      id: "c7",
      type: "scramble",
      prompt_vi: "Sắp xếp: help / me / Can / you / ?",
      words: ["Can", "you", "help", "me"],
      answer: "Can you help me",
    },
    {
      id: "c8",
      type: "mcq",
      prompt_vi: "Problem + doesn't (a2-07)",
      options: [
        "There's a problem. It doesn't work.",
        "There's a problem. It don't work.",
        "There have a problem. It not work.",
        "Have problem. It doesn't working.",
      ],
      answer: "There's a problem. It doesn't work.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Coffee mentor — tổng hợp A2",
        context_vi:
          "Lan gặp mentor Sam: weekend past → week plan → experience → job → help printer.",
        lines: [
          {
            id: "d1-1",
            speaker: "Sam",
            text: "Hi Lan! What did you do last weekend?",
            translation_vi: "Chào Lan! Cuối tuần trước bạn làm gì?",
          },
          {
            id: "d1-2",
            speaker: "Lan",
            text: "I went to a café and met a friend. We had coffee.",
            translation_vi: "Mình đi quán cà phê và gặp bạn. Chúng mình uống cà phê.",
          },
          {
            id: "d1-3",
            speaker: "Sam",
            text: "Nice. What are you going to do this week?",
            translation_vi: "Hay. Tuần này bạn định làm gì?",
          },
          {
            id: "d1-4",
            speaker: "Lan",
            text: "I'm going to finish a report. I'll send it on Friday.",
            translation_vi: "Mình sẽ xong report. Mình sẽ gửi thứ Sáu.",
          },
          {
            id: "d1-5",
            speaker: "Sam",
            text: "Have you ever worked with an international team?",
            translation_vi: "Bạn đã từng làm với team quốc tế chưa?",
          },
          {
            id: "d1-6",
            speaker: "Lan",
            text: "Yes, I have. I've worked here for two years. I work as a designer.",
            translation_vi:
              "Rồi. Mình làm ở đây được hai năm. Mình làm designer.",
          },
          {
            id: "d1-7",
            speaker: "Sam",
            text: "Great. By the way — is your printer OK? You look stuck.",
            translation_vi: "Tuyệt. À — máy in ổn không? Trông bạn bí quá.",
          },
          {
            id: "d1-8",
            speaker: "Lan",
            text: "There's a problem. It doesn't work. Can you help me?",
            translation_vi: "Có vấn đề. Nó không chạy. Bạn giúp được không?",
          },
          {
            id: "d1-9",
            speaker: "Sam",
            text: "Sure. Please wait a moment… Done. You achieved a lot at A2!",
            translation_vi: "Được. Đợi chút… Xong. A2 bạn tiến bộ nhiều đấy!",
          },
          {
            id: "d1-10",
            speaker: "Lan",
            text: "Thanks for your help! My goal is to reach B1. See you later!",
            translation_vi: "Cảm ơn! Mục tiêu mình là B1. Hẹn gặp lại!",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Office pick + plan",
        context_vi:
          "Minh và Mai so sánh tool, chốt plan, nhắc deadline.",
        lines: [
          {
            id: "d2-1",
            speaker: "Minh",
            text: "Which option is better for the team?",
            translation_vi: "Option nào tốt hơn cho team?",
          },
          {
            id: "d2-2",
            speaker: "Mai",
            text: "This one is cheaper. That one is better quality.",
            translation_vi: "Cái này rẻ hơn. Cái kia chất lượng tốt hơn.",
          },
          {
            id: "d2-3",
            speaker: "Minh",
            text: "I recommend the cheaper option. The deadline is Friday.",
            translation_vi: "Mình đề xuất cái rẻ hơn. Deadline là thứ Sáu.",
          },
          {
            id: "d2-4",
            speaker: "Mai",
            text: "OK. I'm going to email the client. Have you finished the file yet?",
            translation_vi: "OK. Mình sẽ email client. Bạn xong file chưa?",
          },
          {
            id: "d2-5",
            speaker: "Minh",
            text: "Yes — I've already sent it. Thanks!",
            translation_vi: "Rồi — mình đã gửi rồi. Cảm ơn!",
          },
          {
            id: "d2-6",
            speaker: "Mai",
            text: "Perfect. Let's practice the meeting talk tomorrow.",
            translation_vi: "Hoàn hảo. Mai luyện nói meeting nhé.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I went to a café last weekend",
        options: [
          "I went to a café last weekend",
          "I go to a café last weekend",
          "I going to a café last weekend",
          "I have go to a café last weekend",
        ],
        answer: "I went to a café last weekend",
      },
      {
        id: "lac2",
        audio_text: "I'm going to finish the report this week",
        options: [
          "I'm going to finish the report this week",
          "I going to finish the report this week",
          "I will to finish the report this week",
          "I am finish the report this week",
        ],
        answer: "I'm going to finish the report this week",
      },
      {
        id: "lac3",
        audio_text: "Have you ever worked remote",
        options: [
          "Have you ever worked remote",
          "Did you ever worked remote",
          "Have you ever work remote",
          "Do you ever worked remote",
        ],
        answer: "Have you ever worked remote",
      },
      {
        id: "lac4",
        audio_text: "I've worked here for two years",
        options: [
          "I've worked here for two years",
          "I've worked here since two years",
          "I worked here for two years always now",
          "I have work here for two years",
        ],
        answer: "I've worked here for two years",
      },
      {
        id: "lac5",
        audio_text: "There's a problem it doesn't work",
        options: [
          "There's a problem it doesn't work",
          "There's a problem it don't work",
          "There have a problem it not work",
          "Have problem it doesn't working",
        ],
        answer: "There's a problem it doesn't work",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "Last weekend I went to a café.",
        vi: "Cuối tuần trước mình đi quán cà phê.",
      },
      {
        en: "This week I'm going to finish the report.",
        vi: "Tuần này mình sẽ xong report.",
      },
      {
        en: "This option is cheaper. I recommend it.",
        vi: "Option này rẻ hơn. Mình đề xuất nó.",
      },
      {
        en: "Have you ever worked with a team?",
        vi: "Bạn đã từng làm với team chưa?",
      },
      {
        en: "I've worked here for two years.",
        vi: "Mình làm ở đây được hai năm.",
      },
      {
        en: "I work as a designer. I start at nine.",
        vi: "Mình làm designer. Mình bắt đầu lúc chín.",
      },
      {
        en: "There's a problem. Can you help me?",
        vi: "Có vấn đề. Bạn giúp được không?",
      },
      {
        en: "My goal is to reach B1. I feel more confident.",
        vi: "Mục tiêu mình là B1. Mình tự tin hơn.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "FREER A2 (cổng): Coffee / networking 45–60 giây. Ghép ≥4 chủ đề: (1) past weekend · (2) week plan going to/will · (3) experience ever/never HOẶC for/since · (4) job What do you do? · (5 tùy chọn) compare/recommend HOẶC help request. Kết: goal B1 / feel confident.",
    successCriteria_vi: [
      "≥1 past simple + time (yesterday / last…)",
      "≥1 going to hoặc will (plan / offer)",
      "≥1 present perfect (ever/never hoặc for/since) HOẶC job present",
      "Không lỗi nặng lặp: I go yesterday / I going to / since two years / It don't work",
    ],
    scaffold_en: [
      "Last weekend I went… / I met…",
      "This week I'm going to… / I'll…",
      "Have you ever…? / I've worked… for / since…",
      "I work as… / I start at…",
      "This one is cheaper. I recommend…",
      "There's a problem. Can you help me?",
      "My goal is to reach B1. Thanks!",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Câu ôn A2 đúng nhất (ghép form):",
        options: [
          "Last week I went to a meeting. I'm going to finish the report. I've worked here for a year.",
          "I go yesterday and I going to finish. I work here since two years.",
          "She work as designer and it don't work.",
          "More cheaper I recommend and Did you ever been Japan?",
        ],
        answer:
          "Last week I went to a meeting. I'm going to finish the report. I've worked here for a year.",
        explanation_vi: "past · going to · PP + for.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "She ___ to the office yesterday.",
        options: ["went", "go", "goes", "going"],
        answer: "went",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I've worked here since two years. là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: for two years (duration).",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Nhờ giúp lịch sự:",
        options: [
          "Can you help me?",
          "You can help me?",
          "Can you helping me?",
          "Help you can me?",
        ],
        answer: "Can you help me?",
      },
      {
        id: "q5",
        type: "cloze",
        question: "This laptop is _____ than that one. (cheaper)",
        answer: "cheaper",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Experience question:",
        options: [
          "Have you ever worked remote?",
          "Did you ever worked remote?",
          "Have you ever work remote?",
          "Do you ever been remote?",
        ],
        answer: "Have you ever worked remote?",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-01) What did you do last weekend?",
        options: [
          "I went to a café and met a friend.",
          "I go to a café and meet a friend.",
          "I going to a café yesterday weekend.",
          "I have go café last weekend.",
        ],
        answer: "I went to a café and met a friend.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a2-02) Plan đã có:",
        options: [
          "I'm going to call the client tomorrow.",
          "I going to call the client tomorrow.",
          "I will to call the client tomorrow.",
          "I am call the client tomorrow.",
        ],
        answer: "I'm going to call the client tomorrow.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a2-03) Comparative đúng:",
        options: [
          "This one is cheaper than that one.",
          "This one is more cheaper than that one.",
          "This one is cheap than that one.",
          "This one more expensive that one.",
        ],
        answer: "This one is cheaper than that one.",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn a2-04) Ever/never:",
        options: [
          "I've never tried sushi.",
          "I never tried sushi yesterday.",
          "I have never try sushi.",
          "I never have trying sushi.",
        ],
        answer: "I've never tried sushi.",
      },
      {
        id: "s5",
        type: "mcq",
        question: "(Ôn a2-05) for vs since:",
        options: [
          "I've worked here for two years.",
          "I've worked here since two years.",
          "I work here for since 2022.",
          "I've worked here ago two years.",
        ],
        answer: "I've worked here for two years.",
      },
      {
        id: "s6",
        type: "mcq",
        question: "(Ôn a2-06/07) Job + help:",
        options: [
          "I work as a designer. There's a problem — can you help me?",
          "I works as designer. It don't work — you can help me?",
          "I am work designer. Problem have — help me!",
          "I working as. Can you helping me the problem?",
        ],
        answer:
          "I work as a designer. There's a problem — can you help me?",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "went · going to · doesn't",
    description_vi:
      "Ôn âm block A2: went (không /wentəd/); going to hay nối gonna /ˈɡənə/ khi nói nhanh nhưng học form đầy đủ; doesn't /ˈdʌznt/ một nhịp; for /fə/ yếu trước duration.",
    examples: [
      {
        word: "went",
        ipa: "/went/",
        tip_vi: "một âm tiết; t cuối nhẹ.",
      },
      {
        word: "going to",
        ipa: "/ˈɡəʊɪŋ tə/",
        tip_vi: "to yếu /tə/; không nuốt am/is/are.",
      },
      {
        word: "doesn't",
        ipa: "/ˈdʌznt/",
        tip_vi: "z + n nối; không do-es-not từng từ.",
      },
    ],
  },
};
