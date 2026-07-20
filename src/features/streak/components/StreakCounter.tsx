"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { StreakState, StreakStatus } from "../utils/streakCalculator";
import { MILESTONE_REWARDS } from "../utils/streakCalculator";

interface StreakCounterProps {
  state: StreakState;
  /** Compact mode for header/nav display */
  compact?: boolean;
  /** Show freeze button */
  onActivateFreeze?: () => void;
}

// ── Visual config per status ─────────────────────────────────────────────────
const STATUS_CONFIG: Record<StreakStatus, {
  flame: string;
  glow: string;
  label: string;
  subLabel: (state: StreakState) => string;
  animate: string;
}> = {
  zero: {
    flame: "⭕",
    glow: "",
    label: "text-zinc-400 dark:text-zinc-500",
    subLabel: () => "Bắt đầu streak hôm nay!",
    animate: "",
  },
  active: {
    flame: "🔥",
    glow: "drop-shadow-[0_0_8px_rgb(249_115_22_/_0.4)]",
    label: "text-orange-500",
    subLabel: (s) => s.studiedToday ? "Đã học hôm nay ✓" : `Còn ${s.hoursUntilMidnight.toFixed(0)}h để học hôm nay`,
    animate: "animate-streak-pulse",
  },
  growing: {
    flame: "🔥",
    glow: "drop-shadow-[0_0_16px_rgb(245_158_11_/_0.7)]",
    label: "text-amber-500",
    subLabel: (s) => s.studiedToday ? "Đã học hôm nay ✓" : `Còn ${s.hoursUntilMidnight.toFixed(0)}h để học hôm nay`,
    animate: "animate-flame-flicker",
  },
  at_risk: {
    flame: "🔥",
    glow: "drop-shadow-[0_0_12px_rgb(239_68_68_/_0.8)]",
    label: "text-red-500",
    subLabel: (s) => `⚠️ Còn ${s.hoursUntilMidnight < 1 ? "<1" : s.hoursUntilMidnight.toFixed(0)}h — học ngay!`,
    animate: "animate-streak-urgent",
  },
  broken: {
    flame: "💔",
    glow: "",
    label: "text-zinc-400",
    subLabel: () => "Streak bị gián đoạn — bắt đầu lại!",
    animate: "",
  },
  frozen: {
    flame: "❄️",
    glow: "drop-shadow-[0_0_8px_rgb(147_197_253_/_0.6)]",
    label: "text-blue-300",
    subLabel: () => "Streak đang được bảo vệ ❄️",
    animate: "animate-streak-shimmer",
  },
  comeback: {
    flame: "🌱",
    glow: "drop-shadow-[0_0_8px_rgb(52_211_153_/_0.5)]",
    label: "text-emerald-500",
    subLabel: (s) => `Lâu rồi không học (${s.daysSinceLastStudy} ngày)!`,
    animate: "",
  },
};

// ── Component ────────────────────────────────────────────────────────────────
export default function StreakCounter({ state, compact = false, onActivateFreeze }: StreakCounterProps) {
  const cfg = STATUS_CONFIG[state.status];
  const isAtRisk = state.status === "at_risk";
  const isBroken = state.status === "broken";
  const isZero = state.status === "zero" || state.status === "comeback";
  const milestone = state.isMilestoneDay && state.milestone ? MILESTONE_REWARDS[state.milestone] : null;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1 font-black text-sm ${cfg.label}`}>
        <span className={`text-base ${cfg.glow} ${cfg.animate}`}>
          {cfg.flame}
        </span>
        <span>{state.current}</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Milestone banner */}
      <AnimatePresence>
        {milestone && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black shadow-lg shadow-amber-500/30"
          >
            {milestone.emoji} {milestone.title} — +{milestone.xpBonus} XP!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main counter card */}
      <div className={`flex flex-col items-center gap-1 p-4 rounded-2xl transition-all ${
        isAtRisk
          ? "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900"
          : isBroken
          ? "bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 opacity-70"
          : "bg-transparent"
      }`}>
        {/* Flame + count */}
        <div className="relative flex items-center justify-center">
          <motion.span
            key={state.status}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`text-5xl ${cfg.glow} ${cfg.animate} select-none`}
          >
            {cfg.flame}
          </motion.span>

          {/* Count badge */}
          {!isZero && state.current > 0 && (
            <motion.div
              key={state.current}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className={`absolute -bottom-2 -right-3 min-w-[28px] h-7 px-1.5 flex items-center justify-center rounded-full text-xs font-black text-white shadow-md ${
                isAtRisk ? "bg-red-500" :
                state.status === "growing" ? "bg-amber-500" :
                state.status === "frozen" ? "bg-blue-400" :
                "bg-orange-500"
              }`}
            >
              {state.current}
            </motion.div>
          )}
        </div>

        {/* Label */}
        <div className={`text-sm font-bold ${cfg.label}`}>
          {state.current > 0 ? `${state.current} ngày` : "Chưa có streak"}
        </div>

        {/* Sub-label */}
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400 text-center font-medium">
          {cfg.subLabel(state)}
        </div>

        {/* Freeze button — show when at risk and has freezes */}
        {isAtRisk && state.freezesAvailable > 0 && onActivateFreeze && (
          <motion.button
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onActivateFreeze}
            className="mt-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:opacity-80 transition-opacity"
          >
            ❄️ Dùng streak freeze ({state.freezesAvailable})
          </motion.button>
        )}

        {/* CTA when no streak or comeback */}
        {(isZero || isBroken) && (
          <Link
            href="/dashboard"
            className="mt-2 text-[11px] font-black text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            {state.status === "comeback" ? "👋 Học ngay để bắt đầu streak mới →" : "📚 Học bài đầu tiên →"}
          </Link>
        )}
      </div>

      {/* Freeze inventory indicator */}
      {state.freezesAvailable > 0 && !isAtRisk && (
        <div className="mt-1 flex items-center justify-center gap-1">
          {Array.from({ length: state.freezesAvailable }).map((_, i) => (
            <span key={i} className="text-xs">❄️</span>
          ))}
          <span className="text-[10px] text-zinc-400 font-medium">freeze</span>
        </div>
      )}
    </div>
  );
}
