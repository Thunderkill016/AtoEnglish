"use client";

import { IPOR_META, type IporPhase } from "@/lib/lessons/learning-flow";
import { cn } from "@/lib/utils";

const PHASES: IporPhase[] = ["input", "processing", "output", "review"];

interface LessonPhaseBarProps {
  currentPhase: IporPhase;
  goalVi?: string;
}

export default function LessonPhaseBar({ currentPhase, goalVi }: LessonPhaseBarProps) {
  const activeIdx = PHASES.indexOf(currentPhase);

  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex items-center gap-1.5" role="tablist" aria-label="Giai đoạn IPOR">
        {PHASES.map((phase, i) => {
          const meta = IPOR_META[phase];
          const isActive = phase === currentPhase;
          const isPast = i < activeIdx;
          return (
            <div
              key={phase}
              role="tab"
              aria-selected={isActive}
              className={cn(
                "flex-1 text-center text-[9px] sm:text-[10px] font-bold py-1.5 rounded-xl border transition-all",
                isActive && meta.activeColor,
                isPast && "text-emerald-500/80 bg-emerald-950/30 border-emerald-900/40",
                !isActive &&
                  !isPast &&
                  "text-zinc-600 bg-zinc-900/50 border-zinc-800/60"
              )}
            >
              {meta.labelVi}
            </div>
          );
        })}
      </div>
      {goalVi && (
        <p className="text-[11px] text-zinc-500 leading-snug">
          <span className="text-zinc-600 font-semibold">Mục tiêu bước này: </span>
          {goalVi}
        </p>
      )}
    </div>
  );
}