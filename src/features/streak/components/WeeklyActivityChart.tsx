import { StatLine } from "@/components/ui/page";
"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface WeeklyDataPoint {
  day: string;    // YYYY-MM-DD
  label: string;  // "T2", "T3", …
  xp: number;
  pct: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyDataPoint[];
  dailyGoal?: number;
}

// Custom tooltip
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const xp = payload[0]?.value ?? 0;
  return (
    <div className="bg-zinc-900 dark:bg-zinc-800 border border-zinc-700/50 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="font-black text-white">{label}</p>
      <p className="text-amber-400 font-bold">{xp > 0 ? `⚡ ${xp} XP` : "Chưa học"}</p>
    </div>
  );
}

/**
 * WeeklyActivityChart — Recharts BarChart for 7-day XP activity.
 *
 * Design:
 * - Bars color-coded: emerald for active (≥ goal), orange for partial, zinc for zero
 * - Today highlighted with a subtle glow ring
 * - Animated bar entrance on mount (Recharts built-in)
 * - No Y-axis labels (cleaner, mobile-friendly)
 */
export default function WeeklyActivityChart({ data, dailyGoal = 50 }: WeeklyActivityChartProps) {
  const today = new Date(new Date().getTime() + 7 * 3600_000).toISOString().slice(0, 10);
  const maxXp = Math.max(...data.map((d) => d.xp), dailyGoal, 1);

  const chartData = data.map((d) => ({
    ...d,
    isToday: d.day === today,
    metGoal: d.xp >= dailyGoal,
    partial: d.xp > 0 && d.xp < dailyGoal,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={chartData}
          barCategoryGap="25%"
          margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fontWeight: 700, fill: "currentColor" }}
            tickLine={false}
            axisLine={false}
            className="text-zinc-400 dark:text-zinc-500"
          />
          <YAxis hide domain={[0, maxXp * 1.2]} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <Bar dataKey="xp" radius={[6, 6, 2, 2]} isAnimationActive animationDuration={600}>
            {chartData.map((entry, idx) => {
              let fill = "rgb(113 113 122 / 0.25)"; // zinc — no activity
              if (entry.metGoal) fill = "rgb(16 185 129)";      // emerald — goal met
              else if (entry.partial) fill = "rgb(249 115 22)";  // orange — partial
              if (entry.isToday && !entry.metGoal) {
                fill = entry.partial ? "rgb(245 158 11)" : "rgb(52 211 153 / 0.3)"; // today highlight
              }
              return <Cell key={idx} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-1">
        <div className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm bg-emerald-500" />
          <span className="text-[10px] text-zinc-400 font-medium">Đạt mục tiêu</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm bg-orange-500" />
          <span className="text-[10px] text-zinc-400 font-medium">Một phần</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block size-2 rounded-sm bg-zinc-300 dark:bg-zinc-700" />
          <span className="text-[10px] text-zinc-400 font-medium">Chưa học</span>
        </div>
      </div>
    </div>
  );
}
