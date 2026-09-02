import { greetCloseLessonV1 } from "./bootstrap-lessons.v1";
import { firstMeetingLessonV1, type LessonContract } from "./lesson-contract";

export const nepLessonRegistryV1: readonly LessonContract[] = [
  greetCloseLessonV1,
  firstMeetingLessonV1,
];

export function resolveNếpLessonFromRegistry(lessonId: string, lessonVersion: number) {
  return nepLessonRegistryV1.find(
    (lesson) => lesson.id === lessonId && lesson.version === lessonVersion,
  ) ?? null;
}
