"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Loader2, Sparkles, ArrowLeft, Sprout } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LoginSchema, SignUpSchema } from "@/lib/security/validation";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const mode = searchParams.get("mode");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Onboarding Quiz state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checklistIndex, setChecklistIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const supabase = createClient();

  // Check if we should skip the onboarding quiz
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("ato_onboarding_completed") === "true";
    if (mode === "login" || hasCompletedOnboarding) {
      setOnboardingStep(5);
    }
  }, [mode]);

  // Set onboarding completion when user reaches step 5
  useEffect(() => {
    if (onboardingStep === 5) {
      localStorage.setItem("ato_onboarding_completed", "true");
    }
  }, [onboardingStep]);

  useEffect(() => {
    if (onboardingStep === 4) {
      setChecklistIndex(0);
      const t1 = setTimeout(() => setChecklistIndex(1), 800);
      const t2 = setTimeout(() => setChecklistIndex(2), 1600);
      const t3 = setTimeout(() => setChecklistIndex(3), 2400);
      const t4 = setTimeout(() => {
        setDirection(1);
        setOnboardingStep(5);
      }, 3200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [onboardingStep]);

  const questions = [
    {
      id: 1,
      title: "Trình độ tiếng Anh hiện tại của bạn?",
      options: [
        { label: "Mất gốc / Chưa biết gì", val: "A0-A1" },
        { label: "Biết từ vựng cơ bản, chưa nói được", val: "A2" },
        { label: "Giao tiếp được trung bình, phản xạ chậm", val: "B1" },
        { label: "Tự tin nói tiếng Anh trôi chảy", val: "B2+" }
      ]
    },
    {
      id: 2,
      title: "Mục tiêu học tiếng Anh của bạn là gì?",
      options: [
        { label: "Để giao tiếp đi làm, thăng tiến sự nghiệp", val: "work" },
        { label: "Để tự tin đi du lịch nước ngoài", val: "travel" },
        { label: "Để học tập, thi chứng chỉ quốc tế", val: "study" },
        { label: "Để rèn luyện phản xạ nói tự tin hàng ngày", val: "daily" }
      ]
    },
    {
      id: 3,
      title: "Thời gian bạn muốn dành ra học mỗi ngày?",
      options: [
        { label: "5 phút/ngày (Bận rộn)", val: "5min" },
        { label: "15 phút/ngày (Tiêu chuẩn)", val: "15min" },
        { label: "30 phút/ngày (Nghiêm túc)", val: "30min" },
        { label: "60 phút/ngày (Tốc hành)", val: "60min" }
      ]
    }
  ];

  const handleAnswerSelect = (qId: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
    setDirection(1);
    if (qId < 3) {
      setOnboardingStep(qId + 1);
    } else {
      setOnboardingStep(4);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const level = answers[1] || "A0-A1";
      const target = answers[2] || "work";
      const time = answers[3] || "15min";
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}&level=${encodeURIComponent(level)}&target=${encodeURIComponent(target)}&time=${encodeURIComponent(time)}`;

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) throw error;
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Đăng nhập bằng Google thất bại.");
      setIsGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ Email và Mật khẩu.");
      return;
    }

    const schema = isSignUp ? SignUpSchema : LoginSchema;
    const validated = schema.safeParse({ email, password });
    if (!validated.success) {
      toast.error(validated.error.issues.map(err => err.message).join(", "));
      return;
    }

    const level = answers[1] || "A0-A1";
    const cefrMap: Record<string, "A1" | "A2" | "B1" | "B2"> = {
      "A0-A1": "A1",
      "A2": "A2",
      "B1": "B1",
      "B2+": "B2"
    };
    const mappedLevel = cefrMap[level] || "A1";

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}&level=${encodeURIComponent(level)}`,
          },
        });
        if (error) throw error;

        if (data?.user) {
          const { data: progress } = await supabase
            .from("user_progress")
            .select("user_id")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (!progress) {
            await supabase.from("user_progress").insert({
              user_id: data.user.id,
              current_level: mappedLevel,
              streak: 0,
              total_xp: 0,
            });
          }

          toast.success("Đăng ký tài khoản thành công!");
          router.push(next);
        } else {
          toast.success("Đăng ký thành công! Vui lòng kiểm tra email xác nhận.");
        }
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (data?.user) {
          const { data: progress } = await supabase
            .from("user_progress")
            .select("user_id")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (!progress) {
            await supabase.from("user_progress").insert({
              user_id: data.user.id,
              current_level: mappedLevel,
              streak: 0,
              total_xp: 0,
            });
          }
        }

        toast.success("Đăng nhập thành công!");
        router.push(next);
        router.refresh();
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Xác thực bằng Email thất bại.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRecapText = () => {
    const levelMap: Record<string, string> = {
      "A0-A1": "Mất gốc",
      "A2": "Cơ bản",
      "B1": "Giao tiếp",
      "B2+": "Trôi chảy"
    };
    const targetMap: Record<string, string> = {
      work: "Đi làm",
      travel: "Du lịch",
      study: "Học tập",
      daily: "Phản xạ"
    };
    const timeMap: Record<string, string> = {
      "5min": "5 phút/ngày",
      "15min": "15 phút/ngày",
      "30min": "30 phút/ngày",
      "60min": "60 phút/ngày"
    };

    const level = levelMap[answers[1]] || "Mất gốc";
    const target = targetMap[answers[2]] || "Đi làm";
    const time = timeMap[answers[3]] || "15 phút/ngày";

    return { level, target, time };
  };

  const recap = getRecapText();

  const checklistItems = [
    "Phân tích trình độ học tập...",
    "Thiết lập chu kỳ ôn tập thông minh (SRS)...",
    "Tối ưu lộ trình luyện nói phản xạ..."
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans flex flex-col lg:flex-row selection:bg-emerald-100 dark:selection:bg-emerald-950/30 selection:text-emerald-900 dark:selection:text-emerald-200">
      
      {/* Left Column: Brand Showcase (Visible only on Desktop) */}
      <div className="hidden lg:flex w-[43%] bg-gradient-to-br from-zinc-900 via-emerald-950 to-zinc-950 p-16 text-white flex-col justify-between relative overflow-hidden select-none border-r border-zinc-800/30">
        {/* Animated ambient backgrounds */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.08, 0.15, 0.08]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-[450px] h-[450px] bg-emerald-500 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.12, 0.08]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-emerald-600 rounded-full blur-3xl pointer-events-none" 
        />
        
        <Link href="/" className="flex items-center gap-2.5 z-10 self-start group">
          <motion.span 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-950/40"
          >
            <Sprout className="size-5" />
          </motion.span>
          <div className="flex flex-col leading-none text-left">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              AtoEnglish
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Grow every day
            </span>
          </div>
        </Link>

        <div className="space-y-8 z-10 max-w-md my-auto">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
            Giai đoạn thử nghiệm mở (Open Beta)
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
            Làm chủ tiếng Anh từ số 0 bằng khoa học ghi nhớ.
          </h2>
          <div className="space-y-4 text-sm text-zinc-300">
            <div className="flex items-start gap-3.5 bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl hover:border-emerald-500/25 transition-all duration-300">
              <div className="size-5.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs mt-0.5 font-bold shrink-0">✓</div>
              <p className="text-zinc-300 leading-relaxed text-left">
                <strong className="text-white">Luyện nói phản xạ:</strong> Thực hành hội thoại tự nhiên và tự sửa phát âm chuẩn xác ngay lập tức.
              </p>
            </div>
            <div className="flex items-start gap-3.5 bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl hover:border-emerald-500/25 transition-all duration-300">
              <div className="size-5.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs mt-0.5 font-bold shrink-0">✓</div>
              <p className="text-zinc-300 leading-relaxed text-left">
                <strong className="text-white">Thẻ học thông minh (SRS):</strong> Thuật toán FSRS tối ưu hóa chu kỳ lặp lại giúp ghi nhớ từ vựng vĩnh viễn.
              </p>
            </div>
            <div className="flex items-start gap-3.5 bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-2xl hover:border-emerald-500/25 transition-all duration-300">
              <div className="size-5.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs mt-0.5 font-bold shrink-0">✓</div>
              <p className="text-zinc-300 leading-relaxed text-left">
                <strong className="text-white">Lộ trình cá nhân hóa:</strong> Bài học ngắn 15 phút mỗi ngày thiết kế riêng cho người Việt mất gốc.
              </p>
            </div>
          </div>
        </div>

        <div className="z-10 text-xs text-zinc-400 border-t border-zinc-800/80 pt-6 text-left">
          Học tập hoàn toàn miễn phí. Tiến trình được tự động đồng bộ đám mây.
        </div>
      </div>

      {/* Right Column: Onboarding / Login Panel */}
      <div className="flex-1 flex flex-col justify-between py-12 px-6 sm:px-12 md:px-16 lg:px-24 bg-white dark:bg-zinc-950 relative overflow-hidden">
        {/* Subtle background glow & Grid for Right column */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[40%] w-[80%] h-[80%] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-3xl" />
          <div className="absolute -bottom-[40%] -right-[40%] w-[80%] h-[80%] rounded-full bg-emerald-600/5 dark:bg-emerald-600/10 blur-3xl" />
          {/* Fine dot pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
        </div>

        {/* Top Navigation */}
        <header className="max-w-md w-full mx-auto flex items-center justify-between mb-8 z-10">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Sprout className="size-4.5" />
            </span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-150 group-hover:text-emerald-600 transition-colors">
                AtoEnglish
              </span>
              <span className="text-[9px] text-zinc-500 font-medium">
                Grow every day
              </span>
            </div>
          </Link>
          
          {onboardingStep > 1 && onboardingStep <= 3 ? (
            <Button 
              variant="ghost" 
              onClick={() => {
                setDirection(-1);
                setOnboardingStep(onboardingStep - 1);
              }}
              className="ml-auto text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-9 gap-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <ArrowLeft className="size-3.5" />
              Quay lại
            </Button>
          ) : (
            <Link href="/" className="ml-auto">
              <Button variant="ghost" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-9 gap-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                <ArrowLeft className="size-3.5" />
                Về trang chủ
              </Button>
            </Link>
          )}
        </header>

        {/* Main Card container */}
        <main className="max-w-md w-full mx-auto my-auto py-4 z-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={onboardingStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.25 }
              }}
              className="flex flex-col space-y-6 text-left"
            >
              {onboardingStep <= 3 ? (
                // Quiz Questions UI
                <div className="space-y-6">
                  {/* Progress bar */}
                  <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                      <span>Khảo sát định hướng</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-100/50 dark:border-emerald-900/30">Câu {onboardingStep} / 3</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800/80 rounded-full overflow-hidden relative">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(onboardingStep / 3) * 100}%` }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                      {questions[onboardingStep - 1].title}
                    </h1>
                  </div>

                  <div className="flex flex-col gap-3 pt-1">
                    {questions[onboardingStep - 1].options.map((opt, idx) => (
                      <motion.button
                        key={idx}
                        type="button"
                        onClick={() => handleAnswerSelect(onboardingStep, opt.val)}
                        whileHover={{ scale: 1.015, y: -0.5 }}
                        whileTap={{ scale: 0.995 }}
                        className="w-full text-left p-4 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/85 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md hover:border-emerald-500/60 dark:hover:border-emerald-500/40 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/10 transition-all duration-300 font-semibold text-sm text-zinc-850 dark:text-zinc-200 hover:text-emerald-800 dark:hover:text-emerald-300 group flex items-center justify-between shadow-sm hover:shadow-md hover:shadow-emerald-500/5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-6 items-center justify-center rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-400 dark:text-zinc-550 group-hover:bg-emerald-500 group-hover:border-emerald-500 group-hover:text-white transition-all duration-300">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt.label}</span>
                        </div>
                        <div className="flex items-center justify-center size-5 rounded-full border border-zinc-200 dark:border-zinc-700 group-hover:border-emerald-500 group-hover:bg-emerald-500/10 transition-all duration-300 shrink-0">
                          <svg className="size-3 text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  <div className="text-center pt-4 border-t border-zinc-150 dark:border-zinc-850/60 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setDirection(1);
                        setOnboardingStep(5);
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300 font-bold transition-colors underline underline-offset-4"
                    >
                      Tôi đã có tài khoản. Đăng nhập ngay
                    </button>
                  </div>
                </div>
              ) : onboardingStep === 4 ? (
                // Quiz Loading simulated calculation UI
                <div className="text-center space-y-6 py-6 flex flex-col items-center">
                  <div className="relative flex justify-center py-4">
                    <div className="relative size-24 flex items-center justify-center">
                      {/* Background ring */}
                      <div className="absolute inset-0 rounded-full border-4 border-zinc-100 dark:border-zinc-850" />
                      {/* Spinning active ring */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent border-r-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                      />
                      {/* Central glowing icon */}
                      <motion.div 
                        animate={{ scale: [0.95, 1.05, 0.95] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute size-16 flex items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 shadow-inner"
                      >
                        <Sprout className="size-8" />
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                      Đang thiết lập lộ trình tối ưu...
                    </h1>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-normal leading-relaxed">
                      Chúng tôi đang cấu hình lớp học dựa trên các tùy chọn của bạn.
                    </p>
                  </div>

                  <div className="w-full space-y-4 py-4 px-6 text-left max-w-sm mx-auto bg-zinc-50/50 dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-850 p-6 rounded-2xl backdrop-blur-md shadow-sm">
                    {checklistItems.map((item, idx) => {
                      const isDone = checklistIndex > idx;
                      const isLoadingState = checklistIndex === idx;

                      return (
                        <div key={idx} className="flex items-center gap-3 transition-all duration-300">
                          {isDone ? (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                              className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shrink-0 shadow-sm shadow-emerald-500/10"
                            >
                              ✓
                            </motion.span>
                          ) : isLoadingState ? (
                            <Loader2 className="size-5 text-emerald-600 dark:text-emerald-400 animate-spin shrink-0" />
                          ) : (
                            <div className="size-5 rounded-full border border-zinc-200 dark:border-zinc-800 shrink-0 bg-white dark:bg-zinc-900" />
                          )}
                          <span className={`text-sm transition-colors duration-300 ${
                            isDone 
                              ? "text-zinc-800 dark:text-zinc-250 font-semibold" 
                              : isLoadingState 
                                ? "text-emerald-600 dark:text-emerald-400 font-semibold" 
                                : "text-zinc-400 dark:text-zinc-650 font-normal"
                          }`}>
                            {item}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Step 5: Personalized Login View
                <>
                  {/* Headline and introduction */}
                  <div className="space-y-3 text-left">
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="flex flex-col gap-3 p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/5 border border-emerald-500/10 dark:border-emerald-500/10 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Sparkles className="size-4" />
                        <span>Đã thiết lập xong lộ trình tối ưu!</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-emerald-700 dark:text-emerald-350 bg-emerald-100/50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-lg border border-emerald-200/30 dark:border-emerald-900/30">
                          Cấp độ: {recap.level}
                        </span>
                        <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-teal-700 dark:text-teal-350 bg-teal-100/50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-lg border border-teal-200/30 dark:border-teal-900/30">
                          Mục tiêu: {recap.target}
                        </span>
                        <span className="inline-flex items-center text-[10px] sm:text-xs font-bold text-blue-700 dark:text-blue-355 bg-blue-100/50 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-lg border border-blue-200/30 dark:border-blue-900/30">
                          Học tập: {recap.time}
                        </span>
                      </div>
                    </motion.div>
                    
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                      Lộ trình của bạn đã sẵn sàng!
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                      Đăng nhập để bắt đầu bài học đầu tiên thiết kế riêng cho bạn.
                    </p>
                  </div>

                  {/* Form actions */}
                  <div className="space-y-4 pt-1">
                    {/* Google Social Login */}
                    <motion.div
                      whileHover={{ scale: 1.01, y: -0.5 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <Button
                        onClick={handleGoogleLogin}
                        disabled={isGoogleLoading || isLoading}
                        className="w-full bg-white hover:bg-zinc-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-150 font-bold h-12 rounded-xl text-sm gap-3 active:scale-[0.98] transition-all duration-300 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center"
                      >
                        {isGoogleLoading ? (
                          <Loader2 className="size-4 animate-spin text-zinc-500" />
                        ) : (
                          <svg className="size-5 shrink-0" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                              fill="#EA4335"
                            />
                          </svg>
                        )}
                        <span>Tiếp tục với Google</span>
                      </Button>
                    </motion.div>

                    {/* Or separator */}
                    <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-zinc-150 dark:border-zinc-850"></div>
                      <span className="flex-shrink mx-4 text-[9px] text-zinc-400 dark:text-zinc-550 font-bold uppercase tracking-widest">Hoặc sử dụng email</span>
                      <div className="flex-grow border-t border-zinc-150 dark:border-zinc-850"></div>
                    </div>

                    {/* Email Login Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                      <div className="space-y-3">
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 size-4.5 text-zinc-400 dark:text-zinc-500" />
                          <input
                            type="email"
                            placeholder="Email của bạn"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3.5 py-2 pl-11 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-450 dark:placeholder:text-zinc-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all duration-300 shadow-sm"
                            required
                          />
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-3.5 size-4.5 text-zinc-400 dark:text-zinc-500" />
                          <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="flex h-12 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 px-3.5 py-2 pl-11 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-450 dark:placeholder:text-zinc-550 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all duration-300 shadow-sm"
                            required
                          />
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.01, y: -0.5 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Button
                          type="submit"
                          disabled={isLoading || isGoogleLoading}
                          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold h-12 rounded-xl text-sm gap-2 active:scale-[0.98] transition-all duration-300 shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 border-t border-white/10"
                        >
                          {isLoading && <Loader2 className="size-4 animate-spin" />}
                          <span>{isSignUp ? "Kích hoạt tài khoản" : "Đăng nhập bằng Email"}</span>
                        </Button>
                      </motion.div>
                    </form>

                    {/* Toggle controls */}
                    <div className="flex flex-col items-center gap-3 pt-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-bold transition-colors underline underline-offset-4"
                      >
                        {isSignUp ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Đăng ký học thử"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem("ato_onboarding_completed");
                          setDirection(-1);
                          setOnboardingStep(1);
                          setAnswers({});
                        }}
                        className="text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-350 font-semibold transition-colors"
                      >
                        Làm lại khảo sát định hướng
                      </button>
                    </div>
                  </div>

                  {/* Legal Disclaimers */}
                  <p className="text-[10px] text-center text-zinc-400 dark:text-zinc-550 leading-relaxed pt-2">
                    Bằng việc tiếp tục, bạn đồng ý với{" "}
                    <Link href="/terms" className="underline hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors font-medium">Điều khoản dịch vụ</Link>
                    {" "}và{" "}
                    <Link href="/privacy" className="underline hover:text-zinc-650 dark:hover:text-zinc-300 transition-colors font-medium">Chính sách bảo mật</Link>
                    {" "}của AtoEnglish.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="max-w-md w-full mx-auto text-center text-[10px] text-zinc-400 dark:text-zinc-500 font-normal pt-8 z-10">
          &copy; {new Date().getFullYear()} AtoEnglish. Bảo lưu mọi quyền.
        </footer>
      </div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
