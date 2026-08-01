import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export const GOLD_MISSION_03: MissionSpecV1 = {
  schemaVersion: 1,
  id: "mission-shop-for-clothes",
  lessonId: "unit-a0-3",
  titleVi: "Chọn quần áo đúng màu và kích cỡ",
  canDoVi:
    "Người học có thể nói món đồ, màu và kích cỡ cần tìm, hỏi cửa hàng có lựa chọn đó không và xác nhận món mình chọn.",
  estimatedMinutes: 15,
  scenarioVi:
    "Bạn vào cửa hàng quần áo và cần tìm một chiếc áo đúng màu, đúng kích cỡ.",
  learnerRoleVi: "Khách hàng đang tìm quần áo.",
  partnerName: "Mia",
  partnerRoleVi: "Nhân viên cửa hàng quần áo.",
  targetChunks: [
    { id: "looking-for", english: "I'm looking for a ...", vietnamese: "Tôi đang tìm một ...", useWhenVi: "Mở đầu và nói món đồ cần tìm." },
    { id: "color-item", english: "I need a blue shirt.", vietnamese: "Tôi cần một chiếc áo xanh.", useWhenVi: "Mô tả màu trước danh từ." },
    { id: "size", english: "I need a medium.", vietnamese: "Tôi cần cỡ vừa.", useWhenVi: "Nói kích cỡ bạn cần." },
    { id: "have-color", english: "Do you have this in black?", vietnamese: "Bạn có cái này màu đen không?", useWhenVi: "Hỏi một màu khác." },
    { id: "have-size", english: "Do you have a larger size?", vietnamese: "Bạn có cỡ lớn hơn không?", useWhenVi: "Hỏi kích cỡ khác." },
    { id: "prefer", english: "I prefer the red one.", vietnamese: "Tôi thích cái màu đỏ hơn.", useWhenVi: "So sánh và chọn một món." },
    { id: "try-on", english: "Can I try it on?", vietnamese: "Tôi thử mặc được không?", useWhenVi: "Xin phép thử đồ." },
    { id: "take-it", english: "I'll take this one.", vietnamese: "Tôi lấy cái này.", useWhenVi: "Xác nhận lựa chọn cuối." },
  ],
  intents: [
    { id: "state_item", descriptionVi: "Nói món đồ đang tìm.", required: true, interactional: false, examples: ["I'm looking for a shirt."], matchers: ["\\bi am looking for (?:an? )?[a-z]+\\b", "\\bi need (?:an? )?(?:shirt|bag|jacket|dress|hat|shoe|shoes)\\b"] },
    { id: "state_color_size", descriptionVi: "Nói màu hoặc kích cỡ mong muốn.", required: true, interactional: false, examples: ["I need a blue shirt in medium."], matchers: ["\\b(?:red|blue|black|white|green|yellow|brown|gray|grey) (?:shirt|bag|jacket|dress|hat|shoe|shoes)\\b", "\\b(?:small|medium|large|larger|smaller)\\b"] },
    { id: "ask_availability", descriptionVi: "Hỏi có màu hoặc kích cỡ khác không.", required: true, interactional: true, examples: ["Do you have this in black?"], matchers: ["\\bdo you have (?:this|it|one|a|an)\\b", "\\bdo you have (?:a )?(?:larger|smaller|medium|large|small) size\\b"] },
    { id: "choose_item", descriptionVi: "Nói món mình chọn.", required: true, interactional: true, examples: ["I prefer the red one.", "I'll take this one."], matchers: ["\\bi prefer the [a-z]+ one\\b", "\\bi(?:'ll| will) take (?:this|that|the) one\\b", "\\bi(?:'ll| will) take it\\b"] },
    { id: "ask_try_on", descriptionVi: "Xin thử đồ.", required: false, interactional: true, examples: ["Can I try it on?"], matchers: ["\\bcan i try (?:it|this) on\\b"] },
  ],
  feedbackRules: [
    { code: "adjective_after_noun", pattern: "\\b(?:shirt|bag|jacket|dress|hat) (?:red|blue|black|white|green|yellow|brown|gray|grey)\\b", suggestion: "I need a blue shirt.", explanationVi: "Trong tiếng Anh, màu đứng trước danh từ: 'a blue shirt'." },
    { code: "missing_article_item", pattern: "\\bi am looking for (?:shirt|bag|jacket|dress|hat)\\b", suggestion: "I'm looking for a shirt.", explanationVi: "Danh từ đếm được số ít cần 'a/an'." },
  ],
  roleplayTurns: [
    { id: "item", partnerLine: "Hello. What are you looking for today?", partnerLineVi: "Nhân viên hỏi bạn đang tìm gì.", expectedIntentIds: ["state_item"], hintVi: "Nói I'm looking for a ..." },
    { id: "color-size", partnerLine: "What color and size do you need?", partnerLineVi: "Nhân viên hỏi màu và kích cỡ.", expectedIntentIds: ["state_color_size"], hintVi: "Nói màu trước món đồ và thêm size." },
    { id: "availability", partnerLine: "We have this shirt in blue, but only in small.", partnerLineVi: "Cửa hàng có màu xanh nhưng chỉ còn cỡ nhỏ.", expectedIntentIds: ["ask_availability"], hintVi: "Hỏi màu hoặc cỡ khác bằng Do you have...?" },
    { id: "choice", partnerLine: "Here is a black one in medium. Would you like it?", partnerLineVi: "Nhân viên đưa một lựa chọn khác.", expectedIntentIds: ["choose_item", "ask_try_on"], hintVi: "Chọn món hoặc xin thử mặc." },
  ],
  checkpoint: {
    passThreshold: 3,
    questions: [
      { id: "item", questionVi: "Bạn đang tìm một chiếc áo. Câu nào tự nhiên?", options: ["I'm looking for a shirt.", "I looking shirt.", "I am shirt find.", "Looking me shirt."], answer: "I'm looking for a shirt.", explanationVi: "Dùng cụm 'I'm looking for...'.", evidenceIntentIds: ["state_item"] },
      { id: "color", questionVi: "Cách nói 'một chiếc áo xanh' đúng là gì?", options: ["a blue shirt", "a shirt blue", "blue a shirt", "shirt is a blue"], answer: "a blue shirt", explanationVi: "Tính từ màu đứng trước danh từ.", evidenceIntentIds: ["state_color_size"] },
      { id: "availability", questionVi: "Bạn hỏi cửa hàng có màu đen không thế nào?", options: ["Do you have this in black?", "Have you black this?", "Is black have?", "Do black this?"], answer: "Do you have this in black?", explanationVi: "Đây là chunk phổ biến khi hỏi biến thể màu.", evidenceIntentIds: ["ask_availability"] },
      { id: "choose", questionVi: "Bạn quyết định lấy món này. Bạn nói gì?", options: ["I'll take this one.", "I take was this.", "This one take me.", "I am taken this."], answer: "I'll take this one.", explanationVi: "'I'll take...' dùng để xác nhận lựa chọn.", evidenceIntentIds: ["choose_item"] },
    ],
  },
  evaluation: { requiredIntentPassRatio: 1, maxCorrections: 2, pronunciationFromTranscript: false },
  retry: { requiredAfterFeedback: true, maxAttemptsPerSession: 3 },
  review: { transferAfterDays: [1, 7, 30] },
  transferVariants: [
    { id: "transfer-day-1-shoes", dueAfterDays: 1, scenarioVi: "Bạn tìm một đôi giày tại cửa hàng khác.", changedConditions: ["Món đồ khác", "Dùng kích cỡ thay vì chỉ màu"], partnerLines: ["Hi. What kind of shoes are you looking for?", "What color and size do you wear?", "We only have the white pair in that size.", "Here is a black pair one size larger."] },
    { id: "transfer-day-7-gift", dueAfterDays: 7, scenarioVi: "Bạn mua một chiếc túi làm quà.", changedConditions: ["Mua cho người khác", "Phải chọn giữa hai màu"], partnerLines: ["Hello. What would you like to find?", "Which color and size would be best?", "We have red and brown, but not black.", "This red one is available now."] },
    { id: "transfer-day-30-lost-item", dueAfterDays: 30, scenarioVi: "Bạn mô tả một món đồ bị thất lạc cho nhân viên hỗ trợ.", changedConditions: ["Không phải mua hàng", "Phải mô tả chính xác"], partnerLines: ["Can you describe the item you lost?", "What color and size is it?", "Is this the same model in a different color?", "We found a black one. Is this yours?"] },
  ],
};
