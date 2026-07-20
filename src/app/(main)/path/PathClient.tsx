"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, Play } from "lucide-react";
import { CORE_PATH_PLAN, CORE_PATH_TOTAL } from "@/lib/v2/path";
import {
  countAuthoredOnCorePath,
  getLessonV2,
  isPathLessonOpenable,
} from "@/lib/v2/lessons";
import {
  getCompletedIdsSnapshot,
  getServerCompletedIdsSnapshot,
  subscribeV2Progress,
} from "@/lib/v2/progress";
import { learnPathForLesson } from "@/lib/v2/flag";
import { cn } from "@/lib/utils";
import { Screen, PageHeader } from "@/components/design-system";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

const PHASE_META: Record<
  string,
  { title: string; badge: "default" | "secondary" | "outline" }
> = {
  P0: { title: "Nền tảng A0", badge: "secondary" },
  P1: { title: "Đời sống A1", badge: "default" },
  P2: { title: "Chức năng A2 · cổng giữa", badge: "outline" },
  P3: { title: "Độc lập B1 ★ đích", badge: "default" },
};

function pathHeaderCopy(authored: number, total: number): string {
  if (authored >= total) {
    return `${total} bài đầy đủ · A0 → B1 Independent User. Học theo thứ tự; bài đã xong có thể ôn lại.`;
  }
  return `${authored}/${total} bài sẵn sàng · A0 → B1. Học theo thứ tự; bài chưa mở sẽ khóa đến khi hoàn thành bài trước.`;
}

export function PathClient() {
  const completedKey = useSyncExternalStore(
    subscribeV2Progress,
    getCompletedIdsSnapshot,
    getServerCompletedIdsSnapshot,
  );
  const done = useMemo(
    () => new Set(completedKey ? completedKey.split("\n").filter(Boolean) : []),
    [completedKey],
  );
  const completedList = useMemo(() => Array.from(done), [done]);
  const authoredCount = useMemo(() => countAuthoredOnCorePath(), []);

  const phases = ["P0", "P1", "P2", "P3"] as const;

  return (
    <Screen ambient>
      <div className="mb-6 space-y-3">
        <Link
          href="/home"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "-ml-2 text-muted-foreground",
          )}
        >
          <ArrowLeft className="size-4" />
          Home
        </Link>
        <PageHeader
          eyebrow="Chương trình"
          title="Lộ trình B1"
          subtitle={pathHeaderCopy(authoredCount, CORE_PATH_TOTAL)}
        />
      </div>

      <div className="space-y-6 pb-8">
        {phases.map((phase, pi) => {
          const items = CORE_PATH_PLAN.filter((l) => l.phase === phase);
          const pm = PHASE_META[phase];
          const phaseDone = items.filter((i) => done.has(i.id)).length;
          return (
            <motion.section
              key={phase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pi * 0.05, duration: 0.28 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Badge variant={pm.badge}>{pm.title}</Badge>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {phaseDone}/{items.length}
                </span>
              </div>
              <Card size="sm">
                <CardContent className="space-y-1.5 pt-0">
                  <ul className="space-y-1">
                    {items.map((item) => {
                      const hasContent = Boolean(getLessonV2(item.id));
                      const completed = done.has(item.id);
                      const openable = isPathLessonOpenable(
                        item.id,
                        completedList,
                      );
                      const row = (
                        <div
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm transition",
                            openable
                              ? "hover:bg-muted/60"
                              : "opacity-50",
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full border text-[10px]",
                              completed
                                ? "border-primary bg-primary text-primary-foreground"
                                : openable
                                  ? "border-primary/40 bg-background text-primary"
                                  : "border-border bg-muted text-muted-foreground",
                            )}
                          >
                            {completed ? (
                              <Check className="size-3" strokeWidth={3} />
                            ) : openable ? (
                              <Play className="size-2.5 fill-current" />
                            ) : (
                              <Lock className="size-2.5" />
                            )}
                          </span>
                          <span className="w-6 shrink-0 text-[11px] tabular-nums text-muted-foreground">
                            {item.order}
                          </span>
                          <span
                            className={cn(
                              "flex-1 font-medium",
                              openable
                                ? "text-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            {item.title_vi}
                          </span>
                          {!hasContent && (
                            <Badge variant="outline" className="text-[10px]">
                              soon
                            </Badge>
                          )}
                          {hasContent && !openable && (
                            <Badge variant="outline" className="text-[10px]">
                              khóa
                            </Badge>
                          )}
                        </div>
                      );
                      return (
                        <li key={item.id}>
                          {openable ? (
                            <Link
                              href={learnPathForLesson(item.id)}
                              className="block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                            >
                              {row}
                            </Link>
                          ) : (
                            row
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </CardContent>
              </Card>
            </motion.section>
          );
        })}
      </div>
    </Screen>
  );
}
