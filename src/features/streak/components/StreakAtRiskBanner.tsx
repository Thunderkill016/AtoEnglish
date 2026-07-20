import { StatLine } from "@/components/ui/page";
"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Flame, Clock, Zap } from "lucide-react";
import type { StreakState } from "../utils/streakCalculator";

interface StreakAtRiskBannerProps {
  state: StreakState;
  onActivateFreeze?: () => void;
  onDismiss: () => void;
}

/**
 * Persistent top-of-screen banner shown when streak is at risk.
 * Dismissible for 1 hour only (reappears unless streak is saved).
 *
 * Psychology: Maximum loss-aversion framing. Specific time remaining.
 * Show only when status = "at_risk" (within 4h of VN midnight, not studied).
 */
export default function StreakAtRiskBanner({ state, onActivateFreeze, onDismiss }: StreakAtRiskBannerProps) {
  const show = state.status === "at_risk";
  const isCritical = state.hoursUntilMidnight <= 1;
  const hasFreeze = state.freezesAvailable > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          id="streak-at-risk-banner"
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`fixed top-0 left-0 right-0 z-50 ${
            isCritical
              ? "bg-gradient-to-r from-red-600 to-red-500"
              : "bg-gradient-to-r from-orange-500 to-amber-500"
          } text-white shadow-lg`}
        >
          <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
            {/* Icon + message */}
            <span className={`text-lg shrink-0 ${isCritical ? "animate-bounce" : "animate-pulse"}`}>
              {isCritical ? "🚨" : "⚠️"}
            </span>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-black truncate">
                {isCritical
                  ? `Streak ${state.current} ngày sắp hết — còn <1h!`
                  : `Streak ${state.current} ngày sắp hết — còn ${state.hoursUntilMidnight.toFixed(0)}h`}
              </p>
              <p className="text-[11px] font-medium opacity-90">
                Học 1 bài hoặc ôn 5 flashcard để giữ streak
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Study CTA */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-black rounded-xl transition-colors"
              >
                <Zap className="size-3" />
                Học ngay
              </Link>

              {/* Freeze CTA */}
              {hasFreeze && onActivateFreeze && (
                <button
                  onClick={onActivateFreeze}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/80 hover:bg-blue-400/80 text-white text-xs font-black rounded-xl transition-colors"
                >
                  ❄️ Freeze
                </button>
              )}

              {/* Dismiss (1h) */}
              {!isCritical && (
                <button
                  onClick={onDismiss}
                  aria-label="Ẩn trong 1 tiếng"
                  className="size-7 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Progress bar — time remaining */}
          <div className="h-0.5 bg-white/20">
            <motion.div
              className="h-full bg-white/60"
              initial={{ width: `${((24 - state.hoursUntilMidnight) / 24) * 100}%` }}
              animate={{ width: "100%" }}
              transition={{ duration: state.hoursUntilMidnight * 3600, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Compact inline version for use inside cards/dashboard,
 * when the fixed banner isn't appropriate.
 */
export function StreakAtRiskInline({ state, onActivateFreeze }: Pick<StreakAtRiskBannerProps, "state" | "onActivateFreeze">) {
  if (state.status !== "at_risk") return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900">
      <Flame className="size-4 text-red-500 shrink-0 animate-pulse" />
      <div className="flex-1">
        <p className="text-sm font-black text-red-700 dark:text-red-400">
          Streak {state.current} ngày sắp hết!
        </p>
        <p className="text-[11px] text-red-500/80 font-medium flex items-center gap-1">
          <Clock className="size-3" />
          Còn {state.hoursUntilMidnight < 1 ? "<1" : state.hoursUntilMidnight.toFixed(0)} giờ — học ngay để giữ
        </p>
      </div>
      {state.freezesAvailable > 0 && onActivateFreeze && (
        <button
          onClick={onActivateFreeze}
          className="text-xs font-black text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/20 hover:opacity-80 transition-opacity"
        >
          ❄️ Freeze
        </button>
      )}
    </div>
  );
}
