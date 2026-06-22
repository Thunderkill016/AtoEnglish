import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 33 — GitHub Commit Messages & Version Control (B2 / Phase 4)
// Phase 4: Tech English cho developer Việt Nam
// Focus: Conventional Commits, git workflow vocabulary, PR English
const unit33: UnitData = {
  unitId: "unit-33",
  title: "Unit 33: GitHub Commit Messages",
  level: "B2",
  xp: 120,
  estimatedTime: 55,
  description: "Học viết commit message chuẩn Conventional Commits và giao tiếp về code thay đổi trên GitHub.",
  badgeName: "Git Communicator",
  badgeEmoji: "🔀",

  situation:
    "Bạn vừa fix một bug quan trọng trong production. Senior developer yêu cầu bạn push code và viết commit message rõ ràng trước khi tạo Pull Request. Bạn sẽ viết gì?",

  learningOutcomes: [
    "Viết commit message chuẩn Conventional Commits (feat/fix/refactor)",
    "Mô tả code thay đổi rõ ràng bằng tiếng Anh",
    "Tạo PR description chuyên nghiệp cho team review",
  ],

  culturalNote:
    'Trong team quốc tế, commit message được coi là <span class="text-emerald-400 font-semibold">tài liệu sống</span> của dự án. Quy tắc vàng: dùng <span class="text-emerald-400 font-semibold">động từ nguyên thể</span> ở đầu — "Add", "Fix", "Remove" — không phải "Added", "Fixing". Một commit tốt = ai đọc cũng hiểu bạn đã làm gì và tại sao.',

  warmupGreetings: [
    { emoji: "🔀", en: "I just pushed the fix to the feature branch.", vn: "Tôi vừa push bản fix lên branch feature.", context: "Thông báo với team trong Slack" },
    { emoji: "✅", en: "The PR is ready for review.", vn: "PR đã sẵn sàng để review.", context: "Ping reviewer trên GitHub" },
    { emoji: "🐛", en: "I found and fixed the bug in the auth module.", vn: "Tôi đã tìm và sửa bug trong module auth.", context: "Update trong standup" },
  ],

  vocab: [
    { id: 1, word: "commit", emoji: "💾", phonetic: "/kəˈmɪt/", meaning: "commit code (lưu snapshot thay đổi vào git)", example: "Please commit your changes before switching branches.", example2: "I made three commits today: one fix and two features.", collocation: "make a commit / commit message / commit history", audio: "/audio/unit33/commit.mp3" },
    { id: 2, word: "repository (repo)", emoji: "📦", phonetic: "/rɪˈpɒzɪtəri/", meaning: "kho lưu trữ code (repo)", example: "Fork the repository and clone it to your local machine.", example2: "The repo has over 500 commits from the team.", collocation: "clone a repo / fork a repo / private repository", audio: "/audio/unit33/repository.mp3" },
    { id: 3, word: "branch", emoji: "🌿", phonetic: "/brɑːntʃ/", meaning: "nhánh code", example: "Create a new branch for each feature you work on.", example2: "Never commit directly to the main branch.", collocation: "feature branch / create a branch / switch branches", audio: "/audio/unit33/branch.mp3" },
    { id: 4, word: "merge", emoji: "🔀", phonetic: "/mɜːrdʒ/", meaning: "gộp code từ branch này vào branch khác", example: "Merge the feature branch into main after approval.", example2: "There was a conflict when merging the two branches.", collocation: "merge request / merge conflict / merge into main", audio: "/audio/unit33/merge.mp3" },
    { id: 5, word: "pull request (PR)", emoji: "📬", phonetic: "/pʊl rɪˈkwest/", meaning: "yêu cầu gộp code — gửi để team review", example: "Open a pull request when your feature is ready for review.", example2: "I left three comments on your PR.", collocation: "open a PR / review a PR / merge a PR", audio: "/audio/unit33/pull.mp3" },
    { id: 6, word: "bug", emoji: "🐛", phonetic: "/bʌɡ/", meaning: "lỗi phần mềm", example: "fix: resolve null pointer bug in user authentication.", example2: "The bug only appears on mobile browsers.", collocation: "report a bug / fix a bug / reproduce a bug", audio: "/audio/unit33/bug.mp3" },
    { id: 7, word: "feat (feature)", emoji: "✨", phonetic: "/fiːtʃər/", meaning: "tính năng mới", example: "feat(auth): add Google OAuth login", example2: "This feature was requested by 50+ users.", collocation: "add a feature / feature branch / ship a feature", audio: "/audio/unit33/feat.mp3" },
    { id: 8, word: "refactor", emoji: "🔧", phonetic: "/ˌriːˈfæktər/", meaning: "tái cấu trúc code (không thay đổi chức năng)", example: "refactor: extract validateEmail() into utils module", example2: "Refactoring improves code readability without changing behavior.", collocation: "refactor code / code refactoring / refactor into", audio: "/audio/unit33/refactor.mp3" },
    { id: 9, word: "revert", emoji: "↩️", phonetic: "/rɪˈvɜːrt/", meaning: "khôi phục lại commit trước", example: "revert: undo accidental deletion of config file", example2: "We had to revert the last deploy because of a critical bug.", collocation: "revert a commit / revert changes / revert to previous", audio: "/audio/unit33/revert.mp3" },
    { id: 10, word: "deploy", emoji: "🚀", phonetic: "/dɪˈplɔɪ/", meaning: "triển khai code lên server/production", example: "Deploy to staging first, then production.", example2: "The CI/CD pipeline deploys automatically after merge.", collocation: "deploy to production / deployment pipeline / auto-deploy", audio: "/audio/unit33/deploy.mp3" },
    { id: 11, word: "conflict", emoji: "⚡", phonetic: "/ˈkɒnflɪkt/", meaning: "xung đột code khi merge", example: "Resolve all conflicts before requesting a review.", example2: "There was a merge conflict in the package.json file.", collocation: "merge conflict / resolve a conflict / conflict resolution", audio: "/audio/unit33/conflict.mp3" },
    { id: 12, word: "scope", emoji: "🎯", phonetic: "/skəʊp/", meaning: "phạm vi thay đổi (trong commit message)", example: "feat(auth): add refresh token support", example2: "The scope tells reviewers which module is affected.", collocation: "commit scope / module scope / in scope", audio: "/audio/unit33/scope.mp3" },
  ],

  grammar: {
    title: "Conventional Commits — Imperative Mood",
    rule: "type(scope): short description\n• feat: new feature\n• fix: bug fix\n• refactor: code restructure\n• docs: documentation\n• style: formatting\n• test: add/update tests\n• chore: maintenance",
    examples: [
      { en: "feat(auth): add Google OAuth login", vn: "Thêm tính năng đăng nhập bằng Google" },
      { en: "fix(api): resolve 401 error on token refresh", vn: "Sửa lỗi 401 khi refresh token" },
      { en: "refactor(utils): extract date helpers into separate file", vn: "Tách date helpers thành file riêng" },
      { en: "docs: update README with local setup guide", vn: "Cập nhật README hướng dẫn cài đặt local" },
    ],
    tip: "Dùng động từ nguyên thể: 'Add', 'Fix', 'Update' — không phải 'Added', 'Fixed', 'Updating'. Đọc to: 'This commit will...'",
    vnNote: "Người Việt hay viết commit theo kiểu mô tả quá khứ ('Fixed bug', 'Added feature'). Trong tiếng Anh chuẩn, commit message dùng thì hiện tại đơn như lệnh: 'Fix bug', 'Add feature'.",
    ccq: {
      question: "Commit message nào đúng chuẩn Conventional Commits?",
      options: ["Fixed the login bug", "fix(auth): resolve login redirect loop", "I fixed the auth bug today", "auth bug fix"],
      answer: "fix(auth): resolve login redirect loop",
      explanation: "Format chuẩn: type(scope): description — dùng động từ nguyên thể, không viết hoa chữ đầu description.",
    },
  },

  matchingExercise: {
    title: "Nối commit type với ý nghĩa",
    pairs: [
      { left: "feat", right: "Thêm tính năng mới" },
      { left: "fix", right: "Sửa lỗi (bug fix)" },
      { left: "refactor", right: "Tái cấu trúc code" },
      { left: "docs", right: "Cập nhật tài liệu" },
      { left: "chore", right: "Bảo trì, cập nhật dependencies" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "tính năng(auth): thêm xác thực hai yếu tố", words: ["feat(auth):", "add", "two-factor", "authentication"], answer: "feat(auth): add two-factor authentication" },
    { id: "s2", prompt_vn: "sửa(api): xử lý lỗi timeout khi gọi API", words: ["fix(api):", "handle", "timeout", "error", "on", "API", "calls"], answer: "fix(api): handle timeout error on API calls" },
    { id: "s3", prompt_vn: "tài liệu: thêm ví dụ vào README", words: ["docs:", "add", "examples", "to", "README"], answer: "docs: add examples to README" },
  ],

  practiceQuiz: [
    { id: "pq1", question: "Which commit message follows Conventional Commits format?", options: ["I added a dark mode feature", "feat(ui): add dark mode toggle", "Added dark mode", "Dark mode feature added"], answer: "feat(ui): add dark mode toggle", type: "multiple-choice" },
    { id: "pq2", question: "What type should you use when restructuring code without changing functionality?", options: ["fix", "feat", "refactor", "docs"], answer: "refactor", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ còn thiếu: ___(auth): add password reset flow", options: ["feature", "feat", "add", "new"], answer: "feat", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Sửa lỗi 404 trên trang hồ sơ người dùng.", answer: "fix(profile): resolve 404 error on user profile page" },
    { id: "pt2", prompt_vn: "Thêm unit tests cho module thanh toán.", answer: "test(payment): add unit tests for payment module" },
    { id: "pt3", prompt_vn: "Cập nhật dependencies lên phiên bản mới nhất.", answer: "chore: update dependencies to latest versions" },
  ],

  dialogues: [
    {
      id: 1,
      title: "Code review trên GitHub",
      audio: "/audio/unit33/dialogue_1.mp3",
      desc: "Minh và Sarah thảo luận về commit message trong PR review.",
      lines: [
        { id: "d1-1", speaker: "Sarah", text: "Hey Minh, I left some comments on your PR. The commit messages need to follow our Conventional Commits standard.", translation: "Này Minh, tôi đã để lại một số comment trên PR của bạn. Commit message cần theo chuẩn Conventional Commits của chúng ta." },
        { id: "d1-2", speaker: "Minh", text: "Thanks for the feedback! I see you flagged the commit that says 'Fixed login bug.' Should I change it to 'fix(auth): resolve login redirect loop'?", translation: "Cảm ơn feedback! Tôi thấy bạn đánh dấu commit 'Fixed login bug.' Tôi có nên đổi thành 'fix(auth): resolve login redirect loop' không?" },
        { id: "d1-3", speaker: "Sarah", text: "Exactly! And please use the imperative mood — 'Fix', not 'Fixed'. It reads like an instruction: 'This commit will fix...'", translation: "Chính xác! Và hãy dùng dạng mệnh lệnh — 'Fix', không phải 'Fixed'. Đọc như một lệnh: 'Commit này sẽ fix...'" },
        { id: "d1-4", speaker: "Minh", text: "Got it. I'll amend those commits and force-push to clean up the history. Should I also update the PR description?", translation: "Hiểu rồi. Tôi sẽ sửa những commit đó và force-push để làm sạch lịch sử. Tôi có nên cập nhật PR description không?" },
        { id: "d1-5", speaker: "Sarah", text: "Yes, please! Add a summary of changes and a link to the Jira ticket. Then I'll approve and we can merge.", translation: "Có, hãy làm vậy! Thêm tóm tắt các thay đổi và link đến Jira ticket. Sau đó tôi sẽ approve và chúng ta có thể merge." },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "Please amend your last commit to follow the Conventional Commits format.", options: ["Xóa commit cuối cùng", "Sửa commit cuối để đúng format", "Tạo commit mới", "Revert commit cuối"], answer: "Sửa commit cuối để đúng format" },
    { id: "lac2", audio_text: "There's a merge conflict in the package.json file. Can you resolve it?", options: ["File package.json bị lỗi cú pháp", "Có xung đột khi merge ở file package.json", "Package.json cần được cập nhật", "File package.json bị thiếu"], answer: "Có xung đột khi merge ở file package.json" },
    { id: "lac3", audio_text: "The PR is ready for review — LGTM from my side if tests pass.", options: ["PR cần thêm tests", "Reviewer sẽ test code", "PR được approve nếu tests pass", "PR bị reject"], answer: "PR được approve nếu tests pass" },
  ],

  speaking: {
    level1Prompt: "Bạn vừa thêm tính năng dark mode. Hãy nói commit message cho tính năng này.",
    level1Placeholder: "feat(ui): add dark mode...",
    level2Situation: "Team lead hỏi bạn: 'What did you work on yesterday and what's your plan for today?' (Standup question).",
    level2Hint: "Yesterday I worked on the dark mode feature. I opened a PR and it's waiting for review. Today I'll fix the review comments and update the documentation.",
  },

  quiz: [
    { id: "q1", question: "What verb form is used in Conventional Commits?", options: ["Past tense (Fixed)", "Present continuous (Fixing)", "Imperative / base form (Fix)", "Past participle (Fixed)"], answer: "Imperative / base form (Fix)", type: "multiple-choice" },
    { id: "q2", question: "Which is a correct commit message format?", options: ["feature: Added new login page", "feat(auth): add OAuth login", "Added OAuth login feature", "New: oauth login"], answer: "feat(auth): add OAuth login", type: "multiple-choice" },
    { id: "q3", question: "Điền từ: We need to ___ the conflict before we can merge.", options: ["solve", "resolve", "fix up", "clear"], answer: "resolve", type: "multiple-choice" },
    { id: "q4", question: "What does 'LGTM' mean in a code review comment?", options: ["Let's Go To Meeting", "Looks Good To Me", "Logged Good Test Merge", "Last Git Tracked Merge"], answer: "Looks Good To Me", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Tôi sẽ revert commit đó vì nó gây ra lỗi production.", answer: "I will revert that commit because it caused a production bug.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Git vocabulary sprint",
    timeLimit: 60,
    items: [
      { en: "commit", vn: "lưu snapshot code vào git" },
      { en: "branch", vn: "nhánh code" },
      { en: "merge", vn: "gộp code" },
      { en: "pull request", vn: "yêu cầu gộp code để review" },
      { en: "bug", vn: "lỗi phần mềm" },
      { en: "refactor", vn: "tái cấu trúc code" },
      { en: "deploy", vn: "triển khai lên server" },
      { en: "revert", vn: "khôi phục lại commit trước" },
      { en: "conflict", vn: "xung đột code khi merge" },
      { en: "scope", vn: "phạm vi thay đổi trong commit" },
    ],
  },
};

export default unit33;
