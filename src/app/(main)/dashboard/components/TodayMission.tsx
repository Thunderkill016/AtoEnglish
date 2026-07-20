import { StatLine } from "@/components/ui/page";
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import Link from "next/link";
import {
  ArrowRight,
  Zap,
  BookOpen,
  Star,
  CheckCircle2,
  Circle,
} from "lucide-react";

import {
  countCompletedMissions,
  type DailyMission,
} from "@/lib/dashboard/daily-missions";
import { cn } from "@/lib/utils";

interface TodayMissionProps {
  missions: DailyMission[];
}

/**
 * Unified daily mission hub — all completion flags synced from server.
 */
export default function TodayMission({ missions }: TodayMissionProps) {
  const primary = missions.find((m) => m.kind === "primary");
  const tasks = missions.filter((m) => m.kind !== "primary");
  const completedCount = countCompletedMissions(missions);
  const progressPct = missions.length
    ? Math.round((completedCount / missions.length) * 100)
    : 0;
  const allDone = completedCount === missions.length;

  return (
    <Card className="rounded-2xl overflow-hidden p-0">
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
              <Zap className="size-4 text-amber-500 fill-amber-500" />
            </span>
            <p className="text-xs font-black text-zinc-50 uppercase tracking-wider">
              Nhiệm vụ hôm nay
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-400">
            {completedCount}/{missions.length} hoàn thành
          </span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
        {primary && (
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
              Ưu tiên — làm trước
            </p>
            <Link
              href={primary.href}
              id="today-mission-primary"
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 group",
                primary.completed
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30",
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                  primary.completed
                    ? "border-emerald-500 bg-emerald-500"
                    : "border-emerald-600",
                )}
              >
                {primary.completed ? (
                  <CheckCircle2 className="size-4 text-white" />
                ) : (
                  <BookOpen className="size-3.5 text-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-xs font-bold truncate",
                    primary.completed
                      ? "line-through text-zinc-400"
                      : "text-zinc-50",
                  )}
                >
                  {primary.label}
                </p>
                {primary.detail && (
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {primary.detail}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                  <Star className="size-2.5 fill-current" />
                  +{primary.xp} XP
                </span>
                {!primary.completed && (
                  <ArrowRight className="size-3.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                )}
              </div>
            </Link>
          </div>
        )}

        <div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">
            Danh sách — tự động cập nhật từ tiến độ
          </p>
          <div className="space-y-1">
            {tasks.map((mission) => (
              <Link
                key={mission.id}
                href={mission.href}
                id={`today-mission-${mission.id}`}
                className={cn(
                  "flex items-center gap-3 py-2.5 px-3 rounded-xl border transition-all duration-150",
                  mission.completed
                    ? "border-zinc-800/40 bg-zinc-900/20 opacity-80"
                    : mission.kind === "bonus"
                      ? "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/8 hover:border-amber-500/30"
                      : "border-zinc-800/50 hover:bg-zinc-800/40",
                )}
              >
                <span className="shrink-0 text-emerald-400">
                  {mission.completed ? (
                    <CheckCircle2 className="size-4.5 fill-emerald-500 text-zinc-950" />
                  ) : (
                    <Circle className="size-4.5 text-zinc-600" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-xs font-semibold leading-snug",
                      mission.completed
                        ? "text-zinc-500 line-through"
                        : "text-zinc-200",
                    )}
                  >
                    {mission.label}
                  </p>
                  {mission.detail && !mission.completed && (
                    <p className="text-[10px] text-zinc-400 mt-0.5">
                      {mission.detail}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/15 font-mono shrink-0">
                  +{mission.xp} XP
                </span>
              </Link>
            ))}
          </div>
        </div>

        {allDone && (
          <p className="text-center text-xs font-bold text-emerald-400 pt-1">
            Tuyệt vời! Đã hoàn thành mọi nhiệm vụ hôm nay.
          </p>
        )}
      </div>
    </Card>
  );
}