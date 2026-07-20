"use client";

import Link from "next/link";
import { Page, PageHeader } from "@/components/ui/page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SpeakingSubShell({
  title,
  children,
  backHref = "/speaking",
}: {
  title: string;
  children: React.ReactNode;
  backHref?: string;
}) {
  return (
    <Page>
      <Link
        href={backHref}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "-ml-2 mb-2")}
        data-testid="speaking-back"
      >
        ← Quay lại
      </Link>
      <PageHeader title={title} />
      {children}
    </Page>
  );
}

export default SpeakingSubShell;
