"use client";

import { IconAlertTriangle, IconInfoCircle, IconX } from "@tabler/icons-react";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolvePromise, setResolvePromise] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setOptions(options);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolvePromise) resolvePromise(true);
    setIsOpen(false);
    setOptions(null);
    setResolvePromise(null);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) resolvePromise(false);
    setIsOpen(false);
    setOptions(null);
    setResolvePromise(null);
  }, [resolvePromise]);

  const getVariantConfig = () => {
    switch (options?.variant) {
      case "danger":
        return {
          iconWrap: "bg-destructive/10",
          iconColor: "text-destructive",
          icon: <IconAlertTriangle className="h-8 w-8" strokeWidth={1.75} />,
          confirmBtn: "bg-destructive text-white hover:bg-destructive/90",
        };
      case "warning":
        return {
          iconWrap: "bg-amber-500/10",
          iconColor: "text-amber-500",
          icon: <IconAlertTriangle className="h-8 w-8" strokeWidth={1.75} />,
          confirmBtn: "bg-primary text-primary-foreground hover:bg-primary/90",
        };
      default:
        return {
          iconWrap: "bg-blue-500/10",
          iconColor: "text-blue-500",
          icon: <IconInfoCircle className="h-8 w-8" strokeWidth={1.75} />,
          confirmBtn: "bg-primary text-primary-foreground hover:bg-primary/90",
        };
    }
  };

  if (!isOpen || !options) return <ConfirmContext.Provider value={{ confirm }}>{children}</ConfirmContext.Provider>;

  const config = getVariantConfig();

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] animate-in fade-in duration-200"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-background rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <IconX className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Content */}
          <div className="px-7 pt-8 pb-6 text-center">
            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 ${config.iconWrap} ${config.iconColor}`}>
              {config.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-foreground mb-2">
              {options.title || "Xác nhận"}
            </h3>

            {/* Message */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {options.message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={handleCancel}
              className="flex-1 btn btn-secondary rounded-xl font-medium"
            >
              {options.cancelText || "Hủy"}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 btn rounded-xl font-semibold ${config.confirmBtn}`}
            >
              {options.confirmText || "Xác nhận"}
            </button>
          </div>
        </div>
      </div>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmDialogProvider");
  }
  return context;
}
