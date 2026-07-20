"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NavbarAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(Boolean(data.user));
    });
  }, []);

  if (loggedIn) {
    return (
      <Link
        href="/home"
        className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
      >
        Vào học
      </Link>
    );
  }

  return (
    <div className="hidden items-center gap-2 sm:flex">
      <Link
        href="/login?mode=login"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
      >
        Đăng nhập
      </Link>
      <Link href="/login?mode=signup" className={cn(buttonVariants({ size: "sm" }))}>
        Bắt đầu
      </Link>
    </div>
  );
}
