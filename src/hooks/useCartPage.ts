"use client";

import { useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./useCart";
import { moveSelectedCartToCheckout } from "@/utils/cartToCheckout";
import {
  getSelectedSubtotal,
  groupCartBySeller,
  type CartGroupBySeller,
} from "@/utils/cartUtils";
import { useToast } from "@/components/ui";

export function useCartPage() {
  const router = useRouter();
  const toast = useToast();
  const {
    cartItems,
    isLoadingCart,
    itemCount,
    updateQuantity,
    removeItems,
    isUpdatingQuantity,
    isRemoving,
    isClearing,
  } = useCart();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isGoingToCheckout, setIsGoingToCheckout] = useState(false);

  const selectedSubtotal = useMemo(
    () => getSelectedSubtotal(cartItems, selectedIds),
    [cartItems, selectedIds]
  );
  const selectedCount = selectedIds.size;
  const groups = useMemo<CartGroupBySeller[]>(
    () => groupCartBySeller(cartItems),
    [cartItems]
  );
  const allSelected =
    cartItems.length > 0 &&
    cartItems.every((item) => selectedIds.has(item.productId?._id ?? ""));
  const isBusy = isUpdatingQuantity || isRemoving || isClearing;

  const handleToggle = useCallback((productId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(
          new Set(
            cartItems.map((item) => item.productId?._id).filter(Boolean) as string[]
          )
        );
      } else {
        setSelectedIds(new Set());
      }
    },
    [cartItems]
  );

  const handleSelectAllInShop = useCallback(
    (productIds: string[], checked: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (checked) {
          productIds.forEach((id) => next.add(id));
        } else {
          productIds.forEach((id) => next.delete(id));
        }
        return next;
      });
    },
    []
  );

  const handleRemoveItem = useCallback(
    (productId: string) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      removeItems([productId]);
    },
    [removeItems]
  );

  const handleGoToCheckout = useCallback(async () => {
    if (selectedCount === 0) return;
    setIsGoingToCheckout(true);
    try {
      await moveSelectedCartToCheckout(cartItems, selectedIds);
      router.push("/checkout");
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsGoingToCheckout(false);
    }
  }, [cartItems, selectedIds, selectedCount, router, toast]);

  return {
    // Data
    cartItems,
    groups,
    itemCount,
    selectedIds,
    selectedCount,
    selectedSubtotal,
    allSelected,
    // Loading / busy
    isLoadingCart,
    isBusy,
    isGoingToCheckout,
    // Actions
    updateQuantity,
    handleToggle,
    handleSelectAll,
    handleSelectAllInShop,
    handleRemoveItem,
    handleGoToCheckout,
  };
}
