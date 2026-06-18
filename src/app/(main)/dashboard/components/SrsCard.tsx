"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { GraduationCap, Layers, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SrsCardProps {
  completedUnits: number;
  userLevel: string;
  dueCardsCount: number;
}

export default function SrsCard({ completedUnits, userLevel, dueCardsCount }: SrsCardProps) {
  return (
    <div className="space-y-6">
      {/* Level summary */}
      <m.div
        whileHover={{ scale: 1.02 }}
        className="flex items-center gap-4 rounded-3xl bg-glass border border-glass p-5 shadow-sm"
      >
        <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
          <GraduationCap className="size-6" />
        </span>
        <div className="text-left">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-extrabold">
            Trình độ hiện tại • Đã học xong {completedUnits} Unit
          </div>
          <div className="text-base font-black text-foreground tracking-tight">{userLevel}</div>
        </div>
      </m.div>

      {/* SRS Review box */}
      <m.div
        whileHover={{ scale: 1.02 }}
        className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 shadow-sm space-y-4 text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-500">
              <Layers className="size-4" />
            </span>
            <span className="text-xs font-black text-amber-800 dark:text-amber-500 uppercase tracking-wider">
              Hộp thẻ SRS
            </span>
          </div>
          <span className="text-xs font-bold text-amber-700 dark:text-amber-500 font-mono bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            {dueCardsCount} thẻ đến hạn
          </span>
        </div>

        <p className="text-xs text-muted-foreground font-normal leading-relaxed">
          Thuật toán FSRS đã lên lịch ôn tập. Luyện tập ngay để ghi nhớ từ vựng sâu sắc hơn.
        </p>

        <Link href="/flashcards" className="block">
          <Button className="w-full h-11 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl text-xs flex items-center justify-between px-4 transition-all shadow-md shadow-amber-500/10 active:scale-[0.98]">
            <span>Ôn tập lật thẻ ngay</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </m.div>
    </div>
  );
}
