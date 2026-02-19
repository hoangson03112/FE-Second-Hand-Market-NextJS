import dynamic from "next/dynamic";
import { ComponentType } from "react";

/**
 * Lazy load heavy components với loading fallback
 */

// Chat component - chỉ load khi user vào trang chat
export const LazyChat = dynamic(() => import("@/app/chat/page"), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  ),
  ssr: false, // Chat thường cần real-time, không cần SSR
});

// Confirmation dialogs
export const LazyConfirmDialog = dynamic(
  () => import("@/components/ui/ConfirmDialog"),
  {
    loading: () => null,
    ssr: false,
  }
);

// Toast notifications
export const LazyToast = dynamic(() => import("@/components/ui/Toast"), {
  loading: () => null,
  ssr: false,
});

// Heavy product features
export const LazyProductReviews = dynamic(
  () => import("@/components/feature/product/ProductReviews"),
  {
    loading: () => (
      <div className="animate-pulse bg-neutral-100 h-40 rounded-lg" />
    ),
  }
);

// Admin components (không cần load ngay)
export const LazyAdminDashboard = dynamic(
  () => import("@/components/feature/admin/Dashboard"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);

// Map components (nếu có)
export const LazyMap = dynamic(() => import("@/components/common/Map"), {
  loading: () => (
    <div className="w-full h-64 bg-neutral-100 animate-pulse rounded-lg flex items-center justify-center">
      <span className="text-neutral-500">Đang tải bản đồ...</span>
    </div>
  ),
  ssr: false, // Map libraries thường không support SSR
});

/**
 * Generic lazy component wrapper
 */
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: {
    loading?: React.ComponentType;
    ssr?: boolean;
  }
) {
  return dynamic(importFunc, {
    loading: options?.loading || (() => <div>Loading...</div>),
    ssr: options?.ssr !== undefined ? options.ssr : true,
  });
}
