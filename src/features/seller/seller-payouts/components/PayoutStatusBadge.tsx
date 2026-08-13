import type { PayoutStatus } from "../hooks/useSellerWallet";

const STATUS_CONFIG: Record<PayoutStatus, { label: string; className: string }> = {
  pending: { label: "Chờ xử lý", className: "bg-amber-50 text-amber-700 border-amber-200" },
  processing: { label: "Đang chuyển", className: "bg-sky-50 text-sky-700 border-sky-200" },
  completed: { label: "Đã hoàn tất", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { label: "Thất bại", className: "bg-red-50 text-red-600 border-red-200" },
};

export function PayoutStatusBadge({ status }: { status: PayoutStatus }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border-2 ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}