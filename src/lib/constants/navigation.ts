import {
  BookOpen,
  LayoutDashboard,
  Library,
  PlusCircle,
  Settings,
  Sparkles,
  User,
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

export type DashboardSection = {
  id: string;
  label: string;
  icon: LucideIcon;
};

export const dashboardSections: DashboardSection[] = [
  { id: "dash-today", label: "Hôm nay", icon: Zap },
  { id: "dash-practice", label: "Bài của tôi", icon: Library },
];

export const bottomNavItems: NavItem[] = [
  {
    title: "Tạo bài",
    href: "/real-talk/create",
    icon: PlusCircle,
    description: "Dán video YouTube",
  },
  {
    title: "Bài của tôi",
    href: "/real-talk",
    icon: Library,
    description: "Tiếp tục hoặc xem lại",
  },
  {
    title: "Tôi",
    href: "/me",
    icon: User,
    description: "Tài khoản và cài đặt",
  },
];

export const desktopPrimaryNav: NavItem[] = [
  {
    title: "Tạo bài",
    href: "/real-talk/create",
    icon: PlusCircle,
    description: "Biến video YouTube thành bài học riêng",
  },
  {
    title: "Bài của tôi",
    href: "/real-talk",
    icon: Library,
    description: "Tiếp tục hoặc xem lại bài đã tạo",
  },
  {
    title: "Tôi",
    href: "/me",
    icon: User,
    description: "Tài khoản và cài đặt",
  },
];

/**
 * Legacy routes remain deployed during convergence but are intentionally absent
 * from primary learner navigation. This keeps the MVP promise coherent without
 * deleting unrelated code in the same change.
 */
export const desktopMoreItems: NavItem[] = [];

export const mobilePanelGroups: NavGroup[] = [
  {
    label: "HỌC TỪ VIDEO",
    items: [
      {
        title: "Tổng quan",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Hành động tiếp theo",
      },
      {
        title: "Tạo bài mới",
        href: "/real-talk/create",
        icon: Sparkles,
        description: "Dán link YouTube",
      },
      {
        title: "Thư viện riêng",
        href: "/real-talk",
        icon: Library,
        description: "Bài AI draft của bạn",
      },
    ],
  },
  {
    label: "TÀI KHOẢN",
    items: [
      {
        title: "Tôi",
        href: "/me",
        icon: User,
        description: "Tài khoản",
      },
      {
        title: "Cài đặt",
        href: "/settings",
        icon: Settings,
        description: "Tùy chọn tài khoản",
      },
    ],
  },
];

export function getDashboardExploreActions(_unitRoute: string): NavItem[] {
  return [
    {
      title: "Tạo bài từ YouTube",
      href: "/real-talk/create",
      icon: PlusCircle,
      description: "Dán video bạn muốn hiểu",
    },
    {
      title: "Mở thư viện riêng",
      href: "/real-talk",
      icon: BookOpen,
      description: "Tiếp tục bài đã tạo",
    },
  ];
}

export const mainNavItems: NavItem[] = [
  ...desktopPrimaryNav,
  ...desktopMoreItems,
];
