import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** Icon size in pixels */
  size?: "sm" | "md" | "lg";
  /** Whether to show the text label beside the icon */
  showText?: boolean;
  /** Override link href */
  href?: string;
  className?: string;
  /** Force icon color scheme regardless of dark mode */
  variant?: "auto" | "light" | "dark";
}

const sizes = {
  sm: { icon: 32, iconClass: "size-8", iconInner: 16, text: "text-sm", sub: "text-[9px]" },
  md: { icon: 36, iconClass: "size-9", iconInner: 18, text: "text-base", sub: "text-[10px]" },
  lg: { icon: 44, iconClass: "size-11", iconInner: 22, text: "text-lg", sub: "text-[11px]" },
};

/**
 * AtoEnglish branded Logo component.
 * Uses a custom inline SVG — consistent across all pages.
 */
export default function Logo({
  size = "md",
  showText = true,
  href = "/",
  className,
  variant = "auto",
}: LogoProps) {
  const s = sizes[size];

  const iconBg =
    variant === "light"
      ? "bg-emerald-500"
      : variant === "dark"
      ? "bg-emerald-500"
      : "bg-emerald-600 dark:bg-emerald-500";

  const textColor =
    variant === "light"
      ? "text-white"
      : variant === "dark"
      ? "text-zinc-900"
      : "text-zinc-900 dark:text-zinc-50";

  const subColor =
    variant === "light"
      ? "text-white/60"
      : variant === "dark"
      ? "text-zinc-500"
      : "text-zinc-500 dark:text-zinc-400";

  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 group", className)}
      aria-label="AtoEnglish — Trang chủ"
    >
      {/* Icon */}
      <span
        className={cn(
          s.iconClass,
          "flex items-center justify-center rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105",
          iconBg
        )}
      >
        {/* Custom AtoEnglish leaf/sprout SVG */}
        <svg
          width={s.iconInner}
          height={s.iconInner}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          {/* Stem */}
          <path
            d="M12 21V11"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Left leaf */}
          <path
            d="M12 15C12 15 7 14 5 10C5 10 9 7 12 11"
            fill="white"
            fillOpacity="0.85"
            stroke="white"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          {/* Right leaf */}
          <path
            d="M12 11C12 11 15 7 19 9C19 9 18 13 12 13"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
          {/* Top bud */}
          <circle cx="12" cy="7" r="2.2" fill="white" />
        </svg>
      </span>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-none text-left">
          <span
            className={cn(
              s.text,
              "font-bold tracking-tight transition-colors duration-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
              textColor
            )}
          >
            AtoEnglish
          </span>
          <span className={cn(s.sub, "font-medium mt-0.5", subColor)}>
            Grow every day
          </span>
        </div>
      )}
    </Link>
  );
}
