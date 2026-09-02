import type { LessonAction } from "./lesson-contract";

export function normalizeNếpResponse(value: string) {
  return value
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9' -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function includesAny(response: string, signals: string[]) {
  return signals.some((signal) => response.includes(normalizeNếpResponse(signal)));
}

/**
 * Deterministic language-coverage evaluator for the preview slice.
 * It evaluates only declared target language, never pronunciation or acoustic quality.
 */
export function evaluateNếpActionResponse(action: LessonAction, response: string): boolean {
  const normalized = normalizeNếpResponse(response);

  if (action.kind === "comprehend") {
    return (action.targetSignals ?? []).some((signal) => normalized === normalizeNếpResponse(signal));
  }

  const groups = action.requiredSignalGroups
    ?? (action.targetSignals && action.targetSignals.length > 0 ? [action.targetSignals] : []);

  return groups.length > 0 && groups.every((group) => group.length > 0 && includesAny(normalized, group));
}
