import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P2 A2 — first A2 lesson: past simple survival (tell a short past story).
 * Core: yesterday / last week / last night · was/were · did · went · had ·
 * saw · met · worked · What did you do…? / Did you…?
 * Spiral: A1 routines (a1-04), job small talk (a1-12), BE (a1-01).
 * L1 notes 100% (A2 schema gate; task band ≥50% — we ship full).
 */
export const lessonA201: LessonSpec = {
  id: "l-a2-01",
  phase: "P2",
  cefr: "A2",
  title_vi: "Kể chuyện quá khứ",
  estimatedMin: 40,
  canDo: [
    "Kể 4–6 câu về hôm qua / tuần trước bằng past simple",
    "Hỏi–đáp What did you do…? / Did you…? với câu trả lời ngắn",
    "Dùng was/were + went/had/saw/met/worked trong câu sống sót",
  ],
  situation:
    "Coffee chat với đồng nghiệp nước ngoài vào thứ Hai. Họ hỏi: What did you do last weekend? Bạn cần kể ngắn — went to…, met a friend, had coffee, watched a movie — dùng past simple và time markers (yesterday, last night, last week), không chỉ gật đầu.",
  culturalNote_vi:
    "Small talk về weekend rất phổ biến ở văn phòng quốc tế. Người bản ngữ hay trả lời 2–4 câu rồi hỏi lại And you? Past simple = thời điểm đã xong (yesterday/last…). Present perfect (I have been…) để sau — bài này chỉ past simple survival. was (I/he/she/it) vs were (you/we/they): lỗi VN hay gộp was cho tất cả.",
  jobAngle: "Monday coffee chat — What did you do last weekend?",
  lexis: [
    {
      id: "v1",
      word: "yesterday",
      phonetic: "/ˈjestədeɪ/",
      meaning_vi: "hôm qua",
      example_en: "I worked from home yesterday.",
      l1_note_vi:
        "yesterday = hôm qua (không the yesterday). Cùng past simple: I went… yesterday.",
    },
    {
      id: "v2",
      word: "last week",
      phonetic: "/læst wiːk/",
      meaning_vi: "tuần trước",
      example_en: "I met my manager last week.",
      l1_note_vi:
        "last week / last night / last month — không the last week. last weekend = cuối tuần trước.",
    },
    {
      id: "v3",
      word: "last night",
      phonetic: "/læst naɪt/",
      meaning_vi: "tối hôm qua",
      example_en: "I watched a movie last night.",
      l1_note_vi:
        "last night ≠ yesterday night (không chuẩn). Dùng last night.",
    },
    {
      id: "v4",
      word: "went",
      phonetic: "/went/",
      meaning_vi: "đã đi (go → went)",
      example_en: "I went to a café yesterday.",
      l1_note_vi:
        "go → went (bất quy tắc). Không: goed / I go yesterday. went to + place.",
    },
    {
      id: "v5",
      word: "did",
      phonetic: "/dɪd/",
      meaning_vi: "đã làm / trợ động từ quá khứ",
      example_en: "What did you do last weekend?",
      l1_note_vi:
        "Câu hỏi/phủ định: Did you + V1 (không V2). Did you go? không Did you went?",
    },
    {
      id: "v6",
      word: "had",
      phonetic: "/hæd/",
      meaning_vi: "đã có / đã ăn·uống (have → had)",
      example_en: "I had coffee with a friend.",
      l1_note_vi:
        "have → had. had breakfast/lunch/coffee. Không: haved.",
    },
    {
      id: "v7",
      word: "was / were",
      phonetic: "/wɒz/ /wɜːr/",
      meaning_vi: "đã là / đã ở (be quá khứ)",
      example_en: "I was busy. We were at home.",
      l1_note_vi:
        "I/he/she/it was; you/we/they were. Không: I were / You was (lỗi phổ biến).",
    },
    {
      id: "v8",
      word: "saw",
      phonetic: "/sɔː/",
      meaning_vi: "đã thấy / xem (see → saw)",
      example_en: "I saw a good movie last night.",
      l1_note_vi:
        "see → saw → seen. Past simple = saw. Không: seed / I see yesterday.",
    },
    {
      id: "v9",
      word: "met",
      phonetic: "/met/",
      meaning_vi: "đã gặp (meet → met)",
      example_en: "I met a client last week.",
      l1_note_vi:
        "meet → met. met someone (không met with luôn bắt buộc trong EN hàng ngày).",
    },
    {
      id: "v10",
      word: "worked",
      phonetic: "/wɜːrkt/",
      meaning_vi: "đã làm việc (work → worked)",
      example_en: "I worked on a report yesterday.",
      l1_note_vi:
        "Động từ quy tắc: +ed. worked /d/ hoặc /t/ — không work-ed hai âm rõ như VN đọc.",
    },
  ],
  grammar: {
    title: "Past simple — V2 / did + V1",
    rule: "Affirmative: V2 (went/had/worked). Q/Neg: did + V1",
    examples: [
      { en: "I went to the office yesterday.", vi: "Hôm qua tôi đi văn phòng." },
      { en: "What did you do last weekend?", vi: "Cuối tuần trước bạn làm gì?" },
      { en: "I didn't work last Sunday.", vi: "Chủ nhật trước tôi không làm việc." },
      { en: "She was busy. They were free.", vi: "Cô ấy bận. Họ rảnh." },
    ],
    vnNote:
      "Tiếng Việt không chia thì rõ như EN. Đừng: I go yesterday / Did you went? — khẳng định dùng V2; hỏi/phủ định dùng did + nguyên mẫu.",
    ccq: {
      question: "Câu nào đúng?",
      options: [
        "Did you went to the café?",
        "Did you go to the café?",
        "Do you went to the café?",
        "You did went to the café?",
      ],
      answer: "Did you go to the café?",
      explanation_vi: "Did + you + V1 (go), không went.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Chọn câu đúng về hôm qua",
      options: [
        "I go to work yesterday.",
        "I went to work yesterday.",
        "I going to work yesterday.",
        "I did went to work yesterday.",
      ],
      answer: "I went to work yesterday.",
      explanation_vi: "yesterday → past simple V2: went.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: What ___ you do last night?",
      stem: "What _____ you do last night?",
      answer: "did",
      explanation_vi: "Câu hỏi quá khứ: What did you + V1?",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: last / I / a / movie / night / saw",
      words: ["I", "saw", "a", "movie", "last", "night"],
      answer: "I saw a movie last night",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "I / you — chọn was hay were",
      options: ["I were busy.", "I was busy.", "I be busy.", "I am was busy."],
      answer: "I was busy.",
      explanation_vi: "I + was; you/we/they + were.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: Did you went to the meeting?",
      stem: "Did you went to the meeting?",
      answer: "Did you go to the meeting?",
      explanation_vi: "Did + V1: go, không went.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Trả lời: Did you work last Saturday?",
      options: [
        "Yes, I did. I worked in the morning.",
        "Yes, I do. I work yesterday.",
        "Yes, I was. I go to work.",
        "Yes, I went. I working.",
      ],
      answer: "Yes, I did. I worked in the morning.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Coffee chat thứ Hai",
        context_vi: "Alex hỏi Linh về cuối tuần.",
        lines: [
          {
            id: "d1-1",
            speaker: "Alex",
            text: "Hi Linh! What did you do last weekend?",
            translation_vi: "Chào Linh! Cuối tuần trước bạn làm gì?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "I went to a café with a friend. We had coffee.",
            translation_vi: "Mình đi quán cà phê với bạn. Tụi mình uống cà phê.",
          },
          {
            id: "d1-3",
            speaker: "Alex",
            text: "Nice! Did you work on Saturday?",
            translation_vi: "Hay đấy! Thứ Bảy bạn có làm việc không?",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "No, I didn't. I was free. And you?",
            translation_vi: "Không, mình không làm. Mình rảnh. Còn bạn?",
          },
          {
            id: "d1-5",
            speaker: "Alex",
            text: "I met a client last week. Yesterday I worked from home.",
            translation_vi:
              "Tuần trước mình gặp một khách hàng. Hôm qua mình làm việc ở nhà.",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "I saw a movie last night. It was great!",
            translation_vi: "Tối qua mình xem một bộ phim. Hay lắm!",
          },
        ],
      },
      {
        id: "d2",
        title_vi: "Stand-up — update ngắn",
        context_vi: "Team lead hỏi update hôm qua.",
        lines: [
          {
            id: "d2-1",
            speaker: "Sam",
            text: "Linh, what did you do yesterday?",
            translation_vi: "Linh, hôm qua bạn làm gì?",
          },
          {
            id: "d2-2",
            speaker: "Linh",
            text: "I worked on the report. I met the design team.",
            translation_vi: "Mình làm báo cáo. Mình gặp team design.",
          },
          {
            id: "d2-3",
            speaker: "Sam",
            text: "Did you finish it?",
            translation_vi: "Bạn xong chưa?",
          },
          {
            id: "d2-4",
            speaker: "Linh",
            text: "Almost. I was busy, but I had time in the afternoon.",
            translation_vi: "Gần xong. Mình bận, nhưng buổi chiều có thời gian.",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "What did you do last weekend?",
        options: [
          "What did you do last weekend?",
          "What do you do every weekend?",
          "Where did you go last year?",
          "What are you doing now?",
        ],
        answer: "What did you do last weekend?",
      },
      {
        id: "lac2",
        audio_text: "I went to a café yesterday",
        options: [
          "I go to a café every day",
          "I went to a café yesterday",
          "I want a café yesterday",
          "I was a café yesterday",
        ],
        answer: "I went to a café yesterday",
      },
      {
        id: "lac3",
        audio_text: "Did you work last Saturday?",
        options: [
          "Do you work on Saturday?",
          "Did you work last Saturday?",
          "Did you worked last Saturday?",
          "Are you work last Saturday?",
        ],
        answer: "Did you work last Saturday?",
      },
      {
        id: "lac4",
        audio_text: "I saw a movie last night",
        options: [
          "I see a movie last night",
          "I saw a movie last night",
          "I seed a movie last night",
          "I was a movie last night",
        ],
        answer: "I saw a movie last night",
      },
      {
        id: "lac5",
        audio_text: "I was busy yesterday",
        options: [
          "I were busy yesterday",
          "I was busy yesterday",
          "I am busy yesterday",
          "I be busy yesterday",
        ],
        answer: "I was busy yesterday",
      },
    ],
  },
  fluency: {
    items: [
      { en: "What did you do last weekend?", vi: "Cuối tuần trước bạn làm gì?" },
      { en: "I went to a café.", vi: "Mình đi quán cà phê." },
      { en: "I had coffee with a friend.", vi: "Mình uống cà phê với bạn." },
      { en: "I worked yesterday.", vi: "Hôm qua mình làm việc." },
      { en: "I was busy last week.", vi: "Tuần trước mình bận." },
      { en: "I saw a movie last night.", vi: "Tối qua mình xem phim." },
      { en: "No, I didn't.", vi: "Không, mình không." },
      { en: "And you?", vi: "Còn bạn?" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Tưởng tượng Alex hỏi What did you do last weekend? Nói 5–7 câu: time marker + 2–3 hành động (went/had/saw/met/worked) + was/were nếu phù hợp + hỏi lại And you?",
    successCriteria_vi: [
      "Có yesterday / last weekend / last night / last week",
      "≥2 động từ past simple (went, had, saw, met, worked…)",
      "Có was hoặc were nếu mô tả trạng thái",
      "Có hỏi lại hoặc trả lời Did you…? dạng ngắn (Yes, I did / No, I didn't)",
    ],
    scaffold_en: [
      "Last weekend I went to…",
      "I had… with…",
      "I saw / met / worked…",
      "I was free / busy.",
      "And you? What did you do?",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "I _____ to the office yesterday.",
        options: ["go", "went", "going", "goes"],
        answer: "went",
        explanation_vi: "yesterday → V2: went.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "_____ you finish the report last night?",
        options: ["Do", "Did", "Does", "Are"],
        answer: "Did",
        explanation_vi: "Câu hỏi quá khứ: Did + you + V1.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "Did you went? là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: Did you go?",
      },
      {
        id: "q4",
        type: "mcq",
        question: "We _____ at home last night.",
        options: ["was", "were", "is", "be"],
        answer: "were",
        explanation_vi: "we + were.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I ___ a client last week. (meet → past)",
        answer: "met",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Phủ định đúng:",
        options: [
          "I didn't worked yesterday.",
          "I didn't work yesterday.",
          "I not work yesterday.",
          "I don't worked yesterday.",
        ],
        answer: "I didn't work yesterday.",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn A1) Present simple thói quen: I _____ up at seven every day.",
        options: ["get", "got", "getting", "gets"],
        answer: "get",
        explanation_vi: "every day → present; I get up (a1-04).",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn A1) I'm _____ Vietnam.",
        options: ["from", "for", "form", "front"],
        answer: "from",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn) Chọn past simple đúng",
        options: [
          "I work yesterday",
          "I worked yesterday",
          "I working yesterday",
          "I works yesterday",
        ],
        answer: "I worked yesterday",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "-ed endings /t/ /d/ /ɪd/",
    description_vi:
      "worked thường /t/ sau k; played /d/; wanted /ɪd/ sau t/d. Đừng luôn đọc thành -eđ rõ hai âm.",
    examples: [
      { word: "worked", ipa: "/wɜːrkt/", tip_vi: "k + /t/ — một âm cuối." },
      { word: "watched", ipa: "/wɒtʃt/", tip_vi: "ch + /t/." },
      { word: "needed", ipa: "/ˈniːdɪd/", tip_vi: "sau d → thêm /ɪd/." },
    ],
  },
};
