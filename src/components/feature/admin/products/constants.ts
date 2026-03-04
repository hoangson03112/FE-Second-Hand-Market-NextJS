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
  { value: "approved", label: "Đã duyệt" },
  { value: "rejected", label: "Từ chối" },
];

/** Badge dùng trong bảng danh sách (label + className) */
export const STATUS_TABLE_BADGE: Record<string, { label: string; className: string }> = {
  pending:          { label: "Chờ duyệt",         className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200" },
  review_requested: { label: "Yêu cầu duyệt lại", className: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200" },
  under_review:     { label: "Đang xem xét",       className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200" },
  pending_review:   { label: "Đang xem xét",       className: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200" },
  approved:     { label: "Đã duyệt",     className: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200" },
  rejected:     { label: "Từ chối",      className: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200" },
  active:       { label: "Đang bán",     className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200" },
  inactive:     { label: "Ẩn",           className: "bg-muted text-muted-foreground" },
  sold:         { label: "Đã bán",       className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
};

export const STATUS_BADGE: Record<
  string,
  { label: string; dot: string; chip: string }
> = {
  pending: {
    label: "Chờ duyệt",
    dot: "bg-yellow-400",
    chip: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
  },
  review_requested: {
    label: "Yêu cầu duyệt lại",
    dot: "bg-orange-400",
    chip: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  },
  under_review: {
    label: "Đang xem xét",
    dot: "bg-purple-400",
    chip: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  },
  approved: {
    label: "Đã duyệt",
    dot: "bg-green-400",
    chip: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  },
  active: {
    label: "Đang bán",
    dot: "bg-emerald-400",
    chip: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-red-400",
    chip: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  },
  inactive: {
    label: "Ẩn",
    dot: "bg-gray-400",
    chip: "bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-300",
  },
  sold: {
    label: "Đã bán",
    dot: "bg-blue-400",
    chip: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  },
};
