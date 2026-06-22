import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 37 — Stack Overflow English (B2 / Phase 4)
const unit37: UnitData = {
  unitId: "unit-37",
  title: "Unit 37: Stack Overflow English",
  level: "B2",
  xp: 120,
  estimatedTime: 60,
  description: "Học đặt câu hỏi rõ ràng và viết câu trả lời kỹ thuật chuyên nghiệp trên Stack Overflow.",
  badgeName: "Stack Pro",
  badgeEmoji: "📚",

  situation:
    "Bạn gặp bug kỳ lạ với React hooks — tìm mãi không ra. Bạn muốn đặt câu hỏi trên Stack Overflow nhưng không biết cách viết sao cho rõ ràng để người khác có thể help. Và bạn cũng muốn trả lời câu hỏi của người khác để tích lũy reputation.",

  learningOutcomes: [
    "Viết câu hỏi Stack Overflow rõ ràng: MCVE (Minimal Reproducible Example)",
    "Mô tả bug chính xác: 'expected behavior' vs 'actual behavior'",
    "Viết câu trả lời có cấu trúc, dễ hiểu cho cộng đồng",
  ],

  culturalNote:
    'Cộng đồng Stack Overflow có văn hóa rất cụ thể: câu hỏi phải <span class="text-emerald-400 font-semibold">minimal, reproducible, và self-contained</span>. Đừng post toàn bộ code project và hỏi "Why doesn\'t this work?". Thay vào đó, isolate vấn đề xuống 10-20 dòng. Một câu hỏi tốt = bạn tự giải được 50% vấn đề.',

  warmupGreetings: [
    { emoji: "❓", en: "I have a question about React hooks — can anyone help?", vn: "Tôi có câu hỏi về React hooks — ai có thể giúp không?", context: "Hỏi trong team Slack trước khi post SO" },
    { emoji: "🔍", en: "I searched Stack Overflow but couldn't find a solution.", vn: "Tôi đã tìm trên Stack Overflow nhưng không tìm ra giải pháp.", context: "Báo cáo khi đã search trước" },
    { emoji: "✅", en: "Found the answer on Stack Overflow — sharing the link.", vn: "Tìm thấy câu trả lời trên Stack Overflow — chia sẻ link.", context: "Chia sẻ solution với team" },
  ],

  vocab: [
    { id: 1, word: "reproduce", emoji: "🔄", phonetic: "/ˌriːprəˈdjuːs/", meaning: "tái hiện lại bug/vấn đề", example: "I cannot reproduce the bug in a fresh environment.", example2: "Please provide steps to reproduce the issue.", collocation: "reproduce a bug / reproducible steps / minimal reproducible example", audio: "/audio/unit37/reproduce.mp3" },
    { id: 2, word: "expected behavior", emoji: "✅", phonetic: "/ɪkˈspektɪd bɪˈheɪvjər/", meaning: "kết quả mong đợi (code nên làm gì)", example: "Expected behavior: the button should save the form data.", example2: "Describe what you expected to happen before posting.", collocation: "expected behavior / expected output / expected result", audio: "/audio/unit37/expected.mp3" },
    { id: 3, word: "actual behavior", emoji: "❌", phonetic: "/ˈæktʃuəl bɪˈheɪvjər/", meaning: "kết quả thực tế xảy ra (thường khác expected)", example: "Actual behavior: the form data is cleared instead of saved.", example2: "The actual behavior differs from what the docs describe.", collocation: "actual behavior / actual output / actual result", audio: "/audio/unit37/actual.mp3" },
    { id: 4, word: "workaround", emoji: "🔧", phonetic: "/ˈwɜːkəraʊnd/", meaning: "giải pháp tạm thời để bypass vấn đề", example: "I found a workaround using useRef instead of useState.", example2: "This is a temporary workaround — the underlying issue still needs fixing.", collocation: "temporary workaround / find a workaround / workaround solution", audio: "/audio/unit37/workaround.mp3" },
    { id: 5, word: "minimal reproducible example (MRE)", emoji: "📋", phonetic: "/ˈmɪnɪməl/", meaning: "đoạn code tối giản nhất để tái hiện vấn đề", example: "Here is a minimal reproducible example: [10 lines of code]", example2: "Always include an MRE when posting on Stack Overflow.", collocation: "MRE / minimal example / reproducible example", audio: "/audio/unit37/minimal.mp3" },
    { id: 6, word: "stack trace", emoji: "📜", phonetic: "/stæk treɪs/", meaning: "danh sách các function calls dẫn đến lỗi", example: "Please include the full stack trace in your question.", example2: "The stack trace shows the error originated in the auth middleware.", collocation: "full stack trace / error stack trace / paste the stack trace", audio: "/audio/unit37/stack.mp3" },
    { id: 7, word: "environment", emoji: "🌐", phonetic: "/ɪnˈvaɪrənmənt/", meaning: "môi trường chạy code (OS, version, config)", example: "Please specify your environment: Node version, OS, and browser.", example2: "The bug only occurs in the Windows environment.", collocation: "runtime environment / development environment / environment variable", audio: "/audio/unit37/environment.mp3" },
    { id: 8, word: "upvote / downvote", emoji: "👍", phonetic: "/ˈʌpvəʊt/", meaning: "vote tăng/giảm điểm cho câu hỏi hoặc câu trả lời", example: "If this answer helped you, please upvote it.", example2: "Questions that are unclear often get downvoted.", collocation: "upvote an answer / downvote a question / upvote count", audio: "/audio/unit37/upvote.mp3" },
    { id: 9, word: "accepted answer", emoji: "☑️", phonetic: "/əkˈseptɪd ˈɑːnsər/", meaning: "câu trả lời được chọn là giải pháp đúng", example: "Please mark the answer as accepted if it solved your problem.", example2: "The accepted answer gets a green checkmark on Stack Overflow.", collocation: "mark as accepted / accepted answer / checkmark", audio: "/audio/unit37/accepted.mp3" },
    { id: 10, word: "duplicate", emoji: "📄", phonetic: "/ˈdjuːplɪkɪt/", meaning: "câu hỏi đã được hỏi trước đó", example: "This question is a duplicate of SO post #12345.", example2: "Search before posting to avoid duplicates.", collocation: "marked as duplicate / duplicate question / close as duplicate", audio: "/audio/unit37/duplicate.mp3" },
  ],

  grammar: {
    title: "Câu hỏi kỹ thuật rõ ràng — Cấu trúc SO question",
    rule: "Cấu trúc câu hỏi Stack Overflow chuẩn:\n1. Title: [Technology] [specific problem] (present tense)\n2. Context: 'I am trying to...' / 'I want to...'\n3. Problem: 'But when I... the result is...'\n4. Expected: 'I expected... to happen'\n5. Actual: 'But actually...'\n6. Code: Minimal Reproducible Example\n7. What I tried: 'I have tried... but...'",
    examples: [
      { en: "I am trying to fetch data on component mount using useEffect.", vn: "Tôi đang cố fetch dữ liệu khi component mount dùng useEffect." },
      { en: "When I update state inside the callback, the component re-renders infinitely.", vn: "Khi tôi update state trong callback, component render vô hạn." },
      { en: "I expected the effect to run only once, but it runs on every render.", vn: "Tôi mong đợi effect chỉ chạy một lần, nhưng nó chạy mỗi lần render." },
      { en: "I have tried adding an empty dependency array but the issue persists.", vn: "Tôi đã thử thêm dependency array rỗng nhưng vẫn còn vấn đề." },
    ],
    tip: "Tránh: 'It doesn't work. Help!' ✗\nDùng: 'Expected: X. Actual: Y. I tried: Z.' ✓",
    vnNote: "Người Việt hay hỏi quá chung chung: 'Tại sao code của tôi không chạy?' Trên SO, phải cụ thể: 'Why does useEffect run infinitely when state is updated inside the callback?'",
    ccq: {
      question: "Title nào tốt nhất cho Stack Overflow?",
      options: [
        "React bug please help",
        "useEffect runs infinitely when updating state inside callback",
        "My code doesn't work",
        "React hook problem",
      ],
      answer: "useEffect runs infinitely when updating state inside callback",
      explanation: "Title tốt = Technology (useEffect) + specific problem (runs infinitely) + context (inside callback). Rõ ràng và searchable.",
    },
  },

  matchingExercise: {
    title: "Nối thuật ngữ SO với định nghĩa",
    pairs: [
      { left: "MRE", right: "Code tối giản nhất để reproduce bug" },
      { left: "stack trace", right: "Danh sách function calls dẫn đến lỗi" },
      { left: "workaround", right: "Giải pháp tạm thời" },
      { left: "accepted answer", right: "Câu trả lời được chọn là đúng" },
      { left: "duplicate", right: "Câu hỏi đã được hỏi trước" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Kết quả mong đợi: component chỉ render một lần.", words: ["Expected", "behavior:", "the", "component", "should", "render", "only", "once."], answer: "Expected behavior: the component should render only once." },
    { id: "s2", prompt_vn: "Tôi đã thử thêm dependency array nhưng vấn đề vẫn còn.", words: ["I", "have", "tried", "adding", "a", "dependency", "array", "but", "the", "issue", "persists."], answer: "I have tried adding a dependency array but the issue persists." },
    { id: "s3", prompt_vn: "Vui lòng cung cấp steps để reproduce vấn đề.", words: ["Please", "provide", "steps", "to", "reproduce", "the", "issue."], answer: "Please provide steps to reproduce the issue." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What is an MRE on Stack Overflow?", options: ["Most Recent Edit", "Minimal Reproducible Example", "Module Reference Error", "My Runtime Environment"], answer: "Minimal Reproducible Example", type: "multiple-choice" },
    { id: "pq2", question: "What should you include when posting a bug question?", options: ["Full project code", "Expected vs actual behavior + minimal code + environment", "Just the error message", "Screenshots only"], answer: "Expected vs actual behavior + minimal code + environment", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ: If my answer solved your problem, please mark it as ___.", options: ["correct", "accepted", "solved", "approved"], answer: "accepted", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Tôi đang cố kết nối đến database nhưng nhận được lỗi connection refused.", answer: "I am trying to connect to the database but I get a 'connection refused' error." },
    { id: "pt2", prompt_vn: "Vui lòng bao gồm stack trace đầy đủ trong câu hỏi của bạn.", answer: "Please include the full stack trace in your question." },
    { id: "pt3", prompt_vn: "Tôi đã tìm thấy giải pháp và sẽ post câu trả lời.", answer: "I found the solution and will post an answer." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Review Stack Overflow question trong team",
      audio: "/audio/unit37/dialogue_1.mp3",
      desc: "Lan nhờ senior dev review câu hỏi SO trước khi post.",
      lines: [
        { id: "d1-1", speaker: "Lan", text: "Hey, I'm about to post on Stack Overflow. Can you quickly check if my question is clear?", translation: "Này, tôi sắp post lên Stack Overflow. Bạn có thể kiểm tra nhanh xem câu hỏi của tôi có rõ không?" },
        { id: "d1-2", speaker: "Senior Dev", text: "Sure! Hmm, your title is too vague — 'React problem'. Be specific. What exactly is the problem?", translation: "Được! Hmm, title của bạn quá mơ hồ — 'React problem'. Hãy cụ thể. Vấn đề chính xác là gì?" },
        { id: "d1-3", speaker: "Lan", text: "The useEffect runs infinitely when I update state inside the callback.", translation: "useEffect chạy vô hạn khi tôi update state bên trong callback." },
        { id: "d1-4", speaker: "Senior Dev", text: "Perfect — that's your title. Now add: 1) expected behavior, 2) actual behavior, 3) your minimal code snippet, and 4) what you've already tried.", translation: "Hoàn hảo — đó là title của bạn. Bây giờ thêm: 1) expected behavior, 2) actual behavior, 3) code snippet tối giản, và 4) những gì bạn đã thử." },
        { id: "d1-5", speaker: "Lan", text: "Got it. I also need to mention my environment — React 18 and Node 20?", translation: "Hiểu rồi. Tôi cũng cần đề cập môi trường — React 18 và Node 20?" },
        { id: "d1-6", speaker: "Senior Dev", text: "Exactly. With all that, your question will be upvoted instead of closed. Good luck!", translation: "Chính xác. Với tất cả điều đó, câu hỏi của bạn sẽ được upvote thay vì bị đóng. Chúc may mắn!" },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "This question has been marked as a duplicate of a previous post.", options: ["Câu hỏi được upvote", "Câu hỏi đã có người hỏi trước", "Câu hỏi cần thêm thông tin", "Câu hỏi có accepted answer"], answer: "Câu hỏi đã có người hỏi trước" },
    { id: "lac2", audio_text: "Please provide a minimal reproducible example so we can help you.", options: ["Xóa toàn bộ code", "Cần thêm code tối giản nhất", "Câu hỏi quá dài", "Cần screenshot"], answer: "Cần thêm code tối giản nhất" },
    { id: "lac3", audio_text: "If this answer solved your problem, please mark it as accepted.", options: ["Cần viết câu trả lời mới", "Nên upvote câu hỏi", "Nên mark câu trả lời là đúng", "Cần thêm comment"], answer: "Nên mark câu trả lời là đúng" },
  ],

  speaking: {
    level1Prompt: "Mô tả một bug bạn đang gặp — dùng format: 'I am trying to... but... I expected... actually...'",
    level1Placeholder: "I am trying to... but when I... the result is... I expected...",
    level2Situation: "Viết tiêu đề Stack Overflow cho bug: Hàm async của bạn trong Node.js không đợi Promise resolve trước khi return.",
    level2Hint: "Node.js async function returns undefined instead of resolved Promise value",
  },

  quiz: [
    { id: "q1", question: "What makes a good Stack Overflow question title?", options: ["'Help me!'", "'Specific technology + specific problem (present tense)'", "'Bug in my code'", "'Why doesn't it work?'"], answer: "'Specific technology + specific problem (present tense)'", type: "multiple-choice" },
    { id: "q2", question: "What is a 'workaround'?", options: ["The correct solution", "A temporary fix to bypass a problem", "A code review comment", "A git branch name"], answer: "A temporary fix to bypass a problem", type: "multiple-choice" },
    { id: "q3", question: "What should you always include in an SO question about a bug?", options: ["Your full name", "Expected vs actual behavior + minimal code", "Your GitHub profile", "A video recording"], answer: "Expected vs actual behavior + minimal code", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: I cannot ___ the bug in a clean environment.", options: ["create", "reproduce", "make", "find"], answer: "reproduce", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Kết quả thực tế: component render vô hạn.", answer: "Actual behavior: the component re-renders infinitely.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Stack Overflow vocabulary",
    timeLimit: 60,
    items: [
      { en: "reproduce", vn: "tái hiện lại bug" },
      { en: "expected behavior", vn: "kết quả mong đợi" },
      { en: "actual behavior", vn: "kết quả thực tế" },
      { en: "workaround", vn: "giải pháp tạm thời" },
      { en: "stack trace", vn: "danh sách call dẫn đến lỗi" },
      { en: "minimal reproducible example", vn: "code tối giản để reproduce" },
      { en: "upvote", vn: "vote tăng điểm" },
      { en: "accepted answer", vn: "câu trả lời được chọn" },
      { en: "duplicate", vn: "câu hỏi đã được hỏi" },
    ],
  },
};

export default unit37;
