export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: string; bgColor: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-primary/90",
    bgColor: "bg-primary/10 border-primary/30",
    icon: "⏳",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-primary",
    bgColor: "bg-primary/15 border-primary/40",
    icon: "✓",
  },
  picked_up: {
    label: "Đã lấy hàng",
    color: "text-foreground/80",
    bgColor: "bg-secondary border-border",
    icon: "📦",
  },
  shipping: {
    label: "Đang vận chuyển",
    color: "text-primary",
    bgColor: "bg-primary/20 border-primary/50",
    icon: "🚛",
  },
  out_for_delivery: {
    label: "Đang giao hàng",
    color: "text-primary",
    bgColor: "bg-primary/20 border-primary/50",
    icon: "🛯️",
  },
  delivered: {
    label: "Đã giao",
    color: "text-foreground/70",
    bgColor: "bg-muted/60 border-border",
    icon: "✅",
  },
  completed: {
    label: "Hoàn thành",
    color: "text-foreground",
    bgColor: "bg-secondary border-border",
    icon: "🎉",
  },
  failed: {
    label: "Giao thất bại",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30",
    icon: "⚠️",
  },
  returned: {
    label: "Đã hoàn hàng",
    color: "text-emerald-700",
    bgColor: "bg-emerald-100 border-emerald-300",
    icon: "↩️",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-muted-foreground",
    bgColor: "bg-muted/60 border-border",
    icon: "✕",
  },
  delivery_failed: {
    label: "Giao thất bại",
    color: "text-destructive",
    bgColor: "bg-destructive/10 border-destructive/30",
    icon: "⚠️",
  },
  returning: {
    label: "Đang hoàn hàng",
    color: "text-amber-700",
    bgColor: "bg-amber-100 border-amber-300",
    icon: "↩️",
  },
  return_shipping: {
    label: "Đang hoàn hàng",
    color: "text-amber-700",
    bgColor: "bg-amber-100 border-amber-300",
    icon: "↩️",
  },
  refund_requested: {
    label: "Yêu cầu hoàn tiền",
    color: "text-orange-700",
    bgColor: "bg-orange-100 border-orange-300",
    icon: "💰",
  },
  refund_approved: {
    label: "Hoàn tiền đã duyệt",
    color: "text-blue-700",
    bgColor: "bg-blue-100 border-blue-300",
    icon: "✔️",
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "text-violet-700",
    bgColor: "bg-violet-100 border-violet-300",
    icon: "💸",
  },
};
// Simple labels map for backward compatibility
export const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  picked_up: "Đã lấy hàng",
  shipping: "Đang vận chuyển",
  out_for_delivery: "Đang giao hàng",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  failed: "Giao thất bại",
  returned: "Đã hoàn hàng",
  cancelled: "Đã hủy",
  delivery_failed: "Giao thất bại",
  returning: "Đang hoàn hàng",
  return_shipping: "Đang hoàn hàng",
  refund_requested: "Yêu cầu hoàn tiền",
  refund_approved: "Hoàn tiền đã duyệt",
  refunded: "Đã hoàn tiền",
};

// Simple colors map for backward compatibility
export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-primary/10 text-primary/90 border-primary/30",
  confirmed: "bg-primary/15 text-primary border-primary/40",
  picked_up: "bg-secondary text-foreground/80 border-border",
  shipping: "bg-primary/20 text-primary border-primary/50",
  out_for_delivery: "bg-primary/20 text-primary border-primary/50",
  delivered: "bg-muted/60 text-foreground/70 border-border",
  completed: "bg-secondary text-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
  returned: "bg-accent/20 text-accent-foreground border-accent/40",
  cancelled: "bg-muted/60 text-muted-foreground border-border",
  delivery_failed: "bg-destructive/10 text-destructive border-destructive/30",
  returning: "bg-accent/20 text-accent-foreground border-accent/40",
  return_shipping: "bg-accent/20 text-accent-foreground border-accent/40",
  refund_requested: "bg-primary/8 text-primary/80 border-primary/20",
  refund_approved: "bg-primary/15 text-primary border-primary/30",
  refunded: "bg-muted/60 text-muted-foreground border-border",
};

export const ORDER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng" },
  { key: "shipping", label: "Đang vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao hàng" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "failed", label: "Giao thất bại" },
  { key: "returned", label: "Đã hoàn hàng" },
  { key: "return_shipping", label: "Đang hoàn hàng" },
  { key: "cancelled", label: "Đã hủy" },
  { key: "refund_requested", label: "Yêu cầu hoàn tiền" },
  { key: "refunded", label: "Đã hoàn tiền" },
] as const;

export type OrderStatus = keyof typeof STATUS_CONFIG;
