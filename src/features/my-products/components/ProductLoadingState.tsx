import { Skeleton } from "@/components/shared";

export function ProductLoadingState() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl bg-card border border-border overflow-hidden">
          <Skeleton className="w-full aspect-square" />
          <div className="p-3.5 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="flex gap-1.5">
              <Skeleton className="flex-1 h-8 rounded-lg" />
              <Skeleton className="flex-1 h-8 rounded-lg" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
