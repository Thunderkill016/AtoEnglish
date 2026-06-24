"use client";

import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

const BASE_URL = "https://atoenglish.vercel.app";

const REWARDS = [
  { icon: "🎯", title: "Học hiệu quả hơn", desc: "Học cùng bạn bè giúp tăng retention lên 40%", color: "emerald" },
  { icon: "🔥", title: "Giữ streak cùng nhau", desc: "Nhắc nhở lẫn nhau để không mất streak", color: "orange" },
  { icon: "🏆", title: "Thi đua cùng nhau", desc: "Xem ai lên level nhanh hơn trên Leaderboard", color: "purple" },
];

const SHARE_MESSAGES = [
  {
    id: "general",
    label: "🗣 Giới thiệu chung",
    text: (name: string, url: string) =>
      `Mình đang học tiếng Anh với AtoEnglish — app học tiếng Anh khoa học nhất cho người Việt! Dùng link của mình để đăng ký nhé: ${url}`,
  },
  {
    id: "career",
    label: "💼 Mục tiêu sự nghiệp",
    text: (name: string, url: string) =>
      `Bạn muốn làm việc ở công ty quốc tế? Mình đang dùng AtoEnglish để luyện Business English. Vào đây học cùng mình: ${url}`,
  },
  {
    id: "challenge",
    label: "⚡ Thách đấu bạn bè",
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
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleZalo = () => {
    // Zalo share uses URL scheme — best effort
    const url = `https://zalo.me/share?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-xl mx-auto">
      {/* ── Hero ── */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-blue-500/8 border border-emerald-500/15 p-6 sm:p-8 mb-6 text-center">
        <div className="flex size-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/10 text-3xl mb-4">
          🎓
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 mb-2">
          Học cùng bạn bè!
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
          Chia sẻ AtoEnglish với bạn bè để cùng tiến bộ nhanh hơn.
          Mã giới thiệu của bạn: <span className="font-black text-emerald-600 dark:text-emerald-400">{refCode}</span>
        </p>
      </div>

      {/* ── Why invite ── */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {REWARDS.map(({ icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30">
            <span className="text-2xl shrink-0">{icon}</span>
            <div>
              <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">{title}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Invite link box ── */}
      <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 p-5 mb-4">
        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-2">Link của bạn</p>
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/40">
          <span className="flex-1 text-xs font-mono text-zinc-600 dark:text-zinc-300 truncate">{inviteUrl}</span>
          <button
            onClick={() => handleCopy(inviteUrl)}
            className="shrink-0 text-xs font-black px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          >
            {copied ? "✓" : "Copy"}
          </button>
        </div>
      </div>

      {/* ── Message picker ── */}
      <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 p-5 mb-4">
        <p className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-3">Chọn tin nhắn để chia sẻ</p>
        <div className="flex gap-2 flex-wrap mb-3">
          {SHARE_MESSAGES.map((msg, idx) => (
            <button
              key={msg.id}
              onClick={() => setSelectedMsg(idx)}
              className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                selectedMsg === idx
                  ? "bg-emerald-500 text-white border-emerald-500"
                  : "border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/30"
              }`}
            >
              {msg.label}
            </button>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed border border-zinc-200/50 dark:border-zinc-700/30">
          {shareText}
        </div>
        <button
          onClick={() => handleCopy(shareText)}
          className="mt-2 w-full text-xs font-black py-2 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60 text-zinc-600 dark:text-zinc-400 hover:border-emerald-500/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
        >
          📋 Sao chép tin nhắn
        </button>
      </div>

      {/* ── Share buttons ── */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-all"
        >
          <span className="text-2xl">💬</span>
          <span className="text-xs font-black text-green-700 dark:text-green-400">WhatsApp</span>
        </button>
        <button
          onClick={handleZalo}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-all"
        >
          <span className="text-2xl">📱</span>
          <span className="text-xs font-black text-blue-700 dark:text-blue-400">Zalo</span>
        </button>
        <button
          onClick={handleFacebook}
          className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all"
        >
          <span className="text-2xl">📘</span>
          <span className="text-xs font-black text-indigo-700 dark:text-indigo-400">Facebook</span>
        </button>
      </div>

      {/* ── CTA back ── */}
      <div className="text-center">
        <Link
          href="/dashboard"
          className="text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          ← Quay lại Dashboard
        </Link>
      </div>
    </div>
  );
}
