"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LazyMotion, m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const loadFeatures = () => import("framer-motion").then((res) => res.domAnimation);

export default function FinalCtaSection() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
  };

  return (
    <LazyMotion features={loadFeatures} strict>
      <m.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        variants={staggerContainer}
        className="relative py-24 sm:py-32 lg:py-40 px-5 sm:px-8 overflow-hidden"
      >
        {/* Background glow */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(16, 185, 129, 0.08) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center space-y-8 sm:space-y-10">
          <m.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Sẵn sàng bắt đầu hành trình nói tiếng Anh tự tin?
            </h2>
            <p className="text-[15px] sm:text-base lg:text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-lg mx-auto font-normal">
              Học miễn phí ngay hôm nay. Không cần thẻ tín dụng.
            </p>
          </m.div>

          <m.div
            variants={fadeInUp}
            className="flex flex-col items-center gap-4"
          >
            <Link
              href={user ? "/dashboard" : "/login"}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto sm:min-w-[280px] justify-center bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-semibold h-14 px-10 rounded-full text-base shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-600/25 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 gap-2.5">
                {user
                  ? "Vào Dashboard ngay"
                  : "Bắt đầu miễn phí ngay hôm nay"}
                <ArrowRight className="size-4.5" />
              </Button>
            </Link>
            <div className="text-xs text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
              Miễn phí. Không cần thẻ tín dụng. Hủy bất cứ lúc nào.
            </div>
          </m.div>
        </div>
      </m.section>
    </LazyMotion>
  );
}
