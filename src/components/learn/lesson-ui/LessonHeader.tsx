"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import LessonPhaseBar from "../LessonPhaseBar";
import { SECTION_LABELS, SECTION_ORDER, type SectionNumber } from "@/lib/lessons/learning-flow";
import type { IporPhase } from "@/lib/lessons/learning-flow";

interface LessonHeaderProps {
  level: string;
  title: string;
  unitId: string;
  section: number;
  sectionOrderIdx: number;
  totalSections: number;
  currentPhase: IporPhase;
  sectionGoal: string;
  sessionXp: number;
  xpPopup: { id: number; value: number } | null;
  miniSession: boolean;
  onStartMiniSession: () => void;
  onClearProgress: () => void;
}

export default function LessonHeader({
  level,
  title,
  unitId,
  section,
  sectionOrderIdx,
  totalSections,
  currentPhase,
  sectionGoal,
  sessionXp,
  xpPopup,
  miniSession,
  onStartMiniSession,
  onClearProgress,
}: LessonHeaderProps) {
  const progressPct = Math.round((sectionOrderIdx / Math.max(totalSections - 1, 1)) * 100);
  const sectionLabel = SECTION_LABELS[section] ?? "Học";

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/90 backdrop-blur-xl">
      <div className="max-w-3xl mx-auto px-4 py-3">
        {/* Top row */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            aria-label="Về Dashboard"
            className="shrink-0 flex size-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
              {level}
            </p>
            <p className="text-sm font-semibold text-zinc-100 truncate">{title}</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {sessionXp > 0 && (
              <div className="relative text-[11px] font-black px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                ⚡ {sessionXp}
                {xpPopup && (
                  <span
                    key={xpPopup.id}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black text-emerald-300 animate-bounce pointer-events-none"
                  >
                    +{xpPopup.value}
                  </span>
                )}
              </div>
            )}

            {miniSession ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-amber-500/15 border border-amber-500/35 text-amber-300">
                  Ôn nhanh
                </span>
                <Link
                  href={`/learn/${unitId}`}
                  onClick={onClearProgress}
                  className="text-[10px] font-bold text-zinc-500 hover:text-emerald-400 whitespace-nowrap"
                >
                  Đầy đủ →
                </Link>
              </div>
            ) : (
              section < 8 && (
                <button
                  type="button"
                  onClick={onStartMiniSession}
                  className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors whitespace-nowrap"
                  title="Chỉ luyện tập + quiz ~5 phút"
                >
                  ⚡ Ôn nhanh
                </button>
              )
            )}
          </div>
        </div>

        {/* Current section */}
        <div className="mt-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-lg font-black text-white leading-tight">{sectionLabel}</p>
            <p className="text-[11px] text-zinc-500 tabular-nums">
              Bước {sectionOrderIdx + 1} / {totalSections}
            </p>
          </div>
          <p className="text-sm font-bold text-emerald-400 tabular-nums">{progressPct}%</p>
        </div>

        <LessonPhaseBar currentPhase={currentPhase} goalVi={sectionGoal} />

        {/* Segmented progress */}
        <div
          className="flex gap-1 mt-3"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tiến độ bài học ${progressPct}%`}
        >
          {SECTION_ORDER.map((secNum, i) => {
            const done = i < sectionOrderIdx;
            const current = i === sectionOrderIdx;
            return (
              <div
                key={secNum as SectionNumber}
                title={SECTION_LABELS[secNum]}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  current
                    ? "bg-gradient-to-r from-emerald-400 to-teal-400 shadow-[0_0_8px_rgba(52,211,153,0.45)]"
                    : done
                      ? "bg-emerald-700/80"
                      : "bg-zinc-800"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}