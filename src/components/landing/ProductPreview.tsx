"use client";

import { useState, useEffect } from "react";
import { Mic, Volume2, Eye, Flame, CheckCircle, Sparkles, RefreshCw, Star } from "lucide-react";

export default function ProductPreview() {
  const [activeTab, setActiveTab] = useState<"speaking" | "srs" | "dashboard">("speaking");

  // Speaking simulator states
  const [speakingStatus, setSpeakingStatus] = useState<"idle" | "listening" | "analyzing" | "done">("idle");
  const [waveform, setWaveform] = useState<number[]>([10, 15, 20, 15, 10]);

  // Flashcard states
  const [isFlipped, setIsFlipped] = useState(false);

  // Simulate speaking waveform animation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (speakingStatus === "listening") {
      interval = setInterval(() => {
        setWaveform(Array.from({ length: 8 }, () => Math.floor(Math.random() * 30) + 5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [speakingStatus]);

  const startSpeakingSimulation = () => {
    setSpeakingStatus("listening");
    setTimeout(() => {
      setSpeakingStatus("analyzing");
      setTimeout(() => {
        setSpeakingStatus("done");
      }, 1500);
    }, 3000);
  };

  const resetSpeaking = () => {
    setSpeakingStatus("idle");
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 sm:mt-16 rounded-[2rem] border border-zinc-200/60 dark:border-zinc-800/60 bg-white/50 dark:bg-zinc-950/20 backdrop-blur-md overflow-hidden shadow-2xl shadow-zinc-900/[0.05] dark:shadow-black/30">
      {/* Window Title Bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center gap-1.5">
          <div className="size-3 rounded-full bg-red-400" />
          <div className="size-3 rounded-full bg-yellow-400" />
          <div className="size-3 rounded-full bg-emerald-400" />
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono ml-3">app.atoenglish.com/preview</span>
        </div>
        
        {/* Navigation Tabs inside the browser header */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("speaking")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === "speaking"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/10"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
            }`}
          >
            Luyện nói AI
          </button>
          <button
            onClick={() => {
              setActiveTab("srs");
              setIsFlipped(false);
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === "srs"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/10"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
            }`}
          >
            Thẻ Từ Vựng (SRS)
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all duration-200 ${
              activeTab === "dashboard"
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/10"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/50"
            }`}
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="p-6 sm:p-10 min-h-[360px] flex items-center justify-center bg-grid-pattern bg-white dark:bg-zinc-950 transition-colors duration-300">
        
        {/* TAB 1: AI SPEAKING SHADOWING */}
        {activeTab === "speaking" && (
          <div className="w-full max-w-md space-y-6 text-left animate-fade-in">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 px-3 py-1 rounded-full w-fit">
              <Sparkles className="size-3 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span>Shadowing & Phản hồi AI</span>
            </div>
            
            <div className="p-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/15 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Mẫu phát âm chuẩn:</span>
                <button className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300">
                  <Volume2 className="size-4" />
                  <span>Nghe mẫu</span>
                </button>
              </div>
              
              <h3 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                Nice to meet you. My name is Nam.
              </h3>
              
              <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                /naɪs tu mit ju. maɪ neɪm ɪz nɑm./
              </p>
            </div>

            {/* Speaking actions and feedback */}
            <div className="flex flex-col items-center gap-4 justify-center py-2">
              {speakingStatus === "idle" && (
                <button
                  onClick={startSpeakingSimulation}
                  className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold h-14 px-8 rounded-2xl shadow-lg shadow-emerald-600/15 active:scale-95 transition-all duration-200 group"
                >
                  <Mic className="size-5 animate-pulse text-emerald-100 group-hover:scale-110 transition-transform" />
                  <span>Nhấn để bắt đầu nói</span>
                </button>
              )}

              {speakingStatus === "listening" && (
                <div className="flex flex-col items-center gap-3 w-full">
                  <div className="flex items-end justify-center gap-1.5 h-12">
                    {waveform.map((height, i) => (
                      <div
                        key={i}
                        style={{ height: `${height}px` }}
                        className="w-1.5 bg-red-500 rounded-full transition-all duration-100"
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-red-500 animate-pulse uppercase tracking-wider">
                    Hệ thống đang ghi âm... Hãy nói mẫu trên
                  </span>
                </div>
              )}

              {speakingStatus === "analyzing" && (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="size-6 text-emerald-600 dark:text-emerald-400 animate-spin" />
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    AI đang phân tích giọng nói của bạn...
                  </span>
                </div>
              )}

              {speakingStatus === "done" && (
                <div className="w-full p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-center space-y-4 animate-scale-up">
                  <div className="flex items-center justify-center gap-2">
                    <div className="size-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
                      A
                    </div>
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                      Độ chính xác: 96% (Xuất sắc)
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-350">
                    Bạn phát âm chuẩn âm cuối <strong className="text-emerald-700 dark:text-emerald-400">/s/</strong> trong từ &quot;is&quot; và âm <strong className="text-emerald-700 dark:text-emerald-400">/t/</strong> trong từ &quot;meet&quot;.
                  </p>

                  <button
                    onClick={resetSpeaking}
                    className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 underline"
                  >
                    Thử nói lại
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SRS FLASHCARDS */}
        {activeTab === "srs" && (
          <div className="w-full max-w-sm space-y-6 animate-fade-in text-left">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-700 dark:text-amber-500 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 px-3 py-1 rounded-full w-fit">
              <Star className="size-3 text-amber-500 fill-amber-500 animate-pulse" />
              <span>Hộp thẻ lặp lại ngắt quãng</span>
            </div>

            {/* Flashcard container with flip simulation */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="relative w-full h-56 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/50 bg-gradient-to-br from-zinc-50/50 to-white dark:from-zinc-900/10 dark:to-zinc-950/20 shadow-lg cursor-pointer flex flex-col justify-between p-6 overflow-hidden group hover:border-amber-500/35 dark:hover:border-amber-500/25 transition-all duration-300 select-none"
            >
              {!isFlipped ? (
                // Front of the card
                <>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-amber-800 dark:text-amber-500 uppercase tracking-widest font-mono">
                      Từ cần nhớ (Front)
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">Chạm để lật nghĩa</span>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                      Persistent
                    </h3>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                      /pəˈsɪs.tənt/
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-bold group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                    <Eye className="size-4" />
                    <span>Xem giải nghĩa từ</span>
                  </div>
                </>
              ) : (
                // Back of the card
                <div className="flex flex-col justify-between h-full animate-flip">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-mono">
                      Ý nghĩa (Back)
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400">Chạm để quay lại</span>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-lg font-black text-zinc-900 dark:text-zinc-50">
                      Kiên trì, bền bỉ, không bỏ cuộc
                    </h4>
                    <p className="text-xs sm:text-sm text-zinc-650 dark:text-zinc-450 italic leading-relaxed">
                      &quot;She is persistent in practicing English speaking every day.&quot;
                    </p>
                  </div>

                  <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                    Ví dụ thực tế giúp hình dung ngữ cảnh
                  </div>
                </div>
              )}
            </div>

            {/* SRS ratings */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <button className="flex-1 py-2 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold transition-colors">
                Chưa nhớ
              </button>
              <button className="flex-1 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-650 dark:text-zinc-350 text-xs font-bold transition-colors">
                Khó
              </button>
              <button className="flex-1 py-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold transition-colors">
                Nhớ tốt
              </button>
              <button className="flex-1 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors">
                Dễ
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: INNER DASHBOARD PREVIEW */}
        {activeTab === "dashboard" && (
          <div className="w-full max-w-md grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in text-left">
            {/* Circle Tracker */}
            <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/15 backdrop-blur-sm p-5 flex flex-col items-center justify-between text-center min-h-[190px]">
              <div className="w-full flex items-center justify-between">
                <span className="font-extrabold text-[10px] text-zinc-400 uppercase tracking-wider">XP Ngày</span>
                <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Hàng ngày</span>
              </div>
              
              <div className="relative size-20 flex items-center justify-center my-1.5">
                <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" className="stroke-zinc-100 dark:stroke-zinc-800 fill-none" strokeWidth="6" />
                  <circle cx="50" cy="50" r="40" className="stroke-emerald-600 fill-none" strokeWidth="7" strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center leading-none">
                  <span className="text-lg font-black text-zinc-900 dark:text-zinc-50">70%</span>
                  <span className="text-[8px] font-extrabold text-zinc-400 uppercase font-mono mt-0.5">50 / 80 XP</span>
                </div>
              </div>

              <div className="text-[11px] font-bold text-zinc-650 dark:text-zinc-350">
                Luyện thêm 30 XP để hoàn thành!
              </div>
            </div>

            {/* Streak Tracker & Quests preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-orange-500/10 border border-orange-500/20 px-4 py-3 shadow-sm shadow-orange-500/5">
                <Flame className="size-5 text-orange-500 fill-orange-500 animate-pulse" />
                <div className="text-left leading-tight">
                  <div className="text-[9px] text-orange-800 dark:text-orange-400 font-extrabold uppercase">Thói quen</div>
                  <span className="text-sm font-black text-orange-600 dark:text-orange-400">
                    5 ngày liên tục
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-900/15 backdrop-blur-sm space-y-2">
                <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider">Nhiệm vụ hôm nay</span>
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="size-4 text-emerald-500 fill-emerald-500/10" />
                    <span className="text-zinc-500 dark:text-zinc-400 line-through">Học 1 bài mới</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    <div className="size-4 rounded-full border border-zinc-300 dark:border-zinc-700" />
                    <span>Luyện nói 10 từ SRS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
