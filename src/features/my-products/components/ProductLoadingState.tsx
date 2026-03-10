export function ProductLoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl bg-card border border-border overflow-hidden">
          <div className="w-full aspect-square bg-muted animate-pulse" />
          <div className="p-3.5 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="h-5 bg-muted rounded w-20 animate-pulse" />
              <div className="h-3 bg-muted rounded w-16 animate-pulse" />
            </div>
            <div className="flex gap-1.5">
              <div className="flex-1 h-8 bg-muted rounded-lg animate-pulse" />
              <div className="flex-1 h-8 bg-muted rounded-lg animate-pulse" />
              <div className="h-8 w-8 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
