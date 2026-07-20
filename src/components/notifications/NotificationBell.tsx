import { StatLine } from "@/components/ui/page";
"use client";

import { useState, useEffect } from "react";
import {
  Bell, BellOff, BellRing, Loader2, X, Check,
  Clock, Sparkles, Shield, Smartphone,
} from "lucide-react";
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
import { saveNotificationPreferences } from "@/app/actions/notifications";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

// Hour presets
const HOUR_PRESETS = [
  { label: "Sáng sớm", hour: 7,  emoji: "🌅", sub: "07:00" },
  { label: "Buổi trưa", hour: 12, emoji: "☀️", sub: "12:00" },
  { label: "Chiều tối", hour: 18, emoji: "🌆", sub: "18:00" },
  { label: "Buổi tối", hour: 20, emoji: "🌙", sub: "20:00" },
];

const BENEFITS = [
  { icon: Clock,      text: "Nhắc đúng giờ bạn chọn — không spam" },
  { icon: Sparkles,   text: "Cá nhân hoá theo streak & tiến độ" },
  { icon: Shield,     text: "Chỉ gửi khi bạn chưa học hôm đó" },
  { icon: Smartphone, text: "Hoạt động khi đóng tab — không cần mở app" },
];

type Phase = "idle" | "value-prop" | "hour-pick" | "granted" | "denied" | "unsupported";

export default function NotificationBell({ initialHour = 20 }: { initialHour?: number }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const perm = getNotificationPermission();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (perm === "unsupported") { setPhase("unsupported"); return; }
    if (perm === "denied") { setPhase("denied"); return; }

    const init = async () => {
      if (perm === "granted") {
        const has = await hasPushSubscription();
        setIsSubscribed(has);
        setPhase(has ? "granted" : "idle");
      } else {
        setPhase("idle");
      }
    };
    init();
   
  }, []);

  const handleEnable = async () => {
    if (!VAPID_PUBLIC_KEY) { toast.error("VAPID key chưa cấu hình."); return; }
    setIsPending(true);
    try {
      await registerServiceWorker();
      const sub = await subscribeToPush(VAPID_PUBLIC_KEY);
      if (!sub) {
        const perm = getNotificationPermission();
        setPhase(perm === "denied" ? "denied" : "idle");
        toast.error("Không thể bật thông báo. Kiểm tra quyền trình duyệt.");
        setOpen(false);
        return;
      }
      const keys = sub.toJSON().keys as { p256dh: string; auth: string };
      const [saveRes] = await Promise.all([
        savePushSubscription({ endpoint: sub.endpoint, keys, userAgent: navigator.userAgent }),
        saveNotificationPreferences({ notificationHour: selectedHour, emailNotifications: true }),
      ]);
      if (saveRes.success) {
        setIsSubscribed(true);
        setPhase("granted");
        toast.success(`🔔 Sẽ nhắc bạn học lúc ${selectedHour.toString().padStart(2, "0")}:00 mỗi ngày!`);
        setOpen(false);
      } else {
        toast.error("Lỗi lưu subscription: " + saveRes.error);
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
      setPhase("idle");
      toast.success("🔕 Đã tắt nhắc nhở.");
      setOpen(false);
    } finally {
      setIsPending(false);
    }
  };

  // Don't render on unsupported browsers
  if (phase === "unsupported") return null;

  const btnLabel = phase === "denied"
    ? "Bị chặn"
    : isSubscribed
    ? `🔔 ${selectedHour.toString().padStart(2, "0")}:00`
    : "Bật nhắc nhở";

  return (
    <>
      {/* Trigger button */}
      <button
        id="notification-bell-btn"
        onClick={() => {
          if (phase === "denied") return;
          if (isSubscribed) { setOpen(true); return; }
          setOpen(true);
        }}
        disabled={isPending || phase === "denied"}
        aria-label={btnLabel}
        className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-[0.97] ${
          phase === "denied"
            ? "opacity-50 cursor-not-allowed border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-500"
            : isSubscribed
            ? "border-emerald-500/50 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
            : "border-zinc-300 dark:border-zinc-700/60 bg-zinc-100 dark:bg-zinc-800/40 text-zinc-700 dark:text-zinc-300 hover:border-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-700 dark:hover:text-emerald-400"
        }`}
      >
        {isPending
          ? <Loader2 className="size-3.5 animate-spin" />
          : isSubscribed
          ? <BellRing className="size-3.5" />
          : phase === "denied"
          ? <BellOff className="size-3.5" />
          : <Bell className="size-3.5" />}
        {btnLabel}
      </button>

      {/* Modal overlay */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Bottom sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-2xl pb-safe animate-in slide-in-from-bottom-4 duration-200">

            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between px-5 pt-3 pb-4">
              <div>
                {isSubscribed ? (
                  <>
                    <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">Nhắc nhở đang bật 🔔</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Đang nhắc lúc {selectedHour.toString().padStart(2, "0")}:00 mỗi ngày
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base font-black text-zinc-900 dark:text-zinc-100">Bật nhắc học hàng ngày</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Chọn giờ phù hợp — chỉ nhắc khi bạn chưa học hôm đó
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Đóng"
                className="size-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 transition-colors shrink-0"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="px-5 pb-8 space-y-4">
              {!isSubscribed && (
                /* Value props — Duolingo style: explain WHY before asking */
                <div className="grid grid-cols-2 gap-2 mb-1">
                  {BENEFITS.map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60">
                      <Icon className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hour presets */}
              <div>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Chọn giờ nhắc</p>
                <div className="grid grid-cols-4 gap-2">
                  {HOUR_PRESETS.map(p => {
                    const active = selectedHour === p.hour;
                    return (
                      <button
                        key={p.hour}
                        onClick={() => setSelectedHour(p.hour)}
                        className={`relative flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl border transition-all ${
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
                        <span className={`text-[9px] font-bold leading-tight text-center ${active ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                          {p.label}
                        </span>
                        <span className={`text-[11px] font-black ${active ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-800 dark:text-zinc-200"}`}>
                          {p.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom hour */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <Clock className="size-3.5 text-zinc-400 shrink-0" />
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 shrink-0">Giờ khác:</span>
                <input
                  type="time"
                  value={`${selectedHour.toString().padStart(2, "0")}:00`}
                  onChange={e => {
                    const h = parseInt(e.target.value.split(":")[0] ?? "20", 10);
                    if (!isNaN(h)) setSelectedHour(Math.min(23, Math.max(0, h)));
                  }}
                  className="flex-1 text-sm font-black text-zinc-900 dark:text-zinc-100 bg-transparent outline-none"
                />
              </div>

              {/* Action buttons */}
              {isSubscribed ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={async () => {
                      await saveNotificationPreferences({ notificationHour: selectedHour, emailNotifications: true });
                      toast.success(`⏰ Đã đổi sang ${selectedHour.toString().padStart(2, "0")}:00`);
                      setOpen(false);
                    }}
                    className="h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-black transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Check className="size-4" />
                    Cập nhật giờ
                  </button>
                  <button
                    onClick={handleDisable}
                    disabled={isPending}
                    className="h-12 rounded-2xl border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 text-sm font-black transition-all active:scale-[0.98] hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center justify-center gap-2"
                  >
                    {isPending ? <Loader2 className="size-4 animate-spin" /> : <BellOff className="size-4" />}
                    Tắt nhắc nhở
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEnable}
                  disabled={isPending}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.98] text-white text-sm font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-60"
                >
                  {isPending
                    ? <Loader2 className="size-4 animate-spin" />
                    : <BellRing className="size-4" />}
                  Bật nhắc lúc {selectedHour.toString().padStart(2, "0")}:00 mỗi ngày
                </button>
              )}

              {/* iOS PWA hint */}
              {/iphone|ipad/i.test(typeof navigator !== "undefined" ? navigator.userAgent : "") && !isSubscribed && (
                <p className="text-[10px] text-center text-zinc-400 leading-relaxed">
                  💡 Trên iOS: Thêm AtoEnglish vào màn hình chính (PWA) để nhận push notification.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
