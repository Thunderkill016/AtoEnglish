import type { Metadata } from "next";

import { resolvePronunciationShadowTarget } from "@/lib/pronunciation/openpronounce-shadow";

import { PronunciationShadowPreview } from "./PronunciationShadowPreview";

export const metadata: Metadata = {
  title: "Pronunciation Shadow Preview — AtoEnglish",
  description: "Uncalibrated acoustic pronunciation observation preview.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PronunciationShadowPreviewPage() {
  const target = resolvePronunciationShadowTarget("th-voiceless");
  if (!target) return null;

  return <PronunciationShadowPreview target={target} />;
}
