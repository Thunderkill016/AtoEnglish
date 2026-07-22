import type { Metadata } from "next";
import type { ReactNode } from "react";

const previewTitle = "Lesson System V2 Preview | AtoEnglish";
const previewDescription =
  "Bản thử nghiệm hệ thống bài học AtoEnglish V2 theo mission, retrieval, performance, delayed recall và transfer.";

export const metadata: Metadata = {
  title: {
    absolute: previewTitle,
  },
  description: previewDescription,
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: previewTitle,
    description: previewDescription,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: previewTitle,
    description: previewDescription,
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
