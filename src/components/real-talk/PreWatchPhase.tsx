"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Volume2,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import type {
  RealTalkVideo,
  PreWatchContent,
  PreWatchVocab,
} from "@/types/real-talk";
import { cn } from "@/lib/utils";
import { saveRealTalkVocabToSRS } from "@/app/actions/real-talk-srs";

interface PreWatchPhaseProps {
  video: RealTalkVideo;
  content: PreWatchContent;
  onComplete: () => void;
}

export default function PreWatchPhase({
  video,
  content,
  onComplete,
}: PreWatchPhaseProps) {
  const [step, setStep] = useState<number>(0);
  const [flippedVocab, setFlippedVocab] = useState<Set<number>>(new Set());
  const [savedVocab, setSavedVocab] = useState<Set<number>>(new Set());
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [selectedPrediction, setSelectedPrediction] = useState<number | null>(
    null,
  );

  const handleSaveVocab = async (
    e: React.MouseEvent,
    vocab: PreWatchVocab,
    index: number,
  ) => {
    e.stopPropagation(); // prevent flipping card when clicking save button
    if (savedVocab.has(index) || savingIndex !== null) return;

    setSavingIndex(index);
    const res = await saveRealTalkVocabToSRS({
      vocab,
      videoTitle: video.title,
      level: video.level as "A0" | "A1" | "A2" | "B1" | "B2" | "C1",
    });

    setSavingIndex(null);
    if (res.success) {
      setSavedVocab((prev) => new Set(prev).add(index));
    }
  };
  const [predictionSubmitted, setPredictionSubmitted] = useState(false);

  const stepsCount = 4; // Context, Vocab, Prediction, SoundAlert

  const playTTS = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
  };

  const nextStep = () => {
    if (step < stepsCount - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onComplete();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="context"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 overflow-hidden backdrop-blur-xl">
              {/* YouTube Warm-up Video Player */}
              <div className="relative aspect-video bg-zinc-950">
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?start=${video.segment.startSeconds}&end=${video.segment.endSeconds}&autoplay=0&rel=0`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-teal-500/10 border border-teal-500/20 text-xs font-bold text-teal-400">
                    🎬 Bước 1/4: Xem lướt qua video (Warm-up)
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white">
                  {video.titleVi}
                </h2>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {content.contextVi}
                </p>
                <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10 text-xs text-teal-300">
                  💡 <strong>Mẹo học:</strong> Bấm Play để xem lướt qua video 1
                  lần (dài ~2-3 phút) để nắm bối cảnh trước khi học từ vựng!
                </div>
              </div>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-lg shadow-teal-900/30"
            >
              Tiếp tục: Học từ vựng cốt lõi
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="vocab"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-white">
                Từ vựng quan trọng
              </h2>
              <p className="text-zinc-400">
                Chạm vào thẻ để xem nghĩa và nghe phát âm
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {content.vocabulary.map((vocab, index) => {
                const isFlipped = flippedVocab.has(index);
                return (
                  <div
                    key={index}
                    className="relative perspective-1000 min-h-[160px] cursor-pointer"
                    onClick={() => {
                      const newFlipped = new Set(flippedVocab);
                      if (!isFlipped) {
                        newFlipped.add(index);
                        playTTS(vocab.word);
                      } else {
                        newFlipped.delete(index);
                      }
                      setFlippedVocab(newFlipped);
                    }}
                  >
                    <motion.div
                      className="w-full h-full preserve-3d"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-5 flex flex-col items-center justify-center text-center">
                        <span className="text-xl font-bold text-emerald-400 mb-2">
                          {vocab.word}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {vocab.phonetic}
                        </span>
                        <div className="absolute top-3 right-3 text-zinc-600">
                          <Volume2 size={16} />
                        </div>
                      </div>
                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden rounded-2xl border border-emerald-500/30 bg-emerald-950/30 backdrop-blur-xl p-5 flex flex-col items-center justify-center text-center [transform:rotateY(180deg)]">
                        <button
                          type="button"
                          onClick={(e) => handleSaveVocab(e, vocab, index)}
                          title={
                            savedVocab.has(index)
                              ? "Đã lưu vào SRS"
                              : "Lưu vào kho thẻ SRS"
                          }
                          className="absolute top-3 right-3 p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                        >
                          {savedVocab.has(index) ? (
                            <BookmarkCheck
                              size={16}
                              className="text-emerald-400"
                            />
                          ) : (
                            <Bookmark
                              size={16}
                              className="text-emerald-400/70"
                            />
                          )}
                        </button>
                        <span className="text-lg font-bold text-white mb-1">
                          {vocab.meaningVi}
                        </span>
                        <span className="text-xs text-emerald-200/70 italic mb-2">
                          &ldquo;{vocab.contextSentence}&rdquo;
                        </span>
                        {(vocab.pronunciationNote ||
                          vocab.l1InterferenceVn) && (
                          <div className="mt-auto pt-2 border-t border-emerald-800/30 w-full flex items-start gap-1.5 text-left">
                            <AlertTriangle
                              size={14}
                              className="text-amber-500 shrink-0 mt-0.5"
                            />
                            <span className="text-[10px] text-amber-200/80 leading-tight">
                              {vocab.l1InterferenceVn ||
                                vocab.pronunciationNote}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              Tiếp tục <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="prediction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                  <Lightbulb size={20} />
                </div>
                <h2 className="text-lg font-bold text-white">Dự đoán</h2>
              </div>
              <p className="text-zinc-300 mb-6">
                {content.prediction.questionVi}
              </p>
              <div className="space-y-3">
                {content.prediction.options.map((option, index) => {
                  const isSelected = selectedPrediction === index;
                  const isCorrect = index === content.prediction.correctIndex;
                  const showResult = predictionSubmitted;

                  let btnClass =
                    "border-zinc-700 hover:bg-zinc-800 text-zinc-300";
                  if (isSelected && !showResult) {
                    btnClass = "border-blue-500 bg-blue-500/10 text-blue-400";
                  } else if (showResult) {
                    if (isCorrect) {
                      btnClass =
                        "border-emerald-500 bg-emerald-500/20 text-emerald-400";
                    } else if (isSelected) {
                      btnClass = "border-red-500 bg-red-500/20 text-red-400";
                    } else {
                      btnClass = "border-zinc-800 text-zinc-600 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={index}
                      onClick={() =>
                        !predictionSubmitted && setSelectedPrediction(index)
                      }
                      disabled={predictionSubmitted}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between min-h-[44px]",
                        btnClass,
                      )}
                    >
                      <span>{option}</span>
                      {showResult && isCorrect && (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
              {!predictionSubmitted && selectedPrediction !== null && (
                <button
                  onClick={() => setPredictionSubmitted(true)}
                  className="w-full mt-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors min-h-[44px]"
                >
                  Kiểm tra
                </button>
              )}
            </div>
            {predictionSubmitted && (
              <button
                onClick={nextStep}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-colors min-h-[44px]"
              >
                Tiếp tục <ChevronRight size={20} />
              </button>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="sound-alert"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-2xl font-bold text-white">Chú ý phát âm</h2>
              <p className="text-zinc-400">Các âm thường bị sai</p>
            </div>
            <div className="space-y-4">
              {content.soundAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle size={18} className="text-amber-500" />
                    <h3 className="text-lg font-bold text-amber-400">
                      {alert.sound}
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-300 mb-3">
                    {alert.explanationVi}
                  </p>
                  <div className="bg-black/30 rounded-lg p-3 mb-3">
                    <p className="text-xs text-zinc-500 mb-1">Ví dụ:</p>
                    <div className="flex flex-wrap gap-2">
                      {alert.exampleWords.map((word, wIdx) => (
                        <span
                          key={wIdx}
                          className="text-sm text-emerald-300 bg-emerald-950/50 px-2 py-1 rounded"
                        >
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-red-300/80 italic">
                    ❌ Lỗi sai: {alert.commonMistakeVi}
                  </p>
                </div>
              ))}
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 transition-colors min-h-[44px]"
            >
              Bắt đầu xem video <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
