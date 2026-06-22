import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UNITS } from "@/lib/constants/units";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình học | AtoEnglish",
  description:
    "Lộ trình tự học tiếng Anh 4 giai đoạn từ A0 đến B2 — được thiết kế riêng cho người Việt mục tiêu dùng English cho SaaS & business.",
  robots: { index: false },
};

export default async function RoadmapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [progressRes, lessonRes] = await Promise.all([
    user
      ? supabase
          .from("user_progress")
          .select("current_level, total_xp")
          .eq("user_id", user.id)
          .single()
      : Promise.resolve({ data: null }),
    user
      ? supabase
          .from("user_lesson_progress")
          .select("unit_id")
          .eq("user_id", user.id)
      : Promise.resolve({ data: [] }),
  ]);

  const completedIds = (lessonRes.data ?? []).map((r) => r.unit_id);
  const userLevel = progressRes.data?.current_level ?? "A0";
  const nextUnit = UNITS.find((u) => !completedIds.includes(u.id));
  const nextUnitRoute = nextUnit?.route ?? "/learn";

  return (
    <main id="main-content">
      <RoadmapClient
        nextUnitRoute={nextUnitRoute}
        userLevel={userLevel}
        completedUnitIds={completedIds}
      />
    </main>
  );
}
