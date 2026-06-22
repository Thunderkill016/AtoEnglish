import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 35 — Code Review English (B2 / Phase 4)
const unit35: UnitData = {
  unitId: "unit-35",
  title: "Unit 35: Code Review English",
  level: "B2",
  xp: 120,
  estimatedTime: 55,
  description: "Học ngôn ngữ code review chuyên nghiệp: cách comment PR xây dựng và rõ ràng.",
  badgeName: "Code Reviewer",
  badgeEmoji: "👁️",

  situation:
    "Bạn được assign review Pull Request của đồng nghiệp mới. Code hoạt động nhưng có vài chỗ có thể cải thiện. Làm sao comment mà không gây mất hứng hoặc xúc phạm?",

  learningOutcomes: [
    "Comment code review xây dựng: phân biệt blocking vs non-blocking",
    "Dùng ngôn ngữ mềm mỏng nhưng rõ ràng (nit:, suggestion:, question:)",
    "Phản hồi review một cách chuyên nghiệp và thúc đẩy discussion",
  ],

  culturalNote:
    'Code review không phải là "chỉ lỗi" mà là <span class="text-emerald-400 font-semibold">collaborative improvement</span>. Trong văn hóa tech phương Tây, người reviewer giỏi sẽ bắt đầu bằng điểm tốt, sau đó suggest thay vì demand. <span class="text-emerald-400 font-semibold">Prefix chuẩn:</span> "nit:" (minor style issue), "suggestion:" (could be better), "question:" (need clarification), "blocking:" (must fix before merge).',

  warmupGreetings: [
    { emoji: "👁️", en: "I'll review your PR by end of day.", vn: "Tôi sẽ review PR của bạn trước cuối ngày.", context: "Xác nhận khi được assign review" },
    { emoji: "✅", en: "LGTM! Great work on the refactoring.", vn: "LGTM! Làm tốt lắm với phần refactoring.", context: "Approve PR" },
    { emoji: "💬", en: "Left a few comments — nothing blocking, just suggestions.", vn: "Để lại vài comment — không có gì blocking, chỉ là suggestions.", context: "Thông báo sau khi review xong" },
  ],

  vocab: [
    { id: 1, word: "LGTM", emoji: "✅", phonetic: "/el dʒiː tiː em/", meaning: "Looks Good To Me — approve PR", example: "LGTM! I've approved the PR. Feel free to merge.", example2: "Code quality looks good, LGTM from my side.", collocation: "LGTM from my side / LGTM — ship it", audio: "/audio/unit35/lgtm.mp3" },
    { id: 2, word: "nit", emoji: "🔍", phonetic: "/nɪt/", meaning: "nitpick — comment nhỏ về style, không blocking", example: "nit: This variable name could be more descriptive.", example2: "Just a nit, but prefer single quotes for consistency.", collocation: "nit: / minor nit / style nit", audio: "/audio/unit35/nit.mp3" },
    { id: 3, word: "blocking", emoji: "🚫", phonetic: "/ˈblɒkɪŋ/", meaning: "phải sửa trước khi merge", example: "Blocking: This will cause a memory leak in production.", example2: "I have one blocking comment — everything else looks fine.", collocation: "blocking comment / blocking issue / non-blocking", audio: "/audio/unit35/blocking.mp3" },
    { id: 4, word: "suggestion", emoji: "💡", phonetic: "/səˈdʒestʃən/", meaning: "đề xuất cải thiện, không bắt buộc", example: "Suggestion: Consider using a Map instead of an Object here for better performance.", example2: "This is just a suggestion, up to you.", collocation: "minor suggestion / implementation suggestion / optional suggestion", audio: "/audio/unit35/suggestion.mp3" },
    { id: 5, word: "approve", emoji: "✔️", phonetic: "/əˈpruːv/", meaning: "chấp thuận PR — cho phép merge", example: "I've approved the PR — great implementation!", example2: "Two approvals are required before merging.", collocation: "approve a PR / request approval / pending approval", audio: "/audio/unit35/approve.mp3" },
    { id: 6, word: "request changes", emoji: "🔄", phonetic: "/rɪˈkwest ˈtʃeɪndʒɪz/", meaning: "yêu cầu sửa đổi trước khi approve", example: "I've requested changes on the PR — please address the error handling.", example2: "Don't be discouraged — requested changes = team cares about quality.", collocation: "request changes / change request / re-review after changes", audio: "/audio/unit35/request.mp3" },
    { id: 7, word: "inline comment", emoji: "📝", phonetic: "/ˈɪnlaɪn ˈkɒment/", meaning: "comment ngay trên dòng code cụ thể", example: "I left an inline comment on line 42 — check the edge case.", example2: "GitHub shows inline comments next to the relevant code.", collocation: "inline comment / leave a comment / comment on line", audio: "/audio/unit35/inline.mp3" },
    { id: 8, word: "edge case", emoji: "⚡", phonetic: "/edʒ keɪs/", meaning: "trường hợp ngoại lệ, không phổ biến nhưng có thể xảy ra", example: "Have you handled the edge case where the array is empty?", example2: "Edge cases are easy to miss but cause production bugs.", collocation: "handle edge cases / edge case bug / cover edge cases", audio: "/audio/unit35/edge.mp3" },
    { id: 9, word: "out of scope", emoji: "📐", phonetic: "/aʊt əv skəʊp/", meaning: "ngoài phạm vi của PR này", example: "This refactoring is out of scope for this PR — let's create a separate ticket.", example2: "Keep PRs focused — don't add out-of-scope changes.", collocation: "out of scope / in scope / scope creep", audio: "/audio/unit35/out.mp3" },
    { id: 10, word: "nitpick", emoji: "🔎", phonetic: "/ˈnɪtpɪk/", meaning: "chỉ ra lỗi nhỏ không quan trọng", example: "I'm nitpicking here, but the comment says 'retrun' instead of 'return'.", example2: "Feel free to ignore my nitpicks — they're optional.", collocation: "nitpick / minor nitpick / to nitpick", audio: "/audio/unit35/nitpick.mp3" },
  ],

  grammar: {
    title: "Softening Language trong Code Review",
    rule: "Dùng modal verbs + hedging để giảm áp lực:\n• could (thay vì should/must)\n• might want to consider\n• would it be possible to...\n• I'm wondering if...\n• Have you thought about...?",
    examples: [
      { en: "nit: This could be extracted into a helper function.", vn: "nit: Cái này có thể tách thành helper function." },
      { en: "I'm wondering if we should add error handling here.", vn: "Tôi đang tự hỏi liệu chúng ta có nên thêm error handling ở đây không." },
      { en: "Have you thought about caching this API call?", vn: "Bạn đã nghĩ đến việc cache API call này chưa?" },
      { en: "This approach works, though I'd suggest extracting the logic.", vn: "Cách tiếp cận này hoạt động, dù tôi muốn suggest tách logic ra." },
    ],
    tip: "Quy tắc vàng: Đặt câu hỏi thay vì ra lệnh. 'Could this be refactored?' dễ nghe hơn 'Refactor this.'",
    vnNote: "Người Việt hay comment thẳng thắn như 'Sai rồi, phải sửa lại'. Trong team quốc tế, direct criticism có thể tạo tension. Dùng softeners mà không làm mất đi ý nghĩa.",
    ccq: {
      question: "Comment nào là cách tốt nhất trong code review?",
      options: [
        "This is wrong. Fix it.",
        "nit: Could we rename this variable to be more descriptive?",
        "bad naming, change this",
        "Why did you do this?",
      ],
      answer: "nit: Could we rename this variable to be more descriptive?",
      explanation: "Prefix 'nit:' báo hiệu không blocking. 'Could we' thay vì 'you must' = collaborative tone.",
    },
  },

  matchingExercise: {
    title: "Nối prefix với ý nghĩa",
    pairs: [
      { left: "LGTM", right: "Looks Good To Me — approve" },
      { left: "nit:", right: "Comment nhỏ về style" },
      { left: "blocking:", right: "Phải sửa trước khi merge" },
      { left: "suggestion:", right: "Đề xuất, không bắt buộc" },
      { left: "question:", right: "Cần clarification" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Bạn đã nghĩ đến việc xử lý trường hợp array rỗng chưa?", words: ["Have", "you", "thought", "about", "handling", "the", "empty", "array", "case?"], answer: "Have you thought about handling the empty array case?" },
    { id: "s2", prompt_vn: "nit: Cái này có thể extract thành helper function.", words: ["nit:", "This", "could", "be", "extracted", "into", "a", "helper", "function."], answer: "nit: This could be extracted into a helper function." },
    { id: "s3", prompt_vn: "Blocking: Điều này sẽ gây memory leak trong production.", words: ["Blocking:", "This", "will", "cause", "a", "memory", "leak", "in", "production."], answer: "Blocking: This will cause a memory leak in production." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What does 'nit:' prefix in a review comment mean?", options: ["Critical bug — must fix", "Minor style issue — optional", "The code is wrong", "Approve the PR"], answer: "Minor style issue — optional", type: "multiple-choice" },
    { id: "pq2", question: "Which comment is most professional?", options: ["This is bad code.", "I don't like this approach.", "Suggestion: Consider using const here for better immutability.", "Change this."], answer: "Suggestion: Consider using const here for better immutability.", type: "multiple-choice" },
    { id: "pq3", question: "What does 'out of scope' mean in a PR review?", options: ["Code không hoạt động", "Thay đổi không liên quan đến PR này", "Cần test thêm", "File bị thiếu"], answer: "Thay đổi không liên quan đến PR này", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "nit: Tên biến này có thể rõ ràng hơn không?", answer: "nit: Could this variable name be more descriptive?" },
    { id: "pt2", prompt_vn: "Tôi đã approve PR — làm tốt lắm!", answer: "I've approved the PR — great work!" },
    { id: "pt3", prompt_vn: "Vui lòng giải quyết blocking comment trước khi merge.", answer: "Please address the blocking comment before merging." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Code review discussion",
      audio: "/audio/unit35/dialogue_1.mp3",
      desc: "Linh respond lại review comments của Tom.",
      lines: [
        { id: "d1-1", speaker: "Tom", text: "Hey Linh, I reviewed your PR. I left a few comments — one blocking and two nits.", translation: "Này Linh, tôi đã review PR của bạn. Tôi để lại vài comment — một blocking và hai nits." },
        { id: "d1-2", speaker: "Linh", text: "Thanks for the review! I see the blocking comment about error handling. I'll add a try-catch block there.", translation: "Cảm ơn bạn đã review! Tôi thấy blocking comment về error handling. Tôi sẽ thêm try-catch block ở đó." },
        { id: "d1-3", speaker: "Tom", text: "Perfect. For the nits — those are optional, just style preferences. You can choose to ignore them.", translation: "Hoàn hảo. Với các nits — đó là optional, chỉ là style preferences. Bạn có thể chọn bỏ qua." },
        { id: "d1-4", speaker: "Linh", text: "I actually agree with both nits — I'll address them too. Should I request a re-review after making changes?", translation: "Thực ra tôi đồng ý với cả hai nits — tôi sẽ xử lý chúng luôn. Tôi có nên request re-review sau khi sửa không?" },
        { id: "d1-5", speaker: "Tom", text: "Yes, please re-request review when you're done. The changes look minor so it should be a quick turnaround.", translation: "Có, vui lòng re-request review khi xong. Các thay đổi có vẻ nhỏ nên sẽ review nhanh thôi." },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "This is a blocking comment — please fix the null check before merging.", options: ["Comment không quan trọng", "Phải sửa trước khi merge", "Chỉ là suggestion", "Code hoạt động tốt"], answer: "Phải sửa trước khi merge" },
    { id: "lac2", audio_text: "nit: Consider using destructuring here for cleaner code.", options: ["Lỗi nghiêm trọng", "Comment bắt buộc phải sửa", "Suggestion nhỏ về style", "Code bị sai logic"], answer: "Suggestion nhỏ về style" },
    { id: "lac3", audio_text: "LGTM! Great job on the refactoring — approved!", options: ["PR bị reject", "PR cần thêm review", "PR được approve", "PR cần sửa thêm"], answer: "PR được approve" },
  ],

  speaking: {
    level1Prompt: "Bạn review code và thấy một biến đặt tên không rõ ràng. Hãy viết comment review.",
    level1Placeholder: "nit: Could we rename this variable to...",
    level2Situation: "Bạn phát hiện một bug nghiêm trọng trong PR. Comment blocking và giải thích tại sao phải sửa.",
    level2Hint: "Blocking: This will cause a race condition when two users submit the form simultaneously. We need to add a mutex or use optimistic locking here before this can be merged.",
  },

  quiz: [
    { id: "q1", question: "What does 'request changes' mean in GitHub PR review?", options: ["Approve PR", "Reject PR forever", "Yêu cầu sửa đổi trước khi approve", "Xóa PR"], answer: "Yêu cầu sửa đổi trước khi approve", type: "multiple-choice" },
    { id: "q2", question: "Which prefix indicates a non-critical style suggestion?", options: ["blocking:", "critical:", "nit:", "error:"], answer: "nit:", type: "multiple-choice" },
    { id: "q3", question: "How should you phrase a blocking comment professionally?", options: ["This is wrong!", "Blocking: This will cause a data race — please add synchronization.", "Fix this now.", "Bad code."], answer: "Blocking: This will cause a data race — please add synchronization.", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: Have you ___ about handling the edge case where the list is empty?", options: ["thought", "think", "considered it", "think about"], answer: "thought", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Đây chỉ là suggestion — bạn không cần phải thay đổi.", answer: "This is just a suggestion — you don't have to change it.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Code review vocabulary",
    timeLimit: 60,
    items: [
      { en: "LGTM", vn: "Looks Good To Me — approve" },
      { en: "nit", vn: "minor style comment" },
      { en: "blocking", vn: "phải sửa trước khi merge" },
      { en: "suggestion", vn: "đề xuất không bắt buộc" },
      { en: "approve", vn: "chấp thuận PR" },
      { en: "request changes", vn: "yêu cầu sửa đổi" },
      { en: "edge case", vn: "trường hợp ngoại lệ" },
      { en: "out of scope", vn: "ngoài phạm vi PR" },
      { en: "inline comment", vn: "comment trên dòng code" },
    ],
  },
};

export default unit35;
