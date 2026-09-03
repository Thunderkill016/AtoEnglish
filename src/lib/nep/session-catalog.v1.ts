import type { PlannerCandidate } from "../learning/session-planner";
import type { LessonActionKind, LessonContract } from "./lesson-contract";
import { nepLessonRegistryV1 } from "./lesson-registry.v1";
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

export const nepSessionCatalogV1 = nepLessonRegistryV1.flatMap(buildLessonPlannerCandidates);

/**
 * The adaptive catalog must contain a learnable source for every declared prerequisite.
 * Otherwise a new learner can be permanently blocked by a target that the planner can never serve.
 */
export function validateNếpSessionCatalog(candidates: PlannerCandidate[] = nepSessionCatalogV1) {
  const issues: string[] = [];
  const candidateIds = new Set<string>();
  const targetIds = new Set(candidates.map((candidate) => candidate.targetId));

  for (const candidate of candidates) {
    if (candidateIds.has(candidate.id)) issues.push(`duplicate-candidate-id:${candidate.id}`);
    candidateIds.add(candidate.id);

    for (const prerequisite of candidate.prerequisiteTargetIds ?? []) {
      if (!targetIds.has(prerequisite)) {
        issues.push(`missing-prerequisite-practice:${candidate.id}:${prerequisite}`);
      }
    }
  }

  return [...new Set(issues)].sort();
}
