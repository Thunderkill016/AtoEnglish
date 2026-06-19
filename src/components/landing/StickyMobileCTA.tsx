"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { checkHasSession } from "@/lib/auth-check";

/**
 * StickyMobileCTA — xuất hiện khi user scroll qua Hero section trên mobile.
 * Ẩn hoàn toàn trên desktop (md+).
 */
export default function StickyMobileCTA() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsLoggedIn(checkHasSession());

    // Tìm phần tử sentinel nằm cuối Hero section để biết khi nào user đã scroll qua
    const sentinel = document.getElementById("hero-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Hiện khi sentinel không còn trong viewport (đã scroll qua hero)
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px" }
    );

    observer.observe(sentinel);
    sentinelRef.current = sentinel as HTMLDivElement;

    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`
        fixed bottom-0 left-0 right-0 z-40
        md:hidden
        px-4 pb-safe-area-inset-bottom pb-4 pt-3
        bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg
        border-t border-zinc-200/50 dark:border-zinc-800/50
        shadow-[0_-4px_24px_rgba(0,0,0,0.06)]
        transition-transform duration-300 ease-in-out
        ${visible ? "translate-y-0" : "translate-y-full"}
      `}
    >
      <Link
        href={isLoggedIn ? "/dashboard" : "/login"}
        prefetch={false}
        className="flex items-center justify-center gap-2 w-full h-13 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] text-white text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all duration-200"
      >
        {isLoggedIn ? "Vào Dashboard" : "Bắt đầu học ngay — Miễn phí"}
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
