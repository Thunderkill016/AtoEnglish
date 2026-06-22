import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { resolveDailyXpGoal } from "@/lib/constants/daily-xp-goal";
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

  let dailyXpGoal = 50;
  if (user) {
    const { data } = await supabase
      .from("user_progress")
      .select("daily_xp_goal")
      .eq("user_id", user.id)
      .maybeSingle();
    dailyXpGoal = resolveDailyXpGoal(data?.daily_xp_goal);
  }

  return (
    <main id="main-content">
      <SettingsClient userEmail={userEmail} dailyXpGoal={dailyXpGoal} />
    </main>
  );
}
