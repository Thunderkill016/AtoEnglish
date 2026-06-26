"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { SecondaryPageShell, ListSection, MinimalButton } from "@/components/design-system";

const BASE_URL = "https://atoenglish.vercel.app";

const REWARDS = [
  { icon: "🎯", title: "Học hiệu quả hơn", desc: "Học cùng bạn bè giúp tăng retention lên 40%" },
  { icon: "🔥", title: "Giữ streak cùng nhau", desc: "Nhắc nhở lẫn nhau để không mất streak" },
  { icon: "🏆", title: "Thi đua cùng nhau", desc: "Xem ai lên level nhanh hơn trên Leaderboard" },
];

const SHARE_MESSAGES = [
  {
    id: "general",
    label: "Giới thiệu chung",
    text: (_name: string, url: string) =>
      `Mình đang học tiếng Anh với AtoEnglish — app học tiếng Anh khoa học nhất cho người Việt! Dùng link của mình để đăng ký nhé: ${url}`,
  },
  {
    id: "career",
    label: "Mục tiêu sự nghiệp",
    text: (_name: string, url: string) =>
      `Bạn muốn làm việc ở công ty quốc tế? Mình đang dùng AtoEnglish để luyện Business English. Vào đây học cùng mình: ${url}`,
  },
  {
    id: "challenge",
    label: "Thách đấu bạn bè",
    text: (name: string, url: string) =>
      `${name} thách bạn học tiếng Anh 10 phút mỗi ngày trong 30 ngày! Dùng AtoEnglish cùng mình: ${url}`,
  },
];

export default function InviteClient({
  refCode,
  displayName,
}: {
  refCode: string;
  displayName: string;
}) {
  const inviteUrl = `${BASE_URL}/?ref=${refCode}`;
  const [copied, setCopied] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(0);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Đã sao chép vào clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Không thể sao chép. Hãy copy thủ công.");
    }
  };

  const shareText = SHARE_MESSAGES[selectedMsg]?.text(displayName, inviteUrl) ?? "";

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  };

  const handleZalo = () => {
    window.open(`https://zalo.me/share?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <SecondaryPageShell
      title="Mời bạn học cùng"
      subtitle={`Mã giới thiệu: ${refCode}`}
    >
      <div className="space-y-5 pb-16">
        <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Chia sẻ AtoEnglish với bạn bè để cùng tiến bộ nhanh hơn.
          </p>
        </div>

        <ListSection title="Lợi ích">
          {REWARDS.map(({ icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 px-4 py-3 border-b border-border/40 last:border-0">
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </ListSection>

        <ListSection title="Link của bạn">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border/60">
              <span className="flex-1 text-xs font-mono text-foreground truncate">{inviteUrl}</span>
              <MinimalButton
                variant="primary"
                onClick={() => handleCopy(inviteUrl)}
                className="!min-h-8 !px-3 !text-xs shrink-0"
              >
                {copied ? "✓" : "Copy"}
              </MinimalButton>
            </div>
          </div>
        </ListSection>

        <ListSection title="Tin nhắn chia sẻ">
          <div className="px-4 py-3 space-y-3">
            <div className="flex gap-2 flex-wrap">
              {SHARE_MESSAGES.map((msg, idx) => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMsg(idx)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                    selectedMsg === idx
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border/60 text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {msg.label}
                </button>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-muted/40 text-xs text-foreground/80 leading-relaxed border border-border/60">
              {shareText}
            </div>
            <MinimalButton variant="secondary" fullWidth onClick={() => handleCopy(shareText)}>
              Sao chép tin nhắn
            </MinimalButton>
          </div>
        </ListSection>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "WhatsApp", emoji: "💬", onClick: handleWhatsApp },
            { label: "Zalo", emoji: "📱", onClick: handleZalo },
            { label: "Facebook", emoji: "📘", onClick: handleFacebook },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/60 bg-card hover:bg-muted/40 transition-all"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs font-bold text-foreground">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="text-center">
          <Link href="/me" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
            ← Quay lại
          </Link>
        </div>
      </div>
    </SecondaryPageShell>
  );
}