"use client";

import { useState, useEffect } from "react";
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
        <MinimalButton
          href={isLoggedIn ? "/dashboard" : "/login"}
          fullWidth
          className="sm:w-auto sm:min-w-[220px]"
        >
          {isLoggedIn ? "Vào học" : "Bắt đầu học ngay"}
          <ArrowRight className="size-4" />
        </MinimalButton>
      </div>
      <p className="text-[var(--minimal-caption-size)] text-muted-foreground text-center lg:text-left">
        Miễn phí Open Beta · 50 unit A0→B2 · ~15 phút/ngày
      </p>
    </div>
  );
}