import type { LessonSpec } from "@/lib/v2/lesson-spec";

/**
 * P1 A1 gate — review & real-life application (end of A1 block).
 * Core: introduce · conversation · describe · can · like + -ing ·
 * there is/are · How much · Where is · I feel / I have · confident
 * Spiral: full A1 a1-01…11 (sample 6). Freer task combines can-dos.
 * L1 notes 100% (A1 schema gate).
 */
export const lessonA112: LessonSpec = {
  id: "l-a1-12",
  phase: "P1",
  cefr: "A1",
  title_vi: "Ôn A1 & áp dụng",
  estimatedMin: 40,
  canDo: [
    "Kết hợp chào hỏi, nghề, sở thích, can, chỗ ở trong 1 đoạn giới thiệu",
    "Dùng câu A1 đúng form: be / Present Simple / like+V-ing / can / have·feel",
    "Tự tin áp dụng A1 trong hội thoại thực (gặp người mới, hỏi đường, sức khỏe)",
  ],
  situation:
    "Bạn gặp người nước ngoài tại sân bay / cafe / ngày đầu công ty. Họ hỏi về bạn: tên, nghề, thói quen, sở thích, nhà, khả năng, và bạn có ổn không. Bạn cần ghép tất cả kỹ năng A1 đã học thành một cuộc trò chuyện tự nhiên — không học thêm ngữ pháp mới, chỉ ôn và áp dụng.",
  culturalNote_vi:
    "Sau A1 bạn có thể: tự giới thiệu, hỏi nghề/tuổi, nói thói quen & sở thích, mua sắm/order, hỏi đường, nói can/can't, kể sức khỏe & cảm xúc. Người bản ngữ thường ghép nhiều chủ đề trong 1 chat ngắn — luyện 'chuyển topic' lịch sự (By the way… / And you?).",
  jobAngle:
    "Networking / first day: introduce yourself, job, hobbies, can-skills, how you feel",
  lexis: [
    {
      id: "v1",
      word: "introduce",
      phonetic: "/ˌɪntrəˈdjuːs/",
      meaning_vi: "giới thiệu",
      example_en: "Let me introduce myself.",
      l1_note_vi:
        "introduce yourself; introduce someone TO John — giới từ to. Không: introduce you WITH.",
    },
    {
      id: "v2",
      word: "conversation",
      phonetic: "/ˌkɒnvəˈseɪʃən/",
      meaning_vi: "cuộc trò chuyện",
      example_en: "I can have a conversation in English.",
      l1_note_vi:
        "have a conversation. Stress âm 3: con-ver-SA-tion. Không: make conversation only (cũng có nhưng have phổ biến hơn).",
    },
    {
      id: "v3",
      word: "describe",
      phonetic: "/dɪˈskraɪb/",
      meaning_vi: "mô tả",
      example_en: "Can you describe your home?",
      l1_note_vi:
        "describe something TO someone. Không: describe me it (sai thứ tự tân ngữ).",
    },
    {
      id: "v4",
      word: "confident",
      phonetic: "/ˈkɒnfɪdənt/",
      meaning_vi: "tự tin",
      example_en: "I feel confident speaking English now.",
      l1_note_vi:
        "feel confident / confident about something. Stress CON-fi-dent. Không: confident of (hiếm).",
    },
    {
      id: "v5",
      word: "goal",
      phonetic: "/ɡəʊl/",
      meaning_vi: "mục tiêu",
      example_en: "My goal is to speak English fluently.",
      l1_note_vi:
        "set/reach a goal. Đồng âm 'goal' bóng đá — phân biệt ngữ cảnh.",
    },
    {
      id: "v6",
      word: "practice",
      phonetic: "/ˈpræktɪs/",
      meaning_vi: "luyện tập",
      example_en: "I practice English every day.",
      l1_note_vi:
        "practice speaking / practice every day. US: practice n+v; UK practise (v).",
    },
    {
      id: "v7",
      word: "improve",
      phonetic: "/ɪmˈpruːv/",
      meaning_vi: "cải thiện",
      example_en: "You can improve your speaking.",
      l1_note_vi:
        "improve your English / Your English is improving. Không: improve up.",
    },
    {
      id: "v8",
      word: "review",
      phonetic: "/rɪˈvjuː/",
      meaning_vi: "ôn tập",
      example_en: "Let's review what we learned.",
      l1_note_vi:
        "Động từ stress re-VIEW (âm 2). Danh từ đôi khi RE-view — người Việt hay stress sai.",
    },
    {
      id: "v9",
      word: "fluent",
      phonetic: "/ˈfluːənt/",
      meaning_vi: "trôi chảy / thành thạo",
      example_en: "I want to be fluent in English.",
      l1_note_vi:
        "fluent IN English; speak fluently (trạng từ). Stress FLU-ent.",
    },
    {
      id: "v10",
      word: "achieve",
      phonetic: "/əˈtʃiːv/",
      meaning_vi: "đạt được",
      example_en: "You achieved your A1 goal!",
      l1_note_vi:
        "achieve a goal. Stress a-CHIEVE. Âm /tʃ/ trong chieve — không /ʃ/.",
    },
    {
      id: "v11",
      word: "ask for help",
      phonetic: "/ɑːsk fɔː help/",
      meaning_vi: "nhờ giúp đỡ",
      example_en: "Don't be afraid to ask for help.",
      l1_note_vi:
        "ask FOR help — cần for. Không: ask help (thiếu for).",
    },
    {
      id: "v12",
      word: "understand",
      phonetic: "/ˌʌndəˈstænd/",
      meaning_vi: "hiểu",
      example_en: "I can understand simple English.",
      l1_note_vi:
        "3 âm: un-der-STAND. Không: I no understand / I not understand.",
    },
  ],
  grammar: {
    title: "Ôn ngữ pháp A1 — ghép nhiều cấu trúc",
    rule: "be · Present Simple · like+V-ing · there is/are · can · have/feel",
    examples: [
      {
        en: "I'm a teacher. I like cooking.",
        vi: "be + nghề · like + V-ing",
      },
      {
        en: "She goes to work at eight.",
        vi: "Present Simple ngôi 3: goes",
      },
      {
        en: "There is a park next to my house.",
        vi: "there is + singular; next to (a1-09)",
      },
      {
        en: "I can speak English. I feel confident.",
        vi: "can + V · feel + adj",
      },
      {
        en: "I'd like a coffee, please.",
        vi: "order lịch sự (a1-08)",
      },
    ],
    vnNote:
      "Bài ôn: không học form mới. Lỗi hay lặp: She go; I like swim; There is chairs; I can to speak; I feel a headache; She have a cold. Ghép câu đúng trước khi nói dài.",
    ccq: {
      question: "Câu nào dùng đúng NHIỀU cấu trúc A1?",
      options: [
        "I'm a teacher. I like cooking and I can speak English.",
        "I am student and like swim.",
        "She have a headache and can't goes to work.",
        "There is chairs in kitchen and she feel happy.",
      ],
      answer: "I'm a teacher. I like cooking and I can speak English.",
      explanation_vi:
        "be + job · like + V-ing · can + V — cả ba form đúng.",
    },
  },
  controlled: [
    {
      id: "c1",
      type: "mcq",
      prompt_vi: "Present Simple — She (a1-04)",
      options: [
        "She goes to work.",
        "She go to work.",
        "She going to work.",
        "She is go to work.",
      ],
      answer: "She goes to work.",
    },
    {
      id: "c2",
      type: "mcq",
      prompt_vi: "like + V-ing (a1-05)",
      options: [
        "I like swimming.",
        "I like swim.",
        "I like to swimming.",
        "I like swims.",
      ],
      answer: "I like swimming.",
    },
    {
      id: "c3",
      type: "cloze",
      prompt_vi: "Điền: I _____ speak English now. (can / cans / to can)",
      stem: "I _____ speak English now.",
      answer: "can",
      explanation_vi: "can + V nguyên mẫu, không to / không -s với I.",
    },
    {
      id: "c4",
      type: "scramble",
      prompt_vi: "Sắp xếp: a / teacher / I'm",
      words: ["I'm", "a", "teacher"],
      answer: "I'm a teacher",
    },
    {
      id: "c5",
      type: "correction",
      prompt_vi: "Sửa lỗi: There is two chairs in my room.",
      stem: "There is two chairs in my room.",
      answer: "There are two chairs in my room.",
      explanation_vi: "two chairs → There are (số nhiều).",
    },
    {
      id: "c6",
      type: "mcq",
      prompt_vi: "Sức khỏe — have vs feel (a1-11)",
      options: [
        "I have a headache and I feel tired.",
        "I feel a headache and I have tired.",
        "I have tired and feel a cold.",
        "I can a headache.",
      ],
      answer: "I have a headache and I feel tired.",
    },
  ],
  input: {
    dialogues: [
      {
        id: "d1",
        title_vi: "Gặp người mới — tổng hợp A1",
        context_vi:
          "Lan gặp Tom (du khách/đồng nghiệp mới): hỏi đường → giới thiệu → nghề & sở thích → sức khỏe → can.",
        lines: [
          {
            id: "d1-1",
            speaker: "Tom",
            text: "Excuse me, where is the nearest café?",
            translation_vi: "Xin lỗi, quán cà phê gần nhất ở đâu?",
          },
          {
            id: "d1-2",
            speaker: "Lan",
            text: "It's next to the bank. Go straight and turn left!",
            translation_vi: "Nó ở cạnh ngân hàng. Đi thẳng và rẽ trái!",
          },
          {
            id: "d1-3",
            speaker: "Tom",
            text: "Thank you! By the way, I'm Tom. Nice to meet you.",
            translation_vi: "Cảm ơn! Nhân tiện, tôi là Tom. Rất vui được gặp bạn.",
          },
          {
            id: "d1-4",
            speaker: "Lan",
            text: "I'm Lan. What do you do, Tom?",
            translation_vi: "Tôi là Lan. Tom làm nghề gì vậy?",
          },
          {
            id: "d1-5",
            speaker: "Tom",
            text: "I'm an English teacher. I like traveling and cooking.",
            translation_vi:
              "Tôi là giáo viên tiếng Anh. Tôi thích du lịch và nấu ăn.",
          },
          {
            id: "d1-6",
            speaker: "Lan",
            text: "That's great! I can cook Vietnamese food too. Are you feeling OK? You look tired.",
            translation_vi:
              "Tuyệt! Tôi cũng nấu được đồ Việt. Bạn ổn không? Trông bạn hơi mệt.",
          },
          {
            id: "d1-7",
            speaker: "Tom",
            text: "I feel a bit tired. I have a cold. But I feel better now, thank you!",
            translation_vi:
              "Tôi hơi mệt. Tôi bị cảm. Nhưng bây giờ khỏe hơn rồi, cảm ơn!",
          },
          {
            id: "d1-8",
            speaker: "Lan",
            text: "Good. My goal is to practice English every day. See you later!",
            translation_vi:
              "Tốt. Mục tiêu của tôi là luyện tiếng Anh mỗi ngày. Hẹn gặp lại!",
          },
        ],
      },
    ],
    listenItems: [
      {
        id: "lac1",
        audio_text: "I can have a conversation in English",
        options: [
          "I can have a conversation in English",
          "I can speak English well",
          "She can have a conversation in English",
          "I can have a talk in English",
        ],
        answer: "I can have a conversation in English",
      },
      {
        id: "lac2",
        audio_text: "My goal is to speak English fluently",
        options: [
          "My goal is to speak English fluently",
          "My goal is to speak English slowly",
          "Her goal is to speak English fluently",
          "My aim is to speak English fluently",
        ],
        answer: "My goal is to speak English fluently",
      },
      {
        id: "lac3",
        audio_text: "I feel confident speaking English now",
        options: [
          "I feel confident speaking English now",
          "I feel confident speaking Vietnamese now",
          "She feels confident speaking English now",
          "I felt confident speaking English",
        ],
        answer: "I feel confident speaking English now",
      },
      {
        id: "lac4",
        audio_text: "There is a park next to my house",
        options: [
          "There is a park next to my house",
          "There are a park next to my house",
          "There is a bank next to my house",
          "There is a park opposite my house",
        ],
        answer: "There is a park next to my house",
      },
    ],
  },
  fluency: {
    items: [
      { en: "Let me introduce myself.", vi: "Để tôi tự giới thiệu." },
      { en: "I'm a teacher. I like cooking.", vi: "Tôi là giáo viên. Tôi thích nấu ăn." },
      { en: "I can speak English.", vi: "Tôi nói được tiếng Anh." },
      { en: "There is a park next to my house.", vi: "Có công viên cạnh nhà tôi." },
      { en: "Where is the nearest café?", vi: "Quán cà phê gần nhất ở đâu?" },
      { en: "I feel confident now.", vi: "Bây giờ tôi cảm thấy tự tin." },
      { en: "My goal is to practice every day.", vi: "Mục tiêu của tôi là luyện mỗi ngày." },
      { en: "Nice to meet you. See you later!", vi: "Rất vui được gặp bạn. Hẹn gặp lại!" },
    ],
  },
  task: {
    type: "speak",
    prompt_vi:
      "FREER A1: Gặp người mới (sân bay / cafe / ngày đầu làm). Nói 6–10 câu ghép: chào + tên · nghề/tuổi · thói quen hoặc sở thích (like + -ing) · nhà (there is/are) · can/can't · cảm xúc hoặc sức khỏe hôm nay · tạm biệt. Có thể hỏi lại (And you? / What do you do?).",
    successCriteria_vi: [
      "Có giới thiệu tên + nghề hoặc I'm a…",
      "Có ít nhất 1 like/love + V-ing HOẶC Present Simple thói quen",
      "Có can/can't HOẶC there is/are HOẶC Where is…",
      "Không lỗi nặng lặp: She go / I like swim / I feel a headache",
    ],
    scaffold_en: [
      "Hi! My name is… Nice to meet you.",
      "I'm a… / I work every day.",
      "I like… / I love…",
      "In my home, there is/are…",
      "I can… / I can't…",
      "Today I feel… / I have a…",
      "Where is the…? It's next to…",
      "See you later! My goal is to practice every day.",
    ],
  },
  review: {
    quiz: [
      {
        id: "q1",
        type: "mcq",
        question: "Câu ôn A1 đúng nhất:",
        options: [
          "I'm a student. I like reading and I can speak English.",
          "I am student. I like read and I can to speak.",
          "She go to work and like swim.",
          "There is two chairs and I feel a headache.",
        ],
        answer: "I'm a student. I like reading and I can speak English.",
        explanation_vi: "be + a · like + V-ing · can + V.",
      },
      {
        id: "q2",
        type: "mcq",
        question: "She ___ to work at eight.",
        options: ["goes", "go", "going", "is go"],
        answer: "goes",
      },
      {
        id: "q3",
        type: "true-false",
        question: "I like swimming. là câu đúng (like + V-ing).",
        options: ["True", "False"],
        answer: "True",
      },
      {
        id: "q4",
        type: "mcq",
        question: "Sức khỏe:",
        options: [
          "I have a cold and I feel tired.",
          "I feel a cold and I have tired.",
          "I can a cold.",
          "I am have tired.",
        ],
        answer: "I have a cold and I feel tired.",
      },
      {
        id: "q5",
        type: "cloze",
        question: "There _____ a park next to my house. (is / are)",
        answer: "is",
      },
      {
        id: "q6",
        type: "mcq",
        question: "Order lịch sự:",
        options: [
          "I'd like a coffee, please.",
          "I want coffee give me.",
          "Give me the coffee now!",
          "I can coffee please?",
        ],
        answer: "I'd like a coffee, please.",
      },
    ],
    spiral: [
      {
        id: "s1",
        type: "mcq",
        question: "(Ôn a1-01) Chào & tên:",
        options: [
          "Hello! My name is Linh.",
          "I have Hello Linh.",
          "I feel my name.",
          "Can you name Linh?",
        ],
        answer: "Hello! My name is Linh.",
      },
      {
        id: "s2",
        type: "mcq",
        question: "(Ôn a1-07) Hỏi giá:",
        options: [
          "How much is this?",
          "How many is this?",
          "Where much is this?",
          "I can much this?",
        ],
        answer: "How much is this?",
      },
      {
        id: "s3",
        type: "mcq",
        question: "(Ôn a1-09) Hỏi đường:",
        options: [
          "Where is the bank?",
          "What is the bank go?",
          "I have a bank?",
          "Can bank where?",
        ],
        answer: "Where is the bank?",
      },
      {
        id: "s4",
        type: "mcq",
        question: "(Ôn a1-10) Khả năng:",
        options: [
          "Can you cook?",
          "Do you can cook?",
          "Are you can cook?",
          "I cans cook?",
        ],
        answer: "Can you cook?",
      },
      {
        id: "s5",
        type: "mcq",
        question: "(Ôn a1-06) Nhà cửa:",
        options: [
          "There are two bedrooms.",
          "There is two bedrooms.",
          "There have two bedrooms.",
          "It are two bedrooms.",
        ],
        answer: "There are two bedrooms.",
      },
      {
        id: "s6",
        type: "mcq",
        question: "(Ôn a1-11) Hỏi sức khỏe:",
        options: [
          "How are you feeling?",
          "Where are you feeling?",
          "Can you fever?",
          "I have you feeling?",
        ],
        answer: "How are you feeling?",
      },
    ],
  },
  pronunciationFocus: {
    phoneme: "/θ/ th · stress · can /kæn/",
    description_vi:
      "Ôn âm hay sai cả block A1: th /θ/ (thank, three); stress introduce /ˌɪntrəˈdjuːs/, conversation âm 3; can ngắn /kæn/ không /kɑːn/ kéo dài quá.",
    examples: [
      {
        word: "thank",
        ipa: "/θæŋk/",
        tip_vi: "Lưỡi giữa răng — không /t/ hay /s/.",
      },
      {
        word: "introduce",
        ipa: "/ˌɪntrəˈdjuːs/",
        tip_vi: "Stress âm 3: intro-DUCE.",
      },
      {
        word: "confident",
        ipa: "/ˈkɒnfɪdənt/",
        tip_vi: "Stress âm 1: CON-fident.",
      },
    ],
  },
};
