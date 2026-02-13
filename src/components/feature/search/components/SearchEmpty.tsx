"use client";

import { Search } from "lucide-react";

export default function SearchEmpty() {
  return (
    <div className="text-center py-20">
      <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
      <h2 className="text-lg font-semibold text-foreground mb-2">
        Nhập từ khóa để tìm kiếm
      </h2>
      <p className="text-muted-foreground">
        Sử dụng ô tìm kiếm trên thanh menu để tìm sản phẩm
      </p>
    </div>
  );
}
