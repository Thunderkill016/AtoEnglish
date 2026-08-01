import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export const GOLD_MISSION_06: MissionSpecV1 = {
  schemaVersion: 1,
  id: "mission-talk-about-family",
  lessonId: "unit-a0-6",
  titleVi: "Giới thiệu gia đình qua một bức ảnh",
  canDoVi:
    "Người học có thể giới thiệu các thành viên trong gia đình, dùng he/she/they và nói một thông tin đơn giản về từng người.",
  estimatedMinutes: 15,
  scenarioVi:
    "Một đồng nghiệp nhìn thấy ảnh gia đình trên điện thoại và hỏi bạn về những người trong ảnh.",
  learnerRoleVi: "Người đang giới thiệu ảnh gia đình của mình.",
  partnerName: "Sara",
  partnerRoleVi: "Đồng nghiệp tò mò về gia đình bạn.",
  targetChunks: [
    { id: "family-photo", english: "This is my family.", vietnamese: "Đây là gia đình tôi.", useWhenVi: "Mở đầu khi cho người khác xem ảnh." },
    { id: "mother", english: "This is my mother.", vietnamese: "Đây là mẹ tôi.", useWhenVi: "Giới thiệu một người thân nữ." },
    { id: "father", english: "This is my father.", vietnamese: "Đây là bố tôi.", useWhenVi: "Giới thiệu một người thân nam." },
    { id: "she-job", english: "She is a teacher.", vietnamese: "Bà ấy là giáo viên.", useWhenVi: "Nói một thông tin về người nữ." },
    { id: "he-job", english: "He is a doctor.", vietnamese: "Ông ấy là bác sĩ.", useWhenVi: "Nói một thông tin về người nam." },
    { id: "they-live", english: "They live in Hanoi.", vietnamese: "Họ sống ở Hà Nội.", useWhenVi: "Nói về hai người trở lên." },
    { id: "siblings", english: "I have one older brother.", vietnamese: "Tôi có một anh trai.", useWhenVi: "Trả lời câu hỏi về anh chị em." },
    { id: "ask-family", english: "Do you have any brothers or sisters?", vietnamese: "Bạn có anh chị em không?", useWhenVi: "Hỏi lại người đối diện về gia đình." },
  ],
  intents: [
    { id: "introduce_family", descriptionVi: "Mở đầu và giới thiệu ảnh gia đình.", required: true, interactional: false, examples: ["This is my family."], matchers: ["\\bthis is my family\\b", "\\bthis is my family photo\\b"] },
    { id: "describe_male_relative", descriptionVi: "Giới thiệu và mô tả một người thân nam bằng he.", required: true, interactional: false, examples: ["This is my father. He is a doctor."], matchers: ["\\bthis is my (?:father|brother|husband|son|grandfather)\\b.*\\bhe (?:is|works|lives)\\b", "\\bhe is (?:a|an)\\s+[a-z]+"] },
    { id: "describe_female_relative", descriptionVi: "Giới thiệu và mô tả một người thân nữ bằng she.", required: true, interactional: false, examples: ["This is my mother. She is a teacher."], matchers: ["\\bthis is my (?:mother|sister|wife|daughter|grandmother)\\b.*\\bshe (?:is|works|lives)\\b", "\\bshe is (?:a|an)\\s+[a-z]+"] },
    { id: "describe_plural_family", descriptionVi: "Nói một thông tin về nhiều người bằng they.", required: true, interactional: false, examples: ["They live in Hanoi."], matchers: ["\\bthey (?:are|live|work|like|have)\\b"] },
    { id: "reciprocate_family_question", descriptionVi: "Hỏi lại người đối diện về anh chị em.", required: true, interactional: true, examples: ["Do you have any brothers or sisters?"], matchers: ["\\bdo you have any brothers or sisters\\b", "\\bdo you have (?:a|any) (?:brother|sister|siblings)\\b"] },
    { id: "state_siblings", descriptionVi: "Nói số lượng anh chị em.", required: false, interactional: false, examples: ["I have one older brother."], matchers: ["\\bi have (?:one|two|three|[0-9]+|an?) (?:older |younger )?(?:brother|sister|brothers|sisters|siblings)\\b"] },
  ],
  feedbackRules: [
    { code: "wrong_gender_pronoun_mother", pattern: "\\bmy mother\\b.*\\bhe is\\b", suggestion: "This is my mother. She is a teacher.", explanationVi: "Dùng 'she' cho mẹ, chị/em gái và người nữ." },
    { code: "wrong_gender_pronoun_father", pattern: "\\bmy father\\b.*\\bshe is\\b", suggestion: "This is my father. He is a doctor.", explanationVi: "Dùng 'he' cho bố, anh/em trai và người nam." },
    { code: "missing_be_family", pattern: "\\b(?:he|she) (?:a|an) (?:teacher|doctor|engineer|student|manager)\\b", suggestion: "She is a teacher.", explanationVi: "Cần động từ 'is' sau he/she." },
  ],
  roleplayTurns: [
    { id: "family", partnerLine: "Is that your family in the photo?", partnerLineVi: "Đồng nghiệp hỏi về bức ảnh.", expectedIntentIds: ["introduce_family"], hintVi: "Mở đầu bằng This is my family." },
    { id: "male", partnerLine: "Who is the man on the left?", partnerLineVi: "Đồng nghiệp hỏi một người nam.", expectedIntentIds: ["describe_male_relative"], hintVi: "Giới thiệu người đó rồi dùng He is..." },
    { id: "female", partnerLine: "And who is the woman next to him?", partnerLineVi: "Đồng nghiệp hỏi một người nữ.", expectedIntentIds: ["describe_female_relative", "describe_plural_family"], hintVi: "Giới thiệu bằng This is my...; dùng She is...; có thể nói thêm They..." },
    { id: "question", partnerLine: "I have two sisters.", partnerLineVi: "Đồng nghiệp chia sẻ về gia đình họ.", expectedIntentIds: ["reciprocate_family_question", "state_siblings"], hintVi: "Hỏi lại Do you have any brothers or sisters? hoặc nói về anh chị em của bạn." },
  ],
  checkpoint: {
    passThreshold: 4,
    questions: [
      { id: "family", questionVi: "Bạn mở đầu khi cho xem ảnh gia đình thế nào?", options: ["This is my family.", "This my family is.", "Family this me.", "These is family."], answer: "This is my family.", explanationVi: "Dùng 'This is...' để giới thiệu.", evidenceIntentIds: ["introduce_family"] },
      { id: "male", questionVi: "Câu nào đúng khi nói về bố?", options: ["This is my father. He is a doctor.", "This is my father. She is a doctor.", "This my father. He doctor.", "Father is he my."], answer: "This is my father. He is a doctor.", explanationVi: "Dùng he cho người nam và cần động từ is.", evidenceIntentIds: ["describe_male_relative"] },
      { id: "female", questionVi: "Câu nào đúng khi nói về mẹ?", options: ["This is my mother. She is a teacher.", "This is my mother. He is a teacher.", "Mother she teacher.", "This mother are."], answer: "This is my mother. She is a teacher.", explanationVi: "Dùng she cho người nữ.", evidenceIntentIds: ["describe_female_relative"] },
      { id: "plural", questionVi: "Bạn nói bố mẹ sống ở Hà Nội thế nào?", options: ["They live in Hanoi.", "He live in Hanoi.", "They lives Hanoi.", "Them is Hanoi."], answer: "They live in Hanoi.", explanationVi: "Dùng they cho nhiều người và động từ nguyên mẫu live.", evidenceIntentIds: ["describe_plural_family"] },
      { id: "question", questionVi: "Bạn hỏi người khác có anh chị em không thế nào?", options: ["Do you have any brothers or sisters?", "Are you have sister?", "You brothers how many?", "Have sister you?"], answer: "Do you have any brothers or sisters?", explanationVi: "Đây là cách hỏi tự nhiên và lịch sự.", evidenceIntentIds: ["reciprocate_family_question"] },
    ],
  },
  evaluation: { requiredIntentPassRatio: 1, maxCorrections: 2, pronunciationFromTranscript: false },
  retry: { requiredAfterFeedback: true, maxAttemptsPerSession: 3 },
  review: { transferAfterDays: [1, 7, 30] },
  transferVariants: [
    { id: "transfer-day-1-friend", dueAfterDays: 1, scenarioVi: "Bạn giới thiệu ảnh gia đình cho một người bạn mới.", changedConditions: ["Người nghe thân mật hơn", "Ảnh có nhiều người"], partnerLines: ["Is this your family photo?", "Who is the man standing at the back?", "Who is the woman next to him, and where do they live?", "I have one brother. What about you?"] },
    { id: "transfer-day-7-video-call", dueAfterDays: 7, scenarioVi: "Bạn giới thiệu người thân trong một cuộc gọi video.", changedConditions: ["Người thân xuất hiện trực tiếp", "Phải chuyển nhanh giữa he/she/they"], partnerLines: ["Are those your family members behind you?", "Who is the man waving?", "Who is the woman beside him, and what do they do?", "Do you have any brothers or sisters?"] },
    { id: "transfer-day-30-host-family", dueAfterDays: 30, scenarioVi: "Bạn nói về gia đình khi gặp một gia đình chủ nhà ở nước ngoài.", changedConditions: ["Bối cảnh mới hoàn toàn", "Người nghe hỏi bằng cách khác"], partnerLines: ["Tell me a little about your family.", "What does your father or brother do?", "And what about your mother or sister? Where do they live?", "How many brothers or sisters do you have?"] },
  ],
};
