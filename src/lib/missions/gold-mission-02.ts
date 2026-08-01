import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export const GOLD_MISSION_02: MissionSpecV1 = {
  schemaVersion: 1,
  id: "mission-buy-and-pay",
  lessonId: "unit-a0-2",
  titleVi: "Mua đồ và thanh toán",
  canDoVi:
    "Người học có thể hỏi giá, xác nhận mua hàng, chọn cách thanh toán và yêu cầu nhắc lại giá trong một giao dịch đơn giản.",
  estimatedMinutes: 15,
  scenarioVi:
    "Bạn mua một món đồ ở cửa hàng tiện lợi. Nhãn giá không rõ và thu ngân nói tiếng Anh.",
  learnerRoleVi: "Khách hàng cần hỏi giá và thanh toán.",
  partnerName: "Sam",
  partnerRoleVi: "Thu ngân tại cửa hàng tiện lợi.",
  targetChunks: [
    { id: "ask-price", english: "How much is this?", vietnamese: "Cái này giá bao nhiêu?", useWhenVi: "Hỏi giá món đồ bạn đang chỉ vào." },
    { id: "ask-total", english: "What's the total?", vietnamese: "Tổng cộng bao nhiêu?", useWhenVi: "Hỏi tổng tiền phải trả." },
    { id: "take-it", english: "I'll take it.", vietnamese: "Tôi lấy món này.", useWhenVi: "Xác nhận bạn muốn mua." },
    { id: "pay-card", english: "Can I pay by card?", vietnamese: "Tôi trả bằng thẻ được không?", useWhenVi: "Chọn cách thanh toán bằng thẻ." },
    { id: "pay-cash", english: "I'll pay in cash.", vietnamese: "Tôi sẽ trả tiền mặt.", useWhenVi: "Chọn cách thanh toán bằng tiền mặt." },
    { id: "receipt", english: "Can I have a receipt, please?", vietnamese: "Cho tôi xin hóa đơn nhé?", useWhenVi: "Xin biên lai sau khi trả tiền." },
    { id: "repeat-price", english: "Could you say the price again?", vietnamese: "Bạn có thể nói lại giá không?", useWhenVi: "Giá được nói quá nhanh hoặc bạn chưa nghe rõ." },
    { id: "thanks", english: "Thank you.", vietnamese: "Cảm ơn.", useWhenVi: "Kết thúc giao dịch lịch sự." },
  ],
  intents: [
    { id: "ask_price", descriptionVi: "Hỏi giá món hàng.", required: true, interactional: true, examples: ["How much is this?"], matchers: ["\\bhow much is (?:this|it|that)\\b", "\\bwhat is the price\\b"] },
    { id: "confirm_purchase", descriptionVi: "Xác nhận muốn mua.", required: true, interactional: false, examples: ["I'll take it."], matchers: ["\\bi(?:'ll| will) take (?:it|this)\\b", "\\bi want (?:it|this)\\b"] },
    { id: "choose_payment", descriptionVi: "Nói cách thanh toán.", required: true, interactional: true, examples: ["Can I pay by card?", "I'll pay in cash."], matchers: ["\\bpay by card\\b", "\\bpay in cash\\b", "\\bcan i pay\\b"] },
    { id: "repair_price", descriptionVi: "Yêu cầu nhắc lại giá.", required: true, interactional: true, examples: ["Could you say the price again?"], matchers: ["\\bsay the price again\\b", "\\brepeat the price\\b", "\\bi did not catch the price\\b"] },
    { id: "ask_receipt", descriptionVi: "Xin hóa đơn.", required: false, interactional: true, examples: ["Can I have a receipt, please?"], matchers: ["\\bcan i have (?:a|the) receipt\\b", "\\bi need (?:a|the) receipt\\b"] },
  ],
  feedbackRules: [
    { code: "missing_be_in_price_question", pattern: "\\bhow much (?:this|it|that)\\b", suggestion: "How much is this?", explanationVi: "Câu hỏi giá với 'this/it/that' cần động từ 'is'." },
    { code: "wrong_card_preposition", pattern: "\\bpay (?:with|in) card\\b", suggestion: "Can I pay by card?", explanationVi: "Dùng 'pay by card' nhưng 'pay in cash'." },
  ],
  roleplayTurns: [
    { id: "price", partnerLine: "Hello. Can I help you?", partnerLineVi: "Thu ngân chào và hỏi có thể giúp gì.", expectedIntentIds: ["ask_price"], hintVi: "Hỏi giá món hàng bằng How much is this?" },
    { id: "purchase", partnerLine: "It's twelve dollars.", partnerLineVi: "Thu ngân báo giá 12 đô la.", expectedIntentIds: ["confirm_purchase"], hintVi: "Xác nhận mua bằng I'll take it." },
    { id: "payment", partnerLine: "How would you like to pay?", partnerLineVi: "Thu ngân hỏi bạn muốn thanh toán thế nào.", expectedIntentIds: ["choose_payment"], hintVi: "Nói pay by card hoặc pay in cash." },
    { id: "repair", partnerLine: "The total is thirteen seventy-five including tax.", partnerLineVi: "Thu ngân nói tổng tiền khá nhanh.", expectedIntentIds: ["repair_price", "ask_receipt"], hintVi: "Yêu cầu nói lại giá; xin hóa đơn là tùy chọn." },
  ],
  checkpoint: {
    passThreshold: 3,
    questions: [
      { id: "price", questionVi: "Bạn hỏi giá một món hàng thế nào?", options: ["How much is this?", "How many is this?", "What money this?", "How price?"], answer: "How much is this?", explanationVi: "Dùng 'How much is this?' khi chỉ vào một món hàng.", evidenceIntentIds: ["ask_price"] },
      { id: "take", questionVi: "Bạn đồng ý mua món hàng. Bạn nói gì?", options: ["I'll take it.", "I take yesterday.", "It take me.", "I am take it."], answer: "I'll take it.", explanationVi: "'I'll take it' là cụm tự nhiên để xác nhận mua.", evidenceIntentIds: ["confirm_purchase"] },
      { id: "payment", questionVi: "Câu nào hỏi trả bằng thẻ đúng?", options: ["Can I pay by card?", "Can I pay in card?", "I card pay?", "Can pay card me?"], answer: "Can I pay by card?", explanationVi: "Dùng giới từ 'by' với card.", evidenceIntentIds: ["choose_payment"] },
      { id: "repeat", questionVi: "Bạn chưa nghe rõ giá. Bạn nói gì?", options: ["Could you say the price again?", "Give price yesterday.", "Price is me.", "How color is it?"], answer: "Could you say the price again?", explanationVi: "Yêu cầu nhắc lại trực tiếp và lịch sự.", evidenceIntentIds: ["repair_price"] },
    ],
  },
  evaluation: { requiredIntentPassRatio: 1, maxCorrections: 2, pronunciationFromTranscript: false },
  retry: { requiredAfterFeedback: true, maxAttemptsPerSession: 3 },
  review: { transferAfterDays: [1, 7, 30] },
  transferVariants: [
    { id: "transfer-day-1-cafe", dueAfterDays: 1, scenarioVi: "Bạn gọi đồ uống tại một quán cà phê.", changedConditions: ["Sản phẩm là đồ uống", "Có nhiều kích cỡ"], partnerLines: ["Hi. What can I get for you?", "A small coffee is four dollars.", "Would you like to pay by card or cash?", "Your total is five forty with the extra shot."] },
    { id: "transfer-day-7-market", dueAfterDays: 7, scenarioVi: "Bạn mua quà tại một khu chợ du lịch.", changedConditions: ["Không có nhãn giá", "Người bán nói nhanh"], partnerLines: ["Hello. Are you interested in this bag?", "It's eighteen dollars today.", "How would you like to pay?", "The final price is nineteen twenty-five."] },
    { id: "transfer-day-30-pharmacy", dueAfterDays: 30, scenarioVi: "Bạn mua một món hàng không kê đơn tại hiệu thuốc.", changedConditions: ["Bối cảnh nghiêm túc hơn", "Bạn cần biên lai"], partnerLines: ["Good afternoon. What do you need?", "This one is nine dollars.", "Card or cash?", "The total is ten thirty and I can print a receipt."] },
  ],
};
