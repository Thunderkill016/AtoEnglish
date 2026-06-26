"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThinProgress } from "./ThinProgress";

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

      <Link
        href={href}
        onClick={handleClick}
        data-testid="continue-learning"
        className={cn(
          "flex min-h-[var(--minimal-touch)] w-full items-center justify-center gap-2",
          "rounded-xl bg-primary text-primary-foreground font-bold",
          "text-[var(--minimal-body-size)] transition-all duration-150",
          "hover:opacity-90 active:scale-[0.98]"
        )}
      >
        Học tiếp
        <ArrowRight className="size-4" />
      </Link>
    </article>
  );
}