import { StatLine } from "@/components/ui/page";
"use client";

import { useState } from "react";
import type { NotificationLog } from "../hooks/useNotificationCenter";
import Link from "next/link";

const TYPE_ICONS: Record<string, string> = {
  daily_reminder: "📚",
  streak_at_risk: "⚠️",
  streak_broken: "💔",
  streak_milestone: "🎉",
  comeback: "👋",
  weekly_report: "📊",
  cards_due: "🃏",
  freeze_consumed: "❄️",
  default: "🔔",
};

interface NotificationItemProps {
  notification: NotificationLog;
  onRead: (id: string) => void;
}

export default function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const icon = TYPE_ICONS[notification.type] ?? TYPE_ICONS.default;

  // Capture render time once at mount — avoids calling Date.now() on every re-render (purity rule)
  const [mountedAt] = useState<number>(() => Date.now());

  const timeAgo = (() => {
    try {
      const diffMs = mountedAt - new Date(notification.created_at).getTime();
      const diffMins = Math.floor(diffMs / 60_000);
      const diffHrs = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHrs / 24);
      const rtf = new Intl.RelativeTimeFormat("vi", { numeric: "auto" });
      if (diffMins < 1) return "vừa xong";
      if (diffMins < 60) return rtf.format(-diffMins, "minute");
      if (diffHrs < 24) return rtf.format(-diffHrs, "hour");
      return rtf.format(-diffDays, "day");
    } catch {
      return "";
    }
  })();

  const content = (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer ${
        !notification.read ? "bg-emerald-500/3 dark:bg-emerald-500/5" : ""
      }`}
      onClick={() => { if (!notification.read) onRead(notification.id); }}
    >
      {/* Icon bubble */}
      <span className={`flex size-8 items-center justify-center rounded-xl text-base shrink-0 mt-0.5 ${
        !notification.read
          ? "bg-emerald-500/10 border border-emerald-500/20"
          : "bg-zinc-100 dark:bg-zinc-800"
      }`}>
        {icon}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs leading-snug ${
          !notification.read
            ? "font-bold text-zinc-900 dark:text-zinc-50"
            : "font-semibold text-zinc-700 dark:text-zinc-300"
        }`}>
          {notification.title}
        </p>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug line-clamp-2">
          {notification.body}
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1 font-medium">
          {timeAgo}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.read && (
        <div className="size-2 rounded-full bg-emerald-500 shrink-0 mt-2" />
      )}
    </div>
  );

  if (notification.url) {
    return (
      <Link href={notification.url} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
