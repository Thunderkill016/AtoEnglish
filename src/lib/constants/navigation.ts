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

import { isCurriculumV2 } from "@/lib/v2/flag";

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

/**
 * Primary «Học» destination — Wave B1 product spine.
 * v2 flag ON → /home (daily CTA + B1 path); OFF → /dashboard (v1 hub).
 */
export function getPrimaryLearnHref(): string {
  return isCurriculumV2() ? "/home" : "/dashboard";
}

const hocNavItem = (): NavItem => ({
  title: "Học",
  href: getPrimaryLearnHref(),
  icon: BookOpen,
  description: "Tiếp tục bài học",
});

const onNavItem: NavItem = {
  title: "Ôn",
  href: "/flashcards",
  icon: Layers,
  description: "Ôn tập flashcard SRS",
};

const toiNavItem: NavItem = {
  title: "Tôi",
  href: "/me",
  icon: User,
  description: "Tiến độ, luyện tập & cài đặt",
};

// ─── Tier 1 — Bottom Nav (mobile) — 3-tab Hick-compliant shell (P1) ────────
// Học (home + continue) · Ôn (SRS) · Tôi (settings/profile)
/** Live list — call each render so flag matrix stays correct */
export function getBottomNavItems(): NavItem[] {
  return [hocNavItem(), onNavItem, toiNavItem];
}

/** @deprecated Prefer getBottomNavItems() — snapshot at first access for legacy imports */
export const bottomNavItems: NavItem[] = getBottomNavItems();

// ─── Tier 2 — Desktop Primary Nav — matches 3-tab shell ─────────────────────
export function getDesktopPrimaryNav(): NavItem[] {
  return [hocNavItem(), onNavItem, toiNavItem];
}

/** @deprecated Prefer getDesktopPrimaryNav() — snapshot at first access for legacy imports */
export const desktopPrimaryNav: NavItem[] = getDesktopPrimaryNav();

/** @deprecated V2 — links live on /me hub; kept for command palette / legacy */
export const desktopMoreItems: NavItem[] = [
  {
    title: "Bài học",
    href: "/learn",
    icon: BookOpen,
    description: "Danh sách 50 unit",
  },
  {
    title: "Luyện nói",
    href: "/speaking",
    icon: Mic,
    description: "Shadowing & AI Roleplay",
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
  const actions: NavItem[] = [
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
  ];
  // TASK-316: soft-hide XP leaderboard noise when curriculum v2
  if (!isCurriculumV2()) {
    actions.push({
      title: "Bảng xếp hạng",
      href: "/leaderboard",
      icon: Trophy,
      description: "XP leaderboard",
    });
  }
  return actions;
}

// ─── Legacy export — backward compat for components importing mainNavItems ────
export const mainNavItems: NavItem[] = [
  ...getDesktopPrimaryNav(),
  ...desktopMoreItems,
];
