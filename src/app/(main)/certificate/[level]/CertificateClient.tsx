"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Award, Download, ArrowLeft, BookOpen, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  level: string;
  levelLabel: string;
  userName: string;
  totalXp: number;
  isEligible: boolean;
  completedForLevel: number;
  requiredUnits: number;
  completedDate: string | null;
}

// Level color themes
const LEVEL_THEMES: Record<string, { gradient: string; accent: string; badge: string }> = {
  a1: {
    gradient: "from-emerald-600 via-teal-500 to-emerald-400",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/20 border-emerald-500/40 text-emerald-300",
  },
  a2: {
    gradient: "from-blue-600 via-indigo-500 to-blue-400",
    accent: "text-blue-400",
    badge: "bg-blue-500/20 border-blue-500/40 text-blue-300",
  },
  b1: {
    gradient: "from-purple-600 via-violet-500 to-purple-400",
    accent: "text-purple-400",
    badge: "bg-purple-500/20 border-purple-500/40 text-purple-300",
  },
  b2: {
    gradient: "from-orange-600 via-amber-500 to-orange-400",
    accent: "text-orange-400",
    badge: "bg-orange-500/20 border-orange-500/40 text-orange-300",
  },
};

export default function CertificateClient({
  level,
  levelLabel,
  userName,
  totalXp,
  isEligible,
  completedForLevel,
  requiredUnits,
  completedDate,
}: Props) {
  const router = useRouter();
  const theme = LEVEL_THEMES[level] ?? LEVEL_THEMES.a1;

  if (!isEligible) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center space-y-6"
        >
          <div className="inline-flex size-20 items-center justify-center rounded-3xl bg-zinc-800 border border-zinc-700">
            <Lock className="size-10 text-zinc-500" />
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-zinc-100">Chứng nhận chưa mở khoá</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Bạn đã hoàn thành <span className="font-bold text-zinc-200">{completedForLevel}/{requiredUnits}</span> bài học của chặng{" "}
              <span className="font-bold text-zinc-200">{level.toUpperCase()}</span>.
              Hoàn thành tất cả để nhận chứng nhận!
            </p>
          </div>
          <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round((completedForLevel / requiredUnits) * 100)}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className={`h-full rounded-full bg-gradient-to-r ${theme.gradient}`}
            />
          </div>
          <p className={`text-xs font-bold ${theme.accent}`}>
            {Math.round((completedForLevel / requiredUnits) * 100)}% hoàn thành
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/learn")}
              className={`w-full h-12 bg-gradient-to-r ${theme.gradient} text-white font-bold rounded-xl`}
            >
              <BookOpen className="size-4 mr-2" /> Tiếp tục học
            </Button>
            <Button variant="ghost" onClick={() => router.back()} className="text-zinc-500 hover:text-zinc-300">
              <ArrowLeft className="size-4 mr-1" /> Quay lại
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-28 sm:p-8 sm:pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950`} />
      <div className={`pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-gradient-to-br ${theme.gradient} opacity-10 blur-[120px]`} />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-zinc-500 hover:text-zinc-300 rounded-xl">
          <ArrowLeft className="size-4 mr-1" /> Quay lại
        </Button>
      </motion.div>

      {/* Certificate Card */}
      <motion.div
        id="certificate-card"
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-2xl bg-zinc-900/80 border border-zinc-700/60 rounded-3xl overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] backdrop-blur-xl print:shadow-none"
      >
        {/* Top gradient bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${theme.gradient}`} />

        <div className="p-8 sm:p-12 space-y-8">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">AtoEnglish</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Certificate of Completion</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className={`size-16 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}
            >
              <Award className="size-9 text-white" />
            </motion.div>
          </div>

          {/* Main content */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <p className="text-zinc-500 text-sm font-semibold">Chứng nhận hoàn thành</p>
              <h1 className={`text-4xl sm:text-5xl font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                {levelLabel.split("—")[0].trim()}
              </h1>
              <p className="text-zinc-400 text-sm">{levelLabel.split("—")[1]?.trim()}</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 200 }}
                >
                  <Star className="size-8 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-700/60" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-zinc-900 px-4 text-[10px] text-zinc-600 uppercase tracking-widest font-bold">
                  Cấp cho
                </span>
              </div>
            </div>

            {/* Recipient name */}
            <div className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight">
                {userName}
              </h2>
              <p className="text-zinc-500 text-sm">
                đã hoàn thành <span className="font-bold text-zinc-300">{requiredUnits} bài học</span> chặng{" "}
                <span className="font-bold text-zinc-300">{level.toUpperCase()}</span> với{" "}
                <span className={`font-black ${theme.accent}`}>{totalXp.toLocaleString()} XP</span>
              </p>
            </div>

            {/* Date */}
            {completedDate && (
              <p className="text-xs text-zinc-600 font-mono">
                Ngày cấp: {completedDate}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Bài học", value: `${requiredUnits}` },
              { label: "XP tích lũy", value: totalXp.toLocaleString() },
              { label: "Trình độ", value: level.toUpperCase() },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-zinc-800/60 border border-zinc-700/40 p-3 text-center">
                <p className={`text-lg font-black ${theme.accent}`}>{value}</p>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Watermark / signature line */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="space-y-1">
              <div className={`text-xs font-black bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                AtoEnglish
              </div>
              <p className="text-[10px] text-zinc-600">atoenglish.vercel.app</p>
            </div>
            <div className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-xl border ${theme.badge}`}>
              Xác thực ✓
            </div>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${theme.gradient} opacity-40`} />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 mt-8 w-full max-w-2xl print:hidden"
      >
        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex-1 h-12 rounded-xl font-bold border-zinc-700 hover:bg-zinc-800 text-zinc-300 gap-2"
        >
          <Download className="size-4" />
          Lưu / In chứng nhận
        </Button>
        <Button
          onClick={() => router.push("/dashboard")}
          className={`flex-1 h-12 bg-gradient-to-r ${theme.gradient} text-white font-bold rounded-xl shadow-lg`}
        >
          Về Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
