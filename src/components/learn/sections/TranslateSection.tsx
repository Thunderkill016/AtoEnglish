"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Loader2 } from "lucide-react";
import type { UnitData } from "../UnitTemplate";
import { gradeTranslation, type TranslationGrade } from "@/app/actions/translate";

interface TranslateSectionProps {
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

// Error type badge labels in Vietnamese
const ERROR_LABELS: Record<string, string> = {
  grammar: "🔴 Ngữ pháp",
  "word-choice": "🟡 Chọn từ",
  "missing-word": "🟠 Thiếu từ",
  "word-order": "🔵 Trật tự từ",
};

export default function TranslateSection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  goNext,
}: TranslateSectionProps) {
  const [translateInputs, setTranslateInputs] = useState<Record<string, string>>({});
  const [translateSubmitted, setTranslateSubmitted] = useState(false);
  const [aiGrades, setAiGrades] = useState<Record<string, TranslationGrade | null>>({});
  const [isPending, startTransition] = useTransition();

  // Fuzzy match: normalize punctuation, whitespace, contractions
  const normalizeTranslation = (s: string) =>
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

  const handleSubmit = () => {
    setTranslateSubmitted(true);
    if (!unit.practiceTranslate) return;

    // Call AI grader for each item in parallel
    startTransition(async () => {
      const grades = await Promise.all(
        unit.practiceTranslate!.map(async (item) => {
          const userAnswer = translateInputs[item.id] ?? "";
          if (!userAnswer.trim()) return [item.id, null] as const;
          const result = await gradeTranslation(item.prompt_vn, item.answer, userAnswer);
          return [item.id, result.success ? (result.grade ?? null) : null] as const;
        })
      );
      setAiGrades(Object.fromEntries(grades));
    });
  };

  const correctCount = unit.practiceTranslate?.filter((item) => {
    const grade = aiGrades[item.id];
    // If AI graded, use AI verdict; otherwise fall back to fuzzy match
    if (grade !== undefined && grade !== null) return grade.correct;
    const userAnswer = translateInputs[item.id] ?? "";
    return normalizeTranslation(userAnswer) === normalizeTranslation(item.answer);
  }).length ?? 0;

  const totalItems = unit.practiceTranslate?.length ?? 0;

  return (
    <motion.div
      key="s9"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🇻🇳➡️🇺🇸</span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-teal-200 to-emerald-200 bg-clip-text text-transparent">
              Dịch câu
            </h1>
            <span className="text-[10px] font-bold text-teal-600 bg-teal-950/60 border border-teal-800/50 px-2 py-0.5 rounded-full">
              Bước {sectionOrderIdx + 1}/{TOTAL_SECTIONS}
            </span>
          </div>
          <p className="text-xs text-zinc-500">~2 phút</p>
        </div>
      </div>
      <p className="text-zinc-400 mb-6 text-sm">
        Đọc câu tiếng Việt và gõ bản dịch tiếng Anh của bạn. Đây là bước{" "}
        <span className="text-teal-400 font-semibold">sản xuất ngôn ngữ</span> — không nhìn gợi ý!
      </p>

      {unit.practiceTranslate && unit.practiceTranslate.length > 0 ? (
        <div className="space-y-5">
          {unit.practiceTranslate.map((item, i) => {
            const userAnswer = translateInputs[item.id] ?? "";
            const grade = aiGrades[item.id];
            // Determine correctness: AI grade if available, fuzzy match otherwise
            const isCorrect = translateSubmitted
              ? grade !== undefined && grade !== null
                ? grade.correct
                : normalizeTranslation(userAnswer) === normalizeTranslation(item.answer)
              : false;
            const isGraded = grade !== undefined && grade !== null;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-5 transition-all duration-300 ${
                  translateSubmitted
                    ? isCorrect
                      ? "border-emerald-500/50 bg-emerald-950/30"
                      : "border-red-500/40 bg-red-950/20"
                    : "border-zinc-700/60 bg-zinc-900/40"
                }`}
              >
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-teal-600/20 text-teal-400 rounded-full w-7 h-7 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    {i + 1}
                  </span>
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
                    onChange={(e) =>
                      setTranslateInputs((p) => ({ ...p, [item.id]: e.target.value }))
                    }
                    placeholder="Gõ câu tiếng Anh ở đây..."
                    className="w-full bg-zinc-900/60 border border-zinc-700/60 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-teal-500/60 transition-colors disabled:opacity-60"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !translateSubmitted) e.currentTarget.blur();
                    }}
                  />

                  {/* Feedback area */}
                  {translateSubmitted && (
                    <AnimatePresence>
                      <motion.div
                        key={`feedback-${item.id}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {/* Loading shimmer while AI grades */}
                        {isPending && !isGraded && (
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Loader2 className="size-3 animate-spin" />
                            AI đang chấm bài...
                          </div>
                        )}

                        {/* AI grade result */}
                        {isGraded && grade && (
                          <>
                            {/* Verdict line */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {isCorrect ? (
                                <span className="text-xs font-black text-emerald-400">✓ Chính xác!</span>
                              ) : (
                                <span className="text-xs font-black text-red-400">✗ Chưa đúng</span>
                              )}
                              {grade.errorType && ERROR_LABELS[grade.errorType] && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800/60 border border-zinc-700/40 text-zinc-400">
                                  {ERROR_LABELS[grade.errorType]}
                                </span>
                              )}
                            </div>

                            {/* AI Vietnamese feedback */}
                            <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/40 rounded-lg px-3 py-2 border border-zinc-800/60">
                              💬 {grade.feedbackVn}
                            </p>

                            {/* Natural alternative (if provided) */}
                            {grade.naturalAlternative && (
                              <p className="text-xs text-teal-400 leading-relaxed">
                                ✨ Cách nói tự nhiên hơn:{" "}
                                <span className="font-semibold italic">{grade.naturalAlternative}</span>
                              </p>
                            )}

                            {/* Reference answer for wrong answers */}
                            {!isCorrect && (
                              <p className="text-xs text-zinc-400">
                                📖 Đáp án tham khảo:{" "}
                                <span className="font-semibold text-zinc-200">{item.answer}</span>
                              </p>
                            )}
                          </>
                        )}

                        {/* Fallback fuzzy match (no AI grade) */}
                        {!isPending && !isGraded && (
                          isCorrect ? (
                            <p className="text-emerald-400 text-xs font-bold">✓ Chính xác!</p>
                          ) : (
                            <p className="text-red-400 text-xs">
                              ✗ Đáp án tham khảo:{" "}
                              <span className="font-semibold">{item.answer}</span>
                            </p>
                          )
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            );
          })}

          {!translateSubmitted ? (
            <button
              disabled={unit.practiceTranslate.some(
                (item) => !(translateInputs[item.id] ?? "").trim()
              )}
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl px-6 py-4 flex items-center justify-center gap-2 transition-all duration-200 text-lg shadow-lg shadow-teal-900/40 active:scale-95"
            >
              Kiểm tra bản dịch <ChevronRight size={20} />
            </button>
          ) : (
            <div className="space-y-3">
              <div className="bg-zinc-900/60 rounded-2xl p-4 text-center border border-zinc-700/40">
                <p className="text-lg font-black text-white">
                  {correctCount}/{totalItems} câu chính xác
                </p>
                <p className="text-zinc-400 text-sm mt-1">
                  {correctCount === totalItems
                    ? "🎉 Hoàn hảo! Kỹ năng dịch xuất sắc."
                    : correctCount >= Math.ceil(totalItems / 2)
                    ? "👍 Tốt! Xem lại các câu chưa đúng nhé."
                    : "💪 Cần luyện thêm — đọc lại giải thích của AI."}
                </p>
                {isPending && (
                  <p className="text-xs text-zinc-500 mt-2 flex items-center justify-center gap-1">
                    <Loader2 className="size-3 animate-spin" /> AI đang phân tích...
                  </p>
                )}
              </div>
              <button
                onClick={goNext}
                disabled={isPending}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-white font-bold rounded-2xl px-6 py-4 flex items-center justify-center gap-2 transition-all duration-200 text-lg shadow-lg shadow-emerald-900/40 active:scale-95"
              >
                Tiếp tục <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-zinc-500 text-sm">Unit này chưa có bài dịch câu.</p>
          <button
            onClick={goNext}
            className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl px-6 py-3 transition-all duration-200 shadow-md shadow-emerald-900/40 active:scale-95"
          >
            Bỏ qua → Tiếp tục
          </button>
        </div>
      )}
    </motion.div>
  );
}
