import { useState, useMemo } from "react";
import type { MyListingProduct, ProductStatusFilter } from "@/types/myProducts";

export function useProductsFilter(products: MyListingProduct[]) {
  const [activeFilter, setActiveFilter] = useState<ProductStatusFilter | "all">("all");

  const stats = useMemo(() => {
    return {
      all: products.length,
      pending: products.filter((p) => p.status === "pending").length,
      approved: products.filter((p) => p.status === "approved" || p.status === "active").length,
      rejected: products.filter((p) => p.status === "rejected").length,
      sold: products.filter((p) => p.status === "sold").length,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") return products;
    if (activeFilter === "approved") {
      return products.filter((p) => p.status === "approved" || p.status === "active");
    }
    return products.filter((p) => p.status === activeFilter);
  }, [products, activeFilter]);

  return {
    activeFilter,
    setActiveFilter,
    stats,
    filteredProducts,
  };
}
