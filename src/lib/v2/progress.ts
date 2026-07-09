/**
 * v2 lesson progress — local-first (guest + until DB migration).
 * Key: ato_v2_progress
 */

export interface LessonProgressRecord {
  lessonId: string;
  completedAt: string; // ISO
  quizCorrect: number;
  quizTotal: number;
  taskDone: boolean;
}

export interface V2ProgressState {
  completed: Record<string, LessonProgressRecord>;
  /** Last lesson id touched */
  lastLessonId?: string;
  updatedAt?: string;
}

const STORAGE_KEY = "ato_v2_progress";
/** Same-tab listeners (storage event is cross-tab only) */
export const V2_PROGRESS_EVENT = "ato-v2-progress";

function empty(): V2ProgressState {
  return { completed: {} };
}

function emitProgressChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(V2_PROGRESS_EVENT));
}

export function loadV2Progress(): V2ProgressState {
  if (typeof window === "undefined") return empty();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty();
    const parsed = JSON.parse(raw) as V2ProgressState;
    if (!parsed || typeof parsed.completed !== "object") return empty();
    return parsed;
  } catch {
    return empty();
  }
}

export function saveV2Progress(state: V2ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    state.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota */
  }
}

export function isLessonCompleted(lessonId: string): boolean {
  return Boolean(loadV2Progress().completed[lessonId]);
}

export function markLessonComplete(input: {
  lessonId: string;
  quizCorrect: number;
  quizTotal: number;
  taskDone: boolean;
}): V2ProgressState {
  const state = loadV2Progress();
  state.completed[input.lessonId] = {
    lessonId: input.lessonId,
    completedAt: new Date().toISOString(),
    quizCorrect: input.quizCorrect,
    quizTotal: input.quizTotal,
    taskDone: input.taskDone,
  };
  state.lastLessonId = input.lessonId;
  saveV2Progress(state);
  return state;
}

export function countCompleted(): number {
  return Object.keys(loadV2Progress().completed).length;
}

export function getCompletedIds(): string[] {
  return Object.keys(loadV2Progress().completed);
}
