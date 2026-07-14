import type { LessonSpec } from "@/lib/v2/lesson-spec";
import { safeParseLessonSpec } from "@/lib/v2/lesson-spec";
import { CORE_PATH_PLAN } from "@/lib/v2/path";
import { lessonA001 } from "@/lib/v2/lessons/l-a0-01";
import { lessonA002 } from "@/lib/v2/lessons/l-a0-02";
import { lessonA003 } from "@/lib/v2/lessons/l-a0-03";
import { lessonA004 } from "@/lib/v2/lessons/l-a0-04";
import { lessonA005 } from "@/lib/v2/lessons/l-a0-05";
import { lessonA006 } from "@/lib/v2/lessons/l-a0-06";
import { lessonA007 } from "@/lib/v2/lessons/l-a0-07";
import { lessonA008 } from "@/lib/v2/lessons/l-a0-08";
import { lessonA101 } from "@/lib/v2/lessons/l-a1-01";
import { lessonA102 } from "@/lib/v2/lessons/l-a1-02";
import { lessonA103 } from "@/lib/v2/lessons/l-a1-03";
import { lessonA104 } from "@/lib/v2/lessons/l-a1-04";
import { lessonA105 } from "@/lib/v2/lessons/l-a1-05";
import { lessonA106 } from "@/lib/v2/lessons/l-a1-06";
import { lessonA107 } from "@/lib/v2/lessons/l-a1-07";
import { lessonA108 } from "@/lib/v2/lessons/l-a1-08";
import { lessonA109 } from "@/lib/v2/lessons/l-a1-09";
import { lessonA110 } from "@/lib/v2/lessons/l-a1-10";
import { lessonA111 } from "@/lib/v2/lessons/l-a1-11";
import { lessonA112 } from "@/lib/v2/lessons/l-a1-12";
import { lessonA201 } from "@/lib/v2/lessons/l-a2-01";
import { lessonA202 } from "@/lib/v2/lessons/l-a2-02";
import { lessonA203 } from "@/lib/v2/lessons/l-a2-03";
import { lessonA204 } from "@/lib/v2/lessons/l-a2-04";
import { lessonA205 } from "@/lib/v2/lessons/l-a2-05";
import { lessonB101 } from "@/lib/v2/lessons/l-b1-01";

/** Registry of authored v2 lessons (grows over time). */
const LESSON_MODULES: Record<string, LessonSpec> = {
  "l-a0-01": lessonA001,
  "l-a0-02": lessonA002,
  "l-a0-03": lessonA003,
  "l-a0-04": lessonA004,
  "l-a0-05": lessonA005,
  "l-a0-06": lessonA006,
  "l-a0-07": lessonA007,
  "l-a0-08": lessonA008,
  "l-a1-01": lessonA101,
  "l-a1-02": lessonA102,
  "l-a1-03": lessonA103,
  "l-a1-04": lessonA104,
  "l-a1-05": lessonA105,
  "l-a1-06": lessonA106,
  "l-a1-07": lessonA107,
  "l-a1-08": lessonA108,
  "l-a1-09": lessonA109,
  "l-a1-10": lessonA110,
  "l-a1-11": lessonA111,
  "l-a1-12": lessonA112,
  "l-a2-01": lessonA201,
  "l-a2-02": lessonA202,
  "l-a2-03": lessonA203,
  "l-a2-04": lessonA204,
  "l-a2-05": lessonA205,
  "l-b1-01": lessonB101,
};

export function getLessonV2(lessonId: string): LessonSpec | null {
  const raw = LESSON_MODULES[lessonId];
  if (!raw) return null;
  const parsed = safeParseLessonSpec(raw);
  if (!parsed.success) return null;
  return parsed.data;
}

export function listAuthoredLessonIds(): string[] {
  return Object.keys(LESSON_MODULES);
}

export function getAllAuthoredLessons(): LessonSpec[] {
  return listAuthoredLessonIds()
    .map((id) => getLessonV2(id))
    .filter((l): l is LessonSpec => l !== null);
}

/** Next playable lesson on core path (first not completed that has content). */
export function getNextPlayableLessonId(completedIds: Iterable<string>): string | null {
  const done = new Set(completedIds);
  for (const meta of CORE_PATH_PLAN) {
    if (done.has(meta.id)) continue;
    if (getLessonV2(meta.id)) return meta.id;
  }
  // All authored completed — return first authored if any incomplete plan holes
  for (const id of listAuthoredLessonIds()) {
    if (!done.has(id)) return id;
  }
  return null;
}

export function getContinueLessonId(completedIds: Iterable<string>): string {
  return getNextPlayableLessonId(completedIds) ?? "l-a0-01";
}
