"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, Play, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  RealTalkVideo,
  TranscriptSegment,
  VocabItem,
  FocusPoint,
} from "@/types/real-talk";

// Global types for YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YouTubePlayerProps {
  video: RealTalkVideo;
  transcript: TranscriptSegment[];
  vocabulary?: VocabItem[];
  focusPoints?: FocusPoint[];
  mode?: "gist" | "detail" | "focus" | "free";
  onSegmentChange?: (index: number) => void;
  className?: string;
}

export function YouTubePlayer({
  video,
  transcript,
  vocabulary = [],
  focusPoints = [],
  mode = "free",
  onSegmentChange,
  className,
}: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopSegment, setLoopSegment] = useState(false);
  const [subtitlesMode, setSubtitlesMode] = useState<
    "both" | "en" | "vi" | "off"
  >("both");

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout | null>(null);

  // Load YT API script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        // Synchronizing script load status from external YouTube API
        setIsScriptLoaded(true);
      };
    } else if (window.YT && window.YT.Player) {
      // Synchronizing script load status from external YouTube API
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsScriptLoaded(true);
    }
  }, []);

  // Time tracking helpers (using refs for stability)
  const clearTimeTracking = () => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
      timeUpdateInterval.current = null;
    }
  };

  const startTimeTracking = () => {
    clearTimeTracking();
    timeUpdateInterval.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
      }
    }, 250);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeTracking();
  }, []);

  const [playerEngine, setPlayerEngine] = useState<"api" | "direct">("api");

  // Initialize Player when clicked
  const initPlayer = useCallback(() => {
    if (playerEngine !== "api") return;
    if (!isScriptLoaded || !window.YT) {
      // If API not loaded yet, switch directly to standard embed
      setPlayerEngine("direct");
      setIsPlaying(true);
      return;
    }

    setIsPlaying(true);

    try {
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: video.youtubeId,
        host: "https://www.youtube.com",
        playerVars: {
          autoplay: 1,
          modestbranding: 1,
          rel: 0,
          fs: 1,
          start: Math.floor(video.segment.startSeconds),
          end: Math.floor(video.segment.endSeconds),
          playsinline: 1,
        },
        events: {
          onReady: (event: any) => {
            event.target.setPlaybackRate(playbackRate);
            startTimeTracking();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTimeTracking();
            } else {
              clearTimeTracking();
            }
          },
          onError: (event: any) => {
            console.warn(
              "[YouTubePlayer] Primary API embed error code:",
              event.data,
            );
            clearTimeTracking();
            // A direct YouTube embed is the only compliant fallback. Proxying a
            // YouTube player can bypass its playback and policy controls.
            setPlayerEngine("direct");
          },
        },
      });
    } catch {
      setPlayerEngine("direct");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScriptLoaded, video, playbackRate, playerEngine]);

  // Update active segment based on current time
  useEffect(() => {
    if (transcript.length === 0) return;

    const currentIndex = transcript.findIndex(
      (seg) => currentTime >= seg.startTime && currentTime <= seg.endTime,
    );

    if (currentIndex !== -1 && currentIndex !== activeSegmentIndex) {
      // Synchronizing state from YouTube IFrame API (external system)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveSegmentIndex(currentIndex);
      onSegmentChange?.(currentIndex);
    }

    // Handle segment looping
    if (loopSegment && activeSegmentIndex !== -1) {
      const activeSeg = transcript[activeSegmentIndex];
      if (currentTime >= activeSeg.endTime - 0.2) {
        playerRef.current?.seekTo(activeSeg.startTime, true);
      }
    }
  }, [
    currentTime,
    transcript,
    activeSegmentIndex,
    loopSegment,
    onSegmentChange,
  ]);

  const seekTo = (seconds: number) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(seconds, true);
      playerRef.current.playVideo();
    }
  };

  const toggleLoop = () => {
    setLoopSegment(!loopSegment);
  };

  const changePlaybackRate = () => {
    const rates = [1, 0.75, 1.25];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    const newRate = rates[nextIdx];
    setPlaybackRate(newRate);
    playerRef.current?.setPlaybackRate(newRate);
  };

  const activeSegment = transcript[activeSegmentIndex];
  const activeSpeaker = activeSegment
    ? video.speakers.find((s) => s.label === activeSegment.speaker)
    : null;

  // Determine if subtitles should be shown based on mode
  const showSubtitles =
    mode !== "gist" && subtitlesMode !== "off" && activeSegment;

  // Highlight vocabulary helper
  const renderTextWithVocab = (text: string) => {
    if (!vocabulary.length) return text;
    const sortedVocab = [...vocabulary].sort(
      (a, b) => b.word.length - a.word.length,
    );
    const escapedWords = sortedVocab.map((v) =>
      v.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    const regex = new RegExp(`\\b(${escapedWords.join("|")})\\b`, "gi");

    const parts = text.split(regex);

    return parts.map((part, i) => {
      const vocabItem = sortedVocab.find(
        (v) => v.word.toLowerCase() === part.toLowerCase(),
      );
      if (vocabItem) {
        return (
          <span
            key={i}
            className="text-emerald-400 font-semibold border-b border-emerald-400/50 cursor-help"
            title={vocabItem.meaningVi}
            onClick={(e) => {
              e.stopPropagation();
              // In a real app, this might open a vocab definition modal
            }}
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/60",
        className,
      )}
    >
      {/* Player Header / Controls Overlay (external to iframe) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60 bg-zinc-950/60">
        <div className="flex items-center gap-3">
          <button
            onClick={changePlaybackRate}
            className="text-xs font-bold px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-zinc-100 transition-colors"
            title="Playback Speed"
          >
            {playbackRate}x
          </button>

          <button
            onClick={toggleLoop}
            className={cn(
              "p-1.5 rounded transition-colors",
              loopSegment
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200",
            )}
            title="Loop current segment"
          >
            <Repeat size={16} />
          </button>
        </div>

        {mode !== "gist" && (
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800/50">
            {(["both", "en", "vi", "off"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setSubtitlesMode(m)}
                className={cn(
                  "px-2 py-1 rounded-md text-xs font-medium transition-all capitalize",
                  subtitlesMode === m
                    ? "bg-zinc-700 text-zinc-100 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Video Area */}
      <div className="relative aspect-video bg-zinc-950 flex flex-col overflow-hidden">
        {playerEngine === "direct" ? (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&start=${Math.floor(video.segment.startSeconds)}&end=${Math.floor(video.segment.endSeconds)}&rel=0&modestbranding=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full border-0 z-10"
            onError={() => setPlayerEngine("api")}
          />
        ) : !isPlaying ? (
          <button
            onClick={initPlayer}
            className="absolute inset-0 w-full h-full group z-10"
            aria-label="Phát video"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-zinc-950/40 group-hover:bg-zinc-950/20 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-900/40 group-hover:scale-110 transition-transform">
                <Play className="size-7 text-white ml-1" fill="currentColor" />
              </div>
            </div>
          </button>
        ) : null}

        {/* The YouTube Iframe Container */}
        <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Subtitle / Focus Point Display Area (Below video) */}
      <div className="relative min-h-[120px] bg-zinc-950 p-4 border-t border-zinc-800/60 flex flex-col justify-center items-center text-center">
        <AnimatePresence mode="wait">
          {mode === "gist" ? (
            <motion.div
              key="gist-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-zinc-500 text-sm flex items-center gap-2"
            >
              <Info size={16} className="text-emerald-500" />
              Xem video và nắm ý chính. Phụ đề đã được ẩn.
            </motion.div>
          ) : showSubtitles ? (
            <motion.div
              key={`seg-${activeSegment.index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl mx-auto"
            >
              {/* Speaker Label */}
              <div
                className="inline-block text-[11px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md mb-2"
                style={{
                  backgroundColor: activeSpeaker
                    ? `${activeSpeaker.color}15`
                    : "#3f3f46",
                  color: activeSpeaker ? activeSpeaker.color : "#a1a1aa",
                }}
              >
                {activeSegment.speaker}
              </div>

              {/* Subtitles */}
              <div
                className="space-y-2 cursor-pointer"
                onClick={() => seekTo(activeSegment.startTime)}
              >
                {(subtitlesMode === "en" || subtitlesMode === "both") && (
                  <p className="text-xl md:text-2xl font-semibold text-white leading-snug">
                    {mode === "focus"
                      ? /* If focus mode, we might highlight specific points, but renderTextWithVocab is safe */ renderTextWithVocab(
                          activeSegment.textEn,
                        )
                      : renderTextWithVocab(activeSegment.textEn)}
                  </p>
                )}

                {(subtitlesMode === "vi" || subtitlesMode === "both") && (
                  <p className="text-sm md:text-base text-zinc-400">
                    {activeSegment.textVi}
                  </p>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="no-subtitles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-zinc-600 text-sm italic"
            >
              {isPlaying ? "..." : "Nhấn Play để bắt đầu"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
