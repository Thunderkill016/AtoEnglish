import {
  BookOpen,
  LayoutDashboard,
  Layers,
  Map,
  TrendingUp,
  Mic,
  PenLine,
  Trophy,
  Briefcase,
  User,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

// ─── Tier 1 — Bottom Nav (mobile, always visible) ────────────────────────────
// 5 tabs: optimal per Apple HIG + Google Material guidelines
// Priority: Home → Learn → SRS habit → Speaking (was hidden!) → Profile
export const bottomNavItems: NavItem[] = [
  {
    title: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Tổng quan học tập",
  },
  {
    title: "Học",
    href: "/learn",
    icon: BookOpen,
    description: "Bài học theo IPOR",
  },
  {
    title: "SRS",
    href: "/flashcards",
    icon: Layers,
    description: "Ôn tập flashcard thông minh",
  },
  {
    title: "Nói",
    href: "/speaking",
    icon: Mic,
    description: "Luyện phát âm & AI roleplay",
  },
  {
    title: "Tôi",
    href: "/progress",
    icon: User,
    description: "Tiến độ & thành tích",
  },
];

// ─── Tier 2 — Desktop Primary Nav (md+, visible in header) ───────────────────
export const desktopPrimaryNav: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    description: "Tổng quan tiến độ học tập",
  },
  {
    title: "Học",
    href: "/learn",
    icon: BookOpen,
    description: "Bài học theo mô hình IPOR",
  },
  {
    title: "Luyện nói",
    href: "/speaking",
    icon: Mic,
    description: "Shadowing & AI Roleplay",
  },
  {
    title: "Flashcards",
    href: "/flashcards",
    icon: Layers,
    description: "Ôn tập SRS thông minh",
  },
  {
    title: "Viết",
    href: "/writing",
    icon: PenLine,
    description: "Viết & cải thiện với AI",
  },
  {
    title: "Tiến độ",
    href: "/progress",
    icon: TrendingUp,
    description: "Thống kê và thành tích",
  },
];

// ─── Tier 3 — Desktop "More" dropdown ────────────────────────────────────────
export const desktopMoreItems: NavItem[] = [
  {
    title: "Bảng xếp hạng",
    href: "/leaderboard",
    icon: Trophy,
    description: "Top học viên theo XP",
  },
  {
    title: "Business",
    href: "/business",
    icon: Briefcase,
    description: "Tiếng Anh công sở",
  },
  {
    title: "Lộ trình",
    href: "/roadmap",
    icon: Map,
    description: "A1 → C1 study path",
  },
];

// ─── Legacy export — backward compat for components importing mainNavItems ────
export const mainNavItems: NavItem[] = [
  ...desktopPrimaryNav,
  ...desktopMoreItems,
];