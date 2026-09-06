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
      <div className="rounded-[2px] border border-luxury-ink/10 bg-white p-3.5">
        <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
          Tổng hồ sơ
        </span>
        <p className="font-droid-serif mt-1.5 text-xl font-bold text-luxury-ink tabular-nums">
          {total}
        </p>
      </div>
      <div className="rounded-[2px] border border-luxury-champagne/50 bg-white p-3.5">
        <span className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-700">
          Chờ xét duyệt
        </span>
        <p className="font-droid-serif mt-1.5 text-xl font-bold text-neutral-700 tabular-nums">
          {pending}
        </p>
      </div>
      <div className="rounded-[2px] border border-accent/35 bg-white p-3.5">
        <span className="text-2xs font-bold uppercase tracking-[0.15em] text-accent">
          Đã phê duyệt
        </span>
        <p className="font-droid-serif mt-1.5 text-xl font-bold text-accent tabular-nums">
          {approved}
        </p>
      </div>
      <div className="rounded-[2px] border border-blush-300 bg-white p-3.5">
        <span className="text-2xs font-bold uppercase tracking-[0.15em] text-blush-800">
          Từ chối / Khóa
        </span>
        <p className="font-droid-serif mt-1.5 text-xl font-bold text-blush-800 tabular-nums">
          {rejected + banned}
        </p>
      </div>
    </div>
  );
}
