"use client";
import { usePathname } from "next/navigation";

export function LessonPageHider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide header/bottom-nav on full-screen lesson UIs
  const isLessonPage =
    /^\/learn\/unit/.test(pathname) || /^\/real-talk\/[\w-]+$/.test(pathname);
  if (isLessonPage) return null;
  return <>{children}</>;
}
