"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Volume2, Mic, MicOff, ChevronRight } from "lucide-react";
import { MinimalButton } from "@/components/design-system";
import LessonSectionHeader from "../lesson-ui/LessonSectionHeader";
import LessonContinueButton from "../lesson-ui/LessonContinueButton";
import { lessonSectionMotion } from "../lesson-ui/motion";
import { toast } from "sonner";
import { calcTranscriptMatchScore } from "@/lib/utils/speech";
import type { UnitData } from "../UnitTemplate";

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

const subscribeToSpeechSupport = () => () => {};

function getSpeechRecognition() {
  if (typeof window === "undefined") return null;
  const browserWindow = window as unknown as Record<string, unknown>;
  return (browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null) as
    | (new () => SpeechRecognitionObj)
    | null;
}

interface ShadowingSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  shadowScores: Record<number, number>;
  setShadowScores: React.Dispatch<React.SetStateAction<Record<number, number>>>;
  shadowDone: boolean;
  setShadowDone: React.Dispatch<React.SetStateAction<boolean>>;
  playTTS: (text: string, rate?: number) => void;
  goNext: () => void;
}

export default function ShadowingSection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  shadowScores,
  setShadowScores,
  shadowDone,
  setShadowDone,
  playTTS,
  goNext,
}: ShadowingSectionProps) {
  const [shadowDialogueIdx, setShadowDialogueIdx] = useState(0);
  const [shadowLineIdx, setShadowLineIdx] = useState(0);
  const [shadowSpeed, setShadowSpeed] = useState(1.0);
  const [shadowTranscripts, setShadowTranscripts] = useState<Record<number, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isRecognizing, setIsRecognizing] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionObj | null>(null);
  const DIALOGUES = unit.dialogues;
  const speechSupported = useSyncExternalStore(
    subscribeToSpeechSupport,
    () => getSpeechRecognition() !== null,
    () => null,
  );

  const shadowValues = Object.values(shadowScores);
  const shadowAvg = shadowValues.length > 0
    ? Math.round(shadowValues.reduce((a, b) => a + b, 0) / shadowValues.length)
    : null;

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch { /* ignore */ }
      }
    };
  }, []);

  const startRecognition = (onResult: (text: string) => void) => {
    const SpeechRecognitionAPI = getSpeechRecognition();
    if (!SpeechRecognitionAPI) {
      toast.error("Trình duyệt không hỗ trợ nhận diện giọng nói");
      return;
    }

    const rec = new SpeechRecognitionAPI();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const text = e.results[0][0].transcript;
      onResult(text);
    };

    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== "aborted") {
        toast.error(`Lỗi nhận diện: ${e.error}`);
      }
      setIsRecording(false);
      setIsRecognizing(false);
    };

    rec.onend = () => {
      setIsRecording(false);
      setIsRecognizing(false);
    };

    rec.onstart = () => setIsRecognizing(true);
    recognitionRef.current = rec;
    rec.start();
  };

  const handleShadowRecord = () => {
    if (DIALOGUES.length === 0) return;
    const targetLine = DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx];
    setIsRecording(true);
    startRecognition((text) => {
      const score = calcTranscriptMatchScore(targetLine.text, text);
      setShadowScores((p) => ({ ...p, [shadowLineIdx]: score }));
      setShadowTranscripts((p) => ({ ...p, [shadowLineIdx]: text }));
      setIsRecording(false);
      if (score >= 70) {
        toast.success(`Độ khớp câu đọc: ${score}%`);
      } else {
        toast.info(`Độ khớp câu đọc: ${score}%. Nghe mẫu rồi thử lại nhé.`);
      }
    });
  };

  const handleShadowNext = () => {
    if (DIALOGUES.length === 0) return;
    const lines = DIALOGUES[shadowDialogueIdx].lines;
    if (shadowLineIdx < lines.length - 1) {
      setShadowLineIdx((p) => p + 1);
    } else {
      setShadowDone(true);
    }
  };

  return (
    <motion.div
      key="s6"
      initial={lessonSectionMotion.initial}
      animate={lessonSectionMotion.animate}
      exit={lessonSectionMotion.exit}
      transition={lessonSectionMotion.transition}
    >
      <LessonSectionHeader
        sectionId={6}
        sectionOrderIdx={sectionOrderIdx}
        totalSections={TOTAL_SECTIONS}
      />

      {DIALOGUES.length > 0 && !shadowDone ? (
        <div className="border border-border/60 bg-card rounded-2xl p-4 sm:p-6 shadow-lg">
          {/* Dialogue selector tabs */}
          {DIALOGUES.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {DIALOGUES.map((dlg, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (idx === shadowDialogueIdx) return;
                    setShadowDialogueIdx(idx);
                    setShadowLineIdx(0);
                    setShadowScores({});
                    setShadowTranscripts({});
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                    idx === shadowDialogueIdx
                      ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600"
                      : "bg-muted border-border/60 text-muted-foreground hover:border-primary/60 hover:text-foreground"
                  }`}
                >
                  Hội thoại {idx + 1}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between text-xs text-muted-foreground mb-2 font-bold">
            <span>Tiến độ dòng hội thoại</span>
            <span>
              {shadowLineIdx + 1}/{DIALOGUES[shadowDialogueIdx].lines.length}
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${
                  (shadowLineIdx / DIALOGUES[shadowDialogueIdx].lines.length) * 100
                }%`,
              }}
            />
          </div>

          <div className="border border-border/60 bg-muted/40 rounded-2xl p-5 mb-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/3 to-transparent pointer-events-none" />
            <span className="absolute top-3 left-3 text-[10px] font-bold text-violet-600 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-full uppercase tracking-wide">
              {DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].speaker}
            </span>
            <p className="text-muted-foreground text-[10px] mb-3 uppercase tracking-widest font-black">
              Hãy nghe rồi nói lại
            </p>
            <p className="text-foreground text-base sm:text-xl font-bold mb-2 leading-snug">
              {DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].text}
            </p>
            <p className="text-muted-foreground text-sm italic">
              {DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].translation}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={() =>
                playTTS(DIALOGUES[shadowDialogueIdx].lines[shadowLineIdx].text, shadowSpeed)
              }
              aria-label="Nghe mẫu"
              className="w-14 h-14 rounded-full bg-muted/40 hover:bg-muted/60 hover:scale-105 text-foreground flex items-center justify-center transition-all duration-200 border border-border/60 shadow-md active:scale-95"
            >
              <Volume2 size={22} />
            </button>

            <button
              onClick={
                isRecording
                  ? () => {
                      recognitionRef.current?.stop();
                      setIsRecording(false);
                    }
                  : handleShadowRecord
              }
              disabled={isRecognizing && !isRecording}
              aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105 text-white shadow-lg shadow-emerald-950/50"
              }`}
            >
              {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
            </button>

            <button
              onClick={() => setShadowSpeed((s) => (s === 1.0 ? 0.75 : 1.0))}
              className="px-4 py-2 rounded-xl bg-muted border border-border/60 text-xs font-bold text-foreground hover:bg-muted/60 transition-colors"
            >
              {shadowSpeed === 1.0 ? "Normal Speed" : "🐢 Chậm (0.75x)"}
            </button>
          </div>

          {shadowTranscripts[shadowLineIdx] && (
            <div className="border border-border/60 bg-muted/40 rounded-2xl p-4 mb-6 text-center shadow-sm">
              <p className="text-[10px] text-muted-foreground mb-1 font-bold">BẠN VỪA NÓI:</p>
              <p className="text-foreground text-sm font-semibold mb-2">
                &ldquo;{shadowTranscripts[shadowLineIdx]}&rdquo;
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/10 mb-3">
                Độ khớp câu đọc: {shadowScores[shadowLineIdx]}%
              </div>
            </div>
          )}

          {speechSupported === false && (
            <div className="border border-amber-500/30 bg-amber-500/10 rounded-xl p-4 mb-4 text-sm text-amber-200">
              Trình duyệt này không hỗ trợ nhận diện giọng nói. Hãy nghe, nói lại thành tiếng rồi tiếp tục; phần này sẽ không được chấm điểm.
            </div>
          )}

          {shadowScores[shadowLineIdx] !== undefined && (
            <MinimalButton
              type="button"
              fullWidth
              className="!rounded-xl"
              onClick={handleShadowNext}
            >
              {shadowLineIdx < DIALOGUES[shadowDialogueIdx].lines.length - 1
                ? "Dòng tiếp theo"
                : "Hoàn thành phần Shadowing"}
              <ChevronRight size={16} />
            </MinimalButton>
          )}
          {speechSupported === false && shadowScores[shadowLineIdx] === undefined && (
            <MinimalButton type="button" fullWidth className="!rounded-xl" onClick={handleShadowNext}>
              Tôi đã tự luyện, tiếp tục
              <ChevronRight size={16} />
            </MinimalButton>
          )}
        </div>
      ) : (
        <div className="text-center mb-4 sm:mb-6 border border-border/60 bg-card rounded-2xl p-5 sm:p-8 shadow-md">
          <div className="text-4xl mb-3">🎉</div>
          <p className="text-emerald-400 font-bold text-lg mb-1">Hoàn thành Shadowing!</p>
          <p className="text-muted-foreground text-sm mb-6">
            {shadowAvg === null ? "Đã luyện, không có điểm" : `Độ khớp câu đọc trung bình: ${shadowAvg}%`}
          </p>
          <LessonContinueButton onClick={goNext}>Tiếp tục luyện nói</LessonContinueButton>
        </div>
      )}
    </motion.div>
  );
}
