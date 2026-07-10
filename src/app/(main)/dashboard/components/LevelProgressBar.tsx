"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Surface } from "@/components/design-system";

const CEFR_LADDER = [
  { level: "A0", label: "A0", emoji: "🌱", color: "#94a3b8", desc: "Khởi đầu" },
  { level: "A1", label: "A1", emoji: "🔤", color: "#22c55e", desc: "Sơ cấp" },
  { level: "A2", label: "A2", emoji: "💬", color: "#10b981", desc: "Cơ bản" },
  { level: "B1", label: "B1", emoji: "📖", color: "#3b82f6", desc: "Trung cấp" },
  { level: "B2", label: "B2", emoji: "🎯", color: "#8b5cf6", desc: "Trên trung cấp" },
  { level: "C1", label: "C1", emoji: "🏆", color: "#f59e0b", desc: "Nâng cao" },
  { level: "C2", label: "C2", emoji: "⭐", color: "#ef4444", desc: "Thành thạo" },
] as const;

interface LevelProgressBarProps {
  /** Current CEFR level from DB (e.g. "A1", "B1") */
  userLevel: string;
  /** Units completed at the current CEFR level */
  levelUnitsDone: number;
  /** Total units available at the current CEFR level */
  levelUnitsTotal: number;
}

export default function LevelProgressBar({
  userLevel,
  levelUnitsDone,
  levelUnitsTotal,
}: LevelProgressBarProps) {
  const currentIdx = CEFR_LADDER.findIndex(l => l.level === userLevel);
  const safeIdx = currentIdx === -1 ? 0 : currentIdx;
  const current = CEFR_LADDER[safeIdx]!;
  const next = CEFR_LADDER[safeIdx + 1];

  // Progress within current level (0–100)
  const pct = levelUnitsTotal > 0
    ? Math.min(Math.round((levelUnitsDone / levelUnitsTotal) * 100), 100)
    : 0;

  return (
    <Surface className="rounded-2xl p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
          Lộ trình CEFR của bạn
        </p>
        <Link
          href="/roadmap"
          className="text-[10px] font-bold text-emerald-400 hover:underline"
        >
          Chi tiết →
        </Link>
      </div>

      {/* CEFR Ladder — horizontal steps */}
      <div className="flex items-center gap-0">
        {CEFR_LADDER.map((step, idx) => {
          const isDone   = idx < safeIdx;
          const isCurrent = idx === safeIdx;
          const isFuture  = idx > safeIdx;

          return (
            <div key={step.level} className="flex items-center flex-1 min-w-0">
              {/* Node */}
              <div className="flex flex-col items-center gap-0.5 relative flex-shrink-0">
                <div
                  className={`relative flex size-7 items-center justify-center rounded-full border-2 text-[10px] font-black transition-all duration-300 ${
                    isCurrent
                      ? "border-transparent text-white shadow-md shadow-emerald-500/30 scale-110 z-10"
                      : isDone
                        ? "border-transparent text-white"
                        : "border-zinc-700 bg-zinc-800 text-zinc-600"
                  }`}
                  style={isDone || isCurrent ? { background: step.color } : {}}
                >
                  {isDone ? (
                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span>{step.label}</span>
                  )}

                  {/* Pulsing ring on current */}
                  {isCurrent && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping opacity-25"
                      style={{ background: step.color }}
                    />
                  )}
                </div>
                <span
                  className={`text-[8px] font-bold leading-none ${
                    isCurrent
                      ? "text-zinc-200"
                      : isDone
                        ? "text-zinc-500"
                        : "text-zinc-700"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line (skip after last) */}
              {idx < CEFR_LADDER.length - 1 && (
                <div className="flex-1 h-0.5 mx-0.5 rounded-full overflow-hidden bg-zinc-800 relative">
                  {/* Fill: completed segments are fully filled */}
                  {isDone && (
                    <div className="absolute inset-0 rounded-full" style={{ background: step.color }} />
                  )}
                  {/* Fill: current segment partially filled by pct */}
                  {isCurrent && (
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: step.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Current level progress detail */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{current.emoji}</span>
          <div>
            <p className="text-xs font-black text-zinc-50 leading-none">
              {current.label} · {current.desc}
            </p>
            {next && (
              <p className="text-[10px] text-zinc-400 mt-0.5">
                {levelUnitsDone}/{levelUnitsTotal} bài → {next.label}
              </p>
            )}
          </div>
        </div>
        {/* Percentage pill */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black text-white shrink-0"
          style={{ background: current.color }}
        >
          <span>{pct}%</span>
        </div>
      </div>
    </Surface>
  );
}
