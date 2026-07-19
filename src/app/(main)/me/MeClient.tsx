"use client";

import { User } from "lucide-react";
import {
  Chip,
  ListSection,
  PageHeader,
  PrimaryRow,
  Screen,
  Surface,
} from "@/components/design-system";
import {
  getMeHubStudy,
  getMeHubMore,
  ME_HUB_OUTCOME_LINE,
  meHubAccount,
  meHubPractice,
} from "@/lib/constants/me-hub";

interface MeClientProps {
  userName: string;
  subtitle?: string;
}

const ROW_ATO =
  "bg-white/5 border-white/10 hover:bg-white/[0.07] hover:border-emerald-500/30";

export default function MeClient({ userName, subtitle }: MeClientProps) {
  const studyItems = getMeHubStudy();
  const moreItems = getMeHubMore();
  const defaultSubtitle = `Chào ${userName} · ${ME_HUB_OUTCOME_LINE}`;

  return (
    <Screen ato ambient>
      <div className="mb-6 space-y-3">
        <Chip tone="brand" className="tracking-widest">
          <User className="size-3.5" aria-hidden />
          Hồ sơ · B1 path
        </Chip>
        <PageHeader
          eyebrow="Tài khoản"
          title="Tôi"
          subtitle={subtitle ?? defaultSubtitle}
        />
      </div>

      <div className="space-y-6 pb-8">
        <ListSection title="Học tập">
          <Surface className="space-y-2 p-2">
            {studyItems.map((item) => (
              <PrimaryRow
                key={item.href}
                href={item.href}
                label={item.label}
                description={item.description}
                icon={item.icon}
                className={ROW_ATO}
              />
            ))}
          </Surface>
        </ListSection>

        <ListSection title="Luyện tập">
          <Surface className="space-y-2 p-2">
            {meHubPractice.map((item) => (
              <PrimaryRow
                key={item.href}
                href={item.href}
                label={item.label}
                description={item.description}
                icon={item.icon}
                className={ROW_ATO}
              />
            ))}
          </Surface>
        </ListSection>

        <ListSection title="Khám phá">
          <Surface className="space-y-2 p-2">
            {moreItems.map((item) => (
              <PrimaryRow
                key={item.href}
                href={item.href}
                label={item.label}
                description={item.description}
                icon={item.icon}
                className={ROW_ATO}
              />
            ))}
          </Surface>
        </ListSection>

        <ListSection title="Tài khoản">
          <Surface className="space-y-2 p-2">
            {meHubAccount.map((item) => (
              <PrimaryRow
                key={item.href}
                href={item.href}
                label={item.label}
                description={item.description}
                icon={item.icon}
                className={ROW_ATO}
              />
            ))}
          </Surface>
        </ListSection>
      </div>
    </Screen>
  );
}
