"use client";

import { IPOR_META, type IporPhase } from "@/lib/lessons/learning-flow";

const PHASES: IporPhase[] = ["input", "processing", "output", "review"];

interface LessonPhaseBarProps {
  currentPhase: IporPhase;
  goalVi?: string;
}

export default function LessonPhaseBar({ currentPhase, goalVi }: LessonPhaseBarProps) {
  const activeIdx = PHASES.indexOf(currentPhase);

  return (
    <div className="mt-2 space-y-1.5">
      <div
        className="flex items-center gap-1"
        role="tablist"
        aria-label="Giai đoạn IPOR"
      >
        {PHASES.map((phase, i) => {
          const meta = IPOR_META[phase];
          const isActive = phase === currentPhase;
          const isPast = i < activeIdx;
          return (
            <div key={phase} className="flex-1 flex items-center gap-1 min-w-0">
              <div
                role="tab"
                aria-selected={isActive}
                className={`flex-1 text-center text-[9px] sm:text-[10px] font-bold px-1 py-1 rounded-lg border transition-all truncate ${
                  isActive
                    ? meta.activeColor
                    : isPast
                      ? "text-emerald-600/70 bg-emerald-950/20 border-emerald-900/30"
                      : `${meta.color} bg-zinc-900/40 border-zinc-800/40`
                }`}
              >
                {meta.labelVi}
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className={`w-1 h-px shrink-0 ${isPast ? "bg-emerald-700/50" : "bg-zinc-800"}`}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      {goalVi && (
        <p className="text-[10px] text-zinc-500 leading-snug px-0.5">
          <span className="text-zinc-600 font-bold">Mục tiêu: </span>
          {goalVi}
        </p>
      )}
    </div>
  );
}