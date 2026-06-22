import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 42 — Tech English Capstone (B2 / Phase 4)
const unit42: UnitData = {
  unitId: "unit-42",
  title: "Unit 42: Tech English Capstone",
  level: "B2",
  xp: 200,
  estimatedTime: 90,
  description: "Ôn tập toàn diện Phase 4 qua case study thực tế: từ đọc spec đến deploy và báo cáo.",
  badgeName: "Tech English Master",
  badgeEmoji: "🏆",

  situation:
    "Bạn join một startup remote 100% có team ở Singapore và US. Tuần đầu tiên: đọc technical spec bằng tiếng Anh, tham gia standup, review code của đồng nghiệp, fix bug và tạo PR, xử lý production incident, viết post-mortem. Đây là tổng hợp tất cả Phase 4.",

  learningOutcomes: [
    "Áp dụng toàn bộ Tech English vocabulary từ unit 33-41 vào workflow thực tế",
    "Tự tin giao tiếp trong mọi tình huống dev: meeting, review, incident, interview",
    "Đọc và viết technical documentation chuẩn mực như một senior developer",
  ],

  culturalNote:
    'Chúc mừng bạn đã hoàn thành toàn bộ hành trình A0 → B2 Tech English! 🎉 <span class="text-emerald-400 font-semibold">Bước tiếp theo thực tế:</span> (1) Đọc Hacker News hàng ngày, (2) Nghe Syntax.fm hoặc JS Party podcast, (3) Tham gia Discord servers của framework bạn đang dùng, (4) Comment trên GitHub issues. Ngôn ngữ học được qua use, không phải qua study.',

  warmupGreetings: [
    { emoji: "🚀", en: "Excited to ship this feature — it's been a long sprint!", vn: "Hào hứng để ship tính năng này — sprint dài thật!", context: "Khi sắp release feature" },
    { emoji: "🌏", en: "Working with a global team taught me more than any course.", vn: "Làm việc với team toàn cầu dạy tôi nhiều hơn bất kỳ khóa học nào.", context: "Chia sẻ kinh nghiệm remote work" },
    { emoji: "🏆", en: "Fluency comes from using the language, not just studying it.", vn: "Sự thành thạo đến từ việc sử dụng ngôn ngữ, không chỉ học nó.", context: "Động lực tiếp tục học" },
  ],

  vocab: [
    { id: 1, word: "specification (spec)", emoji: "📋", phonetic: "/ˌspesɪfɪˈkeɪʃən/", meaning: "tài liệu mô tả chi tiết yêu cầu kỹ thuật", example: "Read the technical spec before starting implementation.", example2: "The spec defines the API contract between frontend and backend.", collocation: "technical spec / product spec / follow the spec", audio: "/audio/unit42/specification.mp3" },
    { id: 2, word: "ship", emoji: "🚢", phonetic: "/ʃɪp/", meaning: "phát hành feature/product cho người dùng", example: "We shipped the new payment flow to 100% of users last Friday.", example2: "Ship early, iterate fast — that's our engineering culture.", collocation: "ship a feature / ship it / ready to ship", audio: "/audio/unit42/ship.mp3" },
    { id: 3, word: "iteration", emoji: "🔄", phonetic: "/ˌɪtəˈreɪʃən/", meaning: "vòng lặp cải tiến — build, measure, learn", example: "The first iteration was rough, but we improved with each release.", example2: "Agile is based on iterative development cycles.", collocation: "first iteration / iterate quickly / iterative development", audio: "/audio/unit42/iteration.mp3" },
    { id: 4, word: "technical debt", emoji: "💳", phonetic: "/ˈteknɪkəl det/", meaning: "nợ kỹ thuật — shortcuts tích lũy thành vấn đề", example: "We need to allocate 20% of each sprint to pay off technical debt.", example2: "Skipping tests creates technical debt that slows future development.", collocation: "technical debt / pay off debt / accumulate debt", audio: "/audio/unit42/technical.mp3" },
    { id: 5, word: "greenfield", emoji: "🌱", phonetic: "/ˈɡriːnfiːld/", meaning: "dự án mới hoàn toàn — không có legacy code", example: "This is a greenfield project — we get to choose the entire tech stack.", example2: "Greenfield projects are exciting but come with responsibility.", collocation: "greenfield project / greenfield development / start from scratch", audio: "/audio/unit42/greenfield.mp3" },
    { id: 6, word: "legacy", emoji: "🏛️", phonetic: "/ˈleɡəsi/", meaning: "code/system cũ vẫn đang chạy (thường khó maintain)", example: "Migrating from the legacy PHP monolith to microservices took 2 years.", example2: "Legacy code needs tests before refactoring.", collocation: "legacy code / legacy system / legacy migration", audio: "/audio/unit42/legacy.mp3" },
    { id: 7, word: "SLA (Service Level Agreement)", emoji: "📊", phonetic: "/es el eɪ/", meaning: "cam kết về uptime/performance (ví dụ: 99.9% uptime)", example: "Our SLA guarantees 99.9% uptime — that's 8.7 hours downtime per year.", example2: "We breached the SLA during last month's outage.", collocation: "SLA compliance / breach SLA / 99.9% SLA", audio: "/audio/unit42/sla.mp3" },
    { id: 8, word: "linter", emoji: "🔍", phonetic: "/ˈlɪntər/", meaning: "tool tự động kiểm tra code style và lỗi phổ biến", example: "The linter caught a potential null reference before code review.", example2: "Configure ESLint as the linter for all JavaScript projects.", collocation: "run the linter / linter errors / linting rules", audio: "/audio/unit42/linter.mp3" },
    { id: 9, word: "observability", emoji: "👁️", phonetic: "/əbˌzɜːvəˈbɪlɪti/", meaning: "khả năng quan sát hệ thống qua logs, metrics, traces", example: "We added observability tools to understand production behavior.", example2: "Good observability = faster incident resolution.", collocation: "system observability / observability stack / improve observability", audio: "/audio/unit42/observability.mp3" },
    { id: 10, word: "pair programming", emoji: "👥", phonetic: "/peər ˈprəʊɡræmɪŋ/", meaning: "hai người cùng code trên một màn hình", example: "We do pair programming for complex features to share knowledge.", example2: "Pair programming catches bugs early but requires strong communication.", collocation: "pair program / pair with someone / driver and navigator", audio: "/audio/unit42/pair.mp3" },
    { id: 11, word: "code freeze", emoji: "🧊", phonetic: "/kəʊd friːz/", meaning: "giai đoạn không cho thêm features mới trước release", example: "We're in code freeze — only critical bug fixes allowed until release.", example2: "Code freeze helps stabilize the codebase before shipping.", collocation: "code freeze / enter code freeze / lift the freeze", audio: "/audio/unit42/code.mp3" },
    { id: 12, word: "rubber duck debugging", emoji: "🦆", phonetic: "/ˈrʌbər dʌk dɪˈbʌɡɪŋ/", meaning: "giải thích code cho 'con vịt cao su' để tự tìm ra bug", example: "I was stuck for hours — then I explained the bug to a rubber duck and found the issue!", example2: "Sometimes explaining your code to someone (or something) helps you debug.", collocation: "rubber duck debugging / talk through the problem / explain to a duck", audio: "/audio/unit42/rubber.mp3" },
  ],

  grammar: {
    title: "Capstone Review — Tech English Patterns tổng hợp",
    rule: "Tổng hợp các patterns quan trọng nhất:\n\n1. Commit: feat(scope): add [feature]\n2. PR: 'This PR adds/fixes/refactors...'\n3. Standup: 'Yesterday... Today... Blocker:'\n4. Review: 'nit: / suggestion: / blocking:'\n5. Incident: '[URGENT] X is down — impact: Y users'\n6. Interview: 'I'm thinking of using... The time complexity...'\n7. OS: 'I believe I found a bug... Steps to reproduce...'",
    examples: [
      { en: "feat(auth): add JWT refresh token rotation", vn: "Thêm JWT refresh token rotation vào auth module" },
      { en: "Blocking: This race condition will cause data corruption under high load.", vn: "Blocking: Race condition này sẽ gây corrupt data dưới load cao." },
      { en: "I'm thinking of a two-pointer approach — O(n) time, O(1) space.", vn: "Tôi đang nghĩ đến two-pointer approach — O(n) time, O(1) space." },
      { en: "I believe I found a regression in v4.2 — it worked in v4.1.", vn: "Tôi tin rằng tôi đã tìm thấy regression trong v4.2 — nó hoạt động trong v4.1." },
    ],
    tip: "Học ngôn ngữ tốt nhất: dùng nó mỗi ngày. Đặt commit messages bằng tiếng Anh. Comment code bằng tiếng Anh. Viết nhật ký dev bằng tiếng Anh. Sau 3 tháng, bạn sẽ ngạc nhiên sự tiến bộ.",
    vnNote: "Hành trình A0→B2 Tech English của bạn: từ 'Hello, my name is...' đến 'This PR resolves a race condition by implementing optimistic locking.' Đây là một hành trình đáng tự hào.",
    ccq: {
      question: "Bạn đã học được điều gì quan trọng nhất từ hành trình A0→B2?",
      options: [
        "Ngữ pháp là quan trọng nhất",
        "Từ vựng > ngữ pháp trong giao tiếp thực tế",
        "Sử dụng ngôn ngữ trong context thực tế mỗi ngày là cách học nhanh nhất",
        "Cần học 10,000 từ trước khi nói chuyện",
      ],
      answer: "Sử dụng ngôn ngữ trong context thực tế mỗi ngày là cách học nhanh nhất",
      explanation: "Comprehensible input + real use = fluency. Bạn đã làm điều đó qua 42 units!",
    },
  },

  matchingExercise: {
    title: "Capstone review: Nối term với unit nguồn gốc",
    pairs: [
      { left: "feat(auth): add login", right: "Unit 33: Commit Messages" },
      { left: "endpoint / payload", right: "Unit 34: API Docs" },
      { left: "LGTM / nit:", right: "Unit 35: Code Review" },
      { left: "blocker / sprint", right: "Unit 36: Standup" },
      { left: "MRE / reproduce", right: "Unit 37: Stack Overflow" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Chúng tôi đang trong code freeze — chỉ cho phép fix critical bugs.", words: ["We're", "in", "code", "freeze", "—", "only", "critical", "bug", "fixes", "are", "allowed."], answer: "We're in code freeze — only critical bug fixes are allowed." },
    { id: "s2", prompt_vn: "Tôi đang nghĩ đến two-pointer approach — O(n) time complexity.", words: ["I'm", "thinking", "of", "a", "two-pointer", "approach", "—", "O(n)", "time", "complexity."], answer: "I'm thinking of a two-pointer approach — O(n) time complexity." },
    { id: "s3", prompt_vn: "Ship early và iterate nhanh — đó là văn hóa engineering của chúng ta.", words: ["Ship", "early", "and", "iterate", "fast", "—", "that's", "our", "engineering", "culture."], answer: "Ship early and iterate fast — that's our engineering culture." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What is 'technical debt'?", options: ["Tiền nợ vì mua laptop", "Shortcuts tích lũy thành vấn đề dài hạn trong codebase", "Database storage usage", "Số lượng bugs chưa fix"], answer: "Shortcuts tích lũy thành vấn đề dài hạn trong codebase", type: "multiple-choice" },
    { id: "pq2", question: "When is 'code freeze' applied?", options: ["Khi team đi nghỉ", "Trước major release để ổn định codebase", "Khi hết budget", "Khi có production incident"], answer: "Trước major release để ổn định codebase", type: "multiple-choice" },
    { id: "pq3", question: "What is 'observability' in software systems?", options: ["Xem code review", "Khả năng monitor hệ thống qua logs, metrics, traces", "Code documentation", "Security audit"], answer: "Khả năng monitor hệ thống qua logs, metrics, traces", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Chúng ta cần phân bổ 20% sprint để trả nợ kỹ thuật.", answer: "We need to allocate 20% of each sprint to pay off technical debt." },
    { id: "pt2", prompt_vn: "SLA của chúng ta đảm bảo 99.9% uptime.", answer: "Our SLA guarantees 99.9% uptime." },
    { id: "pt3", prompt_vn: "Ship early, iterate fast — đó là cách chúng ta xây dựng sản phẩm.", answer: "Ship early, iterate fast — that's how we build products." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Tuần đầu join team remote quốc tế",
      audio: "/audio/unit42/dialogue_1.mp3",
      desc: "Phong join team Singapore — first week experience.",
      lines: [
        { id: "d1-1", speaker: "Tech Lead", text: "Welcome to the team, Phong! First week will be light — read the technical spec for the upcoming feature, join our daily standups, and review a few PRs to get familiar with our codebase.", translation: "Chào mừng đến với team, Phong! Tuần đầu sẽ nhẹ nhàng — đọc technical spec cho feature sắp tới, tham gia daily standups, và review vài PRs để làm quen với codebase." },
        { id: "d1-2", speaker: "Phong", text: "Sounds great! I've already read the CONTRIBUTING.md and set up my local environment. One question — what's our commit message convention?", translation: "Nghe tuyệt vời! Tôi đã đọc CONTRIBUTING.md và setup môi trường local. Một câu hỏi — convention commit message của chúng ta là gì?" },
        { id: "d1-3", speaker: "Tech Lead", text: "We follow Conventional Commits — feat, fix, refactor, docs, and so on. All PRs need at least one approval before merging. We also have a 'no merge on Friday' rule.", translation: "Chúng ta theo Conventional Commits — feat, fix, refactor, docs, v.v. Tất cả PRs cần ít nhất một approval trước khi merge. Chúng ta cũng có quy tắc 'không merge vào thứ Sáu'." },
        { id: "d1-4", speaker: "Phong", text: "Got it — no deploy on Fridays makes sense. When I review PRs, should I use the 'nit:' prefix for minor style comments?", translation: "Hiểu rồi — không deploy vào thứ Sáu là hợp lý. Khi tôi review PRs, tôi có nên dùng prefix 'nit:' cho minor style comments không?" },
        { id: "d1-5", speaker: "Tech Lead", text: "Exactly right! You've done this before. We also use 'blocking:' for must-fix comments and 'suggestion:' for optional improvements. You'll fit in perfectly.", translation: "Chính xác! Bạn đã làm điều này trước đây. Chúng ta cũng dùng 'blocking:' cho must-fix comments và 'suggestion:' cho optional improvements. Bạn sẽ hòa nhập hoàn hảo." },
        { id: "d1-6", speaker: "Phong", text: "I'm excited to contribute! I noticed a potential race condition in the auth module while reading the codebase — should I open a GitHub issue?", translation: "Tôi hào hứng được đóng góp! Tôi nhận thấy một potential race condition trong auth module khi đọc codebase — tôi có nên mở GitHub issue không?" },
        { id: "d1-7", speaker: "Tech Lead", text: "Absolutely — great catch! Open an issue with the reproduction steps, and if you can fix it, a PR would be even better. You're already adding value on day one!", translation: "Dĩ nhiên — bắt được tốt lắm! Mở issue với reproduction steps, và nếu bạn có thể fix, một PR sẽ còn tốt hơn. Bạn đã tạo ra giá trị từ ngày đầu tiên!" },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "We're in code freeze — only P0 bugs can be fixed before the release.", options: ["Không có gì thay đổi", "Chỉ bug nghiêm trọng nhất được phép fix", "Tất cả features bị cancel", "Release bị hoãn"], answer: "Chỉ bug nghiêm trọng nhất được phép fix" },
    { id: "lac2", audio_text: "This project has significant technical debt — we should allocate a sprint to clean it up.", options: ["Project thiếu tài liệu", "Codebase có nhiều shortcuts cần dọn dẹp", "Project cần thêm features", "Team cần thêm developer"], answer: "Codebase có nhiều shortcuts cần dọn dẹp" },
    { id: "lac3", audio_text: "Good observability helped us identify the root cause within 10 minutes of the incident.", options: ["Team phản ứng chậm", "Monitoring system giúp tìm root cause nhanh", "Incident kéo dài 10 phút", "Team cần 10 người để debug"], answer: "Monitoring system giúp tìm root cause nhanh" },
  ],

  speaking: {
    level1Prompt: "Tổng hợp Phase 4: Giới thiệu bản thân như một developer đến team mới — dùng Tech English bạn đã học.",
    level1Placeholder: "Hi everyone, I'm [name]. I work with [tech stack]. I'm comfortable with Agile/Scrum workflows, code reviews, and...",
    level2Situation: "Mock final challenge: Tech lead hỏi 'Walk me through how you'd approach building a URL shortener service from scratch. Consider scalability to 1 million users.'",
    level2Hint: "I'd start by clarifying requirements... For the data model, I'd use a key-value store... The main bottleneck would be the database reads, so I'd add Redis caching... For 1M users, horizontal scaling with load balancing... The SLA target would be 99.9% uptime...",
  },

  quiz: [
    { id: "q1", question: "What is a 'greenfield project'?", options: ["Dự án về môi trường", "Dự án mới hoàn toàn không có legacy code", "Dự án ở Singapore", "Dự án có nhiều bugs"], answer: "Dự án mới hoàn toàn không có legacy code", type: "multiple-choice" },
    { id: "q2", question: "What does 'ship early, iterate fast' mean?", options: ["Giao hàng nhanh", "Ra mắt sớm và cải thiện liên tục", "Viết code nhanh", "Fix bugs sớm"], answer: "Ra mắt sớm và cải thiện liên tục", type: "multiple-choice" },
    { id: "q3", question: "What is 'pair programming'?", options: ["Lập trình một mình", "Hai người cùng code trên một màn hình", "Programming challenge", "Code review"], answer: "Hai người cùng code trên một màn hình", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: Good ___ helped us identify the root cause quickly during the outage.", options: ["testing", "observability", "documentation", "monitoring"], answer: "observability", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Chúng ta cần cải thiện observability trước sprint tiếp theo.", answer: "We need to improve observability before the next sprint.", type: "translate" },
    { id: "q6", question: "Từ nào KHÔNG phải là action verb chuẩn trong CV?", options: ["Built", "Reduced", "Responsible for", "Shipped"], answer: "Responsible for", type: "multiple-choice" },
    { id: "q7", question: "Format standup chuẩn là gì?", options: ["Features / Bugs / Tests", "Yesterday / Today / Blockers", "Plan / Execute / Review", "Start / Stop / Continue"], answer: "Yesterday / Today / Blockers", type: "multiple-choice" },
    { id: "q8", question: "Dịch: 'This is a blocking comment — must fix before merge.'", answer: "Đây là blocking comment — phải sửa trước khi merge.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Phase 4 Capstone — Final vocabulary review",
    timeLimit: 90,
    items: [
      { en: "ship a feature", vn: "phát hành tính năng" },
      { en: "technical debt", vn: "nợ kỹ thuật" },
      { en: "code freeze", vn: "không thêm feature trước release" },
      { en: "observability", vn: "khả năng quan sát hệ thống" },
      { en: "spec", vn: "tài liệu yêu cầu kỹ thuật" },
      { en: "greenfield project", vn: "dự án mới hoàn toàn" },
      { en: "legacy code", vn: "code cũ khó maintain" },
      { en: "SLA", vn: "cam kết uptime/performance" },
      { en: "pair programming", vn: "hai người cùng code" },
      { en: "rubber duck debugging", vn: "giải thích bug cho 'vịt' để tự tìm ra" },
      { en: "iterate", vn: "cải tiến liên tục qua vòng lặp" },
      { en: "bottleneck", vn: "điểm chậm nhất trong hệ thống" },
    ],
  },
};

export default unit42;
