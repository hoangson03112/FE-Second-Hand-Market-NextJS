import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { IProduct } from "@/types/product";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import { AccountInfo } from "@/types/auth";
import { CartService, ProductService } from "@/services";
import { useToast } from "@/components/ui/Toast";
import { queryKeys } from "@/lib/query-client";
import { openChatWithSeller } from "@/utils/chat";
import { getAvatarUrl } from "@/utils";
import { CART_MESSAGES, SELLER_MESSAGES } from "@/constants/messages";

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
  const queryClient = useQueryClient();
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
      const freshProduct = await ProductService.getById(product._id);
      setCheckoutItems([{ product: freshProduct as IProduct, quantity }], "buy_now");
      router.push("/checkout");
    } catch (error) {
      console.error("Lỗi khi xử lý mua ngay:", error);
      toast.error("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
    } finally {
      setActionLoading(false);
    }
  }, [account, router, product, quantity, setCheckoutItems, toast]);

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

      // Invalidate cart queries to refresh cart data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });

      toast.success(CART_MESSAGES.ADD_SUCCESS);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error(CART_MESSAGES.ADD_ERROR);
    } finally {
      setActionLoading(false);
    }
  }, [account, product, quantity, toast, router, queryClient]);

  const handleContactSeller = useCallback(async () => {
    if (!account) {
      router.push("/login");
      return;
    }
    if (!product?.seller?._id || !product._id) {
      toast.error(SELLER_MESSAGES.CONTACT_SELLER_ERROR);
      return;
    }
    try {
      setActionLoading(true);
      
      // Open floating chat box with seller and product info
      openChatWithSeller({
        _id: product.seller._id,
        fullName: product.seller.fullName,
        avatar: getAvatarUrl(product.seller.avatar) ?? undefined,
      }, {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url,
        slug: product.slug,
      });
      
      toast.success(`Đang mở chat với ${product.seller.fullName || 'người bán'}`);
    } catch (error) {
      console.error("Lỗi khi liên hệ người bán:", error);
      toast.error(SELLER_MESSAGES.CONTACT_SELLER_ERROR);
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
