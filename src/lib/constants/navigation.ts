import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Map,
  TrendingUp,
  Mic,
  FileCheck2,
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
    description: "Lộ trình từ A0 đến B1+ Tech English",
  },
  {
    title: "Speaking",
    href: "/speaking",
    icon: Mic,
    description: "Repeat, read-aloud, shadowing và phản hồi riêng tư",
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
    description: "Tiến độ học tập và SRS theo 4 phases",
  },
  {
    title: "Quality",
    href: "/quality",
    icon: FileCheck2,
    description: "Kiểm định chất lượng lesson",
  },
  {
    title: "Roadmap",
    href: "/roadmap",
    icon: Map,
    description: "Kế hoạch tự học 12 tháng từ A0 lên B1+",
  },
];
