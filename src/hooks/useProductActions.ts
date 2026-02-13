import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { AccountInfo } from "@/types/auth";
import { CartService, ChatService } from "@/services";
import { useToast } from "@/components/ui";

interface UseProductActionsProps {
  product: IProduct | null;
  account: AccountInfo;
  quantity: number;
}

export function useProductActions({
  product,
  account,
  quantity,
}: UseProductActionsProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(false);
  const { setCheckoutItems } = useCheckoutStore();
  const toast = useToast();

  const handlePurchaseNow = useCallback(async () => {
    if (!account) {
      router.push("/login");
      return;
    }
    if (!product || quantity <= 0 || quantity > (product.stock || 0)) {
      return;
    }

    if (!product.stock || product.stock <= 0) {
      console.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      setActionLoading(true);
        
      setCheckoutItems([{ product, quantity }]);

      // Navigate to checkout page
      router.push("/checkout");
    } catch (error) {
      console.error("Lỗi khi xử lý mua ngay:", error);
    } finally {
      setActionLoading(false);
    }
  }, [account, router, product, quantity, setCheckoutItems]);

  const handleAddToCart = useCallback(async () => {
    if (!account) {
      router.push("/login");
      return;
    }

    if (!product || quantity <= 0 || quantity > (product.stock || 0)) {
      return;
    }

    if (!product.stock || product.stock <= 0) {
      console.error("Sản phẩm đã hết hàng");
      return;
    }

    try {
      setActionLoading(true);

      await CartService.addToCart({
        productId: product._id,
        quantity,
      });

      toast.success("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    } finally {
      setActionLoading(false);
    }
  }, [account, product, quantity, toast]);

  const handleContactSeller = useCallback(async () => {
    if (!account) {
      router.push("/login");
      return;
    }
    if (!product?.seller?._id || !product._id) {
      toast.error("Không thể liên hệ người bán");
      return;
    }
    try {
      setActionLoading(true);
      const res = await ChatService.findOrCreateWithProduct(
        product._id,
        product.seller._id
      );
      if (res.success && res.data?.conversationId) {
        router.push(
          `/chat?conversationId=${res.data.conversationId}&partnerId=${res.partner?._id || product.seller._id}`
        );
      } else {
        toast.error("Không thể mở hội thoại");
      }
    } catch (error) {
      console.error("Lỗi khi liên hệ người bán:", error);
      toast.error("Không thể liên hệ người bán");
    } finally {
      setActionLoading(false);
    }
  }, [account, product, router, toast]);



  return {
    actionLoading,

    handlePurchaseNow,
    handleAddToCart,
    handleContactSeller,
  };
}
