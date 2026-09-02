import type { Metadata } from "next";

import { DataDrivenPreview } from "@/features/data-driven-preview/DataDrivenPreview";

export const metadata: Metadata = {
  title: "Nếp Capability Preview — AtoEnglish",
  description: "Vertical slice thử nghiệm capability-first: retrieval, speaking, repair, transfer và review evidence.",
  robots: { index: false, follow: false },
};

export default function DataPreviewPage() {
  return <DataDrivenPreview />;
}
