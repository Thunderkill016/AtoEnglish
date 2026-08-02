"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Play, Clock, Users, Sparkles, Filter, Tv } from "lucide-react";

import type { RealTalkVideo } from "@/types/real-talk";

// ─── Level badge colors ──────────────────────────────────────────────────────

const LEVEL_STYLES: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  A0: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  A1: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  A2: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  B1: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  B2: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
};

// ─── Topic labels in Vietnamese ──────────────────────────────────────────────

const TOPIC_LABELS: Record<string, string> = {
  hobbies: "🎯 Sở thích",
  free_time: "⏰ Thời gian rảnh",
  daily_life: "🏠 Đời sống",
  introductions: "👋 Giới thiệu",
  food: "🍕 Ăn uống",
  travel: "✈️ Du lịch",
  work: "💼 Công việc",
  shopping: "🛒 Mua sắm",
  health: "🏋️ Sức khỏe",
  culture: "🎭 Văn hóa",
};

// ─── Format duration ─────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// ─── Video Card ──────────────────────────────────────────────────────────────

function VideoCard({ video, index }: { video: RealTalkVideo; index: number }) {
  const level = LEVEL_STYLES[video.level] ?? LEVEL_STYLES.A1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
    >
      <Link
        href={`/real-talk/${video.id}`}
        className="group block rounded-2xl border border-zinc-800/60 bg-zinc-900/60 backdrop-blur-sm overflow-hidden hover:border-teal-500/40 hover:bg-zinc-800/60 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-zinc-950 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 bg-zinc-950/30 group-hover:bg-zinc-950/10 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-teal-500/90 shadow-xl shadow-teal-900/40 group-hover:scale-110 group-hover:bg-teal-400 transition-all duration-300">
              <Play size={24} className="text-white ml-0.5" fill="white" />
            </div>
          </div>
          {/* Duration badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-sm text-xs font-bold text-zinc-200">
            <Clock size={10} />
            {formatDuration(
              video.segment.endSeconds - video.segment.startSeconds,
            )}
          </div>
          {/* Level badge */}
          <div
            className={`absolute top-2 left-2 px-2.5 py-1 rounded-lg ${level.bg} ${level.border} border backdrop-blur-sm`}
          >
            <span className={`text-xs font-black ${level.text}`}>
              {video.level}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-teal-300 transition-colors">
            {video.titleVi}
          </h3>
          <p className="text-xs text-zinc-500 mb-3 line-clamp-1">
            {video.channelName} • {video.title}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {video.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-[10px] font-medium text-zinc-400"
              >
                {TOPIC_LABELS[topic] ?? topic}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <Users size={12} />
              <span>{video.speakerCount} người nói</span>
            </div>
            <span className="text-xs font-bold text-teal-400 group-hover:text-teal-300 transition-colors">
              Bắt đầu học →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Hub Component ─────────────────────────────────────────────────────

interface RealTalkHubProps {
  videos: RealTalkVideo[];
}

export default function RealTalkHub({ videos }: RealTalkHubProps) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | null>(null);

  const filteredVideos = videos.filter((v) => {
    const matchesSearch =
      !search ||
      v.titleVi.toLowerCase().includes(search.toLowerCase()) ||
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.topics.some((t) => t.includes(search.toLowerCase()));
    const matchesLevel = !levelFilter || v.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const levels = [...new Set(videos.map((v) => v.level))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-teal-950/20">
      <div className="max-w-3xl mx-auto px-4 py-8 pb-24">
        {/* ── Hero Section ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-4">
            <Tv size={14} className="text-teal-400" />
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
              Real Talk
            </span>
            <Sparkles size={12} className="text-teal-400" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Học từ cuộc trò chuyện{" "}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              thực tế
            </span>
          </h1>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Xem video trò chuyện thật từ YouTube, hiểu từng câu, học từ vựng
            mới, và luyện nói theo người bản xứ.
          </p>
        </motion.div>

        {/* ── Search & Filter ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm video theo chủ đề..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/40 transition-all"
            />
          </div>

          {/* Level filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-zinc-500 shrink-0" />
            <div className="flex gap-1.5">
              <button
                onClick={() => setLevelFilter(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  !levelFilter
                    ? "bg-teal-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                }`}
              >
                Tất cả
              </button>
              {levels.map((level) => {
                const style = LEVEL_STYLES[level] ?? LEVEL_STYLES.A1;
                return (
                  <button
                    key={level}
                    onClick={() =>
                      setLevelFilter(levelFilter === level ? null : level)
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      levelFilter === level
                        ? `${style.bg} ${style.text} ${style.border}`
                        : "bg-zinc-800 text-zinc-400 border-transparent hover:bg-zinc-700"
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {[
            {
              step: "1",
              emoji: "📖",
              title: "Chuẩn bị",
              desc: "Học từ vựng trước khi xem",
            },
            {
              step: "2",
              emoji: "🎬",
              title: "Xem video",
              desc: "Nghe hiểu với phụ đề 2 ngôn ngữ",
            },
            {
              step: "3",
              emoji: "🗣️",
              title: "Luyện tập",
              desc: "Quiz, điền từ, nói theo",
            },
          ].map(({ step, emoji, title, desc }) => (
            <div
              key={step}
              className="flex flex-col items-center gap-1.5 text-center p-3 rounded-2xl bg-zinc-800/40 border border-zinc-700/30"
            >
              <span className="text-xl">{emoji}</span>
              <span className="text-xs font-black text-zinc-200">{title}</span>
              <span className="text-[10px] text-zinc-500 leading-tight">
                {desc}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Video Grid ───────────────────────────────────────────────── */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredVideos.map((video, i) => (
              <VideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg mb-2">🔍</p>
            <p className="text-sm text-zinc-400">
              Không tìm thấy video phù hợp.
            </p>
          </div>
        )}

        {/* ── Coming soon placeholder ──────────────────────────────────── */}
        {filteredVideos.length > 0 && filteredVideos.length < 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center py-8 rounded-2xl border border-dashed border-zinc-700/50"
          >
            <Sparkles size={24} className="text-zinc-600 mx-auto mb-2" />
            <p className="text-sm text-zinc-500 font-medium">
              Thêm video đang được chuẩn bị...
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              Chúng tôi đang chọn lọc các cuộc trò chuyện thực tế hay nhất cho
              bạn
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
