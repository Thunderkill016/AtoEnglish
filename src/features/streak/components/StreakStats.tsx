import { StatLine } from "@/components/ui/page";
import { Flame, Trophy, Snowflake, BarChart3, Calendar, Target } from "lucide-react";
import Link from "next/link";
import { getMilestoneShareText } from "../utils/streakCopy";
import { MILESTONE_REWARDS } from "../utils/streakCalculator";

interface StreakStatsProps {
  currentStreak: number;
  bestStreak: number;
  freezesAvailable: number;
  totalStudyDays: number;
  /** Number of milestones achieved */
  milestonesAchieved: number;
  /** User's CEFR level */
  userLevel: string;
  /** Total lessons completed */
  completedLessons: number;
  /** Weekly active days count (last 7 days) */
  weeklyActiveDays: number;
}

/** All defined milestones with their rewards */
const MILESTONES = Object.entries(MILESTONE_REWARDS)
  .map(([days, reward]) => ({ days: Number(days), ...reward }))
  .sort((a, b) => a.days - b.days);

export default function StreakStats({
  currentStreak,
  bestStreak,
  freezesAvailable,
  totalStudyDays,
  milestonesAchieved,
  userLevel,
  completedLessons,
  weeklyActiveDays,
}: StreakStatsProps) {
  const shareText = getMilestoneShareText(currentStreak, userLevel, completedLessons);

  const stats = [
    {
      icon: <Flame className="size-4 text-orange-500" />,
      label: "Streak hiện tại",
      value: `${currentStreak} ngày`,
      color: "orange",
    },
    {
      icon: <Trophy className="size-4 text-amber-500" />,
      label: "Streak dài nhất",
      value: `${bestStreak} ngày`,
      color: "amber",
    },
    {
      icon: <Calendar className="size-4 text-blue-500" />,
      label: "Tổng ngày học",
      value: `${totalStudyDays} ngày`,
      color: "blue",
    },
    {
      icon: <Snowflake className="size-4 text-blue-300" />,
      label: "Streak Freeze còn",
      value: `${freezesAvailable}/3`,
      color: "sky",
    },
    {
      icon: <BarChart3 className="size-4 text-emerald-500" />,
      label: "Tuần này",
      value: `${weeklyActiveDays}/7 ngày`,
      color: "emerald",
    },
    {
      icon: <Target className="size-4 text-purple-500" />,
      label: "Milestones đạt",
      value: `${milestonesAchieved}/${MILESTONES.length}`,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map(({ icon, label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-2 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2">
              {icon}
              <p className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider leading-tight">
                {label}
              </p>
            </div>
            <p className="text-xl font-black text-zinc-900 dark:text-zinc-50 leading-none">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Milestone roadmap */}
      <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="size-4 text-amber-500" />
          <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
            Lộ trình Streak Milestones
          </p>
        </div>
        <div className="space-y-2">
          {MILESTONES.map(({ days, title, emoji, xpBonus, freezes }) => {
            const achieved = currentStreak >= days;
            return (
              <div
                key={days}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  achieved
                    ? "bg-amber-500/5 border border-amber-500/20"
                    : "bg-zinc-50/50 dark:bg-zinc-800/20 border border-zinc-200/40 dark:border-zinc-800/40"
                }`}
              >
                {/* Badge */}
                <span className="text-xl shrink-0">{achieved ? emoji : "🔒"}</span>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-xs font-bold leading-none ${
                      achieved ? "text-amber-700 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-500"
                    }`}>
                      Day {days} — {title}
                    </p>
                    {achieved && (
                      <span className="text-[9px] font-black bg-amber-500/15 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-full border border-amber-500/20">
                        ✓ Đạt
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                    +{xpBonus.toLocaleString("vi-VN")} XP{freezes > 0 ? ` · +${freezes} Freeze` : ""}
                  </p>
                </div>
                {/* Progress bar to next */}
                {!achieved && (
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                      {Math.max(0, days - currentStreak)} ngày nữa
                    </p>
                    <div className="mt-1 w-16 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-700"
                        style={{ width: `${Math.min(100, (currentStreak / days) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Share card */}
      {currentStreak >= 7 && (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎉</span>
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              Chia sẻ thành tích
            </p>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 whitespace-pre-line font-mono bg-zinc-50 dark:bg-zinc-800/60 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-700/40 leading-relaxed">
            {shareText}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                try { navigator.clipboard.writeText(shareText); } catch { /* ignore */ }
              }}
              className="flex-1 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-400 transition-colors"
            >
              📋 Sao chép
            </button>
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent("https://atoenglish.vercel.app")}&summary=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-xs font-bold text-blue-700 dark:text-blue-400 transition-colors text-center"
            >
              💼 LinkedIn
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
