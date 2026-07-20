'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Flame, Info } from 'lucide-react';
import { toast } from 'sonner';

interface StreakShieldWidgetProps {
  currentStreak: number;
  freezeCount: number;
  onUseFreeze?: () => Promise<void>;
}

export function StreakShieldWidget({ currentStreak, freezeCount, onUseFreeze }: StreakShieldWidgetProps) {
  const [localFreezeCount, setLocalFreezeCount] = useState(freezeCount);
  const [isUsing, setIsUsing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleUseFreeze = async () => {
    if (localFreezeCount <= 0 || isUsing) return;
    setIsUsing(true);
    try {
      await onUseFreeze?.();
      setLocalFreezeCount(c => c - 1);
      toast.success('🛡️ Streak được bảo vệ hôm nay!', {
        description: 'Bạn đã dùng 1 lá chắn streak. Còn lại ' + (localFreezeCount - 1) + ' lá chắn.',
      });
    } catch {
      toast.error('Không thể dùng lá chắn. Thử lại sau.');
    } finally {
      setIsUsing(false);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
      {/* Streak */}
      <div className="flex items-center gap-1.5">
        <Flame className="w-5 h-5 text-orange-400" />
        <span className="text-white font-bold text-lg leading-none">{currentStreak}</span>
        <span className="text-zinc-500 text-xs">ngày</span>
      </div>

      <div className="h-8 w-px bg-white/10" />

      {/* Shield count */}
      <div className="flex items-center gap-2 flex-1">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                i < localFreezeCount
                  ? 'bg-blue-500/30 border border-blue-400'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              {i < localFreezeCount && (
                <Shield className="w-2.5 h-2.5 text-blue-300" />
              )}
            </motion.div>
          ))}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowTooltip(v => !v)}
            className="text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-zinc-900 border border-white/10 rounded-xl p-3 text-xs text-zinc-300 z-10 shadow-xl"
              >
                <p className="font-semibold text-white mb-1">🛡️ Lá chắn streak</p>
                <p>Dùng khi bạn bỏ lỡ một ngày — streak sẽ được bảo vệ. Kiếm thêm bằng cách hoàn thành bài học liên tiếp.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Use button */}
      {onUseFreeze && (
        <button
          onClick={handleUseFreeze}
          disabled={localFreezeCount <= 0 || isUsing}
          className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
            localFreezeCount > 0
              ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 active:scale-95'
              : 'bg-white/5 border border-white/10 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {isUsing ? '...' : localFreezeCount > 0 ? 'Dùng lá chắn' : 'Hết lá chắn'}
        </button>
      )}
    </div>
  );
}
