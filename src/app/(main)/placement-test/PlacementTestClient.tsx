"use client";

import Link from "next/link";
import { Page, PageHeader } from "@/components/ui/page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function PlacementTestClient(props: Record<string, unknown>) {
  return (
    <Page>
      <PageHeader
        title="Placement test"
        description="Xác định điểm bắt đầu phù hợp trên lộ trình A0→B1."
      />
      <p className="mb-4 text-sm text-muted-foreground">
        Bài test đầy đủ đang được tinh gọn giao diện. Bắt đầu từ Home hoặc Path.
      </p>
      <div className="flex flex-col gap-2">
        <Link href="/home" className={cn(buttonVariants(), "w-full")}>
          Vào Home
        </Link>
        <Link href="/path" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>
          Xem lộ trình
        </Link>
      </div>
    </Page>
  );
}
