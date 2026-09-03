import type { Metadata } from "next";

import { AdaptivePracticePreview } from "@/features/adaptive-practice/AdaptivePracticePreview";

export const metadata: Metadata = {
  title: "Nếp Adaptive Practice Preview — AtoEnglish",
  description: "Authenticated preview of learner-state-driven Nếp practice selection and trusted server-side evaluation.",
  robots: { index: false, follow: false },
};

export default function AdaptivePreviewPage() {
  return <AdaptivePracticePreview />;
}
