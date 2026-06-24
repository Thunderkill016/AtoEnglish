"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  BellRing,
  Mail,
  Clock,
  Shield,
  ChevronRight,
  Check,
  Trash2,
  Smartphone,
  GraduationCap,
  BookOpenCheck,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  subscribeToPush,
  unsubscribeFromPush,
  getNotificationPermission,
  registerServiceWorker,
} from "@/lib/push-notifications";
import { savePushSubscription, removePushSubscription } from "@/app/actions/push";
import { saveNotificationPreferences } from "@/app/actions/notifications";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

// ── Types ────────────────────────────────────────────────
interface SettingToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

// ── Sub-components ───────────────────────────────────────
function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <div className="mb-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 px-1 mb-2">
        {title}
      </h2>
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
        {children}
      </div>
    </div>
  );
}

function SettingToggle({ id, label, description, checked, onChange }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 gap-4">
      <div className="flex-1 min-w-0">
        <label htmlFor={id} className="block text-sm font-semibold text-zinc-800 dark:text-zinc-100 cursor-pointer">
          {label}
        </label>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
          checked ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SettingSelect({
  label,
  description,
  value,
  options,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5 gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function SettingAction({
  label,
  description,
  icon: Icon,
  onClick,
  destructive = false,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3.5 gap-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
        destructive ? "hover:bg-red-50 dark:hover:bg-red-950/20" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`p-2 rounded-lg ${destructive ? "bg-red-100 dark:bg-red-950/40 text-red-500" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"}`}>
          <Icon className="size-4" />
        </span>
        <div>
          <p className={`text-sm font-semibold ${destructive ? "text-red-500" : "text-zinc-800 dark:text-zinc-100"}`}>{label}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>
        </div>
      </div>
      <ChevronRight className="size-4 text-zinc-400 flex-shrink-0" />
    </button>
  );
}

// ── Helpers ─────────────────────────────────────────────
function getStoredSettings() {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem("ato_settings");
    return stored ? (JSON.parse(stored) as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

// ── Notification Hour Picker ─────────────────────────────
function HourPicker({ value, onChange }: { value: number; onChange: (h: number) => void }) {
  const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 07:00–22:00
  return (
    <div className="flex items-center justify-between px-4 py-3.5 gap-4">
      <div className="flex items-center gap-3">
        <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-500">
          <Clock className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Giờ nhắc nhở</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Nhận push notification vào đúng giờ này</p>
        </div>
      </div>
      <select
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {HOURS.map(h => (
          <option key={h} value={h}>{h.toString().padStart(2,"0")}:00</option>
        ))}
      </select>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────
export default function SettingsClient({
  userEmail,
  initialNotifHour = 20,
  initialEmailNotifs = true,
}: {
  userEmail: string;
  initialNotifHour?: number;
  initialEmailNotifs?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [isPushPending, startPushTransition] = useTransition();

  // Push notification state
  const [pushEnabled, setPushEnabled] = useState(false);
  const [notifHour, setNotifHour] = useState(initialNotifHour);
  const [emailNotifs, setEmailNotifs] = useState(initialEmailNotifs);

  // Init push status on mount
  useState(() => {
    if (typeof window === "undefined") return;
    const perm = getNotificationPermission();
    if (perm === "granted") {
      navigator.serviceWorker?.ready
        .then(reg => reg.pushManager.getSubscription())
        .then(sub => setPushEnabled(!!sub))
        .catch(() => {});
    }
  });

  const handlePushToggle = (enabled: boolean) => {
    startPushTransition(async () => {
      if (enabled) {
        if (!VAPID_PUBLIC_KEY) { toast.error("VAPID key chưa cấu hình."); return; }
        await registerServiceWorker();
        const sub = await subscribeToPush(VAPID_PUBLIC_KEY);
        if (!sub) {
          toast.error("Không thể bật thông báo. Kiểm tra quyền trình duyệt.");
          return;
        }
        const keys = sub.toJSON().keys as { p256dh: string; auth: string };
        const res = await savePushSubscription({ endpoint: sub.endpoint, keys, userAgent: navigator.userAgent });
        if (res.success) {
          setPushEnabled(true);
          await saveNotificationPreferences({ notificationHour: notifHour, emailNotifications: emailNotifs });
          toast.success(`🔔 Đã bật nhắc nhở lúc ${notifHour.toString().padStart(2,"0")}:00 mỗi ngày!`);
        } else {
          toast.error("Lỗi kết nối: " + res.error);
        }
      } else {
        const reg = await navigator.serviceWorker?.ready;
        const sub = await reg?.pushManager?.getSubscription();
        if (sub) { await removePushSubscription(sub.endpoint); await unsubscribeFromPush(); }
        setPushEnabled(false);
        toast.success("🔕 Đã tắt nhắc nhở.");
      }
    });
  };


  // Learning settings
  const [soundEffects, setSoundEffects] = useState(() => {
    const s = getStoredSettings(); return s.soundEffects !== undefined ? !!s.soundEffects : true;
  });
  const [autoPlayAudio, setAutoPlayAudio] = useState(() => {
    const s = getStoredSettings(); return s.autoPlayAudio !== undefined ? !!s.autoPlayAudio : false;
  });
  const [showPhonetics, setShowPhonetics] = useState(() => {
    const s = getStoredSettings(); return s.showPhonetics !== undefined ? !!s.showPhonetics : true;
  });
  const [dailyGoal, setDailyGoal] = useState(() => {
    if (typeof window !== "undefined") {
      const g = localStorage.getItem("ato_daily_xp_goal");
      if (g) return g;
    }
    const s = getStoredSettings();
    return typeof s.dailyGoal === "string" ? s.dailyGoal : "10";
  });
  const [fsrsRetention, setFsrsRetention] = useState(() => {
    const s = getStoredSettings();
    return s.fsrsRetention !== undefined ? String(s.fsrsRetention) : "0.9";
  });
  const [fsrsMaxNewCards, setFsrsMaxNewCards] = useState(() => {
    const s = getStoredSettings();
    return s.fsrsMaxNewCards !== undefined ? String(s.fsrsMaxNewCards) : "15";
  });


  // Display settings — theme via next-themes, fontSize local only
  const { setTheme: applyTheme } = useTheme();
  const [theme, setTheme] = useState(() => {
    const s = getStoredSettings(); return typeof s.theme === "string" ? s.theme : "system";
  });
  const [fontSize, setFontSize] = useState(() => {
    const s = getStoredSettings(); return typeof s.fontSize === "string" ? s.fontSize : "normal";
  });

  const saveSettings = () => {
    const settings = {
      soundEffects, autoPlayAudio,
      showPhonetics, dailyGoal, theme, fontSize,
      fsrsRetention: Number(fsrsRetention),
      fsrsMaxNewCards: Number(fsrsMaxNewCards),
    };
    localStorage.setItem("ato_settings", JSON.stringify(settings));
    localStorage.setItem("ato_daily_xp_goal", dailyGoal);
    // Apply theme immediately via next-themes
    applyTheme(theme);
    // Dispatch event so Dashboard XP bar updates
    window.dispatchEvent(new CustomEvent("ato:settings-changed", { detail: settings }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const clearProgress = () => {
    if (window.confirm("Bạn có chắc muốn xóa toàn bộ tiến độ học cục bộ (lưu trên thiết bị)? Dữ liệu trên server sẽ không bị xóa.")) {
      const keep = ["ato_settings", "ato_daily_xp_goal", "sb-vhpfskkredizeazlyzsh-auth-token"];
      const keys = Object.keys(localStorage);
      keys.forEach(k => { if (!keep.some(p => k.includes(p))) localStorage.removeItem(k); });
      window.location.reload();
    }
  };

  const installPWA = () => {
    // Trigger beforeinstallprompt if available
    const promptEvent = (window as Window & { _pwaInstallPrompt?: BeforeInstallPromptEvent })._pwaInstallPrompt;
    if (promptEvent) {
      promptEvent.prompt();
    } else {
      alert("Để cài đặt ứng dụng: mở menu trình duyệt (⋮) → 'Thêm vào màn hình chính'");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Cài đặt</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{userEmail}</p>
      </div>

      {/* Notifications */}
      <SettingSection title="Thông báo">
        {/* Push toggle */}
        <div className="flex items-center justify-between px-4 py-3.5 gap-4">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-lg ${pushEnabled ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
              {pushEnabled ? <BellRing className="size-4" /> : <Bell className="size-4" />}
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Nhắc học hàng ngày</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {pushEnabled ? `Đang bật — nhắc lúc ${notifHour.toString().padStart(2,"0")}:00` : "Nhận push nếu chưa học hôm nay"}
              </p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={pushEnabled}
            onClick={() => handlePushToggle(!pushEnabled)}
            disabled={isPushPending}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 disabled:opacity-60 ${
              pushEnabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
            }`}
          >
            {isPushPending
              ? <Loader2 className="absolute inset-0 m-auto size-3.5 animate-spin text-white" />
              : <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${pushEnabled ? "translate-x-5" : "translate-x-0"}`} />}
          </button>
        </div>

        {/* Hour picker — only shown when push enabled */}
        {pushEnabled && (
          <HourPicker
            value={notifHour}
            onChange={async (h) => {
              setNotifHour(h);
              await saveNotificationPreferences({ notificationHour: h, emailNotifications: emailNotifs });
              toast.success(`⏰ Đã đổi giờ nhắc sang ${h.toString().padStart(2,"0")}:00`);
            }}
          />
        )}

        {/* Email notifications */}
        <div className="flex items-center justify-between px-4 py-3.5 gap-4">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-lg ${emailNotifs ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
              <Mail className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Email tổng kết tuần</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Nhận email mỗi thứ Hai với báo cáo 7 ngày</p>
            </div>
          </div>
          <button
            role="switch"
            aria-checked={emailNotifs}
            onClick={async () => {
              const next = !emailNotifs;
              setEmailNotifs(next);
              await saveNotificationPreferences({ notificationHour: notifHour, emailNotifications: next });
              toast.success(next ? "📧 Đã bật email tổng kết tuần" : "Đã tắt email tổng kết tuần");
            }}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 ${
              emailNotifs ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
            }`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailNotifs ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        {/* Denied state hint */}
        {getNotificationPermission() === "denied" && (
          <div className="px-4 py-3 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20">
            <BellOff className="size-3.5 shrink-0" />
            Trình duyệt đã chặn thông báo. Vào Settings → Site Settings → Notifications để bật lại.
          </div>
        )}
      </SettingSection>

      {/* Learning */}
      <SettingSection title="Học tập">
        <SettingSelect
          label="Mục tiêu XP hàng ngày"
          description="Số XP cần đạt mỗi ngày để duy trì streak"
          value={dailyGoal}
          options={[
            { value: "5", label: "5 XP (Nhẹ nhàng)" },
            { value: "10", label: "10 XP (Thường)" },
            { value: "20", label: "20 XP (Tích cực)" },
            { value: "50", label: "50 XP (Chuyên nghiệp)" },
          ]}
          onChange={setDailyGoal}
        />
        <SettingSelect
          label="Tỷ lệ nhớ mục tiêu (FSRS)"
          description="Tỷ lệ ghi nhớ mong muốn (tỷ lệ cao hơn sẽ tăng số lần ôn tập)"
          value={fsrsRetention}
          options={[
            { value: "0.8", label: "80% (Luyện tập ít hơn)" },
            { value: "0.85", label: "85%" },
            { value: "0.9", label: "90% (Khuyên dùng)" },
            { value: "0.95", label: "95% (Nhớ lâu hơn)" },
          ]}
          onChange={setFsrsRetention}
        />
        <SettingSelect
          label="Số từ mới tối đa mỗi ngày"
          description="Giới hạn số lượng từ mới học tối đa trong ngày"
          value={fsrsMaxNewCards}
          options={[
            { value: "5", label: "5 từ" },
            { value: "10", label: "10 từ" },
            { value: "15", label: "15 từ (Mặc định)" },
            { value: "20", label: "20 từ" },
            { value: "25", label: "25 từ" },
            { value: "30", label: "30 từ" },
          ]}
          onChange={setFsrsMaxNewCards}
        />
        <SettingToggle
          id="sound-effects"
          label="Âm thanh phản hồi"
          description="Phát âm thanh khi trả lời đúng/sai"
          checked={soundEffects}
          onChange={setSoundEffects}
        />
        <SettingToggle
          id="auto-play-audio"
          label="Tự động phát âm"
          description="Tự động phát âm thanh từ vựng khi hiển thị thẻ"
          checked={autoPlayAudio}
          onChange={setAutoPlayAudio}
        />
        <SettingToggle
          id="show-phonetics"
          label="Hiển thị phiên âm IPA"
          description="Hiện ký hiệu phiên âm quốc tế dưới mỗi từ"
          checked={showPhonetics}
          onChange={setShowPhonetics}
        />
        {/* Placement test link */}
        <Link href="/placement-test" className="w-full flex items-center justify-between px-4 py-3.5 gap-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-violet-100 dark:bg-violet-950/40 text-violet-500">
              <GraduationCap className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Làm lại Placement Test</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Cập nhật trình độ CEFR — 40 câu EF SET style</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-zinc-400 flex-shrink-0" />
        </Link>
        {/* Grammar reference link */}
        <Link href="/grammar" className="w-full flex items-center justify-between px-4 py-3.5 gap-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/40 text-blue-500">
              <BookOpenCheck className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Ngữ pháp tham khảo</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">13 chủ đề A1→B2 với giải thích tiếng Việt</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-zinc-400 flex-shrink-0" />
        </Link>
      </SettingSection>

      {/* Display */}
      <SettingSection title="Giao diện">
        <SettingSelect
          label="Chủ đề"
          description="Màu sắc giao diện ứng dụng"
          value={theme}
          options={[
            { value: "system", label: "Theo hệ thống" },
            { value: "dark", label: "Tối (Dark)" },
            { value: "light", label: "Sáng (Light)" },
          ]}
          onChange={setTheme}
        />
        <SettingSelect
          label="Cỡ chữ"
          description="Kích thước chữ trong bài học"
          value={fontSize}
          options={[
            { value: "small", label: "Nhỏ" },
            { value: "normal", label: "Bình thường" },
            { value: "large", label: "Lớn" },
          ]}
          onChange={setFontSize}
        />
      </SettingSection>

      {/* App */}
      <SettingSection title="Ứng dụng">
        <SettingAction
          label="Cài đặt ứng dụng (PWA)"
          description="Thêm AtoEnglish vào màn hình chính"
          icon={Smartphone}
          onClick={installPWA}
        />
        <SettingAction
          label="Xóa cache cục bộ"
          description="Xóa dữ liệu tạm trên thiết bị (không ảnh hưởng server)"
          icon={Trash2}
          onClick={clearProgress}
          destructive
        />
      </SettingSection>

      {/* Privacy info */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 p-4 mb-6">
        <div className="flex gap-3 items-start">
          <Shield className="size-4 text-emerald-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Quyền riêng tư</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              AtoEnglish không bán dữ liệu của bạn. Tiến độ học tập được lưu trên Supabase với bảo mật RLS. Cài đặt giao diện được lưu cục bộ trên thiết bị của bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Save button — sticky */}
      <div className="fixed bottom-20 sm:bottom-6 left-0 right-0 flex justify-center px-4 z-30 pointer-events-none">
        <motion.button
          onClick={saveSettings}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-colors"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span
                key="saved"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                className="flex items-center gap-1.5"
              >
                <Check className="size-4" />
                Đã lưu!
              </motion.span>
            ) : (
              <motion.span
                key="save"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
              >
                Lưu cài đặt
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}

// PWA install prompt type
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
}
