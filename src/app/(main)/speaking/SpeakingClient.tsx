"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Sparkles,
  Volume2,
  MessageSquare,
  History,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { ShadowingPractice } from "./shadowing-practice";
import { AIRoleplay } from "./ai-roleplay";
import { JournalMode } from "./journal-mode";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import { SpeakingSession } from "@/types/database";

export default function SpeakingPage() {
  const [activeTab, setActiveTab] = useState<"shadowing" | "roleplay" | "journal">("shadowing");
  const [historySessions, setHistorySessions] = useState<SpeakingSession[]>([]);
  const [speakingCount, setSpeakingCount] = useState<number>(0);

  useEffect(() => {
    async function loadHistory() {
      const res = await getRecentSpeakingSessions(6);
      if (res.success && res.sessions) {
        setHistorySessions(res.sessions);
        setSpeakingCount(res.sessions.length);
      }
    }
    loadHistory();
  }, []); // Chỉ fetch 1 lần khi mount, không refetch mỗi lần đổi tab

  const tabs = [
    { id: "shadowing", title: "Shadowing Practice", icon: Volume2, desc: "Nói đuổi theo audio" },
    { id: "roleplay", title: "AI Roleplay", icon: MessageSquare, desc: "Hội thoại nhập vai" },
    { id: "journal", title: "Daily Journal", icon: Calendar, desc: "Nhật ký nói tự do" },
  ] as const;

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8 space-y-5 sm:space-y-8 bg-grid-pattern min-h-screen pb-28 sm:pb-12">
      {/* Background ambient blurs */}
      <div className="absolute top-10 left-10 -z-10 h-96 w-[70vw] max-w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-20 right-10 -z-10 h-96 w-[70vw] max-w-96 rounded-full bg-violet-500/5 blur-3xl" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-foreground/[0.05]"
      >
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Mic className="size-3.5" />
            Speaking Module
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground mt-1 leading-tight">
            Luyện Nói Phản Xạ
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-normal">
            Làm chủ ngữ điệu bản xứ qua kỹ thuật Shadowing và hội thoại thông minh AI.
          </p>
        </div>

        {/* Stats card */}
        <div className="w-full sm:w-64 bg-glass border border-glass p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground font-bold">Lịch sử gần nhất</span>
            <div className="text-xl font-bold text-foreground">{speakingCount} buổi luyện</div>
          </div>
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TrendingUp className="size-5" />
          </span>
        </div>
      </motion.div>

      {/* Stepper Tabs — horizontal scroll on mobile, grid on md+ */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none md:overflow-visible md:bg-glass md:border md:border-glass md:p-1.5 md:rounded-2xl md:gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative overflow-hidden select-none
                md:flex-1 md:min-w-0 md:text-left md:p-3
                ${
                  isActive
                    ? "bg-primary/10 border border-primary/30 text-primary"
                    : "bg-glass border border-glass text-muted-foreground hover:text-foreground"
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeSpeakingTab"
                  className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-xl md:block hidden"
                  transition={{ type: "spring", stiffness: 130, damping: 19 }}
                />
              )}
              <span className={`relative z-10 flex size-7 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="size-4" />
              </span>
              <div className="relative z-10 min-w-0">
                <span className="block font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                  {tab.id === "shadowing" ? "Shadowing" : tab.id === "roleplay" ? "Roleplay" : "Journal"}
                </span>
                <span className="hidden md:block text-[10px] text-muted-foreground font-normal truncate">
                  {tab.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Contents Workspace */}
      <div className="grid gap-5 sm:gap-8 lg:grid-cols-3 items-start">
        {/* Main interactive area */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === "shadowing" && <ShadowingPractice />}
              {activeTab === "roleplay" && <AIRoleplay />}
              {activeTab === "journal" && <JournalMode />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar details — hidden on mobile to keep focus on main activity */}
        <div className="hidden sm:block space-y-6">
          {/* Lợi ích của Shadowing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-glass bg-glass p-6 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
          >
            <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">
              Kỹ thuật Shadowing là gì?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
              <strong>Shadowing (Nói đuổi)</strong> là kỹ thuật bắt chước y hệt giọng nói của người bản xứ ngay lập tức khi bạn nghe thấy họ nói. Bạn sẽ bắt chước từ ngữ âm, ngữ điệu, cách ngắt nghỉ đến tốc độ nói.
            </p>
            <div className="text-xs text-primary bg-primary/5 border border-primary/10 p-4 rounded-2xl flex items-start gap-2.5 leading-relaxed font-normal">
              <Sparkles className="size-5 shrink-0 mt-0.5 text-primary animate-pulse" />
              <span>Shadowing giúp hình thành liên kết cơ miệng phản xạ tự nhiên (muscle memory) và sửa phát âm cực nhanh.</span>
            </div>
          </motion.div>

          {/* Lịch sử nói gần đây */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-glass bg-glass p-6 space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.01)]"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-foreground uppercase tracking-widest">
                Lịch sử luyện tập
              </h3>
              <History className="size-4 text-muted-foreground" />
            </div>

            {historySessions.length === 0 ? (
              <div className="text-xs text-center py-8 text-muted-foreground border border-dashed border-foreground/10 rounded-2xl bg-foreground/[0.01]">
                Chưa có lịch sử luyện tập nào được ghi nhận.
              </div>
            ) : (
              <div className="space-y-3">
                {historySessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-3 rounded-2xl bg-foreground/[0.01] border border-foreground/[0.04] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 text-left w-full">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase ${
                          session.practice_type === "shadowing"
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                            : "bg-violet-500/10 text-violet-600 border border-violet-500/20"
                        }`}>
                          {session.practice_type}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(session.created_at).toLocaleDateString("vi-VN", {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {session.transcript && (
                        <p className="text-muted-foreground font-normal line-clamp-1 max-w-[150px] mt-1">
                          &quot;{session.transcript}&quot;
                        </p>
                      )}
                    </div>
                    
                    {session.accuracy_score !== null && (
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono shrink-0">
                        {session.accuracy_score}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
