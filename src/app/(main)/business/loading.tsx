export default function BusinessLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6 animate-pulse">
      {/* Hero */}
      <div className="space-y-3">
        <div className="h-8 w-64 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-4 w-96 rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
        ))}
      </div>

      {/* Section */}
      <div className="h-48 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />
    </div>
  );
}
