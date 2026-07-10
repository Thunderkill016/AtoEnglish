"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mic,
  Volume2,
  MessageSquare,
  Calendar,
  Sparkles,
  ArrowRight,
  History,
} from "lucide-react";
import {
  Screen,
  Surface,
  AppButton,
  PageHeader,
  Chip,
} from "@/components/design-system";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import { SpeakingSession } from "@/types/database";
import { cn } from "@/lib/utils";

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
};

const MODES = [
  {
    href: "/speaking/shadowing",
    label: "Shadowing Practice",
    description: "Nói đuổi theo audio — luyện nhịp & phát âm",
    icon: Volume2,
    tone: "amber" as const,
  },
  {
    href: "/speaking/roleplay",
    label: "AI Roleplay",
    description: "Hội thoại nhập vai tình huống thực tế",
    icon: MessageSquare,
    tone: "violet" as const,
  },
  {
    href: "/speaking/journal",
    label: "Daily Journal",
    description: "Nhật ký nói tự do — phản xạ hàng ngày",
    icon: Calendar,
    tone: "teal" as const,
  },
  {
    href: "/speaking/phoneme",
    label: "Phoneme Coach",
    description: "Phân tích phát âm chi tiết (local VN L1)",
    icon: Sparkles,
    tone: "emerald" as const,
  },
] as const;

const TONE_ICON: Record<(typeof MODES)[number]["tone"], string> = {
  amber: "bg-amber-500/15 border-amber-500/25 text-amber-300",
  violet: "bg-violet-500/15 border-violet-500/25 text-violet-300",
  teal: "bg-teal-500/15 border-teal-500/25 text-teal-300",
  emerald: "bg-emerald-500/15 border-emerald-500/25 text-emerald-300",
};

export default function SpeakingClient() {
  const [historySessions, setHistorySessions] = useState<SpeakingSession[]>([]);
  const [guestLocal, setGuestLocal] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      const res = await getRecentSpeakingSessions(6);
      let sessions: SpeakingSession[] =
        res.success && res.sessions ? res.sessions : [];
      let fromGuest = false;
      if (sessions.length === 0 && typeof window !== "undefined") {
        try {
          const local = JSON.parse(
            localStorage.getItem("guest_speaking_sessions") || "[]",
          ) as SpeakingSession[];
          if (Array.isArray(local) && local.length) {
            sessions = local;
            fromGuest = true;
          }
        } catch {
          /* ignore corrupt local */
        }
      }
      setHistorySessions(sessions);
      setGuestLocal(fromGuest);
    }
    loadHistory();
  }, []);

  const count = historySessions.length;

  return (
    <Screen ato ambient>
      <motion.div {...fade} className="mb-6 space-y-3">
        <Chip tone="brand" className="tracking-widest">
          <Mic className="size-3.5" aria-hidden />
          Free speaking · không paywall
        </Chip>
        <PageHeader
          eyebrow="Luyện nói"
          title="Nói được — không chỉ thuộc"
          subtitle={
            count > 0
              ? `${count} buổi gần đây${guestLocal ? " (lưu trên máy — guest)" : ""}. Chọn một chế độ và nói to.`
              : "Shadowing, roleplay, journal — guest cũng luyện được; lịch sử lưu local."
          }
        />
      </motion.div>

      {/* Primary CTA row */}
      <motion.div
        {...fade}
        transition={{ ...fade.transition, delay: 0.05 }}
        className="mb-5"
      >
        <Surface
          variant="success"
          className="relative overflow-hidden border-emerald-500/30 bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-zinc-900/40 p-5"
        >
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-emerald-400/90">
            Bắt đầu nhanh
          </p>
          <p className="mb-4 text-sm text-zinc-300">
            Shadowing 5–10 phút mỗi ngày là cách bền vững nhất để cải thiện phát
            âm và nhịp nói.
          </p>
          <AppButton href="/speaking/shadowing" fullWidth size="lg">
            Vào Shadowing
            <ArrowRight className="size-4" aria-hidden />
          </AppButton>
        </Surface>
      </motion.div>

      {/* IPA shortcut */}
      <motion.div
        {...fade}
        transition={{ ...fade.transition, delay: 0.08 }}
        className="mb-6"
      >
        <Surface variant="interactive" className="p-0">
          <Link
            href="/pronunciation"
            className="flex min-h-12 items-center gap-3 px-4 py-3"
            data-testid="speaking-ipa-link"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-200">
              <Mic className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-zinc-100">
                Luyện 44 âm IPA
              </span>
              <span className="block text-xs text-zinc-500">
                Nghe · ghi âm · so sánh native
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-zinc-500" aria-hidden />
          </Link>
        </Surface>
      </motion.div>

      {/* Mode cards */}
      <motion.section
        {...fade}
        transition={{ ...fade.transition, delay: 0.12 }}
        className="mb-8 space-y-3"
        aria-label="Chế độ luyện nói"
      >
        <h2 className="text-sm font-bold text-zinc-200">Chế độ luyện nói</h2>
        <ul className="space-y-2">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <li key={mode.href}>
                <Surface variant="interactive" className="p-0">
                  <Link
                    href={mode.href}
                    className="flex min-h-14 items-center gap-3 px-4 py-3"
                    data-testid={`speaking-mode-${mode.href.split("/").pop()}`}
                  >
                    <span
                      className={cn(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl border",
                        TONE_ICON[mode.tone],
                      )}
                    >
                      <Icon className="size-4" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-zinc-50">
                        {mode.label}
                      </span>
                      <span className="block text-xs text-zinc-500">
                        {mode.description}
                      </span>
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-zinc-500"
                      aria-hidden
                    />
                  </Link>
                </Surface>
              </li>
            );
          })}
        </ul>
      </motion.section>

      {/* Recent history — auth DB or guest localStorage */}
      {historySessions.length > 0 && (
        <motion.section
          {...fade}
          transition={{ ...fade.transition, delay: 0.16 }}
          className="space-y-3 pb-8"
          data-testid="speaking-history"
        >
          <div className="flex items-center gap-2">
            <History className="size-4 text-emerald-400" aria-hidden />
            <h2 className="text-sm font-bold text-zinc-200">Gần đây</h2>
            {guestLocal && (
              <Chip tone="neutral" className="normal-case tracking-normal">
                Guest · máy này
              </Chip>
            )}
          </div>
          <ul className="space-y-2">
            {historySessions.slice(0, 5).map((session) => (
              <li key={session.id}>
                <Surface className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "shrink-0 rounded-md border px-1.5 py-0.5 text-[9px] font-extrabold uppercase",
                        session.practice_type === "shadowing"
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : session.practice_type === "roleplay"
                            ? "border-violet-500/30 bg-violet-500/10 text-violet-300"
                            : "border-teal-500/30 bg-teal-500/10 text-teal-300",
                      )}
                    >
                      {session.practice_type}
                    </span>
                    <span className="truncate text-[11px] text-zinc-500">
                      {new Date(session.created_at).toLocaleDateString("vi-VN", {
                        month: "numeric",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {session.accuracy_score !== null &&
                    session.accuracy_score !== undefined && (
                      <span className="shrink-0 font-mono text-sm font-black text-emerald-400">
                        {session.accuracy_score}%
                      </span>
                    )}
                </Surface>
              </li>
            ))}
          </ul>
        </motion.section>
      )}

      {historySessions.length === 0 && (
        <motion.div
          {...fade}
          transition={{ ...fade.transition, delay: 0.16 }}
          className="pb-10"
        >
          <Surface className="p-5 text-center">
            <p className="text-sm text-zinc-400">
              Chưa có buổi luyện. Bấm Shadowing hoặc Roleplay — guest cũng lưu
              lịch sử trên máy này.
            </p>
            <AppButton
              href="/speaking/shadowing"
              variant="secondary"
              className="mt-4"
              size="sm"
            >
              Thử Shadowing
            </AppButton>
          </Surface>
        </motion.div>
      )}
    </Screen>
  );
}
