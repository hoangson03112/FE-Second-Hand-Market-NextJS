export const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: string; bgColor: string }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
    icon: "⏳",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    icon: "✓",
  },
  picked_up: {
    label: "Đã lấy hàng",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50 border-cyan-200",
    icon: "📦",
  },
  shipping: {
    label: "Đang vận chuyển",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
    icon: "🚛",
  },
  out_for_delivery: {
    label: "Đang giao hàng",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50 border-indigo-200",
    icon: "🚚",
  },
  delivered: {
    label: "Đã giao",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    icon: "✅",
  },
  completed: {
    label: "Hoàn thành",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    icon: "🎉",
  },
  failed: {
    label: "Giao thất bại",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    icon: "⚠️",
  },
  returned: {
    label: "Đã hoàn hàng",
    color: "text-orange-700",
    bgColor: "bg-orange-50 border-orange-200",
    icon: "↩️",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-neutral-700",
    bgColor: "bg-neutral-50 border-neutral-200",
    icon: "❌",
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
};

// Simple colors map for backward compatibility
export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  picked_up: "bg-cyan-100 text-cyan-800 border-cyan-300",
  shipping: "bg-purple-100 text-purple-800 border-purple-300",
  out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  failed: "bg-red-100 text-red-800 border-red-300",
  returned: "bg-orange-100 text-orange-800 border-orange-300",
  cancelled: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

export const ORDER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "confirmed", label: "Đã xác nhận" },
  { key: "picked_up", label: "Đã lấy hàng" },
  { key: "shipping", label: "Đang vận chuyển" },
  { key: "out_for_delivery", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "completed", label: "Hoàn thành" },
] as const;

export type OrderStatus = keyof typeof STATUS_CONFIG;
