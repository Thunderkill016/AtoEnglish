export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* Greeting row */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-8 w-56 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-10 w-28 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="lg:col-span-5 space-y-5">
          <div className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
          <div className="h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
        ))}
      </div>
    </div>
  );
}
