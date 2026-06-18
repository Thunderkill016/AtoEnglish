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
  Check,
  Award,
  ChevronRight,
  MessageCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveCardToSRS } from "@/app/actions/cards";
import { completeUnit, getUnitCompletionStatus, resetUnitProgress } from "@/app/actions/progress";
import { unit1, type DialogueLine } from "@/lib/data/units/unit1";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpeechRecognition = typeof window !== "undefined" ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

interface MatchCard {
  id: string;
  text: string;
  type: "audio" | "visual";
  matchId: string;
  audioText?: string;
}

const roleplayKeywords: Record<string, string[]> = {
  "d1-2": ["hi", "lan", "nice to meet you"],
  "d1-4": ["vietnam", "and you"],
  "d2-2": ["fine", "thank you", "and you"],
  "d2-4": ["see you", "later"],
  "d3-1": ["good morning", "teacher"],
  "d3-3": ["my name is", "minh"],
  "d3-5": ["nice to meet you", "too"]
};

export default function Unit1Page() {
  // Phases: input -> processing -> output -> review
  const [activePhase, setActivePhase] = useState<"input" | "processing" | "output" | "review">("input");
  const [isUnitCompleted, setIsUnitCompleted] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  // General settings
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);

  // Phase 1 (Input) states
  const [inputSubStep, setInputSubStep] = useState<number>(0); // 0: Listen & Match, 1: Shadowing Basic, 2: Listen & Choose

  // Matching game state
  const [matchCards, setMatchCards] = useState<MatchCard[]>([]);
  const [selectedMatchCard, setSelectedMatchCard] = useState<MatchCard | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [mismatchedIds, setMismatchedIds] = useState<string[]>([]);

  // Shadowing Basic state
  const [shadowBasicIndex, setShadowBasicIndex] = useState<number>(0);
  const [shadowBasicScores, setShadowBasicScores] = useState<Record<number, number>>({});
  const [shadowBasicTranscripts, setShadowBasicTranscripts] = useState<Record<number, string>>({});

  // Listen & Choose state
  const [lacIndex, setLacIndex] = useState<number>(0);
  const [lacSelectedAnswers, setLacSelectedAnswers] = useState<Record<number, string>>({});
  const [lacChecked, setLacChecked] = useState<Record<number, boolean>>({});

  // Phase 2 (Processing) state
  const [vocabIndex, setVocabIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [vocabQueue, setVocabQueue] = useState<number[]>(() =>
    Array.from({ length: unit1.vocab.length }, (_, i) => i)
  );
  
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

  const [speechTranscript, setSpeechTranscript] = useState<string>("");
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [isRecognizing, setIsRecognizing] = useState<boolean>(false);

  // Roleplay state
  const [roleplayActive, setRoleplayActive] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [roleplayStep, setRoleplayStep] = useState<number>(0);

  // Redesigned Step 3 (Output) sub-step states
  const [outputSubStep, setOutputSubStep] = useState<number>(0); // 0: Shadowing, 1: Record & Compare, 2: Roleplay

  // 1. Shadowing Practice states
  const [isPlayingModelAudio, setIsPlayingModelAudio] = useState<boolean>(false);
  const [isPlayingShadowingUserAudio, setIsPlayingShadowingUserAudio] = useState<boolean>(false);
  const [recordedShadowingAudioUrl, setRecordedShadowingAudioUrl] = useState<string | null>(null);
  const [shadowingLineIdx, setShadowingLineIdx] = useState<number>(-1);
  const [shadowingSpeed, setShadowingSpeed] = useState<number>(1.0); // 0.8, 1.0, 1.2

  // 2. Record & Compare states
  const [selectedCompareLineIdx, setSelectedCompareLineIdx] = useState<number>(0);
  const [compareUserAudioUrl, setCompareUserAudioUrl] = useState<string | null>(null);
  const [isPlayingCompareModelAudio, setIsPlayingCompareModelAudio] = useState<boolean>(false);
  const [isPlayingCompareUserAudio, setIsPlayingCompareUserAudio] = useState<boolean>(false);
  const [compareUserScore, setCompareUserScore] = useState<number | null>(null);
  const [compareUserTranscript, setCompareUserTranscript] = useState<string>("");

  // 3. Simple Roleplay states
  const [speechKeywordsMatched, setSpeechKeywordsMatched] = useState<string[]>([]);
  const isPointerDownRef = useRef<boolean>(false);
  const pointerStartRef = useRef<number>(0);


  // Phase 4 (Review) state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [addedVocab, setAddedVocab] = useState<string[]>([]);
  const [savingVocab, setSavingVocab] = useState<string | null>(null);
  const [selfCheckValue, setSelfCheckValue] = useState<"clear" | "partial" | "need-review" | null>(null);

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Web Speech API Ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const activeScenario = unit1.dialogues[selectedScenarioIndex];

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
        let targetText = "";
        if (activePhase === "input" && inputSubStep === 1) {
          targetText = unit1.matchingGreetings[shadowBasicIndex].en;
        } else if (activePhase === "output") {
          if (outputSubStep === 0) {
            targetText = shadowingLineIdx >= 0 ? activeScenario.lines[shadowingLineIdx].text : "";
          } else if (outputSubStep === 1) {
            targetText = activeScenario.lines[selectedCompareLineIdx].text;
          } else if (outputSubStep === 2) {
            targetText = activeScenario.lines[roleplayStep].text;
          }
        }
        
        if (targetText) {
          const score = calculateAccuracyScore(targetText, resultText);
          setAccuracyScore(score);

          if (activePhase === "input" && inputSubStep === 1) {
            setShadowBasicScores(prev => ({ ...prev, [shadowBasicIndex]: score }));
            setShadowBasicTranscripts(prev => ({ ...prev, [shadowBasicIndex]: resultText }));
          }

          if (activePhase === "output") {
            if (outputSubStep === 1) {
              setCompareUserScore(score);
              setCompareUserTranscript(resultText);
            } else if (outputSubStep === 2) {
              const lineId = activeScenario.lines[roleplayStep].id;
              const expectedKeywords = roleplayKeywords[lineId] || [];
              const matched = expectedKeywords.filter(kw => 
                resultText.toLowerCase().includes(kw.toLowerCase())
              );
              setSpeechKeywordsMatched(matched);
            }
          }

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
  }, [shadowSentenceIndex, roleplayActive, roleplayStep, selectedScenarioIndex, activeScenario.lines, activePhase, inputSubStep, shadowBasicIndex, outputSubStep, shadowingLineIdx, selectedCompareLineIdx]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize / shuffle matching cards for Listen & Match (6 random greetings)
  const initializeMatchingGame = () => {
    const selectedGreetings = [...unit1.matchingGreetings]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);

    const audioCards: MatchCard[] = selectedGreetings.map(g => ({
      id: `${g.id}-audio`,
      text: "🔊 Nghe phát âm",
      type: "audio" as const,
      matchId: g.id,
      audioText: g.en
    }));

    const visualCards: MatchCard[] = selectedGreetings.map(g => ({
      id: `${g.id}-visual`,
      text: `${g.emoji} ${g.vn}`,
      type: "visual" as const,
      matchId: g.id
    })).sort(() => Math.random() - 0.5);

    setMatchCards([...audioCards, ...visualCards]);
    setMatchedIds([]);
    setSelectedMatchCard(null);
  };

  // Text-To-Speech function
  const playTTS = (text: string, rate: number = 1.0) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Trình duyệt không hỗ trợ phát âm âm thanh (TTS).");
      return;
    }
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;

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
    window.speechSynthesis.cancel();
    setActivePhase(phase);

    if (phase === "review") {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  // Matching game handler
  const handleMatchCardClick = (card: MatchCard) => {
    if (matchedIds.includes(card.matchId) || mismatchedIds.length > 0) return;

    if (card.type === "audio" && card.audioText) {
      playTTS(card.audioText, 1.0);
    }

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
      const audioTextVal = card.audioText || selectedMatchCard.audioText;
      if (audioTextVal) {
        playTTS(audioTextVal);
      }

      if (matchedIds.length + 1 === 6) {
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
        const _audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        void _audioBlob; // blob constructed for potential future use
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
        playTTS(firstLine.text, playbackSpeed);
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
        playTTS(nextLine.text, playbackSpeed);
      }, 800);
    } else {
      toast.info(`Đến lượt bạn. Hãy đọc to câu của ${userRole}.`);
    }
  };

  // --- REDESIGNED PHASE 3 (OUTPUT) HELPER FUNCTIONS ---

  const playFullDialogueTTS = (
    lines: DialogueLine[],
    speed: number,
    onLineChange: (idx: number) => void,
    onEnd: () => void
  ) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Trình duyệt không hỗ trợ phát âm âm thanh (TTS).");
      onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    let currentLine = 0;

    const playNext = () => {
      if (currentLine >= lines.length) {
        onEnd();
        return;
      }
      onLineChange(currentLine);
      const line = lines[currentLine];
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.lang = "en-US";
      utterance.rate = speed;
      utterance.onend = () => {
        currentLine++;
        setTimeout(playNext, 1000);
      };
      utterance.onerror = () => {
        currentLine++;
        setTimeout(playNext, 1000);
      };
      window.speechSynthesis.speak(utterance);
    };

    playNext();
  };

  const startShadowingSession = async () => {
    setSpeechTranscript("");
    setAccuracyScore(null);
    setRecordedShadowingAudioUrl(null);
    audioChunksRef.current = [];
    setShadowingLineIdx(0);
    setIsPlayingModelAudio(true);

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
        setRecordedShadowingAudioUrl(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }

      playFullDialogueTTS(
        activeScenario.lines,
        shadowingSpeed,
        (idx) => {
          setShadowingLineIdx(idx);
        },
        () => {
          setIsPlayingModelAudio(false);
          setShadowingLineIdx(-1);
          if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
          }
          setIsRecording(false);
          if (recognitionRef.current) {
            recognitionRef.current.stop();
          }
          toast.success("Đã hoàn thành Shadowing! Bấm 'Nghe lại' hoặc 'Làm lại'.");
        }
      );
    } catch {
      toast.error("Không thể mở micro. Vui lòng kiểm tra cài đặt.");
      setIsPlayingModelAudio(false);
      setShadowingLineIdx(-1);
    }
  };

  const stopShadowingSession = () => {
    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }
    setIsPlayingModelAudio(false);
    setShadowingLineIdx(-1);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const playShadowingOriginal = () => {
    setIsPlayingModelAudio(true);
    playFullDialogueTTS(
      activeScenario.lines,
      shadowingSpeed,
      (idx) => {
        setShadowingLineIdx(idx);
      },
      () => {
        setIsPlayingModelAudio(false);
        setShadowingLineIdx(-1);
      }
    );
  };

  const playShadowingUserAudio = () => {
    if (recordedShadowingAudioUrl) {
      setIsPlayingShadowingUserAudio(true);
      const audio = new Audio(recordedShadowingAudioUrl);
      audio.onended = () => setIsPlayingShadowingUserAudio(false);
      audio.play();
    }
  };

  const playCompareModelAudio = () => {
    setIsPlayingCompareModelAudio(true);
    const text = activeScenario.lines[selectedCompareLineIdx].text;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = playbackSpeed;
      utterance.onend = () => setIsPlayingCompareModelAudio(false);
      utterance.onerror = () => setIsPlayingCompareModelAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingCompareModelAudio(false);
    }
  };

  const startCompareRecording = async () => {
    setCompareUserAudioUrl(null);
    setCompareUserScore(null);
    setCompareUserTranscript("");
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
        setCompareUserAudioUrl(audioUrl);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Đang ghi âm... Hãy đọc to câu mẫu.");

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch {
      toast.error("Không thể mở micro. Vui lòng kiểm tra cài đặt.");
    }
  };

  const stopCompareRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Đã dừng ghi âm.");
    }
    if (recognitionRef.current && isRecognizing) {
      recognitionRef.current.stop();
    }
  };

  const playCompareUserAudio = () => {
    if (compareUserAudioUrl) {
      setIsPlayingCompareUserAudio(true);
      const audio = new Audio(compareUserAudioUrl);
      audio.onended = () => setIsPlayingCompareUserAudio(false);
      audio.play();
    }
  };

  const startRoleplayRecording = async () => {
    setSpeechTranscript("");
    setAccuracyScore(null);
    setSpeechKeywordsMatched([]);
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
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    } catch {
      toast.error("Không thể mở micro. Vui lòng kiểm tra cài đặt.");
    }
  };

  const stopRoleplayRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    if (recognitionRef.current && isRecognizing) {
      recognitionRef.current.stop();
    }
  };

  const handleRoleplayMicDown = (e: React.PointerEvent) => {
    e.preventDefault();
    if (isRecording) {
      stopRoleplayRecording();
      isPointerDownRef.current = false;
      return;
    }
    isPointerDownRef.current = true;
    pointerStartRef.current = Date.now();
    startRoleplayRecording();
  };

  const handleRoleplayMicUp = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!isPointerDownRef.current) return;
    isPointerDownRef.current = false;
    const duration = Date.now() - pointerStartRef.current;
    if (duration > 500) {
      stopRoleplayRecording();
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

  const handleResetUnit1 = async () => {
    if (!window.confirm("Bạn có chắc chắn muốn reset toàn bộ tiến trình học và xóa từ vựng đã lưu của Unit 1 này không?")) {
      return;
    }

    try {
      const res = await resetUnitProgress("unit-1");
      if (res.success) {
        setIsUnitCompleted(false);
        setActivePhase("input");
        setInputSubStep(0);
        setMatchCards([]);
        setSelectedMatchCard(null);
        setMatchedIds([]);
        setMismatchedIds([]);
        setShadowBasicIndex(0);
        setShadowBasicScores({});
        setShadowBasicTranscripts({});
        setLacIndex(0);
        setLacSelectedAnswers({});
        setLacChecked({});
        setVocabIndex(0);
        setIsFlipped(false);
        setVocabQueue(Array.from({ length: unit1.vocab.length }, (_, i) => i));
        setToBeAnswers({});
        setToBeResults({});
        setClozeAnswers({});
        setClozeResults({});
        setSelectedScenarioIndex(0);
        setShadowSentenceIndex(0);
        setIsRecording(false);
        setSpeechTranscript("");
        setAccuracyScore(null);
        setIsRecognizing(false);
        setRoleplayActive(false);
        setUserRole(null);
        setRoleplayStep(0);
        setOutputSubStep(0);
        setIsPlayingModelAudio(false);
        setIsPlayingShadowingUserAudio(false);
        setRecordedShadowingAudioUrl(null);
        setShadowingLineIdx(-1);
        setShadowingSpeed(1.0);
        setSelectedCompareLineIdx(0);
        setCompareUserAudioUrl(null);
        setCompareUserScore(null);
        setCompareUserTranscript("");
        setSpeechKeywordsMatched([]);
        setQuizAnswers({});
        setQuizSubmitted(false);
        setAddedVocab([]);
        setSavingVocab(null);
        setSelfCheckValue(null);

        // Re-initialize matching game
        initializeMatchingGame();

        toast.success(res.message);
      } else {
        toast.error(res.error || "Không thể reset bài học.");
      }
    } catch {
      toast.error("Lỗi khi reset bài học.");
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
              {unit1.level}
            </span>
            <span className="text-xs text-muted-foreground font-semibold">
              {unit1.estimatedTime} phút
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground leading-tight">
            Unit 1: {unit1.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {unit1.description}
          </p>
        </div>

        {/* Progress Card */}
        <div className="w-full sm:w-72 space-y-2 bg-white/40 border border-zinc-100 dark:border-zinc-800 backdrop-blur-md p-4 rounded-2xl shadow-sm">
          <div className="flex justify-between items-center text-xs text-muted-foreground font-bold">
            <span>Tiến độ Unit 1</span>
            <div className="flex items-center gap-2">
              <span className="text-foreground">{calculateProgress()}%</span>
              <button
                onClick={handleResetUnit1}
                className="hover:text-red-500 text-muted-foreground transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-red-200"
                title="Reset bài học"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>
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
        {[{ id: "input", title: "1. Input", icon: BookOpen, desc: "Chào hỏi & Nghe nói" },
          { id: "processing", title: "2. Processing", icon: Cpu, desc: "Flashcard & Điền từ" },
          { id: "output", title: "3. Output", icon: PenTool, desc: "Shadowing & Nhập vai" },
          { id: "review", title: "4. Review", icon: RotateCcw, desc: "Quiz, Đánh giá & SRS" }].map((step) => {
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
                {/* Sub-step navigation inside Phase 1 */}
                <div className="flex flex-wrap gap-2 p-1 bg-zinc-50 dark:bg-zinc-800/40 rounded-xl border border-zinc-100">
                  {[
                    "1.1: Listen & Match",
                    "1.2: Shadowing Basic",
                    "1.3: Listen & Choose"
                  ].map((subTitle, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInputSubStep(idx)}
                      className={`flex-1 px-3 py-2 text-xs font-bold rounded-lg transition-all ${
                        inputSubStep === idx
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {subTitle}
                    </button>
                  ))}
                </div>

                {/* Sub-Step 1.1: Listen & Match */}
                {inputSubStep === 0 && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100">
                      <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                        <Volume2 className="size-5 text-emerald-600 animate-pulse" />
                        Bài tập 1.1: Listen & Match (Ghép nối âm thanh)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nghe phát âm ở cột trái (click biểu tượng loa) và ghép với ý nghĩa / biểu tượng cảm xúc (emoji) tương ứng ở cột phải:
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      {/* Left Column: Audio Cards */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Cột Audio</span>
                        {matchCards
                          .filter((c) => c.type === "audio")
                          .map((card) => {
                            const isMatched = matchedIds.includes(card.matchId);
                            const isSelected = selectedMatchCard?.id === card.id;
                            const isMismatched = mismatchedIds.includes(card.id);

                            return (
                              <button
                                key={card.id}
                                onClick={() => handleMatchCardClick(card)}
                                className={`w-full p-3.5 h-16 rounded-xl border text-xs font-bold transition-all flex items-center justify-between shadow-xs ${
                                  isMatched
                                    ? "bg-emerald-100 border-emerald-300 text-emerald-900 opacity-60"
                                    : isMismatched
                                    ? "bg-red-100 border-red-300 text-red-900 animate-shake"
                                    : isSelected
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20"
                                    : "bg-white border-zinc-100 text-foreground hover:bg-zinc-50"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <Volume2 className={`size-4 ${isSelected ? "text-emerald-600 animate-pulse" : "text-zinc-400"}`} />
                                  <span>Nghe âm thanh</span>
                                </span>
                                {isMatched && <Check className="size-4 text-emerald-600" />}
                              </button>
                            );
                          })}
                      </div>

                      {/* Right Column: Visual Meaning Cards */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Cột Nghĩa / Biểu tượng</span>
                        {matchCards
                          .filter((c) => c.type === "visual")
                          .map((card) => {
                            const isMatched = matchedIds.includes(card.matchId);
                            const isSelected = selectedMatchCard?.id === card.id;
                            const isMismatched = mismatchedIds.includes(card.id);

                            return (
                              <button
                                key={card.id}
                                onClick={() => handleMatchCardClick(card)}
                                className={`w-full p-3.5 h-16 rounded-xl border text-xs font-bold transition-all flex items-center justify-between shadow-xs ${
                                  isMatched
                                    ? "bg-emerald-100 border-emerald-300 text-emerald-900 opacity-60"
                                    : isMismatched
                                    ? "bg-red-100 border-red-300 text-red-900 animate-shake"
                                    : isSelected
                                    ? "bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-500/20"
                                    : "bg-white border-zinc-100 text-foreground hover:bg-zinc-50"
                                }`}
                              >
                                <span>{card.text}</span>
                                {isMatched && <Check className="size-4 text-emerald-600" />}
                              </button>
                            );
                          })}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-zinc-100">
                      <Button variant="ghost" size="sm" onClick={initializeMatchingGame} className="text-xs font-bold text-emerald-700 hover:bg-emerald-50">
                        Chơi lại
                      </Button>
                      <Button
                        disabled={matchedIds.length !== 6}
                        onClick={() => setInputSubStep(1)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs h-10 px-4"
                      >
                        Bài tiếp theo <ChevronRight className="size-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sub-Step 1.2: Shadowing Basic */}
                {inputSubStep === 1 && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100">
                      <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                        <BookOpen className="size-5 text-emerald-600" />
                        Bài tập 1.2: Shadowing Basic ({shadowBasicIndex + 1}/8)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nghe phát âm câu chào phổ biến dưới đây, sau đó bấm Mic để lặp lại:
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-zinc-100 flex flex-col items-center gap-4 text-center shadow-sm">
                      <div className="flex border border-zinc-100 rounded-lg overflow-hidden text-[10px] mb-2">
                        {unit1.matchingGreetings.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setShadowBasicIndex(idx);
                              setSpeechTranscript("");
                              setAccuracyScore(null);
                            }}
                            className={`px-2 py-1.5 font-bold ${
                              shadowBasicIndex === idx
                                ? "bg-emerald-600 text-white"
                                : "bg-white text-zinc-500 hover:bg-zinc-50"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-foreground uppercase tracking-tight">
                          {unit1.matchingGreetings[shadowBasicIndex].en}
                        </h4>
                        <p className="text-xs text-zinc-500 italic font-mono font-normal">
                          {unit1.matchingGreetings[shadowBasicIndex].en === "Hello" ? "/həˈləʊ/" :
                           unit1.matchingGreetings[shadowBasicIndex].en === "Hi" ? "/haɪ/" :
                           unit1.matchingGreetings[shadowBasicIndex].en === "Good morning" ? "/ɡʊd ˈmɔː.nɪŋ/" :
                           unit1.matchingGreetings[shadowBasicIndex].en === "Good afternoon" ? "/ɡʊd ˌɑːf.təˈnuːn/" :
                           unit1.matchingGreetings[shadowBasicIndex].en === "Good evening" ? "/ɡʊd ˈiːv.nɪŋ/" :
                           unit1.matchingGreetings[shadowBasicIndex].en === "Goodbye" ? "/ˌɡʊdˈbaɪ/" :
                           unit1.matchingGreetings[shadowBasicIndex].en === "Bye" ? "/baɪ/" :
                           "/siː juː ˈleɪ.tə/"}
                        </p>
                        <p className="text-xs text-muted-foreground font-semibold mt-1">
                          {unit1.matchingGreetings[shadowBasicIndex].emoji} {unit1.matchingGreetings[shadowBasicIndex].vn}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex border border-zinc-100 rounded-lg overflow-hidden text-xs">
                          {[1.0, 0.8].map((s) => (
                            <button
                              key={s}
                              onClick={() => setPlaybackSpeed(s)}
                              className={`px-2.5 py-1.5 font-bold transition-all ${
                                playbackSpeed === s
                                  ? "bg-emerald-600 text-white"
                                  : "bg-muted text-muted-foreground hover:bg-foreground/[0.05]"
                              }`}
                            >
                              {s === 0.8 ? "Chậm (0.8x)" : "Thường (1.0x)"}
                            </button>
                          ))}
                        </div>

                        <Button
                          onClick={() => playTTS(unit1.matchingGreetings[shadowBasicIndex].en, playbackSpeed)}
                          variant="outline"
                          size="sm"
                          className="rounded-lg text-xs gap-1.5 h-8 font-semibold border-zinc-200"
                        >
                          <Volume2 className="size-3.5" /> Nghe Audio mẫu
                        </Button>
                      </div>
                    </div>

                    {/* Microphone panel */}
                    <div className="flex flex-col items-center justify-center p-5 border border-zinc-100 rounded-2xl bg-muted/10 space-y-4">
                      <div className="flex items-center gap-3">
                        {!isRecording ? (
                          <Button
                            onClick={handleStartRecording}
                            className="size-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                          >
                            <Mic className="size-6" />
                          </Button>
                        ) : (
                          <Button
                            onClick={handleStopRecording}
                            className="size-14 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white flex items-center justify-center shadow-md animate-pulse active:scale-95 transition-all"
                          >
                            <div className="size-4 rounded bg-white" />
                          </Button>
                        )}
                      </div>

                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {isRecording ? "Đang lắng nghe... Hãy nói đi!" : isRecognizing ? "Đang xử lý..." : "Nhấn nút Mic để bắt đầu nói theo"}
                      </p>

                      {/* Display spoken results */}
                      {shadowBasicTranscripts[shadowBasicIndex] && (
                        <div className="w-full p-3 bg-white border border-zinc-100 rounded-xl text-center space-y-1">
                          <p className="text-xs italic text-zinc-500">Từ nghe được: &ldquo;{shadowBasicTranscripts[shadowBasicIndex]}&rdquo;</p>
                          {shadowBasicScores[shadowBasicIndex] !== undefined && (
                            <p className="text-xs font-bold text-emerald-800">
                              Độ chính xác: <span className="text-sm font-black">{shadowBasicScores[shadowBasicIndex]}%</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
                      <Button
                        disabled={shadowBasicIndex === 0}
                        onClick={() => {
                          setShadowBasicIndex(prev => prev - 1);
                          setSpeechTranscript("");
                          setAccuracyScore(null);
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs"
                      >
                        Trước
                      </Button>
                      <Button
                        onClick={() => {
                          if (shadowBasicIndex < 7) {
                            setShadowBasicIndex(prev => prev + 1);
                            setSpeechTranscript("");
                            setAccuracyScore(null);
                          } else {
                            setInputSubStep(2);
                          }
                        }}
                        className="rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        {shadowBasicIndex < 7 ? "Tiếp theo" : "Bài tập tiếp theo"}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sub-Step 1.3: Listen & Choose */}
                {inputSubStep === 2 && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b border-zinc-100">
                      <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                        <Volume2 className="size-5 text-emerald-600" />
                        Bài tập 1.3: Listen & Choose ({lacIndex + 1}/5)
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Nghe âm thanh và chọn cụm từ chào hỏi chính xác nhất:
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-muted/20 border border-zinc-100 flex flex-col items-center gap-4 text-center">
                      <Button
                        onClick={() => playTTS(unit1.listenAndChoose[lacIndex].audio_text, 1.0)}
                        className="size-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                      >
                        <Volume2 className="size-7" />
                      </Button>
                      <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Bấm loa để nghe</span>
                    </div>

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {unit1.listenAndChoose[lacIndex].options.map((opt) => {
                        const isSelected = lacSelectedAnswers[lacIndex] === opt;
                        const isCorrect = opt === unit1.listenAndChoose[lacIndex].answer;
                        const isSubmitted = lacChecked[lacIndex] === true;

                        let btnClass = "border-zinc-100 bg-white hover:bg-zinc-50/50 text-foreground";
                        if (isSubmitted) {
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
                            disabled={isSubmitted}
                            onClick={() => setLacSelectedAnswers(prev => ({ ...prev, [lacIndex]: opt }))}
                            className={`p-3.5 rounded-xl border text-left text-xs transition-all ${btnClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-zinc-50">
                      <Button
                        disabled={lacIndex === 0}
                        onClick={() => {
                          setLacIndex(prev => prev - 1);
                        }}
                        variant="outline"
                        size="sm"
                        className="rounded-lg text-xs"
                      >
                        Quay lại
                      </Button>

                      {!lacChecked[lacIndex] ? (
                        <Button
                          disabled={!lacSelectedAnswers[lacIndex]}
                          onClick={() => {
                            const isCorrect = lacSelectedAnswers[lacIndex] === unit1.listenAndChoose[lacIndex].answer;
                            setLacChecked(prev => ({ ...prev, [lacIndex]: true }));
                            if (isCorrect) {
                              toast.success("Chính xác!");
                              confetti({
                                particleCount: 15,
                                spread: 30,
                                origin: { y: 0.8 }
                              });
                            } else {
                              toast.error("Chưa chính xác. Nghe lại và chọn đáp án khác.");
                            }
                          }}
                          className="rounded-lg text-xs bg-zinc-900 hover:bg-zinc-800 text-white"
                        >
                          Kiểm tra
                        </Button>
                      ) : (
                        <Button
                          onClick={() => {
                            if (lacIndex < 4) {
                              setLacIndex(prev => prev + 1);
                            } else {
                              toast.success("Chúc mừng! Bạn đã hoàn tất toàn bộ Micro-lesson 1.");
                              handlePhaseChange("processing");
                            }
                          }}
                          className="rounded-lg text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          {lacIndex < 4 ? "Câu tiếp theo" : "Tiếp tục: Processing"}
                        </Button>
                      )}
                    </div>
                  </div>
                )}
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
                {/* Micro-Phase 2.1: Vocabulary Flashcard */}
                {(() => {
                  const currentVocabItem = unit1.vocab[vocabQueue[vocabIndex]];
                  if (!currentVocabItem) return null;

                  return (
                    <div className="space-y-4">
                      <div className="pb-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                        <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                          <Cpu className="size-5 text-emerald-600 dark:text-emerald-400" />
                          Bài tập 2.1: Flashcards từ vựng (Thẻ {vocabIndex + 1}/{vocabQueue.length})
                        </h3>
                      </div>
                      
                      <div className="flex flex-col items-center gap-4">
                        {/* Flippable Card */}
                        <div 
                          onClick={() => setIsFlipped(!isFlipped)}
                          className="w-full max-w-sm h-52 [perspective:1000px] cursor-pointer"
                        >
                          <div className={`relative w-full h-full text-center transition-transform duration-500 [transform-style:preserve-3d] ${isFlipped ? "[transform:rotateY(180deg)]" : ""}`}>
                            {/* Front Side */}
                            <div className="absolute inset-0 w-full h-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden]">
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-800/50 uppercase tracking-wider mb-2">
                                {currentVocabItem.word.toUpperCase()}
                              </span>
                              <h4 className="text-xl font-black text-foreground uppercase tracking-tight">
                                {currentVocabItem.word}
                              </h4>
                              <p className="text-xs text-zinc-500 italic mt-1 font-mono font-normal">
                                {currentVocabItem.phonetic}
                              </p>
                              
                              {/* Audio button inside card front */}
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playTTS(currentVocabItem.word);
                                }}
                                variant="outline"
                                size="sm"
                                className="mt-4 rounded-xl gap-1.5 h-9 font-semibold hover:text-emerald-600 hover:bg-emerald-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                              >
                                <Volume2 className="size-4" /> Phát âm
                              </Button>
                              
                              <span className="text-[10px] text-zinc-400 font-bold mt-4 uppercase tracking-wider">
                                Chạm để xem nghĩa tiếng Việt
                              </span>
                            </div>

                            {/* Back Side */}
                            <div className="absolute inset-0 w-full h-full bg-emerald-600 border border-emerald-700 text-white rounded-2xl flex flex-col items-center justify-center p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                              <h4 className="text-xs font-bold uppercase tracking-wider opacity-85">Ý nghĩa:</h4>
                              <p className="text-lg font-black mt-1">
                                {currentVocabItem.meaning}
                              </p>
                              
                              <div className="mt-4 max-w-xs text-[11px] text-emerald-50 opacity-95 leading-relaxed italic bg-emerald-700/50 p-2.5 rounded-lg border border-emerald-500/30">
                                Ex: {currentVocabItem.example}
                              </div>
                              
                              <span className="text-[10px] text-emerald-200 font-bold mt-4 uppercase tracking-wider">
                                Chạm để quay lại mặt trước
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Nav controls & learning state buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={vocabIndex === 0}
                            onClick={() => {
                              setVocabIndex(prev => prev - 1);
                              setIsFlipped(false);
                            }}
                            className="rounded-lg border-zinc-100 dark:border-zinc-850 h-9"
                          >
                            Trước
                          </Button>

                          {/* Chưa thuộc button */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentItemIndex = vocabQueue[vocabIndex];
                              setVocabQueue(prev => [...prev, currentItemIndex]);
                              setIsFlipped(false);
                              if (vocabIndex < vocabQueue.length - 1) {
                                setVocabIndex(prev => prev + 1);
                              }
                              toast.info("Đã đưa từ này vào cuối để ôn lại.");
                            }}
                            className="rounded-lg h-9 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-950 dark:text-red-400 dark:hover:bg-red-950/20 font-semibold"
                          >
                            Chưa thuộc
                          </Button>

                          {/* Tôi đã thuộc button */}
                          {(() => {
                            const item = currentVocabItem;
                            const isAdded = addedVocab.includes(item.word);
                            const isSaving = savingVocab === item.word;

                            return (
                              <Button
                                size="sm"
                                disabled={isAdded || isSaving}
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  await handleSaveToSRS(item.word, item.phonetic, item.meaning, item.example);
                                  setTimeout(() => {
                                    if (vocabIndex < vocabQueue.length - 1) {
                                      setVocabIndex(prev => prev + 1);
                                      setIsFlipped(false);
                                    } else {
                                      toast.success("Tuyệt vời! Bạn đã thuộc toàn bộ từ vựng.");
                                    }
                                  }, 1000);
                                }}
                                className={`rounded-lg h-9 gap-1 text-xs font-bold ${
                                  isAdded 
                                    ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300" 
                                    : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                                }`}
                              >
                                {isSaving ? (
                                  <Loader2 className="size-3 animate-spin" />
                                ) : isAdded ? (
                                  <span className="flex items-center gap-0.5"><Check className="size-3.5" /> Đã thuộc</span>
                                ) : (
                                  "Tôi đã thuộc"
                                )}
                              </Button>
                            );
                          })()}

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={vocabIndex === vocabQueue.length - 1}
                            onClick={() => {
                              setVocabIndex(prev => prev + 1);
                              setIsFlipped(false);
                            }}
                            className="rounded-lg border-zinc-100 dark:border-zinc-850 h-9"
                          >
                            Tiếp
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Micro-Phase 2.2: Fill in the Blank (Cloze Test) */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <div className="pb-2">
                    <h3 className="font-bold text-base text-foreground">
                      Bài tập 2.2: Fill in the Blank (Cloze Test 8 câu)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Điền từ vựng đúng để hoàn tất các câu tự giới thiệu bên dưới:
                    </p>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {unit1.cloze.map((cloze, idx) => {
                      const result = clozeResults[cloze.id];
                      return (
                        <div key={cloze.id} className="p-4 rounded-2xl border border-zinc-100 bg-white shadow-xs flex flex-col justify-between gap-3">
                          <div className="text-xs font-bold text-foreground">
                            <span>{idx + 1}. </span>
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
                          
                          <div className="flex items-center justify-between">
                            <div>
                              {result === true && (
                                <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                                  <Check className="size-3" /> Đúng
                                </span>
                              )}
                              {result === false && (
                                <span className="text-red-500 font-bold text-[10px]">
                                  Chưa đúng
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCheckCloze(cloze.id, cloze.answer)}
                              className="rounded-lg h-7 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px]"
                            >
                              Kiểm tra
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Micro-Phase 2.3: Grammar Drag & Drop / Selection */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <div className="pb-2">
                    <h3 className="font-bold text-base text-foreground">
                      {"Bài tập 2.3: Grammar Selection (Động từ 'To Be')"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Chọn đúng động từ am / is / are để hoàn thành câu:
                    </p>
                  </div>

                  <div className="grid gap-3.5 sm:grid-cols-2">
                    {unit1.toBeExercises.map((ex, idx) => {
                      const result = toBeResults[ex.id];
                      return (
                        <div key={ex.id} className="p-4 border border-zinc-100 rounded-2xl bg-zinc-50/30 flex flex-col justify-between gap-3 shadow-xs">
                          <div className="text-xs font-bold text-foreground">
                            <span>{idx + 1}. </span>
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
                          
                          <div className="flex items-center justify-between">
                            <div>
                              {result === true && (
                                <span className="text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                                  <Check className="size-3" /> Chính xác
                                </span>
                              )}
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleCheckToBe(ex.id, ex.answer)}
                              className="rounded-lg h-7 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold"
                            >
                              Check
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
                    {unit1.dialogues.map((sc, idx) => (
                      <button
                        key={sc.id}
                        disabled={roleplayActive}
                        onClick={() => {
                          setSelectedScenarioIndex(idx);
                          setShadowSentenceIndex(0);
                          setSpeechTranscript("");
                          setAccuracyScore(null);
                          setSelectedCompareLineIdx(0);
                          setCompareUserAudioUrl(null);
                          setCompareUserScore(null);
                          setCompareUserTranscript("");
                          setSpeechKeywordsMatched([]);
                        }}
                        className={`p-3 text-left border rounded-xl transition-all text-xs font-bold flex flex-col justify-between ${
                          selectedScenarioIndex === idx
                            ? "bg-emerald-50/50 border-emerald-500 text-emerald-950 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-300"
                            : "bg-white border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 hover:bg-zinc-50/50"
                        } ${roleplayActive ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <span className="font-bold truncate">{sc.title}</span>
                        <span className="text-[10px] text-zinc-400 font-normal line-clamp-1 mt-1">{sc.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-steps Selector */}
                <div className="flex border border-zinc-100 dark:border-zinc-850 rounded-2xl p-1 bg-zinc-50 dark:bg-zinc-900/40 overflow-x-auto whitespace-nowrap scrollbar-none">
                  {[
                    { id: 0, label: "Shadowing Practice", icon: Play },
                    { id: 1, label: "Record & Compare", icon: Mic },
                    { id: 2, label: "Interactive Roleplay", icon: MessageCircle },
                  ].map((sub) => {
                    const Icon = sub.icon;
                    return (
                      <button
                        key={sub.id}
                        onClick={() => {
                          setOutputSubStep(sub.id);
                          stopShadowingSession();
                          setRecordedShadowingAudioUrl(null);
                          setCompareUserAudioUrl(null);
                          setCompareUserScore(null);
                          setCompareUserTranscript("");
                          setSpeechKeywordsMatched([]);
                        }}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
                          outputSubStep === sub.id
                            ? "bg-white dark:bg-zinc-800 shadow-xs text-emerald-600 dark:text-emerald-400 border border-zinc-100/50 dark:border-zinc-700/50"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100/50"
                        }`}
                      >
                        <Icon className="size-4 shrink-0" />
                        <span>{sub.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Sub-step 3.1: Shadowing Practice */}
                {outputSubStep === 0 && (
                  <div className="space-y-6">
                    <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl p-4 flex flex-col gap-1">
                      <h4 className="font-bold text-sm text-foreground">
                        Shadowing Practice: {activeScenario.title}
                      </h4>
                      <p className="text-xs text-zinc-500 font-normal">
                        {activeScenario.desc} — Hãy đọc đồng thời cùng với giọng nói của người bản xứ để luyện ngữ điệu, tốc độ.
                      </p>
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto p-2 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl scrollbar-thin">
                      {activeScenario.lines.map((line: DialogueLine, idx: number) => {
                        const isActive = shadowingLineIdx === idx;
                        return (
                          <div
                            key={line.id}
                            className={`p-3 rounded-xl border transition-all flex gap-3 ${
                              isActive
                                ? "bg-emerald-50/20 dark:bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/10"
                                : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800"
                            }`}
                          >
                            <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              line.speaker === "Alex" || line.speaker === "Bob" || line.speaker === "Mr. Brown" || line.speaker === "A"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300"
                            }`}>
                              {line.speaker[0]}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-0.5">
                                <span className="font-bold text-[10px] text-zinc-400 dark:text-zinc-500">
                                  {line.speaker}
                                </span>
                              </div>
                              <p className={`text-xs sm:text-sm font-semibold ${
                                isActive ? "text-emerald-700 dark:text-emerald-300" : "text-foreground"
                              }`}>
                                {line.text}
                              </p>
                              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">
                                {line.translation}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {isRecording && (
                      <div className="flex items-center justify-center gap-1 py-4 h-12">
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mr-3 animate-pulse">
                          Đang ghi âm và phát mẫu
                        </span>
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded bg-emerald-500 animate-pulse`}
                            style={{
                              height: `${[16, 32, 24, 40, 20, 28][i]}px`,
                              animationDelay: `${i * 150}ms`,
                              animationDuration: "800ms"
                            }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-2">Tốc độ:</span>
                        {[0.8, 1.0, 1.2].map((sp) => (
                          <button
                            key={sp}
                            disabled={isRecording}
                            onClick={() => setShadowingSpeed(sp)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              shadowingSpeed === sp
                                ? "bg-zinc-900 text-white dark:bg-zinc-800"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200"
                            } ${isRecording ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {sp}x
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {!isRecording ? (
                          <Button
                            disabled={isPlayingModelAudio}
                            onClick={startShadowingSession}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs"
                          >
                            <Play className="size-4" /> Bắt đầu Shadowing
                          </Button>
                        ) : (
                          <Button
                            onClick={stopShadowingSession}
                            variant="destructive"
                            className="font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs"
                          >
                            <Pause className="size-4" /> Dừng Shadowing
                          </Button>
                        )}
                      </div>
                    </div>

                    {recordedShadowingAudioUrl && !isRecording && (
                      <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl flex flex-wrap items-center justify-center gap-3">
                        <Button
                          onClick={playShadowingOriginal}
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-zinc-200 text-xs font-bold gap-1.5 h-10 hover:bg-zinc-100"
                        >
                          <Volume2 className="size-4" /> Nghe lại Mẫu
                        </Button>
                        
                        <Button
                          onClick={playShadowingUserAudio}
                          variant="outline"
                          size="sm"
                          className={`rounded-xl border-zinc-200 text-xs font-bold gap-1.5 h-10 hover:bg-zinc-100 ${
                            isPlayingShadowingUserAudio ? "ring-2 ring-emerald-500 text-emerald-600 bg-emerald-50/10" : ""
                          }`}
                        >
                          {isPlayingShadowingUserAudio ? (
                            <>
                              <Loader2 className="size-4 animate-spin text-emerald-600" />
                              Đang phát...
                            </>
                          ) : (
                            <>
                              <Play className="size-4" /> Bản ghi của bạn
                            </>
                          )}
                        </Button>

                        <Button
                          onClick={startShadowingSession}
                          size="sm"
                          className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold h-10"
                        >
                          Làm lại
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Sub-step 3.2: Record & Compare */}
                {outputSubStep === 1 && (
                  <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                    <div className="space-y-1.5 md:border-r md:border-zinc-100 md:dark:border-zinc-800 md:pr-4">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Chọn câu thoại:</span>
                      <div className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 scrollbar-none">
                        {activeScenario.lines.map((line: DialogueLine, idx: number) => (
                          <button
                            key={line.id}
                            onClick={() => {
                              setSelectedCompareLineIdx(idx);
                              setCompareUserAudioUrl(null);
                              setCompareUserScore(null);
                              setCompareUserTranscript("");
                              stopCompareRecording();
                            }}
                            className={`px-3 py-2 text-left rounded-xl text-xs font-bold transition-all shrink-0 md:shrink-1 truncate ${
                              selectedCompareLineIdx === idx
                                ? "bg-emerald-50/50 border border-emerald-500/30 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-white border border-zinc-100 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-500 hover:bg-zinc-50"
                            }`}
                          >
                            Câu {idx + 1}: {line.text}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 p-5 rounded-2xl text-center space-y-2">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                          Câu {selectedCompareLineIdx + 1}
                        </span>
                        <h4 className="text-lg font-black text-foreground">
                          &ldquo;{activeScenario.lines[selectedCompareLineIdx].text}&rdquo;
                        </h4>
                        <p className="text-xs text-zinc-500 font-normal">
                          {activeScenario.lines[selectedCompareLineIdx].translation}
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl bg-white dark:bg-zinc-950 space-y-6">
                        <div className="flex items-center gap-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={playCompareModelAudio}
                            className={`rounded-xl h-10 gap-1.5 border-zinc-200 text-xs font-bold ${
                              isPlayingCompareModelAudio ? "ring-2 ring-emerald-500 text-emerald-600 bg-emerald-50/10" : ""
                            }`}
                          >
                            {isPlayingCompareModelAudio ? (
                              <>
                                <Loader2 className="size-4 animate-spin text-emerald-600" />
                                Mẫu phát...
                              </>
                            ) : (
                              <>
                                <Volume2 className="size-4" /> Nghe Audio Mẫu
                              </>
                            )}
                          </Button>

                          {!isRecording ? (
                            <Button
                              onClick={startCompareRecording}
                              className="size-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all shrink-0"
                            >
                              <Mic className="size-6" />
                            </Button>
                          ) : (
                            <Button
                              onClick={stopCompareRecording}
                              className="size-14 rounded-full bg-zinc-950 hover:bg-zinc-900 text-white flex items-center justify-center shadow-md animate-pulse active:scale-95 transition-all shrink-0"
                            >
                              <div className="size-4 rounded bg-white" />
                            </Button>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {isRecording ? "Đang lắng nghe... Hãy nói to câu trên" : "Ấn nút Mic đỏ để tự ghi âm so sánh"}
                        </span>

                        {compareUserAudioUrl && (
                          <div className="w-full grid gap-4 sm:grid-cols-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                            <div className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Giọng bản xứ (Mẫu)</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={playCompareModelAudio}
                                  className="size-7 p-0 rounded-full hover:bg-zinc-200"
                                >
                                  <Volume2 className="size-4 text-emerald-600" />
                                </Button>
                              </div>
                              <div className="flex items-end justify-center gap-0.5 h-10">
                                {[...Array(15)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-emerald-500 rounded-t"
                                    style={{ height: `${[20, 35, 15, 25, 40, 10, 30, 20, 15, 35, 25, 10, 30, 15, 25][i]}%` }}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Bản ghi của bạn</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={playCompareUserAudio}
                                  className={`size-7 p-0 rounded-full hover:bg-zinc-200 ${
                                    isPlayingCompareUserAudio ? "bg-zinc-100" : ""
                                  }`}
                                >
                                  {isPlayingCompareUserAudio ? (
                                    <Loader2 className="size-4 animate-spin text-emerald-600" />
                                  ) : (
                                    <Play className="size-4 text-blue-600" />
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-end justify-center gap-0.5 h-10">
                                {[...Array(15)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-blue-500 rounded-t"
                                    style={{ height: `${[15, 25, 30, 10, 35, 20, 15, 40, 25, 10, 30, 20, 15, 35, 20][i]}%` }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {compareUserTranscript && (
                          <div className="w-full p-4 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50/30 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">Máy nhận diện:</span>
                              {compareUserScore !== null && (
                                <span className={`font-black text-sm ${
                                  compareUserScore >= 80 ? "text-emerald-600" : compareUserScore >= 50 ? "text-amber-500" : "text-red-500"
                                }`}>
                                  Độ khớp: {compareUserScore}%
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-semibold italic text-foreground">
                              &ldquo;{compareUserTranscript}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-step 3.3: Interactive Roleplay */}
                {outputSubStep === 2 && (
                  <div className="space-y-6">
                    {!roleplayActive ? (
                      <div className="text-center py-6 space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-foreground">Chọn vai của bạn để nhập vai:</h4>
                          <p className="text-xs text-zinc-500 max-w-sm mx-auto font-normal">
                            Bạn sẽ hội thoại trực tiếp với Bot bằng cách đọc câu thoại tương ứng của nhân vật mình chọn.
                          </p>
                        </div>
                        
                        <div className="flex flex-wrap justify-center gap-3">
                          {Array.from(new Set(activeScenario.lines.map((l: DialogueLine) => l.speaker))).map((sp: string) => (
                            <button
                              key={sp}
                              onClick={() => startRoleplay(sp)}
                              className="px-5 py-3 border border-zinc-200 hover:border-emerald-500 hover:bg-emerald-50/30 rounded-2xl text-xs font-bold transition-all flex flex-col items-center gap-2 min-w-[120px] bg-white dark:bg-zinc-950 dark:border-zinc-800"
                            >
                              <span className="flex size-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold text-sm uppercase">
                                {sp[0]}
                              </span>
                              <span>Đóng vai {sp}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="pb-3 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              Hội thoại: {activeScenario.title}
                            </span>
                            <p className="text-xs text-zinc-500 mt-1">
                              Bạn đang đóng vai **{userRole}**.
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setRoleplayActive(false);
                              setUserRole(null);
                            }}
                            className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 font-bold rounded-lg"
                          >
                            Hủy/Đóng
                          </Button>
                        </div>

                        <div className="space-y-3 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 border border-zinc-100 dark:border-zinc-800/80 rounded-2xl max-h-[320px] overflow-y-auto scrollbar-thin">
                          {activeScenario.lines.map((line: DialogueLine, idx: number) => {
                            if (idx > roleplayStep) return null;
                            const isUserTurn = line.speaker === userRole;
                            const isCurrent = idx === roleplayStep;

                            return (
                              <div
                                key={line.id}
                                className={`p-3 rounded-xl border flex gap-3 transition-all ${
                                  isUserTurn
                                    ? "bg-emerald-50/30 border-emerald-200/50 dark:bg-emerald-950/20 dark:border-emerald-800/30 ml-6"
                                    : "bg-blue-50/30 border-blue-200/50 dark:bg-blue-950/20 dark:border-blue-800/30 mr-6"
                                } ${isCurrent ? "ring-2 ring-emerald-500/30" : ""}`}
                              >
                                <span className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                  isUserTurn
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                }`}>
                                  {line.speaker[0]}
                                </span>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-bold text-[10px] text-zinc-400">
                                      {line.speaker} {isUserTurn ? "(Bạn)" : "(Bot)"}
                                    </span>
                                    {!isUserTurn && isCurrent && (
                                      <button
                                        onClick={() => playTTS(line.text, playbackSpeed)}
                                        className="size-5 rounded hover:bg-zinc-200 flex items-center justify-center text-zinc-500 transition-colors"
                                      >
                                        <Volume2 className="size-3" />
                                      </button>
                                    )}
                                  </div>
                                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                                    {line.text}
                                  </p>
                                  {(!isCurrent || !isUserTurn) && (
                                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-normal mt-0.5">
                                      {line.translation}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        <div className="border border-zinc-100 dark:border-zinc-800 p-4 rounded-2xl bg-white dark:bg-zinc-950 space-y-4 shadow-xs">
                          {activeScenario.lines[roleplayStep].speaker === userRole ? (
                            <div className="space-y-4">
                              {(() => {
                                const currentLine = activeScenario.lines[roleplayStep];
                                const expectedKws = roleplayKeywords[currentLine?.id] || [];
                                
                                if (expectedKws.length === 0) return null;
                                
                                return (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Từ khóa cần đọc:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {expectedKws.map((kw) => {
                                        const isMatched = speechKeywordsMatched.includes(kw);
                                        return (
                                          <span
                                            key={kw}
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 transition-all ${
                                              isMatched
                                                ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-850 dark:text-emerald-300"
                                                : "bg-zinc-50 border-zinc-200 text-zinc-400 dark:bg-zinc-900 dark:border-zinc-800"
                                            }`}
                                          >
                                            {isMatched ? <Check className="size-3" /> : null}
                                            {kw}
                                          </span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })()}

                              <div className="flex flex-col items-center gap-3 py-2">
                                <button
                                  onPointerDown={handleRoleplayMicDown}
                                  onPointerUp={handleRoleplayMicUp}
                                  className={`size-16 rounded-full flex items-center justify-center text-white shadow-md active:scale-95 transition-all select-none cursor-pointer touch-none ${
                                    isRecording
                                      ? "bg-red-500 animate-pulse ring-4 ring-red-100 dark:ring-red-950/30"
                                      : "bg-emerald-600 hover:bg-emerald-700"
                                  }`}
                                >
                                  <Mic className="size-7" />
                                </button>
                                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider text-center">
                                  {isRecording ? "Đang ghi âm... Nhả chuột/nhấc tay để dừng" : "Nhấn giữ (hoặc click) Mic để nói"}
                                </span>
                              </div>

                              {speechTranscript && (
                                <div className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/30 text-center space-y-1">
                                  <p className="text-xs italic text-zinc-500">
                                    Nhận diện: &ldquo;{speechTranscript}&rdquo;
                                  </p>
                                  {accuracyScore !== null && (
                                    <p className={`text-xs font-bold ${accuracyScore >= 50 ? "text-emerald-600" : "text-red-500"}`}>
                                      Khớp {accuracyScore}% — {accuracyScore >= 50 ? "✅ Đạt yêu cầu!" : "❌ Thử nói lại nhé"}
                                    </p>
                                  )}
                                </div>
                              )}

                              {accuracyScore !== null && accuracyScore >= 50 && (
                                <div className="flex justify-center">
                                  <Button
                                    onClick={nextRoleplayStep}
                                    className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-10 px-5 gap-1 text-xs"
                                  >
                                    <span>Câu tiếp theo</span>
                                    <ChevronRight className="size-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4 text-center py-2">
                              <div className="flex items-center justify-center gap-1">
                                <span className="text-xs text-zinc-500 font-semibold animate-pulse">Bot đang phản hồi...</span>
                              </div>
                              <div className="flex justify-center">
                                <Button
                                  onClick={nextRoleplayStep}
                                  className="rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold h-10 px-5 gap-1 text-xs"
                                >
                                  <span>Tiếp tục hội thoại</span>
                                  <ChevronRight className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stepper Phase Navigation */}
                <div className="pt-6 border-t border-zinc-100 dark:border-zinc-800 flex justify-between gap-4">
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
                {/* Exercise 4.1: Quick Quiz (10 questions) */}
                <div className="space-y-6">
                  <div className="pb-4 border-b border-zinc-100">
                    <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                      <RotateCcw className="size-5 text-emerald-600" />
                      Bài tập 4.1: Quick Quiz (10 câu hỏi tổng hợp)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Gồm 6 câu hỏi trắc nghiệm và 4 câu hỏi điền từ vào chỗ trống:
                    </p>
                  </div>

                  <div className="space-y-5">
                    {unit1.quiz.map((q, qIdx) => {
                      const selectedOpt = quizAnswers[q.id];
                      const isCloze = q.type === "cloze";

                      if (isCloze) {
                        const userAns = quizAnswers[q.id] || "";
                        const isCorrect = userAns.trim().toLowerCase() === q.answer.toLowerCase();
                        
                        return (
                          <div key={q.id} className="space-y-3 border-b border-zinc-50 pb-4 last:border-b-0">
                            <p className="text-sm font-bold text-foreground">
                              {qIdx + 1}. {q.question}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                              <input
                                type="text"
                                disabled={quizSubmitted}
                                value={userAns}
                                onChange={(e) => setQuizAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                placeholder="Nhập đáp án..."
                                className={`px-3 py-1.5 rounded-lg border text-xs max-w-xs focus:outline-none focus:ring-1 ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-bold"
                                      : "border-red-500 bg-red-50 text-red-950 font-bold"
                                    : "border-zinc-200 focus:ring-emerald-500"
                                }`}
                              />
                              {quizSubmitted && (
                                <span className={`text-xs font-bold ${isCorrect ? "text-emerald-600" : "text-red-500"}`}>
                                  {isCorrect ? "Chính xác" : `Đáp án đúng: ${q.answer}`}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      }

                      // Multiple choice questions
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
                          let score = 0;
                          unit1.quiz.forEach(q => {
                            const userAns = (quizAnswers[q.id] || "").trim().toLowerCase();
                            const correctAns = q.answer.toLowerCase();
                            if (userAns === correctAns) score++;
                          });
                          if (score === unit1.quiz.length) {
                            toast.success("Tuyệt vời! Bạn đã trả lời đúng tất cả 10 câu hỏi.");
                            confetti({
                              particleCount: 100,
                              spread: 80,
                              origin: { y: 0.6 }
                            });
                          } else {
                            toast.warning(`Bạn đúng ${score}/${unit1.quiz.length} câu. Hãy ôn tập lại nhé.`);
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
                        Làm lại Quiz
                      </Button>
                    </div>
                  )}
                </div>

                {/* Exercise 4.2: Self-Check */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <div className="pb-2">
                    <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                      <CheckCircle className="size-5 text-emerald-600" />
                      Bài tập 4.2: Tự đánh giá mức độ hiểu bài
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hãy tự đánh giá mức độ hiểu bài của bạn sau khi học xong Unit 1 để nhận lời khuyên ôn tập:
                    </p>
                  </div>
                  
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { value: "clear", label: "Tôi hiểu rõ 🟢", desc: "Hệ thống FSRS sẵn sàng đồng bộ, bạn có thể tự tin giao tiếp chào hỏi cơ bản." },
                      { value: "partial", label: "Hiểu một phần 🟡", desc: "Bạn nên luyện nói Shadowing nhiều hơn và kiểm tra lại từ vựng hàng ngày." },
                      { value: "need-review", label: "Cần ôn lại 🔴", desc: "Khuyên bạn nên học lại các micro-lesson 1 & 2 để nắm chắc gốc từ vựng." }
                    ].map((item) => (
                      <button
                        key={item.value}
                        onClick={() => setSelfCheckValue(item.value as "clear" | "partial" | "need-review")}
                        className={`p-4 rounded-2xl border text-center transition-all ${
                          selfCheckValue === item.value
                            ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 shadow-xs"
                            : "border-zinc-100 bg-white hover:bg-zinc-50"
                        }`}
                      >
                        <p className="font-bold text-xs text-foreground mb-1">
                          {item.label}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-normal leading-relaxed">
                          {item.desc}
                        </p>
                      </button>
                    ))}
                  </div>

                  {selfCheckValue && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-xl border text-xs font-bold leading-relaxed ${
                        selfCheckValue === "clear"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                          : selfCheckValue === "partial"
                          ? "bg-amber-50 border-amber-100 text-amber-800"
                          : "bg-red-50 border-red-100 text-red-800"
                      }`}
                    >
                      💡 Lời khuyên ôn tập: {selfCheckValue === "clear" 
                        ? "Chúc mừng bạn! Hãy bấm nút Hoàn thành Unit bên dưới để hoàn tất và nhận thưởng."
                        : selfCheckValue === "partial"
                        ? "Hãy tận dụng tủ thẻ ôn tập Spaced Repetition (FSRS) ở Dashboard để ôn luyện thêm hàng ngày."
                        : "Đừng lo lắng! Tiếng Anh cần thời gian tích lũy. Bạn có thể xem lại học liệu hoặc thực hành thêm một lần nữa."}
                    </motion.div>
                  )}
                </div>

                {/* Part 3: Auto Review (FSRS) integration */}
                <div className="space-y-4 pt-6 border-t border-zinc-100">
                  <h3 className="font-bold text-base text-foreground">
                    Bài tập 4.3: Lưu 12 từ vựng vào Hộp thẻ ôn tập FSRS
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Chọn các từ vựng dưới đây để thêm vào kho ôn tập Spaced Repetition (FSRS) của bạn để ôn lại hàng ngày.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {unit1.vocab.map((item) => {
                      const isAdded = addedVocab.includes(item.word);
                      const isSaving = savingVocab === item.word;

                      return (
                        <div key={item.word} className="p-3 border border-zinc-100 rounded-xl bg-muted/10 flex items-center justify-between gap-3 shadow-xs">
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs text-foreground uppercase truncate">
                              {item.word}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate">
                              {item.meaning}
                            </p>
                          </div>
                          
                          <Button
                            size="sm"
                            disabled={isAdded || isSaving}
                            onClick={() => handleSaveToSRS(item.word, item.phonetic, item.meaning, item.example)}
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

                {/* Part 4: Complete Unit action button */}
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
                          <CheckCircle className="size-4 mr-1.5 text-emerald-600" /> Đã hoàn thành Unit
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
                <span><strong>Input:</strong> Tập trung nghe phát âm chính xác của các câu chào để kết nối với nghĩa và rèn âm cơ bản.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 size-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">2</span>
                <span><strong>Processing:</strong> Ghi nhớ 12 từ vựng qua Flashcards, hoàn thành Cloze test và nắm chắc cách dùng động từ To Be.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 size-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">3</span>
                <span><strong>Output:</strong> Nghe & luyện nói Shadowing với hội thoại mẫu, sau đó thực hiện Nhập vai (Roleplay) với Bot.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-600 bg-emerald-50 size-5 rounded-full flex items-center justify-center shrink-0 text-[10px]">4</span>
                <span><strong>Review:</strong> Làm bài quiz 10 câu, tự chấm điểm hiểu bài và lưu từ vựng vào FSRS để hoàn thành Unit 1.</span>
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
