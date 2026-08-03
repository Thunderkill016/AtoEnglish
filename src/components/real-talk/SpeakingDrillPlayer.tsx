"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Volume2, Info, RefreshCw, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { SpeakingDrill, SpeakingDrillResult } from "@/types/real-talk";

interface SpeakingDrillPlayerProps {
  drill: SpeakingDrill;
  onComplete: (result: SpeakingDrillResult) => void;
}

// Ensure SpeechRecognition types are available
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

function computeTranscriptMatch(
  recognized: string,
  target: string,
): { score: number; matched: string[]; missing: string[]; extra: string[] } {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean);
  const targetWords = normalize(target);
  const recognizedWords = normalize(recognized);
  const targetSet = new Set(targetWords);
  const recognizedSet = new Set(recognizedWords);
  const matched = targetWords.filter((w) => recognizedSet.has(w));
  const missing = targetWords.filter((w) => !recognizedSet.has(w));
  const extra = recognizedWords.filter((w) => !targetSet.has(w));
  const score =
    targetWords.length > 0
      ? Math.round((matched.length / targetWords.length) * 100)
      : 0;
  return { score, matched, missing, extra };
}

export function SpeakingDrillPlayer({
  drill,
  onComplete,
}: SpeakingDrillPlayerProps) {
  const [isSupported] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  });
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<{
    score: number;
    matched: string[];
    missing: string[];
    extra: string[];
  } | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
          const matchResult = computeTranscriptMatch(
            transcriptText,
            drill.phrase,
          );
          setResult(matchResult);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [drill.phrase]);

  const playTTS = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      setTranscript("");
      setResult(null);
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSkip = () => {
    onComplete({
      drillId: drill.id,
      status: "unscored",
      matchScore: null,
    });
  };

  const handleContinue = () => {
    if (result) {
      onComplete({
        drillId: drill.id,
        status: "matched",
        matchScore: result.score,
      });
    } else {
      handleSkip();
    }
  };

  const renderWords = () => {
    if (!result) return null;

    const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    
    // Original words
    const originalWords = drill.phrase.split(/\s+/);
    
    return (
      <div className="flex flex-wrap justify-center gap-2 text-xl font-medium mt-4">
        {originalWords.map((word, i) => {
          const normWord = normalize(word);
          const isMatched = result.matched.includes(normWord);
          return (
            <span
              key={i}
              className={cn(
                "px-1 rounded",
                isMatched ? "text-emerald-400" : "text-red-400 line-through opacity-80"
              )}
            >
              {word}
            </span>
          );
        })}
        {result.extra.length > 0 && (
          <div className="w-full text-sm text-zinc-500 mt-2 flex flex-wrap justify-center gap-1">
            <span className="mr-1">Từ dư thừa:</span>
            {result.extra.map((word, i) => (
              <span key={i} className="line-through">{word}</span>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-xl flex flex-col items-center w-full max-w-xl mx-auto">
      <div className="flex justify-between w-full mb-4">
        <span className="text-zinc-400 text-sm flex items-center gap-1">
          {isSupported ? (
             <span className="flex items-center gap-1"><Mic size={14}/> Luyện nói</span>
          ) : (
            <span className="flex items-center gap-1"><Volume2 size={14}/> Tự luyện</span>
          )}
        </span>
      </div>

      <button
        onClick={() => playTTS(drill.phrase)}
        className="size-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/30 transition-colors mb-6"
        title="Nghe mẫu"
      >
        <Volume2 size={32} />
      </button>

      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
        {drill.phrase}
      </h3>
      <p className="text-zinc-400 mb-6 text-center text-lg">{drill.meaningVi}</p>

      {drill.tipVi && (
        <div className="bg-amber-950/30 border border-amber-500/30 p-4 rounded-xl text-sm text-amber-200/90 w-full mb-8">
          <span className="font-bold text-amber-500 block mb-1">
            Mẹo phát âm:
          </span>
          {drill.tipVi}
        </div>
      )}

      {isSupported ? (
        <div className="w-full flex flex-col items-center">
          {!result ? (
            <button
              onClick={toggleRecording}
              className={cn(
                "flex items-center gap-3 py-4 px-8 rounded-full font-bold text-lg transition-all mb-4",
                isRecording
                  ? "bg-red-500/20 text-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg hover:shadow-blue-500/20"
              )}
            >
              {isRecording ? (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Mic size={24} className="fill-red-500" />
                  </motion.div>
                  Đang nghe...
                </>
              ) : (
                <>
                  <Mic size={24} /> Nhấn để nói
                </>
              )}
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex flex-col items-center bg-zinc-950/50 p-6 rounded-xl border border-zinc-800"
              >
                <div className="flex items-center gap-2 mb-2 group relative">
                  <span className="text-sm text-zinc-400">Điểm so khớp từ</span>
                  <div className="text-zinc-500 hover:text-zinc-300 cursor-help">
                    <Info size={14} />
                  </div>
                  <div className="absolute bottom-full mb-2 w-48 p-2 bg-zinc-800 text-xs text-zinc-300 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 left-1/2 -translate-x-1/2 text-center">
                    Đây là điểm so sánh từ ngữ, không phải chấm phát âm
                  </div>
                </div>

                <div
                  className={cn(
                    "text-5xl font-black mb-4",
                    result.score >= 80
                      ? "text-emerald-400"
                      : result.score >= 50
                        ? "text-amber-400"
                        : "text-red-400"
                  )}
                >
                  {result.score}
                </div>

                {renderWords()}

                <div className="flex gap-3 w-full mt-8">
                  <button
                    onClick={toggleRecording}
                    className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <RefreshCw size={18} /> Thử lại
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    Tiếp tục <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {!result && !isRecording && (
            <button
              onClick={handleSkip}
              className="mt-4 text-sm text-zinc-500 hover:text-zinc-300"
            >
              Bỏ qua
            </button>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center p-6 bg-zinc-950/50 rounded-xl border border-zinc-800 text-center">
          <p className="text-amber-400 mb-6 font-medium">
            Trình duyệt không hỗ trợ nhận diện giọng nói
          </p>
          <p className="text-zinc-400 mb-8 text-sm">
            Bạn có thể tự nghe mẫu và luyện tập đọc to nhé.
          </p>
          
          <button
            onClick={handleSkip}
            className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            Đã tự luyện xong <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
