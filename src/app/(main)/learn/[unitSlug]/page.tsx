import { notFound } from "next/navigation";
import type { Metadata } from "next";

import UnitTemplate from "@/components/learn/UnitTemplate";
import type { UnitData } from "@/components/learn/UnitTemplate";
import { unit1 } from "@/lib/data/units/unit1";
import { unit2 } from "@/lib/data/units/unit2";
import { unit3 } from "@/lib/data/units/unit3";
import { unit4 } from "@/lib/data/units/unit4";
import { unit5 } from "@/lib/data/units/unit5";
import { unit6 } from "@/lib/data/units/unit6";
import { unit7 } from "@/lib/data/units/unit7";
import { unit8 } from "@/lib/data/units/unit8";
import { unit9 } from "@/lib/data/units/unit9";
import { unit10 } from "@/lib/data/units/unit10";
import { unit11 } from "@/lib/data/units/unit11";
import { unit12 } from "@/lib/data/units/unit12";
import { UNITS } from "@/lib/constants/units";

// ─── Unit registry ───────────────────────────────────────────────────────────
// Single source of truth: all 12 A1 units registered here.
// Add new units here to make them available at /learn/[unitSlug].
const UNIT_DATA_MAP: Record<string, { data: UnitData; next: string }> = {
  "unit-1":  { data: unit1,  next: "/learn/unit-2" },
  "unit-2":  { data: unit2,  next: "/learn/unit-3" },
  "unit-3":  { data: unit3,  next: "/learn/unit-4" },
  "unit-4":  { data: unit4,  next: "/learn/unit-5" },
  "unit-5":  { data: unit5,  next: "/learn/unit-6" },
  "unit-6":  { data: unit6,  next: "/learn/unit-7" },
  "unit-7":  { data: unit7,  next: "/learn/unit-8" },
  "unit-8":  { data: unit8,  next: "/learn/unit-9" },
  "unit-9":  { data: unit9,  next: "/learn/unit-10" },
  "unit-10": { data: unit10, next: "/learn/unit-11" },
  "unit-11": { data: unit11, next: "/learn/unit-12" },
  "unit-12": { data: unit12, next: "/learn" },         // A1 complete → back to dashboard
};

// Pre-build all known unit slugs at build time (SSG)
export function generateStaticParams() {
  return Object.keys(UNIT_DATA_MAP).map((slug) => ({ unitSlug: slug }));
}

// Per-unit SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}): Promise<Metadata> {
  const { unitSlug } = await params;
  const meta = UNITS.find((u) => u.id === unitSlug);
  if (!meta) return { title: "Bài học không tìm thấy" };

  return {
    title: meta.title,
    description: meta.description,
    robots: { index: false }, // Protected page — no public indexing
  };
}

export default async function UnitPage({
  params,
}: {
  params: Promise<{ unitSlug: string }>;
}) {
  const { unitSlug } = await params;
  const entry = UNIT_DATA_MAP[unitSlug];

  if (!entry) notFound();

  return <UnitTemplate unit={entry.data} nextRoute={entry.next} />;
}
