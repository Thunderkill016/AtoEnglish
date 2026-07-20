import { StatLine } from "@/components/ui/page";
"use client";

import { useEffect, useRef } from "react";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useNotificationCenter } from "../hooks/useNotificationCenter";
import NotificationItem from "./NotificationItem";

/**
 * NotificationCenter — Phase C, research doc Part 6.
 * Bell icon with unread badge + dropdown panel (last 30 notifications).
 * Integrates with Header. Auto-refreshes every 60s when open.
 */
export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    toggleOpen,
    markAllRead,
    markRead,
  } = useNotificationCenter();

  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        toggleOpen();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, toggleOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") toggleOpen();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, toggleOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        id="notification-center-bell"
        onClick={toggleOpen}
        aria-label={`Thông báo${unreadCount > 0 ? ` — ${unreadCount} chưa đọc` : ""}`}
        className="relative flex size-9 items-center justify-center rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/30 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors duration-150"
      >
        <Bell className="size-4 text-zinc-600 dark:text-zinc-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="absolute right-0 top-11 z-50 w-[340px] max-w-[calc(100vw-1rem)] rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
          {/* Header row */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <Bell className="size-3.5 text-zinc-500" />
              <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50">Thông báo</p>
              {unreadCount > 0 && (
                <span className="text-[10px] font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <CheckCheck className="size-3" />
                Đọc tất cả
              </button>
            )}
          </div>

          {/* Content */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
            {isLoading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-10 gap-2 text-zinc-400">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-xs">Đang tải...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-400">
                <Bell className="size-8 mb-2 opacity-30" />
                <p className="text-xs font-semibold">Chưa có thông báo nào</p>
                <p className="text-[10px] text-zinc-400 mt-1">
                  Bật push notification để nhận nhắc học!
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={(id) => void markRead([id])}
                />
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/30">
              <p className="text-[10px] text-zinc-400 dark:text-zinc-600 text-center">
                Hiển thị 30 thông báo gần nhất
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
