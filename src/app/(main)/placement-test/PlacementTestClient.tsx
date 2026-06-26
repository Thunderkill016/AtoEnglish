"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
} from "lucide-react";
import {
  PLACEMENT_QUESTIONS,
  calculateResult,
  buildSelfSelectResult,
  TOTAL_QUESTIONS,
  READING_COUNT,
  VOCAB_COUNT,
  LANG_USE_COUNT,
  type CEFRLevel,
} from "@/lib/data/placement-test";
import { savePlacementResult, setPlacementLevel } from "@/app/actions/placement";
import { PLACEMENT_LEVEL_OPTIONS } from "@/lib/placement/starting-unit";
import { SecondaryPageShell, MinimalButton, ListSection } from "@/components/design-system";


type Stage = "pick" | "test" | "saving" | "results";

const CEFR_COLORS: Record<string, string> = {
  A0: "#14b8a6",
  A1: "#3b82f6",
  A2: "#8b5cf6",
  B1: "#f59e0b",
  B2: "#10b981",
};

const SKILL_LABEL: Record<string, string> = {
  "language-use": "Language Use",
  vocabulary: "Vocabulary",
  reading: "Reading",
};

const SKILL_ICON: Record<string, string> = {
  "language-use": "💬",
  vocabulary: "📝",
  reading: "📖",
};

export default function PlacementTestClient() {
  const [stage, setStage] = useState<Stage>("pick");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateResult> | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [learnPath, setLearnPath] = useState<string | null>(null);
  const [isSelfSelect, setIsSelfSelect] = useState(false);

  const currentQ = PLACEMENT_QUESTIONS[currentIdx]!;
  const isLast = currentIdx === TOTAL_QUESTIONS - 1;
  const progressPct = Math.round((currentIdx / TOTAL_QUESTIONS) * 100);

  const handleAnswer = useCallback((optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
  }, [selected]);

  const handleNext = useCallback(async () => {
    if (selected === null) return;

    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      setStage("saving");
      setIsSelfSelect(false);
      const res = calculateResult(newAnswers);
      setResult(res);
      const saveRes = await savePlacementResult(res.cefrLevel, res.totalScore);
      if (saveRes.success) {
        setLearnPath(saveRes.learnPath);
      } else {
        setSaveError(saveRes.error ?? null);
      }
      setStage("results");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  }, [selected, answers, currentQ.id, isLast]);

  const handleSelfSelect = useCallback(async (level: CEFRLevel) => {
    setStage("saving");
    setIsSelfSelect(true);
    setSaveError(null);
    const res = buildSelfSelectResult(level);
    setResult(res);
    const saveRes = await setPlacementLevel(level);
    if (saveRes.success) {
      setLearnPath(saveRes.learnPath);
    } else {
      setSaveError(saveRes.error ?? null);
    }
    setStage("results");
  }, []);

  // ── PICK LEVEL OR TAKE TEST ──────────────────────────────────────────────────
  if (stage === "pick") {
    return (
      <SecondaryPageShell
        title="Chọn điểm bắt đầu"
        subtitle="CEFR Placement · Không cần học lại từ đầu"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-5 pb-16"
        >
          <ListSection title="Tôi biết trình độ của mình">
            {PLACEMENT_LEVEL_OPTIONS.map((opt) => (
              <button
                key={opt.level}
                type="button"
                onClick={() => handleSelfSelect(opt.level)}
                className="w-full text-left rounded-xl border border-border/60 bg-card p-3.5 hover:bg-muted/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{opt.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-black text-primary">{opt.level}</span>
                      <span className="text-sm font-bold text-foreground">{opt.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{opt.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Bắt đầu: {opt.startLabel}</p>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground shrink-0" />
                </div>
              </button>
            ))}
          </ListSection>

          <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hoặc làm bài test đầy đủ
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {TOTAL_QUESTIONS} câu Reading · Vocabulary · Language Use · ~15–25 phút
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Reading", count: READING_COUNT },
                { label: "Vocab", count: VOCAB_COUNT },
                { label: "Grammar", count: LANG_USE_COUNT },
              ].map((s) => (
                <div key={s.label} className="rounded-lg bg-muted/50 p-2 text-center">
                  <div className="text-sm font-black text-foreground">{s.count}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <MinimalButton
            fullWidth
            onClick={() => {
              setIsSelfSelect(false);
              setStage("test");
            }}
          >
            Làm bài test đầy đủ <ArrowRight size={18} />
          </MinimalButton>
        </motion.div>
      </SecondaryPageShell>
    );
  }

  // ── SAVING SCREEN ───────────────────────────────────────────────────────────
  if (stage === "saving") {
    return (
      <div style={{ minHeight: "100dvh", background: "#09090b", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{ width: 40, height: 40, border: "3px solid #27272a", borderTop: "3px solid #10b981", borderRadius: "50%" }}
        />
      </div>
    );
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────────────────────
  if (stage === "results" && result) {
    const color = CEFR_COLORS[result.cefrLevel] ?? "#10b981";

    return (
      <div style={{ minHeight: "100dvh", background: "#09090b", paddingBottom: 100 }}>
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 0" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Level badge hero */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: `${color}20`, border: `3px solid ${color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 16px", fontSize: 32, fontWeight: 900,
                  color, fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {result.cefrLevel}
              </motion.div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fafafa", marginBottom: 6 }}>
                {result.levelLabel}
              </h1>
              <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.6, maxWidth: 340, margin: "0 auto" }}>
                {result.levelDescription}
              </p>
            </div>

            {!isSelfSelect && (
              <div style={{ background: "#111118", border: `1px solid ${color}40`, borderRadius: 14, padding: "16px", marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: "#52525b", fontWeight: 700 }}>TỔNG ĐIỂM</span>
                  <span style={{ fontSize: 18, fontWeight: 900, color }}>
                    {result.totalScore}/{TOTAL_QUESTIONS}
                  </span>
                </div>
                <div style={{ height: 8, background: "#27272a", borderRadius: 99, overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.totalScore / TOTAL_QUESTIONS) * 100}%` }}
                    transition={{ duration: 1, delay: 0.4 }}
                    style={{ height: "100%", background: color, borderRadius: 99 }}
                  />
                </div>
              </div>
            )}

            {isSelfSelect && (
              <div style={{ background: "#111118", border: `1px solid ${color}40`, borderRadius: 14, padding: "14px", marginBottom: 14, fontSize: 12, color: "#a1a1aa", lineHeight: 1.6 }}>
                ✅ Lộ trình đã mở từ trình độ <strong style={{ color }}>{result.cefrLevel}</strong> — các bài trước đó có thể ôn lại tuỳ chọn, không bắt buộc.
              </div>
            )}

            {/* Skill breakdown */}
            {!isSelfSelect && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { key: "reading", score: result.readingScore, total: READING_COUNT },
                { key: "vocabulary", score: result.vocabularyScore, total: VOCAB_COUNT },
                { key: "language-use", score: result.languageUseScore, total: LANG_USE_COUNT },
              ].map((s) => (
                <div key={s.key} style={{ background: "#111118", border: "1px solid #27272a", borderRadius: 12, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{SKILL_ICON[s.key]}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fafafa" }}>{s.score}/{s.total}</div>
                  <div style={{ fontSize: 10, color: "#52525b", fontWeight: 600 }}>{SKILL_LABEL[s.key]}</div>
                  <div style={{ marginTop: 6, height: 3, background: "#27272a", borderRadius: 99, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.score / s.total) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      style={{ height: "100%", background: color, borderRadius: 99 }}
                    />
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Next steps */}
            <div style={{ background: "#111118", border: "1px solid #27272a", borderRadius: 14, padding: "16px", marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "#52525b", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                🎯 Bước tiếp theo
              </div>
              {result.nextSteps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: `${color}20`, border: `1px solid ${color}50`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{step}</span>
                </div>
              ))}
            </div>

            {/* Review wrong answers */}
            {!isSelfSelect && (
            <div style={{ background: "#111118", border: "1px solid #27272a", borderRadius: 14, padding: "16px", marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: "#52525b", fontWeight: 700, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                📋 Review đáp án
              </div>
              {PLACEMENT_QUESTIONS.map((q) => {
                const userAns = answers[q.id];
                const correct = userAns === q.correctAnswer;
                return (
                  <div key={q.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1c1c24" }}>
                    <div style={{ flexShrink: 0, marginTop: 1 }}>
                      {correct
                        ? <CheckCircle2 size={14} color="#10b981" />
                        : <XCircle size={14} color="#ef4444" />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, color: correct ? "#10b981" : "#ef4444", fontWeight: 700, marginBottom: 2 }}>
                        {`Q${q.id}`} · {SKILL_LABEL[q.skill]} · {q.level}
                      </div>
                      <div style={{ fontSize: 11, color: "#a1a1aa", lineHeight: 1.4, marginBottom: !correct ? 4 : 0 }}>
                        {q.question.length > 60 ? q.question.slice(0, 60) + "…" : q.question}
                      </div>
                      {!correct && (
                        <div style={{ fontSize: 11, color: "#71717a", lineHeight: 1.4 }}>
                          ✓ <span style={{ color: "#10b981" }}>{q.options[q.correctAnswer]}</span>
                          {" · "}{q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            {saveError && (
              <div style={{ background: "#ef444410", border: "1px solid #ef444430", borderRadius: 10, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: "#ef4444" }}>
                ⚠️ {saveError} — Level đã tính xong nhưng chưa lưu được DB.
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {learnPath && (
                <Link
                  href={learnPath}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: "linear-gradient(135deg, #10b981, #14b8a6)",
                    color: "#fff", textDecoration: "none", borderRadius: 12, padding: "14px",
                    fontSize: 14, fontWeight: 800,
                  }}
                >
                  <ArrowRight size={16} /> Bắt đầu học ngay
                </Link>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <Link
                  href="/learn"
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: learnPath ? "#111118" : "linear-gradient(135deg, #10b981, #14b8a6)",
                    border: learnPath ? "1px solid #27272a" : "none",
                    color: learnPath ? "#a1a1aa" : "#fff",
                    textDecoration: "none", borderRadius: 12, padding: "14px",
                    fontSize: 13, fontWeight: learnPath ? 700 : 800,
                  }}
                >
                  <Trophy size={16} /> {learnPath ? "Xem lộ trình học" : "Về Bài học"}
                </Link>
                <Link
                  href="/dashboard"
                  style={{
                    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    background: "#111118", border: "1px solid #27272a",
                    color: "#a1a1aa", textDecoration: "none", borderRadius: 12, padding: "14px",
                    fontSize: 13, fontWeight: 700,
                  }}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── TEST SCREEN ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100dvh", background: "#09090b", paddingBottom: 100 }}>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px 0" }}>

        {/* Progress header */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>{SKILL_ICON[currentQ.skill]}</span>
              <span style={{ fontSize: 11, color: "#71717a", fontWeight: 700 }}>
                {SKILL_LABEL[currentQ.skill]} · {currentQ.level}
              </span>
            </div>
            <span style={{ fontSize: 12, color: "#52525b", fontWeight: 600 }}>
              {currentIdx + 1}/{TOTAL_QUESTIONS}
            </span>
          </div>
          <div style={{ height: 4, background: "#27272a", borderRadius: 99, overflow: "hidden" }}>
            <motion.div
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
              style={{ height: "100%", background: CEFR_COLORS[currentQ.level] ?? "#10b981", borderRadius: 99 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
          >
            {/* Reading passage */}
            {currentQ.context && (
              <div style={{
                background: "#111118", border: "1px solid #27272a", borderRadius: 12,
                padding: "14px", marginBottom: 16,
              }}>
                <div style={{ fontSize: 10, color: "#52525b", fontWeight: 700, marginBottom: 8, textTransform: "uppercase" }}>
                  📖 Đoạn văn
                </div>
                <p style={{ fontSize: 13, color: "#a1a1aa", lineHeight: 1.7, margin: 0 }}>
                  {currentQ.context}
                </p>
              </div>
            )}

            {/* Question */}
            <div style={{
              background: "#111118", border: `1px solid ${CEFR_COLORS[currentQ.level] ?? "#27272a"}30`,
              borderRadius: 14, padding: "18px", marginBottom: 16,
            }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fafafa", lineHeight: 1.5, margin: 0 }}>
                {currentQ.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              {currentQ.options.map((opt, i) => {
                const isSelected = selected === i;
                return (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                    style={{
                      background: isSelected ? `${CEFR_COLORS[currentQ.level] ?? "#10b981"}20` : "#111118",
                      border: `1.5px solid ${isSelected ? (CEFR_COLORS[currentQ.level] ?? "#10b981") : "#27272a"}`,
                      borderRadius: 12, padding: "14px 16px",
                      cursor: selected !== null ? "default" : "pointer",
                      textAlign: "left", display: "flex", alignItems: "center", gap: 12,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: isSelected ? (CEFR_COLORS[currentQ.level] ?? "#10b981") : "#1c1c24",
                      border: `1.5px solid ${isSelected ? "transparent" : "#3f3f46"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 800,
                      color: isSelected ? "#fff" : "#71717a",
                    }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span style={{ fontSize: 14, color: isSelected ? "#fafafa" : "#a1a1aa", fontWeight: isSelected ? 600 : 400, lineHeight: 1.4 }}>
                      {opt}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={selected === null}
              style={{
                width: "100%",
                background: selected !== null
                  ? `linear-gradient(135deg, ${CEFR_COLORS[currentQ.level] ?? "#10b981"}, #14b8a6)`
                  : "#1c1c24",
                border: "none", borderRadius: 14, padding: "16px",
                fontSize: 15, fontWeight: 800,
                color: selected !== null ? "#fff" : "#52525b",
                cursor: selected !== null ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {isLast ? "Nộp bài & Xem kết quả" : "Câu tiếp theo"}
              <ChevronRight size={18} />
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
