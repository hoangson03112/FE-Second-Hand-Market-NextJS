interface StatsCardsProps {
  totalUsers: number;
  recent7Days: number;
}

export default function StatsCards({ totalUsers, recent7Days }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Tổng người dùng
        </p>
        <p className="mt-1 text-xl font-semibold text-foreground">
          {totalUsers.toLocaleString("vi-VN")}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Mới 7 ngày gần đây
        </p>
        <p className="mt-1 text-xl font-semibold text-foreground">
          {recent7Days.toLocaleString("vi-VN")}
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Ghi chú
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Mặc định hiển thị tài khoản người mua. Vai trò được hiển thị bằng
          nhãn màu.
        </p>
      </div>
    </div>
  );
}
