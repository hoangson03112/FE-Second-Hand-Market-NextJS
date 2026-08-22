import { PageLoader } from "@/components/ui";

export function LoadingState() {
  return (
    <PageLoader
      fullScreen
      eyebrow="Tài khoản"
      title="Đang tải thông tin tài khoản."
    />
  );
}
