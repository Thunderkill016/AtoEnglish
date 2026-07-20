"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export function LessonHeader({
  backHref = "/home",
  backLabel = "Back",
  title,
  progress,
  progressLabel,
  trailing,
  className,
}: {
  backHref?: string;
  backLabel?: string;
  title?: string;
  eyebrow?: string;
  progress?: number;
  progressLabel?: string;
  trailing?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("mb-4 space-y-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
          ← {backLabel}
        </Link>
        {trailing}
      </div>
      {title ? <h1 className="text-lg font-semibold">{title}</h1> : null}
      {typeof progress === "number" ? (
        <div className="space-y-1">
          {progressLabel ? (
            <p className="text-xs text-muted-foreground">{progressLabel}</p>
          ) : null}
          <div className="h-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default LessonHeader;
