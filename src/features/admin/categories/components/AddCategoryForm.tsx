import { IconPlus } from "@tabler/icons-react";

interface AddCategoryFormProps {
  newCategoryName: string;
  isSaving: boolean;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export default function AddCategoryForm({
  newCategoryName,
  isSaving,
  onNameChange,
  onSubmit,
}: AddCategoryFormProps) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/40 p-3 md:p-4 space-y-2">
      <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
        <IconPlus className="h-3.5 w-3.5" />
        Tạo danh mục mới
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Tên danh mục (VD: Đồ gia dụng, Thiết bị điện tử...)"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!newCategoryName.trim() || isSaving}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <IconPlus className="h-3.5 w-3.5" />
          {isSaving ? "Đang tạo..." : "Tạo mới"}
        </button>
      </div>
    </div>
  );
}
