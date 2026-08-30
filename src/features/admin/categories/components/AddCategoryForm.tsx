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
    <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-3">
      <p className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
        <IconPlus className="h-4 w-4 text-primary" />
        Thêm danh mục mới
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nhập tên danh mục (VD: Đồ gia dụng, Thiết bị điện tử...)"
          className="flex-1 rounded-xl border border-border/80 bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground transition-all"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!newCategoryName.trim() || isSaving}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all shadow-2xs shrink-0"
        >
          <IconPlus className="h-4 w-4" />
          {isSaving ? "Đang tạo..." : "Tạo danh mục"}
        </button>
      </div>
    </div>
  );
}
