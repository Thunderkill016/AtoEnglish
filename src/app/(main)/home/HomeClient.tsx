"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Check, Circle } from "lucide-react";
import { Page, PageHeader, Section } from "@/components/ui/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  CORE_END_LESSON_ID,
  CORE_PATH_TOTAL,
  getPathMeta,
} from "@/lib/v2/path";
import {
  getContinueLessonId,
  getLessonV2,
  isCorePathComplete,
  listAuthoredLessonIds,
} from "@/lib/v2/lessons";
import {
  getCompletedIdsSnapshot,
  getServerCompletedIdsSnapshot,
  subscribeV2Progress,
} from "@/lib/v2/progress";
import { CORE_OUTCOME_PROMISE_VI } from "@/lib/constants/product-outcome";
import { learnPathForLesson } from "@/lib/v2/flag";

export function HomeClient() {
  const completedKey = useSyncExternalStore(
    subscribeV2Progress,
    getCompletedIdsSnapshot,
    getServerCompletedIdsSnapshot,
  );
  const completedIds = useMemo(
    () => (completedKey ? completedKey.split("\n").filter(Boolean) : []),
    [completedKey],
  );
  const done = completedIds.length;
  const pathComplete = isCorePathComplete(completedIds);
  const continueId = getContinueLessonId(completedIds);
  const continueLesson = getLessonV2(continueId);
  const meta = getPathMeta(continueId);
  const authored = listAuthoredLessonIds();
  const pct = Math.min(100, Math.round((done / CORE_PATH_TOTAL) * 100));

  return (
    <Page>
      <PageHeader
       title={pathComplete ? "Lộ trình B1 hoàn tất" : "Hôm nay"}
        description={CORE_OUTCOME_PROMISE_VI}
      />

      <Card className="mb-6" data-testid="b1-progress">
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium">Tiến độ A0→B1</p>
            <p className="text-sm tabular-nums text-muted-foreground">
              {done}/{CORE_PATH_TOTAL} · {pct}%
            </p>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tiến độ tới B1"
          >
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {authored.length} bài có nội dung trên lộ trình
          </p>
        </CardContent>
      </Card>

      <Card
        className="mb-6"
        data-testid={pathComplete ? "path-complete" : "continue-card"}
      >
        <CardContent className="space-y-4 pt-5">
          {pathComplete ? (
            <>
              <div>
                <p className="text-sm font-medium">Chúc mừng — Independent User</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bạn đã xong {CORE_PATH_TOTAL} bài. Ôn lại cổng B1 hoặc flashcard.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href={learnPathForLesson(CORE_END_LESSON_ID)}
                  className={cn(buttonVariants(), "w-full")}
                  data-testid="review-b1-gate"
                >
                  Ôn cổng B1
                </Link>
                <Link
                  href="/path"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  data-testid="open-full-path"
                >
                  Xem lộ trình
                </Link>
                <Link
                  href="/flashcards"
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  data-testid="continue-srs"
                >
                  Flashcard
                </Link>
              </div>
            </>
          ) : continueLesson ? (
            <>
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Bài tiếp theo
                </p>
                <p className="mt-1 text-base font-semibold">
                  {continueLesson.title_vi}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {meta ? `Bài ${meta.order}/${CORE_PATH_TOTAL}` : continueLesson.cefr}
                  {" · "}
                  {continueLesson.cefr}
                  {" · ~"}
                  {continueLesson.estimatedMin} phút
                </p>
              </div>
              <Link
                href={learnPathForLesson(continueId)}
                className={cn(buttonVariants({ size: "lg" }), "w-full")}
                data-testid="continue-learning"
              >
                {completedIds.includes(continueId) ? "Học lại" : "Bắt đầu"}
                <ArrowRight className="size-4" />
              </Link>
            </>
          ) : (
            <p className="text-sm text-muted-foreground" data-testid="no-lessons">
              Chưa có bài sẵn sàng.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mb-8 grid grid-cols-3 gap-2">
        {[
          { href: "/path", label: "Lộ trình" },
          { href: "/flashcards", label: "Ôn thẻ" },
          { href: "/speaking", label: "Nói" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-11 text-xs",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <Section>
        <ul className="space-y-2">
          {authored.slice(0, 10).map((id) => {
            const lesson = getLessonV2(id);
            if (!lesson) return null;
            const isDone = completedIds.includes(id);
            return (
              <li key={id}>
                <Link href={learnPathForLesson(id)} className="block">
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-3 transition-colors hover:bg-muted/40">
                    {isDone ? (
                      <Check className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {lesson.title_vi}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lesson.cefr} · ~{lesson.estimatedMin}p
                      </p>
                    </div>
                    <Badge variant={isDone ? "default" : "outline"}>
                      {isDone ? "Xong" : "Mở"}
                    </Badge>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
    </Page>
  );
}
