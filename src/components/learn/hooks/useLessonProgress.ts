"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";

import { SECTION_ORDER, TOTAL_SECTIONS, type SectionNumber } from "../lesson-sections";

interface UseLessonProgressOptions {
  unitId: string;
  section: number;
  setSection: Dispatch<SetStateAction<number>>;
}

const getProgressKey = (unitId: string) => `lesson-progress-${unitId}`;

export default function useLessonProgress({
  unitId,
  section,
  setSection,
}: UseLessonProgressOptions) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getProgressKey(unitId));
      if (saved) {
        const { section: savedSection } = JSON.parse(saved) as { section: number };

        if (savedSection > 1 && savedSection < TOTAL_SECTIONS) setSection(savedSection);
      }
    } catch {
      // Preserve the existing non-fatal behavior for malformed browser storage.
    }
  }, [setSection, unitId]);

  useEffect(() => {
    const orderIdx = SECTION_ORDER.indexOf(section as SectionNumber);
    const isFirstSection = orderIdx === 0;
    const isLastSection = orderIdx === SECTION_ORDER.length - 1;
    const progressKey = getProgressKey(unitId);

    if (isLastSection) {
      localStorage.removeItem(progressKey);
    } else if (!isFirstSection && orderIdx > 0) {
      localStorage.setItem(progressKey, JSON.stringify({ section }));
    }
  }, [section, unitId]);
}
