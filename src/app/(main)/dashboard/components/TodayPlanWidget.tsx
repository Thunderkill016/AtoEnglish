"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { useState, useEffect } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import { getPhaseForLevel, DAILY_TIPS } from "@/lib/constants/study-plan";

const SKILL_COLORS: Record<string, string> = {
  pronunciation: "#f59e0b",
  vocabulary: "#8b5cf6",
  grammar: "#3b82f6",
  listening: "#10b981",
  speaking: "#ef4444",
  reading: "#06b6d4",
  writing: "#ec4899",
};

interface TodayPlanWidgetProps {
  userLevel: string;
}

export default function TodayPlanWidget({ userLevel }: TodayPlanWidgetProps) {
  const phase = getPhaseForLevel(userLevel);
  const todayKey = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
  const checkKey = `study-plan-checks-${todayKey}`;
  const tipIndex = new Date().getDate() % DAILY_TIPS.length;
  const todayTip = DAILY_TIPS[tipIndex]!;

  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(checkKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setChecked(JSON.parse(saved) as Record<number, boolean>);
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (idx: number) => {
    setChecked((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      try { localStorage.setItem(checkKey, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  };

  const doneCount = phase.dailyRoutine.filter((_, i) => checked[i]).length;
  const total = phase.dailyRoutine.length;
  const totalMins = phase.dailyRoutine.reduce((s, a) => s + a.duration, 0);

  return (
    <Card className="rounded-2xl overflow-hidden p-0">
      {/* Header */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{phase.emoji}</span>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-zinc-400">
              Kế hoạch hôm nay · Phase {phase.id}
            </p>
            <p className="text-sm font-bold text-zinc-50">
              {phase.title} — {phase.months}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-base font-black text-zinc-50">{doneCount}/{total}</p>
            <p className="text-[10px] text-zinc-400 flex items-center gap-1 justify-end">
              <Clock className="size-3" />{totalMins} phút
            </p>
          </div>
          {/* Progress ring */}
          <div className="relative size-10 shrink-0">
            <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-zinc-800" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke={phase.color} strokeWidth="3"
                strokeDasharray={`${(doneCount / total) * 94.2} 94.2`}
                strokeLinecap="round"
                style={{ transition: "stroke-dasharray 0.4s ease" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color: phase.color }}>
              {Math.round((doneCount / total) * 100)}%
            </span>
          </div>
          {collapsed ? <ChevronDown className="size-4 text-zinc-400" /> : <ChevronUp className="size-4 text-zinc-400" />}
        </div>
      </button>

      {!collapsed && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-2">
          {phase.dailyRoutine.map((act, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-150 text-left ${
                checked[i]
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-white/10 bg-zinc-800/20 hover:border-zinc-700"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  checked[i] ? "border-emerald-500 bg-emerald-500" : "border-zinc-600"
                }`}
              >
                {checked[i] && (
                  <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              {/* Skill icon */}
              <span
                className="flex size-8 items-center justify-center rounded-lg text-base shrink-0"
                style={{ background: `${SKILL_COLORS[act.skill] ?? "#52525b"}15` }}
              >
                {act.icon}
              </span>
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${
                  checked[i] ? "line-through text-zinc-500" : "text-zinc-50"
                }`}>
                  {act.title}
                </p>
                <p className="text-[10px] text-zinc-400 truncate">{act.resource}</p>
              </div>
              {/* Duration */}
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0"
                style={{ color: SKILL_COLORS[act.skill] ?? "#52525b", background: `${SKILL_COLORS[act.skill] ?? "#52525b"}15` }}
              >
                {act.duration}&apos;
              </span>
            </button>
          ))}

          {/* Daily tip */}
          <div className="flex gap-2 items-start p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 mt-1">
            <span className="text-base shrink-0">💡</span>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              <span className="font-bold text-amber-600 dark:text-amber-400">Tip: </span>
              {todayTip}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
