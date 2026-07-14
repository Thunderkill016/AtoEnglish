import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 — light present perfect intro (ever / never / Have you…?).
 * Core: have/has + V3 · ever · never · been to · tried · worked ·
 * Yes, I have / No, I haven't
 * Angle: travel chat + job interview experience questions.
 * Spiral: comparatives (a2-03), future (a2-02), past (a2-01).
 * L1 notes 100% (A2 schema gate). No for/since duration yet (a2-05+).
 */
export const lessonA204: LessonSpec = {
  id: "l-a2-04",
  phase: "P2",
  cefr: "A2",
  title_vi: "Du lịch & trải nghiệm",
  estimatedMin: 40,
  canDo: [
    "Hỏi kinh nghiệm: Have you ever…? (du lịch / công việc)",
    "Trả lời: Yes, I have / No, I haven't + ever / never + V3",
    "Nói trải nghiệm ngắn: I've been to… / I've never tried… / I've worked…",
  ],
  situation:
    "Bạn chat về du lịch với bạn hoặc trả lời phỏng vấn: Have you ever been to Japan? I've never tried sushi. Have you ever worked with a team? Yes, I have. — không chỉ past simple với yesterday.",
  culturalNote_vi:
    "Present perfect (ever/never) hỏi kinh nghiệm sống, không gắn mốc thời gian cụ thể. VN hay dịch «đã từng» → Did you ever…? (sai trong interview chuẩn). Đúng: Have you ever…? + V3. Khi có yesterday/last year → past simple (a2-01). Interview: Have you ever led a team? nghe tự nhiên hơn Did you lead…? nếu không chỉ 1 sự kiện cũ.",
  jobAngle: "Interview — Have you ever worked…? Yes, I have / No, I haven't",
  lexis: [
    {
      id: "v1",
      word: "ever",
      phonetic: "/ˈevə/",
      meaning_vi: "từng / bao giờ (trong câu hỏi)",
      example_en: "Have you ever been to Đà Nẵng?",
      l1_note_vi:
        "ever nằm giữa have và V3: Have you ever…? Không: Have you been ever…?",
    },
    {
      id: "v2",
      word: "never",
      phonetic: "/ˈnevə/",
      meaning_vi: "chưa từng / không bao giờ (kinh nghiệm)",
      example_en: "I've never tried sushi.",
      l1_note_vi:
        "never = not ever. I've never + V3. Không: I never have been (thường đảo: I've never been).",
    },
    {
      id: "v3",
      word: "been to",
      phonetic: "/biːn tuː/",
      meaning_vi: "đã đến (một nơi)",
      example_en: "I've been to Hanoi twice.",
      l1_note_vi:
        "been to + place (đã tới rồi về). gone to = đang ở đó / đi rồi chưa về. Không: I've been in Japan? (khác nuance).",
    },
    {
      id: "v4",
      word: "tried",
      phonetic: "/traɪd/",
      meaning_vi: "đã thử (V3 của try)",
      example_en: "Have you ever tried pho?",
      l1_note_vi:
        "try → tried (V2=V3). Have you ever tried…? Không: Have you ever try…?",
    },
    {
      id: "v5",
      word: "worked",
      phonetic: "/wɜːkt/",
      meaning_vi: "đã làm việc (V3)",
      example_en: "I've worked in a shop.",
      l1_note_vi:
        "work → worked. Interview: Have you ever worked with…? Không: Did you ever work…? (khi hỏi kinh nghiệm chung).",
    },
    {
      id: "v6",
      word: "Yes, I have",
      phonetic: "/jes aɪ hæv/",
      meaning_vi: "Có, tôi đã (trả lời ngắn)",
      example_en: "Have you ever flown? — Yes, I have.",
      l1_note_vi:
        "Short answer: Yes, I have / No, I haven't. Không: Yes, I ever / Yes, I did (khi hỏi bằng Have you…?).",
    },
    {
      id: "v7",
      word: "No, I haven't",
      phonetic: "/nəʊ aɪ ˈhævnt/",
      meaning_vi: "Không, tôi chưa",
      example_en: "Have you ever driven? — No, I haven't.",
      l1_note_vi:
        "haven't = have not. Có thể thêm: No, I haven't. I've never…",
    },
    {
      id: "v8",
      word: "travelled",
      phonetic: "/ˈtrævld/",
      meaning_vi: "đã đi du lịch (V3; US: traveled)",
      example_en: "I've never travelled alone.",
      l1_note_vi:
        "travel → travelled (BrE) / traveled (AmE). I've never travelled… Không: I never travelled yesterday (dùng past).",
    },
    {
      id: "v9",
      word: "abroad",
      phonetic: "/əˈbrɔːd/",
      meaning_vi: "nước ngoài",
      example_en: "Have you ever worked abroad?",
      l1_note_vi:
        "abroad (adv) — không to abroad. go abroad / work abroad. Không: to the abroad.",
    },
    {
      id: "v10",
      word: "experience",
      phonetic: "/ɪkˈspɪəriəns/",
      meaning_vi: "kinh nghiệm / trải nghiệm",
      example_en: "I have some experience with Excel.",
      l1_note_vi:
        "experience (n). work experience. I've had experience with… Không: an experience work → work experience.",
    },
  ],
  grammar: {
    title: "Present perfect light · ever / never",
    rule: "have/has + V3 · ever/never · Have you ever…?",
    examples: [
      {
        en: "Have you ever been to Japan?",
        vi: "Bạn đã từng đến Nhật chưa?",
      },
      {
        en: "I've never tried sushi.",
        vi: "Tôi chưa từng thử sushi.",
      },
      {
        en: "Yes, I have. / No, I haven't.",
        vi: "Có, tôi đã. / Không, tôi chưa.",
      },
      {
        en: "Have you ever worked in a team?",
        vi: "Bạn đã từng làm việc nhóm chưa?",
      },
    ],
    vnNote:
      "have/has + past participle (V3). ever trong câu hỏi; never trong khẳng định phủ định kinh nghiệm. Không dùng với yesterday/last week → past simple. Short answer: Yes, I have / No, I haven't.",
    ccq: {
      question: "Chọn câu hỏi kinh nghiệm đúng",
      options: [
        "Did you ever been to Japan?",
        "Have you ever been to Japan?",
        "Have you ever be to Japan?",
        "Do you ever been to Japan?",
      ],
      answer: "Have you ever been to Japan?",
      explanation_vi: "Have you ever + V3 (been).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Điền: Have you _____ tried coffee? (từng)",
      options: ["ever", "never", "yet", "ago"],
      answer: "ever",
      explanation_vi: "ever trong câu hỏi giữa have và V3.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền V3: I've never _____ (try) bún chả.",
      stem: "I've never _____ bún chả.",
      answer: "tried",
      explanation_vi: "never + V3: tried.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: ever / you / Have / been / abroad / ?",
      words: ["Have", "you", "ever", "been", "abroad"],
      answer: "Have you ever been abroad",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Trả lời ngắn đúng cho: Have you ever flown?",
      options: [
        "Yes, I have.",
        "Yes, I ever.",
        "Yes, I did ever.",
        "Yes, I am.",
      ],
      answer: "Yes, I have.",
      explanation_vi: "Short answer lặp have, không ever.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I never have been to Sa Pa.",
      stem: "I never have been to Sa Pa.",
      answer: "I've never been to Sa Pa.",
      explanation_vi: "never đứng sau 've / have: I've never been…",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Interview — câu tự nhiên nhất",
      options: [
        "Have you ever worked with foreign clients?",
        "Did you ever worked with foreign clients?",
        "Have you ever work with foreign clients?",
        "Do you ever been work abroad?",
      ],
      answer: "Have you ever worked with foreign clients?",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Travel chat — ever / never",
        context_vi: "Mai và Tom nói về du lịch cuối tuần.",
        lines: [
          {
            id: "d1-1",
            speaker: "Tom",
            text: "Have you ever been to Da Lat?",
            translation_vi: "Bạn đã từng đến Đà Lạt chưa?",
          },
          {
            id: "d1-2",
            speaker: "Mai",
            text: "Yes, I have. I've been there twice.",
            translation_vi: "Có. Mình đã đến đó hai lần.",
          },
          {
            id: "d1-3",
            speaker: "Tom",
            text: "Nice! Have you ever tried the strawberry jam there?",
            translation_vi: "Hay! Bạn đã từng thử mứt dâu ở đó chưa?",
          },
          {
            id: "d1-4",
            speaker: "Mai",
            text: "No, I haven't. I've never tried it.",
            translation_vi: "Chưa. Mình chưa từng thử.",
          },
          {
            id: "d1-5",
            speaker: "Tom",
            text: "I've never travelled alone. Have you?",
            translation_vi: "Mình chưa từng đi một mình. Còn bạn?",
          },
          {
            id: "d1-6",
            speaker: "Mai",
            text: "Yes, I have. It was a great experience.",
            translation_vi: "Có. Đó là trải nghiệm tuyệt.",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Job interview — experience",
        context_vi: "Interviewer hỏi Linh về kinh nghiệm.",
        lines: [
          {
            id: "d2-1",
            speaker: "Interviewer",
            text: "Have you ever worked in a team?",
            translation_vi: "Bạn đã từng làm việc nhóm chưa?",
          },
          {
            id: "d2-2",
            speaker: "Linh",
            text: "Yes, I have. I've worked on three projects.",
            translation_vi: "Có ạ. Em đã làm ba dự án.",
          },
          {
            id: "d2-3",
            speaker: "Interviewer",
            text: "Have you ever worked abroad?",
            translation_vi: "Bạn đã từng làm việc ở nước ngoài chưa?",
          },
          {
            id: "d2-4",
            speaker: "Linh",
            text: "No, I haven't. I've never worked abroad.",
            translation_vi: "Chưa ạ. Em chưa từng làm ở nước ngoài.",
          },
          {
            id: "d2-5",
            speaker: "Interviewer",
            text: "OK. Do you have experience with Excel?",
            translation_vi: "OK. Bạn có kinh nghiệm Excel không?",
          },
          {
            id: "d2-6",
            speaker: "Linh",
            text: "Yes. I've used Excel for reports.",
            translation_vi: "Có. Em đã dùng Excel cho báo cáo.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "Have you ever been to Japan",
        options: [
          "Have you ever been to Japan",
          "Did you ever been to Japan",
          "Have you ever be to Japan",
          "Do you ever been to Japan",
        ],
        answer: "Have you ever been to Japan",
      },
      {
        id: "lac2",
        audio_text: "I've never tried sushi",
        options: [
          "I've never tried sushi",
          "I never have tried sushi",
          "I've never try sushi",
          "I didn't never try sushi",
        ],
        answer: "I've never tried sushi",
      },
      {
        id: "lac3",
        audio_text: "Yes, I have",
        options: [
          "Yes, I have",
          "Yes, I ever",
          "Yes, I did ever",
          "Yes, I am have",
        ],
        answer: "Yes, I have",
      },
      {
        id: "lac4",
        audio_text: "Have you ever worked abroad",
        options: [
          "Have you ever worked abroad",
          "Have you ever work abroad",
          "Did you ever worked abroad",
          "Have you ever working abroad",
        ],
        answer: "Have you ever worked abroad",
      },
      {
        id: "lac5",
        audio_text: "No, I haven't",
        options: [
          "No, I haven't",
          "No, I don't have ever",
          "No, I never haven't",
          "No, I didn't have",
        ],
        answer: "No, I haven't",
      },
    ],
  },
  fluency: {
    items: [
      {
        en: "Have you ever been to Da Lat?",
        vi: "Bạn đã từng đến Đà Lạt chưa?",
      },
      {
        en: "I've never tried sushi.",
        vi: "Mình chưa từng thử sushi.",
      },
      {
        en: "Yes, I have.",
        vi: "Có, mình đã.",
      },
      {
        en: "No, I haven't.",
        vi: "Không, mình chưa.",
      },
      {
        en: "Have you ever worked in a team?",
        vi: "Bạn đã từng làm việc nhóm chưa?",
      },
      {
        en: "I've been to Hanoi twice.",
        vi: "Mình đã đến Hà Nội hai lần.",
      },
      {
        en: "I've never travelled alone.",
        vi: "Mình chưa từng đi du lịch một mình.",
      },
      {
        en: "Have you ever worked abroad?",
        vi: "Bạn đã từng làm việc ở nước ngoài chưa?",
      },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Chọn travel chat hoặc job interview. Nói 5–7 câu: ≥2 câu Have you ever…? (hoặc trả lời) + ≥1 ever hoặc never + ≥1 short answer (Yes, I have / No, I haven't) + 1–2 trải nghiệm (been to / tried / worked).",
    successCriteria_vi: [
      "≥1 Have you ever…? + V3 đúng",
      "≥1 ever hoặc never đúng vị trí",
      "Có Yes, I have hoặc No, I haven't",
      "Không gắn yesterday/last year với present perfect",
    ],
    scaffold_en: [
      "Have you ever been to…?",
      "I've never tried…",
      "Yes, I have. / No, I haven't.",
      "I've worked… / I've been to…",
      "It was a great experience.",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Have you _____ been to Hue?",
        options: ["ever", "never", "ago", "yesterday"],
        answer: "ever",
        explanation_vi: "ever trong câu hỏi present perfect.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "I've _____ tried bún bò. (chưa từng)",
        options: ["never", "ever", "yet not", "didn't"],
        answer: "never",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Did you ever been to Japan? là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: Have you ever been to Japan?",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Short answer đúng:",
        options: [
          "Yes, I have.",
          "Yes, I ever.",
          "Yes, I did have ever.",
          "Yes, I'm.",
        ],
        answer: "Yes, I have.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I've never _____ sushi. (try → V3)",
        answer: "tried",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Interview — chọn câu đúng:",
        options: [
          "Have you ever worked with a big team?",
          "Have you ever work with a big team?",
          "Did you ever worked with a big team?",
          "Do you ever been work with a team?",
        ],
        answer: "Have you ever worked with a big team?",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a2-03) This bag is _____ than that one.",
        options: ["cheaper", "more cheap", "cheapest", "more cheaper"],
        answer: "cheaper",
        explanation_vi: "short adj → -er.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a2-02) I _____ going to finish this today.",
        options: ["am", "is", "are", "be"],
        answer: "am",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a2-01) Yesterday I _____ to a café.",
        options: ["go", "went", "going", "goes"],
        answer: "went",
        explanation_vi: "past simple + yesterday.",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "have /həv/ · I've /aɪv/",
    description_vi:
      "have trong present perfect thường yếu /həv/ hoặc 've /v/. I've never = /aɪv ˈnevə/. ever /ˈevə/ — e ngắn, không ee-ver. been /bɪn/ (nói nhanh) hoặc /biːn/.",
    examples: [
      {
        word: "Have you ever",
        ipa: "/həv ju ˈevə/",
        tip_vi: "Have yếu; nhấn ever.",
      },
      {
        word: "I've never",
        ipa: "/aɪv ˈnevə/",
        tip_vi: "I've dính; never nhấn đầu.",
      },
      {
        word: "been to",
        ipa: "/bɪn tuː/",
        tip_vi: "been thường /bɪn/ trong nói nhanh.",
      },
    ],
  },
};
