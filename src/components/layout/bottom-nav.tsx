"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";
import { getBottomNavItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  dueCardsCount?: number;
}

/** Bottom nav — shadcn semantic tokens (mobile) */
export function BottomNav({ dueCardsCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  if (isLessonChromeHidden(pathname)) return null;

  const items = getBottomNavItems();

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch justify-around sm:hidden",
        "border-t border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
      )}
      aria-label="Điều hướng chính"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href === "/me" && pathname.startsWith("/settings")) ||
          (item.href !== "/" && pathname.startsWith(item.href + "/"));
        const showBadge = item.href === "/flashcards" && dueCardsCount > 0;

        return (
          <Link
            key={item.href}
            href={item.href}
            data-tab={item.href.replace("/", "")}
            aria-current={isActive ? "page" : undefined}
            aria-label={item.description ?? item.title}
            className={cn(
              "group relative flex flex-1 flex-col items-center justify-center py-1 select-none",
              "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeBottomTabPill"
                className="absolute inset-x-1.5 top-1 bottom-1 -z-10 rounded-lg bg-primary/12 ring-1 ring-primary/20"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}

            <span className="relative flex items-center justify-center">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-md transition-colors duration-200",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.2 : 1.8} />
              </span>

              {showBadge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-destructive px-0.5 text-[9px] font-bold text-white"
                >
                  {dueCardsCount > 99 ? "99+" : dueCardsCount}
                </motion.span>
              )}
            </span>

            <span
              className={cn(
                "mt-0.5 text-[9px] font-semibold tracking-tight transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
