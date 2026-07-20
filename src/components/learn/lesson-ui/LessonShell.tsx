import { StatLine } from "@/components/ui/page";
"use client";

import { motion } from "framer-motion";
import { lessonSectionMotion } from "./motion";
import { phaseAccentRing } from "./theme";
import type { IporPhase } from "@/lib/lessons/learning-flow";
import { cn } from "@/lib/utils";

interface LessonShellProps {
  children: React.ReactNode;
  phase: IporPhase;
  className?: string;
}

/** Ambient background + section enter animation */
export default function LessonShell({ children, phase, className }: LessonShellProps) {
  return (
    <div className="relative min-h-screen bg-zinc-950">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div
          className={cn(
            "absolute -top-32 right-0 size-[420px] rounded-full blur-[100px] bg-gradient-to-br opacity-60",
            phaseAccentRing(phase)
          )}
        />
        <div className="absolute bottom-0 left-0 size-[280px] rounded-full bg-teal-500/5 blur-[80px]" />
      </div>

      <motion.div
        key={phase}
        initial={lessonSectionMotion.initial}
        animate={lessonSectionMotion.animate}
        exit={lessonSectionMotion.exit}
        transition={lessonSectionMotion.transition}
        className={cn("relative z-10 max-w-3xl mx-auto px-4 py-5 sm:py-8 pb-28", className)}
      >
        {children}
      </motion.div>
    </div>
  );
}