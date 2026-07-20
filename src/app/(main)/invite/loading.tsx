import { StatLine } from "@/components/ui/page";
export default function InviteLoading() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 space-y-8 animate-pulse text-center">
      {/* Icon */}
      <div className="mx-auto h-20 w-20 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />

      {/* Title */}
      <div className="space-y-3">
        <div className="mx-auto h-7 w-56 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="mx-auto h-3 w-80 rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
        <div className="mx-auto h-3 w-64 rounded-full bg-zinc-100 dark:bg-zinc-800/60" />
      </div>

      {/* Invite code box */}
      <div className="h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60" />

      {/* Share buttons */}
      <div className="flex gap-3 justify-center">
        <div className="h-10 w-32 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-10 w-32 rounded-xl bg-zinc-100 dark:bg-zinc-800/60" />
      </div>
    </div>
  );
}
