import type { LessonSpecV1 } from "@/lib/lessons/lesson-spec";
import { validateMissionSpec } from "@/lib/missions/mission-spec";

export const LESSON_QUALITY_THRESHOLD = 85;

export const LESSON_QUALITY_WEIGHTS = {
  alignment: 20,
  input: 15,
  retrievalOutput: 20,
  assessmentFeedback: 20,
  vietnameseLearnerSupport: 10,
  accessibilityMedia: 10,
  provenanceTechnical: 5,
} as const;

export type LessonQualityCategory = keyof typeof LESSON_QUALITY_WEIGHTS;

export interface LessonQualityReport {
  lessonId: string;
  evaluatorVersion: string;
  scores: Record<LessonQualityCategory, number>;
  total: number;
  mandatoryFailures: string[];
  automatedPass: boolean;
}

export interface IndependentLessonReview {
  reviewerId: string;
  reviewedVersion: number;
  reviewedAt: string;
  approved: boolean;
}

function unique(values: string[]) {
  return new Set(values).size === values.length;
}

export function evaluateLessonQuality(spec: LessonSpecV1): LessonQualityReport {
  const mandatoryFailures: string[] = [];
  const activityIds = spec.activities.map((activity) => activity.id);
  const assessmentIdsExist = spec.assessment.activityIds.every((id) =>
    activityIds.includes(id),
  );
  const unusableQuizIds = spec.quiz
    .filter((question) => {
      if (!question.answer.trim()) return true;
      if (question.type === "cloze" || question.type === "translate") return false;
      return !question.options?.includes(question.answer);
    })
    .map((question) => question.id);
  const quizAnswersUsable = unusableQuizIds.length === 0;
  const audioPaths = spec.assets
    .filter((asset) => asset.type === "audio")
    .map((asset) => asset.path);
  const allRequiredAudio = [
    ...spec.vocab
      .map((item) => item.audio)
      .filter((path): path is string => Boolean(path)),
    ...spec.dialogues.map((dialogue) => dialogue.audio).filter(Boolean),
  ];

  if (!spec.canDo.length) mandatoryFailures.push("missing_can_do");
  if (!unique(activityIds)) mandatoryFailures.push("duplicate_activity_id");
  if (!assessmentIdsExist) mandatoryFailures.push("assessment_activity_missing");
  if (!quizAnswersUsable) {
    mandatoryFailures.push(`unusable_answer_key:${unusableQuizIds.join(",")}`);
  }
  if (!allRequiredAudio.every((path) => audioPaths.includes(path))) {
    mandatoryFailures.push("missing_audio_manifest_entry");
  }

  if (spec.mission) {
    const missionFailures = validateMissionSpec(spec.mission);
    mandatoryFailures.push(
      ...missionFailures.map((failure) => `mission:${failure}`),
    );

    if (spec.mission.lessonId !== spec.id) {
      mandatoryFailures.push("mission:lesson_id_mismatch");
    }
    if (!spec.canDo.includes(spec.mission.canDoVi)) {
      mandatoryFailures.push("mission:can_do_not_aligned");
    }

    const requiredIntentEvidence = spec.mission.intents
      .filter((intent) => intent.required)
      .map((intent) => `${spec.mission!.id}:intent:${intent.id}`);
    if (
      !requiredIntentEvidence.every((evidenceId) =>
        spec.assessment.canDoEvidence.includes(evidenceId),
      )
    ) {
      mandatoryFailures.push("mission:required_intent_evidence_missing");
    }
  }

  const mission = spec.mission;
  const missionInputScore = mission
    ? (mission.targetChunks.length >= 6 && mission.targetChunks.length <= 8
        ? 5
        : 0) +
      (mission.roleplayTurns.length >= 3 ? 5 : 0) +
      (mission.targetChunks.every(
        (chunk) => chunk.vietnamese.trim() && chunk.useWhenVi.trim(),
      )
        ? 5
        : 0)
    : null;
  const missionRetrievalScore = mission
    ? (mission.roleplayTurns.length > 0 ? 5 : 0) +
      (mission.intents.some((intent) => intent.interactional) ? 5 : 0) +
      (mission.retry.requiredAfterFeedback ? 5 : 0) +
      (spec.activities.some((activity) => activity.srsTargets.length > 0)
        ? 5
        : 0)
    : null;
  const missionAssessmentScore = mission
    ? (mission.checkpoint.questions.length >= 4 ? 5 : 0) +
      (quizAnswersUsable ? 5 : 0) +
      (unique(activityIds) ? 5 : 0) +
      (spec.activities.every((activity) =>
        activity.feedback.incorrectVi.trim(),
      )
        ? 5
        : 0)
    : null;
  const missionVietnameseSupportScore = mission
    ? (mission.targetChunks.every(
        (chunk) => chunk.vietnamese.trim() && chunk.useWhenVi.trim(),
      )
        ? 5
        : 0) +
      (mission.feedbackRules.every((rule) => rule.explanationVi.trim()) ? 5 : 0)
    : null;

  const scores: Record<LessonQualityCategory, number> = {
    alignment:
      (spec.canDo.length > 0 ? 6 : 0) +
      (spec.activities.length >= 8 && spec.activities.length <= 12 ? 6 : 0) +
      (assessmentIdsExist ? 8 : 0),
    input:
      missionInputScore ??
      ((spec.vocab.length >= 8 && spec.vocab.length <= 12 ? 5 : 0) +
        (spec.dialogues.length > 0 ? 5 : 0) +
        (audioPaths.length > 0 ? 5 : 0)),
    retrievalOutput:
      missionRetrievalScore ??
      (((spec.practiceQuiz?.length ?? 0) > 0 ? 5 : 0) +
        ((spec.practiceTranslate?.length ?? 0) > 0 ? 5 : 0) +
        (spec.activities.some((activity) => activity.skill === "speaking")
          ? 5
          : 0) +
        (spec.activities.some((activity) => activity.srsTargets.length > 0)
          ? 5
          : 0)),
    assessmentFeedback:
      missionAssessmentScore ??
      ((spec.quiz.length >= 5 ? 5 : 0) +
        (quizAnswersUsable ? 5 : 0) +
        (unique(activityIds) ? 5 : 0) +
        (spec.activities.every((activity) =>
          activity.feedback.incorrectVi.trim(),
        )
          ? 5
          : 0)),
    vietnameseLearnerSupport:
      missionVietnameseSupportScore ??
      ((spec.vocab.some((item) => item.l1_interference_vn?.trim()) ? 5 : 0) +
        (spec.grammar?.vnNote?.trim() ? 5 : 0)),
    accessibilityMedia:
      (allRequiredAudio.every((path) => audioPaths.includes(path)) ? 5 : 0) +
      (spec.activities.every((activity) => activity.promptVi.trim()) ? 5 : 0),
    provenanceTechnical:
      spec.sourceRefs.length > 0 && spec.schemaVersion === 1 ? 5 : 0,
  };
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0);

  return {
    lessonId: spec.id,
    evaluatorVersion: "lesson-quality-1.2.0",
    scores,
    total,
    mandatoryFailures,
    automatedPass:
      total >= LESSON_QUALITY_THRESHOLD && mandatoryFailures.length === 0,
  };
}

export function canPublishLesson(
  spec: LessonSpecV1,
  report: LessonQualityReport,
  review: IndependentLessonReview | null,
) {
  return (
    report.lessonId === spec.id &&
    report.automatedPass &&
    review?.approved === true &&
    review.reviewedVersion === spec.version &&
    review.reviewerId.trim().length > 0
  );
}
