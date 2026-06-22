"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  BookOpen,
  GraduationCap,
  BarChart3,
  Trophy,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  PLACEMENT_QUESTIONS,
  calculateResult,
  TOTAL_QUESTIONS,
  GRAMMAR_COUNT,
  VOCAB_COUNT,
  READING_COUNT,
  type PlacementQuestion,
} from "@/lib/data/placement-test";
import { savePlacementResult } from "@/app/actions/progress";

type Stage = "intro" | "test" | "saving" | "results";

const CEFR_COLORS: Record<string, string> = {
  A1: "#3b82f6",
  A2: "#8b5cf6",
  B1: "#f59e0b",
  B2: "#10b981",
};

const SKILL_LABEL: Record<string, string> = {
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
  reading: "Đọc hiểu",
};

const SKILL_ICON: Record<string, string> = {
  grammar: "📐",
  vocabulary: "📝",
  reading: "📖",
};

export default function PlacementTestClient() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateResult> | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

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
      const res = calculateResult(newAnswers);
      setResult(res);
      const saveRes = await savePlacementResult(res.cefrLevel, res.totalScore);
      if (!saveRes.success) setSaveError(saveRes.error ?? null);
      setStage("results");
    } else {
      setCurrentIdx((i) => i + 1);
      setSelected(null);
    }
  }, [selected, answers, currentQ.id, isLast]);

  // ── INTRO SCREEN ────────────────────────────────────────────────────────────
  if (stage === "intro") {
    return (
      <div style={{ minHeight: "100dvh", background: "#09090b", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px 16px 100px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 460, width: "100%" }}
        >
          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <span style={{ background: "#10b98120", border: "1px solid #10b98140", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: "#10b981" }}>
              CEFR Placement Test
            </span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fafafa", fontFamily: "'Space Grotesk', sans-serif", textAlign: "center", marginBottom: 10 }}>
            Xác Định Trình Độ Tiếng Anh
          </h1>
          <p style={{ fontSize: 13, color: "#71717a", textAlign: "center", lineHeight: 1.6, marginBottom: 28 }}>
            Bài test chuẩn CEFR gồm <strong style={{ color: "#a1a1aa" }}>40 câu hỏi</strong> — Grammar, Vocabulary và Reading. Mất khoảng <strong style={{ color: "#a1a1aa" }}>15–25 phút</strong>. Không giới hạn thời gian.
          </p>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 24 }}>
            {[
              { icon: "📐", label: "Ngữ pháp", count: GRAMMAR_COUNT },
              { icon: "📝", label: "Từ vựng", count: VOCAB_COUNT },
              { icon: "📖", label: "Đọc hiểu", count: READING_COUNT },
            ].map((s) => (
              <div key={s.label} style={{ background: "#111118", border: "1px solid #27272a", borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#fafafa" }}>{s.count}</div>
                <div style={{ fontSize: 10, color: "#52525b", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* CEFR levels */}
          <div style={{ background: "#111118", border: "1px solid #27272a", borderRadius: 12, padding: "14px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#52525b", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Kết quả xác định
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {(["A1", "A2", "B1", "B2"] as const).map((lvl) => (
                <div key={lvl} style={{ flex: 1, background: `${CEFR_COLORS[lvl]}20`, border: `1px solid ${CEFR_COLORS[lvl]}40`, borderRadius: 8, padding: "8px 4px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: CEFR_COLORS[lvl] }}>{lvl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div style={{ background: "#111118", border: "1px solid #27272a", borderRadius: 12, padding: "14px", marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: "#52525b", fontWeight: 700, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Lưu ý
            </div>
            {[
              "Câu hỏi bằng tiếng Anh — đọc kỹ trước khi chọn",
              "Không thể quay lại câu trước",
              "Kết quả tự động cập nhật level trong app",
              "Làm thật — đừng đoán mò để kết quả chính xác nhất",
            ].map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", marginTop: 6, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#a1a1aa", lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStage("test")}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #10b981, #14b8a6)",
              border: "none",
              borderRadius: 14,
              padding: "16px",
              fontSize: 15,
              fontWeight: 800,
              color: "#fff",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 4px 20px #10b98130",
            }}
          >
            Bắt Đầu Test <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
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
    const grammarTotal = GRAMMAR_COUNT;
    const vocabTotal = VOCAB_COUNT;
    const readingTotal = READING_COUNT;

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

            {/* Score card */}
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

            {/* Skill breakdown */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { key: "grammar", score: result.grammarScore, total: grammarTotal },
                { key: "vocabulary", score: result.vocabularyScore, total: vocabTotal },
                { key: "reading", score: result.readingScore, total: readingTotal },
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

            {saveError && (
              <div style={{ background: "#ef444410", border: "1px solid #ef444430", borderRadius: 10, padding: "10px 12px", marginBottom: 14, fontSize: 12, color: "#ef4444" }}>
                ⚠️ {saveError} — Level đã tính xong nhưng chưa lưu được DB.
              </div>
            )}

            {/* CTAs */}
            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href="/dashboard"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: "linear-gradient(135deg, #10b981, #14b8a6)",
                  color: "#fff", textDecoration: "none", borderRadius: 12, padding: "14px",
                  fontSize: 13, fontWeight: 800,
                }}
              >
                <Trophy size={16} /> Về Dashboard
              </Link>
              <Link
                href="/roadmap"
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  background: "#111118", border: "1px solid #27272a",
                  color: "#a1a1aa", textDecoration: "none", borderRadius: 12, padding: "14px",
                  fontSize: 13, fontWeight: 700,
                }}
              >
                Xem lộ trình
              </Link>
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
