"use client";


import { IconSearch } from "@tabler/icons-react";
interface SearchHeaderProps {
  query: string;
  total: number;
}

export default function SearchHeader({ query, total }: SearchHeaderProps) {
  return (
    <div className="border-b-2 border-border bg-gradient-to-r from-cream-50 to-taupe-50/30 sticky top-0 z-10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-2">
          <IconSearch className="w-5 h-5 text-primary" />
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-taupe-400">TÌM KIẾM</p>
        </div>
        <h1 className="text-xl font-medium text-taupe-900 leading-tight">
          &quot;{query || "..."}&quot;
        </h1>
        {query && (
          <p className="text-sm text-taupe-500 mt-1">
            Tìm thấy {total} sản phẩm
          </p>
        )}
      </div>
    </div>
  );
}
