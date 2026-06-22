import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 36 — Daily Standup & Dev Meetings (B2 / Phase 4)
const unit36: UnitData = {
  unitId: "unit-36",
  title: "Unit 36: Daily Standup & Dev Meetings",
  level: "B2",
  xp: 120,
  estimatedTime: 55,
  description: "Thành thạo standup format và ngôn ngữ họp Agile/Scrum trong team quốc tế.",
  badgeName: "Meeting Master",
  badgeEmoji: "🗣️",

  situation:
    "Công ty bạn dùng Agile Scrum. Mỗi sáng có daily standup 15 phút với team gồm người Mỹ, Anh, Ấn Độ. Senior dev hỏi bạn: 'Minh, what did you work on yesterday, what's your plan today, and do you have any blockers?'",

  learningOutcomes: [
    "Trả lời đúng format standup: yesterday / today / blockers",
    "Dùng ngôn ngữ Agile/Scrum chuẩn (sprint, backlog, ticket, blocker)",
    "Đề xuất ý kiến và raise issue trong meeting tự tin",
  ],

  culturalNote:
    'Standup meeting có quy tắc vàng: <span class="text-emerald-400 font-semibold">15 phút — không thêm</span>. Nếu có vấn đề cần thảo luận sâu, nói "Let\'s take this offline" = xử lý sau meeting. Đây không phải bất lịch sự mà là respect thời gian của team. Người Việt hay mô tả quá chi tiết — trong standup, chỉ cần đủ để team hiểu.',

  warmupGreetings: [
    { emoji: "☀️", en: "Good morning everyone! Ready for standup?", vn: "Chào buổi sáng mọi người! Sẵn sàng standup chưa?", context: "Mở đầu standup" },
    { emoji: "📋", en: "Yesterday I finished the user authentication module.", vn: "Hôm qua tôi đã hoàn thành module xác thực người dùng.", context: "Báo cáo trong standup" },
    { emoji: "🚧", en: "I have a blocker — the staging environment is down.", vn: "Tôi có blocker — môi trường staging đang down.", context: "Báo cáo blocker" },
  ],

  vocab: [
    { id: 1, word: "standup", emoji: "🧍", phonetic: "/ˈstændʌp/", meaning: "cuộc họp hàng ngày ngắn (thường 15 phút)", example: "Our daily standup is at 9 AM — let's keep it under 15 minutes.", example2: "Async standup = viết update trên Slack thay vì họp.", collocation: "daily standup / async standup / standup format", audio: "/audio/unit36/standup.mp3" },
    { id: 2, word: "blocker", emoji: "🚧", phonetic: "/ˈblɒkər/", meaning: "vấn đề ngăn bạn tiến triển", example: "I have a blocker — I'm waiting for the API credentials from the infrastructure team.", example2: "If you have a blocker, raise it in standup immediately.", collocation: "raise a blocker / resolve a blocker / no blockers", audio: "/audio/unit36/blocker.mp3" },
    { id: 3, word: "sprint", emoji: "🏃", phonetic: "/sprɪnt/", meaning: "chu kỳ phát triển (thường 1-2 tuần)", example: "We have 5 tickets left to close before end of sprint.", example2: "Sprint planning is every other Monday.", collocation: "sprint planning / end of sprint / sprint review", audio: "/audio/unit36/sprint.mp3" },
    { id: 4, word: "ticket / issue", emoji: "🎫", phonetic: "/ˈtɪkɪt/", meaning: "task cụ thể được track trên Jira/Linear", example: "I'm working on ticket PROJ-234 — the login page redesign.", example2: "Create a ticket for every bug before fixing it.", collocation: "open a ticket / close a ticket / pick up a ticket", audio: "/audio/unit36/ticket.mp3" },
    { id: 5, word: "backlog", emoji: "📚", phonetic: "/ˈbæklɒɡ/", meaning: "danh sách tất cả tasks chưa làm", example: "We have 40 items in the backlog — PM will prioritize in sprint planning.", example2: "That feature is in the backlog but not in this sprint.", collocation: "product backlog / backlog grooming / backlog item", audio: "/audio/unit36/backlog.mp3" },
    { id: 6, word: "velocity", emoji: "📈", phonetic: "/vəˈlɒsɪti/", meaning: "tốc độ hoàn thành công việc của team (story points/sprint)", example: "Our team velocity is 40 story points per sprint.", example2: "Velocity dropped this sprint because of production incidents.", collocation: "team velocity / story points / velocity chart", audio: "/audio/unit36/velocity.mp3" },
    { id: 7, word: "take this offline", emoji: "💬", phonetic: "/teɪk ðɪs ˈɒflaɪn/", meaning: "thảo luận tiếp sau/ngoài meeting", example: "That's a great question — let's take this offline and chat after standup.", example2: "To respect everyone's time, we should take deep-dives offline.", collocation: "take it offline / discuss offline / offline conversation", audio: "/audio/unit36/take.mp3" },
    { id: 8, word: "capacity", emoji: "⚡", phonetic: "/kəˈpæsɪti/", meaning: "khả năng làm việc của team trong sprint", example: "We have reduced capacity this sprint — two team members are on leave.", example2: "Plan sprint based on team capacity, not ideal output.", collocation: "team capacity / capacity planning / at full capacity", audio: "/audio/unit36/capacity.mp3" },
    { id: 9, word: "retrospective (retro)", emoji: "🔄", phonetic: "/ˌretrəˈspektɪv/", meaning: "họp sau sprint để review và cải thiện quy trình", example: "In the retro, we discussed what went well and what to improve.", example2: "Retro action items should be assigned and tracked.", collocation: "sprint retrospective / retro meeting / retro action item", audio: "/audio/unit36/retrospective.mp3" },
    { id: 10, word: "ETA", emoji: "⏰", phonetic: "/iː tiː eɪ/", meaning: "Estimated Time of Arrival — thời gian dự kiến hoàn thành", example: "What's your ETA on the payment integration?", example2: "No firm ETA yet — depends on API response from the vendor.", collocation: "ETA for completion / no ETA / give an ETA", audio: "/audio/unit36/eta.mp3" },
  ],

  grammar: {
    title: "Past Simple vs Present Perfect trong Standup",
    rule: "Yesterday (Past Simple):\n'I worked on / I fixed / I completed'\n\nToday (Present Simple + going to):\n'I'm going to / I plan to / I'll continue'\n\nBlockers (Present Perfect + Present):\n'I've been waiting for / I'm blocked by'",
    examples: [
      { en: "Yesterday I worked on the login page and fixed the session timeout bug.", vn: "Hôm qua tôi làm login page và sửa bug session timeout." },
      { en: "Today I'm going to finish the unit tests and open a PR.", vn: "Hôm nay tôi sẽ hoàn thành unit tests và mở PR." },
      { en: "I have a blocker — I've been waiting for DB access since yesterday.", vn: "Tôi có blocker — tôi đã đợi DB access từ hôm qua." },
      { en: "No blockers from my side — all good!", vn: "Không có blocker nào từ phía tôi — ổn hết!" },
    ],
    tip: "Standup chuẩn dùng 3 câu hoặc ít hơn cho mỗi phần. Ngắn gọn = professional. Nếu cần giải thích thêm: 'I can share more details after standup.'",
    vnNote: "Người Việt hay nói 'Hôm qua tôi đã làm...' = correct Past Simple. Nhưng tránh nói 'Hôm qua tôi đã hoàn thành đã xong rồi' — redundant trong tiếng Anh.",
    ccq: {
      question: "Câu standup nào đúng format nhất?",
      options: [
        "I do authentication feature",
        "Yesterday I implemented OAuth login. Today I'll write tests. Blocker: waiting for test credentials.",
        "I am working on many things including authentication and also testing and there are some issues...",
        "No update today.",
      ],
      answer: "Yesterday I implemented OAuth login. Today I'll write tests. Blocker: waiting for test credentials.",
      explanation: "Format chuẩn: Yesterday (done) + Today (plan) + Blocker (or 'no blockers'). Ngắn gọn và rõ ràng.",
    },
  },

  matchingExercise: {
    title: "Nối thuật ngữ Agile với định nghĩa",
    pairs: [
      { left: "sprint", right: "Chu kỳ phát triển 1-2 tuần" },
      { left: "blocker", right: "Vấn đề ngăn tiến triển" },
      { left: "backlog", right: "Danh sách tasks chưa làm" },
      { left: "retro", right: "Họp review sau sprint" },
      { left: "velocity", right: "Tốc độ hoàn thành của team" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Hôm qua tôi đã hoàn thành user authentication module.", words: ["Yesterday", "I", "completed", "the", "user", "authentication", "module."], answer: "Yesterday I completed the user authentication module." },
    { id: "s2", prompt_vn: "Tôi bị blocked bởi thiếu API credentials từ infra team.", words: ["I'm", "blocked", "by", "missing", "API", "credentials", "from", "the", "infra", "team."], answer: "I'm blocked by missing API credentials from the infra team." },
    { id: "s3", prompt_vn: "Hãy take cái này offline — tôi sẽ ping bạn sau standup.", words: ["Let's", "take", "this", "offline", "—", "I'll", "ping", "you", "after", "standup."], answer: "Let's take this offline — I'll ping you after standup." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What does 'I have a blocker' mean in a standup?", options: ["Tôi cần thêm thời gian", "Có vấn đề ngăn tôi tiến triển", "Tôi đã hoàn thành task", "Tôi muốn cancel sprint"], answer: "Có vấn đề ngăn tôi tiến triển", type: "multiple-choice" },
    { id: "pq2", question: "What is 'backlog grooming'?", options: ["Review và ưu tiên lại backlog items", "Xóa tất cả old tickets", "Viết code review", "Deploy sprint mới"], answer: "Review và ưu tiên lại backlog items", type: "multiple-choice" },
    { id: "pq3", question: "Khi cuộc thảo luận trong standup quá dài, bạn nói gì?", options: ["Stop talking", "Let's take this offline", "Skip this topic", "Meeting over"], answer: "Let's take this offline", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Hôm nay tôi sẽ làm unit tests và mở PR.", answer: "Today I'm going to write unit tests and open a PR." },
    { id: "pt2", prompt_vn: "Không có blockers nào từ phía tôi.", answer: "No blockers from my side." },
    { id: "pt3", prompt_vn: "ETA của feature này là cuối tuần này.", answer: "The ETA for this feature is end of this week." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Daily Standup Meeting",
      audio: "/audio/unit36/dialogue_1.mp3",
      desc: "Team standup hàng ngày — Minh báo cáo progress và blocker.",
      lines: [
        { id: "d1-1", speaker: "Scrum Master", text: "Good morning everyone! Let's start standup. Minh, you're up first.", translation: "Chào buổi sáng mọi người! Bắt đầu standup nhé. Minh, bạn đi trước." },
        { id: "d1-2", speaker: "Minh", text: "Sure! Yesterday I finished the user profile API and deployed to staging. Today I'm going to work on the notification service. I have one blocker — I need database write permissions for the notifications table.", translation: "Được! Hôm qua tôi hoàn thành user profile API và deploy lên staging. Hôm nay tôi sẽ làm notification service. Tôi có một blocker — tôi cần quyền ghi vào bảng notifications trong database." },
        { id: "d1-3", speaker: "Scrum Master", text: "Got it. I'll reach out to the DevOps team right after standup. Anything else?", translation: "Hiểu rồi. Tôi sẽ liên hệ team DevOps ngay sau standup. Còn gì nữa không?" },
        { id: "d1-4", speaker: "Minh", text: "That's it from my side. One quick note — the staging deploy took longer than expected. I found a config issue. I'll document it after today's tasks.", translation: "Vậy thôi từ phía tôi. Một lưu ý nhanh — việc deploy lên staging mất lâu hơn dự kiến. Tôi tìm thấy một config issue. Tôi sẽ document nó sau khi xong tasks hôm nay." },
        { id: "d1-5", speaker: "Scrum Master", text: "Great, create a ticket for that config issue so we can track it. Alright team, let's keep velocity up. Have a productive day!", translation: "Tốt, tạo ticket cho config issue đó để chúng ta theo dõi. Ổn rồi team, hãy giữ velocity. Chúc mọi người làm việc hiệu quả!" },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "I'm blocked — I've been waiting for test data from QA since Monday.", options: ["Người này đang test code", "Người này không có blockers", "Người này đang đợi từ QA team", "Người này đã hoàn thành task"], answer: "Người này đang đợi từ QA team" },
    { id: "lac2", audio_text: "Let's keep this discussion offline — we're running over time.", options: ["Tiếp tục thảo luận sau meeting", "Kết thúc thảo luận", "Mọi người nên offline", "Thảo luận ngay bây giờ"], answer: "Tiếp tục thảo luận sau meeting" },
    { id: "lac3", audio_text: "Our velocity dropped to 30 points this sprint due to production incidents.", options: ["Team đã đạt 30 goals", "Team làm chậm hơn sprint này do production issues", "Team cần 30 points thêm", "Sprint kết thúc sau 30 ngày"], answer: "Team làm chậm hơn sprint này do production issues" },
  ],

  speaking: {
    level1Prompt: "Hãy thực hành standup: Yesterday, Today, Blockers của bạn hôm nay.",
    level1Placeholder: "Yesterday I... Today I'm going to... No blockers / I have a blocker...",
    level2Situation: "Trong sprint planning, PM hỏi: 'Can the team commit to delivering the payment feature by end of sprint?' Bạn lo ngại về timeline.",
    level2Hint: "I'm a bit concerned about committing to that timeline. We still have dependencies on the payment gateway team and our current velocity suggests we'd need one more sprint. Could we scope it down to just the basic payment flow for this sprint?",
  },

  quiz: [
    { id: "q1", question: "What are the 3 questions answered in a daily standup?", options: ["Plan, Execute, Review", "Yesterday, Today, Blockers", "Features, Bugs, Debt", "Goals, Status, Next"], answer: "Yesterday, Today, Blockers", type: "multiple-choice" },
    { id: "q2", question: "What does 'ETA' stand for?", options: ["End Task Action", "Estimated Time of Arrival", "Error Tracking Alert", "Engineering Team Agenda"], answer: "Estimated Time of Arrival", type: "multiple-choice" },
    { id: "q3", question: "How long should a daily standup typically last?", options: ["5 minutes", "15 minutes", "30 minutes", "1 hour"], answer: "15 minutes", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: Our team ___ dropped this sprint because two members are on leave.", options: ["speed", "velocity", "capacity", "throughput"], answer: "velocity", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Tôi bị blocked — đang đợi phê duyệt từ team security.", answer: "I have a blocker — I've been waiting for approval from the security team.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Agile vocabulary sprint",
    timeLimit: 60,
    items: [
      { en: "standup", vn: "họp ngắn hàng ngày" },
      { en: "blocker", vn: "vấn đề ngăn tiến triển" },
      { en: "sprint", vn: "chu kỳ phát triển 1-2 tuần" },
      { en: "backlog", vn: "danh sách tasks chưa làm" },
      { en: "velocity", vn: "tốc độ hoàn thành của team" },
      { en: "retro", vn: "họp review sau sprint" },
      { en: "take this offline", vn: "thảo luận sau meeting" },
      { en: "ETA", vn: "thời gian dự kiến hoàn thành" },
      { en: "ticket", vn: "task cụ thể trên Jira/Linear" },
    ],
  },
};

export default unit36;
