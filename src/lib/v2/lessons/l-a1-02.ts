import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — personal info survival: age, job, phone, email.
 * Spiral from l-a1-01 (greetings / name / from) + P0 numbers.
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA102: LessonSpec = {
  id: "l-a1-02",
  phase: "P1",
  cefr: "A1",
  title_vi: "Thông tin cá nhân",
  estimatedMin: 35,
  canDo: [
    "Nói tuổi: I'm … years old / How old are you?",
    "Nói nghề: I'm a teacher / What do you do?",
    "Cho số điện thoại và email đơn giản khi được hỏi",
  ],
  situation:
    "Bạn điền form HR ngày đầu và gặp đồng nghiệp hỏi tuổi, nghề, số điện thoại, email. Cần trả lời ngắn, rõ, và hỏi lại lịch sự — không cần kể dài.",
  culturalNote_vi:
    "Ở nhiều nơi phương Tây, hỏi How old are you? với đồng nghiệp mới có thể hơi riêng tư; trong form HR hoặc lớp học thì bình thường. What do you do? = nghề nghiệp, không phải «bạn đang làm gì ngay bây giờ». Phone number đọc từng số hoặc nhóm 2–3 số; email: at = @, dot = dấu chấm.",
  jobAngle: "HR onboarding form + small talk with new teammate",
  lexis: [
    {
      id: "v1",
      word: "How old are you?",
      phonetic: "/haʊ oʊld ɑːr juː/",
      meaning_vi: "Bạn bao nhiêu tuổi?",
      example_en: "How old are you?",
      l1_note_vi:
        "Cố định How old are you? Không: How many years you? (lỗi dịch từng chữ từ tiếng Việt).",
    },
    {
      id: "v2",
      word: "years old",
      phonetic: "/jɪəz oʊld/",
      meaning_vi: "tuổi (… tuổi)",
      example_en: "I'm 28 years old.",
      l1_note_vi:
        "I'm + số + years old. Không: I have 28 years (lỗi kiểu Romance/VN dịch «có 28 tuổi»).",
    },
    {
      id: "v3",
      word: "What do you do?",
      phonetic: "/wɒt duː juː duː/",
      meaning_vi: "Bạn làm nghề gì?",
      example_en: "What do you do?",
      l1_note_vi:
        "Hỏi nghề. Trả lời: I'm a teacher. Không nhầm với What are you doing? (đang làm gì lúc này).",
    },
    {
      id: "v4",
      word: "I'm a",
      phonetic: "/aɪm ə/",
      meaning_vi: "tôi là một (nghề)",
      example_en: "I'm a teacher.",
      l1_note_vi:
        "I'm a + nghề (nguyên âm đầu: a). I'm an engineer (an trước nguyên âm). Đừng bỏ a/an.",
    },
    {
      id: "v5",
      word: "teacher",
      phonetic: "/ˈtiːtʃər/",
      meaning_vi: "giáo viên",
      example_en: "I'm a teacher.",
      l1_note_vi:
        "Nghề phổ biến trong bài. I'm a teacher — có a. Âm ch /tʃ/ không phải «ti-chơ» tách cứng.",
    },
    {
      id: "v6",
      word: "engineer",
      phonetic: "/ˌendʒɪˈnɪər/",
      meaning_vi: "kỹ sư",
      example_en: "I'm an engineer.",
      l1_note_vi:
        "I'm an engineer (an vì e nguyên âm). Trọng âm cuối: engiNEER — không engi-neer đều.",
    },
    {
      id: "v7",
      word: "student",
      phonetic: "/ˈstjuːdnt/",
      meaning_vi: "học sinh / sinh viên",
      example_en: "I'm a student.",
      l1_note_vi:
        "I'm a student OK cho cả HS và SV. Không: I am student (thiếu a).",
    },
    {
      id: "v8",
      word: "phone number",
      phonetic: "/fəʊn ˈnʌmbər/",
      meaning_vi: "số điện thoại",
      example_en: "What's your phone number?",
      l1_note_vi:
        "phone number = số ĐT. My phone number is… Đọc số: zero/oh cho 0; double 2 = 22.",
    },
    {
      id: "v9",
      word: "email",
      phonetic: "/ˈiːmeɪl/",
      meaning_vi: "thư điện tử / địa chỉ email",
      example_en: "My email is linh@work.com.",
      l1_note_vi:
        "email (một từ). @ = at; . = dot. My email is… Không: My email address is mail (thiếu @domain).",
    },
    {
      id: "v10",
      word: "What's your",
      phonetic: "/wɒts jɔːr/",
      meaning_vi: "… của bạn là gì?",
      example_en: "What's your email?",
      l1_note_vi:
        "What's = What is. What's your phone number? / What's your email? Lịch sự hơn You email what?",
    },
  ],
  grammar: {
    title: "I'm a… / I'm … years old",
    rule: "I + 'm + a/an + job · I + 'm + number + years old",
    examples: [
      { en: "I'm a teacher.", vi: "Tôi là giáo viên." },
      { en: "I'm an engineer.", vi: "Tôi là kỹ sư." },
      { en: "I'm 28 years old.", vi: "Tôi 28 tuổi." },
      { en: "My phone number is 0901 234 567.", vi: "Số điện thoại của tôi là…" },
    ],
    vnNote:
      "Tiếng Việt không có a/an và không dùng BE như EN. Lỗi hay gặp: I teacher / I have 28 years / I from… — luôn cần I'm + a/an hoặc I'm + số + years old.",
    ccq: {
      question: "Câu nào đúng khi nói nghề?",
      options: [
        "I teacher",
        "I'm a teacher",
        "I am teacher",
        "I'm teacher a",
      ],
      answer: "I'm a teacher",
      explanation_vi: "I'm a + job (có a/an).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Hỏi tuổi đồng nghiệp lịch sự",
      options: [
        "How old are you?",
        "How many years you have?",
        "You age?",
        "What age you?",
      ],
      answer: "How old are you?",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: I'm 25 _____ old.",
      stem: "I'm 25 _____ old.",
      answer: "years",
      explanation_vi: "I'm + số + years old.",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: a / teacher / I'm",
      words: ["I'm", "a", "teacher"],
      answer: "I'm a teacher",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "What do you do? → đáp phù hợp",
      options: [
        "I'm an engineer.",
        "I'm 30 years old.",
        "I'm fine, thanks.",
        "I'm from Hanoi.",
      ],
      answer: "I'm an engineer.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: I have 28 years.",
      stem: "I have 28 years.",
      answer: "I'm 28 years old.",
      explanation_vi: "Không dùng have cho tuổi trong EN chuẩn này.",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Hỏi email đồng nghiệp",
      options: [
        "What's your email?",
        "You email what?",
        "Where is email?",
        "How old is email?",
      ],
      answer: "What's your email?",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Form HR + gặp teammate",
        context_vi: "Linh điền form và nói chuyện với Alex.",
        lines: [
          {
            id: "d1-1",
            speaker: "Alex",
            text: "Hi Linh! What do you do?",
            translation_vi: "Chào Linh! Bạn làm nghề gì?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "I'm a teacher. And you?",
            translation_vi: "Mình là giáo viên. Còn bạn?",
          },
          {
            id: "d1-3",
            speaker: "Alex",
            text: "I'm an engineer. How old are you?",
            translation_vi: "Mình là kỹ sư. Bạn bao nhiêu tuổi?",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "I'm 28 years old.",
            translation_vi: "Mình 28 tuổi.",
          },
          {
            id: "d1-5",
            speaker: "Alex",
            text: "What's your phone number for the form?",
            translation_vi: "Số điện thoại của bạn để điền form là gì?",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "My phone number is 0901 234 567. My email is linh@work.com.",
            translation_vi:
              "Số điện thoại của mình là 0901 234 567. Email là linh@work.com.",
          },
          {
            id: "d1-7",
            speaker: "Alex",
            text: "Great, thanks!",
            translation_vi: "Tuyệt, cảm ơn!",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "How old are you?",
        options: [
          "How old are you?",
          "How are you?",
          "Who are you?",
          "Where are you?",
        ],
        answer: "How old are you?",
      },
      {
        id: "lac2",
        audio_text: "I'm a teacher",
        options: [
          "I'm a teacher",
          "I'm fine, thank you",
          "I'm from Vietnam",
          "I'm 28 years old",
        ],
        answer: "I'm a teacher",
      },
      {
        id: "lac3",
        audio_text: "What do you do?",
        options: [
          "What do you do?",
          "What are you doing?",
          "Where do you go?",
          "How do you do?",
        ],
        answer: "What do you do?",
      },
      {
        id: "lac4",
        audio_text: "What's your email?",
        options: [
          "What's your email?",
          "What's your name?",
          "What's your age?",
          "Where's your email?",
        ],
        answer: "What's your email?",
      },
    ],
  },
  fluency: {
    items: [
      { en: "How old are you?", vi: "Bạn bao nhiêu tuổi?" },
      { en: "I'm 28 years old.", vi: "Mình 28 tuổi." },
      { en: "What do you do?", vi: "Bạn làm nghề gì?" },
      { en: "I'm a teacher.", vi: "Mình là giáo viên." },
      { en: "I'm an engineer.", vi: "Mình là kỹ sư." },
      { en: "What's your phone number?", vi: "Số điện thoại của bạn là gì?" },
      { en: "My email is linh@work.com.", vi: "Email của mình là linh@work.com." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Giả sử Alex hỏi bạn. Nói 5–7 câu: chào ngắn → nghề → tuổi → số ĐT (bịa được) → email (bịa được) → cảm ơn/tạm biệt.",
    successCriteria_vi: [
      "Nói được nghề (I'm a/an…)",
      "Nói được tuổi (I'm … years old)",
      "Có phone number hoặc email",
      "Dùng được ít nhất một câu hỏi (What do you do? / How old… / What's your…)",
    ],
    scaffold_en: [
      "Hi! I'm a…",
      "I'm … years old.",
      "My phone number is…",
      "My email is…",
      "What do you do?",
      "Nice to meet you. Thanks!",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Câu nói tuổi đúng:",
        options: [
          "I'm 30 years old.",
          "I have 30 years.",
          "I am 30 year old.",
          "My years is 30.",
        ],
        answer: "I'm 30 years old.",
        explanation_vi: "I'm + số + years old.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "What do you do? →",
        options: [
          "I'm a student.",
          "I'm fine.",
          "I'm from Da Nang.",
          "See you later.",
        ],
        answer: "I'm a student.",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I have 25 years là cách nói tuổi chuẩn trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Dùng I'm 25 years old.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Trước engineer dùng:",
        options: ["a", "an", "the", "— (không cần)"],
        answer: "an",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I'm 22 _____ old. (years / year / olds)",
        answer: "years",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Hỏi số điện thoại:",
        options: [
          "What's your phone number?",
          "How old is your phone?",
          "Where is phone?",
          "You phone?",
        ],
        answer: "What's your phone number?",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-01) I'm _____ Vietnam.",
        options: ["from", "for", "form", "of"],
        answer: "from",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn) Nice to meet you dùng khi:",
        options: [
          "Gặp lần đầu",
          "Mỗi ngày với bạn thân",
          "Chỉ khi gọi điện",
          "Khi tạm biệt mãi mãi",
        ],
        answer: "Gặp lần đầu",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "th /θ/ vs t — thirty / three",
    description_vi:
      "Số tuổi hay có th: thirty, three. Lưỡi chạm răng, thổi hơi — không nói tirty / tree.",
    examples: [
      {
        word: "thirty",
        ipa: "/ˈθɜːrti/",
        tip_vi: "th vô thanh + er — không «tớ-ty».",
      },
      {
        word: "three",
        ipa: "/θriː/",
        tip_vi: "Cùng /θ/; khác tree /triː/.",
      },
    ],
  },
};
