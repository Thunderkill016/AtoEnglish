import {
  getSpeakingInteraction,
  type SpeakingTaskCriterionId,
} from "@/lib/lessons/speaking-interactions";

export interface SpeakingTaskCriterionResult {
  id: SpeakingTaskCriterionId;
  labelVi: string;
  met: boolean;
}

export interface SpeakingTaskEvaluation {
  unitId: string;
  criteria: SpeakingTaskCriterionResult[];
  metCount: number;
  total: number;
  accomplished: boolean;
  /** Practice feedback only. This must never be promoted to CEFR mastery evidence. */
  evidenceKind: "practice-task-feedback";
}

const normalize = (transcript: string) =>
  transcript
    .toLowerCase()
    .replace(/[’]/g, "'")
    .replace(/[^a-z'?\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Returns task-accomplishment feedback only for units with an explicitly authored interaction contract.
 * Undefined means the unit must continue using its existing practice feedback until a rubric is authored.
 */
export function evaluateSpeakingTask(
  unitId: string,
  transcript: string
): SpeakingTaskEvaluation | undefined {
  const interaction = getSpeakingInteraction(unitId);
  if (!interaction) return undefined;

  const text = normalize(transcript);
  const criteria: SpeakingTaskCriterionResult[] = interaction.criteria.map((criterion) => ({
    id: criterion.id,
    labelVi: criterion.labelVi,
    met: criterion.patterns.some((pattern) => pattern.test(text)),
  }));
  const metCount = criteria.filter((criterion) => criterion.met).length;

  return {
    unitId,
    criteria,
    metCount,
    total: criteria.length,
    accomplished: metCount === criteria.length,
    evidenceKind: "practice-task-feedback",
  };
}
