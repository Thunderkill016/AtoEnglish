import type { Metadata } from "next";
import SpeakingClient from "./SpeakingClient";

export const metadata: Metadata = {
  title: "Luyện nói",
  description: "Luyện phát âm và phản xạ giao tiếp với AI. Shadowing, roleplay và nhật ký nói.",
  robots: { index: false },
};

export default function SpeakingPage() {
  return <SpeakingClient />;
}
