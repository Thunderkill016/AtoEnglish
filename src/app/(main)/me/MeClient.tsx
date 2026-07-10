"use client";

import {
  ListSection,
  PrimaryRow,
  SecondaryPageShell,
} from "@/components/design-system";
import {
  getMeHubStudy,
  ME_HUB_OUTCOME_LINE,
  meHubAccount,
  meHubMore,
  meHubPractice,
} from "@/lib/constants/me-hub";

interface MeClientProps {
  userName: string;
  subtitle?: string;
}

export default function MeClient({ userName, subtitle }: MeClientProps) {
  const studyItems = getMeHubStudy();
  const defaultSubtitle = `Chào ${userName} · ${ME_HUB_OUTCOME_LINE}`;

  return (
    <SecondaryPageShell title="Tôi" subtitle={subtitle ?? defaultSubtitle}>
      <div className="space-y-6 pb-8">
        <ListSection title="Học tập">
          {studyItems.map((item) => (
            <PrimaryRow
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </ListSection>

        <ListSection title="Luyện tập">
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

        <ListSection title="Khám phá">
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