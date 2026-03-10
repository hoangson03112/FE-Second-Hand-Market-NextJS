/**
 * Utility functions for chat operations
 */

interface ProductInfo {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug?: string;
}

interface OrderInfo {
  _id: string;
  status: string;
  ghnOrderCode?: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

interface OpenChatParams {
  userId: string;
  userName: string;
  userAvatar?: string;
  product?: ProductInfo;
  order?: OrderInfo;
}

/**
 * Mở floating chat box với người dùng cụ thể
 */
export function openChat({ userId, userName, userAvatar, product, order }: OpenChatParams): void {
  if (typeof window === 'undefined') return;
  
  const openChatEvent = new CustomEvent('openChat', {
    detail: {
      userId,
      userName,
      userAvatar,
      product,
      order,
    }
  });
  
  window.dispatchEvent(openChatEvent);
}

/**
 * Mở chat với người bán từ thông tin sản phẩm
 */
export function openChatWithSeller(
  seller: {
    _id: string;
    fullName?: string;
    avatar?: string;
  },
  product?: ProductInfo
): void {
  openChat({
    userId: seller._id,
    userName: seller.fullName || 'Người bán',
    userAvatar: seller.avatar,
    product,
  });
}

/**
 * Mở chat với người bán kèm thông tin đơn hàng
 */
export function openChatWithOrder(
  seller: {
    _id: string;
    fullName?: string;
    avatar?: string;
  },
  order: OrderInfo
): void {
  openChat({
    userId: seller._id,
    userName: seller.fullName || 'Người bán',
    userAvatar: seller.avatar,
    order,
  });
}
