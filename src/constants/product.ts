import type { ProductStatusFilter } from "@/types/product";


export const PRODUCT_STATUS_CONFIG: Record<
  ProductStatusFilter,
  { label: string; dot: string; text: string; color: string }
> = {
  pending: {
    label: "Chờ duyệt",
    dot: "bg-neutral-400",
    text: "text-neutral-600",
    color: "var(--luxury-ink)",
  },
  under_review: {
    label: "Đang xem xét",
    dot: "bg-luxury-ink",
    text: "text-luxury-ink",
    color: "var(--luxury-ink)",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-blush-600",
    text: "text-blush-800",
    color: "var(--blush-600)",
  },
  review_requested: {
    label: "Yêu cầu xem xét",
    dot: "bg-luxury-champagne",
    text: "text-neutral-700",
    color: "var(--luxury-champagne)",
  },
  approved: {
    label: "Đã duyệt",
    dot: "bg-accent",
    text: "text-taupe-700",
    color: "var(--accent)",
  },
  active: {
    label: "Đang bán",
    dot: "bg-accent",
    text: "text-taupe-700",
    color: "var(--accent)",
  },
  inactive: {
    label: "Ẩn",
    dot: "bg-neutral-400",
    text: "text-neutral-500",
    color: "var(--neutral-400)",
  },
  sold: {
    label: "Đã bán",
    dot: "bg-neutral-500",
    text: "text-neutral-600",
    color: "var(--taupe-400)",
  },
};


export const PRODUCT_MESSAGES = {
  DELETE_CONFIRM: "Bạn có chắc muốn xóa sản phẩm này?",
  DELETE_SUCCESS: "Đã xóa sản phẩm",
  DELETE_ERROR: "Không thể xóa sản phẩm",
  LOAD_ERROR: "Không tải được danh sách. Vui lòng thử lại.",
  LOADING: "Đang tải...",
  NO_PRODUCTS: "Chưa có sản phẩm",
  NO_PRODUCTS_DESC: "Đăng tin đầu tiên để bắt đầu bán trên Eco Market",
} as const;
