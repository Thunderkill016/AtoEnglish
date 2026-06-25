"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, BookOpen, Layers, Mic, PenLine, TrendingUp, Trophy, Map, Briefcase, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Grouped navigation for the slide panel */
const panelGroups = [
  {
    label: "HỌC TẬP",
    items: [
      { title: "Bài học", href: "/learn", icon: BookOpen, description: "IPOR lessons" },
      { title: "Luyện nói", href: "/speaking", icon: Mic, description: "Shadowing & AI" },
      { title: "Viết văn", href: "/writing", icon: PenLine, description: "AI feedback" },
      { title: "Flashcards", href: "/flashcards", icon: Layers, description: "SRS ôn tập" },
    ],
  },
  {
    label: "THEO DÕI",
    items: [
      { title: "Tiến độ", href: "/progress", icon: TrendingUp, description: "Stats & XP" },
      { title: "Bảng xếp hạng", href: "/leaderboard", icon: Trophy, description: "Top learners" },
      { title: "Lộ trình", href: "/roadmap", icon: Map, description: "A1 → C1" },
    ],
  },
  {
    label: "KHÁC",
    items: [
      { title: "Business English", href: "/business", icon: Briefcase, description: "Công sở & sự nghiệp" },
      { title: "Cài đặt", href: "/settings", icon: Settings, description: "Tài khoản" },
    ],
  },
];

/**
 * MobileNav — Slide-from-right panel (md: and below).
 *
 * Design pattern: right-side drawer (like Notion, Apple Maps)
 * - Tap hamburger → panel slides in from right (w-72)
 * - Tap backdrop → panel slides out
 * - Content grouped: Học tập | Theo dõi | Khác
 * - Framer Motion for smooth spring animation
 * - Body scroll locked while open
 */
export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);


  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        onClick={() => setOpen((prev) => !prev)}
        className="size-9 rounded-xl relative z-[60]"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="size-5" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <Menu className="size-5" />
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 dark:bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Slide panel from right */}
            <motion.nav
              key="panel"
              id="mobile-nav-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background dark:bg-zinc-950 border-l border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl flex flex-col"
              aria-label="Menu điều hướng"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800/60">
                <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Menu</p>
                <button
                  onClick={() => setOpen(false)}
                  className="flex size-7 items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  aria-label="Đóng menu"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Scrollable nav groups */}
              <div className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
                {panelGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-[9px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.12em] px-2 mb-1.5">
                      {group.label}
                    </p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                          pathname === item.href ||
                          pathname.startsWith(item.href + "/");
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className={cn(
                                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group",
                                isActive
                                  ? "bg-primary/10 dark:bg-primary/15 text-primary"
                                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                              )}
                            >
                              <span className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                                isActive
                                  ? "bg-primary/15 text-primary"
                                  : "bg-zinc-100 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700"
                              )}>
                                <Icon className="size-4" />
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  "text-sm leading-tight",
                                  isActive ? "font-bold" : "font-semibold"
                                )}>
                                  {item.title}
                                </p>
                                <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                              {isActive && (
                                <span className="size-1.5 rounded-full bg-primary shrink-0" />
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-4 border-t border-zinc-100 dark:border-zinc-800/60">
                <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-medium text-center">
                  AtoEnglish · Grow every day 🌱
                </p>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}