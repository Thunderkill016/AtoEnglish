"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Info,
  MessageSquareText,
  RotateCcw,
  Volume2,
  XCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type {
  CulturalNote,
  PostWatchContent,
  TransferTask,
} from "@/types/real-talk";

type PracticeSection =
  | "quiz"
  | "fill"
  | "speaking"
  | "transfer"
  | "summary";

interface PostWatchPhaseProps {
  content: PostWatchContent;
  culturalNotes: CulturalNote[];
  transferTask?: TransferTask;
  onComplete: (score: number) => void;
}

function normalizeAnswer(value: string) {
  return value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[.,!?;:'’“”"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
}

export default function PostWatchPhase({
  content,
  culturalNotes,
  transferTask,
  onComplete,
}: PostWatchPhaseProps) {
  const [section, setSection] = useState<PracticeSection>("quiz");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [fillIndex, setFillIndex] = useState(0);
  const [fillAnswer, setFillAnswer] = useState("");
  const [fillChecked, setFillChecked] = useState(false);
  const [fillCorrect, setFillCorrect] = useState(0);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [spokenDrillIds, setSpokenDrillIds] = useState<string[]>([]);
  const [transferResponse, setTransferResponse] = useState("");
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  const quiz = content.comprehensionQuiz[quizIndex];
  const fill = content.fillInTheBlank[fillIndex];
  const drill = content.speakingDrills[speakingIndex];

  const transferWordCount = transferResponse.trim()
    ? transferResponse.trim().split(/\s+/).length
    : 0;
  const transferReady = transferWordCount >= 3 && transferConfirmed;

  const finalScore = useMemo(() => {
    const quizTotal = Math.max(1, content.comprehensionQuiz.length);
    const fillTotal = Math.max(1, content.fillInTheBlank.length);
    const comprehension = quizCorrect / quizTotal;
    const retrieval = fillCorrect / fillTotal;
    return Math.round((comprehension * 0.6 + retrieval * 0.4) * 100);
  }, [
    content.comprehensionQuiz.length,
    content.fillInTheBlank.length,
    fillCorrect,
    quizCorrect,
  ]);

  const handleQuizCheck = () => {
    if (quizChoice === null || quizChecked || !quiz) return;
    if (quizChoice === quiz.correctIndex) setQuizCorrect((score) => score + 1);
    setQuizChecked(true);
  };

  const advanceQuiz = () => {
    if (quizIndex < content.comprehensionQuiz.length - 1) {
      setQuizIndex((index) => index + 1);
      setQuizChoice(null);
      setQuizChecked(false);
      return;
    }
    setSection("fill");
  };

  const acceptedFillAnswers = useMemo(() => {
    if (!fill) return [];
    return [fill.answer, ...(fill.alternatives ?? [])].map(normalizeAnswer);
  }, [fill]);

  const fillIsCorrect = acceptedFillAnswers.includes(normalizeAnswer(fillAnswer));

  const handleFillCheck = () => {
    if (!fillAnswer.trim() || fillChecked || !fill) return;
    if (fillIsCorrect) setFillCorrect((score) => score + 1);
    setFillChecked(true);
  };

  const advanceFill = () => {
    if (fillIndex < content.fillInTheBlank.length - 1) {
      setFillIndex((index) => index + 1);
      setFillAnswer("");
      setFillChecked(false);
      return;
    }
    setSection("speaking");
  };

  const confirmSpokenDrill = () => {
    if (!drill) return;
    setSpokenDrillIds((ids) =>
      ids.includes(drill.id) ? ids : [...ids, drill.id],
    );

    if (speakingIndex < content.speakingDrills.length - 1) {
      setSpeakingIndex((index) => index + 1);
      return;
    }

    setSection(transferTask ? "transfer" : "summary");
  };

  const restartCurrentSection = () => {
    if (section === "quiz") {
      setQuizChoice(null);
      setQuizChecked(false);
    }
    if (section === "fill") {
      setFillAnswer("");
      setFillChecked(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-teal-400">
          Sau khi xem
        </p>
        <h2 className="mt-2 text-2xl font-black text-white">
          Hiểu, tự gọi lại, rồi dùng trong tình huống mới
        </h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Xem hiểu chưa đủ. Phần này yêu cầu bạn lấy bằng chứng từ video, nói thành
          tiếng và tạo một phản hồi không chép lại transcript.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-2">
        {[
          ["quiz", "Hiểu"],
          ["fill", "Tự nhớ"],
          ["speaking", "Nói"],
          ["transfer", "Ứng biến"],
        ].map(([key, label]) => {
          const order: PracticeSection[] = [
            "quiz",
            "fill",
            "speaking",
            "transfer",
            "summary",
          ];
          const activeIndex = order.indexOf(section);
          const itemIndex = order.indexOf(key as PracticeSection);
          const complete = activeIndex > itemIndex;
          const active = section === key;
          const disabled = key === "transfer" && !transferTask;

          return (
            <div
              key={key}
              className={cn(
                "rounded-xl border px-2 py-2 text-center text-[11px] font-bold",
                disabled && "opacity-30",
                active && "border-teal-400 bg-teal-500/15 text-teal-200",
                complete && "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
                !active && !complete && "border-zinc-800 bg-zinc-900/60 text-zinc-500",
              )}
            >
              {complete ? "✓ " : ""}
              {label}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {section === "quiz" && quiz && (
          <motion.section
            key={`quiz-${quiz.id}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/75 p-5 sm:p-6"
          >
            <p className="text-xs font-bold text-zinc-500">
              Câu {quizIndex + 1}/{content.comprehensionQuiz.length}
            </p>
            <h3 className="mt-2 text-lg font-black text-white">
              {quiz.questionVi}
            </h3>

            <div className="mt-5 grid gap-3">
              {quiz.options.map((option, index) => {
                const selected = quizChoice === index;
                const correct = index === quiz.correctIndex;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={quizChecked}
                    onClick={() => setQuizChoice(index)}
                    className={cn(
                      "min-h-12 rounded-2xl border px-4 py-3 text-left text-sm transition",
                      !quizChecked && selected &&
                        "border-teal-400 bg-teal-500/10 text-white",
                      !quizChecked && !selected &&
                        "border-zinc-700 bg-zinc-950/40 text-zinc-300 hover:border-zinc-500",
                      quizChecked && correct &&
                        "border-emerald-500 bg-emerald-500/10 text-emerald-100",
                      quizChecked && selected && !correct &&
                        "border-red-500 bg-red-500/10 text-red-100",
                      quizChecked && !selected && !correct &&
                        "border-zinc-800 text-zinc-600",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {quizChecked && (
              <div
                className={cn(
                  "mt-4 flex gap-3 rounded-2xl border p-4 text-sm leading-6",
                  quizChoice === quiz.correctIndex
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                    : "border-red-500/30 bg-red-500/10 text-red-100",
                )}
              >
                {quizChoice === quiz.correctIndex ? (
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                ) : (
                  <XCircle className="mt-0.5 size-5 shrink-0" />
                )}
                <p>{quiz.explanationVi}</p>
              </div>
            )}

            <button
              type="button"
              disabled={quizChoice === null}
              onClick={quizChecked ? advanceQuiz : handleQuizCheck}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 font-black text-white disabled:opacity-40"
            >
              {quizChecked ? "Câu tiếp theo" : "Kiểm tra"}
              <ArrowRight className="size-4" />
            </button>
          </motion.section>
        )}

        {section === "fill" && fill && (
          <motion.section
            key={`fill-${fill.id}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/75 p-5 sm:p-6"
          >
            <p className="text-xs font-bold text-zinc-500">
              Tự gọi lại {fillIndex + 1}/{content.fillInTheBlank.length}
            </p>
            <h3 className="mt-3 text-lg font-black leading-8 text-white">
              {fill.sentence}
            </h3>
            <p className="mt-2 text-sm text-zinc-500">Gợi ý: {fill.hintVi}</p>

            <input
              value={fillAnswer}
              disabled={fillChecked}
              onChange={(event) => setFillAnswer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleFillCheck();
              }}
              className="mt-5 min-h-12 w-full rounded-2xl border border-zinc-700 bg-zinc-950/60 px-4 text-white outline-none focus:border-teal-400"
              placeholder="Nhập phần còn thiếu"
            />

            {fillChecked && (
              <div
                className={cn(
                  "mt-4 rounded-2xl border p-4 text-sm",
                  fillIsCorrect
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100"
                    : "border-red-500/30 bg-red-500/10 text-red-100",
                )}
              >
                {fillIsCorrect
                  ? "Đúng — bạn đã tự gọi lại được ngôn ngữ từ video."
                  : `Chưa khớp. Đáp án có bằng chứng trong nguồn: ${fill.answer}`}
              </div>
            )}

            <div className="mt-5 flex gap-3">
              {fillChecked && !fillIsCorrect && (
                <button
                  type="button"
                  onClick={restartCurrentSection}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-zinc-700 px-4 font-bold text-zinc-300"
                >
                  <RotateCcw className="size-4" /> Thử lại
                </button>
              )}
              <button
                type="button"
                disabled={!fillAnswer.trim()}
                onClick={fillChecked ? advanceFill : handleFillCheck}
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 font-black text-white disabled:opacity-40"
              >
                {fillChecked ? "Tiếp tục" : "Kiểm tra"}
                <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.section>
        )}

        {section === "speaking" && drill && (
          <motion.section
            key={`speaking-${drill.id}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="rounded-3xl border border-zinc-800 bg-zinc-900/75 p-5 text-center sm:p-6"
          >
            <p className="text-xs font-bold text-zinc-500">
              Nói thành tiếng {speakingIndex + 1}/{content.speakingDrills.length}
            </p>
            <p className="mt-5 text-2xl font-black leading-9 text-white">
              “{drill.phrase}”
            </p>
            <p className="mt-2 text-sm text-teal-300">{drill.meaningVi}</p>
            <p className="mx-auto mt-4 max-w-md rounded-2xl bg-zinc-950/50 p-4 text-sm leading-6 text-zinc-400">
              {drill.tipVi}
            </p>

            <button
              type="button"
              onClick={() => speak(drill.phrase)}
              className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-zinc-700 px-4 text-sm font-bold text-zinc-300"
            >
              <Volume2 className="size-4" /> Nghe mẫu câu nguồn
            </button>

            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-left text-xs leading-5 text-amber-100/80">
              <Info className="mr-2 inline size-4" />
              Trang này chưa chấm âm thanh. Chỉ bấm tiếp sau khi bạn đã thực sự nói
              câu trên thành tiếng; hệ thống không giả vờ rằng nút mic là điểm phát âm.
            </div>

            <button
              type="button"
              onClick={confirmSpokenDrill}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 px-4 font-black text-white"
            >
              <CheckCircle2 className="size-5" /> Tôi đã nói thành tiếng
            </button>
          </motion.section>
        )}

        {section === "transfer" && transferTask && (
          <motion.section
            key="transfer"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            className="rounded-3xl border border-purple-500/25 bg-purple-950/25 p-5 sm:p-6"
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">
              Tình huống mới
            </p>
            <h3 className="mt-3 text-xl font-black text-white">
              {transferTask.situationVi}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              {transferTask.promptVi}
            </p>
            <p className="mt-3 text-xs text-purple-200">
              Mục tiêu: {transferTask.learnerGoalVi}
            </p>

            <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Dấu hiệu thành công
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                {transferTask.successCriteriaVi.map((criterion) => (
                  <li key={criterion} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-purple-400" />
                    {criterion}
                  </li>
                ))}
              </ul>
            </div>

            <label htmlFor="real-talk-transfer" className="mt-5 block text-sm font-bold text-white">
              Phản hồi của bạn bằng tiếng Anh
            </label>
            <textarea
              id="real-talk-transfer"
              value={transferResponse}
              onChange={(event) => setTransferResponse(event.target.value)}
              rows={5}
              className="mt-2 w-full rounded-2xl border border-zinc-700 bg-zinc-950/60 px-4 py-3 text-white outline-none focus:border-purple-400"
              placeholder="Tự phản hồi theo tình huống mới, không chép lại toàn bộ transcript..."
            />
            <p className="mt-2 text-right text-xs text-zinc-500">
              {transferWordCount} từ · tối thiểu 3 từ để ghi nhận một lượt thử
            </p>

            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={transferConfirmed}
                onChange={(event) => setTransferConfirmed(event.target.checked)}
                className="mt-1 size-4 accent-purple-500"
              />
              Tôi đã tự tạo phản hồi trước khi xem lại transcript hoặc các câu gợi ý.
            </label>

            <details className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
              <summary className="cursor-pointer text-sm font-bold text-zinc-300">
                Chỉ mở khi thực sự bị kẹt
              </summary>
              <div className="mt-3 space-y-2 text-sm text-purple-200">
                {transferTask.suggestedLanguage.map((phrase) => (
                  <p key={phrase}>• {phrase}</p>
                ))}
              </div>
            </details>

            <button
              type="button"
              disabled={!transferReady}
              onClick={() => setSection("summary")}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-purple-500 px-4 font-black text-white disabled:opacity-40"
            >
              <MessageSquareText className="size-5" /> Ghi nhận lượt transfer
            </button>
          </motion.section>
        )}

        {section === "summary" && (
          <motion.section
            key="summary"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-5"
          >
            <div className="rounded-3xl border border-emerald-500/25 bg-emerald-950/20 p-5 text-center sm:p-6">
              <CheckCircle2 className="mx-auto size-10 text-emerald-400" />
              <h3 className="mt-3 text-2xl font-black text-white">
                Đã hoàn thành một chu trình thật
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Bạn đã nghe hiểu, tự gọi lại, nói thành tiếng
                {transferTask ? " và tạo phản hồi trong ngữ cảnh mới" : ""}.
              </p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl bg-zinc-950/50 p-3">
                  <p className="text-xl font-black text-white">{finalScore}%</p>
                  <p className="text-[11px] text-zinc-500">Hiểu + nhớ</p>
                </div>
                <div className="rounded-2xl bg-zinc-950/50 p-3">
                  <p className="text-xl font-black text-white">
                    {spokenDrillIds.length}/{content.speakingDrills.length}
                  </p>
                  <p className="text-[11px] text-zinc-500">Đã nói</p>
                </div>
                <div className="rounded-2xl bg-zinc-950/50 p-3">
                  <p className="text-xl font-black text-white">
                    {transferTask ? (transferReady ? "1" : "0") : "—"}
                  </p>
                  <p className="text-[11px] text-zinc-500">Transfer</p>
                </div>
              </div>
            </div>

            {culturalNotes.length > 0 && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5">
                <p className="flex items-center gap-2 font-black text-white">
                  <Info className="size-5 text-amber-400" /> Ghi chú bối cảnh
                </p>
                <div className="mt-4 space-y-4">
                  {culturalNotes.map((note) => (
                    <div key={note.titleVi}>
                      <p className="text-sm font-bold text-amber-200">
                        {note.titleVi}
                      </p>
                      <p className="mt-1 text-sm leading-6 text-zinc-400">
                        {note.contentVi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => onComplete(finalScore)}
              className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 font-black text-white"
            >
              Hoàn thành bài học <ArrowRight className="size-5" />
            </button>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
