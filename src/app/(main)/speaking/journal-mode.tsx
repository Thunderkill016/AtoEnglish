"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, RotateCcw, BookOpen, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveSpeakingSession } from "@/app/actions/speaking";
import { toast } from "sonner";

const JOURNAL_TOPICS = [
  // A1-A2 level — simple personal topics
  "Mô tả ngày hôm nay của bạn bằng tiếng Anh",
  "Kể về sở thích yêu thích nhất của bạn",
  "Talk about your favorite food and why you like it",
  "What is your daily routine on a weekday?",
  "Describe your family in 5 sentences",
  "What are you grateful for today?",
  // B1 level — slightly more complex
  "Describe your hometown in 3 sentences",
  "What do you want to achieve this year?",
  "Describe a person you admire and why",
  "Talk about a memorable trip you took",
  "Describe your dream job and the skills it requires",
  "What technology do you use every day and how does it help you?",
  // B2 level — opinions and abstract thinking
  "Do you think working from home is better than going to the office? Why?",
  "How has social media changed the way people communicate?",
  "What is one habit you would like to build and why?",
  "Talk about a challenge you overcame and what you learned",
  "If you could live in any country, where would you choose and why?",
  "How important is it to learn a foreign language in today's world?",
];

type RecognitionState = "idle" | "listening" | "processing" | "done";

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onstart?: () => void;
  onresult?: (event: {
    results: {
      [key: number]: { [key: number]: { transcript: string }; isFinal: boolean };
      length: number;
    };
  }) => void;
  onerror?: () => void;
  onend?: () => void;
}

interface SpeechWindow extends Window {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
}

export function JournalMode() {
  const [topic, setTopic] = useState(JOURNAL_TOPICS[0]);
  const [state, setState] = useState<RecognitionState>("idle");
  const [transcript, setTranscript] = useState("");
  const [savedCount, setSavedCount] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionInstance>(null);

  const randomizeTopic = () => {
    const remaining = JOURNAL_TOPICS.filter(t => t !== topic);
    setTopic(remaining[Math.floor(Math.random() * remaining.length)]);
    setTranscript("");
    setState("idle");
  };

  const startListening = () => {
     
    const SpeechRecognition = (window as unknown as SpeechWindow).SpeechRecognition || (window as unknown as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Trình duyệt không hỗ trợ Web Speech API.");
      return;
    }

    const recognition: SpeechRecognitionInstance = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setState("listening");
    recognition.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string }; isFinal: boolean }; length: number } }) => {
      let final = "";
      let interim = "";
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      setTranscript(final + interim);
    };
    recognition.onerror = () => {
      setState("idle");
      toast.error("Lỗi nhận dạng giọng nói.");
    };
    recognition.onend = () => setState(transcript ? "done" : "idle");

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setState("processing");
    setTimeout(() => setState("done"), 500);
  };

  const handleSave = async () => {
    if (!transcript.trim()) return;
    try {
      const res = await saveSpeakingSession({
        practiceType: "journal",
        transcript: transcript.trim(),
        accuracyScore: null,
        duration: wordCount * 0.5, // rough estimate
        scenarioId: null,
      });
      if (res.success) {
        toast.success("Đã lưu nhật ký nói!");
        setSavedCount(p => p + 1);
        setTranscript("");
        setState("idle");
        randomizeTopic();
      } else {
        toast.error(res.error || "Không thể lưu.");
      }
    } catch {
      toast.error("Lỗi hệ thống.");
    }
  };

  const handleReset = () => {
    recognitionRef.current?.stop();
    setTranscript("");
    setState("idle");
  };

  useEffect(() => {
    return () => recognitionRef.current?.stop();
  }, []);

  const wordCount = transcript.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Topic Card */}
      <div className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 sm:p-6 space-y-3 sm:space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              <BookOpen className="size-3.5" /> Chủ đề hôm nay
            </span>
            <p className="text-base sm:text-lg font-black text-foreground leading-snug">{topic}</p>
          </div>
          <button
            onClick={randomizeTopic}
            className="shrink-0 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-muted hover:border-primary/30 transition-all"
          >
            <RotateCcw className="size-3.5" /> Đổi chủ đề
          </button>
        </div>

        {savedCount > 0 && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            ✓ Đã lưu {savedCount} nhật ký trong phiên này
          </div>
        )}
      </div>

      {/* Recording Area */}
      <div className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Mic button */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            {state === "listening" && (
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                animate={{ scale: [1, 1.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
            <button
              onClick={state === "listening" ? stopListening : startListening}
              disabled={state === "processing"}
              className={`relative flex size-20 items-center justify-center rounded-full border-2 transition-all duration-300 shadow-xl ${
                state === "listening"
                  ? "bg-red-500 border-red-400 text-white"
                  : state === "done"
                  ? "bg-emerald-500 border-emerald-400 text-white"
                  : "bg-primary border-primary/50 text-primary-foreground hover:scale-105"
              }`}
            >
              {state === "listening" ? (
                <MicOff className="size-8" />
              ) : (
                <Mic className="size-8" />
              )}
            </button>
          </div>
          <p className="text-xs font-bold text-muted-foreground text-center">
            {state === "idle" && "Nhấn mic để bắt đầu nói tự do"}
            {state === "listening" && (
              <span className="text-red-500 animate-pulse">● Đang ghi âm... nhấn để dừng</span>
            )}
            {state === "processing" && "Đang xử lý..."}
            {state === "done" && `${wordCount} từ đã nói`}
          </p>
        </div>

        {/* Transcript display */}
        <AnimatePresence>
          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl bg-muted/50 border border-border/40 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" /> Transcript
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">{wordCount} words</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons */}
        {state === "done" && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Button
              onClick={handleSave}
              className="w-full sm:flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm"
            >
              <Send className="size-4 mr-2" /> Lưu nhật ký
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              className="h-11 px-4 rounded-xl font-bold border-zinc-200/60 dark:border-zinc-800/60"
            >
              <RotateCcw className="size-4" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Tips */}
      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 text-xs text-muted-foreground space-y-1.5">
        <p className="font-bold text-primary">💡 Mẹo Journal Mode:</p>
        <ul className="space-y-1 list-disc list-inside font-normal">
          <li>Nói ít nhất 30 giây về chủ đề</li>
          <li>Đừng lo sai ngữ pháp — cứ nói tự nhiên</li>
          <li>Mỗi ngày 1 chủ đề = phản xạ tiếng Anh cực nhanh</li>
        </ul>
      </div>
    </div>
  );
}
