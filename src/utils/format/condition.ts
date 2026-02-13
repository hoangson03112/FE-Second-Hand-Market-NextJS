export type ProductCondition = "new" | "like_new" | "good" | "fair" | "poor";

const CONDITION_VI: Record<ProductCondition, string> = {
  new: "Mới",
  like_new: "Như mới",
  good: "Tốt",
  fair: "Khá",
  poor: "Đã dùng lâu",
};

/**
 * Chuyển condition sản phẩm sang tiếng Việt
 */
export function formatCondition(condition: string | undefined | null): string {
  if (!condition) return "Đã sử dụng";
  return CONDITION_VI[condition as ProductCondition] ?? condition;
}
