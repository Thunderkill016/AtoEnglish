import Link from "next/link";

import { getDashboardExploreActions } from "@/lib/constants/navigation";

interface QuickActionsProps {
  currentUnitRoute: string;
}

const actionStyles = [
  {
    iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    hover: "hover:border-emerald-500/30 hover:bg-emerald-500/5",
  },
  {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    hover: "hover:border-amber-500/30 hover:bg-amber-500/5",
  },
  {
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    hover: "hover:border-blue-500/30 hover:bg-blue-500/5",
  },
  {
    iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    hover: "hover:border-teal-500/30 hover:bg-teal-500/5",
  },
  {
    iconBg: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    hover: "hover:border-yellow-500/30 hover:bg-yellow-500/5",
  },
] as const;

export default function QuickActions({ currentUnitRoute }: QuickActionsProps) {
  const actions = getDashboardExploreActions(currentUnitRoute);

  return (
    <div>
      <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
        Khám phá thêm
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {actions.map(({ href, icon: Icon, title }, index) => {
          const style = actionStyles[index] ?? actionStyles[0];
          return (
            <Link key={href} href={href}>
              <div
                className={`flex items-center justify-center gap-2.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/25 backdrop-blur-sm px-4 py-3.5 transition-all duration-200 cursor-pointer active:scale-[0.97] ${style.hover}`}
              >
                <span className={`flex size-7 items-center justify-center rounded-lg shrink-0 ${style.iconBg}`}>
                  <Icon className="size-3.5" />
                </span>
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 whitespace-nowrap hidden sm:block">
                  {title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}