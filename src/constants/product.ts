import type { ProductStatusFilter } from "@/types/product";

/**
 * Product-related constants
 * Product status, messages, and configurations
 */

// ============================================================================
// Product Status Configuration
// ============================================================================

export const PRODUCT_STATUS_CONFIG: Record<
  ProductStatusFilter,
  { label: string; dot: string; text: string; color: string }
> = {
  pending: {
    label: "Chờ duyệt",
    dot: "bg-amber-400",
    text: "text-amber-700 dark:text-amber-400",
    color: "var(--taupe-500)",
  },
  under_review: {
    label: "Đang xem xét",
    dot: "bg-blue-400",
    text: "text-blue-700 dark:text-blue-400",
    color: "#60a5fa",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-red-400",
    text: "text-red-700 dark:text-red-400",
    color: "#f87171",
  },
  approved: {
    label: "Đã duyệt",
    dot: "bg-emerald-400",
    text: "text-emerald-700 dark:text-emerald-400",
    color: "#34d399",
  },
  active: {
    label: "Đang bán",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    color: "#34d399",
  },
  inactive: {
    label: "Ẩn",
    dot: "bg-zinc-400",
    text: "text-zinc-600 dark:text-zinc-400",
    color: "var(--taupe-400)",
  },
  sold: {
    label: "Đã bán",
    dot: "bg-zinc-500",
    text: "text-zinc-600 dark:text-zinc-400",
    color: "var(--taupe-400)",
  },
};

// ============================================================================
// Messages
// ============================================================================

export const PRODUCT_MESSAGES = {
  DELETE_CONFIRM: "Bạn có chắc muốn xóa sản phẩm này?",
  DELETE_SUCCESS: "Đã xóa sản phẩm",
  DELETE_ERROR: "Không thể xóa sản phẩm",
  LOAD_ERROR: "Không tải được danh sách. Vui lòng thử lại.",
  LOADING: "Đang tải...",
  NO_PRODUCTS: "Chưa có sản phẩm",
  NO_PRODUCTS_DESC: "Đăng tin đầu tiên để bắt đầu bán trên Eco Market",
} as const;
