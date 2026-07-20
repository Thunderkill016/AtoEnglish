import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "Học tiếp | AtoEnglish",
  description: "Bài tiếp theo trên lộ trình A0→B1 — một chạm là học.",
  robots: { index: false },
};

export default function HomePage() {
  return <HomeClient />;
}
