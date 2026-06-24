"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Trophy,
  Zap,
  Star,
  RotateCcw,
  BookOpen,
  Layers,
  Target,
} from "lucide-react";
import { UNIT_VOCABULARY, type VocabularyItem } from "@/lib/constants/vocabulary";
import { saveChallengeResult } from "@/app/actions/challenge";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Question {
  word: string;
  phonetic: string;
  example_en: string;
  correct: string;
  options: string[];
}

type Phase = "intro" | "quiz" | "result";
type AnswerState = "idle" | "correct" | "wrong";

const TOTAL_QUESTIONS = 5;

// ─── Seeded RNG (Linear Congruential Generator) ───────────────────────────────
function seededRng(seed: string) {
  let state = 0;
  for (let i = 0; i < seed.length; i++) {
    state = Math.imul(31, state) + seed.charCodeAt(i) | 0;
  }
  state = Math.abs(state) || 1;
  return () => {
    state = Math.imul(1664525, state) + 1013904223 | 0;
    return Math.abs(state) / 0x7fffffff;
  };
}

function seededShuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Level → unit IDs mapping ─────────────────────────────────────────────────
const LEVEL_UNIT_PREFIXES: Record<string, string[]> = {
  A0: ["unit-a0-"],
  A1: ["unit-a0-", "unit-1", "unit-2", "unit-3", "unit-4", "unit-5", "unit-6"],
  A2: ["unit-7", "unit-8", "unit-9", "unit-10", "unit-11", "unit-12"],
  B1: ["unit-13", "unit-14", "unit-15", "unit-16", "unit-17", "unit-18", "unit-19", "unit-20"],
  B2: ["unit-21", "unit-22", "unit-23", "unit-24", "unit-25", "unit-26", "unit-27", "unit-28"],
};

function getVocabForLevel(level: string): VocabularyItem[] {
  const prefixes =
    LEVEL_UNIT_PREFIXES[level] ??
    LEVEL_UNIT_PREFIXES["A1"];

  const allUnits = Object.keys(UNIT_VOCABULARY);
  const matchedUnits = allUnits.filter((uid) =>
    prefixes.some((p) => uid.startsWith(p))
  );

  const vocab: VocabularyItem[] = [];
  for (const uid of matchedUnits) {
    vocab.push(...(UNIT_VOCABULARY[uid] ?? []));
  }
  return vocab;
}

// ─── Build 5 deterministic daily questions ────────────────────────────────────
function buildDailyQuestions(level: string, dateSeed: string): Question[] {
  const vocab = getVocabForLevel(level);
  if (vocab.length < 8) return [];

  const rng = seededRng(`${dateSeed}-${level}`);
  const shuffled = seededShuffle(vocab, rng);
  const selected = shuffled.slice(0, TOTAL_QUESTIONS);
  const allMeanings = [...new Set(vocab.map((v) => v.meaning_vn))];

  return selected.map((item) => {
    const distractors = seededShuffle(
      allMeanings.filter((m) => m !== item.meaning_vn),
      rng
    ).slice(0, 3);
    const options = seededShuffle([item.meaning_vn, ...distractors], rng);
    return {
      word: item.word,
      phonetic: item.phonetic,
      example_en: item.example_en,
      correct: item.meaning_vn,
      options,
    };
  });
}

// ─── Storage helpers ──────────────────────────────────────────────────────────
const STORAGE_KEY_PREFIX = "ato_challenge_";

function getTodayKey() {
  return (
    STORAGE_KEY_PREFIX +
    new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" })
  );
}

function getTodayDate() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" });
}

interface StoredResult {
  score: number;
  xpEarned: number;
  date: string;
}

function getStoredResult(): StoredResult | null {
  try {
    const raw = localStorage.getItem(getTodayKey());
    return raw ? (JSON.parse(raw) as StoredResult) : null;
  } catch {
    return null;
  }
}

function storeResult(result: StoredResult) {
  try {
    localStorage.setItem(getTodayKey(), JSON.stringify(result));
  } catch {
    // ignore
  }
}

// ─── XP Badge component ───────────────────────────────────────────────────────
function XPBadge({ xp }: { xp: number }) {
  return (
    <motion.span
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.3 }}
      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-500 font-black text-sm"
    >
      <Zap className="w-3.5 h-3.5" />
      +{xp} XP
    </motion.span>
  );
}

// ─── Score stars ──────────────────────────────────────────────────────────────
function ScoreStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1 justify-center">
      {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 400 }}
        >
          <Star
            className={`w-6 h-6 ${
              i < score
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-200 dark:text-zinc-700 fill-zinc-200 dark:fill-zinc-700"
            }`}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChallengeClient({ level }: { level: string }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [alreadyDone, setAlreadyDone] = useState<StoredResult | null>(null);
  const [saving, setSaving] = useState(false);

  const dateSeed = getTodayDate();

  const questions = useMemo(
    () => buildDailyQuestions(level, dateSeed),
    [level, dateSeed]
  );

  // Check if already completed today
  useEffect(() => {
    const stored = getStoredResult();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAlreadyDone(stored);
       
      setScore(stored.score);
       
      setXpEarned(stored.xpEarned);
       
      setPhase("result");
    }
  }, []);

  const handleAnswer = useCallback(
    (option: string) => {
      if (answerState !== "idle" || saving) return;
      const q = questions[current];
      const isCorrect = option === q.correct;

      setSelectedOption(option);
      setAnswerState(isCorrect ? "correct" : "wrong");

      if (isCorrect) setScore((s) => s + 1);

      // Auto-advance after 900ms
      setTimeout(() => {
        setAnswerState("idle");
        setSelectedOption(null);
        if (current < TOTAL_QUESTIONS - 1) {
          setCurrent((c) => c + 1);
        } else {
          // Done — save result
          const finalScore = isCorrect ? score + 1 : score;
          const today = getTodayDate();
          setSaving(true);
          saveChallengeResult({ score: finalScore, total: TOTAL_QUESTIONS, date: today }).then(
            (res) => {
              const earned = res.success ? (res.xpEarned ?? 10) : 10;
              setXpEarned(earned);
              setSaving(false);
              const result: StoredResult = { score: finalScore, xpEarned: earned, date: today };
              storeResult(result);
              setScore(finalScore);
              setPhase("result");

              if (finalScore >= 4) {
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.5 },
                  colors: ["#10b981", "#f59e0b", "#6366f1"],
                });
              }
            }
          );
        }
      }, 900);
    },
    [answerState, saving, questions, current, score]
  );

  const q = questions[current];

  // ── Intro screen ─────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/6 blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 rounded-full bg-violet-500/6 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center space-y-6"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </Link>

          <div className="space-y-3">
            <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/25 mx-auto">
              <Target className="w-8 h-8 text-emerald-500" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-2">
                <Zap className="w-3 h-3" />
                Thử Thách Hôm Nay
              </span>
              <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight mt-2">
                5 Câu Từ Vựng
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                Trả lời đúng càng nhiều, nhận càng nhiều XP. Tối đa{" "}
                <span className="font-black text-amber-500">50 XP</span> mỗi ngày!
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Câu hỏi", value: "5", icon: "📝" },
              { label: "Cấp độ", value: level, icon: "🎓" },
              { label: "Max XP", value: "50", icon: "⚡" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center p-3 rounded-2xl bg-white/60 dark:bg-white/4 border border-zinc-200/60 dark:border-white/8"
              >
                <span className="text-lg">{s.icon}</span>
                <span className="text-base font-black text-zinc-900 dark:text-white mt-0.5">
                  {s.value}
                </span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          {questions.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Chưa đủ từ vựng cho cấp độ này. Hãy học thêm bài!
            </p>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPhase("quiz")}
              className="w-full h-13 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-base shadow-lg shadow-emerald-500/25 transition-all"
            >
              Bắt Đầu Thử Thách 🚀
            </motion.button>
          )}
        </motion.div>
      </div>
    );
  }

  // ── Result screen ─────────────────────────────────────────────────────────────
  if (phase === "result") {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
    const label =
      pct === 100
        ? "Xuất sắc! 🏆"
        : pct >= 80
        ? "Rất tốt! 🎉"
        : pct >= 60
        ? "Khá tốt! 💪"
        : pct >= 40
        ? "Cần luyện thêm 📚"
        : "Hãy ôn tập nhé 🔄";

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm w-full space-y-6 text-center"
        >
          {/* Trophy icon */}
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 18 }}
            className="inline-flex w-20 h-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400/20 to-orange-400/20 border border-amber-400/25 mx-auto"
          >
            <Trophy className="w-10 h-10 text-amber-500" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">{label}</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Bạn trả lời đúng{" "}
              <span className="font-black text-zinc-900 dark:text-white">
                {score}/{TOTAL_QUESTIONS}
              </span>{" "}
              câu hôm nay
            </p>
          </div>

          <ScoreStars score={score} />

          <div className="flex items-center justify-center gap-3">
            <XPBadge xp={xpEarned} />
            {alreadyDone && (
              <span className="text-xs text-zinc-400 font-medium">
                ✓ Đã hoàn thành hôm nay
              </span>
            )}
          </div>

          {/* Score card */}
          <div className="rounded-2xl bg-white/60 dark:bg-white/4 border border-zinc-200/60 dark:border-white/8 p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Điểm số
              </span>
              <span className="text-xl font-black text-zinc-900 dark:text-white">
                {score} / {TOTAL_QUESTIONS}
              </span>
            </div>
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  pct >= 80
                    ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                    : pct >= 60
                    ? "bg-gradient-to-r from-blue-500 to-indigo-400"
                    : "bg-gradient-to-r from-amber-500 to-orange-400"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Thử thách mới sẽ có lúc nửa đêm (giờ Việt Nam)
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <Link
              href="/flashcards"
              className="flex items-center justify-center gap-2 h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:from-emerald-400 hover:to-teal-400 transition-all active:scale-95 shadow-sm"
            >
              <Layers className="w-4 h-4" />
              Ôn Flashcard Ngay
            </Link>
            <div className="flex gap-3">
              <Link
                href="/learn"
                className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl border border-zinc-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:border-zinc-300 dark:hover:border-white/20 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Học Bài Mới
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-1.5 h-11 rounded-2xl border border-zinc-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 text-sm font-bold hover:border-zinc-300 dark:hover:border-white/20 transition-all"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Quiz screen ───────────────────────────────────────────────────────────────
  if (!q) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/4 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setPhase("intro")}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">
          Thử Thách Hôm Nay
        </span>
        <span className="text-xs font-black text-zinc-500">
          {current + 1}/{TOTAL_QUESTIONS}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {Array.from({ length: TOTAL_QUESTIONS }).map((_, i) => (
          <motion.div
            key={i}
            className={`rounded-full transition-all duration-300 ${
              i < current
                ? "w-8 h-2 bg-emerald-500"
                : i === current
                ? "w-8 h-2 bg-primary"
                : "w-2 h-2 bg-zinc-200 dark:bg-zinc-700"
            }`}
          />
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="flex-1 space-y-8"
        >
          {/* Word card */}
          <div className="text-center space-y-3 py-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Nghĩa tiếng Việt của từ này là gì?
            </p>
            <h2 className="text-4xl sm:text-5xl font-black text-zinc-900 dark:text-white tracking-tight">
              {q.word}
            </h2>
            <p className="text-sm font-mono text-zinc-400">{q.phonetic}</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic max-w-xs mx-auto leading-relaxed">
              &ldquo;{q.example_en}&rdquo;
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === q.correct;
              let style =
                "border-zinc-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-white/25 hover:bg-zinc-50 dark:hover:bg-white/8";

              if (answerState !== "idle") {
                if (isCorrect) {
                  style =
                    "border-emerald-500/60 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
                } else if (isSelected && !isCorrect) {
                  style = "border-red-500/60 bg-red-500/10 text-red-700 dark:text-red-400";
                }
              }

              return (
                <motion.button
                  key={option}
                  whileTap={{ scale: 0.98 }}
                  disabled={answerState !== "idle"}
                  onClick={() => handleAnswer(option)}
                  className={`relative flex items-center justify-between px-4 py-4 rounded-2xl border font-semibold text-sm text-left transition-all duration-200 ${style} disabled:cursor-not-allowed`}
                >
                  <span>{option}</span>
                  <AnimatePresence>
                    {answerState !== "idle" && isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      </motion.span>
                    )}
                    {answerState !== "idle" && isSelected && !isCorrect && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Saving indicator */}
      {saving && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 text-xs text-zinc-400">
            <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            Đang lưu kết quả...
          </div>
        </div>
      )}
    </div>
  );
}
