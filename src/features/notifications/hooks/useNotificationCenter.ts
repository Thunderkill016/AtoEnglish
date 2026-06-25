"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export interface NotificationLog {
  id: string;
  type: string;
  title: string;
  body: string;
  url?: string | null;
  read: boolean;
  created_at: string;
}

export interface NotificationCenterState {
  notifications: NotificationLog[];
  unreadCount: number;
  isLoading: boolean;
  isOpen: boolean;
  toggleOpen: () => void;
  markAllRead: () => Promise<void>;
  markRead: (ids: string[]) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * useNotificationCenter — Phase C hook from research doc Part 6.
 * Fetches last 30 notifications, manages read/unread state.
 * Auto-refreshes every 60s when open.
 */
export function useNotificationCenter(): NotificationCenterState {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/notifications/history");
      if (!res.ok) return;
      const data = await res.json() as { notifications: NotificationLog[]; unreadCount: number };
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unreadCount ?? 0);
    } catch { /* fail silently */ } finally {
      setIsLoading(false);
    }
  }, []);

  const markRead = useCallback(async (ids: string[]) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => ids.includes(n.id) ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - ids.filter(
      id => notifications.find(n => n.id === id && !n.read)
    ).length));

    try {
      await fetch("/api/notifications/history", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
    } catch { /* fail silently */ }
  }, [notifications]);

  const markAllRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await fetch("/api/notifications/history", { method: "PATCH" });
    } catch { /* fail silently */ }
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen(prev => {
      const next = !prev;
      if (next) void refresh(); // Refresh on open
      return next;
    });
  }, [refresh]);

  // Initial fetch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  // Auto-refresh every 60s when open
  useEffect(() => {
    if (isOpen) {
      intervalRef.current = setInterval(() => { void refresh(); }, 60_000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, refresh]);

  return {
    notifications,
    unreadCount,
    isLoading,
    isOpen,
    toggleOpen,
    markAllRead,
    markRead,
    refresh,
  };
}
