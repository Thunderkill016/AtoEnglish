import type { CefrLevel } from "./schema";

export type PracticeEncounterKind =
  | "model_exposure"
  | "noticing"
  | "recognition"
  | "successful_retrieval"
  | "guided_use"
  | "independent_performance"
  | "delayed_recall"
  | "transfer_use";

export interface ExerciseDosageProfile {
  level: CefrLevel;
  controlledItemsPerCoreLesson: [number, number];
  practiceOpportunitiesPerMissionModule: [number, number];
  successfulRetrievalsPerCoreTarget: [number, number];
  minimumDistinctContextsPerCoreTarget: number;
  maximumImmediateRetrievalsPerTarget: number;
  requiredPerformanceAttempts: 2 | 3;
  delayedReviewDays: readonly number[];
  requiredEncounterKinds: readonly PracticeEncounterKind[];
  designNotesVi: readonly string[];
}

const CORE_ENCOUNTER_SEQUENCE: readonly PracticeEncounterKind[] = [
  "model_exposure",
  "noticing",
  "successful_retrieval",
  "guided_use",
  "independent_performance",
  "delayed_recall",
  "transfer_use",
];

/**
 * Exercise dosage is expressed as ranges and coverage requirements rather
 * than a universal magic number. One item can cover multiple targets, and one
 * target can reappear in multiple tasks and contexts.
 */
export const EXERCISE_DOSAGE_BY_LEVEL: Record<
  CefrLevel,
  ExerciseDosageProfile
> = {
  PRE_A1: {
    level: "PRE_A1",
    controlledItemsPerCoreLesson: [4, 7],
    practiceOpportunitiesPerMissionModule: [14, 20],
    successfulRetrievalsPerCoreTarget: [4, 6],
    minimumDistinctContextsPerCoreTarget: 2,
    maximumImmediateRetrievalsPerTarget: 3,
    requiredPerformanceAttempts: 2,
    delayedReviewDays: [1, 7],
    requiredEncounterKinds: CORE_ENCOUNTER_SEQUENCE,
    designNotesVi: [
      "Bài tập ngắn, trực quan và chỉ có một quyết định mỗi lượt.",
      "Ưu tiên nghe–chọn, ghép, chỉ, đọc từ khóa và nói cụm ngắn.",
      "Không dùng chuỗi câu hỏi ngữ pháp trừu tượng.",
    ],
  },
  A1: {
    level: "A1",
    controlledItemsPerCoreLesson: [5, 8],
    practiceOpportunitiesPerMissionModule: [20, 28],
    successfulRetrievalsPerCoreTarget: [5, 7],
    minimumDistinctContextsPerCoreTarget: 2,
    maximumImmediateRetrievalsPerTarget: 3,
    requiredPerformanceAttempts: 2,
    delayedReviewDays: [2, 7, 21],
    requiredEncounterKinds: CORE_ENCOUNTER_SEQUENCE,
    designNotesVi: [
      "Đi từ nhận biết sang tự nhớ câu ngắn và hoàn thành trao đổi 4–8 lượt.",
      "Ít nhất một bài nghe thông tin cụ thể và một câu tự tạo.",
      "Bài transfer đổi người, địa điểm, thời gian hoặc một chi tiết giao dịch.",
    ],
  },
  A2: {
    level: "A2",
    controlledItemsPerCoreLesson: [5, 9],
    practiceOpportunitiesPerMissionModule: [24, 34],
    successfulRetrievalsPerCoreTarget: [5, 8],
    minimumDistinctContextsPerCoreTarget: 3,
    maximumImmediateRetrievalsPerTarget: 3,
    requiredPerformanceAttempts: 2,
    delayedReviewDays: [3, 10, 30],
    requiredEncounterKinds: CORE_ENCOUNTER_SEQUENCE,
    designNotesVi: [
      "Kết hợp nhận biết, recall, nghe chi tiết, tạo chuỗi câu và xử lý một biến cố dự đoán được.",
      "Ít nhất một item yêu cầu kết nối thời gian, nguyên nhân, so sánh hoặc phương án.",
      "Transfer phải thay dữ kiện để ngăn đọc thuộc bài mẫu.",
    ],
  },
  B1: {
    level: "B1",
    controlledItemsPerCoreLesson: [5, 10],
    practiceOpportunitiesPerMissionModule: [28, 40],
    successfulRetrievalsPerCoreTarget: [5, 8],
    minimumDistinctContextsPerCoreTarget: 3,
    maximumImmediateRetrievalsPerTarget: 3,
    requiredPerformanceAttempts: 2,
    delayedReviewDays: [7, 21, 45],
    requiredEncounterKinds: CORE_ENCOUNTER_SEQUENCE,
    designNotesVi: [
      "Không tăng chủ yếu bằng câu trắc nghiệm; tăng bằng tóm tắt, giải thích, phản hồi và problem solving.",
      "Ít nhất hai bài tập constructed response hoặc discourse ordering trong mỗi module.",
      "Performance có câu hỏi tiếp nối, phản biện hoặc hiểu sai cần sửa.",
    ],
  },
  B2: {
    level: "B2",
    controlledItemsPerCoreLesson: [5, 10],
    practiceOpportunitiesPerMissionModule: [30, 44],
    successfulRetrievalsPerCoreTarget: [5, 8],
    minimumDistinctContextsPerCoreTarget: 4,
    maximumImmediateRetrievalsPerTarget: 3,
    requiredPerformanceAttempts: 2,
    delayedReviewDays: [7, 28, 60],
    requiredEncounterKinds: CORE_ENCOUNTER_SEQUENCE,
    designNotesVi: [
      "Bài tập tập trung vào lựa chọn discourse move, stance, bằng chứng, trade-off, reformulation và synthesis.",
      "Một bài tập tốt có thể đánh giá nhiều target; không tạo 40 câu nhỏ chỉ để đạt số lượng.",
      "Transfer thay nguồn, audience, constraint hoặc quan điểm đối lập.",
    ],
  },
};

export interface TargetEncounterRecord {
  targetId: string;
  kind: PracticeEncounterKind;
  contextId: string;
  successful: boolean;
  delayed: boolean;
}

export interface TargetDosageSnapshot {
  targetId: string;
  encounterKinds: PracticeEncounterKind[];
  successfulRetrievals: number;
  distinctContexts: number;
  hasDelayedRecall: boolean;
  hasTransferUse: boolean;
}

export function summarizeTargetDosage(
  targetId: string,
  records: TargetEncounterRecord[],
): TargetDosageSnapshot {
  const relevant = records.filter((record) => record.targetId === targetId);

  return {
    targetId,
    encounterKinds: [...new Set(relevant.map((record) => record.kind))],
    successfulRetrievals: relevant.filter(
      (record) => record.kind === "successful_retrieval" && record.successful,
    ).length,
    distinctContexts: new Set(relevant.map((record) => record.contextId)).size,
    hasDelayedRecall: relevant.some(
      (record) => record.kind === "delayed_recall" && record.delayed,
    ),
    hasTransferUse: relevant.some(
      (record) => record.kind === "transfer_use" && record.successful,
    ),
  };
}

export function isTargetDosageComplete(
  level: CefrLevel,
  snapshot: TargetDosageSnapshot,
): boolean {
  const profile = EXERCISE_DOSAGE_BY_LEVEL[level];
  const [minimumRetrievals] = profile.successfulRetrievalsPerCoreTarget;

  return (
    profile.requiredEncounterKinds.every((kind) =>
      snapshot.encounterKinds.includes(kind),
    ) &&
    snapshot.successfulRetrievals >= minimumRetrievals &&
    snapshot.distinctContexts >= profile.minimumDistinctContextsPerCoreTarget &&
    snapshot.hasDelayedRecall &&
    snapshot.hasTransferUse
  );
}
