"use client";

import dynamic from "next/dynamic";

// Dynamic import with ssr: false MUST live in a Client Component (Turbopack rule)
const NotificationCenter = dynamic(
  () => import("@/features/notifications/components/NotificationCenter"),
  { ssr: false }
);

export function NotificationCenterWrapper() {
  return <NotificationCenter />;
}
