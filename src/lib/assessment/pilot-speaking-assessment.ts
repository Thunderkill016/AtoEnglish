export const SPEAKING_RUBRIC_DIMENSIONS = [
  "taskCompletion",
  "comprehensibility",
  "targetChunks",
  "basicFluency",
] as const;

export type SpeakingRubricDimension =
  (typeof SPEAKING_RUBRIC_DIMENSIONS)[number];

export type SpeakingRubricScore = 0 | 1 | 2 | 3;

export interface SpeakingAssessmentPrompt {
  id: "baseline" | "final";
  title: string;
  learnerInstructionsVi: string[];
  scenario: string;
  requiredActions: string[];
  preparationSeconds: number;
  responseSeconds: number;
  allowedSupport: string[];
  prohibitedSupport: string[];
}

export interface SpeakingRubricLevel {
  score: SpeakingRubricScore;
  descriptor: string;
}

export interface SpeakingRubricCriterion {
  id: SpeakingRubricDimension;
  label: string;
  evidenceToNotice: string[];
  levels: readonly SpeakingRubricLevel[];
}

export interface SpeakingAssessmentScore {
  taskCompletion: SpeakingRubricScore;
  comprehensibility: SpeakingRubricScore;
  targetChunks: SpeakingRubricScore;
  basicFluency: SpeakingRubricScore;
}

export interface SpeakingAssessmentSummary {
  total: number;
  maximum: 12;
  percentage: number;
}

export const BASELINE_SPEAKING_PROMPT: SpeakingAssessmentPrompt = {
  id: "baseline",
  title: "Lần đầu gặp lễ tân tại công ty",
  learnerInstructionsVi: [
    "Bạn đến một công ty nước ngoài để gặp người phụ trách tuyển dụng.",
    "Hãy nói bằng tiếng Anh như thể bạn đang trả lời lễ tân.",
    "Không cần dùng câu hoàn hảo. Hãy nói những gì bạn có thể nói ngay lúc này.",
  ],
  scenario:
    "The receptionist asks: ‘Hello. What is your name, how do you spell it, and where are you from?’",
  requiredActions: [
    "say your name",
    "spell your Vietnamese name",
    "say where you are from",
    "close the exchange politely",
  ],
  preparationSeconds: 30,
  responseSeconds: 60,
  allowedSupport: [
    "the written scenario",
    "one replay of the receptionist prompt",
  ],
  prohibitedSupport: [
    "a model answer",
    "a sentence frame",
    "translation or grammar correction during the recording",
  ],
};

export const FINAL_SPEAKING_PROMPT: SpeakingAssessmentPrompt = {
  id: "final",
  title: "Ngày đầu gặp đồng nghiệp tại nơi làm việc",
  learnerInstructionsVi: [
    "Bạn gặp một đồng nghiệp nước ngoài trong ngày đầu đi làm.",
    "Hãy giới thiệu bản thân và công việc, sau đó xử lý một câu bạn chưa nghe rõ.",
    "Tình huống khác bài đầu vào để tránh học thuộc nguyên văn.",
  ],
  scenario:
    "A colleague says: ‘Hi, I’m Alex. Tell me about yourself and your work.’ Then the colleague speaks too quickly.",
  requiredActions: [
    "say your name and where you are from",
    "say your role, company or workplace, and one responsibility",
    "answer one basic follow-up question about your work",
    "ask the colleague to repeat or speak more slowly",
    "close the exchange politely",
  ],
  preparationSeconds: 30,
  responseSeconds: 90,
  allowedSupport: [
    "the written scenario",
    "one replay of the colleague prompt",
  ],
  prohibitedSupport: [
    "the baseline prompt",
    "a full model answer",
    "live correction during the recording",
  ],
};

export const SPEAKING_RUBRIC: readonly SpeakingRubricCriterion[] = [
  {
    id: "taskCompletion",
    label: "Hoàn thành nhiệm vụ",
    evidenceToNotice: [
      "required actions attempted",
      "meaning relevant to the scenario",
      "appropriate opening and closing",
    ],
    levels: [
      { score: 0, descriptor: "Không tạo được câu trả lời có thể đánh giá." },
      { score: 1, descriptor: "Chỉ hoàn thành một phần nhỏ; phần lớn hành động bắt buộc bị bỏ qua." },
      { score: 2, descriptor: "Hoàn thành phần lớn hành động bắt buộc nhưng còn thiếu hoặc cần nhiều suy đoán từ người nghe." },
      { score: 3, descriptor: "Hoàn thành đầy đủ các hành động bắt buộc và giữ đúng ngữ cảnh giao tiếp." },
    ],
  },
  {
    id: "comprehensibility",
    label: "Mức độ người nghe hiểu được",
    evidenceToNotice: [
      "key words are recognizable",
      "final sounds and word stress support meaning",
      "listener effort required",
    ],
    levels: [
      { score: 0, descriptor: "Hầu như không thể hiểu được thông điệp." },
      { score: 1, descriptor: "Chỉ hiểu được từ hoặc cụm rời rạc; người nghe phải đoán nhiều." },
      { score: 2, descriptor: "Hiểu được ý chính dù một số đoạn cần nghe lại hoặc suy đoán." },
      { score: 3, descriptor: "Thông điệp nhìn chung rõ; lỗi phát âm không cản trở nhiệm vụ." },
    ],
  },
  {
    id: "targetChunks",
    label: "Sử dụng cụm từ mục tiêu",
    evidenceToNotice: [
      "self-introduction chunks",
      "work-related chunks",
      "repair phrases used in context",
    ],
    levels: [
      { score: 0, descriptor: "Không sử dụng được cụm từ mục tiêu có ý nghĩa." },
      { score: 1, descriptor: "Sử dụng một cụm từ mục tiêu nhưng sai hoặc chưa đủ để truyền đạt." },
      { score: 2, descriptor: "Sử dụng một số cụm từ mục tiêu phù hợp, còn lỗi nhưng ý nghĩa vẫn rõ." },
      { score: 3, descriptor: "Sử dụng đủ các cụm từ cần thiết, đúng ngữ cảnh và có thể tái sử dụng." },
    ],
  },
  {
    id: "basicFluency",
    label: "Độ trôi chảy cơ bản",
    evidenceToNotice: [
      "ability to produce connected chunks",
      "pause length and frequency",
      "ability to continue after a breakdown",
    ],
    levels: [
      { score: 0, descriptor: "Không thể duy trì lời nói đủ để đánh giá." },
      { score: 1, descriptor: "Nói từng từ với nhiều khoảng dừng dài và thường xuyên bỏ cuộc." },
      { score: 2, descriptor: "Nói được các cụm ngắn; còn dừng nhưng có thể hoàn thành phần lớn nhiệm vụ." },
      { score: 3, descriptor: "Nói được chuỗi câu ngắn với nhịp tương đối ổn định và tự phục hồi khi vấp." },
    ],
  },
] as const;

export function summarizeSpeakingScore(
  score: SpeakingAssessmentScore,
): SpeakingAssessmentSummary {
  const values = SPEAKING_RUBRIC_DIMENSIONS.map((dimension) => score[dimension]);
  const total = values.reduce((sum, value) => sum + value, 0);

  return {
    total,
    maximum: 12,
    percentage: Math.round((total / 12) * 100),
  };
}

export function calculateSpeakingImprovement(
  baseline: SpeakingAssessmentScore,
  final: SpeakingAssessmentScore,
) {
  const baselineSummary = summarizeSpeakingScore(baseline);
  const finalSummary = summarizeSpeakingScore(final);

  return {
    baseline: baselineSummary,
    final: finalSummary,
    pointChange: finalSummary.total - baselineSummary.total,
    percentagePointChange:
      finalSummary.percentage - baselineSummary.percentage,
    improvedDimensions: SPEAKING_RUBRIC_DIMENSIONS.filter(
      (dimension) => final[dimension] > baseline[dimension],
    ),
  };
}
