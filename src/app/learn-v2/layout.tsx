import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Lesson System V2 Preview | AtoEnglish",
  description:
    "Bản thử nghiệm hệ thống bài học AtoEnglish V2 theo mission, retrieval, performance, delayed recall và transfer.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

interface LearnV2LayoutProps {
  children: ReactNode;
}

export default function LearnV2Layout({
  children,
}: LearnV2LayoutProps) {
  return (
    <div id="main-content" tabIndex={-1}>
      {children}
    </div>
  );
}
