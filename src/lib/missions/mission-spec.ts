export const MISSION_STAGES = [
  "scenario",
  "model",
  "guided_roleplay",
  "independent_roleplay",
  "feedback",
  "retry",
  "transfer",
  "completed",
] as const;

export type MissionStage = (typeof MISSION_STAGES)[number];

export interface MissionChunk {
  id: string;
  english: string;
  vietnamese: string;
  useWhenVi: string;
}

export interface MissionIntent {
  id: string;
  descriptionVi: string;
  required: boolean;
  examples: string[];
  /** Lower-case phrases or regular-expression source strings. */
  matchers: string[];
}

export interface MissionRoleplayTurn {
  id: string;
  partnerLine: string;
  partnerLineVi: string;
  expectedIntentIds: string[];
  hintVi: string;
}

export interface MissionTransferVariant {
  id: string;
  dueAfterDays: 1 | 7 | 30;
  scenarioVi: string;
  changedConditions: string[];
  partnerOpening: string;
}

export interface MissionSpecV1 {
  schemaVersion: 1;
  id: string;
  lessonId: string;
  titleVi: string;
  canDoVi: string;
  estimatedMinutes: number;
  scenarioVi: string;
  learnerRoleVi: string;
  partnerRoleVi: string;
  targetChunks: MissionChunk[];
  intents: MissionIntent[];
  roleplayTurns: MissionRoleplayTurn[];
  evaluation: {
    requiredIntentPassRatio: number;
    maxCorrections: 2;
    pronunciationFromTranscript: false;
  };
  retry: {
    requiredAfterFeedback: true;
    maxAttemptsPerSession: number;
  };
  review: {
    transferAfterDays: readonly [1, 7, 30];
  };
  transferVariants: MissionTransferVariant[];
}

export function validateMissionSpec(mission: MissionSpecV1): string[] {
  const failures: string[] = [];
  const intentIds = new Set(mission.intents.map((intent) => intent.id));
  const chunkIds = mission.targetChunks.map((chunk) => chunk.id);
  const transferDays = new Set(
    mission.transferVariants.map((variant) => variant.dueAfterDays),
  );

  if (!mission.canDoVi.trim()) failures.push("missing_can_do");
  if (mission.targetChunks.length < 4 || mission.targetChunks.length > 8) {
    failures.push("target_chunks_out_of_range");
  }
  if (new Set(chunkIds).size !== chunkIds.length) {
    failures.push("duplicate_chunk_id");
  }
  if (!mission.intents.some((intent) => intent.required)) {
    failures.push("missing_required_intent");
  }
  if (
    mission.roleplayTurns.some((turn) =>
      turn.expectedIntentIds.some((intentId) => !intentIds.has(intentId)),
    )
  ) {
    failures.push("roleplay_references_unknown_intent");
  }
  if (mission.evaluation.maxCorrections !== 2) {
    failures.push("feedback_must_be_bounded_to_two_corrections");
  }
  if (mission.evaluation.pronunciationFromTranscript !== false) {
    failures.push("transcript_cannot_score_pronunciation");
  }
  if (!mission.retry.requiredAfterFeedback) {
    failures.push("retry_must_follow_feedback");
  }
  if (
    !mission.review.transferAfterDays.every((day) => transferDays.has(day))
  ) {
    failures.push("missing_transfer_window");
  }

  return failures;
}
