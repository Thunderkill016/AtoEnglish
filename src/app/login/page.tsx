"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isEmailLogin, setIsEmailLogin] = useState(false);
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
    <div className="min-h-screen bg-white text-zinc-900 font-sans flex flex-col justify-between py-12 px-6 sm:px-12 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header Navigation */}
      <header className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
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
        <Link href="/">
          <Button variant="ghost" className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 h-9 gap-1 rounded-lg">
            <ArrowLeft className="size-4" />
            Về trang chủ
          </Button>
        </Link>
      </header>

      {/* Main Card container */}
      <main className="max-w-md w-full mx-auto my-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-zinc-100 p-8 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex flex-col space-y-8"
        >
          <div className="text-center space-y-2.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 uppercase tracking-wider">
              <Sparkles className="size-3" />
              Chào mừng bạn đến với AtoEnglish
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              {isEmailLogin ? (isSignUp ? "Tạo tài khoản mới" : "Đăng nhập Email") : "Rèn luyện tiếng Anh"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 font-normal">
              {isEmailLogin 
                ? "Nhập email và mật khẩu của bạn để tiếp tục hành trình." 
                : "Bắt đầu miễn phí ngay hôm nay. Không cần thẻ tín dụng."}
            </p>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {!isEmailLogin ? (
                // Google Login View
                <motion.div
                  key="google-login"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium h-12 rounded-xl text-sm gap-3 active:scale-[0.98] transition-all duration-300"
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

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-zinc-100"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-zinc-300 font-bold uppercase tracking-wider">Hoặc</span>
                    <div className="flex-grow border-t border-zinc-100"></div>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => setIsEmailLogin(true)}
                    className="w-full border border-zinc-100 text-zinc-600 hover:text-zinc-950 font-medium h-12 rounded-xl text-sm gap-2 hover:bg-zinc-50"
                  >
                    <Mail className="size-4" />
                    Đăng nhập bằng Email
                  </Button>
                </motion.div>
              ) : (
                // Email Auth View
                <motion.form
                  key="email-login"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleEmailAuth}
                  className="space-y-4"
                >
                  <div className="space-y-3">
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 size-4 text-zinc-400" />
                      <input
                        type="email"
                        placeholder="Email của bạn"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex h-12 w-full rounded-xl border border-zinc-100 bg-white px-3.5 py-2 pl-11 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        className="flex h-12 w-full rounded-xl border border-zinc-100 bg-white px-3.5 py-2 pl-11 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium h-12 rounded-xl text-sm gap-2 active:scale-[0.98] transition-all duration-300"
                  >
                    {isLoading && <Loader2 className="size-4 animate-spin" />}
                    <span>{isSignUp ? "Đăng ký" : "Đăng nhập"}</span>
                  </Button>

                  <div className="flex flex-col items-center gap-2 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-emerald-700 hover:text-emerald-800 font-semibold"
                    >
                      {isSignUp ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký ngay"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEmailLogin(false);
                        setIsSignUp(false);
                      }}
                      className="text-zinc-400 hover:text-zinc-900 font-medium transition-colors"
                    >
                      Quay lại đăng nhập Google
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Simple Footer */}
      <footer className="max-w-7xl w-full mx-auto text-center text-xs text-zinc-400 font-normal">
        &copy; {new Date().getFullYear()} AtoEnglish. Bảo lưu mọi quyền.
      </footer>
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
