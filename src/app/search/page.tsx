import { Suspense } from "react";
import Search from "@/components/feature/search/Search";

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    }>
      <Search />
    </Suspense>
  );
}
