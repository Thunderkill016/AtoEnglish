"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getNotificationPermission,
  registerServiceWorker,
} from "@/lib/push-notifications";
import { savePushSubscription, removePushSubscription, hasPushSubscription } from "@/app/actions/push";

// VAPID public key — set in .env.local as NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

export default function NotificationBell() {
  const [status, setStatus] = useState<"loading" | "unsupported" | "denied" | "granted" | "default">("loading");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
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
      toast.error("VAPID key chưa được cấu hình. Thêm NEXT_PUBLIC_VAPID_PUBLIC_KEY vào .env.local");
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
        toast.success("🔔 Đã bật nhắc nhở! Mỗi tối 20:00 bạn sẽ được nhắc học.");
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
    <button
      onClick={isSubscribed ? handleDisable : handleEnable}
      disabled={isPending || status === "denied"}
      title={
        status === "denied"
          ? "Trình duyệt đã chặn thông báo. Vào cài đặt trình duyệt để bật lại."
          : isSubscribed
          ? "Tắt nhắc nhở học hàng ngày"
          : "Bật nhắc nhở học lúc 20:00 mỗi ngày"
      }
      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all active:scale-[0.97] ${
        status === "denied"
          ? "opacity-40 cursor-not-allowed border-zinc-700 text-zinc-500"
          : isSubscribed
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
          : "border-zinc-700/60 bg-zinc-800/40 text-zinc-400 hover:border-emerald-500/40 hover:text-emerald-400"
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
      {isSubscribed ? "Nhắc nhở: Bật" : status === "denied" ? "Bị chặn" : "Bật nhắc nhở"}
    </button>
  );
}
