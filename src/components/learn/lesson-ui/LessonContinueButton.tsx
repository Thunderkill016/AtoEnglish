"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type V = "default" | "secondary" | "outline" | "ghost";

export function LessonContinueButton({
  onClick,
  disabled,
  children,
  className,
  variant = "default",
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  variant?: V | "primary";
}) {
  const v: V = variant === "primary" ? "default" : (variant as V);
  return (
    <Button type="button" variant={v} disabled={disabled} onClick={onClick} className={cn("w-full", className)}>
      {children}
    </Button>
  );
}

export default LessonContinueButton;
