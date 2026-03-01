interface StatsBadgesProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function StatsBadges({
  total,
  pending,
  approved,
  rejected,
}: StatsBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <span className="rounded-lg bg-muted px-2 py-1 text-muted-foreground">
        Tổng: {total}
      </span>
      <span className="rounded-lg bg-amber-100 px-2 py-1 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
        Chờ duyệt: {pending}
      </span>
      <span className="rounded-lg bg-green-100 px-2 py-1 text-green-800 dark:bg-green-900/40 dark:text-green-200">
        Đã duyệt: {approved}
      </span>
      <span className="rounded-lg bg-red-100 px-2 py-1 text-red-800 dark:bg-red-900/40 dark:text-red-200">
        Từ chối: {rejected}
      </span>
    </div>
  );
}
