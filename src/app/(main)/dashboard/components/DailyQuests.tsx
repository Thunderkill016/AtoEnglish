"use client";

import Link from "next/link";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";

interface Quest {
  id: number;
  text: string;
  xp: number;
  completed: boolean;
  href?: string; // optional deep-link to relevant page
}

interface DailyQuestsProps {
  quests: Quest[];
  handleToggleQuest: (id: number) => void;
  completedCount: number;
}

export default function DailyQuests({ quests, handleToggleQuest, completedCount }: DailyQuestsProps) {
  const allDone = completedCount === quests.length;

  return (
    <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/25 backdrop-blur-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Nhiệm vụ hôm nay</h3>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
            {allDone ? "🎉 Hoàn thành tất cả nhiệm vụ hôm nay!" : "Nhấn để đánh dấu hoàn thành."}
          </p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-mono border ${
          allDone
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
            : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 border-zinc-200/60 dark:border-zinc-700/40"
        }`}>
          {completedCount}/{quests.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / quests.length) * 100}%` }}
        />
      </div>

      {/* Quest items */}
      <div className="space-y-1">
        {quests.map((quest) => {
          const inner = (
            <>
              <span className="shrink-0 text-emerald-600 dark:text-emerald-400">
                {quest.completed ? (
                  <CheckCircle2 className="size-4.5 fill-emerald-600 dark:fill-emerald-500 text-white dark:text-zinc-950" />
                ) : (
                  <Circle className="size-4.5 text-zinc-300 dark:text-zinc-600 hover:text-emerald-500 transition-colors duration-150" />
                )}
              </span>
              <span className={`flex-1 text-xs font-semibold leading-snug ${
                quest.completed ? "text-zinc-400 dark:text-zinc-500 line-through decoration-1" : "text-zinc-800 dark:text-zinc-200"
              }`}>
                {quest.text}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {quest.href && !quest.completed && (
                  <ExternalLink className="size-3 text-zinc-400 dark:text-zinc-500" />
                )}
                <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/15 font-mono">
                  +{quest.xp} XP
                </span>
              </div>
            </>
          );

          // Quests with a href get a Link wrapper on the right side; clicking the whole row still toggles
          return (
            <div key={quest.id} className="relative group">
              <button
                type="button"
                onClick={() => handleToggleQuest(quest.id)}
                className="w-full flex items-center gap-3 text-left py-2.5 px-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors duration-150 select-none border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/40"
              >
                {inner}
              </button>
              {/* Overlay link for quests with a destination — navigates without toggling */}
              {quest.href && !quest.completed && (
                <Link
                  href={quest.href}
                  className="absolute inset-y-0 right-0 w-10 rounded-r-xl"
                  aria-label={`Đi đến ${quest.href}`}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          );
        })}
      </div>

      {allDone && (
        <p className="text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
          ✅ Tuyệt vời! Hẹn gặp lại ngày mai.
        </p>
      )}
    </div>
  );
}
