"use client";

import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Map,
} from "lucide-react";
import { Screen, PageHeader, AppButton } from "@/components/design-system";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  isPlacedOutUnit,
  isUnitUnlocked,
} from "@/lib/placement/starting-unit";
import { cn } from "@/lib/utils";

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

/** Legacy v1 unit list (only when CURRICULUM_V2=0). */
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
    <Screen ambient>
      <div className="space-y-6 pb-16">
        <div className="space-y-3">
          <Badge variant="secondary" className="gap-1.5">
            <BookOpen className="size-3" aria-hidden />
            Legacy v1 · {userLevel}
          </Badge>
          <PageHeader
            eyebrow="Học"
            title="Bài học (unit)"
            subtitle={`${completedCount}/50 hoàn thành · ${totalXp.toLocaleString()} XP`}
          />
          <AppButton href="/home" variant="secondary" size="sm">
            <Map className="size-3.5" aria-hidden />
            Chuyển sang lộ trình B1 (v2)
          </AppButton>
        </div>

        {showPlacement && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="space-y-3 py-5">
              <p className="text-sm font-medium text-foreground">
                Chưa chắc bắt đầu từ đâu?
              </p>
              <p className="text-sm text-muted-foreground">
                Làm placement ngắn để nhảy đúng unit — hoặc học tuần tự từ đầu.
              </p>
              <AppButton href="/placement-test" size="sm">
                Làm placement test
              </AppButton>
            </CardContent>
          </Card>
        )}

        <ul className="space-y-2">
          {unitStatuses.map((unit, index) => {
            const unlocked = isUnitUnlocked(
              index,
              startingUnitIndex,
              completedUnitIds,
              unitIds,
            );
            const placedOut = isPlacedOutUnit(
              index,
              startingUnitIndex,
              completedUnitIds,
            );
            const locked = !unlocked && !unit.completed;

            const inner = (
              <Card
                size="sm"
                className={cn(
                  "transition",
                  locked ? "opacity-50" : "hover:bg-muted/40",
                )}
              >
                <CardContent className="flex items-center gap-3 py-3">
                  {unit.completed ? (
                    <CheckCircle2 className="size-5 text-primary" aria-hidden />
                  ) : locked ? (
                    <Lock
                      className="size-5 text-muted-foreground"
                      aria-hidden
                    />
                  ) : (
                    <BookOpen className="size-5 text-primary" aria-hidden />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {unit.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {unit.level} · ~{unit.estimatedTime} phút
                      {placedOut ? " · đã vượt placement" : ""}
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
                {locked ? (
                  inner
                ) : (
                  <Link href={unit.route} className="block">
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </Screen>
  );
}
