import type { Metadata } from "next";
import RoadmapClient from "./RoadmapClient";

export const metadata: Metadata = {
  title: "Lộ trình học | AtoEnglish",
  description:
    "Lộ trình tự học tiếng Anh 12 tháng từ con số 0 đến B1+. Hướng tới dùng English cho dev work.",
  robots: { index: false },
};

export default function RoadmapPage() {
  return (
    <main id="main-content">
      <RoadmapClient />
    </main>
  );
}
