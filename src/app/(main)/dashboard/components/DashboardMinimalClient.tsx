"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Page, PageHeader } from "@/components/ui/page";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export default function DashboardMinimalClient({
  userName,
  currentStreak,
  currentUnitData,
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
    <Page>
      <PageHeader
        description={`Chào ${firstName} · ${streakCaption}`}
      />
      <Card className="mb-4">
        <CardContent className="space-y-3 pt-5">
          <p className="text-sm font-medium">{currentUnitData.title}</p>
          <p className="text-sm text-muted-foreground">
            {currentUnitData.description}
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${currentUnitData.progress}%` }}
            />
          </div>
          <Link
            href={currentUnitData.route}
            className={cn(buttonVariants(), "w-full")}
          >
            Tiếp tục bài
          </Link>
        </CardContent>
      </Card>
      <Link
        href="/home"
        className={cn(buttonVariants({ variant: "outline" }), "w-full")}
      >
        Lộ trình B1 (v2)
      </Link>
    </Page>
  );
}
