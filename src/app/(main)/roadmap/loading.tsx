import { StatLine } from "@/components/ui/page";
export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-zinc-800 rounded-xl w-48 mb-2" />
      <div className="h-4 bg-zinc-800/60 rounded-lg w-64 mb-8" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-32 bg-zinc-800/50 rounded-2xl mb-4" />
      ))}
    </div>
  );
}
