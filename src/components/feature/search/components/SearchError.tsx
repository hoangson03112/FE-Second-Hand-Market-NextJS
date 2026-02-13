"use client";

export default function SearchError() {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">❌</div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        Có lỗi xảy ra
      </h3>
      <p className="text-muted-foreground">
        Không thể tải kết quả. Vui lòng thử lại sau.
      </p>
    </div>
  );
}
