interface StatsBadgesProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  banned?: number;
}

export default function StatsBadges({
  total,
  pending,
  approved,
  rejected,
  banned = 0,
}: StatsBadgesProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
      <div className="rounded-xl border border-border/80 bg-card p-3.5 shadow-xs">
        <span className="text-muted-foreground font-medium">Tổng hồ sơ seller</span>
        <p className="mt-1 text-xl font-bold text-foreground tabular-nums">
          {total}
        </p>
      </div>
      <div className="rounded-xl border border-amber-200/70 bg-amber-50/50 p-3.5 shadow-xs">
        <span className="text-amber-800 font-medium">Chờ xét duyệt</span>
        <p className="mt-1 text-xl font-bold text-amber-700 tabular-nums">
          {pending}
        </p>
      </div>
      <div className="rounded-xl border border-emerald-200/70 bg-emerald-50/50 p-3.5 shadow-xs">
        <span className="text-emerald-800 font-medium">Đã phê duyệt</span>
        <p className="mt-1 text-xl font-bold text-emerald-700 tabular-nums">
          {approved}
        </p>
      </div>
      <div className="rounded-xl border border-rose-200/70 bg-rose-50/50 p-3.5 shadow-xs">
        <span className="text-rose-800 font-medium">Bị từ chối / Khóa</span>
        <p className="mt-1 text-xl font-bold text-rose-700 tabular-nums">
          {rejected + banned}
        </p>
      </div>
    </div>
  );
}
