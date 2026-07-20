import { StatLine } from "@/components/ui/page";
export default function ChallengeLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-7 w-44 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      </div>

      {/* Challenge card */}
      <div className="h-56 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />

      {/* Options */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
      ))}
    </div>
  );
}
