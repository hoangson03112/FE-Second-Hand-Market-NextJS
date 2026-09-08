import { IconAlertTriangle } from "@tabler/icons-react";

interface ErrorStateProps {
  message?: string;
  description?: string;
}

export default function ErrorState({
  message = "Có lỗi xảy ra",
  description = "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.",
}: ErrorStateProps) {
  return (
    <div className="rounded-[2px] border border-luxury-ink/10 bg-white px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] border border-blush-200 bg-blush-50">
        <IconAlertTriangle className="h-6 w-6 text-blush-600" strokeWidth={1.5} />
      </span>

      <h3 className="font-droid-serif mt-7 text-xl tracking-tight text-luxury-ink">
        {message}
      </h3>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
        {description}
      </p>
    </div>
  );
}
