import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import type { IProduct, ProductStatusFilter } from "@/types/product";
import { useToast } from "@/components/ui";
import { isAxiosError } from "axios";

const LIMIT = 10;

export function useAdminProducts() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState<ProductStatusFilter | "">(
    ""
  );
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [rejectProduct, setRejectProduct] = useState<IProduct | null>(null); // Sản phẩm đang được reject

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
      reason,
    }: {
      productId: string;
      status: "approved" | "rejected";
      reason?: string;
    }) => ProductService.updateStatus(productId, status, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setSelectedProduct(null);
      setRejectProduct(null);
      toast.success(
        variables.status === "approved"
          ? "Đã duyệt sản phẩm thành công"
          : "Đã từ chối sản phẩm"
      );
    },
    onError: (err: unknown) => {
      const message =
        (isAxiosError(err) ? (err.response?.data as { message?: string } | undefined)?.message : undefined) ||
        "Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại.";
      toast.error(message);
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

  const handleRejectClick = useCallback((product: IProduct) => {
    // Mở modal nhập lý do
    setRejectProduct(product);
  }, []);

  const handleRejectConfirm = useCallback(
    (reason: string) => {
      if (!rejectProduct) return;
      updateStatusMutation.mutate({
        productId: rejectProduct._id,
        status: "rejected",
        reason,
      });
    },
    [rejectProduct, updateStatusMutation]
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
    handleReject: handleRejectClick,
    rejectProduct,
    setRejectProduct,
    handleRejectConfirm,
  };
}

