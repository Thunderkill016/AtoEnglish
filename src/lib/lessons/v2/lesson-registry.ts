import {
  PRE_A1_M01_COMMUNICATE,
  PRE_A1_M01_ENCOUNTER,
  PRE_A1_M01_RETAIN_TRANSFER,
} from "./pre-a1-module-01";
import {
  PRE_A1_M02_COMMUNICATE,
  PRE_A1_M02_ENCOUNTER,
  PRE_A1_M02_RETAIN_TRANSFER,
} from "./pre-a1-module-02";
import {
  PRE_A1_M03_COMMUNICATE,
  PRE_A1_M03_ENCOUNTER,
  PRE_A1_M03_RETAIN_TRANSFER,
} from "./pre-a1-module-03";
import type { ReviewUnlockRule } from "./review-unlock";
import type { LessonV2 } from "./schema";

export type LessonSessionKind =
  | "encounter"
  | "communicate"
  | "retain_transfer";

export interface RegisteredLessonV2 {
  lesson: LessonV2;
  moduleId: string;
  sessionKind: LessonSessionKind;
  orderInModule: number;
  levelOrder: number;
  unlockRule?: ReviewUnlockRule;
}

export interface LessonModuleV2 {
  id: string;
  order: number;
  titleVi: string;
  descriptionVi: string;
}

export const LESSON_V2_MODULES: LessonModuleV2[] = [
  {
    id: "pre-a1-m01",
    order: 1,
    titleVi: "Nói và đánh vần tên",
    descriptionVi:
      "Giới thiệu tên, đánh vần và dùng câu cứu nguy khi người khác nói quá nhanh.",
  },
  {
    id: "pre-a1-m02",
    order: 2,
    titleVi: "Số, giá và thanh toán",
    descriptionVi:
      "Hỏi giá, nghe số tiền và chọn tiền mặt hoặc thẻ trong giao dịch đơn giản.",
  },
  {
    id: "pre-a1-m03",
    order: 3,
    titleVi: "Nhận diện và mô tả đồ vật",
    descriptionVi:
      "Hỏi tên, nói màu và xác nhận đúng đồ vật trong tình huống đời sống.",
  },
];

const SESSION_KINDS = [
  "encounter",
  "communicate",
  "retain_transfer",
] as const satisfies readonly LessonSessionKind[];

function registerModule(
  moduleId: string,
  firstLevelOrder: number,
  lessons: [LessonV2, LessonV2, LessonV2],
): RegisteredLessonV2[] {
  return lessons.map((lesson, index) => {
    const sessionKind = SESSION_KINDS[index];
    if (!sessionKind) {
      throw new Error(
        `Missing session kind for module ${moduleId} at index ${index}`,
      );
    }

    return {
      lesson,
      moduleId,
      sessionKind,
      orderInModule: index + 1,
      levelOrder: firstLevelOrder + index,
      unlockRule:
        index === 2
          ? { prerequisiteLessonId: lessons[1].id, delayHours: 24 }
          : undefined,
    };
  });
}

export const LESSON_V2_REGISTRY: RegisteredLessonV2[] = [
  ...registerModule("pre-a1-m01", 1, [
    PRE_A1_M01_ENCOUNTER,
    PRE_A1_M01_COMMUNICATE,
    PRE_A1_M01_RETAIN_TRANSFER,
  ]),
  ...registerModule("pre-a1-m02", 4, [
    PRE_A1_M02_ENCOUNTER,
    PRE_A1_M02_COMMUNICATE,
    PRE_A1_M02_RETAIN_TRANSFER,
  ]),
  ...registerModule("pre-a1-m03", 7, [
    PRE_A1_M03_ENCOUNTER,
    PRE_A1_M03_COMMUNICATE,
    PRE_A1_M03_RETAIN_TRANSFER,
  ]),
];

const BY_ID = new Map(
  LESSON_V2_REGISTRY.map((entry) => [entry.lesson.id, entry]),
);

export function getRegisteredLessonV2(
  lessonId: string,
): RegisteredLessonV2 | undefined {
  return BY_ID.get(lessonId);
}

export function getLessonsForModuleV2(
  moduleId: string,
): RegisteredLessonV2[] {
  return LESSON_V2_REGISTRY.filter(
    (entry) => entry.moduleId === moduleId,
  ).sort((a, b) => a.orderInModule - b.orderInModule);
}

export function getNextLessonV2(
  lessonId: string,
): RegisteredLessonV2 | undefined {
  const current = getRegisteredLessonV2(lessonId);
  if (!current) return undefined;

  return LESSON_V2_REGISTRY.find(
    (entry) => entry.levelOrder === current.levelOrder + 1,
  );
}

export function getReviewDelayAfterLessonV2(
  lessonId: string,
): number | undefined {
  return LESSON_V2_REGISTRY.find(
    (entry) => entry.unlockRule?.prerequisiteLessonId === lessonId,
  )?.unlockRule?.delayHours;
}
