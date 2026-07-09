"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { CORE_PATH_PLAN } from "@/lib/v2/path";
import { getLessonV2 } from "@/lib/v2/lessons";
import {
  getCompletedIdsSnapshot,
  getServerCompletedIdsSnapshot,
  subscribeV2Progress,
} from "@/lib/v2/progress";
import { learnPathForLesson } from "@/lib/v2/flag";
import { cn } from "@/lib/utils";

const PHASE_LABEL: Record<string, string> = {
  P0: "Nền tảng A0",
  P1: "Đời sống A1",
  P2: "Chức năng A2",
  P3: "Độc lập B1 ★",
};

export function PathClient() {
  const completedKey = useSyncExternalStore(
    subscribeV2Progress,
    getCompletedIdsSnapshot,
    getServerCompletedIdsSnapshot,
  );
  const done = useMemo(
    () => new Set(completedKey ? completedKey.split("\n").filter(Boolean) : []),
    [completedKey],
  );

  const phases = ["P0", "P1", "P2", "P3"] as const;

  return (
    <div className="mx-auto max-w-lg px-4 py-8 pb-28 space-y-6">
      <header className="space-y-2">
        <Link href="/home" className="text-sm text-zinc-500 hover:text-emerald-400">
          ← Home
        </Link>
        <h1 className="text-2xl font-bold text-zinc-50">Lộ trình tới B1</h1>
        <p className="text-sm text-zinc-400">
          42 bài · A0 → B1. Chỉ bài có nội dung (pilot) mở được.
        </p>
      </header>

      {phases.map((phase) => {
        const items = CORE_PATH_PLAN.filter((l) => l.phase === phase);
        return (
          <section key={phase} className="space-y-2">
            <h2 className="text-sm font-semibold text-emerald-400/90">
              {PHASE_LABEL[phase]} · {items.length} bài
              {phase === "P2" && (
                <span className="ml-2 text-xs text-zinc-500">→ cổng A2</span>
              )}
              {phase === "P3" && (
                <span className="ml-2 text-xs text-zinc-500">→ cổng B1</span>
              )}
            </h2>
            <ul className="space-y-1.5">
              {items.map((item) => {
                const hasContent = Boolean(getLessonV2(item.id));
                const completed = done.has(item.id);
                const inner = (
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm",
                      hasContent
                        ? "border-white/10 bg-white/5 hover:border-emerald-500/40"
                        : "border-transparent bg-zinc-900/40 opacity-50",
                    )}
                  >
                    <span className="w-6 text-xs text-zinc-500 tabular-nums">
                      {item.order}
                    </span>
                    <span className="flex-1 text-zinc-200">{item.title_vi}</span>
                    {completed && (
                      <span className="text-xs text-emerald-400">✓</span>
                    )}
                    {!hasContent && (
                      <span className="text-[10px] text-zinc-600">soon</span>
                    )}
                  </div>
                );
                return (
                  <li key={item.id}>
                    {hasContent ? (
                      <Link href={learnPathForLesson(item.id)}>{inner}</Link>
                    ) : (
                      inner
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
