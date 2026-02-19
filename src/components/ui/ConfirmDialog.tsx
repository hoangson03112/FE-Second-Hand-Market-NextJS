"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { AlertTriangle, X } from "lucide-react";

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
    if (resolvePromise) {
      resolvePromise(true);
    }
    setIsOpen(false);
    setOptions(null);
    setResolvePromise(null);
  }, [resolvePromise]);

  const handleCancel = useCallback(() => {
    if (resolvePromise) {
      resolvePromise(false);
    }
    setIsOpen(false);
    setOptions(null);
    setResolvePromise(null);
  }, [resolvePromise]);

  const getVariantStyles = () => {
    switch (options?.variant) {
      case "danger":
        return {
          icon: "bg-red-100 text-red-600",
          button: "btn bg-red-600 text-white hover:bg-red-700",
        };
      case "warning":
        return {
          icon: "bg-amber-100 text-amber-600",
          button: "btn bg-amber-600 text-white hover:bg-amber-700",
        };
      default:
        return {
          icon: "bg-blue-100 text-blue-600",
          button: "btn btn-primary",
        };
    }
  };

  const styles = getVariantStyles();

  if (!isOpen || !options) return <ConfirmContext.Provider value={{ confirm }}>{children}</ConfirmContext.Provider>;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* Dialog Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] animate-in fade-in"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div
          className="relative bg-background rounded-2xl shadow-xl w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles.icon}`}>
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {options.title || "Xác nhận"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {options.message}
                </p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 p-6">
            <button
              onClick={handleCancel}
              className="flex-1 btn btn-secondary rounded-lg"
            >
              {options.cancelText || "Hủy"}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 rounded-lg ${styles.button}`}
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
