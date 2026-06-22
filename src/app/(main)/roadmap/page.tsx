import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { UNITS } from "@/lib/constants/units";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình học | AtoEnglish",
  description:
    "Lộ trình tự học tiếng Anh 12 tháng từ con số 0 đến B1+. Hướng tới dùng English cho dev work.",
  robots: { index: false },
};

export default async function RoadmapPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Find the next uncompleted unit route for the CTA button
  const completedIds = new Set(
    user
      ? (
          await supabase
            .from("user_lesson_progress")
            .select("unit_id")
            .eq("user_id", user.id)
        ).data?.map((r) => r.unit_id) ?? []
      : []
  );
  const nextUnit = UNITS.find((u) => !completedIds.has(u.id));
  const nextUnitRoute = nextUnit?.route ?? "/learn";

  return (
    <main id="main-content">
      <RoadmapClient nextUnitRoute={nextUnitRoute} />
    </main>
  );
}
