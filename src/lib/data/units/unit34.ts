import type { UnitData } from "@/components/learn/UnitTemplate";

// UNIT 34 — Reading API Documentation (B2 / Phase 4)
const unit34: UnitData = {
  unitId: "unit-34",
  title: "Unit 34: Reading API Documentation",
  level: "B2",
  xp: 120,
  estimatedTime: 60,
  description: "Học đọc và hiểu API docs bằng tiếng Anh — endpoint, parameter, response, error codes.",
  badgeName: "API Reader",
  badgeEmoji: "📖",

  situation:
    "Bạn cần tích hợp một payment API vào dự án. Bạn mở tài liệu Stripe API bằng tiếng Anh. Làm sao để đọc hiểu nhanh mà không cần dịch từng chữ?",

  learningOutcomes: [
    "Đọc hiểu API documentation bằng tiếng Anh không cần tra từ điển",
    "Hiểu các thuật ngữ: endpoint, parameter, response, authentication",
    "Đặt câu hỏi về API một cách rõ ràng với đồng nghiệp nước ngoài",
  ],

  culturalNote:
    'MDN Web Docs và Stripe Docs là hai tài liệu kỹ thuật được coi là tiêu chuẩn vàng về cách viết documentation. <span class="text-emerald-400 font-semibold">Cấu trúc chuẩn</span>: Overview → Authentication → Endpoints → Parameters → Response → Errors → Examples. Đọc phần Examples trước nếu bạn cần hiểu nhanh.',

  warmupGreetings: [
    { emoji: "📡", en: "How do I authenticate with the API?", vn: "Tôi xác thực với API như thế nào?", context: "Hỏi trong team khi đọc docs" },
    { emoji: "🔑", en: "The endpoint requires a Bearer token in the header.", vn: "Endpoint yêu cầu Bearer token trong header.", context: "Giải thích cách dùng API" },
    { emoji: "📋", en: "Check the response schema in the documentation.", vn: "Kiểm tra response schema trong tài liệu.", context: "Hướng dẫn đồng nghiệp mới" },
  ],

  vocab: [
    { id: 1, word: "endpoint", emoji: "🎯", phonetic: "/ˈendpɔɪnt/", meaning: "URL của một API resource cụ thể", example: "The endpoint for user data is GET /api/v1/users/:id.", example2: "Each endpoint handles a specific type of request.", collocation: "API endpoint / REST endpoint / call an endpoint", audio: "/audio/unit34/endpoint.mp3" },
    { id: 2, word: "parameter", emoji: "🔢", phonetic: "/pəˈræmɪtər/", meaning: "tham số đầu vào (query, path, body)", example: "The 'limit' parameter controls how many results are returned.", example2: "Required parameters must be included in every request.", collocation: "query parameter / required parameter / optional parameter", audio: "/audio/unit34/parameter.mp3" },
    { id: 3, word: "response", emoji: "📨", phonetic: "/rɪˈspɒns/", meaning: "dữ liệu API trả về", example: "A successful response returns a 200 status code with JSON data.", example2: "Parse the response body to extract the user ID.", collocation: "response body / response schema / status response", audio: "/audio/unit34/response.mp3" },
    { id: 4, word: "authentication", emoji: "🔐", phonetic: "/ɔːˌθentɪˈkeɪʃən/", meaning: "xác thực — chứng minh danh tính", example: "All endpoints require authentication via API key.", example2: "OAuth 2.0 is the standard for API authentication.", collocation: "API authentication / Bearer token / authenticate a request", audio: "/audio/unit34/authentication.mp3" },
    { id: 5, word: "payload", emoji: "📦", phonetic: "/ˈpeɪləʊd/", meaning: "dữ liệu gửi trong body của request", example: "Include the user data as a JSON payload in the request body.", example2: "The payload should not exceed 10MB.", collocation: "request payload / JSON payload / send a payload", audio: "/audio/unit34/payload.mp3" },
    { id: 6, word: "status code", emoji: "🔢", phonetic: "/ˈsteɪtəs kəʊd/", meaning: "mã trạng thái HTTP (200, 404, 500...)", example: "A 404 status code means the resource was not found.", example2: "Always check the status code before processing the response.", collocation: "HTTP status code / 200 OK / 401 Unauthorized", audio: "/audio/unit34/status.mp3" },
    { id: 7, word: "deprecate", emoji: "⚠️", phonetic: "/ˈdeprɪkeɪt/", meaning: "đánh dấu tính năng/API sẽ bị xóa trong tương lai", example: "This endpoint is deprecated — use v2/users instead.", example2: "Deprecated APIs still work but will be removed in a future version.", collocation: "deprecated API / deprecated method / deprecation notice", audio: "/audio/unit34/deprecate.mp3" },
    { id: 8, word: "rate limit", emoji: "⏱️", phonetic: "/reɪt ˈlɪmɪt/", meaning: "giới hạn số request trong một khoảng thời gian", example: "The API allows 100 requests per minute — exceeding this returns 429.", example2: "Implement retry logic to handle rate limit errors.", collocation: "API rate limit / rate limiting / exceed the rate limit", audio: "/audio/unit34/rate.mp3" },
    { id: 9, word: "schema", emoji: "📐", phonetic: "/ˈskiːmə/", meaning: "cấu trúc dữ liệu (format của request/response)", example: "Refer to the response schema to understand the JSON structure.", example2: "Validate your input against the request schema.", collocation: "JSON schema / response schema / request schema", audio: "/audio/unit34/schema.mp3" },
    { id: 10, word: "pagination", emoji: "📄", phonetic: "/ˌpædʒɪˈneɪʃən/", meaning: "phân trang — chia dữ liệu thành nhiều trang", example: "Use cursor-based pagination for large datasets.", example2: "The 'next' field in the response contains the cursor for pagination.", collocation: "pagination cursor / paginated response / next page", audio: "/audio/unit34/pagination.mp3" },
    { id: 11, word: "headers", emoji: "📋", phonetic: "/ˈhedərz/", meaning: "phần đầu của HTTP request chứa metadata", example: "Set the 'Content-Type: application/json' header on all POST requests.", example2: "The Authorization header contains your Bearer token.", collocation: "request headers / response headers / HTTP headers", audio: "/audio/unit34/headers.mp3" },
  ],

  grammar: {
    title: "Passive Voice trong Technical Documentation",
    rule: "API docs thường dùng Passive Voice để mô tả quy trình:\n'is returned' / 'must be included' / 'will be deprecated'\nChủ thể thường bị ẩn vì không quan trọng (hệ thống làm tự động).",
    examples: [
      { en: "A token is returned after successful authentication.", vn: "Một token được trả về sau khi xác thực thành công." },
      { en: "All requests must be authenticated using an API key.", vn: "Tất cả request phải được xác thực bằng API key." },
      { en: "The endpoint will be deprecated in version 3.0.", vn: "Endpoint này sẽ bị ngừng hỗ trợ ở phiên bản 3.0." },
      { en: "The response is paginated by default — 20 items per page.", vn: "Response mặc định được phân trang — 20 items mỗi trang." },
    ],
    tip: "Khi đọc docs, thấy 'is returned / is required / is deprecated' = hệ thống tự làm. Khi thấy 'you must / you should' = developer phải làm.",
    vnNote: "Tiếng Anh kỹ thuật dùng Passive nhiều hơn văn nói thông thường. Đây là cách viết chuẩn trong documentation, không phải lỗi ngữ pháp.",
    ccq: {
      question: "Câu nào dùng đúng passive voice trong technical writing?",
      options: [
        "The system returns a 200 status code",
        "A 200 status code is returned on success",
        "You return 200 when success",
        "We return 200 status",
      ],
      answer: "A 200 status code is returned on success",
      explanation: "Technical docs ưu tiên passive voice — chủ thể (hệ thống) ẩn đi, tập trung vào kết quả.",
    },
  },

  matchingExercise: {
    title: "Nối thuật ngữ API với định nghĩa",
    pairs: [
      { left: "endpoint", right: "URL của API resource" },
      { left: "payload", right: "Dữ liệu trong body request" },
      { left: "rate limit", right: "Giới hạn số request/phút" },
      { left: "deprecated", right: "Sẽ bị xóa trong tương lai" },
      { left: "pagination", right: "Chia dữ liệu thành nhiều trang" },
    ],
  },

  scrambleExercises: [
    { id: "s1", prompt_vn: "Tất cả request phải bao gồm một API key hợp lệ.", words: ["All", "requests", "must", "include", "a", "valid", "API", "key."], answer: "All requests must include a valid API key." },
    { id: "s2", prompt_vn: "Endpoint này trả về 404 nếu user không tồn tại.", words: ["This", "endpoint", "returns", "404", "if", "the", "user", "does", "not", "exist."], answer: "This endpoint returns 404 if the user does not exist." },
    { id: "s3", prompt_vn: "Bearer token phải được gửi trong Authorization header.", words: ["The", "Bearer", "token", "must", "be", "sent", "in", "the", "Authorization", "header."], answer: "The Bearer token must be sent in the Authorization header." },
  ],

  practiceQuiz: [
    { id: "pq1", question: "What does a 401 status code mean?", options: ["Resource not found", "Unauthorized — authentication required", "Server error", "Too many requests"], answer: "Unauthorized — authentication required", type: "multiple-choice" },
    { id: "pq2", question: "Which parameter type is added to the URL path? (e.g. /users/:id)", options: ["Query parameter", "Body parameter", "Path parameter", "Header parameter"], answer: "Path parameter", type: "multiple-choice" },
    { id: "pq3", question: "Điền từ: This API endpoint is ___. Use v2/payments instead.", options: ["deleted", "deprecated", "removed", "outdated"], answer: "deprecated", type: "multiple-choice" },
  ],

  practiceTranslate: [
    { id: "pt1", prompt_vn: "Endpoint này yêu cầu authentication.", answer: "This endpoint requires authentication." },
    { id: "pt2", prompt_vn: "Response trả về một mảng các objects JSON.", answer: "The response returns an array of JSON objects." },
    { id: "pt3", prompt_vn: "Vượt quá rate limit sẽ trả về lỗi 429.", answer: "Exceeding the rate limit will return a 429 error." },
  ],

  dialogues: [
    {
      id: 1,
      title: "Hỏi đồng nghiệp về API integration",
      audio: "/audio/unit34/dialogue_1.mp3",
      desc: "Hà hỏi senior dev về cách dùng payment API.",
      lines: [
        { id: "d1-1", speaker: "Ha", text: "I'm trying to integrate the Stripe API but I'm confused about the authentication. Do I use an API key or a Bearer token?", translation: "Tôi đang cố tích hợp Stripe API nhưng bị confused về authentication. Tôi dùng API key hay Bearer token?" },
        { id: "d1-2", speaker: "Tom", text: "For Stripe, you use a secret API key. It goes in the Authorization header as 'Bearer sk_test_...' — check the Authentication section in their docs.", translation: "Với Stripe, bạn dùng secret API key. Nó đặt trong Authorization header là 'Bearer sk_test_...' — kiểm tra phần Authentication trong docs của họ." },
        { id: "d1-3", speaker: "Ha", text: "Got it. And the endpoint for creating a payment — is it POST to /v1/payment_intents?", translation: "Hiểu rồi. Và endpoint để tạo payment — là POST đến /v1/payment_intents?" },
        { id: "d1-4", speaker: "Tom", text: "Exactly. Pass the amount and currency in the request payload. The response schema shows all the fields you'll get back.", translation: "Chính xác. Truyền amount và currency trong request payload. Response schema cho thấy tất cả các fields bạn sẽ nhận được." },
        { id: "d1-5", speaker: "Ha", text: "What about error handling? What status code does it return on failure?", translation: "Còn error handling thì sao? Nó trả về status code gì khi thất bại?" },
        { id: "d1-6", speaker: "Tom", text: "400 for invalid parameters, 401 for authentication errors, and 402 for card-specific issues. The error object includes a 'code' field with details.", translation: "400 cho invalid parameters, 401 cho authentication errors, và 402 cho các vấn đề thẻ cụ thể. Error object có trường 'code' kèm chi tiết." },
      ],
    },
  ],

  listenAndChoose: [
    { id: "lac1", audio_text: "The API returns a 429 status code when you exceed the rate limit.", options: ["API bị lỗi server", "Vượt quá giới hạn request", "Token hết hạn", "Request không hợp lệ"], answer: "Vượt quá giới hạn request" },
    { id: "lac2", audio_text: "Include your API key as a Bearer token in the Authorization header.", options: ["API key đặt trong URL", "API key đặt trong body", "API key đặt trong header", "API key đặt trong query string"], answer: "API key đặt trong header" },
    { id: "lac3", audio_text: "This endpoint is deprecated and will be removed in version 4.0.", options: ["Endpoint sẽ được nâng cấp", "Endpoint sẽ bị xóa trong v4.0", "Endpoint mới được thêm vào", "Endpoint bị lỗi tạm thời"], answer: "Endpoint sẽ bị xóa trong v4.0" },
  ],

  speaking: {
    level1Prompt: "Giải thích cho đồng nghiệp mới: API endpoint là gì và cách dùng nó.",
    level1Placeholder: "An API endpoint is a URL that...",
    level2Situation: "Bạn tìm thấy lỗi trong API docs của team. Viết message Slack để hỏi team lead.",
    level2Hint: "Hey [name], I found a discrepancy in the API docs for the users endpoint. The documentation says it returns a 200 status, but I'm getting a 201. Should we update the docs or change the expected behavior?",
  },

  quiz: [
    { id: "q1", question: "What does REST stand for in REST API?", options: ["Remote Execution System Transfer", "Representational State Transfer", "Request Execute Send Transfer", "Remote State Transfer"], answer: "Representational State Transfer", type: "multiple-choice" },
    { id: "q2", question: "Which status code means 'resource not found'?", options: ["200", "401", "404", "500"], answer: "404", type: "multiple-choice" },
    { id: "q3", question: "What is a 'payload' in API context?", options: ["Số lượng request tối đa", "Dữ liệu gửi trong body của request", "URL của endpoint", "Mã xác thực"], answer: "Dữ liệu gửi trong body của request", type: "multiple-choice" },
    { id: "q4", question: "Điền từ: Use ___ parameters to filter results (added to the URL after '?').", options: ["path", "query", "body", "header"], answer: "query", type: "multiple-choice" },
    { id: "q5", question: "Dịch sang tiếng Anh: API này yêu cầu authentication bằng Bearer token.", answer: "This API requires authentication using a Bearer token.", type: "translate" },
  ],

  fluencyDrill: {
    title: "API vocabulary sprint",
    timeLimit: 60,
    items: [
      { en: "endpoint", vn: "URL của API resource" },
      { en: "parameter", vn: "tham số đầu vào" },
      { en: "response", vn: "dữ liệu API trả về" },
      { en: "payload", vn: "dữ liệu trong body request" },
      { en: "status code", vn: "mã trạng thái HTTP" },
      { en: "deprecated", vn: "sẽ bị xóa trong tương lai" },
      { en: "rate limit", vn: "giới hạn số request/phút" },
      { en: "schema", vn: "cấu trúc dữ liệu" },
      { en: "authentication", vn: "xác thực danh tính" },
      { en: "pagination", vn: "phân trang dữ liệu" },
    ],
  },
};

export default unit34;
