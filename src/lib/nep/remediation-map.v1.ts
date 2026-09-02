import type { NếpEvaluationErrorTag, NếpEvaluationResult } from "./evaluator";
import type { LessonAction, LessonContract } from "./lesson-contract";

export type NếpRemediationHint = {
  errorTag: NếpEvaluationErrorTag;
  candidateId: string;
};

type RemediationRule = {
  lessonId: string;
  lessonVersion: number;
  sourceActionId: string;
  errorTag: NếpEvaluationErrorTag;
  targetActionId: string;
};

/**
 * Product-policy mapping for the first Nếp vertical slice.
 * The generic planner never interprets target-group indexes itself. Content explicitly says
 * which evidence-bearing action is the safer next practice for a derived task-coverage error.
 */
export const NẾP_REMEDIATION_RULES_V1: RemediationRule[] = [
  {
    lessonId: "LESSON-CAP002-FIRST-MEETING-V1",
    lessonVersion: 1,
    sourceActionId: "comprehend",
    errorTag: "incorrect-choice",
    targetActionId: "comprehend",
  },
  {
    lessonId: "LESSON-CAP002-FIRST-MEETING-V1",
    lessonVersion: 1,
    sourceActionId: "retrieve",
    errorTag: "missing-target-group:0",
    targetActionId: "retrieve",
  },
  {
    lessonId: "LESSON-CAP002-FIRST-MEETING-V1",
    lessonVersion: 1,
    sourceActionId: "produce",
    errorTag: "missing-target-group:0",
    targetActionId: "retrieve",
  },
  {
    lessonId: "LESSON-CAP002-FIRST-MEETING-V1",
    lessonVersion: 1,
    sourceActionId: "repair",
    errorTag: "missing-target-group:0",
    targetActionId: "repair",
  },
  {
    lessonId: "LESSON-CAP002-FIRST-MEETING-V1",
    lessonVersion: 1,
    sourceActionId: "transfer",
    errorTag: "missing-target-group:0",
    targetActionId: "repair",
  },
  {
    lessonId: "LESSON-CAP002-FIRST-MEETING-V1",
    lessonVersion: 1,
    sourceActionId: "transfer",
    errorTag: "missing-target-group:1",
    targetActionId: "produce",
  },
];

export function plannerCandidateId(lessonId: string, actionId: string) {
  return `${lessonId}:${actionId}`;
}

export function remediationHintsForEvaluation(input: {
  lesson: LessonContract;
  action: LessonAction;
  evaluation: NếpEvaluationResult;
}): NếpRemediationHint[] {
  const { lesson, action, evaluation } = input;
  const observedTags = new Set<NếpEvaluationErrorTag>(evaluation.errorTags);
  const hints = NẾP_REMEDIATION_RULES_V1.flatMap((rule) => {
    if (
      rule.lessonId !== lesson.id
      || rule.lessonVersion !== lesson.version
      || rule.sourceActionId !== action.id
      || !observedTags.has(rule.errorTag)
    ) {
      return [];
    }

    return [{
      errorTag: rule.errorTag,
      candidateId: plannerCandidateId(lesson.id, rule.targetActionId),
    }];
  });

  return dedupeHints(hints);
}

/**
 * Static content QA for remediation rules. A remediation target must exist in the same versioned
 * lesson and must compile to an evidence-bearing planner candidate. Attempt-only retry cannot be
 * used as a remediation target.
 */
export function validateNếpRemediationMap(lesson: LessonContract) {
  const issues: string[] = [];
  const actionById = new Map(lesson.actions.map((action) => [action.id, action]));

  for (const rule of NẾP_REMEDIATION_RULES_V1) {
    if (rule.lessonId !== lesson.id || rule.lessonVersion !== lesson.version) continue;

    const source = actionById.get(rule.sourceActionId);
    const target = actionById.get(rule.targetActionId);
    if (!source) {
      issues.push(`missing-source:${rule.sourceActionId}`);
      continue;
    }
    if (!target) {
      issues.push(`missing-target:${rule.targetActionId}`);
      continue;
    }
    if (!target.assessment?.evidenceType) {
      issues.push(`target-not-plannable:${rule.targetActionId}`);
    }

    const missingGroup = /^missing-target-group:(\d+)$/.exec(rule.errorTag);
    if (missingGroup) {
      const groupIndex = Number(missingGroup[1]);
      const groupCount = source.requiredSignalGroups?.length ?? 0;
      if (groupIndex >= groupCount) {
        issues.push(`source-group-out-of-range:${rule.sourceActionId}:${groupIndex}`);
      }
    }
  }

  return [...new Set(issues)].sort();
}

function dedupeHints(hints: NếpRemediationHint[]) {
  const byKey = new Map<string, NếpRemediationHint>();
  for (const hint of hints) {
    byKey.set(`${hint.errorTag}|${hint.candidateId}`, hint);
  }
  return [...byKey.values()].sort((a, b) => {
    const tag = a.errorTag.localeCompare(b.errorTag);
    return tag !== 0 ? tag : a.candidateId.localeCompare(b.candidateId);
  });
}
