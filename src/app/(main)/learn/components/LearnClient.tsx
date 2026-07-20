"use client";

import Link from "next/link";
import { BookOpen, CheckCircle2, Lock } from "lucide-react";
import { Page, PageHeader } from "@/components/ui/page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  isPlacedOutUnit,
  isUnitUnlocked,
} from "@/lib/placement/starting-unit";

interface UnitStatus {
  id: string;
  title: string;
  description: string;
  level: string;
  route: string;
  xp: number;
  estimatedTime: number;
  completed: boolean;
  progress: number;
  vocabCount?: number;
  starCount?: number;
}

interface LearnClientProps {
  userLevel: string;
  totalXp: number;
  completedUnitIds: string[];
  activeUnitId: string;
  unitStatuses: UnitStatus[];
  startingUnitIndex?: number;
  placementCompleted?: boolean;
}

export default function LearnClient({
  userLevel,
  totalXp,
  completedUnitIds,
  unitStatuses,
  startingUnitIndex = 0,
  placementCompleted = false,
}: LearnClientProps) {
  const unitIds = unitStatuses.map((u) => u.id);
  const completedCount = completedUnitIds.length;
  const showPlacement =
    !placementCompleted && startingUnitIndex === 0 && completedCount === 0;

  return (
    <Page>
      <PageHeader
        description={`${completedCount}/50 · ${userLevel} · ${totalXp.toLocaleString()} XP`}
      />
      <Link href="/home" className={cn(buttonVariants({ variant: "outline" }), "mb-6 w-full")}>
        Lộ trình B1 (v2)
      </Link>
      {showPlacement ? (
        <Card className="mb-4">
          <CardContent className="space-y-2 pt-5">
            <p className="text-sm">Chưa chắc bắt đầu từ đâu?</p>
            <Link href="/placement-test" className={cn(buttonVariants({ size: "sm" }))}>
              Placement test
            </Link>
          </CardContent>
        </Card>
      ) : null}
      <ul className="space-y-2">
        {unitStatuses.map((unit, index) => {
          const unlocked = isUnitUnlocked(index, startingUnitIndex, completedUnitIds, unitIds);
          const placedOut = isPlacedOutUnit(index, startingUnitIndex, completedUnitIds);
          const locked = !unlocked && !unit.completed;
          const row = (
            <Card size="sm" className={cn(locked && "opacity-50")}>
              <CardContent className="flex items-center gap-3 py-3">
                {unit.completed ? (
                  <CheckCircle2 className="size-4 text-primary" />
                ) : locked ? (
                  <Lock className="size-4 text-muted-foreground" />
                ) : (
                  <BookOpen className="size-4 text-primary" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{unit.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {unit.level} · ~{unit.estimatedTime}p
                    {placedOut ? " · placement" : ""}
                  </p>
                </div>
                <Badge variant={unit.completed ? "default" : "outline"}>
                  {unit.completed ? "Xong" : locked ? "Khóa" : "Mở"}
                </Badge>
              </CardContent>
            </Card>
          );
          return (
            <li key={unit.id}>
              {locked ? row : <Link href={unit.route}>{row}</Link>}
            </li>
          );
        })}
      </ul>
    </Page>
  );
}
