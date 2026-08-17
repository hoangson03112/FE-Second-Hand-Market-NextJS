"use client";

import { useSearch } from "./hooks";
import {
  SearchHeader,
  SearchEmpty,
  SearchError,
  SearchResults,
} from "./components";

export default function Search() {
  const {
    q,
    filters,
    setFilters,
    products,
    total,
    currentPage,
    totalPages,
    isLoading,
    error,
  } = useSearch();

  return (
    <div className="min-h-screen bg-luxury-ivory">
      <SearchHeader query={q} total={total} />

      <div className="mx-auto w-full max-w-9xl px-4 py-10 sm:px-6 lg:px-8 md:py-12">
        {!q ? (
          <SearchEmpty />
        ) : error ? (
          <SearchError />
        ) : (
          <SearchResults
            query={q}
            filters={filters}
            onFilterChange={setFilters}
            products={products}
            isLoading={isLoading}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            limit={filters.limit || 20}
          />
        )}
      </div>
    </div>
  );
}