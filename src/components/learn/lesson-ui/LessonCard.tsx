import { cn } from "@/lib/utils";

interface LessonCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "highlight" | "muted";
}

export default function LessonCard({
  children,
  className,
  variant = "default",
}: LessonCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-4 sm:p-5",
        variant === "default" && "border-border/60 bg-card",
        variant === "highlight" && "border-primary/40 bg-primary/5",
        variant === "muted" && "border-border/60 bg-muted/30",
        className
      )}
    >
      {children}
    </div>
  );
}