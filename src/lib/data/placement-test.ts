// ─── CEFR Placement Test — 40 Questions ─────────────────────────────────────
// Grammar (20) + Vocabulary (12) + Reading (8)
// Levels: A1 → A2 → B1 → B2
// Based on Cambridge CEFR framework + common ESL test patterns

export type CEFRLevel = "A1" | "A2" | "B1" | "B2";
export type SkillType = "grammar" | "vocabulary" | "reading";

export interface PlacementQuestion {
  id: number;
  level: CEFRLevel;
  skill: SkillType;
  context?: string;        // passage or situation (for reading/context questions)
  question: string;
  options: [string, string, string, string];
  correctAnswer: 0 | 1 | 2 | 3;
  explanation: string;     // Vietnamese explanation
}

// ─── READING PASSAGES ────────────────────────────────────────────────────────

const PASSAGE_A2 = `My name is Sarah. I work in a hospital as a nurse. I start work at 7 o'clock in the morning and finish at 3 o'clock in the afternoon. I live near the hospital, so I usually walk to work. I like my job because I help people every day.`;

const PASSAGE_B1 = `Social media has changed the way people communicate. Many people now prefer to send messages online instead of calling or meeting in person. While this makes communication faster, some researchers believe it is reducing the quality of real friendships. A recent study found that people who spend more than three hours a day on social media feel lonelier than those who use it less.`;

// ─── QUESTIONS ───────────────────────────────────────────────────────────────

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [

  // ══════════ GRAMMAR — A1 (câu 1–5) ══════════════════════════════════════════
  {
    id: 1,
    level: "A1",
    skill: "grammar",
    question: "She ___ a student.",
    options: ["am", "is", "are", "be"],
    correctAnswer: 1,
    explanation: "Chủ ngữ 'She' (ngôi thứ 3 số ít) dùng 'is'. Am → I, Are → You/We/They.",
  },
  {
    id: 2,
    level: "A1",
    skill: "grammar",
    question: "I ___ coffee every morning.",
    options: ["drinking", "drink", "drinks", "drank"],
    correctAnswer: 1,
    explanation: "Present Simple với 'I' → dùng động từ nguyên thể 'drink'. 'Drinks' dùng cho ngôi 3 số ít.",
  },
  {
    id: 3,
    level: "A1",
    skill: "grammar",
    question: "___ you like pizza?",
    options: ["Do", "Does", "Are", "Is"],
    correctAnswer: 0,
    explanation: "Câu hỏi Yes/No với 'you' ở Present Simple → dùng 'Do'. 'Does' dùng cho He/She/It.",
  },
  {
    id: 4,
    level: "A1",
    skill: "grammar",
    question: "There ___ two chairs in the room.",
    options: ["is", "are", "am", "be"],
    correctAnswer: 1,
    explanation: "'There are' dùng với danh từ số nhiều (two chairs). 'There is' dùng với số ít.",
  },
  {
    id: 5,
    level: "A1",
    skill: "grammar",
    question: "What time ___ you go to bed?",
    options: ["does", "are", "do", "is"],
    correctAnswer: 2,
    explanation: "Câu hỏi với 'you' dùng 'do'. 'What time do you...?' là cấu trúc hỏi giờ chuẩn.",
  },

  // ══════════ GRAMMAR — A2 (câu 6–10) ═════════════════════════════════════════
  {
    id: 6,
    level: "A2",
    skill: "grammar",
    question: "Yesterday, I ___ to the supermarket and ___ some food.",
    options: ["go / buy", "went / bought", "went / buy", "go / bought"],
    correctAnswer: 1,
    explanation: "'Yesterday' → Past Simple. 'go → went', 'buy → bought'. Cả 2 động từ phải chia quá khứ.",
  },
  {
    id: 7,
    level: "A2",
    skill: "grammar",
    question: "She ___ TV when I called her.",
    options: ["watched", "was watching", "watches", "is watching"],
    correctAnswer: 1,
    explanation: "Past Continuous (was watching) diễn tả hành động đang xảy ra khi có hành động khác xen vào (called).",
  },
  {
    id: 8,
    level: "A2",
    skill: "grammar",
    question: "I have lived in this city ___ ten years.",
    options: ["since", "ago", "for", "from"],
    correctAnswer: 2,
    explanation: "'For' + khoảng thời gian (ten years). 'Since' + mốc thời gian cụ thể (since 2014).",
  },
  {
    id: 9,
    level: "A2",
    skill: "grammar",
    question: "He is ___ than his brother.",
    options: ["tall", "more tall", "tallest", "taller"],
    correctAnswer: 3,
    explanation: "So sánh hơn (comparative) với tính từ ngắn: thêm '-er'. tall → taller.",
  },
  {
    id: 10,
    level: "A2",
    skill: "grammar",
    question: "You ___ wear a seatbelt in a car. It's the law.",
    options: ["should", "must", "can", "might"],
    correctAnswer: 1,
    explanation: "'Must' diễn tả nghĩa vụ bắt buộc (obligation). 'Should' là lời khuyên, nhẹ hơn.",
  },

  // ══════════ GRAMMAR — B1 (câu 11–16) ════════════════════════════════════════
  {
    id: 11,
    level: "B1",
    skill: "grammar",
    question: "If I ___ more money, I would travel the world.",
    options: ["have", "had", "would have", "will have"],
    correctAnswer: 1,
    explanation: "Second Conditional: If + past simple, would + verb. Điều kiện không có thật ở hiện tại.",
  },
  {
    id: 12,
    level: "B1",
    skill: "grammar",
    question: "The Eiffel Tower ___ in Paris in 1889.",
    options: ["built", "was built", "has built", "is built"],
    correctAnswer: 1,
    explanation: "Câu bị động (Passive) ở Past Simple: was/were + past participle. 'Built' là V3 của 'build'.",
  },
  {
    id: 13,
    level: "B1",
    skill: "grammar",
    question: "I wish I ___ speak French fluently.",
    options: ["can", "could", "will", "would"],
    correctAnswer: 1,
    explanation: "'Wish' + past simple/could → diễn tả mong muốn về điều không có thật hiện tại.",
  },
  {
    id: 14,
    level: "B1",
    skill: "grammar",
    question: "She told me that she ___ tired.",
    options: ["is", "was", "were", "be"],
    correctAnswer: 1,
    explanation: "Reported Speech: hiện tại → quá khứ. 'is' → 'was' khi lùi thời (backshifting).",
  },
  {
    id: 15,
    level: "B1",
    skill: "grammar",
    question: "___ having breakfast, she went to work.",
    options: ["Before", "After", "While", "During"],
    correctAnswer: 1,
    explanation: "'After + V-ing' diễn tả hành động xảy ra trước. Cả 'before' và 'after' đều dùng được với V-ing.",
  },
  {
    id: 16,
    level: "B1",
    skill: "grammar",
    question: "He ___ here for 3 hours. He looks exhausted.",
    options: ["was waiting", "has been waiting", "waited", "is waiting"],
    correctAnswer: 1,
    explanation: "Present Perfect Continuous: has/have been + V-ing. Diễn tả hành động bắt đầu quá khứ, vẫn tiếp tục hoặc vừa kết thúc.",
  },

  // ══════════ GRAMMAR — B2 (câu 17–20) ════════════════════════════════════════
  {
    id: 17,
    level: "B2",
    skill: "grammar",
    question: "Had she studied harder, she ___ the exam.",
    options: ["would pass", "will have passed", "would have passed", "would have pass"],
    correctAnswer: 2,
    explanation: "Third Conditional: Had + V3, would have + V3. Điều kiện không có thật trong quá khứ.",
  },
  {
    id: 18,
    level: "B2",
    skill: "grammar",
    question: "The report needs ___ before the meeting.",
    options: ["to finish", "finishing", "to be finished", "being finish"],
    correctAnswer: 2,
    explanation: "'Need to be + past participle' = bị động với 'need'. Báo cáo cần được hoàn thành (bởi ai đó).",
  },
  {
    id: 19,
    level: "B2",
    skill: "grammar",
    question: "Not until he arrived home ___ he realize he had lost his keys.",
    options: ["he did", "did he", "does he", "had he"],
    correctAnswer: 1,
    explanation: "Inversion sau 'Not until': Not until + clause, did + subject + verb. Cấu trúc nhấn mạnh.",
  },
  {
    id: 20,
    level: "B2",
    skill: "grammar",
    question: "I'd rather you ___ tell anyone about this.",
    options: ["don't", "won't", "didn't", "wouldn't"],
    correctAnswer: 2,
    explanation: "'Would rather + subject + past simple' → diễn tả mong muốn người khác làm/không làm gì.",
  },

  // ══════════ VOCABULARY — A1 (câu 21–22) ══════════════════════════════════════
  {
    id: 21,
    level: "A1",
    skill: "vocabulary",
    question: "Choose the word that means 'the meal you eat in the morning':",
    options: ["lunch", "dinner", "breakfast", "snack"],
    correctAnswer: 2,
    explanation: "'Breakfast' = bữa sáng. Lunch = bữa trưa, Dinner = bữa tối, Snack = đồ ăn vặt.",
  },
  {
    id: 22,
    level: "A1",
    skill: "vocabulary",
    question: "Which word means the opposite of 'hot'?",
    options: ["warm", "cold", "cool", "nice"],
    correctAnswer: 1,
    explanation: "'Cold' là từ trái nghĩa với 'hot'. Warm = ấm áp, Cool = mát mẻ.",
  },

  // ══════════ VOCABULARY — A2 (câu 23–25) ═════════════════════════════════════
  {
    id: 23,
    level: "A2",
    skill: "vocabulary",
    question: "She works in a hospital. She is a ___.",
    options: ["teacher", "engineer", "nurse", "lawyer"],
    correctAnswer: 2,
    explanation: "'Nurse' = y tá/điều dưỡng, làm việc trong bệnh viện (hospital). Teacher = giáo viên, Engineer = kỹ sư.",
  },
  {
    id: 24,
    level: "A2",
    skill: "vocabulary",
    question: "I need to ___ the bus at the next stop.",
    options: ["take off", "get off", "go off", "turn off"],
    correctAnswer: 1,
    explanation: "'Get off' = xuống xe (bus/train). 'Get on' = lên xe. 'Take off' = cất cánh (máy bay) hoặc cởi ra.",
  },
  {
    id: 25,
    level: "A2",
    skill: "vocabulary",
    question: "The weather forecast says it will ___ tomorrow.",
    options: ["rain", "rainy", "raining", "rained"],
    correctAnswer: 0,
    explanation: "'It will rain' — sau 'will' dùng động từ nguyên thể. 'Rain' là động từ ở đây.",
  },

  // ══════════ VOCABULARY — B1 (câu 26–29) ═════════════════════════════════════
  {
    id: 26,
    level: "B1",
    skill: "vocabulary",
    question: "The company decided to ___ its plans to open a new office.",
    options: ["abandon", "adopt", "achieve", "approve"],
    correctAnswer: 0,
    explanation: "'Abandon' = từ bỏ, hủy bỏ kế hoạch. Adopt = áp dụng/nhận nuôi, Achieve = đạt được, Approve = chấp thuận.",
  },
  {
    id: 27,
    level: "B1",
    skill: "vocabulary",
    question: "Working long hours can have a negative ___ on your health.",
    options: ["affect", "effective", "effect", "effort"],
    correctAnswer: 2,
    explanation: "'Effect' (noun) = tác động, ảnh hưởng. 'Affect' (verb) = ảnh hưởng đến. 'Have an effect on' là collocation chuẩn.",
  },
  {
    id: 28,
    level: "B1",
    skill: "vocabulary",
    question: "She gave a very ___ speech — everyone was moved.",
    options: ["powerful", "powerfully", "power", "powered"],
    correctAnswer: 0,
    explanation: "Trước noun ('speech') cần adjective. 'Powerful' = mạnh mẽ, cảm xúc.",
  },
  {
    id: 29,
    level: "B1",
    skill: "vocabulary",
    question: "The new policy will ___ all employees, regardless of their position.",
    options: ["effect", "affect", "infect", "reflect"],
    correctAnswer: 1,
    explanation: "'Affect' (verb) = ảnh hưởng đến. Đây là lỗi affect/effect hay gặp nhất — 'affect' là động từ.",
  },

  // ══════════ VOCABULARY — B2 (câu 30–32) ═════════════════════════════════════
  {
    id: 30,
    level: "B2",
    skill: "vocabulary",
    question: "The government needs to ___ the issue of rising unemployment immediately.",
    options: ["ignore", "address", "access", "assess"],
    correctAnswer: 1,
    explanation: "'Address an issue' = giải quyết/đề cập đến vấn đề. Đây là collocation quan trọng trong business English.",
  },
  {
    id: 31,
    level: "B2",
    skill: "vocabulary",
    question: "Despite the economic ___, the company managed to grow.",
    options: ["downturn", "download", "downfall", "drawback"],
    correctAnswer: 0,
    explanation: "'Economic downturn' = suy thoái kinh tế. Downfall = sụp đổ, Drawback = nhược điểm.",
  },
  {
    id: 32,
    level: "B2",
    skill: "vocabulary",
    question: "The study's findings are ___ with previous research in this field.",
    options: ["consistent", "persistent", "resistant", "insistent"],
    correctAnswer: 0,
    explanation: "'Consistent with' = nhất quán với, phù hợp với. Academic/business English quan trọng.",
  },

  // ══════════ READING — A2 (câu 33–36) — Passage về Sarah ═════════════════════
  {
    id: 33,
    level: "A2",
    skill: "reading",
    context: PASSAGE_A2,
    question: "What is Sarah's job?",
    options: ["She is a doctor.", "She is a teacher.", "She is a nurse.", "She is a receptionist."],
    correctAnswer: 2,
    explanation: "Bài đọc nói 'I work in a hospital as a nurse.' → Sarah là y tá.",
  },
  {
    id: 34,
    level: "A2",
    skill: "reading",
    context: PASSAGE_A2,
    question: "What time does Sarah start work?",
    options: ["At 3 o'clock.", "At 7 o'clock.", "At 8 o'clock.", "At 9 o'clock."],
    correctAnswer: 1,
    explanation: "'I start work at 7 o'clock in the morning.' → Sarah bắt đầu lúc 7 giờ sáng.",
  },
  {
    id: 35,
    level: "A2",
    skill: "reading",
    context: PASSAGE_A2,
    question: "How does Sarah usually get to work?",
    options: ["By bus.", "By car.", "By bicycle.", "On foot."],
    correctAnswer: 3,
    explanation: "'I usually walk to work.' → Sarah đi bộ đến chỗ làm.",
  },
  {
    id: 36,
    level: "A2",
    skill: "reading",
    context: PASSAGE_A2,
    question: "Why does Sarah like her job?",
    options: [
      "Because the pay is good.",
      "Because she helps people every day.",
      "Because she works short hours.",
      "Because the hospital is near her house.",
    ],
    correctAnswer: 1,
    explanation: "'I like my job because I help people every day.' → Lý do Sarah thích việc là vì giúp đỡ mọi người.",
  },

  // ══════════ READING — B1 (câu 37–40) — Passage về Social Media ══════════════
  {
    id: 37,
    level: "B1",
    skill: "reading",
    context: PASSAGE_B1,
    question: "According to the passage, what has social media changed?",
    options: [
      "The way people work.",
      "The way people communicate.",
      "The way people travel.",
      "The way people study.",
    ],
    correctAnswer: 1,
    explanation: "'Social media has changed the way people communicate.' — câu đầu của bài rõ ràng.",
  },
  {
    id: 38,
    level: "B1",
    skill: "reading",
    context: PASSAGE_B1,
    question: "What do some researchers believe about social media?",
    options: [
      "It helps people make more friends.",
      "It is reducing the quality of real friendships.",
      "It makes communication slower.",
      "It improves people's mental health.",
    ],
    correctAnswer: 1,
    explanation: "'some researchers believe it is reducing the quality of real friendships' — đây là lo ngại của các nhà nghiên cứu.",
  },
  {
    id: 39,
    level: "B1",
    skill: "reading",
    context: PASSAGE_B1,
    question: "What did the study find about people who use social media a lot?",
    options: [
      "They have better friendships.",
      "They feel lonelier.",
      "They communicate better.",
      "They have more free time.",
    ],
    correctAnswer: 1,
    explanation: "'people who spend more than three hours a day on social media feel lonelier than those who use it less.'",
  },
  {
    id: 40,
    level: "B1",
    skill: "reading",
    context: PASSAGE_B1,
    question: "What is the main idea of this passage?",
    options: [
      "Social media should be banned.",
      "Online communication is always better.",
      "Social media has benefits but may harm real relationships.",
      "Researchers support unlimited social media use.",
    ],
    correctAnswer: 2,
    explanation: "Bài viết đề cập cả 2 mặt: social media làm giao tiếp nhanh hơn NHƯNG có thể làm giảm chất lượng tình bạn thật.",
  },
];

// ─── Scoring Logic ─────────────────────────────────────────────────────────────

export interface TestResult {
  totalScore: number;
  grammarScore: number;
  vocabularyScore: number;
  readingScore: number;
  cefrLevel: CEFRLevel;
  levelLabel: string;
  levelDescription: string;
  nextSteps: string[];
}

export function calculateResult(answers: Record<number, number>): TestResult {
  let totalScore = 0;
  let grammarScore = 0;
  let vocabularyScore = 0;
  let readingScore = 0;

  for (const q of PLACEMENT_QUESTIONS) {
    const userAnswer = answers[q.id];
    if (userAnswer === q.correctAnswer) {
      totalScore++;
      if (q.skill === "grammar") grammarScore++;
      else if (q.skill === "vocabulary") vocabularyScore++;
      else if (q.skill === "reading") readingScore++;
    }
  }

  // Score → CEFR level
  let cefrLevel: CEFRLevel;
  let levelLabel: string;
  let levelDescription: string;
  let nextSteps: string[];

  if (totalScore <= 10) {
    cefrLevel = "A1";
    levelLabel = "A1 — Beginner";
    levelDescription = "Mày đang ở mức khởi đầu. Đây là điểm xuất phát tốt — tất cả người giỏi tiếng Anh đều bắt đầu từ đây!";
    nextSteps = [
      "Học 10 từ vựng/ngày theo theme: chào hỏi, gia đình, số đếm",
      "Luyện phát âm IPA 44 âm cơ bản (vào trang Pronunciation)",
      "Nghe BBC Learning English 15 phút/ngày (beginner level)",
      "Học Present Simple và cách tự giới thiệu bản thân",
    ];
  } else if (totalScore <= 20) {
    cefrLevel = "A2";
    levelLabel = "A2 — Elementary";
    levelDescription = "Mày đã có nền tảng cơ bản tốt. Tiếp tục xây thêm vocab và grammar là mày sẽ vươn lên B1 nhanh thôi.";
    nextSteps = [
      "Mở rộng vocab: 1500–2000 từ theo chủ đề (du lịch, công việc, sức khoẻ)",
      "Học Past Simple, Comparatives, Modal Verbs",
      "Bắt đầu viết journal 3–5 câu tiếng Anh/ngày",
      "Language exchange HelloTalk 1–2 lần/tuần",
    ];
  } else if (totalScore <= 30) {
    cefrLevel = "B1";
    levelLabel = "B1 — Intermediate";
    levelDescription = "Mày ở mức trung cấp khá tốt! Giao tiếp độc lập trong tình huống quen thuộc. Bây giờ focus vào fluency và business English.";
    nextSteps = [
      "Nghe podcast tiếng Anh thường (News in Levels, TED Easy)",
      "Học Conditionals, Passive Voice, Reported Speech",
      "Luyện speaking với AI Roleplay trong app",
      "Bắt đầu đọc tech blog, GitHub README bằng tiếng Anh",
    ];
  } else {
    cefrLevel = "B2";
    levelLabel = "B2 — Upper Intermediate";
    levelDescription = "Mày ở mức khá cao! Có thể giao tiếp tự tin với native speakers. Focus vào business English và pitch AtoEnglish ra thị trường Mỹ.";
    nextSteps = [
      "Luyện business writing: cold email, product description",
      "Nghe podcast thường tốc độ (Indie Hackers, How I Built This)",
      "Book 1–2 buổi Italki/tháng để feedback pronunciation",
      "Tham gia cộng đồng tech Mỹ (Discord, HackerNews comments)",
    ];
  }

  return {
    totalScore,
    grammarScore,
    vocabularyScore,
    readingScore,
    cefrLevel,
    levelLabel,
    levelDescription,
    nextSteps,
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────
export const TOTAL_QUESTIONS = PLACEMENT_QUESTIONS.length;
export const GRAMMAR_COUNT = PLACEMENT_QUESTIONS.filter(q => q.skill === "grammar").length;
export const VOCAB_COUNT = PLACEMENT_QUESTIONS.filter(q => q.skill === "vocabulary").length;
export const READING_COUNT = PLACEMENT_QUESTIONS.filter(q => q.skill === "reading").length;
