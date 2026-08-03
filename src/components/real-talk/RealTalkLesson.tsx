"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  MessageSquare,
  ShieldAlert,
  Target,
  Tv,
  Users,
} from "lucide-react";
import Link from "next/link";

import type {
  LessonPhase,
  RealTalkLesson,
  RealTalkVideo,
  SpeakingDrillResult,
} from "@/types/real-talk";
import { completeRealTalkLesson } from "@/app/actions/completeRealTalk";

import PostWatchPhase from "./PostWatchPhase";
import PreWatchPhase from "./PreWatchPhase";
import WhileWatchPhase from "./WhileWatchPhase";

const PHASES: Array<{
  key: LessonPhase;
  label: string;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    key: "pre_watch",
    label: "Chuẩn bị",
    icon: <BookOpen size={14} />,
    description: "Hiểu tình huống",
  },
  {
    key: "while_watch",
    label: "Xem video",
    icon: <Tv size={14} />,
    description: "Nghe & tìm bằng chứng",
  },
  {
    key: "post_watch",
    label: "Sử dụng",
    icon: <MessageSquare size={14} />,
    description: "Tự nhớ, nói & ứng biến",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    icon: <CheckCircle2 size={14} />,
    description: "Xem bằng chứng",
  },
];

const phaseVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.98 },
};

function EnvironmentBrief({ lesson }: { lesson: RealTalkLesson }) {
  if (!lesson.environment) return null;

  return (
    <section className="mx-4 mt-6 grid gap-3 sm:mx-6 sm:grid-cols-2">
      <div className="rounded-2xl border border-teal-500/20 bg-teal-950/20 p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-300">
          <Users className="size-4" /> Môi trường giao tiếp
        </p>
        <h2 className="mt-2 font-black text-white">
          {lesson.environment.titleVi}
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          {lesson.environment.situationVi}
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          Vai của bạn: {lesson.environment.learnerRoleVi}
        </p>
      </div>
      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-300">
          <Target className="size-4" /> Việc cần làm ngoài đời
        </p>
        <p className="mt-3 text-sm font-bold leading-6 text-emerald-50">
          {lesson.environment.realWorldGoalVi}
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          Người đối diện: {lesson.environment.partnerRoleVi}
        </p>
      </div>
    </section>
  );
}

function CompletionScreen({
  lesson,
  score,
  xpEarned,
  newStreak,
}: {
  lesson: RealTalkLesson;
  score: number;
  xpEarned?: number;
  newStreak?: number;
}) {
  const starCount = score >= 85 ? 3 : score >= 60 ? 2 : 1;
  const eventCount = lesson.communicationEvents?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto max-w-lg px-4 py-12 text-center"
    >
      <div className="mb-6 flex justify-center gap-2">
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 * index, type: "spring", stiffness: 200 }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill={index <= starCount ? "#fbbf24" : "none"}
              stroke={index <= starCount ? "#fbbf24" : "#52525b"}
              strokeWidth="1.5"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="mb-2 text-2xl font-black text-white">
          Đã hoàn thành chu trình Real Talk
        </h2>
        <p className="text-4xl font-black text-emerald-400 mb-1">{score}%</p>
        <p className="text-sm text-zinc-400">điểm hiểu bài</p>
        {(xpEarned || newStreak) && (
          <div className="mt-3 flex items-center justify-center gap-4">
            {xpEarned ? (
              <span className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-sm font-bold text-amber-400">
                +{xpEarned} XP
              </span>
            ) : null}
            {newStreak ? (
              <span className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-1 text-sm font-bold text-orange-400">
                🔥 {newStreak} ngày
              </span>
            ) : null}
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mb-8 mt-8 grid grid-cols-3 gap-3"
      >
        {[
          {
            label: "Sự kiện",
            value: eventCount || "—",
            emoji: "💬",
          },
          {
            label: "Câu hiểu",
            value: lesson.postWatch.comprehensionQuiz.length,
            emoji: "✅",
          },
          {
            label: "Transfer",
            value: lesson.transferTask ? 1 : "—",
            emoji: "🔄",
          },
        ].map(({ label, value, emoji }) => (
          <div
            key={label}
            className="rounded-2xl border border-zinc-700/50 bg-zinc-800/50 p-4"
          >
            <p className="mb-1 text-2xl">{emoji}</p>
            <p className="text-xl font-black text-white">{value}</p>
            <p className="text-xs text-zinc-400">{label}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-left"
      >
        <p className="text-sm font-bold text-emerald-300">
          Mục tiêu luyện tập: {lesson.canDoStatementVi}
        </p>
        <p className="mt-2 text-xs leading-5 text-zinc-500">
          Kết quả này ghi nhận một lượt luyện ngay sau bài. Nó chưa chứng minh bạn
          đã thành thạo lâu dài; cần gặp lại người nói và tình huống khác sau một
          khoảng trễ.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3">
        <Link
          href="/real-talk"
          className="w-full rounded-2xl bg-emerald-500 px-6 py-3.5 text-center font-bold text-white transition-colors hover:bg-emerald-400 active:scale-[0.98]"
        >
          Tiếp tục Real Talk →
        </Link>
        <Link
          href="/dashboard"
          className="w-full rounded-2xl bg-zinc-800 px-6 py-3 text-center font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
        >
          Về Dashboard
        </Link>
      </div>
    </motion.div>
  );
}

interface RealTalkLessonProps {
  video: RealTalkVideo;
  lesson: RealTalkLesson;
}

export default function RealTalkLessonComponent({
  video,
  lesson,
}: RealTalkLessonProps) {
  const [phase, setPhase] = useState<LessonPhase>("pre_watch");
  const [finalScore, setFinalScore] = useState(0);
  const [savedVocabWords, setSavedVocabWords] = useState<string[]>([]);
  const [completionXp, setCompletionXp] = useState<number | undefined>();
  const [completionStreak, setCompletionStreak] = useState<number | undefined>();
  const lessonStartRef = useRef<number>(0);

  useEffect(() => {
    lessonStartRef.current = Date.now();
  }, []);

  const currentPhaseIndex = PHASES.findIndex((item) => item.key === phase);
  const progress = Math.round((currentPhaseIndex / (PHASES.length - 1)) * 100);

  const advance = (next: LessonPhase) => {
    setPhase(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-teal-950/20">
      <div className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/85 shadow-lg shadow-black/40 backdrop-blur-2xl">
        <div className="mx-auto max-w-3xl px-4 py-3.5">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-2.5">
              <Link
                href="/real-talk"
                aria-label="Trở về Real Talk"
                className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-zinc-700/40 bg-zinc-800/80 text-zinc-400 transition-all hover:bg-zinc-700 hover:text-white"
              >
                <ChevronLeft size={18} />
              </Link>
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-teal-400">
                  <span>🎬 Real Talk</span>
                  <span className="text-zinc-600">•</span>
                  <span className="rounded border border-teal-500/20 bg-teal-500/10 px-1.5 text-teal-300">
                    {video.level}
                  </span>
                  {lesson.generation?.status === "ai_draft" && (
                    <span className="inline-flex items-center gap-1 rounded border border-amber-500/20 bg-amber-500/10 px-1.5 text-amber-300">
                      <ShieldAlert className="size-3" /> AI draft
                    </span>
                  )}
                </p>
                <p className="max-w-[200px] truncate text-sm font-bold text-white sm:max-w-xs">
                  {lesson.titleVi}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] font-medium text-zinc-400">
                {PHASES[currentPhaseIndex]?.label}
              </p>
              <p className="text-xs font-black text-teal-400">
                {currentPhaseIndex + 1} / {PHASES.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {PHASES.map((item, index) => {
              const isCompleted = index < currentPhaseIndex;
              const isCurrent = index === currentPhaseIndex;
              return (
                <div key={item.key} className="flex flex-1 items-center">
                  <div
                    title={item.description}
                    className={`relative flex shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      isCurrent
                        ? "size-8 border border-teal-300/40 bg-gradient-to-r from-teal-500 to-emerald-500 shadow-lg shadow-teal-900/60 ring-2 ring-teal-400/60"
                        : isCompleted
                          ? "size-6 border border-teal-500/40 bg-teal-900/80 text-teal-300"
                          : "size-6 border border-zinc-700/30 bg-zinc-800/80 text-zinc-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={13} className="text-teal-300" />
                    ) : (
                      <span className={isCurrent ? "text-white" : "text-zinc-500"}>
                        {item.icon}
                      </span>
                    )}
                  </div>
                  {index < PHASES.length - 1 && (
                    <div
                      className={`mx-1.5 h-1 flex-1 rounded-full transition-all duration-500 ${
                        index < currentPhaseIndex
                          ? "bg-gradient-to-r from-teal-600 to-emerald-500"
                          : "bg-zinc-800/80"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            variants={phaseVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {phase === "pre_watch" && (
              <>
                <EnvironmentBrief lesson={lesson} />
                <PreWatchPhase
                  video={video}
                  content={lesson.preWatch}
                  onComplete={(savedWords) => {
                    if (savedWords) setSavedVocabWords(savedWords);
                    advance("while_watch");
                  }}
                />
              </>
            )}
            {phase === "while_watch" && (
              <WhileWatchPhase
                video={video}
                lesson={lesson}
                onComplete={() => advance("post_watch")}
              />
            )}
            {phase === "post_watch" && (
              <PostWatchPhase
                content={lesson.postWatch}
                culturalNotes={lesson.postWatch.culturalNotes}
                transferTask={lesson.transferTask}
                onComplete={async (score, speakingResults) => {
                  setFinalScore(score);
                  advance("completed");
                  const learningSeconds = Math.min(
                    Math.round((Date.now() - (lessonStartRef.current || Date.now())) / 1000),
                    1800,
                  );
                  try {
                    const result = await completeRealTalkLesson({
                      videoSlug: video.id,
                      quizScore: score,
                      speakingResults: speakingResults || [],
                      savedVocab: savedVocabWords,
                      learningSeconds,
                    });
                    if (result.success) {
                      setCompletionXp(result.xpEarned);
                      setCompletionStreak(result.newStreak);
                    }
                  } catch {
                    // Non-fatal
                  }
                }}
              />
            )}
            {phase === "completed" && (
              <CompletionScreen
                lesson={lesson}
                score={finalScore}
                xpEarned={completionXp}
                newStreak={completionStreak}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 h-1 bg-zinc-800 sm:hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-teal-500 to-emerald-400"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
