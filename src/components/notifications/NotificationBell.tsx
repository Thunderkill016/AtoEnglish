"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellOff, BellRing, Loader2, X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getNotificationPermission,
  registerServiceWorker,
} from "@/lib/push-notifications";
import {
  savePushSubscription,
  removePushSubscription,
  hasPushSubscription,
} from "@/app/actions/push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
const STORAGE_KEY = "reminder-time";

const PRESETS = [
  { label: "Sáng sớm", time: "07:00", emoji: "🌅" },
  { label: "Buổi trưa", time: "12:00", emoji: "☀️" },
  { label: "Chiều tối", time: "18:00", emoji: "🌆" },
  { label: "Buổi tối", time: "20:00", emoji: "🌙" },
];

function formatTime(time: string) {
  const [h, m] = time.split(":");
  return `${h}:${m}`;
}

export default function NotificationBell() {
  const [status, setStatus] = useState<
    "loading" | "unsupported" | "denied" | "granted" | "default"
  >("loading");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("20:00");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setSelectedTime(saved);

    const init = async () => {
      const perm = getNotificationPermission();
      if (perm === "unsupported") {
        setStatus("unsupported");
        return;
      }
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
        setStatus(
          getNotificationPermission() as "denied" | "granted" | "default"
        );
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
        localStorage.setItem(STORAGE_KEY, selectedTime);
        toast.success(`🔔 Nhắc nhở bật lúc ${formatTime(selectedTime)} mỗi ngày!`);
        setOpen(false);
      } else {
        toast.error("Lỗi lưu subscription: " + res.error);
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
    <>
      {/* Trigger button */}
      <button
        onClick={() => {
          if (status === "denied") return;
          if (isSubscribed) {
            handleDisable();
          } else {
            setOpen(true);
          }
        }}
        disabled={isPending || status === "denied"}
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-[0.97] ${
          status === "denied"
            ? "opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-500"
            : isSubscribed
            ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-400 hover:text-red-600 dark:hover:text-red-400"
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
          ? `Nhắc ${formatTime(selectedTime)} ✓`
          : status === "denied"
          ? "Bị chặn"
          : "Bật nhắc nhở"}
      </button>

      {/* Modal overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 pb-8 space-y-5 animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  Nhắc học mỗi ngày lúc mấy giờ?
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Hệ thống sẽ gửi thông báo để nhắc bạn học tiếng Anh
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="size-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Quick presets */}
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((p) => {
                const active = selectedTime === p.time;
                return (
                  <button
                    key={p.time}
                    onClick={() => setSelectedTime(p.time)}
                    className={`relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all ${
                      active
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10"
                        : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {active && (
                      <span className="absolute top-1.5 right-1.5 size-4 bg-emerald-500 rounded-full flex items-center justify-center">
                        <Check className="size-2.5 text-white" />
                      </span>
                    )}
                    <span className="text-xl">{p.emoji}</span>
                    <span
                      className={`text-[10px] font-bold leading-tight text-center ${
                        active
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {p.label}
                    </span>
                    <span
                      className={`text-[11px] font-black ${
                        active
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      {p.time}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom time input */}
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 shrink-0">
                Giờ khác:
              </span>
              <input
                ref={inputRef}
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="flex-1 text-sm font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none"
              />
            </div>

            {/* Confirm */}
            <button
              onClick={handleEnable}
              disabled={isPending}
              className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-60"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <BellRing className="size-4" />
              )}
              Bật nhắc nhở lúc {formatTime(selectedTime)}
            </button>
          </div>
        </>
      )}
    </>
  );
}
