"use client";

import Link from "next/link";
import { Page, PageHeader } from "@/components/ui/page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  level: string;
  levelLabel: string;
  userName: string;
  totalXp: number;
  isEligible: boolean;
  completedForLevel: number;
  requiredUnits: number;
  completedDate: string | null;
}

export default function CertificateClient({
  level,
  levelLabel,
  userName,
  isEligible,
  completedForLevel,
  requiredUnits,
}: Props) {
  return (
    <Page>
      <PageHeader
       title={`Chứng nhận ${levelLabel || level.toUpperCase()}`}
        description={
          isEligible
            ? `Chúc mừng ${userName}!`
            : `Hoàn thành ${completedForLevel}/${requiredUnits} bài để mở chứng nhận.`
        }
      />
      <Link href="/home" className={cn(buttonVariants(), "w-full")}>
        Về Home
      </Link>
    </Page>
  );
}
