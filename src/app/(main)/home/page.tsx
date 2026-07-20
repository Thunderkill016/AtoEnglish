import type { Metadata } from "next";
import { HomeClient } from "./HomeClient";

export const metadata: Metadata = {
  title: "Hôm nay | AtoEnglish v2",
  description: "Kế hoạch học hôm nay — lộ trình tới B1.",
  robots: { index: false },
};

export default function HomePage() {
  return <HomeClient />;
}
