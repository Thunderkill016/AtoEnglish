"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Link2,
  Loader2,
  LockKeyhole,
  Sparkles,
} from "lucide-react";

import { generateRealTalkLesson } from "@/app/actions/real-talk";
import type { GenerationFailureCode } from "@/features/real-talk/domain/generation-result";
import type { RealTalkLevel } from "@/types/real-talk";

const LEVELS: Array<{ value: RealTalkLevel; label: string }> = [
  { value: "A0", label: "A0 · Mất gốc" },
  { value: "A1", label: "A1 · Sơ cấp" },
  { value: "A2", label: "A2 · Cơ bản" },
  { value: "B1", label: "B1 · Trung cấp" },
  { value: "B2", label: "B2 · Trên trung cấp" },
];

const STEPS = [
  "Đọc caption tiếng Anh có timestamp",
  "Chọn đoạn hội thoại phù hợp",
  "Gemini tạo bài học có cấu trúc",
  "Kiểm tra mọi câu với transcript",
  "Lưu bản nháp riêng tư vào tài khoản",
];

interface ErrorState {
  code: GenerationFailureCode;
  message: string;
  retryAfterSeconds?: number;
  evidenceFailures?: string[];
}

export default function PrivateLessonGenerator() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [level, setLevel] = useState<RealTalkLevel>("A1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!url.trim() || isGenerating) return;

    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateRealTalkLesson(url.trim(), level);
      if (!result.success) {
        setError({
          code: result.code,
          message: result.error,
          retryAfterSeconds: result.retryAfterSeconds,
          evidenceFailures: result.evidenceFailures,
        });
        return;
      }

      router.push(`/real-talk/${encodeURIComponent(result.video.id)}`);
      router.refresh();
    } catch {
      setError({
        code: "INTERNAL_ERROR",
        message: "Không thể hoàn tất yêu cầu. Hãy thử lại sau.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
          <Sparkles className="size-4" /> YouTube → bài học riêng của bạn
        </div>
        <h1 className="mt-5 text-3xl font-black tracking-tight text-zinc-950 dark:text-white sm:text-5xl">
          Dán video bạn thực sự muốn hiểu
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:text-base">
          AtoEnglish chọn một đoạn giao tiếp, tạo bài nghe–nói bằng AI và lưu riêng
          vào tài khoản của bạn. Video cần có caption tiếng Anh đọc được.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-6 rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-900 sm:p-8"
      >
        <div>
          <label
            htmlFor="youtube-url"
            className="text-sm font-bold text-zinc-900 dark:text-zinc-100"
          >
            Link video YouTube
          </label>
          <div className="relative mt-2">
            <Link2 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
            <input
              id="youtube-url"
              type="url"
              inputMode="url"
              autoComplete="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={isGenerating}
              placeholder="https://www.youtube.com/watch?v=..."
              className="min-h-14 w-full rounded-2xl border border-zinc-300 bg-zinc-50 py-3 pl-12 pr-4 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-white"
              required
            />
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Mức hỗ trợ
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            {LEVELS.map((option) => (
              <button
                key={option.value}
                type="button"
                disabled={isGenerating}
                onClick={() => setLevel(option.value)}
                aria-pressed={level === option.value}
                className={`min-h-11 rounded-xl border px-3 text-xs font-bold transition ${
                  level === option.value
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-400 dark:border-zinc-700 dark:text-zinc-400"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={isGenerating || !url.trim()}
          className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isGenerating ? (
            <>
              <Loader2 className="size-5 animate-spin" /> Đang tạo bài học
            </>
          ) : (
            <>
              <Sparkles className="size-5" /> Tạo bài học riêng
            </>
          )}
        </button>

        <div className="flex items-start gap-3 rounded-2xl bg-zinc-50 p-4 text-xs leading-5 text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
          <LockKeyhole className="mt-0.5 size-4 shrink-0 text-emerald-600" />
          <p>
            Bài tạo ra là <strong>AI draft riêng tư</strong>, không tự động công
            khai. Caption, người nói và timestamp có thể sai; hãy đối chiếu với
            video gốc.
          </p>
        </div>
      </form>

      {isGenerating && (
        <section
          aria-live="polite"
          className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-5"
        >
          <p className="font-bold text-emerald-800 dark:text-emerald-200">
            Pipeline đang chạy
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step}
                className="flex items-center gap-2 rounded-xl bg-white/70 p-3 text-sm text-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300"
              >
                <Loader2 className="size-4 shrink-0 animate-spin text-emerald-600" />
                {step}
              </div>
            ))}
          </div>
        </section>
      )}

      {error && !isGenerating && (
        <section
          role="alert"
          className="mt-6 rounded-3xl border border-red-500/25 bg-red-500/5 p-5"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-red-800 dark:text-red-200">
                  Chưa tạo được bài học
                </p>
                <code className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-700 dark:text-red-300">
                  {error.code}
                </code>
              </div>
              <p className="mt-1 text-sm leading-6 text-red-700/80 dark:text-red-200/80">
                {error.message}
              </p>
              {error.retryAfterSeconds ? (
                <p className="mt-2 text-xs text-red-600 dark:text-red-300">
                  Có thể thử lại sau khoảng {error.retryAfterSeconds} giây.
                </p>
              ) : null}
              {error.evidenceFailures?.map((failure) => (
                <code key={failure} className="mt-1 block break-all text-xs">
                  {failure}
                </code>
              ))}
            </div>
          </div>
        </section>
      )}

      {!isGenerating && !error ? (
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-500">
          <CheckCircle2 className="size-4 text-emerald-600" /> Không tải xuống hay
          re-host video YouTube
        </div>
      ) : null}
    </div>
  );
}
