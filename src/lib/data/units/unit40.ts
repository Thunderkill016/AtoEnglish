import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 40 — LinkedIn & Dev Profile (B2 / Phase 4)
const unit40: UnitData = {
  unitId: "unit-40",
  title: "Unit 40: LinkedIn & Dev Profile",
  level: "B2",
  xp: 120,
  estimatedTime: 55,
  description: "Viết LinkedIn profile, GitHub README, và bio kỹ thuật thu hút recruiter quốc tế.",
  badgeName: "Profile Builder",
  badgeEmoji: "💼",

  situation:
    "Một recruiter từ Singapore nhìn thấy GitHub của bạn và muốn liên hệ trên LinkedIn. Profile của bạn viết bằng tiếng Việt, bio trống, và README chỉ có 2 dòng. Làm sao tối ưu profile trong 30 phút?",

  learningOutcomes: [
    "Viết LinkedIn headline và summary hấp dẫn bằng tiếng Anh",
    "Viết GitHub profile README giới thiệu bản thân như một dev",
    "Mô tả experience và projects chuyên nghiệp theo format chuẩn",
  ],

  culturalNote:
    'LinkedIn là <span class="text-emerald-400 font-semibold">CV online sống</span> — recruiters tìm theo keywords. Tối ưu headline: không chỉ viết "Software Engineer" mà viết "Full-Stack Developer | React · Node.js · PostgreSQL | Building scalable web apps". Keywords trong Skills section = searchable. GitHub README với contribution graph + tech stack badges = professional signal.',

  warmupGreetings: [
    { emoji: "💼", en: "I just updated my LinkedIn profile — let me know your thoughts.", vn: "Tôi vừa cập nhật LinkedIn profile — cho tôi biết ý kiến của bạn.", context: "Nhờ đồng nghiệp review profile" },
    { emoji: "🌐", en: "My GitHub profile shows my open source contributions.", vn: "GitHub profile của tôi hiển thị các đóng góp open source.", context: "Giới thiệu với recruiter" },
    { emoji: "📫", en: "Feel free to reach out on LinkedIn for collaboration opportunities.", vn: "Hãy liên hệ trên LinkedIn cho các cơ hội hợp tác.", context: "Kêu gọi connect" },
  ],

  vocab: [
    { id: 1, word: "headline", emoji: "📰", phonetic: "/ˈhedlaɪn/", meaning: "dòng tiêu đề ngay dưới tên trên LinkedIn", example: "Full-Stack Engineer | React · TypeScript · AWS | Open to remote roles", example2: "Your headline is the first thing recruiters see — make it keyword-rich.", collocation: "LinkedIn headline / profile headline / optimize headline", audio: "/audio/unit40/headline.mp3" },
    { id: 2, word: "summary / about", emoji: "📝", phonetic: "/ˈsʌməri/", meaning: "phần giới thiệu bản thân (2-5 câu)", example: "I'm a backend developer with 3 years of experience building REST APIs in Node.js and Go.", example2: "Your summary should answer: who you are, what you do, what you're looking for.", collocation: "LinkedIn summary / about section / professional summary", audio: "/audio/unit40/summary.mp3" },
    { id: 3, word: "tech stack", emoji: "🧱", phonetic: "/tek stæk/", meaning: "bộ công nghệ bạn dùng (languages, frameworks, tools)", example: "My tech stack: React, TypeScript, Node.js, PostgreSQL, Docker, AWS.", example2: "List your tech stack in both headline and skills section.", collocation: "current tech stack / full-stack / technology stack", audio: "/audio/unit40/tech.mp3" },
    { id: 4, word: "open to opportunities", emoji: "🟢", phonetic: "/ˈəʊpən tuː/", meaning: "sẵn sàng nhận cơ hội việc làm mới", example: "I've set my profile to 'Open to Opportunities' so recruiters can reach out.", example2: "Use #OpenToWork privately so only recruiters can see.", collocation: "open to opportunities / open to work / actively looking", audio: "/audio/unit40/open.mp3" },
    { id: 5, word: "endorsement", emoji: "👍", phonetic: "/ɪnˈdɔːrsmənt/", meaning: "xác nhận kỹ năng từ đồng nghiệp/managers", example: "Can you endorse my React and TypeScript skills on LinkedIn?", example2: "Skills with many endorsements appear higher in search results.", collocation: "skill endorsement / endorse a skill / LinkedIn endorsement", audio: "/audio/unit40/endorsement.mp3" },
    { id: 6, word: "recommendation", emoji: "⭐", phonetic: "/ˌrekəmenˈdeɪʃən/", meaning: "lời nhận xét từ người đã làm việc cùng", example: "I'd love to write a recommendation for you on LinkedIn.", example2: "A recommendation from a senior engineer carries significant weight.", collocation: "LinkedIn recommendation / write a recommendation / request a recommendation", audio: "/audio/unit40/recommendation.mp3" },
    { id: 7, word: "portfolio", emoji: "📁", phonetic: "/pɔːtˈfəʊliəʊ/", meaning: "bộ sưu tập dự án/công việc đã làm", example: "Check out my portfolio — I've built 3 SaaS products in the last 2 years.", example2: "GitHub is a developer's most important portfolio.", collocation: "project portfolio / portfolio website / showcase your portfolio", audio: "/audio/unit40/portfolio.mp3" },
    { id: 8, word: "metrics", emoji: "📊", phonetic: "/ˈmetrɪks/", meaning: "số liệu cụ thể chứng minh impact", example: "Reduced API response time by 40% through query optimization.", example2: "Always quantify achievements: 'increased by X%', 'reduced by Y ms'.", collocation: "quantify with metrics / performance metrics / impact metrics", audio: "/audio/unit40/metrics.mp3" },
    { id: 9, word: "remote-friendly", emoji: "🌍", phonetic: "/rɪˈməʊt ˈfrendli/", meaning: "có thể làm việc từ xa", example: "I'm a remote-friendly developer based in Ho Chi Minh City.", example2: "Many international companies hire remote-friendly Vietnamese developers.", collocation: "remote-friendly / remote-first / work remotely", audio: "/audio/unit40/remote_friendly.mp3" },
    { id: 10, word: "call to action (CTA)", emoji: "📣", phonetic: "/kɔːl tuː ˈækʃən/", meaning: "kêu gọi hành động cuối summary", example: "Let's connect if you're hiring for React roles or want to collaborate on open source.", example2: "End your summary with a clear CTA.", collocation: "call to action / reach out / let's connect", audio: "/audio/unit40/call.mp3" },
  ],

  grammar: {
    title: "Quantifying Achievements — Động từ hành động + số liệu",
    rule: "CV/LinkedIn chuẩn dùng: [Action verb] + [what] + [result with metrics]\n\nAction verbs mạnh:\nBuilt / Developed / Reduced / Increased / Optimized /\nLed / Shipped / Designed / Migrated / Automated\n\nAvoid: 'responsible for', 'helped with', 'worked on'",
    examples: [
      { en: "Built a real-time dashboard serving 10,000+ daily active users.", vn: "Xây dựng real-time dashboard phục vụ 10,000+ daily active users." },
      { en: "Reduced API response time by 40% through PostgreSQL query optimization.", vn: "Giảm thời gian phản hồi API 40% bằng tối ưu hóa query PostgreSQL." },
      { en: "Migrated legacy monolith to microservices, cutting deployment time by 60%.", vn: "Migrate legacy monolith sang microservices, giảm thời gian deploy 60%." },
      { en: "Led a team of 4 engineers to deliver the v2.0 product on time.", vn: "Dẫn dắt team 4 engineers để deliver sản phẩm v2.0 đúng hạn." },
    ],
    tip: "Mọi achievement nên có số: 'improved performance' (yếu) → 'reduced load time by 35%' (mạnh). Không có số? Ước tính và ghi 'approximately'.",
    vnNote: "Người Việt hay viết 'I am responsible for developing the backend'. Thay bằng 'Developed and maintained the backend API serving 50,000 users' — active voice + metrics = powerful.",
    ccq: {
      question: "Bullet point nào hay nhất cho CV?",
      options: [
        "Responsible for backend development",
        "Helped with API work",
        "Built REST APIs in Node.js that handled 1M+ daily requests",
        "I worked on the API with my team",
      ],
      answer: "Built REST APIs in Node.js that handled 1M+ daily requests",
      explanation: "Action verb (Built) + what (REST APIs in Node.js) + metrics (1M+ daily requests) = chuẩn CV quốc tế.",
    },
  },

  matchingExercise: {
    title: "Nối action verb với nghĩa",
    pairs: [
      { left: "Shipped", right: "Phát hành feature/product" },
      { left: "Optimized", right: "Cải thiện hiệu suất" },
      { left: "Migrated", right: "Chuyển từ system này sang system khác" },
      { left: "Led", right: "Dẫn dắt team/project" },
      { left: "Automated", right: "Tự động hóa quy trình" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Xây dựng hệ thống authentication phục vụ 50,000 người dùng hàng ngày.", words: ["Built", "an", "authentication", "system", "serving", "50,000", "daily", "users."], answer: "Built an authentication system serving 50,000 daily users." },
    { id: "s2", prompt_vn: "Giảm thời gian build CI/CD từ 15 phút xuống còn 4 phút.", words: ["Reduced", "CI/CD", "build", "time", "from", "15", "minutes", "to", "4", "minutes."], answer: "Reduced CI/CD build time from 15 minutes to 4 minutes." },
    { id: "s3", prompt_vn: "Hãy liên hệ nếu bạn đang tuyển dụng cho các vị trí React.", words: ["Reach", "out", "if", "you're", "hiring", "for", "React", "roles."], answer: "Reach out if you're hiring for React roles." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What makes a strong LinkedIn headline?", options: ["Chỉ tên công ty hiện tại", "Job title + key skills + value proposition", "Tên + email + số điện thoại", "Chỉ viết 'Software Engineer'"], answer: "Job title + key skills + value proposition", type: "multiple-choice" },
    { id: "pq2", question: "What does 'Open to Opportunities' on LinkedIn mean?", options: ["Công ty đang tuyển dụng", "Profile cần update", "Dev sẵn sàng nhận job offer", "Profile được public"], answer: "Dev sẵn sàng nhận job offer", type: "multiple-choice" },
    { id: "pq3", question: "Which bullet point is most effective for a CV?", options: ["Worked on frontend", "Was in charge of UI", "Built responsive UI with React, reducing bounce rate by 25%", "Did frontend work with the team"], answer: "Built responsive UI with React, reducing bounce rate by 25%", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Giảm thời gian load trang 40% bằng cách optimize images và lazy loading.", answer: "Reduced page load time by 40% through image optimization and lazy loading." },
    { id: "pt2", prompt_vn: "3 năm kinh nghiệm xây dựng REST APIs với Node.js và PostgreSQL.", answer: "3 years of experience building REST APIs with Node.js and PostgreSQL." },
    { id: "pt3", prompt_vn: "Hãy kết nối nếu bạn muốn hợp tác trên dự án open source.", answer: "Let's connect if you want to collaborate on open source projects." },
  ],

  dialogues: [
    {
      id: 1,
      title: "LinkedIn profile review với mentor",
      audio: "/audio/unit40/dialogue_1.mp3",
      desc: "Tú nhờ mentor review LinkedIn profile trước khi apply jobs.",
      lines: [
        { id: "d1-1", speaker: "Mentor", text: "Tú, I looked at your LinkedIn profile. Your headline just says 'Software Engineer' — that's too generic. Recruiters search by specific skills.", translation: "Tú, tôi đã xem LinkedIn profile của bạn. Headline của bạn chỉ ghi 'Software Engineer' — quá chung chung. Recruiters tìm kiếm theo kỹ năng cụ thể." },
        { id: "d1-2", speaker: "Tu", text: "What should I write instead? I work with React, Node.js, and AWS.", translation: "Tôi nên viết gì thay thế? Tôi làm việc với React, Node.js, và AWS." },
        { id: "d1-3", speaker: "Mentor", text: "Try: 'Full-Stack Developer | React · Node.js · AWS | Building scalable web apps | Open to remote roles.' That's keyword-rich and tells recruiters exactly what you offer.", translation: "Thử: 'Full-Stack Developer | React · Node.js · AWS | Building scalable web apps | Open to remote roles.' Đó là keyword-rich và cho recruiters biết chính xác bạn offer gì." },
        { id: "d1-4", speaker: "Tu", text: "Got it. What about the summary section? I wrote 'I love coding and I'm hardworking.'", translation: "Hiểu rồi. Còn phần summary thì sao? Tôi đã viết 'I love coding and I'm hardworking.'" },
        { id: "d1-5", speaker: "Mentor", text: "That won't stand out. Try quantifying your experience: '3+ years building production apps with 50K+ users. I specialize in performance optimization and clean architecture. Let's connect if you're hiring for React roles.'", translation: "Như vậy không nổi bật. Thử quantify kinh nghiệm: '3+ years building production apps with 50K+ users. I specialize in performance optimization and clean architecture. Let's connect if you're hiring for React roles.'" },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "Reduced API response time by 40% through query optimization and caching.", options: ["Thêm 40% APIs mới", "Cải thiện tốc độ API 40% bằng optimization", "Mất 40% performance", "Cache bị lỗi 40%"], answer: "Cải thiện tốc độ API 40% bằng optimization" },
    { id: "lac2", audio_text: "I've set my profile to Open to Opportunities so recruiters can find me.", options: ["Profile đang public", "Dev đang sẵn sàng nhận job offer", "Profile cần update", "Dev đã tìm được việc"], answer: "Dev đang sẵn sàng nhận job offer" },
    { id: "lac3", audio_text: "My tech stack includes React, TypeScript, Node.js, and PostgreSQL.", options: ["Dev muốn học các công nghệ này", "Đây là list technology dev đang dùng", "Dev không biết các tech này", "Tech stack của công ty"], answer: "Đây là list technology dev đang dùng" },
  ],

  speaking: {
    level1Prompt: "Giới thiệu bản thân cho LinkedIn summary — 3-5 câu ngắn gọn, chuyên nghiệp.",
    level1Placeholder: "I'm a [role] with [X] years of experience in [tech stack]. I specialize in... Let's connect if...",
    level2Situation: "Recruiter hỏi bạn: 'Tell me about your most impactful project.' Describe một project với metrics cụ thể.",
    level2Hint: "I built a real-time notification system for an e-commerce platform. It reduced customer support tickets by 30% and improved order completion rate by 15%. I used Node.js with WebSockets and Redis for pub/sub, serving 20,000 concurrent users.",
  },

  quiz: [
    { id: "q1", question: "Which LinkedIn headline strategy is most effective?", options: ["Chỉ job title", "Job title + tech stack + value + availability", "Tên công ty + số điện thoại", "Chỉ viết 'Developer'"], answer: "Job title + tech stack + value + availability", type: "multiple-choice" },
    { id: "q2", question: "What makes a CV bullet point strong?", options: ["Dài và chi tiết nhất có thể", "Action verb + what + measurable result", "Mô tả responsibility", "Liệt kê tất cả tasks đã làm"], answer: "Action verb + what + measurable result", type: "multiple-choice" },
    { id: "q3", question: "What does a 'recommendation' on LinkedIn prove?", options: ["Bạn có nhiều followers", "Người khác đã xác nhận kỹ năng/công việc của bạn", "Bạn là premium user", "Bạn có nhiều connections"], answer: "Người khác đã xác nhận kỹ năng/công việc của bạn", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: Always ___ your achievements with numbers — 'increased by 30%'.", options: ["describe", "quantify", "explain", "add"], answer: "quantify", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Tăng tốc độ tải trang 35% bằng cách thêm CDN.", answer: "Improved page load speed by 35% by adding a CDN.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Professional profile vocabulary",
    timeLimit: 60,
    items: [
      { en: "headline", vn: "dòng tiêu đề profile" },
      { en: "tech stack", vn: "bộ công nghệ đang dùng" },
      { en: "endorsement", vn: "xác nhận kỹ năng" },
      { en: "recommendation", vn: "lời nhận xét từ đồng nghiệp" },
      { en: "portfolio", vn: "bộ sưu tập dự án" },
      { en: "metrics", vn: "số liệu chứng minh impact" },
      { en: "open to opportunities", vn: "sẵn sàng nhận job mới" },
      { en: "call to action", vn: "kêu gọi hành động" },
      { en: "remote-friendly", vn: "có thể làm việc từ xa" },
    ],
  },
};

export default unit40;
