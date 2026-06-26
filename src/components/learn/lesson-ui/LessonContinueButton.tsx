"use client";

import { ChevronRight } from "lucide-react";
import { MinimalButton } from "@/components/design-system";
import { cn } from "@/lib/utils";

interface LessonContinueButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function LessonContinueButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className,
}: LessonContinueButtonProps) {
  return (
    <MinimalButton
      type="button"
      onClick={onClick}
      disabled={disabled}
      variant={variant === "secondary" ? "secondary" : "primary"}
      fullWidth
      className={cn("!rounded-2xl", className)}
    >
      {children}
      {variant === "primary" && <ChevronRight size={18} aria-hidden />}
    </MinimalButton>
  );
}