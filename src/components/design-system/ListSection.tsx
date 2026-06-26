import { cn } from "@/lib/utils";

interface ListSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/** iOS Settings–style grouped list section (V2) */
export function ListSection({ title, children, className }: ListSectionProps) {
  return (
    <section className={cn("space-y-2", className)}>
      {title && (
        <h2 className="px-1 text-[var(--minimal-caption-size)] font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </h2>
      )}
      <div className="space-y-2">{children}</div>
    </section>
  );
}