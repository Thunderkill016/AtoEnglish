"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TabSegmentItem {
  id: string;
  label: string;
  href: string;
}

interface TabSegmentProps {
  items: TabSegmentItem[];
  activeId: string;
  className?: string;
}

/** Segmented control — max 3 choices (Hick, V2) */
export function TabSegment({ items, activeId, className }: TabSegmentProps) {
  const visible = items.slice(0, 3);

  return (
    <nav
      role="tablist"
      aria-label="Sections"
      className={cn(
        "flex gap-1 p-1 rounded-[var(--minimal-radius)] bg-muted/80 border border-border/50",
        className
      )}
    >
      {visible.map((item) => {
        const active = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            role="tab"
            aria-selected={active}
            className={cn(
              "flex-1 min-h-[2.25rem] flex items-center justify-center rounded-lg",
              "text-[var(--minimal-caption-size)] font-semibold transition-colors",
              "duration-[var(--minimal-motion-ms)]",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}