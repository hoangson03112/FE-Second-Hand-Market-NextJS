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
    <div className="min-h-screen bg-background">
      <SearchHeader query={q} total={total} />

      <div className="max-w-7xl mx-auto px-4 py-8">
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
