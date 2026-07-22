import { EXERCISE_DOSAGE_BY_LEVEL } from "./exercise-dosage";
import type { LessonV2 } from "./schema";
import {
  validateLessonV2,
  type LessonV2Violation,
} from "./validate";

export function validateLessonExerciseDosage(
  lesson: LessonV2,
): LessonV2Violation[] {
  const violations: LessonV2Violation[] = [];
  const add = (path: string, message: string) =>
    violations.push({ path, message });
  const profile = EXERCISE_DOSAGE_BY_LEVEL[lesson.level];
  const practiceSteps = lesson.steps.filter((step) => step.kind === "practice");
  const controlledItemCount = practiceSteps.reduce(
    (total, step) => total + step.exercises.length,
    0,
  );
  const [minimumItems, maximumItems] = profile.controlledItemsPerCoreLesson;

  if (
    controlledItemCount < minimumItems ||
    controlledItemCount > maximumItems
  ) {
    add(
      "steps.practice.exercises",
      `Core lesson ${lesson.level} cần ${minimumItems}–${maximumItems} controlled items; hiện có ${controlledItemCount}`,
    );
  }

  const exerciseKinds = new Set(
    practiceSteps.flatMap((step) => step.exercises.map((exercise) => exercise.kind)),
  );

  if (!exerciseKinds.has("recall")) {
    add(
      "steps.practice.exercises",
      "Core lesson phải có ít nhất một retrieval item yêu cầu người học tự nhớ câu trả lời",
    );
  }

  if (!exerciseKinds.has("listen")) {
    add(
      "steps.practice.exercises",
      "Core lesson phải có ít nhất một bài nghe hiểu phục vụ nhiệm vụ",
    );
  }

  const performance = lesson.steps.find((step) => step.kind === "performance");
  if (
    performance?.kind === "performance" &&
    performance.task.attempts < profile.requiredPerformanceAttempts
  ) {
    add(
      "steps.performance.task.attempts",
      `Bài ${lesson.level} cần ít nhất ${profile.requiredPerformanceAttempts} performance attempts`,
    );
  }

  const exit = lesson.steps.find((step) => step.kind === "exit");
  if (exit?.kind === "exit") {
    const coreTargetIds = lesson.targets
      .filter((target) => target.priority === "core")
      .map((target) => target.id);
    const scheduledCoreTargets = coreTargetIds.filter((targetId) =>
      exit.reviewTargetIds.includes(targetId),
    ).length;
    const minimumScheduledTargets = Math.max(
      1,
      Math.ceil(coreTargetIds.length * 0.5),
    );

    if (scheduledCoreTargets < minimumScheduledTargets) {
      add(
        "steps.exit.reviewTargetIds",
        `Exit review phải lên lịch ít nhất ${minimumScheduledTargets}/${coreTargetIds.length} core target; hiện có ${scheduledCoreTargets}`,
      );
    }
  }

  return violations;
}

/**
 * Production-ready validation combines lesson integrity with research-backed
 * practice dosage. Module-level delayed/transfer coverage is validated from
 * encounter evidence after the other sessions in the module are authored.
 */
export function validateProductionLessonV2(
  lesson: LessonV2,
): LessonV2Violation[] {
  return [
    ...validateLessonV2(lesson),
    ...validateLessonExerciseDosage(lesson),
  ];
}
