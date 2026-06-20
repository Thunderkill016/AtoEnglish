"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, Loader2, Clock, X } from "lucide-react";
import { toast } from "sonner";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getNotificationPermission,
  registerServiceWorker,
} from "@/lib/push-notifications";
import { savePushSubscription, removePushSubscription, hasPushSubscription } from "@/app/actions/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const STORAGE_KEY = "reminder-hour";
const HOUR_OPTIONS = [7, 8, 12, 17, 18, 19, 20, 21, 22];

export default function NotificationBell() {
  const [status, setStatus] = useState<"loading" | "unsupported" | "denied" | "granted" | "default">("loading");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>(20);

  useEffect(() => {
    // Load saved hour preference
    const saved = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setSelectedHour(Number(saved));

    const init = async () => {
      const perm = getNotificationPermission();
      if (perm === "unsupported") { setStatus("unsupported"); return; }
      setStatus(perm);
      if (perm === "granted") {
        const has = await hasPushSubscription();
        setIsSubscribed(has);
      }
    };
    init();
  }, []);

  const handleEnable = async () => {
    if (!VAPID_PUBLIC_KEY) {
      toast.error("VAPID key chưa được cấu hình.");
      return;
    }
    setIsPending(true);
    try {
      await registerServiceWorker();
      const sub = await subscribeToPush(VAPID_PUBLIC_KEY);
      if (!sub) {
        toast.error("Không thể bật thông báo. Kiểm tra quyền trình duyệt.");
        setStatus(getNotificationPermission() as "denied" | "granted" | "default");
        return;
      }
      const subJson = sub.toJSON();
      const keys = subJson.keys as { p256dh: string; auth: string };
      const res = await savePushSubscription({
        endpoint: sub.endpoint,
        keys,
        userAgent: navigator.userAgent,
      });
      if (res.success) {
        setIsSubscribed(true);
        setStatus("granted");
        localStorage.setItem(STORAGE_KEY, String(selectedHour));
        toast.success(`🔔 Đã bật nhắc nhở lúc ${selectedHour}:00 mỗi ngày!`);
        setShowTimePicker(false);
      } else {
        toast.error("Không lưu được subscription: " + res.error);
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleDisable = async () => {
    setIsPending(true);
    try {
      const reg = await navigator.serviceWorker?.ready;
      const sub = await reg?.pushManager?.getSubscription();
      if (sub) {
        await removePushSubscription(sub.endpoint);
        await unsubscribeFromPush();
      }
      setIsSubscribed(false);
      toast.success("🔕 Đã tắt nhắc nhở.");
    } finally {
      setIsPending(false);
    }
  };

  if (status === "loading" || status === "unsupported") return null;

  return (
    <div className="relative">
      {/* Main button */}
      <button
        onClick={() => {
          if (status === "denied") return;
          if (isSubscribed) {
            handleDisable();
          } else {
            setShowTimePicker((v) => !v);
          }
        }}
        disabled={isPending || status === "denied"}
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-[0.97] ${
          status === "denied"
            ? "opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-500"
            : isSubscribed
            ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-400 dark:hover:border-red-500/30 hover:text-red-600 dark:hover:text-red-400"
            : "border-zinc-300 dark:border-zinc-700/60 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400"
        }`}
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : isSubscribed ? (
          <BellRing className="size-3.5" />
        ) : status === "denied" ? (
          <BellOff className="size-3.5" />
        ) : (
          <Bell className="size-3.5" />
        )}
        {isSubscribed
          ? `Nhắc ${selectedHour}:00 ✓`
          : status === "denied"
          ? "Bị chặn"
          : "Bật nhắc nhở"}
      </button>

      {/* Time picker dropdown */}
      {showTimePicker && !isSubscribed && status !== "denied" && (
        <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-2xl shadow-xl p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300">
              <Clock className="size-3.5 text-emerald-500" />
              Chọn giờ nhắc nhở
            </div>
            <button
              onClick={() => setShowTimePicker(false)}
              className="size-5 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors"
            >
              <X className="size-3" />
            </button>
          </div>

          {/* Hour buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            {HOUR_OPTIONS.map((h) => (
              <button
                key={h}
                onClick={() => {
                  setSelectedHour(h);
                  localStorage.setItem(STORAGE_KEY, String(h));
                }}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedHour === h
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400"
                }`}
              >
                {h}:00
              </button>
            ))}
          </div>

          {/* Confirm button */}
          <button
            onClick={handleEnable}
            disabled={isPending}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <BellRing className="size-3.5" />
            )}
            Bật nhắc lúc {selectedHour}:00 mỗi ngày
          </button>

          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center">
            Nhắc nhở qua trình duyệt — cần mở ứng dụng trong nền
          </p>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showTimePicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowTimePicker(false)}
        />
      )}
    </div>
  );
}
