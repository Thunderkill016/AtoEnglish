import { StatLine } from "@/components/ui/page";
"use client";

import { useState } from "react";
import { Snowflake, Shield, AlertTriangle } from "lucide-react";
import { useStreakFreeze as freezeStreakAction } from "@/app/actions/gamification";

interface StreakFreezeCardProps {
  /** Current freeze count (0-3) */
  freezesAvailable: number;
  /** Whether streak is currently at risk */
  isAtRisk?: boolean;
  /** Whether a freeze is already active today */
  freezeActive?: boolean;
  /** Called after successful freeze activation */
  onFreezeActivated?: (newCount: number) => void;
}

const FREEZE_MAX = 3;

export default function StreakFreezeCard({
  freezesAvailable,
  isAtRisk = false,
  freezeActive = false,
  onFreezeActivated,
}: StreakFreezeCardProps) {
  const [count, setCount] = useState(freezesAvailable);
  const [isActivating, setIsActivating] = useState(false);
  const [activated, setActivated] = useState(freezeActive);
  const [error, setError] = useState<string | null>(null);

  const handleActivate = async () => {
    if (count <= 0 || activated || isActivating) return;
    setIsActivating(true);
    setError(null);

    try {
      const result = await freezeStreakAction();
      if (result.success) {
        const newCount = Math.max(0, count - 1);
        setCount(newCount);
        setActivated(true);
        onFreezeActivated?.(newCount);
      } else {
        setError(result.error ?? "Không thể kích hoạt freeze.");
      }
    } catch {
      setError("Có lỗi xảy ra. Thử lại sau.");
    } finally {
      setIsActivating(false);
    }
  };

  const canActivate = count > 0 && !activated && isAtRisk;

  // Freeze slot dots
  const dots = Array.from({ length: FREEZE_MAX }, (_, i) => i < count);

  return (
    <div
      className={`rounded-2xl border p-4 transition-all duration-300 ${
        activated
          ? "border-blue-400/40 bg-blue-500/5"
          : isAtRisk && count > 0
            ? "border-blue-400/30 bg-blue-500/5 ring-1 ring-blue-400/20"
            : "border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
            <Snowflake className="size-4 text-blue-500" />
          </span>
          <div>
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Streak Freeze</p>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              Bảo vệ streak khi bận
            </p>
          </div>
        </div>
        {/* Count badge */}
        <div className="flex items-center gap-1.5">
          {dots.map((filled, i) => (
            <div
              key={i}
              className={`size-3 rounded-full transition-all duration-300 ${
                filled
                  ? "bg-blue-400 shadow-sm shadow-blue-400/50"
                  : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          ))}
          <span className="ml-1 text-sm font-black text-blue-500">{count}</span>
        </div>
      </div>

      {/* Status / Info */}
      {activated ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-3">
          <span className="text-base">❄️</span>
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
            Streak đang được bảo vệ hôm nay!
          </p>
        </div>
      ) : count === 0 ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200/50 dark:border-zinc-700/40 mb-3">
          <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
          <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
            Hết freeze. Đạt milestone Day 7 hoặc Day 30 để nhận thêm!
          </p>
        </div>
      ) : isAtRisk ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-3">
          <AlertTriangle className="size-3.5 text-amber-500 shrink-0" />
          <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
            Streak đang có nguy cơ! Dùng freeze để bảo vệ?
          </p>
        </div>
      ) : (
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
          Dùng 1 freeze để bỏ qua hôm nay mà không mất streak.
          Freeze được tặng ở milestone Day 7 và Day 30.
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-[10px] text-red-500 font-bold mb-2">{error}</p>
      )}

      {/* CTA button — only show when at risk */}
      {canActivate && (
        <button
          onClick={handleActivate}
          disabled={isActivating}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Shield className="size-3.5" />
          {isActivating ? "Đang kích hoạt..." : "Dùng Streak Freeze hôm nay"}
        </button>
      )}

      {/* Info: how to earn */}
      {count < FREEZE_MAX && !isAtRisk && !activated && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
          <p className="text-[9px] text-zinc-400 dark:text-zinc-600 font-semibold">
            Tối đa {FREEZE_MAX} · Nhận khi đạt Day 7, 30, 66+
          </p>
          <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
        </div>
      )}
    </div>
  );
}
