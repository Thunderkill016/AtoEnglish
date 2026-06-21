import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
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

  return (
    <main id="main-content">
      <SettingsClient userEmail={userEmail} />
    </main>
  );
}
