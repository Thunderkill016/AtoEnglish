import { notFound } from "next/navigation";

import { ALL_SOUNDS } from "@/lib/data/ipa-sounds";

import { PronunciationFreePreview } from "./PronunciationFreePreview";

export default function PronunciationFreePreviewPage() {
  const sound = ALL_SOUNDS.find(
    (candidate) => candidate.id === "th-voiceless",
  );

  if (!sound) {
    notFound();
  }

  return (
    <PronunciationFreePreview
      target={{
        word: sound.exampleWord,
        ipa: sound.exampleIpa,
        howTo: sound.howTo,
        vietnameseTip: sound.vietnameseTip ?? null,
      }}
    />
  );
}
