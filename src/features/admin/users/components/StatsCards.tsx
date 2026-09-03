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
      <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Tổng người dùng
          </p>
          <p className="font-droid-serif mt-2 text-2xl font-bold text-luxury-ink tabular-nums">
            {totalUsers.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0">
          <IconUsers className="w-4 h-4" />
        </div>
      </div>

      <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
            Mới (7 ngày qua)
          </p>
          <p className="font-droid-serif mt-2 text-2xl font-bold text-accent tabular-nums">
            +{recent7Days.toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-accent flex items-center justify-center shrink-0">
          <IconUserPlus className="w-4 h-4" />
        </div>
      </div>

      <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-4 sm:p-5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-[2px] border border-luxury-ink/10 bg-cream-50 text-luxury-ink flex items-center justify-center shrink-0">
          <IconInfoCircle className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-luxury-ink">Phân quyền tài khoản</p>
          <p className="text-xs text-neutral-500 mt-0.5 leading-snug">
            Quản lý vai trò Buyer, Seller và Admin. Kiểm soát mở và khóa tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
}
