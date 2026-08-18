import { Skeleton } from "@/components/ui";

interface ProductLoadingStateProps {
  viewMode?: "list" | "grid";
}

const BONE = "rounded-[2px] bg-luxury-ink/8";

export function ProductLoadingState({
  viewMode = "grid",
}: ProductLoadingStateProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-5 rounded-[2px] border border-luxury-ink/10 bg-white p-5"
          >
            <Skeleton className={`h-24 w-24 shrink-0 ${BONE}`} />
            <div className="flex-1 space-y-3">
              <Skeleton className={`h-4 w-2/3 ${BONE}`} />
              <Skeleton className={`h-3 w-1/3 ${BONE}`} />
              <div className="flex items-center justify-between border-t border-luxury-ink/8 pt-3">
                <Skeleton className={`h-6 w-28 ${BONE}`} />
                <Skeleton className={`h-9 w-40 ${BONE}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white"
        >
          <Skeleton className={`aspect-square w-full ${BONE}`} />
          <div className="space-y-3 p-4">
            <Skeleton className={`h-3 w-1/3 ${BONE}`} />
            <Skeleton className={`h-4 w-3/4 ${BONE}`} />
            <div className="flex items-center justify-between border-t border-luxury-ink/8 pt-3">
              <Skeleton className={`h-5 w-24 ${BONE}`} />
              <Skeleton className={`h-3 w-12 ${BONE}`} />
            </div>
            <div className="flex gap-2">
              <Skeleton className={`h-9 flex-1 ${BONE}`} />
              <Skeleton className={`h-9 flex-1 ${BONE}`} />
              <Skeleton className={`h-9 w-9 ${BONE}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
