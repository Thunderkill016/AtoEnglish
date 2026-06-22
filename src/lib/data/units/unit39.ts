import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 39 — Technical Interview English (B2 / Phase 4)
const unit39: UnitData = {
  unitId: "unit-39",
  title: "Unit 39: Technical Interview English",
  level: "B2",
  xp: 130,
  estimatedTime: 65,
  description: "Luyện trả lời câu hỏi phỏng vấn kỹ thuật bằng tiếng Anh: coding, system design, behavioral.",
  badgeName: "Interview Ready",
  badgeEmoji: "🎯",

  situation:
    "Bạn được Google, Meta, hoặc một startup Singapore mời phỏng vấn. Vòng 1: coding interview với LeetCode-style questions. Vòng 2: System design. Vòng 3: Behavioral với format STAR. Bạn phải nói tiếng Anh trong suốt quá trình.",

  learningOutcomes: [
    "Giải thích giải thuật và code logic bằng tiếng Anh rõ ràng",
    "Dùng STAR method trả lời behavioral questions",
    "Hỏi ngược lại interviewer chuyên nghiệp (ask clarifying questions)",
  ],

  culturalNote:
    'Phỏng vấn kỹ thuật phương Tây khác Việt Nam: họ muốn thấy <span class="text-emerald-400 font-semibold">thinking process</span>, không chỉ đáp án. "Think aloud" = nói to suy nghĩ trong khi giải: "I\'m thinking about a hash map approach because..." Silence trong 5 phút = red flag. <span class="text-emerald-400 font-semibold">Hỏi lại</span> trước khi code = professional, không phải yếu.',

  warmupGreetings: [
    { emoji: "🎯", en: "Could you clarify the input constraints for this problem?", vn: "Bạn có thể làm rõ ràng constraints đầu vào của bài toán này không?", context: "Hỏi clarifying question trước khi code" },
    { emoji: "🧠", en: "I'm thinking of a brute force approach first, then optimizing.", vn: "Tôi đang nghĩ đến cách brute force trước, sau đó optimize.", context: "Think aloud trong coding interview" },
    { emoji: "📊", en: "The time complexity would be O(n log n) due to the sorting step.", vn: "Độ phức tạp thời gian sẽ là O(n log n) do bước sort.", context: "Phân tích complexity" },
  ],

  vocab: [
    { id: 1, word: "time complexity", emoji: "⏱️", phonetic: "/taɪm kəmˈpleksɪti/", meaning: "độ phức tạp thời gian — Big O notation", example: "The time complexity of this solution is O(n²) — can we optimize it?", example2: "Binary search has O(log n) time complexity.", collocation: "time complexity / O(n) / optimize time complexity", audio: "/audio/unit39/time.mp3" },
    { id: 2, word: "brute force", emoji: "💪", phonetic: "/bruːt fɔːs/", meaning: "giải pháp đơn giản nhất, không optimize", example: "The brute force approach is O(n²) — let me think of something better.", example2: "Always start with brute force, then optimize.", collocation: "brute force approach / brute force solution / start with brute force", audio: "/audio/unit39/brute.mp3" },
    { id: 3, word: "edge case", emoji: "⚡", phonetic: "/edʒ keɪs/", meaning: "trường hợp ngoại lệ cần xử lý đặc biệt", example: "What if the input array is empty? Let me handle that edge case.", example2: "Good candidates always ask about edge cases.", collocation: "handle edge cases / consider edge cases / edge case testing", audio: "/audio/unit39/edge.mp3" },
    { id: 4, word: "trade-off", emoji: "⚖️", phonetic: "/treɪd ɒf/", meaning: "đánh đổi — cải thiện cái này = hy sinh cái khác", example: "There's a trade-off between time and space complexity here.", example2: "Using a hash map is a time-space trade-off.", collocation: "time-space trade-off / consider the trade-offs / trade-off between", audio: "/audio/unit39/trade_off.mp3" },
    { id: 5, word: "STAR method", emoji: "⭐", phonetic: "/stɑːr ˈmeθəd/", meaning: "Situation, Task, Action, Result — format trả lời behavioral", example: "Use the STAR method: describe the Situation, your Task, Action taken, and the Result.", example2: "STAR format helps structure your answer clearly.", collocation: "STAR method / behavioral question / situation-action-result", audio: "/audio/unit39/star.mp3" },
    { id: 6, word: "scalability", emoji: "📈", phonetic: "/ˌskeɪləˈbɪlɪti/", meaning: "khả năng scale hệ thống khi traffic tăng", example: "How would you ensure the system is scalable to 1 million users?", example2: "Horizontal scaling improves scalability by adding more servers.", collocation: "horizontal scalability / scalable architecture / scale to X users", audio: "/audio/unit39/scalability.mp3" },
    { id: 7, word: "bottleneck", emoji: "🍾", phonetic: "/ˈbɒtlnek/", meaning: "điểm nghẽn cổ chai — phần chậm nhất trong hệ thống", example: "The database is the bottleneck — we need to add a caching layer.", example2: "Identify the bottleneck before optimizing.", collocation: "performance bottleneck / identify the bottleneck / remove bottleneck", audio: "/audio/unit39/bottleneck.mp3" },
    { id: 8, word: "walk through", emoji: "🚶", phonetic: "/wɔːk θruː/", meaning: "giải thích từng bước một", example: "Let me walk you through my solution step by step.", example2: "Please walk me through your system design.", collocation: "walk through the solution / walk through your thinking / code walkthrough", audio: "/audio/unit39/walk.mp3" },
    { id: 9, word: "clarifying question", emoji: "❓", phonetic: "/ˈklærɪfaɪɪŋ ˈkwestʃən/", meaning: "câu hỏi để hiểu rõ yêu cầu trước khi bắt đầu", example: "Before I start coding, I have a few clarifying questions.", example2: "Good engineers ask clarifying questions before designing.", collocation: "ask clarifying questions / clarify the requirements / clarifying question", audio: "/audio/unit39/clarifying.mp3" },
    { id: 10, word: "throughput", emoji: "🔄", phonetic: "/ˈθruːpʊt/", meaning: "số lượng requests hệ thống xử lý được per second", example: "The system handles 10,000 requests per second — that's the throughput.", example2: "We need higher throughput to support peak traffic.", collocation: "system throughput / high throughput / requests per second", audio: "/audio/unit39/throughput.mp3" },
  ],

  grammar: {
    title: "Think-Aloud Language cho Coding Interview",
    rule: "Những cụm từ quan trọng khi nói to suy nghĩ:\n• 'I'm thinking about...'\n• 'Let me start with... and then...'\n• 'The time complexity would be O(n) because...'\n• 'Before I code, I want to make sure I understand...'\n• 'One edge case I need to handle is...'\n• 'Could I use a [data structure] here?'",
    examples: [
      { en: "I'm thinking of using a hash map to reduce the lookup time to O(1).", vn: "Tôi đang nghĩ dùng hash map để giảm thời gian lookup xuống O(1)." },
      { en: "Let me start with the brute force approach first, then we can optimize.", vn: "Hãy để tôi bắt đầu với brute force trước, rồi chúng ta có thể optimize." },
      { en: "One edge case I need to handle is when the array is empty.", vn: "Một edge case tôi cần xử lý là khi mảng rỗng." },
      { en: "The time complexity would be O(n log n) because of the sorting step.", vn: "Độ phức tạp thời gian sẽ là O(n log n) do bước sort." },
    ],
    tip: "Quy tắc vàng: Đừng im lặng. Nếu bạn không biết, nói 'I'm not sure about X, but I would approach it by...' = shows problem-solving mindset.",
    vnNote: "Trong văn hóa Việt, im lặng = suy nghĩ. Trong phỏng vấn phương Tây, im lặng = không biết hoặc stuck. Luôn nói gì đó — dù chỉ là 'Let me think for a second...'",
    ccq: {
      question: "Câu nào tốt nhất khi bạn không chắc về giải pháp?",
      options: [
        "(im lặng 3 phút)",
        "I don't know.",
        "I'm not sure about the optimal approach, but I'd start with a hash map and see if we can optimize from there.",
        "This is very hard.",
      ],
      answer: "I'm not sure about the optimal approach, but I'd start with a hash map and see if we can optimize from there.",
      explanation: "Thừa nhận không chắc + đề xuất hướng giải quyết = professional. Silence hoàn toàn = red flag.",
    },
  },

  matchingExercise: {
    title: "Nối thuật ngữ interview với định nghĩa",
    pairs: [
      { left: "brute force", right: "Giải pháp đơn giản nhất chưa optimize" },
      { left: "trade-off", right: "Đánh đổi giữa time và space" },
      { left: "STAR method", right: "Situation, Task, Action, Result" },
      { left: "bottleneck", right: "Điểm chậm nhất trong hệ thống" },
      { left: "walk through", right: "Giải thích từng bước" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Trước khi tôi code, hãy để tôi đảm bảo tôi hiểu requirements.", words: ["Before", "I", "code,", "let", "me", "make", "sure", "I", "understand", "the", "requirements."], answer: "Before I code, let me make sure I understand the requirements." },
    { id: "s2", prompt_vn: "Độ phức tạp thời gian sẽ là O(n) vì chúng ta chỉ iterate qua array một lần.", words: ["The", "time", "complexity", "would", "be", "O(n)", "since", "we", "only", "iterate", "through", "the", "array", "once."], answer: "The time complexity would be O(n) since we only iterate through the array once." },
    { id: "s3", prompt_vn: "Hãy để tôi walk bạn qua giải pháp của tôi từng bước.", words: ["Let", "me", "walk", "you", "through", "my", "solution", "step", "by", "step."], answer: "Let me walk you through my solution step by step." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What does STAR stand for in behavioral interviews?", options: ["Speed, Task, Action, Result", "Situation, Task, Action, Result", "Skill, Target, Ability, Role", "Subject, Theory, Action, Response"], answer: "Situation, Task, Action, Result", type: "multiple-choice" },
    { id: "pq2", question: "Why should you ask clarifying questions before coding?", options: ["To waste time", "Để show bạn hiểu problem và không assume sai", "Để impress interviewer", "Vì bạn không biết giải"], answer: "Để show bạn hiểu problem và không assume sai", type: "multiple-choice" },
    { id: "pq3", question: "What is 'time complexity' O(n²)?", options: ["Code chạy 2 giây", "Số operations tăng theo bình phương của input size", "Code có 2 loops", "Memory dùng n*2 bytes"], answer: "Số operations tăng theo bình phương của input size", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Tôi đang suy nghĩ về cách dùng binary search để giảm time complexity.", answer: "I'm thinking of using binary search to reduce the time complexity." },
    { id: "pt2", prompt_vn: "Trước khi tôi bắt đầu, tôi có một vài clarifying questions.", answer: "Before I start, I have a few clarifying questions." },
    { id: "pt3", prompt_vn: "Database là bottleneck — chúng ta cần thêm caching layer.", answer: "The database is the bottleneck — we need to add a caching layer." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Coding Interview — LeetCode style",
      audio: "/audio/unit39/dialogue_1.mp3",
      desc: "Hùng phỏng vấn tại một startup Singapore — câu hỏi Two Sum.",
      lines: [
        { id: "d1-1", speaker: "Interviewer", text: "Alright Hùng, let's start with a coding problem. Given an array of integers and a target, return the indices of two numbers that add up to the target.", translation: "Được rồi Hùng, hãy bắt đầu với bài toán lập trình. Cho một mảng số nguyên và một target, trả về chỉ số của hai số có tổng bằng target." },
        { id: "d1-2", speaker: "Hung", text: "Before I code, a few clarifying questions. Can I assume there's always exactly one solution? And can I use the same element twice?", translation: "Trước khi code, tôi có một vài câu hỏi. Tôi có thể giả định luôn có đúng một giải pháp không? Và tôi có thể dùng cùng một phần tử hai lần không?" },
        { id: "d1-3", speaker: "Interviewer", text: "Good questions! Yes, exactly one solution exists, and no — each element can only be used once.", translation: "Câu hỏi hay! Vâng, luôn có đúng một giải pháp, và không — mỗi phần tử chỉ được dùng một lần." },
        { id: "d1-4", speaker: "Hung", text: "Got it. I'm thinking of a hash map approach. I'll store each number's complement as a key. The time complexity would be O(n) and space complexity O(n) as well.", translation: "Hiểu rồi. Tôi đang nghĩ đến cách dùng hash map. Tôi sẽ lưu complement của mỗi số làm key. Time complexity sẽ là O(n) và space complexity cũng O(n)." },
        { id: "d1-5", speaker: "Interviewer", text: "That sounds good. Can you walk me through the code as you write it?", translation: "Nghe có vẻ tốt. Bạn có thể walk tôi qua code khi bạn viết không?" },
        { id: "d1-6", speaker: "Hung", text: "Sure. I'll iterate through the array. For each number, I check if its complement exists in the map. If yes, I return the indices. If not, I add the current number to the map.", translation: "Được. Tôi sẽ iterate qua mảng. Với mỗi số, tôi kiểm tra xem complement của nó có trong map không. Nếu có, tôi trả về indices. Nếu không, tôi thêm số hiện tại vào map." },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "Let me start with a brute force approach and then optimize if time allows.", options: ["Không có giải pháp tốt", "Bắt đầu với giải pháp đơn giản rồi cải thiện", "Từ chối giải bài", "Đã có giải pháp optimal"], answer: "Bắt đầu với giải pháp đơn giản rồi cải thiện" },
    { id: "lac2", audio_text: "The bottleneck in this system is the database — reads are too slow.", options: ["Database hoạt động tốt", "Database là điểm chậm nhất", "Cần thêm database", "Database bị hack"], answer: "Database là điểm chậm nhất" },
    { id: "lac3", audio_text: "Using the STAR method — the situation was a production outage during peak hours.", options: ["STAR là viết tắt của 4 ngôi sao", "Bắt đầu kể câu chuyện bằng context/situation", "Người này bị trễ deadline", "Production đang hoạt động tốt"], answer: "Bắt đầu kể câu chuyện bằng context/situation" },
  ],

  speaking: {
    level1Prompt: "Giải thích algorithm này bằng tiếng Anh: Binary Search — tìm kiếm trong sorted array.",
    level1Placeholder: "Binary search works by... The time complexity is O(log n) because...",
    level2Situation: "Behavioral question: 'Tell me about a time you had a conflict with a teammate and how you resolved it.'",
    level2Hint: "Situation: We disagreed about the database schema design for a new feature. Task: I needed to reach consensus without delaying the sprint. Action: I proposed a meeting where each person presented their approach with pros and cons. Result: We chose a hybrid solution that both teams were happy with, and delivered on time.",
  },

  quiz: [
    { id: "q1", question: "Why do you 'think aloud' in a coding interview?", options: ["To waste time", "Để interviewer follow được thinking process của bạn", "Vì bắt buộc phải nói", "Để impress bằng vocabulary"], answer: "Để interviewer follow được thinking process của bạn", type: "multiple-choice" },
    { id: "q2", question: "What is O(n log n) time complexity?", options: ["Code chạy n*log(n) giây", "Số operations tăng theo n*log(n) — ví dụ: merge sort", "Code có log(n) loops", "Space dùng n log n bytes"], answer: "Số operations tăng theo n*log(n) — ví dụ: merge sort", type: "multiple-choice" },
    { id: "q3", question: "What should you do if you don't know the optimal solution?", options: ["Im lặng và suy nghĩ", "Say 'I don't know' and stop", "Start with brute force và think aloud về optimization", "Ask interviewer for the answer"], answer: "Start with brute force và think aloud về optimization", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: There's a ___ between time and space complexity in this solution.", options: ["balance", "trade-off", "conflict", "difference"], answer: "trade-off", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: Trước khi tôi bắt đầu, tôi muốn xác nhận requirements.", answer: "Before I start, I want to confirm the requirements.", type: "translate" },
  ],

  fluencyDrill: {
    title: "Interview vocabulary sprint",
    timeLimit: 60,
    items: [
      { en: "time complexity", vn: "độ phức tạp thời gian" },
      { en: "brute force", vn: "giải pháp chưa optimize" },
      { en: "edge case", vn: "trường hợp ngoại lệ" },
      { en: "trade-off", vn: "đánh đổi" },
      { en: "STAR method", vn: "Situation, Task, Action, Result" },
      { en: "bottleneck", vn: "điểm nghẽn cổ chai" },
      { en: "walk through", vn: "giải thích từng bước" },
      { en: "clarifying question", vn: "câu hỏi để hiểu rõ yêu cầu" },
      { en: "scalability", vn: "khả năng scale hệ thống" },
    ],
  },
};

export default unit39;
