export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

/** Parse user price input (handles "70.000", "70,000", "70000") to number. Returns 0 if invalid. */
export const parsePriceInput = (input: string): number => {
  if (!input || typeof input !== "string") return 0;
  const digitsOnly = input.replace(/\D/g, "");
  if (!digitsOnly) return 0;
  const parsed = parseInt(digitsOnly, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/** Compute discount amount and percent. Guards against invalid/zero original price. */
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