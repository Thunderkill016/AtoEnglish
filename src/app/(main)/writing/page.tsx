"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Zap,
  RotateCcw,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { analyzeWriting, type WritingFeedback } from "@/app/actions/writing";

// ─── Level selector ────────────────────────────────────────────────────────────
const LEVELS = [
  { value: "A1" as const, label: "A1 — Cơ bản", desc: "Câu đơn giản" },
  { value: "A2" as const, label: "A2 — Sơ cấp", desc: "Câu phức đơn giản" },
  { value: "B1" as const, label: "B1 — Trung cấp", desc: "Câu phức, từ vựng rộng hơn" },
];

// ─── Prompt suggestions by level ───────────────────────────────────────────────
const PROMPTS: Record<string, string[]> = {
  A1: [
    "My name is Lan. I am student. I like reading book.",
    "She go to school every day. She have many friends.",
    "I am from Vietnam. I lives in Hanoi.",
  ],
  A2: [
    "Yesterday I go to the market and buyed vegetables.",
    "He can speaks three language fluently.",
    "I am agree with you. This idea is very good.",
  ],
  B1: [
    "I have been working here since three years.",
    "Despite of the rain, we decided to go for a walk.",
    "She is looking forward to meet you next week.",
  ],
};

const ERROR_TYPE_LABEL: Record<string, { label: string; color: string }> = {
  grammar:    { label: "Ngữ pháp",   color: "text-red-400 bg-red-500/10 border-red-500/30" },
  vocabulary: { label: "Từ vựng",    color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
  spelling:   { label: "Chính tả",   color: "text-orange-400 bg-orange-500/10 border-orange-500/30" },
  word_order: { label: "Trật tự từ", color: "text-purple-400 bg-purple-500/10 border-purple-500/30" },
};

// ─── Score ring ────────────────────────────────────────────────────────────────
function ScoreRing({ score }: { score: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 85 ? "#10b981" : score >= 65 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 84 84">
        <circle cx="42" cy="42" r={r} strokeWidth="6" stroke="rgba(255,255,255,0.08)" fill="none" />
        <motion.circle
          cx="42" cy="42" r={r} strokeWidth="6"
          stroke={color} fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-black text-white">{score}</p>
        <p className="text-[10px] text-zinc-500 font-bold">/ 100</p>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function WriteImprovePage() {
  const [text, setText] = useState("");
  const [level, setLevel] = useState<"A1" | "A2" | "B1">("A1");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleAnalyze = () => {
    if (!text.trim() || isPending) return;
    setError(null);
    setFeedback(null);
    startTransition(async () => {
      const res = await analyzeWriting({ text: text.trim(), level });
      if (res.success) {
        setFeedback(res.feedback);
      } else {
        setError(res.error);
      }
    });
  };

  const handleReset = () => {
    setText("");
    setFeedback(null);
    setError(null);
  };

  const handlePrompt = (p: string) => {
    setText(p);
    setFeedback(null);
    setError(null);
  };

  return (
    <div className="relative mx-auto max-w-2xl px-4 py-6 sm:py-8 sm:px-6 space-y-6 min-h-screen pb-24">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-96 h-96 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          AI Writing Coach
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Viết &amp; Cải thiện
        </h1>
        <p className="text-zinc-400 text-sm">
          Nhập câu tiếng Anh — AI sẽ sửa lỗi, giải thích bằng tiếng Việt, và gợi ý cách viết hay hơn.
        </p>
      </motion.div>

      {/* Level selector */}
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            onClick={() => { setLevel(l.value); setFeedback(null); }}
            className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              level === l.value
                ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-300"
                : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/25"
            }`}
          >
            <span className="block">{l.label}</span>
            <span className={`block font-normal ${level === l.value ? "text-emerald-400/70" : "text-zinc-600"}`}>
              {l.desc}
            </span>
          </button>
        ))}
      </div>

      {/* Prompt suggestions */}
      <div className="space-y-2">
        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" /> Câu mẫu để luyện tập
        </p>
        <div className="space-y-1.5">
          {(PROMPTS[level] ?? []).map((p, i) => (
            <button
              key={i}
              onClick={() => handlePrompt(p)}
              className="w-full text-left px-3 py-2 rounded-xl bg-white/4 border border-white/8 text-zinc-300 text-sm hover:bg-white/8 hover:border-white/15 transition-colors flex items-center gap-2 group"
            >
              <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0" />
              <span className="italic">&ldquo;{p}&rdquo;</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setFeedback(null); }}
          placeholder="Nhập câu hoặc đoạn văn tiếng Anh của bạn tại đây..."
          rows={4}
          maxLength={500}
          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 transition-colors text-sm resize-none"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-600">{text.length}/500 ký tự</span>
          <div className="flex gap-2">
            {(feedback || text) && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white text-xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Làm lại
              </button>
            )}
            <button
              onClick={handleAnalyze}
              disabled={!text.trim() || isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold text-sm transition-colors"
            >
              {isPending ? (
                <><Zap className="w-4 h-4 animate-pulse" /> Đang phân tích...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Phân tích</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Score + encouragement */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-5">
              <ScoreRing score={feedback.score} />
              <div className="flex-1">
                <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-1">Độ chính xác</p>
                <p className="text-white font-semibold text-sm leading-relaxed">
                  {feedback.encouragement_vn}
                </p>
              </div>
            </div>

            {/* Corrected */}
            <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Câu đã sửa</p>
              </div>
              <p className="text-white text-sm leading-relaxed">{feedback.corrected}</p>
            </div>

            {/* Errors */}
            {feedback.errors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Lỗi cần sửa ({feedback.errors.length})
                </p>
                {feedback.errors.map((err, i) => {
                  const typeInfo = ERROR_TYPE_LABEL[err.type] ?? ERROR_TYPE_LABEL.grammar;
                  return (
                    <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                        <span className="text-red-400 text-sm line-through opacity-70">{err.original}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                        <span className="text-emerald-400 text-sm font-semibold">{err.correction}</span>
                      </div>
                      <p className="text-zinc-400 text-xs">{err.explanation_vn}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No errors */}
            {feedback.errors.length === 0 && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <p className="text-emerald-300 text-sm font-medium">Không có lỗi ngữ pháp! 🎉</p>
              </div>
            )}

            {/* Improved version */}
            <div className="bg-blue-950/30 border border-blue-500/20 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Cách viết hay hơn</p>
              </div>
              <p className="text-white text-sm leading-relaxed italic">&ldquo;{feedback.improved}&rdquo;</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
