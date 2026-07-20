"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Page, PageHeader, Section } from "@/components/ui/page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getRecentSpeakingSessions } from "@/app/actions/speaking";
import type { SpeakingSession } from "@/types/database";

const MODES = [
  {
    href: "/speaking/shadowing",
    label: "Shadowing",
    desc: "Nói theo audio — phát âm & nhịp",
  },
  {
    href: "/speaking/roleplay",
    label: "Roleplay",
    desc: "Tình huống giao tiếp",
  },
  {
    href: "/speaking/journal",
    label: "Journal",
    desc: "Nói tự do mỗi ngày",
  },
  {
    href: "/speaking/phoneme",
    label: "Phoneme",
    desc: "Lỗi phát âm tiếng Việt",
  },
] as const;

export default function SpeakingClient() {
  const [sessions, setSessions] = useState<SpeakingSession[]>([]);
  const [guest, setGuest] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await getRecentSpeakingSessions(6);
      let list: SpeakingSession[] =
        res.success && res.sessions ? res.sessions : [];
      let fromGuest = false;
      if (!list.length && typeof window !== "undefined") {
        try {
          const local = JSON.parse(
            localStorage.getItem("guest_speaking_sessions") || "[]",
          ) as SpeakingSession[];
          if (Array.isArray(local) && local.length) {
            list = local;
            fromGuest = true;
          }
        } catch {
          /* ignore */
        }
      }
      setSessions(list);
      setGuest(fromGuest);
    })();
  }, []);

  return (
    <Page>
      <PageHeader
       description={
          sessions.length
            ? `${sessions.length} buổi gần đây${guest ? " (máy này)" : ""}.`
            : "Chọn một chế độ và nói to. Guest cũng luyện được."
        }
      />

      <Card className="mb-6">
        <CardContent className="space-y-3 pt-5">
          <p className="text-sm text-muted-foreground">
            Gợi ý: Shadowing 5–10 phút mỗi ngày.
          </p>
          <Link
            href="/speaking/shadowing"
            className={cn(buttonVariants({ size: "lg" }), "w-full")}
          >
            Bắt đầu Shadowing
          </Link>
        </CardContent>
      </Card>

      <Section>
        <div className="space-y-2">
          {MODES.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-3 transition-colors hover:bg-muted/40"
              data-testid={`speaking-mode-${m.href.split("/").pop()}`}
            >
              <span>
                <span className="block text-sm font-medium">{m.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {m.desc}
                </span>
              </span>
              <span className="text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        {sessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có buổi luyện.</p>
        ) : (
          <ul className="space-y-2" data-testid="speaking-history">
            {sessions.slice(0, 5).map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{s.practice_type}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                {s.accuracy_score != null ? (
                  <span className="font-mono text-sm tabular-nums">
                    {s.accuracy_score}%
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Link
        href="/pronunciation"
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
        data-testid="speaking-ipa-link"
      >
        Luyện 44 âm IPA
      </Link>
    </Page>
  );
}
