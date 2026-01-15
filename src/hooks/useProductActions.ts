import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { AccountInfo } from "@/types/auth";

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

      // Save product and quantity to checkout store
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

      const { CartService } = await import("@/services/cart.service");
      await CartService.addToCart({
        productId: product._id,
        quantity,
      });

      console.log("Đã thêm vào giỏ hàng thành công");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
    } finally {
      setActionLoading(false);
    }
  }, [account, product, quantity]);

  const handleContactSeller = useCallback(() => {
    console.log("Liên hệ người bán:", product?.seller?._id);
    // TODO: Implement chat/contact functionality
  }, [product?.seller?._id]);



  return {
    actionLoading,

    handlePurchaseNow,
    handleAddToCart,
    handleContactSeller,
  };
}
