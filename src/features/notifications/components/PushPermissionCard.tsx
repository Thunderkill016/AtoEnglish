import { StatLine } from "@/components/ui/page";
"use client";

import { useState, useEffect } from "react";
import { Bell, X, BellOff } from "lucide-react";
import { savePushSubscription } from "@/app/actions/push";
import { saveNotificationPreferences } from "@/app/actions/notifications";

interface PushPermissionCardProps {
  /** After how many lessons completed to show (default: 1 = after first lesson) */
  showAfterLessons?: number;
  /** Current total completed lessons */
  completedLessons: number;
  /** Called when user dismisses permanently */
  onDismiss?: () => void;
}

const DISMISSED_KEY = "push-permission-dismissed";

function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

/**
 * PushPermissionCard — Phase D from research doc Part 3.4.
 *
 * Shows as a soft ask (bottom sheet style) after the user's first lesson completion.
 * Only shows ONCE — after the user grants or permanently dismisses, never shows again.
 *
 * Research doc rule: NEVER show browser hard-ask without soft-ask first.
 * Rule: Never nag if already denied or dismissed.
 */
export default function PushPermissionCard({
  showAfterLessons = 1,
  completedLessons,
  onDismiss,
}: PushPermissionCardProps) {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "requesting" | "granted" | "denied">("idle");

  useEffect(() => {
    if (!isPushSupported()) return;
    if (completedLessons < showAfterLessons) return;

    // Already granted or dismissed?
    const alreadyDismissed = localStorage.getItem(DISMISSED_KEY) === "true";
    const currentPerm = Notification.permission;
    if (alreadyDismissed || currentPerm === "granted" || currentPerm === "denied") return;

    // Show the soft-ask card with a short delay (feels less jarring)
    const t = setTimeout(() => setVisible(true), 1200);
    return () => clearTimeout(t);
  }, [completedLessons, showAfterLessons]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "true");
    setVisible(false);
    onDismiss?.();
  };

  const handleEnable = async () => {
    setStatus("requesting");
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setTimeout(() => setVisible(false), 2000);
        return;
      }

      // Register service worker subscription
      const registration = await navigator.serviceWorker.ready;
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) { setStatus("denied"); return; }

      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      const subJson = sub.toJSON();
      const keys = subJson.keys as { p256dh: string; auth: string };
      await savePushSubscription({
        endpoint: sub.endpoint,
        keys,
        userAgent: navigator.userAgent,
      });
      // Set preferred notification hour to 20:00 VN time (default)
      await saveNotificationPreferences({ notificationHour: 20, emailNotifications: true });

      setStatus("granted");
      localStorage.setItem(DISMISSED_KEY, "true");

      // Welcome push (30s delay — user returns to app first)
      setTimeout(() => setVisible(false), 2500);
    } catch {
      setStatus("denied");
      setTimeout(() => setVisible(false), 2000);
    }
  };

  if (!visible) return null;

  const benefits = [
    { emoji: "⏰", text: "Nhắc học đúng giờ bạn thích" },
    { emoji: "🔥", text: "Cảnh báo khi streak sắp mất" },
    { emoji: "🎉", text: "Thông báo khi đạt milestone" },
    { emoji: "📊", text: "Báo cáo học tập hàng tuần" },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-sm">
      <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
          aria-label="Đóng"
        >
          <X className="size-3.5" />
        </button>

        <div className="p-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <Bell className="size-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-black text-zinc-900 dark:text-zinc-50">
                Bật nhắc nhở học?
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Không bỏ lỡ ngày học nào nữa 🔥
              </p>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {benefits.map(({ emoji, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50"
              >
                <span className="text-base shrink-0">{emoji}</span>
                <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 leading-tight">
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Status states */}
          {status === "granted" ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <span className="text-base">🎉</span>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Đã bật nhắc nhở thành công!
              </p>
            </div>
          ) : status === "denied" ? (
            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <BellOff className="size-4 text-zinc-400" />
              <p className="text-xs font-semibold text-zinc-500">
                Đã từ chối — có thể bật lại trong Settings
              </p>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleDismiss}
                className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Để sau
              </button>
              <button
                onClick={handleEnable}
                disabled={status === "requesting"}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black transition-colors disabled:opacity-60"
              >
                {status === "requesting" ? "Đang xử lý..." : "Bật nhắc nhở"}
              </button>
            </div>
          )}

          <p className="text-[10px] text-center text-zinc-400 mt-2.5">
            Tối đa 2 thông báo/ngày · Tắt được bất cứ lúc nào
          </p>
        </div>
      </div>
    </div>
  );
}

