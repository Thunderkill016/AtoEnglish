"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown, ChevronUp } from "lucide-react";
import type { UnitData, PronunciationFocus } from "../UnitTemplate";

// ─── FluencyDrillPanel — Nation's Strand 4 (fast retrieval with KNOWN items) ──
function FluencyDrillPanel({
  items,
  timeLimit = 60,
  onDone,
}: {
  items: Array<{ en: string; vn: string }>;
  timeLimit?: number;
  onDone: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current!);
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleAnswer = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    if (idx >= items.length - 1) {
      setDone(true);
      clearInterval(intervalRef.current!);
    } else {
      setIdx((i) => i + 1);
      setFlipped(false);
    }
  };

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="rounded-2xl bg-gradient-to-br from-amber-950/40 to-orange-950/20 border border-amber-700/30 p-8 text-center">
        <div className="text-5xl mb-3">{pct >= 80 ? "🔥" : pct >= 50 ? "💪" : "📚"}</div>
        <p className="text-white font-black text-2xl mb-1">
          {score}/{items.length}
        </p>
        <p className="text-amber-400 font-semibold mb-1">
          {pct >= 80 ? "Phản xạ tuyệt vời!" : pct >= 50 ? "Đang tiến bộ!" : "Cần luyện thêm!"}
        </p>
        <p className="text-zinc-500 text-xs mb-6">
          Nation (2007): Fluency = tốc độ + độ chính xác với từ đã biết
        </p>
        <button
          onClick={onDone}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl px-8 py-3 transition-colors"
        >
          Tiếp tục →
        </button>
      </div>
    );
  }

  const item = items[idx];
  return (
    <div>
      {/* Timer + progress */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`text-2xl font-black tabular-nums ${
            timeLeft <= 10 ? "text-red-400" : "text-amber-400"
          }`}
        >
          {timeLeft}s
        </div>
        <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-1000"
            style={{ width: `${(timeLeft / timeLimit) * 100}%` }}
          />
        </div>
        <span className="text-xs text-zinc-500 font-bold">
          {idx + 1}/{items.length}
        </span>
      </div>

      {/* Flashcard */}
      <div className="cursor-pointer mb-4" onClick={() => setFlipped((f) => !f)} style={{ perspective: "600px" }}>
        <div
          style={{
            transition: "transform 0.4s",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            position: "relative",
            minHeight: "140px",
          }}
        >
          <div
            className="absolute inset-0 bg-amber-950/30 border-2 border-amber-700/40 rounded-2xl p-6 flex flex-col items-center justify-center FrontCard"
            style={{ backfaceVisibility: "hidden" }}
          >
            <p className="text-zinc-400 text-xs mb-2 uppercase tracking-widest">Tiếng Việt</p>
            <p className="text-white font-black text-2xl text-center">{item.vn}</p>
            <p className="text-amber-600 text-xs mt-3">Nhấn để xem tiếng Anh</p>
          </div>
          <div
            className="absolute inset-0 bg-emerald-950/30 border-2 border-emerald-600/40 rounded-2xl p-6 flex flex-col items-center justify-center BackCard"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="text-zinc-400 text-xs mb-2 uppercase tracking-widest">Tiếng Anh</p>
            <p className="text-emerald-300 font-black text-2xl text-center">{item.en}</p>
          </div>
        </div>
      </div>

      {/* Self-rate buttons */}
      {flipped ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAnswer(false)}
            className="bg-red-900/30 hover:bg-red-900/50 border border-red-700/40 text-red-300 font-bold rounded-xl py-3 text-sm transition-colors"
          >
            ✗ Chưa nhớ
          </button>
          <button
            onClick={() => handleAnswer(true)}
            className="bg-emerald-900/30 hover:bg-emerald-900/50 border border-emerald-600/40 text-emerald-300 font-bold rounded-xl py-3 text-sm transition-colors"
          >
            ✓ Nhớ rồi!
          </button>
        </div>
      ) : (
        <p className="text-center text-zinc-600 text-sm">Nhớ chưa? Nhấn thẻ để kiểm tra →</p>
      )}

      <p className="text-center text-zinc-700 text-xs mt-3">✓ {score} từ nhớ được</p>
    </div>
  );
}

// ─── PronunciationFocusCard ─────────────────────────────────────────────────
function PronunciationFocusCard({
  focus,
  playTTS,
}: {
  focus: PronunciationFocus;
  playTTS?: (text: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-5 bg-teal-950/40 border border-teal-600/30 rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
      >
        <span className="text-2xl">🗣️</span>
        <div className="flex-1 min-w-0">
          <p className="text-teal-300 font-black text-sm tracking-wide">Phát âm trọng tâm</p>
          <p className="text-teal-400/80 font-mono text-xs truncate">{focus.phoneme}</p>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-teal-500 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-teal-500 shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              <p className="text-zinc-300 text-xs leading-relaxed">{focus.description}</p>
              <div className="space-y-2">
                {focus.examples.map((ex, i) => (
                  <div key={i} className="flex items-start gap-2 bg-teal-900/20 rounded-xl p-2.5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-white font-bold text-sm">{ex.word}</span>
                        <span className="text-teal-400 font-mono text-xs">{ex.ipa}</span>
                      </div>
                      <p className="text-zinc-400 text-[11px] leading-relaxed">{ex.tip}</p>
                    </div>
                    {playTTS && (
                      <button
                        onClick={() => playTTS(ex.word)}
                        aria-label={`Nghe: ${ex.word}`}
                        className="p-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600/40 text-teal-400 transition-all shrink-0 active:scale-90"
                      >
                        <Volume2 size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {focus.minimalPairs && focus.minimalPairs.length > 0 && (
                <div>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">Minimal Pairs</p>
                  <div className="flex flex-wrap gap-1.5">
                    {focus.minimalPairs.map(([a, b], i) => (
                      <span key={i} className="text-[11px] bg-zinc-800/60 border border-zinc-700/40 rounded-lg px-2 py-0.5 text-zinc-300">
                        {a} <span className="text-zinc-500">↔</span> {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface FluencySectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  goNext: () => void;
}

const sectionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function FluencySection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  goNext,
}: FluencySectionProps) {
  const [fluencyActive, setFluencyActive] = useState(false);

  const drillItems =
    unit.fluencyDrill?.items ??
    unit.vocab.slice(0, 8).map((v) => ({ en: v.word, vn: v.meaning }));

  const pron = unit.pronunciationFocus;

  return (
    <motion.div
      key="s10"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">⚡</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-amber-200 to-orange-200 bg-clip-text text-transparent">
              {unit.fluencyDrill?.title ?? "Luyện phản xạ"}
            </h1>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-950/60 border border-orange-800/50 px-2 py-0.5 rounded-full">
              Bước {sectionOrderIdx + 1}/{TOTAL_SECTIONS}
            </span>
          </div>
          <p className="text-xs text-zinc-500">~1 phút • Phản xạ tức thì</p>
        </div>
      </div>
      <p className="text-zinc-400 mb-1 text-sm">
        Nhìn tiếng Việt → nhớ ngay tiếng Anh.{" "}
        <span className="text-amber-400 font-semibold">Không dừng suy nghĩ!</span>
      </p>
      <p className="text-[11px] text-zinc-600 mb-5 italic">
        Mục tiêu: phản xạ tức thì với từ đã biết — đây là Fluency Strand (Nation, 2007)
      </p>

      {pron && !fluencyActive && (
        <PronunciationFocusCard focus={pron} />
      )}

      {!fluencyActive ? (
        <div className="rounded-2xl bg-gradient-to-br from-amber-950/40 to-orange-950/20 border border-amber-700/30 p-8 text-center">
          <div className="text-5xl mb-4">🏋️</div>
          <p className="text-white font-bold text-lg mb-2">Sẵn sàng luyện phản xạ?</p>
          <p className="text-zinc-400 text-sm mb-6">
            {drillItems.length} từ • Nhấn thẻ để lật • Chấm điểm bản thân
          </p>
          <button
            onClick={() => {
              setFluencyActive(true);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl px-8 py-3 text-base transition-colors"
          >
            Bắt đầu ⚡
          </button>
        </div>
      ) : (
        <FluencyDrillPanel
          items={drillItems}
          timeLimit={unit.fluencyDrill?.timeLimit ?? 60}
          onDone={goNext}
        />
      )}

      {!fluencyActive && (
        <button
          onClick={goNext}
          className="mt-4 w-full text-zinc-500 hover:text-zinc-300 text-sm transition-colors py-2"
        >
          Bỏ qua →
        </button>
      )}
    </motion.div>
  );
}
