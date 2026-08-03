"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Link2,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Sprout,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { LoginSchema, SignUpSchema } from "@/lib/security/validation";

const SAFE_NEXT_PREFIXES = ["/dashboard", "/real-talk", "/me", "/settings"];

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/real-talk/create";
  }

  return SAFE_NEXT_PREFIXES.some(
    (prefix) => value === prefix || value.startsWith(`${prefix}/`),
  )
    ? value
    : "/real-talk/create";
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = safeNextPath(searchParams.get("next"));
  const initialLoginMode = searchParams.get("mode") === "login";

  const [isSignUp, setIsSignUp] = useState(!initialLoginMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUrl },
      });
      if (error) throw error;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Đăng nhập bằng Google thất bại.",
      );
      setIsGoogleLoading(false);
    }
  }

  async function handleEmailAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const schema = isSignUp ? SignUpSchema : LoginSchema;
    const validated = schema.safeParse({ email, password });
    if (!validated.success) {
      toast.error(validated.error.issues.map((issue) => issue.message).join(", "));
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: validated.data.email,
          password: validated.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
          },
        });
        if (error) throw error;

        if (data.session) {
          toast.success("Tài khoản đã sẵn sàng.");
          router.push(nextPath);
          router.refresh();
        } else {
          toast.success("Kiểm tra email để xác nhận tài khoản rồi tiếp tục.");
        }
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: validated.data.email,
        password: validated.data.password,
      });
      if (error) throw error;

      toast.success("Đăng nhập thành công.");
      router.push(nextPath);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Xác thực tài khoản thất bại.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  const busy = isLoading || isGoogleLoading;

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-zinc-950 sm:py-12">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-2xl shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative overflow-hidden bg-zinc-950 p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.25),transparent_45%)]" />
          <div className="relative">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-bold text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="size-4" /> Trang chủ
            </Link>

            <div className="mt-12 flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500 text-zinc-950">
                <Sprout className="size-5" />
              </span>
              <span className="text-lg font-black">AtoEnglish</span>
            </div>

            <h1 className="mt-8 text-3xl font-black leading-tight sm:text-4xl">
              Học từ video bạn thực sự muốn hiểu.
            </h1>
            <p className="mt-4 text-sm leading-7 text-zinc-400">
              Đăng nhập để dán link YouTube, tạo bài nghe–nói AI riêng tư và quay
              lại tiếp tục bất cứ lúc nào.
            </p>

            <div className="mt-8 space-y-3 text-sm text-zinc-300">
              <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                <Link2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
                <p>URL YouTube là hành động chính, không phải chọn một unit cố định.</p>
              </div>
              <div className="flex items-start gap-3 rounded-2xl bg-white/5 p-4">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-purple-400" />
                <p>Bài được lưu private và không tự cấp quyền xuất bản.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <Sparkles className="size-4" /> Tiếp tục tới trình tạo bài
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
              {isSignUp ? "Tạo tài khoản" : "Đăng nhập"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Không có khảo sát giả cá nhân hóa. Bạn có thể chọn mức hỗ trợ khi dán
              từng video.
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={busy}
              className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white px-4 font-bold text-zinc-900 transition hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white dark:hover:bg-zinc-800"
            >
              {isGoogleLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <span className="flex size-5 items-center justify-center rounded-full bg-white text-sm font-black text-blue-600">
                  G
                </span>
              )}
              Tiếp tục với Google
            </button>

            <div className="my-6 flex items-center gap-3 text-xs text-zinc-400">
              <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              hoặc email
              <span className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-bold text-zinc-800 dark:text-zinc-200"
                >
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    disabled={busy}
                    className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-950"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-zinc-800 dark:text-zinc-200"
                >
                  Mật khẩu
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    disabled={busy}
                    className="min-h-12 w-full rounded-2xl border border-zinc-300 bg-zinc-50 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-950"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 font-black text-white transition hover:bg-emerald-500 disabled:opacity-60"
              >
                {isLoading ? <Loader2 className="size-5 animate-spin" /> : null}
                {isSignUp ? "Tạo tài khoản và tiếp tục" : "Đăng nhập và tiếp tục"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              {isSignUp ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp((value) => !value)}
                disabled={busy}
                className="font-bold text-emerald-700 hover:underline dark:text-emerald-300"
              >
                {isSignUp ? "Đăng nhập" : "Đăng ký"}
              </button>
            </p>

            <div className="mt-8 flex items-start gap-2 rounded-2xl bg-zinc-50 p-4 text-xs leading-5 text-zinc-500 dark:bg-zinc-950">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <p>
                Sau xác thực, bạn được chuyển tới{" "}
                <code className="font-bold">{nextPath}</code>. Hệ thống không tin
                user ID từ trình duyệt khi lưu private draft.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <Loader2 className="size-7 animate-spin text-emerald-600" />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
