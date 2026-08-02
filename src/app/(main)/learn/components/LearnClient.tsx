"use client";

import {
  BookOpen,
  CheckCircle,
  ChevronDown,
  Lock,
  Radio,
  RefreshCcw,
} from "lucide-react";
import {
  ContinueCard,
  ListSection,
  PrimaryRow,
  SecondaryPageShell,
} from "@/components/design-system";

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
  starCount?: number;
}

interface DueTransfer {
  id: string;
  label: string;
  description: string;
  href: string;
}

interface LearnClientProps {
  userLevel: string;
  totalXp: number;
  completedUnitIds: string[];
  activeUnitId: string;
  isGuest: boolean;
  dueTransfers: DueTransfer[];
  unitStatuses: UnitStatus[];
}

const FUTURE_STAGES = [
  "Pre-A1 / A1",
  "A2",
  "B1",
  "B2 / IELTS Bridge",
  "IELTS 6.5",
];

export default function LearnClient({
  userLevel,
  totalXp,
  completedUnitIds,
  activeUnitId,
  isGuest,
  dueTransfers,
  unitStatuses,
}: LearnClientProps) {
  const activeUnit =
    unitStatuses.find((unit) => unit.id === activeUnitId) ?? unitStatuses[0];

  return (
    <SecondaryPageShell
      title="Bài học"
      subtitle={`${completedUnitIds.length}/6 bài A0 · ${userLevel} · ${totalXp.toLocaleString()} XP`}
    >
      <div className="space-y-6 pb-16">
        {dueTransfers.length > 0 && (
          <ListSection title={`Kiểm tra giao tiếp đến hạn · ${dueTransfers.length}`}>
            {dueTransfers.map((transfer) => (
              <PrimaryRow
                key={transfer.id}
                href={transfer.href}
                label={transfer.label}
                description={transfer.description}
                icon={RefreshCcw}
              />
            ))}
          </ListSection>
        )}

        <ContinueCard
          title={activeUnit.title}
          description={
            isGuest
              ? "Học thử bài đầu tiên. Đăng nhập để làm checkpoint, lưu evidence và ôn FSRS."
              : activeUnit.description
          }
          progress={activeUnit.progress}
          href={activeUnit.route}
          xp={activeUnit.xp}
        />

        <ListSection title="A0 nền tảng · mission pilot">
          {unitStatuses.map((unit, index) => {
            const isCompleted = completedUnitIds.includes(unit.id);
            const isGuestLocked = isGuest && index > 0;

            if (isGuestLocked) {
              return (
                <div
                  key={unit.id}
                  className="flex min-h-[var(--minimal-touch)] items-center gap-3 rounded-lg border border-border/40 bg-muted/30 px-4 py-3 opacity-70"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Lock className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[var(--minimal-body-size)] font-semibold text-muted-foreground">
                      {unit.title}
                    </span>
                    <span className="mt-0.5 block text-[var(--minimal-caption-size)] text-muted-foreground/80">
                      Đăng nhập sau bài học thử
                    </span>
                  </span>
                </div>
              );
            }

            return (
              <PrimaryRow
                key={unit.id}
                href={unit.route}
                label={unit.title}
                description={`${isCompleted ? "Hoàn thành" : `${unit.progress}%`} · ${unit.estimatedTime} phút`}
                icon={isCompleted ? CheckCircle : BookOpen}
              />
            );
          })}
        </ListSection>

        <ListSection title="Thử nghiệm · nội dung giao tiếp thật">
          <PrimaryRow
            href="/real-talk"
            label="Real Talk"
            description="Video có nguồn rõ ràng → transcript timestamp → active recall → FSRS"
            icon={Radio}
          />
        </ListSection>

        <details className="group border-t border-border/60 pt-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold text-muted-foreground">
            Các giai đoạn tiếp theo
            <ChevronDown
              className="size-4 transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="mt-2 space-y-2">
            {FUTURE_STAGES.map((stage) => (
              <div
                key={stage}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground"
              >
                <Lock className="size-4" aria-hidden />
                <span>{stage}</span>
                <span className="ml-auto text-xs">Chưa phát hành</span>
              </div>
            ))}
          </div>
        </details>
      </div>
    </SecondaryPageShell>
  );
}
