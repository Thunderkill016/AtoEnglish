"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

import { desktopPrimaryNav, desktopMoreItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

/**
 * MainNav — Desktop navigation (md+).
 *
 * Layout: [Dashboard] [Học] [Luyện nói] [Flashcards] [Viết] [Tiến độ] [More ▾]
 *
 * "More" dropdown reveals: Bảng xếp hạng, Business, Lộ trình
 * Active states: bg-primary/10 pill
 * Hover: bg-muted smooth transition
 */
export function MainNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close "More" on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMoreOpen(false);
  }, [pathname]);

  // Check if active route is in "More" items (so "More" button glows)
  const isMoreActive = desktopMoreItems.some(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  return (
    <nav className="hidden items-center gap-0.5 md:flex" aria-label="Điều hướng chính">
      {/* Primary nav items */}
      {desktopPrimaryNav.map((item) => {
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {item.title}
          </Link>
        );
      })}

      {/* "More" dropdown */}
      <div className="relative" ref={moreRef}>
        <button
          onClick={() => setMoreOpen((prev) => !prev)}
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
            isMoreActive
              ? "bg-primary/10 text-primary font-semibold"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          Thêm
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-200",
              moreOpen ? "rotate-180" : ""
            )}
          />
        </button>

        {/* Dropdown panel */}
        {moreOpen && (
          <div
            role="menu"
            className="absolute left-0 top-full mt-1.5 w-48 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-background/95 dark:bg-zinc-900/95 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/30 overflow-hidden z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
          >
            {desktopMoreItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors duration-100",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  <Icon className="size-3.5 shrink-0" />
                  <div>
                    <p className="font-medium leading-tight">{item.title}</p>
                    {item.description && (
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}