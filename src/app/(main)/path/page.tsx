import { StatLine } from "@/components/ui/page";
import type { Metadata } from "next";
import { PathClient } from "./PathClient";

export const metadata: Metadata = {
  title: "Lộ trình B1 | AtoEnglish v2",
  robots: { index: false },
};

export default function PathPage() {
  return <PathClient />;
}
