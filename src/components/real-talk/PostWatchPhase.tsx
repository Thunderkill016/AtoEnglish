"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  CheckCircle2,
  XCircle,
  Volume2,
  Mic,
  Info,
} from "lucide-react";
import type { PostWatchContent, CulturalNote } from "@/types/real-talk";
import { cn } from "@/lib/utils";

interface PostWatchPhaseProps {
  content: PostWatchContent;
  culturalNotes: CulturalNote[];
  onComplete: (score: number) => void;
}

type PhaseSection = "quiz" | "fill" | "speaking" | "summary";

export default function PostWatchPhase({
  content,
  culturalNotes,
  onComplete,
}: PostWatchPhaseProps) {
  const [section, setSection] = useState<PhaseSection>("quiz");

  // Quiz states
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizScore, setQuizScore] = useState(0);

  // Fill in the blank states
  const [currentFillIdx, setCurrentFillIdx] = useState(0);
  const [fillInput, setFillInput] = useState("");
  const [fillFeedback, setFillFeedback] = useState<"correct" | "wrong" | null>(
    null,
  );
  const [fillScore, setFillScore] = useState(0);

  // Speaking drills
  const [currentDrillIdx, setCurrentDrillIdx] = useState(0);

  const playTTS = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const handleQuizSelect = (idx: number) => {
    const q = content.comprehensionQuiz[currentQuizIdx];
    if (quizAnswers[q.id] !== undefined) return; // Already answered

    setQuizAnswers((prev) => ({ ...prev, [q.id]: idx }));
    if (idx === q.correctIndex) {
      setQuizScore((s) => s + 1);
    }
  };

  const nextQuiz = () => {
    if (currentQuizIdx < content.comprehensionQuiz.length - 1) {
      setCurrentQuizIdx((i) => i + 1);
    } else {
      setSection("fill");
    }
  };

  const handleFillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fillFeedback) {
      // Next
      setFillInput("");
      setFillFeedback(null);
      if (currentFillIdx < content.fillInTheBlank.length - 1) {
        setCurrentFillIdx((i) => i + 1);
      } else {
        setSection("speaking");
      }
      return;
    }

    const ex = content.fillInTheBlank[currentFillIdx];
    const isCorrect =
      fillInput.trim().toLowerCase() === ex.answer.toLowerCase() ||
      ex.alternatives?.some(
        (a) => a.toLowerCase() === fillInput.trim().toLowerCase(),
      );

    if (isCorrect) {
      setFillFeedback("correct");
      setFillScore((s) => s + 1);
    } else {
      setFillFeedback("wrong");
    }
  };

  const nextDrill = () => {
    if (currentDrillIdx < content.speakingDrills.length - 1) {
      setCurrentDrillIdx((i) => i + 1);
    } else {
      setSection("summary");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {/* COMPREHENSION QUIZ */}
        {section === "quiz" && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Kiểm tra độ hiểu</h2>
              <span className="text-sm text-zinc-400">
                {currentQuizIdx + 1} / {content.comprehensionQuiz.length}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-white mb-6">
                {content.comprehensionQuiz[currentQuizIdx].questionVi}
              </h3>
              <div className="space-y-3">
                {content.comprehensionQuiz[currentQuizIdx].options.map(
                  (opt, idx) => {
                    const q = content.comprehensionQuiz[currentQuizIdx];
                    const answeredIdx = quizAnswers[q.id];
                    const isAnswered = answeredIdx !== undefined;
                    const isCorrectOpt = idx === q.correctIndex;

                    let btnClass =
                      "border-zinc-700 hover:bg-zinc-800 text-zinc-300";
                    if (isAnswered) {
                      if (isCorrectOpt)
                        btnClass =
                          "border-emerald-500 bg-emerald-500/20 text-emerald-400";
                      else if (answeredIdx === idx)
                        btnClass = "border-red-500 bg-red-500/20 text-red-400";
                      else
                        btnClass = "border-zinc-800 text-zinc-600 opacity-50";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizSelect(idx)}
                        disabled={isAnswered}
                        className={cn(
                          "w-full text-left p-4 rounded-xl border min-h-[44px] transition-all flex items-center justify-between",
                          btnClass,
                        )}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrectOpt && (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-500"
                          />
                        )}
                        {isAnswered && answeredIdx === idx && !isCorrectOpt && (
                          <XCircle size={18} className="text-red-500" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>

              {quizAnswers[content.comprehensionQuiz[currentQuizIdx].id] !==
                undefined && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-blue-200 text-sm"
                >
                  <Info size={16} className="inline mr-2 text-blue-400" />
                  {content.comprehensionQuiz[currentQuizIdx].explanationVi}
                </motion.div>
              )}
            </div>

            {quizAnswers[content.comprehensionQuiz[currentQuizIdx].id] !==
              undefined && (
              <button
                onClick={nextQuiz}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
              >
                Tiếp tục <ChevronRight size={20} />
              </button>
            )}
          </motion.div>
        )}

        {/* FILL IN THE BLANK */}
        {section === "fill" && (
          <motion.div
            key="fill"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                Điền vào chỗ trống
              </h2>
              <span className="text-sm text-zinc-400">
                {currentFillIdx + 1} / {content.fillInTheBlank.length}
              </span>
            </div>

            <div
              className={cn(
                "rounded-2xl border p-6 backdrop-blur-xl transition-colors",
                fillFeedback === "correct"
                  ? "border-emerald-500/50 bg-emerald-950/20"
                  : fillFeedback === "wrong"
                    ? "border-red-500/50 bg-red-950/20"
                    : "border-zinc-800/60 bg-zinc-900/60",
              )}
            >
              <form onSubmit={handleFillSubmit}>
                <p className="text-lg text-white mb-2 leading-relaxed flex flex-wrap items-center gap-2">
                  {content.fillInTheBlank[currentFillIdx].sentence
                    .split("___")
                    .map((part, i, arr) => (
                      <span key={i} className="contents">
                        {part}
                        {i < arr.length - 1 && (
                          <input
                            type="text"
                            value={
                              fillFeedback === "correct"
                                ? content.fillInTheBlank[currentFillIdx].answer
                                : fillInput
                            }
                            onChange={(e) => setFillInput(e.target.value)}
                            disabled={fillFeedback === "correct"}
                            className={cn(
                              "mx-2 bg-black border-b-2 outline-none px-2 py-1 text-center font-bold min-w-[100px]",
                              fillFeedback === "correct"
                                ? "border-emerald-500 text-emerald-400"
                                : fillFeedback === "wrong"
                                  ? "border-red-500 text-red-400 animate-shake"
                                  : "border-zinc-600 focus:border-emerald-500 text-white",
                            )}
                            autoFocus
                          />
                        )}
                      </span>
                    ))}
                </p>
                <p className="text-sm text-zinc-400 mt-4 italic">
                  Gợi ý: {content.fillInTheBlank[currentFillIdx].hintVi}
                </p>

                {fillFeedback === "wrong" && (
                  <p className="text-red-400 text-sm mt-4">
                    Chưa chính xác, thử lại nhé.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!fillInput.trim() && !fillFeedback}
                  className="w-full mt-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 text-white font-bold transition-colors"
                >
                  {fillFeedback === "correct" ? "Tiếp tục" : "Kiểm tra"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* SPEAKING DRILLS */}
        {section === "speaking" && (
          <motion.div
            key="speaking"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Luyện nói</h2>
              <span className="text-sm text-zinc-400">
                {currentDrillIdx + 1} / {content.speakingDrills.length}
              </span>
            </div>

            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-8 backdrop-blur-xl text-center flex flex-col items-center">
              <button
                onClick={() =>
                  playTTS(content.speakingDrills[currentDrillIdx].phrase)
                }
                className="size-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-colors mb-6"
              >
                <Volume2 size={32} />
              </button>

              <h3 className="text-2xl font-bold text-white mb-2">
                {content.speakingDrills[currentDrillIdx].phrase}
              </h3>
              <p className="text-zinc-400 mb-6">
                {content.speakingDrills[currentDrillIdx].meaningVi}
              </p>

              <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl text-sm text-amber-200/90 w-full mb-8">
                <span className="font-bold text-amber-500 block mb-1">
                  Mẹo phát âm:
                </span>
                {content.speakingDrills[currentDrillIdx].tipVi}
              </div>

              {/* Mock microphone button for visual */}
              <button className="flex items-center gap-2 py-3 px-6 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
                <Mic size={18} /> Nhấn để thu âm (Minh họa)
              </button>
            </div>

            <button
              onClick={nextDrill}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
            >
              Tiếp tục <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {/* SUMMARY */}
        {section === "summary" && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-8"
          >
            <div className="inline-flex size-20 rounded-full bg-emerald-500/20 items-center justify-center mb-4">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-white">
              Hoàn thành bài học!
            </h2>

            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-8">
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                <p className="text-zinc-400 text-sm">Quiz</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {quizScore}/{content.comprehensionQuiz.length}
                </p>
              </div>
              <div className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl">
                <p className="text-zinc-400 text-sm">Điền từ</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {fillScore}/{content.fillInTheBlank.length}
                </p>
              </div>
            </div>

            {culturalNotes.length > 0 && (
              <div className="text-left bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl mb-8">
                <h3 className="text-lg font-bold text-white mb-4">
                  Sổ tay văn hóa
                </h3>
                <div className="space-y-4">
                  {culturalNotes.map((note, i) => (
                    <div key={i} className="border-l-2 border-emerald-500 pl-4">
                      <h4 className="font-bold text-emerald-400 mb-1">
                        {note.titleVi}
                      </h4>
                      <p className="text-sm text-zinc-300">{note.contentVi}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() =>
                onComplete(
                  Math.round(
                    ((quizScore + fillScore) /
                      (content.comprehensionQuiz.length +
                        content.fillInTheBlank.length)) *
                      100,
                  ),
                )
              }
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg"
            >
              Trở về trang chủ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
