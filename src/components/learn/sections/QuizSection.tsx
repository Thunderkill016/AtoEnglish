"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Star, CheckCircle, Volume2, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import type { UnitData, QuizQuestion } from "../UnitTemplate";
import { ReadingComprehensionExercise } from "@/components/exercises/ReadingComprehensionExercise";

interface QuizSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  seenCards: Set<number>;
  VOCAB_LIMIT: number;
  shadowAvg: number;
  shadowDone: boolean;
  lacScore: number;
  LISTEN_CHOOSE_LENGTH: number;
  isCompleted: boolean;
  isSubmitting: boolean;
  handleCompleteUnit: () => void;
  playCorrectSound: () => void;
  playWrongSound: () => void;

  // Cumulative review states
  cumulativeAnswers: Record<string, string>;
  setCumulativeAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  cumulativeClozeInputs: Record<string, string>;
  setCumulativeClozeInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  cumulativeSubmitted: boolean;
  setCumulativeSubmitted: React.Dispatch<React.SetStateAction<boolean>>;

  // Quiz states
  quizAnswers: Record<string, string>;
  setQuizAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  quizClozeInputs: Record<string, string>;
  setQuizClozeInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  quizSubmitted: boolean;
  setQuizSubmitted: React.Dispatch<React.SetStateAction<boolean>>;

  // Retry states
  retryAnswers: Record<string, string>;
  setRetryAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  retryClozeInputs: Record<string, string>;
  setRetryClozeInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  retrySubmitted: boolean;
  setRetrySubmitted: React.Dispatch<React.SetStateAction<boolean>>;

  // Derived values from parent
  finalQuizScore: number;
  wrongQuestions: QuizQuestion[];
  retryCorrectCount: number;
  retryBonusPct: number;
  effectiveScore: number;
  effectiveStarCount: number;
  xpToEarn: number;
  nextRoute: string;
}

const sectionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function QuizSection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  seenCards,
  VOCAB_LIMIT,
  shadowAvg,
  shadowDone,
  lacScore,
  LISTEN_CHOOSE_LENGTH,
  isCompleted,
  isSubmitting,
  handleCompleteUnit,
  playCorrectSound,
  playWrongSound,

  cumulativeAnswers,
  setCumulativeAnswers,
  cumulativeClozeInputs,
  setCumulativeClozeInputs,
  cumulativeSubmitted,
  setCumulativeSubmitted,

  quizAnswers,
  setQuizAnswers,
  quizClozeInputs,
  setQuizClozeInputs,
  quizSubmitted,
  setQuizSubmitted,

  retryAnswers,
  setRetryAnswers,
  retryClozeInputs,
  setRetryClozeInputs,
  retrySubmitted,
  setRetrySubmitted,

  finalQuizScore,
  wrongQuestions,
  retryCorrectCount,
  retryBonusPct,
  effectiveScore,
  effectiveStarCount,
  xpToEarn,
  nextRoute,
}: QuizSectionProps) {
  const FINAL_QS = unit.quiz;

  // Reading comprehension state
  const hasReading = !!unit.readingPassage;
  const [readingDone, setReadingDone] = useState(!hasReading);

  const pickEnglishVoice = () => {
    if (typeof window === "undefined") return null;
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ??
      voices.find(v => v.lang === "en-US") ??
      voices.find(v => v.lang.startsWith("en")) ??
      null
    );
  };

  const playTTS = (text: string) => {
    if (!window.speechSynthesis) {
      toast.error("Trình duyệt không hỗ trợ TTS");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    const voice = pickEnglishVoice();
    if (voice) u.voice = voice;
    window.speechSynthesis.speak(u);
  };

  const handleShare = async () => {
    const text = `Tôi vừa hoàn thành "${unit.title}" trên AtoEnglish! 🎉\nCùng học tiếng Anh miễn phí: https://atoenglish.vercel.app`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: "AtoEnglish", text });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Đã sao chép link chia sẻ!");
    }
  };

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

  return (
    <motion.div
      key="s8"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-yellow-500/10 rounded-xl">
          <Trophy className="text-yellow-400" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">
              Ôn tập & Kết quả
            </h1>
            <span className="text-[10px] font-bold text-yellow-600 bg-yellow-950/60 border border-yellow-800/50 px-2 py-0.5 rounded-full">
              Bước {sectionOrderIdx + 1}/{TOTAL_SECTIONS}
            </span>
          </div>
          <p className="text-xs text-zinc-500">~3 phút • Hoàn thành để nhận XP</p>
        </div>
      </div>

      {/* Spaced Cumulative Review */}
      {unit.cumulativeReviewQuestions && unit.cumulativeReviewQuestions.length > 0 && (
        <div className="mb-6">
          {!cumulativeSubmitted ? (
            <div className="bg-amber-950/20 border border-amber-700/30 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">🔁</span>
                <div>
                  <p className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Ôn tập bài cũ
                  </p>
                  <p className="text-xs text-zinc-500">
                    Trả lời để kích hoạt bộ nhớ dài hạn trước khi học tiếp
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                {unit.cumulativeReviewQuestions.map((q, qi) => {
                  if (q.type === "cloze" || q.type === "translate") {
                    return (
                      <div key={q.id}>
                        <p className="text-white text-sm mb-2">
                          <span className="text-amber-500/70 mr-2">↺ {qi + 1}.</span>
                          {q.question}
                        </p>
                        {q.type === "translate" && (
                          <p className="text-xs text-violet-400 mb-1">✍️ Dịch sang tiếng Anh</p>
                        )}
                        <input
                          type="text"
                          value={cumulativeClozeInputs[q.id] ?? ""}
                          onChange={(e) =>
                            setCumulativeClozeInputs((p) => ({ ...p, [q.id]: e.target.value }))
                          }
                          placeholder={
                            q.type === "translate"
                              ? "Nhập câu tiếng Anh..."
                              : "Điền từ còn thiếu..."
                          }
                          className="w-full bg-zinc-800 border border-amber-700/30 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                        />
                      </div>
                    );
                  }
                  return (
                    <div key={q.id}>
                      <p className="text-white text-sm mb-2">
                        <span className="text-amber-500/70 mr-2">↺ {qi + 1}.</span>
                        {q.question}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(q.options ?? []).map((opt: string) => (
                          <motion.button
                            key={opt}
                            disabled={cumulativeSubmitted}
                            onClick={() =>
                              !cumulativeSubmitted &&
                              setCumulativeAnswers((p) => ({ ...p, [q.id]: opt }))
                            }
                            whileHover={!cumulativeSubmitted ? { y: -2, border: "1px solid #d97706", boxShadow: "0 4px 12px rgba(217, 119, 6, 0.15)" } : {}}
                            whileTap={!cumulativeSubmitted ? { y: 1, scale: 0.98 } : {}}
                            transition={{ type: "spring", stiffness: 450, damping: 15 }}
                            className={`px-3 py-2 rounded-xl text-sm font-medium border text-left disabled:cursor-default ${
                              cumulativeAnswers[q.id] === opt
                                ? "bg-amber-600/30 border-amber-500 text-amber-300"
                                : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-amber-600/40"
                            }`}
                          >
                            {opt}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                disabled={unit.cumulativeReviewQuestions.some((q) =>
                  q.type === "multiple-choice"
                    ? !cumulativeAnswers[q.id]
                    : !(cumulativeClozeInputs[q.id] ?? "").trim()
                )}
                onClick={() => {
                  setCumulativeSubmitted(true);
                  const correct = unit.cumulativeReviewQuestions!.filter((q) =>
                    q.type === "multiple-choice"
                      ? cumulativeAnswers[q.id] === q.answer
                      : normalizeAnswer(cumulativeClozeInputs[q.id] ?? "") ===
                        normalizeAnswer(q.answer)
                  ).length;
                  if (correct === unit.cumulativeReviewQuestions!.length) playCorrectSound();
                }}
                className="mt-4 w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-white font-bold rounded-2xl py-2.5 text-sm transition-all duration-200 active:scale-95"
              >
                Kiểm tra ôn tập
              </button>
            </div>
          ) : (
            <div className="bg-amber-950/20 border border-amber-700/30 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-400 mb-2">🔁 Kết quả ôn tập bài cũ</p>
              <div className="space-y-2">
                {unit.cumulativeReviewQuestions.map((q, qi) => {
                  const isCorrect =
                    q.type === "multiple-choice"
                      ? cumulativeAnswers[q.id] === q.answer
                      : normalizeAnswer(cumulativeClozeInputs[q.id] ?? "") ===
                        normalizeAnswer(q.answer);
                  return (
                    <div
                      key={q.id}
                      className={`flex items-start gap-2 text-xs rounded-xl p-2 ${
                        isCorrect ? "bg-emerald-950/30" : "bg-red-950/20"
                      }`}
                    >
                      <span>{isCorrect ? "✓" : "✗"}</span>
                      <div>
                        <p className="text-zinc-300">
                          {qi + 1}. {q.question}
                        </p>
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
        <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 border border-zinc-700/50 rounded-2xl p-6 mb-6 shadow-md">
          <p className="text-sm font-bold text-white mb-5">🧠 Quiz tổng hợp — {FINAL_QS.length} câu</p>
          <div className="space-y-6">
            {FINAL_QS.map((q, qi) => {
              if (q.type === "cloze") {
                return (
                  <div key={q.id}>
                    <p className="text-white text-sm mb-3">
                      <span className="text-zinc-500 mr-2">Câu {qi + 1}.</span>
                      {q.question}
                    </p>
                    <input
                      type="text"
                      value={quizClozeInputs[q.id] ?? ""}
                      onChange={(e) =>
                        setQuizClozeInputs((p) => ({ ...p, [q.id]: e.target.value }))
                      }
                      placeholder="Điền từ còn thiếu..."
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                    />
                  </div>
                );
              }
              if (q.type === "translate") {
                return (
                  <div key={q.id}>
                    <p className="text-white text-sm mb-1">
                      <span className="text-zinc-500 mr-2">Câu {qi + 1}.</span>
                      {q.question}
                    </p>
                    <p className="text-xs text-violet-400 mb-2">✍️ Dịch sang tiếng Anh</p>
                    <input
                      type="text"
                      value={quizClozeInputs[q.id] ?? ""}
                      onChange={(e) =>
                        setQuizClozeInputs((p) => ({ ...p, [q.id]: e.target.value }))
                      }
                      placeholder="Nhập câu tiếng Anh..."
                      className="w-full bg-zinc-800 border border-violet-700/50 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-colors text-sm"
                    />
                  </div>
                );
              }
              return (
                <div key={q.id}>
                  <p className="text-white text-sm mb-3">
                    <span className="text-zinc-500 mr-2">Câu {qi + 1}.</span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(q.options ?? []).map((opt, oi) => {
                      const isSelected = quizAnswers[q.id] === opt;
                      const isWrongAnswer = quizSubmitted && isSelected && opt !== q.answer;
                      const isRightAnswer = quizSubmitted && opt === q.answer;
                      let cls = "px-3 py-2 rounded-xl text-sm font-medium border text-left ";
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
                        <motion.button
                          key={oi}
                          onClick={() => !quizSubmitted && setQuizAnswers((p) => ({ ...p, [q.id]: opt }))}
                          disabled={quizSubmitted}
                          whileHover={!quizSubmitted ? { y: -2, border: "1px solid #10b981", boxShadow: "0 4px 12px rgba(16, 185, 129, 0.15)" } : {}}
                          whileTap={!quizSubmitted ? { y: 1, scale: 0.98 } : {}}
                          transition={{ type: "spring", stiffness: 450, damping: 15 }}
                          className={cls}
                        >
                          {opt}
                        </motion.button>
                      );
                    })}
                  </div>
                  {/* Grammar explanation — shown when user answered wrong (Babbel pattern) */}
                  {quizSubmitted && quizAnswers[q.id] !== q.answer && q.explanation_vn && (
                    <div className="mt-2 flex items-start gap-2 bg-amber-950/30 border border-amber-700/40 rounded-xl px-3 py-2.5">
                      <span className="text-amber-400 text-sm shrink-0">💡</span>
                      <p className="text-amber-200 text-xs leading-relaxed">{q.explanation_vn}</p>
                    </div>
                  )}
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
              FINAL_QS.filter((q) => q.type === "multiple-choice").some((q) => !quizAnswers[q.id]) ||
              FINAL_QS.filter((q) => q.type === "cloze" || q.type === "translate").some(
                (q) => !(quizClozeInputs[q.id] ?? "").trim()
              )
            }
            className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-white font-bold rounded-2xl py-3 transition-all duration-200 shadow-md shadow-emerald-900/40 active:scale-95"
          >
            Kiểm tra đáp án
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Score Display */}
          <div className="bg-gradient-to-br from-emerald-950/60 to-teal-950/40 border border-emerald-600/40 rounded-2xl p-6 text-center shadow-lg shadow-emerald-950/60">
            <div className="text-5xl mb-3">
              {finalQuizScore >= Math.ceil(FINAL_QS.length * 0.8)
                ? "🏆"
                : finalQuizScore >= Math.ceil(FINAL_QS.length * 0.6)
                ? "🎯"
                : "💪"}
            </div>
            <p className="text-emerald-300 font-black text-2xl mb-1">{finalQuizScore}/{FINAL_QS.length} đúng</p>
            <p className="text-zinc-400 text-sm">
              {finalQuizScore >= Math.ceil(FINAL_QS.length * 0.8)
                ? "Xuất sắc! Bạn đã nắm vững bài học!"
                : finalQuizScore >= Math.ceil(FINAL_QS.length * 0.6)
                ? "Khá tốt! Tiếp tục ôn tập nhé!"
                : "Cần luyện thêm một chút — bạn làm được!"}
            </p>
          </div>

          {/* Retry panel */}
          {wrongQuestions.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-700/40 rounded-2xl p-5">
              <p className="text-sm font-bold text-amber-400 mb-1">💡 Ôn lại câu sai ({wrongQuestions.length} câu)</p>
              <p className="text-xs text-zinc-500 mb-4">
                Trả lời đúng để nhận thêm điểm thưởng (tối đa +10%)!
              </p>
              {!retrySubmitted ? (
                <div className="space-y-4">
                  {wrongQuestions.map((q, qi) => {
                    if (q.type === "cloze") {
                      return (
                        <div key={q.id}>
                          <p className="text-white text-sm mb-2">
                            <span className="text-amber-400 mr-2">↺ {qi + 1}.</span>
                            {q.question}
                          </p>
                          <input
                            type="text"
                            value={retryClozeInputs[q.id] ?? ""}
                            onChange={(e) =>
                              setRetryClozeInputs((p) => ({ ...p, [q.id]: e.target.value }))
                            }
                            placeholder="Điền từ còn thiếu..."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                          />
                        </div>
                      );
                    }
                    return (
                      <div key={q.id}>
                        <p className="text-white text-sm mb-2">
                          <span className="text-amber-400 mr-2">↺ {qi + 1}.</span>
                          {q.question}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {(q.options ?? []).map((opt: string) => (
                            <motion.button
                              key={opt}
                              onClick={() => setRetryAnswers((p) => ({ ...p, [q.id]: opt }))}
                              disabled={retrySubmitted}
                              whileHover={!retrySubmitted ? { y: -2, border: "1px solid #d97706", boxShadow: "0 4px 12px rgba(217, 119, 6, 0.15)" } : {}}
                              whileTap={!retrySubmitted ? { y: 1, scale: 0.98 } : {}}
                              transition={{ type: "spring", stiffness: 450, damping: 15 }}
                              className={`px-3 py-2 rounded-xl text-sm font-medium border text-left ${
                                retryAnswers[q.id] === opt
                                  ? "bg-amber-600/30 border-amber-500 text-amber-300"
                                  : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-amber-600/50"
                              }`}
                            >
                              {opt}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <button
                    onClick={() => {
                      setRetrySubmitted(true);
                      if (retryCorrectCount > 0) playCorrectSound();
                    }}
                    disabled={wrongQuestions.some((q) =>
                      q.type === "multiple-choice"
                        ? !retryAnswers[q.id]
                        : !(retryClozeInputs[q.id] ?? "").trim()
                    )}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-40 text-white font-bold rounded-2xl py-2.5 text-sm transition-all duration-200 active:scale-95"
                  >
                    Gửi câu trả lời
                  </button>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-2xl mb-1">
                    {retryCorrectCount === wrongQuestions.length ? "🎉" : "📖"}
                  </p>
                  <p className="font-bold text-white">
                    {retryCorrectCount}/{wrongQuestions.length} câu đúng
                  </p>
                  {retryBonusPct > 0 && (
                    <p className="text-emerald-400 font-bold text-sm mt-1">
                      +{retryBonusPct}% điểm thưởng! Tổng: {effectiveScore}%
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Reading Comprehension — shown after quiz submitted */}
          {hasReading && unit.readingPassage && (
            <div className="bg-blue-950/20 border border-blue-700/30 rounded-2xl p-5">
              <ReadingComprehensionExercise
                passage={unit.readingPassage}
                onComplete={(score, total) => {
                  setReadingDone(true);
                  if (score >= Math.ceil(total * 0.75)) playCorrectSound();
                }}
              />
            </div>
          )}

          {/* Progress Summary */}
          <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 border border-zinc-700/50 rounded-2xl p-5 shadow-md">
            <p className="text-sm font-bold text-white mb-3">📊 Kết quả học tập</p>
            <div className="space-y-2">
              {[
                {
                  label: "Từ vựng đã học",
                  value: `${seenCards.size}/${VOCAB_LIMIT} từ`,
                  icon: "📚",
                  done: seenCards.size >= VOCAB_LIMIT,
                },
                {
                  label: "Shadowing",
                  value: `${shadowAvg}% trung bình`,
                  icon: "🎤",
                  done: shadowDone || unit.dialogues.length === 0,
                },
                {
                  label: "Nghe hiểu",
                  value: `${lacScore}/${LISTEN_CHOOSE_LENGTH} đúng`,
                  icon: "🎧",
                  done: lacScore >= Math.ceil(LISTEN_CHOOSE_LENGTH * 0.7),
                },
                {
                  label: "Quiz",
                  value: `${finalQuizScore}/${FINAL_QS.length} đúng`,
                  icon: "🧠",
                  done: finalQuizScore >= Math.ceil(FINAL_QS.length * 0.6),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span className="text-zinc-400 text-sm flex-1">{item.label}</span>
                  <span
                    className={`text-sm font-bold ${item.done ? "text-emerald-400" : "text-zinc-400"}`}
                  >
                    {item.value}
                  </span>
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
            <p className="text-xs text-zinc-500 mb-2">
              {effectiveScore}% tổng điểm
              {retryBonusPct > 0 ? (
                <span className="text-emerald-400 ml-1">(+{retryBonusPct}% bonus)</span>
              ) : null}
            </p>
            <p className="text-emerald-300 font-black text-xl mb-1">
              Huy hiệu: {unit.badgeName}
            </p>
            <p className="text-zinc-400 text-sm">{unit.title}</p>
          </div>

          {/* Motivation */}
          <div className="border-l-4 border-emerald-500 bg-emerald-950/20 rounded-r-2xl p-5">
            <p className="text-emerald-300 font-bold text-lg leading-relaxed">
              Tuyệt vời! Bạn đã hoàn thành xuất sắc chương học này. 🌟
            </p>
            <p className="text-zinc-400 text-sm mt-2">
              Hãy tiếp tục phát huy tinh thần tự học mỗi ngày. Lặp lại ngắt quãng sẽ giúp bạn nhớ từ
              vựng lâu hơn!
            </p>
          </div>

          {/* Proof Moment */}
          {unit.situation && (
            <div className="bg-gradient-to-br from-violet-950/40 to-teal-950/40 border border-violet-600/30 rounded-2xl p-5">
              <p className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1">
                🎤 Proof of Progress
              </p>
              <p className="text-white font-semibold text-sm mb-1">Hãy thử lại tình huống hôm nay!</p>
              <p className="text-zinc-400 text-xs mb-4">
                Nói to câu trả lời cho tình huống:{" "}
                <span className="text-zinc-300 italic">&ldquo;{unit.situation}&rdquo;</span>
              </p>
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
                onClick={() =>
                  playTTS(`${unit.situation ?? ""} — ${unit.learningOutcomes?.join(", ") ?? ""}`)
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 font-bold text-sm hover:bg-violet-600/30 transition-colors"
              >
                <Volume2 size={16} /> Nghe lại tình huống
              </button>
            </div>
          )}

          {/* Completion buttons */}
          {!isCompleted ? (
            <button
              onClick={handleCompleteUnit}
              disabled={isSubmitting || !readingDone}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-60 text-white font-black rounded-2xl px-6 py-5 flex items-center justify-center gap-3 transition-all duration-200 text-lg shadow-lg shadow-emerald-900/40 active:scale-95"
            >
              {isSubmitting
                ? "Đang lưu..."
                : !readingDone
                ? "Hoàn thành Đọc hiểu để tiếp tục ↑"
                : `🎉 Hoàn thành bài học (+${xpToEarn} XP)`}
            </button>
          ) : (
            <div className="text-center">
              <div className="bg-emerald-600/20 border border-emerald-600/40 rounded-xl p-4 mb-4">
                <p className="text-emerald-300 font-bold">✅ Bạn đã hoàn thành chương học này!</p>
              </div>
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 font-bold rounded-xl px-5 py-3 transition-colors text-sm"
                >
                  🔗 Chia sẻ thành tích
                </button>
                <Link
                  href="/quiz"
                  className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl px-5 py-3 transition-colors text-sm"
                >
                  📝 Quiz từ vựng
                </Link>
                <Link
                  href={nextRoute}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-xl px-5 py-3 transition-all duration-200 text-sm shadow-md shadow-emerald-900/40 active:scale-95"
                >
                  Tiếp tục <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
