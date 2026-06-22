import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 38 — Tech Email & Slack (B2 / Phase 4)
const unit38: UnitData = {
  unitId: "unit-38",
  title: "Unit 38: Tech Email & Slack",
  level: "B2",
  xp: 120,
  estimatedTime: 55,
  description: "Viết email kỹ thuật và tin nhắn Slack chuyên nghiệp trong môi trường dev quốc tế.",
  badgeName: "Tech Writer",
  badgeEmoji: "✉️",

  situation:
    "Production đang bị lỗi lúc 2 giờ sáng. Bạn cần: (1) Notify team trên Slack ngay lập tức, (2) Gửi email update cho stakeholders, (3) Viết incident report sau khi fix xong.",

  learningOutcomes: [
    "Viết incident notification Slack rõ ràng, nhanh chóng",
    "Viết email technical update theo format Subject, Context, Action, ETA",
    "Viết incident report sau khi giải quyết sự cố",
  ],

  culturalNote:
    'Trong tech, email và Slack có văn hóa rất khác nhau. <span class="text-emerald-400 font-semibold">Slack</span> = nhanh, không formal, có thể dùng emoji. <span class="text-emerald-400 font-semibold">Email</span> = permanent record, cần rõ ràng, subject line phải actionable. Rule of thumb: nếu cần response < 1 giờ → Slack. Nếu cần documentation → Email.',

  warmupGreetings: [
    { emoji: "🚨", en: "🚨 Production alert: login service is returning 500 errors.", vn: "🚨 Production alert: dịch vụ login đang trả về lỗi 500.", context: "Slack alert khi incident xảy ra" },
    { emoji: "📧", en: "Hi team, quick update on the deployment status.", vn: "Chào team, cập nhật nhanh về trạng thái deployment.", context: "Mở đầu email update" },
    { emoji: "✅", en: "All clear — incident resolved. Post-mortem to follow.", vn: "Ổn rồi — incident đã được giải quyết. Post-mortem sẽ theo sau.", context: "Slack sau khi fix xong" },
  ],

  vocab: [
    { id: 1, word: "incident", emoji: "🚨", phonetic: "/ˈɪnsɪdənt/", meaning: "sự cố kỹ thuật — thường ảnh hưởng production", example: "We have an active incident — the payment service is down.", example2: "The incident was resolved within 2 hours.", collocation: "production incident / incident report / resolve an incident", audio: "/audio/unit38/incident.mp3" },
    { id: 2, word: "postmortem / post-mortem", emoji: "📋", phonetic: "/pəʊst ˈmɔːrtəm/", meaning: "báo cáo phân tích sau sự cố", example: "We'll conduct a blameless post-mortem after the incident is resolved.", example2: "The post-mortem identified three root causes.", collocation: "blameless post-mortem / write a post-mortem / post-mortem report", audio: "/audio/unit38/postmortem.mp3" },
    { id: 3, word: "root cause", emoji: "🌱", phonetic: "/ruːt kɔːz/", meaning: "nguyên nhân gốc rễ của vấn đề", example: "The root cause was a misconfigured environment variable in production.", example2: "We found the root cause: a race condition in the caching layer.", collocation: "root cause analysis (RCA) / identify root cause / root cause fix", audio: "/audio/unit38/root.mp3" },
    { id: 4, word: "downtime", emoji: "⏸️", phonetic: "/ˈdaʊntaɪm/", meaning: "thời gian hệ thống không hoạt động", example: "The downtime lasted 47 minutes, affecting 2,000 users.", example2: "We aim for less than 1 hour of downtime per month.", collocation: "planned downtime / unexpected downtime / minimize downtime", audio: "/audio/unit38/downtime.mp3" },
    { id: 5, word: "escalate", emoji: "📈", phonetic: "/ˈeskəleɪt/", meaning: "leo thang — báo cáo lên cấp trên khi không tự xử lý được", example: "If you can't fix it in 30 minutes, escalate to the on-call engineer.", example2: "We need to escalate this incident to the CTO.", collocation: "escalate an issue / escalate to management / incident escalation", audio: "/audio/unit38/escalate.mp3" },
    { id: 6, word: "on-call", emoji: "📱", phonetic: "/ɒn kɔːl/", meaning: "người trực sự cố — sẵn sàng 24/7 để xử lý incidents", example: "Who is on-call this weekend?", example2: "Page the on-call engineer if the alert fires.", collocation: "on-call rotation / on-call engineer / on-call schedule", audio: "/audio/unit38/on_call.mp3" },
    { id: 7, word: "mitigation", emoji: "🛡️", phonetic: "/ˌmɪtɪˈɡeɪʃən/", meaning: "giảm thiểu tác động trong khi tìm root cause fix", example: "As a mitigation, we've disabled the feature flag temporarily.", example2: "The mitigation brought the error rate from 80% back to 2%.", collocation: "immediate mitigation / mitigation step / mitigate impact", audio: "/audio/unit38/mitigation.mp3" },
    { id: 8, word: "action item", emoji: "✅", phonetic: "/ˈækʃən ˈaɪtəm/", meaning: "việc cụ thể cần làm được giao cho người cụ thể", example: "Action item: update the load balancer config by Monday — assigned to Dev Ops team.", example2: "Every post-mortem should produce clear action items.", collocation: "assign action item / action item owner / follow up on action items", audio: "/audio/unit38/action.mp3" },
    { id: 9, word: "status update", emoji: "📊", phonetic: "/ˈsteɪtəs ˈʌpdeɪt/", meaning: "cập nhật tiến độ/tình hình", example: "I'll send a status update every 30 minutes until the incident is resolved.", example2: "Can you send a status update to the stakeholders?", collocation: "send a status update / status update email / regular updates", audio: "/audio/unit38/status.mp3" },
    { id: 10, word: "stakeholder", emoji: "👥", phonetic: "/ˈsteɪkhəʊldər/", meaning: "người có liên quan — có thể bị ảnh hưởng bởi quyết định", example: "Please inform all stakeholders about the planned maintenance window.", example2: "Stakeholders need to know the ETA for the fix.", collocation: "notify stakeholders / key stakeholders / stakeholder communication", audio: "/audio/unit38/stakeholder.mp3" },
  ],

  grammar: {
    title: "Email Structure & Tone trong Tech Context",
    rule: "Format email kỹ thuật chuẩn:\n• Subject: [URGENT/INFO/ACTION] specific topic\n• Context: 'As of [time], [what happened]'\n• Impact: 'This affects [users/systems]'\n• Actions taken: 'We have [already done X]'\n• Next steps: 'We are [currently doing Y]'\n• ETA: 'We expect [resolution] by [time]'\n• Contact: 'Reach out to [name] with questions'",
    examples: [
      { en: "[URGENT] Production login service down — 500 errors since 14:32 UTC", vn: "[KHẨN] Dịch vụ login production bị lỗi — lỗi 500 từ 14:32 UTC" },
      { en: "As of 14:32 UTC, the login service is returning 500 errors for all users.", vn: "Kể từ 14:32 UTC, dịch vụ login đang trả về lỗi 500 cho tất cả người dùng." },
      { en: "We have reverted the last deployment as an immediate mitigation.", vn: "Chúng tôi đã revert deployment cuối như một biện pháp giảm thiểu tức thời." },
      { id: "e4", en: "We expect full resolution by 16:00 UTC. Updates every 30 minutes.", vn: "Chúng tôi dự kiến giải quyết hoàn toàn trước 16:00 UTC. Cập nhật mỗi 30 phút." },
    ] as { en: string; vn: string }[],
    tip: "Subject line quyết định email có được đọc không. Dùng [URGENT], [INFO], [ACTION REQUIRED] ở đầu để người nhận biết ngay mức độ ưu tiên.",
    vnNote: "Email tiếng Anh không cần 'Dear Sir/Madam' trong tech context. 'Hi team,' hoặc 'All,' là đủ. Kết thúc bằng 'Thanks,' hoặc 'Best,' thay vì 'Trân trọng kính chào'.",
    ccq: {
      question: "Email subject nào chuẩn nhất cho incident?",
      options: [
        "Problem with server",
        "[URGENT] Production API down — affecting all users since 15:00 UTC",
        "Hi team",
        "Server is broken please help",
      ],
      answer: "[URGENT] Production API down — affecting all users since 15:00 UTC",
      explanation: "[URGENT] tag + what + who affected + when. Người nhận đọc subject là hiểu ngay độ nghiêm trọng.",
    },
  },

  matchingExercise: {
    title: "Nối thuật ngữ incident response với định nghĩa",
    pairs: [
      { left: "post-mortem", right: "Báo cáo phân tích sau sự cố" },
      { left: "root cause", right: "Nguyên nhân gốc rễ" },
      { left: "mitigation", right: "Giảm thiểu tác động tạm thời" },
      { left: "escalate", right: "Báo cáo lên cấp trên" },
      { left: "action item", right: "Việc cần làm được assign" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Chúng tôi đã revert deployment cuối như một biện pháp giảm thiểu.", words: ["We", "have", "reverted", "the", "last", "deployment", "as", "a", "mitigation."], answer: "We have reverted the last deployment as a mitigation." },
    { id: "s2", prompt_vn: "Vui lòng escalate lên on-call engineer nếu bạn không thể fix trong 30 phút.", words: ["Please", "escalate", "to", "the", "on-call", "engineer", "if", "you", "can't", "fix", "it", "in", "30", "minutes."], answer: "Please escalate to the on-call engineer if you can't fix it in 30 minutes." },
    { id: "s3", prompt_vn: "Root cause là một environment variable bị cấu hình sai trong production.", words: ["The", "root", "cause", "was", "a", "misconfigured", "environment", "variable", "in", "production."], answer: "The root cause was a misconfigured environment variable in production." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "When should you escalate an incident?", options: ["Sau khi fix xong", "Khi không tự xử lý được trong thời gian định", "Sau khi viết post-mortem", "Khi stakeholders hỏi"], answer: "Khi không tự xử lý được trong thời gian định", type: "multiple-choice" },
    { id: "pq2", question: "What is a 'blameless post-mortem'?", options: ["Phân tích lỗi không blame cá nhân, tập trung vào process", "Báo cáo không đề cập root cause", "Họp sau sprint", "Email gửi CEO"], answer: "Phân tích lỗi không blame cá nhân, tập trung vào process", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ: The ___ lasted 2 hours, affecting 5,000 users.", options: ["incident", "downtime", "root cause", "mitigation"], answer: "downtime", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Nguyên nhân gốc rễ là một race condition trong caching layer.", answer: "The root cause was a race condition in the caching layer." },
    { id: "pt2", prompt_vn: "Chúng tôi sẽ gửi status update mỗi 30 phút.", answer: "We will send a status update every 30 minutes." },
    { id: "pt3", prompt_vn: "Action item: update firewall rules trước thứ Hai — giao cho DevOps team.", answer: "Action item: update firewall rules by Monday — assigned to the DevOps team." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Production Incident Slack Thread",
      audio: "/audio/unit38/dialogue_1.mp3",
      desc: "Team xử lý production incident qua Slack.",
      lines: [
        { id: "d1-1", speaker: "Monitoring Bot", text: "🚨 ALERT: Error rate on payment-service spiked to 85% — threshold exceeded.", translation: "🚨 CẢNH BÁO: Tỷ lệ lỗi trên payment-service tăng lên 85% — vượt ngưỡng." },
        { id: "d1-2", speaker: "Minh (on-call)", text: "On it! Taking a look now. @team — we have a P1 incident. Payment service is down. I'll investigate and update every 15 mins.", translation: "Tôi đang xử lý! Đang kiểm tra. @team — chúng ta có P1 incident. Payment service bị down. Tôi sẽ điều tra và cập nhật mỗi 15 phút." },
        { id: "d1-3", speaker: "Minh (on-call)", text: "Update 1 (15 min): Root cause identified — a bad config was deployed at 14:30. Reverting now as immediate mitigation.", translation: "Update 1 (15 phút): Đã xác định root cause — một config xấu được deploy lúc 14:30. Đang revert ngay như biện pháp giảm thiểu tức thời." },
        { id: "d1-4", speaker: "Lead Dev", text: "Good work on the quick identification. Do you need to escalate to the infra team?", translation: "Tốt lắm khi phát hiện nhanh. Bạn có cần escalate lên infra team không?" },
        { id: "d1-5", speaker: "Minh (on-call)", text: "Revert is done! Error rate back to 0.2%. Service is healthy. I'll write up the post-mortem and action items by EOD.", translation: "Revert xong! Tỷ lệ lỗi trở về 0.2%. Service đã khỏe. Tôi sẽ viết post-mortem và action items trước cuối ngày." },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "We need to escalate this to the CTO — downtime is approaching 2 hours.", options: ["Báo cáo CEO về chi phí", "Báo cáo lên CTO vì downtime kéo dài", "Tắt hệ thống tạm thời", "Không cần làm gì"], answer: "Báo cáo lên CTO vì downtime kéo dài" },
    { id: "lac2", audio_text: "The post-mortem identified a race condition as the root cause.", options: ["Tìm ra người gây lỗi", "Xác định nguyên nhân gốc là race condition", "Báo cáo đổ lỗi cho developer", "Lên kế hoạch sprint mới"], answer: "Xác định nguyên nhân gốc là race condition" },
    { id: "lac3", audio_text: "As a mitigation, we've disabled the feature flag for all users.", options: ["Xóa feature vĩnh viễn", "Tắt feature tạm thời để giảm tác động", "Enable feature cho tất cả users", "Rollback toàn bộ version"], answer: "Tắt feature tạm thời để giảm tác động" },
  ],

  speaking: {
    level1Prompt: "Viết Slack message thông báo production incident cho team.",
    level1Placeholder: "🚨 Production alert: [service] is [issue]. Impact: [users]. Investigating now.",
    level2Situation: "Sau khi fix incident, bạn cần gửi email tóm tắt cho stakeholders. Viết email với: root cause, downtime duration, mitigation, action items.",
    level2Hint: "Subject: [RESOLVED] Payment service outage — post-mortem summary\n\nHi team,\n\nThe payment service outage (14:32-15:18 UTC, 46 min) has been resolved. Root cause: misconfigured env variable deployed at 14:30...",
  },

  quiz: [
    { id: "q1", question: "What should a 'blameless post-mortem' focus on?", options: ["Who made the mistake", "Process improvements to prevent recurrence", "Punishing the on-call engineer", "Customer refunds"], answer: "Process improvements to prevent recurrence", type: "multiple-choice" },
    { id: "q2", question: "What does 'on-call' mean?", options: ["Người gọi điện cho khách hàng", "Người trực sự cố 24/7", "Người gọi meeting", "Người trực điện thoại văn phòng"], answer: "Người trực sự cố 24/7", type: "multiple-choice" },
    { id: "q3", question: "What format works best for incident email subjects?", options: ["Just 'Important'", "[URGENT/INFO] + what + impact + when", "Hi all, update", "EMERGENCY!!!"], answer: "[URGENT/INFO] + what + impact + when", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: We identified the ___ cause: a misconfigured load balancer.", options: ["root", "main", "core", "basic"], answer: "root", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Incident đã được giải quyết — post-mortem sẽ theo sau.", answer: "Incident resolved — post-mortem to follow.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Incident response vocabulary",
    timeLimit: 60,
    items: [
      { en: "incident", vn: "sự cố kỹ thuật" },
      { en: "post-mortem", vn: "báo cáo phân tích sau sự cố" },
      { en: "root cause", vn: "nguyên nhân gốc rễ" },
      { en: "downtime", vn: "thời gian hệ thống không hoạt động" },
      { en: "escalate", vn: "báo cáo lên cấp trên" },
      { en: "mitigation", vn: "giảm thiểu tác động tạm thời" },
      { en: "on-call", vn: "người trực sự cố" },
      { en: "action item", vn: "việc cần làm được assign" },
      { en: "stakeholder", vn: "người có liên quan" },
    ],
  },
};

export default unit38;
