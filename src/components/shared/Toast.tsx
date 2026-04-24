"use client";

import {
  IconX,
  IconCircleCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconAlertTriangle,
  IconBell,
} from "@tabler/icons-react";
import { createContext, useCallback, useContext, useState, ReactNode } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  onClick?: () => void;
  duration: number;
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

function normalizeErrorMessage(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) return "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";

  const technicalPatterns = [
    /request failed with status code \d+/i,
    /network error/i,
    /timeout/i,
    /axioserror/i,
    /failed to fetch/i,
    /ecconnrefused|econnrefused/i,
    /cors/i,
  ];

  if (technicalPatterns.some((pattern) => pattern.test(trimmed))) {
    return "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.";
  }

  return trimmed;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", opts?: { title?: string; onClick?: () => void; duration?: number }) => {
      const id = Math.random().toString(36).substring(7);
      const duration = opts?.duration ?? TOAST_DURATION;
      const safeMessage = type === "error" ? normalizeErrorMessage(message) : message;
      setToasts((prev) => [
        ...prev,
        { id, message: safeMessage, type, title: opts?.title, onClick: opts?.onClick, duration },
      ]);
      setTimeout(() => removeToast(id), duration);
    },
    [removeToast],
  );

  const contextValue: ToastContextType = {
    showToast,
    success: (msg, title) => showToast(msg, "success", { title }),
    error: (msg, title) => showToast(msg, "error", { title }),
    info: (msg, title) => showToast(msg, "info", { title }),
    warning: (msg, title) => showToast(msg, "warning", { title }),
    notification: ({ title, message, onClick }) => {
      const toastType: ToastType = "info";
      showToast(message, toastType, { title, onClick, duration: 6000 });
    },
  };

  const getIcon = (toast: Toast) => {
    switch (toast.type) {
      case "success":
        return <IconCircleCheck className="h-5 w-5 shrink-0" />;
      case "error":
        return <IconAlertCircle className="h-5 w-5 shrink-0" />;
      case "warning":
        return <IconAlertTriangle className="h-5 w-5 shrink-0" />;
      default:
        return toast.title ? <IconBell className="h-5 w-5 shrink-0" /> : <IconInfoCircle className="h-5 w-5 shrink-0" />;
    }
  };

  const getStyles = (type: ToastType) => {
    switch (type) {
      case "success":
        return {
          container: "border-emerald-500/25 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100",
          iconWrap: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
          progress: "bg-emerald-500/70",
        };
      case "error":
        return {
          container: "border-destructive/30 bg-destructive/10 text-destructive",
          iconWrap: "bg-destructive/15 text-destructive",
          progress: "bg-destructive/80",
        };
      case "warning":
        return {
          container: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200",
          iconWrap: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
          progress: "bg-amber-500/75",
        };
      default:
        return {
          container: "border-primary/25 bg-background/95 text-foreground",
          iconWrap: "bg-primary/10 text-primary",
          progress: "bg-primary/70",
        };
    }
  };

  const getDefaultTitle = (type: ToastType) => {
    switch (type) {
      case "success":
        return "Thành công";
      case "error":
        return "Có lỗi xảy ra";
      case "warning":
        return "Lưu ý";
      default:
        return "Thông báo";
    }
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex w-full max-w-[380px] flex-col gap-3 pr-4">
        {toasts.map((toast) => (
          <div key={toast.id} className="group relative overflow-hidden rounded-2xl">
            <div
              className={`backdrop-blur-sm shadow-xl ring-1 ring-black/5 dark:ring-white/5 flex items-start gap-3 rounded-2xl border px-4 py-3.5 animate-in slide-in-from-top-2 fade-in ${getStyles(toast.type).container} ${toast.onClick ? "cursor-pointer transition-transform hover:-translate-y-0.5" : ""}`}
              onClick={toast.onClick}
            >
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${getStyles(toast.type).iconWrap}`}
              >
                {getIcon(toast)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug">{toast.title || getDefaultTitle(toast.type)}</p>
                <p className="mt-0.5 text-xs leading-relaxed opacity-90 line-clamp-2">{toast.message}</p>
                {toast.onClick && <p className="mt-1 text-[11px] font-medium opacity-70">Nhấn để xem chi tiết</p>}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeToast(toast.id);
                }}
                className="mt-0.5 rounded-lg p-1.5 text-current/70 transition-colors hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
              >
                <IconX className="h-4 w-4" />
              </button>
            </div>
            <div
              className={`absolute bottom-0 left-0 h-1 origin-left animate-[toast-shrink_linear_forwards] ${getStyles(toast.type).progress} group-hover:[animation-play-state:paused]`}
              style={{ animationDuration: `${toast.duration}ms` }}
            />
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
