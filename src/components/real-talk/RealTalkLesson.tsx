"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  Tv,
  BookOpen,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

import type {
  RealTalkVideo,
  RealTalkLesson,
  LessonPhase,
  SpeakingDrillResult,
} from "@/types/real-talk";
import { completeRealTalkLesson } from "@/app/actions/completeRealTalk";

import PreWatchPhase from "./PreWatchPhase";
import WhileWatchPhase from "./WhileWatchPhase";
import PostWatchPhase from "./PostWatchPhase";

// ─── Phase metadata ─────────────────────────────────────────────────────────

const PHASES: {
  key: LessonPhase;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    key: "pre_watch",
    label: "Chuẩn bị",
    icon: <BookOpen size={14} />,
    description: "Học từ vựng & dự đoán",
  },
  {
    key: "while_watch",
    label: "Xem video",
    icon: <Tv size={14} />,
    description: "Nghe hiểu & phân tích",
  },
  {
    key: "post_watch",
    label: "Luyện tập",
    icon: <MessageSquare size={14} />,
    description: "Quiz & nói theo",
  },
  {
    key: "completed",
    label: "Hoàn thành",
    icon: <CheckCircle2 size={14} />,
    description: "Xem kết quả",
  },
];

// ─── Animation variants ─────────────────────────────────────────────────────

const phaseVariants = {
  enter: { opacity: 0, x: 40, scale: 0.98 },
  center: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -40, scale: 0.98 },
};

// ─── Completion Screen ──────────────────────────────────────────────────────

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
  const vocabCount = lesson.preWatch.vocabulary.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto text-center py-12 px-4"
    >
      {/* Stars */}
      <div className="flex justify-center gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 * i, type: "spring", stiffness: 200 }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill={i <= starCount ? "#fbbf24" : "none"}
              stroke={i <= starCount ? "#fbbf24" : "#52525b"}
              strokeWidth="1.5"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-2xl font-black text-white mb-2">
          {score >= 85
            ? "🎉 Xuất sắc!"
            : score >= 60
              ? "👍 Khá tốt!"
              : "💪 Cố gắng thêm nhé!"}
        </h2>
        <p className="text-4xl font-black text-emerald-400 mb-1">{score}%</p>
        <p className="text-sm text-zinc-400">điểm hiểu bài</p>
        {(xpEarned || newStreak) && (
          <div className="flex items-center justify-center gap-4 mt-3">
            {xpEarned ? (
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold">
                +{xpEarned} XP
              </span>
            ) : null}
            {newStreak ? (
              <span className="px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-bold">
                🔥 {newStreak} ngày
              </span>
            ) : null}
          </div>
        )}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-3 gap-3 mt-8 mb-8"
      >
        {[
          { label: "Từ vựng", value: vocabCount, emoji: "📚" },
          {
            label: "Câu hỏi",
            value: lesson.postWatch.comprehensionQuiz.length,
            emoji: "✅",
          },
          {
            label: "Nói theo",
            value: lesson.postWatch.speakingDrills.length,
            emoji: "🗣️",
          },
        ].map(({ label, value, emoji }) => (
          <div
            key={label}
            className="rounded-2xl bg-zinc-800/50 border border-zinc-700/50 p-4"
          >
            <p className="text-2xl mb-1">{emoji}</p>
            <p className="text-xl font-black text-white">{value}</p>
            <p className="text-xs text-zinc-400">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Lesson info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 mb-8"
      >
        <p className="text-sm text-emerald-400 font-bold mb-1">
          ✅ {lesson.canDoStatementVi}
        </p>
        <p className="text-xs text-zinc-500">
          Bạn đã hoàn thành bài học này. Từ vựng mới sẽ được đưa vào hệ thống ôn
          tập.
        </p>
      </motion.div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Link
          href="/real-talk"
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-center transition-colors active:scale-[0.98]"
        >
          Tiếp tục học →
        </Link>
        <Link
          href="/dashboard"
          className="w-full py-3 px-6 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium text-center transition-colors"
        >
          Về Dashboard
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Main Orchestrator ──────────────────────────────────────────────────────

interface RealTalkLessonProps {
  video: RealTalkVideo;
  lesson: RealTalkLesson;
}

export default function RealTalkLessonComponent({
  video,
  lesson,
}: RealTalkLessonProps) {
  const [phase, setPhase] = useState<LessonPhase>("pre_watch");
  const [finalScore, setFinalScore] = useState<number>(0);
  const [savedVocabWords, setSavedVocabWords] = useState<string[]>([]);
  const [completionXp, setCompletionXp] = useState<number | undefined>();
  const lessonStartRef = useRef<number>(0);
  useEffect(() => {
    lessonStartRef.current = Date.now();
  }, []);

  const currentPhaseIndex = PHASES.findIndex((p) => p.key === phase);
  const progress = Math.round((currentPhaseIndex / (PHASES.length - 1)) * 100);

  const handlePreWatchComplete = (savedWords: string[]) => {
    setSavedVocabWords(savedWords);
    setPhase("while_watch");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWhileWatchComplete = () => {
    setPhase("post_watch");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePostWatchComplete = async (
    score: number,
    speakingResults: SpeakingDrillResult[],
  ) => {
    setFinalScore(score);
    setPhase("completed");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Calculate learning time (capped at 30 min = 1800s)
    const learningSeconds = Math.min(
      Math.round((Date.now() - lessonStartRef.current) / 1000),
      1800,
    );

    // Fire completion server action (non-blocking for UI)
    try {
      const result = await completeRealTalkLesson({
        videoSlug: video.id,
        quizScore: score,
        speakingResults,
        savedVocab: savedVocabWords,
        learningSeconds,
      });
      if (result.success) {
        setCompletionXp(result.xpEarned);
        setCompletionStreak(result.newStreak);
      }
    } catch {
      // Completion save failure is non-fatal — lesson UI already shows results
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-teal-950/20">
      {/* ── Sticky Header ─────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-2xl border-b border-zinc-800/80 shadow-lg shadow-black/40">
        <div className="max-w-3xl mx-auto px-4 py-3.5">
          {/* Top row */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href="/real-talk"
                aria-label="Trở về Real Talk"
                className="shrink-0 flex items-center justify-center w-8 h-8 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all border border-zinc-700/40"
              >
                <ChevronLeft size={18} />
              </Link>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1">
                  <span>🎬 Real Talk</span>
                  <span className="text-zinc-600">•</span>
                  <span className="px-1.5 py-0.2 rounded bg-teal-500/10 border border-teal-500/20 text-teal-300">
                    {video.level}
                  </span>
                </p>
                <p className="text-sm font-bold text-white truncate max-w-[200px] sm:max-w-xs">
                  {lesson.titleVi}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] font-medium text-zinc-400">
                {PHASES[currentPhaseIndex]?.label}
              </p>
              <p className="text-xs font-black text-teal-400">
                {currentPhaseIndex + 1} / {PHASES.length}
              </p>
            </div>
          </div>

          {/* Phase progress indicators */}
          <div className="flex items-center gap-1.5">
            {PHASES.map((p, i) => {
              const isCompleted = i < currentPhaseIndex;
              const isCurrent = i === currentPhaseIndex;
              return (
                <div key={p.key} className="flex items-center flex-1">
                  <div
                    className={`
                      relative flex items-center justify-center rounded-xl shrink-0
                      transition-all duration-300
                      ${
                        isCurrent
                          ? "w-8 h-8 bg-gradient-to-r from-teal-500 to-emerald-500 ring-2 ring-teal-400/60 shadow-lg shadow-teal-900/60 border border-teal-300/40"
                          : isCompleted
                            ? "w-6 h-6 bg-teal-900/80 border border-teal-500/40 text-teal-300"
                            : "w-6 h-6 bg-zinc-800/80 border border-zinc-700/30 text-zinc-600"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={13} className="text-teal-300" />
                    ) : (
                      <span
                        className={`leading-none select-none ${
                          isCurrent ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {p.icon}
                      </span>
                    )}
                  </div>
                  {i < PHASES.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-1.5 rounded-full transition-all duration-500 ${
                        i < currentPhaseIndex
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

      {/* ── Phase Content ─────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">
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
              <PreWatchPhase
                video={video}
                content={lesson.preWatch}
                onComplete={handlePreWatchComplete}
              />
            )}
            {phase === "while_watch" && (
              <WhileWatchPhase
                video={video}
                lesson={lesson}
                onComplete={handleWhileWatchComplete}
              />
            )}
            {phase === "post_watch" && (
              <PostWatchPhase
                content={lesson.postWatch}
                culturalNotes={lesson.postWatch.culturalNotes}
                onComplete={handlePostWatchComplete}
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

      {/* ── Bottom progress bar (mobile) ──────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-zinc-800 z-50 sm:hidden">
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
