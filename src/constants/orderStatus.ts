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

export type OrderStatus = keyof typeof STATUS_CONFIG;
