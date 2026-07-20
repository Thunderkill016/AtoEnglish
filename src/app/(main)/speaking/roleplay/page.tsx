import type { Metadata } from "next";
import { SpeakingSubShell } from "../SpeakingSubShell";
import { AIRoleplay } from "../ai-roleplay";

export const metadata: Metadata = {
  title: "AI Roleplay | Luyện nói — AtoEnglish",
  description:
    "Hội thoại nhập vai với AI để luyện giao tiếp tình huống thực tế.",
  robots: { index: false },
};

export default function RoleplayPage() {
  return (
    <SpeakingSubShell title="Roleplay"
    >
      <AIRoleplay />
    </SpeakingSubShell>
  );
}
