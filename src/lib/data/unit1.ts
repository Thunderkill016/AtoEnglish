export interface VocabItem {
  word: string;
  phonetic: string;
  meaning_vn: string;
  example_en: string;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
}

export interface DialogueLine {
  id: string;
  speaker: "Alex" | "Linh";
  text_en: string;
  text_vn: string;
  audio_url?: string; // Giả lập Text-To-Speech phát âm từng câu
}

export interface ClozeItem {
  id: string;
  sentence_before: string;
  sentence_after: string;
  answer: string;
  full_sentence: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: string;
}

export interface UnitData {
  id: string;
  title: string;
  subtitle: string;
  level: string;
  duration: string;
  vocab: VocabItem[];
  dialogue: DialogueLine[];
  grammar: {
    title: string;
    explanation: string;
    examples: { en: string; vn: string }[];
  }[];
  cloze: ClozeItem[];
  quiz: QuizQuestion[];
}

export const UNIT_1_DATA: UnitData = {
  id: "unit-1",
  title: "Unit 1: Greetings & Self-Introduction",
  subtitle: "Chủ đề: Chào hỏi và Tự giới thiệu bản thân",
  level: "A0 - A1 Starter",
  duration: "35-40 phút",
  vocab: [
    {
      word: "hello",
      phonetic: "/həˈləʊ/",
      meaning_vn: "Xin chào",
      example_en: "Hello! How are you doing today?",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "introduce",
      phonetic: "/ˌɪn.trəˈdʒuːs/",
      meaning_vn: "Giới thiệu",
      example_en: "Let me introduce myself to the class.",
      topic: "Self-Introduction",
      level: "A1",
    },
    {
      word: "myself",
      phonetic: "/maɪˈself/",
      meaning_vn: "Bản thân tôi",
      example_en: "I will write a short text about myself.",
      topic: "Self-Introduction",
      level: "A1",
    },
    {
      word: "name",
      phonetic: "/neɪm/",
      meaning_vn: "Tên",
      example_en: "My name is Linh and I am from Vietnam.",
      topic: "Self-Introduction",
      level: "A1",
    },
    {
      word: "nice",
      phonetic: "/naɪs/",
      meaning_vn: "Tốt, đẹp, dễ chịu",
      example_en: "It is a nice day to study English.",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "meet",
      phonetic: "/miːt/",
      meaning_vn: "Gặp gỡ",
      example_en: "I am very happy to meet you.",
      topic: "Greetings",
      level: "A1",
    },
  ],
  dialogue: [
    {
      id: "d1",
      speaker: "Alex",
      text_en: "Hello! My name is Alex. What is your name?",
      text_vn: "Xin chào! Mình tên là Alex. Tên bạn là gì?",
    },
    {
      id: "d2",
      speaker: "Linh",
      text_en: "Hi Alex! I am Linh. Nice to meet you.",
      text_vn: "Chào Alex! Mình là Linh. Rất vui được gặp bạn.",
    },
    {
      id: "d3",
      speaker: "Alex",
      text_en: "Nice to meet you too, Linh! Where are you from?",
      text_vn: "Mình cũng rất vui được gặp bạn, Linh! Bạn từ đâu đến?",
    },
    {
      id: "d4",
      speaker: "Linh",
      text_en: "I am from Vietnam. I want to introduce myself to everyone.",
      text_vn: "Mình đến từ Việt Nam. Mình muốn tự giới thiệu bản thân với mọi người.",
    },
  ],
  grammar: [
    {
      title: "1. Động từ 'To Be' ở thì hiện tại đơn",
      explanation: "Động từ 'to be' có ba dạng chính là am, is, are đi kèm với các đại từ nhân xưng tương ứng.",
      examples: [
        { en: "I am Linh.", vn: "Tôi là Linh. (I đi với am)" },
        { en: "My name is Alex.", vn: "Tên tôi là Alex. (Tên số ít đi với is)" },
        { en: "Where are you from?", vn: "Bạn từ đâu đến? (You đi với are)" },
      ],
    },
    {
      title: "2. Tính từ sở hữu (Possessive Adjectives)",
      explanation: "Dùng để chỉ sự sở hữu của một ai đó đối với người hoặc vật.",
      examples: [
        { en: "My name is Linh.", vn: "Tên của tôi là Linh." },
        { en: "What is your name?", vn: "Tên của bạn là gì?" },
      ],
    },
  ],
  cloze: [
    {
      id: "c1",
      sentence_before: "Hello, my name ",
      sentence_after: " Alex.",
      answer: "is",
      full_sentence: "Hello, my name is Alex.",
    },
    {
      id: "c2",
      sentence_before: "Nice to ",
      sentence_after: " you.",
      answer: "meet",
      full_sentence: "Nice to meet you.",
    },
    {
      id: "c3",
      sentence_before: "I am ",
      sentence_after: " Vietnam.",
      answer: "from",
      full_sentence: "I am from Vietnam.",
    },
  ],
  quiz: [
    {
      id: "q1",
      question: "Câu nào dùng để chào hỏi lịch sự và nói 'Rất vui được gặp bạn'?",
      options: [
        "Goodbye, see you later",
        "Nice to meet you",
        "How old are you?",
        "Where are you from?",
      ],
      answer: "Nice to meet you",
    },
    {
      id: "q2",
      question: "Điền vào chỗ trống: 'I ___ from Vietnam.'",
      options: ["is", "am", "are", "be"],
      answer: "am",
    },
    {
      id: "q3",
      question: "Phát âm phiên âm của từ 'myself' là gì?",
      options: ["/maɪˈself/", "/həˈləʊ/", "/neɪm/", "/miːt/"],
      answer: "/maɪˈself/",
    },
  ],
};
