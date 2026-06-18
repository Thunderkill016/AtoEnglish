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
  speaker: string;
  text_en: string;
  text_vn: string;
}

export interface DialogueScenario {
  id: string;
  title: string;
  desc: string;
  lines: DialogueLine[];
}

export interface MatchingGreeting {
  id: string;
  en: string;
  vn: string;
}

export interface ToBeExercise {
  id: string;
  sentence_before: string;
  sentence_after: string;
  options: string[];
  answer: string;
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
  matchingGreetings: MatchingGreeting[];
  dialogueScenarios: DialogueScenario[];
  grammar: {
    title: string;
    explanation: string;
    examples: { en: string; vn: string }[];
  }[];
  toBeExercises: ToBeExercise[];
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
      word: "hi",
      phonetic: "/haɪ/",
      meaning_vn: "Chào (thân mật)",
      example_en: "Hi! Nice to meet you.",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "good morning",
      phonetic: "/ɡʊd ˈmɔː.nɪŋ/",
      meaning_vn: "Chào buổi sáng",
      example_en: "Good morning, teacher! How are you?",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "goodbye",
      phonetic: "/ˌɡʊdˈbaɪ/",
      meaning_vn: "Tạm biệt",
      example_en: "Goodbye, see you again tomorrow.",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "nice to meet you",
      phonetic: "/naɪs tuː miːt juː/",
      meaning_vn: "Rất vui được gặp bạn",
      example_en: "I am Alex. Nice to meet you!",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "my name is",
      phonetic: "/maɪ neɪm ɪz/",
      meaning_vn: "Tên tôi là...",
      example_en: "My name is Linh and I am from Vietnam.",
      topic: "Self-Introduction",
      level: "A1",
    },
    {
      word: "i am from",
      phonetic: "/aɪ æm frɒm/",
      meaning_vn: "Tôi đến từ...",
      example_en: "I am from Hanoi, Vietnam.",
      topic: "Self-Introduction",
      level: "A1",
    },
    {
      word: "how are you",
      phonetic: "/haʊ ɑː juː/",
      meaning_vn: "Bạn có khỏe không?",
      example_en: "Hi Bob, how are you?",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "i am fine thank you",
      phonetic: "/aɪ æm faɪn θæŋk juː/",
      meaning_vn: "Tôi khỏe, cảm ơn bạn",
      example_en: "I am fine thank you, and you?",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "and you",
      phonetic: "/ænd juː/",
      meaning_vn: "Còn bạn thì sao?",
      example_en: "I am doing great, and you?",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "thank you",
      phonetic: "/θæŋk juː/",
      meaning_vn: "Cảm ơn bạn",
      example_en: "Thank you for your warm welcome.",
      topic: "Greetings",
      level: "A1",
    },
    {
      word: "please",
      phonetic: "/pliːz/",
      meaning_vn: "Làm ơn / Vui lòng",
      example_en: "Please excuse me, I must go now.",
      topic: "Greetings",
      level: "A1",
    },
  ],
  matchingGreetings: [
    { id: "m1", en: "Hello", vn: "Xin chào" },
    { id: "m2", en: "Hi", vn: "Chào (thân mật)" },
    { id: "m3", en: "Good morning", vn: "Chào buổi sáng" },
    { id: "m4", en: "Good afternoon", vn: "Chào buổi chiều" },
    { id: "m5", en: "Good evening", vn: "Chào buổi tối" },
    { id: "m6", en: "Goodbye", vn: "Tạm biệt" },
    { id: "m7", en: "Bye", vn: "Tạm biệt (thân mật)" },
    { id: "m8", en: "See you later", vn: "Hẹn gặp lại sau" },
  ],
  dialogueScenarios: [
    {
      id: "sc-1",
      title: "1. Gặp lần đầu (Giới thiệu tên & quốc tịch)",
      desc: "Alex và Linh gặp nhau lần đầu tiên và làm quen với nhau.",
      lines: [
        {
          id: "d1-1",
          speaker: "Alex",
          text_en: "Hello! My name is Alex. What is your name?",
          text_vn: "Xin chào! Mình tên là Alex. Tên bạn là gì?",
        },
        {
          id: "d1-2",
          speaker: "Linh",
          text_en: "Hi Alex! I am Linh. Nice to meet you.",
          text_vn: "Chào Alex! Mình là Linh. Rất vui được gặp bạn.",
        },
        {
          id: "d1-3",
          speaker: "Alex",
          text_en: "Nice to meet you too, Linh! Where are you from?",
          text_vn: "Mình cũng rất vui được gặp bạn, Linh! Bạn từ đâu đến?",
        },
        {
          id: "d1-4",
          speaker: "Linh",
          text_en: "I am from Vietnam. I want to introduce myself.",
          text_vn: "Mình đến từ Việt Nam. Mình muốn tự giới thiệu bản thân.",
        },
      ],
    },
    {
      id: "sc-2",
      title: "2. Gặp bạn cũ (Hỏi thăm sức khỏe)",
      desc: "Bob gặp lại người bạn cũ Alice ở trên đường và hỏi thăm sức khỏe.",
      lines: [
        {
          id: "d2-1",
          speaker: "Bob",
          text_en: "Hi Alice! How are you?",
          text_vn: "Chào Alice! Cậu có khỏe không?",
        },
        {
          id: "d2-2",
          speaker: "Alice",
          text_en: "I am fine, thank you! And you?",
          text_vn: "Mình khỏe, cảm ơn cậu! Còn cậu thì sao?",
        },
        {
          id: "d2-3",
          speaker: "Bob",
          text_en: "I am great, thank you! Nice to see you again.",
          text_vn: "Mình rất tuyệt, cảm ơn cậu! Rất vui được gặp lại cậu.",
        },
        {
          id: "d2-4",
          speaker: "Alice",
          text_en: "Nice to see you too, Bob! Goodbye.",
          text_vn: "Mình cũng rất vui được gặp lại cậu, Bob! Tạm biệt.",
        },
      ],
    },
    {
      id: "sc-3",
      title: "3. Gặp giáo viên (Chào hỏi lịch sự)",
      desc: "Học sinh gặp thầy giáo Brown vào buổi sáng trước khi vào lớp.",
      lines: [
        {
          id: "d3-1",
          speaker: "Student",
          text_en: "Good morning, Mr. Brown! How are you today?",
          text_vn: "Chào buổi sáng thầy Brown! Hôm nay thầy có khỏe không ạ?",
        },
        {
          id: "d3-2",
          speaker: "Mr. Brown",
          text_en: "Good morning! I am very well, thank you. And you?",
          text_vn: "Chào buổi sáng! Thầy rất khỏe, cảm ơn em. Còn em?",
        },
        {
          id: "d3-3",
          speaker: "Student",
          text_en: "I am fine, thank you! Please excuse me, I must go to class.",
          text_vn: "Em khỏe, cảm ơn thầy ạ! Vui lòng cho phép em, em phải vào lớp rồi.",
        },
        {
          id: "d3-4",
          speaker: "Mr. Brown",
          text_en: "Sure! Goodbye. Have a nice day.",
          text_vn: "Được chứ! Tạm biệt em. Chúc em một ngày tốt lành.",
        },
      ],
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
  toBeExercises: [
    {
      id: "tb1",
      sentence_before: "I ",
      sentence_after: " a student.",
      options: ["am", "is", "are"],
      answer: "am",
    },
    {
      id: "tb2",
      sentence_before: "She ",
      sentence_after: " from Vietnam.",
      options: ["am", "is", "are"],
      answer: "is",
    },
    {
      id: "tb3",
      sentence_before: "They ",
      sentence_after: " nice friends.",
      options: ["am", "is", "are"],
      answer: "are",
    },
    {
      id: "tb4",
      sentence_before: "It ",
      sentence_after: " a good morning.",
      options: ["am", "is", "are"],
      answer: "is",
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
      question: "Điền vào chỗ trống: 'What ___ your name?'",
      options: ["is", "am", "are", "be"],
      answer: "is",
    },
    {
      id: "q4",
      question: "Cách chào hỏi trang trọng nhất vào buổi sáng là gì?",
      options: ["Hi!", "Good morning", "Goodbye", "See you later"],
      answer: "Good morning",
    },
    {
      id: "q5",
      question: "Điền vào chỗ trống: 'They ___ nice friends.'",
      options: ["am", "is", "are", "be"],
      answer: "are",
    },
    {
      id: "q6",
      question: "Từ nào là cách nói tạm biệt thân mật?",
      options: ["Good morning", "Hello", "Bye", "Nice to meet you"],
      answer: "Bye",
    },
    {
      id: "q7",
      question: "Phát âm phiên âm của từ 'meet' là gì?",
      options: ["/maɪˈself/", "/həˈləʊ/", "/neɪm/", "/miːt/"],
      answer: "/miːt/",
    },
    {
      id: "q8",
      question: "Điền vào chỗ trống: 'Please excuse ___.'",
      options: ["me", "I", "my", "you"],
      answer: "me",
    },
    {
      id: "q9",
      question: "Cách lịch sự để nói lời cảm ơn bằng tiếng Anh là gì?",
      options: ["Please", "Hello", "Thank you", "Nice"],
      answer: "Thank you",
    },
    {
      id: "q10",
      question: "Điền vào chỗ trống: 'Nice to see you ___.'",
      options: ["again", "from", "please", "am"],
      answer: "again",
    },
  ],
};
