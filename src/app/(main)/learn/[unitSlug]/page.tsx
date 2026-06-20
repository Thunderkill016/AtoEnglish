import { notFound } from "next/navigation";
import type { Metadata } from "next";

import UnitTemplate from "@/components/learn/UnitTemplate";
import type { UnitData } from "@/components/learn/UnitTemplate";
import { unit1 } from "@/lib/data/units/unit1";
import { unit2 } from "@/lib/data/units/unit2";
import { unit3 } from "@/lib/data/units/unit3";
import { unit4 } from "@/lib/data/units/unit4";
import { unit5 } from "@/lib/data/units/unit5";
import { UNITS } from "@/lib/constants/units";

// ─── CEFR order fix ──────────────────────────────────────────────────────────
// Original files: unit4.ts = B1 Technology, unit5.ts = A2 Shopping
// Correct CEFR order: A1 → A1 → A1 → A2 → B1
// Solution: cross-reference data files while preserving unitId for DB tracking
const unit4RouteData: UnitData = { ...unit5, unitId: "unit-4" }; // A2 Shopping at /learn/unit-4
const unit5RouteData: UnitData = { ...unit4, unitId: "unit-5" }; // B1 Technology at /learn/unit-5

// ─── Unit registry ───────────────────────────────────────────────────────────
// Single source of truth: add new units here to make them available at
// /learn/[unitSlug] without creating new page files.
const UNIT_DATA_MAP: Record<string, { data: UnitData; next: string }> = {
  "unit-1": { data: unit1, next: "/learn/unit-2" },
  "unit-2": { data: unit2, next: "/learn/unit-3" },
  "unit-3": { data: unit3, next: "/learn/unit-4" },
  "unit-4": { data: unit4RouteData, next: "/learn/unit-5" }, // A2 → B1
  "unit-5": { data: unit5RouteData, next: "/learn" },         // B1 → done
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
