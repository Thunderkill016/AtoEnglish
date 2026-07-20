"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="inline-flex size-10 items-center justify-center rounded-lg border border-border md:hidden"
        aria-label={open ? "Đóng menu" : "Mở menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div className="absolute left-0 right-0 top-16 z-50 border-b border-border bg-background p-4 shadow-sm md:hidden">
          <nav className="flex flex-col gap-1">
            <a
              href="#how-it-works"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Cách học
            </a>
            <a
              href="#science"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Phương pháp
            </a>
            <a
              href="#faq"
              className="rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
              onClick={() => setOpen(false)}
            >
              Hỏi đáp
            </a>
            <Link
              href="/login?mode=signup"
              className={cn(buttonVariants(), "mt-2 w-full")}
              onClick={() => setOpen(false)}
            >
              Bắt đầu học
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}

/** Kept for page.tsx import compatibility — drawer is inside MobileMenuButton. */
export function MobileMenu() {
  return null;
}
