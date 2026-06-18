import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AtoEnglish",
    template: "%s | AtoEnglish",
  },
  description:
    "Nền tảng tự học tiếng Anh cá nhân hóa với SRS, lộ trình A1–C1 và mô hình IPOR.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn("font-sans", sansFont.variable)}>
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-center" closeButton />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}