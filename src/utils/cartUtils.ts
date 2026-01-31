import type { CartItem as CartItemType } from "@/types/cart";

export function getSelectedSubtotal(
  cartItems: CartItemType[],
  selectedIds: Set<string>
): number {
  return cartItems.reduce((sum, item) => {
    const id = item.productId?._id;
    if (!id || !selectedIds.has(id)) return sum;
    return sum + (item.productId?.price ?? 0) * item.quantity;
  }, 0);
}

export interface CartGroupBySeller {
  sellerId: string;
  sellerName: string;
  sellerAvatar: string | null;
  items: CartItemType[];
}

export function groupCartBySeller(
  cartItems: CartItemType[]
): CartGroupBySeller[] {
  const map = new Map<
    string,
    { sellerName: string; sellerAvatar: string | null; items: CartItemType[] }
  >();

  for (const item of cartItems) {
    const seller = item.productId?.sellerId;
    const id = seller?._id ?? "unknown";
    const name = seller?.fullName ?? "Shop";
    const avatar = seller?.avatar ?? null;

    if (!map.has(id)) {
      map.set(id, { sellerName: name, sellerAvatar: avatar, items: [] });
    }
    map.get(id)!.items.push(item);
  }

  return Array.from(map.entries()).map(([sellerId, data]) => ({
    sellerId,
    sellerName: data.sellerName,
    sellerAvatar: data.sellerAvatar,
    items: data.items,
  }));
}
