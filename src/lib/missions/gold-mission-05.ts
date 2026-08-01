import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export const GOLD_MISSION_05: MissionSpecV1 = {
  schemaVersion: 1,
  id: "mission-answer-personal-information",
  lessonId: "unit-a0-5",
  titleVi: "Trả lời thông tin cá nhân tại sân bay",
  canDoVi:
    "Người học có thể trả lời tên, quê quán, nghề nghiệp và nơi ở, đồng thời yêu cầu nhân viên nhắc lại khi chưa hiểu câu hỏi.",
  estimatedMinutes: 15,
  scenarioVi:
    "Bạn đến quầy kiểm tra hộ chiếu và cần trả lời các câu hỏi cá nhân cơ bản bằng tiếng Anh.",
  learnerRoleVi: "Hành khách Việt Nam tại quầy kiểm tra hộ chiếu.",
  partnerName: "Officer Taylor",
  partnerRoleVi: "Nhân viên kiểm tra hộ chiếu.",
  targetChunks: [
    { id: "name", english: "My name is ...", vietnamese: "Tên tôi là ...", useWhenVi: "Trả lời câu hỏi về tên." },
    { id: "from", english: "I'm from Vietnam.", vietnamese: "Tôi đến từ Việt Nam.", useWhenVi: "Nói quốc gia hoặc quê quán." },
    { id: "live", english: "I live in ...", vietnamese: "Tôi sống ở ...", useWhenVi: "Nói nơi bạn đang sống." },
    { id: "job", english: "I work as a ...", vietnamese: "Tôi làm ...", useWhenVi: "Nói nghề nghiệp." },
    { id: "age", english: "I'm ... years old.", vietnamese: "Tôi ... tuổi.", useWhenVi: "Nói tuổi khi tình huống yêu cầu." },
    { id: "stay", english: "I'm staying at ...", vietnamese: "Tôi đang ở tại ...", useWhenVi: "Nói nơi lưu trú trong chuyến đi." },
    { id: "repeat", english: "Could you repeat the question?", vietnamese: "Bạn có thể nhắc lại câu hỏi không?", useWhenVi: "Bạn chưa nghe hoặc chưa hiểu câu hỏi." },
    { id: "slower", english: "Could you speak more slowly?", vietnamese: "Bạn có thể nói chậm hơn không?", useWhenVi: "Yêu cầu người đối diện giảm tốc độ." },
  ],
  intents: [
    { id: "state_name", descriptionVi: "Nói tên.", required: true, interactional: false, examples: ["My name is Minh."], matchers: ["\\bmy name is\\s+[a-z]+", "\\bi am\\s+[a-z]+\\b"] },
    { id: "state_origin", descriptionVi: "Nói quốc gia hoặc quê quán.", required: true, interactional: false, examples: ["I'm from Vietnam."], matchers: ["\\bi am from\\s+[a-z]+", "\\bi come from\\s+[a-z]+"] },
    { id: "state_job", descriptionVi: "Nói nghề nghiệp.", required: true, interactional: false, examples: ["I work as an engineer."], matchers: ["\\bi work as(?: an?)?\\s+[a-z]+", "\\bi am(?: an?)?\\s+(?:engineer|teacher|student|designer|developer|manager|accountant|assistant)\\b"] },
    { id: "state_location", descriptionVi: "Nói nơi ở hoặc nơi lưu trú.", required: true, interactional: false, examples: ["I live in Hanoi.", "I'm staying at the Central Hotel."], matchers: ["\\bi live in\\s+[a-z]+", "\\bi am staying at\\s+", "\\bi stay at\\s+"] },
    { id: "repair_question", descriptionVi: "Yêu cầu nhắc lại hoặc nói chậm hơn.", required: true, interactional: true, examples: ["Could you repeat the question?"], matchers: ["\\bcould you repeat (?:the|that) question\\b", "\\bcould you speak more slowly\\b", "\\bplease speak more slowly\\b"] },
    { id: "state_age", descriptionVi: "Nói tuổi.", required: false, interactional: false, examples: ["I'm twenty-five years old."], matchers: ["\\bi am (?:[a-z-]+|[0-9]+)(?: years old)?\\b"] },
  ],
  feedbackRules: [
    { code: "age_with_have", pattern: "\\bi have (?:[a-z-]+|[0-9]+) years old\\b", suggestion: "I'm twenty-five years old.", explanationVi: "Tiếng Anh dùng động từ 'be' để nói tuổi, không dùng 'have'." },
    { code: "missing_from", pattern: "\\bi am vietnam\\b", suggestion: "I'm from Vietnam.", explanationVi: "Dùng 'from' để nói xuất xứ: I'm from Vietnam." },
    { code: "missing_work_as_personal", pattern: "\\bi work (?:engineer|teacher|student|designer|developer|manager|accountant|assistant)\\b", suggestion: "I work as an engineer.", explanationVi: "Dùng 'work as' trước nghề nghiệp." },
  ],
  roleplayTurns: [
    { id: "identity", partnerLine: "Good afternoon. What is your full name?", partnerLineVi: "Nhân viên hỏi tên đầy đủ.", expectedIntentIds: ["state_name"], hintVi: "Nói My name is ..." },
    { id: "origin", partnerLine: "Where are you from?", partnerLineVi: "Nhân viên hỏi bạn đến từ đâu.", expectedIntentIds: ["state_origin"], hintVi: "Nói I'm from Vietnam." },
    { id: "job-location", partnerLine: "What do you do, and where are you staying?", partnerLineVi: "Nhân viên hỏi nghề nghiệp và nơi lưu trú.", expectedIntentIds: ["state_job", "state_location"], hintVi: "Dùng I work as... và I'm staying at..." },
    { id: "repair", partnerLine: "What is the purpose and anticipated duration of your visit?", partnerLineVi: "Nhân viên hỏi một câu dài và khó hơn trình độ hiện tại.", expectedIntentIds: ["repair_question"], hintVi: "Không đoán. Yêu cầu nhắc lại hoặc nói chậm hơn." },
  ],
  checkpoint: {
    passThreshold: 4,
    questions: [
      { id: "name", questionVi: "Bạn trả lời câu hỏi về tên thế nào?", options: ["My name is Minh.", "My name Minh.", "I name at Minh.", "Name am Minh."], answer: "My name is Minh.", explanationVi: "Cần động từ 'is'.", evidenceIntentIds: ["state_name"] },
      { id: "origin", questionVi: "Câu nào nói bạn đến từ Việt Nam?", options: ["I'm from Vietnam.", "I am Vietnam.", "I from is Vietnam.", "Vietnam has me."], answer: "I'm from Vietnam.", explanationVi: "Dùng 'be from'.", evidenceIntentIds: ["state_origin"] },
      { id: "job", questionVi: "Câu nào nói nghề nghiệp đúng?", options: ["I work as an engineer.", "I work engineer.", "I am work engineer.", "Engineer work me."], answer: "I work as an engineer.", explanationVi: "Dùng 'work as a/an'.", evidenceIntentIds: ["state_job"] },
      { id: "location", questionVi: "Bạn nói nơi mình sống thế nào?", options: ["I live in Hanoi.", "I live Hanoi in.", "I am live Hanoi.", "Hanoi living me."], answer: "I live in Hanoi.", explanationVi: "Dùng 'live in + địa điểm'.", evidenceIntentIds: ["state_location"] },
      { id: "repair", questionVi: "Bạn chưa hiểu câu hỏi. Câu nào phù hợp?", options: ["Could you repeat the question?", "Question repeat yesterday.", "I am no question.", "Where price is it?"], answer: "Could you repeat the question?", explanationVi: "Đây là repair strategy an toàn và lịch sự.", evidenceIntentIds: ["repair_question"] },
    ],
  },
  evaluation: { requiredIntentPassRatio: 1, maxCorrections: 2, pronunciationFromTranscript: false },
  retry: { requiredAfterFeedback: true, maxAttemptsPerSession: 3 },
  review: { transferAfterDays: [1, 7, 30] },
  transferVariants: [
    { id: "transfer-day-1-hotel", dueAfterDays: 1, scenarioVi: "Bạn làm thủ tục nhận phòng khách sạn.", changedConditions: ["Nhân viên khách sạn", "Hỏi nơi ở và tên đặt phòng"], partnerLines: ["Welcome. What name is the reservation under?", "Which country are you visiting from?", "What do you do, and where do you live?", "Could you confirm the estimated time of your departure?"] },
    { id: "transfer-day-7-registration", dueAfterDays: 7, scenarioVi: "Bạn đăng ký tại một sự kiện nghề nghiệp.", changedConditions: ["Bối cảnh công việc", "Không có hộ chiếu hỗ trợ"], partnerLines: ["Hi. What is your name?", "Where are you from?", "What is your job, and which city do you live in?", "Could you describe your professional specialization?"] },
    { id: "transfer-day-30-clinic", dueAfterDays: 30, scenarioVi: "Bạn cung cấp thông tin cơ bản tại quầy tiếp nhận phòng khám.", changedConditions: ["Bối cảnh y tế", "Câu hỏi được diễn đạt khác"], partnerLines: ["Can I have your full name?", "What country are you from?", "What is your occupation and current address?", "Could you provide your emergency contact information?"] },
  ],
};
