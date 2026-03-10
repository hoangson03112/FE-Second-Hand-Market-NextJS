import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/components/ui/Toast";
import type { MyListingsResponse } from "@/types/myProducts";
import { PRODUCT_UI_MESSAGES } from "@/constants/messages";

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
    toast.error(PRODUCT_UI_MESSAGES.LIST_LOAD_ERROR);
  }, [error, toast]);

  return {
    products: data?.data ?? [],
    isLoading,
    error,
    refetch,
  };
}

