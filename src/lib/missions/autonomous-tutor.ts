import {
  evaluateMissionTranscript,
  type MissionEvaluationResult,
} from "@/lib/missions/mission-evaluator";
import type {
  MissionIntent,
  MissionSpecV1,
} from "@/lib/missions/mission-spec";

export interface TutorIntentCheck {
  passed: boolean;
  normalizedResponse: string;
  suggestion: string;
  explanationVi: string;
}

export interface TutorDiagnosis {
  evaluation: MissionEvaluationResult;
  focusIntentIds: string[];
  independentIntentIds: string[];
}

export function normalizeTutorResponse(value: string): string {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/\bi'm\b/g, "i am")
    .replace(/\bi'll\b/g, "i will")
    .replace(/\bi've\b/g, "i have")
    .replace(/\bdidn't\b/g, "did not")
    .replace(/\bwhat's\b/g, "what is")
    .replace(/[.,!?;:"]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function tutorResponseMatchesIntent(
  response: string,
  intent: MissionIntent,
): boolean {
  const normalized = normalizeTutorResponse(response);
  if (!normalized) return false;

  return intent.matchers.some((source) => {
    try {
      return new RegExp(source, "i").test(normalized);
    } catch {
      return normalized.includes(source.toLowerCase());
    }
  });
}

export function evaluateTutorIntent(
  intent: MissionIntent,
  response: string,
): TutorIntentCheck {
  const normalizedResponse = normalizeTutorResponse(response);
  const passed = tutorResponseMatchesIntent(normalizedResponse, intent);

  return {
    passed,
    normalizedResponse,
    suggestion: intent.examples[0] ?? "Hãy thử diễn đạt lại ý này.",
    explanationVi: passed
      ? `Bạn đã tự thể hiện được mục tiêu: ${intent.descriptionVi}`
      : `Câu trả lời chưa thể hiện rõ mục tiêu: ${intent.descriptionVi}`,
  };
}

export function evaluateTutorFullTask(
  mission: MissionSpecV1,
  response: string,
): MissionEvaluationResult {
  const emptyTurns = Array.from(
    { length: mission.roleplayTurns.length },
    () => "",
  );

  return evaluateMissionTranscript(mission, [...emptyTurns, response]);
}

export function diagnoseTutorResponse(
  mission: MissionSpecV1,
  response: string,
): TutorDiagnosis {
  const evaluation = evaluateTutorFullTask(mission, response);
  const focusIds = new Set(evaluation.missingIntentIds);

  for (const correction of evaluation.corrections) {
    for (const intent of mission.intents) {
      if (tutorResponseMatchesIntent(correction.suggestion, intent)) {
        focusIds.add(intent.id);
      }
    }
  }

  const requiredIntentIds = mission.intents
    .filter((intent) => intent.required)
    .map((intent) => intent.id);

  return {
    evaluation,
    focusIntentIds: requiredIntentIds.filter((intentId) => focusIds.has(intentId)),
    independentIntentIds: requiredIntentIds.filter(
      (intentId) => !focusIds.has(intentId),
    ),
  };
}

export function tutorMasteryPassed(
  evaluation: MissionEvaluationResult,
): boolean {
  return (
    evaluation.status === "scored" &&
    evaluation.taskCompleted &&
    evaluation.corrections.length === 0
  );
}

export function scaffoldForAttempt(example: string, attempt: number): string | null {
  if (attempt <= 0) return null;
  if (attempt === 1) {
    const words = example.split(/\s+/).filter(Boolean);
    return words.slice(0, Math.min(2, words.length)).join(" ") + " …";
  }

  return example;
}
