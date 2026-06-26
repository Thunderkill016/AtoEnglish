"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LessonContinueButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function LessonContinueButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className,
}: LessonContinueButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full rounded-2xl px-6 py-4 flex items-center justify-center gap-2 font-bold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
        variant === "primary" &&
          "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-900/30",
        variant === "secondary" &&
          "border border-zinc-700/80 bg-zinc-900/80 text-zinc-300 hover:border-zinc-600 hover:text-white",
        className
      )}
    >
      {children}
      {variant === "primary" && <ChevronRight size={20} aria-hidden />}
    </button>
  );
}