import { ProductService } from "@/services/product.service";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import type { CartItem as CartItemType } from "@/types/cart";
import type { IProduct } from "@/types/product";

/**
 * Lấy danh sách sản phẩm đã chọn từ cart, fetch full product (có seller.from_district_id, from_ward_code)
 * rồi set vào checkout store. Dùng khi bấm "Mua hàng" từ cart.
 */
export async function moveSelectedCartToCheckout(
  cartItems: CartItemType[],
  selectedProductIds: Set<string>
): Promise<void> {
  const selected = cartItems.filter((item) =>
    item.productId?._id ? selectedProductIds.has(item.productId._id) : false
  );
  if (selected.length === 0) return;

  const { setCheckoutItems } = useCheckoutStore.getState();
  const checkoutItems = await Promise.all(
    selected.map(async (item) => {
      const product = await ProductService.getById(item.productId!._id);
      return {
        product: product as IProduct,
        quantity: item.quantity,
      };
    })
  );
  setCheckoutItems(checkoutItems);
}
