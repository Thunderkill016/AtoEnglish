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
    description: "Lộ trình A0 đến IELTS 6.5",
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
    description: "Tiến độ kỹ năng, SRS và readiness IELTS",
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
    description: "Bản đồ từ mất gốc đến IELTS 6.5",
  },
];
