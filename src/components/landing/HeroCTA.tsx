"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HeroCTA() {
  const [href, setHref] = useState("/login?mode=signup");

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      if (data.user) setHref("/home");
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        href={href}
        className={cn(
          buttonVariants({ size: "lg" }),
          "min-h-11 min-w-[200px] px-8 text-base",
        )}
      >
        Bắt đầu học miễn phí
      </Link>
      <a
        href="#how-it-works"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "min-h-11 min-w-[160px] px-6 text-base",
        )}
      >
        Xem cách học
      </a>
    </div>
  );
}
