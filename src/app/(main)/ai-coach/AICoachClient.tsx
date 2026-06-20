"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Send,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  BookOpen,
  Lightbulb,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { analyzeWriting, type AICoachResult, type AICoachError } from "@/app/actions/ai-coach";
import { toast } from "sonner";

const EXAMPLE_PROMPTS = [
  "My name is Minh. I is from Vietnam. I have 25 year old.",
  "Yesterday I go to school and learn many things. The teacher are very kind.",
  "I like eat rice every day. My mother cook very delicious food.",
  "She don't understand English very well but she try hard every days.",
];

const ERROR_TYPE_LABELS: Record<AICoachError["error_type"], { label: string; color: string }> = {
  grammar: { label: "Ngữ pháp", color: "text-red-400 bg-red-950/30 border-red-800/40" },
  vocabulary: { label: "Từ vựng", color: "text-amber-400 bg-amber-950/30 border-amber-800/40" },
  spelling: { label: "Chính tả", color: "text-orange-400 bg-orange-950/30 border-orange-800/40" },
  punctuation: { label: "Dấu câu", color: "text-blue-400 bg-blue-950/30 border-blue-800/40" },
  word_order: { label: "Thứ tự từ", color: "text-violet-400 bg-violet-950/30 border-violet-800/40" },
};

function ScoreRing({ score }: { score: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" width="96" height="96">
        <circle cx="48" cy="48" r={r} fill="none" stroke="#27272a" strokeWidth="8" />
        <motion.circle
          cx="48" cy="48" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct) }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="text-center">
        <motion.p
          className="text-2xl font-black"
          style={{ color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.p>
        <p className="text-[10px] text-zinc-500 font-bold">/ 100</p>
      </div>
    </div>
  );
}

function ErrorCard({ error, idx }: { error: AICoachError; idx: number }) {
  const [open, setOpen] = useState(false);
  const tag = ERROR_TYPE_LABELS[error.error_type] ?? ERROR_TYPE_LABELS.grammar;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      className={`rounded-2xl border p-4 ${tag.color}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${tag.color} mr-2`}>
            {tag.label}
          </span>
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="line-through text-zinc-500 text-sm">{error.original}</span>
            <span className="text-zinc-400">→</span>
            <span className="font-bold text-white text-sm">{error.fixed}</span>
          </div>
        </div>
        <button
          onClick={() => setOpen(v => !v)}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
          aria-label="Xem giải thích"
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
              <p className="text-sm text-zinc-300">{error.explanation_vn}</p>
              <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3">
                <Lightbulb size={14} className="text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200">{error.rule_vn}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AICoachClient() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AICoachResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const charCount = text.length;
  const MAX_CHARS = 800;

  const handleSubmit = () => {
    if (!text.trim() || charCount > MAX_CHARS) return;
    startTransition(async () => {
      const res = await analyzeWriting(text.trim());
      if (!res.success) {
        toast.error(res.error);
        return;
      }
      setResult(res);
    });
  };

  const handleReset = () => {
    setResult(null);
    setText("");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-600 to-teal-600 flex items-center justify-center shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">AI Writing Coach</h1>
            <p className="text-xs text-zinc-500">Viết tiếng Anh → AI sửa lỗi & giải thích bằng tiếng Việt</p>
          </div>
        </div>

        {/* Value prop banner */}
        <div className="rounded-2xl bg-gradient-to-r from-violet-950/50 to-teal-950/50 border border-violet-700/30 p-4 flex gap-4 flex-wrap">
          {[
            { icon: <CheckCircle size={14} />, text: "Sửa lỗi ngữ pháp tức thì" },
            { icon: <BookOpen size={14} />, text: "Giải thích bằng tiếng Việt" },
            { icon: <TrendingUp size={14} />, text: "Theo dõi tiến bộ theo thời gian" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs text-teal-300">
              <span className="text-teal-400">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div key="input" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Input area */}
            <div className="mb-4">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 block">
                Viết câu / đoạn văn bằng tiếng Anh
              </label>
              <div className="relative">
                <textarea
                  id="ai-coach-input"
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Gõ tiếng Anh vào đây... Ví dụ: My name is Minh. I have 25 year old."
                  rows={5}
                  maxLength={MAX_CHARS}
                  className="w-full bg-white/5 border border-zinc-700/60 rounded-2xl px-4 py-3.5 text-white text-sm resize-none placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors leading-relaxed"
                  onKeyDown={e => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
                  }}
                />
                <span className={`absolute bottom-3 right-3 text-[10px] ${charCount > MAX_CHARS * 0.9 ? "text-red-400" : "text-zinc-600"}`}>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            </div>

            {/* Example prompts */}
            <div className="mb-6">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Thử với ví dụ:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => setText(ex)}
                    className="text-xs px-3 py-1.5 rounded-xl bg-zinc-800/60 border border-zinc-700/40 text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors text-left"
                  >
                    {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
                  </button>
                ))}
              </div>
            </div>

            <button
              id="ai-coach-submit"
              onClick={handleSubmit}
              disabled={isPending || !text.trim() || charCount > MAX_CHARS}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-teal-600 text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:from-violet-500 hover:to-teal-500 transition-all duration-200"
            >
              {isPending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles size={16} />
                  </motion.div>
                  AI đang phân tích...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Phân tích với AI
                  <span className="text-white/60 text-xs font-normal">Ctrl+Enter</span>
                </>
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Score + summary */}
            <div className="mb-6 bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-5">
              <div className="flex items-center gap-5">
                <ScoreRing score={result.score} />
                <div className="flex-1">
                  <p className={`font-black text-lg ${result.score >= 80 ? "text-emerald-400" : result.score >= 60 ? "text-amber-400" : "text-red-400"}`}>
                    {result.score >= 80 ? "Xuất sắc! 🎉" : result.score >= 60 ? "Khá tốt! 💪" : "Cần cải thiện 📚"}
                  </p>
                  <p className="text-zinc-300 text-sm mt-1">{result.encouragement_vn}</p>
                </div>
              </div>
            </div>

            {/* Corrected text */}
            {result.hasErrors && (
              <div className="mb-5">
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Văn bản đã sửa</p>
                <div className="bg-emerald-950/20 border border-emerald-800/40 rounded-2xl p-4">
                  <p className="text-emerald-200 text-sm leading-relaxed">{result.corrected}</p>
                </div>
              </div>
            )}

            {!result.hasErrors && (
              <div className="mb-5 bg-emerald-950/30 border border-emerald-700/40 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="text-emerald-400 shrink-0" size={22} />
                <p className="text-emerald-300 font-semibold text-sm">Không có lỗi! Câu của bạn hoàn toàn chính xác.</p>
              </div>
            )}

            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="mb-5 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-400" />
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    {result.errors.length} lỗi cần chú ý
                  </p>
                </div>
                {result.errors.map((err, i) => (
                  <ErrorCard key={i} error={err} idx={i} />
                ))}
              </div>
            )}

            {/* Next focus */}
            <div className="mb-6 bg-teal-950/30 border border-teal-800/40 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <TrendingUp size={14} className="text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">Tiếp theo</p>
                  <p className="text-zinc-300 text-sm">{result.next_focus_vn}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/5 border border-zinc-700/40 text-zinc-300 font-bold text-sm hover:bg-white/10 transition-colors"
              >
                <RefreshCw size={16} />
                Viết lại
              </button>
              <button
                onClick={() => {
                  setText(result.corrected);
                  setResult(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600/20 to-teal-600/20 border border-violet-600/30 text-violet-300 font-bold text-sm hover:from-violet-600/30 hover:to-teal-600/30 transition-colors"
              >
                <Sparkles size={16} />
                Sửa &amp; kiểm tra lại
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
