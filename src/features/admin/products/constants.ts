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

/** Badge dùng trong bảng danh sách (label + className) */
export const STATUS_TABLE_BADGE: Record<string, { label: string; className: string }> = {
  pending:          { label: "Chờ duyệt",         className: "bg-primary/10 text-primary/90" },
  review_requested: { label: "Yêu cầu duyệt lại", className: "bg-primary/15 text-primary" },
  under_review:     { label: "Đang xem xét",       className: "bg-secondary text-foreground/80" },
  pending_review:   { label: "Đang xem xét",       className: "bg-secondary text-foreground/80" },
  approved:     { label: "Đang bán",     className: "bg-primary/15 text-primary" },
  rejected:     { label: "Từ chối",      className: "bg-destructive/10 text-destructive" },
  active:       { label: "Đang bán",     className: "bg-primary/15 text-primary" },
  inactive:     { label: "Ẩn",           className: "bg-muted text-muted-foreground" },
  sold:         { label: "Đã bán",       className: "bg-muted/60 text-muted-foreground" },
};

export const STATUS_BADGE: Record<
  string,
  { label: string; dot: string; chip: string }
> = {
  pending: {
    label: "Chờ duyệt",
    dot: "bg-primary/50",
    chip: "bg-primary/10 text-primary/90",
  },
  review_requested: {
    label: "Yêu cầu duyệt lại",
    dot: "bg-primary/60",
    chip: "bg-primary/15 text-primary",
  },
  under_review: {
    label: "Đang xem xét",
    dot: "bg-foreground/40",
    chip: "bg-secondary text-foreground/80",
  },
  approved: {
    label: "Đang bán",
    dot: "bg-primary",
    chip: "bg-primary/15 text-primary",
  },
  active: {
    label: "Đang bán",
    dot: "bg-primary",
    chip: "bg-primary/15 text-primary",
  },
  rejected: {
    label: "Từ chối",
    dot: "bg-destructive",
    chip: "bg-destructive/10 text-destructive",
  },
  inactive: {
    label: "Ẩn",
    dot: "bg-muted-foreground/50",
    chip: "bg-muted text-muted-foreground",
  },
  sold: {
    label: "Đã bán",
    dot: "bg-foreground",
    chip: "bg-muted/60 text-muted-foreground",
  },
};
