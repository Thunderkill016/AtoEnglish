"use client";

import { Sparkles, Award, Flame, BookOpen, Mic, Star, Lock, CheckCircle2 } from "lucide-react";

interface AchievementStats {
  totalCards: number;
  streak: number;
  completedUnits: number;
  totalXp: number;
}

interface ProgressClientProps {
  stats: AchievementStats;
}

const tierColors: Record<string, string> = {
  diamond: "border-sky-400/40 bg-sky-400/5 hover:border-sky-400/60",
  gold:    "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50",
  silver:  "border-slate-400/30 bg-slate-400/5 hover:border-slate-400/50",
  bronze:  "border-amber-700/30 bg-amber-700/5 hover:border-amber-700/50",
  locked:  "border-zinc-200/60 dark:border-zinc-800/60 bg-transparent opacity-60",
};

const tierIconColors: Record<string, string> = {
  diamond: "text-sky-400 bg-sky-400/10",
  gold:    "text-yellow-500 bg-yellow-500/10",
  silver:  "text-slate-400 bg-slate-400/10",
  bronze:  "text-amber-700 bg-amber-700/10",
  locked:  "text-muted-foreground bg-muted",
};

export default function ProgressClient({ stats }: ProgressClientProps) {
  const { totalCards, streak, completedUnits, totalXp } = stats;

  const achievements = [
    {
      title: "Người Khởi Đầu",
      desc: "Hoàn thành Unit 1 đầu tiên",
      icon: Star,
      tier: "gold",
      unlocked: completedUnits >= 1,
      reward: "Huy chương Vàng",
      current: Math.min(completedUnits, 1),
      target: 1,
    },
    {
      title: "Chiến Thần Từ Vựng",
      desc: "Lưu 50 từ vựng vào SRS",
      icon: Sparkles,
      tier: "gold",
      unlocked: totalCards >= 50,
      reward: "Huy chương Vàng",
      current: totalCards,
      target: 50,
    },
    {
      title: "Ngọn Lửa Kiên Trì",
      desc: "Học liên tiếp 7 ngày",
      icon: Flame,
      tier: "silver",
      unlocked: streak >= 7,
      reward: "Huy chương Bạc",
      current: streak,
      target: 7,
    },
    {
      title: "Học Giả Chuyên Cần",
      desc: "Hoàn thành 5 units",
      icon: BookOpen,
      tier: "silver",
      unlocked: completedUnits >= 5,
      reward: "Huy chương Bạc",
      current: completedUnits,
      target: 5,
    },
    {
      title: "Nhà Diễn Thuyết",
      desc: "Tích lũy 500 XP",
      icon: Mic,
      tier: "bronze",
      unlocked: totalXp >= 500,
      reward: "Huy chương Đồng",
      current: totalXp,
      target: 500,
    },
    {
      title: "Kim Cương",
      desc: "Duy trì streak 30 ngày",
      icon: Award,
      tier: "diamond",
      unlocked: streak >= 30,
      reward: "Huy chương Kim Cương",
      current: streak,
      target: 30,
    },
  ];

  return (
    <div className="space-y-5">
      <h3 className="font-bold text-lg sm:text-xl text-foreground">Huy chương thành tích</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          const tierKey = ach.unlocked ? ach.tier : "locked";
          const progressPct = Math.min(Math.round((ach.current / ach.target) * 100), 100);
          return (
            <div
              key={idx}
              className={`group rounded-3xl border p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${tierColors[tierKey]}`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className={`flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tierIconColors[tierKey]}`}>
                    {ach.unlocked ? <Icon className="size-5" /> : <Lock className="size-4" />}
                  </span>
                  {ach.unlocked ? (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ✓ Đạt
                    </span>
                  ) : (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-muted text-muted-foreground border border-border/40">
                      {progressPct}%
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground leading-tight">{ach.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{ach.desc}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-foreground/[0.05]">
                {ach.unlocked ? (
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    {ach.reward}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground">
                      {ach.current} / {ach.target}
                    </p>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/60 transition-all duration-700"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
