"use client";

/**
 * TASK-279: After auth, push local v2 progress → Supabase, then pull + merge.
 * Guests: no-op (localStorage only). Mount once under main shell when v2 on.
 */

import { useEffect, useRef } from "react";
import {
  fetchV2LessonProgress,
  syncV2ProgressFromLocal,
} from "@/app/actions/v2-progress";
import {
  listCompletedRecords,
  loadV2Progress,
  mergeLessonRecords,
  saveV2Progress,
} from "@/lib/v2/progress";

const SYNC_FLAG = "ato_v2_progress_synced_session";

export function V2ProgressHydrator() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SYNC_FLAG) === "1") return;
    } catch {
      /* private mode */
    }

    let cancelled = false;

    async function run() {
      const localRecords = listCompletedRecords(loadV2Progress());

      const push = await syncV2ProgressFromLocal({ records: localRecords });
      if (cancelled) return;
      if (!push.success) {
        // guest / unauth: stay local-only
        if ("guestMode" in push && push.guestMode) return;
        return;
      }

      const pull = await fetchV2LessonProgress();
      if (cancelled || !pull.success) return;

      const merged = mergeLessonRecords(loadV2Progress(), pull.records);
      saveV2Progress(merged);

      try {
        sessionStorage.setItem(SYNC_FLAG, "1");
      } catch {
        /* ignore */
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
