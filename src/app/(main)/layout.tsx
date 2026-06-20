import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { LessonPageHider } from "@/components/layout/lesson-page-hider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <LessonPageHider>
        <div className="pb-16 sm:pb-0">
          <Header />
        </div>
      </LessonPageHider>
      <main className="flex-1">{children}</main>
      <LessonPageHider>
        <BottomNav />
      </LessonPageHider>
    </div>
  );
}
