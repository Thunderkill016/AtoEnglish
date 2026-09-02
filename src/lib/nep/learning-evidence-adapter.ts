import type { RecordLearningAttemptInput } from "../learning/validation";
import type { NếpEvaluationResult } from "./evaluator";
import type { LessonAction, LessonContract } from "./lesson-contract";

export type NếpResponseSource = "speech" | "text" | null;

export type EvaluatedNếpAction = {
  lesson: LessonContract;
  action: LessonAction;
  response: string;
  responseSource: NếpResponseSource;
  evaluation: NếpEvaluationResult;
  supportUsed: boolean;
  latencyMs: number;
};

function responseModality(action: LessonAction, source: NếpResponseSource) {
  if (action.modality === "choice") return "choice" as const;
  if (source === "speech") return "speech" as const;
  if (source === "text") return "text" as const;
  return "none" as const;
}

function structuredErrorSignals(evaluation: NếpEvaluationResult) {
  return {
    version: 1,
    evaluator: evaluation.evaluator,
    observedResponse: evaluation.observedResponse,
    matchedTargetGroupIndexes: evaluation.matchedTargetGroupIndexes,
    missingTargetGroupIndexes: evaluation.missingTargetGroupIndexes,
    errorTags: evaluation.errorTags,
  };
}

/**
 * Adapts one deterministic Nếp evaluation to the canonical Attempt → Evidence write contract.
 * Raw learner responses are deliberately not persisted. Only derived target-coverage/error
 * signals, response length, modality and task identity cross the persistence boundary.
 */
export function toLearningAttemptRecord(input: EvaluatedNếpAction): RecordLearningAttemptInput | null {
  const { lesson, action, response, responseSource, evaluation, supportUsed, latencyMs } = input;
  const assessment = action.assessment;
  if (!assessment) return null;

  const modality = responseModality(action, responseSource);
  const safeLatency = Math.min(60 * 60 * 1000, Math.max(0, Math.round(latencyMs)));
  const errorSignals = structuredErrorSignals(evaluation);
  const metadata = {
    lessonId: lesson.id,
    lessonVersion: lesson.version,
    actionId: action.id,
    actionKind: action.kind,
    responseSource,
    responseLength: evaluation.observedResponse ? response.trim().length : 0,
    rawResponsePersisted: false,
    supportUsed,
    changedContext: action.changedContext ?? false,
    errorSignals,
  };

  return {
    attempt: {
      capabilityId: assessment.targetCapabilityId,
      exerciseType: `nep:${action.kind}`,
      responseModality: modality,
      promptId: action.id,
      contextId: assessment.contextId,
      responseText: null,
      correct: evaluation.success,
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
          success: evaluation.success,
          contextId: assessment.contextId,
          evaluator: assessment.evaluator,
          metadata: {
            lessonId: lesson.id,
            lessonVersion: lesson.version,
            actionId: action.id,
            responseSource,
            rawResponsePersisted: false,
            errorSignals,
          },
        }
      : null,
  };
}
