"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Play } from "lucide-react";
import { CORE_PATH_PLAN, CORE_PATH_TOTAL } from "@/lib/v2/path";
import {
  countAuthoredOnCorePath,
  getLessonV2,
  isPathLessonOpenable,
} from "@/lib/v2/lessons";
import {
  getCompletedIdsSnapshot,
  getServerCompletedIdsSnapshot,
  subscribeV2Progress,
} from "@/lib/v2/progress";
import { learnPathForLesson } from "@/lib/v2/flag";
import { cn } from "@/lib/utils";

const PHASE_META: Record<
  string,
  { title: string; accent: string; ring: string }
> = {
  P0: {
    title: "Nền tảng A0",
    accent: "text-sky-400",
    ring: "border-sky-500/30 bg-sky-500/10",
  },
  P1: {
    title: "Đời sống A1",
    accent: "text-emerald-400",
    ring: "border-emerald-500/30 bg-emerald-500/10",
  },
  P2: {
    title: "Chức năng A2 · cổng giữa",
    accent: "text-violet-400",
    ring: "border-violet-500/30 bg-violet-500/10",
  },
  P3: {
    title: "Độc lập B1 ★ đích",
    accent: "text-amber-400",
    ring: "border-amber-500/30 bg-amber-500/10",
  },
};

function pathHeaderCopy(authored: number, total: number): string {
  if (authored >= total) {
    return `${total} bài đầy đủ · A0 → B1 Independent User. Học theo thứ tự; bài đã xong có thể ôn lại.`;
  }
  return `${authored}/${total} bài sẵn sàng · A0 → B1. Học theo thứ tự; bài chưa mở sẽ khóa đến khi hoàn thành bài trước.`;
}

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
  const completedList = useMemo(() => Array.from(done), [done]);
  const authoredCount = useMemo(() => countAuthoredOnCorePath(), []);

  const phases = ["P0", "P1", "P2", "P3"] as const;

  return (
    <div className="relative mx-auto max-w-lg min-h-[calc(100dvh-4rem)] px-4 py-8 pb-28 sm:px-6 overflow-x-hidden">
      <div className="pointer-events-none absolute top-10 left-1/2 -z-10 h-[200px] w-[80%] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-[80px]" />

      <header className="space-y-3 mb-8">
        <Link
          href="/home"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-zinc-50">
          Lộ trình{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            B1
          </span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          {pathHeaderCopy(authoredCount, CORE_PATH_TOTAL)}
        </p>
      </header>

      <div className="space-y-8">
        {phases.map((phase, pi) => {
          const items = CORE_PATH_PLAN.filter((l) => l.phase === phase);
          const pm = PHASE_META[phase];
          const phaseDone = items.filter((i) => done.has(i.id)).length;
          return (
            <motion.section
              key={phase}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pi * 0.06, duration: 0.35 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div
                  className={cn(
                    "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold",
                    pm.ring,
                    pm.accent,
                  )}
                >
                  {pm.title}
                </div>
                <span className="text-[11px] tabular-nums text-zinc-500">
                  {phaseDone}/{items.length}
                </span>
              </div>
              <ul className="relative space-y-1.5 pl-2 border-l border-zinc-800 ml-2">
                {items.map((item) => {
                  const hasContent = Boolean(getLessonV2(item.id));
                  const completed = done.has(item.id);
                  const openable = isPathLessonOpenable(item.id, completedList);
                  const row = (
                    <div
                      className={cn(
                        "relative ml-4 flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition",
                        openable
                          ? "border-zinc-800/80 bg-zinc-900/70 hover:border-emerald-500/35 hover:bg-zinc-900"
                          : "border-transparent bg-zinc-950/40 opacity-45",
                      )}
                    >
                      <span
                        className={cn(
                          "absolute -left-[1.4rem] flex size-5 items-center justify-center rounded-full border text-[10px]",
                          completed
                            ? "border-emerald-500 bg-emerald-500 text-zinc-950"
                            : openable
                              ? "border-teal-500/50 bg-zinc-900 text-teal-400"
                              : "border-zinc-700 bg-zinc-900 text-zinc-600",
                        )}
                      >
                        {completed ? (
                          <Check className="size-3" strokeWidth={3} />
                        ) : openable ? (
                          <Play className="size-2.5 fill-current" />
                        ) : (
                          <Lock className="size-2.5" />
                        )}
                      </span>
                      <span className="w-6 shrink-0 text-[11px] tabular-nums text-zinc-600">
                        {item.order}
                      </span>
                      <span
                        className={cn(
                          "flex-1 font-medium",
                          openable ? "text-zinc-100" : "text-zinc-500",
                        )}
                      >
                        {item.title_vi}
                      </span>
                      {!hasContent && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                          soon
                        </span>
                      )}
                      {hasContent && !openable && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-zinc-600">
                          khóa
                        </span>
                      )}
                    </div>
                  );
                  return (
                    <li key={item.id}>
                      {openable ? (
                        <Link href={learnPathForLesson(item.id)}>{row}</Link>
                      ) : (
                        row
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
}
