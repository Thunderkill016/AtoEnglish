import type { UnitData } from "@/components/learn/UnitTemplate";

/**
 * GOLD DAY 1 — Name, spelling, and communication repair.
 *
 * Evidence base:
 * - CEFR A1: introduce yourself, exchange personal details, interact when the
 *   other person speaks slowly and is prepared to repeat/rephrase.
 * - Cambridge English speaking-task pattern: short examiner questions,
 *   factual/personal answers, and brief supported interaction.
 *
 * The lesson deliberately reuses the existing unit-a0-1 identity so existing
 * routes and progress storage continue to work. It does not copy proprietary
 * Cambridge lesson content or test items.
 */
export const unitA01: UnitData = {
  unitId: "unit-a0-1",
  title: "Day 1: Nói tên và đánh vần",
  level: "A0",
  xp: 30,
  estimatedTime: 15,
  description:
    "Sau bài này, bạn có thể chào, nói tên, đánh vần tên và xin người đối diện nói lại.",
  badgeName: "Bắt Đầu Nói",
  badgeEmoji: "🎙️",

  situation:
    "Bạn đến nơi làm việc mới. Nhân viên lễ tân hỏi tên, nhưng họ chưa nghe rõ tên Việt của bạn và yêu cầu bạn đánh vần.",

  learningOutcomes: [
    "Trả lời câu hỏi “What’s your name?” bằng một câu ngắn, dễ hiểu",
    "Đánh vần tên của mình chậm và rõ từng chữ cái",
    "Dùng một câu lịch sự để xin người đối diện nói lại",
  ],

  culturalNote:
    "Trong môi trường quốc tế, người nghe có thể chưa quen tên Việt. Đánh vần chậm, dừng nhẹ giữa các chữ và xin họ nói lại là hành vi giao tiếp bình thường, không phải dấu hiệu tiếng Anh kém.",

  warmupGreetings: [
    {
      emoji: "👋",
      en: "Hi. I'm Minh.",
      vn: "Chào bạn. Tôi là Minh.",
      context: "Trả lời ngắn khi được hỏi tên",
    },
    {
      emoji: "🔤",
      en: "M-I-N-H.",
      vn: "M-I-N-H.",
      context: "Đánh vần tên chậm, rõ từng chữ",
    },
    {
      emoji: "🔁",
      en: "Sorry, could you say that again, please?",
      vn: "Xin lỗi, bạn có thể nói lại được không?",
      context: "Câu cứu nguy khi bạn chưa nghe rõ",
    },
  ],

  vocab: [
    {
      id: 1,
      word: "Hi.",
      audio: "/audio/unit-a0-1/hi.mp3",
      phonetic: "/haɪ/",
      meaning: "Xin chào.",
      example: "Hi. I'm Minh.",
      emoji: "👋",
      l1_interference_vn:
        "Nói ngắn và tự nhiên. Không cần kéo dài “haiii” hoặc thêm âm ở cuối.",
    },
    {
      id: 2,
      word: "What's your name?",
      audio: "/audio/unit-a0-1/whats-your-name.mp3",
      phonetic: "/wʌts jər neɪm/",
      meaning: "Tên bạn là gì?",
      example: "Hi. What's your name?",
      emoji: "❓",
      l1_interference_vn:
        "Nghe theo cả cụm; không cần tách và dịch từng từ trước khi trả lời.",
    },
    {
      id: 3,
      word: "I'm ...",
      audio: "/audio/unit-a0-1/im.mp3",
      phonetic: "/aɪm/",
      meaning: "Tôi là ...",
      example: "I'm Linh.",
      emoji: "🏷️",
      l1_interference_vn:
        "I'm là dạng nói tự nhiên của I am. Không nói “I Linh” vì câu thiếu động từ.",
    },
    {
      id: 4,
      word: "How do you spell that?",
      audio: "/audio/unit-a0-1/how-do-you-spell-that.mp3",
      phonetic: "/haʊ də ju spel ðæt/",
      meaning: "Bạn đánh vần tên đó thế nào?",
      example: "How do you spell that?",
      emoji: "🔤",
      l1_interference_vn:
        "Spell nghĩa là đọc từng chữ cái, không phải lặp lại nguyên tên.",
    },
    {
      id: 5,
      word: "Sorry.",
      audio: "/audio/unit-a0-1/sorry.mp3",
      phonetic: "/ˈsɒri/",
      meaning: "Xin lỗi.",
      example: "Sorry, could you say that again?",
      emoji: "🙏",
      l1_interference_vn:
        "Ở đây “Sorry” dùng để mở đầu yêu cầu lịch sự, không phải nhận lỗi nghiêm trọng.",
    },
    {
      id: 6,
      word: "Could you say that again, please?",
      audio: "/audio/unit-a0-1/could-you-say-that-again-please.mp3",
      phonetic: "/kʊd ju seɪ ðæt əˈɡen pliːz/",
      meaning: "Bạn có thể nói lại được không?",
      example: "Sorry, could you say that again, please?",
      emoji: "🔁",
      l1_interference_vn:
        "Học cả câu như một cụm cứu nguy; không cần phân tích ngữ pháp trong lúc nói.",
    },
    {
      id: 7,
      word: "Nice to meet you.",
      audio: "/audio/unit-a0-1/nice-to-meet-you.mp3",
      phonetic: "/naɪs tə miːt ju/",
      meaning: "Rất vui được gặp bạn.",
      example: "Nice to meet you, Minh.",
      emoji: "🤝",
      l1_interference_vn:
        "Dùng khi gặp lần đầu. Nói liền cụm “nice-to-meet-you”, không ngắt từng từ.",
    },
    {
      id: 8,
      word: "Thank you.",
      audio: "/audio/unit-a0-1/thank-you.mp3",
      phonetic: "/θæŋk ju/",
      meaning: "Cảm ơn bạn.",
      example: "Thank you. Nice to meet you.",
      emoji: "✅",
      l1_interference_vn:
        "Âm đầu của “thank” cần luồng hơi nhẹ; mục tiêu là dễ hiểu, không cần giọng bản xứ.",
    },
  ],

  grammar: {
    title: "Cụm dùng ngay: “I'm + tên”",
    rule: "Khi được hỏi tên, trả lời bằng cả cụm: I'm + [tên].",
    examples: [
      { en: "I'm Minh.", vn: "Tôi là Minh." },
      { en: "I'm Linh.", vn: "Tôi là Linh." },
      { en: "Hi. I'm Nam.", vn: "Chào bạn. Tôi là Nam." },
    ],
    tip:
      "Hãy coi “I'm” là một khối âm duy nhất. Mục tiêu hôm nay là phản xạ trả lời, không phải học bảng chia động từ.",
    vnNote:
      "Tiếng Việt có thể nói “Tôi Minh” trong một số ngữ cảnh rút gọn, nhưng tiếng Anh cần “I'm Minh” hoặc “My name is Minh”.",
    dialogueExample: {
      speaker: "Learner",
      text: "Hi. I'm Minh.",
      translation: "Chào bạn. Tôi là Minh.",
      highlight: "I'm",
    },
    ccq: {
      question: "Nhân viên lễ tân hỏi “What's your name?”. Câu trả lời nào phù hợp nhất?",
      options: ["I'm Minh.", "Name Minh.", "Spell Minh.", "Thank you Minh."],
      answer: "I'm Minh.",
      explanation: "Dùng cụm hoàn chỉnh “I'm + tên”.",
    },
  },

  practiceQuiz: [
    {
      id: "gd1-p1",
      question: "Bạn nghe: “What's your name?”. Bạn trả lời thế nào?",
      options: ["I'm Huy.", "How do you spell that?", "Thank you.", "Sorry?"],
      answer: "I'm Huy.",
      type: "multiple-choice",
    },
    {
      id: "gd1-p2",
      question: "Điền phần còn thiếu: “___ Lan.”",
      answer: "I'm",
      type: "cloze",
    },
    {
      id: "gd1-p3",
      question: "Bạn chưa nghe rõ. Câu nào giúp cuộc trò chuyện tiếp tục?",
      options: [
        "Sorry, could you say that again, please?",
        "What's your name?",
        "I'm Minh.",
        "Nice to meet you.",
      ],
      answer: "Sorry, could you say that again, please?",
      type: "multiple-choice",
    },
  ],

  practiceTranslate: [
    {
      id: "gd1-t1",
      prompt_vn: "Chào bạn. Tôi là Minh.",
      answer: "Hi. I'm Minh.",
    },
    {
      id: "gd1-t2",
      prompt_vn: "Bạn đánh vần tên đó thế nào?",
      answer: "How do you spell that?",
    },
    {
      id: "gd1-t3",
      prompt_vn: "Xin lỗi, bạn có thể nói lại được không?",
      answer: "Sorry, could you say that again, please?",
    },
  ],

  dialogues: [
    {
      id: 1,
      title: "Tên và đánh vần",
      audio: "/audio/unit-a0-1/dialogue-name-and-spelling.mp3",
      desc: "Một cuộc trao đổi ngắn tại quầy lễ tân ngày đầu đi làm.",
      lines: [
        {
          id: "gd1-d1-1",
          speaker: "Receptionist",
          text: "Hi. What's your name?",
          translation: "Chào bạn. Tên bạn là gì?",
        },
        {
          id: "gd1-d1-2",
          speaker: "Learner",
          text: "Hi. I'm Minh.",
          translation: "Chào bạn. Tôi là Minh.",
        },
        {
          id: "gd1-d1-3",
          speaker: "Receptionist",
          text: "How do you spell that?",
          translation: "Bạn đánh vần tên đó thế nào?",
        },
        {
          id: "gd1-d1-4",
          speaker: "Learner",
          text: "M-I-N-H.",
          translation: "M-I-N-H.",
        },
      ],
    },
    {
      id: 2,
      title: "Xin nói lại",
      audio: "/audio/unit-a0-1/dialogue-repeat-request.mp3",
      desc: "Bạn chưa nghe rõ một câu và dùng repair phrase để tiếp tục.",
      lines: [
        {
          id: "gd1-d2-1",
          speaker: "Colleague",
          text: "Nice to meet you, Minh.",
          translation: "Rất vui được gặp bạn, Minh.",
        },
        {
          id: "gd1-d2-2",
          speaker: "Learner",
          text: "Sorry, could you say that again, please?",
          translation: "Xin lỗi, bạn có thể nói lại được không?",
        },
        {
          id: "gd1-d2-3",
          speaker: "Colleague",
          text: "Nice to meet you.",
          translation: "Rất vui được gặp bạn.",
        },
        {
          id: "gd1-d2-4",
          speaker: "Learner",
          text: "Nice to meet you too. Thank you.",
          translation: "Tôi cũng rất vui được gặp bạn. Cảm ơn.",
        },
      ],
    },
  ],

  listenAndChoose: [
    {
      id: "gd1-l1",
      audio_text: "What's your name?",
      options: ["Tên bạn là gì?", "Bạn làm nghề gì?", "Bạn đến từ đâu?", "Bạn bao nhiêu tuổi?"],
      answer: "Tên bạn là gì?",
    },
    {
      id: "gd1-l2",
      audio_text: "I'm Minh.",
      options: ["I'm Minh.", "My Minh.", "Name Minh.", "Spell Minh."],
      answer: "I'm Minh.",
    },
    {
      id: "gd1-l3",
      audio_text: "How do you spell that?",
      options: [
        "How do you spell that?",
        "Could you say that again?",
        "What's your name?",
        "Nice to meet you.",
      ],
      answer: "How do you spell that?",
    },
    {
      id: "gd1-l4",
      audio_text: "M-I-N-H.",
      options: ["M-I-N-H.", "N-I-M-H.", "M-E-N-H.", "M-I-M-H."],
      answer: "M-I-N-H.",
    },
    {
      id: "gd1-l5",
      audio_text: "Sorry, could you say that again, please?",
      options: [
        "Xin lỗi, bạn có thể nói lại được không?",
        "Bạn có thể đánh vần tên không?",
        "Rất vui được gặp bạn.",
        "Tên bạn là gì?",
      ],
      answer: "Xin lỗi, bạn có thể nói lại được không?",
    },
  ],

  pronunciationFocus: {
    phoneme: "Tên chữ cái + khoảng dừng",
    description:
      "Đọc từng chữ rõ ràng và dừng rất ngắn giữa các chữ. Sự dễ hiểu quan trọng hơn bắt chước giọng bản xứ.",
    examples: [
      {
        word: "M-I-N-H",
        ipa: "/em aɪ en eɪtʃ/",
        tip: "Nói chậm: M — I — N — H.",
      },
      {
        word: "L-I-N-H",
        ipa: "/el aɪ en eɪtʃ/",
        tip: "Giữ khoảng dừng đều giữa bốn chữ.",
      },
    ],
  },

  fluencyDrill: {
    title: "Năm lượt nói ngắn",
    items: [
      { en: "Hi.", vn: "Xin chào." },
      { en: "I'm Minh.", vn: "Tôi là Minh." },
      { en: "How do you spell that?", vn: "Bạn đánh vần tên đó thế nào?" },
      { en: "M-I-N-H.", vn: "M-I-N-H." },
      {
        en: "Sorry, could you say that again, please?",
        vn: "Xin lỗi, bạn có thể nói lại được không?",
      },
    ],
  },

  speaking: {
    level1Prompt: "Hi. I'm {input}.",
    level1Placeholder: "Nhập tên bạn muốn dùng, ví dụ: Huy",
    level2Situation:
      "Bạn đang ở quầy lễ tân. Hãy chào, nói tên, đánh vần tên và dùng câu xin nói lại nếu chưa nghe rõ.",
    level2Hint:
      "Hi. I'm Minh. M-I-N-H. Sorry, could you say that again, please? Nice to meet you.",
  },

  quiz: [
    {
      id: "gd1-q1",
      question: "Câu trả lời phù hợp cho “What's your name?” là gì?",
      options: ["I'm Lan.", "Spell Lan.", "Thank you Lan.", "Nice Lan."],
      answer: "I'm Lan.",
      type: "multiple-choice",
      explanation_vn: "Dùng cụm “I'm + tên”.",
    },
    {
      id: "gd1-q2",
      question: "Điền phần còn thiếu: “Hi. ___ Nam.”",
      answer: "I'm",
      type: "cloze",
      explanation_vn: "Câu hoàn chỉnh là “Hi. I'm Nam.”",
    },
    {
      id: "gd1-q3",
      question: "Người đối diện hỏi “How do you spell that?”. Bạn cần làm gì?",
      options: [
        "Đọc từng chữ cái trong tên",
        "Nói tên nghề nghiệp",
        "Nói nơi mình sống",
        "Chào tạm biệt",
      ],
      answer: "Đọc từng chữ cái trong tên",
      type: "multiple-choice",
    },
    {
      id: "gd1-q4",
      question: "Dịch sang tiếng Anh: “Xin lỗi, bạn có thể nói lại được không?”",
      answer: "Sorry, could you say that again, please?",
      type: "translate",
      explanation_vn: "Đây là repair phrase chính của Day 1.",
    },
    {
      id: "gd1-q5",
      question: "Mục tiêu phát âm chính khi đánh vần là gì?",
      options: [
        "Từng chữ dễ nghe và có khoảng dừng ngắn",
        "Nói nhanh nhất có thể",
        "Bắt chước hoàn toàn giọng bản xứ",
        "Nói cả tên mà không đánh vần",
      ],
      answer: "Từng chữ dễ nghe và có khoảng dừng ngắn",
      type: "multiple-choice",
    },
  ],

  cumulativeReviewQuestions: [
    {
      id: "gd1-r1",
      question: "Bạn được hỏi tên. Chọn câu trả lời phù hợp.",
      options: ["I'm Mai.", "How do you spell that?", "Thank you.", "Again, please."],
      answer: "I'm Mai.",
      type: "multiple-choice",
    },
    {
      id: "gd1-r2",
      question: "Câu nào yêu cầu người khác đánh vần?",
      options: [
        "How do you spell that?",
        "Could you say that again?",
        "What's your name?",
        "Nice to meet you.",
      ],
      answer: "How do you spell that?",
      type: "multiple-choice",
    },
    {
      id: "gd1-r3",
      question: "Bạn chưa nghe rõ. Chọn câu lịch sự nhất.",
      options: [
        "Sorry, could you say that again, please?",
        "No.",
        "Speak.",
        "I name Minh.",
      ],
      answer: "Sorry, could you say that again, please?",
      type: "multiple-choice",
    },
  ],

  jobScenarios: [
    {
      id: 1,
      title: "Ngày đầu đi làm: đăng ký tên tại quầy lễ tân",
      focus: "Tên, đánh vần và communication repair",
      context: "Reception hoặc orientation tại môi trường có đồng nghiệp quốc tế",
      l1Note:
        "Tên Việt có thể lạ với người nghe; đánh vần chậm và xin nhắc lại là hoàn toàn bình thường.",
      example:
        "Hi. I'm Minh. M-I-N-H. Sorry, could you say that again, please?",
    },
  ],
};

export default unitA01;
