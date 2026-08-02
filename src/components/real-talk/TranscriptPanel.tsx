"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Languages, Type, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  TranscriptSegment,
  SpeakerInfo,
  VocabItem,
} from "@/types/real-talk";

interface TranscriptPanelProps {
  transcript: TranscriptSegment[];
  speakers: SpeakerInfo[];
  activeSegmentIndex: number;
  vocabulary?: VocabItem[];
  showMode: "en" | "vi" | "both";
  onSegmentClick: (index: number) => void;
  onShowModeChange: (mode: "en" | "vi" | "both") => void;
  className?: string;
}

export function TranscriptPanel({
  transcript,
  speakers,
  activeSegmentIndex,
  vocabulary = [],
  showMode,
  onSegmentClick,
  onShowModeChange,
  className,
}: TranscriptPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const activeSegmentRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentRef.current && panelRef.current) {
      // Smooth scroll the panel so the active segment is roughly in the middle
      const panel = panelRef.current;
      const segment = activeSegmentRef.current;

      const panelHeight = panel.clientHeight;
      const segmentTop = segment.offsetTop;
      const segmentHeight = segment.clientHeight;

      // Calculate position to center the segment
      const scrollTop = segmentTop - panelHeight / 2 + segmentHeight / 2;

      panel.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: "smooth",
      });
    }
  }, [activeSegmentIndex]);

  // Helper to highlight vocabulary in text
  const renderTextWithVocab = (text: string) => {
    if (!vocabulary.length) return text;

    // Create a sorted array of vocab words (longest first to match correctly)
    const sortedVocab = [...vocabulary].sort(
      (a, b) => b.word.length - a.word.length,
    );

    // We'll split the text using a regex that matches any of the vocab words
    const escapedWords = sortedVocab.map((v) =>
      v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");

    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isVocab = sortedVocab.some(
        (v) => v.word.toLowerCase() === part.toLowerCase(),
      );
      if (isVocab) {
        return (
          <span
            key={i}
            className="font-semibold text-emerald-400 bg-emerald-500/10 rounded px-1 -mx-1 cursor-help transition-colors hover:bg-emerald-500/20"
            title={
              vocabulary.find(
                (v) => v.word.toLowerCase() === part.toLowerCase(),
              )?.meaningVi
            }
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  const getSpeakerColor = (speakerLabel: string) => {
    const speaker = speakers.find((s) => s.label === speakerLabel);
    return speaker?.color || "#9ca3af"; // Default zinc-400
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/60 rounded-2xl overflow-hidden",
        className,
      )}
    >
      {/* Header / Controls */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/40">
        <h3 className="font-bold text-sm text-zinc-200">Transcript</h3>

        {/* View Mode Toggles */}
        <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800/50">
          <button
            onClick={() => onShowModeChange("en")}
            className={cn(
              "p-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
              showMode === "en"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300",
            )}
            title="English Only"
          >
            <Type size={14} />
            <span className="hidden sm:inline">EN</span>
          </button>
          <button
            onClick={() => onShowModeChange("vi")}
            className={cn(
              "p-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
              showMode === "vi"
                ? "bg-zinc-800 text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300",
            )}
            title="Vietnamese Only"
          >
            <Globe size={14} />
            <span className="hidden sm:inline">VN</span>
          </button>
          <button
            onClick={() => onShowModeChange("both")}
            className={cn(
              "p-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5",
              showMode === "both"
                ? "bg-emerald-500/20 text-emerald-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-300",
            )}
            title="Bilingual"
          >
            <Languages size={14} />
            <span className="hidden sm:inline">Both</span>
          </button>
        </div>
      </div>

      {/* Transcript Segments */}
      <div
        ref={panelRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence initial={false}>
          {transcript.map((segment, index) => {
            const isActive = index === activeSegmentIndex;
            const speakerColor = getSpeakerColor(segment.speaker);

            return (
              <motion.button
                key={segment.index}
                ref={isActive ? activeSegmentRef : null}
                onClick={() => onSegmentClick(index)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all duration-300 relative group",
                  isActive
                    ? "bg-emerald-500/10 border-l-2 border-emerald-500 shadow-sm shadow-emerald-900/20"
                    : "hover:bg-zinc-800/40 border-l-2 border-transparent",
                )}
                whileHover={{ scale: 0.995 }}
                whileTap={{ scale: 0.99 }}
              >
                {/* Timestamp */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium text-zinc-500 bg-zinc-900/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {formatTime(segment.startTime)}
                </div>

                {/* Speaker Label */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-zinc-800"
                    style={{ color: speakerColor }}
                  >
                    {segment.speaker}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  {(showMode === "en" || showMode === "both") && (
                    <p
                      className={cn(
                        "text-sm leading-relaxed transition-colors",
                        isActive
                          ? "text-zinc-100 font-medium"
                          : "text-zinc-300",
                      )}
                    >
                      {renderTextWithVocab(segment.textEn)}
                    </p>
                  )}

                  {(showMode === "vi" || showMode === "both") && (
                    <p
                      className={cn(
                        "text-[13px] leading-relaxed transition-colors",
                        isActive ? "text-zinc-400" : "text-zinc-500",
                        showMode === "both" &&
                          "mt-1.5 border-t border-zinc-800/40 pt-1.5",
                      )}
                    >
                      {segment.textVi}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Helper for formatting mm:ss
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
