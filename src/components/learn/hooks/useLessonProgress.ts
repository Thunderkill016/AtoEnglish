"use client";

import { useEffect, type Dispatch, type SetStateAction } from "react";

import {
  SECTION_ORDER,
  type LessonSectionOrder,
  type SectionNumber,
} from "../lesson-sections";

interface UseLessonProgressOptions {
  unitId: string;
  section: number;
  setSection: Dispatch<SetStateAction<number>>;
  sectionOrder?: LessonSectionOrder;
}

const getProgressKey = (unitId: string) => `lesson-progress-${unitId}`;

export default function useLessonProgress({
  unitId,
  section,
  setSection,
  sectionOrder = SECTION_ORDER,
}: UseLessonProgressOptions) {
  useEffect(() => {
    try {
      const saved = localStorage.getItem(getProgressKey(unitId));
      if (saved) {
        const { section: savedSection } = JSON.parse(saved) as { section: number };
        const savedIndex = sectionOrder.indexOf(savedSection as SectionNumber);

        if (savedIndex > 0 && savedIndex < sectionOrder.length - 1) {
          setSection(savedSection);
        }
      }
    } catch {
      // Preserve the existing non-fatal behavior for malformed browser storage.
    }
  }, [sectionOrder, setSection, unitId]);

  useEffect(() => {
    const orderIdx = sectionOrder.indexOf(section as SectionNumber);
    const isFirstSection = orderIdx === 0;
    const isLastSection = orderIdx === sectionOrder.length - 1;
    const progressKey = getProgressKey(unitId);

    if (isLastSection) {
      localStorage.removeItem(progressKey);
    } else if (!isFirstSection && orderIdx > 0) {
      localStorage.setItem(progressKey, JSON.stringify({ section }));
    }
  }, [section, sectionOrder, unitId]);
}
