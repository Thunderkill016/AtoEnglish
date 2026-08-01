import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export const GOLD_MISSION_04: MissionSpecV1 = {
  schemaVersion: 1,
  id: "mission-workplace-small-talk",
  lessonId: "unit-a0-4",
  titleVi: "Chào hỏi và nói chuyện ngắn ở công ty",
  canDoVi:
    "Người học có thể chào đúng thời điểm, trả lời câu hỏi thăm, hỏi lại người đối diện và kết thúc một cuộc nói chuyện ngắn lịch sự.",
  estimatedMinutes: 15,
  scenarioVi:
    "Sáng thứ Hai, bạn gặp một đồng nghiệp trong thang máy trước giờ làm việc.",
  learnerRoleVi: "Nhân viên bắt đầu một cuộc trò chuyện ngắn.",
  partnerName: "Jordan",
  partnerRoleVi: "Đồng nghiệp cùng công ty.",
  targetChunks: [
    { id: "morning", english: "Good morning.", vietnamese: "Chào buổi sáng.", useWhenVi: "Chào lịch sự vào buổi sáng." },
    { id: "how-are-you", english: "How are you?", vietnamese: "Bạn thế nào?", useWhenVi: "Hỏi thăm ngắn sau lời chào." },
    { id: "fine-thanks", english: "I'm fine, thanks.", vietnamese: "Tôi ổn, cảm ơn.", useWhenVi: "Trả lời ngắn gọn, tự nhiên." },
    { id: "and-you", english: "And you?", vietnamese: "Còn bạn?", useWhenVi: "Hỏi lại để duy trì tương tác." },
    { id: "good-to-see", english: "Good to see you.", vietnamese: "Rất vui được gặp bạn.", useWhenVi: "Nói với người đã quen." },
    { id: "busy-day", english: "Busy day today?", vietnamese: "Hôm nay bận không?", useWhenVi: "Mở rộng small talk bằng câu hỏi ngắn." },
    { id: "see-you", english: "See you later.", vietnamese: "Hẹn gặp lại sau.", useWhenVi: "Kết thúc thân thiện." },
    { id: "take-care", english: "Take care.", vietnamese: "Bảo trọng nhé.", useWhenVi: "Kết thúc lịch sự, thân thiện." },
  ],
  intents: [
    { id: "greet_appropriately", descriptionVi: "Chào phù hợp với thời điểm.", required: true, interactional: true, examples: ["Good morning."], matchers: ["\\bgood (?:morning|afternoon|evening)\\b", "\\bhello\\b", "\\bhi\\b"] },
    { id: "respond_wellbeing", descriptionVi: "Trả lời câu hỏi thăm.", required: true, interactional: false, examples: ["I'm fine, thanks."], matchers: ["\\bi am (?:fine|good|great|okay|ok)\\b", "\\bdoing (?:well|good|great|okay|ok)\\b"] },
    { id: "reciprocate_question", descriptionVi: "Hỏi lại người đối diện.", required: true, interactional: true, examples: ["And you?", "How are you?"], matchers: ["\\band you\\b", "\\bhow are you\\b", "\\bhow about you\\b"] },
    { id: "close_conversation", descriptionVi: "Kết thúc cuộc nói chuyện lịch sự.", required: true, interactional: true, examples: ["See you later.", "Take care."], matchers: ["\\bsee you (?:later|tomorrow|soon)\\b", "\\btake care\\b", "\\bhave a (?:good|nice) day\\b"] },
    { id: "small_talk_question", descriptionVi: "Đặt một câu small talk ngắn.", required: false, interactional: true, examples: ["Busy day today?"], matchers: ["\\bbusy day\\b", "\\bhow is your day\\b", "\\bhow was your weekend\\b"] },
  ],
  feedbackRules: [
    { code: "missing_be_how_are_you", pattern: "\\bhow you\\b", suggestion: "How are you?", explanationVi: "Câu hỏi cần động từ 'are': How are you?" },
    { code: "missing_reciprocity", pattern: "\\bi am (?:fine|good|great|okay|ok)(?: thanks)?$", suggestion: "I'm fine, thanks. And you?", explanationVi: "Trong small talk, hỏi lại 'And you?' giúp cuộc trò chuyện tự nhiên hơn." },
  ],
  roleplayTurns: [
    { id: "greeting", partnerLine: "Good morning!", partnerLineVi: "Đồng nghiệp chào bạn trong thang máy.", expectedIntentIds: ["greet_appropriately"], hintVi: "Chào lại phù hợp với buổi sáng." },
    { id: "wellbeing", partnerLine: "How are you today?", partnerLineVi: "Đồng nghiệp hỏi thăm ngắn.", expectedIntentIds: ["respond_wellbeing", "reciprocate_question"], hintVi: "Trả lời ngắn rồi hỏi lại And you?" },
    { id: "small-talk", partnerLine: "I'm good, thanks. Monday is already busy.", partnerLineVi: "Đồng nghiệp nói hôm nay khá bận.", expectedIntentIds: ["small_talk_question"], hintVi: "Có thể hỏi Busy day today?; mục tiêu này là tùy chọn." },
    { id: "close", partnerLine: "This is my floor. I need to go.", partnerLineVi: "Đồng nghiệp chuẩn bị rời thang máy.", expectedIntentIds: ["close_conversation"], hintVi: "Kết thúc bằng See you later hoặc Take care." },
  ],
  checkpoint: {
    passThreshold: 3,
    questions: [
      { id: "greet", questionVi: "Bạn gặp đồng nghiệp lúc 9 giờ sáng. Câu nào phù hợp?", options: ["Good morning.", "Good night.", "See you yesterday.", "Morning is me."], answer: "Good morning.", explanationVi: "Good morning dùng vào buổi sáng.", evidenceIntentIds: ["greet_appropriately"] },
      { id: "respond", questionVi: "Câu trả lời tự nhiên cho 'How are you?' là gì?", options: ["I'm fine, thanks.", "My name Monday.", "I am office.", "Good night yesterday."], answer: "I'm fine, thanks.", explanationVi: "Đây là câu trả lời ngắn và phù hợp.", evidenceIntentIds: ["respond_wellbeing"] },
      { id: "reciprocate", questionVi: "Sau khi trả lời, bạn hỏi lại thế nào?", options: ["And you?", "And name?", "You is?", "What price?"], answer: "And you?", explanationVi: "'And you?' giữ cuộc trò chuyện hai chiều.", evidenceIntentIds: ["reciprocate_question"] },
      { id: "close", questionVi: "Bạn cần kết thúc cuộc nói chuyện. Câu nào lịch sự?", options: ["See you later.", "You stop now.", "I no talk.", "Later is see."], answer: "See you later.", explanationVi: "Dùng để kết thúc thân thiện.", evidenceIntentIds: ["close_conversation"] },
    ],
  },
  evaluation: { requiredIntentPassRatio: 1, maxCorrections: 2, pronunciationFromTranscript: false },
  retry: { requiredAfterFeedback: true, maxAttemptsPerSession: 3 },
  review: { transferAfterDays: [1, 7, 30] },
  transferVariants: [
    { id: "transfer-day-1-canteen", dueAfterDays: 1, scenarioVi: "Bạn gặp đồng nghiệp ở căng-tin vào buổi trưa.", changedConditions: ["Thời điểm khác", "Không ở thang máy"], partnerLines: ["Hi! Good afternoon.", "How are you?", "I'm doing well. The canteen is busy today.", "I need to get back to work now."] },
    { id: "transfer-day-7-manager", dueAfterDays: 7, scenarioVi: "Bạn gặp quản lý trước một cuộc họp.", changedConditions: ["Trang trọng hơn", "Thời gian rất ngắn"], partnerLines: ["Good morning.", "How are you today?", "I'm well, thank you. Ready for the meeting?", "We should go into the room now."] },
    { id: "transfer-day-30-event", dueAfterDays: 30, scenarioVi: "Bạn gặp lại một người quen tại sự kiện công ty buổi tối.", changedConditions: ["Buổi tối", "Đã lâu không gặp"], partnerLines: ["Good evening. It's good to see you again.", "How have you been?", "I've been busy, but good.", "The event is starting. Let's talk later."] },
  ],
};
