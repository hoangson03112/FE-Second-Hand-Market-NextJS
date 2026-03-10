import { IconUsers } from "@tabler/icons-react";

interface EmptyStateProps {
  type: "no-accounts" | "no-results";
}

export default function EmptyState({ type }: EmptyStateProps) {
  if (type === "no-accounts") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        <IconUsers className="mx-auto mb-2 h-10 w-10 opacity-50" />
        Chưa có tài khoản nào.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-dashed bg-muted/40 p-6 text-center text-sm text-muted-foreground">
      Không tìm thấy người dùng phù hợp với từ khóa đang tìm.
    </div>
  );
}
