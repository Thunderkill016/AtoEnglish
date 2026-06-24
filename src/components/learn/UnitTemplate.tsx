"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";

import { completeUnit, getUnitCompletionStatus } from "@/app/actions/unit";
import { getDueWarmupCards, seedUnitVocabToSRS, scheduleWrongWordsForReview } from "@/app/actions/cards";

import WarmupSection from "./sections/WarmupSection";
import VocabSection from "./sections/VocabSection";
import GrammarSection from "./sections/GrammarSection";
import PracticeSection from "./sections/PracticeSection";
import DialogueSection from "./sections/DialogueSection";
import ShadowingSection from "./sections/ShadowingSection";
import SpeakingSection from "./sections/SpeakingSection";
import QuizSection from "./sections/QuizSection";
import TranslateSection from "./sections/TranslateSection";
import FluencySection from "./sections/FluencySection";
import type { ReadingPassage } from "@/components/exercises/ReadingComprehensionExercise";

// ─── Section order & labels (10 steps, Hybrid pedagogical flow) ───────────────
const SECTION_LABELS: Record<number, string> = {
  1: "Khởi động",
  2: "Từ vựng",
  3: "Ngữ pháp",
  4: "Luyện tập",
  5: "Hội thoại",
  10: "Phản xạ",
  9: "Dịch câu",
  6: "Shadowing",
  7: "Luyện nói",
  8: "Hoàn thành",
};
const SECTION_ORDER = [1, 2, 3, 4, 5, 10, 9, 6, 7, 8] as const;
type SectionNumber = (typeof SECTION_ORDER)[number];
const TOTAL_SECTIONS = SECTION_ORDER.length;

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface VocabItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  example2?: string;
  collocation?: string;
  audio?: string;
  emoji?: string;
}

export interface WarmupCard {
  id: string;
  word: string;
  phonetic?: string | null;
  meaning_vn: string;
  example_en?: string | null;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  translation: string;
}

export interface Dialogue {
  id: number;
  title: string;
  audio: string;
  desc: string;
  lines: DialogueLine[];
}

export interface WarmupGreeting {
  emoji: string;
  en: string;
  vn: string;
  context: string;
}

export interface ListenAndChooseItem {
  id: string;
  audio_text: string;
  options: string[];
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  type: "multiple-choice" | "cloze" | "translate";
}

export interface SpeakingData {
  level1Prompt: string;
  level1Placeholder: string;
  level2Situation: string;
  level2Hint: string;
}

export interface GrammarPoint {
  title: string;
  rule: string;
  conjugation?: Array<{
    subject: string;
    form: string;
    example: string;
  }>;
  examples: Array<{
    en: string;
    vn: string;
  }>;
  tip?: string;
  vnNote?: string;
  dialogueExample?: {
    speaker: string;
    text: string;
    translation: string;
    highlight: string;
  };
  ccq?: {
    question: string;
    options: string[];
    answer: string;
    explanation?: string;
  };
}

export interface PronunciationFocus {
  phoneme: string;
  description: string;
  examples: Array<{
    word: string;
    ipa: string;
    tip: string;
  }>;
  minimalPairs?: Array<[string, string]>;
}

export interface FluencyDrill {
  title?: string;
  timeLimit?: number;
  items: Array<{
    en: string;
    vn: string;
  }>;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface MatchingExercise {
  title?: string;
  pairs: MatchingPair[];
}

export interface SentenceScramble {
  id: string;
  prompt_vn: string;
  words: string[];
  answer: string;
}

export interface WordBankQuestion {
  id: string;
  prompt_vn: string;
  words: string[];
  answer: string;
  hint?: string;
}

export interface UnitData {
  unitId: string;
  title: string;
  level: string;
  xp: number;
  estimatedTime: number;
  description: string;
  badgeName: string;
  badgeEmoji: string;
  warmupGreetings: WarmupGreeting[];
  culturalNote: string;
  vocab: VocabItem[];
  grammar?: GrammarPoint;
  matchingExercise?: MatchingExercise;
  scrambleExercises?: SentenceScramble[];
  wordBankExercises?: WordBankQuestion[];
  practiceQuiz?: QuizQuestion[];
  practiceTranslate?: { id: string; prompt_vn: string; answer: string }[];
  dialogues: Dialogue[];
  dialogues_list?: Dialogue[]; // Fallback support for lists
  listenAndChoose: ListenAndChooseItem[];
  speaking: SpeakingData;
  quiz: QuizQuestion[];
  cumulativeReviewQuestions?: QuizQuestion[];
  situation?: string;
  learningOutcomes?: string[];
  pronunciationFocus?: PronunciationFocus;
  fluencyDrill?: FluencyDrill;
  readingPassage?: ReadingPassage; // Optional reading comprehension (A2+)
}

interface UnitTemplateProps {
  unit: UnitData;
  nextRoute?: string;
}

export default function UnitTemplate({ unit, nextRoute = "/dashboard" }: UnitTemplateProps) {
  const [section, setSection] = useState<number>(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [miniSession, setMiniSession] = useState(false);

  // Shared orchestrator states needed for results calculations
  const [seenCards, setSeenCards] = useState<Set<number>>(new Set());
  const [warmupCards, setWarmupCards] = useState<WarmupCard[]>([]);
  const [warmupFlipped, setWarmupFlipped] = useState<Set<number>>(new Set());
  const [warmupDone, setWarmupDone] = useState(false);
  const [warmupRated, setWarmupRated] = useState<Record<number, "known" | "unknown">>({});

  const [lacAnswers, setLacAnswers] = useState<Record<number, string>>({});
  const [lacSubmitted, setLacSubmitted] = useState(false);

  const [shadowScores, setShadowScores] = useState<Record<number, number>>({});
  const [shadowDone, setShadowDone] = useState(false);

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizClozeInputs, setQuizClozeInputs] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Retry States
  const [retryAnswers, setRetryAnswers] = useState<Record<string, string>>({});
  const [retryClozeInputs, setRetryClozeInputs] = useState<Record<string, string>>({});
  const [retrySubmitted, setRetrySubmitted] = useState(false);

  // Spaced Cumulative Review States
  const [cumulativeAnswers, setCumulativeAnswers] = useState<Record<string, string>>({});
  const [cumulativeClozeInputs, setCumulativeClozeInputs] = useState<Record<string, string>>({});
  const [cumulativeSubmitted, setCumulativeSubmitted] = useState(false);

  // Grammar CCQ states
  const [ccqAnswer, setCcqAnswer] = useState("");
  const [ccqSubmitted, setCcqSubmitted] = useState(false);

  // Vocab flipped states
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());

  // Derive Dialogues safely
  const rawDialogues = unit.dialogues_list ?? (Array.isArray(unit.dialogues) ? unit.dialogues : unit.dialogues ? [unit.dialogues] : []);
  const normalizedUnit = {
    ...unit,
    dialogues: rawDialogues,
  };

  const VOCAB_LIMIT = normalizedUnit.vocab.length;
  const LISTEN_CHOOSE = normalizedUnit.listenAndChoose;
  const FINAL_QS = normalizedUnit.quiz;

  useEffect(() => {
    getDueWarmupCards(5).then((res) => {
      if (res.success && res.cards.length > 0) setWarmupCards(res.cards as WarmupCard[]);
    });
    getUnitCompletionStatus(normalizedUnit.unitId).then((res) => {
      if (res.success && res.completed) setIsCompleted(true);
    });
    try {
      const saved = localStorage.getItem(`lesson-progress-${normalizedUnit.unitId}`);
      if (saved) {
        const { section: savedSection } = JSON.parse(saved) as { section: number };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedSection > 1 && savedSection < TOTAL_SECTIONS) setSection(savedSection);
      }
    } catch { /* ignore */ }
  }, [normalizedUnit.unitId]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Save progress
  useEffect(() => {
    const orderIdx = SECTION_ORDER.indexOf(section as SectionNumber);
    const isFirstSection = orderIdx === 0;
    const isLastSection = orderIdx === SECTION_ORDER.length - 1;

    if (isLastSection) {
      localStorage.removeItem(`lesson-progress-${normalizedUnit.unitId}`);
    } else if (!isFirstSection && orderIdx > 0) {
      localStorage.setItem(`lesson-progress-${normalizedUnit.unitId}`, JSON.stringify({ section }));
    }
  }, [section, normalizedUnit.unitId]);

  // Settings
  const userSettings = (() => {
    if (typeof window === "undefined") return { soundEffects: true, autoPlayAudio: false };
    try {
      const s = localStorage.getItem("ato_settings");
      return s ? (JSON.parse(s) as { soundEffects?: boolean; autoPlayAudio?: boolean }) : {};
    } catch {
      return {};
    }
  })();
  const sfxEnabled = userSettings.soundEffects !== false;
  const autoPlay = userSettings.autoPlayAudio === true;

  const playCorrectSound = () => {
    if (!sfxEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch { /* ignored */ }
  };

  const playWrongSound = () => {
    if (!sfxEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch { /* ignored */ }
  };

  const pickEnglishVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang === "en-US" && v.name.includes("Google")) ??
      voices.find((v) => v.lang === "en-US") ??
      voices.find((v) => v.lang.startsWith("en")) ??
      null
    );
  };

  const playTTS = (text: string, rate = 0.85) => {
    if (!window.speechSynthesis) {
      toast.error("Trình duyệt không hỗ trợ TTS");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    const voice = pickEnglishVoice();
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };

  const goNext = () => {
    window.speechSynthesis?.cancel();
    const idx = SECTION_ORDER.indexOf(section as SectionNumber);
    const nextSection = SECTION_ORDER[Math.min(idx + 1, SECTION_ORDER.length - 1)];
    setSection(nextSection);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const PASSIVE_SECTIONS: number[] = [1, 2, 3, 5];
    const handler = (e: KeyboardEvent) => {
      if (!PASSIVE_SECTIONS.includes(section)) return;
      if (e.key !== "ArrowRight" && e.key !== " ") return;
      const tag = (e.target as HTMLElement)?.tagName.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "button" || tag === "select") return;
      e.preventDefault();
      goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section]);

  // Score calculations
  const normalizeAnswer = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[.,!?;:'"]/g, "")
      .replace(/\s+/g, " ")
      .replace(/\bi'm\b/g, "i am")
      .replace(/\byou're\b/g, "you are")
      .replace(/\bhe's\b/g, "he is")
      .replace(/\bshe's\b/g, "she is")
      .replace(/\bit's\b/g, "it is")
      .replace(/\bwe're\b/g, "we are")
      .replace(/\bthey're\b/g, "they are")
      .replace(/\bdon't\b/g, "do not")
      .replace(/\bdoesn't\b/g, "does not")
      .trim();

  const finalQuizScore = FINAL_QS.filter((q) => {
    if (q.type === "cloze" || q.type === "translate") {
      return normalizeAnswer(quizClozeInputs[q.id] ?? "") === normalizeAnswer(q.answer);
    }
    return quizAnswers[q.id] === q.answer;
  }).length;

  const lacScore = LISTEN_CHOOSE.filter((item, i) => lacAnswers[i] === item.answer).length;

  const shadowValues = Object.values(shadowScores);
  const shadowAvg = shadowValues.length > 0
    ? Math.round(shadowValues.reduce((a, b) => a + b, 0) / shadowValues.length)
    : 100;

  const lacPct = LISTEN_CHOOSE.length > 0 ? (lacScore / LISTEN_CHOOSE.length) * 100 : 100;
  const quizPct = FINAL_QS.length > 0 ? (finalQuizScore / FINAL_QS.length) * 100 : 100;
  const overallScore = Math.round(lacPct * 0.3 + shadowAvg * 0.3 + quizPct * 0.4);

  const wrongQuestions = quizSubmitted
    ? FINAL_QS.filter((q) =>
        q.type === "cloze" || q.type === "translate"
          ? normalizeAnswer(quizClozeInputs[q.id] ?? "") !== normalizeAnswer(q.answer)
          : quizAnswers[q.id] !== q.answer
      )
    : [];

  const wrongWordsRef = useRef<string[]>([]);
  useEffect(() => {
    if (!quizSubmitted || wrongQuestions.length === 0) return;
    const words = wrongQuestions
      .map((q) => {
        const match = normalizedUnit.vocab.find(
          (v) =>
            q.question.toLowerCase().includes(v.word.toLowerCase()) ||
            (q.options ?? []).some((o) => o.toLowerCase() === v.word.toLowerCase()) ||
            q.answer.toLowerCase() === v.word.toLowerCase()
        );
        return match?.word ?? null;
      })
      .filter((w): w is string => !!w);
    const newWords = words.filter((w) => !wrongWordsRef.current.includes(w));
    if (!newWords.length) return;
    wrongWordsRef.current = [...wrongWordsRef.current, ...newWords];
    toast.promise(scheduleWrongWordsForReview(newWords), {
      loading: "Đang xếp lịch ôn lại các từ bạn trả lời sai...",
      success: "Đã xếp lịch lặp lại ngắt quãng (FSRS) cho các từ sai!",
      error: "Không thể lưu lịch ôn tập.",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizSubmitted]);

  const retryCorrectCount = retrySubmitted
    ? wrongQuestions.filter((q) =>
        q.type === "cloze"
          ? normalizeAnswer(retryClozeInputs[q.id] ?? "") === normalizeAnswer(q.answer)
          : retryAnswers[q.id] === q.answer
      ).length
    : 0;

  const retryBonusPct =
    wrongQuestions.length > 0 && retrySubmitted
      ? Math.round((retryCorrectCount / wrongQuestions.length) * 10)
      : 0;

  const effectiveScore = Math.min(100, overallScore + retryBonusPct);
  const effectiveStarCount: 1 | 2 | 3 = effectiveScore >= 85 ? 3 : effectiveScore >= 60 ? 2 : 1;
  const xpToEarn =
    effectiveStarCount === 3
      ? normalizedUnit.xp
      : effectiveStarCount === 2
      ? Math.round(normalizedUnit.xp * 0.85)
      : Math.round(normalizedUnit.xp * 0.7);

  const handleCompleteUnit = async () => {
    setIsSubmitting(true);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    const res = await completeUnit(normalizedUnit.unitId, effectiveStarCount);
    if (res.success) {
      setIsCompleted(true);
      toast.success(`🎉 Chúc mừng! Bạn nhận được ${res.xpEarned ?? xpToEarn} XP!`);

      // ── Achievement milestone toasts (staggered, zero extra DB queries) ──
      const totalCompleted = res.completedCount ?? 0;
      const streak = res.newStreak ?? 0;
      const totalXp = res.newTotalXp ?? 0;
      const prevXp = totalXp - (res.xpEarned ?? 0);
      let delay = 1200;

      // Lesson count milestones
      const lessonToasts: Record<number, string> = {
        1:  "🎯 Thành tích: Bước Đầu Tiên — Hoàn thành bài học đầu tiên!",
        5:  "📚 Thành tích: Học Viên Nhiệt Tình — 5 bài học hoàn thành!",
        10: "🎓 Thành tích: Học Viên Chăm Chỉ — 10 bài học!",
        25: "⭐ Thành tích: Chuyên Gia Tiến Bộ — 25 bài học!",
        50: "🏅 Thành tích: Học Giả — Hoàn thành tất cả 50 bài học!",
      };
      if (lessonToasts[totalCompleted]) {
        setTimeout(() => toast.success(lessonToasts[totalCompleted]!), delay);
        delay += 1200;
      }

      // Streak milestones
      const streakToasts: Record<number, string> = {
        3:  "🔥 Thành tích: Bắt Đầu Chuỗi — 3 ngày học liên tiếp!",
        7:  "🔥🔥 Thành tích: Một Tuần Kiên Trì — 7 ngày!",
        14: "💪 Thành tích: Hai Tuần Bất Bại — 14 ngày!",
        30: "🏆 Thành tích: Học Viên Tháng — 30 ngày!",
        100:"👑 Thành tích: Huyền Thoại — 100 ngày streak!",
      };
      if (streakToasts[streak]) {
        setTimeout(() => toast.success(streakToasts[streak]!), delay);
        delay += 1200;
      }

      // XP milestones (check if we crossed a threshold this session)
      const xpThresholds: [number, string][] = [
        [100,  "✨ Thành tích: Tích Lũy XP — 100 XP!"],
        [500,  "💎 Thành tích: XP Hunter — 500 XP!"],
        [1000, "🌟 Thành tích: Nghìn Điểm — 1,000 XP!"],
        [5000, "🎖️ Thành tích: Bậc Thầy XP — 5,000 XP!"],
      ];
      for (const [threshold, msg] of xpThresholds) {
        if (prevXp < threshold && totalXp >= threshold) {
          setTimeout(() => toast.success(msg), delay);
          delay += 1200;
        }
      }

      if (res.leveledUp && res.newLevel) {
        localStorage.setItem(
          "pending-level-up",
          JSON.stringify({
            prev: null,
            next: res.newLevel,
          })
        );
      }
      const unitLevel = (normalizedUnit.level?.match(/A[012]|B[12]|C1/) ?? ["A1"])[0] as
        | "A0"
        | "A1"
        | "A2"
        | "B1"
        | "B2"
        | "C1";
      void seedUnitVocabToSRS({
        vocab: normalizedUnit.vocab.map((v) => ({
          word: v.word,
          phonetic: v.phonetic || null,
          meaning_vn: v.meaning,
          example_en: v.example || null,
        })),
        topic: normalizedUnit.unitId,
        level: unitLevel,
      });
      if (normalizedUnit.grammar) {
        void seedUnitVocabToSRS({
          vocab: [
            {
              word: normalizedUnit.grammar.title.slice(0, 100),
              phonetic: null,
              meaning_vn: normalizedUnit.grammar.rule.slice(0, 300),
              example_en: normalizedUnit.grammar.examples[0]?.en?.slice(0, 500) ?? null,
            },
          ],
          topic: "Grammar",
          level: unitLevel,
        });
      }
      const earnedXp = res.xpEarned ?? xpToEarn;
      const xpSyncKey = `ato_xp_sync_${new Date().toDateString()}`;
      const prev = Number(localStorage.getItem(xpSyncKey) ?? 0);
      localStorage.setItem(xpSyncKey, String(prev + earnedXp));
      window.dispatchEvent(new CustomEvent("ato:xp-earned", { detail: { xp: earnedXp } }));
    } else {
      toast.error(res.error || "Có lỗi xảy ra");
    }
    setIsSubmitting(false);
  };

  const sectionOrderIdx = SECTION_ORDER.indexOf(section as SectionNumber);
  const progress = Math.round((sectionOrderIdx / (TOTAL_SECTIONS - 1)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href="/dashboard"
                aria-label="Về Dashboard"
                className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </Link>
              <div className="min-w-0">
                <p className="text-xs text-zinc-500">{normalizedUnit.level}</p>
                <p className="text-sm font-semibold text-white truncate max-w-[130px] sm:max-w-xs">
                  {normalizedUnit.title}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0 flex items-center gap-2">
              {/* Mini-session toggle — jump to Quiz for quick 5-min review */}
              {!miniSession && section < 8 && (
                <button
                  onClick={() => {
                    setMiniSession(true);
                    setSection(8);
                    try {
                      localStorage.setItem(
                        `lesson-progress-${normalizedUnit.unitId}`,
                        JSON.stringify({ section: 8 })
                      );
                    } catch { /* ignore */ }
                  }}
                  className="text-[10px] font-bold px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-colors whitespace-nowrap"
                >
                  ⚡ Ôn nhanh
                </button>
              )}
              <div>
                <p className="text-xs text-zinc-500">{SECTION_LABELS[section] ?? "Học"}</p>
                <p className="text-sm font-bold text-emerald-400">
                  {sectionOrderIdx + 1}/{TOTAL_SECTIONS}
                </p>
              </div>
            </div>
          </div>

          {/* Step dots progress */}
          <div
            className="flex items-center gap-0 mt-2"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Tiến độ bài học: bước ${sectionOrderIdx + 1} / ${TOTAL_SECTIONS}`}
          >
            {SECTION_ORDER.map((secNum, i) => {
              const isSecCompleted = i < sectionOrderIdx;
              const isSecCurrent = i === sectionOrderIdx;
              return (
                <div key={secNum} className="flex items-center flex-1 min-w-0">
                  <div
                    className={`relative flex items-center justify-center rounded-full shrink-0 transition-all duration-300 ${
                      isSecCurrent
                        ? "w-7 h-7 bg-emerald-500 ring-2 ring-emerald-400/50 ring-offset-1 ring-offset-zinc-950 shadow-lg shadow-emerald-900/60"
                        : isSecCompleted
                        ? "w-5 h-5 bg-emerald-800"
                        : "w-5 h-5 bg-zinc-800"
                    }`}
                  >
                    {isSecCompleted ? (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2 2 4-4"
                          stroke="#34d399"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <span
                        className={`font-bold tabular-nums leading-none select-none ${
                          isSecCurrent ? "text-white text-[11px]" : "text-zinc-600 text-[9px]"
                        }`}
                      >
                        {i + 1}
                      </span>
                    )}
                    {isSecCurrent && (
                      <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                    )}
                  </div>
                  {i < SECTION_ORDER.length - 1 && (
                    <div
                      className={`h-px flex-1 mx-0.5 transition-all duration-500 ${
                        i < sectionOrderIdx ? "bg-emerald-700" : "bg-zinc-800"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8 pb-24">
        <AnimatePresence mode="wait">
          {section === 1 && (
            <WarmupSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              playTTS={playTTS}
              warmupRated={warmupRated}
              setWarmupRated={setWarmupRated}
              warmupCards={warmupCards}
              warmupFlipped={warmupFlipped}
              setWarmupFlipped={setWarmupFlipped}
              warmupDone={warmupDone}
              setWarmupDone={setWarmupDone}
              goNext={goNext}
            />
          )}

          {section === 2 && (
            <VocabSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              playTTS={playTTS}
              seenCards={seenCards}
              setSeenCards={setSeenCards}
              flippedCards={flippedCards}
              setFlippedCards={setFlippedCards}
              autoPlay={autoPlay}
              goNext={goNext}
            />
          )}

          {section === 3 && (
            <GrammarSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              playTTS={playTTS}
              ccqAnswer={ccqAnswer}
              setCcqAnswer={setCcqAnswer}
              ccqSubmitted={ccqSubmitted}
              setCcqSubmitted={setCcqSubmitted}
              playCorrectSound={playCorrectSound}
              playWrongSound={playWrongSound}
              goNext={goNext}
            />
          )}

          {section === 4 && (
            <PracticeSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              playCorrectSound={playCorrectSound}
              playWrongSound={playWrongSound}
              goNext={goNext}
            />
          )}

          {section === 5 && (
            <DialogueSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              lacAnswers={lacAnswers}
              setLacAnswers={setLacAnswers}
              lacSubmitted={lacSubmitted}
              setLacSubmitted={setLacSubmitted}
              playTTS={playTTS}
              goNext={goNext}
            />
          )}

          {section === 10 && (
            <FluencySection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              goNext={goNext}
            />
          )}

          {section === 9 && (
            <TranslateSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              goNext={goNext}
            />
          )}

          {section === 6 && (
            <ShadowingSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              shadowScores={shadowScores}
              setShadowScores={setShadowScores}
              shadowDone={shadowDone}
              setShadowDone={setShadowDone}
              playTTS={playTTS}
              goNext={goNext}
            />
          )}

          {section === 7 && (
            <SpeakingSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              playTTS={playTTS}
              goNext={goNext}
            />
          )}

          {section === 8 && (
            <QuizSection
              unit={normalizedUnit}
              sectionOrderIdx={sectionOrderIdx}
              TOTAL_SECTIONS={TOTAL_SECTIONS}
              seenCards={seenCards}
              VOCAB_LIMIT={VOCAB_LIMIT}
              shadowAvg={shadowAvg}
              shadowDone={shadowDone}
              lacScore={lacScore}
              LISTEN_CHOOSE_LENGTH={LISTEN_CHOOSE.length}
              isCompleted={isCompleted}
              isSubmitting={isSubmitting}
              handleCompleteUnit={handleCompleteUnit}
              playCorrectSound={playCorrectSound}
              playWrongSound={playWrongSound}
              cumulativeAnswers={cumulativeAnswers}
              setCumulativeAnswers={setCumulativeAnswers}
              cumulativeClozeInputs={cumulativeClozeInputs}
              setCumulativeClozeInputs={setCumulativeClozeInputs}
              cumulativeSubmitted={cumulativeSubmitted}
              setCumulativeSubmitted={setCumulativeSubmitted}
              quizAnswers={quizAnswers}
              setQuizAnswers={setQuizAnswers}
              quizClozeInputs={quizClozeInputs}
              setQuizClozeInputs={setQuizClozeInputs}
              quizSubmitted={quizSubmitted}
              setQuizSubmitted={setQuizSubmitted}
              retryAnswers={retryAnswers}
              setRetryAnswers={setRetryAnswers}
              retryClozeInputs={retryClozeInputs}
              setRetryClozeInputs={setRetryClozeInputs}
              retrySubmitted={retrySubmitted}
              setRetrySubmitted={setRetrySubmitted}
              finalQuizScore={finalQuizScore}
              wrongQuestions={wrongQuestions}
              retryCorrectCount={retryCorrectCount}
              retryBonusPct={retryBonusPct}
              effectiveScore={effectiveScore}
              effectiveStarCount={effectiveStarCount}
              xpToEarn={xpToEarn}
              nextRoute={nextRoute}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
