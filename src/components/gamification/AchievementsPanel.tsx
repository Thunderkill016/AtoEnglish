import { StatLine } from "@/components/ui/page";
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Flame, Mic, BookOpen, CreditCard, Sparkles } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title_vn: string;
  title_en: string;
  description_vn: string;
  emoji: string;
  category: 'streak' | 'xp' | 'lesson' | 'speaking' | 'flashcard' | 'special';
  xp_reward: number;
  threshold: number | null;
  unlocked_at?: string | null;
}

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

// Category icons
const CATEGORY_ICONS = {
  streak: Flame,
  xp: Star,
  lesson: BookOpen,
  speaking: Mic,
  flashcard: CreditCard,
  special: Sparkles,
};

const CATEGORY_COLORS = {
  streak: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
  xp: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
  lesson: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
  speaking: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  flashcard: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
  special: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
};

// ─── Single Achievement Card ──────────────────────────────────────────────────

function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const Icon = CATEGORY_ICONS[achievement.category];
  const colorClass = CATEGORY_COLORS[achievement.category];

  return (
    <motion.div
      layout
      className={`relative flex items-center gap-3 rounded-2xl border p-3 transition-all ${
        unlocked
          ? `bg-gradient-to-br ${colorClass}`
          : 'bg-white/3 border-white/8 opacity-45 grayscale'
      }`}
      whileHover={unlocked ? { scale: 1.02 } : {}}
    >
      {/* Emoji badge */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
        unlocked ? 'bg-white/10' : 'bg-white/5'
      }`}>
        {achievement.emoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-white text-sm font-semibold truncate">{achievement.title_vn}</p>
          {unlocked && achievement.xp_reward > 0 && (
            <span className="text-xs text-yellow-400 font-medium shrink-0">+{achievement.xp_reward} XP</span>
          )}
        </div>
        <p className="text-zinc-400 text-xs mt-0.5 leading-tight line-clamp-2">
          {unlocked ? achievement.description_vn : `Hoàn thành thêm ${achievement.threshold ?? '?'} lần để mở khóa`}
        </p>
        {unlocked && achievement.unlocked_at && (
          <p className="text-zinc-600 text-xs mt-1">
            {new Date(achievement.unlocked_at).toLocaleDateString('vi-VN')}
          </p>
        )}
      </div>

      {/* Lock/unlock icon */}
      <div className="shrink-0">
        {unlocked ? (
          <div className="w-6 h-6 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center">
            <Icon className="w-3 h-3 text-emerald-400" />
          </div>
        ) : (
          <div className="w-6 h-6 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
            <span className="text-zinc-600 text-xs">🔒</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Achievements Panel ───────────────────────────────────────────────────────

interface AchievementsPanelProps {
  achievements: Achievement[];
  unlockedIds: Set<string>;
}

const CATEGORY_LABELS: Record<Achievement['category'], string> = {
  streak: '🔥 Chuỗi học',
  xp: '⭐ Điểm XP',
  lesson: '📚 Bài học',
  speaking: '🎤 Luyện nói',
  flashcard: '🃏 Flashcard',
  special: '✨ Đặc biệt',
};

export function AchievementsPanel({ achievements, unlockedIds }: AchievementsPanelProps) {
  const categories = Array.from(new Set(achievements.map(a => a.category))) as Achievement['category'][];
  const unlockedCount = achievements.filter(a => unlockedIds.has(a.id)).length;

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-4 flex items-center gap-4">
        <Trophy className="w-8 h-8 text-yellow-400 shrink-0" />
        <div>
          <p className="text-white font-bold text-lg">{unlockedCount} / {achievements.length}</p>
          <p className="text-zinc-400 text-sm">Thành tích đã mở khóa</p>
        </div>
        <div className="ml-auto">
          <div className="h-2 w-24 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
              transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-zinc-500 text-xs mt-1 text-right">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </p>
        </div>
      </div>

      {/* By category */}
      {categories.map(cat => {
        const catAchievements = achievements.filter(a => a.category === cat);
        const catUnlocked = catAchievements.filter(a => unlockedIds.has(a.id)).length;
        return (
          <div key={cat} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-white text-sm font-semibold">{CATEGORY_LABELS[cat]}</h3>
              <span className="text-zinc-500 text-xs">{catUnlocked}/{catAchievements.length}</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {catAchievements.map(a => (
                <AchievementCard
                  key={a.id}
                  achievement={a}
                  unlocked={unlockedIds.has(a.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Achievement Unlock Toast (shown when new achievement unlocked) ───────────

interface AchievementUnlockToastProps {
  achievement: Achievement;
  onDismiss: () => void;
}

export function AchievementUnlockToast({ achievement, onDismiss }: AchievementUnlockToastProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -80, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -80, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[340px] max-w-[calc(100vw-2rem)]"
      >
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-yellow-500/40 rounded-2xl p-4 shadow-2xl shadow-yellow-500/10">
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 500 }}
              className="text-4xl shrink-0"
            >
              {achievement.emoji}
            </motion.div>
            <div className="flex-1">
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">🏆 Thành tích mới!</p>
              <p className="text-white font-bold text-base mt-0.5">{achievement.title_vn}</p>
              <p className="text-zinc-400 text-xs mt-0.5">{achievement.description_vn}</p>
              {achievement.xp_reward > 0 && (
                <p className="text-yellow-400 text-xs font-semibold mt-1">+{achievement.xp_reward} XP thưởng!</p>
              )}
            </div>
            <button
              onClick={onDismiss}
              className="text-zinc-600 hover:text-zinc-400 text-lg leading-none shrink-0"
            >×</button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
