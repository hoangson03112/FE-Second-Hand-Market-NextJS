import { IconUsers, IconUserPlus, IconInfoCircle } from "@tabler/icons-react";

interface StatsCardsProps {
  totalUsers: number;
  recent7Days: number;
}

export default function StatsCards({
  totalUsers,
  recent7Days,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tổng người dùng
          </p>
          <p className="mt-1.5 text-2xl font-bold text-foreground tabular-nums">
            {totalUsers.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <IconUsers className="w-5 h-5" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Mới (7 ngày qua)
          </p>
          <p className="mt-1.5 text-2xl font-bold text-emerald-600 tabular-nums">
            +{recent7Days.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
          <IconUserPlus className="w-5 h-5" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-xs flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
          <IconInfoCircle className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-foreground">Phân quyền tài khoản</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
            Quản lý vai trò Buyer, Seller và Admin. Kiểm soát mở và khóa tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
}
