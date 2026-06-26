"use client";

import Link from "next/link";
import { BookOpen, CheckCircle, Lock, Target } from "lucide-react";
import {
  ListSection,
  PrimaryRow,
  SecondaryPageShell,
} from "@/components/design-system";
import {
  isPlacedOutUnit,
  isUnitUnlocked,
} from "@/lib/placement/starting-unit";
import { cn } from "@/lib/utils";

interface UnitStatus {
  id: string;
  title: string;
  description: string;
  level: string;
  route: string;
  xp: number;
  estimatedTime: number;
  completed: boolean;
  progress: number;
  vocabCount?: number;
  starCount?: number;
}

interface LearnClientProps {
  userLevel: string;
  totalXp: number;
  completedUnitIds: string[];
  activeUnitId: string;
  unitStatuses: UnitStatus[];
  startingUnitIndex?: number;
  placementCompleted?: boolean;
}

export default function LearnClient({
  userLevel,
  totalXp,
  completedUnitIds,
  unitStatuses,
  startingUnitIndex = 0,
  placementCompleted = false,
}: LearnClientProps) {
  const unitIds = unitStatuses.map((u) => u.id);
  const completedCount = completedUnitIds.length;

  const showPlacement =
    !placementCompleted && startingUnitIndex === 0 && completedCount === 0;

  return (
    <SecondaryPageShell
      title="Bài học"
      subtitle={`${completedCount}/50 hoàn thành · ${userLevel} · ${totalXp.toLocaleString()} XP`}
    >
      <div className="space-y-6 pb-16">
        {showPlacement && (
          <PrimaryRow
            href="/placement-test"
            label="Xác định trình độ"
            description="Mở đúng bài — không cần học lại từ đầu"
            icon={Target}
          />
        )}

        <ListSection title="50 unit IPOR">
          {unitStatuses.map((unit, index) => {
            const isCompleted = completedUnitIds.includes(unit.id);
            const isUnlocked = isUnitUnlocked(
              index,
              startingUnitIndex,
              completedUnitIds,
              unitIds
            );
            const isPlacedOut = isPlacedOutUnit(
              index,
              startingUnitIndex,
              completedUnitIds
            );

            const levelBreak =
              index > 0 && unit.level !== unitStatuses[index - 1]!.level;

            const description = [
              unit.level,
              isCompleted ? "Hoàn thành" : `${unit.progress}%`,
              isPlacedOut ? "Đã xác định" : null,
              `${unit.estimatedTime} phút`,
            ]
              .filter(Boolean)
              .join(" · ");

            if (!isUnlocked) {
              return (
                <div key={unit.id}>
                  {levelBreak && index > 0 && (
                    <p className="px-1 pt-4 pb-1 text-[var(--minimal-caption-size)] font-bold uppercase tracking-widest text-muted-foreground">
                      {unit.level}
                    </p>
                  )}
                  <div
                    className={cn(
                      "flex min-h-[var(--minimal-touch)] items-center gap-3 rounded-xl px-4 py-3",
                      "bg-muted/30 border border-border/40 opacity-60"
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <Lock className="size-4" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-[var(--minimal-body-size)] font-semibold text-muted-foreground truncate">
                        {unit.title}
                      </span>
                      <span className="block text-[var(--minimal-caption-size)] text-muted-foreground/80 mt-0.5">
                        Chưa mở khóa
                      </span>
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div key={unit.id}>
                {levelBreak && index > 0 && (
                  <p className="px-1 pt-4 pb-1 text-[var(--minimal-caption-size)] font-bold uppercase tracking-widest text-muted-foreground">
                    {unit.level}
                  </p>
                )}
                <PrimaryRow
                  href={unit.route}
                  label={unit.title}
                  description={description}
                  icon={isCompleted ? CheckCircle : BookOpen}
                />
              </div>
            );
          })}
        </ListSection>

        {startingUnitIndex > 0 && (
          <p className="px-1 text-[var(--minimal-caption-size)] text-muted-foreground">
            Bạn bắt đầu từ unit phù hợp trình độ — các bài trước vẫn mở để ôn.{" "}
            <Link href="/roadmap" className="text-primary font-semibold hover:underline">
              Xem lộ trình
            </Link>
          </p>
        )}
      </div>
    </SecondaryPageShell>
  );
}