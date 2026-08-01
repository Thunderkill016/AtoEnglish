"use client";

import { ChevronDown } from "lucide-react";
import {
  ListSection,
  PrimaryRow,
  SecondaryPageShell,
} from "@/components/design-system";
import {
  meHubAccount,
  meHubMore,
  meHubPractice,
  meHubStudy,
} from "@/lib/constants/me-hub";

interface MeClientProps {
  userName: string;
  subtitle?: string;
}

export default function MeClient({ userName, subtitle }: MeClientProps) {
  return (
    <SecondaryPageShell title="Tôi" subtitle={subtitle ?? `Chào ${userName}`}>
      <div className="space-y-6 pb-8">
        <ListSection title="Học tập">
          {meHubStudy.map((item) => (
            <PrimaryRow
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </ListSection>

        <details className="group border-t border-border/60 pt-4">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold text-muted-foreground">
            Công cụ luyện thêm
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-3 space-y-6">
            <ListSection title="Kỹ năng">
              {meHubPractice.map((item) => (
                <PrimaryRow
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ListSection>
            <ListSection title="Tra cứu">
              {meHubMore.map((item) => (
                <PrimaryRow
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                />
              ))}
            </ListSection>
          </div>
        </details>

        <ListSection title="Tài khoản">
          {meHubAccount.map((item) => (
            <PrimaryRow
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </ListSection>
      </div>
    </SecondaryPageShell>
  );
}
