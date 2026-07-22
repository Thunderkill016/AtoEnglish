"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import {
  trackDaySevenReturnIfDue,
  trackPilotEventOnce,
} from "@/lib/pilot/pilot-analytics-client";

export default function PilotLifecycleTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackDaySevenReturnIfDue();
    if (pathname === "/") {
      trackPilotEventOnce("pilot_landing_viewed", "landing", {
        source: "landing",
      });
    }
  }, [pathname]);

  return null;
}
