"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Link2,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Tv,
  Play,
  ChevronRight,
} from "lucide-react";

import { generateRealTalkLesson } from "@/app/actions/real-talk";
import type { RealTalkVideo, RealTalkLesson } from "@/types/real-talk";
import RealTalkLessonComponent from "@/components/real-talk/RealTalkLesson";

// ─── Level options ──────────────────────────────────────────────────────────

const LEVELS = [
  {
    value: "A0",
    label: "A0 — Mất gốc",
    color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
  },
  {
    value: "A1",
    label: "A1 — Sơ cấp",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  },
  {
    value: "A2",
    label: "A2 — Cơ bản",
    color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  },
  {
    value: "B1",
    label: "B1 — Trung cấp",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
  },
] as const;

// ─── Steps animation ────────────────────────────────────────────────────────

const GENERATION_STEPS = [
  { emoji: "🔍", text: "Đang phân tích link YouTube..." },
  { emoji: "📝", text: "Đang lấy phụ đề từ video..." },
  { emoji: "🧠", text: "AI đang tạo bài học..." },
  { emoji: "✨", text: "Đang hoàn thiện bài học..." },
];

// ─── Main Component ─────────────────────────────────────────────────────────

export default function RealTalkCreatePage() {
  const [url, setUrl] = useState("");
  const [level, setLevel] = useState<"A0" | "A1" | "A2" | "B1">("A1");
  const [error, setError] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<RealTalkVideo | null>(
    null,
  );
  const [generatedLesson, setGeneratedLesson] = useState<RealTalkLesson | null>(
    null,
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [showLesson, setShowLesson] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setError(null);
    setGeneratedVideo(null);
    setGeneratedLesson(null);
    setCurrentStep(0);
    setShowLesson(false);

    // Simulate progress steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < GENERATION_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 3000);

    startTransition(async () => {
      const result = await generateRealTalkLesson(url.trim(), level);
      clearInterval(stepInterval);

      if (result.success && result.video && result.lesson) {
        setGeneratedVideo(result.video);
        setGeneratedLesson(result.lesson);
        setCurrentStep(GENERATION_STEPS.length); // Done
      } else {
        setError(result.error || "Đã xảy ra lỗi không xác định.");
      }
    });
  };

  // If user chose to preview the full lesson
  if (showLesson && generatedVideo && generatedLesson) {
    return (
      <RealTalkLessonComponent
        video={generatedVideo}
        lesson={generatedLesson}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-teal-950/20">
      <div className="max-w-2xl mx-auto px-4 py-8 pb-24">
        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
            <Sparkles size={14} className="text-teal-400" />
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              AI Lesson Generator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Biến video YouTube thành{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              bài học tiếng Anh
            </span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Dán link video trò chuyện thực tế từ YouTube — AI sẽ tự động tạo bài
            học hoàn chỉnh với từ vựng, quiz, và luyện nói.
          </p>
        </motion.div>

        {/* ── Input Form ────────────────────────────────────────────────── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-5"
        >
          {/* URL Input */}
          <div className="relative">
            <Link2
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Dán link YouTube vào đây... (vd: https://youtu.be/...)"
              disabled={isPending}
              className="w-full pl-11 pr-4 py-4 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all disabled:opacity-50"
            />
          </div>

          {/* Level Selector */}
          <div>
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 block">
              Cấp độ
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevel(l.value as typeof level)}
                  disabled={isPending}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    level === l.value
                      ? l.color
                      : "text-zinc-500 bg-zinc-800/40 border-zinc-700/30 hover:bg-zinc-800"
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-teal-900/30 disabled:shadow-none min-h-[52px]"
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang tạo bài học...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                Tạo bài học từ video
              </>
            )}
          </button>
        </motion.form>

        {/* ── Generation Progress ───────────────────────────────────────── */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-6 space-y-4"
            >
              {GENERATION_STEPS.map((step, i) => {
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-teal-500/10 border border-teal-500/20"
                        : isDone
                          ? "opacity-50"
                          : "opacity-30"
                    }`}
                  >
                    <span className="text-lg shrink-0">
                      {isDone ? "✅" : step.emoji}
                    </span>
                    <span
                      className={`text-sm ${
                        isActive ? "text-teal-300 font-medium" : "text-zinc-400"
                      }`}
                    >
                      {step.text}
                    </span>
                    {isActive && (
                      <Loader2
                        size={14}
                        className="ml-auto text-teal-400 animate-spin"
                      />
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error ─────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {error && !isPending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 rounded-2xl border border-red-500/30 bg-red-950/20 p-5 flex items-start gap-3"
            >
              <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-300 mb-1">
                  Không thể tạo bài học
                </p>
                <p className="text-xs text-red-200/70">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Success: Generated Lesson Preview ─────────────────────────── */}
        <AnimatePresence>
          {generatedVideo && generatedLesson && !isPending && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 space-y-6"
            >
              {/* Success badge */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30"
                >
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">
                    Bài học đã sẵn sàng!
                  </span>
                </motion.div>
              </div>

              {/* Lesson preview card */}
              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl overflow-hidden">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-zinc-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={generatedVideo.thumbnailUrl}
                    alt={generatedVideo.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-xs font-black text-emerald-400">
                        {generatedVideo.level}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-xs font-medium text-zinc-300">
                        ~{generatedLesson.estimatedMinutes} phút
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {generatedLesson.titleVi}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      {generatedVideo.channelName} • {generatedVideo.title}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-0 border-t border-zinc-800/60">
                  {[
                    {
                      label: "Từ vựng",
                      value: generatedLesson.preWatch.vocabulary.length,
                      emoji: "📚",
                    },
                    {
                      label: "Quiz",
                      value: generatedLesson.postWatch.comprehensionQuiz.length,
                      emoji: "✅",
                    },
                    {
                      label: "Điền từ",
                      value: generatedLesson.postWatch.fillInTheBlank.length,
                      emoji: "✏️",
                    },
                    {
                      label: "Nói",
                      value: generatedLesson.postWatch.speakingDrills.length,
                      emoji: "🗣️",
                    },
                  ].map(({ label, value, emoji }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center py-3 border-r border-zinc-800/60 last:border-r-0"
                    >
                      <span className="text-sm">{emoji}</span>
                      <span className="text-lg font-black text-white">
                        {value}
                      </span>
                      <span className="text-[10px] text-zinc-500">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Can-Do Statement */}
                <div className="px-5 py-3 bg-teal-500/5 border-t border-teal-500/10">
                  <p className="text-xs text-teal-400">
                    🎯 {generatedLesson.canDoStatementVi}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowLesson(true)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-teal-900/30"
                >
                  <Play size={18} fill="white" />
                  Bắt đầu học ngay
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => {
                    setGeneratedVideo(null);
                    setGeneratedLesson(null);
                    setUrl("");
                    setError(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-colors"
                >
                  Tạo bài học từ video khác
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Tips ──────────────────────────────────────────────────────── */}
        {!isPending && !generatedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 space-y-3"
          >
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              💡 Mẹo chọn video
            </h3>
            <div className="grid gap-2">
              {[
                {
                  icon: <Tv size={14} />,
                  text: "Chọn video trò chuyện thực tế (podcast, phỏng vấn, vlog)",
                },
                {
                  icon: <Tv size={14} />,
                  text: "Video có phụ đề tiếng Anh sẽ cho kết quả tốt nhất",
                },
                {
                  icon: <Tv size={14} />,
                  text: "Lý tưởng: 2-3 người nói, 3-10 phút, âm thanh rõ",
                },
                {
                  icon: <Tv size={14} />,
                  text: "Tránh: video nhạc, bài giảng dài, tốc độ nói quá nhanh",
                },
              ].map(({ icon, text }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-xs text-zinc-400 p-3 rounded-xl bg-zinc-800/30"
                >
                  <span className="text-zinc-600">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
