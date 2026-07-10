import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  APP_BUTTON_SIZE,
  APP_BUTTON_VARIANT,
  ATO_FOCUS,
  type AppButtonSize,
  type AppButtonVariant,
} from "@/lib/ui/ato-surface";

interface AppButtonBase {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  "data-testid"?: string;
}

interface AppButtonAsButton extends AppButtonBase {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface AppButtonAsLink extends AppButtonBase {
  href: string;
  onClick?: () => void;
}

export type AppButtonProps = AppButtonAsButton | AppButtonAsLink;

/**
 * Primary product CTA — Ato Surface (emerald/teal gradient).
 * Prefer this over one-off Tailwind buttons on new screens.
 */
export function AppButton({
  variant = "primary",
  size = "md",
  children,
  className,
  fullWidth = false,
  onClick,
  "data-testid": testId,
  ...rest
}: AppButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center transition active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40",
    ATO_FOCUS,
    APP_BUTTON_VARIANT[variant],
    APP_BUTTON_SIZE[size],
    fullWidth && "w-full",
    className,
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

  const buttonRest = rest as AppButtonAsButton;
  return (
    <button
      type={buttonRest.type ?? "button"}
      onClick={onClick}
      disabled={buttonRest.disabled}
      data-testid={testId}
      className={classes}
    >
      {children}
    </button>
  );
}
