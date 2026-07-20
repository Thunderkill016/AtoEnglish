import { StatLine } from "@/components/ui/page";
"use client";

import { useEffect, useState } from "react";

import { dashboardSections } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

export type HubSectionBadges = Partial<Record<string, number>>;

type DashboardHubNavProps = {
  badges?: HubSectionBadges;
};

/**
 * Sticky in-page navigation for the dashboard hub.
 * Optional numeric badges per section (pending missions, due SRS, etc.).
 */
export default function DashboardHubNav({ badges = {} }: DashboardHubNavProps) {
  const [activeId, setActiveId] = useState(dashboardSections[0]?.id ?? "");

  useEffect(() => {
    const sectionEls = dashboardSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 88;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  return (
    <nav
      aria-label="Điều hướng dashboard"
      className="sticky top-[4.5rem] z-30 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-2 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200/40 dark:border-zinc-800/40"
    >
      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {dashboardSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeId === section.id;
          const badge = badges[section.id];
          const showBadge = typeof badge === "number" && badge > 0;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => scrollTo(section.id)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all duration-150",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              {section.label}
              {showBadge && (
                <span
                  className={cn(
                    "min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center rounded-full text-[10px] font-black leading-none",
                    section.id === "dash-practice"
                      ? "bg-amber-500 text-white"
                      : "bg-emerald-600 text-white",
                  )}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}