"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FinalCtaSection() {
  const [href, setHref] = useState("/login?mode=signup");

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) setHref("/home");
    });
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Sẵn sàng bắt đầu nói tiếng Anh tự tin?
        </h2>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Open Beta miễn phí. Lộ trình A0→B1 — dùng được tiếng Anh độc lập.
        </p>
        <Link
          href={href}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-8 min-h-11 min-w-[220px] px-8",
          )}
        >
          Bắt đầu học miễn phí
        </Link>
      </div>
    </section>
  );
}
