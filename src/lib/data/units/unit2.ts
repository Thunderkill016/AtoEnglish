import { UnitData } from "@/components/learn/UnitTemplate";

export const unit2: UnitData = {
  unitId: "unit-2",
  title: "Unit 2: Daily Routines & Time",
  level: "A1",
  xp: 80,
  estimatedTime: 40,
  description: "Học cách nói về hoạt động thường nhật và hỏi/trả lời về giờ giấc bằng tiếng Anh.",
  badgeName: "Người Chăm Chỉ",
  badgeEmoji: "⏰",
  warmupGreetings: [
    {
      emoji: "🌅",
      en: "I wake up at 6 AM every day.",
      vn: "Tôi thức dậy lúc 6 giờ sáng mỗi ngày.",
      context: "Nói về giờ thức dậy"
    },
    {
      emoji: "🍳",
      en: "What time do you have breakfast?",
      vn: "Bạn ăn sáng lúc mấy giờ?",
      context: "Hỏi về giờ ăn sáng"
    },
    {
      emoji: "🏫",
      en: "I go to school at 7:30.",
      vn: "Tôi đi học lúc 7 giờ 30 phút.",
      context: "Nói về giờ đi học"
    }
  ],
  culturalNote: "Trong tiếng Anh giao tiếp hàng ngày, người bản xứ thường nói <span class=\"text-emerald-400 font-semibold\">seven thirty</span> thay vì <span class=\"text-emerald-400 font-semibold\">half past seven</span> vì nó ngắn gọn và tự nhiên hơn trong hầu hết các ngữ cảnh hiện đại.",
  vocab: [
    {
      id: 1,
      word: "wake up", emoji: "⏰",
      phonetic: "/weɪk ʌp/",
      meaning: "Thức dậy",
      example: "I usually wake up at 6 AM.",
      audio: "/audio/unit2/wake_up.mp3"
    },
    {
      id: 2,
      word: "brush teeth", emoji: "🦷",
      phonetic: "/brʌʃ tiːθ/",
      meaning: "Đánh răng",
      example: "You should brush your teeth twice a day.",
      audio: "/audio/unit2/brush_teeth.mp3"
    },
    {
      id: 3,
      word: "wash face", emoji: "🧼",
      phonetic: "/wɒʃ feɪs/",
      meaning: "Rửa mặt",
      example: "I wash my face with cold water.",
      audio: "/audio/unit2/wash_face.mp3"
    },
    {
      id: 4,
      word: "eat breakfast", emoji: "🍳",
      phonetic: "/iːt ˈbrek.fəst/",
      meaning: "Ăn sáng",
      example: "Do you eat breakfast every morning?",
      audio: "/audio/unit2/eat_breakfast.mp3"
    },
    {
      id: 5,
      word: "go to school", emoji: "🎒",
      phonetic: "/ɡəʊ tuː skuːl/",
      meaning: "Đi học",
      example: "We go to school by bus.",
      audio: "/audio/unit2/go_to_school.mp3"
    },
    {
      id: 6,
      word: "go to work", emoji: "🏢",
      phonetic: "/ɡəʊ tuː wɜːk/",
      meaning: "Đi làm",
      example: "My father goes to work at 8 o'clock.",
      audio: "/audio/unit2/go_to_work.mp3"
    },
    {
      id: 7,
      word: "watch TV", emoji: "📺",
      phonetic: "/wɒtʃ ˌtiːˈviː/",
      meaning: "Xem tivi",
      example: "I watch TV for an hour after dinner.",
      audio: "/audio/unit2/watch_tv.mp3"
    },
    {
      id: 8,
      word: "go to bed", emoji: "😴",
      phonetic: "/ɡəʊ tuː bed/",
      meaning: "Đi ngủ",
      example: "I go to bed at 10 PM.",
      audio: "/audio/unit2/go_to_bed.mp3"
    },
    {
      id: 9,
      word: "what time is it?", emoji: "🕐",
      phonetic: "/wɒt taɪm ɪz ɪt/",
      meaning: "Mấy giờ rồi?",
      example: "Excuse me, what time is it?",
      audio: "/audio/unit2/what_time_is_it.mp3"
    },
    {
      id: 10,
      word: "o'clock", emoji: "🕐",
      phonetic: "/əˈklɒk/",
      meaning: "Giờ đúng",
      example: "It is exactly 7 o'clock.",
      audio: "/audio/unit2/oclock.mp3"
    },
    {
      id: 11,
      word: "half past",
      phonetic: "/hɑːf pɑːst/",
      meaning: "Giờ rưỡi / Qua 30 phút",
      example: "We meet at half past eight.",
      audio: "/audio/unit2/half_past.mp3"
    },
    {
      id: 12,
      word: "quarter",
      phonetic: "/ˈkwɔː.tər/",
      meaning: "15 phút",
      example: "It is a quarter past nine.",
      audio: "/audio/unit2/quarter.mp3"
    }
  ],
  dialogues: [
    {
      id: 1,
      title: "Hội thoại: Daily Schedule",
      audio: "/audio/unit2/dialogue1.mp3",
      desc: "Sarah và Alex thảo luận về thời gian biểu hàng ngày của mình.",
      lines: [
        {
          id: "l1",
          speaker: "Alex",
          text: "What time do you wake up, Sarah?",
          translation: "Cậu thức dậy lúc mấy giờ vậy Sarah?"
        },
        {
          id: "l2",
          speaker: "Sarah",
          text: "I usually wake up at 6:30 AM.",
          translation: "Tớ thường thức dậy lúc 6 giờ 30 sáng."
        },
        {
          id: "l3",
          speaker: "Alex",
          text: "That is early! Do you eat breakfast at home?",
          translation: "Sớm thật đấy! Cậu có ăn sáng ở nhà không?"
        },
        {
          id: "l4",
          speaker: "Sarah",
          text: "Yes, I eat breakfast at 7 o'clock, and then I go to school.",
          translation: "Có, tớ ăn sáng lúc 7 giờ đúng, rồi sau đó đi học."
        },
        {
          id: "l5",
          speaker: "Alex",
          text: "What time do you go to bed?",
          translation: "Mấy giờ thì cậu đi ngủ?"
        },
        {
          id: "l6",
          speaker: "Sarah",
          text: "I go to bed at 10 PM. And you?",
          translation: "Tớ đi ngủ lúc 10 giờ tối. Còn cậu thì sao?"
        }
      ]
    }
  ],
  listenAndChoose: [
    {
      id: "lc1",
      audio_text: "I eat breakfast at seven o'clock.",
      options: ["7:00 AM", "7:30 AM", "8:00 AM", "6:30 AM"],
      answer: "7:00 AM"
    },
    {
      id: "lc2",
      audio_text: "What time do you go to bed? I go to bed at half past ten.",
      options: ["10:00 PM", "10:30 PM", "11:00 PM", "9:30 PM"],
      answer: "10:30 PM"
    },
    {
      id: "lc3",
      audio_text: "I go to work by bus at eight fifteen.",
      options: ["8:00 AM", "8:15 AM", "8:30 AM", "8:45 AM"],
      answer: "8:15 AM"
    }
  ],
  speaking: {
    level1Prompt: "I usually wake up at {input}.",
    level1Placeholder: "Ví dụ: 6 AM",
    level2Situation: "Hãy nói về thời gian biểu buổi sáng của bạn cho bạn học nghe.",
    level2Hint: "I wake up at [giờ]. Then I brush my teeth, eat breakfast, and go to school at [giờ]."
  },

  grammar: {
    title: "Present Simple — Thì Hiện Tại Đơn",
    rule: "I / You / We / They + V  |  He / She / It + V-s/-es",
    conjugation: [
      { subject: "I / You", form: "wake up", example: "I wake up at 6 AM." },
      { subject: "He / She", form: "wakes up", example: "She wakes up at 7 AM." },
      { subject: "We / They", form: "eat", example: "They eat breakfast together." },
      { subject: "He / She", form: "eats", example: "He eats at 8 o'clock." },
    ],
    examples: [
      { en: "I go to school every day.", vn: "Tôi đi học mỗi ngày." },
      { en: "She brushes her teeth in the morning.", vn: "Cô ấy đánh răng vào buổi sáng." },
      { en: "They watch TV at night.", vn: "Họ xem TV vào buổi tối." },
      { en: "He goes to bed at 10 PM.", vn: "Anh ấy đi ngủ lúc 10 giờ tối." },
    ],
    tip: "Khi chủ ngữ là He/She/It, thêm -s vào cuối động từ (go → goes, watch → watches, brush → brushes).",
    ccq: {
      question: "Chọn câu đúng với chủ ngữ 'She':",
      options: ["She go to school.", "She goes to school.", "She going to school.", "She goed to school."],
      answer: "She goes to school.",
    },
  },

  matchingExercise: {
    title: "Nối hoạt động với nghĩa tiếng Việt",
    pairs: [
      { left: "Wake up", right: "Thức dậy" },
      { left: "Brush teeth", right: "Đánh răng" },
      { left: "Eat breakfast", right: "Ăn sáng" },
      { left: "Go to school", right: "Đi học" },
      { left: "Go to bed", right: "Đi ngủ" },
    ],
  },

  practiceQuiz: [
    { id: "pq1", question: "She ___ to school every day. (Chọn dạng đúng)", options: ["go", "goes", "going", "gone"], answer: "goes", type: "multiple-choice" },
    { id: "pq2", question: "Từ nào mô tả hành động 'Thức dậy'?", options: ["Go to bed", "Wake up", "Eat breakfast", "Wash face"], answer: "Wake up", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ còn thiếu: 'I ___ breakfast at 7 AM every day.'", options: [], answer: "eat", type: "cloze" },
  ],

  quiz: [
    {
      id: "q1",
      question: "Từ nào có nghĩa là 'Đi ngủ'?",
      options: ["Go to school", "Go to bed", "Wake up", "Go to work"],
      answer: "Go to bed",
      type: "multiple-choice"
    },
    {
      id: "q2",
      question: "Cách nói '7 giờ 30 phút' là gì?",
      options: ["Seven o'clock", "Half past seven", "Quarter past seven", "Seven fifteen"],
      answer: "Half past seven",
      type: "multiple-choice"
    },
    {
      id: "q3",
      question: "He ___ his teeth every morning. (Chọn dạng đúng)",
      options: ["brush", "brushes", "brushing", "brushed"],
      answer: "brushes",
      type: "multiple-choice"
    },
    {
      id: "q4",
      question: "Điền từ còn thiếu: 'She ___ to bed at 10 PM.'",
      options: [],
      answer: "goes",
      type: "cloze"
    },
    {
      id: "q5",
      question: "Từ nào KHÔNG phải hoạt động buổi sáng thông thường?",
      options: ["Wake up", "Brush teeth", "Eat breakfast", "Watch TV all day"],
      answer: "Watch TV all day",
      type: "multiple-choice"
    }
  ]
};

export default unit2;
