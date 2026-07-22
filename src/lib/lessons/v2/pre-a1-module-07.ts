import type { LessonV2 } from "./schema";
import { PRE_A1_M07_COMMUNICATE } from "./pre-a1-module-07-communicate";
import { PRE_A1_M07_ENCOUNTER } from "./pre-a1-module-07-encounter";
import { PRE_A1_M07_RETAIN_TRANSFER } from "./pre-a1-module-07-retain-transfer";

export {
  PRE_A1_M07_COMMUNICATE,
  PRE_A1_M07_ENCOUNTER,
  PRE_A1_M07_RETAIN_TRANSFER,
};

export const PRE_A1_MODULE_07_LESSONS: [LessonV2, LessonV2, LessonV2] = [
  PRE_A1_M07_ENCOUNTER,
  PRE_A1_M07_COMMUNICATE,
  PRE_A1_M07_RETAIN_TRANSFER,
];
