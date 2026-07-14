import { ArrowLeft, Mic } from "lucide-react";
import {
  AppButton,
  Chip,
  PageHeader,
  Screen,
  Surface,
} from "@/components/design-system";

interface SpeakingSubShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Ato chrome for speaking practice subroutes (TASK-283).
 * Matches speaking hub: Screen ato + ambient, PageHeader, Surface, AppButton back.
 */
export function SpeakingSubShell({
  title,
  subtitle,
  children,
}: SpeakingSubShellProps) {
  return (
    <Screen ato ambient>
      <div className="mb-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone="brand" className="tracking-widest">
            <Mic className="size-3.5" aria-hidden />
            Free speaking
          </Chip>
          <AppButton
            href="/speaking"
            variant="ghost"
            size="sm"
            data-testid="speaking-sub-back"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Speaking hub
          </AppButton>
        </div>
        <PageHeader eyebrow="Luyện nói" title={title} subtitle={subtitle} />
      </div>
      <Surface className="overflow-hidden p-4 sm:p-5">{children}</Surface>
    </Screen>
  );
}
