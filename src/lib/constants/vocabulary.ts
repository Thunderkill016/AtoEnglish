export interface VocabularyItem {
  word: string;
  phonetic: string;
  meaning_vn: string;
  example_en: string;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
}

export const UNIT_VOCABULARY: Record<string, VocabularyItem[]> = {
  "unit-1": [
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
  "unit-4": [
    { 
      word: "artificial intelligence", 
      phonetic: "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/", 
      meaning_vn: "Trí tuệ nhân tạo",
      example_en: "In the 21st century, artificial intelligence has become omnipresent.",
      topic: "Technology",
      level: "B1"
    },
    { 
      word: "omnipresent", 
      phonetic: "/ˌɒm.nɪˈprez.ənt/", 
      meaning_vn: "Có mặt ở khắp mọi nơi",
      example_en: "Smartphones have become omnipresent in modern society.",
      topic: "Technology",
      level: "B1"
    },
    { 
      word: "revolutionize", 
      phonetic: "/ˌrev.əˈluː.ʃən.aɪz/", 
      meaning_vn: "Cách mạng hóa",
      example_en: "AI technologies are beginning to revolutionize how society operates.",
      topic: "Technology",
      level: "B1"
    },
  ]
};
