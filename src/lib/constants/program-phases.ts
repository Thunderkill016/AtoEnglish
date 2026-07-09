/**
 * Curriculum program phases — design SSOT: CURRICULUM_PROGRAM.md
 * Core outcome B1: product-outcome.ts / LESSON_SYSTEM_FOUNDATION.md §0
 *
 * Unit ids follow src/lib/constants/units.ts — do not invent parallel paths.
 */

import { CORE_PATH, EXTENSION_PATH } from "@/lib/constants/product-outcome";

export type ProgramPhaseId = "P0" | "P1" | "P2" | "P3" | "P4";

export interface ProgramPhase {
  id: ProgramPhaseId;
  cefr: "A0" | "A1" | "A2" | "B1" | "B2";
  titleVi: string;
  titleEn: string;
  /** Inclusive unit id range in curriculum order */
  startUnitId: string;
  endUnitId: string;
  unitCount: number;
  /** Is this required for core “dùng được” outcome? */
  isCore: boolean;
  /** Exit can-do summaries (VI) — for checkpoint / roadmap UI */
  exitCanDoVi: string[];
  /** Optional gate after this phase */
  gate?: "A2" | "B1";
}

/** Four core phases + B2 extension */
export const PROGRAM_PHASES: readonly ProgramPhase[] = [
  {
    id: "P0",
    cefr: "A0",
    titleVi: "Nền tảng zero",
    titleEn: "Foundation",
    startUnitId: "unit-a0-1",
    endUnitId: "unit-a0-8",
    unitCount: 8,
    isCore: true,
    exitCanDoVi: [
      "Đọc và phát âm chữ cái, số cơ bản",
      "Chào hỏi, nói tên và thông tin cá nhân rất đơn giản",
      "Dùng cụm sinh tồn / khẩn cấp tối thiểu",
    ],
  },
  {
    id: "P1",
    cefr: "A1",
    titleVi: "Đời sống hàng ngày",
    titleEn: "Everyday",
    startUnitId: "unit-1",
    endUnitId: "unit-12",
    unitCount: 12,
    isCore: true,
    exitCanDoVi: [
      "Giới thiệu bản thân và hỏi thăm",
      "Nói về routine, sở thích, mua sắm, đồ ăn, chỉ đường",
      "Hội thoại ngắn 2–4 phút topic quen (cần hỗ trợ)",
    ],
  },
  {
    id: "P2",
    cefr: "A2",
    titleVi: "Giao tiếp chức năng",
    titleEn: "Functional survival",
    startUnitId: "unit-13",
    endUnitId: "unit-18",
    unitCount: 6,
    isCore: true,
    gate: "A2",
    exitCanDoVi: [
      "Kể quá khứ đơn giản và nói kế hoạch",
      "Xử lý travel / shopping so sánh cơ bản",
      "Hội thoại 4–6 phút; bắt đầu paraphrase khi kẹt",
    ],
  },
  {
    id: "P3",
    cefr: "B1",
    titleVi: "Dùng độc lập (đích chương trình)",
    titleEn: "Independent user — core target",
    startUnitId: "unit-19",
    endUnitId: CORE_PATH.endUnitId,
    unitCount: 14,
    isCore: true,
    gate: "B1",
    exitCanDoVi: [
      "Hội thoại topic quen 5–10 phút không script",
      "Hiểu ý chính khi nghe rõ về work / daily / tin đơn giản",
      "Kể trải nghiệm, đưa lý do, xử lý khi không hiểu",
      "Intelligibility: người lạ hiểu phần lớn không cần lặp nhiều",
    ],
  },
  {
    id: "P4",
    cefr: "B2",
    titleVi: "Nâng cao (tự phát triển sau B1)",
    titleEn: "Extension after B1",
    startUnitId: EXTENSION_PATH.startUnitId,
    endUnitId: EXTENSION_PATH.endUnitId,
    unitCount: 10,
    isCore: false,
    exitCanDoVi: [
      "Giả định, tiếc nuối, điều kiện phức tạp",
      "Văn phong formal / thuyết phục / liên kết ý",
      "Chủ đề exam / academic light",
    ],
  },
] as const;

/** B1 band modules (content design only — unit order unchanged) */
export const B1_MODULES = [
  {
    id: "M1",
    titleVi: "Kể chuyện & thế giới",
    unitIds: ["unit-19", "unit-20", "unit-21"],
  },
  {
    id: "M2",
    titleVi: "Quy tắc & logic",
    unitIds: ["unit-22", "unit-23", "unit-24"],
  },
  {
    id: "M3",
    titleVi: "Con người & hành động",
    unitIds: ["unit-25", "unit-26", "unit-27", "unit-28"],
  },
  {
    id: "M4",
    titleVi: "Vấn đề & công việc → cổng B1",
    unitIds: ["unit-29", "unit-30", "unit-31", "unit-32"],
  },
] as const;

export function getPhaseByCefr(
  cefr: ProgramPhase["cefr"],
): ProgramPhase | undefined {
  return PROGRAM_PHASES.find((p) => p.cefr === cefr);
}

export function getCorePhases(): ProgramPhase[] {
  return PROGRAM_PHASES.filter((p) => p.isCore);
}
