"use client";

import { useState } from "react";
import {
  Volume2,
  Layers,
  RotateCcw,
  HelpCircle,
  Folder,
  Award,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Flashcard {
  id: string;
  word: string;
  phonetic: string;
  pos: string;
  meaning_vn: string;
  example_en: string;
  example_vn: string;
  topic: string;
  level: string;
}

export default function FlashcardsPage() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [showFinished, setShowFinished] = useState(false);
  const [responseLog, setResponseLog] = useState<{ word: string; score: string }[]>([]);

  const mockCards: Flashcard[] = [
    {
      id: "card-1",
      word: "omnipresent",
      phonetic: "/ˌɒm.nɪˈprez.ənt/",
      pos: "adjective",
      meaning_vn: "có mặt khắp mọi nơi, phổ biến rộng rãi",
      example_en: "Smartphones have become omnipresent in modern society.",
      example_vn: "Điện thoại thông minh đã trở nên phổ biến khắp mọi nơi trong xã hội hiện đại.",
      topic: "Technology",
      level: "B1",
    },
    {
      id: "card-2",
      word: "artificial intelligence",
      phonetic: "/ˌɑː.tɪ.fɪʃ.əl ɪnˈtel.ɪ.dʒəns/",
      pos: "noun",
      meaning_vn: "trí tuệ nhân tạo (hệ thống mô phỏng trí tuệ con người)",
      example_en: "Artificial intelligence is capable of translating complex documents.",
      example_vn: "Trí tuệ nhân tạo có khả năng dịch thuật các tài liệu phức tạp.",
      topic: "Technology",
      level: "B1",
    },
    {
      id: "card-3",
      word: "revolutionize",
      phonetic: "/ˌrev.əˈluː.ʃən.aɪz/",
      pos: "verb",
      meaning_vn: "cách mạng hóa, làm biến đổi hoàn toàn",
      example_en: "The printing press revolutionized how knowledge was distributed.",
      example_vn: "Máy in đã cách mạng hóa cách thức tri thức được phân phối.",
      topic: "History & Tech",
      level: "B2",
    },
  ];

  const handleAudioPlay = (e: React.MouseEvent, text: string) => {
    e.stopPropagation(); // Prevent flipping card when clicking audio button
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleResponse = (scoreLabel: string) => {
    const currentCard = mockCards[currentIndex];
    
    // Log the user's assessment of their recall
    setResponseLog([...responseLog, { word: currentCard.word, score: scoreLabel }]);
    setAnsweredCount(answeredCount + 1);

    if (currentIndex < mockCards.length - 1) {
      setIsFlipped(false);
      // Wait for flip transition back before changing content
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, 250);
    } else {
      setShowFinished(true);
    }
  };

  const resetReview = () => {
    setCurrentIndex(0);
    setAnsweredCount(0);
    setIsFlipped(false);
    setShowFinished(false);
    setResponseLog([]);
  };

  const currentCard = mockCards[currentIndex];
  const progressPercentage = ((currentIndex + (isFlipped ? 0.5 : 0)) / mockCards.length) * 100;

  return (
    <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary px-2.5 py-0.5 rounded-full bg-primary/10">
            <Layers className="size-3.5" />
            Spaced Repetition (SRS)
          </span>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground">
            Thẻ ôn tập từ vựng
          </h1>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Tiến trình ôn tập</div>
          <div className="text-sm font-bold text-foreground font-mono">
            {currentIndex + 1} / {mockCards.length} thẻ
          </div>
        </div>
      </div>

      {/* Main Review Arena */}
      {!showFinished ? (
        <div className="space-y-8">
          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* 3D Flashcard Container */}
          <div className="flex justify-center">
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full max-w-md h-80 perspective-1000 cursor-pointer group"
            >
              <div
                className={`relative w-full h-full duration-500 preserve-3d ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
              >
                {/* CARD FRONT */}
                <div className="absolute w-full h-full backface-hidden rounded-3xl bg-glass border border-glass p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border/40">
                      <Folder className="size-3" />
                      {currentCard.topic}
                    </span>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-primary/20 text-primary border border-primary/20">
                      {currentCard.level}
                    </span>
                  </div>

                  <div className="text-center space-y-3">
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground/85 bg-clip-text select-all">
                      {currentCard.word}
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-sm font-mono text-muted-foreground">{currentCard.phonetic}</span>
                      <Button
                        onClick={(e) => handleAudioPlay(e, currentCard.word)}
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors text-muted-foreground"
                        aria-label="Phát âm tiếng Anh"
                      >
                        <Volume2 className="size-4.5" />
                      </Button>
                    </div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted/65 text-muted-foreground font-mono">
                      {currentCard.pos}
                    </span>
                  </div>

                  <div className="text-center text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
                    <HelpCircle className="size-3.5" />
                    <span>Click vào thẻ để xem mặt sau</span>
                  </div>
                </div>

                {/* CARD BACK */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-glass to-emerald-500/5 border border-glass p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Nghĩa từ vựng
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">Mặt sau</span>
                  </div>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-foreground">
                        {currentCard.meaning_vn}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/40 space-y-1 text-left">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground">Ví dụ thực tế</span>
                        <Button
                          onClick={(e) => handleAudioPlay(e, currentCard.example_en)}
                          variant="ghost"
                          size="icon"
                          className="size-6 rounded-full hover:bg-muted text-muted-foreground"
                        >
                          <Volume2 className="size-3.5" />
                        </Button>
                      </div>
                      <p className="text-sm font-semibold text-foreground/90 italic">
                        &quot;{currentCard.example_en}&quot;
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {currentCard.example_vn}
                      </p>
                    </div>
                  </div>

                  <div className="text-center text-xs text-muted-foreground/60 flex items-center justify-center gap-1">
                    <HelpCircle className="size-3.5" />
                    <span>Click vào thẻ để lật lại mặt trước</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SRS Response Controls */}
          <div className="flex flex-col items-center gap-4">
            {!isFlipped ? (
              <Button
                onClick={() => setIsFlipped(true)}
                className="w-full max-w-xs h-11 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl shadow-md transition-all duration-300"
              >
                Lật mặt sau (Show Answer)
              </Button>
            ) : (
              <div className="w-full max-w-md space-y-3">
                <p className="text-xs font-bold text-center uppercase tracking-wider text-muted-foreground">
                  Đánh giá độ nhớ của bạn để thuật toán xếp lịch:
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Again", code: "again", desc: "Quên từ", color: "hover:bg-red-500 hover:text-white text-red-600 bg-red-500/5 dark:bg-red-500/10 border-red-500/20" },
                    { label: "Hard", code: "hard", desc: "Nhớ mang máng", color: "hover:bg-orange-500 hover:text-white text-orange-600 bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/20" },
                    { label: "Good", code: "good", desc: "Nhớ tốt", color: "hover:bg-blue-500 hover:text-white text-blue-600 bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/20" },
                    { label: "Easy", code: "easy", desc: "Nhớ rất rõ", color: "hover:bg-emerald-500 hover:text-white text-emerald-600 bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20" },
                  ].map((btn) => (
                    <button
                      key={btn.code}
                      onClick={() => handleResponse(btn.label)}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${btn.color}`}
                    >
                      <span>{btn.label}</span>
                      <span className="text-[9px] opacity-75 font-normal mt-0.5">{btn.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Finished Arena */
        <div className="rounded-3xl border border-glass bg-glass p-8 text-center max-w-md mx-auto space-y-6 shadow-md animate-float">
          <div className="inline-flex size-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <Award className="size-8" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Tuyệt vời! Đã hoàn thành!</h2>
            <p className="text-sm text-muted-foreground">
              Bạn đã ôn tập xong tất cả {mockCards.length} từ vựng cần ôn trong ngày hôm nay. Thuật toán đã tự động tính toán lại lịch ôn tập tiếp theo cho bạn.
            </p>
          </div>

          {/* Log summaries */}
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/40 text-left space-y-2 text-xs">
            <span className="font-bold text-muted-foreground uppercase tracking-wider">Tóm tắt kết quả:</span>
            <div className="divide-y divide-border/30">
              {responseLog.map((log, idx) => (
                <div key={idx} className="flex justify-between py-1.5 first:pt-0 last:pb-0">
                  <span className="font-semibold text-foreground">{log.word}</span>
                  <span className={`font-bold ${
                    log.score === "Easy" ? "text-emerald-500" : log.score === "Good" ? "text-blue-500" : log.score === "Hard" ? "text-orange-500" : "text-red-500"
                  }`}>{log.score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={resetReview}
              variant="outline"
              className="rounded-xl gap-2 font-medium"
            >
              <RotateCcw className="size-4" />
              Ôn lại
            </Button>
            <Button
              onClick={() => window.location.href = "/dashboard"}
              className="bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-medium"
            >
              Về Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}