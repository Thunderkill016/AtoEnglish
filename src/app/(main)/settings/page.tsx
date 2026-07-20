import { StatLine } from "@/components/ui/page";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getNotificationPreferences } from "@/app/actions/notifications";
import { getOnboardingProfile } from "@/app/actions/stats";
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

  // Load notification preferences + onboarding profile (parallel)
  const [notifPrefs, profileRes] = await Promise.all([
    getNotificationPreferences(),
    getOnboardingProfile(),
  ]);

  return (
    <main id="main-content">
      <SettingsClient
        userEmail={userEmail}
        initialNotifHour={notifPrefs?.notificationHour ?? 20}
        initialEmailNotifs={notifPrefs?.emailNotifications ?? true}
        initialOnboardingProfile={profileRes.success ? profileRes.profile : null}
      />
    </main>
  );
}
