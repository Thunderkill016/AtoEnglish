import {
  LEVEL_DESIGN_BUDGETS,
  type LessonStepV2,
  type LessonV2,
  type PerformanceStep,
  type RubricDimension,
} from "./schema";

export interface LessonV2Violation {
  path: string;
  message: string;
}

function collectTargetReferences(step: LessonStepV2): string[] {
  switch (step.kind) {
    case "model":
      return step.turns.flatMap((turn) => turn.targetIds ?? []);
    case "notice":
      return step.targetIds;
    case "practice":
      return step.exercises.flatMap((exercise) => exercise.targetIds);
    case "rehearsal":
      return step.targetIds;
    case "performance":
      return step.task.targetIds;
    case "exit":
      return step.reviewTargetIds;
    case "scenario":
    case "feedback":
      return [];
  }
}

function findPerformance(lesson: LessonV2): PerformanceStep | undefined {
  return lesson.steps.find(
    (step): step is PerformanceStep => step.kind === "performance",
  );
}

function hasRequiredRubric(
  rubric: RubricDimension[],
  dimension: RubricDimension,
): boolean {
  return rubric.includes(dimension);
}

export function calculateLessonMinutes(lesson: LessonV2): number {
  return lesson.steps.reduce((sum, step) => sum + step.estimatedMinutes, 0);
}

export function validateLessonV2(lesson: LessonV2): LessonV2Violation[] {
  const violations: LessonV2Violation[] = [];
  const add = (path: string, message: string) => violations.push({ path, message });
  const budget = LEVEL_DESIGN_BUDGETS[lesson.level];

  if (lesson.schemaVersion !== 2) {
    add("schemaVersion", "schemaVersion phải bằng 2");
  }

  if (lesson.primaryOutcome.level !== lesson.level) {
    add(
      "primaryOutcome.level",
      "Trình độ của can-do chính phải trùng với trình độ bài học",
    );
  }

  if (lesson.primaryOutcome.statementEn.trim().length < 20) {
    add("primaryOutcome.statementEn", "Can-do tiếng Anh quá ngắn hoặc không cụ thể");
  }

  if (lesson.primaryOutcome.statementVi.trim().length < 15) {
    add("primaryOutcome.statementVi", "Can-do tiếng Việt quá ngắn hoặc không cụ thể");
  }

  const calculatedMinutes = calculateLessonMinutes(lesson);
  if (lesson.estimatedMinutes !== calculatedMinutes) {
    add(
      "estimatedMinutes",
      `Thời lượng khai báo ${lesson.estimatedMinutes} không khớp tổng step ${calculatedMinutes}`,
    );
  }

  if (
    calculatedMinutes < budget.minMinutes ||
    calculatedMinutes > budget.maxMinutes
  ) {
    add(
      "estimatedMinutes",
      `Thời lượng ${calculatedMinutes} phút nằm ngoài budget ${budget.minMinutes}–${budget.maxMinutes} của ${lesson.level}`,
    );
  }

  const coreTargets = lesson.targets.filter((target) => target.priority === "core");
  if (
    coreTargets.length < budget.minCoreTargets ||
    coreTargets.length > budget.maxCoreTargets
  ) {
    add(
      "targets",
      `Số target cốt lõi ${coreTargets.length} nằm ngoài budget ${budget.minCoreTargets}–${budget.maxCoreTargets} của ${lesson.level}`,
    );
  }

  const targetIds = new Set<string>();
  for (const [index, target] of lesson.targets.entries()) {
    if (targetIds.has(target.id)) {
      add(`targets.${index}.id`, `Target id bị trùng: ${target.id}`);
    }
    targetIds.add(target.id);
  }

  const stepIds = new Set<string>();
  for (const [index, step] of lesson.steps.entries()) {
    if (stepIds.has(step.id)) {
      add(`steps.${index}.id`, `Step id bị trùng: ${step.id}`);
    }
    stepIds.add(step.id);

    if (step.estimatedMinutes <= 0) {
      add(`steps.${index}.estimatedMinutes`, "Mỗi step phải có thời lượng dương");
    }

    for (const targetId of collectTargetReferences(step)) {
      if (!targetIds.has(targetId)) {
        add(
          `steps.${index}`,
          `Step tham chiếu target không tồn tại: ${targetId}`,
        );
      }
    }

    if (step.kind === "practice") {
      for (const [exerciseIndex, exercise] of step.exercises.entries()) {
        if (exercise.kind === "select" || exercise.kind === "listen") {
          if (!exercise.options.includes(exercise.answer)) {
            add(
              `steps.${index}.exercises.${exerciseIndex}.answer`,
              "Đáp án phải nằm trong danh sách lựa chọn",
            );
          }
        }
      }
    }
  }

  const requiredKinds: LessonStepV2["kind"][] = [
    "scenario",
    "model",
    "performance",
    "exit",
  ];
  for (const kind of requiredKinds) {
    const count = lesson.steps.filter((step) => step.kind === kind).length;
    if (count !== 1) {
      add("steps", `Bài học phải có đúng 1 step '${kind}', hiện có ${count}`);
    }
  }

  const performance = findPerformance(lesson);
  if (!performance) return violations;

  const responseSeconds = performance.task.responseSeconds ?? 0;
  if (
    responseSeconds < budget.minPerformanceSeconds ||
    responseSeconds > budget.maxPerformanceSeconds
  ) {
    add(
      "steps.performance.task.responseSeconds",
      `Thời lượng performance ${responseSeconds}s nằm ngoài budget ${budget.minPerformanceSeconds}–${budget.maxPerformanceSeconds}s`,
    );
  }

  if (
    lesson.primaryOutcome.activity === "production" ||
    lesson.primaryOutcome.activity === "interaction"
  ) {
    if (performance.task.attempts < 2) {
      add(
        "steps.performance.task.attempts",
        "Bài speaking/interaction phải có ít nhất 2 lần thử",
      );
    }

    const hasSpokenEvidence = performance.task.evidence.some((evidence) =>
      ["asr_transcript", "audio_recording", "task_checklist"].includes(evidence),
    );
    if (!hasSpokenEvidence) {
      add(
        "steps.performance.task.evidence",
        "Bài speaking/interaction phải thu ít nhất một loại bằng chứng nói",
      );
    }

    if (!hasRequiredRubric(performance.task.rubric, "task_achievement")) {
      add(
        "steps.performance.task.rubric",
        "Rubric speaking phải có task_achievement",
      );
    }

    if (!hasRequiredRubric(performance.task.rubric, "comprehensibility")) {
      add(
        "steps.performance.task.rubric",
        "Rubric speaking phải có comprehensibility",
      );
    }
  }

  if (performance.task.successCriteriaVi.length < 2) {
    add(
      "steps.performance.task.successCriteriaVi",
      "Performance task cần ít nhất 2 tiêu chí thành công rõ ràng",
    );
  }

  if (performance.task.targetIds.length === 0) {
    add(
      "steps.performance.task.targetIds",
      "Performance task phải đánh giá ít nhất một target",
    );
  }

  const exit = lesson.steps.find((step) => step.kind === "exit");
  if (exit?.kind === "exit" && exit.reviewTargetIds.length === 0) {
    add("steps.exit.reviewTargetIds", "Exit step phải lên lịch review target");
  }

  return violations;
}
