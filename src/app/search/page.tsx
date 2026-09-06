import { Suspense } from "react";
import Search from "@/features/search/Search";

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-luxury-ivory">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-luxury-ink border-t-transparent" />
      </div>
    }>
      <Search />
    </Suspense>
  );
}
