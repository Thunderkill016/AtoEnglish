"use client";

import Link from "next/link";
import { m } from "framer-motion";
import { Play, Mic, Map, ArrowRight } from "lucide-react";

interface QuickActionsProps {
  currentUnitRoute: string;
}

export default function QuickActions({ currentUnitRoute }: QuickActionsProps) {
  return (
    <div className="rounded-3xl border border-glass bg-glass p-6 sm:p-7 shadow-sm space-y-5 text-left">
      <div className="pb-3 border-b border-foreground/[0.04]">
        <h3 className="text-lg font-black text-foreground tracking-tight">Thao tác nhanh</h3>
        <p className="text-xs text-muted-foreground font-normal">
          Phím tắt chuyển hướng nhanh đến các hoạt động học tập.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3.5">
        <Link href={currentUnitRoute}>
          <m.div
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.04] hover:bg-primary/5 hover:border-primary/20 transition-all group/action cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover/action:scale-110 transition-transform">
                <Play className="size-4.5 fill-primary" />
              </span>
              <span className="text-sm font-bold text-foreground">Học 10 phút</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover/action:text-primary transition-colors" />
          </m.div>
        </Link>

        <Link href="/speaking">
          <m.div
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.04] hover:bg-primary/5 hover:border-primary/20 transition-all group/action cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover/action:scale-110 transition-transform">
                <Mic className="size-4.5" />
              </span>
              <span className="text-sm font-bold text-foreground">Luyện phát âm</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover/action:text-emerald-500 transition-colors" />
          </m.div>
        </Link>

        <Link href="/roadmap">
          <m.div
            whileHover={{ x: 4 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.04] hover:bg-primary/5 hover:border-primary/20 transition-all group/action cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover/action:scale-110 transition-transform">
                <Map className="size-4.5" />
              </span>
              <span className="text-sm font-bold text-foreground">Xem Roadmap</span>
            </div>
            <ArrowRight className="size-4 text-muted-foreground group-hover/action:text-blue-500 transition-colors" />
          </m.div>
        </Link>
      </div>
    </div>
  );
}
