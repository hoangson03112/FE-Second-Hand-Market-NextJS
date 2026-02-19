"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

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
  isLoading = false,
}: RejectReasonDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) {
      setReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="relative bg-cream-50 dark:bg-[var(--charcoal-900)] rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-[var(--taupe-200)]">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[var(--charcoal-900)] dark:text-white">
                  Từ chối sản phẩm
                </h3>
                <p className="text-sm text-[var(--charcoal-500)] dark:text-[var(--charcoal-400)] mt-1 line-clamp-2">
                  {productName}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="p-2 hover:bg-[var(--cream-200)] dark:hover:bg-[var(--charcoal-700)] rounded-lg transition-colors shrink-0"
            >
              <X className="h-5 w-5 text-[var(--charcoal-500)] dark:text-[var(--charcoal-400)]" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <label
                htmlFor="reject-reason"
                className="block text-sm font-medium text-[var(--charcoal-900)] dark:text-white mb-2"
              >
                Lý do từ chối <span className="text-red-600">*</span>
              </label>
              <textarea
                id="reject-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ví dụ: Hình ảnh không khớp với mô tả, vi phạm chính sách, nội dung không phù hợp..."
                required
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-[var(--taupe-300)] dark:border-[var(--charcoal-600)] bg-cream-50 dark:bg-[var(--charcoal-800)] text-[var(--charcoal-900)] dark:text-white placeholder:text-[var(--charcoal-400)] focus:outline-none focus:ring-2 focus:ring-[var(--taupe-500)] focus:border-transparent resize-none"
                disabled={isLoading}
              />
              <p className="text-xs text-[var(--charcoal-500)] dark:text-[var(--charcoal-400)] mt-2">
                Lý do này sẽ được gửi cho người bán để họ biết tại sao sản phẩm bị từ chối.
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 p-6 border-t border-[var(--taupe-200)]">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-[var(--taupe-300)] dark:border-[var(--charcoal-600)] text-[var(--charcoal-700)] dark:text-[var(--charcoal-300)] font-medium hover:bg-[var(--cream-200)] dark:hover:bg-[var(--charcoal-700)] transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={!reason.trim() || isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
