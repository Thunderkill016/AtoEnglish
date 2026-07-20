import { StatLine } from "@/components/ui/page";
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { getDesktopPrimaryNav } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

/** Desktop primary nav — Ato Surface active emerald pill */
export function MainNavRow() {
  const pathname = usePathname();
  const items = getDesktopPrimaryNav();

  return (
    <nav className="hidden items-center gap-0.5 md:flex" aria-label="Điều hướng chính">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href === "/me" && pathname.startsWith("/settings")) ||
          (item.href !== "/" && pathname.startsWith(`${item.href}/`));
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200",
              isActive
                ? "bg-emerald-500/15 text-emerald-400 shadow-[0_0_16px_-4px_rgba(16,185,129,0.4)]"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100",
            )}
          >
            <Icon className="size-3.5 shrink-0" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
