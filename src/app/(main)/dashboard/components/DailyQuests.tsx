"use client";

import { m } from "framer-motion";
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

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
} as const;

export default function DailyQuests({ quests, handleToggleQuest, completedCount }: DailyQuestsProps) {
  return (
    <m.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      className="rounded-3xl border border-glass bg-glass p-6 sm:p-7 shadow-sm space-y-5 text-left"
    >
      <div className="flex items-center justify-between pb-3 border-b border-foreground/[0.04]">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-foreground tracking-tight">Nhiệm vụ hôm nay</h3>
          <p className="text-xs text-muted-foreground font-normal">
            Tự giác đánh dấu hoàn thành sau khi hoàn tất thử thách.
          </p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 font-mono">
          {completedCount} / {quests.length} hoàn thành
        </span>
      </div>

      <div className="space-y-3.5">
        {quests.map((quest) => (
          <div
            key={quest.id}
            onClick={() => handleToggleQuest(quest.id)}
            className="flex items-start gap-4 text-sm py-2.5 px-3 rounded-2xl hover:bg-foreground/[0.02] cursor-pointer transition-colors select-none border border-transparent hover:border-foreground/[0.03]"
          >
            <span className="shrink-0 text-primary mt-0.5">
              {quest.completed ? (
                <CheckCircle2 className="size-5 fill-primary text-primary-foreground" />
              ) : (
                <Circle className="size-5 text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-110" />
              )}
            </span>
            <div className="flex-1 leading-snug">
              <p
                className={
                  quest.completed ? "text-muted-foreground line-through decoration-1" : "text-foreground font-bold"
                }
              >
                {quest.text}
              </p>
            </div>
            <span className="text-[10px] font-bold shrink-0 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-lg border border-emerald-500/10 font-mono">
              +{quest.xp} XP
            </span>
          </div>
        ))}
      </div>
    </m.div>
  );
}
