"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

import { desktopPrimaryNav, desktopMoreItems } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

/**
 * MainNav — Desktop navigation (md+).
 *
 * Layout: [Trang chủ] [Học] [Luyện] [Ôn] [Thêm ▾]
 *
 * "Thêm" dropdown: Viết, Tiến độ, Bảng xếp hạng, Lộ trình, Business
 */
type DropdownCoords = { top: number; left: number };

export function MainNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [dropdownCoords, setDropdownCoords] = useState<DropdownCoords | null>(null);
  const [mounted, setMounted] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updateDropdownCoords = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    setDropdownCoords({
      top: rect.bottom + 6,
      left: rect.left,
    });
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Close "More" dropdown on outside click (trigger + portaled panel)
  useEffect(() => {
    if (!moreOpen) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        moreRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setMoreOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [moreOpen]);

  // Keep portaled dropdown aligned with trigger on scroll/resize
  useEffect(() => {
    if (!moreOpen) return;

    updateDropdownCoords();

    const handleReposition = () => updateDropdownCoords();
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, { passive: true });

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition);
    };
  }, [moreOpen, updateDropdownCoords]);

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

      {/* "More" dropdown — portaled so sticky hub nav / header transform cannot clip it */}
      <div className="relative" ref={moreRef}>
        <button
          ref={triggerRef}
          onClick={() => {
            setMoreOpen((prev) => {
              const next = !prev;
              if (next) updateDropdownCoords();
              return next;
            });
          }}
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

        {mounted &&
          moreOpen &&
          dropdownCoords &&
          createPortal(
            <div
              ref={panelRef}
              role="menu"
              style={{ top: dropdownCoords.top, left: dropdownCoords.left }}
              className="fixed w-52 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-background dark:bg-zinc-900 shadow-lg shadow-black/10 dark:shadow-black/40 overflow-hidden z-[200] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150"
            >
              {desktopMoreItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
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
            </div>,
            document.body
          )}
      </div>
    </nav>
  );
}