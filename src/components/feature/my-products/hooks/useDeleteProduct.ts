import { useState } from "react";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/components/ui";
import { PRODUCT_MESSAGES } from "@/constants";

export function useDeleteProduct(onSuccess: () => void) {
  const toast = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (productId: string, productName: string) => {
    if (!window.confirm(`${PRODUCT_MESSAGES.DELETE_CONFIRM}\n"${productName}"?`)) {
      return;
    }

    setDeletingId(productId);
    try {
      await ProductService.delete(productId);
      toast.success(PRODUCT_MESSAGES.DELETE_SUCCESS);
      onSuccess();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : PRODUCT_MESSAGES.DELETE_ERROR
      );
    } finally {
      setDeletingId(null);
    }
  };

  return {
    deletingId,
    handleDelete,
  };
}
