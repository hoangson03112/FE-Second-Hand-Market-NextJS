import { IconX } from "@tabler/icons-react";
import type { AdminSeller } from "@/types/admin";

interface SellerDetailModalProps {
  seller: AdminSeller;
  rejectReason: string;
  isUpdating: boolean;
  onRejectReasonChange: (value: string) => void;
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function SellerDetailModal({
  seller,
  rejectReason,
  isUpdating,
  onRejectReasonChange,
  onApprove,
  onReject,
  onClose,
}: SellerDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
          <h2 className="font-semibold text-foreground">Chi tiết seller</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto p-4">
          <p>
            <span className="text-muted-foreground">Họ tên:</span>{" "}
            {seller.accountId?.fullName ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span>{" "}
            {seller.accountId?.email ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">SĐT:</span>{" "}
            {seller.accountId?.phoneNumber ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Địa chỉ kinh doanh:</span>{" "}
            {seller.businessAddress ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Tỉnh/Quận/Xã:</span>{" "}
            {[seller.province, seller.district, seller.ward]
              .filter(Boolean)
              .join(", ") || "—"}
          </p>
          {seller.verificationStatus === "pending" && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Lý do từ chối (nếu từ chối)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => onRejectReasonChange(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                rows={2}
                placeholder="Nhập lý do..."
              />
            </div>
          )}
        </div>
        <div className="flex gap-2 justify-end border-t border-border px-4 py-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            Đóng
          </button>
          {seller.verificationStatus === "pending" && (
            <>
              <button
                type="button"
                onClick={onReject}
                disabled={isUpdating}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-red-900/20 disabled:opacity-50"
              >
                Từ chối
              </button>
              <button
                type="button"
                onClick={onApprove}
                disabled={isUpdating}
                className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Duyệt
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
