export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};


export const parsePriceInput = (input: string): number => {
  if (!input || typeof input !== "string") return 0;
  const digitsOnly = input.replace(/\D/g, "");
  if (!digitsOnly) return 0;
  const parsed = parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};


export const getDiscountStats = (
  originalPrice: number,
  discountedPrice: number
): { discountAmount: number; discountPercent: number } => {
  if (originalPrice <= 0 || discountedPrice <= 0 || discountedPrice > originalPrice) {
    return { discountAmount: 0, discountPercent: 0 };
  }
  const discountAmount = originalPrice - discountedPrice;
  const discountPercent = Math.round((discountAmount / originalPrice) * 100);
  return { discountAmount, discountPercent };
};