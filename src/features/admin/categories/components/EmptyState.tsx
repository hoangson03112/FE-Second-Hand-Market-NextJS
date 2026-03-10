import { IconFolders } from "@tabler/icons-react";

export default function EmptyState() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
      <IconFolders className="mx-auto mb-2 h-10 w-10 opacity-50" />
      Chưa có danh mục nào.
    </div>
  );
}
