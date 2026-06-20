import type { Metadata } from "next";
import { getUserProgress, getCompletedUnitsCount } from "@/app/actions/progress";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình học",
  description: "Bản đồ lộ trình A1 → C1 cá nhân hóa. Xem tiến độ và chinh phục từng chặng CEFR.",
  robots: { index: false },
};

export default async function RoadmapPage() {
  const [progressRes, completedRes] = await Promise.all([
    getUserProgress(),
    getCompletedUnitsCount(),
  ]);

  const userCefrLevel =
    progressRes.success && progressRes.progress?.current_level
      ? progressRes.progress.current_level
      : "A1";

  const completedUnits =
    completedRes.success && completedRes.count != null ? completedRes.count : 0;

  return (
    <main id="main-content">
      <RoadmapClient
        userCefrLevel={userCefrLevel}
        completedUnits={completedUnits}
      />
    </main>
  );
}