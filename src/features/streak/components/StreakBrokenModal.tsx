import { StatLine } from "@/components/ui/page";
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { repairStreak } from "@/app/actions/streak";
import type { StreakState } from "../utils/streakCalculator";

interface StreakBrokenModalProps {
  state: StreakState;
  totalXp: number;
  onDismiss: () => void;
  onRepaired: () => void;
}

/**
 * StreakBrokenModal — shown when status = 'broken' on dashboard load.
 *
 * Psychology:
 * - Frames streak break as recoverable, not catastrophic (encouraging > guilt)
 * - Shows XP cost concretely — agency over the repair decision
 * - 24h window clearly stated — urgency without shame
 * - Vietnamese cultural note: no "Duo is sad" guilt framing; warm friend tone
 */
export default function StreakBrokenModal({
  state,
  totalXp,
  onDismiss,
  onRepaired,
}: StreakBrokenModalProps) {
  const [repairing, setRepairing] = useState(false);
  const visible = state.status === "broken" || state.status === "comeback";
  const REPAIR_COST = 200;
  const canRepair = totalXp >= REPAIR_COST && state.daysSinceLastStudy <= 2;

  if (!visible) return null;

  const handleRepair = async () => {
    if (!canRepair || repairing) return;
    setRepairing(true);
    try {
      const result = await repairStreak();
      if (result.success) {
        toast.success("✅ Streak đã được phục hồi!", {
          description: "Học bài hôm nay để tăng streak lên nhé!",
        });
        onRepaired();
      } else {
        toast.error(result.error ?? "Không thể phục hồi streak lúc này.");
      }
    } catch {
      toast.error("Có lỗi xảy ra. Thử lại sau.");
    } finally {
      setRepairing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        id="streak-broken-modal-backdrop"
        className="fixed inset-0 z-[90] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          className="relative z-10 w-full max-w-sm"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Card */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-7 shadow-2xl text-center">
            {/* Icon */}
            <div className="text-6xl mb-4 select-none">
              {state.status === "comeback" ? "👋" : "💔"}
            </div>

            {/* Title */}
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
              {state.status === "comeback"
                ? "Chào mừng trở lại!"
                : "Streak bị gián đoạn"}
            </h2>

            {/* Message */}
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 leading-relaxed">
              {state.status === "comeback" ? (
                <>
                  Bạn đã vắng mặt{" "}
                  <span className="font-black text-zinc-700 dark:text-zinc-300">
                    {state.daysSinceLastStudy} ngày
                  </span>
                  . Đừng lo — bắt đầu streak mới từ hôm nay nhé!
                </>
              ) : (
                <>
                  Streak của bạn bị gián đoạn hôm qua.{" "}
                  {canRepair ? (
                    <>
                      Bạn có thể phục hồi với{" "}
                      <span className="font-black text-amber-600 dark:text-amber-400">
                        {REPAIR_COST} XP
                      </span>{" "}
                      trong vòng 24h.
                    </>
                  ) : (
                    <>Bắt đầu streak mới từ hôm nay — ngày 1 là ngày quan trọng nhất!</>
                  )}
                </>
              )}
            </p>

            {/* XP balance shown if repair available */}
            {canRepair && state.status === "broken" && (
              <div className="flex items-center justify-center gap-2 mb-5 text-sm">
                <span className="text-zinc-400">Số dư:</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100">
                  ⚡ {totalXp} XP
                </span>
                <span className="text-zinc-300 dark:text-zinc-600">→</span>
                <span className="font-bold text-zinc-500">
                  {totalXp - REPAIR_COST} XP sau khi phục hồi
                </span>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {/* Repair button — only if within 24h window */}
              {canRepair && state.status === "broken" && (
                <button
                  onClick={handleRepair}
                  disabled={repairing}
                  className="h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm hover:from-amber-400 hover:to-orange-400 transition-all active:scale-[0.97] disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {repairing ? (
                    <span className="inline-block size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "⚡ Phục hồi streak — 200 XP"
                  )}
                </button>
              )}

              {/* Start fresh / continue */}
              <button
                onClick={onDismiss}
                className="h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black text-sm hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-[0.97]"
              >
                {state.status === "comeback"
                  ? "🌱 Học ngay — bắt đầu streak mới!"
                  : canRepair
                  ? "Bắt đầu lại không cần phục hồi"
                  : "🌱 Bắt đầu streak mới hôm nay!"}
              </button>
            </div>

            {/* Encouraging note */}
            <p className="mt-4 text-[11px] text-zinc-400 leading-relaxed">
              {state.status === "comeback"
                ? "\"Ngày tốt nhất để bắt đầu là hôm nay\" 🌟"
                : "Đừng nản — streak dài nhất vẫn bắt đầu từ ngày 1!"}
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
