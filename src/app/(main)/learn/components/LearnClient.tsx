"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Play, CheckCircle, Sparkles, BookOpen, Star, Clock, RotateCcw, BookOpenCheck, Trophy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UnitStatus {
  id: string;
  title: string;
  description: string;
  level: string;
  route: string;
  xp: number;
  estimatedTime: number;
  completed: boolean;
  progress: number;
  vocabCount?: number;
  starCount?: number;
}

interface LearnClientProps {
  userLevel: string;
  totalXp: number;
  completedUnitIds: string[];
  activeUnitId: string;
  unitStatuses: UnitStatus[];
}

export default function LearnClient({
  userLevel,
  totalXp,
  completedUnitIds,
  activeUnitId,
  unitStatuses,
}: LearnClientProps) {
  return (
    <div className="relative mx-auto max-w-4xl px-4 py-6 sm:py-12 sm:px-6 lg:px-8 min-h-screen overflow-x-hidden pb-20 sm:pb-0">
      {/* Background blurs */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 -z-10 h-[400px] w-[90vw] max-w-[500px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/3 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-10 left-10 -z-10 h-[300px] w-[300px] rounded-full bg-teal-500/4 dark:bg-teal-500/2 blur-[100px]" />

      {/* Roadmap Header */}
      <div className="text-center space-y-3 mb-8 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider"
        >
          <Sparkles className="size-3.5 fill-current animate-pulse" />
          Lộ trình {userLevel} • {totalXp} XP tích lũy
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-zinc-50 tracking-tight"
        >
          Học tiếng Anh cùng{" "}
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300">
            AtoEnglish
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto"
        >
          Hoàn thành các chương học theo phương pháp IPOR (Input - Processing - Output - Review) để mở khóa các bài học nâng cao hơn.
        </motion.p>
      </div>

      {/* New user: placement test CTA */}
      {completedUnitIds.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-8"
        >
          <Link
            href="/placement-test"
            className="flex items-center gap-3 p-4 rounded-2xl border border-violet-500/25 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/35 transition-all duration-200 group"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/15 text-xl shrink-0">🎯</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-violet-400 uppercase tracking-widest mb-0.5">Bước đầu tiên</p>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Xác định trình độ CEFR của mày</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">40 câu · ~20 phút · Tự động set level phù hợp</p>
            </div>
            <ChevronRight className="size-5 text-violet-400/60 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        </motion.div>
      )}

      {/* Roadmap Path timeline */}
      <div className="relative space-y-8 sm:space-y-12 pb-8 sm:pb-16">
        {/* Central connecting line */}
        <div className="absolute left-[39px] sm:left-1/2 top-4 bottom-4 w-1 bg-zinc-200 dark:bg-zinc-800 -translate-x-1/2 -z-20" />

        {unitStatuses.map((unit, index) => {
          const isCompleted = completedUnitIds.includes(unit.id);
          const isUnlocked = index === 0 || completedUnitIds.includes(unitStatuses[index - 1].id);
          const isActive = unit.id === activeUnitId && isUnlocked && !isCompleted;

          // Layout styling helpers
          const isEven = index % 2 === 0;

          // CEFR level separator: show milestone banner when level changes
          const prevLevel = index > 0 ? unitStatuses[index - 1].level : null;
          const isNewLevel = prevLevel !== null && unit.level !== prevLevel;

          const LEVEL_CONFIG: Record<string, { label: string; color: string; ring: string; bg: string }> = {
            A0: { label: "Nền Tảng",       color: "from-emerald-400 to-teal-500",   ring: "ring-emerald-500/30", bg: "from-emerald-950/40 to-teal-950/40" },
            A1: { label: "Người Bắt Đầu",  color: "from-emerald-500 to-cyan-500",   ring: "ring-cyan-500/30",     bg: "from-emerald-950/40 to-cyan-950/40" },
            A2: { label: "Sơ trung cấp",   color: "from-blue-500 to-indigo-500",    ring: "ring-blue-500/30",    bg: "from-blue-950/40 to-indigo-950/40" },
            B1: { label: "Trung cấp",      color: "from-purple-500 to-violet-500",  ring: "ring-purple-500/30", bg: "from-purple-950/40 to-violet-950/40" },
            B2: { label: "Trên trung cấp", color: "from-orange-500 to-amber-500",   ring: "ring-orange-500/30", bg: "from-orange-950/40 to-amber-950/40" },
            C1: { label: "Cao cấp",        color: "from-rose-500 to-pink-500",      ring: "ring-rose-500/30",   bg: "from-rose-950/40 to-pink-950/40" },
          };
          const lvlCfg = LEVEL_CONFIG[unit.level];

          return (
            <React.Fragment key={unit.id}>
              {/* CEFR Level Milestone Banner */}
              {isNewLevel && lvlCfg && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                  className={`w-full relative z-10 rounded-2xl border bg-gradient-to-br ${lvlCfg.bg} border-white/10 p-5 sm:p-6 text-center ring-1 ${lvlCfg.ring} sm:mx-auto sm:max-w-md`}
                >
                  <div className="flex justify-center mb-3">
                    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${lvlCfg.color} text-white text-xs font-black uppercase tracking-widest shadow-lg`}>
                      <Trophy className="size-3.5" />
                      Chặng mới — Level {unit.level}
                    </span>
                  </div>
                  <p className="text-white font-black text-lg sm:text-xl mb-1">
                    🎉 Bạn đã chinh phục {prevLevel}!
                  </p>
                  <p className="text-zinc-400 text-xs sm:text-sm">
                    {unit.level} {lvlCfg.label} — tiếp tục mạch học nhé!
                  </p>
                  <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${lvlCfg.color} opacity-60 mx-auto w-24`} />
                </motion.div>
              )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-between w-full relative gap-6 sm:gap-0 ${
                isEven ? "sm:flex-row-reverse" : ""
              }`}
            >
              {/* Connecting node dot */}
              <div className="absolute left-[39px] sm:left-1/2 top-6 sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <motion.div
                  whileHover={{ scale: isUnlocked ? 1.15 : 1 }}
                  className={`size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-md ${
                    isCompleted
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-emerald-950/20"
                      : isActive
                      ? "bg-emerald-600 border-emerald-400 text-white animate-pulse shadow-emerald-500/30"
                      : isUnlocked
                      ? "bg-zinc-800 border-zinc-700 text-zinc-300"
                      : "bg-zinc-900 border-zinc-800 text-zinc-600"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="size-5 fill-current text-emerald-500" />
                  ) : !isUnlocked ? (
                    <Lock className="size-4" />
                  ) : (
                    <span className="text-xs font-black">{index + 1}</span>
                  )}
                </motion.div>
              </div>

              {/* Card Container */}
              <div className={`w-full sm:w-[42%] pl-[75px] sm:pl-0 ${isEven ? "sm:text-right" : "sm:text-left"}`}>
                <div
                  className={`group relative rounded-2xl border bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm p-5 space-y-4 hover:border-emerald-500/30 transition-all duration-300 shadow-sm ${
                    isActive ? "border-emerald-500/40 ring-1 ring-emerald-500/10 shadow-emerald-950/5" : "border-zinc-200/60 dark:border-zinc-800/60"
                  } ${!isUnlocked ? "opacity-60 grayscale-[40%]" : ""}`}
                >
                  {/* Card Glow */}
                  {isActive && (
                    <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-100 transition duration-300" />
                  )}

                  {/* Level Tag & XP */}
                  <div className={`flex items-center gap-2 text-xs font-semibold ${isEven ? "sm:justify-end" : ""}`}>
                    <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      {unit.level}
                    </span>
                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold">
                      <Star className="size-3 fill-current" />
                      +{unit.xp} XP
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-500 transition-colors">
                      {unit.title}
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                      {unit.description}
                    </p>
                  </div>

                  {/* Study specs & Progress */}
                  <div className={`flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 ${isEven ? "sm:justify-end" : ""}`}>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {unit.estimatedTime} phút
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="size-3.5" />
                      {unit.vocabCount ?? 0} từ vựng
                    </span>
                  </div>

                  {/* Progress bar */}
                  {isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400 font-bold">
                        <span>Tiến độ học</span>
                        <span>{unit.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                          style={{ width: `${unit.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Star rating for completed units */}
                  {isCompleted && (unit.starCount ?? 0) > 0 && (
                    <div className={`flex items-center gap-1 ${isEven ? "sm:justify-end" : ""}`}>
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`size-4 ${
                            s <= (unit.starCount ?? 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-zinc-300 dark:text-zinc-700 fill-zinc-300 dark:fill-zinc-700"
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold ml-0.5">
                        {unit.starCount === 3 ? "Hoàn hảo!" : unit.starCount === 2 ? "Tốt" : "Hoàn thành"}
                      </span>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className={`pt-2 flex ${isEven ? "sm:justify-end" : ""}`}>
                    {isCompleted ? (
                      <div className={`flex flex-wrap gap-2 ${isEven ? "sm:justify-end" : ""}`}>
                        <Link
                          href={unit.route}
                          onClick={() => {
                            // Clear saved progress so UnitTemplate resets to section 1
                            localStorage.removeItem(`lesson-progress-${unit.id}`);
                          }}
                        >
                          <Button
                            variant="secondary"
                            size="sm"
                            className="rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-bold gap-1"
                          >
                            <RotateCcw className="size-3" /> Học lại
                          </Button>
                        </Link>
                        <Link href={`/quiz?unit=${unit.id}`}>
                          <Button
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-xs font-bold gap-1 active:scale-95 transition-all"
                          >
                            <BookOpenCheck className="size-3" /> Quiz
                          </Button>
                        </Link>
                      </div>
                    ) : isActive ? (
                      <Link href={unit.route} className="w-full sm:w-auto">
                        <Button
                          size="sm"
                          className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold gap-1.5 shadow-md shadow-emerald-900/20 active:scale-95 transition-all"
                        >
                          <Play className="size-3 fill-current" /> Học tiếp
                        </Button>
                      </Link>
                    ) : isUnlocked ? (
                      <Link href={unit.route} className="w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl border-glass hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors text-xs font-bold gap-1"
                        >
                          <Play className="size-3" /> Bắt đầu
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        disabled
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-xs font-bold gap-1 cursor-not-allowed text-zinc-600"
                      >
                        <Lock className="size-3" /> Chưa mở khóa
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Empty spacer for grid alignment */}
              <div className="hidden sm:block sm:w-[42%]" />
            </motion.div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
