"use client";

import Link from "next/link";
import { SheetHeader } from "@/components/design-system";
import { SECTION_LABELS } from "@/lib/lessons/learning-flow";

interface LessonHeaderProps {
  level: string;
  title: string;
  unitId: string;
  section: number;
  sectionOrderIdx: number;
  totalSections: number;
  sessionXp: number;
  xpPopup: { id: number; value: number } | null;
  miniSession: boolean;
  allowMiniSession: boolean;
  onStartMiniSession: () => void;
  onClearProgress: () => void;
}

/** V2 light lesson chrome — SheetHeader + thin progress */
export default function LessonHeader({
  level,
  title,
  unitId,
  section,
  sectionOrderIdx,
  totalSections,
  sessionXp,
  xpPopup,
  miniSession,
  allowMiniSession,
  onStartMiniSession,
  onClearProgress,
}: LessonHeaderProps) {
  const progressPct = Math.round(
    (sectionOrderIdx / Math.max(totalSections - 1, 1)) * 100
  );
  const sectionLabel = SECTION_LABELS[section] ?? "Học";

  const trailing = (
    <div className="flex items-center gap-1.5 shrink-0 text-[var(--minimal-caption-size)]">
      {sessionXp > 0 && (
        <span className="font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
          {sessionXp} XP
          {xpPopup && <span className="ml-0.5">+{xpPopup.value}</span>}
        </span>
      )}
      {miniSession ? (
        <Link
          href={`/learn/${unitId}`}
          onClick={onClearProgress}
          className="font-semibold text-muted-foreground hover:text-primary whitespace-nowrap"
        >
          Bài đầy đủ
        </Link>
      ) : (
        allowMiniSession &&
        section < 8 && (
          <button
            type="button"
            onClick={onStartMiniSession}
            className="font-medium text-muted-foreground hover:text-foreground"
          >
            Ôn lại
          </button>
        )
      )}
    </div>
  );

  return (
    <SheetHeader
      backHref="/dashboard"
      backLabel="Về trang Học"
      eyebrow={level}
      title={title}
      progress={progressPct}
      progressLabel={`${sectionLabel} · ${sectionOrderIdx + 1}/${totalSections}`}
      trailing={trailing}
    />
  );
}