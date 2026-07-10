import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 — family & friends expansion beyond l-a0-05.
 * New: friend / husband·wife / son·daughter / cousin / older·younger /
 * This is my friend… / His·Her name is… / Do you have…?
 * Spiral: a1-01 greetings + a1-02 personal info light.
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA103: LessonSpec = {
  id: "l-a1-03",
  phase: "P1",
  cefr: "A1",
  title_vi: "Gia đình & bạn bè",
  estimatedMin: 35,
  canDo: [
    "Giới thiệu bạn: This is my friend… / His/Her name is…",
    "Nói thành viên mở rộng: husband, wife, son, daughter, cousin",
    "Hỏi–đáp Do you have…? / I have a… (anh chị em, con)",
  ],
  situation:
    "Team lunch: đồng nghiệp nước ngoài xem ảnh trên điện thoại và hỏi về gia đình, bạn bè. Bạn cần chỉ người — This is my friend / wife / son — nói tên họ, và trả lời Do you have a brother? ngắn, rõ, lịch sự.",
  culturalNote_vi:
    "Ở văn phòng phương Tây, hỏi về gia đình thường nhẹ (small talk), không đi sâu chuyện riêng tư lần đầu. friend = bạn (không nhất thiết «bạn thân»); best friend = bạn thân. husband/wife dùng khi đã kết hôn; partner trung tính hơn (A2+). older/younger sister|brother giúp phân chị–em khi tiếng Việt phân biệt rõ.",
  jobAngle: "Team lunch photo small talk — introduce family & friends",
  lexis: [
    {
      id: "v1",
      word: "friend",
      phonetic: "/frend/",
      meaning_vi: "bạn (bè)",
      example_en: "This is my friend.",
      l1_note_vi:
        "friend = bạn; không dùng boyfriend/girlfriend trừ khi thật sự yêu. This is my friend + name.",
    },
    {
      id: "v2",
      word: "best friend",
      phonetic: "/best frend/",
      meaning_vi: "bạn thân",
      example_en: "Mai is my best friend.",
      l1_note_vi:
        "best friend = bạn thân nhất. Không: my best (thiếu friend). Số ít thường một best friend.",
    },
    {
      id: "v3",
      word: "husband",
      phonetic: "/ˈhʌzbənd/",
      meaning_vi: "chồng",
      example_en: "This is my husband.",
      l1_note_vi:
        "husband = chồng (đã kết hôn). Không nhầm husband/wife. Âm /ˈhʌz/ không «hát-bân».",
    },
    {
      id: "v4",
      word: "wife",
      phonetic: "/waɪf/",
      meaning_vi: "vợ",
      example_en: "This is my wife.",
      l1_note_vi:
        "wife = vợ. This is my wife. Không: This is wife (thiếu my).",
    },
    {
      id: "v5",
      word: "son",
      phonetic: "/sʌn/",
      meaning_vi: "con trai",
      example_en: "This is my son.",
      l1_note_vi:
        "son = con trai; sun = mặt trời (cùng âm /sʌn/ — ngữ cảnh phân biệt). This is my son.",
    },
    {
      id: "v6",
      word: "daughter",
      phonetic: "/ˈdɔːtər/",
      meaning_vi: "con gái",
      example_en: "This is my daughter.",
      l1_note_vi:
        "daughter — âm gh /t/ lặng ở cuối nhiều giọng; không «đọt-tơ» cứng. ≠ son.",
    },
    {
      id: "v7",
      word: "cousin",
      phonetic: "/ˈkʌzn/",
      meaning_vi: "anh/chị/em họ",
      example_en: "This is my cousin.",
      l1_note_vi:
        "cousin = họ hàng cùng thế hệ; EN không phân trai/gái trong từ này. Không: cousin brother.",
    },
    {
      id: "v8",
      word: "older / younger",
      phonetic: "/ˈoʊldər/ /ˈjʌŋɡər/",
      meaning_vi: "lớn hơn / nhỏ hơn (tuổi)",
      example_en: "This is my older sister.",
      l1_note_vi:
        "older sister ≈ chị; younger brother ≈ em trai. EN dùng older/younger + sister/brother (ôn a0-05).",
    },
    {
      id: "v9",
      word: "Do you have",
      phonetic: "/duː juː hæv/",
      meaning_vi: "Bạn có … không?",
      example_en: "Do you have a brother?",
      l1_note_vi:
        "Do you have + a/an + người. Không: You have brother? (thiếu Do + a). Have got = biến thể (A2).",
    },
    {
      id: "v10",
      word: "His / Her name is",
      phonetic: "/hɪz/ /hɜːr neɪm ɪz/",
      meaning_vi: "Tên anh ấy / cô ấy là…",
      example_en: "His name is Nam. Her name is Mai.",
      l1_note_vi:
        "His = của nam; Her = của nữ. Không: He name is… / She name is… (thiếu 's hoặc dùng his/her).",
    },
  ],
  grammar: {
    title: "This is my friend… / His·Her name is… / Do you have…?",
    rule: "This is my + person. His/Her name is + name. Do you have + a + person?",
    examples: [
      { en: "This is my friend.", vi: "Đây là bạn tôi." },
      { en: "His name is Nam.", vi: "Tên anh ấy là Nam." },
      { en: "Her name is Mai.", vi: "Tên cô ấy là Mai." },
      { en: "Do you have a brother?", vi: "Bạn có anh/em trai không?" },
      { en: "I have a sister.", vi: "Tôi có một chị/em gái." },
    ],
    vnNote:
      "Giữ is trong This is my…. His/Her + name is (không He name is). Do you have + a + noun — tiếng Việt không có a/an nên hay quên mạo từ.",
    ccq: {
      question: "Câu nào đúng khi giới thiệu bạn nam?",
      options: [
        "This is my friend. His name is Nam.",
        "This my friend. He name is Nam.",
        "This is friend. Her name is Nam.",
        "This is me friend. His name Nam.",
      ],
      answer: "This is my friend. His name is Nam.",
      explanation_vi: "This is my + person; His name is + tên (nam).",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Giới thiệu bạn — câu đúng",
      options: [
        "This is my friend.",
        "This my friend.",
        "This is me friend.",
        "This are my friend.",
      ],
      answer: "This is my friend.",
    },
    {
      id: "c2",
      type: "cloze",
      prompt_vi: "Điền: _____ name is Mai. (bạn nữ)",
      stem: "_____ name is Mai.",
      answer: "Her",
      explanation_vi: "Her name is + tên (nữ).",
    },
    {
      id: "c3",
      type: "scramble",
      prompt_vi: "Sắp xếp: have / a / Do / you / brother",
      words: ["Do", "you", "have", "a", "brother"],
      answer: "Do you have a brother",
    },
    {
      id: "c4",
      type: "mcq",
      prompt_vi: "Do you have a sister? → đáp có",
      options: [
        "Yes, I have a sister.",
        "Yes, I am a sister.",
        "I'm fine, thanks.",
        "I'm from Vietnam.",
      ],
      answer: "Yes, I have a sister.",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: This my friend. He name is Nam.",
      stem: "This my friend. He name is Nam.",
      answer: "This is my friend. His name is Nam.",
      explanation_vi: "Cần is + my; His name is (không He name is).",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "daughter nghĩa là…",
      options: ["con gái", "con trai", "chồng", "vợ"],
      answer: "con gái",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Team lunch — xem ảnh gia đình & bạn",
        context_vi: "Alex và Linh xem ảnh trên điện thoại lúc ăn trưa team.",
        lines: [
          {
            id: "d1-1",
            speaker: "Alex",
            text: "Hi Linh! Is this a photo of your family?",
            translation_vi: "Chào Linh! Đây có phải ảnh gia đình bạn không?",
          },
          {
            id: "d1-2",
            speaker: "Linh",
            text: "Yes. This is my husband. His name is Nam.",
            translation_vi: "Đúng. Đây là chồng mình. Tên anh ấy là Nam.",
          },
          {
            id: "d1-3",
            speaker: "Alex",
            text: "Nice! And who is this?",
            translation_vi: "Hay quá! Còn đây là ai?",
          },
          {
            id: "d1-4",
            speaker: "Linh",
            text: "This is my friend. Her name is Mai. She's my best friend.",
            translation_vi:
              "Đây là bạn mình. Tên cô ấy là Mai. Cô ấy là bạn thân của mình.",
          },
          {
            id: "d1-5",
            speaker: "Alex",
            text: "Do you have a brother or sister?",
            translation_vi: "Bạn có anh chị em không?",
          },
          {
            id: "d1-6",
            speaker: "Linh",
            text: "Yes. I have an older sister and a younger brother.",
            translation_vi: "Có. Mình có một chị và một em trai.",
          },
          {
            id: "d1-7",
            speaker: "Alex",
            text: "Great. Nice to meet your family — in the photo!",
            translation_vi: "Tuyệt. Rất vui được «gặp» gia đình bạn — trong ảnh!",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "This is my friend",
        options: [
          "This is my friend",
          "This my friend",
          "This is my father",
          "This is me friend",
        ],
        answer: "This is my friend",
      },
      {
        id: "lac2",
        audio_text: "His name is Nam",
        options: [
          "His name is Nam",
          "Her name is Nam",
          "He name is Nam",
          "His name Nam",
        ],
        answer: "His name is Nam",
      },
      {
        id: "lac3",
        audio_text: "Do you have a brother?",
        options: [
          "Do you have a brother?",
          "Do you have brother?",
          "You have a brother?",
          "How old are you?",
        ],
        answer: "Do you have a brother?",
      },
      {
        id: "lac4",
        audio_text: "This is my daughter",
        options: [
          "This is my daughter",
          "This is my son",
          "This is my husband",
          "This is my cousin",
        ],
        answer: "This is my daughter",
      },
    ],
  },
  fluency: {
    items: [
      { en: "This is my friend.", vi: "Đây là bạn tôi." },
      { en: "His name is Nam.", vi: "Tên anh ấy là Nam." },
      { en: "Her name is Mai.", vi: "Tên cô ấy là Mai." },
      { en: "This is my husband.", vi: "Đây là chồng tôi." },
      { en: "This is my wife.", vi: "Đây là vợ tôi." },
      { en: "Do you have a brother?", vi: "Bạn có anh/em trai không?" },
      { en: "I have a sister.", vi: "Tôi có một chị/em gái." },
      { en: "She's my best friend.", vi: "Cô ấy là bạn thân của tôi." },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "Giả sử Alex hỏi về ảnh. Nói 5–7 câu: chào ngắn → This is my friend/husband/wife… → His/Her name is… → Do you have…? hoặc I have… → tạm biệt ngắn (Bye / See you).",
    successCriteria_vi: [
      "Có This is my + friend hoặc thành viên (husband/wife/son/daughter…)",
      "Có His name is… hoặc Her name is…",
      "Có Do you have…? hoặc I have a…",
      "Không bỏ is trong This is my…",
    ],
    scaffold_en: [
      "Hi! This is my friend.",
      "His name is… / Her name is…",
      "This is my husband / wife / son / daughter.",
      "Do you have a brother?",
      "I have an older sister.",
      "Nice to meet you. Bye!",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "This ___ my friend.",
        options: ["is", "are", "am", "have"],
        answer: "is",
        explanation_vi: "This is my + person.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "Tên bạn nữ: _____ name is Mai.",
        options: ["Her", "His", "He", "She"],
        answer: "Her",
      },
      {
        id: "q3",
        type: "true-false",
        question: "He name is Nam là câu đúng trong bài này.",
        options: ["True", "False"],
        answer: "False",
        explanation_vi: "Dùng His name is Nam.",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Hỏi có anh/em trai:",
        options: [
          "Do you have a brother?",
          "You have brother?",
          "Are you a brother?",
          "How old is brother?",
        ],
        answer: "Do you have a brother?",
      },
      {
        id: "q5",
        type: "cloze",
        question: "I _____ a sister. (have / has / am)",
        answer: "have",
      },
      {
        id: "q6",
        type: "mcq",
        question: "wife nghĩa là…",
        options: ["vợ", "chồng", "con gái", "bạn thân"],
        answer: "vợ",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-01) I'm _____ Vietnam.",
        options: ["from", "for", "friend", "family"],
        answer: "from",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-02) Câu nói tuổi đúng:",
        options: [
          "I'm 28 years old.",
          "I have 28 years.",
          "I am 28 year old.",
          "My years is 28.",
        ],
        answer: "I'm 28 years old.",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a0-05) Who is this? →",
        options: [
          "This is my mother.",
          "I'm fine, thanks.",
          "I'm a teacher.",
          "See you later.",
        ],
        answer: "This is my mother.",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "th /ð/ in this / brother / father",
    description_vi:
      "this, brother, father, mother: /ð/ — lưỡi giữa răng, rung nhẹ. Không nói «dis» / «brader» cứng.",
    examples: [
      {
        word: "this",
        ipa: "/ðɪs/",
        tip_vi: "Lưỡi chạm răng, có rung — không «đís».",
      },
      {
        word: "brother",
        ipa: "/ˈbrʌðər/",
        tip_vi: "Cùng /ð/ giữa từ; ôn từ a0-05.",
      },
      {
        word: "father",
        ipa: "/ˈfɑːðər/",
        tip_vi: "father/mother cùng nhóm /ð/.",
      },
    ],
  },
};
