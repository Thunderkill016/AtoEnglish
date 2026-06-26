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

export type MeHubItem = {
  href: string;
  label: string;
  description?: string;
  icon: LucideIcon;
};

export const meHubStudy: MeHubItem[] = [
  {
    href: "/progress",
    label: "Tiến độ",
    description: "XP, streak, thành tích",
    icon: TrendingUp,
  },
  {
    href: "/roadmap",
    label: "Lộ trình",
    description: "A0 → B2 · 50 unit",
    icon: Map,
  },
  {
    href: "/learn",
    label: "Bài học",
    description: "Danh sách 50 unit",
    icon: BookOpen,
  },
];

export const meHubPractice: MeHubItem[] = [
  {
    href: "/speaking",
    label: "Luyện nói",
    description: "Shadowing & roleplay",
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

export const meHubMore: MeHubItem[] = [
  {
    href: "/leaderboard",
    label: "Bảng xếp hạng",
    description: "Top XP tuần này",
    icon: Trophy,
  },
  {
    href: "/business",
    label: "Business English",
    description: "Tiếng Anh công sở",
    icon: Briefcase,
  },
  {
    href: "/grammar",
    label: "Ngữ pháp",
    description: "Chủ điểm A0–B2",
    icon: BookOpen,
  },
  {
    href: "/pronunciation",
    label: "Phát âm IPA",
    description: "44 âm tiếng Anh",
    icon: Mic,
  },
];

export const meHubAccount: MeHubItem[] = [
  {
    href: "/settings",
    label: "Cài đặt",
    description: "Thông báo, tài khoản",
    icon: Settings,
  },
];