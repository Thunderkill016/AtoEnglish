import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — health & feelings: How are you / I feel… / I have a…
 * Core: How are you? · I feel… · I have a headache · cold · fever ·
 * stomachache · tired · happy · stressed · better · rest · medicine
 * Spiral: a1-10 can/can't + a1-09 places + earlier A1 can-dos.
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA111: LessonSpec = {
  id: "l-a1-11",
  phase: "P1",
  cefr: "A1",
  title_vi: "Sức khỏe & cảm xúc",
  estimatedMin: 35,
  canDo: [
    "Hỏi/đáp How are you? / How are you feeling?",
    "Mô tả triệu chứng: I have a headache / a cold / a fever",
    "Nói cảm xúc: I feel tired / happy / stressed; I feel better",
  ],
  situation:
    "Bạn không khỏe: gọi cho giáo viên / đồng nghiệp / bạn bè — I have a fever and a headache; I feel very tired. Hoặc chia sẻ cảm xúc trước kỳ thi: I feel stressed. Cần phân biệt have + illness vs feel + adjective.",
  culturalNote_vi:
    "Người Anh hay hỏi How are you feeling? khi lo về sức khỏe (không chỉ How are you? xã giao). Bệnh/triệu chứng: have a + noun (I have a headache). Cảm xúc/trạng thái: feel + adj (I feel tired). Không: I feel a headache / I have tired.",
  jobAngle: "Call in sick / tell HR or team: I have a cold; I feel tired; I need to rest",
  lexis: [
    {
      id: "v1",
      word: "How are you?",
      phonetic: "/haʊ ɑː juː/",
      meaning_vi: "Bạn khỏe không? / Bạn thế nào?",
      example_en: "Hi! How are you today?",
      l1_note_vi:
        "Xã giao: thường đáp I'm fine, thanks. Hỏi thật về sức khỏe: How are you feeling?",
    },
    {
      id: "v2",
      word: "I feel…",
      phonetic: "/aɪ fiːl/",
      meaning_vi: "Tôi cảm thấy…",
      example_en: "I feel tired today.",
      l1_note_vi:
        "feel + tính từ (tired, happy). Không: I feel a headache / I feel sadly.",
    },
    {
      id: "v3",
      word: "headache",
      phonetic: "/ˈhedeɪk/",
      meaning_vi: "đau đầu",
      example_en: "I have a headache.",
      l1_note_vi:
        "have a headache — cần a. Không: I have headache / I feel a headache.",
    },
    {
      id: "v4",
      word: "cold",
      phonetic: "/kəʊld/",
      meaning_vi: "cảm lạnh",
      example_en: "He has a cold.",
      l1_note_vi:
        "have a cold = bị cảm. feel cold = cảm thấy lạnh (khác nghĩa).",
    },
    {
      id: "v5",
      word: "fever",
      phonetic: "/ˈfiːvə/",
      meaning_vi: "sốt",
      example_en: "She has a fever.",
      l1_note_vi:
        "have a fever — cần a. Không: have fever (thiếu mạo từ).",
    },
    {
      id: "v6",
      word: "stomachache",
      phonetic: "/ˈstʌməkeɪk/",
      meaning_vi: "đau bụng",
      example_en: "I have a stomachache.",
      l1_note_vi:
        "stomach: ch = /k/. have a stomachache — có a.",
    },
    {
      id: "v7",
      word: "tired",
      phonetic: "/ˈtaɪəd/",
      meaning_vi: "mệt mỏi",
      example_en: "I feel tired after work.",
      l1_note_vi:
        "feel/look tired. ≠ bored (chán). I'm boring = tôi nhàm chán (sai khi muốn nói mệt).",
    },
    {
      id: "v8",
      word: "happy",
      phonetic: "/ˈhæpi/",
      meaning_vi: "vui / hạnh phúc",
      example_en: "I feel happy today.",
      l1_note_vi:
        "happy about/with something. Không: happy of.",
    },
    {
      id: "v9",
      word: "stressed",
      phonetic: "/strest/",
      meaning_vi: "căng thẳng",
      example_en: "I feel stressed about my exam.",
      l1_note_vi:
        "feel stressed. Âm cuối /t/ — đừng bỏ: /strest/ không chỉ /stres/.",
    },
    {
      id: "v10",
      word: "better",
      phonetic: "/ˈbetə/",
      meaning_vi: "khỏe hơn / tốt hơn",
      example_en: "I feel better today, thank you.",
      l1_note_vi:
        "feel better / get better. So sánh của good — không gooder / more good.",
    },
    {
      id: "v11",
      word: "rest",
      phonetic: "/rest/",
      meaning_vi: "nghỉ ngơi",
      example_en: "You should rest when you are sick.",
      l1_note_vi:
        "rest (V/N) = nghỉ. the rest = phần còn lại — hai nghĩa khác nhau.",
    },
    {
      id: "v12",
      word: "medicine",
      phonetic: "/ˈmedsən/",
      meaning_vi: "thuốc",
      example_en: "I'm taking medicine for my headache.",
      l1_note_vi:
        "take medicine. Nói nhanh thường 2 âm: MED-sin.",
    },
  ],
  grammar: {
    title: "I have… / I feel… — sức khỏe & cảm xúc",
    rule: "S + have/has + a + illness | S + feel(s) + adjective",
    examples: [
      { en: "I have a headache.", vi: "Tôi bị đau đầu." },
      { en: "She has a cold.", vi: "Cô ấy bị cảm lạnh." },
      { en: "I feel tired today.", vi: "Hôm nay tôi cảm thấy mệt." },
      { en: "He feels happy after work.", vi: "Anh ấy cảm thấy vui sau giờ làm." },
      { en: "How are you feeling?", vi: "Bạn cảm thấy thế nào?" },
    ],
    vnNote:
      "have/has + danh từ bệnh (a headache, a fever). feel/feels + tính từ (tired, happy). She has / She feels (thêm -s). Không: I feel a headache; I have tired.",
    ccq: {
      question: "Câu nào đúng với chủ ngữ She?",
      options: [
        "She has a cold and feels tired.",
        "She have a cold.",
        "She feel tired.",
        "She have cold and feel tired.",
      ],
      answer: "She has a cold and feels tired.",
      explanation_vi: "She → has / feels (ngôi 3 số ít).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Câu đúng với She",
      options: [
        "She has a headache.",
        "She have a headache.",
        "She having a headache.",
        "She is have a headache.",
      ],
      answer: "She has a headache.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: I _____ very tired today. (feel / have / has)",
      stem: "I _____ very tired today.",
      answer: "feel",
      explanation_vi: "feel + tính từ cảm xúc.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: a / I / headache / have",
      words: ["I", "have", "a", "headache"],
      answer: "I have a headache",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Cảm xúc — chọn đúng",
      options: [
        "I feel stressed.",
        "I have stressed.",
        "I feel a stressed.",
        "I am have stressed.",
      ],
      answer: "I feel stressed.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I have headache and I feel tired.",
      stem: "I have headache and I feel tired.",
      answer: "I have a headache and I feel tired.",
      explanation_vi: "headache cần mạo từ a.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Hỏi sức khỏe — câu phù hợp khi lo lắng",
      options: [
        "How are you feeling?",
        "Where is you feeling?",
        "Can you fever?",
        "I can a cold?",
      ],
      answer: "How are you feeling?",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Xin nghỉ vì ốm",
        context_vi:
          "Minh gọi cho giáo viên / team lead vì không đến lớp/làm được.",
        lines: [
          {
            id: "d1-1",
            speaker: "Teacher",
            text: "Hello, Minh. Are you OK? You're not in class today.",
            translation_vi: "Xin chào Minh. Em ổn không? Hôm nay em không có mặt ở lớp.",
          },
          {
            id: "d1-2",
            speaker: "Minh",
            text: "I'm sorry. I have a fever and a headache.",
            translation_vi: "Em xin lỗi. Em bị sốt và đau đầu.",
          },
          {
            id: "d1-3",
            speaker: "Teacher",
            text: "Oh no! How are you feeling now?",
            translation_vi: "Ôi không! Bây giờ em cảm thấy thế nào?",
          },
          {
            id: "d1-4",
            speaker: "Minh",
            text: "I feel very tired. I'm taking medicine and resting.",
            translation_vi: "Em cảm thấy rất mệt. Em đang uống thuốc và nghỉ ngơi.",
          },
          {
            id: "d1-5",
            speaker: "Teacher",
            text: "That's good. I hope you feel better soon!",
            translation_vi: "Tốt. Mong em sớm khỏe hơn!",
          },
          {
            id: "d1-6",
            speaker: "Minh",
            text: "Thank you. I can't come today but I can study at home.",
            translation_vi: "Cảm ơn. Hôm nay em không đến được nhưng em học ở nhà được.",
          },
          {
            id: "d1-7",
            speaker: "Teacher",
            text: "OK. Rest well. See you when you feel better.",
            translation_vi: "Được. Nghỉ ngơi nhé. Gặp lại khi em khỏe hơn.",
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
          "I have a stomachache",
          "I have a fever",
          "I have a cold",
        ],
        answer: "I have a headache",
      },
      {
        id: "lac2",
        audio_text: "She feels tired",
        options: [
          "She feels tired",
          "She feels happy",
          "He feels tired",
          "She feels stressed",
        ],
        answer: "She feels tired",
      },
      {
        id: "lac3",
        audio_text: "I feel better today",
        options: [
          "I feel better today",
          "I feel worse today",
          "She feels better today",
          "I felt better yesterday",
        ],
        answer: "I feel better today",
      },
      {
        id: "lac4",
        audio_text: "He has a cold and a fever",
        options: [
          "He has a cold and a fever",
          "She has a cold and a fever",
          "He has a cold and a headache",
          "He has a cough and a fever",
        ],
        answer: "He has a cold and a fever",
      },
    ],
  },
  fluency: {
    items: [
      { en: "How are you feeling?", vi: "Bạn cảm thấy thế nào?" },
      { en: "I have a headache.", vi: "Tôi bị đau đầu." },
      { en: "I feel tired today.", vi: "Hôm nay tôi cảm thấy mệt." },
      { en: "She has a cold.", vi: "Cô ấy bị cảm lạnh." },
      { en: "I feel better, thank you.", vi: "Tôi khỏe hơn rồi, cảm ơn." },
      { en: "I feel stressed about my exam.", vi: "Tôi căng thẳng vì kỳ thi." },
      { en: "You should rest.", vi: "Bạn nên nghỉ ngơi." },
      { en: "I'm taking medicine.", vi: "Tôi đang uống thuốc." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Gọi/nhắn xin nghỉ hoặc kể tình trạng sức khỏe. Nói 5–7 câu: How are you? / I have… (1–2 triệu chứng) · I feel… · I'm taking medicine / resting · I feel better / I can't come today · có thể nối can/can't (a1-10) nếu cần.",
    successCriteria_vi: [
      "Có I have + a + illness (ít nhất 1)",
      "Có I feel + adjective (ít nhất 1)",
      "Có hỏi How are you / How are you feeling? hoặc đáp phù hợp",
      "Không lẫn: feel a headache / have tired",
    ],
    scaffold_en: [
      "How are you feeling?",
      "I have a headache.",
      "I have a fever and a cold.",
      "I feel very tired.",
      "I'm taking medicine and resting.",
      "I hope I feel better soon.",
      "I can't come today.",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Câu đúng về bệnh:",
        options: [
          "I have a headache.",
          "I have headache.",
          "I feel a headache.",
          "I am a headache.",
        ],
        answer: "I have a headache.",
        explanation_vi: "have a + illness (danh từ).",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Cảm xúc — chọn đúng:",
        options: [
          "I feel stressed.",
          "I have stressed.",
          "I feel a stressed.",
          "I has tired.",
        ],
        answer: "I feel stressed.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "She feel tired là câu đúng.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Đúng: She feels tired (ngôi 3 số ít).",
      },
      {
        id: "q4",
        type: "mcq",
        question: "She ___ a cold. (điền đúng)",
        options: ["has", "have", "feel", "feels"],
        answer: "has",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I ___ very happy today. (feel / have / has)",
        answer: "feel",
      },
      {
        id: "q6",
        type: "mcq",
        question: "have a cold vs feel cold:",
        options: [
          "have a cold = bị cảm; feel cold = cảm thấy lạnh",
          "cùng một nghĩa",
          "feel cold = bị cảm",
          "have a cold = cảm thấy lạnh",
        ],
        answer: "have a cold = bị cảm; feel cold = cảm thấy lạnh",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-10) Hỏi khả năng:",
        options: [
          "Can you cook?",
          "Do you can cook?",
          "I feel can cook?",
          "Have you a cook?",
        ],
        answer: "Can you cook?",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-09) Hỏi ngân hàng ở đâu:",
        options: [
          "Where is the bank?",
          "I have a bank?",
          "How are you the bank?",
          "I feel the bank?",
        ],
        answer: "Where is the bank?",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-08) Order cà phê lịch sự:",
        options: [
          "I'd like a coffee, please.",
          "I have a coffee feel.",
          "I feel a coffee, please.",
          "Can you headache coffee?",
        ],
        answer: "I'd like a coffee, please.",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn a1-05) Sở thích — like + V-ing:",
        options: [
          "I like swimming.",
          "I feel swimming.",
          "I have a swimming.",
          "I can like swim.",
        ],
        answer: "I like swimming.",
      },
      {
        id: "s5",
        type: "mcq",
        question: "(Ôn a1-01) Chào & tên:",
        options: [
          "Hello! My name is Linh.",
          "I have Hello Linh.",
          "I feel my name.",
          "How are headache Linh?",
        ],
        answer: "Hello! My name is Linh.",
      },
      {
        id: "s6",
        type: "mcq",
        question: "(Ôn a1-04) Thói quen — Present Simple:",
        options: [
          "I work every day.",
          "I feel work every day.",
          "I have a work every days.",
          "I cans work every day.",
        ],
        answer: "I work every day.",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/feəl/ feel · /hæv/ have · ache /eɪk/",
    description_vi:
      "feel /fiːl/ rõ /iː/. have a — nối nhẹ have-a. headache: HEAD + ache /eɪk/ (như cake), không /tʃ/.",
    examples: [
      {
        word: "feel",
        ipa: "/fiːl/",
        tip_vi: "Nguyên âm dài /iː/ — không rút thành /fɪl/.",
      },
      {
        word: "headache",
        ipa: "/ˈhedeɪk/",
        tip_vi: "ache = /eɪk/. Stress âm 1: HEAD-ache.",
      },
      {
        word: "stressed",
        ipa: "/strest/",
        tip_vi: "Giữ /t/ cuối — đừng nuốt thành /stres/.",
      },
    ],
  },
};
