"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThinProgress } from "./ThinProgress";
import { MinimalButton } from "./MinimalButton";

export interface ContinueCardProps {
  title: string;
  description?: string;
  progress: number;
  href: string;
  xp?: number;
  className?: string;
}

/**
 * Single primary CTA — Hick-compliant: one decision to enter full lesson.
 * No mini/amber secondary as co-primary (moved to text link if needed).
 */
export function ContinueCard({
  title,
  description,
  progress,
  href,
  xp,
  className,
}: ContinueCardProps) {
  function handleClick() {
    if (typeof performance !== "undefined") {
      performance.mark("time-to-lesson:cta-click");
    }
  }

  return (
    <article
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 sm:p-6 space-y-5",
        className
      )}
    >
      <div className="space-y-1.5">
        <p className="text-[var(--minimal-caption-size)] font-semibold uppercase tracking-wide text-muted-foreground">
          Tiếp tục học
        </p>
        <h2 className="text-[var(--minimal-headline-size)] font-bold tracking-tight text-foreground leading-snug">
          {title}
        </h2>
        {description && (
          <p className="text-[var(--minimal-body-size)] text-muted-foreground leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>

      <ThinProgress value={progress} />

      {xp !== undefined && xp > 0 && (
        <p className="text-[var(--minimal-caption-size)] text-muted-foreground">
          Hoàn thành nhận <span className="font-semibold text-foreground">{xp} XP</span>
        </p>
      )}

      <MinimalButton
        href={href}
        onClick={handleClick}
        data-testid="continue-learning"
        fullWidth
      >
        Học tiếp
        <ArrowRight className="size-4" />
      </MinimalButton>
    </article>
  );
}