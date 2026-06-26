"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Volume2, Eye, EyeOff, ChevronRight } from "lucide-react";
import type { UnitData } from "../UnitTemplate";
import { playUnitAudio, stopUnitAudio } from "@/lib/utils/unit-audio";

interface DialogueSectionProps {
  unit: UnitData;
  sectionOrderIdx: number;
  TOTAL_SECTIONS: number;
  lacAnswers: Record<number, string>;
  setLacAnswers: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  lacSubmitted: boolean;
  setLacSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  playTTS: (text: string) => void;
  goNext: () => void;
}

const sectionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export default function DialogueSection({
  unit,
  sectionOrderIdx,
  TOTAL_SECTIONS,
  lacAnswers,
  setLacAnswers,
  lacSubmitted,
  setLacSubmitted,
  playTTS,
  goNext,
}: DialogueSectionProps) {
  const [selectedDialogue, setSelectedDialogue] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isPlayingDialogue, setIsPlayingDialogue] = useState(false);

  const DIALOGUES = unit.dialogues;
  const LISTEN_CHOOSE = unit.listenAndChoose;
  const lacScore = LISTEN_CHOOSE.filter((item, i) => lacAnswers[i] === item.answer).length;

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const pickEnglishVoice = () => {
    if (typeof window === "undefined") return null;
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find(v => v.lang === "en-US" && v.name.includes("Google")) ??
      voices.find(v => v.lang === "en-US") ??
      voices.find(v => v.lang.startsWith("en")) ??
      null
    );
  };

  const playDialogueTTS = (dialogueIdx: number, speed: number) => {
    if (DIALOGUES.length === 0) return;
    const dialogue = DIALOGUES[dialogueIdx];
    const lines = dialogue.lines;
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    stopUnitAudio();
    setIsPlayingDialogue(true);
    const voice = pickEnglishVoice();
    let i = 0;
    const playNext = () => {
      if (i >= lines.length) {
        setIsPlayingDialogue(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(lines[i].text);
      u.lang = "en-US";
      u.rate = speed;
      if (voice) u.voice = voice;
      u.onend = () => {
        i++;
        setTimeout(playNext, 800);
      };
      u.onerror = () => {
        i++;
        setTimeout(playNext, 800);
      };
      window.speechSynthesis.speak(u);
    };
    playNext();
  };

  const playDialogue = async (dialogueIdx: number, speed: number) => {
    if (DIALOGUES.length === 0) return;
    const dialogue = DIALOGUES[dialogueIdx];
    const fullText = dialogue.lines.map((l) => l.text).join(" ");
    window.speechSynthesis?.cancel();
    stopUnitAudio();

    const usedNative = await playUnitAudio(
      { src: dialogue.audio, text: fullText, rate: speed },
      () => { /* TTS fallback handled below */ }
    );

    if (usedNative) {
      setIsPlayingDialogue(false);
      return;
    }

    playDialogueTTS(dialogueIdx, speed);
  };

  return (
    <motion.div
      key="s5"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-500/10 rounded-xl">
          <Headphones className="text-blue-400" size={24} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
              Nghe hiểu
            </h1>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-950/60 border border-blue-800/50 px-2 py-0.5 rounded-full">
              Bước {sectionOrderIdx + 1}/{TOTAL_SECTIONS}
            </span>
          </div>
          <p className="text-xs text-zinc-500">~5 phút • Nghe & hiểu hội thoại thực tế</p>
        </div>
      </div>

      {/* Dialogue selector */}
      {DIALOGUES.length > 1 && (
        <div className="flex gap-2 mb-5">
          {DIALOGUES.map((d, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedDialogue(i);
                setShowTranscript(false);
                window.speechSynthesis?.cancel();
                setIsPlayingDialogue(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedDialogue === i
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>
      )}

      {/* Dialogue player */}
      {DIALOGUES.length > 0 && (
        <div className="bg-gradient-to-b from-zinc-900/80 to-zinc-950/80 border border-zinc-700/50 rounded-2xl p-5 mb-4 shadow-lg">
          <p className="text-xs text-zinc-500 mb-2">{DIALOGUES[selectedDialogue].desc}</p>
          <div className="flex gap-3 mb-4">
            <button
              onClick={() =>
                isPlayingDialogue
                  ? (window.speechSynthesis?.cancel(), stopUnitAudio(), setIsPlayingDialogue(false))
                  : void playDialogue(selectedDialogue, 1.0)
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                isPlayingDialogue
                  ? "bg-red-600/30 text-red-400 border border-red-600/30"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-md shadow-emerald-900/40 active:scale-95"
              }`}
            >
              <Volume2 size={16} />
              {isPlayingDialogue ? "Dừng" : "Nghe hội thoại"}
            </button>
            <button
              onClick={() =>
                isPlayingDialogue
                  ? (window.speechSynthesis?.cancel(), stopUnitAudio(), setIsPlayingDialogue(false))
                  : void playDialogue(selectedDialogue, 0.75)
              }
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors active:scale-95"
            >
              🐢 Chậm
            </button>
            <button
              onClick={() => setShowTranscript((p) => !p)}
              className="ml-auto flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}
              Transcript
            </button>
          </div>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                {DIALOGUES[selectedDialogue].lines.map((line, i) => (
                  <div key={i} className={`flex gap-3 ${i % 2 === 0 ? "" : "flex-row-reverse"}`}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black mt-1 bg-zinc-700 text-zinc-300">
                      {line.speaker.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-3 border ${
                        i % 2 === 0
                          ? "bg-zinc-800/90 border-zinc-700/60"
                          : "bg-emerald-950/60 border-emerald-700/30"
                      }`}
                    >
                      <p className="text-[10px] font-bold text-zinc-500 mb-1 uppercase tracking-wide">
                        {line.speaker}
                      </p>
                      <p className="text-white text-sm leading-relaxed">{line.text}</p>
                      <p className="text-zinc-500 text-xs mt-1.5 italic">{line.translation}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Listen & Choose */}
      {LISTEN_CHOOSE.length > 0 && (
        <div className="bg-gradient-to-b from-zinc-900/70 to-zinc-950/70 border border-zinc-700/50 rounded-2xl p-5 mb-6 shadow-md">
          <p className="text-sm font-bold text-white mb-4">🎧 Nghe và chọn đáp án đúng</p>
          <div className="space-y-5">
            {LISTEN_CHOOSE.map((item, qi) => (
              <div key={qi}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-zinc-500">Câu {qi + 1}</span>
                  <button
                    onClick={() => playTTS(item.audio_text)}
                    aria-label="Nghe câu"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 text-xs hover:bg-emerald-600/30 transition-colors"
                  >
                    <Volume2 size={12} /> Nghe
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.options.map((opt, oi) => {
                    const isSelected = lacAnswers[qi] === opt;
                    const isCorrect = opt === item.answer;
                    let cls =
                      "px-3 py-2 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer text-left ";
                    if (lacSubmitted) {
                      if (isCorrect) cls += "bg-emerald-600/20 border-emerald-500 text-emerald-300";
                      else if (isSelected) cls += "bg-red-600/20 border-red-500 text-red-300";
                      else cls += "bg-zinc-800/50 border-zinc-700 text-zinc-500";
                    } else {
                      cls += isSelected
                        ? "bg-emerald-600/30 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20"
                        : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:border-emerald-500/50 hover:bg-zinc-700/60 active:scale-95";
                    }
                    return (
                      <button
                        key={oi}
                        onClick={() =>
                          !lacSubmitted && setLacAnswers((p) => ({ ...p, [qi]: opt }))
                        }
                        className={cls}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {!lacSubmitted ? (
            <button
              onClick={() => {
                setLacSubmitted(true);
              }}
              disabled={Object.keys(lacAnswers).length < LISTEN_CHOOSE.length}
              className="mt-5 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl py-3 transition-all duration-200 shadow-md shadow-emerald-900/40 active:scale-95"
            >
              Kiểm tra đáp án
            </button>
          ) : (
            <div className="mt-4 p-4 bg-emerald-950/40 border border-emerald-700/40 rounded-xl text-center">
              <p className="text-emerald-300 font-bold text-lg">
                {lacScore}/{LISTEN_CHOOSE.length} đúng 🎯
              </p>
            </div>
          )}
        </div>
      )}

      {(!LISTEN_CHOOSE.length || lacSubmitted) && (
        <button
          onClick={goNext}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold rounded-2xl px-6 py-4 flex items-center justify-center gap-2 transition-all duration-200 text-lg shadow-lg shadow-emerald-900/40 active:scale-95"
        >
          Tiếp tục <ChevronRight size={20} />
        </button>
      )}
    </motion.div>
  );
}
