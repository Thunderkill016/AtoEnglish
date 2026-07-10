import { cn } from "@/lib/utils";
import {
  SURFACE_VARIANT,
  type SurfaceVariant,
} from "@/lib/ui/ato-surface";

export interface SurfaceProps {
  children: React.ReactNode;
  className?: string;
  variant?: SurfaceVariant;
  /** Semantic element — default div */
  as?: "div" | "section" | "article" | "li";
  "data-testid"?: string;
}

/** Ato Surface glass card — default / interactive / success / warn / danger */
export function Surface({
  children,
  className,
  variant = "default",
  as: Tag = "div",
  "data-testid": testId,
}: SurfaceProps) {
  return (
    <Tag
      data-testid={testId}
      className={cn(SURFACE_VARIANT[variant], className)}
    >
      {children}
    </Tag>
  );
}
