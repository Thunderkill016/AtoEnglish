import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Map,
  TrendingUp,
  Mic,
  PenLine,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Tổng quan tiến độ học tập",
  },
  {
    title: "Learn",
    href: "/learn",
    icon: BookOpen,
    description: "Bài học theo mô hình IPOR",
  },
  {
    title: "Speaking",
    href: "/speaking",
    icon: Mic,
    description: "Luyện phát âm Shadowing & AI Roleplay",
  },
  {
    title: "Writing",
    href: "/writing",
    icon: PenLine,
    description: "Viết & Cải thiện với AI feedback",
  },
  {
    title: "Flashcards",
    href: "/flashcards",
    icon: Layers,
    description: "Ôn tập SRS thông minh",
  },
  {
    title: "Progress",
    href: "/progress",
    icon: TrendingUp,
    description: "Thống kê và thành tích",
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
    description: "Lộ trình A1 → C1",
  },
];