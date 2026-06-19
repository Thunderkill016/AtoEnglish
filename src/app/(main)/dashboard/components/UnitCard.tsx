"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { BookOpen, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnitCardProps {
  currentUnitData: {
    unitId: string;
    title: string;
    description: string;
    currentPhase: string;
    progress: number;
    completed: boolean;
    route: string;
  };
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
} as const;

export default function UnitCard({ currentUnitData }: UnitCardProps) {
  return (
    <m.div
      variants={itemVariants}
      initial="hidden"
      animate="show"
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.03)" }}
      className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 shadow-sm flex flex-col justify-between min-h-[380px] relative overflow-hidden group text-left"
    >
      {/* Animated decorative gradient mesh background */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-emerald-500/5 -z-10 group-hover:opacity-75 transition-opacity" />

      <div className="absolute -top-10 -right-10 p-10 opacity-[0.06] dark:opacity-[0.08] text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
        <BookOpen className="size-60" />
      </div>

      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground bg-foreground/[0.03] px-3 py-1 rounded-full">
            Bài học đang học
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
            {currentUnitData.currentPhase}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl sm:text-4xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
            {currentUnitData.title}
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-normal">
            {currentUnitData.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 font-bold uppercase tracking-wider">
            Từ vựng (+{currentUnitData.unitId === "unit-1" ? 12 : 3})
          </span>
          <span className="text-xs bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/10 font-bold uppercase tracking-wider">
            {currentUnitData.unitId === "unit-1" ? "Giao tiếp" : "Đọc hiểu"}
          </span>
          <span className="text-xs bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-500/10 font-bold uppercase tracking-wider">
            {currentUnitData.unitId === "unit-1" ? "Phát âm" : "Ngữ pháp"}
          </span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-foreground/[0.04] relative z-10 space-y-6">
        {/* Modern Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground font-semibold flex items-center gap-1.5">
              <TrendingUp className="size-4 text-emerald-500" />
              Tiến trình học tập
            </span>
            <span className="text-foreground font-black font-mono">{currentUnitData.progress}%</span>
          </div>
          <div className="h-3 w-full bg-secondary rounded-full overflow-hidden p-[2px] border border-foreground/[0.03]">
            <m.div
              initial={{ width: 0 }}
              animate={{ width: `${currentUnitData.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-500 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </m.div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
          <span className="text-xs text-muted-foreground">
            Hoàn thành toàn bộ Unit để nhận ngay <strong className="text-foreground font-bold">80 XP</strong>{" "}
            và mở khóa bài học mới.
          </span>
          <Link href={currentUnitData.route} className="shrink-0">
            <Button className="w-full sm:w-auto h-13 px-8 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/95 hover:to-emerald-600/95 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 group/btn transition-all duration-300 shadow-lg shadow-primary/20 active:scale-[0.98]">
              <span>Tiếp tục học ngay</span>
              <ArrowRight className="size-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </m.div>
  );
}
