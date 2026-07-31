import type { Metadata } from "next";
import { getUserProgress } from "@/app/actions/stats";
import { getCurrentUnit } from "@/app/actions/unit";
import { UNITS } from "@/lib/constants/units";
import DashboardMinimalClient from "./components/DashboardMinimalClient";

export const metadata: Metadata = {
  title: "Học | AtoEnglish",
  description: "Mở ngay bài A0 tiếp theo và duy trì nhịp tự học tiếng Anh.",
};

export const revalidate = 30;

const PILOT_UNITS = UNITS.slice(0, 6);

export default async function DashboardPage() {
  const [progressRes, unitRes] = await Promise.all([
    getUserProgress(),
    getCurrentUnit(),
  ]);

  const progress = progressRes.success ? progressRes.progress : null;
  const activeUnit =
    PILOT_UNITS.find((unit) => unit.id === unitRes.unitId) ?? PILOT_UNITS[0];

  return (
    <DashboardMinimalClient
      userName={progress?.display_name || "Học viên"}
      currentStreak={progress?.streak || 0}
      currentUnitData={{
        title: activeUnit.title,
        description: activeUnit.description,
        progress:
          unitRes.success && unitRes.unitId === activeUnit.id
            ? unitRes.progress || 0
            : 0,
        route: activeUnit.route,
        xp: activeUnit.xp,
      }}
    />
  );
}
