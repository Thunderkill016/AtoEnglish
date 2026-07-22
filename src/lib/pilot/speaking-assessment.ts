export const SPEAKING_CRITERIA = [
  "taskCompletion",
  "comprehensibility",
  "targetChunks",
  "basicFluency",
] as const;

export type SpeakingCriterionId = (typeof SPEAKING_CRITERIA)[number];
export type SpeakingScore = 0 | 1 | 2 | 3;
export type SpeakingAssessmentStage = "baseline" | "final";

export interface SpeakingRepairCheck {
  utterance: string;
  delivery: "natural-brisk";
  waitSeconds: 5;
  showText: false;
  repeatOnlyAfterLearnerRequest: true;
}

export interface SpeakingPrompt {
  id: string;
  stage: SpeakingAssessmentStage;
  title: string;
  scenario: string;
  preparationSeconds: number;
  responseSeconds: number;
  learnerInstructions: readonly string[];
  followUpQuestions: readonly string[];
  repairCheck: SpeakingRepairCheck;
  requiredFunctions: readonly string[];
  assessorProtocol: readonly string[];
}

export interface SpeakingRubricCriterion {
  id: SpeakingCriterionId;
  label: string;
  description: string;
  anchors: Record<SpeakingScore, string>;
}

export type SpeakingScores = Record<SpeakingCriterionId, SpeakingScore>;

export interface SpeakingAssessmentResult {
  scores: SpeakingScores;
  total: number;
  maxTotal: number;
  percentage: number;
  meetsPilotOutcome: boolean;
}

export interface SpeakingAssessmentComparison {
  baseline: SpeakingAssessmentResult;
  final: SpeakingAssessmentResult;
  totalDelta: number;
  percentagePointDelta: number;
  improvedCriteria: SpeakingCriterionId[];
  improvedAtLeastOneCoreCriterion: boolean;
}

export const ASSESSMENT_MAX_SCORE = SPEAKING_CRITERIA.length * 3;

export const PILOT_REQUIRED_FUNCTIONS = [
  "introduce name and spell it clearly",
  "state role, company or study context",
  "describe one work responsibility",
  "answer five predictable follow-up questions",
  "ask for repetition or slower speech during the repair check",
] as const;

const REPAIR_CHECK_CONDITIONS = {
  delivery: "natural-brisk",
  waitSeconds: 5,
  showText: false,
  repeatOnlyAfterLearnerRequest: true,
} as const;

export const PILOT_SPEAKING_PROMPTS: Record<
  SpeakingAssessmentStage,
  SpeakingPrompt
> = {
  baseline: {
    id: "pilot-speaking-baseline-v1",
    stage: "baseline",
    title: "Lần đầu làm thủ tục tại công ty đối tác",
    scenario:
      "Bạn đến công ty đối tác để nhận thẻ khách. Nhân viên lễ tân chưa biết bạn và hỏi vài câu cơ bản trước khi cho bạn vào.",
    preparationSeconds: 30,
    responseSeconds: 90,
    learnerInstructions: [
      "Giới thiệu tên và đánh vần tên của bạn.",
      "Nói công việc, công ty hoặc nơi bạn đang học. Nếu chưa đi làm, hãy nói công việc bạn muốn làm.",
      "Nói một việc bạn thường làm hoặc muốn làm trong công việc.",
      "Trả lời các câu hỏi tiếp theo bằng tiếng Anh.",
      "Khi chưa nghe rõ, hãy yêu cầu người hỏi nhắc lại hoặc nói chậm hơn.",
    ],
    followUpQuestions: [
      "What is your name?",
      "How do you spell your name?",
      "What do you do?",
      "Where do you work or study?",
      "What do you do at work?",
    ],
    repairCheck: {
      utterance: "Please wait near meeting room fourteen after lunch.",
      ...REPAIR_CHECK_CONDITIONS,
    },
    requiredFunctions: PILOT_REQUIRED_FUNCTIONS,
    assessorProtocol: [
      "Không cho người học xem câu trả lời mẫu hoặc sửa câu trong lúc ghi âm.",
      "Cho 30 giây chuẩn bị và tối đa 90 giây trả lời chính.",
      "Hỏi ba câu đầu theo đúng thứ tự; không đổi từ hoặc giải thích trong lúc ghi âm.",
      "Sau câu thứ ba, đọc repair check đúng một lần với tốc độ tự nhiên nhưng hơi nhanh, không hiển thị câu chữ, rồi chờ tối đa năm giây.",
      "Chỉ lặp lại hoặc nói chậm repair check khi người học tự yêu cầu bằng tiếng Anh; không gợi ý câu yêu cầu.",
      "Tiếp tục hỏi câu thứ tư và thứ năm sau repair check, dù người học có dùng chiến lược sửa chữa hay không.",
      "Chấm bản ghi đầu tiên hoàn chỉnh; không chọn bản tốt nhất trong nhiều lần thử.",
    ],
  },
  final: {
    id: "pilot-speaking-final-v1",
    stage: "final",
    title: "Mở đầu cuộc gọi với đồng nghiệp mới",
    scenario:
      "Bạn tham gia một cuộc gọi ngắn với đồng nghiệp hoặc khách hàng mới. Họ chưa biết bạn và muốn hiểu bạn là ai, bạn làm gì và bạn phụ trách việc gì.",
    preparationSeconds: 30,
    responseSeconds: 90,
    learnerInstructions: [
      "Giới thiệu tên và đánh vần tên của bạn.",
      "Nói vai trò, công ty hoặc nhóm của bạn. Nếu chưa đi làm, hãy dùng một vai trò bạn muốn làm.",
      "Mô tả một trách nhiệm chính bằng một hoặc hai câu ngắn.",
      "Trả lời các câu hỏi tiếp theo bằng tiếng Anh.",
      "Khi chưa nghe rõ, hãy yêu cầu người hỏi nhắc lại hoặc nói chậm hơn.",
    ],
    followUpQuestions: [
      "Could you introduce yourself?",
      "Which company or team are you with?",
      "What is your role?",
      "What are you responsible for?",
      "What would you like help with today?",
    ],
    repairCheck: {
      utterance: "Please join the team meeting at three-thirty tomorrow.",
      ...REPAIR_CHECK_CONDITIONS,
    },
    requiredFunctions: PILOT_REQUIRED_FUNCTIONS,
    assessorProtocol: [
      "Không cho người học xem đề final trước ngày đánh giá và không cung cấp câu trả lời mẫu.",
      "Cho 30 giây chuẩn bị và tối đa 90 giây trả lời chính.",
      "Hỏi ba câu đầu theo đúng thứ tự; không sửa ngữ pháp hoặc phát âm trong lúc ghi âm.",
      "Sau câu thứ ba, đọc repair check đúng một lần với tốc độ tự nhiên nhưng hơi nhanh, không hiển thị câu chữ, rồi chờ tối đa năm giây.",
      "Chỉ lặp lại hoặc nói chậm repair check khi người học tự yêu cầu bằng tiếng Anh; không gợi ý câu yêu cầu.",
      "Tiếp tục hỏi câu thứ tư và thứ năm sau repair check, dù người học có dùng chiến lược sửa chữa hay không.",
      "Chấm bản ghi đầu tiên hoàn chỉnh bằng cùng rubric và điều kiện thu âm như baseline.",
    ],
  },
};

export const PILOT_SPEAKING_RUBRIC: readonly SpeakingRubricCriterion[] = [
  {
    id: "taskCompletion",
    label: "Hoàn thành nhiệm vụ",
    description:
      "Mức độ người học hoàn thành các chức năng giao tiếp được yêu cầu trong tình huống.",
    anchors: {
      0: "Không truyền đạt được thông tin cần thiết hoặc không thể bắt đầu nhiệm vụ.",
      1: "Chỉ cung cấp được một phần nhỏ như tên hoặc vài từ rời; cần nhắc và hỗ trợ liên tục.",
      2: "Giới thiệu được phần lớn thông tin và xử lý một số câu hỏi; còn thiếu một chức năng quan trọng.",
      3: "Giới thiệu, đánh vần tên, nêu vai trò/trách nhiệm, xử lý đủ câu hỏi và tự dùng chiến lược sửa chữa trong repair check.",
    },
  },
  {
    id: "comprehensibility",
    label: "Người nghe hiểu được",
    description:
      "Mức độ thông điệp có thể được hiểu. Không chấm mức độ giống giọng bản xứ.",
    anchors: {
      0: "Phần lớn thông điệp không thể hiểu, kể cả sau khi người nghe cố gắng xác nhận.",
      1: "Chỉ hiểu được một số từ hoặc cụm; thường xuyên phải yêu cầu lặp lại.",
      2: "Hiểu được ý chính; đôi lúc cần lặp lại vì phát âm, âm cuối hoặc trọng âm.",
      3: "Thông điệp nhìn chung rõ và ổn định; lỗi phát âm nhỏ không cản trở giao tiếp.",
    },
  },
  {
    id: "targetChunks",
    label: "Cụm từ mục tiêu",
    description:
      "Mức độ sử dụng được các cụm giới thiệu, công việc và yêu cầu hỗ trợ; chấp nhận cách diễn đạt tương đương.",
    anchors: {
      0: "Không sử dụng được cụm từ có chức năng phù hợp.",
      1: "Dùng được một hoặc hai cụm rời nhưng lỗi hoặc thiếu từ thường làm gián đoạn ý nghĩa.",
      2: "Dùng được nhiều cụm phù hợp; còn lỗi hình thức nhưng ý nghĩa chính vẫn rõ.",
      3: "Dùng các cụm giới thiệu, công việc và yêu cầu nhắc lại/nói chậm phù hợp, tương đối linh hoạt và đúng ngữ cảnh.",
    },
  },
  {
    id: "basicFluency",
    label: "Độ trôi chảy cơ bản",
    description:
      "Khả năng duy trì các cụm và câu ngắn với nhịp độ đủ để hoàn thành nhiệm vụ, không yêu cầu nói nhanh.",
    anchors: {
      0: "Không duy trì được câu trả lời có ý nghĩa.",
      1: "Nói chủ yếu từng từ với nhiều khoảng dừng dài; thường bỏ dở câu.",
      2: "Nói được các cụm hoặc câu ngắn nối tiếp nhau; khoảng dừng còn rõ nhưng không làm mất toàn bộ ý.",
      3: "Duy trì được phần giới thiệu khoảng 30–45 giây bằng các câu ngắn, có khoảng dừng tự nhiên và biết tự tiếp tục.",
    },
  },
] as const;

export function scoreSpeakingAssessment(
  scores: SpeakingScores,
): SpeakingAssessmentResult {
  for (const criterion of SPEAKING_CRITERIA) {
    const score = scores[criterion];

    if (!Number.isInteger(score) || score < 0 || score > 3) {
      throw new RangeError(
        `Invalid score for ${criterion}: expected an integer from 0 to 3.`,
      );
    }
  }

  const total = SPEAKING_CRITERIA.reduce(
    (sum, criterion) => sum + scores[criterion],
    0,
  );

  return {
    scores: { ...scores },
    total,
    maxTotal: ASSESSMENT_MAX_SCORE,
    percentage: Math.round((total / ASSESSMENT_MAX_SCORE) * 100),
    meetsPilotOutcome:
      scores.taskCompletion >= 2 && scores.comprehensibility >= 2,
  };
}

export function compareSpeakingAssessments(
  baselineScores: SpeakingScores,
  finalScores: SpeakingScores,
): SpeakingAssessmentComparison {
  const baseline = scoreSpeakingAssessment(baselineScores);
  const final = scoreSpeakingAssessment(finalScores);
  const improvedCriteria = SPEAKING_CRITERIA.filter(
    (criterion) => final.scores[criterion] > baseline.scores[criterion],
  );

  return {
    baseline,
    final,
    totalDelta: final.total - baseline.total,
    percentagePointDelta: final.percentage - baseline.percentage,
    improvedCriteria,
    improvedAtLeastOneCoreCriterion:
      final.scores.taskCompletion > baseline.scores.taskCompletion ||
      final.scores.comprehensibility > baseline.scores.comprehensibility,
  };
}
