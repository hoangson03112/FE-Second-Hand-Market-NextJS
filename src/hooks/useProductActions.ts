import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { AccountInfo } from "@/types/auth";
import { CartService } from "@/services";
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

  const handleContactSeller = useCallback(() => {
    // TODO: Implement chat/contact functionality
  }, []);



  return {
    actionLoading,

    handlePurchaseNow,
    handleAddToCart,
    handleContactSeller,
  };
}
