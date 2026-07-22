import type { CefrLevel } from "./schema";

export type MissionLessonKind =
  | "encounter"
  | "retrieve"
  | "communicate"
  | "retain_transfer";

export interface LevelCurriculumVolume {
  level: CefrLevel;
  missionModuleCount: number;
  lessonsPerModule: number;
  checkpointCount: number;
  moduleLessonKinds: readonly MissionLessonKind[];
  rationaleVi: string;
}

/**
 * Minimum required curriculum volume for AtoEnglish V2.
 *
 * These are product design constraints, not official CEFR lesson counts.
 * CEFR is non-prescriptive and Cambridge guided-learning-hour estimates are
 * only broad planning guidance. Learners can require additional adaptive
 * review, remediation, extensive input and real-world use.
 */
export const LEVEL_CURRICULUM_VOLUME: Record<
  CefrLevel,
  LevelCurriculumVolume
> = {
  PRE_A1: {
    level: "PRE_A1",
    missionModuleCount: 8,
    lessonsPerModule: 3,
    checkpointCount: 2,
    moduleLessonKinds: ["encounter", "communicate", "retain_transfer"],
    rationaleVi:
      "Tám nhóm nhiệm vụ sinh tồn. Mỗi nhóm có bài gặp ngôn ngữ, bài dùng có hỗ trợ và bài nhớ/chuyển giao; checkpoint sau mỗi bốn nhóm.",
  },
  A1: {
    level: "A1",
    missionModuleCount: 12,
    lessonsPerModule: 4,
    checkpointCount: 3,
    moduleLessonKinds: [
      "encounter",
      "retrieve",
      "communicate",
      "retain_transfer",
    ],
    rationaleVi:
      "Mười hai nhóm nhiệm vụ quen thuộc. Tách rõ tiếp nhận, retrieval, giao tiếp và ghi nhớ/chuyển giao; checkpoint sau mỗi bốn nhóm.",
  },
  A2: {
    level: "A2",
    missionModuleCount: 12,
    lessonsPerModule: 4,
    checkpointCount: 3,
    moduleLessonKinds: [
      "encounter",
      "retrieve",
      "communicate",
      "retain_transfer",
    ],
    rationaleVi:
      "Mười hai nhóm nhiệm vụ có kể chuyện, kế hoạch, so sánh và giải quyết vấn đề. Không giữ thiết kế cũ chỉ có sáu unit A2.",
  },
  B1: {
    level: "B1",
    missionModuleCount: 16,
    lessonsPerModule: 4,
    checkpointCount: 4,
    moduleLessonKinds: [
      "encounter",
      "retrieve",
      "communicate",
      "retain_transfer",
    ],
    rationaleVi:
      "Mười sáu nhóm nhiệm vụ để phát triển diễn ngôn kết nối, giải thích, tương tác độc lập, mediation và giải quyết vấn đề nhiều bước.",
  },
  B2: {
    level: "B2",
    missionModuleCount: 16,
    lessonsPerModule: 4,
    checkpointCount: 4,
    moduleLessonKinds: [
      "encounter",
      "retrieve",
      "communicate",
      "retain_transfer",
    ],
    rationaleVi:
      "Mười sáu nhóm nhiệm vụ cho lập luận, stance, thương lượng, tổng hợp nguồn và điều chỉnh theo dữ kiện mới; không nhồi chủ đề vào một unit lớn.",
  },
};

export function calculateCoreLessons(level: CefrLevel): number {
  const volume = LEVEL_CURRICULUM_VOLUME[level];
  return volume.missionModuleCount * volume.lessonsPerModule;
}

export function calculateRequiredLessons(level: CefrLevel): number {
  const volume = LEVEL_CURRICULUM_VOLUME[level];
  return calculateCoreLessons(level) + volume.checkpointCount;
}

export const REQUIRED_LESSON_COUNT_BY_LEVEL: Record<CefrLevel, number> = {
  PRE_A1: calculateRequiredLessons("PRE_A1"),
  A1: calculateRequiredLessons("A1"),
  A2: calculateRequiredLessons("A2"),
  B1: calculateRequiredLessons("B1"),
  B2: calculateRequiredLessons("B2"),
};

export const TOTAL_REQUIRED_LESSONS = Object.values(
  REQUIRED_LESSON_COUNT_BY_LEVEL,
).reduce((total, count) => total + count, 0);

export interface LearnerLessonLoad {
  requiredLessons: number;
  adaptiveReviewLessons: number;
  totalAssignedLessons: number;
}

/**
 * Adaptive review is deliberately outside the fixed 264-lesson curriculum.
 * A learner receives extra review only for targets that are not yet retained.
 */
export function calculateLearnerLessonLoad(
  level: CefrLevel,
  adaptiveReviewLessons: number,
): LearnerLessonLoad {
  const requiredLessons = calculateRequiredLessons(level);
  const safeAdaptiveCount = Math.max(0, Math.floor(adaptiveReviewLessons));

  return {
    requiredLessons,
    adaptiveReviewLessons: safeAdaptiveCount,
    totalAssignedLessons: requiredLessons + safeAdaptiveCount,
  };
}
