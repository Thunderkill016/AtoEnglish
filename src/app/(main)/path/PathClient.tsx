"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { Check, Lock, Play } from "lucide-react";
import { Page, PageHeader } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

const PHASES = [
  { id: "P0", title: "A0 · Nền" },
  { id: "P1", title: "A1 · Đời sống" },
  { id: "P2", title: "A2 · Cổng giữa" },
  { id: "P3", title: "B1 · Độc lập" },
] as const;

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
  const authoredCount = countAuthoredOnCorePath();

  return (
    <Page>
      <div className="mb-4">
        <Link
          href="/home"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2")}
        >
          ← Home
        </Link>
      </div>
      <PageHeader
       description={
          authoredCount >= CORE_PATH_TOTAL
            ? `${CORE_PATH_TOTAL} bài · học theo thứ tự · ôn lại bất kỳ lúc nào.`
            : `${authoredCount}/${CORE_PATH_TOTAL} bài sẵn sàng · mở tuần tự.`
        }
      />

      <div className="space-y-8">
        {PHASES.map((phase) => {
          const items = CORE_PATH_PLAN.filter((l) => l.phase === phase.id);
          const phaseDone = items.filter((i) => done.has(i.id)).length;
          return (
            <section key={phase.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {phase.title}
                </h2>
                <span className="text-xs tabular-nums text-muted-foreground">
                  {phaseDone}/{items.length}
                </span>
              </div>
              <Card size="sm">
                <CardContent className="divide-y divide-border p-0">
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
                          "flex items-center gap-3 px-3 py-3 text-sm",
                          !openable && "opacity-50",
                        )}
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-[10px]">
                          {completed ? (
                            <Check className="size-3 text-primary" />
                          ) : openable ? (
                            <Play className="size-2.5 fill-current text-primary" />
                          ) : (
                            <Lock className="size-2.5 text-muted-foreground" />
                          )}
                        </span>
                        <span className="w-5 shrink-0 text-xs text-muted-foreground tabular-nums">
                          {item.order}
                        </span>
                        <span className="min-w-0 flex-1 font-medium">
                          {item.title_vi}
                        </span>
                        {!hasContent ? (
                          <Badge variant="outline">soon</Badge>
                        ) : !openable ? (
                          <Badge variant="outline">khóa</Badge>
                        ) : null}
                      </div>
                    );
                    return openable ? (
                      <Link
                        key={item.id}
                        href={learnPathForLesson(item.id)}
                        className="block hover:bg-muted/40"
                      >
                        {row}
                      </Link>
                    ) : (
                      <div key={item.id}>{row}</div>
                    );
                  })}
                </CardContent>
              </Card>
            </section>
          );
        })}
      </div>
    </Page>
  );
}
