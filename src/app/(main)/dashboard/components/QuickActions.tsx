import Link from "next/link";

import { getDashboardExploreActions } from "@/lib/constants/navigation";
import { Surface } from "@/components/design-system";

interface QuickActionsProps {
  currentUnitRoute: string;
}

const actionStyles = [
  {
    iconBg: "bg-emerald-500/10 text-emerald-400",
    hover: "hover:border-emerald-500/30",
  },
  {
    iconBg: "bg-amber-500/10 text-amber-400",
    hover: "hover:border-amber-500/30",
  },
  {
    iconBg: "bg-blue-500/10 text-blue-400",
    hover: "hover:border-blue-500/30",
  },
  {
    iconBg: "bg-teal-500/10 text-teal-400",
    hover: "hover:border-teal-500/30",
  },
  {
    iconBg: "bg-yellow-500/10 text-yellow-400",
    hover: "hover:border-yellow-500/30",
  },
] as const;

export default function QuickActions({ currentUnitRoute }: QuickActionsProps) {
  const actions = getDashboardExploreActions(currentUnitRoute);

  return (
    <div>
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
        Khám phá thêm
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {actions.map(({ href, icon: Icon, title }, index) => {
          const style = actionStyles[index] ?? actionStyles[0];
          return (
            <Link key={href} href={href}>
              <Surface
                variant="interactive"
                className={`flex items-center justify-center gap-2.5 rounded-2xl px-4 py-3.5 ${style.hover}`}
              >
                <span className={`flex size-7 items-center justify-center rounded-lg shrink-0 ${style.iconBg}`}>
                  <Icon className="size-3.5" />
                </span>
                <span className="text-xs font-bold text-zinc-300 whitespace-nowrap hidden sm:block">
                  {title}
                </span>
              </Surface>
            </Link>
          );
        })}
      </div>
    </div>
  );
}