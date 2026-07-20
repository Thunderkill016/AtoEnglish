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
import { Screen, PageHeader, AppButton } from "@/components/design-system";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import { SpeakingSession } from "@/types/database";
import { cn } from "@/lib/utils";

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
};

const MODES = [
  {
    href: "/speaking/shadowing",
    label: "Shadowing",
    description: "Nói đuổi theo audio — nhịp & phát âm",
    icon: Volume2,
  },
  {
    href: "/speaking/roleplay",
    label: "Roleplay",
    description: "Hội thoại tình huống thực tế",
    icon: MessageSquare,
  },
  {
    href: "/speaking/journal",
    label: "Journal",
    description: "Nhật ký nói tự do mỗi ngày",
    icon: Calendar,
  },
  {
    href: "/speaking/phoneme",
    label: "Phoneme",
    description: "Phân tích lỗi phát âm VN",
    icon: Sparkles,
  },
] as const;

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
          /* ignore */
        }
      }
      setHistorySessions(sessions);
      setGuestLocal(fromGuest);
    }
    loadHistory();
  }, []);

  const count = historySessions.length;

  return (
    <Screen ambient>
      <motion.div {...fade} className="mb-6 space-y-3">
        <Badge variant="secondary" className="gap-1.5">
          <Mic className="size-3" aria-hidden />
          Luyện nói
        </Badge>
        <PageHeader
          eyebrow="Nói được"
          title="Luyện nói hàng ngày"
          subtitle={
            count > 0
              ? `${count} buổi gần đây${guestLocal ? " (máy này · guest)" : ""}. Chọn một chế độ và nói to.`
              : "Shadowing · roleplay · journal — guest cũng luyện được."
          }
        />
      </motion.div>

      <motion.div
        {...fade}
        transition={{ ...fade.transition, delay: 0.04 }}
        className="mb-4"
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bắt đầu nhanh</CardTitle>
            <CardDescription>
              Shadowing 5–10 phút/ngày là cách bền vững để cải thiện phát âm.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppButton href="/speaking/shadowing" fullWidth size="lg">
              Vào Shadowing
              <ArrowRight className="size-4" aria-hidden />
            </AppButton>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        {...fade}
        transition={{ ...fade.transition, delay: 0.06 }}
        className="mb-6"
      >
        <Link href="/pronunciation" className="block group">
          <Card
            size="sm"
            className="transition group-hover:bg-muted/40"
            data-testid="speaking-ipa-link"
          >
            <CardContent className="flex min-h-12 items-center gap-3 py-3">
              <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
                <Mic className="size-4" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium">Luyện 44 âm IPA</span>
                <span className="block text-xs text-muted-foreground">
                  Nghe · ghi âm · so sánh
                </span>
              </span>
              <ArrowRight className="size-4 text-muted-foreground" aria-hidden />
            </CardContent>
          </Card>
        </Link>
      </motion.div>

      <motion.section
        {...fade}
        transition={{ ...fade.transition, delay: 0.1 }}
        className="mb-8 space-y-3"
        aria-label="Chế độ luyện nói"
      >
        <h2 className="text-sm font-semibold text-foreground">Chế độ</h2>
        <ul className="space-y-2">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <li key={mode.href}>
                <Link
                  href={mode.href}
                  className="block group"
                  data-testid={`speaking-mode-${mode.href.split("/").pop()}`}
                >
                  <Card size="sm" className="transition group-hover:bg-muted/40">
                    <CardContent className="flex min-h-14 items-center gap-3 py-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium text-foreground">
                          {mode.label}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {mode.description}
                        </span>
                      </span>
                      <ArrowRight
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden
                      />
                    </CardContent>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      </motion.section>

      {historySessions.length > 0 ? (
        <motion.section
          {...fade}
          transition={{ ...fade.transition, delay: 0.12 }}
          className="space-y-3 pb-8"
          data-testid="speaking-history"
        >
          <div className="flex items-center gap-2">
            <History className="size-4 text-primary" aria-hidden />
            <h2 className="text-sm font-semibold">Gần đây</h2>
            {guestLocal ? (
              <Badge variant="outline">Guest · máy này</Badge>
            ) : null}
          </div>
          <ul className="space-y-2">
            {historySessions.slice(0, 5).map((session) => (
              <li key={session.id}>
                <Card size="sm">
                  <CardContent className="flex items-center justify-between gap-3 py-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <Badge variant="secondary" className="uppercase">
                        {session.practice_type}
                      </Badge>
                      <span className="truncate text-xs text-muted-foreground">
                        {new Date(session.created_at).toLocaleDateString(
                          "vi-VN",
                          {
                            month: "numeric",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    {session.accuracy_score != null && (
                      <span
                        className={cn(
                          "shrink-0 font-mono text-sm font-semibold text-primary",
                        )}
                      >
                        {session.accuracy_score}%
                      </span>
                    )}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </motion.section>
      ) : (
        <motion.div
          {...fade}
          transition={{ ...fade.transition, delay: 0.12 }}
          className="pb-10"
        >
          <Card>
            <CardContent className="space-y-3 py-6 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có buổi luyện. Bắt đầu Shadowing — guest cũng lưu trên máy
                này.
              </p>
              <AppButton
                href="/speaking/shadowing"
                variant="secondary"
                size="sm"
              >
                Thử Shadowing
              </AppButton>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </Screen>
  );
}
