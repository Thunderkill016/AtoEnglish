import { z } from "zod";

import { evaluateNếpAction, feedbackForNếpEvaluation } from "./evaluator";
import { firstMeetingLessonV1, type LessonAction, type LessonContract } from "./lesson-contract";
import { toLearningAttemptRecord, type NếpResponseSource } from "./learning-evidence-adapter";
import { nepSessionCatalogV1 } from "./session-catalog.v1";

const lessonRegistryV1: LessonContract[] = [firstMeetingLessonV1];

export const NếpPracticeSubmissionSchema = z.object({
  lessonId: z.string().trim().min(1).max(160),
  lessonVersion: z.number().int().positive(),
  actionId: z.string().trim().min(1).max(120),
  response: z.string().max(1200),
  responseSource: z.enum(["speech", "text"]).nullable(),
  supportUsed: z.boolean(),
  latencyMs: z.number().finite().min(0).max(60 * 60 * 1000),
});

export type NếpPracticeSubmission = z.infer<typeof NếpPracticeSubmissionSchema>;

export type NếpPracticeEnvelope = {
  candidateId: string;
  lessonId: string;
  lessonVersion: number;
  actionId: string;
  kind: LessonAction["kind"];
  modality: LessonAction["modality"];
  title: string;
  instruction: string;
  prompt: string | null;
  supportVi: string | null;
  changedContext: boolean;
};

export function resolveNếpLesson(lessonId: string, lessonVersion: number) {
  return lessonRegistryV1.find(
    (lesson) => lesson.id === lessonId && lesson.version === lessonVersion,
  ) ?? null;
}

export function resolveNếpAction(lessonId: string, lessonVersion: number, actionId: string) {
  const lesson = resolveNếpLesson(lessonId, lessonVersion);
  if (!lesson) return null;
  const action = lesson.actions.find((item) => item.id === actionId) ?? null;
  if (!action) return null;
  return { lesson, action };
}

/**
 * Resolve a planner candidate to a learner-safe presentation envelope.
 * Hidden evaluator targets, expected target signals, evidence type/target and remediation rules
 * are deliberately excluded from this DTO.
 */
export function resolveNếpPlannedPractice(candidateId: string): NếpPracticeEnvelope | null {
  const candidate = nepSessionCatalogV1.find((item) => item.id === candidateId);
  if (!candidate) return null;

  const lessonId = metadataString(candidate.metadata, "lessonId");
  const actionId = metadataString(candidate.metadata, "actionId");
  const versionValue = candidate.metadata?.lessonVersion;
  const lessonVersion = typeof versionValue === "number"
    ? versionValue
    : typeof versionValue === "string"
      ? Number(versionValue)
      : Number.NaN;
  if (!lessonId || !actionId || !Number.isInteger(lessonVersion)) return null;

  const resolved = resolveNếpAction(lessonId, lessonVersion, actionId);
  if (!resolved || !resolved.action.assessment?.evidenceType) return null;

  return {
    candidateId: candidate.id,
    lessonId: resolved.lesson.id,
    lessonVersion: resolved.lesson.version,
    actionId: resolved.action.id,
    kind: resolved.action.kind,
    modality: resolved.action.modality,
    title: resolved.action.title,
    instruction: resolved.action.instruction,
    prompt: resolved.action.prompt ?? null,
    supportVi: resolved.action.supportVi ?? null,
    changedContext: resolved.action.changedContext ?? false,
  };
}

/**
 * Server-authoritative compilation of one learner response.
 * The caller supplies only observed interaction data. Correctness, learning target, evidence type,
 * evaluator identity, reveal semantics and remediation metadata are all recomputed from canonical
 * content on the server.
 */
export function compileCanonicalNếpPracticeAttempt(input: NếpPracticeSubmission) {
  const resolved = resolveNếpAction(input.lessonId, input.lessonVersion, input.actionId);
  if (!resolved?.action.assessment) return null;

  const evaluation = evaluateNếpAction(resolved.action, input.response);
  const feedback = feedbackForNếpEvaluation(resolved.action, evaluation);
  const record = toLearningAttemptRecord({
    lesson: resolved.lesson,
    action: resolved.action,
    response: input.response,
    responseSource: input.responseSource as NếpResponseSource,
    evaluation,
    supportUsed: input.supportUsed,
    latencyMs: input.latencyMs,
  });
  if (!record) return null;

  return {
    lesson: resolved.lesson,
    action: resolved.action,
    evaluation,
    feedback,
    record,
  };
}

function metadataString(metadata: Record<string, unknown> | undefined, key: string) {
  const value = metadata?.[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}
