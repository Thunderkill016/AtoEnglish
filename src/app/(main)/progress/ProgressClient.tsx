"use client";

import { Sparkles, Award, Flame, BookOpen, Mic, Star, Lock, CheckCircle2, Zap, Trophy, Target, Volume2 } from "lucide-react";
import { Surface, Chip } from "@/components/design-system";

interface AchievementStats {
  totalCards: number;
  streak: number;
  completedUnits: number;
  totalXp: number;
  totalSpeakingSessions: number;
}

interface ProgressClientProps {
  stats: AchievementStats;
}

const tierColors: Record<string, string> = {
  diamond: "border-sky-400/40 bg-sky-400/5 hover:border-sky-400/60",
  gold:    "border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50",
  silver:  "border-slate-400/30 bg-slate-400/5 hover:border-slate-400/50",
  bronze:  "border-amber-700/30 bg-amber-700/5 hover:border-amber-700/50",
  locked:  "border-white/10 bg-white/[0.02] opacity-50",
};

const tierIconColors: Record<string, string> = {
  diamond: "text-sky-400 bg-sky-400/10",
  gold:    "text-yellow-500 bg-yellow-500/10",
  silver:  "text-slate-400 bg-slate-400/10",
  bronze:  "text-amber-700 bg-amber-700/10",
  locked:  "text-zinc-500 bg-white/5",
};

const tierLabel: Record<string, string> = {
  diamond: "💎 Kim Cương",
  gold:    "🥇 Vàng",
  silver:  "🥈 Bạc",
  bronze:  "🥉 Đồng",
};

export default function ProgressClient({ stats }: ProgressClientProps) {
  const { totalCards, streak, completedUnits, totalXp, totalSpeakingSessions } = stats;

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
      desc: "Hoàn thành 6 units",
      icon: BookOpen,
      tier: "silver",
      unlocked: completedUnits >= 6,
      current: Math.min(completedUnits, 6),
      target: 6,
    },
    {
      title: "Chiến Binh A1",
      desc: "Hoàn thành 9 units",
      icon: Target,
      tier: "gold",
      unlocked: completedUnits >= 9,
      current: Math.min(completedUnits, 9),
      target: 9,
    },
    {
      title: "Chinh Phục A1",
      desc: "Hoàn thành tất cả 12 units A1",
      icon: Trophy,
      tier: "diamond",
      unlocked: completedUnits >= 12,
      current: Math.min(completedUnits, 12),
      target: 12,
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
    // ── Speaking milestones ────────────────────────────────────────────────
    {
      title: "Người Kể Chuyện",
      desc: "Luyện nói buổi đầu tiên",
      icon: Mic,
      tier: "bronze",
      unlocked: totalSpeakingSessions >= 1,
      current: Math.min(totalSpeakingSessions, 1),
      target: 1,
    },
    {
      title: "Giọng Nói Tự Tin",
      desc: "Hoàn thành 5 buổi luyện nói",
      icon: Mic,
      tier: "silver",
      unlocked: totalSpeakingSessions >= 5,
      current: Math.min(totalSpeakingSessions, 5),
      target: 5,
    },
    {
      title: "Diễn Giả Chuyên Nghiệp",
      desc: "Hoàn thành 15 buổi luyện nói",
      icon: Mic,
      tier: "gold",
      unlocked: totalSpeakingSessions >= 15,
      current: Math.min(totalSpeakingSessions, 15),
      target: 15,
    },
    {
      title: "Bậu Như Tiếng Mẹ Đẻ",
      desc: "Hoàn thành 30 buổi luyện nói",
      icon: Mic,
      tier: "diamond",
      unlocked: totalSpeakingSessions >= 30,
      current: Math.min(totalSpeakingSessions, 30),
      target: 30,
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  // Group by tier for summary
  const groups = [
    { key: "streak",   label: "🔥 Streak",     items: achievements.slice(0, 4) },
    { key: "xp",       label: "⚡ XP",          items: achievements.slice(4, 8) },
    { key: "units",    label: "📖 Units",       items: achievements.slice(8, 12) },
    { key: "vocab",    label: "✨ Từ vựng",     items: achievements.slice(12, 16) },
    { key: "speaking", label: "🎤 Luyện nói",  items: achievements.slice(16) },
  ];

  return (
    <div className="space-y-6">
      {/* Header with summary */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h3 className="font-bold text-base sm:text-xl text-zinc-50">Huy chương thành tích</h3>
        <Chip tone="success" className="normal-case tracking-normal">
          {unlockedCount} / {achievements.length} đạt được
        </Chip>
      </div>

      {/* Achievement groups */}
      {groups.map(group => {
        const groupUnlocked = group.items.filter(a => a.unlocked).length;
        return (
          <div key={group.key} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-zinc-100">{group.label}</span>
              <span className="text-[10px] font-semibold text-zinc-500">
                {groupUnlocked}/{group.items.length}
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
              {group.items.map((ach, idx) => {
                const Icon = ach.icon;
                const tierKey = ach.unlocked ? ach.tier : "locked";
                const progressPct = Math.min(Math.round((ach.current / ach.target) * 100), 100);
                return (
                  <Surface
                    key={idx}
                    className={`group rounded-3xl p-3 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${tierColors[tierKey]}`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className={`flex size-8 sm:size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${tierIconColors[tierKey]}`}>
                          {ach.unlocked ? <Icon className="size-5" /> : <Lock className="size-4" />}
                        </span>
                        {ach.unlocked ? (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ Đạt
                          </span>
                        ) : (
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-lg bg-white/5 text-zinc-500 border border-white/10">
                            {progressPct}%
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-zinc-50 leading-tight">{ach.title}</h4>
                        <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5 leading-snug">{ach.desc}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 sm:pt-3 border-t border-white/5">
                      {ach.unlocked ? (
                        <div className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          {tierLabel[ach.tier]}
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-bold text-zinc-500">
                            {ach.current.toLocaleString()} / {ach.target.toLocaleString()}
                          </p>
                          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500/60 transition-all duration-700"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Surface>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
