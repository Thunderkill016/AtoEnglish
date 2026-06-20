export default function UnitLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header skeleton */}
        <div className="space-y-3 animate-pulse">
          <div className="h-4 w-24 bg-muted rounded-lg" />
          <div className="h-8 w-64 bg-muted rounded-xl" />
          <div className="h-4 w-48 bg-muted rounded-lg" />
        </div>

        {/* Progress bar skeleton */}
        <div className="h-2 w-full bg-muted rounded-full animate-pulse" />

        {/* Lesson items skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-16 bg-muted/50 rounded-2xl animate-pulse"
              style={{ animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
