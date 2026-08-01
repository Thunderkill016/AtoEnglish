import type { MissionSpecV1 } from "@/lib/missions/mission-spec";

export type LearningSessionMode = "standard" | "busy";

export interface LearningSessionBudget {
  mode: LearningSessionMode;
  titleVi: string;
  descriptionVi: string;
  minimumMinutes: number;
  maximumMinutes: number;
  newCanDoLimit: number;
  targetChunkLimit: number;
  feedbackLimit: number;
  completesLesson: boolean;
}

export interface ResolvedLearningSessionBudget extends LearningSessionBudget {
  targetChunkCount: number;
  feedbackCount: number;
}

export const LEARNING_SESSION_BUDGETS: Record<
  LearningSessionMode,
  LearningSessionBudget
> = {
  standard: {
    mode: "standard",
    titleVi: "Phiên chuẩn",
    descriptionVi:
      "Học một nhiệm vụ mới, luyện đến lúc tự làm được và sửa lại sau phản hồi.",
    minimumMinutes: 12,
    maximumMinutes: 15,
    newCanDoLimit: 1,
    targetChunkLimit: 6,
    feedbackLimit: 2,
    completesLesson: true,
  },
  busy: {
    mode: "busy",
    titleVi: "Ngày bận",
    descriptionVi:
      "Ôn nhanh nội dung cốt lõi, không mở kiến thức mới và không đánh dấu hoàn thành bài.",
    minimumMinutes: 3,
    maximumMinutes: 5,
    newCanDoLimit: 0,
    targetChunkLimit: 3,
    feedbackLimit: 0,
    completesLesson: false,
  },
};

export function resolveLearningSessionBudget(
  mission: MissionSpecV1,
  mode: LearningSessionMode,
): ResolvedLearningSessionBudget {
  const budget = LEARNING_SESSION_BUDGETS[mode];

  return {
    ...budget,
    targetChunkCount: Math.min(
      mission.targetChunks.length,
      budget.targetChunkLimit,
    ),
    feedbackCount:
      mode === "standard"
        ? Math.min(mission.evaluation.maxCorrections, budget.feedbackLimit)
        : 0,
  };
}

export function formatLearningSessionDuration(
  budget: Pick<LearningSessionBudget, "minimumMinutes" | "maximumMinutes">,
): string {
  return `${budget.minimumMinutes}–${budget.maximumMinutes} phút`;
}
