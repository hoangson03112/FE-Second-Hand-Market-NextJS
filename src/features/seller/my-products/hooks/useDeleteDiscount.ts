import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SellerService } from "@/services/seller.service";
import { MY_PRODUCTS_QUERY_KEY } from "./useMyProducts";
import { useToast } from "@/components/ui";
import type { MyListingsResponse } from "@/types/myProducts";

export function useDeleteDiscount(refetch?: () => void) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (discountId: string) => SellerService.deletePersonalDiscount(discountId),
    onSuccess: (_, discountId) => {
      toast.success("Đã xóa ưu đãi");
      // Ưu đãi có thể nằm ở bất kỳ trang/tab nào đang được cache.
      queryClient.setQueriesData<MyListingsResponse>(
        { queryKey: MY_PRODUCTS_QUERY_KEY },
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.map((p) => ({
              ...p,
              personalDiscounts:
                p.personalDiscounts?.filter((d) => d._id !== discountId) ?? [],
            })),
          };
        },
      );
      refetch?.();
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        "Xóa ưu đãi thất bại";
      toast.error(msg);
    },
  });

  return {
    deletingId: mutation.isPending ? (mutation.variables as string) : null,
    handleDelete: mutation.mutate,
  };
}
