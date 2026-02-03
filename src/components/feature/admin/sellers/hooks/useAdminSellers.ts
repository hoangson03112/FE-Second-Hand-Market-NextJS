import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminService, type AdminSeller } from "@/services/admin.service";
import { useToast } from "@/components/ui";

const LIMIT = 10;

export function useAdminSellers() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState<
    "pending" | "approved" | "rejected" | ""
  >("");
  const [page, setPage] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState<AdminSeller | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "sellers", statusFilter, page],
    queryFn: () =>
      AdminService.getSellers({
        status: statusFilter || undefined,
        page,
        limit: LIMIT,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      sellerId,
      status,
      rejectedReason,
    }: {
      sellerId: string;
      status: "approved" | "rejected" | "banned";
      rejectedReason?: string;
    }) => AdminService.updateSellerStatus(sellerId, status, rejectedReason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "sellers"] });
      setSelectedSeller(null);
      setRejectReason("");
      let message = "Cập nhật trạng thái seller thành công";
      if (variables.status === "approved") message = "Đã duyệt seller";
      if (variables.status === "rejected") message = "Đã từ chối seller";
      if (variables.status === "banned") message = "Đã khóa seller";
      toast.success(message);
    },
    onError: () => {
      toast.error("Không thể cập nhật trạng thái seller. Vui lòng thử lại.");
    },
  });

  const handleApprove = useCallback(
    (seller: AdminSeller) => {
      updateStatusMutation.mutate({ sellerId: seller._id, status: "approved" });
    },
    [updateStatusMutation]
  );

  const handleReject = useCallback(
    (seller: AdminSeller) => {
      updateStatusMutation.mutate({
        sellerId: seller._id,
        status: "rejected",
        rejectedReason: rejectReason || undefined,
      });
    },
    [updateStatusMutation, rejectReason]
  );

  const sellers = data?.data ?? [];
  const pagination = data?.pagination;
  const statistics = data?.statistics;
  const totalPages = pagination?.totalPages ?? 1;

  const openSeller = useCallback((seller: AdminSeller) => {
    setSelectedSeller(seller);
    setRejectReason("");
  }, []);

  const closeSeller = useCallback(() => {
    setSelectedSeller(null);
    setRejectReason("");
  }, []);

  return {
    sellers,
    pagination,
    statistics,
    totalPages,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    selectedSeller,
    rejectReason,
    setRejectReason,
    isUpdating: updateStatusMutation.isPending,
    handleApprove,
    handleReject,
    openSeller,
    closeSeller,
  };
}

