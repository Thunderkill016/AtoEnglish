import type { PlannerCandidate } from "../learning/session-planner";
import { firstMeetingLessonV1, type LessonActionKind, type LessonContract } from "./lesson-contract";
import { plannerCandidateId } from "./remediation-map.v1";

const IMPORTANCE_BY_ACTION: Partial<Record<LessonActionKind, number>> = {
  comprehend: 0.8,
  retrieve: 1,
  produce: 1,
  repair: 0.9,
  transfer: 0.9,
};

const TRANSFER_VALUE_BY_ACTION: Partial<Record<LessonActionKind, number>> = {
  retrieve: 0.35,
  produce: 0.7,
  repair: 0.8,
  transfer: 1,
};

/**
 * Compile only evaluated, evidence-bearing opportunities into the planner catalog.
 * Supported retry is intentionally omitted because its assessment is attempt-only.
 * Feedback/reveal steps remain inside the lesson flow and are never scheduled as mastery evidence.
 */
export function buildLessonPlannerCandidates(lesson: LessonContract): PlannerCandidate[] {
  return lesson.actions.flatMap((action) => {
    const assessment = action.assessment;
    if (!assessment?.evidenceType) return [];

    return [{
      id: plannerCandidateId(lesson.id, action.id),
      targetId: assessment.targetCapabilityId,
      evidenceType: assessment.evidenceType,
      prerequisiteTargetIds: lesson.prerequisites,
      importance: IMPORTANCE_BY_ACTION[action.kind] ?? 0.5,
      transferValue: TRANSFER_VALUE_BY_ACTION[action.kind] ?? 0,
      metadata: {
        lessonId: lesson.id,
        lessonVersion: lesson.version,
        actionId: action.id,
        actionKind: action.kind,
        modality: action.modality,
        contextId: assessment.contextId,
        evaluator: assessment.evaluator,
      },
    }];
  });
}

export const nepSessionCatalogV1 = buildLessonPlannerCandidates(firstMeetingLessonV1);
