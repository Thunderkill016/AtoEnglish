"use client";

import { useEffect } from "react";
import { Flame, Map, BookOpen } from "lucide-react";
import {
  Screen,
  LargeTitle,
  ContinueCard,
  PrimaryRow,
} from "@/components/design-system";

interface DashboardMinimalClientProps {
  userName: string;
  currentStreak: number;
  currentUnitData: {
    title: string;
    description: string;
    progress: number;
    route: string;
    xp: number;
  };
  onboardingProfile?: { goal: string; obstacle: string; daily_minutes: number } | null;
}

/**
 * Minimal home (Học tab) — research-backed: 1 CTA, streak caption, roadmap link.
 * Replaces ~900-line DashboardClient for time-to-lesson metric (P2).
 */
export default function DashboardMinimalClient({
  userName,
  currentStreak,
  currentUnitData,
  onboardingProfile: _onboardingProfile, // used via server action in page (for dashboard/settings)
}: DashboardMinimalClientProps) {
  useEffect(() => {
    if (typeof performance !== "undefined") {
      performance.mark("time-to-lesson:dashboard-ready");
    }
  }, []);

  const firstName = userName.split(" ")[0] || userName;
  const streakCaption =
    currentStreak === 0
      ? "Bắt đầu chuỗi học hôm nay"
      : `${currentStreak} ngày liên tiếp`;

  return (
    <Screen>
      <LargeTitle subtitle={`Chào ${firstName}`}>Học</LargeTitle>

      <div className="space-y-4">
        <ContinueCard
          title={currentUnitData.title}
          description={currentUnitData.description}
          progress={currentUnitData.progress}
          href={currentUnitData.route}
          xp={currentUnitData.xp}
        />

        <p
          className="flex items-center gap-2 px-1 text-[var(--minimal-caption-size)] text-muted-foreground font-medium"
          data-testid="streak-caption"
        >
          <Flame className="size-3.5 text-orange-500" aria-hidden />
          {streakCaption}
        </p>

        <div className="space-y-2 pt-2">
          <PrimaryRow
            href="/roadmap"
            label="Lộ trình"
            description="Xem tiến độ A0 → B2"
            icon={Map}
          />
          <PrimaryRow
            href="/learn"
            label="Tất cả bài học"
            description="Danh sách 50 unit"
            icon={BookOpen}
          />
        </div>
      </div>
    </Screen>
  );
}