"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Cpu,
  PenTool,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  CheckCircle,
  HelpCircle,
  Loader2,
  Mic,
  Play,
  Pause,
  VolumeX,
  Check,
  Award,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveCardToSRS } from "@/app/actions/cards";
import { completeUnit, getUnitCompletionStatus } from "@/app/actions/progress";
import { UNIT_1_DATA } from "@/lib/data/unit1";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

interface MatchCard {
  id: string;
  text: string;
  type: "en" | "vn";
  matchId: string;
}

export default function Unit1Page() {
  // Phases: input -> processing -> output -> review
  const [activePhase, setActivePhase] = useState<"input" | "processing" | "output" | "review">("input");
  const [isUnitCompleted, setIsUnitCompleted] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  // General settings
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [speakingLineId, setSpeakingLineId] = useState<string | null>(null);

  // Phase 1 (Input) state
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const playAllTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Matching game state
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedMatchCard, setSelectedMatchCard] = useState<MatchCard | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mismatchedIds, setMismatchedIds] = useState<string[]>([]);

  // Phase 2 (Processing) state
  const [vocabIndex, setVocabIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  // To Be verb exercises state
  const [toBeAnswers, setToBeAnswers] = useState<Record<string, string>>({});
  const [toBeResults, setToBeResults] = useState<Record<string, boolean | null>>({});

  // Cloze exercises state
  const [clozeAnswers, setClozeAnswers] = useState<Record<string, string>>({});
  const [clozeResults, setClozeResults] = useState<Record<string, boolean | null>>({});

  // Phase 3 (Output) state
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(0);
  const [shadowSentenceIndex, setShadowSentenceIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);

  // Roleplay state
  const [roleplayActive, setRoleplayActive] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleplayStep, setRoleplayStep] = useState<number>(0);

  // Phase 4 (Review) state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [addedVocab, setAddedVocab] = useState<string[]>([]);
  const [savingVocab, setSavingVocab] = useState<string | null>(null);

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Web Speech API Ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const activeScenario = UNIT_1_DATA.dialogueScenarios[selectedScenarioIndex];

  // Initialize and check status
  useEffect(() => {
    async function checkStatus() {
      const res = await getUnitCompletionStatus("unit-1");
      if (res.success && res.completed) {
        setIsUnitCompleted(true);
      }
    }
    checkStatus();
    initializeMatchingGame();
  }, []);

  // Set up Speech Recognition on active states change
  useEffect(() => {
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsRecognizing(true);
        setSpeechTranscript("");
        setAccuracyScore(null);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setSpeechTranscript(resultText);
        
        // Calculate accuracy score
        const targetText = roleplayActive
          ? activeScenario.lines[roleplayStep].text_en
          : activeScenario.lines[shadowSentenceIndex].text_en;
        
        const score = calculateAccuracyScore(targetText, resultText);
        setAccuracyScore(score);

        if (score >= 80) {
          toast.success(`Phát âm chính xác! Điểm: ${score}%`);
          confetti({
            particleCount: 20,
            spread: 40,
            origin: { y: 0.8 }
          });
        } else if (score >= 50) {
          toast.warning(`Tạm được. Điểm: ${score}%. Thử lại để cải thiện nhé.`);
        } else {
          toast.error(`Chưa chính xác. Điểm: ${score}%. Hãy nghe lại audio mẫu.`);
        }
      };

      rec.onerror = () => {
        toast.error("Không thể nhận diện giọng nói. Vui lòng kiểm tra microphone.");
        setIsRecognizing(false);
      };

      rec.onend = () => {
        setIsRecognizing(false);
      };

      recognitionRef.current = rec;
    }
  }, [shadowSentenceIndex, roleplayActive, roleplayStep, selectedScenarioIndex, activeScenario.lines]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (playAllTimerRef.current) {
        clearTimeout(playAllTimerRef.current);
      }
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize / shuffle matching cards
  const initializeMatchingGame = () => {
    const cards: MatchCard[] = [];
    UNIT_1_DATA.matchingGreetings.forEach((g) => {
      cards.push({ id: `${g.id}-en`, text: g.en, type: "en", matchId: g.id });
      cards.push({ id: `${g.id}-vn`, text: g.vn, type: "vn", matchId: g.id });
    });
    // Shuffle cards
    const shuffled = cards.sort(() => Math.random() - 0.5);
    setMatchCards(shuffled);
    setMatchedIds([]);
    setSelectedMatchCard(null);
  };

  // Text-To-Speech function
  const playTTS = (text: string, rate: number = 1.0, lineId: string | null = null) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Trình duyệt không hỗ trợ phát âm âm thanh (TTS).");
      return;
    }
    window.speechSynthesis.cancel();
    
    if (lineId) {
      setSpeakingLineId(lineId);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;

    utterance.onend = () => {
      setSpeakingLineId(null);
    };

    utterance.onerror = () => {
      setSpeakingLineId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // String similarity calculation (Word match algorithm)
  const calculateAccuracyScore = (target: string, spoken: string): number => {
    const clean = (str: string) =>
      str
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
        .trim()
        .split(/\s+/);

    const targetWords = clean(target);
    const spokenWords = clean(spoken);

    let matches = 0;
    targetWords.forEach((word) => {
      if (spokenWords.includes(word)) {
        matches++;
      }
    });

    return Math.round((matches / Math.max(targetWords.length, 1)) * 100);
  };

  // Stepper phase handler
  const handlePhaseChange = (phase: typeof activePhase) => {
    if (playAllTimerRef.current) {
      clearTimeout(playAllTimerRef.current);
      setIsPlayingAll(false);
    }
    window.speechSynthesis.cancel();
    setSpeakingLineId(null);
    setActivePhase(phase);

    if (phase === "review") {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Play dialogue step-by-step automatically
  const handlePlayAllDialogue = () => {
    const lines = activeScenario.lines;
    if (isPlayingAll) {
      if (playAllTimerRef.current) clearTimeout(playAllTimerRef.current);
      window.speechSynthesis.cancel();
      setIsPlayingAll(false);
      setSpeakingLineId(null);
      return;
    }

    setIsPlayingAll(true);
    let index = 0;
    setDialogueIndex(0);

    const playNextLine = () => {
      if (index >= lines.length) {
        setIsPlayingAll(false);
        setSpeakingLineId(null);
        return;
      }
      
      const line = lines[index];
      setDialogueIndex(index);
      
      // Calculate length based on text duration (roughly 120ms per character)
      const duration = Math.max(2000, line.text_en.length * 90 / playbackSpeed + 1000);
      
      playTTS(line.text_en, playbackSpeed, line.id);
      
      index++;
      playAllTimerRef.current = setTimeout(playNextLine, duration);
    };

    playNextLine();
  };

  // Matching game handler
  const handleMatchCardClick = (card: MatchCard) => {
    if (matchedIds.includes(card.matchId) || mismatchedIds.length > 0) return;

    if (!selectedMatchCard) {
      setSelectedMatchCard(card);
      return;
    }

    if (selectedMatchCard.id === card.id) {
      setSelectedMatchCard(null);
      return;
    }

    // Check if correct match
    if (selectedMatchCard.matchId === card.matchId && selectedMatchCard.type !== card.type) {
      // Match found
      setMatchedIds((prev) => [...prev, card.matchId]);
      setSelectedMatchCard(null);

      // Play audio of English card if matched
      const enCard = card.type === "en" ? card : selectedMatchCard;
      playTTS(enCard.text);

      if (matchedIds.length + 1 === UNIT_1_DATA.matchingGreetings.length) {
        toast.success("Tuyệt vời! Bạn đã ghép thành công toàn bộ các cụm từ.");
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    } else {
      // Mismatch
      setMismatchedIds([selectedMatchCard.id, card.id]);
      setTimeout(() => {
        setMismatchedIds([]);
        setSelectedMatchCard(null);
      }, 800);
    }
  };

  // To Be exercise check
  const handleCheckToBe = (id: string, correctAns: string) => {
    const userAns = toBeAnswers[id] || "";
    const isCorrect = userAns === correctAns;
    setToBeResults((prev) => ({ ...prev, [id]: isCorrect }));

    if (isCorrect) {
      toast.success("Chính xác!");
      confetti({
        particleCount: 15,
        spread: 30,
        origin: { y: 0.8 }
      });
    } else {
      toast.error("Chưa chính xác. Thử lại nhé!");
    }
  };

  // Cloze checker
  const handleCheckCloze = (id: string, correctAns: string) => {
    const userAns = clozeAnswers[id]?.trim().toLowerCase() || "";
    const isCorrect = userAns === correctAns.toLowerCase();
    setClozeResults((prev) => ({ ...prev, [id]: isCorrect }));

    if (isCorrect) {
      toast.success("Đáp án chính xác!");
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.8 }
      });
    } else {
      toast.error("Đáp án chưa chính xác. Thử lại nhé!");
    }
  };

  // Recording audio logic
  const handleStartRecording = async () => {
    setRecordedAudioUrl(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(audioUrl);
        // Stop stream tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Đang ghi âm... Hãy đọc to câu mẫu.");

      // Start speech recognition concurrently
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch {
      toast.error("Không thể truy cập microphone. Vui lòng cho phép quyền.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Đã dừng ghi âm.");
    }
    if (recognitionRef.current && isRecognizing) {
      recognitionRef.current.stop();
    }
  };

  const handlePlayUserAudio = () => {
    if (recordedAudioUrl) {
      const audio = new Audio(recordedAudioUrl);
      audio.play();
    }
  };

  // Roleplay logic
  const startRoleplay = (role: string) => {
    setUserRole(role);
    setRoleplayActive(true);
    setRoleplayStep(0);
    setSpeechTranscript("");
    setAccuracyScore(null);
    
    // Auto start first speaker if it is not the user
    const firstLine = activeScenario.lines[0];
    if (firstLine.speaker !== role) {
      setTimeout(() => {
        playTTS(firstLine.text_en, playbackSpeed, firstLine.id);
      }, 500);
    } else {
      toast.info(`Bạn vào vai ${role}. Click 'Nói câu này' để đọc câu đầu tiên.`);
    }
  };

  const nextRoleplayStep = () => {
    const nextStep = roleplayStep + 1;
    if (nextStep >= activeScenario.lines.length) {
      toast.success("Chúc mừng! Bạn đã hoàn thành hội thoại nhập vai!");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      setRoleplayActive(false);
      setUserRole(null);
      return;
    }

    setRoleplayStep(nextStep);
    setSpeechTranscript("");
    setAccuracyScore(null);

    const nextLine = activeScenario.lines[nextStep];
    const isBotTurn = nextLine.speaker !== userRole;

    if (isBotTurn) {
      setTimeout(() => {
        playTTS(nextLine.text_en, playbackSpeed, nextLine.id);
      }, 800);
    } else {
      toast.info(`Đến lượt bạn. Hãy đọc to câu của ${userRole}.`);
    }
  };

  // Review & Submit
  const handleSaveToSRS = async (word: string, phonetic: string, meaning: string, example: string) => {
    if (addedVocab.includes(word)) {
      toast.info(`Từ "${word}" đã được lưu trong SRS.`);
      return;
    }

    setSavingVocab(word);
    try {
      const res = await saveCardToSRS({
        word,
        phonetic,
        meaning_vn: meaning,
        example_en: example,
        topic: "Greetings",
        level: "A1",
      });

      if (res.success) {
        setAddedVocab((prev) => [...prev, word]);
        toast.success(res.message);
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { x: 0.9, y: 0.9 }
        });
      } else {
        toast.error(res.error || "Không thể lưu từ vựng.");
      }
    } catch {
      toast.error("Có lỗi xảy ra khi lưu từ vựng.");
    } finally {
      setSavingVocab(null);
    }
  };

  const handleCompleteUnit1 = async () => {
    setIsCompleting(true);
    try {
      const res = await completeUnit("unit-1");
      if (res.success) {
        setIsUnitCompleted(true);
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.6 }
        });
        toast.success("Chúc mừng! Bạn đã học xong Unit 1 và nhận được 80 XP.");
      } else {
        toast.error(res.error || "Không thể lưu tiến trình bài học.");
      }
    } catch {
      toast.error("Lỗi khi gửi kết quả hoàn thành bài học.");
    } finally {
      setIsCompleting(false);
    }
  };

  // Progress percentage logic
  const calculateProgress = () => {
    switch (activePhase) {
      case "input": return 25;
      case "processing": return 50;
      case "output": return 75;
      case "review": return 100;
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      {/* Background ambient blurs */}
      <div className="absolute top-10 left-10 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-foreground/[0.05]"
      >
        <div className="space-y-1">
          <Link href="/learn" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
            <ArrowLeft className="size-3.5" /> Quay lại lộ trình
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 uppercase">
              Starter
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              {UNIT_1_DATA.duration}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
            {UNIT_1_DATA.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {UNIT_1_DATA.subtitle}
          </p>
        </div>

        {/* Progress Card */}
        <div className="w-full sm:w-72 space-y-2 bg-white/40 border border-zinc-100 dark:border-zinc-800 backdrop-blur-md p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between text-xs text-muted-foreground font-bold">
            <span>Tiến độ Unit 1</span>
            <span className="text-foreground">{calculateProgress()}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${calculateProgress()}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stepper Navigation */}
      <div className="bg-white/40 border border-zinc-100 dark:border-zinc-800 p-1.5 rounded-2xl shadow-sm grid grid-cols-2 md:flex md:flex-nowrap gap-1">
        {[{ id: "input", title: "1. Input", icon: BookOpen, desc: "Hội thoại & Ghép từ" },
          { id: "processing", title: "2. Processing", icon: Cpu, desc: "Flashcard & To Be" },
          { id: "output", title: "3. Output", icon: PenTool, desc: "Shadowing & Nhập vai" },
          { id: "review", title: "4. Review", icon: RotateCcw, desc: "Quiz 10 câu & Lưu FSRS" }].map((step) => {
          const Icon = step.icon;
          const isActive = activePhase === step.id;

          return (
            <button
              key={step.id}
              onClick={() => handlePhaseChange(step.id as typeof activePhase)}
              className="flex-1 min-w-0 text-left p-3 rounded-xl transition-all relative overflow-hidden group select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-emerald-500/10 border border-emerald-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 140, damping: 20 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-muted text-muted-foreground group-hover:bg-foreground/[0.05]"
                }`}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <h3 className={`font-bold text-[10px] sm:text-xs uppercase tracking-wider ${isActive ? "text-emerald-700 dark:text-emerald-500" : "text-foreground"} truncate`}>
                    {step.title}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground font-normal line-clamp-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Content Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Input */}
            {activePhase === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white p-6 sm:p-8 space-y-8 shadow-sm"
              >
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      <BookOpen className="size-5 text-emerald-600" />
                      Pha 1.1: Đọc & Nghe hội thoại chính
                    </h3>
                    
                    {/* Speed & Control Panel */}
                    <div className="flex items-center gap-2">
                      <div className="flex border border-zinc-100 rounded-lg overflow-hidden text-xs">
                        {[0.8, 1.0, 1.2].map((s) => (
                          <button
                            key={s}
                            onClick={() => setPlaybackSpeed(s)}
                            className={`px-2 py-1.5 font-bold transition-all ${
                              playbackSpeed === s
                                ? "bg-emerald-600 text-white"
                                : "bg-muted text-muted-foreground hover:bg-foreground/[0.05]"
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                      
                      <Button
                        onClick={handlePlayAllDialogue}
                        variant={isPlayingAll ? "destructive" : "outline"}
                        size="sm"
                        className="rounded-lg text-xs gap-1.5 h-8 font-semibold"
                      >
                        {isPlayingAll ? (
                          <>
                            <VolumeX className="size-3.5" /> Dừng phát
                          </>
                        ) : (
                          <>
                            <Volume2 className="size-3.5" /> Phát hội thoại
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Dialogue Container */}
                  <div className="space-y-4">
                    {activeScenario.lines.map((line, idx) => {
                      const isSpeaking = speakingLineId === line.id;
                      const isSelected = dialogueIndex === idx;

                      return (
                        <div
                          key={line.id}
                          onClick={() => {
                            setDialogueIndex(idx);
                            playTTS(line.text_en, playbackSpeed, line.id);
                          }}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSpeaking 
                              ? "bg-emerald-50/50 border-emerald-500/30 shadow-sm"
                              : isSelected
                              ? "bg-muted/40 border-zinc-200"
                              : "bg-white border-zinc-100 hover:bg-zinc-50/50"
                          }`}
                        >
                          <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                            line.speaker === "Alex" || line.speaker === "Bob" || line.speaker === "Mr. Brown"
                              ? "bg-blue-100 text-blue-800" 
                              : "bg-pink-100 text-pink-800"
                          }`}>
                            {line.speaker[0]}
                          </span>
                          
                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-xs text-muted-foreground">
                                {line.speaker}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                (Click to listen)
                              </span>
                            </div>
                            
                            <p className="text-sm font-semibold text-foreground leading-relaxed">
                              {line.text_en}
                            </p>
                            <p className="text-xs text-muted-foreground font-normal">
                              {line.text_vn}
                            </p>
                          </div>

                          <button 
                            className={`size-7 rounded-lg flex items-center justify-center border ${
                              isSpeaking 
                                ? "bg-emerald-600 text-white border-emerald-600 animate-pulse" 
                                : "bg-muted border-zinc-100 text-zinc-500 hover:text-foreground"
                            }`}
                          >
                            <Volume2 className="size-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Matching Game activity */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                      <Sparkles className="size-4.5 text-emerald-600" />
                      Pha 1.2: Ghép cặp câu chào hỏi ({matchedIds.length}/{UNIT_1_DATA.matchingGreetings.length})
                    </h3>
                    <Button variant="ghost" size="sm" onClick={initializeMatchingGame} className="text-xs font-bold text-emerald-700 hover:bg-emerald-50 h-8 rounded-lg">
                      Chơi lại
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ghép thẻ tiếng Anh với nghĩa tiếng Việt tương ứng:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {matchCards.map((card) => {
                      const isMatched = matchedIds.includes(card.matchId);
                      const isSelected = selectedMatchCard?.id === card.id;
                      const isMismatched = mismatchedIds.includes(card.id);

                      return (
                        <button
                          key={card.id}
                          onClick={() => handleMatchCardClick(card)}
                          className={`p-3 h-20 rounded-xl border text-xs font-bold transition-all relative overflow-hidden flex items-center justify-center ${
                            isMatched
                              ? "bg-emerald-100 border-emerald-300 text-emerald-900 opacity-60"
                              : isMismatched
                              ? "bg-red-100 border-red-300 text-red-900 animate-shake"
                              : isSelected
                              ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20"
                              : "bg-white border-zinc-100 text-foreground hover:bg-zinc-50/50 hover:border-zinc-200"
                          }`}
                        >
                          {isMatched && (
                            <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                              <Check className="size-2.5" />
                            </div>
                          )}
                          <span className="text-center line-clamp-2">{card.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-end">
                  <Button onClick={() => handlePhaseChange("processing")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 font-semibold h-11 px-5 shadow-sm">
                    <span>Tiếp tục: Processing</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Processing */}
            {activePhase === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white p-6 sm:p-8 space-y-8 shadow-sm"
              >
                {/* Micro-Phase 1: Vocabulary Flashcard */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                    <Cpu className="size-5 text-emerald-600" />
                    Pha 2.1: Flashcards tương tác ({vocabIndex + 1}/{UNIT_1_DATA.vocab.length})
                  </h3>
                  
                  <div className="flex flex-col items-center gap-4">
                    {/* Flippable Card */}
                    <div 
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full max-w-sm h-48 [perspective:1000px] cursor-pointer"
                    >
                      <div className={`relative w-full h-full text-center transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
                        {/* Front Side */}
                        <div className="absolute inset-0 w-full h-full bg-muted/30 border border-zinc-100 rounded-2xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider mb-2">
                            {UNIT_1_DATA.vocab[vocabIndex].level} - {UNIT_1_DATA.vocab[vocabIndex].topic}
                          </span>
                          <h4 className="text-xl font-black text-foreground uppercase tracking-tight">
                            {UNIT_1_DATA.vocab[vocabIndex].word}
                          </h4>
                          <p className="text-xs text-zinc-500 italic mt-1 font-mono">
                            {UNIT_1_DATA.vocab[vocabIndex].phonetic}
                          </p>
                          <span className="text-[10px] text-zinc-400 font-bold mt-6 uppercase tracking-wider">
                            Chạm để xem nghĩa tiếng Việt
                          </span>
                        </div>
                        {/* Back Side */}
                        <div className="absolute inset-0 w-full h-full bg-emerald-600 border border-emerald-700 text-white rounded-2xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <h4 className="text-sm font-bold">Ý nghĩa:</h4>
                          <p className="text-lg font-black mt-1">
                            {UNIT_1_DATA.vocab[vocabIndex].meaning_vn}
                          </p>
                          
                          <div className="mt-4 max-w-xs text-[11px] text-emerald-50 opacity-90 leading-relaxed italic bg-emerald-700/50 p-2 rounded-lg">
                            Ex: {UNIT_1_DATA.vocab[vocabIndex].example_en}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Nav controls & Speak word */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={vocabIndex === 0}
                        onClick={() => {
                          setVocabIndex(prev => prev - 1);
                          setIsFlipped(false);
                        }}
                        className="rounded-lg border-zinc-100 h-9"
                      >
                        Trước
                      </Button>

                      <Button
                        onClick={() => playTTS(UNIT_1_DATA.vocab[vocabIndex].word)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg gap-1.5 h-9 font-semibold hover:text-emerald-600 hover:bg-emerald-50 border-zinc-100"
                      >
                        <Volume2 className="size-4" /> Phát âm
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={vocabIndex === UNIT_1_DATA.vocab.length - 1}
                        onClick={() => {
                          setVocabIndex(prev => prev + 1);
                          setIsFlipped(false);
                        }}
                        className="rounded-lg border-zinc-100 h-9"
                      >
                        Tiếp
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Micro-Phase 2: Grammar Theory & selection exercise */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <h3 className="font-bold text-base text-foreground">
                    {"Pha 2.2: Ngữ pháp Động từ 'To Be' (am / is / are)"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    {UNIT_1_DATA.grammar.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-zinc-100 bg-muted/20 space-y-3">
                        <h4 className="font-bold text-sm text-emerald-800 dark:text-emerald-400">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                          {item.explanation}
                        </p>
                        
                        <div className="space-y-1.5 pt-2 border-t border-foreground/[0.03] text-xs">
                          {item.examples.map((ex, exIdx) => (
                            <div key={exIdx} className="space-y-0.5">
                              <p className="font-semibold text-foreground">
                                • {ex.en}
                              </p>
                              <p className="text-zinc-500 font-normal">
                                {ex.vn}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* am/is/are exercises */}
                  <div className="space-y-3 pt-3">
                    <p className="text-xs font-bold text-zinc-600">Chọn đúng am / is / are để hoàn thành câu:</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {UNIT_1_DATA.toBeExercises.map((ex) => {
                        const result = toBeResults[ex.id];
                        return (
                          <div key={ex.id} className="p-3 border border-zinc-100 rounded-xl bg-white flex items-center justify-between gap-3 shadow-xs">
                            <div className="text-xs font-bold flex-1 text-foreground">
                              {ex.sentence_before}
                              <select
                                value={toBeAnswers[ex.id] || ""}
                                onChange={(e) => setToBeAnswers(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                className={`mx-1 px-1.5 py-0.5 rounded border focus:outline-none focus:ring-1 ${
                                  result === true
                                    ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                    : result === false
                                    ? "border-red-500 bg-red-50 text-red-800"
                                    : "border-zinc-200"
                                }`}
                              >
                                <option value="">---</option>
                                {ex.options.map((opt) => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                              {ex.sentence_after}
                            </div>
                            
                            <Button
                              size="sm"
                              onClick={() => handleCheckToBe(ex.id, ex.answer)}
                              className="rounded-lg h-7 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                            >
                              Check
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Micro-Phase 3: Cloze Fill-in-the-blanks */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <h3 className="font-bold text-base text-foreground">
                    Pha 2.3: Luyện tập ngữ pháp (Cloze test)
                  </h3>

                  <div className="space-y-4">
                    {UNIT_1_DATA.cloze.map((cloze) => {
                      const result = clozeResults[cloze.id];
                      return (
                        <div key={cloze.id} className="p-4 rounded-2xl border border-zinc-100 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 text-sm font-semibold text-foreground">
                            {cloze.sentence_before}
                            <input
                              type="text"
                              value={clozeAnswers[cloze.id] || ""}
                              onChange={(e) => setClozeAnswers(prev => ({ ...prev, [cloze.id]: e.target.value }))}
                              placeholder="..."
                              className={`w-20 mx-1 px-2 py-0.5 rounded border text-center font-bold focus:outline-none focus:ring-1 ${
                                result === true 
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-950 focus:ring-emerald-500" 
                                  : result === false
                                  ? "border-red-500 bg-red-50 text-red-950 focus:ring-red-500"
                                  : "border-zinc-200 focus:ring-emerald-500"
                              }`}
                            />
                            {cloze.sentence_after}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {result === true && (
                              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                                <Check className="size-3.5" /> Đúng
                              </span>
                            )}
                            {result === false && (
                              <span className="text-red-500 font-bold text-xs font-semibold">
                                Sai (Nhập lại)
                              </span>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleCheckCloze(cloze.id, cloze.answer)}
                              className="rounded-lg h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                            >
                              Kiểm tra
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex justify-between gap-4">
                  <Button onClick={() => handlePhaseChange("input")} variant="outline" className="rounded-xl h-11 px-5 gap-1.5 border-zinc-200">
                    <ArrowLeft className="size-4" />
                    <span>Quay lại Input</span>
                  </Button>
                  <Button onClick={() => handlePhaseChange("output")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 font-semibold h-11 px-5 shadow-sm">
                    <span>Tiếp tục: Output</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Output */}
            {activePhase === "output" && (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white p-6 sm:p-8 space-y-8 shadow-sm"
              >
                {/* Scenario selection bar */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-zinc-500">Chọn tình huống hội thoại mẫu:</span>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {UNIT_1_DATA.dialogueScenarios.map((sc, idx) => (
                      <button
                        key={sc.id}
                        disabled={roleplayActive}
                        onClick={() => {
                          setSelectedScenarioIndex(idx);
                          setShadowSentenceIndex(0);
                          setRecordedAudioUrl(null);
                          setSpeechTranscript("");
                          setAccuracyScore(null);
                        }}
                        className={`p-3 text-left border rounded-xl transition-all text-xs font-bold flex flex-col justify-between ${
                          selectedScenarioIndex === idx
                            ? "bg-emerald-50/50 border-emerald-500 text-emerald-950"
                            : "bg-white border-zinc-100 hover:bg-zinc-50/50"
                        } ${roleplayActive ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="font-bold truncate">{sc.title}</span>
                        <span className="text-[10px] text-zinc-400 font-normal line-clamp-1 mt-1">{sc.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Part 1: Advanced Shadowing & Recording */}
                {!roleplayActive ? (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100">
                      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        <PenTool className="size-5 text-emerald-600" />
                        Pha 3.1: Shadowing nâng cao & Ghi âm so sánh
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nghe câu mẫu của kịch bản đã chọn, click Ghi âm và nói theo. Hệ thống sẽ chấm điểm phát âm của bạn.
                      </p>
                    </div>

                    {/* Sentence selector & player */}
                    <div className="p-5 rounded-2xl bg-muted/20 border border-zinc-100 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-zinc-500">
                          Câu thoại {shadowSentenceIndex + 1}/{activeScenario.lines.length}
                        </span>
                        <div className="flex border border-zinc-100 rounded-lg overflow-hidden text-[10px]">
                          {activeScenario.lines.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setShadowSentenceIndex(idx);
                                setRecordedAudioUrl(null);
                                setSpeechTranscript("");
                                setAccuracyScore(null);
                              }}
                              className={`px-2 py-1 font-bold ${
                                shadowSentenceIndex === idx
                                  ? "bg-emerald-600 text-white"
                                  : "bg-white text-zinc-500 hover:bg-zinc-50"
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="text-center py-2 space-y-1">
                        <p className="text-lg font-black text-foreground">
                          &ldquo;{activeScenario.lines[shadowSentenceIndex].text_en}&rdquo;
                        </p>
                        <p className="text-xs text-muted-foreground font-normal">
                          {activeScenario.lines[shadowSentenceIndex].text_vn}
                        </p>
                      </div>

                      <div className="flex justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => playTTS(activeScenario.lines[shadowSentenceIndex].text_en)}
                          className="rounded-lg h-9 gap-1.5 border-zinc-200 text-xs font-semibold"
                        >
                          <Volume2 className="size-4" /> Nghe Audio mẫu
                        </Button>
                      </div>
                    </div>

                    {/* Recording & Accuracy panel */}
                    <div className="flex flex-col items-center justify-center p-6 border border-zinc-100 rounded-2xl bg-muted/10 space-y-5">
                      <div className="flex items-center gap-4">
                        {!isRecording ? (
                          <Button
                            onClick={handleStartRecording}
                            className="size-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                          >
                            <Mic className="size-7" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleStopRecording}
                            className="size-16 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white flex items-center justify-center shadow-md animate-pulse active:scale-95 transition-all"
                          >
                            <div className="size-5 rounded bg-white" />
                          </Button>
                        )}
                      </div>

                      <div className="text-center">
                        <p className="text-xs text-muted-foreground font-semibold">
                          {isRecording ? "Đang lắng nghe... Hãy nói đi!" : isRecognizing ? "Đang xử lý giọng nói..." : "Click nút đỏ để Bắt đầu ghi âm & chấm điểm"}
                        </p>
                      </div>

                      {/* User audio playback */}
                      {recordedAudioUrl && (
                        <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-100">
                          <span className="text-xs font-bold text-emerald-800 px-2">Ghi âm của bạn:</span>
                          <Button
                            size="sm"
                            onClick={handlePlayUserAudio}
                            className="rounded-lg h-8 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                          >
                            <Play className="size-3.5" /> Nghe lại
                          </Button>
                        </div>
                      )}

                      {/* Web Speech Transcript & Accuracy Score */}
                      {(speechTranscript || accuracyScore !== null) && (
                        <div className="w-full max-w-md p-4 rounded-xl border border-zinc-100 bg-white space-y-3">
                          {speechTranscript && (
                            <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Từ nhận diện được:</span>
                              <p className="text-sm font-semibold italic text-foreground">&ldquo;{speechTranscript}&rdquo;</p>
                            </div>
                          )}
                          
                          {accuracyScore !== null && (
                            <div className="flex items-center justify-between pt-2 border-t border-zinc-50">
                              <span className="text-xs font-bold text-zinc-500">Điểm phát âm chính xác:</span>
                              <span className={`text-base font-black ${
                                accuracyScore >= 80 
                                  ? "text-emerald-600" 
                                  : accuracyScore >= 50
                                  ? "text-amber-500"
                                  : "text-red-500"
                              }`}>
                                {accuracyScore}%
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Button trigger roleplay */}
                    <div className="pt-4 flex justify-center">
                      <Button
                        onClick={() => {
                          // Select default first speaker role
                          const playerRole = activeScenario.lines[1].speaker;
                          startRoleplay(playerRole);
                        }}
                        variant="outline"
                        className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-11 px-5 font-bold gap-2"
                      >
                        <MessageCircle className="size-4.5" /> Bắt đầu Nhập vai hội thoại này (Roleplay)
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Roleplay simulation mode
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100 flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                          <MessageCircle className="size-5 text-emerald-600" />
                          Nhập vai: {activeScenario.title} ({roleplayStep + 1}/{activeScenario.lines.length})
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          Bạn đóng vai **{userRole}**. Đọc to câu thoại của bạn để đối thoại với Bot.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRoleplayActive(false)}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-bold"
                      >
                        Thoát
                      </Button>
                    </div>

                    {/* Active roleplay steps */}
                    <div className="space-y-5">
                      <div className="space-y-3 bg-muted/10 p-5 rounded-2xl border border-zinc-100">
                        {activeScenario.lines.map((line, idx) => {
                          if (idx > roleplayStep) return null;
                          const isUserTurn = line.speaker === userRole;
                          const isCurrent = idx === roleplayStep;

                          return (
                            <div
                              key={line.id}
                              className={`p-3.5 rounded-xl border flex gap-3 ${
                                isUserTurn 
                                  ? "bg-emerald-50/20 border-emerald-100 ml-6" 
                                  : "bg-blue-50/20 border-blue-100 mr-6"
                              } ${isCurrent ? "ring-2 ring-emerald-500/30" : ""}`}
                            >
                              <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                line.speaker === "Alex" || line.speaker === "Bob" || line.speaker === "Mr. Brown"
                                  ? "bg-blue-100 text-blue-800" 
                                  : "bg-pink-100 text-pink-800"
                              }`}>
                                {line.speaker[0]}
                              </span>
                              
                              <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-[10px] text-muted-foreground">
                                    {line.speaker} {isUserTurn ? "(Bạn)" : "(Máy)"}
                                  </span>
                                  {!isUserTurn && isCurrent && (
                                    <button 
                                      onClick={() => playTTS(line.text_en, playbackSpeed, line.id)}
                                      className="size-5 rounded bg-muted border flex items-center justify-center text-zinc-500"
                                    >
                                      <Volume2 className="size-3" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs sm:text-sm font-semibold text-foreground">
                                  {line.text_en}
                                </p>
                                {(!isCurrent || !isUserTurn) && (
                                  <p className="text-[10px] text-muted-foreground">
                                    {line.text_vn}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* User speaking controller for current step */}
                      {activeScenario.lines[roleplayStep].speaker === userRole ? (
                        <div className="flex flex-col items-center p-4 border border-emerald-100 bg-emerald-50/10 rounded-xl space-y-4">
                          <p className="text-xs font-bold text-emerald-800">
                            Đọc câu của bạn ở trên, bấm mic để nói:
                          </p>
                          
                          <div className="flex items-center gap-3">
                            {!isRecording ? (
                              <Button
                                onClick={handleStartRecording}
                                className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5 px-4 shadow-sm"
                              >
                                <Mic className="size-4" /> Nói câu này
                              </Button>
                            ) : (
                              <Button
                                onClick={handleStopRecording}
                                className="h-10 rounded-xl bg-zinc-900 hover:bg-zinc-950 text-white font-bold text-xs gap-1.5 px-4 animate-pulse"
                              >
                                <Pause className="size-4" /> Dừng & Check
                              </Button>
                            )}

                            {accuracyScore !== null && accuracyScore >= 50 && (
                              <Button
                                onClick={nextRoleplayStep}
                                className="h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs gap-1 px-4"
                              >
                                Câu tiếp theo <ChevronRight className="size-3.5" />
                              </Button>
                            )}
                          </div>

                          {speechTranscript && (
                            <p className="text-xs italic text-zinc-500">
                              Nhận diện: &ldquo;{speechTranscript}&rdquo; {accuracyScore !== null && `(Độ chính xác: ${accuracyScore}%)`}
                            </p>
                          )}
                        </div>
                      ) : (
                        // Bot turn display next button
                        <div className="flex justify-center">
                          <Button
                            onClick={nextRoleplayStep}
                            className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-10 px-5 gap-1 text-xs"
                          >
                            <span>Tiếp tục hội thoại</span>
                            <ChevronRight className="size-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-zinc-100 flex justify-between gap-4">
                  <Button onClick={() => handlePhaseChange("processing")} variant="outline" className="rounded-xl h-11 px-5 gap-1.5 border-zinc-200">
                    <ArrowLeft className="size-4" />
                    <span>Quay lại Processing</span>
                  </Button>
                  <Button onClick={() => handlePhaseChange("review")} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-1.5 font-semibold h-11 px-5 shadow-sm">
                    <span>Tiếp tục: Review</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {activePhase === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white p-6 sm:p-8 space-y-8 shadow-sm"
              >
                
                {/* Part 1: Multiple Choice Quiz (10 questions) */}
                <div className="space-y-6">
                  <div className="pb-4 border-b border-zinc-100">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      <RotateCcw className="size-5 text-emerald-600" />
                      Pha 4.1: Kiểm tra cuối bài (Quick Quiz 10 câu)
                    </h3>
                  </div>

                  <div className="space-y-5">
                    {UNIT_1_DATA.quiz.map((q, qIdx) => {
                      const selectedOpt = quizAnswers[q.id];
                      return (
                        <div key={q.id} className="space-y-3 border-b border-zinc-50 pb-4 last:border-b-0">
                          <p className="text-sm font-bold text-foreground">
                            {qIdx + 1}. {q.question}
                          </p>
                          
                          <div className="grid gap-2 sm:grid-cols-2">
                            {q.options.map((opt) => {
                              const isSelected = selectedOpt === opt;
                              const isCorrect = opt === q.answer;
                              let btnClass = "border-zinc-100 bg-white hover:bg-zinc-50/50 text-foreground";
                              
                              if (quizSubmitted) {
                                if (isCorrect) {
                                  btnClass = "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold";
                                } else if (isSelected) {
                                  btnClass = "border-red-500 bg-red-50 text-red-950 font-bold";
                                }
                              } else if (isSelected) {
                                btnClass = "border-emerald-600 bg-emerald-50/30 text-emerald-800 font-bold";
                              }

                              return (
                                <button
                                  key={opt}
                                  disabled={quizSubmitted}
                                  onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                  className={`p-3 rounded-xl border text-left text-xs transition-all ${btnClass}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <div className="flex justify-center pt-2">
                      <Button
                        onClick={() => {
                          setQuizSubmitted(true);
                          // Calculate score
                          let score = 0;
                          UNIT_1_DATA.quiz.forEach(q => {
                            if (quizAnswers[q.id] === q.answer) score++;
                          });
                          if (score === UNIT_1_DATA.quiz.length) {
                            toast.success("Tuyệt vời! Bạn đã trả lời đúng tất cả 10 câu hỏi.");
                            confetti({
                              particleCount: 100,
                              spread: 80,
                              origin: { y: 0.6 }
                            });
                          } else {
                            toast.warning(`Bạn đúng ${score}/${UNIT_1_DATA.quiz.length} câu. Hãy ôn tập lại những câu sai nhé.`);
                          }
                        }}
                        className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-11 px-8 text-xs shadow-sm"
                      >
                        Nộp bài trắc nghiệm (10 câu)
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-center pt-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setQuizSubmitted(false);
                          setQuizAnswers({});
                        }}
                        className="rounded-xl border-zinc-200 font-bold h-10 px-6 text-xs"
                      >
                        Làm lại trắc nghiệm
                      </Button>
                    </div>
                  )}
                </div>

                {/* Part 2: Push vocabulary into FSRS card deck */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <h3 className="font-bold text-base text-foreground">
                    Pha 4.2: Lưu 12 từ vựng vào Hộp thẻ ôn tập FSRS
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Chọn các từ vựng dưới đây để thêm vào kho ôn tập Spaced Repetition (FSRS) của bạn để ôn lại hàng ngày.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {UNIT_1_DATA.vocab.map((item) => {
                      const isAdded = addedVocab.includes(item.word);
                      const isSaving = savingVocab === item.word;

                      return (
                        <div key={item.word} className="p-3 border border-zinc-100 rounded-xl bg-muted/10 flex items-center justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-foreground uppercase truncate">
                              {item.word}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">
                              {item.meaning_vn}
                            </p>
                          </div>
                          
                          <Button
                            size="sm"
                            disabled={isAdded || isSaving}
                            onClick={() => handleSaveToSRS(item.word, item.phonetic, item.meaning_vn, item.example_en)}
                            className={`rounded-lg h-8 px-2.5 text-[10px] font-bold ${
                              isAdded 
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" 
                                : "bg-emerald-600 hover:bg-emerald-700 text-white"
                            }`}
                          >
                            {isSaving ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : isAdded ? (
                              <span className="flex items-center gap-0.5"><Check className="size-3" /> Đã lưu</span>
                            ) : (
                              "Lưu SRS"
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Part 3: Complete Unit action button */}
                <div className="space-y-4 pt-8 border-t border-zinc-100 flex flex-col items-center justify-center text-center">
                  <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <Award className="size-8 text-emerald-600" />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="font-bold text-lg text-foreground">
                      Hoàn thành Unit 1: Greetings & Self-Introduction
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-sm font-normal leading-relaxed">
                      Sau khi hoàn thành, bạn sẽ nhận được **80 XP**, tăng streak học tập, và tự động thêm tất cả 12 từ vựng Unit 1 vào tủ thẻ ôn tập nếu chưa lưu.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <Button
                      onClick={handleCompleteUnit1}
                      disabled={isCompleting || isUnitCompleted}
                      className={`rounded-xl h-11 px-6 font-bold shadow-sm ${
                        isUnitCompleted
                          ? "bg-zinc-100 text-zinc-500 hover:bg-zinc-100 cursor-not-allowed border"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                    >
                      {isCompleting ? (
                        <>
                          <Loader2 className="size-4 animate-spin mr-1.5" /> Đang lưu...
                        </>
                      ) : isUnitCompleted ? (
                        <>
                          <CheckCircle className="size-4 mr-1.5 text-emerald-600" /> Đã hoàn thành Unit này
                        </>
                      ) : (
                        "Hoàn thành Unit & Nhận 80 XP"
                      )}
                    </Button>

                    <Link href="/speaking?topic=greetings">
                      <Button
                        variant="outline"
                        className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 h-11 px-5 font-bold"
                      >
                        Luyện nói chủ đề này <ArrowRight className="size-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-100 flex gap-4">
                  <Button onClick={() => handlePhaseChange("output")} variant="outline" className="rounded-xl h-11 px-5 gap-1.5 border-zinc-200">
                    <ArrowLeft className="size-4" />
                    <span>Quay lại Output</span>
                  </Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sidebar Tips */}
        <div className="space-y-6">
          {/* Phase Intro tip */}
          <div className="p-5 rounded-3xl border border-zinc-100 dark:border-zinc-800 bg-white space-y-3.5 shadow-sm">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="size-4.5 text-emerald-600" />
              Cách học IPOR hiệu quả
            </h4>
            
            <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 size-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">1</span>
                <span><strong>Input:</strong> Tập trung lắng nghe ngữ điệu và chơi game ghép cặp để ghi nhớ các câu chào hỏi căn bản.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 size-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span><strong>Processing:</strong> Học kỹ lý thuyết, lướt 12 flashcards, và thực hành chia động từ to be (am/is/are).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 size-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span><strong>Output:</strong> Thực hiện nói shadowing theo 3 tình huống khác nhau và nhập vai đối thoại giao tiếp.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 size-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">4</span>
                <span><strong>Review:</strong> Vượt qua bài test 10 câu trắc nghiệm và đồng bộ từ vựng vào FSRS để hoàn tất chương học.</span>
              </li>
            </ul>
          </div>

          {/* Web Speech API browser compatibility notification */}
          <div className="p-5 rounded-3xl border border-blue-100 bg-blue-50/20 space-y-3 shadow-sm">
            <h4 className="font-bold text-xs text-blue-800 flex items-center gap-1.5">
              <HelpCircle className="size-4 text-blue-600" />
              Thông tin Mic & Web Speech API
            </h4>
            <p className="text-[11px] text-blue-900/80 leading-relaxed font-normal">
              Tính năng **Nhận diện giọng nói & Chấm điểm** hoạt động trực tiếp trong trình duyệt của bạn (Chrome, Edge, Safari) và không cần cài đặt thêm phần mềm gì. 
              Hãy nhớ bấm **Cho phép (Allow)** quyền truy cập Microphone khi trình duyệt yêu cầu nhé!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
