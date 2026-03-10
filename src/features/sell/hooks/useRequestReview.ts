import { useState } from "react";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/components/ui/Toast";
import { PRODUCT_UI_MESSAGES } from "@/constants/messages";

export function useRequestReview(onSuccess?: () => void) {
  const toast = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestReview = async (productId: string) => {
    if (!window.confirm("Bạn muốn yêu cầu admin xem xét lại sản phẩm này?")) {
      return;
    }

    setIsRequesting(true);
    try {
      await ProductService.requestReview(productId);
      toast.success(PRODUCT_UI_MESSAGES.REVIEW_REQUEST_SUCCESS);
      onSuccess?.();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Không thể gửi yêu cầu"
      );
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    isRequesting,
    handleRequestReview,
  };
}
