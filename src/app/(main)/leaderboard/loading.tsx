export default function LeaderboardLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-2">
          <div className="h-6 w-40 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-24 rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2">
        <div className="h-9 w-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-24 rounded-lg bg-zinc-100 dark:bg-zinc-800/60" />
      </div>

      {/* Leaderboard rows */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60">
          <div className="h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-9 w-9 rounded-full bg-zinc-200 dark:bg-zinc-700" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-2.5 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          </div>
          <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-700" />
        </div>
      ))}
    </div>
  );
}
