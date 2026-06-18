export interface VocabularyItem {
  word: string;
  phonetic: string;
  meaning_vn: string;
  example_en: string;
  topic: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1";
}

export const UNIT_VOCABULARY: Record<string, VocabularyItem[]> = {
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
