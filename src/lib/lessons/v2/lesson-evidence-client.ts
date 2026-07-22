"use client";

import { createUntypedClient } from "../../supabase/client";
import type { LessonSessionKind } from "./lesson-registry";
import type { LessonSessionState } from "./session-progress";
import type { LessonV2 } from "./schema";

const ANONYMOUS_ID_STORAGE_KEY = "ato.lesson-v2.anonymous-id";

export interface PersistLessonEvidenceInput {
  lesson: LessonV2;
  moduleId: string;
  sessionKind: LessonSessionKind;
  state: LessonSessionState;
  nextReviewAt?: string;
}

export interface LessonCompletionEvidence {
  completedAt: string;
  nextReviewAt?: string;
}

export type EvidenceSyncResult =
  | { status: "saved"; actor: "authenticated" | "anonymous" }
  | { status: "failed"; message: string };

function fallbackUuid(): string {
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  return [
    hex.slice(0, 4).join(""),
    hex.slice(4, 6).join(""),
    hex.slice(6, 8).join(""),
    hex.slice(8, 10).join(""),
    hex.slice(10, 16).join(""),
  ].join("-");
}

export function getOrCreateLessonAnonymousId(): string {
  const existing = window.localStorage.getItem(ANONYMOUS_ID_STORAGE_KEY);
  if (existing) return existing;

  const anonymousId =
    typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : fallbackUuid();
  window.localStorage.setItem(ANONYMOUS_ID_STORAGE_KEY, anonymousId);
  return anonymousId;
}

export function buildLessonEvidence(
  lesson: LessonV2,
  state: LessonSessionState,
): Record<string, unknown> {
  const completedAt = state.completedAt ?? state.updatedAt;
  const durationSeconds = Math.max(
    0,
    Math.round((Date.parse(completedAt) - Date.parse(state.startedAt)) / 1000),
  );

  return {
    schemaVersion: lesson.schemaVersion,
    completedStepIds: state.completedStepIds,
    correctExerciseIds: state.correctExerciseIds,
    performanceAttempts: state.performanceAttempts,
    coreTargetIds: lesson.targets
      .filter((target) => target.priority === "core")
      .map((target) => target.id),
    startedAt: state.startedAt,
    durationSeconds,
  };
}

export async function persistLessonEvidence({
  lesson,
  moduleId,
  sessionKind,
  state,
  nextReviewAt,
}: PersistLessonEvidenceInput): Promise<EvidenceSyncResult> {
  try {
    const supabase = createUntypedClient();
    const { data: sessionData } = await supabase.auth.getSession();
    let userId: string | null = null;

    if (sessionData.session) {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        return {
          status: "failed",
          message: userError?.message ?? "Unable to verify the signed-in user",
        };
      }
      userId = userData.user.id;
    }

    const anonymousId = getOrCreateLessonAnonymousId();
    const completedAt = state.completedAt ?? state.updatedAt;

    const { error } = await supabase.from("lesson_v2_evidence").insert({
      user_id: userId,
      anonymous_id: anonymousId,
      lesson_id: lesson.id,
      module_id: moduleId,
      session_kind: sessionKind,
      evidence: buildLessonEvidence(lesson, state),
      completed_at: completedAt,
      next_review_at: nextReviewAt ?? null,
      source: "lesson-v2-web",
    });

    if (error && error.code !== "23505") {
      return { status: "failed", message: error.message };
    }

    return {
      status: "saved",
      actor: userId ? "authenticated" : "anonymous",
    };
  } catch (error) {
    return {
      status: "failed",
      message: error instanceof Error ? error.message : "Unknown evidence error",
    };
  }
}

export async function loadEarliestRemoteLessonCompletion(
  lessonId: string,
): Promise<LessonCompletionEvidence | undefined> {
  try {
    const supabase = createUntypedClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return undefined;

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) return undefined;

    const { data, error } = await supabase
      .from("lesson_v2_evidence")
      .select("completed_at,next_review_at")
      .eq("user_id", userData.user.id)
      .eq("lesson_id", lessonId)
      .order("completed_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) return undefined;

    return {
      completedAt: data.completed_at,
      nextReviewAt: data.next_review_at ?? undefined,
    };
  } catch {
    return undefined;
  }
}
