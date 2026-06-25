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
  Settings,
  Play,
  Target,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

/** In-dashboard section anchors (sticky hub nav on /dashboard) */
export type DashboardSection = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const dashboardSections: DashboardSection[] = [
  { id: "dash-today", label: "Hôm nay", icon: Zap },
  { id: "dash-practice", label: "Luyện tập", icon: Layers },
  { id: "dash-progress", label: "Tiến độ", icon: TrendingUp },
];

// ─── Tier 1 — Bottom Nav (mobile, always visible) ────────────────────────────
// 5 tabs — nhãn tiếng Việt ngắn gọn (Apple HIG: ≤5 tabs, label ≤10 ký tự)
// Trang chủ → Học → Ôn tập → Nói → Tôi
export const bottomNavItems: NavItem[] = [
  {
    title: "Trang chủ",
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
    title: "Ôn tập",
    href: "/flashcards",
    icon: Layers,
    description: "Ôn tập flashcard SRS",
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

// ─── Tier 2 — Desktop Primary Nav (md+, 4 tabs + Thêm) ──────────────────────
// Trang chủ · Học · Luyện · Ôn — gọn header, khớp bottom nav
export const desktopPrimaryNav: NavItem[] = [
  {
    title: "Trang chủ",
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
    title: "Luyện",
    href: "/speaking",
    icon: Mic,
    description: "Shadowing & AI Roleplay",
  },
  {
    title: "Ôn",
    href: "/flashcards",
    icon: Layers,
    description: "Ôn tập flashcard SRS",
  },
];

// ─── Tier 3 — Desktop "Thêm" dropdown ───────────────────────────────────────
export const desktopMoreItems: NavItem[] = [
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
  {
    title: "Bảng xếp hạng",
    href: "/leaderboard",
    icon: Trophy,
    description: "Top học viên theo XP",
  },
  {
    title: "Lộ trình",
    href: "/roadmap",
    icon: Map,
    description: "Lộ trình A0 → C1",
  },
  {
    title: "Business",
    href: "/business",
    icon: Briefcase,
    description: "Tiếng Anh công sở",
  },
];

// ─── Mobile slide panel (grouped drawer) ─────────────────────────────────────
export const mobilePanelGroups: NavGroup[] = [
  {
    label: "HỌC TẬP",
    items: [
      { title: "Trang chủ", href: "/dashboard", icon: LayoutDashboard, description: "Tổng quan hôm nay" },
      { title: "Bài học", href: "/learn", icon: BookOpen, description: "IPOR lessons" },
      { title: "Luyện nói", href: "/speaking", icon: Mic, description: "Shadowing & AI" },
      { title: "Viết văn", href: "/writing", icon: PenLine, description: "AI feedback" },
      { title: "Ôn tập", href: "/flashcards", icon: Layers, description: "Flashcard SRS" },
    ],
  },
  {
    label: "THEO DÕI",
    items: [
      { title: "Tiến độ", href: "/progress", icon: TrendingUp, description: "Stats & XP" },
      { title: "Bảng xếp hạng", href: "/leaderboard", icon: Trophy, description: "Top learners" },
      { title: "Lộ trình", href: "/roadmap", icon: Map, description: "A0 → C1" },
    ],
  },
  {
    label: "KHÁC",
    items: [
      { title: "Business English", href: "/business", icon: Briefcase, description: "Công sở & sự nghiệp" },
      { title: "Cài đặt", href: "/settings", icon: Settings, description: "Tài khoản" },
    ],
  },
];

/** Secondary shortcuts at bottom of dashboard (explore, not daily loop) */
export function getDashboardExploreActions(unitRoute: string): NavItem[] {
  return [
    {
      title: "Học 10 phút",
      href: unitRoute,
      icon: Play,
      description: "Tiếp tục bài đang học",
    },
    {
      title: "Thử Thách",
      href: "/challenge",
      icon: Target,
      description: "Daily vocab challenge",
    },
    {
      title: "Viết & Cải thiện",
      href: "/writing",
      icon: PenLine,
      description: "AI writing feedback",
    },
    {
      title: "Phát âm IPA",
      href: "/pronunciation",
      icon: Mic,
      description: "IPA drills",
    },
    {
      title: "Bảng xếp hạng",
      href: "/leaderboard",
      icon: Trophy,
      description: "XP leaderboard",
    },
  ];
}

// ─── Legacy export — backward compat for components importing mainNavItems ────
export const mainNavItems: NavItem[] = [
  ...desktopPrimaryNav,
  ...desktopMoreItems,
];