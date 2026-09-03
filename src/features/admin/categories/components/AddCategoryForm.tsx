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
    <div className="rounded-[2px] border border-dashed border-luxury-ink/20 bg-cream-50/50 p-4 sm:p-5 space-y-3">
      <p className="text-2xs font-bold text-luxury-ink flex items-center gap-1.5 uppercase tracking-[0.18em]">
        <IconPlus className="h-4 w-4 text-luxury-ink" />
        Thêm danh mục mới
      </p>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nhập tên danh mục (VD: Đồ gia dụng, Thiết bị điện tử...)"
          className="flex-1 rounded-[2px] border border-luxury-ink/15 bg-white px-3.5 py-2 text-xs text-luxury-ink focus:outline-none focus:border-luxury-ink placeholder:text-neutral-400 transition-all"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!newCategoryName.trim() || isSaving}
          className="inline-flex items-center justify-center gap-1.5 rounded-[2px] bg-luxury-ink px-4 py-2 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory hover:bg-charcoal-800 disabled:opacity-50 transition-all shrink-0"
        >
          <IconPlus className="h-3.5 w-3.5" />
          {isSaving ? "Đang tạo..." : "Tạo danh mục"}
        </button>
      </div>
    </div>
  );
}
