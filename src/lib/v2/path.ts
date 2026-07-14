/**
 * Core program path v2 — A0→B1 only at launch.
 * Exact lesson list grows as content is authored; registry is source of truth.
 */

import type { LessonPhase, LessonSpec } from "@/lib/v2/lesson-spec";

export interface PathLessonMeta {
  id: string;
  phase: LessonPhase;
  cefr: LessonSpec["cefr"];
  title_vi: string;
  order: number;
}

/**
 * Planned spine (titles may refine). Only lessons with content files are playable.
 * order is global 1..N along core path.
 */
export const CORE_PATH_PLAN: readonly PathLessonMeta[] = [
  // P0 A0 — 8
  { id: "l-a0-01", phase: "P0", cefr: "A0", title_vi: "Chữ cái & âm cơ bản", order: 1 },
  { id: "l-a0-02", phase: "P0", cefr: "A0", title_vi: "Số đếm & giá cơ bản", order: 2 },
  { id: "l-a0-03", phase: "P0", cefr: "A0", title_vi: "Chào hỏi đơn giản", order: 3 },
  { id: "l-a0-04", phase: "P0", cefr: "A0", title_vi: "Tên & quốc tịch", order: 4 },
  { id: "l-a0-05", phase: "P0", cefr: "A0", title_vi: "Gia đình cơ bản", order: 5 },
  { id: "l-a0-06", phase: "P0", cefr: "A0", title_vi: "Thời gian trong ngày", order: 6 },
  { id: "l-a0-07", phase: "P0", cefr: "A0", title_vi: "Ngày trong tuần", order: 7 },
  { id: "l-a0-08", phase: "P0", cefr: "A0", title_vi: "Cụm sinh tồn", order: 8 },
  // P1 A1 — 12
  { id: "l-a1-01", phase: "P1", cefr: "A1", title_vi: "Chào hỏi & giới thiệu", order: 9 },
  { id: "l-a1-02", phase: "P1", cefr: "A1", title_vi: "Thông tin cá nhân", order: 10 },
  { id: "l-a1-03", phase: "P1", cefr: "A1", title_vi: "Gia đình & bạn bè", order: 11 },
  { id: "l-a1-04", phase: "P1", cefr: "A1", title_vi: "Thói quen hàng ngày", order: 12 },
  { id: "l-a1-05", phase: "P1", cefr: "A1", title_vi: "Sở thích", order: 13 },
  { id: "l-a1-06", phase: "P1", cefr: "A1", title_vi: "Nhà cửa", order: 14 },
  { id: "l-a1-07", phase: "P1", cefr: "A1", title_vi: "Mua sắm", order: 15 },
  { id: "l-a1-08", phase: "P1", cefr: "A1", title_vi: "Đồ ăn & order", order: 16 },
  { id: "l-a1-09", phase: "P1", cefr: "A1", title_vi: "Địa điểm & chỉ đường", order: 17 },
  { id: "l-a1-10", phase: "P1", cefr: "A1", title_vi: "Khả năng (can)", order: 18 },
  { id: "l-a1-11", phase: "P1", cefr: "A1", title_vi: "Sức khỏe & cảm xúc", order: 19 },
  { id: "l-a1-12", phase: "P1", cefr: "A1", title_vi: "Ôn A1 & áp dụng", order: 20 },
  // P2 A2 — 8
  { id: "l-a2-01", phase: "P2", cefr: "A2", title_vi: "Kể chuyện quá khứ", order: 21 },
  { id: "l-a2-02", phase: "P2", cefr: "A2", title_vi: "Kế hoạch tương lai", order: 22 },
  { id: "l-a2-03", phase: "P2", cefr: "A2", title_vi: "So sánh & mua sắm", order: 23 },
  { id: "l-a2-04", phase: "P2", cefr: "A2", title_vi: "Du lịch & trải nghiệm", order: 24 },
  { id: "l-a2-05", phase: "P2", cefr: "A2", title_vi: "Kinh nghiệm (Present Perfect)", order: 25 },
  { id: "l-a2-06", phase: "P2", cefr: "A2", title_vi: "Công việc cơ bản", order: 26 },
  { id: "l-a2-07", phase: "P2", cefr: "A2", title_vi: "Vấn đề nhỏ & nhờ giúp", order: 27 },
  { id: "l-a2-08", phase: "P2", cefr: "A2", title_vi: "Cổng A2", order: 28 },
  // P3 B1 — 14
  { id: "l-b1-01", phase: "P3", cefr: "B1", title_vi: "Kể chuyện dài hơn", order: 29 },
  { id: "l-b1-02", phase: "P3", cefr: "B1", title_vi: "Tin tức & ý chính", order: 30 },
  { id: "l-b1-03", phase: "P3", cefr: "B1", title_vi: "Dự đoán & xu hướng", order: 31 },
  { id: "l-b1-04", phase: "P3", cefr: "B1", title_vi: "Quy định & nghĩa vụ", order: 32 },
  { id: "l-b1-05", phase: "P3", cefr: "B1", title_vi: "Điều kiện if/when", order: 33 },
  { id: "l-b1-06", phase: "P3", cefr: "B1", title_vi: "Mô tả quy trình", order: 34 },
  { id: "l-b1-07", phase: "P3", cefr: "B1", title_vi: "Mô tả người & nơi", order: 35 },
  { id: "l-b1-08", phase: "P3", cefr: "B1", title_vi: "Sở thích & ý kiến", order: 36 },
  { id: "l-b1-09", phase: "P3", cefr: "B1", title_vi: "Nhờ làm hộ (get things done)", order: 37 },
  { id: "l-b1-10", phase: "P3", cefr: "B1", title_vi: "Kinh nghiệm dài (PPC)", order: 38 },
  { id: "l-b1-11", phase: "P3", cefr: "B1", title_vi: "Vấn đề & giải pháp", order: 39 },
  { id: "l-b1-12", phase: "P3", cefr: "B1", title_vi: "Sức khỏe & xã hội", order: 40 },
  { id: "l-b1-13", phase: "P3", cefr: "B1", title_vi: "Giao tiếp công sở", order: 41 },
  { id: "l-b1-14", phase: "P3", cefr: "B1", title_vi: "Cổng B1 — dùng được", order: 42 },
] as const;

export const CORE_PATH_TOTAL = CORE_PATH_PLAN.length;
export const CORE_END_LESSON_ID = "l-b1-14";

export function getPathMeta(lessonId: string): PathLessonMeta | undefined {
  return CORE_PATH_PLAN.find((l) => l.id === lessonId);
}

export function getLessonsByPhase(phase: LessonPhase): PathLessonMeta[] {
  return CORE_PATH_PLAN.filter((l) => l.phase === phase);
}
