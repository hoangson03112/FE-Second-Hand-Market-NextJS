import { useState } from "react";
import { ProductService } from "@/services/product.service";
import { useToast } from "@/components/shared";
import { useConfirm } from "@/components/shared";
import { PRODUCT_UI_MESSAGES } from "@/constants/messages";

export function useRequestReview(onSuccess?: () => void) {
  const toast = useToast();
  const { confirm } = useConfirm();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestReview = async (productId: string) => {
    const ok = await confirm({
      title: "Yêu cầu duyệt lại sản phẩm",
      message:
        "Bạn muốn gửi yêu cầu để admin xem xét lại sản phẩm này? Admin sẽ kiểm tra trong vòng 24 giờ.",
      confirmText: "Gửi yêu cầu",
      cancelText: "Hủy",
      variant: "warning",
    });
    if (!ok) {
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
