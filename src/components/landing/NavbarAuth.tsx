"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export default function NavbarAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="flex items-center gap-3">
      {user ? (
        <Link href="/dashboard">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold h-9 px-5 rounded-lg active:scale-[0.97] transition-all shadow-sm">
            Vào Dashboard
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/login" className="hidden sm:block">
            <Button
              variant="ghost"
              className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 h-9 px-4 rounded-lg transition-colors"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold h-9 px-5 rounded-lg active:scale-[0.97] transition-all shadow-sm">
              Bắt đầu miễn phí
            </Button>
          </Link>
        </>
      )}
    </div>
  );
}
