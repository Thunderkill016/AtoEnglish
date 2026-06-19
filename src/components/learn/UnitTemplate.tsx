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
  CheckCircle,
  Lightbulb,
  BookOpen,
  Headphones,
  MessageCircle,
  Trophy,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

import { completeUnit, getUnitCompletionStatus } from "@/app/actions/progress";
import { toast } from "sonner";

// Speech Recognition API setup
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognitionAPI = typeof window !== "undefined"
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  : null;

const SECTION_LABELS = [
  "Khởi động",
  "Từ vựng",
  "Nghe hiểu",
  "Shadowing",
  "Luyện nói",
  "Hoàn thành",
];

export interface VocabItem {
  id: number;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  audio?: string;
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
  type: "multiple-choice" | "cloze";
}

export interface SpeakingData {
  level1Prompt: string; // e.g. "Hello! My name is {input}."
  level1Placeholder: string; // e.g. "Nhập tên của bạn..."
  level2Situation: string; // e.g. "Bạn gặp một người nước ngoài lần đầu. Hãy chào và giới thiệu bản thân."
  level2Hint: string; // e.g. "Hello! My name is [tên bạn]. I'm from Vietnam. Nice to meet you!"
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
  dialogues: Dialogue[];
  listenAndChoose: ListenAndChooseItem[];
  speaking: SpeakingData;
  quiz: QuizQuestion[];
}

interface UnitTemplateProps {
  unit: UnitData;
  nextRoute?: string;
}

export default function UnitTemplate({ unit, nextRoute = "/dashboard" }: UnitTemplateProps) {
  const [section, setSection] = useState(1); // 1–6
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Section 2 — Vocab
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [seenCards, setSeenCards] = useState<Set<number>>(new Set());

  // Section 3 — Listening
  const [selectedDialogue, setSelectedDialogue] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlayingDialogue, setIsPlayingDialogue] = useState(false);
  const [lacAnswers, setLacAnswers] = useState<Record<number, string>>({});
  const [lacSubmitted, setLacSubmitted] = useState(false);

  // Section 4 — Shadowing
  const [shadowLineIdx, setShadowLineIdx] = useState(0);
  const [shadowSpeed, setShadowSpeed] = useState(1.0);
  const [shadowScores, setShadowScores] = useState<Record<number, number>>({});
  const [shadowTranscripts, setShadowTranscripts] = useState<Record<number, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [shadowDone, setShadowDone] = useState(false);

  // Section 5 — Speaking
  const [nameInput, setNameInput] = useState("");
  const [level1Done, setLevel1Done] = useState(false);
  const [level2Transcript, setLevel2Transcript] = useState("");
  const [level2Recording, setLevel2Recording] = useState(false);
  const [level2Done, setLevel2Done] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Section 6 — Quiz
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const VOCAB_LIMIT = Math.min(unit.vocab.length, 8);
  const VOCAB_DISPLAY = unit.vocab.slice(0, VOCAB_LIMIT);
  const DIALOGUES = unit.dialogues;
  const LISTEN_CHOOSE = unit.listenAndChoose;
  const QUIZ_QUESTIONS = unit.quiz.slice(0, 5).filter(q => q.type === "multiple-choice");

  useEffect(() => {
    getUnitCompletionStatus(unit.unitId).then(res => {
      if (res.success && res.completed) setIsCompleted(true);
    });
  }, [unit.unitId]);

  useEffect(() => {
    return () => { window.speechSynthesis?.cancel(); };
  }, []);

  // ── TTS ──────────────────────────────────────────────
  const playTTS = (text: string, rate = 1.0) => {
    if (!window.speechSynthesis) { toast.error("Trình duyệt không hỗ trợ TTS"); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    window.speechSynthesis.speak(u);
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

  // ── Speech Recognition ────────────────────────────────
  const startRecognition = (onResult: (text: string) => void) => {
    if (!SpeechRecognitionAPI) { toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói"); return; }
    const rec = new SpeechRecognitionAPI();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => { onResult(e.results[0][0].transcript); };
    rec.onerror = () => { toast.error("Không nhận được giọng nói. Thử lại."); setIsRecognizing(false); setIsRecording(false); setLevel2Recording(false); };
    rec.onend = () => { setIsRecognizing(false); setIsRecording(false); setLevel2Recording(false); };
    rec.onstart = () => setIsRecognizing(true);
    recognitionRef.current = rec;
    rec.start();
  };

  // ── Accuracy ──────────────────────────────────────────
  const calcScore = (target: string, spoken: string) => {
    const clean = (s: string) => s.toLowerCase().replace(/[^a-z\s]/g, "").trim().split(/\s+/);
    const tw = clean(target); const sw = clean(spoken);
    const matches = tw.filter(w => sw.includes(w)).length;
    return Math.round((matches / Math.max(tw.length, 1)) * 100);
  };

  // ── Section 4: Shadowing ──────────────────────────────
  const handleShadowRecord = () => {
    if (DIALOGUES.length === 0) return;
    const targetLine = DIALOGUES[0].lines[shadowLineIdx];
    setIsRecording(true);
    startRecognition((text) => {
      const score = calcScore(targetLine.text, text);
      setShadowScores(p => ({ ...p, [shadowLineIdx]: score }));
      setShadowTranscripts(p => ({ ...p, [shadowLineIdx]: text }));
      setIsRecording(false);
      if (score >= 70) toast.success(`Tốt lắm! ${score}%`);
      else toast.info(`${score}% — Không sao, thử lại nhé!`);
    });
  };

  const handleShadowNext = () => {
    if (DIALOGUES.length === 0) return;
    const lines = DIALOGUES[0].lines;
    if (shadowLineIdx < lines.length - 1) {
      setShadowLineIdx(p => p + 1);
    } else {
      setShadowDone(true);
    }
  };

  // ── Section 5: Speaking ───────────────────────────────
  const handleLevel2Record = () => {
    setLevel2Recording(true);
    setLevel2Transcript("");
    startRecognition((text) => {
      setLevel2Transcript(text);
      setLevel2Recording(false);
    });
  };

  // ── Section 6: Complete ───────────────────────────────
  const handleCompleteUnit = async () => {
    setIsSubmitting(true);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
    const res = await completeUnit(unit.unitId);
    if (res.success) {
      setIsCompleted(true);
      toast.success(`🎉 Chúc mừng! Bạn nhận được ${unit.xp} XP!`);
    } else {
      toast.error(res.error || "Có lỗi xảy ra");
    }
    setIsSubmitting(false);
  };

  // ── Quiz score ────────────────────────────────────────
  const quizScore = QUIZ_QUESTIONS.filter(q => quizAnswers[q.id] === q.answer).length;

  // ── Progress bar % ────────────────────────────────────
  const progress = Math.round(((section - 1) / 5) * 100);

  // ── Navigation ────────────────────────────────────────
  const goNext = () => {
    window.speechSynthesis?.cancel();
    setSection(s => Math.min(s + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sectionVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const formattedL1Prompt = unit.speaking.level1Prompt.replace("{input}", nameInput || "______");

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-zinc-500">{unit.level}</p>
              <p className="text-sm font-semibold text-white">{unit.title}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500">Phần</p>
              <p className="text-sm font-bold text-emerald-400">{section}/6</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          {/* Step labels */}
          <div className="flex justify-between mt-1.5">
            {SECTION_LABELS.map((label, i) => (
              <span key={i} className={`text-[10px] ${i + 1 === section ? "text-emerald-400 font-bold" : i + 1 < section ? "text-emerald-600" : "text-zinc-600"}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ══ SECTION 1: Warm-up + Cultural Note ══ */}
          {section === 1 && (
            <motion.div key="s1" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <Lightbulb className="text-emerald-400" size={22} />
                <h1 className="text-2xl font-black text-white">Khởi động</h1>
                <span className="text-xs text-zinc-500 ml-auto">~3 phút</span>
              </div>

              <p className="text-zinc-400 mb-6">{unit.description}</p>

              {/* Situation cards */}
              <div className="grid gap-4 mb-8">
                {unit.warmupGreetings.map((g, i) => (
                  <div key={i} className="bg-white/5 border border-zinc-800/60 rounded-2xl p-5 flex items-center gap-5">
                    <div className="text-5xl">{g.emoji}</div>
                    <div className="flex-1">
                      <p className="text-xs text-zinc-500 mb-1">{g.context}</p>
                      <p className="text-lg font-bold text-white">{g.en}</p>
                      <p className="text-sm text-zinc-400">{g.vn}</p>
                    </div>
                    <button
                      onClick={() => playTTS(g.en)}
                      className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 transition-colors"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

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
                <h1 className="text-2xl font-black text-white">Từ vựng & Cụm từ</h1>
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
                        setFlippedCards(p => {
                          const n = new Set(p);
                          if (n.has(i)) n.delete(i); else n.add(i);
                          return n;
                        });
                        setSeenCards(p => { const n = new Set(p); n.add(i); return n; });
                      }}
                      className="cursor-pointer"
                      style={{ perspective: "600px" }}
                    >
                      <div style={{ transition: "transform 0.5s", transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)", position: "relative", minHeight: "120px" }}>
                        {/* Front */}
                        <div className="absolute inset-0 bg-white/5 border border-zinc-700/60 rounded-2xl p-4 flex flex-col justify-between backface-hidden" style={{ backfaceVisibility: "hidden" }}>
                          <p className="text-white font-bold text-base">{v.word}</p>
                          <p className="text-zinc-500 text-xs">{v.phonetic}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-[10px] text-zinc-600">Nhấn để xem nghĩa</p>
                            <button
                              onClick={e => { e.stopPropagation(); playTTS(v.word); }}
                              className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 transition-colors"
                            >
                              <Volume2 size={14} />
                            </button>
                          </div>
                        </div>
                        {/* Back */}
                        <div className="absolute inset-0 bg-emerald-950/40 border border-emerald-700/40 rounded-2xl p-4 flex flex-col justify-between" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                          <p className="text-emerald-300 font-bold text-sm">{v.meaning}</p>
                          <p className="text-zinc-400 text-xs italic">&ldquo;{v.example}&rdquo;</p>
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

          {/* ══ SECTION 3: Listening ══ */}
          {section === 3 && (
            <motion.div key="s3" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <Headphones className="text-emerald-400" size={22} />
                <h1 className="text-2xl font-black text-white">Nghe hiểu</h1>
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

              {/* Dialogue info */}
              {DIALOGUES.length > 0 && (
                <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-5 mb-4">
                  <p className="text-xs text-zinc-500 mb-2">{DIALOGUES[selectedDialogue].desc}</p>

                  {/* Play button */}
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

                  {/* Transcript */}
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

              {/* Listen & Choose Quiz */}
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
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs hover:bg-emerald-600/30 transition-colors"
                          >
                            <Volume2 size={12} /> Nghe
                          </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
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
                      onClick={() => setLacSubmitted(true)}
                      disabled={Object.keys(lacAnswers).length < LISTEN_CHOOSE.length}
                      className="mt-5 w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl py-3 transition-colors"
                    >
                      Kiểm tra đáp án
                    </button>
                  ) : (
                    <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-700/40 rounded-xl text-center">
                      <p className="text-emerald-300 font-bold text-lg">
                        {LISTEN_CHOOSE.filter((item, i) => lacAnswers[i] === item.answer).length}/{LISTEN_CHOOSE.length} đúng 🎯
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

          {/* ══ SECTION 4: Shadowing ══ */}
          {section === 4 && (
            <motion.div key="s4" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <MessageCircle className="text-emerald-400" size={22} />
                <h1 className="text-2xl font-black text-white">Shadowing</h1>
                <span className="text-xs text-zinc-500 ml-auto">~5 phút</span>
              </div>

              {DIALOGUES.length > 0 && !shadowDone ? (
                <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-6">
                  {/* Progress bar */}
                  <div className="flex justify-between text-xs text-zinc-500 mb-2 font-bold">
                    <span>Tiến độ dòng hội thoại</span>
                    <span>{shadowLineIdx + 1}/{DIALOGUES[0].lines.length}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-6">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${((shadowLineIdx) / DIALOGUES[0].lines.length) * 100}%` }}
                    />
                  </div>

                  {/* Character card */}
                  <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-5 mb-6 text-center relative overflow-hidden">
                    <span className="absolute top-3 left-3 text-[10px] font-bold text-zinc-600 bg-zinc-800 px-2 py-0.5 rounded uppercase">
                      {DIALOGUES[0].lines[shadowLineIdx].speaker}
                    </span>
                    <p className="text-zinc-500 text-[10px] mb-2 uppercase tracking-widest font-black">Hãy nghe rồi nói lại</p>
                    <p className="text-white text-xl font-bold mb-1 leading-snug">{DIALOGUES[0].lines[shadowLineIdx].text}</p>
                    <p className="text-zinc-400 text-sm">{DIALOGUES[0].lines[shadowLineIdx].translation}</p>
                  </div>

                  {/* Play & Record actions */}
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <button
                      onClick={() => playTTS(DIALOGUES[0].lines[shadowLineIdx].text, shadowSpeed)}
                      className="w-14 h-14 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors"
                      title="Nghe mẫu"
                    >
                      <Volume2 size={24} />
                    </button>

                    <button
                      onClick={isRecording ? () => { recognitionRef.current?.stop(); setIsRecording(false); } : handleShadowRecord}
                      disabled={isRecognizing && !isRecording}
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

                  {/* Feedbacks */}
                  {shadowTranscripts[shadowLineIdx] && (
                    <div className="border border-zinc-800/80 bg-zinc-900/30 rounded-xl p-4 mb-6 text-center">
                      <p className="text-[10px] text-zinc-500 mb-1 font-bold">BẠN VỪA NÓI:</p>
                      <p className="text-white text-sm font-semibold mb-2">&ldquo;{shadowTranscripts[shadowLineIdx]}&rdquo;</p>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/10">
                        Độ chính xác: {shadowScores[shadowLineIdx]}%
                      </div>
                    </div>
                  )}

                  {/* Next / Finish */}
                  {shadowScores[shadowLineIdx] !== undefined && (
                    <button
                      onClick={handleShadowNext}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors border border-zinc-750"
                    >
                      {shadowLineIdx < DIALOGUES[0].lines.length - 1 ? "Dòng tiếp theo" : "Hoàn thành phần Shadowing"}
                      <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center mb-6 bg-white/5 border border-zinc-800/60 rounded-2xl p-8">
                  <div className="text-4xl mb-3">🎉</div>
                  <p className="text-emerald-400 font-bold text-lg mb-1">Hoàn thành Shadowing!</p>
                  <p className="text-zinc-400 text-sm mb-6">
                    Điểm trung bình: {Math.round(Object.values(shadowScores).reduce((a, b) => a + b, 0) / Math.max(Object.values(shadowScores).length, 1))}%
                  </p>
                  <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                    Tiếp tục luyện nói <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ══ SECTION 5: Speaking Output ══ */}
          {section === 5 && (
            <motion.div key="s5" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <Mic className="text-emerald-400" size={22} />
                <h1 className="text-2xl font-black text-white">Luyện nói</h1>
                <span className="text-xs text-zinc-500 ml-auto">~5 phút</span>
              </div>

              {/* Level 1 */}
              <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-6 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 text-xs font-bold bg-emerald-600/20 text-emerald-400 rounded-full">Cấp độ 1</span>
                  <p className="text-white font-semibold">Nói theo khung</p>
                  {level1Done && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
                </div>

                <div className="bg-zinc-900/60 rounded-xl p-4 mb-4 text-center">
                  <p className="text-zinc-400 text-sm mb-1">Hãy nói to câu sau:</p>
                  <p className="text-white text-xl font-bold">
                    {formattedL1Prompt}
                  </p>
                </div>

                <input
                  type="text"
                  placeholder={unit.speaking.level1Placeholder}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 mb-3 focus:outline-none focus:border-emerald-500 transition-colors"
                />

                {nameInput && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => playTTS(formattedL1Prompt)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold text-sm transition-colors"
                    >
                      <Volume2 size={16} /> Nghe mẫu
                    </button>
                    <button
                      onClick={() => setLevel1Done(true)}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
                    >
                      <CheckCircle size={16} /> Xong!
                    </button>
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
                  <div className="bg-zinc-900/60 rounded-xl p-3 mb-4">
                    <p className="text-xs text-zinc-500 mb-1">Bạn vừa nói:</p>
                    <p className="text-white text-sm">&ldquo;{level2Transcript}&rdquo;</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={level2Recording ? () => { recognitionRef.current?.stop(); setLevel2Recording(false); } : handleLevel2Record}
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

                {!SpeechRecognitionAPI && (
                  <p className="text-yellow-400 text-xs mt-3 text-center">⚠️ Trình duyệt không hỗ trợ ghi âm. Thử Chrome hoặc Edge.</p>
                )}
                <p className="text-zinc-600 text-xs mt-2 text-center">Không sao đâu, cứ thử — mình ở đây để luyện cùng bạn! 💪</p>
              </div>

              {level1Done && (
                <button onClick={goNext} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-6 py-4 flex items-center justify-center gap-2 transition-colors text-lg">
                  Xem kết quả <ChevronRight size={20} />
                </button>
              )}
            </motion.div>
          )}

          {/* ══ SECTION 6: Review + Badge ══ */}
          {section === 6 && (
            <motion.div key="s6" variants={sectionVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.3 }}>
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="text-emerald-400" size={22} />
                <h1 className="text-2xl font-black text-white">Ôn tập & Kết quả</h1>
                <span className="text-xs text-zinc-500 ml-auto">~3 phút</span>
              </div>

              {/* Quiz */}
              {!quizSubmitted ? (
                <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-6 mb-6">
                  <p className="text-sm font-bold text-white mb-5">🧠 Quiz nhanh — {QUIZ_QUESTIONS.length} câu</p>
                  <div className="space-y-6">
                    {QUIZ_QUESTIONS.map((q, qi) => (
                      <div key={q.id}>
                        <p className="text-white text-sm mb-3"><span className="text-zinc-500 mr-2">Câu {qi + 1}.</span>{q.question}</p>
                        <div className="grid grid-cols-2 gap-2">
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => setQuizAnswers(p => ({ ...p, [q.id]: opt }))}
                              className={`px-3 py-2 rounded-xl text-sm font-medium border transition-colors text-left ${quizAnswers[q.id] === opt ? "bg-emerald-600/30 border-emerald-500 text-emerald-300" : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-emerald-600/50"}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
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
                      {quizScore >= 4 ? "🏆" : quizScore >= 3 ? "🎯" : "💪"}
                    </div>
                    <p className="text-emerald-300 font-black text-2xl mb-1">{quizScore}/{QUIZ_QUESTIONS.length} đúng</p>
                    <p className="text-zinc-400 text-sm">
                      {quizScore >= 4 ? "Xuất sắc! Bạn đã nắm vững bài học!" : quizScore >= 3 ? "Khá tốt! Tiếp tục ôn tập nhé!" : "Cần luyện thêm một chút — bạn làm được!"}
                    </p>
                  </div>

                  {/* Progress Summary */}
                  <div className="bg-white/5 border border-zinc-800/60 rounded-2xl p-5">
                    <p className="text-sm font-bold text-white mb-3">📊 Kết quả học tập</p>
                    <div className="space-y-2">
                      {[
                        { label: "Từ vựng đã học", value: `${seenCards.size}/${VOCAB_LIMIT} từ`, icon: "📚", done: seenCards.size >= VOCAB_LIMIT },
                        { label: "Shadowing", value: `${DIALOGUES.length > 0 ? Object.keys(shadowScores).length : 0}/${DIALOGUES.length > 0 ? DIALOGUES[0].lines.length : 0} câu`, icon: "🎤", done: shadowDone || DIALOGUES.length === 0 },
                        { label: "Quiz", value: `${quizScore}/${QUIZ_QUESTIONS.length} đúng`, icon: "🧠", done: quizScore >= 3 },
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

                  {/* Badge */}
                  <div className="bg-gradient-to-br from-emerald-950/60 to-teal-950/60 border border-emerald-700/40 rounded-2xl p-8 text-center">
                    <div className="text-7xl mb-3 animate-bounce">{unit.badgeEmoji}</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(3)].map((_, i) => <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />)}
                    </div>
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

                  {/* Complete / Dashboard */}
                  {!isCompleted ? (
                    <button
                      onClick={handleCompleteUnit}
                      disabled={isSubmitting}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-black rounded-xl px-6 py-5 flex items-center justify-center gap-3 transition-colors text-lg"
                    >
                      {isSubmitting ? "Đang lưu..." : `🎉 Hoàn thành bài học (+${unit.xp} XP)`}
                    </button>
                  ) : (
                    <div className="text-center">
                      <div className="bg-emerald-600/20 border border-emerald-600/40 rounded-xl p-4 mb-4">
                        <p className="text-emerald-300 font-bold">✅ Bạn đã hoàn thành chương học này!</p>
                      </div>
                      <Link href={nextRoute} className="inline-flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white font-bold rounded-xl px-6 py-3 transition-colors">
                        Về Dashboard <ChevronRight size={18} />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
