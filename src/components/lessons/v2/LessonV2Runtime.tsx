"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  loadEarliestRemoteLessonCompletion,
  persistLessonEvidence,
  type EvidenceSyncResult,
} from "../../../lib/lessons/v2/lesson-evidence-client";
import type { LessonSessionKind } from "../../../lib/lessons/v2/lesson-registry";
import {
  earliestCompletionTimestamp,
  evaluateReviewAvailability,
  type LessonAvailability,
  type ReviewUnlockRule,
} from "../../../lib/lessons/v2/review-unlock";
import {
  lessonSessionStorageKey,
  normaliseLessonSessionState,
  type LessonSessionState,
} from "../../../lib/lessons/v2/session-progress";
import type { LessonV2 } from "../../../lib/lessons/v2/schema";
import { LessonV2Runner } from "./LessonV2Runner";

interface LessonV2RuntimeProps {
  lesson: LessonV2;
  moduleId: string;
  sessionKind: LessonSessionKind;
  sessionLabel: string;
  nextLessonId?: string;
  unlockRule?: ReviewUnlockRule;
  nextReviewDelayHours?: number;
}

type AvailabilityState = LessonAvailability | { status: "checking" };

type SyncState =
  | { status: "idle" }
  | { status: "saving" }
  | EvidenceSyncResult;

function completionSyncKey(lessonId: string, completedAt: string): string {
  return `ato.lesson-v2.synced.${lessonId}.${completedAt}`;
}

function migrateLegacyLocalSession(lessonId: string): void {
  const currentKey = lessonSessionStorageKey(lessonId);
  if (window.localStorage.getItem(currentKey)) return;

  const legacyKey = `ato.lesson-v2.1.${lessonId}`;
  const raw = window.localStorage.getItem(legacyKey);
  if (!raw) return;

  try {
    const candidate = JSON.parse(raw) as Record<string, unknown>;
    if (candidate.version !== 1 || candidate.lessonId !== lessonId) return;

    const migrated = normaliseLessonSessionState(
      {
        ...candidate,
        version: 2,
        completedAt:
          candidate.completed === true
            ? candidate.completedAt ?? candidate.updatedAt
            : undefined,
      },
      lessonId,
    );
    window.localStorage.setItem(currentKey, JSON.stringify(migrated));
  } catch {
    // Ignore malformed legacy state; the runner will create a clean session.
  }
}

function readLocalCompletion(lessonId: string): string | undefined {
  migrateLegacyLocalSession(lessonId);
  const raw = window.localStorage.getItem(lessonSessionStorageKey(lessonId));
  if (!raw) return undefined;

  try {
    const state = normaliseLessonSessionState(JSON.parse(raw), lessonId);
    if (!state.completed) return undefined;
    return state.completedAt ?? state.updatedAt;
  } catch {
    return undefined;
  }
}

function formatUnlockTime(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function LessonV2Runtime({
  lesson,
  moduleId,
  sessionKind,
  sessionLabel,
  nextLessonId,
  unlockRule,
  nextReviewDelayHours,
}: LessonV2RuntimeProps) {
  const [availability, setAvailability] =
    useState<AvailabilityState>({ status: "checking" });
  const [syncState, setSyncState] = useState<SyncState>({ status: "idle" });
  const syncingRef = useRef(false);
  const lastFailedAttemptRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    let unlockTimer: number | undefined;

    async function resolveAvailability() {
      migrateLegacyLocalSession(lesson.id);

      for (const prerequisiteLessonId of lesson.prerequisiteLessonIds) {
        const localCompletedAt = readLocalCompletion(prerequisiteLessonId);
        const remote = await loadEarliestRemoteLessonCompletion(
          prerequisiteLessonId,
        );
        const completedAt = earliestCompletionTimestamp([
          localCompletedAt,
          remote?.completedAt,
        ]);
        const delayHours =
          unlockRule?.prerequisiteLessonId === prerequisiteLessonId
            ? unlockRule.delayHours
            : 0;
        const decision = evaluateReviewAvailability(
          { prerequisiteLessonId, delayHours },
          completedAt,
        );

        if (decision.status === "locked") {
          if (!cancelled) setAvailability(decision);

          if (decision.reason === "delay" && decision.unlockAt) {
            const remainingMs = Math.max(
              0,
              Date.parse(decision.unlockAt) - Date.now(),
            );
            unlockTimer = window.setTimeout(
              () => void resolveAvailability(),
              Math.min(remainingMs + 100, 2_147_483_647),
            );
          }
          return;
        }
      }

      if (!cancelled) setAvailability({ status: "available" });
    }

    void resolveAvailability();
    return () => {
      cancelled = true;
      if (unlockTimer !== undefined) window.clearTimeout(unlockTimer);
    };
  }, [lesson, unlockRule]);

  useEffect(() => {
    if (availability.status !== "available") return;

    const intervalId = window.setInterval(() => {
      if (syncingRef.current) return;
      if (Date.now() - lastFailedAttemptRef.current < 30_000) return;

      const raw = window.localStorage.getItem(
        lessonSessionStorageKey(lesson.id),
      );
      if (!raw) return;

      let state: LessonSessionState;
      try {
        state = normaliseLessonSessionState(JSON.parse(raw), lesson.id);
      } catch {
        return;
      }

      if (!state.completed) return;
      const completedAt = state.completedAt ?? state.updatedAt;
      const markerKey = completionSyncKey(lesson.id, completedAt);
      const syncedActor = window.localStorage.getItem(markerKey);
      if (syncedActor === "authenticated" || syncedActor === "anonymous") {
        setSyncState((current) =>
          current.status === "saved" && current.actor === syncedActor
            ? current
            : { status: "saved", actor: syncedActor },
        );
        return;
      }

      syncingRef.current = true;
      setSyncState({ status: "saving" });
      const nextReviewAt = nextReviewDelayHours
        ? new Date(
            Date.parse(completedAt) + nextReviewDelayHours * 60 * 60 * 1000,
          ).toISOString()
        : undefined;

      void persistLessonEvidence({
        lesson,
        moduleId,
        sessionKind,
        state,
        nextReviewAt,
      }).then((result) => {
        syncingRef.current = false;
        setSyncState(result);

        if (result.status === "saved") {
          window.localStorage.setItem(markerKey, result.actor);
        } else {
          lastFailedAttemptRef.current = Date.now();
        }
      });
    }, 1_000);

    return () => window.clearInterval(intervalId);
  }, [
    availability.status,
    lesson,
    moduleId,
    nextReviewDelayHours,
    sessionKind,
  ]);

  if (availability.status === "checking") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-slate-600">Đang kiểm tra điều kiện mở bài…</p>
        </div>
      </main>
    );
  }

  if (availability.status === "locked") {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Bài chưa mở
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">
            {availability.reason === "delay"
              ? "Não cần thời gian trước khi kiểm tra nhớ lại"
              : "Cần hoàn thành bài trước"}
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            {availability.reason === "delay" && availability.unlockAt
              ? `Bài này mở vào ${formatUnlockTime(availability.unlockAt)}. Đây là delayed recall thật, không phải luyện lại ngay.`
              : "Hoàn thành bài tiên quyết trước để evidence phản ánh đúng thứ tự học."}
          </p>
          <Link
            href="/learn-v2"
            className="mt-6 inline-flex rounded-xl bg-slate-950 px-5 py-3 font-semibold text-white"
          >
            Về danh sách bài
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <LessonV2Runner
        lesson={lesson}
        sessionLabel={sessionLabel}
        nextLessonId={nextLessonId}
      />
      <div className="fixed bottom-4 right-4 z-40 max-w-xs rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 text-xs shadow-lg backdrop-blur">
        {syncState.status === "idle" && "Tiến trình đang lưu trên thiết bị."}
        {syncState.status === "saving" && "Đang lưu evidence lên Supabase…"}
        {syncState.status === "saved" &&
          (syncState.actor === "authenticated"
            ? "Evidence đã đồng bộ với tài khoản."
            : "Evidence ẩn danh đã lưu lên Supabase.")}
        {syncState.status === "failed" &&
          "Đã lưu trên thiết bị; Supabase sẽ tự thử lại."}
      </div>
    </>
  );
}
