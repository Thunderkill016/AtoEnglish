import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 41 — Open Source Contribution (B2 / Phase 4)
const unit41: UnitData = {
  unitId: "unit-41",
  title: "Unit 41: Open Source Contribution",
  level: "B2",
  xp: 130,
  estimatedTime: 60,
  description: "Học ngôn ngữ để đóng góp open source: viết Issue, PR, phản hồi maintainer.",
  badgeName: "Open Source",
  badgeEmoji: "🌐",

  situation:
    "Bạn dùng một thư viện React phổ biến và phát hiện bug. Bạn muốn: (1) Mở Issue để báo cáo, (2) Tự fix và tạo PR, (3) Respond lại feedback từ maintainer người Mỹ.",

  learningOutcomes: [
    "Viết Issue report rõ ràng: bug report, feature request",
    "Viết PR description chuyên nghiệp theo template chuẩn",
    "Giao tiếp lịch sự và hiệu quả với maintainers quốc tế",
  ],

  culturalNote:
    'Open source là cộng đồng toàn cầu — maintainers thường volunteer (không được trả lương). Luôn bắt đầu bằng: <span class="text-emerald-400 font-semibold">"Thank you for maintaining this project"</span>. Đọc CONTRIBUTING.md trước khi tạo PR. Issue không được response sau 2 tuần là bình thường — đừng spam. "Good first issue" label = perfect starting point.',

  warmupGreetings: [
    { emoji: "🐛", en: "I found a bug in the library — should I open an issue?", vn: "Tôi tìm thấy bug trong thư viện — tôi có nên mở issue không?", context: "Hỏi trong team trước khi report" },
    { emoji: "🔀", en: "I've submitted a PR to fix the issue — feedback welcome!", vn: "Tôi đã submit PR để fix issue — hoan nghênh feedback!", context: "Thông báo sau khi tạo PR" },
    { emoji: "🌟", en: "Thank you for your contribution — we'll review it soon.", vn: "Cảm ơn vì đóng góp của bạn — chúng tôi sẽ review sớm.", context: "Maintainer response với contributor" },
  ],

  vocab: [
    { id: 1, word: "maintainer", emoji: "🔧", phonetic: "/meɪnˈteɪnər/", meaning: "người duy trì/quản lý dự án open source", example: "The maintainer reviewed my PR within 24 hours — very responsive!", example2: "Please be patient — maintainers are often volunteers.", collocation: "project maintainer / core maintainer / maintainer response", audio: "/audio/unit41/maintainer.mp3" },
    { id: 2, word: "contributor", emoji: "🤝", phonetic: "/kənˈtrɪbjuːtər/", meaning: "người đóng góp cho dự án (code, docs, bug reports)", example: "First-time contributors should start with 'good first issue' tickets.", example2: "I became a regular contributor after my third accepted PR.", collocation: "first-time contributor / regular contributor / contribute to", audio: "/audio/unit41/contributor.mp3" },
    { id: 3, word: "issue tracker", emoji: "📋", phonetic: "/ˈɪʃuː ˈtræker/", meaning: "hệ thống theo dõi bugs và feature requests", example: "Search the issue tracker before opening a new issue.", example2: "All bug reports go through the GitHub issue tracker.", collocation: "issue tracker / open an issue / close an issue", audio: "/audio/unit41/issue.mp3" },
    { id: 4, word: "good first issue", emoji: "🌱", phonetic: "/ɡʊd fɜːst ˈɪʃuː/", meaning: "label trên GitHub dành cho người mới bắt đầu đóng góp", example: "Filter by 'good first issue' to find beginner-friendly contributions.", example2: "Most projects label easy tasks as 'good first issue' to attract contributors.", collocation: "good first issue / label / beginner-friendly", audio: "/audio/unit41/good.mp3" },
    { id: 5, word: "CONTRIBUTING.md", emoji: "📖", phonetic: "/kənˈtrɪbjuːtɪŋ/", meaning: "file hướng dẫn cách đóng góp vào project", example: "Always read CONTRIBUTING.md before opening a PR.", example2: "CONTRIBUTING.md specifies coding style, test requirements, and PR format.", collocation: "contributing guidelines / read the contributing docs", audio: "/audio/unit41/contributing_md.mp3" },
    { id: 6, word: "wontfix", emoji: "🚫", phonetic: "/wɒnt fɪks/", meaning: "label nghĩa là team quyết định không fix issue này", example: "The issue was labeled 'wontfix' — it's by design, not a bug.", example2: "If your issue is closed as wontfix, the maintainers disagree it's a problem.", collocation: "wontfix label / closed as wontfix / marked wontfix", audio: "/audio/unit41/wontfix.mp3" },
    { id: 7, word: "stale", emoji: "🕰️", phonetic: "/steɪl/", meaning: "issue/PR không có activity trong thời gian dài", example: "My PR was marked stale after 60 days of inactivity.", example2: "Comment on stale issues to show they're still relevant.", collocation: "stale issue / stale bot / marked as stale", audio: "/audio/unit41/stale.mp3" },
    { id: 8, word: "upstream", emoji: "⬆️", phonetic: "/ˈʌpstriːm/", meaning: "repo gốc mà bạn đã fork từ đó", example: "I need to sync my fork with the upstream repository.", example2: "Pull from upstream to get the latest changes before opening a PR.", collocation: "upstream repo / sync with upstream / upstream changes", audio: "/audio/unit41/upstream.mp3" },
    { id: 9, word: "regression", emoji: "📉", phonetic: "/rɪˈɡreʃən/", meaning: "bug mới xuất hiện do thay đổi code gần đây", example: "This is a regression — it worked in v2.1 but broke in v2.2.", example2: "Regression tests catch bugs introduced by new changes.", collocation: "regression bug / regression test / introduce a regression", audio: "/audio/unit41/regression.mp3" },
    { id: 10, word: "fork", emoji: "🍴", phonetic: "/fɔːk/", meaning: "sao chép repo về account của bạn để modify", example: "Fork the repository, make your changes, then open a PR.", example2: "Never commit directly to upstream — always fork first.", collocation: "fork a repository / fork and clone / open a PR from fork", audio: "/audio/unit41/fork.mp3" },
  ],

  grammar: {
    title: "Polite Request Language — Giao tiếp với Maintainers",
    rule: "Khi contribute open source, dùng:\n• Would it be possible to...?\n• I noticed that... / I found that...\n• I'd like to suggest...\n• Would you be open to...?\n• Thank you for your time reviewing this.\n• Please let me know if any changes are needed.",
    examples: [
      { en: "I noticed that the dropdown doesn't close when clicking outside.", vn: "Tôi nhận thấy rằng dropdown không đóng khi click bên ngoài." },
      { en: "Would you be open to accepting a PR that fixes this issue?", vn: "Bạn có muốn chấp nhận PR để fix issue này không?" },
      { en: "Please let me know if any changes are needed — happy to update.", vn: "Hãy cho tôi biết nếu cần thay đổi gì — tôi sẵn sàng cập nhật." },
      { en: "Thank you for maintaining this project — it's been very helpful!", vn: "Cảm ơn vì đã duy trì project này — rất hữu ích!" },
    ],
    tip: "Đừng bao giờ bắt đầu Issue bằng 'Your library is broken!' Thay vào đó: 'I believe I found a bug — here are the steps to reproduce it.'",
    vnNote: "Tiếng Việt thường direct: 'Bị lỗi rồi, fix đi.' Trong open source quốc tế, cần diplomatic hơn. Maintainers có thể close issue nếu tone không phù hợp.",
    ccq: {
      question: "Cách mở Issue tốt nhất là?",
      options: [
        "Your library has a bug! Fix it!",
        "Hi, I believe I found a bug in v2.3. Here are the steps to reproduce it: [steps]. Expected: X. Actual: Y.",
        "Bug in dropdown",
        "Please fix the dropdown",
      ],
      answer: "Hi, I believe I found a bug in v2.3. Here are the steps to reproduce it: [steps]. Expected: X. Actual: Y.",
      explanation: "Chào hỏi lịch sự + specify version + steps to reproduce + expected vs actual = issue report chuẩn.",
    },
  },

  matchingExercise: {
    title: "Nối thuật ngữ open source với định nghĩa",
    pairs: [
      { left: "maintainer", right: "Người quản lý dự án open source" },
      { left: "fork", right: "Sao chép repo về account của bạn" },
      { left: "stale", right: "Không có activity lâu ngày" },
      { left: "regression", right: "Bug do thay đổi code gần đây" },
      { left: "upstream", right: "Repo gốc bạn đã fork" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Tôi tin rằng tôi đã tìm thấy bug trong v2.3 của thư viện.", words: ["I", "believe", "I", "found", "a", "bug", "in", "v2.3", "of", "the", "library."], answer: "I believe I found a bug in v2.3 of the library." },
    { id: "s2", prompt_vn: "Vui lòng cho tôi biết nếu cần thêm thay đổi — tôi rất sẵn sàng update.", words: ["Please", "let", "me", "know", "if", "any", "changes", "are", "needed", "—", "happy", "to", "update."], answer: "Please let me know if any changes are needed — happy to update." },
    { id: "s3", prompt_vn: "Tôi cần sync fork với upstream repository trước khi mở PR.", words: ["I", "need", "to", "sync", "my", "fork", "with", "the", "upstream", "repository", "before", "opening", "a", "PR."], answer: "I need to sync my fork with the upstream repository before opening a PR." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What should you do before opening a PR to an open source project?", options: ["Just send the code", "Read CONTRIBUTING.md and check existing issues", "Email the maintainer first", "Fork and push directly to main"], answer: "Read CONTRIBUTING.md and check existing issues", type: "multiple-choice" },
    { id: "pq2", question: "What does 'good first issue' label mean?", options: ["Vấn đề quan trọng nhất", "Issue dành cho người mới bắt đầu đóng góp", "Issue đã được fix", "Issue cần senior dev"], answer: "Issue dành cho người mới bắt đầu đóng góp", type: "multiple-choice" },
    { id: "pq3", question: "What is a 'regression' bug?", options: ["Bug tồn tại từ đầu", "Bug mới xuất hiện do thay đổi code gần đây", "Bug chỉ xảy ra trên Windows", "Bug trong documentation"], answer: "Bug mới xuất hiện do thay đổi code gần đây", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Tôi đã fork repository và thực hiện các thay đổi cần thiết.", answer: "I forked the repository and made the necessary changes." },
    { id: "pt2", prompt_vn: "Bạn có muốn chấp nhận PR để thêm TypeScript types không?", answer: "Would you be open to accepting a PR to add TypeScript types?" },
    { id: "pt3", prompt_vn: "Đây là regression — nó hoạt động trong v3.1 nhưng bị lỗi trong v3.2.", answer: "This is a regression — it worked in v3.1 but broke in v3.2." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Open Source PR Discussion",
      audio: "/audio/unit41/dialogue_1.mp3",
      desc: "Khánh nhận feedback từ maintainer cho PR đầu tiên.",
      lines: [
        { id: "d1-1", speaker: "Maintainer", text: "Thanks for the PR, Khánh! The fix looks correct, but I have a few suggestions before we merge.", translation: "Cảm ơn vì PR, Khánh! Fix trông đúng, nhưng tôi có vài suggestions trước khi chúng ta merge." },
        { id: "d1-2", speaker: "Khanh", text: "Thank you for reviewing! I'm happy to make any changes — what would you like me to update?", translation: "Cảm ơn bạn đã review! Tôi sẵn sàng thực hiện mọi thay đổi — bạn muốn tôi cập nhật gì?" },
        { id: "d1-3", speaker: "Maintainer", text: "First, please add a unit test for the edge case where the input is null. Also, the variable name 'x' could be more descriptive.", translation: "Đầu tiên, vui lòng thêm unit test cho edge case khi input là null. Ngoài ra, tên biến 'x' có thể mô tả hơn." },
        { id: "d1-4", speaker: "Khanh", text: "Of course! I'll add the null input test and rename the variable to 'elementIndex'. Should I also update the documentation?", translation: "Dĩ nhiên! Tôi sẽ thêm null input test và đổi tên biến thành 'elementIndex'. Tôi có nên cập nhật documentation không?" },
        { id: "d1-5", speaker: "Maintainer", text: "Yes, please update the JSDoc comment for that function. Once done, this looks good to merge. Really appreciate the contribution!", translation: "Có, vui lòng cập nhật JSDoc comment cho hàm đó. Sau khi xong, cái này trông tốt để merge. Thực sự cảm ơn vì đóng góp!" },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "I noticed this issue was labeled 'good first issue' — I'd like to work on it.", options: ["Người này report bug mới", "Người này muốn fix issue được label dành cho beginners", "Người này là maintainer", "Issue đã được fix"], answer: "Người này muốn fix issue được label dành cho beginners" },
    { id: "lac2", audio_text: "My PR was marked stale after 45 days without activity.", options: ["PR được approve sau 45 ngày", "PR bị đóng vì không hoạt động", "PR bị mark inactive sau thời gian dài không có update", "PR cần thêm 45 changes"], answer: "PR bị mark inactive sau thời gian dài không có update" },
    { id: "lac3", audio_text: "This is a regression — it worked fine before the v3.0 refactor.", options: ["Bug tồn tại từ trước v3.0", "Bug mới xuất hiện sau v3.0 refactor", "v3.0 fix tất cả bugs", "Refactor làm cải thiện code"], answer: "Bug mới xuất hiện sau v3.0 refactor" },
  ],

  speaking: {
    level1Prompt: "Bạn tìm thấy bug trong một React library. Viết issue title và mô tả ngắn gọn.",
    level1Placeholder: "Bug: [component] does not [expected behavior] when [condition]. Steps to reproduce: 1. ...",
    level2Situation: "Maintainer review PR của bạn và yêu cầu thêm tests. Respond lịch sự và confirm các changes.",
    level2Hint: "Thank you for the thorough review! I completely agree — I'll add unit tests for the null and empty string edge cases. I'll also update the JSDoc comments. Give me a day to make these changes and I'll re-request review.",
  },

  quiz: [
    { id: "q1", question: "What is 'upstream' in open source context?", options: ["Your fork", "The original repository you forked from", "The production server", "The main branch"], answer: "The original repository you forked from", type: "multiple-choice" },
    { id: "q2", question: "Why should you read CONTRIBUTING.md before opening a PR?", options: ["Để biết tên maintainers", "Để hiểu coding style, test requirements, và PR format", "Vì bắt buộc phải đọc", "Để tìm 'good first issue'"], answer: "Để hiểu coding style, test requirements, và PR format", type: "multiple-choice" },
    { id: "q3", question: "What does 'wontfix' label mean?", options: ["Sẽ được fix trong phiên bản sau", "Team quyết định không fix issue này", "Issue cần nhiều thời gian hơn", "Cần thêm thông tin"], answer: "Team quyết định không fix issue này", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: Thank you for ___ this project — it's been incredibly useful!", options: ["creating", "maintaining", "building", "running"], answer: "maintaining", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Vui lòng cho tôi biết nếu bạn muốn tôi thực hiện thêm thay đổi.", answer: "Please let me know if you'd like me to make any additional changes.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Open source vocabulary",
    timeLimit: 60,
    items: [
      { en: "maintainer", vn: "người quản lý dự án OS" },
      { en: "contributor", vn: "người đóng góp" },
      { en: "fork", vn: "sao chép repo về account mình" },
      { en: "upstream", vn: "repo gốc bạn fork từ đó" },
      { en: "good first issue", vn: "issue dành cho người mới" },
      { en: "regression", vn: "bug do thay đổi code gần đây" },
      { en: "stale", vn: "không có activity lâu" },
      { en: "wontfix", vn: "team quyết định không fix" },
      { en: "CONTRIBUTING.md", vn: "hướng dẫn đóng góp" },
    ],
  },
};

export default unit41;
