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
        variant === "default" && "bg-zinc-900/70 border-zinc-800/80 backdrop-blur-sm",
        variant === "highlight" &&
          "bg-gradient-to-b from-emerald-950/40 to-zinc-950/60 border-emerald-800/40",
        variant === "muted" && "bg-zinc-950/50 border-zinc-800/50",
        className
      )}
    >
      {children}
    </div>
  );
}