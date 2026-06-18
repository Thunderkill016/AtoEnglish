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
