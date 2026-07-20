/**
 * Compat maps for legacy design-system components.
 * SSOT for NEW UI: docs/design/UI_SYSTEM.md + src/components/ui (shadcn).
 * Prefer semantic tokens (bg-card, bg-primary) over glass utilities.
 */

export type SurfaceVariant = "default" | "interactive" | "success" | "warn" | "danger";
export type AppButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type AppButtonSize = "sm" | "md" | "lg";

/** Card-like panels — shadcn Card language (no heavy glass). */
export const SURFACE_VARIANT: Record<SurfaceVariant, string> = {
  default: "rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10",
  interactive:
    "rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10 transition hover:ring-primary/30 hover:bg-muted/40 active:scale-[0.99]",
  success: "rounded-xl bg-primary/10 text-card-foreground ring-1 ring-primary/25",
  warn: "rounded-xl bg-amber-500/10 text-card-foreground ring-1 ring-amber-500/25",
  danger: "rounded-xl bg-destructive/10 text-card-foreground ring-1 ring-destructive/25",
};

/** Maps to shadcn Button intent (implemented via ui/button in AppButton). */
export const APP_BUTTON_VARIANT: Record<AppButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm",
  secondary:
    "border border-border bg-background text-foreground hover:bg-muted font-medium",
  ghost: "bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground font-medium",
  danger:
    "border border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 font-semibold",
};

export const APP_BUTTON_SIZE: Record<AppButtonSize, string> = {
  sm: "min-h-9 h-9 px-3 text-xs rounded-lg gap-1.5",
  md: "min-h-10 h-10 px-4 text-sm rounded-lg gap-2",
  lg: "min-h-11 h-11 px-5 text-sm rounded-lg gap-2",
};

export const ATO_FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const ATO_EYEBROW =
  "text-[11px] font-semibold uppercase tracking-widest text-primary";

/** Soft brand wash — optional, keep subtle (not full glass stack). */
export const ATO_AMBIENT =
  "pointer-events-none absolute top-0 right-0 -z-10 h-[240px] w-[45vw] max-w-[320px] rounded-full bg-primary/10 blur-[90px]";
