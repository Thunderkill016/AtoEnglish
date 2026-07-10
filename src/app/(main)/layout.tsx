import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { LessonPageHider } from "@/components/layout/lesson-page-hider";
import { HeaderScrollWrapper } from "@/components/layout/header-scroll-wrapper";
import CommandPaletteLoader from "@/components/layout/command-palette-loader";
import { getCachedUser, getCachedDueCardsCount } from "@/lib/queries/user";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch user + due cards count at layout level.
  // React.cache() deduplicates — page.tsx calling these same queries = 0 extra DB hits.
  const user = await getCachedUser();
  const dueCardsCount = user ? await getCachedDueCardsCount(user.id) : 0;

  return (
    <div className="relative flex min-h-screen flex-col bg-zinc-950 text-zinc-50 pb-16 sm:pb-0">
      {/* Header with auto-hide scroll behavior (client wrapper) */}
      <LessonPageHider>
        <HeaderScrollWrapper>
          <Header />
        </HeaderScrollWrapper>
      </LessonPageHider>

      <main id="main-content" className="flex-1 bg-zinc-950">
        {children}
      </main>

      {/* BottomNav with SRS badge count */}
      <LessonPageHider>
        <BottomNav dueCardsCount={dueCardsCount} />
      </LessonPageHider>

      <CommandPaletteLoader />
    </div>
  );
}
