"use client";

import { useState, useCallback, useEffect } from "react";

export interface UsePaginationReturn {
  page: number;
  setPage: (page: number) => void;
  goToNext: () => void;
  goToPrev: () => void;
  resetPage: () => void;
}


export function usePagination(totalPages = 1): UsePaginationReturn {
  const [page, setPageState] = useState(1);


  useEffect(() => {
    if (totalPages > 0 && page > totalPages) {
      setPageState(1);
    }
  }, [totalPages, page]);

  const setPage = useCallback(
    (p: number) => setPageState(Math.max(1, Math.min(p, Math.max(1, totalPages)))),
    [totalPages],
  );

  const goToNext = useCallback(
    () => setPageState((p) => Math.min(p + 1, Math.max(1, totalPages))),
    [totalPages],
  );

  const goToPrev = useCallback(() => setPageState((p) => Math.max(p - 1, 1)), []);

  const resetPage = useCallback(() => setPageState(1), []);

  return { page, setPage, goToNext, goToPrev, resetPage };
}
