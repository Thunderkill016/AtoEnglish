"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  BookOpen,
  Cpu,
  PenTool,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Volume2,
  Bookmark,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Plus,
  Loader2,
  Mic,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { saveCardToSRS } from "@/app/actions/cards";
import { completeUnit, getUnitCompletionStatus } from "@/app/actions/progress";
import { UNIT_VOCABULARY } from "@/lib/constants/vocabulary";
import { toast } from "sonner";

export default function LearnPage() {
  const [activePhase, setActivePhase] = useState<"input" | "processing" | "output" | "review">("processing");
  const [addedVocab, setAddedVocab] = useState<string[]>([]);
  const [savingVocab, setSavingVocab] = useState<string | null>(null);
  const [savedSentences, setSavedSentences] = useState<boolean>(false);
  const [userSentence, setUserSentence] = useState<string>("");
  const [isUnitCompleted, setIsUnitCompleted] = useState<boolean>(false);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  useEffect(() => {
    async function checkStatus() {
      const res = await getUnitCompletionStatus("unit-4");
      if (res.success && res.completed) {
        setIsUnitCompleted(true);
      }
    }
    checkStatus();
  }, []);

  const handleCompleteUnit = async () => {
    setIsCompleting(true);
    try {
      const res = await completeUnit("unit-4");
      if (res.success) {
        setIsUnitCompleted(true);
        // Bắn pháo hoa chúc mừng lớn
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        toast.success(res.message || "Chúc mừng! Bạn đã hoàn thành Unit này và nhận được 80 XP.");
      } else {
        toast.error(res.error || "Không thể hoàn thành bài học.");
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      toast.error(`Có lỗi xảy ra: ${errMsg}`);
    } finally {
      setIsCompleting(false);
    }
  };

  const unitInfo = {
    title: "Unit 4: Technology & Society",
    subtitle: "Chủ đề: Công nghệ và Xã hội loài người",
    progress: 40,
  };

  const iporSteps = [
    {
      id: "input",
      title: "1. Input",
      icon: BookOpen,
      desc: "Nạp ngữ cảnh bài đọc",
    },
    {
      id: "processing",
      title: "2. Processing",
      icon: Cpu,
      desc: "Phân tích ngữ pháp",
    },
    {
      id: "output",
      title: "3. Output",
      icon: PenTool,
      desc: "Đặt câu thực tế",
    },
    {
      id: "review",
      title: "4. Review",
      icon: RotateCcw,
      desc: "Đẩy từ vựng vào SRS",
    },
  ] as const;

  const vocabularyList = (UNIT_VOCABULARY["unit-4"] || []).map((v) => ({
    word: v.word,
    ipa: v.phonetic,
    meaning: v.meaning_vn,
    example: v.example_en
  }));

  const handleSaveToSRS = async (word: string, ipa: string, meaning: string, example: string) => {
    if (addedVocab.includes(word)) {
      toast.info(`Từ "${word}" đã được lưu từ trước.`);
      return;
    }

    setSavingVocab(word);
    
    try {
      const res = await saveCardToSRS({
        word,
        phonetic: ipa,
        meaning_vn: meaning,
        example_en: example,
        topic: "Technology",
        level: "B1"
      });

      if (res.success) {
        setAddedVocab((prev) => [...prev, word]);
        toast.success(res.message);
        
        // Bắn pháo hoa mini
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { x: 0.9, y: 0.9 }
        });
      } else {
        toast.error(res.error || "Không thể lưu từ vựng.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      toast.error(`Có lỗi xảy ra: ${errorMessage}`);
    } finally {
      setSavingVocab(null);
    }
  };

  const handleStepClick = (stepId: typeof activePhase) => {
    setActivePhase(stepId);
    if (stepId === "review") {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 bg-grid-pattern min-h-screen">
      {/* Soft background ambient blurs */}
      <div className="absolute top-10 left-10 -z-10 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 -z-10 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />

      {/* Lesson Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-foreground/[0.05]"
      >
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="size-3.5" />
            Lộ trình B1 Intermediate
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mt-1 leading-tight">
            {unitInfo.title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            {unitInfo.subtitle}
          </p>
        </div>

        {/* Lesson Progress Card */}
        <div className="w-full sm:w-72 space-y-2 bg-glass border border-glass p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.015)]">
          <div className="flex justify-between text-xs text-muted-foreground font-bold">
            <span>Tiến độ chương học</span>
            <span className="text-foreground">{unitInfo.progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden relative">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${unitInfo.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* IPOR Steps Stepper (Sliding Pill navigation) */}
      <div className="bg-glass border border-glass p-1.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)] grid grid-cols-2 md:flex md:flex-nowrap gap-1">
        {iporSteps.map((step) => {
          const Icon = step.icon;
          const isActive = activePhase === step.id;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className="flex-1 min-w-0 text-left p-3 rounded-xl transition-all relative overflow-hidden group select-none"
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl"
                  transition={{ type: "spring", stiffness: 130, damping: 19 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-foreground/[0.05]"
                }`}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0">
                  <h3 className={`font-bold text-[10px] sm:text-xs uppercase tracking-wider ${isActive ? "text-primary" : "text-foreground"} truncate`}>
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

      {/* Main IPOR Workspace */}
      <div className="grid gap-8 lg:grid-cols-3 items-start">
        {/* Content Area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {activePhase === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg sm:text-xl text-foreground flex items-center gap-2.5">
                    <BookOpen className="size-5.5 text-primary" />
                    Pha 1: Input (Đọc & Nghe)
                  </h3>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 border-glass h-9 hover:bg-primary/5 hover:text-primary transition-colors">
                    <Volume2 className="size-4" />
                    Nghe Audio
                  </Button>
                </div>

                <div className="space-y-5 text-sm sm:text-base leading-relaxed text-foreground/90 font-sans font-normal tracking-wide bg-foreground/[0.01] p-6 rounded-2xl border border-foreground/[0.03]">
                  <p>
                    In the 21st century, <strong className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold underline underline-offset-4 decoration-primary/30">artificial intelligence</strong> has become <strong className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold underline underline-offset-4 decoration-primary/30">omnipresent</strong>. It is no longer a concept confined to science fiction novels, but an active technology driving our everyday lives.
                  </p>
                  <p>
                    From autonomous self-driving cars to algorithms that recommend our next favorite songs, AI technologies are beginning to <strong className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold underline underline-offset-4 decoration-primary/30">revolutionize</strong> how society operates. However, as we integrate machines deeper into our social fabrics, questions arise about ethics and security.
                  </p>
                </div>

                <div className="pt-5 border-t border-foreground/[0.04] flex justify-end">
                  <Button onClick={() => handleStepClick("processing")} className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2 font-semibold shadow-md active:scale-[0.98] h-12 sm:h-11 px-6 transition-all duration-200">
                    <span>Tiếp tục bước Processing</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {activePhase === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h3 className="font-bold text-lg sm:text-xl text-foreground flex items-center gap-2.5">
                    <Cpu className="size-5.5 text-primary" />
                    Pha 2: Processing (Phân tích từ & Ngữ pháp)
                  </h3>
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-normal">
                    <AlertCircle className="size-4 text-primary animate-pulse" />
                    Click nút bên phải để lưu từ mới
                  </span>
                </div>

                {/* Grammar Highlight Component */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/15 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-primary">Cấu trúc Ngữ pháp tiêu điểm</span>
                      <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-lg font-semibold">B1 Level</span>
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-foreground">Sử dụng mệnh đề: confined to / revolutionize how...</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                      Cấu trúc <strong>&quot;revolutionize how [clause]&quot;</strong> dùng để mô tả sự thay đổi mang tính cách mạng đối với cách thức hoạt động của một cái gì đó.
                    </p>
                    <div className="text-xs sm:text-sm bg-background/50 p-3.5 rounded-xl font-mono text-foreground/80 border border-foreground/[0.04]">
                      Ví dụ: &quot;AI will revolutionize how we learn languages.&quot; (AI sẽ cách mạng hóa cách chúng ta học ngôn ngữ.)
                    </div>
                  </div>

                  {/* Vocabulary table representation */}
                  <div className="border border-foreground/[0.05] rounded-2xl overflow-hidden divide-y divide-foreground/[0.05] bg-foreground/[0.01]">
                    {vocabularyList.map((vocab) => {
                      const isAdded = addedVocab.includes(vocab.word);
                      return (
                        <div key={vocab.word} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-foreground/[0.02] transition-colors gap-3.5 sm:gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-bold text-sm sm:text-base text-foreground leading-tight">{vocab.word}</span>
                              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{vocab.ipa}</span>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-normal">{vocab.meaning}</p>
                          </div>
                          <Button
                            onClick={() => handleSaveToSRS(vocab.word, vocab.ipa, vocab.meaning, vocab.example)}
                            disabled={isAdded || savingVocab === vocab.word}
                            variant={isAdded ? "secondary" : "outline"}
                            size="sm"
                            className={`w-full sm:w-auto rounded-xl text-xs gap-1.5 h-12 sm:h-9 border-glass active:scale-[0.97] transition-all duration-200 shrink-0 ${
                              isAdded 
                                ? "text-emerald-600 bg-emerald-500/10 border-emerald-500/30 shadow-sm font-semibold opacity-100" 
                                : "hover:bg-primary/5 hover:text-primary font-semibold"
                            }`}
                          >
                            {savingVocab === vocab.word ? (
                              <>
                                <Loader2 className="size-4 animate-spin" />
                                <span>Đang lưu...</span>
                              </>
                            ) : isAdded ? (
                              <>
                                <CheckCircle className="size-4 text-emerald-500" />
                                <span>Đã lưu vào SRS</span>
                              </>
                            ) : (
                              <>
                                <Plus className="size-4" />
                                <span>+ Lưu vào SRS</span>
                              </>
                            )}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-5 border-t border-foreground/[0.04] flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="ghost" onClick={() => handleStepClick("input")} className="w-full sm:w-auto rounded-xl h-12 sm:h-11 px-5 hover:bg-muted font-bold text-xs uppercase tracking-wider">
                    Quay lại
                  </Button>
                  <Button onClick={() => handleStepClick("output")} className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2 font-semibold shadow-md active:scale-[0.98] h-12 sm:h-11 px-6 transition-all duration-250">
                    <span>Thực hành Output</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {activePhase === "output" && (
              <motion.div
                key="output"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="rounded-3xl border border-glass bg-glass p-6 sm:p-8 space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
              >
                <h3 className="font-bold text-lg sm:text-xl text-foreground flex items-center gap-2.5">
                  <PenTool className="size-5.5 text-primary" />
                  Pha 3: Output (Thực hành viết câu)
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground font-normal">
                  Hãy tự đặt 1 câu tiếng Anh cá nhân hóa sử dụng từ vựng đã học hôm nay: <strong>omnipresent</strong> hoặc <strong>revolutionize</strong>.
                </p>

                <div className="space-y-4">
                  <motion.textarea
                    whileFocus={{ scale: 1.005 }}
                    value={userSentence}
                    onChange={(e) => setUserSentence(e.target.value)}
                    className="w-full min-h-[140px] rounded-2xl border border-glass bg-muted/20 p-5 text-sm sm:text-base focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground/50 transition-all"
                    placeholder="Ví dụ: AI is becoming omnipresent in modern schools, revolutionizing how students study."
                  />
                  
                  {savedSentences ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-start gap-3 shadow-sm"
                    >
                      <CheckCircle className="size-5 shrink-0 mt-0.5 fill-emerald-500/10" />
                      <div className="space-y-1">
                        <p className="font-bold text-foreground">Tuyệt vời! Câu của bạn đã được ghi nhận.</p>
                        <p className="text-xs text-muted-foreground font-normal">AI đã tự động phân tích ngữ pháp: Câu hoàn toàn chính xác.</p>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-normal">
                        <HelpCircle className="size-4 text-primary animate-pulse" />
                        Gợi ý: Cố gắng diễn đạt ý kiến thật của bản thân.
                      </span>
                      <Button 
                        onClick={() => {
                          if (userSentence.trim()) {
                            setSavedSentences(true);
                            confetti({ particleCount: 30, spread: 40 });
                          }
                        }}
                        disabled={!userSentence.trim()}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl font-semibold shadow-md active:scale-[0.98] h-12 sm:h-11 px-6 transition-all duration-200 disabled:opacity-50"
                      >
                        Nộp câu trả lời
                      </Button>
                    </div>
                  )}
                </div>

                <div className="pt-5 border-t border-foreground/[0.04] flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="ghost" onClick={() => handleStepClick("processing")} className="w-full sm:w-auto rounded-xl h-12 sm:h-11 px-5 hover:bg-muted font-bold text-xs uppercase tracking-wider">
                    Quay lại
                  </Button>
                  <Button onClick={() => handleStepClick("review")} className="w-full sm:w-auto bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl gap-2 font-semibold shadow-md active:scale-[0.98] h-12 sm:h-11 px-6 transition-all duration-200">
                    <span>Đến bước Review</span>
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {activePhase === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-glass bg-glass p-8 text-center space-y-6 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
              >
                <motion.div 
                  className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <RotateCcw className="size-8" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="font-black text-xl sm:text-2xl text-foreground">Bạn đã hoàn thành bài học!</h3>
                  <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                    Tuyệt vời! Bạn đã đi qua đủ 3 pha của mô hình IPOR. Hệ thống đã đóng gói các từ vựng mới thành thẻ nhớ Spaced Repetition (SRS).
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-foreground/[0.02] border border-foreground/[0.05] max-w-sm mx-auto text-left space-y-3 shadow-inner">
                  <h4 className="font-extrabold text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground">Thẻ ôn tập đã được tạo:</h4>
                  <ul className="text-xs sm:text-sm text-foreground/80 space-y-2.5 font-bold">
                    <li className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-primary" />
                      artificial intelligence
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-primary" />
                      omnipresent
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="size-2 rounded-full bg-primary" />
                      revolutionize
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-foreground/[0.04] flex flex-col items-center gap-4">
                  {/* Nút Hoàn thành Unit nổi bật */}
                  <Button
                    onClick={handleCompleteUnit}
                    disabled={isUnitCompleted || isCompleting}
                    size="lg"
                    className={`w-full max-w-sm rounded-xl font-bold h-12 shadow-lg transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 ${
                      isUnitCompleted
                        ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 hover:bg-emerald-500/15 cursor-default opacity-100"
                        : "bg-gradient-to-r from-primary via-violet-600 to-indigo-600 hover:from-primary hover:to-indigo-700 text-white shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
                    }`}
                  >
                    {isCompleting ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : isUnitCompleted ? (
                      <>
                        <CheckCircle className="size-5 text-emerald-500" />
                        <span>Đã hoàn thành Unit này (+80 XP)</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-5 text-yellow-300 animate-pulse" />
                        <span>Hoàn thành Unit này (+80 XP)</span>
                      </>
                    )}
                  </Button>

                  <div className="flex flex-col sm:flex-row justify-center gap-3 w-full">
                    {isUnitCompleted && (
                      <Button
                        onClick={() => window.location.href = "/speaking?id=tech-society"}
                        className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold h-12 sm:h-11 px-5 active:scale-[0.98] transition-all duration-200 gap-1.5"
                      >
                        <Mic className="size-4" />
                        <span>Luyện nói chủ đề này ngay</span>
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => handleStepClick("input")} className="w-full sm:w-auto rounded-xl border-glass h-12 sm:h-11 px-5 hover:bg-muted font-bold text-xs uppercase tracking-wider">
                      Học lại bài đọc
                    </Button>
                    <Button onClick={() => window.location.href = "/flashcards"} className="w-full sm:w-auto bg-secondary hover:bg-secondary/95 text-secondary-foreground rounded-xl font-semibold border border-foreground/[0.05] h-12 sm:h-11 px-5 transition-all duration-200">
                      Mở Trình Ôn Tập Flashcard
                    </Button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar details */}
        <div className="space-y-6">
          {/* IPOR Framework Info */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-glass bg-glass p-6 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
          >
            <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">
              Khung học tập IPOR
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              Mô hình <strong>IPOR</strong> giúp chuyển đổi tiếng Anh từ ghi nhớ ngắn hạn sang trí nhớ dài hạn. Bạn nạp ngữ cảnh bài viết (Input), mổ xẻ ngữ pháp (Processing), chủ động đặt câu tự viết (Output) và phản xạ lặp lại ngắt quãng (Review).
            </p>
            <div className="text-xs text-primary bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-start gap-2.5 leading-relaxed font-normal">
              <Sparkles className="size-5 shrink-0 mt-0.5 text-primary animate-pulse" />
              <span>Chủ động đặt câu giúp bạn tăng 300% khả năng phản xạ và ghi nhớ từ mới tự nhiên.</span>
            </div>
          </motion.div>

          {/* Sổ tay từ vựng */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-glass bg-glass p-6 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.015)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">
                Từ vựng đã lưu hôm nay
              </h3>
              <Bookmark className="size-4.5 text-muted-foreground" />
            </div>
            
            <div className="space-y-2">
              <AnimatePresence>
                {addedVocab.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-xs text-center py-8 text-muted-foreground border border-dashed border-foreground/10 rounded-2xl bg-foreground/[0.01]"
                  >
                    Chưa có từ nào được lưu.
                  </motion.div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {addedVocab.map((w) => (
                      <motion.span 
                        key={w} 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-xs px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/10 shadow-sm animate-float inline-block"
                      >
                        {w}
                      </motion.span>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}