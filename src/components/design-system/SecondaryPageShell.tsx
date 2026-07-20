import { Screen, PageHeader } from "@/components/design-system";

interface SecondaryPageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  eyebrow?: string;
}

/** Secondary routes — shadcn canvas + consistent page header */
export function SecondaryPageShell({
  title,
  subtitle,
  children,
  eyebrow,
}: SecondaryPageShellProps) {
  return (
    <Screen ambient>
      <PageHeader
        className="mb-6"
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
      />
      {children}
    </Screen>
  );
}
