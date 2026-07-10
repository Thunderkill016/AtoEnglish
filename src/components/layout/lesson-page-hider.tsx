"use client";
import { usePathname } from "next/navigation";
import { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";

export { isLessonChromeHidden } from "@/lib/ui/lesson-chrome";

export function LessonPageHider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isLessonChromeHidden(pathname)) return null;
  return <>{children}</>;
}
