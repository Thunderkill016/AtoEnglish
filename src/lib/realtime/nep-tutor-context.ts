import { resolveNếpAction } from "@/lib/nep/practice-execution.v1";
import type { LessonActionKind } from "@/lib/nep/lesson-contract";

const REALTIME_TUTOR_ACTION_KINDS = new Set<LessonActionKind>([
  "produce",
  "repair",
  "transfer",
]);

export type NếpRealtimeTutorIdentity = {
  lessonId: string;
  lessonVersion: number;
  actionId: string;
};

export type NếpRealtimeTutorContext = NếpRealtimeTutorIdentity & {
  mission: string;
  learnerCanDo: string;
  actionKind: "produce" | "repair" | "transfer";
  instruction: string;
  partnerCue: string;
  changedContext: boolean;
};

/**
 * Resolve a browser-supplied task identity back to canonical Nếp content on the server.
 *
 * Deliberately excludes targetSignals, requiredSignalGroups, evidence type and evaluator metadata.
 * The realtime model is a conversation partner, not a grader and not a source of mastery truth.
 */
export function resolveNếpRealtimeTutorContext(
  identity: NếpRealtimeTutorIdentity,
): NếpRealtimeTutorContext | null {
  const resolved = resolveNếpAction(
    identity.lessonId,
    identity.lessonVersion,
    identity.actionId,
  );
  if (!resolved) return null;

  const { lesson, action } = resolved;
  if (
    action.modality !== "speech" ||
    !REALTIME_TUTOR_ACTION_KINDS.has(action.kind) ||
    !action.prompt
  ) {
    return null;
  }

  return {
    lessonId: lesson.id,
    lessonVersion: lesson.version,
    actionId: action.id,
    mission: lesson.mission,
    learnerCanDo: lesson.learnerCanDo,
    actionKind: action.kind as NếpRealtimeTutorContext["actionKind"],
    instruction: action.instruction,
    partnerCue: action.prompt,
    changedContext: action.changedContext ?? false,
  };
}

/**
 * Build roleplay instructions from learner-visible/canonical task context only.
 * Hidden answer keys never need to enter the voice-model prompt.
 */
export function buildNếpRealtimeTutorInstructions(
  context: NếpRealtimeTutorContext,
): string {
  return [
    "You are AtoEnglish's realtime English roleplay partner, not the teacher or grader.",
    `Mission: ${context.mission}`,
    `Learner can-do target: ${context.learnerCanDo}`,
    `Current interaction type: ${context.actionKind}${context.changedContext ? " in a changed transfer context" : ""}.`,
    `Task instruction: ${context.instruction}`,
    `Partner cue: ${context.partnerCue}`,
    "When the session asks you to respond before the learner has spoken, begin the roleplay with one short natural English turn based on the partner cue.",
    "If the partner cue contains brackets or stage directions, act them out naturally; never read bracketed text aloud.",
    "Then listen. Let a beginner pause while formulating an answer.",
    "After the learner's turn, respond as the conversation partner in at most one short sentence, then stop and wait.",
    "If the learner asks you to repeat or slow down, do so naturally without teaching the target phrase.",
    "Do not correct, coach, reveal an ideal answer, explain grammar, score pronunciation, praise correctness, or declare mastery.",
    "Do not invent learner progress. AtoEnglish's trusted server evaluates the captured learner response separately.",
  ].join(" ");
}
