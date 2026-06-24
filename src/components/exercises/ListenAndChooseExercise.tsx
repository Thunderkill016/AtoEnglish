'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, CheckCircle, XCircle, Loader2 } from 'lucide-react';

export interface ListenQuestion {
  id: string;
  audioText: string;       // Text to speak via TTS
  options: string[];       // 4 options (Vietnamese meanings)
  answer: string;          // Correct option
  hint?: string;           // Optional English word shown after playback
}

interface ListenAndChooseProps {
  question: ListenQuestion;
  onAnswer: (correct: boolean, chosen: string) => void;
}

export function ListenAndChooseExercise({ question, onAnswer }: ListenAndChooseProps) {
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const playAudio = useCallback((rate = 0.85) => {
    if (!('speechSynthesis' in window)) return;
    if (playing) { window.speechSynthesis.cancel(); setPlaying(false); return; }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(question.audioText);
    utt.lang = 'en-US';
    utt.rate = rate;
    utt.pitch = 1;
    utt.onstart = () => setPlaying(true);
    utt.onend = () => { setPlaying(false); setPlayed(true); };
    utt.onerror = () => { setPlaying(false); setPlayed(true); };
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [question.audioText, playing]);

  const handleChoose = useCallback((opt: string) => {
    if (!played || submitted) return;
    setChosen(opt);
  }, [played, submitted]);

  const handleSubmit = useCallback(() => {
    if (!chosen || submitted) return;
    setSubmitted(true);
    const correct = chosen === question.answer;
    setTimeout(() => onAnswer(correct, chosen), 1000);
  }, [chosen, submitted, question.answer, onAnswer]);

  const isCorrect = chosen === question.answer;

  return (
    <div className="w-full space-y-5">
      {/* Instruction */}
      <div className="text-center">
        <p className="text-zinc-400 text-xs uppercase tracking-wider font-medium mb-1">Nghe và chọn nghĩa đúng</p>
        <p className="text-zinc-500 text-xs">{played ? 'Chọn nghĩa phù hợp với từ vừa nghe' : 'Nhấn nút loa để nghe'}</p>
      </div>

      {/* Audio controls */}
      <div className="flex flex-col items-center gap-3">
        <motion.button
          onClick={() => playAudio(0.85)}
          whileTap={{ scale: 0.95 }}
          className={`relative w-24 h-24 rounded-full flex items-center justify-center transition-all ${
            playing
              ? 'bg-blue-500/20 border-2 border-blue-400 shadow-[0_0_32px_rgba(59,130,246,0.4)]'
              : played
              ? 'bg-emerald-500/10 border-2 border-emerald-500/40 hover:bg-emerald-500/20'
              : 'bg-white/8 border-2 border-white/20 hover:bg-white/15 hover:border-white/40'
          }`}
        >
          {playing ? (
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
          ) : (
            <Volume2 className={`w-10 h-10 ${played ? 'text-emerald-400' : 'text-white'}`} />
          )}
          {playing && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400/50"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Slow speed button — shown after first listen */}
        {played && !playing && (
          <button
            onClick={() => playAudio(0.55)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 transition-colors text-xs font-medium"
          >
            <Volume2 className="w-3.5 h-3.5" />
            Nghe chậm hơn
          </button>
        )}
      </div>

      {/* Hint (shown after playing) */}
      <AnimatePresence>
        {played && question.hint && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="text-white font-bold text-xl tracking-wide">{question.hint}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Options */}
      <div className={`grid grid-cols-2 gap-3 transition-opacity duration-300 ${!played ? 'opacity-30 pointer-events-none' : ''}`}>
        {question.options.map(opt => {
          let cls = 'p-4 rounded-2xl border-2 text-sm font-medium text-center transition-all cursor-pointer ';
          if (submitted) {
            if (opt === question.answer) cls += 'bg-emerald-500/20 border-emerald-400 text-emerald-300';
            else if (opt === chosen && !isCorrect) cls += 'bg-red-500/15 border-red-400 text-red-300';
            else cls += 'bg-white/3 border-white/8 text-zinc-500';
          } else if (opt === chosen) {
            cls += 'bg-blue-500/20 border-blue-400 text-blue-300 scale-[1.02]';
          } else {
            cls += 'bg-white/5 border-white/15 text-zinc-200 hover:bg-white/10 hover:border-white/30 active:scale-95';
          }
          return (
            <motion.button key={opt} className={cls} onClick={() => handleChoose(opt)} whileTap={!submitted ? { scale: 0.97 } : {}}>
              {opt}
              {submitted && opt === question.answer && <CheckCircle className="w-4 h-4 text-emerald-400 mx-auto mt-1" />}
              {submitted && opt === chosen && !isCorrect && <XCircle className="w-4 h-4 text-red-400 mx-auto mt-1" />}
            </motion.button>
          );
        })}
      </div>

      {/* Submit */}
      {!submitted && (
        <motion.button
          onClick={handleSubmit}
          disabled={!chosen}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3.5 rounded-2xl text-base font-bold transition-all ${
            chosen
              ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/25'
              : 'bg-white/5 text-zinc-600 cursor-not-allowed'
          }`}
        >
          {chosen ? 'Xác nhận →' : 'Nghe rồi chọn đáp án'}
        </motion.button>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 rounded-xl p-3 ${
              isCorrect ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}
          >
            {isCorrect
              ? <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              : <XCircle className="w-5 h-5 text-red-400 shrink-0" />}
            <p className={`text-sm font-semibold ${isCorrect ? 'text-emerald-300' : 'text-red-300'}`}>
              {isCorrect ? 'Chính xác! 🎉' : `Đáp án đúng: ${question.answer}`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
