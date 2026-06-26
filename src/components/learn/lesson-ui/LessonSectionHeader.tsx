"use client";

import { getSectionGoalVi, getSectionPhase } from "@/lib/lessons/learning-flow";
import { getSectionTheme, phaseIconColor } from "./theme";
import { cn } from "@/lib/utils";

interface LessonSectionHeaderProps {
  sectionId: number;
  sectionOrderIdx: number;
  totalSections: number;
  subtitle?: string;
  className?: string;
}

export default function LessonSectionHeader({
  sectionId,
  sectionOrderIdx,
  totalSections,
  subtitle,
  className,
}: LessonSectionHeaderProps) {
  const theme = getSectionTheme(sectionId);
  const phase = getSectionPhase(sectionId);
  const goal = getSectionGoalVi(sectionId);
  const Icon = theme.icon;

  return (
    <header className={cn("mb-6", className)}>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-2xl border",
            phaseIconColor(phase),
            "bg-zinc-900/80 border-zinc-800/80"
          )}
        >
          <Icon size={22} strokeWidth={2.25} />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {theme.title}
            </h1>
            <span className="text-[10px] font-bold text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full tabular-nums">
              {sectionOrderIdx + 1}/{totalSections}
            </span>
          </div>
          <p className="text-xs text-zinc-500">
            {theme.duration}
            {subtitle ? ` · ${subtitle}` : goal ? ` · ${goal}` : ""}
          </p>
        </div>
      </div>
    </header>
  );
}