"use client";

import { m } from "framer-motion";

interface XpTrackerProps {
  isLoading: boolean;
  xpCurrent: number;
  xpTarget: number;
  totalXp: number;
}

export default function XpTracker({ isLoading, xpCurrent, xpTarget, totalXp }: XpTrackerProps) {
  // SVG parameters for circular progress
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const xpPercentage = (xpCurrent / xpTarget) * 100;
  const strokeDashoffset = circumference - (Math.min(xpPercentage, 100) / 100) * circumference;

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-glass bg-glass p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[260px] animate-pulse">
        <div className="w-full flex items-center justify-between">
          <div className="h-4 w-24 bg-foreground/10 rounded" />
          <div className="h-4 w-12 bg-primary/10 rounded" />
        </div>
        
        {/* Skeleton circle */}
        <div className="relative size-32 flex items-center justify-center my-3">
          <svg className="size-full transform -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={radius} className="stroke-foreground/5 fill-none" strokeWidth="6" />
          </svg>
          <div className="absolute flex flex-col items-center leading-none">
            <div className="h-7 w-12 bg-foreground/10 rounded mb-1.5" />
            <div className="h-3 w-16 bg-foreground/10 rounded" />
          </div>
        </div>

        <div className="space-y-1.5 w-full border-t border-foreground/[0.04] pt-3">
          <div className="h-4 w-32 bg-foreground/10 rounded mx-auto" />
          <div className="h-3 w-28 bg-foreground/5 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <m.div
      whileHover={{ y: -2 }}
      className="rounded-3xl border border-glass bg-glass p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[260px]"
    >
      <div className="w-full flex items-center justify-between">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-widest">
          XP Ngày Hôm Nay
        </h3>
        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
          Hàng ngày
        </span>
      </div>

      {/* Circular progress ring */}
      <div className="relative size-32 flex items-center justify-center my-3">
        <svg className="size-full transform -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} className="stroke-muted/30 fill-none" strokeWidth="6" />
          <m.circle
            cx="64"
            cy="64"
            r={radius}
            className="stroke-primary fill-none"
            strokeWidth="7"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: strokeDashoffset }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span className="text-2.5xl font-black text-foreground">{Math.round(xpPercentage)}%</span>
          <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest mt-1 font-mono">
            {xpCurrent} / {xpTarget} XP
          </span>
        </div>
      </div>

      <div className="space-y-1 w-full border-t border-foreground/[0.04] pt-3 text-left sm:text-center">
        <p className="text-xs font-bold text-foreground">Tổng điểm: {totalXp} XP tích lũy</p>
        <p className="text-[10px] text-muted-foreground font-normal">
          {xpCurrent >= xpTarget
            ? "🎉 Đạt mục tiêu ngày!"
            : `Còn ${xpTarget - xpCurrent} XP để đạt đích`}
        </p>
      </div>
    </m.div>
  );
}
