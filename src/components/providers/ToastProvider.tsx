"use client";

import { Toaster, toast as sonnerToast } from "sonner";
import { ReactNode } from "react";

type ToastProps = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  action?: ReactNode;
};

const toastFn = (props: ToastProps | string) => {
  if (typeof props === "string") {
    return sonnerToast(props);
  }

  const { title, description, variant, action } = props;
  const options = { description, action };

  if (variant === "destructive") {
    return sonnerToast.error(title || "Error", options);
  }
  if (variant === "success") {
    return sonnerToast.success(title || "Success", options);
  }

  return sonnerToast(title || "Message", options);
};

const toast = Object.assign(toastFn, {
  success: sonnerToast.success,
  error: sonnerToast.error,
  loading: sonnerToast.loading,
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
});

/*
  API của sonner không phụ thuộc state nào, nên dựng sẵn một lần ở module scope
  và luôn trả về đúng object đó. Nếu tạo mới mỗi lần render, mọi
  useEffect/useCallback nhận toast làm dependency sẽ chạy lại sau từng render
  — đủ để một effect fetch-rồi-setState tự gọi lại chính nó vô hạn.
*/
const toastApi = {
  toast,
  success: sonnerToast.success,
  error: sonnerToast.error,
  loading: sonnerToast.loading,
  promise: sonnerToast.promise,
  custom: sonnerToast.custom,
  dismiss: sonnerToast.dismiss,
} as const;

export const useToast = () => toastApi;

export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "var(--background)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
    </>
  );
}
