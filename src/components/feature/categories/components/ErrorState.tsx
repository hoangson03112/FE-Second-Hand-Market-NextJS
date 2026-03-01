interface ErrorStateProps {
  message?: string;
  description?: string;
}

export default function ErrorState({
  message = "Có lỗi xảy ra",
  description = "Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.",
}: ErrorStateProps) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">❌</div>
      <h3 className="text-xl font-bold text-neutral-900 mb-2">{message}</h3>
      <p className="text-neutral-600">{description}</p>
    </div>
  );
}
