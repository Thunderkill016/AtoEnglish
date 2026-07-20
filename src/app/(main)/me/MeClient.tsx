"use client";

import { Page, PageHeader, Section, ListRow } from "@/components/ui/page";
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

export default function MeClient({ userName, subtitle }: MeClientProps) {
  const study = getMeHubStudy();
  const more = getMeHubMore();

  return (
    <Page>
      <PageHeader
       description={
          subtitle ?? `Xin chào ${userName}. ${ME_HUB_OUTCOME_LINE}`
        }
      />
      <Section title="Học tập">
        <div className="space-y-2">
          {study.map((item) => (
            <ListRow
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </Section>
      <Section title="Luyện">
        <div className="space-y-2">
          {meHubPractice.map((item) => (
            <ListRow
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </Section>
      {more.length > 0 ? (
        <Section title="Thêm">
          <div className="space-y-2">
            {more.map((item) => (
              <ListRow
                key={item.href}
                href={item.href}
                label={item.label}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </Section>
      ) : null}
      <Section title="Tài khoản">
        <div className="space-y-2">
          {meHubAccount.map((item) => (
            <ListRow
              key={item.href}
              href={item.href}
              label={item.label}
              description={item.description}
              icon={item.icon}
            />
          ))}
        </div>
      </Section>
    </Page>
  );
}
