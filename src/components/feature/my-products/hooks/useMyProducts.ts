import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/components/ui";
import type { MyListingsResponse } from "@/types/myProducts";

export function useMyProducts() {
  const toast = useToast();

  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery<MyListingsResponse, Error>({
    queryKey: ["my", "products"],
    queryFn: async () => {
      const res = await ProductService.getMyListings();
      if (!res.success) {
        throw new Error(res.message || "Không thể tải danh sách sản phẩm của bạn");
      }
      return res;
    },
    staleTime: 30_000,
  });

  useEffect(() => {
    if (!error) return;
    toast.error("Không thể tải danh sách sản phẩm của bạn. Vui lòng thử lại.");
  }, [error, toast]);

  return {
    products: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

