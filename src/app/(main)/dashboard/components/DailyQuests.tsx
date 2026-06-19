"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface Quest {
  id: number;
  text: string;
  xp: number;
  completed: boolean;
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
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">Tự đánh dấu sau khi hoàn thành.</p>
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
        {quests.map((quest) => (
          <button
            key={quest.id}
            type="button"
            onClick={() => handleToggleQuest(quest.id)}
            className="w-full flex items-center gap-3 text-left py-2.5 px-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/40 cursor-pointer transition-colors duration-150 select-none border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-700/40"
          >
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
            <span className="text-[10px] font-bold shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-lg border border-emerald-500/15 font-mono">
              +{quest.xp} XP
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
