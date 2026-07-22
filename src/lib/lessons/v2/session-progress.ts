export const LESSON_SESSION_STORAGE_VERSION = 2;

export interface LessonSessionState {
  version: number;
  lessonId: string;
  currentStepIndex: number;
  completedStepIds: string[];
  answers: Record<string, string>;
  correctExerciseIds: string[];
  performanceAttempts: number;
  completed: boolean;
  startedAt: string;
  updatedAt: string;
  completedAt?: string;
}

export function createLessonSessionState(
  lessonId: string,
  now = new Date(),
): LessonSessionState {
  const timestamp = now.toISOString();

  return {
    version: LESSON_SESSION_STORAGE_VERSION,
    lessonId,
    currentStepIndex: 0,
    completedStepIds: [],
    answers: {},
    correctExerciseIds: [],
    performanceAttempts: 0,
    completed: false,
    startedAt: timestamp,
    updatedAt: timestamp,
  };
}

export function lessonSessionStorageKey(lessonId: string): string {
  return `ato.lesson-v2.${LESSON_SESSION_STORAGE_VERSION}.${lessonId}`;
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

function validIsoTimestamp(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  return Number.isNaN(Date.parse(value)) ? undefined : value;
}

export function normaliseLessonSessionState(
  value: unknown,
  lessonId: string,
): LessonSessionState {
  const fallback = createLessonSessionState(lessonId);
  if (!value || typeof value !== "object") return fallback;

  const candidate = value as Partial<LessonSessionState>;
  if (
    candidate.version !== LESSON_SESSION_STORAGE_VERSION ||
    candidate.lessonId !== lessonId
  ) {
    return fallback;
  }

  return {
    ...fallback,
    ...candidate,
    lessonId,
    completedStepIds: unique(
      Array.isArray(candidate.completedStepIds)
        ? candidate.completedStepIds.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
    ),
    correctExerciseIds: unique(
      Array.isArray(candidate.correctExerciseIds)
        ? candidate.correctExerciseIds.filter(
            (item): item is string => typeof item === "string",
          )
        : [],
    ),
    answers:
      candidate.answers && typeof candidate.answers === "object"
        ? Object.fromEntries(
            Object.entries(candidate.answers).filter(
              (entry): entry is [string, string] =>
                typeof entry[1] === "string",
            ),
          )
        : {},
    currentStepIndex: Math.max(
      0,
      typeof candidate.currentStepIndex === "number" &&
      Number.isFinite(candidate.currentStepIndex)
        ? Math.floor(candidate.currentStepIndex)
        : 0,
    ),
    performanceAttempts: Math.max(
      0,
      typeof candidate.performanceAttempts === "number" &&
      Number.isFinite(candidate.performanceAttempts)
        ? Math.floor(candidate.performanceAttempts)
        : 0,
    ),
    completed: candidate.completed === true,
    startedAt: validIsoTimestamp(candidate.startedAt) ?? fallback.startedAt,
    updatedAt: validIsoTimestamp(candidate.updatedAt) ?? fallback.updatedAt,
    completedAt: validIsoTimestamp(candidate.completedAt),
  };
}

export function updateLessonAnswer(
  state: LessonSessionState,
  exerciseId: string,
  answer: string,
  now = new Date(),
): LessonSessionState {
  return {
    ...state,
    answers: {
      ...state.answers,
      [exerciseId]: answer,
    },
    updatedAt: now.toISOString(),
  };
}

export function markExerciseCorrect(
  state: LessonSessionState,
  exerciseId: string,
  now = new Date(),
): LessonSessionState {
  return {
    ...state,
    correctExerciseIds: unique([
      ...state.correctExerciseIds,
      exerciseId,
    ]),
    updatedAt: now.toISOString(),
  };
}

export function recordPerformanceAttempt(
  state: LessonSessionState,
  now = new Date(),
): LessonSessionState {
  return {
    ...state,
    performanceAttempts: state.performanceAttempts + 1,
    updatedAt: now.toISOString(),
  };
}

export function completeLessonStep(
  state: LessonSessionState,
  stepId: string,
  nextStepIndex: number,
  isFinalStep: boolean,
  now = new Date(),
): LessonSessionState {
  const timestamp = now.toISOString();

  return {
    ...state,
    currentStepIndex: Math.max(0, nextStepIndex),
    completedStepIds: unique([...state.completedStepIds, stepId]),
    completed: isFinalStep || state.completed,
    completedAt:
      isFinalStep || state.completed
        ? state.completedAt ?? timestamp
        : state.completedAt,
    updatedAt: timestamp,
  };
}

export function calculateLessonSessionProgress(
  state: LessonSessionState,
  totalSteps: number,
): number {
  if (totalSteps <= 0) return 0;
  if (state.completed) return 100;

  return Math.min(
    100,
    Math.round((state.completedStepIds.length / totalSteps) * 100),
  );
}
