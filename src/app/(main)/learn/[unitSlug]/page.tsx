import { notFound } from "next/navigation";
import type { Metadata } from "next";

import UnitTemplate from "@/components/learn/UnitTemplate";
import type { UnitData } from "@/components/learn/UnitTemplate";
// A0 Foundation units
import unitA01 from "@/lib/data/units/unitA01";
import unitA02 from "@/lib/data/units/unitA02";
import unitA03 from "@/lib/data/units/unitA03";
import unitA04 from "@/lib/data/units/unitA04";
import unitA05 from "@/lib/data/units/unitA05";
import unitA06 from "@/lib/data/units/unitA06";
import unitA07 from "@/lib/data/units/unitA07";
import unitA08 from "@/lib/data/units/unitA08";
// A1 units
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
import { unit13 } from "@/lib/data/units/unit13";
import { unit14 } from "@/lib/data/units/unit14";
import { unit15 } from "@/lib/data/units/unit15";
import { unit16 } from "@/lib/data/units/unit16";
import { unit17 } from "@/lib/data/units/unit17";
import { unit18 } from "@/lib/data/units/unit18";
import { UNITS } from "@/lib/constants/units";

// ─── Unit registry ───────────────────────────────────────────────────────────
// Single source of truth: all A0 + A1 + A2 units registered here.
// Add new units here to make them available at /learn/[unitSlug].
const UNIT_DATA_MAP: Record<string, { data: UnitData; next: string }> = {
  // A0 Foundation — 8 units (pre-CEFR)
  "unit-a0-1": { data: unitA01, next: "/learn/unit-a0-2" },
  "unit-a0-2": { data: unitA02, next: "/learn/unit-a0-3" },
  "unit-a0-3": { data: unitA03, next: "/learn/unit-a0-4" },
  "unit-a0-4": { data: unitA04, next: "/learn/unit-a0-5" },
  "unit-a0-5": { data: unitA05, next: "/learn/unit-a0-6" },
  "unit-a0-6": { data: unitA06, next: "/learn/unit-a0-7" },
  "unit-a0-7": { data: unitA07, next: "/learn/unit-a0-8" },
  "unit-a0-8": { data: unitA08, next: "/learn/unit-1" }, // A0 complete → start A1
  // A1 — 12 units
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
  "unit-12": { data: unit12, next: "/learn/unit-13" }, // A1 complete → start A2
  // A2 — 6 units
  "unit-13": { data: unit13, next: "/learn/unit-14" },
  "unit-14": { data: unit14, next: "/learn/unit-15" },
  "unit-15": { data: unit15, next: "/learn/unit-16" },
  "unit-16": { data: unit16, next: "/learn/unit-17" },
  "unit-17": { data: unit17, next: "/learn/unit-18" },
  "unit-18": { data: unit18, next: "/roadmap" },        // A2 complete → roadmap
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
