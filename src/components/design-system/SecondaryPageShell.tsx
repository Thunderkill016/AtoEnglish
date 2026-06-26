import { Screen, LargeTitle } from "@/components/design-system";

interface SecondaryPageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/** P4 minimal wrapper for Ôn / Tiến độ / Cài đặt pages */
export function SecondaryPageShell({ title, subtitle, children }: SecondaryPageShellProps) {
  return (
    <Screen narrow={false}>
      <LargeTitle subtitle={subtitle}>{title}</LargeTitle>
      {children}
    </Screen>
  );
}