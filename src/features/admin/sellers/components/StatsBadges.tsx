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
      <span className="rounded-lg bg-primary/10 px-2 py-1 text-primary/90 dark:bg-primary/20">
        Chờ duyệt: {pending}
      </span>
      <span className="rounded-lg bg-secondary px-2 py-1 text-foreground/80">
        Đã duyệt: {approved}
      </span>
      <span className="rounded-lg bg-destructive/10 px-2 py-1 text-destructive dark:bg-destructive/20">
        Từ chối: {rejected}
      </span>
    </div>
  );
}
