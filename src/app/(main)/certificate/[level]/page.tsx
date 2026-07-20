import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CertificateClient from "./CertificateClient";
import { BUSINESS_TRACK_UNIT_IDS } from "@/lib/constants/business-track";

// Valid certificate tracks
const VALID_LEVELS = ["a1", "a2", "b1", "b2", "business"] as const;
type CertLevel = (typeof VALID_LEVELS)[number];

// Unit counts per level — used to verify completion
const LEVEL_UNIT_COUNTS: Record<CertLevel, number> = {
  a1: 12,
  a2: 6,
  b1: 14,
  b2: 10,
  business: BUSINESS_TRACK_UNIT_IDS.length,
};

const LEVEL_LABELS: Record<CertLevel, string> = {
  a1: "A1 — Sơ cấp (Elementary)",
  a2: "A2 — Tiền trung cấp (Pre-Intermediate)",
  b1: "B1 — Trung cấp (Intermediate)",
  b2: "B2 — Trên trung cấp (Upper-Intermediate)",
  business: "Business English — Tiếng Anh Công sở",
};

const LEVEL_UNIT_IDS: Record<CertLevel, string[]> = {
  a1: ["unit-1","unit-2","unit-3","unit-4","unit-5","unit-6",
        "unit-7","unit-8","unit-9","unit-10","unit-11","unit-12"],
  a2: ["unit-13","unit-14","unit-15","unit-16","unit-17","unit-18"],
  b1: ["unit-19","unit-20","unit-21","unit-22","unit-23","unit-24",
        "unit-25","unit-26","unit-27","unit-28","unit-29","unit-30",
        "unit-31","unit-32"],
  b2: ["unit-33","unit-34","unit-35","unit-36","unit-37",
        "unit-38","unit-39","unit-40","unit-41","unit-42"],
  business: BUSINESS_TRACK_UNIT_IDS,
};

interface Props {
  params: Promise<{ level: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params;
  const upper = level.toUpperCase();
  return {
    title: `Chứng Chỉ ${upper} | AtoEnglish`,
    description: `Chứng chỉ hoàn thành cấp độ ${upper} của AtoEnglish. Xác nhận trình độ tiếng Anh của bạn sau khi hoàn tất lộ trình học.`,
  };
}

export default async function CertificatePage({ params }: Props) {
  const { level } = await params;

  if (!VALID_LEVELS.includes(level as CertLevel)) {
    redirect("/roadmap");
  }

  const certLevel = level as CertLevel;

  const supabase = await createClient();
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) redirect("/login");

  // Get user's display name + completion data in parallel
  const [profileRes, completedRes] = await Promise.all([
    supabase.from("user_progress").select("current_level, total_xp").eq("user_id", user.id).single(),
    supabase
      .from("user_lesson_progress")
      .select("unit_id")
      .eq("user_id", user.id),
  ]);

  const completedUnitIds = completedRes.data?.map((r: { unit_id: string }) => r.unit_id) ?? [];
  const requiredUnits = LEVEL_UNIT_COUNTS[certLevel];

  const levelUnitIds = LEVEL_UNIT_IDS[certLevel];
  const completedForLevel = completedUnitIds.filter((id: string) =>
    levelUnitIds.includes(id)
  ).length;

  const isEligible = completedForLevel >= requiredUnits;

  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Học viên";

  const totalXp = profileRes.data?.total_xp ?? 0;
  const completedDate = isEligible
    ? new Date().toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <CertificateClient
      level={certLevel}
      levelLabel={LEVEL_LABELS[certLevel]}
      userName={userName}
      totalXp={totalXp}
      isEligible={isEligible}
      completedForLevel={completedForLevel}
      requiredUnits={requiredUnits}
      completedDate={completedDate}
    />
  );
}
