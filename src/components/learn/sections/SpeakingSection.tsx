"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, CheckCircle, Lightbulb, Volume2 } from "lucide-react";
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

interface SpeakingSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  playTTS: (text: string) => void;
  goNext: () => void;
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
  const [level2Done, setLevel2Done] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const [isRecognizing, setIsRecognizing] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionObj | null>(null);
  const speechSupported = useSyncExternalStore(
    subscribeToSpeechSupport,
    () => getSpeechRecognition() !== null,
    () => null,
  );

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

  const formattedL1Prompt = unit.speaking.level1Prompt.replace("{input}", nameInput || "______");

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
      setIsLevel1Recording(false);
      setLevel2Recording(false);
      setIsRecognizing(false);
    };

    rec.onend = () => {
      setIsLevel1Recording(false);
      setLevel2Recording(false);
      setIsRecognizing(false);
    };

    rec.onstart = () => setIsRecognizing(true);
    recognitionRef.current = rec;
    rec.start();
  };

  const handleLevel2Record = () => {
    setLevel2Recording(true);
    setLevel2Transcript("");
    setLevel2Score(null);
    // Score against the hint text (strips HTML tags)
    const hintText = unit.speaking.level2Hint
      .replace(/<[^>]*>/g, "")
      .replace(/\[.*?\]/g, "") // strip [tên bạn] and similar placeholders
      .trim();

    startRecognition((text) => {
      setLevel2Transcript(text);
      setLevel2Recording(false);
      const score = calcTranscriptMatchScore(hintText, text);
      setLevel2Score(score);
      if (score >= 60) {
        setLevel2Done(true);
        toast.success(`Độ khớp câu đọc: ${score}%`);
      } else {
        toast.info(`Độ khớp câu đọc: ${score}%. Thử nói lại nhé.`);
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

      {/* Level 1 */}
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
          onChange={(e) => setNameInput(e.target.value)}
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
              {speechSupported === false ? (
                <button
                  onClick={() => setLevel1Done(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
                >
                  <CheckCircle size={16} /> Tôi đã nói thành tiếng
                </button>
              ) : (
                <button
                  disabled={isLevel1Recording || isRecognizing}
                  onClick={() => {
                    setIsLevel1Recording(true);
                    startRecognition((text) => {
                      setLevel1Transcript(text);
                      setIsLevel1Recording(false);
                      const score = calcTranscriptMatchScore(formattedL1Prompt, text);
                      setLevel1Score(score);
                      if (score >= 60) {
                        setLevel1Done(true);
                        toast.success(`Độ khớp câu đọc: ${score}%`);
                      } else {
                        toast.info(`Độ khớp câu đọc: ${score}%. Nghe mẫu rồi thử lại nhé.`);
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
              )}
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
                      Độ khớp câu đọc: {level1Score}%
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

      {/* Level 2 */}
      <div
        className={`border border-border/60 bg-card rounded-2xl p-6 mb-6 transition-all shadow-md ${
          level1Done ? "border-border/60" : "border-border/40 opacity-40 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 text-xs font-bold bg-teal-600/20 text-teal-400 rounded-full">
            Cấp độ 2
          </span>
          <p className="text-foreground font-semibold">Tự giới thiệu / Diễn đạt tự do</p>
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
            onClick={() => setShowHint((p) => !p)}
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

        {level2Transcript && (
          <div className="bg-muted/30 rounded-xl p-3 mb-3">
            <p className="text-xs text-muted-foreground mb-1">Bạn vừa nói:</p>
            <p className="text-foreground text-sm">&ldquo;{level2Transcript}&rdquo;</p>
            {level2Score !== null && (
              <div className="mt-2 flex items-center gap-2">
                <div
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    level2Score >= 70
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  Độ khớp câu đọc: {level2Score}%
                </div>
                <span className="text-xs text-muted-foreground">
                  {level2Score >= 70 ? "Tốt lắm! 🎉" : "Thử lại sẽ tốt hơn 💪"}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {speechSupported === false ? (
            <button
              onClick={() => setLevel2Done(true)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm"
            >
              <CheckCircle size={16} /> Tôi đã tự luyện
            </button>
          ) : (
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
                level2Recording ? "bg-red-600 text-white animate-pulse" : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {level2Recording ? <MicOff size={16} /> : <Mic size={16} />}
              {level2Recording ? "Dừng" : "Bắt đầu nói"}
            </button>
          )}
          {level2Transcript && (
            <button
              onClick={() => setLevel2Done(true)}
              className="px-4 py-3 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-sm transition-colors"
            >
              Tiếp tục
            </button>
          )}
        </div>

        {speechSupported === false && (
          <p className="text-yellow-400 text-xs mt-3 text-center">
            Trình duyệt không hỗ trợ nhận diện giọng nói. Hoạt động tự luyện không được chấm điểm.
          </p>
        )}
        <p className="text-muted-foreground/60 text-xs mt-2 text-center">
          Không sao đâu, cứ thử — mình ở đây để luyện cùng bạn! 💪
        </p>
      </div>

      {level1Done && (level2Done || level2Transcript !== "") && (
        <LessonContinueButton onClick={goNext}>Xem kết quả</LessonContinueButton>
      )}
      {level1Done && !level2Done && level2Transcript === "" && (
        <p className="text-center text-muted-foreground text-sm">Thử nói ở Cấp độ 2 trước khi tiếp tục 🎤</p>
      )}
    </motion.div>
  );
}
