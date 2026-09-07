"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Lightbulb, Mic, MicOff, Volume2, XCircle } from "lucide-react";
import LessonSectionHeader from "../lesson-ui/LessonSectionHeader";
import LessonContinueButton from "../lesson-ui/LessonContinueButton";
import { lessonSectionMotion } from "../lesson-ui/motion";
import { toast } from "sonner";
import { calcSpeechScore } from "@/lib/utils/speech";
import { SpeechRecognitionFallback } from "@/lib/utils/speech-fallback";
import type { UnitData } from "../UnitTemplate";
import { trackPilotEventPersistentlyOnce } from "@/lib/pilot/pilot-analytics-client";
import {
  evaluateSpeakingTask,
  type SpeakingTaskEvaluation,
} from "@/lib/lessons/speaking-task-evaluation";

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
  resultIndex?: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionObj {
  lang: string;
  interimResults: boolean;
  maxAlternatives?: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeakingSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  playTTS: (text: string) => void;
  goNext: () => void;
}

const UNIT1_INTERACTION_TURNS = [
  {
    alex: "Hi! I'm Alex. What's your name?",
    promptVi: "Chào Alex và nói tên của bạn.",
    fallback: "Hi! My name is Minh.",
  },
  {
    alex: "Nice to meet you. Where are you from?",
    promptVi: "Trả lời bạn đến từ đâu.",
    fallback: "I'm from Vietnam.",
  },
  {
    alex: "I'm from Canada. Now ask me how I am.",
    promptVi: "Hỏi thăm Alex bằng một câu đơn giản.",
    fallback: "How are you?",
  },
  {
    alex: "I'm good, thank you! It was nice meeting you.",
    promptVi: "Kết thúc cuộc gặp một cách lịch sự.",
    fallback: "Nice meeting you too. Goodbye.",
  },
] as const;

function detectMissingCodas(expected: string, actual: string): string[] {
  const missingWarnings: string[] = [];
  const cleanExpected = expected.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
  const cleanActual = actual.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").trim();
  const expectedWords = cleanExpected.split(/\s+/);
  const actualWords = cleanActual.split(/\s+/);

  expectedWords.forEach((word) => {
    if (
      word.endsWith("k") ||
      word.endsWith("t") ||
      word.endsWith("s") ||
      word.endsWith("d") ||
      word.endsWith("ce") ||
      word.endsWith("se")
    ) {
      const baseWordWithoutCoda = word.replace(/(k|t|s|d|ce|se)$/, "");
      const foundOmission = actualWords.some(
        (actualWord) => actualWord === baseWordWithoutCoda && actualWord !== word
      );

      if (foundOmission) {
        let soundExplanation = "";
        if (word.endsWith("k")) soundExplanation = "âm /k/ (ví dụ: 'like' -> 'lai-kờ')";
        else if (word.endsWith("t")) soundExplanation = "âm /t/ (ví dụ: 'cat' -> 'ca-tờ')";
        else if (word.endsWith("s") || word.endsWith("ce") || word.endsWith("se")) {
          soundExplanation = "âm /s/ (ví dụ: 'face' -> 'fây-sờ')";
        } else if (word.endsWith("d")) soundExplanation = "âm /d/ (ví dụ: 'red' -> 're-dờ')";

        missingWarnings.push(`Từ "${word}" phát âm thiếu ${soundExplanation}`);
      }
    }
  });

  return missingWarnings;
}

export default function SpeakingSection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  playTTS,
  goNext,
}: SpeakingSectionProps) {
  const [nameInput, setNameInput] = useState("");
  const [level1Done, setLevel1Done] = useState(false);
  const [isLevel1Recording, setIsLevel1Recording] = useState(false);
  const [level1Score, setLevel1Score] = useState<number | null>(null);
  const [level1Transcript, setLevel1Transcript] = useState("");

  const [level2Transcript, setLevel2Transcript] = useState("");
  const [level2Recording, setLevel2Recording] = useState(false);
  const [level2Score, setLevel2Score] = useState<number | null>(null);
  const [level2TaskEvaluation, setLevel2TaskEvaluation] =
    useState<SpeakingTaskEvaluation | null>(null);
  const [level2Done, setLevel2Done] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [unit1InteractionIndex, setUnit1InteractionIndex] = useState(0);
  const [unit1LearnerTurns, setUnit1LearnerTurns] = useState<string[]>([]);

  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionObj | null>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore browser cleanup errors
        }
      }
    };
  }, []);

  const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;
    const windowWithSpeech = window as unknown as Record<string, unknown>;
    return (
      windowWithSpeech.SpeechRecognition ??
      windowWithSpeech.webkitSpeechRecognition ??
      SpeechRecognitionFallback
    ) as unknown as new () => SpeechRecognitionObj;
  };

  const formattedL1Prompt = unit.speaking.level1Prompt.replace(
    "{input}",
    nameInput || "______"
  );

  const startRecognition = (
    expectedTranscript: string,
    onResult: (text: string) => void
  ) => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
      toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói");
      return;
    }

    if (SpeechRecognitionAPI === SpeechRecognitionFallback) {
      SpeechRecognitionFallback.activeTranscript = expectedTranscript;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      onResult(event.results[0][0].transcript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "aborted") {
        toast.error(`Lỗi nhận diện: ${event.error}`);
      }
      setIsLevel1Recording(false);
      setLevel2Recording(false);
      setIsRecognizing(false);
    };

    recognition.onend = () => {
      setIsLevel1Recording(false);
      setLevel2Recording(false);
      setIsRecognizing(false);
    };

    recognition.onstart = () => setIsRecognizing(true);
    recognitionRef.current = recognition;

    if (unit.unitId === "unit-a0-1") {
      trackPilotEventPersistentlyOnce("first_speaking_started", unit.unitId, {
        source: "lesson",
        unitId: unit.unitId,
      });
    }

    recognition.start();
  };

  const handleUnit1InteractionRecord = () => {
    const restarting = level2TaskEvaluation !== null;
    const currentIndex = restarting ? 0 : unit1InteractionIndex;

    if (restarting) {
      setUnit1LearnerTurns([]);
      setUnit1InteractionIndex(0);
      setLevel2Transcript("");
      setLevel2TaskEvaluation(null);
      setLevel2Done(false);
    }

    const turn = UNIT1_INTERACTION_TURNS[currentIndex];
    setLevel2Recording(true);

    startRecognition(turn.fallback, (text) => {
      const nextTurns = restarting ? [] : [...unit1LearnerTurns];
      nextTurns[currentIndex] = text;
      setUnit1LearnerTurns(nextTurns);
      setLevel2Recording(false);

      const combinedTranscript = nextTurns.filter(Boolean).join(" ");
      setLevel2Transcript(combinedTranscript);

      if (currentIndex < UNIT1_INTERACTION_TURNS.length - 1) {
        setUnit1InteractionIndex(currentIndex + 1);
        return;
      }

      const taskEvaluation = evaluateSpeakingTask(unit.unitId, combinedTranscript);
      if (!taskEvaluation) return;

      setLevel2TaskEvaluation(taskEvaluation);
      setLevel2Done(taskEvaluation.accomplished);
      if (taskEvaluation.accomplished) {
        toast.success(`Hoàn thành hội thoại: ${taskEvaluation.metCount}/${taskEvaluation.total} tiêu chí`);
      } else {
        toast.info(
          `Đã làm được ${taskEvaluation.metCount}/${taskEvaluation.total} tiêu chí — thử lại cuộc hội thoại.`
        );
      }
    });
  };

  const handleLevel2Record = () => {
    if (unit.unitId === "unit-1") {
      handleUnit1InteractionRecord();
      return;
    }
    setLevel2Recording(true);
    setLevel2Transcript("");
    setLevel2Score(null);
    setLevel2TaskEvaluation(null);
    setLevel2Done(false);

    const hintText = unit.speaking.level2Hint
      .replace(/<[^>]*>/g, "")
      .replace(/\[.*?\]/g, "")
      .trim();

    startRecognition(hintText, (text) => {
      setLevel2Transcript(text);
      setLevel2Recording(false);

      const taskEvaluation = evaluateSpeakingTask(unit.unitId, text);
      if (taskEvaluation) {
        setLevel2TaskEvaluation(taskEvaluation);
        setLevel2Done(taskEvaluation.accomplished);
        if (taskEvaluation.accomplished) {
          toast.success(`Hoàn thành nhiệm vụ: ${taskEvaluation.metCount}/${taskEvaluation.total} tiêu chí`);
        } else {
          toast.info(
            `Đã làm được ${taskEvaluation.metCount}/${taskEvaluation.total} tiêu chí — xem phần còn thiếu rồi thử lại.`
          );
        }
        return;
      }

      const score = calcSpeechScore(hintText, text);
      setLevel2Score(score);

      if (unit.unitId === "unit-a0-1") {
        trackPilotEventPersistentlyOnce("first_speaking_completed", unit.unitId, {
          source: "lesson",
          unitId: unit.unitId,
          score,
          passed: score >= 60,
        });
      }

      if (score >= 60) {
        setLevel2Done(true);
        toast.success(`Tốt lắm! ${score}%`);
      } else {
        toast.info(`${score}% — Thử nói lại nhé!`);
      }
    });
  };

  return (
    <motion.div
      key="s7"
      initial={lessonSectionMotion.initial}
      animate={lessonSectionMotion.animate}
      exit={lessonSectionMotion.exit}
      transition={lessonSectionMotion.transition}
    >
      <LessonSectionHeader
        sectionId={7}
        sectionOrderIdx={sectionOrderIdx}
        totalSections={TOTAL_SECTIONS}
      />

      <div className="border border-border/60 bg-card rounded-2xl p-4 sm:p-6 mb-4 sm:mb-5 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-xs font-bold bg-emerald-600/20 text-emerald-400 rounded-full">
            Cấp độ 1
          </span>
          <p className="text-foreground font-semibold">Nói theo khung</p>
          {level1Done && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
        </div>

        <div className="border border-border/60 bg-muted/40 rounded-2xl p-4 mb-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/3 to-transparent pointer-events-none" />
          <p className="text-muted-foreground text-xs mb-2 uppercase tracking-widest font-bold">
            Hãy nói to câu sau:
          </p>
          <p className="text-foreground text-base sm:text-xl font-bold leading-snug">
            {formattedL1Prompt}
          </p>
        </div>

        <input
          type="text"
          placeholder={unit.speaking.level1Placeholder}
          value={nameInput}
          onChange={(event) => setNameInput(event.target.value)}
          className="w-full bg-muted/40 border border-border/60 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 mb-3 focus:outline-none focus:border-emerald-500 transition-colors"
        />

        {nameInput && (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => playTTS(formattedL1Prompt)}
                aria-label="Nghe mẫu"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/60 text-foreground font-semibold text-sm transition-all duration-200 active:scale-95"
              >
                <Volume2 size={16} /> Nghe mẫu
              </button>
              <button
                disabled={isLevel1Recording || isRecognizing}
                onClick={() => {
                  setIsLevel1Recording(true);
                  startRecognition(formattedL1Prompt, (text) => {
                    setLevel1Transcript(text);
                    setIsLevel1Recording(false);
                    const score = calcSpeechScore(formattedL1Prompt, text);
                    const missingCodas = detectMissingCodas(formattedL1Prompt, text);
                    setLevel1Score(score);
                    if (score >= 60) {
                      setLevel1Done(true);
                      if (missingCodas.length > 0) {
                        toast.warning(`Tốt! ${score}%. Lưu ý: ${missingCodas[0]}`);
                      } else {
                        toast.success(`Tốt lắm! ${score}%`);
                      }
                    } else if (missingCodas.length > 0) {
                      toast.error(`Chưa đạt (${score}%). Lỗi: ${missingCodas.join(", ")}`);
                    } else {
                      toast.info(`${score}% — Không sao, thử lại nhé!`);
                    }
                  });
                }}
                aria-label="Luyện nói"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                  isLevel1Recording
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md active:scale-95"
                }`}
              >
                {isLevel1Recording ? (
                  <>
                    <MicOff size={16} /> Đang nghe...
                  </>
                ) : (
                  <>
                    <Mic size={16} /> Luyện nói
                  </>
                )}
              </button>
            </div>

            {level1Transcript && (
              <div className="bg-muted/30 rounded-xl px-4 py-3 text-sm">
                <p className="text-muted-foreground text-[10px] mb-1 font-bold">BẠN VỪA NÓI:</p>
                <p className="text-foreground">&ldquo;{level1Transcript}&rdquo;</p>
                {level1Score !== null && (
                  <div className="flex items-center gap-2 mt-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        level1Score >= 60
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {level1Score}% khớp transcript mẫu
                    </span>
                    {level1Score < 60 && (
                      <button
                        onClick={() => {
                          setLevel1Score(null);
                          setLevel1Transcript("");
                        }}
                        className="text-[10px] text-muted-foreground hover:text-foreground font-bold"
                      >
                        Thử lại
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {level1Done && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle size={14} /> Hoàn thành cấp độ 1!
              </div>
            )}

            {!level1Done && level1Score !== null && level1Score < 60 && (
              <button
                onClick={() => setLevel1Done(true)}
                className="w-full text-muted-foreground hover:text-foreground text-xs font-bold py-2 transition-colors"
              >
                Bỏ qua và tiếp tục →
              </button>
            )}
          </div>
        )}
      </div>

      <div
        className={`border border-border/60 bg-card rounded-2xl p-6 mb-6 transition-all shadow-md ${
          level1Done ? "border-border/60" : "border-border/40 opacity-40 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-xs font-bold bg-teal-600/20 text-teal-400 rounded-full">
            Cấp độ 2
          </span>
          <p className="text-foreground font-semibold">Thực hiện nhiệm vụ giao tiếp</p>
          {level2Done && <CheckCircle size={16} className="text-emerald-400 ml-auto" />}
        </div>

        <div className="border border-border/60 bg-muted/40 rounded-2xl p-4 mb-4">
          <p className="text-xs font-bold text-teal-400 mb-2 uppercase tracking-widest">
            📍 Tình huống:
          </p>
          <p className="text-foreground text-sm italic">&ldquo;{unit.speaking.level2Situation}&rdquo;</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setShowHint((previous) => !previous)}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <Lightbulb size={12} />
            {showHint ? "Ẩn gợi ý" : "Xem gợi ý"}
          </button>
        </div>

        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-l-4 border-primary/40 bg-muted/30 rounded-r-xl p-3 mb-4 overflow-hidden"
            >
              <p
                className="text-foreground text-sm"
                dangerouslySetInnerHTML={{ __html: unit.speaking.level2Hint }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {unit.unitId === "unit-1" && (
          <div className="space-y-3 mb-4" aria-label="Hội thoại với Alex">
            {UNIT1_INTERACTION_TURNS.map((turn, index) => {
              const learnerText = unit1LearnerTurns[index];
              const isCurrent = index === unit1InteractionIndex && !level2TaskEvaluation;
              if (index > unit1InteractionIndex && !learnerText && !level2TaskEvaluation) return null;

              return (
                <div key={turn.alex} className="space-y-2">
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-muted/60 border border-border/60 px-4 py-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-teal-400 mb-1">Alex</p>
                    <p className="text-sm text-foreground">{turn.alex}</p>
                  </div>
                  {learnerText ? (
                    <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-primary/10 border border-primary/20 px-4 py-3">
                      <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1">Bạn</p>
                      <p className="text-sm text-foreground">{learnerText}</p>
                    </div>
                  ) : isCurrent ? (
                    <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md border border-dashed border-primary/30 bg-primary/5 px-4 py-3">
                      <p className="text-xs text-muted-foreground">{turn.promptVi}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {level2TaskEvaluation && (
              <div className="mt-3 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-foreground">Kết quả nhiệm vụ giao tiếp</p>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${level2TaskEvaluation.accomplished ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                    {level2TaskEvaluation.metCount}/{level2TaskEvaluation.total}
                  </span>
                </div>
                {level2TaskEvaluation.criteria.map((criterion) => (
                  <div key={criterion.id} className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/30 px-3 py-2">
                    {criterion.met ? <CheckCircle size={14} className="mt-0.5 shrink-0 text-emerald-400" /> : <XCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />}
                    <span className="text-xs text-muted-foreground">{criterion.labelVi}</span>
                  </div>
                ))}
                <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                  Đây là phản hồi luyện tập theo nhiệm vụ giao tiếp, không phải chứng nhận bạn đã đạt CEFR A1.
                </p>
              </div>
            )}
          </div>
        )}

        {unit.unitId !== "unit-1" && level2Transcript && (
          <div className="bg-muted/30 rounded-xl p-3 mb-3">
            <p className="text-xs text-muted-foreground mb-1">Bạn vừa nói:</p>
            <p className="text-foreground text-sm">&ldquo;{level2Transcript}&rdquo;</p>

            {level2TaskEvaluation ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold text-foreground">Hoàn thành nhiệm vụ</p>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full ${
                      level2TaskEvaluation.accomplished
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-amber-500/15 text-amber-400"
                    }`}
                  >
                    {level2TaskEvaluation.metCount}/{level2TaskEvaluation.total}
                  </span>
                </div>
                {level2TaskEvaluation.criteria.map((criterion) => (
                  <div
                    key={criterion.id}
                    className="flex items-start gap-2 rounded-lg border border-border/50 bg-background/30 px-3 py-2"
                  >
                    {criterion.met ? (
                      <CheckCircle size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="mt-0.5 shrink-0 text-amber-400" />
                    )}
                    <span className="text-xs text-muted-foreground">{criterion.labelVi}</span>
                  </div>
                ))}
                <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                  Đây là phản hồi luyện tập theo nhiệm vụ giao tiếp, không phải chứng nhận bạn đã đạt CEFR A1.
                </p>
              </div>
            ) : level2Score !== null ? (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    level2Score >= 70
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  Khớp transcript mẫu: {level2Score}%
                </div>
                <span className="text-xs text-muted-foreground">
                  {level2Score >= 70 ? "Tốt lắm! 🎉" : "Thử lại sẽ tốt hơn 💪"}
                </span>
              </div>
            ) : null}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={
              level2Recording
                ? () => {
                    recognitionRef.current?.stop();
                    setLevel2Recording(false);
                  }
                : handleLevel2Record
            }
            aria-label={level2Recording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${
              level2Recording
                ? "bg-red-600 text-white animate-pulse"
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            }`}
          >
            {level2Recording ? <MicOff size={16} /> : <Mic size={16} />}
            {level2Recording
              ? "Dừng"
              : unit.unitId === "unit-1"
                ? level2TaskEvaluation
                  ? "Thử lại từ đầu"
                  : `Trả lời Alex (${unit1InteractionIndex + 1}/${UNIT1_INTERACTION_TURNS.length})`
                : level2Transcript
                  ? "Thử lại"
                  : "Bắt đầu nói"}
          </button>
          {level2Transcript && (
            <button
              onClick={() => setLevel2Done(true)}
              className="px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-colors"
            >
              Tiếp tục
            </button>
          )}
        </div>

        {!getSpeechRecognition() && (
          <p className="text-yellow-400 text-xs mt-3 text-center">
            ⚠️ Trình duyệt không hỗ trợ ghi âm. Thử Chrome hoặc Edge.
          </p>
        )}
        <p className="text-muted-foreground/60 text-xs mt-2 text-center">
          Mục tiêu là truyền đạt đủ ý trong tình huống, không phải đọc giống hệt câu mẫu.
        </p>
      </div>

      {level1Done && (level2Done || (unit.unitId !== "unit-1" && level2Transcript !== "")) && (
        <LessonContinueButton onClick={goNext}>Xem kết quả</LessonContinueButton>
      )}
      {level1Done && !level2Done && (unit.unitId === "unit-1" || level2Transcript === "") && (
        <p className="text-center text-muted-foreground text-sm">
          Thử nói ở Cấp độ 2 trước khi tiếp tục 🎤
        </p>
      )}
    </motion.div>
  );
}
