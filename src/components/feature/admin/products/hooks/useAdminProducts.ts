import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import type { IProduct, ProductStatusFilter } from "@/types/product";
import { useToast } from "@/components/ui";

const LIMIT = 10;

export function useAdminProducts() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter | "">(
    ""
  );
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "products", statusFilter, page],
    queryFn: () =>
      ProductService.getProductsAdmin({
        status: statusFilter || undefined,
        page,
        limit: LIMIT,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      productId,
      status,
    }: {
      productId: string;
      status: "approved" | "rejected";
    }) => ProductService.updateStatus(productId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setSelectedProduct(null);
      toast.success(
        variables.status === "approved"
          ? "Đã duyệt sản phẩm thành công"
          : "Đã từ chối sản phẩm"
      );
    },
    onError: () => {
      toast.error("Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.");
    },
  });

  const handleApprove = useCallback(
    (product: IProduct) => {
      updateStatusMutation.mutate({
        productId: product._id,
        status: "approved",
      });
    },
    [updateStatusMutation]
  );

  const handleReject = useCallback(
    (product: IProduct) => {
      updateStatusMutation.mutate({
        productId: product._id,
        status: "rejected",
      });
    },
    [updateStatusMutation]
  );

  const totalPages = data
    ? Math.ceil((data.total || 0) / (data.limit || LIMIT)) || 1
    : 1;

  return {
    data,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    selectedProduct,
    setSelectedProduct,
    isUpdating: updateStatusMutation.isPending,
    handleApprove,
    handleReject,
  };
}

