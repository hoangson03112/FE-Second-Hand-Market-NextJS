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
    icon: "bg-destructive/10 dark:bg-destructive/20 text-destructive",
    confirm: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
  warning: {
    icon: "bg-primary/10 dark:bg-primary/20 text-primary",
    confirm: "bg-primary hover:bg-primary/90 text-primary-foreground",
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
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in"
        onClick={onCancel}
      />

      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="relative bg-background rounded-2xl shadow-xl w-full max-w-md border border-border animate-in zoom-in-95 slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${styles.icon}`}>
                <IconAlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                {description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{description}</p>}
              </div>
            </div>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="p-2 hover:bg-muted rounded-lg transition-colors shrink-0"
            >
              <IconX className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <label htmlFor="confirm-reason" className="block text-sm font-medium text-foreground mb-2">
                {reasonLabel} <span className="text-destructive">*</span>
              </label>
              <textarea
                id="confirm-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={reasonPlaceholder}
                required
                rows={4}
                disabled={isLoading}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
              {reasonHint && <p className="text-xs text-muted-foreground mt-2">{reasonHint}</p>}
            </div>

            <div className="flex items-center gap-3 p-6 border-t border-border">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors disabled:opacity-50"
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={!reason.trim() || isLoading}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.confirm}`}
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
