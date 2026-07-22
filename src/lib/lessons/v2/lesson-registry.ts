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
import {
  PRE_A1_M04_COMMUNICATE,
  PRE_A1_M04_ENCOUNTER,
  PRE_A1_M04_RETAIN_TRANSFER,
} from "./pre-a1-module-04";
import { PRE_A1_CHECKPOINT_01 } from "./pre-a1-checkpoint-01";
import type { ReviewUnlockRule } from "./review-unlock";
import type { LessonV2 } from "./schema";

export type LessonSessionKind =
  | "encounter"
  | "communicate"
  | "retain_transfer"
  | "checkpoint";

export type LessonSectionKind = "module" | "checkpoint";

export interface RegisteredLessonV2 {
  lesson: LessonV2;
  moduleId: string;
  sessionKind: LessonSessionKind;
  orderInModule: number;
  levelOrder: number;
  unlockRule?: ReviewUnlockRule;
}

export interface LessonSectionV2 {
  id: string;
  order: number;
  kind: LessonSectionKind;
  labelVi: string;
  titleVi: string;
  descriptionVi: string;
}

export const LESSON_V2_SECTIONS: LessonSectionV2[] = [
  {
    id: "pre-a1-m01",
    order: 1,
    kind: "module",
    labelVi: "Module 1",
    titleVi: "Nói và đánh vần tên",
    descriptionVi:
      "Giới thiệu tên, đánh vần và dùng câu cứu nguy khi người khác nói quá nhanh.",
  },
  {
    id: "pre-a1-m02",
    order: 2,
    kind: "module",
    labelVi: "Module 2",
    titleVi: "Số, giá và thanh toán",
    descriptionVi:
      "Hỏi giá, nghe số tiền và chọn tiền mặt hoặc thẻ trong giao dịch đơn giản.",
  },
  {
    id: "pre-a1-m03",
    order: 3,
    kind: "module",
    labelVi: "Module 3",
    titleVi: "Nhận diện và mô tả đồ vật",
    descriptionVi:
      "Hỏi tên, nói màu và xác nhận đúng đồ vật trong tình huống đời sống.",
  },
  {
    id: "pre-a1-m04",
    order: 4,
    kind: "module",
    labelVi: "Module 4",
    titleVi: "Chào hỏi và kết thúc trao đổi",
    descriptionVi:
      "Chào, hỏi thăm trạng thái, hỏi lại và kết thúc một cuộc gặp rất ngắn.",
  },
  {
    id: "pre-a1-checkpoint-01",
    order: 5,
    kind: "checkpoint",
    labelVi: "Checkpoint 1",
    titleVi: "Tích hợp bốn module đầu",
    descriptionVi:
      "Hoàn thành một giao dịch xã giao có chào hỏi, tên, đồ vật, màu, giá, thanh toán, repair và lời kết.",
  },
];

export const LESSON_V2_MODULES = LESSON_V2_SECTIONS.filter(
  (section) => section.kind === "module",
);

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

function registerCheckpoint(
  sectionId: string,
  levelOrder: number,
  lesson: LessonV2,
): RegisteredLessonV2 {
  return {
    lesson,
    moduleId: sectionId,
    sessionKind: "checkpoint",
    orderInModule: 1,
    levelOrder,
  };
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
  ...registerModule("pre-a1-m04", 10, [
    PRE_A1_M04_ENCOUNTER,
    PRE_A1_M04_COMMUNICATE,
    PRE_A1_M04_RETAIN_TRANSFER,
  ]),
  registerCheckpoint("pre-a1-checkpoint-01", 13, PRE_A1_CHECKPOINT_01),
];

const BY_ID = new Map(
  LESSON_V2_REGISTRY.map((entry) => [entry.lesson.id, entry]),
);

export function getRegisteredLessonV2(
  lessonId: string,
): RegisteredLessonV2 | undefined {
  return BY_ID.get(lessonId);
}

export function getLessonsForSectionV2(
  sectionId: string,
): RegisteredLessonV2[] {
  return LESSON_V2_REGISTRY.filter(
    (entry) => entry.moduleId === sectionId,
  ).sort((a, b) => a.orderInModule - b.orderInModule);
}

export const getLessonsForModuleV2 = getLessonsForSectionV2;

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
