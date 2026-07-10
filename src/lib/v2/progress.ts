/**
 * v2 lesson progress — local-first for guests; auth users also write Supabase
 * (`user_v2_lesson_progress`, TASK-279). Key: ato_v2_progress
 *
 * Complete rule (soft): task attempt + quiz floor ≥50% (see canMarkLessonComplete).
 */

/** Soft quiz floor before markLessonComplete (TASK-187). */
export const QUIZ_FLOOR_RATIO = 0.5;

export interface LessonProgressRecord {
  lessonId: string;
  completedAt: string; // ISO
  quizCorrect: number;
  quizTotal: number;
  taskDone: boolean;
}

/** True when quizCorrect/quizTotal meets soft floor (default ≥50%). */
export function meetsQuizFloor(
  quizCorrect: number,
  quizTotal: number,
  floor: number = QUIZ_FLOOR_RATIO,
): boolean {
  if (quizTotal <= 0) return false;
  if (quizCorrect < 0) return false;
  return quizCorrect / quizTotal >= floor;
}

export type CompleteGateResult =
  | { ok: true }
  | { ok: false; reason: "no_task" | "no_answers" | "below_floor"; message_vi: string };

/**
 * Soft complete gate: task attempt + at least one graded answer + ≥50% quiz.
 * Player must surface message_vi and allow re-try — not a hard ban forever.
 */
export function canMarkLessonComplete(input: {
  taskDone: boolean;
  quizCorrect: number;
  quizTotal: number;
  answeredCount?: number;
}): CompleteGateResult {
  if (!input.taskDone) {
    return {
      ok: false,
      reason: "no_task",
      message_vi: "Hãy hoàn thành nhiệm vụ nói trước khi kết thúc bài.",
    };
  }
  const answered = input.answeredCount ?? input.quizCorrect;
  if (input.quizTotal <= 0 || answered <= 0) {
    return {
      ok: false,
      reason: "no_answers",
      message_vi: "Hãy trả lời quiz trước khi hoàn thành bài (không được bỏ trống).",
    };
  }
  if (!meetsQuizFloor(input.quizCorrect, input.quizTotal)) {
    const need = Math.ceil(input.quizTotal * QUIZ_FLOOR_RATIO);
    return {
      ok: false,
      reason: "below_floor",
      message_vi: `Cần đạt ít nhất ${Math.round(QUIZ_FLOOR_RATIO * 100)}% quiz (tối thiểu ${need}/${input.quizTotal} đúng). Hiện ${input.quizCorrect}/${input.quizTotal}. Bấm «Làm lại quiz» để thử lại.`,
    };
  }
  return { ok: true };
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
    emitProgressChange();
  } catch {
    /* ignore quota */
  }
}

/** Subscribe for useSyncExternalStore — Home/Path re-read without useEffect setState */
export function subscribeV2Progress(onChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(V2_PROGRESS_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(V2_PROGRESS_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function getCompletedIdsSnapshot(): string {
  return getCompletedIds().slice().sort().join("\n");
}

export function getServerCompletedIdsSnapshot(): string {
  return "";
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

/**
 * Merge remote DB rows into a progress state (union).
 * Prefer earlier completedAt; max quiz scores; taskDone OR.
 * Pure — used by hydrator + unit tests (TASK-279).
 */
export function mergeLessonRecords(
  local: V2ProgressState,
  remote: readonly LessonProgressRecord[],
): V2ProgressState {
  const completed: Record<string, LessonProgressRecord> = {
    ...local.completed,
  };

  for (const rec of remote) {
    if (!rec?.lessonId) continue;
    const existing = completed[rec.lessonId];
    if (!existing) {
      completed[rec.lessonId] = {
        lessonId: rec.lessonId,
        completedAt: rec.completedAt,
        quizCorrect: rec.quizCorrect,
        quizTotal: rec.quizTotal,
        taskDone: rec.taskDone,
      };
      continue;
    }
    const earlier =
      existing.completedAt <= rec.completedAt
        ? existing.completedAt
        : rec.completedAt;
    completed[rec.lessonId] = {
      lessonId: rec.lessonId,
      completedAt: earlier,
      quizCorrect: Math.max(existing.quizCorrect, rec.quizCorrect),
      quizTotal: Math.max(existing.quizTotal, rec.quizTotal),
      taskDone: existing.taskDone || rec.taskDone,
    };
  }

  let lastLessonId = local.lastLessonId;
  const ids = Object.keys(completed);
  if (ids.length > 0) {
    let latestId = ids[0];
    let latestAt = completed[latestId]?.completedAt ?? "";
    for (const id of ids) {
      const at = completed[id]?.completedAt ?? "";
      if (at > latestAt) {
        latestAt = at;
        latestId = id;
      }
    }
    lastLessonId = latestId;
  }

  return {
    completed,
    lastLessonId,
    updatedAt: new Date().toISOString(),
  };
}

/** Serialize records for server sync (auth only). */
export function listCompletedRecords(
  state: V2ProgressState = loadV2Progress(),
): LessonProgressRecord[] {
  return Object.values(state.completed);
}

export function countCompleted(): number {
  return Object.keys(loadV2Progress().completed).length;
}

export function getCompletedIds(): string[] {
  return Object.keys(loadV2Progress().completed);
}
