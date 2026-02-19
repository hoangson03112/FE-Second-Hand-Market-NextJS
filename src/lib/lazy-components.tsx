import dynamic from "next/dynamic";

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
  ssr: false,
});

// Confirmation dialogs
export const LazyConfirmDialog = dynamic(
  () => import("@/components/ui/ConfirmDialog").then(m => ({ default: m.ConfirmDialogProvider })),
  {
    loading: () => null,
    ssr: false,
  }
);

// Toast notifications
export const LazyToast = dynamic(() => import("@/components/ui/Toast").then(m => ({ default: m.ToastProvider })), {
  loading: () => null,
  ssr: false,
});

// Admin components
export const LazyAdminDashboard = dynamic(
  () => import("@/components/feature/admin/dashboard"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);
