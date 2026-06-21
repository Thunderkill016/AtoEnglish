"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Volume2,
  Mic,
  MicOff,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Headphones,
  MessageCircle,
  Trophy,
  Star,
  Eye,
  EyeOff,
  BookMarked,
  Shuffle,
} from "lucide-react";

import { completeUnit, getUnitCompletionStatus } from "@/app/actions/progress";
import { getDueWarmupCards, reviewCard, seedUnitVocabToSRS, scheduleWrongWordsForReview } from "@/app/actions/cards";
import { toast } from "sonner";
import { calcSpeechScore } from "@/lib/utils/speech";

// Helper: get SpeechRecognition constructor safely (browser-only)
function getSpeechRecognition(): typeof SpeechRecognition | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

// ─── Section order & labels (9 steps, Hybrid pedagogical flow) ───────────────
// Physical section numbers → user-facing labels
const SECTION_LABELS: Record<number, string> = {
  1: "Khởi động",
  5: "Hội thoại",   // Dialogue first (Implicit Input)
  2: "Từ vựng",    // Vocabulary after Dialogue
  3: "Ngữ pháp",   // Grammar in Context
  4: "Luyện tập",  // Practice (matching + MC + scramble)
  9: "Dịch câu",   // VN→EN Translation (new dedicated section)
  6: "Shadowing",
  7: "Luyện nói",
  8: "Hoàn thành",
};
// Navigation flow: Warmup → Dialogue → Vocab → Grammar → Practice → Translate → Shadowing → Speaking → Quiz
const SECTION_ORDER = [1, 5, 2, 3, 4, 9, 6, 7, 8] as const;
type SectionNumber = (typeof SECTION_ORDER)[number];
const TOTAL_SECTIONS = SECTION_ORDER.length; // 9

// ─── Interfaces ──────────────────────────────────────────────────────────────
export interface VocabItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  example2?: string;    // Second context sentence for richer encoding (Nation 2001)
  collocation?: string; // Common word pairing shown as a usage chip
  audio?: string;
  emoji?: string; // Visual mnemonic for Mayer Multimedia principle
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
  options: string[];
  answer: string;
  type: "multiple-choice" | "cloze" | "translate";
}

export interface SpeakingData {
  level1Prompt: string;
  level1Placeholder: string;
  level2Situation: string;
  level2Hint: string;
}

/** Grammar point for PPP Presentation stage */
export interface GrammarPoint {
  title: string;           // e.g. "To be — Động từ 'là'"
  rule: string;            // e.g. "I am / You are / He/She/It is"
  conjugation?: Array<{   // Optional: subject + verb conjugation table
    subject: string;
    form: string;
    example: string;
  }>;
  examples: Array<{
    en: string;
    vn: string;
  }>;
  tip?: string;            // Quick usage tip (Vietnamese)
  dialogueExample?: {      // Cross-reference: dialogue line showing grammar in authentic context
    speaker: string;
    text: string;
    translation: string;
    highlight: string;     // Substring to bold-highlight in the text
  };
  ccq?: {                  // Concept Check Question — verifies understanding before practice
    question: string;
    options: string[];
    answer: string;
  };
}

/** Matching exercise: word ↔ meaning pairs */
export interface MatchingPair {
  left: string;  // English word/phrase
  right: string; // Vietnamese meaning
}

export interface MatchingExercise {
  title?: string;
  pairs: MatchingPair[]; // 4-6 pairs recommended
}

/** Sentence scrambling: tap word tiles to build the English sentence */
export interface SentenceScramble {
  id: string;
  prompt_vn: string;  // Vietnamese cue shown to the learner
  words: string[];    // All tiles — component shuffles on mount
  answer: string;     // Expected sentence (normalized, case-insensitive)
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
  grammar?: GrammarPoint;          // NEW: Grammar presentation (PPP stage 2)
  matchingExercise?: MatchingExercise; // NEW: Matching exercise in practice
  scrambleExercises?: SentenceScramble[]; // Sentence-construction tiles (Priority 1)
  practiceQuiz?: QuizQuestion[];   // NEW: Separate quiz for practice section
  practiceTranslate?: { id: string; prompt_vn: string; answer: string }[]; // Section 9: VN→EN dedicated
  dialogues: Dialogue[];
  listenAndChoose: ListenAndChooseItem[];
  speaking: SpeakingData;
  quiz: QuizQuestion[];            // Final review quiz
  cumulativeReviewQuestions?: QuizQuestion[]; // Priority 5: spaced retrieval from prior units
  // ── Situational Fluency (Phase 1) ──
  situation?: string;              // Real-world situation context shown at lesson start
  learningOutcomes?: string[];     // 3 things user can DO after completing this unit
}

interface UnitTemplateProps {
  unit: UnitData;
  nextRoute?: string;
}

export default function UnitTemplate({ unit, nextRoute = "/dashboard" }: UnitTemplateProps) {
  const [section, setSection] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Section 2 — Vocab
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [seenCards, setSeenCards] = useState<Set<number>>(new Set());

  // Section 4 — Practice (MC + cloze + matching)
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [clozeInputs, setClozeInputs] = useState<Record<string, string>>({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);
  // Matching state
  const [matchLeft, setMatchLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Set<string>>(new Set());
  const [wrongMatch, setWrongMatch] = useState<string | null>(null);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);
  // Scramble state
  const [scrambleShuffled, setScrambleShuffled] = useState<Record<string, string[]>>({});
  const [scrambleBuilt, setScrambleBuilt] = useState<Record<string, string[]>>({});
  const [scrambleChecked, setScrambleChecked] = useState<Record<string, boolean>>({});

  // Section 5 — Listening (dialogue + listen-and-choose)
  const [selectedDialogue, setSelectedDialogue] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlayingDialogue, setIsPlayingDialogue] = useState(false);
  const [lacAnswers, setLacAnswers] = useState<Record<number, string>>({});
  const [lacSubmitted, setLacSubmitted] = useState(false);

  // Section 9 — VN→EN Translation (new dedicated production section)
  const [translateInputs, setTranslateInputs] = useState<Record<string, string>>({});
  const [translateSubmitted, setTranslateSubmitted] = useState(false);

  // Section 6 — Shadowing
  const [shadowDialogueIdx, setShadowDialogueIdx] = useState(0);
  const [shadowLineIdx, setShadowLineIdx] = useState(0);
  const [shadowSpeed, setShadowSpeed] = useState(1.0);
  const [shadowScores, setShadowScores] = useState<Record<number, number>>({});
  const [shadowTranscripts, setShadowTranscripts] = useState<Record<number, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [shadowDone, setShadowDone] = useState(false);

  // SRS Warm-up state (Section 1)
  const [warmupCards, setWarmupCards] = useState<WarmupCard[]>([]);
  const [warmupFlipped, setWarmupFlipped] = useState<Set<number>>(new Set());
  const [warmupDone, setWarmupDone] = useState(false);

  // Section 7 — Speaking
  const [nameInput, setNameInput] = useState("");
  const [level1Done, setLevel1Done] = useState(false);
  const [isLevel1Recording, setIsLevel1Recording] = useState(false);
  const [level1Score, setLevel1Score] = useState<number | null>(null);
  const [level1Transcript, setLevel1Transcript] = useState("");
  const [level2Transcript, setLevel2Transcript] = useState("");
  const [level2Recording, setLevel2Recording] = useState(false);
  const [level2Score, setLevel2Score] = useState<number | null>(null);
  const [level2Done, setLevel2Done] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Section 8 — Final Quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizClozeInputs, setQuizClozeInputs] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  // Retry state — wrong answers re-attempted for bonus score
  const [retryAnswers, setRetryAnswers] = useState<Record<string, string>>({});
  const [retryClozeInputs, setRetryClozeInputs] = useState<Record<string, string>>({});
  const [retrySubmitted, setRetrySubmitted] = useState(false);
  // Cumulative review state — prior-unit spaced retrieval (Priority 5)
  const [cumulativeAnswers, setCumulativeAnswers] = useState<Record<string, string>>({});
  const [cumulativeClozeInputs, setCumulativeClozeInputs] = useState<Record<string, string>>({});
  const [cumulativeSubmitted, setCumulativeSubmitted] = useState(false);
  // Grammar CCQ state
  const [ccqAnswer, setCcqAnswer] = useState("");
  const [ccqSubmitted, setCcqSubmitted] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // ─── Derived data ─────────────────────────────────────────────────────────
  const VOCAB_LIMIT = unit.vocab.length; // Show ALL vocab, no arbitrary cap
  const VOCAB_DISPLAY = unit.vocab;
  const DIALOGUES = unit.dialogues;
  const LISTEN_CHOOSE = unit.listenAndChoose;

  // Practice quiz: use dedicated practiceQuiz if provided, else first 3 of quiz
  const PRACTICE_QS = unit.practiceQuiz ?? unit.quiz.slice(0, 3);
  // Final quiz: all quiz questions (supports both MC and cloze)
  const FINAL_QS = unit.quiz;

  // Shuffle matching pairs when unit changes
  useEffect(() => {
    if (unit.matchingExercise) {
      const rights = unit.matchingExercise.pairs.map(p => p.right);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShuffledRight([...rights].sort(() => Math.random() - 0.5));
    }
  }, [unit.matchingExercise]);

  useEffect(() => {
    if (unit.scrambleExercises?.length) {
      const shuffled: Record<string, string[]> = {};
      for (const ex of unit.scrambleExercises) {
        shuffled[ex.id] = [...ex.words].sort(() => Math.random() - 0.5);
      }
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScrambleShuffled(shuffled);
    }
  }, [unit.scrambleExercises]);

  useEffect(() => {
    // Fetch SRS due cards for warm-up panel
    getDueWarmupCards(5).then(res => {
       
      if (res.success && res.cards.length > 0) setWarmupCards(res.cards as WarmupCard[]);
    });
    getUnitCompletionStatus(unit.unitId).then(res => {
      if (res.success && res.completed) setIsCompleted(true);
    });
    try {
      const saved = localStorage.getItem(`lesson-progress-${unit.unitId}`);
      if (saved) {
        const { section: savedSection } = JSON.parse(saved) as { section: number };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (savedSection > 1 && savedSection < TOTAL_SECTIONS) setSection(savedSection);
      }
    } catch { /* ignore */ }
  }, [unit.unitId]);

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  useEffect(() => {
    if (section > 1 && section < TOTAL_SECTIONS) {
      localStorage.setItem(`lesson-progress-${unit.unitId}`, JSON.stringify({ section }));
    } else if (section >= TOTAL_SECTIONS) {
      localStorage.removeItem(`lesson-progress-${unit.unitId}`);
    }
  }, [section, unit.unitId]);

  // ─── TTS ─────────────────────────────────────────────────────────────────
  const playTTS = (text: string, rate = 0.85) => {
    if (!window.speechSynthesis) { toast.error("Trình duyệt không hỗ trợ TTS"); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    window.speechSynthesis.speak(u);
  };

  // ─── Sound feedback ───────────────────────────────────────────────────────
  const playCorrectSound = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(); osc.stop(ctx.currentTime + 0.5);
    } catch { /* browser may block */ }
  };

  const playWrongSound = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } catch { /* browser may block */ }
  };

  const playDialogueTTS = (dialogueIdx: number, speed: number) => {
    if (DIALOGUES.length === 0) return;
    const lines = DIALOGUES[dialogueIdx].lines;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlayingDialogue(true);
    let i = 0;
    const playNext = () => {
      if (i >= lines.length) { setIsPlayingDialogue(false); return; }
      const u = new SpeechSynthesisUtterance(lines[i].text);
      u.lang = "en-US"; u.rate = speed;
      u.onend = () => { i++; setTimeout(playNext, 800); };
      u.onerror = () => { i++; setTimeout(playNext, 800); };
      window.speechSynthesis.speak(u);
    };
    playNext();
  };

  // ─── Speech Recognition ───────────────────────────────────────────────────
  const startRecognition = (onResult: (text: string) => void) => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) { toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói"); return; }
    const rec = new SpeechRecognitionAPI();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e: SpeechRecognitionEvent) => { onResult(e.results[0][0].transcript); };
    rec.onerror = () => { toast.error("Không nhận được giọng nói. Thử lại."); setIsRecognizing(false); setIsRecording(false); setLevel2Recording(false); };
    rec.onend = () => { setIsRecognizing(false); setIsRecording(false); setLevel2Recording(false); };
    rec.onstart = () => setIsRecognizing(true);
    recognitionRef.current = rec;
    rec.start();
  };

  // ─── Shadowing handlers ───────────────────────────────────────────────────
  const handleShadowRecord = () => {
    if (DIALOGUES.length === 0) return;
    const targetLine = DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx];
    setIsRecording(true);
    startRecognition((text) => {
      const score = calcSpeechScore(targetLine.text, text);
      setShadowScores(p => ({ ...p, [shadowLineIdx]: score }));
      setShadowTranscripts(p => ({ ...p, [shadowLineIdx]: text }));
      setIsRecording(false);
      if (score >= 70) toast.success(`Tốt lắm! ${score}%`);
      else toast.info(`${score}% — Không sao, thử lại nhé!`);
    });
  };

  const handleShadowNext = () => {
    if (DIALOGUES.length === 0) return;
    const lines = DIALOGUES[shadowDialogueIdx].lines;
    if (shadowLineIdx < lines.length - 1) {
      setShadowLineIdx(p => p + 1);
    } else {
      setShadowDone(true);
    }
  };

  // ─── Level 2 speaking handler ─────────────────────────────────────────────
  const handleLevel2Record = () => {
    setLevel2Recording(true);
    setLevel2Transcript("");
    setLevel2Score(null);
    startRecognition((text) => {
      setLevel2Transcript(text);
      setLevel2Recording(false);
      // Score against the hint text (strips HTML tags)
      const hintText = unit.speaking.level2Hint
        .replace(/<[^>]*>/g, "")
        .replace(/\[.*?\]/g, "")  // strip [tên bạn] and similar placeholders
        .trim();
      const score = calcSpeechScore(hintText, text);
      setLevel2Score(score);
    });
  };

  // ─── Matching handler ─────────────────────────────────────────────────────
  const handleMatchSelect = (side: "left" | "right", value: string) => {
    if (matchedPairs.has(value)) return;
    if (side === "left") {
      setMatchLeft(value);
      setWrongMatch(null);
    } else {
      // right side selected — try to match
      if (!matchLeft) return;
      const pairs = unit.matchingExercise!.pairs;
      const pair = pairs.find(p => p.left === matchLeft);
      if (pair && pair.right === value) {
        // Correct match
        setMatchedPairs(prev => {
          const next = new Set(prev);
          next.add(matchLeft!);
          next.add(value);
          return next;
        });
        setMatchLeft(null);
        playCorrectSound();
      } else {
        // Wrong match
        setWrongMatch(value);
        playWrongSound();
        setTimeout(() => { setWrongMatch(null); setMatchLeft(null); }, 800);
      }
    }
  };

  // ─── Complete handler ──────────────────────────────────────────────────────
  const handleCompleteUnit = async () => {
    setIsSubmitting(true);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    const res = await completeUnit(unit.unitId, effectiveStarCount);
    if (res.success) {
      setIsCompleted(true);
      toast.success(`🎉 Chúc mừng! Bạn nhận được ${res.xpEarned ?? xpToEarn} XP!`);
      if (res.previousLevel && res.newLevel && res.previousLevel !== res.newLevel) {
        localStorage.setItem("pending-level-up", JSON.stringify({
          prev: res.previousLevel,
          next: res.newLevel,
        }));
      }
      // ─ FSRS: auto-seed all unit vocab into the user's SRS deck (fire-and-forget) ─
      const unitLevel = (unit.level?.match(/A[12]|B[12]|C1/) ?? ["A1"])[0] as "A1" | "A2" | "B1" | "B2" | "C1";
      void seedUnitVocabToSRS({
        vocab: unit.vocab.map(v => ({
          word: v.word,
          phonetic: v.phonetic || null,
          meaning_vn: v.meaning,
          example_en: v.example || null,
        })),
        topic: unit.unitId,
        level: unitLevel,
      });
      // ─ FSRS: also create a grammar pattern card so grammar rules get SRS-scheduled ─
      if (unit.grammar) {
        void seedUnitVocabToSRS({
          vocab: [{
            word: unit.grammar.title.slice(0, 100),
            phonetic: null,
            meaning_vn: unit.grammar.rule.slice(0, 300),
            example_en: unit.grammar.examples[0]?.en?.slice(0, 500) ?? null,
          }],
          topic: "Grammar",
          level: unitLevel,
        });
      }
      // ─ Sync XP to Dashboard localStorage so the daily-XP bar updates immediately ─
      const earnedXp = res.xpEarned ?? xpToEarn;
      const xpSyncKey = `ato_xp_sync_${new Date().toDateString()}`;
      const prev = Number(localStorage.getItem(xpSyncKey) ?? 0);
      localStorage.setItem(xpSyncKey, String(prev + earnedXp));
      // Dispatch event so any mounted Dashboard can react
      window.dispatchEvent(new CustomEvent("ato:xp-earned", { detail: { xp: earnedXp } }));
    } else {
      toast.error(res.error || "Có lỗi xảy ra");
    }
    setIsSubmitting(false);
  };

  // ─── Score calculations ───────────────────────────────────────────────────
  // Final quiz score (MC + cloze + translate)
  // Shared normalization for cloze/translate (strips punctuation, normalizes contractions)
  const normalizeAnswer = (s: string) =>
    s.trim().toLowerCase()
      .replace(/[.,!?;:'"]/g, "").replace(/\s+/g, " ")
      .replace(/\bi'm\b/g, "i am").replace(/\byou're\b/g, "you are")
      .replace(/\bhe's\b/g, "he is").replace(/\bshe's\b/g, "she is")
      .replace(/\bit's\b/g, "it is").replace(/\bwe're\b/g, "we are")
      .replace(/\bthey're\b/g, "they are").replace(/\bdon't\b/g, "do not")
      .replace(/\bdoesn't\b/g, "does not").trim();

  const finalQuizScore = FINAL_QS.filter(q => {
    if (q.type === "cloze" || q.type === "translate") {
      return normalizeAnswer(quizClozeInputs[q.id] ?? "") === normalizeAnswer(q.answer);
    }
    return quizAnswers[q.id] === q.answer;
  }).length;

  // LAC score
  const lacScore = LISTEN_CHOOSE.filter((item, i) => lacAnswers[i] === item.answer).length;

  // Shadowing average
  const shadowValues = Object.values(shadowScores);
  const shadowAvg = shadowValues.length > 0
    ? Math.round(shadowValues.reduce((a, b) => a + b, 0) / shadowValues.length)
    : 0;

  // Weighted performance score (0-100)
  const lacPct = LISTEN_CHOOSE.length > 0 ? (lacScore / LISTEN_CHOOSE.length) * 100 : 100;
  const quizPct = FINAL_QS.length > 0 ? (finalQuizScore / FINAL_QS.length) * 100 : 100;
  const overallScore = Math.round((lacPct * 0.3) + (shadowAvg * 0.3) + (quizPct * 0.4));

  // Wrong questions for retry panel (computed after quiz submission)
  const wrongQuestions = quizSubmitted
    ? FINAL_QS.filter(q =>
        q.type === "cloze" || q.type === "translate"
          ? normalizeAnswer(quizClozeInputs[q.id] ?? "") !== normalizeAnswer(q.answer)
          : quizAnswers[q.id] !== q.answer
      )
    : [];

  // FSRS: schedule wrong words for early review (fire-and-forget, runs once on quiz submit)
  const wrongWordsRef = useRef<string[]>([]);
  useEffect(() => {
    if (!quizSubmitted || wrongQuestions.length === 0) return;
    const words = wrongQuestions
      .map(q => {
        // Extract vocab words from question text — look for matches in unit.vocab
        const match = unit.vocab.find(v =>
          q.question.toLowerCase().includes(v.word.toLowerCase()) ||
          (q.options ?? []).some(o => o.toLowerCase() === v.word.toLowerCase()) ||
          q.answer.toLowerCase() === v.word.toLowerCase()
        );
        return match?.word ?? null;
      })
      .filter((w): w is string => !!w);
    const newWords = words.filter(w => !wrongWordsRef.current.includes(w));
    if (!newWords.length) return;
    wrongWordsRef.current = [...wrongWordsRef.current, ...newWords];
    void scheduleWrongWordsForReview(newWords);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizSubmitted]);

  // Retry score and bonus (up to +10 points)
  const retryCorrectCount = retrySubmitted
    ? wrongQuestions.filter(q =>
        q.type === "cloze"
          ? (retryClozeInputs[q.id] ?? "").trim().toLowerCase() === q.answer.toLowerCase()
          : retryAnswers[q.id] === q.answer
      ).length
    : 0;
  const retryBonusPct = wrongQuestions.length > 0 && retrySubmitted
    ? Math.round((retryCorrectCount / wrongQuestions.length) * 10)
    : 0;

  // Effective score/stars (retry can boost by up to 10 pts)
  const effectiveScore = Math.min(100, overallScore + retryBonusPct);
  const effectiveStarCount: 1 | 2 | 3 = effectiveScore >= 85 ? 3 : effectiveScore >= 60 ? 2 : 1;

  // XP to earn based on effective star count
  const xpToEarn = effectiveStarCount === 3 ? unit.xp : effectiveStarCount === 2 ? Math.round(unit.xp * 0.85) : Math.round(unit.xp * 0.70);

  // CCQ correct check
  const ccqCorrect = !!(unit.grammar?.ccq && ccqAnswer === unit.grammar.ccq.answer);

  // ─── Progress bar (uses position in SECTION_ORDER, not raw section number) ──
  const sectionOrderIdx = SECTION_ORDER.indexOf(section as SectionNumber);
  const progress = Math.round((sectionOrderIdx / (TOTAL_SECTIONS - 1)) * 100);

  // ─── Navigation (follows SECTION_ORDER flow) ─────────────────────────────
  const goNext = () => {
    window.speechSynthesis?.cancel();
    const idx = SECTION_ORDER.indexOf(section as SectionNumber);
    const nextSection = SECTION_ORDER[Math.min(idx + 1, SECTION_ORDER.length - 1)];
    setSection(nextSection);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Keyboard shortcut: ArrowRight/Space advances on non-interactive sections ───
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

  const sectionVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const formattedL1Prompt = unit.speaking.level1Prompt.replace("{input}", nameInput || "______");

  // ─── Practice section helpers ─────────────────────────────────────────────
  const practiceScore = PRACTICE_QS.filter(q => {
    if (q.type === "cloze") {
      return normalizeAnswer(clozeInputs[q.id] ?? "") === normalizeAnswer(q.answer);
    }
    return practiceAnswers[q.id] === q.answer;
  }).length;

  const allPracticeAnswered = PRACTICE_QS.every(q => {
    if (q.type === "cloze") return (clozeInputs[q.id] ?? "").trim().length > 0;
    return !!practiceAnswers[q.id];
  });

  const matchingDone = unit.matchingExercise
    ? matchedPairs.size === unit.matchingExercise.pairs.length * 2
    : true;

  const allScrambleDone = !unit.scrambleExercises?.length ||
    unit.scrambleExercises.every(ex => scrambleChecked[ex.id]);

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20">
      {/* Header */}
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
                <p className="text-xs text-zinc-500">{unit.level}</p>
                <p className="text-sm font-semibold text-white truncate max-w-[130px] sm:max-w-xs">{unit.title}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-zinc-500">{SECTION_LABELS[section] ?? "Học"}</p>
              <p className="text-sm font-bold text-emerald-400">{sectionOrderIdx + 1}/{TOTAL_SECTIONS}</p>
            </div>
          </div>
          {/* Progress bar */}
          <div
            className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Tiến độ bài học: phần ${sectionOrderIdx + 1} / ${TOTAL_SECTIONS}`}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          {/* Step labels */}
          <div className="flex justify-between mt-1.5">
            {SECTION_ORDER.map((secNum, i) => (
              <span key={secNum} className={`text-[8px] truncate max-w-[36px] text-center ${
                i === sectionOrderIdx
                  ? "text-emerald-400 font-bold block"
                  : i < sectionOrderIdx
                  ? "text-emerald-600 block"
                  : "text-zinc-700 block opacity-60"
              }`}>
                {SECTION_LABELS[secNum]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-4 sm:py-8 pb-24">
        <AnimatePresence mode="wait">

          {/* ══ SECTION 1: Warm-up + Cultural Note ══ */}
          {section === 1 && (
            <motion.div key="s1" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-emerald-400" size={22} />
                <h1 className="text-xl sm:text-2xl font-black text-white">Khởi động</h1>
                <span className="text-xs text-zinc-500 ml-auto">~3 phút</span>
              </div>

              {/* ── Situation Banner ── */}
              {unit.situation && (
                <div className="mb-6 rounded-2xl bg-gradient-to-br from-teal-950/70 to-emerald-950/40 border border-teal-600/30 p-5">
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2">📍 Tình huống hôm nay</p>
                  <p className="text-white font-semibold text-sm leading-relaxed mb-4">{unit.situation}</p>
                  {unit.learningOutcomes && unit.learningOutcomes.length > 0 && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Sau bài học bạn sẽ làm được:</p>
                      {unit.learningOutcomes.map((outcome, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{outcome}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <p className="text-zinc-400 mb-6 text-sm">{unit.description}</p>

              {/* Situation cards */}
              <div className="grid gap-4 mb-8">
                {unit.warmupGreetings.map((g, i) => (
                  <div key={i} className="bg-white/5 border border-zinc-800/60 rounded-2xl p-4 flex items-start gap-3">
                    <div className="text-5xl">{g.emoji}</div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 mb-1">{g.context}</p>
                      <p className="text-lg font-bold text-white">{g.en}</p>
                      <p className="text-sm text-zinc-400">{g.vn}</p>
                    </div>
                    <button
                      onClick={() => playTTS(g.en)}
                      aria-label={`Nghe phát âm: ${g.en}`}
                      className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 transition-colors"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              {/* SRS Warm-up — due cards from previous lessons */}
              {warmupCards.length > 0 && !warmupDone && (
                <div className="bg-amber-950/20 border border-amber-700/30 rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-bold text-amber-400">🔄 Ôn từ đến hạn hôm nay</p>
                      <p className="text-xs text-zinc-500">{warmupCards.length} thẻ — nhấn để xem nghĩa</p>
                    </div>
                    <button onClick={() => setWarmupDone(true)} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">Bỏ qua →</button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {warmupCards.map((card, wi) => {
                      const isWFlipped = warmupFlipped.has(wi);
                      return (
                        <div key={card.id}
                          onClick={() => setWarmupFlipped(p => { const n = new Set(p); if (n.has(wi)) n.delete(wi); else n.add(wi); return n; })}
                          className="shrink-0 w-36 cursor-pointer" style={{ perspective: "500px" }}
                        >
                          <div style={{ transition: "transform 0.4s", transformStyle: "preserve-3d", transform: isWFlipped ? "rotateY(180deg)" : "rotateY(0deg)", position: "relative", minHeight: "90px" }}>
                            <div className="absolute inset-0 bg-amber-950/40 border border-amber-700/30 rounded-xl p-3 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                              <p className="text-white font-bold text-sm">{card.word}</p>
                              <p className="text-zinc-500 text-[10px]">{card.phonetic}</p>
                              <p className="text-[9px] text-amber-600">Nhấn để xem nghĩa</p>
                            </div>
                            <div className="absolute inset-0 bg-emerald-950/40 border border-emerald-700/30 rounded-xl p-3 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                              <p className="text-emerald-300 font-bold text-xs">{card.meaning_vn}</p>
                              {card.example_en && <p className="text-zinc-400 text-[10px] italic">&ldquo;{card.example_en}&rdquo;</p>}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {warmupFlipped.size === warmupCards.length && (
                    <button
                      onClick={() => {
                        setWarmupDone(true);
                        // Silently mark flipped cards as "Good" in SRS (fire-and-forget)
                        warmupCards.forEach((card, wi) => {
                          if (warmupFlipped.has(wi)) {
                            reviewCard(card.id, "Good").catch(() => {/* ignore */});
                          }
                        });
                      }}
                      className="mt-3 w-full bg-emerald-700/40 hover:bg-emerald-700/60 text-emerald-300 font-bold rounded-xl py-2 text-sm transition-colors"
                    >
                      ✅ Đã ôn xong ({warmupCards.length} thẻ)
                    </button>
                  )}
                </div>
              )}

            {/* Cultural Note */}
              {unit.culturalNote && (
                <div className="border-l-4 border-emerald-500 bg-emerald-950/30 rounded-r-2xl p-5 mb-8">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🇻🇳</span>
                    <p className="text-sm font-bold text-emerald-400">Ghi chú văn hóa</p>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: unit.culturalNote }} />
                </div>
              )}

              <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                Bắt đầu học <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {/* ══ SECTION 2: Vocabulary ══ */}
          {section === 2 && (
            <motion.div key="s2" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="text-emerald-400" size={22} />
                <h1 className="text-xl sm:text-2xl font-black text-white">Từ vựng & Cụm từ</h1>
                <span className="text-xs text-zinc-500 ml-auto">~5 phút</span>
              </div>
              <p className="text-zinc-400 mb-2 text-sm">Nhấn vào thẻ để lật và xem nghĩa. Nghe phát âm chuẩn bằng nút loa.</p>

              {/* Counter */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(seenCards.size / VOCAB_LIMIT) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-emerald-400">{seenCards.size}/{VOCAB_LIMIT} từ</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {VOCAB_DISPLAY.map((v, i) => {
                  const isFlipped = flippedCards.has(i);
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        const isNowFlipped = !flippedCards.has(i);
                        setFlippedCards(p => {
                          const n = new Set(p);
                          if (n.has(i)) n.delete(i); else n.add(i);
                          return n;
                        });
                        setSeenCards(p => { const n = new Set(p); n.add(i); return n; });
                        if (isNowFlipped) playTTS(v.word, 0.85);
                      }}
                      className="cursor-pointer"
                      style={{ perspective: "600px" }}
                    >
                      <div style={{ transition: "transform 0.5s", transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)", position: "relative", minHeight: "120px" }}>
                        {/* Front */}
                        <div className="absolute inset-0 bg-white/5 border border-zinc-700/60 rounded-2xl p-4 flex flex-col justify-between" style={{ backfaceVisibility: "hidden" }}>
                          {v.emoji && <p className="text-2xl mb-0.5">{v.emoji}</p>}
                          <p className="text-white font-bold text-base">{v.word}</p>
                          <p className="text-zinc-500 text-xs">{v.phonetic}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] text-zinc-600">Nhấn để xem nghĩa</p>
                            <button
                              onClick={e => { e.stopPropagation(); playTTS(v.word); }}
                              aria-label={`Nghe: ${v.word}`}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 transition-colors"
                            >
                              <Volume2 size={14} />
                            </button>
                          </div>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 bg-emerald-950/40 border border-emerald-700/40 rounded-2xl p-4 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                          <div>
                            <p className="text-emerald-300 font-bold text-sm mb-2">{v.meaning}</p>
                            {v.collocation && (
                              <span className="inline-block bg-teal-700/30 border border-teal-600/40 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2">
                                💬 {v.collocation}
                              </span>
                            )}
                            <p className="text-zinc-400 text-xs italic">&ldquo;{v.example}&rdquo;</p>
                            {v.example2 && (
                              <p className="text-zinc-500 text-xs italic mt-1">&ldquo;{v.example2}&rdquo;</p>
                            )}
                          </div>
                          <p className="text-[10px] text-emerald-600">Nhấn để lật lại</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {seenCards.size < VOCAB_LIMIT ? (
                <div className="text-center text-zinc-500 text-sm py-4">
                  Xem thêm {VOCAB_LIMIT - seenCards.size} thẻ để tiếp tục...
                </div>
              ) : (
                <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                  Hoàn thành từ vựng <ChevronRight size={20} />
                </button>
              )}
            </motion.div>
          )}

          {/* ══ SECTION 3: Grammar (PPP Presentation) ══ */}
          {section === 3 && (
            <motion.div key="s3" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-2">
                <BookMarked className="text-teal-400" size={22} />
                <h1 className="text-xl sm:text-2xl font-black text-white">Ngữ pháp</h1>
                <span className="text-xs text-zinc-500 ml-auto">~4 phút</span>
              </div>
              <p className="text-zinc-400 mb-6 text-sm">Hiểu cấu trúc ngữ pháp giúp bạn dùng từ đúng trong ngữ cảnh thực tế.</p>

              {unit.grammar ? (
                <div className="space-y-5">
                  {/* Grammar card */}
                  <div className="bg-teal-950/30 border border-teal-700/40 rounded-2xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">📐</span>
                      <h2 className="text-lg font-black text-teal-300">{unit.grammar.title}</h2>
                    </div>

                    {/* Rule box */}
                    <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-xl p-4 mb-5 font-mono">
                      <p className="text-emerald-300 text-sm font-bold">{unit.grammar.rule}</p>
                    </div>

                    {/* Conjugation table (if provided) */}
                    {unit.grammar.conjugation && (
                      <div className="mb-5">
                        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-3">Chia động từ</p>
                        <div className="grid gap-2">
                          {unit.grammar.conjugation.map((row, i) => (
                            <div key={i} className="flex items-center gap-3 bg-zinc-800/40 rounded-xl px-4 py-2.5">
                              <span className="text-zinc-400 text-sm w-20 font-semibold">{row.subject}</span>
                              <span className="text-emerald-400 font-bold text-sm w-16">{row.form}</span>
                              <span className="text-zinc-300 text-sm italic flex-1">{row.example}</span>
                              <button
                                onClick={() => playTTS(row.example)}
                                aria-label={`Nghe ví dụ: ${row.example}`}
                                className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-colors shrink-0"
                              >
                                <Volume2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Examples */}
                    <div className="space-y-3 mb-4">
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Ví dụ</p>
                      {unit.grammar.examples.map((ex, i) => (
                        <div key={i} className="bg-zinc-800/40 rounded-xl px-4 py-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="text-white font-semibold text-sm">{ex.en}</p>
                            <p className="text-zinc-400 text-xs mt-0.5">{ex.vn}</p>
                          </div>
                          <button
                            onClick={() => playTTS(ex.en)}
                            aria-label={`Nghe ví dụ: ${ex.en}`}
                            className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 transition-colors shrink-0"
                          >
                            <Volume2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Tip */}
                    {unit.grammar.tip && (
                      <div className="border-l-4 border-teal-500 bg-teal-950/20 rounded-r-xl p-3">
                        <p className="text-xs font-bold text-teal-400 mb-1">💡 Mẹo nhớ</p>
                        <p className="text-zinc-300 text-sm">{unit.grammar.tip}</p>
                      </div>
                    )}

                    {/* Grammar → Dialogue cross-reference */}
                    {unit.grammar.dialogueExample && (
                      <div className="mt-4 bg-violet-950/20 border border-violet-700/30 rounded-2xl p-4">
                        <p className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3">🔍 Cấu trúc này xuất hiện trong hội thoại</p>
                        <div className="bg-zinc-900/60 rounded-xl p-3">
                          <p className="text-xs text-violet-300 font-bold mb-1">{unit.grammar.dialogueExample.speaker}:</p>
                          <p className="text-white text-sm leading-relaxed">
                            {(() => {
                              const { text, highlight } = unit.grammar!.dialogueExample!;
                              const idx = text.indexOf(highlight);
                              if (idx < 0) return text;
                              return (<>{text.slice(0, idx)}<mark className="bg-violet-500/30 text-violet-200 px-0.5 rounded font-bold not-italic">{highlight}</mark>{text.slice(idx + highlight.length)}</>);
                            })()}
                          </p>
                          <p className="text-zinc-500 text-xs mt-1 italic">{unit.grammar.dialogueExample.translation}</p>
                        </div>
                      </div>
                    )}

                    {/* CCQ — Concept Check Question (PPP standard) */}
                    {unit.grammar.ccq && (
                      <div className="mt-5 border-t border-teal-700/30 pt-5">
                        <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">✅ Kiểm tra nhanh (CCQ)</p>
                        <p className="text-white font-semibold text-sm mb-3">{unit.grammar.ccq.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                          {unit.grammar.ccq.options.map(opt => {
                            const isPicked = ccqAnswer === opt;
                            const isRight = opt === unit.grammar!.ccq!.answer;
                            let cls = "px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200 text-left ";
                            if (!ccqSubmitted) {
                              cls += isPicked ? "bg-teal-600/30 border-teal-500 text-teal-300" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-teal-600/50 hover:bg-zinc-700/50";
                            } else {
                              if (isRight) cls += "bg-emerald-900/40 border-emerald-500 text-emerald-300";
                              else if (isPicked) cls += "bg-red-900/30 border-red-500 text-red-300";
                              else cls += "bg-zinc-800 border-zinc-700/40 text-zinc-500";
                            }
                            return (<button key={opt} disabled={ccqSubmitted} onClick={() => setCcqAnswer(opt)} className={cls}>{opt}</button>);
                          })}
                        </div>
                        {!ccqSubmitted ? (
                          <button disabled={!ccqAnswer}
                            onClick={() => { setCcqSubmitted(true); if (ccqCorrect) playCorrectSound(); else playWrongSound(); }}
                            className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-bold rounded-xl py-2 text-sm transition-colors"
                          >Kiểm tra</button>
                        ) : (
                          <p className={`text-sm font-bold ${ccqCorrect ? "text-emerald-400" : "text-red-400"}`}>
                            {ccqCorrect ? "✓ Chính xác! Bạn đã hiểu cấu trúc ngữ pháp." : `✗ Đáp án đúng: "${unit.grammar.ccq.answer}"`}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-800/40 border border-zinc-700/40 rounded-2xl p-5 sm:p-8 text-center">
                  <p className="text-zinc-500 text-sm">Bài học này không có phần ngữ pháp riêng.</p>
                </div>
              )}

              <button
                onClick={goNext}
                disabled={!!(unit.grammar?.ccq && !ccqSubmitted)}
                className={`mt-6 w-full text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg ${unit.grammar?.ccq && !ccqSubmitted ? "bg-zinc-700 opacity-50 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-500"}`}
              >
                {unit.grammar?.ccq && !ccqSubmitted ? "Trả lời câu hỏi trước" : "Luyện tập ngay"} <ChevronRight size={20} />
              </button>
            </motion.div>
          )}

          {/* ══ SECTION 4: Practice (MC + cloze + matching) ══ */}
          {section === 4 && (() => {
            return (
              <motion.div key="s4-practice" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">⚡</span>
                  <h1 className="text-xl sm:text-2xl font-black text-white">Luyện tập</h1>
                  <span className="text-xs text-zinc-500 ml-auto">~4 phút</span>
                </div>
                <p className="text-zinc-400 mb-6 text-sm">Kiểm tra nhanh từ vựng và ngữ pháp vừa học. Chọn đáp án hoặc điền từ đúng.</p>

                {/* ── Quiz questions (MC + cloze) ── */}
                <div className="space-y-5 mb-6">
                  {PRACTICE_QS.map((q, qi) => {
                    if (q.type === "cloze") {
                      const userInput = clozeInputs[q.id] ?? "";
                      const isCorrect = userInput.trim().toLowerCase() === q.answer.toLowerCase();
                      return (
                        <div key={q.id} className={`rounded-2xl border p-5 transition-all duration-300 ${
                          practiceSubmitted
                            ? isCorrect ? "border-emerald-500/50 bg-emerald-950/30" : "border-red-500/40 bg-red-950/20"
                            : "border-zinc-700/60 bg-white/5"
                        }`}>
                          <p className="text-white font-bold mb-3 text-sm">
                            <span className="text-emerald-400 mr-2">{qi + 1}.</span>
                            {q.question}
                          </p>
                          <input
                            type="text"
                            disabled={practiceSubmitted}
                            value={userInput}
                            onChange={e => setClozeInputs(p => ({ ...p, [q.id]: e.target.value }))}
                            placeholder="Điền từ còn thiếu..."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                          />
                          {practiceSubmitted && (
                            <p className={`text-xs mt-2 font-bold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                              {isCorrect ? "✓ Chính xác!" : `✗ Đáp án đúng: "${q.answer}"`}
                            </p>
                          )}
                        </div>
                      );
                    }

                    // Multiple choice
                    const selected = practiceAnswers[q.id];
                    const isCorrect = selected === q.answer;
                    return (
                      <div key={q.id} className={`rounded-2xl border p-5 transition-all duration-300 ${
                        practiceSubmitted
                          ? isCorrect ? "border-emerald-500/50 bg-emerald-950/30" : "border-red-500/40 bg-red-950/20"
                          : "border-zinc-700/60 bg-white/5"
                      }`}>
                        <p className="text-white font-bold mb-3 text-sm">
                          <span className="text-emerald-400 mr-2">{qi + 1}.</span>
                          {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map(opt => {
                            const isPicked = selected === opt;
                            const isRight = opt === q.answer;
                            let cls = "px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-200 text-left ";
                            if (!practiceSubmitted) {
                              cls += isPicked
                                ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-emerald-600/50 hover:bg-zinc-700/50";
                            } else {
                              if (isRight) cls += "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold";
                              else if (isPicked && !isRight) cls += "bg-red-900/30 border-red-500/60 text-red-300 line-through";
                              else cls += "bg-zinc-800/50 border-zinc-700/40 text-zinc-500";
                            }
                            return (
                              <button
                                key={opt}
                                disabled={practiceSubmitted}
                                className={cls}
                                onClick={() => {
                                  if (practiceSubmitted) return;
                                  setPracticeAnswers(p => ({ ...p, [q.id]: opt }));
                                }}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                        {practiceSubmitted && (
                          <p className={`text-xs mt-2 font-bold ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                            {isCorrect ? "✓ Chính xác!" : `✗ Đáp án đúng: ${q.answer}`}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* ── Matching Exercise ── */}
                {unit.matchingExercise && (
                  <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-5 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Shuffle size={16} className="text-teal-400" />
                      <p className="text-sm font-bold text-white">
                        {unit.matchingExercise.title ?? "Nối từ với nghĩa đúng"}
                      </p>
                      {matchingDone && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
                      {!matchingDone && matchedPairs.size > 0 && (
                        <button
                          onClick={() => { setMatchedPairs(new Set()); setMatchLeft(null); setWrongMatch(null); }}
                          className="ml-auto text-[10px] font-bold text-zinc-500 hover:text-zinc-300 px-2 py-1 rounded-lg bg-zinc-800/60 border border-zinc-700/40 transition-colors"
                        >
                          ↺ Làm lại
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Left column — English */}
                      <div className="space-y-2">
                        {unit.matchingExercise.pairs.map((pair, i) => {
                          const isMatched = matchedPairs.has(pair.left);
                          const isSelected = matchLeft === pair.left;
                          return (
                            <button
                              key={i}
                              onClick={() => !isMatched && handleMatchSelect("left", pair.left)}
                              className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-all duration-200 ${
                                isMatched
                                  ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                                  : isSelected
                                  ? "bg-teal-600/30 border-teal-400 text-teal-200"
                                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-teal-600/50"
                              }`}
                            >
                              {isMatched && "✓ "}{pair.left}
                            </button>
                          );
                        })}
                      </div>

                      {/* Right column — Vietnamese (shuffled) */}
                      <div className="space-y-2">
                        {shuffledRight.map((right, i) => {
                          const isMatched = matchedPairs.has(right);
                          const isWrong = wrongMatch === right;
                          return (
                            <button
                              key={i}
                              onClick={() => !isMatched && handleMatchSelect("right", right)}
                              className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium border text-left transition-all duration-200 ${
                                isMatched
                                  ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                                  : isWrong
                                  ? "bg-red-900/30 border-red-500/60 text-red-300 animate-shake"
                                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-teal-600/50"
                              }`}
                            >
                              {isMatched && "✓ "}{right}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {matchingDone && (
                      <div className="mt-3 text-center">
                        <p className="text-emerald-400 font-bold text-sm">🎉 Hoàn thành! Bạn nối đúng tất cả!</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Sentence Scramble ── */}
                {unit.scrambleExercises && unit.scrambleExercises.length > 0 && (
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔀</span>
                      <p className="text-sm font-bold text-white">Sắp xếp thành câu đúng</p>
                      <span className="text-xs text-zinc-500 ml-auto">Sản xuất ngôn ngữ</span>
                    </div>
                    {unit.scrambleExercises.map(ex => {
                      const built = scrambleBuilt[ex.id] ?? [];
                      const pool = scrambleShuffled[ex.id] ?? [...ex.words].sort(() => Math.random() - 0.5);
                      const isChecked = !!scrambleChecked[ex.id];
                      const isCorrect = built.join(" ").toLowerCase().trim() === ex.answer.toLowerCase().trim();
                      return (
                        <div key={ex.id} className={`rounded-2xl border p-5 transition-all duration-300 ${
                          isChecked
                            ? isCorrect ? "border-emerald-500/50 bg-emerald-950/30" : "border-red-500/40 bg-red-950/20"
                            : "border-zinc-700/60 bg-white/5"
                        }`}>
                          <p className="text-zinc-400 text-xs mb-3">🇻🇳 {ex.prompt_vn}</p>
                          {/* Built sentence slot */}
                          <div className="min-h-[44px] flex flex-wrap gap-2 mb-3 p-3 bg-zinc-900/60 rounded-xl border border-zinc-700/40">
                            {built.length === 0
                              ? <span className="text-zinc-600 text-xs self-center">Nhấn từ bên dưới để xây dựng câu...</span>
                              : built.map((w, i) => (
                                  <button key={i} disabled={isChecked}
                                    onClick={() => {
                                      if (isChecked) return;
                                      setScrambleBuilt(p => {
                                        const arr = [...(p[ex.id] ?? [])];
                                        arr.splice(i, 1);
                                        return { ...p, [ex.id]: arr };
                                      });
                                    }}
                                    className="px-2.5 py-1 bg-emerald-700/40 border border-emerald-600/50 text-emerald-200 rounded-lg text-xs font-medium hover:bg-red-900/30 hover:border-red-500/40 transition-colors disabled:cursor-default"
                                  >{w}</button>
                                ))
                            }
                          </div>
                          {/* Word tile pool */}
                          {!isChecked && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {pool.map((w, i) => {
                                const usedCount = built.filter(b => b === w).length;
                                const totalCount = pool.filter(t => t === w).length;
                                const disabled = usedCount >= totalCount;
                                return (
                                  <button key={i} disabled={disabled}
                                    onClick={() => {
                                      if (disabled) return;
                                      setScrambleBuilt(p => ({ ...p, [ex.id]: [...(p[ex.id] ?? []), w] }));
                                    }}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                                      disabled
                                        ? "opacity-25 bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed"
                                        : "bg-zinc-800 border-zinc-600 text-zinc-200 hover:border-teal-500/50 hover:bg-zinc-700/60 cursor-pointer"
                                    }`}
                                  >{w}</button>
                                );
                              })}
                            </div>
                          )}
                          {/* Check / Result */}
                          {!isChecked ? (
                            <button
                              disabled={built.length === 0}
                              onClick={() => {
                                setScrambleChecked(p => ({ ...p, [ex.id]: true }));
                                if (built.join(" ").toLowerCase().trim() === ex.answer.toLowerCase().trim()) playCorrectSound();
                                else playWrongSound();
                              }}
                              className="px-4 py-1.5 bg-teal-600/30 border border-teal-500/40 text-teal-300 rounded-xl text-xs font-bold hover:bg-teal-600/50 disabled:opacity-40 transition-colors"
                            >Kiểm tra</button>
                          ) : (
                            <p className={`text-xs font-bold mt-1 ${isCorrect ? "text-emerald-400" : "text-red-400"}`}>
                              {isCorrect ? "✓ Chính xác!" : `✗ Đáp án đúng: "${ex.answer}"`}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Submit/Continue */}
                {!practiceSubmitted ? (
                  <button
                    disabled={!allPracticeAnswered}
                    onClick={() => {
                      setPracticeSubmitted(true);
                      if (practiceScore >= Math.ceil(PRACTICE_QS.length * 0.7)) playCorrectSound();
                      else playWrongSound();
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg"
                  >
                    Kiểm tra đáp án <ChevronRight size={20} />
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className={`rounded-2xl p-4 text-center border ${
                      practiceScore === PRACTICE_QS.length
                        ? "bg-emerald-950/40 border-emerald-500/30"
                        : "bg-zinc-900/40 border-zinc-700/40"
                    }`}>
                      <p className="text-xl sm:text-2xl font-black text-white">{practiceScore}/{PRACTICE_QS.length} câu đúng</p>
                      <p className="text-sm text-zinc-400 mt-1">
                        {practiceScore === PRACTICE_QS.length ? "🏆 Xuất sắc! Bạn nắm vững bài học!" : practiceScore >= Math.ceil(PRACTICE_QS.length * 0.7) ? "🎯 Khá tốt! Tiếp tục nhé!" : "💪 Ôn lại thẻ từ vựng sẽ giúp bạn nhớ lâu hơn!"}
                      </p>
                    </div>
                    {matchingDone && allScrambleDone ? (
                      <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                        Tiếp tục <ChevronRight size={20} />
                      </button>
                    ) : (
                      <p className="text-center text-zinc-500 text-sm flex items-center justify-center gap-1.5">
                        <span>↑</span>
                        {!matchingDone ? "Hoàn thành phần nối từ ở trên để tiếp tục" : "Hoàn thành phần sắp xếp câu ở trên để tiếp tục"}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })()}

          {/* ══ SECTION 5: Listening ══ */}
          {section === 5 && (
            <motion.div key="s5" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <Headphones className="text-emerald-400" size={22} />
                <h1 className="text-xl sm:text-2xl font-black text-white">Nghe hiểu</h1>
                <span className="text-xs text-zinc-500 ml-auto">~5 phút</span>
              </div>

              {/* Dialogue selector */}
              {DIALOGUES.length > 1 && (
                <div className="flex gap-2 mb-5">
                  {DIALOGUES.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedDialogue(i); setShowTranscript(false); window.speechSynthesis?.cancel(); setIsPlayingDialogue(false); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedDialogue === i ? "bg-emerald-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}
                    >
                      {d.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Dialogue player */}
              {DIALOGUES.length > 0 && (
                <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-5 mb-4">
                  <p className="text-xs text-zinc-500 mb-2">{DIALOGUES[selectedDialogue].desc}</p>
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => isPlayingDialogue ? (window.speechSynthesis?.cancel(), setIsPlayingDialogue(false)) : playDialogueTTS(selectedDialogue, 1.0)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors ${isPlayingDialogue ? "bg-red-600/30 text-red-400 border border-red-600/30" : "bg-emerald-600 text-white hover:bg-emerald-500"}`}
                    >
                      <Volume2 size={16} />
                      {isPlayingDialogue ? "Dừng" : "Nghe hội thoại"}
                    </button>
                    <button
                      onClick={() => isPlayingDialogue ? (window.speechSynthesis?.cancel(), setIsPlayingDialogue(false)) : playDialogueTTS(selectedDialogue, 0.75)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors"
                    >
                      🐢 Chậm
                    </button>
                    <button
                      onClick={() => setShowTranscript(p => !p)}
                      className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}
                      Transcript
                    </button>
                  </div>

                  <AnimatePresence>
                    {showTranscript && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
                        {DIALOGUES[selectedDialogue].lines.map((line, i) => (
                          <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
                            <div className={`max-w-[80%] rounded-xl p-3 ${i % 2 === 0 ? "bg-zinc-800" : "bg-emerald-900/40"}`}>
                              <p className="text-[10px] text-zinc-500 mb-1">{line.speaker}</p>
                              <p className="text-white text-sm">{line.text}</p>
                              <p className="text-zinc-500 text-xs mt-1">{line.translation}</p>
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Listen & Choose */}
              {LISTEN_CHOOSE.length > 0 && (
                <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-5 mb-6">
                  <p className="text-sm font-bold text-white mb-4">🎧 Nghe và chọn đáp án đúng</p>
                  <div className="space-y-5">
                    {LISTEN_CHOOSE.map((item, qi) => (
                      <div key={qi}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-zinc-500">Câu {qi + 1}</span>
                          <button
                            onClick={() => playTTS(item.audio_text)}
                            aria-label="Nghe câu"
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs hover:bg-emerald-600/30 transition-colors"
                          >
                            <Volume2 size={12} /> Nghe
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {item.options.map((opt, oi) => {
                            const isSelected = lacAnswers[qi] === opt;
                            const isCorrect = opt === item.answer;
                            let cls = "px-3 py-2 rounded-xl text-sm font-medium border transition-colors cursor-pointer text-left ";
                            if (lacSubmitted) {
                              if (isCorrect) cls += "bg-emerald-600/20 border-emerald-500 text-emerald-300";
                              else if (isSelected) cls += "bg-red-600/20 border-red-500 text-red-300";
                              else cls += "bg-zinc-800/50 border-zinc-700 text-zinc-500";
                            } else {
                              cls += isSelected ? "bg-emerald-600/30 border-emerald-500 text-emerald-300" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-emerald-600/50";
                            }
                            return (
                              <button key={oi} onClick={() => !lacSubmitted && setLacAnswers(p => ({ ...p, [qi]: opt }))} className={cls}>
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!lacSubmitted ? (
                    <button
                      onClick={() => { setLacSubmitted(true); }}
                      disabled={Object.keys(lacAnswers).length < LISTEN_CHOOSE.length}
                      className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors"
                    >
                      Kiểm tra đáp án
                    </button>
                  ) : (
                    <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-700/40 rounded-xl text-center">
                      <p className="text-emerald-300 font-bold text-lg">
                        {lacScore}/{LISTEN_CHOOSE.length} đúng 🎯
                      </p>
                    </div>
                  )}
                </div>
              )}

              {(!LISTEN_CHOOSE.length || lacSubmitted) && (
                <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                  Tiếp tục <ChevronRight size={20} />
                </button>
              )}
            </motion.div>
          )}

          {/* ══ SECTION 6: Shadowing ══ */}
          {section === 6 && (
            <motion.div key="s6" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="text-emerald-400" size={22} />
                <h1 className="text-xl sm:text-2xl font-black text-white">Shadowing</h1>
                <span className="text-xs text-zinc-500 ml-auto">~5 phút</span>
              </div>

              {DIALOGUES.length > 0 && !shadowDone ? (
                <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-4 sm:p-6">
                  {/* Dialogue selector tabs — only shown when unit has multiple dialogues */}
                  {DIALOGUES.length > 1 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                      {DIALOGUES.map((dlg, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (idx === shadowDialogueIdx) return;
                            setShadowDialogueIdx(idx);
                            setShadowLineIdx(0);
                            setShadowScores({});
                            setShadowTranscripts({});
                          }}
                          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                            idx === shadowDialogueIdx
                              ? "bg-emerald-600/20 border-emerald-500/50 text-emerald-300"
                              : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-teal-600/50 hover:text-zinc-200"
                          }`}
                        >
                          Hội thoại {idx + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-zinc-500 mb-2 font-bold">
                    <span>Tiến độ dòng hội thoại</span>
                    <span>{shadowLineIdx + 1}/{DIALOGUES[shadowDialogueIdx].lines.length}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${((shadowLineIdx) / DIALOGUES[shadowDialogueIdx].lines.length) * 100}%` }}
                    />
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 mb-6 text-center relative overflow-hidden">
                    <span className="absolute top-3 left-3 text-[10px] font-bold text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded uppercase">
                      {DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].speaker}
                    </span>
                    <p className="text-zinc-500 text-[10px] mb-2 uppercase tracking-widest font-black">Hãy nghe rồi nói lại</p>
                    <p className="text-white text-base sm:text-xl font-bold mb-1 leading-snug">{DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].text}</p>
                    <p className="text-zinc-400 text-sm">{DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].translation}</p>
                  </div>

                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={() => playTTS(DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].text, shadowSpeed)}
                      aria-label="Nghe mẫu"
                      className="w-14 h-14 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors"
                    >
                      <Volume2 size={24} />
                    </button>

                    <button
                      onClick={isRecording ? () => { recognitionRef.current?.stop(); setIsRecording(false); } : handleShadowRecord}
                      disabled={isRecognizing && !isRecording}
                      aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-600 text-white animate-pulse" : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105 text-white shadow-lg shadow-emerald-950/50"}`}
                    >
                      {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                    </button>

                    <button
                      onClick={() => setShadowSpeed(s => s === 1.0 ? 0.75 : 1.0)}
                      className="px-4 py-2 rounded-xl bg-zinc-850 border border-zinc-800 text-xs font-bold text-zinc-300 hover:bg-zinc-800 transition-colors"
                    >
                      {shadowSpeed === 1.0 ? "Normal Speed" : "🐢 Chậm (0.75x)"}
                    </button>
                  </div>

                  {shadowTranscripts[shadowLineIdx] && (
                    <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-xl p-4 mb-6 text-center">
                      <p className="text-[10px] text-zinc-500 mb-1 font-bold">BẠN VỪA NÓI:</p>
                      <p className="text-white text-sm font-semibold mb-2">&ldquo;{shadowTranscripts[shadowLineIdx]}&rdquo;</p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/10">
                        Độ chính xác: {shadowScores[shadowLineIdx]}%
                      </div>
                    </div>
                  )}

                  {shadowScores[shadowLineIdx] !== undefined && (
                    <button
                      onClick={handleShadowNext}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors border border-zinc-750"
                    >
                      {shadowLineIdx < DIALOGUES[shadowDialogueIdx].lines.length - 1 ? "Dòng tiếp theo" : "Hoàn thành phần Shadowing"}
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center mb-4 sm:mb-6 bg-white/5 border border-zinc-800/60 rounded-2xl p-5 sm:p-8">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-emerald-400 font-bold text-lg mb-1">Hoàn thành Shadowing!</p>
                  <p className="text-zinc-400 text-sm mb-6">
                    Điểm trung bình: {shadowAvg}%
                  </p>
                  <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                    Tiếp tục luyện nói <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ══ SECTION 7: Speaking Output ══ */}
          {section === 7 && (
            <motion.div key="s7" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <Mic className="text-emerald-400" size={22} />
                <h1 className="text-xl sm:text-2xl font-black text-white">Luyện nói</h1>
                <span className="text-xs text-zinc-500 ml-auto">~5 phút</span>
              </div>

              {/* Level 1 */}
              <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-600/20 text-emerald-400 rounded-full">Cấp độ 1</span>
                  <p className="text-white font-semibold">Nói theo khung</p>
                  {level1Done && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
                </div>

                <div className="bg-zinc-900/60 rounded-xl p-4 mb-4 text-center">
                  <p className="text-zinc-400 text-sm mb-1">Hãy nói to câu sau:</p>
                  <p className="text-white text-base sm:text-xl font-bold">{formattedL1Prompt}</p>
                </div>

                <input
                  type="text"
                  placeholder={unit.speaking.level1Placeholder}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 mb-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                {nameInput && (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => playTTS(formattedL1Prompt)}
                        aria-label="Nghe mẫu"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold text-sm transition-colors"
                      >
                        <Volume2 size={16} /> Nghe mẫu
                      </button>
                      <button
                        disabled={isLevel1Recording || isRecognizing}
                        onClick={() => {
                          setIsLevel1Recording(true);
                          startRecognition((text) => {
                            setLevel1Transcript(text);
                            setIsLevel1Recording(false);
                            const score = calcSpeechScore(formattedL1Prompt, text);
                            setLevel1Score(score);
                            if (score >= 60) setLevel1Done(true);
                          });
                        }}
                        aria-label="Luyện nói"
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all ${isLevel1Recording ? "bg-red-600 text-white animate-pulse" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}
                      >
                        {isLevel1Recording ? <><MicOff size={16} /> Đang nghe...</> : <><Mic size={16} /> Luyện nói</>}
                      </button>
                    </div>
                    {level1Transcript && (
                      <div className="bg-zinc-900/60 rounded-xl px-4 py-3 text-sm">
                        <p className="text-zinc-500 text-[10px] mb-1 font-bold">BẠN VỪA NÓI:</p>
                        <p className="text-zinc-200">&ldquo;{level1Transcript}&rdquo;</p>
                        {level1Score !== null && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${level1Score >= 60 ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                              {level1Score}% chính xác
                            </span>
                            {level1Score < 60 && (
                              <button onClick={() => { setLevel1Score(null); setLevel1Transcript(""); }} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-bold">Thử lại</button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {level1Done && (
                      <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                        <CheckCircle size={14} /> Hoàn thành cấp độ 1!
                      </div>
                    )}
                    {!level1Done && level1Score !== null && level1Score < 60 && (
                      <button
                        onClick={() => setLevel1Done(true)}
                        className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-bold py-2 transition-colors"
                      >
                        Bỏ qua và tiếp tục →
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Level 2 */}
              <div className={`bg-white/5 border rounded-2xl p-6 mb-6 transition-all ${level1Done ? "border-zinc-700/60" : "border-zinc-800/30 opacity-50 pointer-events-none"}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 text-xs font-bold bg-teal-600/20 text-teal-400 rounded-full">Cấp độ 2</span>
                  <p className="text-white font-semibold">Tự giới thiệu / Diễn đạt tự do</p>
                  {level2Done && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
                </div>

                <div className="bg-zinc-900/60 rounded-xl p-4 mb-4">
                  <p className="text-zinc-400 text-sm mb-2">📍 Tình huống:</p>
                  <p className="text-white text-sm">&ldquo;{unit.speaking.level2Situation}&rdquo;</p>
                </div>

                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setShowHint(p => !p)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
                  >
                    <Lightbulb size={12} />
                    {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
                  </button>
                </div>

                <AnimatePresence>
                  {showHint && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-l-4 border-zinc-600 bg-zinc-800/40 rounded-r-xl p-3 mb-4 overflow-hidden">
                      <p className="text-zinc-300 text-sm" dangerouslySetInnerHTML={{ __html: unit.speaking.level2Hint }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {level2Transcript && (
                  <div className="bg-zinc-900/60 rounded-xl p-3 mb-3">
                    <p className="text-xs text-zinc-500 mb-1">Bạn vừa nói:</p>
                    <p className="text-white text-sm">&ldquo;{level2Transcript}&rdquo;</p>
                    {level2Score !== null && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          level2Score >= 70 ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}>
                          Độ chính xác: {level2Score}%
                        </div>
                        <span className="text-xs text-zinc-500">
                          {level2Score >= 70 ? "Tốt lắm! 🎉" : "Thử lại sẽ tốt hơn 💪"}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={level2Recording ? () => { recognitionRef.current?.stop(); setLevel2Recording(false); } : handleLevel2Record}
                    aria-label={level2Recording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${level2Recording ? "bg-red-600 text-white animate-pulse" : "bg-emerald-600 hover:bg-emerald-500 text-white"}`}
                  >
                    {level2Recording ? <MicOff size={16} /> : <Mic size={16} />}
                    {level2Recording ? "Dừng" : "Bắt đầu nói"}
                  </button>
                  {level2Transcript && (
                    <button onClick={() => setLevel2Done(true)} className="px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold text-sm transition-colors">
                      Tiếp tục
                    </button>
                  )}
                </div>

                {!getSpeechRecognition() && (
                  <p className="text-yellow-400 text-xs mt-3 text-center">⚠️ Trình duyệt không hỗ trợ ghi âm. Thử Chrome hoặc Edge.</p>
                )}
                <p className="text-zinc-600 text-xs mt-2 text-center">Không sao đâu, cứ thử — mình ở đây để luyện cùng bạn! 💪</p>
              </div>

              {level1Done && (level2Done || level2Transcript !== "") && (
                <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                  Xem kết quả <ChevronRight size={20} />
                </button>
              )}
              {level1Done && !level2Done && level2Transcript === "" && (
                <p className="text-center text-zinc-500 text-sm">Thử nói ở Cấp độ 2 trước khi tiếp tục 🎤</p>
              )}
            </motion.div>
          )}

          {/* ══ SECTION 8: Final Quiz + Badge + Stars ══ */}
          {section === 8 && (
            <motion.div key="s8" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="text-emerald-400" size={22} />
                <h1 className="text-xl sm:text-2xl font-black text-white">Ôn tập & Kết quả</h1>
                <span className="text-xs text-zinc-500 ml-auto">~3 phút</span>
              </div>

              {/* ── Cumulative Spaced Review (Priority 5) ── */}
              {unit.cumulativeReviewQuestions && unit.cumulativeReviewQuestions.length > 0 && (
                <div className="mb-6">
                  {!cumulativeSubmitted ? (
                    <div className="bg-amber-950/20 border border-amber-700/30 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🔁</span>
                        <div>
                          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">Ôn tập bài cũ</p>
                          <p className="text-xs text-zinc-500">Trả lời để kích hoạt bộ nhớ dài hạn trước khi học tiếp</p>
                        </div>
                      </div>
                      <div className="space-y-5">
                        {unit.cumulativeReviewQuestions.map((q, qi) => {
                          if (q.type === "cloze" || q.type === "translate") {
                            return (
                              <div key={q.id}>
                                <p className="text-white text-sm mb-2"><span className="text-amber-500/70 mr-2">↺ {qi + 1}.</span>{q.question}</p>
                                {q.type === "translate" && <p className="text-xs text-violet-400 mb-1">✍️ Dịch sang tiếng Anh</p>}
                                <input type="text" value={cumulativeClozeInputs[q.id] ?? ""}
                                  onChange={e => setCumulativeClozeInputs(p => ({ ...p, [q.id]: e.target.value }))}
                                  placeholder={q.type === "translate" ? "Nhập câu tiếng Anh..." : "Điền từ còn thiếu..."}
                                  className="w-full bg-zinc-800 border border-amber-700/30 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                                />
                              </div>
                            );
                          }
                          return (
                            <div key={q.id}>
                              <p className="text-white text-sm mb-2"><span className="text-amber-500/70 mr-2">↺ {qi + 1}.</span>{q.question}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {q.options.map(opt => (
                                  <button key={opt}
                                    disabled={cumulativeSubmitted}
                                    onClick={() => !cumulativeSubmitted && setCumulativeAnswers(p => ({ ...p, [q.id]: opt }))}
                                    className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors text-left disabled:cursor-default ${cumulativeAnswers[q.id] === opt ? "bg-amber-600/30 border-amber-500 text-amber-300" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-amber-600/40"}`}
                                  >{opt}</button>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        disabled={unit.cumulativeReviewQuestions.some(q =>
                          q.type === "multiple-choice" ? !cumulativeAnswers[q.id] : !(cumulativeClozeInputs[q.id] ?? "").trim()
                        )}
                        onClick={() => {
                          setCumulativeSubmitted(true);
                          const correct = unit.cumulativeReviewQuestions!.filter(q =>
                            q.type === "multiple-choice"
                              ? cumulativeAnswers[q.id] === q.answer
                              : (cumulativeClozeInputs[q.id] ?? "").trim().toLowerCase() === q.answer.toLowerCase()
                          ).length;
                          if (correct === unit.cumulativeReviewQuestions!.length) playCorrectSound();
                        }}
                        className="mt-4 w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold rounded-xl py-2.5 text-sm transition-colors"
                      >Kiểm tra ôn tập</button>
                    </div>
                  ) : (
                    <div className="bg-amber-950/20 border border-amber-700/30 rounded-2xl p-4">
                      <p className="text-xs font-bold text-amber-400 mb-2">🔁 Kết quả ôn tập bài cũ</p>
                      <div className="space-y-2">
                        {unit.cumulativeReviewQuestions.map((q, qi) => {
                          const isCorrect = q.type === "multiple-choice"
                            ? cumulativeAnswers[q.id] === q.answer
                            : (cumulativeClozeInputs[q.id] ?? "").trim().toLowerCase() === q.answer.toLowerCase();
                          return (
                            <div key={q.id} className={`flex items-start gap-2 text-xs rounded-xl p-2 ${isCorrect ? "bg-emerald-950/30" : "bg-red-950/20"}`}>
                              <span>{isCorrect ? "✓" : "✗"}</span>
                              <div>
                                <p className="text-zinc-300">{qi + 1}. {q.question}</p>
                                {!isCorrect && <p className="text-emerald-400 mt-0.5">Đáp án: {q.answer}</p>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Final Quiz */}
              {!quizSubmitted ? (
                <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-6 mb-6">
                  <p className="text-sm font-bold text-white mb-5">🧠 Quiz tổng hợp — {FINAL_QS.length} câu</p>
                  <div className="space-y-6">
                    {FINAL_QS.map((q, qi) => {
                      if (q.type === "cloze") {
                        return (
                          <div key={q.id}>
                            <p className="text-white text-sm mb-3"><span className="text-zinc-500 mr-2">Câu {qi + 1}.</span>{q.question}</p>
                            <input
                              type="text"
                              value={quizClozeInputs[q.id] ?? ""}
                              onChange={e => setQuizClozeInputs(p => ({ ...p, [q.id]: e.target.value }))}
                              placeholder="Điền từ còn thiếu..."
                              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                            />
                          </div>
                        );
                      }
                      if (q.type === "translate") {
                        return (
                          <div key={q.id}>
                            <p className="text-white text-sm mb-1"><span className="text-zinc-500 mr-2">Câu {qi + 1}.</span>{q.question}</p>
                            <p className="text-xs text-violet-400 mb-2">✍️ Dịch sang tiếng Anh</p>
                            <input
                              type="text"
                              value={quizClozeInputs[q.id] ?? ""}
                              onChange={e => setQuizClozeInputs(p => ({ ...p, [q.id]: e.target.value }))}
                              placeholder="Nhập câu tiếng Anh..."
                              className="w-full bg-zinc-800 border border-violet-700/50 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                            />
                          </div>
                        );
                      }
                      return (
                        <div key={q.id}>
                          <p className="text-white text-sm mb-3"><span className="text-zinc-500 mr-2">Câu {qi + 1}.</span>{q.question}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                              const isSelected = quizAnswers[q.id] === opt;
                              const isWrongAnswer = quizSubmitted && isSelected && opt !== q.answer;
                              const isRightAnswer = quizSubmitted && opt === q.answer;
                              let cls = "px-3 py-2 rounded-xl text-sm font-medium border transition-colors text-left ";
                              if (quizSubmitted) {
                                if (isRightAnswer) cls += "bg-emerald-600/30 border-emerald-500 text-emerald-300";
                                else if (isWrongAnswer) cls += "bg-red-900/30 border-red-500 text-red-300 animate-shake";
                                else cls += "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 cursor-default";
                              } else {
                                cls += isSelected
                                  ? "bg-emerald-600/30 border-emerald-500 text-emerald-300"
                                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-emerald-600/50";
                              }
                              return (
                                <button
                                  key={oi}
                                  onClick={() => !quizSubmitted && setQuizAnswers(p => ({ ...p, [q.id]: opt }))}
                                  disabled={quizSubmitted}
                                  className={cls}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setQuizSubmitted(true);
                      if (finalQuizScore >= Math.ceil(FINAL_QS.length * 0.8)) playCorrectSound();
                      else if (finalQuizScore < Math.ceil(FINAL_QS.length * 0.5)) playWrongSound();
                    }}
                    disabled={
                      FINAL_QS.filter(q => q.type === "multiple-choice").some(q => !quizAnswers[q.id]) ||
                      FINAL_QS.filter(q => q.type === "cloze" || q.type === "translate").some(q => !(quizClozeInputs[q.id] ?? "").trim())
                    }
                    className="mt-6 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold rounded-xl py-3 transition-colors"
                  >
                    Kiểm tra đáp án
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="bg-emerald-950/40 border border-emerald-700/40 rounded-2xl p-6 text-center">
                    <div className="text-5xl mb-3">
                      {finalQuizScore >= Math.ceil(FINAL_QS.length * 0.8) ? "🏆" : finalQuizScore >= Math.ceil(FINAL_QS.length * 0.6) ? "🎯" : "💪"}
                    </div>
                    <p className="text-emerald-300 font-black text-2xl mb-1">{finalQuizScore}/{FINAL_QS.length} đúng</p>
                    <p className="text-zinc-400 text-sm">
                      {finalQuizScore >= Math.ceil(FINAL_QS.length * 0.8) ? "Xuất sắc! Bạn đã nắm vững bài học!" : finalQuizScore >= Math.ceil(FINAL_QS.length * 0.6) ? "Khá tốt! Tiếp tục ôn tập nhé!" : "Cần luyện thêm một chút — bạn làm được!"}
                    </p>
                  </div>


                  {/* Retry panel — wrong answers re-attempted for bonus score */}
                  {wrongQuestions.length > 0 && (
                    <div className="bg-amber-950/30 border border-amber-700/40 rounded-2xl p-5">
                      <p className="text-sm font-bold text-amber-400 mb-1">💡 Ôn lại câu sai ({wrongQuestions.length} câu)</p>
                      <p className="text-xs text-zinc-500 mb-4">Trả lời đúng để nhận thêm điểm thưởng (tối đa +10%)!</p>
                      {!retrySubmitted ? (
                        <div className="space-y-4">
                          {wrongQuestions.map((q, qi) => {
                            if (q.type === "cloze") {
                              return (
                                <div key={q.id}>
                                  <p className="text-white text-sm mb-2"><span className="text-amber-400 mr-2">↺ {qi + 1}.</span>{q.question}</p>
                                  <input type="text" value={retryClozeInputs[q.id] ?? ""}
                                    onChange={e => setRetryClozeInputs(p => ({ ...p, [q.id]: e.target.value }))}
                                    placeholder="Điền từ còn thiếu..."
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                                  />
                                </div>
                              );
                            }
                            return (
                              <div key={q.id}>
                                <p className="text-white text-sm mb-2"><span className="text-amber-400 mr-2">↺ {qi + 1}.</span>{q.question}</p>
                                <div className="grid grid-cols-2 gap-2">
                                  {q.options.map(opt => (
                                    <button key={opt} onClick={() => setRetryAnswers(p => ({ ...p, [q.id]: opt }))}
                                      className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors text-left ${retryAnswers[q.id] === opt ? "bg-amber-600/30 border-amber-500 text-amber-300" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-amber-600/50"}`}
                                    >{opt}</button>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                          <button
                            onClick={() => { setRetrySubmitted(true); if (retryCorrectCount > 0) playCorrectSound(); }}
                            disabled={wrongQuestions.some(q => q.type === "multiple-choice" ? !retryAnswers[q.id] : !(retryClozeInputs[q.id] ?? "").trim())}
                            className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold rounded-xl py-2.5 text-sm transition-colors"
                          >Gửi câu trả lời</button>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-2xl mb-1">{retryCorrectCount === wrongQuestions.length ? "🎉" : "📖"}</p>
                          <p className="font-bold text-white">{retryCorrectCount}/{wrongQuestions.length} câu đúng</p>
                          {retryBonusPct > 0 && <p className="text-emerald-400 font-bold text-sm mt-1">+{retryBonusPct}% điểm thưởng! Tổng: {effectiveScore}%</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Progress Summary */}
                  <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-5">
                    <p className="text-sm font-bold text-white mb-3">📊 Kết quả học tập</p>
                    <div className="space-y-2">
                      {[
                        { label: "Từ vựng đã học", value: `${seenCards.size}/${VOCAB_LIMIT} từ`, icon: "📚", done: seenCards.size >= VOCAB_LIMIT },
                        { label: "Shadowing", value: `${shadowAvg}% trung bình`, icon: "🎤", done: shadowDone || DIALOGUES.length === 0 },
                        { label: "Nghe hiểu", value: `${lacScore}/${LISTEN_CHOOSE.length} đúng`, icon: "🎧", done: lacScore >= Math.ceil(LISTEN_CHOOSE.length * 0.7) },
                        { label: "Quiz", value: `${finalQuizScore}/${FINAL_QS.length} đúng`, icon: "🧠", done: finalQuizScore >= Math.ceil(FINAL_QS.length * 0.6) },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <span>{item.icon}</span>
                          <span className="text-zinc-400 text-sm flex-1">{item.label}</span>
                          <span className={`text-sm font-bold ${item.done ? "text-emerald-400" : "text-zinc-400"}`}>{item.value}</span>
                          {item.done && <CheckCircle size={14} className="text-emerald-500" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Badge — performance-based stars */}
                  <div className="bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border border-emerald-700/40 rounded-2xl p-5 sm:p-8 text-center">
                    <div className="text-7xl mb-3 animate-bounce">{unit.badgeEmoji}</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < effectiveStarCount ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-500 mb-2">{effectiveScore}% tổng điểm{retryBonusPct > 0 ? <span className="text-emerald-400 ml-1">(+{retryBonusPct}% bonus)</span> : null}</p>
                    <p className="text-emerald-300 font-black text-xl mb-1">Huy hiệu: {unit.badgeName}</p>
                    <p className="text-zinc-400 text-sm">{unit.title}</p>
                  </div>

                  {/* Motivation */}
                  <div className="border-l-4 border-emerald-500 bg-emerald-950/20 rounded-r-2xl p-5">
                    <p className="text-emerald-300 font-bold text-lg leading-relaxed">
                      Tuyệt vời! Bạn đã hoàn thành xuất sắc chương học này. 🌟
                    </p>
                    <p className="text-zinc-400 text-sm mt-2">
                      Hãy tiếp tục phát huy tinh thần tự học mỗi ngày. Lặp lại ngắt quãng sẽ giúp bạn nhớ từ vựng lâu hơn!
                    </p>
                  </div>

                  {/* ── Proof Moment ── */}
                  {unit.situation && (
                    <div className="bg-gradient-to-br from-violet-950/40 to-teal-950/40 border border-violet-600/30 rounded-2xl p-5">
                      <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">🎤 Proof of Progress</p>
                      <p className="text-white font-semibold text-sm mb-1">Hãy thử lại tình huống hôm nay!</p>
                      <p className="text-zinc-400 text-xs mb-4">Nói to câu trả lời cho tình huống: <span className="text-zinc-300 italic">&ldquo;{unit.situation}&rdquo;</span></p>
                      {unit.learningOutcomes && (
                        <div className="space-y-1 mb-4">
                          {unit.learningOutcomes.map((outcome, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                              <span className="text-emerald-400">✓</span> {outcome}
                            </div>
                          ))}
                        </div>
                      )}
                      <button
                        onClick={() => playTTS(`${unit.situation ?? ''} — ${unit.learningOutcomes?.join(', ') ?? ''}`)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold text-sm hover:bg-violet-600/30 transition-colors"
                      >
                        <Volume2 size={16} /> Nghe lại tình huống
                      </button>
                    </div>
                  )}

                  {/* Complete / Dashboard */}
                  {!isCompleted ? (
                    <button
                      onClick={handleCompleteUnit}
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-black rounded-xl px-6 py-5 flex items-center justify-center gap-3 transition-colors text-lg"
                    >
                      {isSubmitting ? "Đang lưu..." : `🎉 Hoàn thành bài học (+${xpToEarn} XP)`}
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="bg-emerald-600/20 border border-emerald-600/40 rounded-xl p-4 mb-4">
                        <p className="text-emerald-300 font-bold">✅ Bạn đã hoàn thành chương học này!</p>
                      </div>
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/quiz" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-5 py-3 transition-colors text-sm">
                          📝 Quiz từ vựng
                        </Link>
                        <Link href={nextRoute} className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl px-5 py-3 transition-colors text-sm">
                          Tiếp tục <ChevronRight size={16} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ══ SECTION 9: VN → EN Translation (Dedicated Production Section) ══ */}
          {section === 9 && (
            <motion.div key="s9" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🇻🇳➡️🇺🇸</span>
                <h1 className="text-xl sm:text-2xl font-black text-white">Dịch câu</h1>
                <span className="text-xs text-zinc-500 ml-auto">~2 phút</span>
              </div>
              <p className="text-zinc-400 mb-6 text-sm">Đọc câu tiếng Việt và gõ bản dịch tiếng Anh của bạn. Đây là bước <span className="text-teal-400 font-semibold">sản xuất ngôn ngữ</span> — không nhìn gợi ý!</p>

              {unit.practiceTranslate && unit.practiceTranslate.length > 0 ? (
                <div className="space-y-5">
                  {unit.practiceTranslate.map((item, i) => {
                    const userAnswer = translateInputs[item.id] ?? "";
                    // Fuzzy match: normalize punctuation, whitespace, contractions
                    const normalizeTranslation = (s: string) =>
                      s.trim().toLowerCase()
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
                    const isCorrect = normalizeTranslation(userAnswer) === normalizeTranslation(item.answer);
                    return (
                      <div key={item.id} className={`rounded-2xl border p-5 transition-all duration-300 ${
                        translateSubmitted
                          ? isCorrect ? "border-emerald-500/50 bg-emerald-950/30" : "border-red-500/40 bg-red-950/20"
                          : "border-zinc-700/60 bg-white/5"
                      }`}>
                        <div className="flex items-start gap-3 mb-4">
                          <span className="bg-teal-600/20 text-teal-400 rounded-full w-7 h-7 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i + 1}</span>
                          <div className="flex-1">
                            <p className="text-xs text-zinc-500 mb-1">🇻🇳 Tiếng Việt:</p>
                            <p className="text-white font-semibold">{item.prompt_vn}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 mb-2">🇺🇸 Bản dịch tiếng Anh của bạn:</p>
                          <input
                            type="text"
                            value={userAnswer}
                            disabled={translateSubmitted}
                            onChange={e => setTranslateInputs(p => ({ ...p, [item.id]: e.target.value }))}
                            placeholder="Gõ câu tiếng Anh ở đây..."
                            className="w-full bg-zinc-900/60 border border-zinc-700/60 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-teal-500/60 transition-colors disabled:opacity-60"
                            onKeyDown={e => { if (e.key === "Enter" && !translateSubmitted) e.currentTarget.blur(); }}
                          />
                          {translateSubmitted && (
                            <div className="mt-2">
                              {isCorrect
                                ? <p className="text-emerald-400 text-xs font-bold">✓ Chính xác!</p>
                                : <p className="text-red-400 text-xs">✗ Đáp án tham khảo: <span className="font-semibold">{item.answer}</span></p>
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {!translateSubmitted ? (
                    <button
                      disabled={unit.practiceTranslate.some(item => !(translateInputs[item.id] ?? '').trim())}
                      onClick={() => { setTranslateSubmitted(true); }}
                      className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg"
                    >
                      Kiểm tra bản dịch <ChevronRight size={20} />
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-zinc-900/60 rounded-2xl p-4 text-center border border-zinc-700/40">
                        <p className="text-lg font-black text-white">
                          {unit.practiceTranslate.filter(item => (translateInputs[item.id] ?? "").trim().toLowerCase() === item.answer.trim().toLowerCase()).length}/{unit.practiceTranslate.length} câu chính xác
                        </p>
                        <p className="text-zinc-400 text-sm mt-1">Tiếp tục để luyện Shadowing và Luyện nói</p>
                      </div>
                      <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                        Tiếp tục <ChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-zinc-500 text-sm">Unit này chưa có bài dịch câu.</p>
                  <button onClick={goNext} className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-3 transition-colors">
                    Bỏ qua → Tiếp tục
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
