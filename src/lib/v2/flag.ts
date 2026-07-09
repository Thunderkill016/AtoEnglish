/**
 * Curriculum / product v2 feature flag.
 * Default OFF so production keeps v1 until cutover (docs/V2_PRODUCT.md).
 */
export function isCurriculumV2(): boolean {
  const raw = process.env.NEXT_PUBLIC_CURRICULUM_V2;
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** Prefer v2 learn routes when flag on */
export function learnPathForLesson(lessonId: string): string {
  return `/learn/v2/${lessonId}`;
}
