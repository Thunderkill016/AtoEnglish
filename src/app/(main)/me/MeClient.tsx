"use client";

import { User } from "lucide-react";
import {
  ListSection,
  PageHeader,
  PrimaryRow,
  Screen,
} from "@/components/design-system";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
  const studyItems = getMeHubStudy();
  const moreItems = getMeHubMore();
  const defaultSubtitle = `Chào ${userName} · ${ME_HUB_OUTCOME_LINE}`;

  return (
    <Screen ambient>
      <div className="mb-6 space-y-3">
        <Badge variant="secondary" className="gap-1.5">
          <User className="size-3" aria-hidden />
          Hồ sơ · B1
        </Badge>
        <PageHeader
          eyebrow="Tài khoản"
          title="Tôi"
          subtitle={subtitle ?? defaultSubtitle}
        />
      </div>

      <div className="space-y-6 pb-8">
        <ListSection title="Học tập">
          <Card size="sm">
            <CardContent className="space-y-1 p-2">
              {studyItems.map((item) => (
                <PrimaryRow
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                  className="rounded-lg border-0 bg-transparent hover:bg-muted/50"
                />
              ))}
            </CardContent>
          </Card>
        </ListSection>

        <ListSection title="Luyện tập">
          <Card size="sm">
            <CardContent className="space-y-1 p-2">
              {meHubPractice.map((item) => (
                <PrimaryRow
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                  className="rounded-lg border-0 bg-transparent hover:bg-muted/50"
                />
              ))}
            </CardContent>
          </Card>
        </ListSection>

        {moreItems.length > 0 ? (
          <ListSection title="Thêm">
            <Card size="sm">
              <CardContent className="space-y-1 p-2">
                {moreItems.map((item) => (
                  <PrimaryRow
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    description={item.description}
                    icon={item.icon}
                    className="rounded-lg border-0 bg-transparent hover:bg-muted/50"
                  />
                ))}
              </CardContent>
            </Card>
          </ListSection>
        ) : null}

        <ListSection title="Tài khoản">
          <Card size="sm">
            <CardContent className="space-y-1 p-2">
              {meHubAccount.map((item) => (
                <PrimaryRow
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  description={item.description}
                  icon={item.icon}
                  className="rounded-lg border-0 bg-transparent hover:bg-muted/50"
                />
              ))}
            </CardContent>
          </Card>
        </ListSection>
      </div>
    </Screen>
  );
}
