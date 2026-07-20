import { StatLine } from "@/components/ui/page";
'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Timer, RotateCcw } from 'lucide-react';

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

interface MatchingPairsGameProps {
  pairs: MatchPair[];
  onComplete?: (stats: { timeSeconds: number; attempts: number; perfect: boolean }) => void;
  title?: string;
}

interface Card {
  id: string;
  pairId: string;
  text: string;
  side: 'left' | 'right';
}

type CardState = 'idle' | 'selected' | 'matched' | 'wrong';

interface GameState {
  leftCards: Card[];
  rightCards: Card[];
  cardStates: Record<string, CardState>;
  selectedLeft: string | null;
  selectedRight: string | null;
  matchedCount: number;
  attempts: number;
  isComplete: boolean;
  elapsedSeconds: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildInitialState(pairs: MatchPair[]): GameState {
  const left: Card[] = pairs.map(p => ({ id: `L-${p.id}`, pairId: p.id, text: p.left, side: 'left' as const }));
  const right: Card[] = pairs.map(p => ({ id: `R-${p.id}`, pairId: p.id, text: p.right, side: 'right' as const }));
  const cardStates: Record<string, CardState> = {};
  [...left, ...right].forEach(c => { cardStates[c.id] = 'idle'; });
  return {
    leftCards: shuffle(left),
    rightCards: shuffle(right),
    cardStates,
    selectedLeft: null,
    selectedRight: null,
    matchedCount: 0,
    attempts: 0,
    isComplete: false,
    elapsedSeconds: 0,
  };
}

export function MatchingPairsGame({ pairs, onComplete, }: MatchingPairsGameProps) {
  const [game, setGame] = useState<GameState>(() => buildInitialState(pairs));
  const startTimeRef = useRef(0);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isBlockedRef = useRef(false);

  // Initialize start time once on mount (not during render to avoid impure call)
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  // Timer
  useEffect(() => {
    if (game.isComplete) return;
    const interval = setInterval(() => {
      setGame(g => ({ ...g, elapsedSeconds: Math.floor((Date.now() - startTimeRef.current) / 1000) }));
    }, 1000);
    return () => clearInterval(interval);
  }, [game.isComplete]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
    };
  }, []);

  const handleSelect = useCallback((card: Card) => {
    if (isBlockedRef.current) return;

    setGame(g => {
      if (g.cardStates[card.id] === 'matched') return g;

      const next = { ...g, cardStates: { ...g.cardStates } };

      if (card.side === 'left') {
        // Deselect previous left
        Object.keys(next.cardStates).forEach(id => {
          if (next.cardStates[id] === 'selected' && id.startsWith('L-')) next.cardStates[id] = 'idle';
        });
        if (g.selectedLeft === card.id) {
          next.cardStates[card.id] = 'idle';
          next.selectedLeft = null;
        } else {
          next.cardStates[card.id] = 'selected';
          next.selectedLeft = card.id;
        }
      } else {
        Object.keys(next.cardStates).forEach(id => {
          if (next.cardStates[id] === 'selected' && id.startsWith('R-')) next.cardStates[id] = 'idle';
        });
        if (g.selectedRight === card.id) {
          next.cardStates[card.id] = 'idle';
          next.selectedRight = null;
        } else {
          next.cardStates[card.id] = 'selected';
          next.selectedRight = card.id;
        }
      }

      // Check for match if both sides selected
      const sl = card.side === 'left' ? (g.selectedLeft === card.id ? null : card.id) : next.selectedLeft;
      const sr = card.side === 'right' ? (g.selectedRight === card.id ? null : card.id) : next.selectedRight;

      if (!sl || !sr) return next;

      const leftCard = g.leftCards.find(c => c.id === sl);
      const rightCard = g.rightCards.find(c => c.id === sr);
      if (!leftCard || !rightCard) return next;

      const newAttempts = g.attempts + 1;

      if (leftCard.pairId === rightCard.pairId) {
        // Correct match
        next.cardStates[sl] = 'matched';
        next.cardStates[sr] = 'matched';
        next.selectedLeft = null;
        next.selectedRight = null;
        next.attempts = newAttempts;
        const newCount = g.matchedCount + 1;
        next.matchedCount = newCount;
        if (newCount === pairs.length) {
          next.isComplete = true;
          const timeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          // Defer callback outside of setState
          setTimeout(() => {
            onComplete?.({ timeSeconds, attempts: newAttempts, perfect: newAttempts === pairs.length });
          }, 0);
        }
      } else {
        // Wrong match — block input, flash red, then reset
        next.cardStates[sl] = 'wrong';
        next.cardStates[sr] = 'wrong';
        next.selectedLeft = null;
        next.selectedRight = null;
        next.attempts = newAttempts;
        isBlockedRef.current = true;
        wrongTimeoutRef.current = setTimeout(() => {
          isBlockedRef.current = false;
          setGame(prev => ({
            ...prev,
            cardStates: {
              ...prev.cardStates,
              [sl]: prev.cardStates[sl] === 'wrong' ? 'idle' : prev.cardStates[sl],
              [sr]: prev.cardStates[sr] === 'wrong' ? 'idle' : prev.cardStates[sr],
            },
          }));
        }, 700);
      }

      return next;
    });
  }, [pairs.length, onComplete]);

  const handleReset = useCallback(() => {
    if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
    isBlockedRef.current = false;
    startTimeRef.current = Date.now();
     
    setGame(buildInitialState(pairs));
  }, [pairs]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const accuracy = game.attempts > 0 ? Math.round((game.matchedCount / game.attempts) * 100) : 100;

  const getCardClass = (state: CardState) => {
    const base = 'relative flex items-center justify-center text-center px-3 py-3 rounded-xl text-sm font-medium cursor-pointer transition-all duration-150 select-none min-h-[56px] border-2 leading-tight';
    switch (state) {
      case 'idle':     return `${base} bg-white/5 border-white/10 text-zinc-200 hover:bg-white/10 hover:border-emerald-500/40 active:scale-95`;
      case 'selected': return `${base} bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_16px_rgba(16,185,129,0.3)] scale-105`;
      case 'matched':  return `${base} bg-emerald-500/15 border-emerald-500/30 text-emerald-400 opacity-60 cursor-default`;
      case 'wrong':    return `${base} bg-red-500/20 border-red-400 text-red-300`;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-base">{'🃏 Nối từ với nghĩa'}</h3>
          <p className="text-zinc-400 text-xs mt-0.5">Chọn cặp từ tương ứng để hoàn thành</p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 text-zinc-400">
            <Timer className="w-3.5 h-3.5" />
            <span className="font-mono">{formatTime(game.elapsedSeconds)}</span>
          </span>
          <span className="text-zinc-500 text-xs">{game.matchedCount}/{pairs.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(game.matchedCount / pairs.length) * 100}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        />
      </div>

      {/* Card Grid */}
      <AnimatePresence>
        {!game.isComplete && (
          <motion.div className="grid grid-cols-2 gap-2" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <div className="flex flex-col gap-2">
              {game.leftCards.map(card => (
                <motion.button
                  key={card.id}
                  className={getCardClass(game.cardStates[card.id] ?? 'idle')}
                  onClick={() => handleSelect(card)}
                  whileTap={{ scale: 0.97 }}
                  layout
                >
                  {card.text}
                  {game.cardStates[card.id] === 'matched' && (
                    <CheckCircle className="absolute top-1 right-1 w-3 h-3 text-emerald-400" />
                  )}
                </motion.button>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {game.rightCards.map(card => (
                <motion.button
                  key={card.id}
                  className={getCardClass(game.cardStates[card.id] ?? 'idle')}
                  onClick={() => handleSelect(card)}
                  whileTap={{ scale: 0.97 }}
                  layout
                >
                  {card.text}
                  {game.cardStates[card.id] === 'matched' && (
                    <CheckCircle className="absolute top-1 right-1 w-3 h-3 text-emerald-400" />
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion screen */}
      <AnimatePresence>
        {game.isComplete && (
          <motion.div
            className="bg-white/5 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="text-4xl">{accuracy === 100 ? '🎉' : accuracy >= 70 ? '🎊' : '👍'}</div>
            <div>
              <h4 className="text-white font-bold text-lg">
                {accuracy === 100 ? 'Hoàn hảo!' : accuracy >= 70 ? 'Tốt lắm!' : 'Hoàn thành!'}
              </h4>
              <p className="text-zinc-400 text-sm mt-1">
                {pairs.length} cặp · {formatTime(game.elapsedSeconds)} · {accuracy}% chính xác
              </p>
            </div>
            <div className="flex justify-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-emerald-400 font-bold text-xl">{accuracy}%</div>
                <div className="text-zinc-500 text-xs">Độ chính xác</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-bold text-xl">{formatTime(game.elapsedSeconds)}</div>
                <div className="text-zinc-500 text-xs">Thời gian</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-bold text-xl">{game.attempts}</div>
                <div className="text-zinc-500 text-xs">Lần thử</div>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 mx-auto text-zinc-400 hover:text-white text-sm transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Chơi lại
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
