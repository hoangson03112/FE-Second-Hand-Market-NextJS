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

interface OpenChatParams {
  userId: string;
  userName: string;
  userAvatar?: string;
  product?: ProductInfo;
}

/**
 * Mở floating chat box với người dùng cụ thể
 */
export function openChat({ userId, userName, userAvatar, product }: OpenChatParams): void {
  if (typeof window === 'undefined') return;
  
  const openChatEvent = new CustomEvent('openChat', {
    detail: {
      userId,
      userName,
      userAvatar,
      product,
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
