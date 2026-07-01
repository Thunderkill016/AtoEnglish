"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Play,
  BookOpen,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  STUDY_PHASES,
  DAILY_TIPS,
  getPhaseForLevel,
  getPhaseProgress,
} from "@/lib/constants/study-plan";
import { UNITS } from "@/lib/constants/units";
import {
  SecondaryPageShell,
  PrimaryRow,
  ListSection,
  StatLine,
} from "@/components/design-system";
import { cn } from "@/lib/utils";

interface Props {
  nextUnitRoute: string;
  nextUnitTitle?: string;
  userLevel: string;
  completedUnitIds: string[];
  startingUnitIndex?: number;
  placementCompleted?: boolean;
}

export default function RoadmapClient({
  nextUnitRoute,
  nextUnitTitle,
  userLevel,
  completedUnitIds,
  startingUnitIndex = 0,
  placementCompleted = false,
}: Props) {
  const currentPhase = getPhaseForLevel(userLevel);
  const [expandedPhase, setExpandedPhase] = useState<number>(currentPhase.id);
  const entryUnit = startingUnitIndex > 0 ? UNITS[startingUnitIndex] : null;
  const todayTip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length]!;
  const allUnits = UNITS.map((u) => ({ id: u.id, level: u.level }));

  // Guest local merge (consistent with dashboard for seamless self-study)
  const guestCompleted = typeof window !== 'undefined' ? (() => { try { return JSON.parse(localStorage.getItem('guest_completed_units') || '[]'); } catch { return []; } })() : [];
  const effectiveCompleted = Array.from(new Set([...(completedUnitIds || []), ...guestCompleted]));

  const overallProgress = getPhaseProgress(userLevel, effectiveCompleted, allUnits);

  return (
    <SecondaryPageShell
      title="Lộ trình"
      subtitle={`${userLevel} · ${currentPhase.title} · ${overallProgress.completed}/${overallProgress.total} unit`}
    >
      <div className="space-y-5 pb-16">
        {nextUnitTitle && (
          <PrimaryRow
            href={nextUnitRoute}
            label="Học tiếp"
            description={nextUnitTitle}
            icon={Play}
          />
        )}

        <div className="rounded-xl border border-border/60 bg-card px-4">
          <StatLine
            label="Giai đoạn hiện tại"
            value={currentPhase.title}
            caption={`${currentPhase.months} · ${currentPhase.cefrFrom} → ${currentPhase.cefrTo}`}
          />
          {placementCompleted && entryUnit && (
            <StatLine
              label="Điểm bắt đầu"
              value={entryUnit.title}
              caption="Đã xác định trình độ"
            />
          )}
        </div>

        <p className="px-1 text-[var(--minimal-caption-size)] text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Tip: </span>
          {todayTip}
        </p>

        <ListSection title="4 giai đoạn">
          {STUDY_PHASES.map((phase) => {
            const phaseUnits = UNITS.filter((u) =>
              phase.unitLevels.includes(u.level)
            );
            const done = phaseUnits.filter((u) =>
              completedUnitIds.includes(u.id)
            ).length;
            const isOpen = expandedPhase === phase.id;
            const isCurrent = phase.id === currentPhase.id;

            return (
              <div
                key={phase.id}
                className={cn(
                  "rounded-xl border border-border/60 overflow-hidden",
                  isCurrent && "ring-1 ring-primary/20"
                )}
              >
                <button
                  type="button"
                  onClick={() =>
                    setExpandedPhase(isOpen ? -1 : phase.id)
                  }
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors"
                >
                  <span className="text-xl shrink-0">{phase.emoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[var(--minimal-body-size)] font-semibold text-foreground">
                      {phase.title}
                    </span>
                    <span className="block text-[var(--minimal-caption-size)] text-muted-foreground mt-0.5">
                      {phase.months} · {done}/{phaseUnits.length} unit
                    </span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-border/50 px-2 py-2 space-y-1">
                    <p className="px-2 py-1 text-[var(--minimal-caption-size)] text-muted-foreground">
                      {phase.goal}
                    </p>
                    {phaseUnits.map((unit) => {
                      const meta = UNITS.find((u) => u.id === unit.id);
                      if (!meta) return null;
                      const completed = completedUnitIds.includes(unit.id);
                      const Icon = completed ? CheckCircle2 : Circle;
                      return (
                        <PrimaryRow
                          key={unit.id}
                          href={meta.route}
                          label={meta.title}
                          description={`${meta.level}${completed ? " · Xong" : ""}`}
                          icon={completed ? CheckCircle2 : BookOpen}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </ListSection>
      </div>
    </SecondaryPageShell>
  );
}