"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CORE_PATH_TOTAL, getPathMeta } from "@/lib/v2/path";
import {
  getContinueLessonId,
  getLessonV2,
  listAuthoredLessonIds,
} from "@/lib/v2/lessons";
import {
  getCompletedIdsSnapshot,
  getServerCompletedIdsSnapshot,
  subscribeV2Progress,
} from "@/lib/v2/progress";
import { CORE_OUTCOME_PROMISE_VI } from "@/lib/constants/product-outcome";
import { learnPathForLesson } from "@/lib/v2/flag";

export function HomeClient() {
  const completedKey = useSyncExternalStore(
    subscribeV2Progress,
    getCompletedIdsSnapshot,
    getServerCompletedIdsSnapshot,
  );
  const completedIds = useMemo(
    () => (completedKey ? completedKey.split("\n").filter(Boolean) : []),
    [completedKey],
  );
  const done = completedIds.length;
  const continueId = getContinueLessonId(completedIds);
  const continueLesson = getLessonV2(continueId);
  const meta = getPathMeta(continueId);
  const authored = listAuthoredLessonIds();
  const pct = Math.round((done / CORE_PATH_TOTAL) * 100);

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-28 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
          AtoEnglish v2 · Lộ trình B1
        </p>
        <h1 className="text-2xl font-bold text-zinc-50">Hôm nay</h1>
        <p className="text-sm text-zinc-400 leading-relaxed">{CORE_OUTCOME_PROMISE_VI}</p>
      </header>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-zinc-300">Tiến độ tới B1</span>
          <span className="font-semibold text-emerald-400">
            {done}/{CORE_PATH_TOTAL}
          </span>
        </div>
        <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
        <p className="text-xs text-zinc-500">
          {authored.length} bài đã viết / {CORE_PATH_TOTAL} slot · hoàn thành lưu trên máy
        </p>
      </section>

      <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-400/90">
          Việc duy nhất hôm nay
        </p>
        {continueLesson ? (
          <>
            <h2 className="text-lg font-bold text-zinc-50">{continueLesson.title_vi}</h2>
            <p className="text-sm text-zinc-400">
              {meta
                ? `Bài ${meta.order} · ${continueLesson.cefr} · ~${continueLesson.estimatedMin} phút`
                : `~${continueLesson.estimatedMin} phút`}
            </p>
            <Link
              href={learnPathForLesson(continueId)}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-zinc-950"
            >
              {completedIds.includes(continueId) ? "Học lại" : "Bắt đầu học"} →
            </Link>
          </>
        ) : (
          <p className="text-sm text-zinc-300">
            Bạn đã xong các bài pilot. Thêm content P0–P3 đang được build.
          </p>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-zinc-300">Bài pilot có sẵn</h3>
        <ul className="space-y-2">
          {authored.map((id) => {
            const lesson = getLessonV2(id);
            const doneItem = completedIds.includes(id);
            if (!lesson) return null;
            return (
              <li key={id}>
                <Link
                  href={learnPathForLesson(id)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 text-sm hover:border-emerald-500/40 transition-colors"
                >
                  <span className="text-zinc-100">
                    <span className="text-zinc-500 mr-2">{lesson.cefr}</span>
                    {lesson.title_vi}
                  </span>
                  <span className={doneItem ? "text-emerald-400 text-xs" : "text-zinc-500 text-xs"}>
                    {doneItem ? "✓ Xong" : "Mở"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="flex gap-3 text-sm">
        <Link href="/path" className="text-emerald-400 hover:underline">
          Lộ trình đầy đủ
        </Link>
        <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300">
          Dashboard cũ
        </Link>
      </div>
    </div>
  );
}
