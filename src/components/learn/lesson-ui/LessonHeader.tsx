"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ThinProgress } from "@/components/design-system";
import { SECTION_LABELS } from "@/lib/lessons/learning-flow";

interface LessonHeaderProps {
  level: string;
  title: string;
  unitId: string;
  section: number;
  sectionOrderIdx: number;
  totalSections: number;
  sessionXp: number;
  xpPopup: { id: number; value: number } | null;
  miniSession: boolean;
  allowMiniSession: boolean;
  onStartMiniSession: () => void;
  onClearProgress: () => void;
}

/** Minimal lesson chrome — thin progress only (P3 / UI-005). IPOR logic unchanged in flow. */
export default function LessonHeader({
  level,
  title,
  unitId,
  section,
  sectionOrderIdx,
  totalSections,
  sessionXp,
  xpPopup,
  miniSession,
  allowMiniSession,
  onStartMiniSession,
  onClearProgress,
}: LessonHeaderProps) {
  const progressPct = Math.round((sectionOrderIdx / Math.max(totalSections - 1, 1)) * 100);
  const sectionLabel = SECTION_LABELS[section] ?? "Học";

  return (
    <div className="sticky top-0 z-40 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-xl">
      <div className="max-w-[var(--minimal-content-max)] mx-auto px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard"
            aria-label="Về trang Học"
            className="shrink-0 flex size-9 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </Link>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide truncate">
              {level}
            </p>
            <p className="text-sm font-semibold text-zinc-100 truncate">{title}</p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {sessionXp > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {sessionXp} XP
                {xpPopup && (
                  <span key={xpPopup.id} className="ml-0.5 text-emerald-300">
                    +{xpPopup.value}
                  </span>
                )}
              </span>
            )}
            {miniSession ? (
              <Link
                href={`/learn/${unitId}`}
                onClick={onClearProgress}
                className="text-[10px] font-bold text-zinc-500 hover:text-emerald-400 whitespace-nowrap"
              >
                Bài đầy đủ →
              </Link>
            ) : (
              allowMiniSession &&
              section < 8 && (
                <button
                  type="button"
                  onClick={onStartMiniSession}
                  className="text-[10px] font-medium text-zinc-500 hover:text-zinc-300"
                >
                  Ôn lại
                </button>
              )
            )}
          </div>
        </div>

        <div className="mt-2 pb-0.5">
          <p className="text-xs font-semibold text-zinc-300 mb-1 truncate">{sectionLabel}</p>
          <ThinProgress
            value={progressPct}
            label={`Bước ${sectionOrderIdx + 1}/${totalSections}`}
            className="[&_span]:text-zinc-500 [&_.bg-muted]:bg-zinc-800"
          />
        </div>
      </div>
    </div>
  );
}