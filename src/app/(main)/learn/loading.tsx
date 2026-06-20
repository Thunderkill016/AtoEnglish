export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 bg-zinc-800 rounded-xl w-56 mb-2" />
      <div className="h-4 bg-zinc-800/60 rounded-lg w-72 mb-8" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-zinc-800/50 rounded-2xl mb-3" />
      ))}
    </div>
  );
}
