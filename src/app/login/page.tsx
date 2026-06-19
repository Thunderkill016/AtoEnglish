"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, Sparkles, ArrowLeft, Sprout } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LoginSchema, SignUpSchema } from "@/lib/security/validation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Onboarding Quiz state
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checklistIndex, setChecklistIndex] = useState(0);

  const supabase = createClient();

  useEffect(() => {
    if (onboardingStep === 4) {
      setChecklistIndex(0);
      const t1 = setTimeout(() => setChecklistIndex(1), 800);
      const t2 = setTimeout(() => setChecklistIndex(2), 1600);
      const t3 = setTimeout(() => setChecklistIndex(3), 2400);
      const t4 = setTimeout(() => setOnboardingStep(5), 3200);

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

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col lg:flex-row selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Left Column: Brand Showcase (Visible only on Desktop) */}
      <div className="hidden lg:flex w-[45%] bg-gradient-to-br from-zinc-900 via-emerald-950 to-zinc-950 p-16 text-white flex-col justify-between relative overflow-hidden select-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        
        <Link href="/" className="flex items-center gap-2.5 z-10 self-start group">
          <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-lg shadow-emerald-950/40">
            <Sprout className="size-5" />
          </span>
          <div className="flex flex-col leading-none text-left">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              AtoEnglish
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">
              Grow every day
            </span>
          </div>
        </Link>

        <div className="space-y-8 z-10 max-w-md">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
            Giai đoạn thử nghiệm mở (Open Beta)
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
            Làm chủ tiếng Anh từ số 0 bằng khoa học ghi nhớ.
          </h2>
          <div className="space-y-5 text-sm text-zinc-300">
            <div className="flex items-start gap-3">
              <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 font-bold shrink-0">✓</div>
              <p><strong>Luyện nói phản xạ:</strong> Thực hành hội thoại tự nhiên và tự sửa phát âm chuẩn xác ngay lập tức.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 font-bold shrink-0">✓</div>
              <p><strong>Thẻ học thông minh (SRS):</strong> Áp dụng thuật toán FSRS tối ưu hóa chu kỳ lặp lại giúp ghi nhớ từ vựng vĩnh viễn.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="size-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-0.5 font-bold shrink-0">✓</div>
              <p><strong>Lộ trình cá nhân hóa:</strong> Bài học ngắn 15 phút mỗi ngày thiết kế riêng cho người Việt mất gốc.</p>
            </div>
          </div>
        </div>

        <div className="z-10 text-xs text-zinc-400 border-t border-zinc-800/80 pt-6">
          Học tập hoàn toàn miễn phí. Tiến trình được tự động đồng bộ đám mây.
        </div>
      </div>

      {/* Right Column: Onboarding / Login Panel */}
      <div className="flex-1 flex flex-col justify-between py-12 px-6 sm:px-12 md:px-16 lg:px-24 bg-white relative">
        {/* Top Navigation */}
        <header className="max-w-md w-full mx-auto flex items-center justify-between mb-8">
          <Link href="/" className="lg:hidden flex items-center gap-2.5 group">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
              <Sprout className="size-4.5" />
            </span>
            <div className="flex flex-col leading-none text-left">
              <span className="text-sm font-bold tracking-tight text-zinc-900 group-hover:text-emerald-600 transition-colors">
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
              onClick={() => setOnboardingStep(onboardingStep - 1)}
              className="ml-auto text-xs font-semibold text-zinc-500 hover:text-zinc-900 h-9 gap-1 rounded-lg animate-fade-in"
            >
              <ArrowLeft className="size-3.5" />
              Quay lại câu trước
            </Button>
          ) : (
            <Link href="/" className="ml-auto">
              <Button variant="ghost" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 h-9 gap-1 rounded-lg">
                <ArrowLeft className="size-3.5" />
                Về trang chủ
              </Button>
            </Link>
          )}
        </header>

        {/* Main Card container */}
        <main className="max-w-md w-full mx-auto my-auto py-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-6"
          >
            {onboardingStep <= 3 ? (
              // Quiz Questions UI
              <div className="space-y-6">
                {/* Progress bar */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    <span>Khảo sát định hướng</span>
                    <span>Câu {onboardingStep} / 3</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                      style={{ width: `${(onboardingStep / 3) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                    {questions[onboardingStep - 1].title}
                  </h1>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  {questions[onboardingStep - 1].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(onboardingStep, opt.val)}
                      className="w-full text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-600 hover:bg-emerald-500/5 dark:hover:border-emerald-500/20 transition-all duration-200 active:scale-[0.99] font-semibold text-sm text-zinc-800 dark:text-zinc-200 hover:text-emerald-700 dark:hover:text-emerald-400 group"
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.label}</span>
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 dark:text-emerald-400 font-bold">→</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-center pt-2 border-t border-zinc-100 dark:border-zinc-800/60 mt-2">
                  <button
                    type="button"
                    onClick={() => setOnboardingStep(5)}
                    className="text-xs text-zinc-400 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300 font-bold transition-colors underline underline-offset-4"
                  >
                    Tôi đã có tài khoản. Đăng nhập ngay
                  </button>
                </div>
              </div>
            ) : onboardingStep === 4 ? (
              // Quiz Loading simulated calculation UI
              <div className="text-center space-y-6 py-6 animate-pulse">
                <div className="flex justify-center">
                  <div className="relative size-16 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600">
                    <Sprout className="size-8 animate-bounce" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                    Đang thiết lập lộ trình tối ưu cho bạn...
                  </h1>
                  <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                    Chúng tôi đang cấu hình lớp học dựa trên các tùy chọn của bạn.
                  </p>
                </div>

                <div className="space-y-4 py-6 text-left max-w-sm mx-auto">
                  <div className="flex items-center gap-3">
                    {checklistIndex > 0 ? (
                      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shrink-0">✓</span>
                    ) : (
                      <Loader2 className="size-5 text-emerald-600 animate-spin shrink-0" />
                    )}
                    <span className={`text-sm ${checklistIndex >= 0 ? "text-zinc-800 font-semibold" : "text-zinc-400 font-normal"}`}>
                      Phân tích trình độ học tập...
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {checklistIndex > 1 ? (
                      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shrink-0">✓</span>
                    ) : checklistIndex === 1 ? (
                      <Loader2 className="size-5 text-emerald-600 animate-spin shrink-0" />
                    ) : (
                      <div className="size-5 rounded-full border border-zinc-200 shrink-0" />
                    )}
                    <span className={`text-sm ${checklistIndex >= 1 ? "text-zinc-800 font-semibold" : "text-zinc-400 font-normal"}`}>
                      Thiết lập chu kỳ ôn tập thông minh (FSRS)...
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {checklistIndex > 2 ? (
                      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shrink-0">✓</span>
                    ) : checklistIndex === 2 ? (
                      <Loader2 className="size-5 text-emerald-600 animate-spin shrink-0" />
                    ) : (
                      <div className="size-5 rounded-full border border-zinc-200 shrink-0" />
                    )}
                    <span className={`text-sm ${checklistIndex >= 2 ? "text-zinc-800 font-semibold" : "text-zinc-400 font-normal"}`}>
                      Tối ưu lộ trình luyện nói phản xạ...
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              // Step 5: Personalized Login View
              <>
                {/* Headline and introduction */}
                <div className="space-y-2 text-left">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-755 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50 uppercase tracking-wider animate-pulse">
                    <Sparkles className="size-3 text-emerald-600 shrink-0" />
                    Thiết lập hoàn tất
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight text-left">
                    Lộ trình của bạn đã sẵn sàng!
                  </h1>
                  <p className="text-xs sm:text-sm text-zinc-500 font-medium leading-relaxed text-left">
                    Đăng nhập bằng Google để bắt đầu bài học đầu tiên.
                  </p>
                </div>

                {/* Form actions */}
                <div className="space-y-4 pt-2">
                  {/* Google Social Login */}
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || isLoading}
                    className="w-full bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-white font-semibold h-12 rounded-xl text-sm gap-3 active:scale-[0.98] transition-all duration-200 border border-zinc-900/10 shadow-sm"
                  >
                    {isGoogleLoading ? (
                      <Loader2 className="size-4 animate-spin" />
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

                  {/* Or separator */}
                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-zinc-100"></div>
                    <span className="flex-shrink mx-4 text-[9px] text-zinc-300 font-bold uppercase tracking-widest">Hoặc sử dụng email</span>
                    <div className="flex-grow border-t border-zinc-100"></div>
                  </div>

                  {/* Email Login Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-4">
                    <div className="space-y-3">
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 size-4 text-zinc-400" />
                        <input
                          type="email"
                          placeholder="Email của bạn"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 pl-11 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 size-4 text-zinc-400" />
                        <input
                          type="password"
                          placeholder="Mật khẩu"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex h-12 w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 pl-11 text-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:border-transparent transition-all"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || isGoogleLoading}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-12 rounded-xl text-sm gap-2 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-emerald-700/10"
                    >
                      {isLoading && <Loader2 className="size-4 animate-spin" />}
                      <span>{isSignUp ? "Kích hoạt tài khoản" : "Đăng nhập bằng Email"}</span>
                    </Button>
                  </form>

                  {/* Toggle controls */}
                  <div className="flex flex-col items-center gap-3 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-emerald-750 hover:text-emerald-850 font-bold transition-colors underline underline-offset-4"
                    >
                      {isSignUp ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Đăng ký học thử"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOnboardingStep(1);
                        setAnswers({});
                      }}
                      className="text-zinc-400 hover:text-zinc-900 font-medium transition-colors"
                    >
                      Làm lại khảo sát định hướng
                    </button>
                  </div>
                </div>

                {/* Legal Disclaimers */}
                <p className="text-[10px] text-center text-zinc-400 leading-relaxed pt-2">
                  Bằng việc tiếp tục, bạn đồng ý với{" "}
                  <Link href="/terms" className="underline hover:text-zinc-600 transition-colors font-medium">Điều khoản dịch vụ</Link>
                  {" "}và{" "}
                  <Link href="/privacy" className="underline hover:text-zinc-600 transition-colors font-medium">Chính sách bảo mật</Link>
                  {" "}của AtoEnglish.
                </p>
              </>
            )}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="max-w-md w-full mx-auto text-center text-[10px] text-zinc-400 font-normal pt-8">
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
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="size-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
