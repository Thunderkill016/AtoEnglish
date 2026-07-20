/**
 * Curriculum / product v2 feature flag.
 * Default ON — v2 is the primary product (docs/product/VISION_VN.md).
 * Set NEXT_PUBLIC_CURRICULUM_V2=0 to fall back to legacy v1.
 */
export function isCurriculumV2(): boolean {
  const raw = process.env.NEXT_PUBLIC_CURRICULUM_V2;
  if (!raw) return true;
  const v = raw.trim().toLowerCase();
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/** Prefer v2 learn routes when flag on */
export function learnPathForLesson(lessonId: string): string {
  return `/learn/v2/${lessonId}`;
}
