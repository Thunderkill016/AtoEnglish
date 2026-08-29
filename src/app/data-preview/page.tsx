import type { Metadata } from "next";

import { DataDrivenPreview } from "@/features/data-driven-preview/DataDrivenPreview";

export const metadata: Metadata = {
  title: "Nếp Data Preview — AtoEnglish",
  description:
    "Bản preview thử nghiệm cách dữ liệu nghiên cứu thị trường và curriculum dẫn dắt trải nghiệm học nói hằng ngày.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DataPreviewPage() {
  return <DataDrivenPreview />;
}
