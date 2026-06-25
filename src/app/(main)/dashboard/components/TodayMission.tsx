"use client";

import Link from "next/link";
import { ArrowRight, Zap, BookOpen, Mic, Star } from "lucide-react";

interface TodayMissionProps {
  /** Current unit being studied */
  currentUnit: {
    title: string;
    progress: number; // 0–100
    route: string;
    xp: number;
  };
  /** Number of SRS cards due for review */
  dueCardsCount: number;
  /** XP earned today */
  xpToday: number;
  /** Daily XP target */
  xpTarget: number;
  /** How many quick wins completed today (SRS, quiz, speaking) */
  completedQuickWins?: number;
}

/**
 * TodayMission — single unified daily task hub (FIX 4).
 * Merges "Học nhanh 10 phút", "Nhiệm vụ hôm nay", "Kế hoạch Phase" into 1 clear CTA.
 *
 * Layout:
 *   PRIMARY  — current lesson (always 1 item)
 *   QUICK WINS — SRS, Quiz, Speaking (< 10 min each)
 *   BONUS — speaking challenge
 *
 * Psychology: single clear "what to do next" removes decision fatigue.
 */
export default function TodayMission({
  currentUnit,
  dueCardsCount,
  xpToday,
  xpTarget,
  completedQuickWins = 0,
}: TodayMissionProps) {
  // Tổng số nhiệm vụ: 1 primary + 3 quick wins
  const totalTasks = 4;
  // Đánh dấu primary hoàn thành nếu đạt XP đủ trong ngày
  const primaryDone = xpToday >= Math.min(xpTarget * 0.4, 20);
  const totalDone = (primaryDone ? 1 : 0) + Math.min(completedQuickWins, 3);
  const progressPct = Math.round((totalDone / totalTasks) * 100);

  const quickWins = [
    {
      id: "qw-srs",
      icon: "🃏",
      label: "Ôn từ SRS",
      time: dueCardsCount > 0 ? `${dueCardsCount} thẻ` : "5 phút",
      xp: 15,
      href: "/flashcards",
      color: "purple",
      done: completedQuickWins >= 1,
    },
    {
      id: "qw-quiz",
      icon: "📝",
      label: "Quiz bài học",
      time: "5 câu",
      xp: 15,
      href: currentUnit.route,
      color: "emerald",
      done: completedQuickWins >= 2,
    },
    {
      id: "qw-speaking",
      icon: "🎙️",
      label: "Luyện phát âm",
      time: "5 phút",
      xp: 10,
      href: "/pronunciation",
      color: "red",
      done: completedQuickWins >= 3,
    },
  ] as const;

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10">
              <Zap className="size-4 text-amber-500 fill-amber-500" />
            </span>
            <p className="text-xs font-black text-zinc-900 dark:text-zinc-50 uppercase tracking-wider">
              Nhiệm vụ hôm nay
            </p>
          </div>
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
            {totalDone}/{totalTasks} hoàn thành
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">

        {/* ── PRIMARY TASK — current lesson ── */}
        <div>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
            Ưu tiên — làm trước
          </p>
          <Link
            href={currentUnit.route}
            id="today-mission-primary"
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 group ${
              primaryDone
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-500/30"
            }`}
          >
            {/* Check circle */}
            <div
              className={`size-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                primaryDone
                  ? "border-emerald-500 bg-emerald-500"
                  : "border-emerald-400 dark:border-emerald-600"
              }`}
            >
              {primaryDone ? (
                <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <BookOpen className="size-3.5 text-emerald-500" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold truncate ${primaryDone ? "line-through text-zinc-400" : "text-zinc-900 dark:text-zinc-50"}`}>
                {currentUnit.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {/* Mini progress */}
                <div className="flex-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden max-w-[80px]">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${currentUnit.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{currentUnit.progress}%</span>
              </div>
            </div>

            {/* XP badge + arrow */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                <Star className="size-2.5 fill-current" />
                +{currentUnit.xp} XP
              </span>
              {!primaryDone && (
                <ArrowRight className="size-3.5 text-zinc-400 group-hover:text-emerald-500 transition-colors" />
              )}
            </div>
          </Link>
        </div>

        {/* ── QUICK WINS ── */}
        <div>
          <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">
            Nhanh gọn — dưới 10 phút
          </p>
          <div className="grid grid-cols-3 gap-2">
            {quickWins.map((win) => (
              <Link
                key={win.id}
                id={win.id}
                href={win.href}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-150 group ${
                  win.done
                    ? `border-${win.color}-500/30 bg-${win.color}-500/5 opacity-60`
                    : `border-${win.color}-500/15 bg-${win.color}-500/5 hover:bg-${win.color}-500/10 hover:border-${win.color}-500/30`
                }`}
              >
                <span className={`text-base ${win.done ? "opacity-50" : ""}`}>{win.icon}</span>
                <span className={`text-[10px] font-black text-center leading-tight ${
                  win.done ? "line-through text-zinc-400" : "text-zinc-700 dark:text-zinc-300"
                }`}>
                  {win.label}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  win.color === "purple" ? "text-purple-500 bg-purple-500/10" :
                  win.color === "emerald" ? "text-emerald-500 bg-emerald-500/10" :
                  "text-red-500 bg-red-500/10"
                }`}>
                  {win.done ? `✓ +${win.xp} XP` : win.time}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── BONUS ── */}
        <Link
          href="/speaking"
          id="today-mission-bonus"
          className="flex items-center gap-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/8 hover:border-amber-500/30 transition-all duration-150 group"
        >
          <span className="text-lg shrink-0">⭐</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">Thử Thách Hàng Ngày</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Nói tiếng Anh 2 phút liên tục</p>
          </div>
          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded-full shrink-0">
            +50 XP
          </span>
          <ArrowRight className="size-3.5 text-zinc-400 group-hover:text-amber-500 transition-colors shrink-0" />
        </Link>
      </div>
    </div>
  );
}
