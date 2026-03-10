"use client";

import { IconX, IconCircleCheck, IconAlertCircle, IconInfoCircle, IconAlertTriangle, IconPackage, IconMessageCircle, IconTag, IconBell } from "@tabler/icons-react";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  onClick?: () => void;
}

interface NotificationOptions {
  title: string;
  message: string;
  type?: "order" | "chat" | "product" | "system";
  onClick?: () => void;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, opts?: { title?: string; onClick?: () => void }) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  notification: (opts: NotificationOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const TOAST_DURATION = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info", opts?: { title?: string; onClick?: () => void; duration?: number }) => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type, title: opts?.title, onClick: opts?.onClick }]);
    setTimeout(() => removeToast(id), opts?.duration ?? TOAST_DURATION);
  }, [removeToast]);

  const contextValue: ToastContextType = {
    showToast,
    success: (msg, title) => showToast(msg, "success", { title }),
    error:   (msg, title) => showToast(msg, "error",   { title }),
    info:    (msg, title) => showToast(msg, "info",    { title }),
    warning: (msg, title) => showToast(msg, "warning", { title }),
    notification: ({ title, message, type = "system", onClick }) => {
      const toastType: ToastType = "info";
      showToast(message, toastType, { title, onClick, duration: 6000 });
    },
  };

  const getIcon = (toast: Toast) => {
    if (toast.title) {
      // Rich notification icons by inferring from content
      if (toast.type === "success") return <IconCircleCheck className="h-5 w-5 shrink-0" />;
      if (toast.type === "error")   return <IconAlertCircle  className="h-5 w-5 shrink-0" />;
      if (toast.type === "warning") return <IconAlertTriangle className="h-5 w-5 shrink-0" />;
      return <IconBell className="h-5 w-5 shrink-0" />;
    }
    switch (toast.type) {
      case "success": return <IconCircleCheck  className="h-5 w-5 shrink-0" />;
      case "error":   return <IconAlertCircle  className="h-5 w-5 shrink-0" />;
      case "warning": return <IconAlertTriangle className="h-5 w-5 shrink-0" />;
      default:        return <IconInfoCircle   className="h-5 w-5 shrink-0" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success": return "bg-secondary/70 text-foreground border-border";
      case "error":   return "bg-destructive/10 text-destructive border-destructive/20";
      case "warning": return "bg-primary/8 text-primary/90 border-primary/20";
      default:        return "bg-muted/60 text-foreground/80 border-border";
    }
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pr-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg animate-in slide-in-from-top-2 ${getStyles(toast.type)} ${toast.onClick ? "cursor-pointer hover:brightness-95 transition-[filter]" : ""}`}
            onClick={toast.onClick}
          >
            {getIcon(toast)}
            <div className="flex-1 min-w-0">
              {toast.title ? (
                <>
                  <p className="text-sm font-semibold leading-snug">{toast.title}</p>
                  <p className="text-xs mt-0.5 opacity-80 leading-snug line-clamp-2">{toast.message}</p>
                </>
              ) : (
                <p className="text-sm font-medium">{toast.message}</p>
              )}
              {toast.onClick && (
                <p className="text-xs mt-1 opacity-60 font-medium">Nhấn để xem chi tiết →</p>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); removeToast(toast.id); }}
              className="p-1 hover:bg-black/10 rounded-xl transition-colors shrink-0 mt-0.5"
            >
              <IconX className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

