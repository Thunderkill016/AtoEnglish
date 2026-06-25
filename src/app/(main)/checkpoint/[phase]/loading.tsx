export default function CheckpointLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6 animate-pulse">
      {/* Phase badge */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-7 w-48 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Progress bar */}
      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div className="h-2 w-2/5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
      </div>

      {/* Question */}
      <div className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />

      {/* Answer options */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
      ))}
    </div>
  );
}
