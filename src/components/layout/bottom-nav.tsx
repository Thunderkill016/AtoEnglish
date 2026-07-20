"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";
import { getBottomNavItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  dueCardsCount?: number;
}

export function BottomNav({ dueCardsCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  if (isLessonChromeHidden(pathname)) return null;
  const items = getBottomNavItems();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-stretch border-t border-border bg-background sm:hidden"
      aria-label="Điều hướng chính"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href === "/me" && pathname.startsWith("/settings")) ||
          (item.href !== "/" && pathname.startsWith(item.href + "/"));
        const badge = item.href === "/flashcards" && dueCardsCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            data-tab={item.href.replace("/", "")}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <span className="relative">
              <Icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
              {badge ? (
                <span className="absolute -right-2 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-0.5 text-[8px] font-bold text-white">
                  {dueCardsCount > 99 ? "99+" : dueCardsCount}
                </span>
              ) : null}
            </span>
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
