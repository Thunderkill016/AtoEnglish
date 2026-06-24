import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getNotificationPreferences } from "@/app/actions/notifications";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "Cài đặt — AtoEnglish",
  description: "Tùy chỉnh thông báo, âm thanh, giao diện và mục tiêu học tập của bạn.",
  robots: { index: false },
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userEmail = user?.email ?? "";

  // Load notification preferences from DB (parallel with page render)
  const notifPrefs = await getNotificationPreferences();

  return (
    <main id="main-content">
      <SettingsClient
        userEmail={userEmail}
        initialNotifHour={notifPrefs?.notificationHour ?? 20}
        initialEmailNotifs={notifPrefs?.emailNotifications ?? true}
      />
    </main>
  );
}
