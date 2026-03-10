"use client";

import { ConfirmWithReasonDialog } from "@/components/ui/ConfirmWithReasonDialog";

interface CancelOrderReasonDialogProps {
  isOpen: boolean;
  orderCode?: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function CancelOrderReasonDialog({
  isOpen,
  orderCode,
  onConfirm,
  onCancel,
  isLoading,
}: CancelOrderReasonDialogProps) {
  return (
    <ConfirmWithReasonDialog
      isOpen={isOpen}
      title="Hủy đơn hàng"
      description={orderCode ? `Đơn hàng #${orderCode}` : "Xác nhận hủy đơn hàng"}
      reasonLabel="Lý do hủy đơn"
      reasonPlaceholder="Ví dụ: Thay đổi nhu cầu mua hàng, nhập sai thông tin, muốn đặt lại đơn khác..."
      reasonHint="Lý do này sẽ được lưu lại để hỗ trợ xử lý đơn hàng và CSKH."
      confirmText="Xác nhận hủy"
      variant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}
