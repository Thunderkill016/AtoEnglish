import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { LessonPageHider } from "@/components/layout/lesson-page-hider";
import { HeaderScrollWrapper } from "@/components/layout/header-scroll-wrapper";
import CommandPaletteLoader from "@/components/layout/command-palette-loader";
import { V2ProgressHydrator } from "@/components/learn/v2/V2ProgressHydrator";
import { getCachedUser, getCachedDueCardsCount } from "@/lib/queries/user";
import { isCurriculumV2 } from "@/lib/v2/flag";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCachedUser();
  const dueCardsCount = user ? await getCachedDueCardsCount(user.id) : 0;
  const hydrateV2 = Boolean(user) && isCurriculumV2();

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground pb-16 sm:pb-0">
      <LessonPageHider>
        <HeaderScrollWrapper>
          <Header />
        </HeaderScrollWrapper>
      </LessonPageHider>
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <LessonPageHider>
        <BottomNav dueCardsCount={dueCardsCount} />
      </LessonPageHider>
      <CommandPaletteLoader />
      {hydrateV2 ? <V2ProgressHydrator /> : null}
    </div>
  );
}
