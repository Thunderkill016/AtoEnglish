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
