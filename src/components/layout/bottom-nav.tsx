"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Mic,
  Layers,
  TrendingUp,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Learn",
      href: "/learn",
      icon: BookOpen,
    },
    {
      title: "Speaking",
      href: "/speaking",
      icon: Mic,
    },
    {
      title: "Flashcards",
      href: "/flashcards",
      icon: Layers,
    },
    {
      title: "Progress",
      href: "/progress",
      icon: TrendingUp,
    },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-background/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-around px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.03)] transition-all duration-300"
      aria-label="Điều hướng chính"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className="flex-1 flex flex-col items-center justify-center h-full relative py-1 text-center select-none"
          >
            {isActive && (
              <motion.div
                layoutId="activeBottomTabPill"
                className="absolute inset-x-2 top-1 bottom-1 bg-primary/10 dark:bg-primary/20 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className={`flex size-6 items-center justify-center rounded-lg transition-colors duration-200 ${
                isActive
                  ? "text-primary scale-105"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-5" />
            </span>
            <span
              className={`text-[9px] font-bold mt-1 tracking-tight transition-colors duration-200 ${
                isActive ? "text-primary font-black" : "text-muted-foreground"
              }`}
            >
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
