"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Map,
  Sparkles,
  Target,
  CheckCircle2,
  Circle,
} from "lucide-react";
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
import { cn } from "@/lib/utils";

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

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
  const pct = Math.min(100, Math.round((done / CORE_PATH_TOTAL) * 100));
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <div className="relative mx-auto max-w-lg min-h-[calc(100dvh-4rem)] px-4 py-8 pb-28 sm:px-6 overflow-x-hidden">
      {/* Ambient brand glow */}
      <div className="pointer-events-none absolute top-0 right-0 -z-10 h-[280px] w-[50vw] max-w-[360px] rounded-full bg-emerald-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-24 left-0 -z-10 h-[220px] w-[220px] rounded-full bg-teal-500/8 blur-[90px]" />

      <motion.header {...fade} className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
          <Sparkles className="size-3.5" />
          Lộ trình B1 · v2
        </div>
        <h1 className="text-3xl font-black tracking-tight text-zinc-50">
          {greeting}
          <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 bg-clip-text text-transparent">
            Hôm nay học gì?
          </span>
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
          {CORE_OUTCOME_PROMISE_VI}
        </p>
      </motion.header>

      {/* Progress to B1 */}
      <motion.section
        {...fade}
        transition={{ ...fade.transition, delay: 0.05 }}
        className="mb-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_40px_-12px_rgba(16,185,129,0.25)]"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25">
              <Target className="size-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-100">Tiến độ tới B1</p>
              <p className="text-[11px] text-zinc-500">
                {authored.length} bài sẵn sàng · {CORE_PATH_TOTAL} slot lộ trình
              </p>
            </div>
          </div>
          <span className="text-lg font-black tabular-nums text-emerald-400">
            {done}
            <span className="text-zinc-600 text-sm font-bold">/{CORE_PATH_TOTAL}</span>
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-zinc-800/80 overflow-hidden ring-1 ring-white/5">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">{pct}% hoàn thành (pilot)</p>
      </motion.section>

      {/* Primary CTA card */}
      <motion.section
        {...fade}
        transition={{ ...fade.transition, delay: 0.1 }}
        className="mb-6 relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-zinc-900/40 p-5 sm:p-6 backdrop-blur-xl"
      >
        <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-emerald-400/20 blur-2xl" />
        <p className="relative text-[11px] font-bold uppercase tracking-widest text-emerald-400/90 mb-2">
          Việc duy nhất hôm nay
        </p>
        {continueLesson ? (
          <>
            <div className="relative flex items-start gap-3 mb-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-950/50 border border-white/10">
                <BookOpen className="size-5 text-teal-300" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-black text-zinc-50 leading-snug">
                  {continueLesson.title_vi}
                </h2>
                <p className="mt-1 text-sm text-zinc-400">
                  {meta
                    ? `Bài ${meta.order}/${CORE_PATH_TOTAL}`
                    : continueLesson.cefr}{" "}
                  · {continueLesson.cefr} · ~{continueLesson.estimatedMin} phút
                </p>
              </div>
            </div>
            <Link
              href={learnPathForLesson(continueId)}
              className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 text-sm font-black text-zinc-950 shadow-lg shadow-emerald-900/30 hover:brightness-110 active:scale-[0.98] transition"
            >
              {completedIds.includes(continueId) ? "Học lại bài này" : "Bắt đầu học"}
              <ArrowRight className="size-4" />
            </Link>
          </>
        ) : (
          <p className="relative text-sm text-zinc-300">
            Bạn đã xong các bài pilot. Thêm bài mới đang được build.
          </p>
        )}
      </motion.section>

      {/* Pilot list */}
      <motion.section
        {...fade}
        transition={{ ...fade.transition, delay: 0.15 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-zinc-200">Bài pilot</h3>
          <Link
            href="/path"
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
          >
            <Map className="size-3.5" />
            Lộ trình đầy đủ
          </Link>
        </div>
        <ul className="space-y-2">
          {authored.map((id, i) => {
            const lesson = getLessonV2(id);
            if (!lesson) return null;
            const doneItem = completedIds.includes(id);
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + i * 0.05 }}
              >
                <Link
                  href={learnPathForLesson(id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition",
                    "bg-zinc-900/60 border-zinc-800 hover:border-emerald-500/40 hover:bg-zinc-900/90",
                  )}
                >
                  {doneItem ? (
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="size-5 shrink-0 text-zinc-600 group-hover:text-emerald-500/60" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-100 truncate">
                      {lesson.title_vi}
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      {lesson.cefr} · ~{lesson.estimatedMin} phút
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-bold shrink-0",
                      doneItem ? "text-emerald-400" : "text-zinc-500 group-hover:text-teal-400",
                    )}
                  >
                    {doneItem ? "Xong" : "Mở"}
                  </span>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </motion.section>

      <p className="pt-4 text-center text-[11px] text-zinc-600">
        <Link href="/dashboard" className="hover:text-zinc-400 underline-offset-2 hover:underline">
          Dashboard cũ (v1)
        </Link>
      </p>
    </div>
  );
}
