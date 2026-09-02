import type { RecordLearningAttemptInput } from "../learning/validation";
import type { LessonAction, LessonContract } from "./lesson-contract";

export type NếpResponseSource = "speech" | "text" | null;

export type EvaluatedNếpAction = {
  lesson: LessonContract;
  action: LessonAction;
  response: string;
  responseSource: NếpResponseSource;
  correct: boolean;
  supportUsed: boolean;
  latencyMs: number;
};

function responseModality(action: LessonAction, source: NếpResponseSource) {
  if (action.modality === "choice") return "choice" as const;
  if (source === "speech") return "speech" as const;
  if (source === "text") return "text" as const;
  return "none" as const;
}

/**
 * Adapts an evaluated Nếp action to the canonical Attempt → Evidence write contract.
 * Raw learner responses are deliberately not persisted here; the deterministic evaluator
 * has already reduced the response to success/failure plus non-sensitive metadata.
 */
export function toLearningAttemptRecord(input: EvaluatedNếpAction): RecordLearningAttemptInput | null {
  const { lesson, action, response, responseSource, correct, supportUsed, latencyMs } = input;
  const assessment = action.assessment;
  if (!assessment) return null;

  const modality = responseModality(action, responseSource);
  const safeLatency = Math.min(60 * 60 * 1000, Math.max(0, Math.round(latencyMs)));
  const metadata = {
    lessonId: lesson.id,
    lessonVersion: lesson.version,
    actionId: action.id,
    actionKind: action.kind,
    responseSource,
    responseLength: response.trim().length,
    rawResponsePersisted: false,
    supportUsed,
    changedContext: action.changedContext ?? false,
  };

  return {
    attempt: {
      capabilityId: assessment.targetCapabilityId,
      exerciseType: `nep:${action.kind}`,
      responseModality: modality,
      promptId: action.id,
      contextId: assessment.contextId,
      responseText: null,
      correct,
      latencyMs: safeLatency,
      hintCount: 0,
      revealUsed: false,
      supportLevel: supportUsed ? 1 : 0,
      metadata,
    },
    candidate: assessment.evidenceType
      ? {
          type: assessment.evidenceType,
          targetId: assessment.targetCapabilityId,
          success: correct,
          contextId: assessment.contextId,
          evaluator: assessment.evaluator,
          metadata: {
            lessonId: lesson.id,
            actionId: action.id,
            responseSource,
            rawResponsePersisted: false,
          },
        }
      : null,
  };
}
