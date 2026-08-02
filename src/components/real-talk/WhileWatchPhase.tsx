"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, PlayCircle, Subtitles, Zap } from "lucide-react";
import type { RealTalkVideo, RealTalkLesson } from "@/types/real-talk";
import { cn } from "@/lib/utils";

interface WhileWatchPhaseProps {
  video: RealTalkVideo;
  lesson: RealTalkLesson;
  onComplete: () => void;
}

type WatchStep = "gist" | "detail" | "focus";

export default function WhileWatchPhase({
  video,
  lesson,
  onComplete,
}: WhileWatchPhaseProps) {
  const [step, setStep] = useState<WatchStep>("gist");
  const [gistSelected, setGistSelected] = useState<number | null>(null);
  const [gistSubmitted, setGistSubmitted] = useState(false);

  // Note: For actual implementation, this would embed a YouTube player or custom player.
  // We mock the player area for now, as requested to "render the YouTubePlayer component"
  // Assuming a generic placeholder or basic iframe for the moment, or just a box.

  const handleNext = () => {
    if (step === "gist") setStep("detail");
    else if (step === "detail") setStep("focus");
    else onComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-4">
        {[
          { id: "gist", icon: PlayCircle, label: "Xem hiểu ý chính" },
          { id: "detail", icon: Subtitles, label: "Xem chi tiết" },
          { id: "focus", icon: Zap, label: "Phân tích" },
        ].map((s, i) => {
          const isActive = step === s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors",
                  isActive
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-500",
                )}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
              {i < 2 && (
                <div className="w-4 sm:w-8 h-[1px] bg-zinc-800 mx-1 sm:mx-2" />
              )}
            </div>
          );
        })}
      </div>

      {/* Video Player Placeholder */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800/60 relative">
        <iframe
          className="w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          allowFullScreen
          title={video.title}
        />
        {/* If this were the real custom player, we'd pass mode={step} to toggle CCs, etc. */}
      </div>

      <AnimatePresence mode="wait">
        {step === "gist" && (
          <motion.div
            key="gist"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4">
                {lesson.whileWatch.gistQuestion.questionVi}
              </h3>
              <div className="space-y-3">
                {lesson.whileWatch.gistQuestion.options.map((option, idx) => {
                  const isSelected = gistSelected === idx;
                  const isCorrect =
                    idx === lesson.whileWatch.gistQuestion.correctIndex;
                  const showResult = gistSubmitted;

                  let btnClass =
                    "border-zinc-700 hover:bg-zinc-800 text-zinc-300";
                  if (isSelected && !showResult) {
                    btnClass = "border-blue-500 bg-blue-500/10 text-blue-400";
                  } else if (showResult) {
                    if (isCorrect)
                      btnClass =
                        "border-emerald-500 bg-emerald-500/20 text-emerald-400";
                    else if (isSelected)
                      btnClass = "border-red-500 bg-red-500/20 text-red-400";
                    else btnClass = "border-zinc-800 text-zinc-600 opacity-50";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !gistSubmitted && setGistSelected(idx)}
                      disabled={gistSubmitted}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border min-h-[44px] transition-all",
                        btnClass,
                      )}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {!gistSubmitted && gistSelected !== null && (
                <button
                  onClick={() => setGistSubmitted(true)}
                  className="w-full mt-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold transition-colors"
                >
                  Kiểm tra
                </button>
              )}
            </div>
            {gistSubmitted && (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
              >
                Tiếp tục: Xem chi tiết <ChevronRight size={20} />
              </button>
            )}
          </motion.div>
        )}

        {step === "detail" && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 text-center"
          >
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/60 p-6 backdrop-blur-xl">
              <p className="text-zinc-300">
                Hãy xem lại video với phụ đề song ngữ. Nhấn vào bất kỳ từ nào
                bạn không biết để xem nghĩa.
              </p>
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
            >
              Tiếp tục: Phân tích <ChevronRight size={20} />
            </button>
          </motion.div>
        )}

        {step === "focus" && (
          <motion.div
            key="focus"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white text-center">
                Phân tích điểm nổi bật
              </h3>
              {lesson.whileWatch.focusPoints.map((focus, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 backdrop-blur-xl"
                >
                  <div className="inline-block px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs font-bold uppercase mb-2">
                    {focus.type.replace("_", " ")}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">
                    {focus.pattern}
                  </h4>
                  <p className="text-sm text-zinc-300">{focus.explanationVi}</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleNext}
              className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
            >
              Làm bài tập <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
