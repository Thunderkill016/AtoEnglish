// ─── Grammar Topics — A1 → B2 ────────────────────────────────────────────────
// Each topic: CEFR level, title, explanation (Vietnamese), key rules, examples,
// common mistakes Vietnamese learners make, quick practice sentence

export type GrammarLevel = "A1" | "A2" | "B1" | "B2";

export interface GrammarExample {
  en: string;
  vn: string;
}

export interface GrammarTopic {
  id: string;
  level: GrammarLevel;
  title: string;
  subtitleEn: string;
  emoji: string;
  explanation: string;         // Vietnamese explanation
  structure: string;           // formula string
  rules: string[];             // bullet points
  examples: GrammarExample[];
  mistakes: string[];          // common errors Vietnamese learners make
  tip: string;                 // memory tip
}

export const GRAMMAR_TOPICS: GrammarTopic[] = [

  // ══ A1 ════════════════════════════════════════════════════════════════════

  {
    id: "present-simple",
    level: "A1",
    title: "Thì Hiện Tại Đơn",
    subtitleEn: "Present Simple",
    emoji: "🔄",
    explanation: "Diễn tả thói quen, sự thật hiển nhiên, hoặc hành động xảy ra thường xuyên. Đây là thì quan trọng nhất — nền tảng của tiếng Anh.",
    structure: "I/You/We/They + V (nguyên thể) | He/She/It + V-s/es",
    rules: [
      "Thêm -s sau động từ với He/She/It: work → works, play → plays",
      "Thêm -es nếu động từ kết thúc bằng -ch, -sh, -s, -x, -z: watch → watches",
      "Đổi -y → -ies nếu trước y là phụ âm: study → studies",
      "Câu phủ định: don't (I/You/We/They) / doesn't (He/She/It) + V",
      "Câu hỏi: Do/Does + subject + V?",
    ],
    examples: [
      { en: "I drink coffee every morning.", vn: "Tôi uống cà phê mỗi sáng." },
      { en: "She works at a hospital.", vn: "Cô ấy làm việc ở bệnh viện." },
      { en: "They don't like spicy food.", vn: "Họ không thích đồ ăn cay." },
      { en: "Does he speak English?", vn: "Anh ấy có nói tiếng Anh không?" },
    ],
    mistakes: [
      "❌ She work (thiếu -s) → ✅ She works",
      "❌ He don't like → ✅ He doesn't like",
      "❌ Does he speaks? → ✅ Does he speak?",
    ],
    tip: "Nhớ 's' với ngôi 3 số ít (He/She/It) như nhớ 's' trong 'She': She→S→+s 😄",
  },

  {
    id: "to-be",
    level: "A1",
    title: "Động Từ To Be",
    subtitleEn: "Verb To Be (am/is/are)",
    emoji: "🔵",
    explanation: "Động từ cơ bản nhất trong tiếng Anh. Dùng để mô tả, định danh, hoặc nói về trạng thái. Không có trong tiếng Việt nên hay bị bỏ quên!",
    structure: "I + am | He/She/It + is | You/We/They + are",
    rules: [
      "I am → I'm | He is → He's | They are → They're",
      "Phủ định: am not / is not (isn't) / are not (aren't)",
      "Câu hỏi: Am I? / Is he? / Are they?",
      "Dùng để nói tuổi: I am 25 years old.",
      "Dùng để mô tả: The sky is blue. They are tired.",
    ],
    examples: [
      { en: "I am a student.", vn: "Tôi là sinh viên." },
      { en: "She is from Vietnam.", vn: "Cô ấy đến từ Việt Nam." },
      { en: "We are not ready.", vn: "Chúng tôi chưa sẵn sàng." },
      { en: "Is he your brother?", vn: "Anh ấy có phải là anh trai của bạn không?" },
    ],
    mistakes: [
      "❌ I am teacher (thiếu 'a') → ✅ I am a teacher",
      "❌ She are happy → ✅ She is happy",
      "❌ He is not happy? → ✅ Is he not happy? / Isn't he happy?",
    ],
    tip: "Người Việt hay bỏ 'is/am/are' vì tiếng Việt không có — hãy luôn kiểm tra xem câu có động từ chưa!",
  },

  {
    id: "there-is-are",
    level: "A1",
    title: "There is / There are",
    subtitleEn: "Existential There",
    emoji: "📍",
    explanation: "Dùng để nói về sự tồn tại của vật/người ở đâu đó. 'There is' = số ít, 'There are' = số nhiều.",
    structure: "There is + singular noun | There are + plural noun",
    rules: [
      "There is a... (một cái, số ít) | There are two... (số nhiều)",
      "Phủ định: There isn't / There aren't",
      "Câu hỏi: Is there...? / Are there...?",
      "Rút gọn: There's a book on the table.",
    ],
    examples: [
      { en: "There is a cat in the garden.", vn: "Có một con mèo trong vườn." },
      { en: "There are three chairs here.", vn: "Có ba chiếc ghế ở đây." },
      { en: "Is there a toilet nearby?", vn: "Có nhà vệ sinh gần đây không?" },
      { en: "There aren't any shops here.", vn: "Không có cửa hàng nào ở đây." },
    ],
    mistakes: [
      "❌ There is many people → ✅ There are many people",
      "❌ Is there a books? → ✅ Are there any books?",
    ],
    tip: "'There is/are' = 'Có...' trong tiếng Việt. Số nhiều nhớ dùng 'are'!",
  },

  // ══ A2 ════════════════════════════════════════════════════════════════════

  {
    id: "past-simple",
    level: "A2",
    title: "Thì Quá Khứ Đơn",
    subtitleEn: "Past Simple",
    emoji: "⏪",
    explanation: "Diễn tả hành động đã xảy ra và kết thúc trong quá khứ. Thường đi với các từ: yesterday, last week, ago, in 2020...",
    structure: "Subject + V-ed (regular) / V2 (irregular)",
    rules: [
      "Động từ có quy tắc: thêm -ed → work → worked, play → played",
      "Động từ bất quy tắc: phải học thuộc → go → went, buy → bought, see → saw",
      "Phủ định: didn't + V (nguyên thể): She didn't go.",
      "Câu hỏi: Did + subject + V? → Did you see it?",
      "Dấu hiệu nhận biết: yesterday, last night, ago, in [year]",
    ],
    examples: [
      { en: "I went to school yesterday.", vn: "Hôm qua tôi đến trường." },
      { en: "She didn't eat breakfast.", vn: "Cô ấy không ăn sáng." },
      { en: "Did you watch the game?", vn: "Bạn có xem trận đấu không?" },
      { en: "They bought a new phone last week.", vn: "Tuần trước họ mua điện thoại mới." },
    ],
    mistakes: [
      "❌ I didn't went → ✅ I didn't go (sau didn't dùng V nguyên thể!)",
      "❌ Did he went? → ✅ Did he go?",
      "❌ She goed → ✅ She went (go là động từ bất quy tắc)",
    ],
    tip: "Sau 'didn't' và 'did...?' luôn dùng động từ NGUYÊN thể, không thêm -ed!",
  },

  {
    id: "present-continuous",
    level: "A2",
    title: "Thì Hiện Tại Tiếp Diễn",
    subtitleEn: "Present Continuous",
    emoji: "▶️",
    explanation: "Diễn tả hành động đang xảy ra ngay lúc nói, hoặc kế hoạch tương lai đã được sắp xếp.",
    structure: "Subject + am/is/are + V-ing",
    rules: [
      "am/is/are + V-ing: I am eating, She is working, They are playing",
      "Phủ định: am/is/are + not + V-ing",
      "Câu hỏi: Am/Is/Are + subject + V-ing?",
      "Không dùng với state verbs: know, like, want, love, believe",
      "Dấu hiệu: now, right now, at the moment, currently",
    ],
    examples: [
      { en: "I am studying English now.", vn: "Tôi đang học tiếng Anh ngay bây giờ." },
      { en: "She is cooking dinner.", vn: "Cô ấy đang nấu bữa tối." },
      { en: "Are you listening to me?", vn: "Bạn có đang nghe tôi không?" },
      { en: "We are meeting tomorrow at 3.", vn: "Chúng tôi gặp nhau vào 3 giờ ngày mai." },
    ],
    mistakes: [
      "❌ I am knowing the answer → ✅ I know the answer (know = state verb)",
      "❌ She is study → ✅ She is studying",
      "❌ He are working → ✅ He is working",
    ],
    tip: "Các state verbs (know, want, like, love, need, understand) KHÔNG dùng được ở thì tiếp diễn!",
  },

  {
    id: "comparative-superlative",
    level: "A2",
    title: "So Sánh Hơn & Nhất",
    subtitleEn: "Comparatives & Superlatives",
    emoji: "📊",
    explanation: "Dùng để so sánh 2 thứ (hơn) hoặc 1 thứ với tất cả (nhất). Rất quan trọng trong giao tiếp hàng ngày.",
    structure: "Shorter adj + -er than | Longer adj: more + adj + than | the + adj + -est / the most + adj",
    rules: [
      "Tính từ ngắn (1 âm tiết): thêm -er/-est: tall → taller → the tallest",
      "Tính từ dài (2+ âm tiết): more/most: beautiful → more beautiful → the most beautiful",
      "Bất quy tắc: good → better → the best | bad → worse → the worst",
      "Dùng 'than' sau so sánh hơn: She is taller THAN me.",
      "Dùng 'the' trước so sánh nhất: He is THE tallest in class.",
    ],
    examples: [
      { en: "This book is cheaper than that one.", vn: "Cuốn sách này rẻ hơn cuốn kia." },
      { en: "She is more intelligent than her brother.", vn: "Cô ấy thông minh hơn anh trai." },
      { en: "This is the best coffee I've ever had!", vn: "Đây là cà phê ngon nhất tôi từng uống!" },
      { en: "Mount Everest is the highest mountain in the world.", vn: "Đỉnh Everest là ngọn núi cao nhất thế giới." },
    ],
    mistakes: [
      "❌ more tall → ✅ taller (tính từ 1 âm tiết dùng -er)",
      "❌ She is more better → ✅ She is better",
      "❌ He is tallest → ✅ He is THE tallest",
    ],
    tip: "'good-better-best / bad-worse-worst' là 2 bộ bất quy tắc PHẢI nhớ!",
  },

  {
    id: "modals-a2",
    level: "A2",
    title: "Động Từ Khiếm Khuyết",
    subtitleEn: "Modal Verbs (can/must/should)",
    emoji: "🎛️",
    explanation: "Các động từ đặc biệt thể hiện khả năng, nghĩa vụ, hoặc lời khuyên. Sau modal LUÔN dùng động từ nguyên thể.",
    structure: "Subject + modal + V (base form)",
    rules: [
      "can = khả năng hiện tại: I can swim. / She can't drive.",
      "must = bắt buộc mạnh: You must wear a seatbelt.",
      "should = lời khuyên: You should sleep more.",
      "could = khả năng trong quá khứ hoặc đề nghị lịch sự",
      "Sau modal KHÔNG bao giờ thêm -s hay -ed",
    ],
    examples: [
      { en: "Can you help me, please?", vn: "Bạn có thể giúp tôi không?" },
      { en: "You must submit the form today.", vn: "Bạn phải nộp biểu mẫu hôm nay." },
      { en: "You should drink more water.", vn: "Bạn nên uống nhiều nước hơn." },
      { en: "She could speak French when she was young.", vn: "Hồi nhỏ cô ấy có thể nói tiếng Pháp." },
    ],
    mistakes: [
      "❌ She cans swim → ✅ She can swim",
      "❌ You must to go → ✅ You must go (không có 'to' sau modal)",
      "❌ You should studied → ✅ You should study",
    ],
    tip: "Modal + VERB BASE — không bao giờ có 'to' hay thêm -s/-ed sau modal!",
  },

  // ══ B1 ════════════════════════════════════════════════════════════════════

  {
    id: "present-perfect",
    level: "B1",
    title: "Thì Hiện Tại Hoàn Thành",
    subtitleEn: "Present Perfect",
    emoji: "🔗",
    explanation: "Kết nối quá khứ với hiện tại. Dùng khi hành động xảy ra trong quá khứ nhưng vẫn còn liên quan đến hiện tại, hoặc khi không biết/không quan trọng thời điểm cụ thể.",
    structure: "Subject + have/has + past participle (V3)",
    rules: [
      "have/has + V3: I have eaten, She has gone, They have seen",
      "Dùng với: ever, never, already, yet, just, for, since",
      "for + khoảng thời gian: for 3 years | since + mốc: since 2020",
      "Khác Past Simple: Present Perfect = liên quan hiện tại; Past Simple = xong hẳn",
      "Have you EVER been to Japan? (trải nghiệm cuộc đời)",
    ],
    examples: [
      { en: "I have lived here for 5 years.", vn: "Tôi đã sống ở đây được 5 năm (và vẫn đang sống)." },
      { en: "She has just finished her report.", vn: "Cô ấy vừa mới hoàn thành báo cáo." },
      { en: "Have you ever eaten sushi?", vn: "Bạn đã từng ăn sushi chưa?" },
      { en: "I haven't seen him yet.", vn: "Tôi vẫn chưa gặp anh ấy." },
    ],
    mistakes: [
      "❌ I have went → ✅ I have gone (V3 của go là gone)",
      "❌ Did you ever visit? → ✅ Have you ever visited? (trải nghiệm → Present Perfect)",
      "❌ I live here since 2020 → ✅ I have lived here since 2020",
    ],
    tip: "Since = từ MỐC thời gian | For = KHOẢNG thời gian. 'I've studied English FOR 2 years / SINCE 2022.'",
  },

  {
    id: "second-conditional",
    level: "B1",
    title: "Câu Điều Kiện Loại 2",
    subtitleEn: "Second Conditional",
    emoji: "💭",
    explanation: "Diễn tả tình huống KHÔNG có thật hoặc khó xảy ra ở hiện tại/tương lai. Hay dùng để nói về ước mơ, giả thuyết.",
    structure: "If + past simple, ... would + V",
    rules: [
      "If I had more money, I would travel the world.",
      "Mệnh đề 'if' dùng past simple (dù nói về hiện tại/tương lai)",
      "Mệnh đề chính dùng would/could/might + V nguyên thể",
      "Có thể đổi trật tự: I would travel... if I had more money.",
      "Với 'be': dùng 'were' cho tất cả chủ ngữ: If I were you...",
    ],
    examples: [
      { en: "If I were rich, I would buy a house.", vn: "Nếu tôi giàu, tôi sẽ mua nhà." },
      { en: "What would you do if you lost your job?", vn: "Bạn sẽ làm gì nếu mất việc?" },
      { en: "If she studied more, she could pass the exam.", vn: "Nếu cô ấy học nhiều hơn, cô ấy có thể vượt qua kỳ thi." },
      { en: "I wouldn't do that if I were you.", vn: "Nếu là bạn, tôi sẽ không làm vậy." },
    ],
    mistakes: [
      "❌ If I would have... → ✅ If I had... (mệnh đề if KHÔNG dùng would)",
      "❌ If I was you → ✅ If I were you (dùng 'were' cho mọi chủ ngữ)",
      "❌ I will do it if I have time → (đây là Conditional 1, không phải 2)",
    ],
    tip: "Conditional 2 = nói về ĐIỀU KHÔNG CÓ THẬT. 'If I were a bird' — tôi không phải chim!",
  },

  {
    id: "passive-voice",
    level: "B1",
    title: "Câu Bị Động",
    subtitleEn: "Passive Voice",
    emoji: "🔀",
    explanation: "Khi hành động quan trọng hơn người thực hiện, hoặc không biết ai thực hiện. Rất phổ biến trong văn viết, báo chí, business.",
    structure: "Subject + be (chia theo thì) + past participle (V3)",
    rules: [
      "Present: The report is written every day.",
      "Past: The letter was sent yesterday.",
      "Future: The project will be completed next week.",
      "Thêm 'by + agent' nếu muốn nói ai làm: written by Tom",
      "Biến chủ động → bị động: Object → Subject, Verb → be + V3",
    ],
    examples: [
      { en: "English is spoken all over the world.", vn: "Tiếng Anh được nói trên toàn thế giới." },
      { en: "The Eiffel Tower was built in 1889.", vn: "Tháp Eiffel được xây dựng năm 1889." },
      { en: "The meeting has been cancelled.", vn: "Cuộc họp đã bị hủy." },
      { en: "The package will be delivered tomorrow.", vn: "Gói hàng sẽ được giao vào ngày mai." },
    ],
    mistakes: [
      "❌ The book was wrote by... → ✅ was written (V3 của write là written)",
      "❌ The report written by... → ✅ The report was written (thiếu 'be')",
      "❌ English is speaking → ✅ English is spoken",
    ],
    tip: "Bị động = be + V3. Nhớ chia 'be' theo thì: is/are → was/were → will be → has/have been",
  },

  {
    id: "reported-speech",
    level: "B1",
    title: "Lời Nói Gián Tiếp",
    subtitleEn: "Reported Speech",
    emoji: "💬",
    explanation: "Khi kể lại điều người khác đã nói. Thì động từ phải lùi lại một bậc (backshift).",
    structure: "She said (that) + [backshifted clause]",
    rules: [
      "Present Simple → Past Simple: 'I work here' → She said she worked there.",
      "Present Continuous → Past Continuous: 'I'm eating' → He said he was eating.",
      "Will → Would: 'I will help' → She said she would help.",
      "Can → Could, May → Might, Must → Had to",
      "Đổi đại từ: I → he/she, my → his/her, here → there",
    ],
    examples: [
      { en: "He said he was tired.", vn: "Anh ấy nói rằng anh ấy mệt. (gốc: 'I am tired')" },
      { en: "She told me she would call later.", vn: "Cô ấy nói với tôi sẽ gọi lại sau." },
      { en: "They said they had already eaten.", vn: "Họ nói họ đã ăn rồi." },
      { en: "He asked if I could help him.", vn: "Anh ấy hỏi tôi có thể giúp anh ấy không." },
    ],
    mistakes: [
      "❌ She said she is tired → ✅ She said she was tired (lùi thì!)",
      "❌ He said me that... → ✅ He told me that... / He said that...",
      "❌ She said will come → ✅ She said she would come",
    ],
    tip: "told = nói với ai đó (told ME) | said = nói chung chung (said that). Đừng nhầm!",
  },

  // ══ B2 ════════════════════════════════════════════════════════════════════

  {
    id: "third-conditional",
    level: "B2",
    title: "Câu Điều Kiện Loại 3",
    subtitleEn: "Third Conditional",
    emoji: "⏳",
    explanation: "Diễn tả điều không có thật trong QUÁ KHỨ — sự tiếc nuối, điều đáng lẽ đã xảy ra nhưng không xảy ra.",
    structure: "If + had + V3, ... would have + V3",
    rules: [
      "If I had studied harder, I would have passed the exam.",
      "Mệnh đề if: had + V3 (Past Perfect)",
      "Mệnh đề chính: would/could/might + have + V3",
      "Inverted form (formal): Had I studied... (bỏ 'if', đảo 'had')",
      "Thể hiện sự tiếc nuối, hối hận về quá khứ",
    ],
    examples: [
      { en: "If she had left earlier, she wouldn't have missed the flight.", vn: "Nếu cô ấy đi sớm hơn, cô ấy đã không bỏ lỡ chuyến bay." },
      { en: "I would have called you if I had known.", vn: "Tôi đã gọi cho bạn nếu tôi biết." },
      { en: "Had he listened to the advice, things would have been different.", vn: "Nếu anh ấy nghe lời khuyên, mọi thứ đã khác rồi." },
      { en: "Could you have done better?", vn: "Bạn có thể làm tốt hơn không?" },
    ],
    mistakes: [
      "❌ If I would have gone... → ✅ If I had gone... (mệnh đề if dùng Past Perfect, không would)",
      "❌ I would have went → ✅ I would have gone (V3 của go)",
      "❌ If I had went → ✅ If I had gone",
    ],
    tip: "Conditional 3 = tiếc về QUÁ KHỨ. Nhớ: IF + had V3 → WOULD have V3. Hai lần 'have'!",
  },

  {
    id: "inversion",
    level: "B2",
    title: "Đảo Ngữ",
    subtitleEn: "Inversion for Emphasis",
    emoji: "🔃",
    explanation: "Đảo trật tự để nhấn mạnh hoặc thể hiện văn phong trang trọng. Rất phổ biến trong IELTS writing và business English.",
    structure: "Negative adverb + auxiliary + subject + verb",
    rules: [
      "Never have I seen such a beautiful place.",
      "Not only did she win, but she also broke the record.",
      "Hardly had he arrived when the meeting started.",
      "Only then did I realise the truth.",
      "Dùng sau: Never, Not only, Rarely, Seldom, Only then, Hardly, No sooner",
    ],
    examples: [
      { en: "Never have I felt so proud.", vn: "Tôi chưa bao giờ cảm thấy tự hào đến vậy." },
      { en: "Not only is she talented, but she is also hardworking.", vn: "Cô ấy không chỉ tài năng mà còn chăm chỉ." },
      { en: "Rarely does he make a mistake.", vn: "Anh ấy hiếm khi mắc lỗi." },
      { en: "Only after the meeting did we know the truth.", vn: "Chỉ sau cuộc họp chúng tôi mới biết sự thật." },
    ],
    mistakes: [
      "❌ Never I have seen → ✅ Never have I seen (auxiliary trước subject)",
      "❌ Not only she won → ✅ Not only did she win",
    ],
    tip: "Đảo ngữ = đảo auxiliary (have/did/do/is...) lên trước subject. Giống câu hỏi Yes/No!",
  },

  {
    id: "wish-if-only",
    level: "B2",
    title: "Wish / If Only",
    subtitleEn: "Expressing Wishes & Regrets",
    emoji: "⭐",
    explanation: "Dùng để diễn tả ước muốn về điều không có thật (hiện tại hoặc quá khứ), hoặc phàn nàn về hành vi ai đó.",
    structure: "I wish + past simple (present wish) | I wish + past perfect (past regret)",
    rules: [
      "Wish + past simple = ước về hiện tại: I wish I could fly.",
      "Wish + past perfect = tiếc về quá khứ: I wish I had studied harder.",
      "Wish + would = phàn nàn: I wish you would stop talking!",
      "If only = wish mạnh hơn: If only I had more time!",
      "Dùng 'were' cho tất cả chủ ngữ: I wish I were taller.",
    ],
    examples: [
      { en: "I wish I could speak Spanish.", vn: "Ước gì tôi có thể nói tiếng Tây Ban Nha." },
      { en: "I wish I had saved more money.", vn: "Ước gì tôi đã tiết kiệm nhiều tiền hơn." },
      { en: "If only the weather were better!", vn: "Giá mà thời tiết đẹp hơn!" },
      { en: "I wish you would listen to me.", vn: "Tôi ước bạn lắng nghe tôi." },
    ],
    mistakes: [
      "❌ I wish I have → ✅ I wish I had (past simple sau wish)",
      "❌ I wish I was taller → ✅ I wish I were taller (formal)",
      "❌ I wish I would go → ✅ I wish I could go (wish + would chỉ dùng với chủ thể khác)",
    ],
    tip: "Wish + PAST SIMPLE = ước hiện tại | Wish + PAST PERFECT = tiếc quá khứ. Luôn lùi 1 thì!",
  },
];

// Helpers
export const TOPICS_BY_LEVEL = (level: GrammarLevel) =>
  GRAMMAR_TOPICS.filter(t => t.level === level);

export const LEVEL_COLORS: Record<GrammarLevel, string> = {
  A1: "#3b82f6",
  A2: "#8b5cf6",
  B1: "#f59e0b",
  B2: "#10b981",
};

export const LEVEL_BG: Record<GrammarLevel, string> = {
  A1: "#3b82f610",
  A2: "#8b5cf610",
  B1: "#f59e0b10",
  B2: "#10b98110",
};
