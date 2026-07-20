"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Map,
  Target,
  CheckCircle2,
  Circle,
  Trophy,
  Layers,
  Mic,
} from "lucide-react";
import { Screen, PageHeader, AppButton } from "@/components/design-system";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  CORE_OUTCOME_CEFR,
  CORE_OUTCOME_PROMISE_VI,
} from "@/lib/constants/product-outcome";
import { learnPathForLesson } from "@/lib/v2/flag";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

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
  const endLesson = getLessonV2(CORE_END_LESSON_ID);
  const authored = listAuthoredLessonIds();
  const pct = Math.min(100, Math.round((done / CORE_PATH_TOTAL) * 100));
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Chào buổi sáng" : hour < 18 ? "Chào buổi chiều" : "Chào buổi tối";

  return (
    <Screen ambient>
      <motion.div {...fade} className="mb-6 space-y-3">
        <Badge variant="secondary" className="gap-1.5">
          Lộ trình {CORE_OUTCOME_CEFR} · A0→B1
        </Badge>
        <PageHeader
          eyebrow={greeting}
          title={
            pathComplete
              ? "Bạn đã hoàn thành lộ trình B1"
              : "Hôm nay học gì?"
          }
          subtitle={CORE_OUTCOME_PROMISE_VI}
        />
      </motion.div>

      <motion.div
        {...fade}
        transition={{ ...fade.transition, delay: 0.04 }}
        className="mb-4"
      >
        <Card data-testid="b1-progress">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Target className="size-4" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">Tiến độ tới B1</CardTitle>
                  <CardDescription>
                    {authored.length}/{CORE_PATH_TOTAL} bài trên lộ trình
                  </CardDescription>
                </div>
              </div>
              <span className="text-lg font-semibold tabular-nums text-primary">
                {done}
                <span className="text-sm font-medium text-muted-foreground">
                  /{CORE_PATH_TOTAL}
                </span>
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className="h-2 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tiến độ tới B1"
            >
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {pathComplete
                ? "Đã xong toàn bộ A0→B1 — Independent User"
                : `${pct}% hoàn thành lộ trình A0→B1`}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        {...fade}
        transition={{ ...fade.transition, delay: 0.08 }}
        className="mb-6"
      >
        <Card
          className="border-primary/20 bg-primary/5"
          data-testid={pathComplete ? "path-complete" : "continue-card"}
        >
          <CardContent className="space-y-4 pt-5">
            {pathComplete ? (
              <>
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border">
                    <Trophy className="size-5 text-amber-500" aria-hidden />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      Chúc mừng
                    </p>
                    <h2 className="text-lg font-semibold text-foreground">
                      Cổng B1 — Independent User
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Bạn đã hoàn thành {CORE_PATH_TOTAL}/{CORE_PATH_TOTAL} bài.{" "}
                      {CORE_OUTCOME_PROMISE_VI}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <AppButton
                    href={learnPathForLesson(CORE_END_LESSON_ID)}
                    fullWidth
                    size="lg"
                    data-testid="review-b1-gate"
                  >
                    Ôn cổng B1
                    <ArrowRight className="size-4" aria-hidden />
                  </AppButton>
                  <AppButton
                    href="/path"
                    fullWidth
                    size="lg"
                    variant="secondary"
                    data-testid="open-full-path"
                  >
                    <Map className="size-4" aria-hidden />
                    Lộ trình
                  </AppButton>
                  <AppButton
                    href="/flashcards"
                    fullWidth
                    size="lg"
                    variant="secondary"
                    data-testid="continue-srs"
                  >
                    <Layers className="size-4" aria-hidden />
                    Flashcard
                  </AppButton>
                </div>
                {endLesson ? (
                  <p className="text-xs text-muted-foreground">
                    Gợi ý ôn: {endLesson.title_vi} · ~{endLesson.estimatedMin} phút
                  </p>
                ) : null}
              </>
            ) : continueLesson ? (
              <>
                <div className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-background ring-1 ring-border">
                    <BookOpen className="size-5 text-primary" aria-hidden />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      Việc duy nhất hôm nay
                    </p>
                    <h2 className="text-lg font-semibold leading-snug text-foreground">
                      {continueLesson.title_vi}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {meta
                        ? `Bài ${meta.order}/${CORE_PATH_TOTAL}`
                        : continueLesson.cefr}{" "}
                      · {continueLesson.cefr} · ~{continueLesson.estimatedMin}{" "}
                      phút
                    </p>
                  </div>
                </div>
                <AppButton
                  href={learnPathForLesson(continueId)}
                  fullWidth
                  size="lg"
                  data-testid="continue-learning"
                >
                  {completedIds.includes(continueId)
                    ? "Học lại bài này"
                    : "Bắt đầu học"}
                  <ArrowRight className="size-4" aria-hidden />
                </AppButton>
              </>
            ) : (
              <p className="text-sm text-muted-foreground" data-testid="no-lessons">
                Chưa có bài học sẵn sàng. Quay lại sau nhé.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        {...fade}
        transition={{ ...fade.transition, delay: 0.1 }}
        className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3"
      >
        {[
          { href: "/path", label: "Lộ trình", icon: Map },
          { href: "/flashcards", label: "Ôn thẻ", icon: Layers },
          { href: "/speaking", label: "Luyện nói", icon: Mic },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto min-h-14 flex-col gap-1 py-3",
            )}
          >
            <Icon className="size-4 text-primary" aria-hidden />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </motion.div>

      <motion.section
        {...fade}
        transition={{ ...fade.transition, delay: 0.12 }}
        className="space-y-3 pb-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Bài trên lộ trình
          </h3>
          <Link
            href="/path"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <Map className="size-3.5" aria-hidden />
            Đầy đủ
          </Link>
        </div>
        <ul className="space-y-2">
          {authored.slice(0, 12).map((id, i) => {
            const lesson = getLessonV2(id);
            if (!lesson) return null;
            const doneItem = completedIds.includes(id);
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.12 + i * 0.03 }}
              >
                <Link href={learnPathForLesson(id)} className="block group">
                  <Card
                    size="sm"
                    className="transition hover:ring-primary/25 group-hover:bg-muted/30"
                  >
                    <CardContent className="flex items-center gap-3 py-3">
                      {doneItem ? (
                        <CheckCircle2
                          className="size-5 shrink-0 text-primary"
                          aria-hidden
                        />
                      ) : (
                        <Circle
                          className="size-5 shrink-0 text-muted-foreground group-hover:text-primary/60"
                          aria-hidden
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {lesson.title_vi}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lesson.cefr} · ~{lesson.estimatedMin} phút
                        </p>
                      </div>
                      <Badge variant={doneItem ? "default" : "outline"}>
                        {doneItem ? "Xong" : "Mở"}
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.li>
            );
          })}
        </ul>
        {authored.length > 12 ? (
          <p className="text-center text-xs text-muted-foreground">
            +{authored.length - 12} bài — xem trong{" "}
            <Link href="/path" className="text-primary hover:underline">
              lộ trình
            </Link>
          </p>
        ) : null}
      </motion.section>
    </Screen>
  );
}
