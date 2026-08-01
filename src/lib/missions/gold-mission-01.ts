import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export const GOLD_MISSION_01: MissionSpecV1 = {
  schemaVersion: 1,
  id: "mission-meet-new-colleague",
  lessonId: "unit-a0-1",
  titleVi: "Gặp đồng nghiệp mới",
  canDoVi:
    "Trong một cuộc hội thoại ngắn, người học có thể nói tên và công việc, hỏi tên đối phương và yêu cầu nhắc lại khi chưa nghe rõ.",
  estimatedMinutes: 12,
  scenarioVi:
    "Bạn vừa tham gia một cuộc họp online với đồng nghiệp nước ngoài lần đầu. Hai người cần giới thiệu nhanh trước khi bắt đầu công việc.",
  learnerRoleVi: "Nhân viên Việt Nam mới tham gia nhóm.",
  partnerRoleVi: "Alex, đồng nghiệp ở một văn phòng khác.",
  targetChunks: [
    {
      id: "introduce-name",
      english: "Hi, I'm ...",
      vietnamese: "Chào, tôi là ...",
      useWhenVi: "Mở đầu và nói tên của bạn.",
    },
    {
      id: "state-role",
      english: "I work as a ...",
      vietnamese: "Tôi làm ...",
      useWhenVi: "Nói nghề nghiệp hoặc vai trò.",
    },
    {
      id: "state-workplace",
      english: "I work at ...",
      vietnamese: "Tôi làm tại ...",
      useWhenVi: "Nói công ty hoặc nơi làm việc.",
    },
    {
      id: "ask-name",
      english: "What's your name?",
      vietnamese: "Bạn tên gì?",
      useWhenVi: "Hỏi tên người đối diện.",
    },
    {
      id: "nice-to-meet",
      english: "Nice to meet you.",
      vietnamese: "Rất vui được gặp bạn.",
      useWhenVi: "Phản hồi lịch sự khi gặp lần đầu.",
    },
    {
      id: "repeat",
      english: "Could you say that again?",
      vietnamese: "Bạn có thể nói lại không?",
      useWhenVi: "Bạn không nghe rõ và cần người kia nhắc lại.",
    },
    {
      id: "spell",
      english: "How do you spell that?",
      vietnamese: "Bạn đánh vần từ đó thế nào?",
      useWhenVi: "Bạn nghe được âm nhưng chưa biết cách viết tên hoặc từ.",
    },
    {
      id: "did-not-catch",
      english: "Sorry, I didn't catch that.",
      vietnamese: "Xin lỗi, tôi chưa nghe rõ.",
      useWhenVi: "Báo hiệu lịch sự rằng bạn chưa hiểu.",
    },
  ],
  intents: [
    {
      id: "introduce_name",
      descriptionVi: "Nói tên của mình.",
      required: true,
      examples: ["Hi, I'm Minh.", "My name is Lan."],
      matchers: [
        "\\b(?:i am|i'm)\\s+[a-z]+",
        "\\bmy name is\\s+[a-z]+",
      ],
    },
    {
      id: "state_role",
      descriptionVi: "Nói nghề nghiệp hoặc vai trò.",
      required: true,
      examples: ["I work as a designer.", "I'm a developer."],
      matchers: [
        "\\bi work as(?: an?| the)?\\s+[a-z]+",
        "\\b(?:i am|i'm)(?: an?)?\\s+(?:designer|developer|engineer|teacher|student|manager|accountant|marketer|salesperson|assistant)\\b",
      ],
    },
    {
      id: "state_workplace",
      descriptionVi: "Nói nơi làm việc.",
      required: false,
      examples: ["I work at Ato."],
      matchers: ["\\bi work at\\s+[a-z0-9]+"],
    },
    {
      id: "ask_name",
      descriptionVi: "Hỏi tên người đối diện.",
      required: true,
      examples: ["What's your name?", "What is your name?"],
      matchers: ["\\bwhat(?:'s| is) your name\\b"],
    },
    {
      id: "repair_request",
      descriptionVi: "Yêu cầu nhắc lại hoặc báo chưa nghe rõ.",
      required: true,
      examples: [
        "Could you say that again?",
        "Sorry, I didn't catch that.",
        "How do you spell that?",
      ],
      matchers: [
        "\\b(?:could|can) you say (?:that|it) again\\b",
        "\\bi did not catch that\\b",
        "\\bi didn't catch that\\b",
        "\\bhow do you spell that\\b",
      ],
    },
  ],
  roleplayTurns: [
    {
      id: "turn-introduction",
      partnerLine: "Hi, I'm Alex. What's your name?",
      partnerLineVi: "Chào, tôi là Alex. Bạn tên gì?",
      expectedIntentIds: ["introduce_name"],
      hintVi: "Nói: Hi, I'm ... hoặc My name is ...",
    },
    {
      id: "turn-role",
      partnerLine: "Nice to meet you. What do you do?",
      partnerLineVi: "Rất vui được gặp bạn. Bạn làm công việc gì?",
      expectedIntentIds: ["state_role", "state_workplace"],
      hintVi: "Nói vai trò bằng I work as ...; nơi làm việc là tùy chọn.",
    },
    {
      id: "turn-ask-name",
      partnerLine: "We will work together on the new project.",
      partnerLineVi: "Chúng ta sẽ làm cùng nhau trong dự án mới.",
      expectedIntentIds: ["ask_name"],
      hintVi: "Đến lượt bạn hỏi tên người đối diện.",
    },
    {
      id: "turn-repair",
      partnerLine: "I work with the customer success enablement team.",
      partnerLineVi: "Alex cố tình nói một cụm dài và khó nghe.",
      expectedIntentIds: ["repair_request"],
      hintVi: "Đừng đoán. Hãy yêu cầu nói lại hoặc đánh vần.",
    },
  ],
  evaluation: {
    requiredIntentPassRatio: 1,
    maxCorrections: 2,
    pronunciationFromTranscript: false,
  },
  retry: {
    requiredAfterFeedback: true,
    maxAttemptsPerSession: 3,
  },
  review: {
    transferAfterDays: [1, 7, 30],
  },
  transferVariants: [
    {
      id: "transfer-day-1-cafe",
      dueAfterDays: 1,
      scenarioVi: "Bạn gặp một thành viên mới của nhóm tại quán cà phê.",
      changedConditions: ["Tên người đối diện khác", "Không có cuộc họp online"],
      partnerOpening: "Hi, I'm Maya. Are you on the product team?",
    },
    {
      id: "transfer-day-7-call",
      dueAfterDays: 7,
      scenarioVi: "Bạn tham gia cuộc gọi âm thanh với một đồng nghiệp nói nhanh hơn.",
      changedConditions: ["Không nhìn thấy khuôn mặt", "Tốc độ nói tự nhiên hơn"],
      partnerOpening: "Hey, this is Jordan from operations. Who am I speaking with?",
    },
    {
      id: "transfer-day-30-client",
      dueAfterDays: 30,
      scenarioVi: "Bạn gặp một khách hàng lần đầu và phải tự duy trì cuộc nói chuyện.",
      changedConditions: ["Vai trò người đối diện khác", "Không có câu gợi ý"],
      partnerOpening: "Good morning. I don't think we've met before.",
    },
  ],
};
