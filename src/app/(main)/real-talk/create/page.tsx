"use client";

import { useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Link2,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { generateRealTalkLesson } from "@/app/actions/real-talk";
import RealTalkLessonComponent from "@/components/real-talk/RealTalkLesson";
import type { GenerationFailureCode } from "@/features/real-talk/domain/generation-result";
import type {
  RealTalkLesson,
  RealTalkLevel,
  RealTalkVideo,
} from "@/types/real-talk";

const LEVELS: Array<{ value: RealTalkLevel; label: string }> = [
  { value: "A0", label: "A0 · Mất gốc" },
  { value: "A1", label: "A1 · Sơ cấp" },
  { value: "A2", label: "A2 · Cơ bản" },
  { value: "B1", label: "B1 · Trung cấp" },
  { value: "B2", label: "B2 · Trên trung cấp" },
];

const GENERATION_STEPS = [
  "Đọc caption và metadata",
  "Tìm đoạn có mật độ tương tác cao",
  "Gemini tạo environment lesson draft",
  "Kiểm tra schema và source evidence",
  "Lưu owner-private draft",
];

interface GeneratedState {
  video: RealTalkVideo;
  lesson: RealTalkLesson;
  persistence: "saved_private_draft";
  warnings: string[];
}

interface GenerationErrorState {
  code: GenerationFailureCode;
  message: string;
  retryAfterSeconds?: number;
  evidenceFailures?: string[];
}

export default function RealTalkCreatePage() {
  const [url, setUrl] = useState("");
  const [level, setLevel] = useState<RealTalkLevel>("A1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<GenerationErrorState | null>(null);
  const [generated, setGenerated] = useState<GeneratedState | null>(null);
  const [showLesson, setShowLesson] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!url.trim() || isGenerating) return;

    setError(null);
    setGenerated(null);
    setShowLesson(false);
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

      setGenerated({
        video: result.video,
        lesson: result.lesson,
        persistence: result.persistence,
        warnings: result.warnings,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (showLesson && generated) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <div className="sticky top-0 z-50 border-b border-amber-500/20 bg-amber-950/95 px-4 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wider text-amber-300">
                AI draft · chưa xuất bản
              </p>
              <p className="truncate text-sm text-amber-100/80">
                Dùng để kiểm tra trải nghiệm; speaker và transcript vẫn cần người nghe xác minh.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowLesson(false)}
              className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-xl border border-amber-400/30 px-3 text-sm font-bold text-amber-100"
            >
              <ArrowLeft className="size-4" /> Quay lại
            </button>
          </div>
        </div>
        <RealTalkLessonComponent
          video={generated.video}
          lesson={generated.lesson}
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-teal-950/30 pb-24 text-white">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-12">
        <header className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-teal-300">
            <Sparkles className="size-4" /> Real Talk compiler
          </div>
          <h1 className="mt-5 text-3xl font-black sm:text-4xl">
            Biến một cuộc trò chuyện thật thành bản nháp bài học
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
            Dán link YouTube có caption tiếng Anh. Hệ thống tìm một đoạn hội thoại
            tự nhiên, phát hiện mục tiêu giao tiếp rồi mới tạo hoạt động học và
            transfer task.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="mt-9 space-y-5 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl shadow-black/20 sm:p-7"
        >
          <div>
            <label
              htmlFor="youtube-url"
              className="text-sm font-bold text-zinc-200"
            >
              Link video YouTube
            </label>
            <div className="relative mt-2">
              <Link2 className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-500" />
              <input
                id="youtube-url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={isGenerating}
                placeholder="https://www.youtube.com/watch?v=..."
                className="min-h-13 w-full rounded-2xl border border-zinc-700 bg-zinc-950/70 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50"
              />
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-bold text-zinc-200">
              Mức hỗ trợ cho người học
            </legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
              {LEVELS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setLevel(option.value)}
                  className={`min-h-11 rounded-xl border px-3 text-xs font-bold transition ${
                    level === option.value
                      ? "border-teal-400 bg-teal-500/15 text-teal-200"
                      : "border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-500"
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
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 font-black text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:from-zinc-700 disabled:to-zinc-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-5 animate-spin" /> Đang biên dịch cuộc
                trò chuyện
              </>
            ) : (
              <>
                <Sparkles className="size-5" /> Tạo private lesson draft
              </>
            )}
          </button>
        </form>

        {isGenerating && (
          <section className="mt-6 rounded-2xl border border-teal-500/20 bg-teal-950/20 p-5">
            <p className="text-sm font-bold text-teal-200">
              Pipeline đang chạy
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {GENERATION_STEPS.map((step) => (
                <div
                  key={step}
                  className="flex items-center gap-3 rounded-xl bg-black/20 p-3 text-sm text-zinc-300"
                >
                  <Loader2 className="size-4 shrink-0 animate-spin text-teal-400" />{" "}
                  {step}
                </div>
              ))}
            </div>
          </section>
        )}

        {error && !isGenerating && (
          <section className="mt-6 flex gap-3 rounded-2xl border border-red-500/30 bg-red-950/30 p-5">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-400" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-red-200">
                  Không tạo được bản nháp
                </p>
                <code className="rounded bg-red-500/10 px-2 py-0.5 text-xs text-red-300">
                  {error.code}
                </code>
              </div>
              <p className="mt-1 text-sm leading-6 text-red-200/70">
                {error.message}
              </p>
              {error.retryAfterSeconds && (
                <p className="mt-2 text-xs text-red-300/70">
                  Có thể thử lại sau khoảng {error.retryAfterSeconds} giây.
                </p>
              )}
              {error.evidenceFailures?.length ? (
                <div className="mt-3 space-y-1">
                  {error.evidenceFailures.map((failure) => (
                    <code
                      key={failure}
                      className="block break-all text-xs text-red-300/70"
                    >
                      {failure}
                    </code>
                  ))}
                </div>
              ) : null}
            </div>
          </section>
        )}

        {generated && !isGenerating && (
          <section className="mt-8 space-y-5">
            <div className="rounded-3xl border border-amber-500/30 bg-amber-950/20 p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-amber-300">
                    <ShieldCheck className="size-4" /> AI draft · không tự xuất
                    bản
                  </div>
                  <h2 className="mt-4 text-2xl font-black">
                    {generated.lesson.titleVi}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-400">
                    {generated.video.channelName} · {generated.video.title}
                  </p>
                </div>
                <div className="rounded-xl border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-right">
                  <p className="text-xs text-zinc-500">Trạng thái lưu</p>
                  <p className="text-sm font-bold text-zinc-200">
                    Đã lưu private draft
                  </p>
                </div>
              </div>

              {generated.lesson.environment && (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-teal-300">
                      <Users className="size-4" /> Môi trường giao tiếp
                    </p>
                    <p className="mt-2 font-bold">
                      {generated.lesson.environment.titleVi}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {generated.lesson.environment.situationVi}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-300">
                      <Target className="size-4" /> Mục tiêu thật
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-300">
                      {generated.lesson.environment.realWorldGoalVi}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      Vai của bạn: {generated.lesson.environment.learnerRoleVi}
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  [
                    "Sự kiện giao tiếp",
                    generated.lesson.communicationEvents?.length ?? 0,
                  ],
                  ["Từ/cụm", generated.lesson.preWatch.vocabulary.length],
                  [
                    "Bài nghe hiểu",
                    generated.lesson.postWatch.comprehensionQuiz.length,
                  ],
                  ["Lượt nói", generated.lesson.postWatch.speakingDrills.length],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-xl bg-zinc-900/70 p-3 text-center"
                  >
                    <p className="text-xl font-black text-white">{value}</p>
                    <p className="mt-1 text-[11px] text-zinc-500">{label}</p>
                  </div>
                ))}
              </div>

              {generated.lesson.transferTask && (
                <div className="mt-5 rounded-2xl border border-purple-500/25 bg-purple-950/20 p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-purple-300">
                    Changed-context transfer
                  </p>
                  <p className="mt-2 font-bold text-purple-100">
                    {generated.lesson.transferTask.situationVi}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    {generated.lesson.transferTask.promptVi}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowLesson(true)}
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 font-black"
              >
                <Play className="size-5" /> Xem thử lesson draft
              </button>
            </div>

            {generated.warnings.length > 0 && (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
                <p className="font-bold text-zinc-200">
                  Cần kiểm tra trước khi dùng thật
                </p>
                <div className="mt-3 space-y-2">
                  {generated.warnings.map((warning) => (
                    <p
                      key={warning}
                      className="flex gap-2 text-sm leading-6 text-zinc-400"
                    >
                      <AlertCircle className="mt-1 size-4 shrink-0 text-amber-400" />{" "}
                      {warning}
                    </p>
                  ))}
                </div>
                <a
                  href={
                    generated.video.source?.watchUrl ??
                    `https://www.youtube.com/watch?v=${generated.video.youtubeId}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-300 hover:underline"
                >
                  Mở video nguồn để kiểm tra{" "}
                  <ExternalLink className="size-4" />
                </a>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setGenerated(null);
                setUrl("");
              }}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-zinc-700 text-sm font-bold text-zinc-300"
            >
              <CheckCircle2 className="size-4" /> Tạo bản nháp khác
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
