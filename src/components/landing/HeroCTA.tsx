"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { checkHasSession } from "@/lib/auth-check";
import { MinimalButton } from "@/components/design-system";

type HeroCTAProps = {
  align?: "center" | "left";
};

export default function HeroCTA({ align = "left" }: HeroCTAProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isCentered = align === "center";
  const justifyClass = isCentered
    ? "justify-center"
    : "justify-center lg:justify-start";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(checkHasSession());
  }, []);

  return (
    <div
      className={`flex flex-col gap-4 pt-2 w-full items-center ${isCentered ? "" : "lg:items-start"}`}
    >
      <div
        className={`flex w-full max-w-sm sm:max-w-none ${justifyClass}`}
      >
        <Link
          href="/learn"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.985] w-full sm:w-auto sm:min-w-[240px]"
        >
          Học thử ngay (không cần tài khoản)
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div
        className={`flex w-full max-w-sm sm:max-w-none ${justifyClass}`}
      >
        <Link
          href={isLoggedIn ? "/dashboard" : "/login?mode=signup"}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 backdrop-blur px-6 py-3 text-sm font-medium text-white hover:bg-white/10 active:scale-[0.985] w-full sm:w-auto sm:min-w-[240px]"
        >
          {isLoggedIn ? "Vào dashboard" : "Đăng ký (lưu tiến độ cloud)"}
        </Link>
      </div>
      <p className="text-xs text-zinc-400 text-center lg:text-left">
        Miễn phí Open Beta · 50 unit A0→B2 · ~15 phút/ngày · Tiến độ khách lưu cục bộ
      </p>
    </div>
  );
}