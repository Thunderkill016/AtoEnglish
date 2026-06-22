import { notFound } from "next/navigation";
import type { Metadata } from "next";

import UnitTemplate from "@/components/learn/UnitTemplate";
import { UNITS } from "@/lib/constants/units";
import { UNIT_DATA_MAP } from "@/lib/data/unit-registry";

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
