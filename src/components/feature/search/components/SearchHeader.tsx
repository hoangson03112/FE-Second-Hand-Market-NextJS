"use client";

import { Search } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  total: number;
}

export default function SearchHeader({ query, total }: SearchHeaderProps) {
  return (
    <div className="border-b border-border bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            Kết quả tìm kiếm: &quot;{query || "..."}&quot;
          </h1>
        </div>
        {query && (
          <p className="text-sm text-muted-foreground">
            Tìm thấy {total} sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
