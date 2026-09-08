"use client";

import { IconAlertTriangle, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmWithReasonDialogProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  reasonHint?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const VARIANT = {
  danger: {
    icon: "bg-blush-100 text-blush-600",
    confirm:
      "bg-luxury-ink text-luxury-ivory hover:bg-charcoal-800 shadow-[0_12px_25px_rgba(24,20,18,0.18)]",
  },
  warning: {
    icon: "bg-luxury-champagne/15 text-luxury-ink",
    confirm:
      "bg-luxury-ink text-luxury-ivory hover:bg-charcoal-800 shadow-[0_12px_25px_rgba(24,20,18,0.18)]",
  },
};

export function ConfirmWithReasonDialog({
  isOpen,
  title = "Xác nhận",
  description,
  reasonLabel = "Lý do",
  reasonPlaceholder = "Nhập lý do...",
  reasonHint,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  variant = "danger",
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmWithReasonDialogProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen) return null;

  const styles = VARIANT[variant];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) onConfirm(reason.trim());
  };

  const content = (
    <>
      <div
        className="fixed inset-0 z-[9999] bg-[#1a1816]/55 backdrop-blur-[2px]"
        onClick={onCancel}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative w-full max-w-xl overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-luxury-ivory shadow-[0_32px_90px_rgba(18,14,12,0.16)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-luxury-ink/10 bg-[linear-gradient(135deg,#fffdf9_0%,#f2ebdf_100%)] px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${styles.icon}`}
                >
                  <IconAlertTriangle className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-2xs font-medium uppercase tracking-[0.12em] text-charcoal-500">
                    Xác nhận thao tác
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-luxury-ink">
                    {title}
                  </h3>
                  {description && (
                    <p className="mt-1 text-sm text-neutral-600">{description}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-luxury-ink/10 bg-white text-neutral-500 transition hover:border-luxury-ink/20 hover:text-luxury-ink disabled:opacity-50"
                aria-label="Đóng popup"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5 p-5 sm:p-6">
              <div>
                <label
                  htmlFor="confirm-reason"
                  className="mb-2 block text-xs font-medium uppercase tracking-[0.15em] text-charcoal-500"
                >
                  {reasonLabel} <span className="text-blush-600">*</span>
                </label>
                <textarea
                  id="confirm-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={reasonPlaceholder}
                  required
                  rows={4}
                  disabled={isLoading}
                  className="w-full resize-none rounded-[2px] border border-luxury-ink/10 bg-white px-4 py-3 text-sm text-luxury-ink placeholder:text-neutral-400 focus:border-luxury-ink focus:outline-none focus:ring-4 focus:ring-luxury-champagne/20 disabled:cursor-not-allowed disabled:bg-cream-50"
                />
              </div>

              {reasonHint && (
                <p className="text-xs leading-relaxed text-neutral-500">
                  {reasonHint}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 border-t border-luxury-ink/10 bg-white/60 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 rounded-[2px] border border-luxury-ink/15 bg-white px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition hover:border-luxury-ink/30 hover:bg-cream-50 disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={!reason.trim() || isLoading}
                className={`flex-1 rounded-[2px] px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition disabled:cursor-not-allowed disabled:opacity-50 ${styles.confirm}`}
              >
                {isLoading ? "Đang xử lý..." : confirmText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
