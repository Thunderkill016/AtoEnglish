"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";
import { bottomNavItems } from "@/lib/constants/navigation";
import { ATO_FOCUS } from "@/lib/ui/ato-surface";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  dueCardsCount?: number;
}

/** BottomNav — Mobile Ato Surface tab bar (sm: and below). */
export function BottomNav({ dueCardsCount = 0 }: BottomNavProps) {
  const pathname = usePathname();
  if (isLessonChromeHidden(pathname)) return null;

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex h-16 items-stretch justify-around sm:hidden",
        "border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl",
        "shadow-[0_-8px_32px_-8px_rgba(0,0,0,0.55)]",
      )}
      aria-label="Điều hướng chính"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {bottomNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href === "/me" && pathname.startsWith("/settings")) ||
          pathname.startsWith(item.href + "/");
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
              ATO_FOCUS,
            )}
          >
            {isActive && (
              <motion.div
                layoutId="activeBottomTabPill"
                className="absolute inset-x-1.5 top-1 bottom-1 -z-10 rounded-xl border border-emerald-500/25 bg-emerald-500/15 shadow-[0_0_20px_-4px_rgba(16,185,129,0.45)]"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}

            <span className="relative flex items-center justify-center">
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-lg transition-all duration-200",
                  isActive
                    ? "scale-110 text-emerald-400"
                    : "text-zinc-500 group-hover:scale-105 group-hover:text-zinc-200",
                )}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.2 : 1.8} />
              </span>

              {showBadge && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[9px] font-black text-white shadow-sm shadow-red-500/30"
                >
                  {dueCardsCount > 99 ? "99+" : dueCardsCount}
                </motion.span>
              )}
            </span>

            <span
              className={cn(
                "mt-0.5 text-[9px] font-bold tracking-tight transition-all duration-200",
                isActive
                  ? "font-black text-emerald-400"
                  : "text-zinc-500 group-hover:text-zinc-300",
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
