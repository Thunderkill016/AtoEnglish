"use client";

import Link from "next/link";
import { Page, PageHeader } from "@/components/ui/page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckpointClient({
  phase,
  phaseLabel,
}: {
  phase: string;
  phaseLabel?: string;
  [key: string]: unknown;
}) {
  return (
    <Page>
      <PageHeader
       title={`Checkpoint ${phaseLabel || phase.toUpperCase()}`}
        description="Bài kiểm tra phase — đang được tinh gọn UI. Quay lại lộ trình để tiếp tục học."
      />
      <div className="flex flex-col gap-2">
        <Link href="/path" className={cn(buttonVariants(), "w-full")}>
          Lộ trình B1
        </Link>
        <Link href="/home" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          Home
        </Link>
      </div>
    </Page>
  );
}
