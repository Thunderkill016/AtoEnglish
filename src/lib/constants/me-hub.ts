import {
  BookOpen,
  Briefcase,
  Layers,
  Map,
  Mic,
  PenLine,
  Settings,
  Target,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import {
  CORE_OUTCOME_CEFR,
  CORE_OUTCOME_PROMISE_VI,
} from "@/lib/constants/product-outcome";
import { isCurriculumV2 } from "@/lib/v2/flag";

export type MeHubItem = {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
};

/** B1 Independent User — north star copy for Me hub (Wave B1) */
export const ME_HUB_OUTCOME_LINE = CORE_OUTCOME_PROMISE_VI;

export function getMeHubStudy(): MeHubItem[] {
  const v2 = isCurriculumV2();
  return [
    {
      href: "/progress",
      label: "Tiến độ",
      description: v2
        ? `Streak & mục tiêu ngày · hướng ${CORE_OUTCOME_CEFR}`
        : `XP, streak · hướng ${CORE_OUTCOME_CEFR} Independent`,
      icon: TrendingUp,
    },
    {
      href: v2 ? "/path" : "/roadmap",
      label: "Lộ trình",
      description: `A0 → ${CORE_OUTCOME_CEFR} · Independent User`,
      icon: Map,
    },
    {
      href: v2 ? "/home" : "/learn",
      label: "Bài học",
      description: v2
        ? `Tiếp tục tới ${CORE_OUTCOME_CEFR} — dùng được tiếng Anh`
        : "Danh sách unit · đích B1 Independent",
      icon: BookOpen,
    },
  ];
}

/** Snapshot for simple imports; prefer getMeHubStudy() when flag may change */
export const meHubStudy: MeHubItem[] = getMeHubStudy();

export const meHubPractice: MeHubItem[] = [
  {
    href: "/speaking",
    label: "Luyện nói",
    description: "Shadowing & roleplay — nói được B1",
    icon: Mic,
  },
  {
    href: "/writing",
    label: "Viết",
    description: "AI feedback",
    icon: PenLine,
  },
  {
    href: "/quiz",
    label: "Quiz từ vựng",
    description: "Trắc nghiệm theo unit",
    icon: Layers,
  },
  {
    href: "/challenge",
    label: "Thử thách ngày",
    description: "5 câu vocab",
    icon: Target,
  },
];

/** Secondary practice extras — soft-hide league/XP leaderboard when curriculum v2 (TASK-316) */
export function getMeHubMore(): MeHubItem[] {
  const items: MeHubItem[] = [
    {
      href: "/business",
      label: "Business English",
      description: "Tiếng Anh công sở (sau B1)",
      icon: Briefcase,
    },
    {
      href: "/grammar",
      label: "Ngữ pháp",
      description: "Chủ điểm A0–B1",
      icon: BookOpen,
    },
    {
      href: "/pronunciation",
      label: "Phát âm IPA",
      description: "44 âm tiếng Anh",
      icon: Mic,
    },
  ];
  if (!isCurriculumV2()) {
    items.unshift({
      href: "/leaderboard",
      label: "Bảng xếp hạng",
      description: "Top XP tuần này",
      icon: Trophy,
    });
  }
  return items;
}

/** @deprecated Prefer getMeHubMore() — snapshot at first access */
export const meHubMore: MeHubItem[] = getMeHubMore();

export const meHubAccount: MeHubItem[] = [
  {
    href: "/settings",
    label: "Cài đặt",
    description: "Thông báo, tài khoản",
    icon: Settings,
  },
];
