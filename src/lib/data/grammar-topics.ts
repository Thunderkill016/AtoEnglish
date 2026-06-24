// ─── Grammar Topics — A1 → B2 ────────────────────────────────────────────────
// Each topic: CEFR level, title, explanation (Vietnamese), key rules, examples,
// common mistakes Vietnamese learners make, quick practice sentence

export type GrammarLevel = "A0" | "A1" | "A2" | "B1" | "B2";

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

  // ══ A0 ════════════════════════════════════════════════════════════════════

  {
    id: "a0-greetings",
    level: "A0",
    title: "Câu Chào Hỏi Cơ Bản",
    subtitleEn: "Basic Greetings & Introductions",
    emoji: "👋",
    explanation: "Những câu chào hỏi và giới thiệu bản thân thiết yếu nhất. Đây là điều đầu tiên cần học khi bắt đầu học tiếng Anh.",
    structure: "Hello / Hi | Good morning/afternoon/evening | My name is... | I am...",
    rules: [
      "Hello / Hi = xin chào (bất kỳ thời điểm nào)",
      "Good morning (sáng) | Good afternoon (chiều) | Good evening (tối)",
      "My name is [Name]. = Tên tôi là...",
      "I am from Vietnam. = Tôi đến từ Việt Nam.",
      "Nice to meet you! = Rất vui được gặp bạn!",
    ],
    examples: [
      { en: "Hello! My name is Lan.", vn: "Xin chào! Tên tôi là Lan." },
      { en: "Good morning! How are you?", vn: "Chào buổi sáng! Bạn có khỏe không?" },
      { en: "I'm fine, thank you.", vn: "Tôi khỏe, cảm ơn." },
      { en: "Nice to meet you!", vn: "Rất vui được gặp bạn!" },
    ],
    mistakes: [
      "❌ Good morning, how you? → ✅ How ARE you? (không bỏ 'are')",
      "❌ My name Lan → ✅ My name IS Lan (cần động từ 'is')",
      "❌ You're welcome (khi chưa được cảm ơn) → chỉ dùng khi ai đó nói 'thank you'",
    ],
    tip: "Luôn dùng 'I AM' (không phải 'I IS' hay 'I ARE'). 'AM' chỉ dùng cho 'I'!",
  },

  {
    id: "a0-numbers",
    level: "A0",
    title: "Số Đếm & Giá Tiền",
    subtitleEn: "Numbers & Prices",
    emoji: "🔢",
    explanation: "Học cách đọc số và hỏi giá — kỹ năng sinh tồn khi mua sắm hoặc giao dịch bằng tiếng Anh.",
    structure: "How much is this? | It costs... | That's... dollars",
    rules: [
      "1-10: one, two, three, four, five, six, seven, eight, nine, ten",
      "11-20: eleven, twelve, thirteen... twenty",
      "Chục: twenty, thirty, forty, fifty, sixty, seventy, eighty, ninety",
      "How much is this/that? = Cái này/kia giá bao nhiêu?",
      "Sau số > 1: danh từ số nhiều → 'two dollars', 'five chairs'",
    ],
    examples: [
      { en: "How much is this shirt?", vn: "Cái áo này giá bao nhiêu?" },
      { en: "It costs fifty thousand dong.", vn: "Nó giá năm mươi nghìn đồng." },
      { en: "That's twenty-five dollars.", vn: "Đó là hai mươi lăm đô la." },
      { en: "I have ten apples.", vn: "Tôi có mười quả táo." },
    ],
    mistakes: [
      "❌ How many is this? → ✅ How MUCH is this? (giá tiền dùng 'much')",
      "❌ It cost five dollar → ✅ It costs five dollars (số nhiều!)",
      "❌ I have ten apple → ✅ I have ten apples (sau số > 1 phải có -s)",
    ],
    tip: "'How MUCH' hỏi giá (không đếm được). 'How MANY' hỏi số lượng (đếm được).",
  },

  {
    id: "a0-articles",
    level: "A0",
    title: "Mạo Từ A / An / The",
    subtitleEn: "Articles: A, An, The",
    emoji: "🔤",
    explanation: "Tiếng Anh có 3 mạo từ quan trọng. Đây là lỗi số 1 của người Việt học tiếng Anh vì tiếng Việt không có mạo từ!",
    structure: "A + phụ âm | An + nguyên âm | The + đã biết/cụ thể",
    rules: [
      "A = một cái (phụ âm): a book, a car, a dog",
      "An = một cái (nguyên âm a,e,i,o,u): an apple, an hour, an egg",
      "The = cái đã được đề cập, cụ thể, duy nhất: the sun, the president",
      "Không dùng mạo từ: tên người, thành phố, quốc gia, danh từ chung chung",
      "I am a teacher. (nghề nghiệp cần 'a'!)",
    ],
    examples: [
      { en: "I have a dog. The dog is very cute.", vn: "Tôi có một con chó. Con chó đó rất dễ thương." },
      { en: "She is an engineer.", vn: "Cô ấy là kỹ sư." },
      { en: "The sky is blue.", vn: "Bầu trời màu xanh." },
      { en: "I am a student at University.", vn: "Tôi là sinh viên đại học." },
    ],
    mistakes: [
      "❌ I am teacher → ✅ I am A teacher (nghề nghiệp cần mạo từ!)",
      "❌ She has a umbrella → ✅ She has AN umbrella ('u' là nguyên âm)",
      "❌ I go to the school every day → ✅ I go to school (trường học nói chung, không cần 'the')",
    ],
    tip: "'An' trước nguyên âm ÂM THANH (không phải chữ cái): 'an hour' (âm /aʊ/) nhưng 'a university' (âm /juː/)!",
  },

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

  {
    id: "question-words",
    level: "A1",
    title: "Từ Hỏi (Wh-)",
    subtitleEn: "Question Words (What/Who/Where/When/Why/How)",
    emoji: "❓",
    explanation: "6 từ hỏi quan trọng nhất giúp bạn tạo được hàng trăm câu hỏi. Nền tảng của giao tiếp hàng ngày.",
    structure: "Wh- word + auxiliary + subject + verb?",
    rules: [
      "What = cái gì (What is your name?)",
      "Who = ai (Who is that?)",
      "Where = ở đâu (Where do you live?)",
      "When = khi nào (When is the meeting?)",
      "Why = tại sao (Why are you late?)",
      "How = như thế nào (How are you? / How much?)",
    ],
    examples: [
      { en: "What do you do for a living?", vn: "Bạn làm nghề gì?" },
      { en: "Where is the nearest hospital?", vn: "Bệnh viện gần nhất ở đâu?" },
      { en: "When does the bus arrive?", vn: "Xe buýt đến lúc mấy giờ?" },
      { en: "How much does this cost?", vn: "Cái này giá bao nhiêu?" },
    ],
    mistakes: [
      "❌ What you do? → ✅ What do you DO? (cần auxiliary 'do')",
      "❌ Where you live? → ✅ Where DO you live?",
      "❌ How you are? → ✅ How ARE you? (đảo auxiliary)",
    ],
    tip: "Câu hỏi với Wh-: Wh- + TRỢĐỘNG TỪ + Chủ ngữ + Động từ. Không bao giờ bỏ 'do/does/is/are'!",
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

  {
    id: "future-will-going-to",
    level: "A2",
    title: "Tương Lai: Will & Going To",
    subtitleEn: "Future: Will vs Going To",
    emoji: "🔮",
    explanation: "Hai cách nói về tương lai phổ biến nhất. 'Will' cho quyết định tức thì & dự đoán. 'Going to' cho kế hoạch đã có sẵn.",
    structure: "will + V (bare) | am/is/are + going to + V",
    rules: [
      "Will: quyết định ngay lúc nói → 'I'll help you!' (vừa quyết định)",
      "Will: dự đoán không có bằng chứng → 'It will rain tomorrow.'",
      "Going to: kế hoạch đã lên trước → 'I'm going to study tonight.' (đã chuẩn bị)",
      "Going to: dự đoán có bằng chứng → 'Look at those clouds — it's going to rain!'",
      "Phủ định: won't | isn't/aren't going to",
    ],
    examples: [
      { en: "I'll have the steak, please.", vn: "Tôi sẽ dùng bít tết, làm ơn. (quyết định tức thì)" },
      { en: "She's going to study medicine next year.", vn: "Năm tới cô ấy sẽ học y (kế hoạch sẵn)." },
      { en: "It's going to rain — look at those clouds!", vn: "Sắp mưa rồi — nhìn đám mây kia!" },
      { en: "I won't tell anyone your secret.", vn: "Tôi sẽ không nói bí mật của bạn với ai." },
    ],
    mistakes: [
      "❌ I will going to meet her → ✅ Chỉ dùng MỘT trong hai: will MEET hoặc going to MEET",
      "❌ She is going to studies → ✅ going to STUDY (bare infinitive sau 'to')",
      "❌ I going to eat → ✅ I AM going to eat (cần 'am/is/are')",
    ],
    tip: "Trick: Will = QUYẾT ĐỊNH (ý chí). Going to = KẾ HOẠCH (đã vạch sẵn). Phone rings → 'I'll answer it!' (will, không phải going to)",
  },

  {
    id: "first-conditional",
    level: "A2",
    title: "Câu Điều Kiện Loại 1",
    subtitleEn: "First Conditional",
    emoji: "✅",
    explanation: "Diễn tả tình huống có thể xảy ra trong thực tế — điều kiện thực tế và kết quả có thể xảy ra ở tương lai.",
    structure: "If + present simple, will + V",
    rules: [
      "Mệnh đề 'if': dùng Present Simple (KHÔNG dùng will)",
      "Mệnh đề chính: will/won't + V nguyên thể",
      "'If it rains, I will stay home.' (có thể mưa thật)",
      "Có thể đảo: 'I will stay home if it rains.'",
      "Thay 'if' bằng 'when' khi chắc chắn sẽ xảy ra: 'When I get home, I'll call you.'",
    ],
    examples: [
      { en: "If you study hard, you will pass the exam.", vn: "Nếu bạn học chăm, bạn sẽ vượt qua kỳ thi." },
      { en: "I'll be late if I miss the bus.", vn: "Tôi sẽ trễ nếu lỡ xe buýt." },
      { en: "If she calls, tell her I'm busy.", vn: "Nếu cô ấy gọi, báo là tôi đang bận." },
      { en: "When I finish work, I'll go to the gym.", vn: "Khi tôi xong việc, tôi sẽ đến phòng gym." },
    ],
    mistakes: [
      "❌ If it will rain, I will stay → ✅ If it RAINS, I will stay (mệnh đề if KHÔNG dùng will)",
      "❌ If you will study, you will pass → ✅ If you STUDY, you will pass",
    ],
    tip: "Mệnh đề IF + Hiện tại đơn. Mệnh đề chính + will. KHÔNG BAO GIỜ dùng 'will' trong mệnh đề 'if'!",
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

  {
    id: "present-perfect-continuous",
    level: "B1",
    title: "Thì Hiện Tại Hoàn Thành Tiếp Diễn",
    subtitleEn: "Present Perfect Continuous",
    emoji: "⏳",
    explanation: "Nhấn mạnh QUÃNG THỜI GIAN của hành động đang kéo dài từ quá khứ đến hiện tại. Thường trả lời 'How long...?'",
    structure: "Subject + have/has + been + V-ing",
    rules: [
      "have/has been + V-ing: I have been studying for 2 hours.",
      "Nhấn mạnh quá trình, không phải kết quả",
      "'How long have you been working here?' → 'I've been working here for 5 years.'",
      "State verbs (know, like, want) KHÔNG dùng continuous",
      "Dấu hiệu: for, since, all day, lately, recently",
    ],
    examples: [
      { en: "I've been waiting for you for an hour!", vn: "Tôi đã chờ bạn một tiếng rồi!" },
      { en: "She has been studying medicine since 2020.", vn: "Cô ấy đã học y từ năm 2020." },
      { en: "How long have you been learning English?", vn: "Bạn đã học tiếng Anh được bao lâu?" },
      { en: "He's been working all day — he must be exhausted.", vn: "Anh ấy làm cả ngày rồi — chắc kiệt sức lắm." },
    ],
    mistakes: [
      "❌ I have been study → ✅ I have been studying (cần -ing)",
      "❌ I have been knowing her since 2020 → ✅ I have known her (know = state verb)",
      "❌ She has been working here since 3 years → ✅ for 3 years (for + khoảng thời gian)",
    ],
    tip: "PPC nhấn mạnh MỆT MỎI / HIỆU QUẢ: 'I've been cooking for 2 hours!' (mệt) vs 'I've cooked dinner.' (xong rồi)",
  },

  {
    id: "gerunds-infinitives",
    level: "B1",
    title: "Danh Động Từ vs Động Từ Nguyên Thể",
    subtitleEn: "Gerunds vs Infinitives",
    emoji: "⚖️",
    explanation: "Sau một số động từ dùng V-ing (gerund), sau một số khác dùng to+V (infinitive). Đây là lỗi cực phổ biến!",
    structure: "enjoy/avoid/suggest + V-ing | want/need/decide + to V",
    rules: [
      "Gerund (V-ing): enjoy, avoid, finish, suggest, recommend, consider, mind",
      "Infinitive (to+V): want, need, decide, plan, hope, agree, promise, refuse",
      "Cả hai (nghĩa thay đổi): stop, remember, forget, try",
      "'stop smoking' = bỏ hút thuốc | 'stop to smoke' = dừng lại để hút",
      "Sau preposition luôn dùng V-ing: 'interested in learning'",
    ],
    examples: [
      { en: "I enjoy swimming in the sea.", vn: "Tôi thích bơi ở biển. (enjoy + V-ing)" },
      { en: "She decided to change careers.", vn: "Cô ấy quyết định đổi nghề. (decide + to V)" },
      { en: "He stopped smoking last year.", vn: "Anh ấy bỏ thuốc lá năm ngoái." },
      { en: "I'm thinking about moving to Saigon.", vn: "Tôi đang nghĩ đến việc chuyển vào Sài Gòn." },
    ],
    mistakes: [
      "❌ I enjoy to swim → ✅ I enjoy swimming",
      "❌ She wants studying → ✅ She wants TO study",
      "❌ I suggest to go there → ✅ I suggest GOING there",
    ],
    tip: "ENJOY, AVOID, SUGGEST, FINISH → luôn dùng V-ING. WANT, NEED, HOPE, DECIDE → luôn dùng TO V.",
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

  {
    id: "mixed-conditionals",
    level: "B2",
    title: "Điều Kiện Hỗn Hợp",
    subtitleEn: "Mixed Conditionals",
    emoji: "🔀",
    explanation: "Kết hợp quá khứ và hiện tại trong cùng một câu điều kiện. Thể hiện tác động của quá khứ đối với hiện tại, hoặc trạng thái hiện tại đến kết quả quá khứ.",
    structure: "If + Past Perfect → would + V (past→present) | If + Past Simple → would have + V3 (present→past)",
    rules: [
      "Type A (quá khứ → hiện tại): If + had V3, would + V",
      "'If I had studied medicine, I would be a doctor now.'",
      "Type B (hiện tại → quá khứ): If + past simple, would have + V3",
      "'If I were braver, I would have asked for a raise.'",
      "Phổ biến trong IELTS writing và business English",
    ],
    examples: [
      { en: "If I had taken that job, I would be living in London now.", vn: "Nếu tôi nhận việc đó, giờ tôi đang sống ở London rồi." },
      { en: "If she were more confident, she would have spoken at the conference.", vn: "Nếu cô ấy tự tin hơn, cô ấy đã phát biểu ở hội nghị rồi." },
      { en: "If he hadn't overslept, he would be at work now.", vn: "Nếu anh ấy không ngủ quên, giờ anh ấy đã ở chỗ làm rồi." },
      { en: "If I were a morning person, I would have joined the 6am run.", vn: "Nếu tôi quen dậy sớm, tôi đã tham gia chạy bộ 6 giờ sáng rồi." },
    ],
    mistakes: [
      "❌ If I had more time, I would have went → ✅ would have GONE (V3)",
      "❌ If I would have studied... → ✅ If I HAD studied (không dùng would trong mệnh đề if)",
    ],
    tip: "Mixed = trộn 2 loại conditional. Hỏi: 'Cái gì là quá khứ? Cái gì là hiện tại?' rồi ghép đúng phần của mỗi loại.",
  },

  {
    id: "participial-clauses",
    level: "B2",
    title: "Mệnh Đề Phân Từ",
    subtitleEn: "Participial Clauses",
    emoji: "✂️",
    explanation: "Rút gọn mệnh đề trạng ngữ bằng cách dùng V-ing hoặc V3. Làm cho văn viết súc tích, chuyên nghiệp hơn.",
    structure: "V-ing / V3 + ... , main clause",
    rules: [
      "Chủ ngữ mệnh đề rút gọn PHẢI giống chủ ngữ mệnh đề chính!",
      "Active: 'Seeing the problem, he fixed it.' (= Because he saw...)",
      "Passive: 'Written in 1984, the book is still popular.'",
      "Perfect participle: 'Having finished the report, she went home.'",
      "Sai chủ ngữ = dangling modifier: ❌ 'Walking home, it started to rain.'",
    ],
    examples: [
      { en: "Feeling tired, she went to bed early.", vn: "Cảm thấy mệt, cô ấy đi ngủ sớm." },
      { en: "Located in the city centre, the hotel is very convenient.", vn: "Nằm ở trung tâm thành phố, khách sạn rất thuận tiện." },
      { en: "Having read the report, he made his decision.", vn: "Sau khi đọc báo cáo, anh ấy đưa ra quyết định." },
      { en: "Not knowing what to do, she asked for help.", vn: "Không biết phải làm gì, cô ấy nhờ giúp đỡ." },
    ],
    mistakes: [
      "❌ Walking home, it started to rain → ✅ Walking home, I got caught in the rain. (sửa lại chủ ngữ)",
      "❌ Finished the work, he left → ✅ Having finished the work / After finishing the work",
    ],
    tip: "Quy tắc vàng: Chủ ngữ mệnh đề phân từ = Chủ ngữ mệnh đề chính. Nếu sai → dangling modifier!",
  },

  {
    id: "nominal-clauses",
    level: "B2",
    title: "Mệnh Đề Danh Từ",
    subtitleEn: "Nominal Clauses (That / Wh- Clauses)",
    emoji: "📋",
    explanation: "Mệnh đề đóng vai trò như một danh từ — làm chủ ngữ, tân ngữ, hoặc vị ngữ. Cực kỳ phổ biến trong văn học thuật và business English.",
    structure: "That + clause | What/Whether/How + clause",
    rules: [
      "That-clause làm tân ngữ: 'I believe THAT the report is accurate.'",
      "What-clause làm chủ ngữ: 'What he said surprised everyone.'",
      "Whether-clause (câu hỏi gián tiếp Yes/No): 'I don't know WHETHER she is coming.'",
      "How-clause: 'The question is HOW we can reduce costs.'",
      "Sau suggest/recommend: 'It is suggested THAT all staff attend.'",
    ],
    examples: [
      { en: "What matters most is the quality of the work.", vn: "Điều quan trọng nhất là chất lượng công việc." },
      { en: "I believe that the project will succeed.", vn: "Tôi tin rằng dự án sẽ thành công." },
      { en: "The issue is whether we have enough budget.", vn: "Vấn đề là liệu chúng ta có đủ ngân sách không." },
      { en: "It is important that all staff attend the meeting.", vn: "Điều quan trọng là tất cả nhân viên tham dự cuộc họp." },
    ],
    mistakes: [
      "❌ I know how to do it or not → ✅ I know WHETHER I can do it",
      "❌ What he said it was wrong → ✅ What he said was wrong (không thêm 'it' thừa)",
      "❌ I think that that is wrong → ✅ I think that is wrong (tránh lặp 'that')",
    ],
    tip: "'That' sau động từ suy nghĩ (think, believe, know) có thể bỏ trong văn nói. Trong văn viết trang trọng nên giữ lại!",
  },

  {
    id: "discourse-markers",
    level: "B2",
    title: "Từ Nối và Discourse Markers",
    subtitleEn: "Discourse Markers for Coherent Writing",
    emoji: "🔗",
    explanation: "Từ nối giúp văn viết mạch lạc, logic. Đây là điểm then chốt để đạt band 6.5+ IELTS Writing — người Việt thường chỉ dùng 'but', 'and', 'so' lặp lại.",
    structure: "Marker + comma + main clause | Main clause; marker, clause",
    rules: [
      "Tương phản: however, nevertheless, in contrast, on the other hand",
      "Nguyên nhân/kết quả: therefore, consequently, as a result, hence, thus",
      "Bổ sung: furthermore, moreover, in addition, what is more",
      "Ví dụ: for instance, for example, such as, namely",
      "Tổng kết: in conclusion, to sum up, overall, in summary",
    ],
    examples: [
      { en: "The plan was expensive; nevertheless, it proved effective.", vn: "Kế hoạch tốn kém; tuy nhiên, nó được chứng minh là hiệu quả." },
      { en: "Sales declined in Q1. Consequently, the board revised the forecast.", vn: "Doanh số giảm Q1. Do đó, hội đồng sửa lại dự báo." },
      { en: "The product is innovative. Furthermore, it is cost-effective.", vn: "Sản phẩm có tính đổi mới. Hơn nữa, nó còn tiết kiệm chi phí." },
      { en: "Despite the challenges, the team delivered on time.", vn: "Bất chấp những khó khăn, nhóm vẫn hoàn thành đúng hạn." },
    ],
    mistakes: [
      "❌ Despite of the rain → ✅ Despite the rain (không có 'of' sau despite)",
      "❌ However she was tired, she finished → ✅ Although she was tired / She was tired; however, she finished",
      "❌ Furthermore, but I disagree → ✅ Chỉ dùng MỘT từ nối cho mỗi câu",
    ],
    tip: "HOWEVER ≠ BUT. 'However' là trạng từ — đứng đầu câu + dấu phẩy: 'She was tired. However, she continued.' KHÔNG viết: 'However she tried,...' (phải là: 'However hard she tried,...')",
  },
];

// Helpers
export const TOPICS_BY_LEVEL = (level: GrammarLevel) =>
  GRAMMAR_TOPICS.filter(t => t.level === level);

export const LEVEL_COLORS: Record<GrammarLevel, string> = {
  A0: "#06b6d4",
  A1: "#3b82f6",
  A2: "#8b5cf6",
  B1: "#f59e0b",
  B2: "#10b981",
};

export const LEVEL_BG: Record<GrammarLevel, string> = {
  A0: "#06b6d410",
  A1: "#3b82f610",
  A2: "#8b5cf610",
  B1: "#f59e0b10",
  B2: "#10b98110",
};
