import dynamic from "next/dynamic";


export const LazyConfirmDialog = dynamic(
  () => import("@/components/providers/ConfirmDialogProvider").then(m => ({ default: m.ConfirmDialogProvider })),
  {
    loading: () => null,
    ssr: false,
  }
);

export const LazyToast = dynamic(() => import("@/components/providers/ToastProvider").then(m => ({ default: m.ToastProvider })), {
  loading: () => null,
  ssr: false,
});

export const LazyAdminDashboard = dynamic(
  () => import("@/features/admin/dashboard"),
  {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    ),
  }
);
