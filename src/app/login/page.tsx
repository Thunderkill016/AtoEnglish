"use client";

import { useState, Suspense } from "react";
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

  const supabase = createClient();

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
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

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (error) throw error;

        if (data?.user) {
          // Khởi tạo user_progress
          const { data: progress } = await supabase
            .from("user_progress")
            .select("user_id")
            .eq("user_id", data.user.id)
            .maybeSingle();

          if (!progress) {
            await supabase.from("user_progress").insert({
              user_id: data.user.id,
              current_level: "A1",
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
              current_level: "A1",
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
        {/* Subtle decorative circles */}
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

      {/* Right Column: Login Form */}
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
          <Link href="/" className="ml-auto">
            <Button variant="ghost" className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 h-9 gap-1 rounded-lg">
              <ArrowLeft className="size-3.5" />
              Về trang chủ
            </Button>
          </Link>
        </header>

        {/* Main Card container */}
        <main className="max-w-md w-full mx-auto my-auto py-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col space-y-6"
          >
            {/* Headline and introduction */}
            <div className="space-y-2 text-left">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider animate-pulse">
                <Sparkles className="size-2.5" />
                Chào mừng bạn đến với AtoEnglish
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
                {isSignUp ? "Tạo tài khoản mới" : "Chào mừng quay trở lại"}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed">
                {isSignUp 
                  ? "Tạo tài khoản miễn phí để lưu trữ tiến trình học và bộ nhớ từ vựng." 
                  : "Đăng nhập để tiếp tục hành trình rèn luyện tiếng Anh."}
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

              {/* Email Login Form (Always visible, zero extra click) */}
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
                  <span>{isSignUp ? "Đăng ký tài khoản" : "Đăng nhập bằng Email"}</span>
                </Button>
              </form>

              {/* Toggle controls */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-bold transition-colors underline underline-offset-4"
                >
                  {isSignUp ? "Đã có tài khoản? Đăng nhập ngay" : "Chưa có tài khoản? Đăng ký miễn phí"}
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
