export interface ReviewUnlockRule {
  prerequisiteLessonId: string;
  delayHours: number;
}

export type LessonAvailability =
  | { status: "available" }
  | {
      status: "locked";
      reason: "prerequisite" | "delay";
      prerequisiteLessonId: string;
      unlockAt?: string;
    };

export function calculateReviewUnlockAt(
  completedAt: string,
  delayHours: number,
): string {
  const completedTimestamp = Date.parse(completedAt);
  if (Number.isNaN(completedTimestamp)) {
    throw new Error("completedAt must be a valid ISO timestamp");
  }

  const safeDelayHours = Math.max(0, delayHours);
  return new Date(
    completedTimestamp + safeDelayHours * 60 * 60 * 1000,
  ).toISOString();
}

export function earliestCompletionTimestamp(
  timestamps: Array<string | undefined>,
): string | undefined {
  return timestamps
    .filter((value): value is string => Boolean(value))
    .filter((value) => !Number.isNaN(Date.parse(value)))
    .sort((a, b) => Date.parse(a) - Date.parse(b))[0];
}

export function evaluateReviewAvailability(
  rule: ReviewUnlockRule | undefined,
  prerequisiteCompletedAt: string | undefined,
  now = new Date(),
): LessonAvailability {
  if (!rule) return { status: "available" };

  if (!prerequisiteCompletedAt) {
    return {
      status: "locked",
      reason: "prerequisite",
      prerequisiteLessonId: rule.prerequisiteLessonId,
    };
  }

  const unlockAt = calculateReviewUnlockAt(
    prerequisiteCompletedAt,
    rule.delayHours,
  );

  if (now.getTime() < Date.parse(unlockAt)) {
    return {
      status: "locked",
      reason: "delay",
      prerequisiteLessonId: rule.prerequisiteLessonId,
      unlockAt,
    };
  }

  return { status: "available" };
}
