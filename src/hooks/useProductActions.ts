import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product";

interface UseProductActionsProps {
  product: IProduct | null;
  account: any;
  quantity: number;
}

export function useProductActions({ product, account, quantity }: UseProductActionsProps) {
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

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

      const checkoutParams = new URLSearchParams({
        productId: product._id,
        quantity: quantity.toString(),
        action: "purchase-now",
      });

      router.push(`/checkout?${checkoutParams.toString()}`);
    } catch (error) {
      console.error("Lỗi khi xử lý mua ngay:", error);
    } finally {
      setActionLoading(false);
    }
  }, [account, router, product, quantity]);

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

  const handleToggleFavorite = useCallback(() => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite/wishlist functionality
  }, [isFavorite]);

  return {
    actionLoading,
    isFavorite,
    handlePurchaseNow,
    handleAddToCart,
    handleContactSeller,
    handleToggleFavorite,
  };
}

