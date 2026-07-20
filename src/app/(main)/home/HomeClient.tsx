"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Circle,
  Layers,
  Map,
  Mic,
} from "lucide-react";
import { Page } from "@/components/ui/page";
import { buttonVariants } from "@/components/ui/button";
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

/**
 * /home job (uiux-web-design):
 * First viewport = one primary action — continue today's lesson.
 * Progress is status, not a competing CTA. List is secondary.
 */
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

  const hour = new Date().getHours();
  const hello =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  // Next few lessons around continue point (not a dump of 10 random)
  const nextSlice = useMemo(() => {
    if (pathComplete) {
      return authored.slice(-5);
    }
    const idx = authored.indexOf(continueId);
    const start = Math.max(0, idx === -1 ? 0 : idx);
    return authored.slice(start, start + 5);
  }, [authored, continueId, pathComplete]);

  return (
    <Page>
      {/* Status strip — compact, not a second hero */}
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{hello}</p>
          <h1 className="mt-0.5 text-xl font-semibold tracking-tight sm:text-2xl">
            {pathComplete ? "Lộ trình B1 đã xong" : "Học tiếp"}
          </h1>
        </div>
        <div
          className="shrink-0 text-right"
          data-testid="b1-progress"
          aria-label={`Tiến độ tới B1 ${pct} phần trăm`}
        >
          <p className="text-sm font-semibold tabular-nums text-foreground">
            {done}
            <span className="font-normal text-muted-foreground">
              /{CORE_PATH_TOTAL}
            </span>
          </p>
          <p className="text-[11px] text-muted-foreground">B1 · {pct}%</p>
        </div>
      </div>

      {/* Thin progress — status only */}
      <div
        className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* PRIMARY — first action in viewport */}
      <section
        className="mb-6 rounded-xl border border-border bg-card p-5"
        data-testid={pathComplete ? "path-complete" : "continue-card"}
      >
        {pathComplete ? (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-primary">Independent User</p>
              <p className="mt-1 text-base font-semibold">
                Bạn đã hoàn thành {CORE_PATH_TOTAL} bài A0→B1
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {CORE_OUTCOME_PROMISE_VI}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                href={learnPathForLesson(CORE_END_LESSON_ID)}
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:flex-1")}
                data-testid="review-b1-gate"
              >
                Ôn cổng B1
              </Link>
              <Link
                href="/flashcards"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "w-full sm:flex-1",
                )}
                data-testid="continue-srs"
              >
                Flashcard
              </Link>
            </div>
          </div>
        ) : continueLesson ? (
          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="size-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground">
                  Bài tiếp theo
                </p>
                <h2 className="mt-0.5 text-lg font-semibold leading-snug">
                  {continueLesson.title_vi}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {meta
                    ? `Bài ${meta.order}/${CORE_PATH_TOTAL}`
                    : continueLesson.cefr}
                  {" · "}
                  {continueLesson.cefr}
                  {" · ~"}
                  {continueLesson.estimatedMin} phút
                </p>
              </div>
            </div>
            <Link
              href={learnPathForLesson(continueId)}
              className={cn(
                buttonVariants({ size: "lg" }),
                "w-full min-h-11 gap-2",
              )}
              data-testid="continue-learning"
            >
              {completedIds.includes(continueId)
                ? "Học lại bài này"
                : "Bắt đầu học"}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground" data-testid="no-lessons">
            Chưa có bài sẵn sàng. Mở lộ trình để xem toàn bộ path.
          </p>
        )}
      </section>

      {/* Secondary tools — equal weight, not competing with primary */}
      <nav
        className="mb-8 grid grid-cols-3 gap-2"
        aria-label="Lối tắt"
      >
        {[
          { href: "/path", label: "Lộ trình", icon: Map, testId: "open-full-path" },
          { href: "/flashcards", label: "Ôn thẻ", icon: Layers },
          { href: "/speaking", label: "Nói", icon: Mic },
        ].map(({ href, label, icon: Icon, testId }) => (
          <Link
            key={href}
            href={href}
            data-testid={testId}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-2 py-2 text-xs font-medium transition-colors",
              "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            )}
          >
            <Icon className="size-4 text-primary" aria-hidden />
            {label}
          </Link>
        ))}
      </nav>

      {/* Secondary list — next few only */}
      <section aria-labelledby="home-next-lessons">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2
            id="home-next-lessons"
            className="text-sm font-medium text-muted-foreground"
          >
            {pathComplete ? "Bài gần đây" : "Sắp tới trên lộ trình"}
          </h2>
          <Link
            href="/path"
            className="text-xs font-medium text-primary hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {nextSlice.map((id) => {
            const lesson = getLessonV2(id);
            if (!lesson) return null;
            const isDone = completedIds.includes(id);
            const isCurrent = id === continueId && !pathComplete;
            return (
              <li key={id}>
                <Link
                  href={learnPathForLesson(id)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 transition-colors",
                    "hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
                    isCurrent && "bg-primary/5",
                  )}
                >
                  {isDone ? (
                    <Check
                      className="size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                  ) : (
                    <Circle
                      className="size-4 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {lesson.title_vi}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.cefr} · ~{lesson.estimatedMin} phút
                    </p>
                  </div>
                  <Badge
                    variant={
                      isDone ? "default" : isCurrent ? "secondary" : "outline"
                    }
                  >
                    {isDone ? "Xong" : isCurrent ? "Tiếp" : "Mở"}
                  </Badge>
                </Link>
              </li>
            );
          })}
        </ul>
        {authored.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Chưa có bài trong registry.
          </p>
        ) : null}
      </section>
    </Page>
  );
}
