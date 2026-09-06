import type { ProductStatusFilter } from "@/types/product";

export const CONDITION_LABEL: Record<string, string> = {
  new: "Mới",
  like_new: "Như mới",
  good: "Tốt",
  fair: "Khá",
  poor: "Cũ",
};

export const STATUS_TABS: { value: ProductStatusFilter | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Chờ duyệt" },
  { value: "review_requested", label: "Yêu cầu duyệt lại" },
  { value: "under_review", label: "Đang xem xét" },
  { value: "approved", label: "Đang bán" },
  { value: "rejected", label: "Từ chối" },
];


// Tone classes mirror the canonical status-tone system in
// src/features/order/components/OrderStatusChip.tsx /
// src/features/seller/my-products/components/ProductStatusChip.tsx
export const STATUS_TABLE_BADGE: Record<string, { label: string; className: string }> = {
  pending:          { label: "Chờ duyệt",         className: "bg-cream-50 text-neutral-600 border-luxury-ink/12" },
  review_requested: { label: "Yêu cầu duyệt lại", className: "bg-cream-100 text-neutral-700 border-luxury-champagne/50" },
  under_review:     { label: "Đang xem xét",       className: "bg-white text-luxury-ink border-luxury-ink/20" },
  pending_review:   { label: "Đang xem xét",       className: "bg-cream-100 text-neutral-700 border-luxury-champagne/50" },
  approved:     { label: "Đang bán",     className: "bg-taupe-50 text-taupe-700 border-accent/35" },
  rejected:     { label: "Từ chối",      className: "bg-blush-50 text-blush-800 border-blush-300" },
  active:       { label: "Đang bán",     className: "bg-taupe-50 text-taupe-700 border-accent/35" },
  inactive:     { label: "Ẩn",           className: "bg-cream-50 text-neutral-600 border-luxury-ink/12" },
  sold:         { label: "Đã bán",       className: "bg-white text-luxury-ink border-luxury-ink/20" },
};

export const STATUS_BADGE: Record<
  string,
  { label: string; dot: string; chip: string }
> = {
  pending: {
    label: "Chờ duyệt",
    dot: "bg-neutral-400",
    chip: "bg-cream-50 text-neutral-600 border-luxury-ink/12",
  },
  review_requested: {
    label: "Yêu cầu duyệt lại",
    dot: "bg-luxury-champagne",
    chip: "bg-cream-100 text-neutral-700 border-luxury-champagne/50",
  },
  under_review: {
    label: "Đang xem xét",
    dot: "bg-luxury-ink",
    chip: "bg-white text-luxury-ink border-luxury-ink/20",
  },
  approved: {
    label: "Đang bán",
    dot: "bg-accent",
    chip: "bg-taupe-50 text-taupe-700 border-accent/35",
  },
  active: {
    label: "Đang bán",
    dot: "bg-accent",
    chip: "bg-taupe-50 text-taupe-700 border-accent/35",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-blush-600",
    chip: "bg-blush-50 text-blush-800 border-blush-300",
  },
  inactive: {
    label: "Ẩn",
    dot: "bg-neutral-400",
    chip: "bg-cream-50 text-neutral-600 border-luxury-ink/12",
  },
  sold: {
    label: "Đã bán",
    dot: "bg-luxury-ink",
    chip: "bg-white text-luxury-ink border-luxury-ink/20",
  },
};
