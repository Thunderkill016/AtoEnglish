/**
 * Ato Surface — design-system class maps (pure, unit-testable).
 * SSOT for glass surfaces + CTA variants. No React.
 * See docs/UI_SYSTEM.md
 */

export type SurfaceVariant = "default" | "interactive" | "success" | "warn" | "danger";
export type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type AppButtonSize = "sm" | "md" | "lg";

/** Soft glass card (zinc-950 dark brand). */
export const SURFACE_VARIANT: Record<SurfaceVariant, string> = {
  default:
    "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]",
  interactive:
    "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)] transition hover:border-emerald-500/30 hover:bg-white/[0.07] active:scale-[0.99]",
  success:
    "rounded-3xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-xl",
  warn: "rounded-3xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-xl",
  danger:
    "rounded-3xl border border-red-500/30 bg-red-500/10 backdrop-blur-xl",
};

export const APP_BUTTON_VARIANT: Record<AppButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-black shadow-lg shadow-emerald-900/25 hover:brightness-110",
  secondary:
    "border border-white/15 bg-white/5 text-zinc-100 font-semibold hover:bg-white/10",
  ghost: "bg-transparent text-zinc-300 font-semibold hover:bg-white/5",
  danger:
    "border border-red-500/40 bg-red-500/15 text-red-200 font-bold hover:bg-red-500/25",
};

export const APP_BUTTON_SIZE: Record<AppButtonSize, string> = {
  sm: "min-h-10 px-3.5 text-xs rounded-xl gap-1.5",
  md: "min-h-11 px-5 text-sm rounded-2xl gap-2",
  lg: "min-h-12 px-6 text-sm rounded-2xl gap-2",
};

/** Shared focus ring (a11y). */
export const ATO_FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

/** Label / eyebrow style used on Home + shells. */
export const ATO_EYEBROW =
  "text-[11px] font-bold uppercase tracking-widest text-emerald-400";

/** Soft ambient brand glows (optional Screen prop). */
export const ATO_AMBIENT =
  "pointer-events-none absolute top-0 right-0 -z-10 h-[280px] w-[50vw] max-w-[360px] rounded-full bg-emerald-500/10 blur-[100px]";
