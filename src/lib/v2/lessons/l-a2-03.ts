import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 — comparatives / superlatives light + recommend.
 * Core: cheaper / better / bigger / more expensive · the best / the cheapest ·
 * I recommend… · prefer · quality / option
 * Spiral: future plans (a2-02), past (a2-01), shopping (a1-07).
 * L1 notes 100% (A2 schema gate).
 */
export const lessonA203: LessonSpec = {
  id: "l-a2-03",
  phase: "P2",
  cefr: "A2",
  title_vi: "So sánh & mua sắm",
  estimatedMin: 40,
  canDo: [
    "So sánh 2–3 lựa chọn bằng comparative (cheaper, better, more expensive)",
    "Nói superlative nhẹ: the best / the cheapest trong shop hoặc office",
    "Đề xuất: I recommend… / I prefer… với lý do ngắn",
  ],
  situation:
    "Bạn đứng trước hai lựa chọn: laptop rẻ hơn vs chất lượng tốt hơn (shop), hoặc tool/vendor cho team (office). Cần nói This one is cheaper, That one is better quality, I recommend the blue one, The cheapest option is… — không chỉ chỉ tay.",
  culturalNote_vi:
    "Khi mua sắm hoặc đề xuất ở công ty VN–quốc tế, so sánh rõ (cheaper / better / more expensive) + I recommend… nghe chuyên nghiệp hơn “cái này ok”. Superlative the best / the cheapest dùng khi có ≥3 option hoặc muốn chốt. Tránh dịch “hơn” = more mọi chỗ: short adj hay -er (cheaper), long adj = more + adj (more expensive).",
  jobAngle: "Office pick — Which option is better? I recommend…",
  lexis: [
    {
      id: "v1",
      word: "cheaper",
      phonetic: "/ˈtʃiːpə/",
      meaning_vi: "rẻ hơn",
      example_en: "This phone is cheaper than that one.",
      l1_note_vi:
        "cheap → cheaper (không more cheap). than = so với. Không: more cheaper.",
    },
    {
      id: "v2",
      word: "better",
      phonetic: "/ˈbetə/",
      meaning_vi: "tốt hơn",
      example_en: "This laptop is better for work.",
      l1_note_vi:
        "good → better (bất quy tắc). Không: gooder / more better.",
    },
    {
      id: "v3",
      word: "bigger",
      phonetic: "/ˈbɪɡə/",
      meaning_vi: "to hơn",
      example_en: "I need a bigger screen.",
      l1_note_vi:
        "big → bigger (g gấp đôi). Không: more big.",
    },
    {
      id: "v4",
      word: "more expensive",
      phonetic: "/mɔːr ɪkˈspensɪv/",
      meaning_vi: "đắt hơn",
      example_en: "This model is more expensive.",
      l1_note_vi:
        "expensive dài → more expensive (không expensiver). opposite: cheaper.",
    },
    {
      id: "v5",
      word: "the best",
      phonetic: "/ðə best/",
      meaning_vi: "tốt nhất",
      example_en: "This is the best option for our team.",
      l1_note_vi:
        "good → better → the best. Superlative: the + best. Không: the most best.",
    },
    {
      id: "v6",
      word: "the cheapest",
      phonetic: "/ðə ˈtʃiːpɪst/",
      meaning_vi: "rẻ nhất",
      example_en: "The cheapest plan is $10 a month.",
      l1_note_vi:
        "cheap → cheaper → the cheapest. Có the. Không: the most cheap.",
    },
    {
      id: "v7",
      word: "recommend",
      phonetic: "/ˌrekəˈmend/",
      meaning_vi: "đề xuất / gợi ý",
      example_en: "I recommend the black one.",
      l1_note_vi:
        "I recommend + noun / -ing. I recommend buying… Không: I recommend to buy (thường tránh).",
    },
    {
      id: "v8",
      word: "quality",
      phonetic: "/ˈkwɒləti/",
      meaning_vi: "chất lượng",
      example_en: "The quality is better here.",
      l1_note_vi:
        "quality (n). better quality / high quality. Không: more quality (dùng better quality).",
    },
    {
      id: "v9",
      word: "option",
      phonetic: "/ˈɒpʃn/",
      meaning_vi: "lựa chọn",
      example_en: "We have three options.",
      l1_note_vi:
        "option = choice. the best option. Không: an option good → a good option.",
    },
    {
      id: "v10",
      word: "prefer",
      phonetic: "/prɪˈfɜː/",
      meaning_vi: "thích hơn / ưu tiên",
      example_en: "I prefer the cheaper option.",
      l1_note_vi:
        "prefer A (to B). I prefer this one. Không: I more prefer.",
    },
  ],
  grammar: {
    title: "Comparatives · superlatives · recommend",
    rule: "short: -er / the -est · long: more / the most · I recommend…",
    examples: [
      {
        en: "This one is cheaper than that one.",
        vi: "Cái này rẻ hơn cái kia.",
      },
      {
        en: "That laptop is more expensive.",
        vi: "Laptop kia đắt hơn.",
      },
      {
        en: "This is the best option for work.",
        vi: "Đây là lựa chọn tốt nhất cho công việc.",
      },
      {
        en: "I recommend the blue one.",
        vi: "Tôi đề xuất cái màu xanh.",
      },
    ],
    vnNote:
      "Short adj: cheap→cheaper→the cheapest; big→bigger. Long: expensive→more expensive→the most expensive. good→better→the best. Không double: more cheaper / the most best. Đề xuất: I recommend + noun.",
    ccq: {
      question: "Chọn comparative đúng cho expensive",
      options: [
        "expensiver",
        "more expensive",
        "most expensive than",
        "more cheaper",
      ],
      answer: "more expensive",
      explanation_vi: "Tính từ dài: more + adjective.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "cheap → comparative",
      options: ["more cheap", "cheaper", "cheapest", "more cheaper"],
      answer: "cheaper",
      explanation_vi: "cheap (short) → cheaper.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: This phone is _____ than that one. (cheap)",
      stem: "This phone is _____ than that one.",
      answer: "cheaper",
      explanation_vi: "comparative + than.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: recommend / I / the / black / one",
      words: ["I", "recommend", "the", "black", "one"],
      answer: "I recommend the black one",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Superlative của good",
      options: ["the goodest", "the most good", "the best", "more best"],
      answer: "the best",
      explanation_vi: "good → better → the best.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: This bag is more cheaper.",
      stem: "This bag is more cheaper.",
      answer: "This bag is cheaper.",
      explanation_vi: "Không double comparative: cheaper, không more cheaper.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Đề xuất option cho team",
      options: [
        "I recommend the cheaper option. The quality is better.",
        "I recommend to the cheaper.",
        "I more prefer expensive.",
        "This is more better option.",
      ],
      answer: "I recommend the cheaper option. The quality is better.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Shop — so sánh hai laptop",
        context_vi: "Linh hỏi shop assistant về giá và chất lượng.",
        lines: [
          {
            id: "d1-1",
            speaker: "Linh",
            text: "Which laptop is cheaper?",
            translation_vi: "Laptop nào rẻ hơn?",
          },
          {
            id: "d1-2",
            speaker: "Clerk",
            text: "This one is cheaper. That one is more expensive.",
            translation_vi: "Cái này rẻ hơn. Cái kia đắt hơn.",
          },
          {
            id: "d1-3",
            speaker: "Linh",
            text: "Is the expensive one better quality?",
            translation_vi: "Cái đắt có chất lượng tốt hơn không?",
          },
          {
            id: "d1-4",
            speaker: "Clerk",
            text: "Yes. It has a bigger screen. I recommend that one for work.",
            translation_vi:
              "Có. Màn hình to hơn. Tôi đề xuất cái đó cho công việc.",
          },
          {
            id: "d1-5",
            speaker: "Linh",
            text: "OK. What is the cheapest option?",
            translation_vi: "OK. Lựa chọn rẻ nhất là gì?",
          },
          {
            id: "d1-6",
            speaker: "Clerk",
            text: "The cheapest is this small one. But the best for you is the blue one.",
            translation_vi:
              "Rẻ nhất là cái nhỏ này. Nhưng tốt nhất cho bạn là cái xanh.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Office — chọn vendor / tool",
        context_vi: "Sam và Linh chọn tool cho team.",
        lines: [
          {
            id: "d2-1",
            speaker: "Sam",
            text: "We have three options. Which is better?",
            translation_vi: "Tụi mình có ba lựa chọn. Cái nào tốt hơn?",
          },
          {
            id: "d2-2",
            speaker: "Linh",
            text: "Plan A is cheaper. Plan B has better quality.",
            translation_vi: "Plan A rẻ hơn. Plan B chất lượng tốt hơn.",
          },
          {
            id: "d2-3",
            speaker: "Sam",
            text: "I prefer Plan B. What do you recommend?",
            translation_vi: "Mình nghiêng Plan B. Bạn đề xuất gì?",
          },
          {
            id: "d2-4",
            speaker: "Linh",
            text: "I recommend Plan B. It's the best option for our team.",
            translation_vi:
              "Mình đề xuất Plan B. Đó là lựa chọn tốt nhất cho team.",
          },
          {
            id: "d2-5",
            speaker: "Sam",
            text: "Great. Plan C is the most expensive — we don't need it.",
            translation_vi:
              "Tuyệt. Plan C đắt nhất — tụi mình không cần.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "This one is cheaper than that one",
        options: [
          "This one is cheaper than that one",
          "This one is more cheap than that",
          "This one is the cheapest yesterday",
          "This one is more better",
        ],
        answer: "This one is cheaper than that one",
      },
      {
        id: "lac2",
        audio_text: "I recommend the blue one",
        options: [
          "I recommend the blue one",
          "I recommend to blue one",
          "I more prefer the blue",
          "I recommended blue tomorrow",
        ],
        answer: "I recommend the blue one",
      },
      {
        id: "lac3",
        audio_text: "That laptop is more expensive",
        options: [
          "That laptop is more expensive",
          "That laptop is expensiver",
          "That laptop is the most cheap",
          "That laptop is more cheaper",
        ],
        answer: "That laptop is more expensive",
      },
      {
        id: "lac4",
        audio_text: "This is the best option for work",
        options: [
          "This is the best option for work",
          "This is more best option for work",
          "This is the goodest option",
          "This is betterest option for work",
        ],
        answer: "This is the best option for work",
      },
      {
        id: "lac5",
        audio_text: "I prefer the cheaper option",
        options: [
          "I prefer the cheaper option",
          "I more prefer the cheap option",
          "I preferred the cheapest yesterday only",
          "I prefer more cheaper option",
        ],
        answer: "I prefer the cheaper option",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "This one is cheaper than that one.",
        vi: "Cái này rẻ hơn cái kia.",
      },
      {
        en: "That one is more expensive.",
        vi: "Cái kia đắt hơn.",
      },
      {
        en: "This is the best option.",
        vi: "Đây là lựa chọn tốt nhất.",
      },
      {
        en: "I recommend the blue one.",
        vi: "Mình đề xuất cái màu xanh.",
      },
      {
        en: "I prefer the cheaper option.",
        vi: "Mình thích lựa chọn rẻ hơn.",
      },
      {
        en: "The quality is better here.",
        vi: "Chất lượng ở đây tốt hơn.",
      },
      {
        en: "What is the cheapest plan?",
        vi: "Gói nào rẻ nhất?",
      },
      {
        en: "It has a bigger screen.",
        vi: "Nó có màn hình to hơn.",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Chọn 2–3 option (shop laptop hoặc office plan). Nói 5–7 câu: ≥2 comparative (cheaper/better/more expensive…) + ≥1 superlative (the best / the cheapest) + I recommend… hoặc I prefer… + lý do ngắn (quality / screen / team).",
    successCriteria_vi: [
      "≥2 comparative đúng form (-er / more + adj)",
      "≥1 superlative (the best / the cheapest / the most…)",
      "Có I recommend… hoặc I prefer…",
      "Có than hoặc so sánh rõ 2 option",
    ],
    scaffold_en: [
      "This one is cheaper / better / bigger…",
      "That one is more expensive…",
      "This is the best / the cheapest option…",
      "I recommend… / I prefer…",
      "The quality is better because…",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "This bag is _____ than that bag. (cheap)",
        options: ["cheaper", "more cheap", "cheapest", "more cheaper"],
        answer: "cheaper",
        explanation_vi: "short adj → -er + than.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "This phone is _____ than my old phone.",
        options: [
          "more expensive",
          "expensiver",
          "most expensive",
          "more cheaper",
        ],
        answer: "more expensive",
      },
      {
        id: "q3",
        type: "true-false",
        question: "This is more better. là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: This is better. (không more better)",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Superlative — chọn câu đúng:",
        options: [
          "This is the best option for our team.",
          "This is the most best option.",
          "This is bestest option.",
          "This is more the best.",
        ],
        answer: "This is the best option for our team.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I _____ the black one. (recommend)",
        answer: "recommend",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Đề xuất tự nhiên nhất:",
        options: [
          "I recommend Plan B. It's better quality.",
          "I recommend to Plan B more.",
          "I more prefer Plan B cheap.",
          "Plan B is more better quality.",
        ],
        answer: "I recommend Plan B. It's better quality.",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-02) Plan: I _____ going to finish the report.",
        options: ["am", "is", "are", "be"],
        answer: "am",
        explanation_vi: "I'm / I am going to…",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a2-01) Yesterday I _____ to a café.",
        options: ["go", "went", "going", "goes"],
        answer: "went",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-07) How much _____ this bag?",
        options: ["is", "are", "do", "did"],
        answer: "is",
        explanation_vi: "How much is + singular?",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "than /ðən/ · -er /ə/",
    description_vi:
      "than trong nói nhanh hay /ðən/ (nhẹ), không than rõ từng chữ. comparative -er = /ə/ (cheaper /ˈtʃiːpə/). the best: the trước best có thể /ðə/.",
    examples: [
      {
        word: "cheaper than",
        ipa: "/ˈtʃiːpə ðən/",
        tip_vi: "than yếu — không TH-AN mạnh kiểu đọc chữ.",
      },
      {
        word: "better",
        ipa: "/ˈbetə/",
        tip_vi: "tt giữa: /t/ nhẹ, không betterrr kéo dài.",
      },
      {
        word: "recommend",
        ipa: "/ˌrekəˈmend/",
        tip_vi: "Nhấn -mend; re- nhẹ.",
      },
    ],
  },
};
