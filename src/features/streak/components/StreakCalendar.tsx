"use client";

import { useMemo } from "react";

interface StreakCalendarProps {
  /** 49 days of XP data, newest last */
  dailyXp: Array<{ date: string; xp: number }>;
  /** Current streak count (for header) */
  currentStreak?: number;
}

const DAYS_VN = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const WEEKS = 7; // 7 columns (7 weeks of history)
const DAYS_PER_WEEK = 7;

/**
 * StreakCalendar — GitHub-style contribution heatmap.
 * Shows 7 weeks (49 days) of learning activity.
 *
 * Psychology: "Don't break the chain" — visual pattern of consistency.
 * Each filled cell = a day studied. Gaps are immediately visible.
 *
 * Color intensity:
 * - 0 XP   → zinc (no activity)
 * - 1-29   → emerald/10 (light — partial)
 * - 30-79  → emerald/40 (medium)
 * - 80+    → emerald (full intensity — goal met)
 */
export default function StreakCalendar({ dailyXp, currentStreak = 0 }: StreakCalendarProps) {
  // Compute VN "now" once outside hooks (new Date() is allowed, Date.now() is not)
  const todayUTC = new Date();
  const today = useMemo(() => {
    const d = new Date(todayUTC.getTime() + 7 * 3600_000);
    return d;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Build a Map of date → xp for fast lookup
  const xpMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const d of dailyXp) m.set(d.date, d.xp);
    return m;
  }, [dailyXp]);

  // Build 49-day grid: [week0..week6][day0..day6]
  // Start from 48 days ago, grid is weeks × days, left = oldest, right = newest
  const grid = useMemo(() => {
    const rows: Array<Array<{ date: string; xp: number; isToday: boolean; isFuture: boolean }>> = [];

    // Figure out start date (48 days ago, adjusted to Sunday)
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (WEEKS * DAYS_PER_WEEK - 1));

    for (let week = 0; week < WEEKS; week++) {
      const col: Array<{ date: string; xp: number; isToday: boolean; isFuture: boolean }> = [];
      for (let day = 0; day < DAYS_PER_WEEK; day++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + week * DAYS_PER_WEEK + day);
        const dateStr = d.toISOString().slice(0, 10);
        const todayStr = today.toISOString().slice(0, 10);
        col.push({
          date: dateStr,
          xp: xpMap.get(dateStr) ?? 0,
          isToday: dateStr === todayStr,
          isFuture: d > today,
        });
      }
      rows.push(col);
    }
    return rows;
  }, [today, xpMap]);

  function getCellColor(xp: number, isToday: boolean, isFuture: boolean): string {
    if (isFuture) return "bg-zinc-100/30 dark:bg-zinc-800/20 border-zinc-200/20 dark:border-zinc-800/20";
    if (xp === 0 && !isToday) return "bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/50";
    if (isToday && xp === 0) return "bg-emerald-100/60 dark:bg-emerald-900/20 border-emerald-400/50 dark:border-emerald-600/40 ring-1 ring-emerald-400/30 dark:ring-emerald-500/20";
    if (xp < 30) return "bg-emerald-200 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700/50";
    if (xp < 80) return "bg-emerald-400 dark:bg-emerald-700/60 border-emerald-400 dark:border-emerald-600";
    return "bg-emerald-500 dark:bg-emerald-500/80 border-emerald-400 shadow-sm shadow-emerald-500/20";
  }

  // Find the month range to show
  const firstDate = grid[0]?.[0]?.date ?? "";
  const lastDate = grid[WEEKS - 1]?.[DAYS_PER_WEEK - 1]?.date ?? "";
  const firstMonth = firstDate ? new Date(firstDate + "T12:00:00Z").toLocaleDateString("vi-VN", { month: "short" }) : "";
  const lastMonth = lastDate ? new Date(lastDate + "T12:00:00Z").toLocaleDateString("vi-VN", { month: "short" }) : "";

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Lịch học 7 tuần
          </span>
          {currentStreak > 0 && (
            <span className="text-[10px] font-black text-orange-500">
              🔥 {currentStreak} ngày
            </span>
          )}
        </div>
        <span className="text-[10px] text-zinc-400 font-medium">
          {firstMonth} – {lastMonth}
        </span>
      </div>

      {/* Day-of-week labels */}
      <div className="flex gap-1 mb-1 pl-0">
        {DAYS_VN.map((d) => (
          <div key={d} className="flex-1 text-center text-[8px] font-bold text-zinc-400 dark:text-zinc-600">
            {d}
          </div>
        ))}
      </div>

      {/* Heatmap grid: rows = day of week (0=Sun..6=Sat), cols = weeks */}
      {/* Transposed: render by day-of-week rows, week columns */}
      <div className="flex gap-1">
        {grid.map((weekCols, weekIdx) => (
          <div key={weekIdx} className="flex-1 flex flex-col gap-1">
            {weekCols.map((cell, dayIdx) => (
              <div
                key={dayIdx}
                title={`${cell.date}: ${cell.xp > 0 ? `${cell.xp} XP` : "Chưa học"}`}
                className={`aspect-square rounded-sm border transition-all duration-200 ${getCellColor(cell.xp, cell.isToday, cell.isFuture)}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-2 justify-end">
        <span className="text-[9px] text-zinc-400">Ít</span>
        <div className="flex gap-0.5">
          {[
            "bg-zinc-200 dark:bg-zinc-700",
            "bg-emerald-200 dark:bg-emerald-900/40",
            "bg-emerald-400 dark:bg-emerald-700/60",
            "bg-emerald-500",
          ].map((cls, i) => (
            <div key={i} className={`size-2.5 rounded-sm ${cls}`} />
          ))}
        </div>
        <span className="text-[9px] text-zinc-400">Nhiều</span>
      </div>
    </div>
  );
}
