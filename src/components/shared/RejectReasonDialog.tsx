"use client";

import { ConfirmWithReasonDialog } from "./ConfirmWithReasonDialog";

interface RejectReasonDialogProps {
  isOpen: boolean;
  productName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function RejectReasonDialog({
  isOpen,
  productName,
  onConfirm,
  onCancel,
  isLoading,
}: RejectReasonDialogProps) {
  return (
    <ConfirmWithReasonDialog
      isOpen={isOpen}
      title="Từ chối sản phẩm"
      description={productName}
      reasonLabel="Lý do từ chối"
      reasonPlaceholder="Ví dụ: Hình ảnh không khớp với mô tả, vi phạm chính sách, nội dung không phù hợp..."
      reasonHint="Lý do này sẽ được gửi cho người bán để họ biết tại sao sản phẩm bị từ chối."
      confirmText="Xác nhận từ chối"
      variant="danger"
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLoading={isLoading}
    />
  );
}
