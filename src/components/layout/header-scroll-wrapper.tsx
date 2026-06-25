"use client";

import { useEffect, useRef, useState } from "react";

interface HeaderScrollWrapperProps {
  children: React.ReactNode;
}

/**
 * HeaderScrollWrapper — Adds auto-hide-on-scroll behavior to the header.
 *
 * Behavior:
 * - Scroll DOWN > 80px → header translates up (-100%) and hides
 * - Scroll UP (any amount) → header slides back in immediately
 * - At very top of page → always visible
 * - Transition: CSS transform 0.3s ease (60fps, no janky repaints)
 *
 * Why CSS transform over JS height: transform is composited, no layout
 * recalculations. This is the pattern used by Duolingo, Twitter, LinkedIn.
 */
export function HeaderScrollWrapper({ children }: HeaderScrollWrapperProps) {
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const HIDE_THRESHOLD = 80; // px scrolled before hiding starts

    function handleScroll() {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const diff = currentY - lastScrollY.current;

        if (currentY < HIDE_THRESHOLD) {
          // Always show at top
          setHidden(false);
        } else if (diff > 4) {
          // Scrolling DOWN — hide
          setHidden(true);
        } else if (diff < -4) {
          // Scrolling UP — show
          setHidden(false);
        }

        lastScrollY.current = currentY;
        ticking.current = false;
      });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="transition-transform duration-300 ease-in-out will-change-transform"
      style={{ transform: hidden ? "translateY(-110%)" : "translateY(0)" }}
    >
      {children}
    </div>
  );
}
