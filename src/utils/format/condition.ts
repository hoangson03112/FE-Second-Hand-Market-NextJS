/**
 * Utility functions for formatting product condition display
 */

export type ProductCondition = "new" | "like_new" | "good" | "fair" | "poor";

interface ConditionInfo {
  label: string;
  color: string;
  badgeColor: string;
  description: string;
}

const CONDITION_MAP: Record<ProductCondition, ConditionInfo> = {
  new: {
    label: "Mới",
    color: "text-emerald-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    description: "Sản phẩm hoàn toàn mới, chưa qua sử dụng",
  },
  like_new: {
    label: "Như mới",
    color: "text-blue-600",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Sản phẩm gần như mới, ít dấu hiệu sử dụng",
  },
  good: {
    label: "Tốt",
    color: "text-green-600",
    badgeColor: "bg-green-50 text-green-700 border-green-200",
    description: "Sản phẩm đã qua sử dụng nhưng còn tốt",
  },
  fair: {
    label: "Khá",
    color: "text-amber-600",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Sản phẩm có dấu hiệu sử dụng rõ ràng",
  },
  poor: {
    label: "Đã dùng lâu",
    color: "text-orange-600",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200",
    description: "Sản phẩm đã qua sử dụng lâu, có nhiều dấu hiệu hao mòn",
  },
};

/**
 * Get Vietnamese label for product condition (backward compatible)
 */
export function formatCondition(condition: string | undefined | null): string {
  if (!condition) return "Đã sử dụng";
  return CONDITION_MAP[condition as ProductCondition]?.label || condition;
}

/**
 * Get Vietnamese label for product condition
 */
export function getConditionLabel(condition: ProductCondition | string): string {
  return CONDITION_MAP[condition as ProductCondition]?.label || "Không xác định";
}

/**
 * Get text color class for product condition
 */
export function getConditionColor(condition: ProductCondition | string): string {
  return CONDITION_MAP[condition as ProductCondition]?.color || "text-neutral-600";
}

/**
 * Get badge color classes for product condition
 */
export function getConditionBadgeColor(condition: ProductCondition | string): string {
  return (
    CONDITION_MAP[condition as ProductCondition]?.badgeColor ||
    "bg-neutral-50 text-neutral-700 border-neutral-200"
  );
}

/**
 * Get description for product condition
 */
export function getConditionDescription(condition: ProductCondition | string): string {
  return CONDITION_MAP[condition as ProductCondition]?.description || "";
}

/**
 * Get all condition info
 */
export function getConditionInfo(condition: ProductCondition | string): ConditionInfo | null {
  return CONDITION_MAP[condition as ProductCondition] || null;
}

/**
 * Get all available conditions
 */
export function getAllConditions(): Array<{ value: ProductCondition; label: string }> {
  return [
    { value: "new", label: "Mới" },
    { value: "like_new", label: "Như mới" },
    { value: "good", label: "Tốt" },
    { value: "fair", label: "Khá" },
    { value: "poor", label: "Đã dùng lâu" },
  ];
}
