import {
  PRE_A1_M01_COMMUNICATE,
  PRE_A1_M01_ENCOUNTER,
  PRE_A1_M01_RETAIN_TRANSFER,
} from "./pre-a1-module-01";
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
}

export const LESSON_V2_REGISTRY: RegisteredLessonV2[] = [
  {
    lesson: PRE_A1_M01_ENCOUNTER,
    moduleId: "pre-a1-m01",
    sessionKind: "encounter",
    orderInModule: 1,
    levelOrder: 1,
  },
  {
    lesson: PRE_A1_M01_COMMUNICATE,
    moduleId: "pre-a1-m01",
    sessionKind: "communicate",
    orderInModule: 2,
    levelOrder: 2,
  },
  {
    lesson: PRE_A1_M01_RETAIN_TRANSFER,
    moduleId: "pre-a1-m01",
    sessionKind: "retain_transfer",
    orderInModule: 3,
    levelOrder: 3,
  },
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

  return getLessonsForModuleV2(current.moduleId).find(
    (entry) => entry.orderInModule === current.orderInModule + 1,
  );
}
