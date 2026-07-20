import { StatLine } from "@/components/ui/page";
"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Star, ArrowRight, Trophy } from "lucide-react";

interface LevelUpModalProps {
  isOpen: boolean;
  previousLevel: string;
  newLevel: string;
  onClose: () => void;
}

const LEVEL_INFO: Record<string, { name: string; emoji: string; desc: string; color: string }> = {
  A2: {
    name: "Pre-Intermediate",
    emoji: "🌟",
    desc: "Bạn đã chinh phục A1! Tiếp tục với giao tiếp thường nhật — mua sắm, du lịch và sở thích.",
    color: "from-emerald-500 to-teal-400",
  },
  B1: {
    name: "Intermediate",
    emoji: "🚀",
    desc: "Xuất sắc! Trình độ Trung cấp mở ra chủ đề học thuật và giao tiếp công sở.",
    color: "from-blue-500 to-cyan-400",
  },
  B2: {
    name: "Upper-Intermediate",
    emoji: "💫",
    desc: "Ấn tượng! Bạn đã đạt trình độ tranh luận tự tin về các chủ đề phức tạp.",
    color: "from-violet-500 to-purple-400",
  },
  C1: {
    name: "Advanced",
    emoji: "🏆",
    desc: "Đỉnh cao! Trình độ C1 — Tiếng Anh học thuật và chuyên sâu. Bạn đã làm được!",
    color: "from-yellow-500 to-orange-400",
  },
};

export default function LevelUpModal({ isOpen, previousLevel, newLevel, onClose }: LevelUpModalProps) {
  const router = useRouter();
  const info = LEVEL_INFO[newLevel] ?? {
    name: newLevel,
    emoji: "🎉",
    desc: "Chúc mừng! Bạn đã lên cấp độ mới.",
    color: "from-emerald-500 to-teal-400",
  };

  useEffect(() => {
    if (!isOpen) return;
    // Fire confetti bursts
    const fire = (angle: number, origin: { x: number; y: number }) =>
      confetti({ particleCount: 80, spread: 60, angle, origin, colors: ["#10b981", "#14b8a6", "#f59e0b", "#8b5cf6"] });

    setTimeout(() => fire(60, { x: 0, y: 0.6 }), 100);
    setTimeout(() => fire(120, { x: 1, y: 0.6 }), 300);
    setTimeout(() => fire(90, { x: 0.5, y: 0.4 }), 500);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl bg-zinc-950 border border-zinc-800/60 shadow-2xl overflow-hidden"
          >
            {/* Gradient top band */}
            <div className={`h-2 w-full bg-gradient-to-r ${info.color}`} />

            <div className="p-5 sm:p-8 text-center space-y-4 sm:space-y-5">
              {/* Stars animation */}
              <div className="relative flex justify-center">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0, rotate: -30 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, type: "spring", stiffness: 400 }}
                    className="absolute"
                    style={{ left: `${30 + i * 20}%`, top: i === 1 ? "-8px" : "4px" }}
                  >
                    <Star className={`size-6 fill-yellow-400 text-yellow-400 ${i === 1 ? "size-8" : ""}`} />
                  </motion.div>
                ))}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="text-7xl mb-2"
                >
                  {info.emoji}
                </motion.div>
              </div>

              {/* Level up text */}
              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xs font-bold text-emerald-400 uppercase tracking-widest"
                >
                  Lên cấp độ mới!
                </motion.p>
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`text-2xl sm:text-4xl font-black bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}
                >
                  {newLevel}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-base font-bold text-white"
                >
                  {info.name}
                </motion.p>
              </div>

              {/* Level journey */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center justify-center gap-3"
              >
                <span className="text-sm font-bold text-zinc-500 line-through">{previousLevel}</span>
                <ArrowRight className="size-4 text-emerald-400" />
                <span className={`text-sm font-black bg-gradient-to-r ${info.color} bg-clip-text text-transparent`}>
                  {newLevel}
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-zinc-400 leading-relaxed"
              >
                {info.desc}
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col gap-2 pt-2"
              >
                <button
                  onClick={() => { onClose(); router.push("/learn"); }}
                  className={`w-full h-12 rounded-2xl bg-gradient-to-r ${info.color} text-white font-black flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg`}
                >
                  <Trophy className="size-4" />
                  Học tiếp ngay
                </button>
                <button
                  onClick={onClose}
                  className="w-full h-10 rounded-2xl border border-zinc-800 text-zinc-400 text-sm font-bold hover:text-white hover:border-zinc-600 transition-all"
                >
                  Để sau
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
