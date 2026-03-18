import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProductService } from "@/services/product.service";
import type { IProduct, ProductStatusFilter } from "@/types/product";
import { useToast } from "@/components/ui/Toast";
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
  const [rejectProduct, setRejectProduct] = useState<IProduct | null>(null);

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
      status:
        | "approved"
        | "rejected"
        | "pending"
        | "under_review"
        | "active"
        | "inactive";
      reason?: string;
    }) => ProductService.updateStatus(productId, status, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      setSelectedProduct(null);
      setRejectProduct(null);
      let msg = "Đã cập nhật trạng thái sản phẩm";
      if (variables.status === "approved") msg = "Đã duyệt sản phẩm thành công";
      else if (variables.status === "rejected") msg = "Đã từ chối sản phẩm";
      else if (variables.status === "active") msg = "Đã bật hiển thị sản phẩm";
      else if (variables.status === "inactive") msg = "Đã ẩn sản phẩm";
      toast.success(msg);
    },
    onError: (err: unknown) => {
      const message =
        (isAxiosError(err)
          ? (err.response?.data as { message?: string } | undefined)?.message
          : undefined) ||
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

  const handleToggleVisibility = useCallback(
    (product: IProduct) => {
      const nextStatus =
        product.status === "inactive" ? "active" : "inactive";
      updateStatusMutation.mutate({
        productId: product._id,
        status: nextStatus,
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
    handleReject: handleRejectClick,
    rejectProduct,
    setRejectProduct,
    handleRejectConfirm,
    handleToggleVisibility,
  };
}
