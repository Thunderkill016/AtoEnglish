"use client";

import { Sparkles, Award, Flame, BookOpen, Mic, Star, Lock, CheckCircle2, Zap, Trophy, Target, Volume2 } from "lucide-react";

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
  locked:  "border-zinc-200/60 dark:border-zinc-800/60 bg-transparent opacity-50",
};

const tierIconColors: Record<string, string> = {
  diamond: "text-sky-400 bg-sky-400/10",
  gold:    "text-yellow-500 bg-yellow-500/10",
  silver:  "text-slate-400 bg-slate-400/10",
  bronze:  "text-amber-700 bg-amber-700/10",
  locked:  "text-muted-foreground bg-muted",
};

const tierLabel: Record<string, string> = {
  diamond: "💎 Kim Cương",
  gold:    "🥇 Vàng",
  silver:  "🥈 Bạc",
  bronze:  "🥉 Đồng",
};

export default function ProgressClient({ stats }: ProgressClientProps) {
  const { totalCards, streak, completedUnits, totalXp } = stats;

  const achievements = [
    // ── Streak milestones ──────────────────────────────────────────────────
    {
      title: "Bước Đầu Tiên",
      desc: "Học 3 ngày liên tiếp",
      icon: Flame,
      tier: "bronze",
      unlocked: streak >= 3,
      current: Math.min(streak, 3),
      target: 3,
    },
    {
      title: "Ngọn Lửa Kiên Trì",
      desc: "Học liên tiếp 7 ngày",
      icon: Flame,
      tier: "silver",
      unlocked: streak >= 7,
      current: Math.min(streak, 7),
      target: 7,
    },
    {
      title: "Chiến Binh Streak",
      desc: "Duy trì streak 14 ngày",
      icon: Flame,
      tier: "gold",
      unlocked: streak >= 14,
      current: Math.min(streak, 14),
      target: 14,
    },
    {
      title: "Kim Cương Streak",
      desc: "Duy trì streak 30 ngày",
      icon: Award,
      tier: "diamond",
      unlocked: streak >= 30,
      current: Math.min(streak, 30),
      target: 30,
    },
    // ── XP milestones ──────────────────────────────────────────────────────
    {
      title: "Tập Sự",
      desc: "Tích lũy 100 XP",
      icon: Zap,
      tier: "bronze",
      unlocked: totalXp >= 100,
      current: Math.min(totalXp, 100),
      target: 100,
    },
    {
      title: "Nhà Diễn Thuyết",
      desc: "Tích lũy 500 XP",
      icon: Zap,
      tier: "silver",
      unlocked: totalXp >= 500,
      current: Math.min(totalXp, 500),
      target: 500,
    },
    {
      title: "Chuyên Gia",
      desc: "Tích lũy 1.000 XP",
      icon: Trophy,
      tier: "gold",
      unlocked: totalXp >= 1000,
      current: Math.min(totalXp, 1000),
      target: 1000,
    },
    {
      title: "Huyền Thoại",
      desc: "Tích lũy 5.000 XP",
      icon: Trophy,
      tier: "diamond",
      unlocked: totalXp >= 5000,
      current: Math.min(totalXp, 5000),
      target: 5000,
    },
    // ── Units milestones ───────────────────────────────────────────────────
    {
      title: "Người Khởi Đầu",
      desc: "Hoàn thành Unit đầu tiên",
      icon: Star,
      tier: "bronze",
      unlocked: completedUnits >= 1,
      current: Math.min(completedUnits, 1),
      target: 1,
    },
    {
      title: "Học Giả Chuyên Cần",
      desc: "Hoàn thành 3 units",
      icon: BookOpen,
      tier: "silver",
      unlocked: completedUnits >= 3,
      current: Math.min(completedUnits, 3),
      target: 3,
    },
    {
      title: "Chinh Phục Toàn Bộ",
      desc: "Hoàn thành tất cả 5 units",
      icon: Target,
      tier: "gold",
      unlocked: completedUnits >= 5,
      current: Math.min(completedUnits, 5),
      target: 5,
    },
    // ── Vocabulary milestones ──────────────────────────────────────────────
    {
      title: "Bắt Đầu Từ Vựng",
      desc: "Lưu 10 từ vào SRS",
      icon: Sparkles,
      tier: "bronze",
      unlocked: totalCards >= 10,
      current: Math.min(totalCards, 10),
      target: 10,
    },
    {
      title: "Chiến Thần Từ Vựng",
      desc: "Lưu 50 từ vựng vào SRS",
      icon: Sparkles,
      tier: "silver",
      unlocked: totalCards >= 50,
      current: Math.min(totalCards, 50),
      target: 50,
    },
    {
      title: "Kho Từ Vựng",
      desc: "Lưu 100 từ vựng vào SRS",
      icon: Volume2,
      tier: "gold",
      unlocked: totalCards >= 100,
      current: Math.min(totalCards, 100),
      target: 100,
    },
    {
      title: "Thư Viện Sống",
      desc: "Lưu 200 từ vựng vào SRS",
      icon: Mic,
      tier: "diamond",
      unlocked: totalCards >= 200,
      current: Math.min(totalCards, 200),
      target: 200,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Group by tier for summary
  const groups = [
    { key: "streak",  label: "🔥 Streak",     items: achievements.slice(0, 4) },
    { key: "xp",      label: "⚡ XP",          items: achievements.slice(4, 8) },
    { key: "units",   label: "📖 Units",       items: achievements.slice(8, 11) },
    { key: "vocab",   label: "✨ Từ vựng",     items: achievements.slice(11) },
  ];

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base sm:text-xl text-foreground">Huy chương thành tích</h3>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          {unlockedCount} / {achievements.length} đạt được
        </span>
      </div>

      {/* Achievement groups */}
      {groups.map(group => {
        const groupUnlocked = group.items.filter(a => a.unlocked).length;
        return (
          <div key={group.key} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">{group.label}</span>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {groupUnlocked}/{group.items.length}
              </span>
              <div className="flex-1 h-px bg-border/40" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
              {group.items.map((ach, idx) => {
                const Icon = ach.icon;
                const tierKey = ach.unlocked ? ach.tier : "locked";
                const progressPct = Math.min(Math.round((ach.current / ach.target) * 100), 100);
                return (
                  <div
                    key={idx}
                    className={`group rounded-3xl border p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${tierColors[tierKey]}`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className={`flex size-8 sm:size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tierIconColors[tierKey]}`}>
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
                        <h4 className="font-bold text-xs sm:text-sm text-foreground leading-tight">{ach.title}</h4>
                        <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-snug">{ach.desc}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 sm:pt-3 border-t border-foreground/[0.05]">
                      {ach.unlocked ? (
                        <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          {tierLabel[ach.tier]}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-muted-foreground">
                            {ach.current.toLocaleString()} / {ach.target.toLocaleString()}
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
      })}
    </div>
  );
}
