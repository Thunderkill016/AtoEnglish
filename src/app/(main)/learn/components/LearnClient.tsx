"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Target,
  Map,
} from "lucide-react";
import {
  Screen,
  Surface,
  AppButton,
  PageHeader,
  Chip,
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
    <Screen ato ambient>
      <div className="space-y-6 pb-16">
        <div className="space-y-3">
          <Chip tone="brand" className="tracking-widest">
            <BookOpen className="size-3.5" aria-hidden />
            50 unit · {userLevel}
          </Chip>
          <PageHeader
            eyebrow="Học"
            title="Bài học"
            subtitle={`${completedCount}/50 hoàn thành · ${totalXp.toLocaleString()} XP`}
          />
        </div>

        {showPlacement && (
          <Surface
            variant="success"
            className="p-5 border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-zinc-900/40"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-zinc-950/50 border border-white/10">
                <Target className="size-5 text-emerald-400" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-100">
                  Xác định trình độ
                </p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  Mở đúng bài — không cần học lại từ đầu
                </p>
              </div>
            </div>
            <AppButton href="/placement-test" fullWidth size="md">
              Làm placement test
              <Target className="size-4" aria-hidden />
            </AppButton>
          </Surface>
        )}

        <section className="space-y-2" aria-label="Danh sách unit">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-sm font-bold text-zinc-200">50 unit IPOR</h2>
            <Link
              href="/roadmap"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              <Map className="size-3.5" aria-hidden />
              Lộ trình
            </Link>
          </div>

          <ul className="space-y-2">
            {unitStatuses.map((unit, index) => {
              const isCompleted = completedUnitIds.includes(unit.id);
              const isUnlocked = isUnitUnlocked(
                index,
                startingUnitIndex,
                completedUnitIds,
                unitIds,
              );
              const isPlacedOut = isPlacedOutUnit(
                index,
                startingUnitIndex,
                completedUnitIds,
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

              return (
                <li key={unit.id}>
                  {levelBreak && (
                    <p className="px-1 pt-3 pb-1.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                      {unit.level}
                    </p>
                  )}

                  {!isUnlocked ? (
                    <Surface
                      className="flex min-h-12 items-center gap-3 px-4 py-3 rounded-2xl opacity-60"
                      data-testid={`unit-locked-${unit.id}`}
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-zinc-800/80 text-zinc-500">
                        <Lock className="size-4" aria-hidden />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-semibold text-zinc-500 truncate">
                          {unit.title}
                        </span>
                        <span className="block text-[11px] text-zinc-600 mt-0.5">
                          Chưa mở khóa
                        </span>
                      </span>
                    </Surface>
                  ) : (
                    <Link href={unit.route} className="block group">
                      <Surface
                        variant="interactive"
                        className="flex min-h-12 items-center gap-3 px-4 py-3 rounded-2xl"
                        data-testid={`unit-row-${unit.id}`}
                      >
                        <span
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                            isCompleted
                              ? "bg-emerald-500/15 border-emerald-500/25 text-emerald-400"
                              : "bg-zinc-950/50 border-white/10 text-teal-300",
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="size-4" aria-hidden />
                          ) : (
                            <BookOpen className="size-4" aria-hidden />
                          )}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-semibold text-zinc-100 truncate">
                            {unit.title}
                          </span>
                          <span className="block text-[11px] text-zinc-500 mt-0.5 truncate">
                            {description}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "text-[11px] font-bold shrink-0",
                            isCompleted
                              ? "text-emerald-400"
                              : "text-zinc-500 group-hover:text-teal-400",
                          )}
                        >
                          {isCompleted ? "Xong" : "Mở"}
                        </span>
                      </Surface>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {startingUnitIndex > 0 && (
          <p className="px-1 text-[11px] text-zinc-500 leading-relaxed">
            Bạn bắt đầu từ unit phù hợp trình độ — các bài trước vẫn mở để ôn.{" "}
            <Link
              href="/roadmap"
              className="text-emerald-400 font-semibold hover:text-emerald-300 underline-offset-2 hover:underline"
            >
              Xem lộ trình
            </Link>
          </p>
        )}
      </div>
    </Screen>
  );
}
