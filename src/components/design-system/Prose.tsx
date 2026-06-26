import { cn } from "@/lib/utils";

interface ProseProps {
  children: React.ReactNode;
  className?: string;
}

/** Readable long-form content — terms, privacy, grammar (V2) */
export function Prose({ children, className }: ProseProps) {
  return (
    <article
      className={cn(
        "prose prose-zinc dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-p:text-[var(--minimal-body-size)] prose-p:leading-relaxed",
        "prose-li:text-[var(--minimal-body-size)]",
        className
      )}
    >
      {children}
    </article>
  );
}