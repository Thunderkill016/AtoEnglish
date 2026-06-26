"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Mic,
  Sparkles,
  Volume2,
  MessageSquare,
  History,
  Calendar,
} from "lucide-react";
import {
  ListSection,
  PrimaryRow,
  SecondaryPageShell,
} from "@/components/design-system";
import { cn } from "@/lib/utils";
import { ShadowingPractice } from "./shadowing-practice";
import { AIRoleplay } from "./ai-roleplay";
import { JournalMode } from "./journal-mode";
import PhonemeChecker from "./phoneme-checker";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import { SpeakingSession } from "@/types/database";

export default function SpeakingPage() {
  const [activeTab, setActiveTab] = useState<"shadowing" | "roleplay" | "journal" | "phoneme">("shadowing");
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
    { id: "phoneme", title: "Phoneme Coach", icon: Sparkles, desc: "AI phân tích phát âm" },
  ] as const;

  return (
    <SecondaryPageShell
      title="Luyện nói"
      subtitle={`${speakingCount} buổi luyện gần đây`}
    >
      <div className="space-y-5 pb-16">
      <PrimaryRow
        href="/pronunciation"
        label="Luyện 44 âm IPA"
        description="Nghe · ghi âm · so sánh native"
        icon={Mic}
      />

      <ListSection title="Chế độ">
        <div className="flex gap-1 p-1 rounded-[var(--minimal-radius)] bg-muted/80 border border-border/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 min-h-[2.25rem] flex items-center justify-center gap-1.5 rounded-lg",
                "text-[var(--minimal-caption-size)] font-semibold transition-colors",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="size-3.5 shrink-0" />
              <span className="truncate">
                {tab.id === "shadowing" ? "Shadowing"
                  : tab.id === "roleplay" ? "Roleplay"
                  : tab.id === "journal" ? "Journal"
                  : "Phoneme"}
              </span>
            </button>
          );
        })}
        </div>
      </ListSection>

      {/* Tab Contents Workspace */}
      <div className="grid gap-5 sm:gap-8 lg:grid-cols-3 items-start">
        {/* Main interactive area */}
        <div className="lg:col-span-2 min-w-0 overflow-hidden">
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
              {activeTab === "phoneme" && <PhonemeChecker />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar details — hidden on mobile to keep focus on main activity */}
        <div className="hidden sm:block space-y-6">
          {/* Lợi ích của Shadowing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border/60 bg-card p-6 space-y-4"
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
            className="rounded-xl border border-border/60 bg-card p-6 space-y-4"
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
    </SecondaryPageShell>
  );
}
