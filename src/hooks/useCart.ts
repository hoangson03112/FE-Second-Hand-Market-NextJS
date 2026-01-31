import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "@/services/cart.service";
import { queryKeys } from "@/lib/query-client";
import { serverStateConfig } from "@/lib/state";
import { useTokenStore } from "@/store/useTokenStore";
import type { CartItem } from "@/types/cart";

export function useCart() {
  const accessToken = useTokenStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const {
    data: cartItems = [],
    isLoading: isLoadingCart,
    error: cartError,
    refetch: refetchCart,
  } = useQuery<CartItem[]>({
    queryKey: queryKeys.cart.list(),
    queryFn: async () => {
      const res = await CartService.getCart();
      if (res.status === "success" && Array.isArray(res.cart)) {
        return res.cart;
      }
      return [];
    },
    enabled: !!accessToken,
    staleTime: serverStateConfig.staleTime.dynamic,
    gcTime: serverStateConfig.gcTime.dynamic,
  });

  const invalidateCartAndUser = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.cart.list() });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
  };

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      CartService.updateQuantity(productId, quantity),
    onSuccess: invalidateCartAndUser,
  });

  const deleteItemsMutation = useMutation({
    mutationFn: (productIds: string[]) => CartService.deleteItems(productIds),
    onSuccess: invalidateCartAndUser,
  });

  const clearCartMutation = useMutation({
    mutationFn: () => CartService.clearCart(),
    onSuccess: invalidateCartAndUser,
  });

  const updateQuantity = (productId: string, quantity: number) => {
    return updateQuantityMutation.mutateAsync({ productId, quantity });
  };

  const removeItems = (productIds: string[]) => {
    return deleteItemsMutation.mutateAsync(productIds);
  };

  const clearCart = () => {
    return clearCartMutation.mutateAsync();
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price ?? 0) * item.quantity,
    0
  );

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cartItems,
    isLoadingCart,
    cartError,
    refetchCart,
    subtotal,
    itemCount,
    updateQuantity,
    removeItems,
    clearCart,
    isUpdatingQuantity: updateQuantityMutation.isPending,
    isRemoving: deleteItemsMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
}
