import Link from "next/link";
import { cn } from "@/lib/utils";

type MinimalButtonVariant = "primary" | "secondary" | "ghost";

interface MinimalButtonBaseProps {
  variant?: MinimalButtonVariant;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  "data-testid"?: string;
}

interface MinimalButtonAsButton extends MinimalButtonBaseProps {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface MinimalButtonAsLink extends MinimalButtonBaseProps {
  href: string;
  onClick?: () => void;
}

export type MinimalButtonProps = MinimalButtonAsButton | MinimalButtonAsLink;

const variantClasses: Record<MinimalButtonVariant, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 font-bold",
  secondary:
    "bg-muted text-foreground border border-border/70 hover:bg-muted/80 font-semibold",
  ghost: "bg-transparent text-foreground hover:bg-muted/60 font-medium",
};

/** Single CTA style app-wide — flat, no gradient (V2) */
export function MinimalButton({
  variant = "primary",
  children,
  className,
  fullWidth = false,
  onClick,
  "data-testid": testId,
  ...rest
}: MinimalButtonProps) {
  const classes = cn(
    "inline-flex min-h-[var(--minimal-touch)] items-center justify-center gap-2",
    "rounded-[var(--minimal-radius)] px-5 text-[var(--minimal-body-size)]",
    "transition-opacity duration-[var(--minimal-motion-ms)] active:scale-[0.98]",
    variantClasses[variant],
    fullWidth && "w-full",
    className
  );

  if ("href" in rest && rest.href) {
    return (
      <Link
        href={rest.href}
        onClick={onClick}
        data-testid={testId}
        className={classes}
      >
        {children}
      </Link>
    );
  }

  const buttonRest = rest as MinimalButtonAsButton;
  return (
    <button
      type={buttonRest.type ?? "button"}
      onClick={onClick}
      disabled={buttonRest.disabled}
      data-testid={testId}
      className={cn(
        classes,
        buttonRest.disabled && "opacity-50 pointer-events-none"
      )}
    >
      {children}
    </button>
  );
}