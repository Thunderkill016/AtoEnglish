"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { StreakState } from "../utils/streakCalculator";
import { MILESTONE_REWARDS } from "../utils/streakCalculator";

interface StreakMilestoneOverlayProps {
  state: StreakState;
  onDismiss: () => void;
}

/**
 * Full-screen milestone celebration overlay.
 * Fires canvas-confetti + shows badge unlock + reward summary.
 *
 * Psychology: Immediate emotional reward after milestone.
 * Fogg: "Celebration = dopamine" — must fire immediately after study completes.
 */
export default function StreakMilestoneOverlay({ state, onDismiss }: StreakMilestoneOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [count, setCount] = useState(0);

  const milestone = state.isMilestoneDay && state.milestone ? state.milestone : null;
  const reward = milestone ? MILESTONE_REWARDS[milestone] : null;

  useEffect(() => {
    if (!state.isMilestoneDay || !milestone || !reward) return;

    // Small delay for effect to be seen after lesson completes
    const t = setTimeout(() => {
      setVisible(true);
      fireConfetti(milestone);
    }, 400);

    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isMilestoneDay, milestone]);

  // Animated count-up
  useEffect(() => {
    if (!visible || !milestone) return;
    let current = 0;
    const step = Math.max(1, Math.floor(milestone / 20));
    const interval = setInterval(() => {
      current = Math.min(current + step, milestone);
      setCount(current);
      if (current >= milestone) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [visible, milestone]);

  if (!state.isMilestoneDay || !milestone || !reward) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="streak-milestone-overlay"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onDismiss}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            className="relative z-10 max-w-sm w-full text-center"
            initial={{ scale: 0.7, y: 40 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 blur-2xl" />

            <div className="relative bg-white dark:bg-zinc-900 rounded-3xl border border-amber-200 dark:border-amber-900/50 p-8 shadow-2xl">
              {/* Emoji */}
              <motion.div
                className="text-7xl mb-4 select-none"
                animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {reward.emoji}
              </motion.div>

              {/* Animated count */}
              <div className="text-6xl font-black text-amber-500 mb-1 tabular-nums">
                {count}
              </div>
              <div className="text-sm font-bold text-zinc-500 dark:text-zinc-400 mb-4">
                ngày liên tiếp
              </div>

              {/* Title */}
              <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">
                {reward.title}! 🎉
              </div>

              {/* Special message for Day 66 */}
              {milestone === 66 && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-3 px-4">
                  🧠 Theo nghiên cứu UCL, 66 ngày là cột mốc hình thành thói quen thật sự. Bạn đã làm được!
                </p>
              )}

              {/* Rewards */}
              <div className="flex items-center justify-center gap-4 my-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <span className="text-sm">⚡</span>
                  <span className="text-sm font-black text-amber-700 dark:text-amber-400">+{reward.xpBonus} XP</span>
                </div>
                {reward.freezes > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <span className="text-sm">❄️</span>
                    <span className="text-sm font-black text-blue-700 dark:text-blue-400">+{reward.freezes} Freeze</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={onDismiss}
                  className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm hover:from-amber-400 hover:to-orange-400 transition-all active:scale-[0.97]"
                >
                  Tiếp tục học 🔥
                </button>
              </div>

              <p className="mt-3 text-[10px] text-zinc-400">
                Tap bên ngoài để đóng
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Confetti config per milestone ────────────────────────────────────────────
function fireConfetti(milestone: number) {
  const isEpic = milestone >= 66;
  const isMega = milestone >= 100;

  const colors = isMega
    ? ["#fbbf24", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6"]
    : isEpic
    ? ["#fbbf24", "#f59e0b", "#fb923c", "#22c55e"]
    : ["#fbbf24", "#fb923c", "#f87171"];

  const particleCount = isMega ? 200 : isEpic ? 150 : 80;

  // Left burst
  confetti({
    particleCount: Math.floor(particleCount / 2),
    angle: 60,
    spread: 55,
    origin: { x: 0.1, y: 0.7 },
    colors,
    scalar: isEpic ? 1.2 : 1,
  });

  // Right burst
  confetti({
    particleCount: Math.floor(particleCount / 2),
    angle: 120,
    spread: 55,
    origin: { x: 0.9, y: 0.7 },
    colors,
    scalar: isEpic ? 1.2 : 1,
  });

  // Top shower for milestones 66+
  if (isEpic) {
    setTimeout(() => {
      confetti({
        particleCount: 60,
        spread: 100,
        origin: { x: 0.5, y: 0 },
        colors,
        gravity: 0.6,
      });
    }, 300);
  }
}
