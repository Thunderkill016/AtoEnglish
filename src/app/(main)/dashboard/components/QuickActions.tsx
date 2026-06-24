import Link from "next/link";
import { Play, Mic, BookOpen, Trophy } from "lucide-react";


interface QuickActionsProps {
  currentUnitRoute: string;
}

const actions = (unitRoute: string) => [
  {
    href: unitRoute,
    icon: Play,
    label: "Học 10 phút",
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    hover: "hover:border-emerald-500/30 hover:bg-emerald-500/5",
  },
  {
    href: "/writing",
    icon: BookOpen,
    label: "Viết & Cải thiện",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    hover: "hover:border-blue-500/30 hover:bg-blue-500/5",
  },
  {
    href: "/pronunciation",
    icon: Mic,
    label: "Phát âm IPA",
    iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    hover: "hover:border-teal-500/30 hover:bg-teal-500/5",
  },
  {
    href: "/leaderboard",
    icon: Trophy,
    label: "Bảng xếp hạng",
    iconBg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    hover: "hover:border-yellow-500/30 hover:bg-yellow-500/5",
  },
];


export default function QuickActions({ currentUnitRoute }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions(currentUnitRoute).map(({ href, icon: Icon, label, iconBg, hover }) => (
        <Link key={href} href={href}>
          <div className={`flex items-center justify-center gap-2.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/25 backdrop-blur-sm px-4 py-3.5 transition-all duration-200 cursor-pointer active:scale-[0.97] ${hover}`}>
            <span className={`flex size-7 items-center justify-center rounded-lg shrink-0 ${iconBg}`}>
              <Icon className="size-3.5" />
            </span>
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap hidden sm:block">
              {label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
