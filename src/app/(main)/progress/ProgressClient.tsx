"use client";

import { Sparkles, Award, Flame, BookOpen, Mic, Star, Lock, CheckCircle2 } from "lucide-react";

const achievements = [
  {
    title: "Người Khởi Đầu",
    desc: "Hoàn thành Unit 1 đầu tiên",
    icon: Star,
    tier: "gold",
    unlocked: true,
    reward: "Huy chương Vàng",
  },
  {
    title: "Chiến Thần Từ Vựng",
    desc: "Lưu 50 từ vựng vào SRS",
    icon: Sparkles,
    tier: "gold",
    unlocked: false,
    progress: "20 / 50 từ",
  },
  {
    title: "Ngọn Lửa Kiên Trì",
    desc: "Học liên tiếp 7 ngày",
    icon: Flame,
    tier: "silver",
    unlocked: false,
    progress: "? / 7 ngày",
  },
  {
    title: "Học Giả Chuyên Cần",
    desc: "Hoàn thành 5 units",
    icon: BookOpen,
    tier: "silver",
    unlocked: false,
    progress: "? / 5 units",
  },
  {
    title: "Nhà Diễn Thuyết",
    desc: "Luyện nói 10 lần",
    icon: Mic,
    tier: "bronze",
    unlocked: false,
    progress: "? / 10 lần",
  },
  {
    title: "Kim Cương",
    desc: "Duy trì streak 30 ngày",
    icon: Award,
    tier: "diamond",
    unlocked: false,
    progress: "? / 30 ngày",
  },
];

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

export default function ProgressClient() {
  return (
    <div className="space-y-5">
      <h3 className="font-bold text-lg sm:text-xl text-foreground">Huy chương thành tích</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {achievements.map((ach, idx) => {
          const Icon = ach.icon;
          const tierKey = ach.unlocked ? ach.tier : "locked";
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
                      Khóa
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
                    <p className="text-[10px] font-bold text-muted-foreground">{ach.progress}</p>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full w-0 rounded-full bg-primary/60" />
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
