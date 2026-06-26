import { UNITS } from "@/lib/constants/units";

export interface BusinessTrackUnit {
  id: string;
  icon: string;
  skill: string;
  why: string;
}

/** 10 units curated for career / workplace English */
export const BUSINESS_TRACK: BusinessTrackUnit[] = [
  { id: "unit-17", icon: "🏆", skill: "Kinh nghiệm & CV", why: "Present Perfect — nói về thành tích sự nghiệp, CV chuyên nghiệp" },
  { id: "unit-22", icon: "📋", skill: "Quy định & Công sở", why: "Must/Have to — phân biệt quy định bắt buộc vs khuyến nghị nơi làm việc" },
  { id: "unit-24", icon: "⚙️", skill: "Quy trình & Báo cáo", why: "Passive Voice — mô tả quy trình, viết báo cáo không cần chủ ngữ" },
  { id: "unit-25", icon: "🤝", skill: "Mô tả & Networking", why: "Relative Clauses — giới thiệu công ty, đồng nghiệp, đối tác tự nhiên" },
  { id: "unit-27", icon: "💬", skill: "Phrasal Verbs Công sở", why: "20 phrasal verbs thiết yếu: carry out, deal with, look into, follow up" },
  { id: "unit-28", icon: "⏳", skill: "Kinh nghiệm Lâu dài", why: "Pres. Perfect Continuous — 'I've been working here for 3 years'" },
  { id: "unit-29", icon: "🔧", skill: "Giải quyết Vấn đề", why: "Thảo luận vấn đề, đề xuất giải pháp — TOEIC Part 3 & meetings" },
  { id: "unit-31", icon: "📧", skill: "Email & Văn bản Formal", why: "Reporting verbs, formal tone, email structure — từ A đến Z" },
  { id: "unit-35", icon: "🤜", skill: "Đàm phán & Hợp đồng", why: "Advanced Conditionals — unless/provided that trong đàm phán" },
  { id: "unit-40", icon: "🎤", skill: "Thuyết trình & Cohesion", why: "30 discourse markers — nevertheless, furthermore, thereby — IELTS 6.5" },
];

export const BUSINESS_TRACK_UNIT_IDS = BUSINESS_TRACK.map((u) => u.id);

export type BusinessTrackProgress = {
  doneCount: number;
  total: number;
  percent: number;
  nextUnitId: string | null;
  nextRoute: string | null;
  nextSkill: string | null;
  isComplete: boolean;
};

export function getBusinessTrackProgress(
  completedUnitIds: Iterable<string>
): BusinessTrackProgress {
  const completed = new Set(completedUnitIds);
  const total = BUSINESS_TRACK.length;
  const doneCount = BUSINESS_TRACK.filter((u) => completed.has(u.id)).length;
  const next = BUSINESS_TRACK.find((u) => !completed.has(u.id));
  const nextMeta = next ? UNITS.find((u) => u.id === next.id) : undefined;

  return {
    doneCount,
    total,
    percent: total > 0 ? Math.round((doneCount / total) * 100) : 0,
    nextUnitId: next?.id ?? null,
    nextRoute: nextMeta?.route ?? null,
    nextSkill: next?.skill ?? null,
    isComplete: doneCount >= total,
  };
}