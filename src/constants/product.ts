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
    dot: "bg-primary/50",
    text: "text-primary/90",
    color: "var(--taupe-500)",
  },
  under_review: {
    label: "Đang xem xét",
    dot: "bg-blue-400",
    text: "text-blue-700 dark:text-blue-400",
    color: "var(--color-blue-400, #60a5fa)",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-destructive",
    text: "text-destructive",
    color: "var(--error, #ef4444)",
  },
  review_requested: {
    label: "Yêu cầu xem xét",
    dot: "bg-primary/40",
    text: "text-primary/80",
    color: "var(--warning, #f59e0b)",
  },
  approved: {
    label: "Đã duyệt",
    dot: "bg-primary/70",
    text: "text-primary",
    color: "var(--success, #10b981)",
  },
  active: {
    label: "Đang bán",
    dot: "bg-primary",
    text: "text-primary",
    color: "var(--success, #10b981)",
  },
  inactive: {
    label: "Ẩn",
    dot: "bg-muted-foreground/50",
    text: "text-muted-foreground",
    color: "var(--taupe-400)",
  },
  sold: {
    label: "Đã bán",
    dot: "bg-foreground",
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
