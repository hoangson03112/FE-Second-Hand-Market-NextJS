import { IconPlus } from "@tabler/icons-react";

interface AddSubcategoryFormProps {
  categoryName: string;
  newSubName: string;
  isSaving: boolean;
  error: string | null;
  onNameChange: (name: string) => void;
  onSubmit: () => void;
}

export default function AddSubcategoryForm({
  categoryName,
  newSubName,
  isSaving,
  error,
  onNameChange,
  onSubmit,
}: AddSubcategoryFormProps) {
  return (
    <div className="rounded-[2px] border border-dashed border-luxury-ink/20 bg-cream-50/70 p-3.5 space-y-2">
      <p className="text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ink flex items-center gap-1.5">
        <IconPlus className="h-3.5 w-3.5 text-luxury-ink" />
        Thêm danh mục con cho <span className="font-bold">{categoryName}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newSubName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Tên danh mục con (VD: Áo thun, Đồ công nghệ...)"
          className="flex-1 h-9 rounded-[2px] border border-luxury-ink/20 bg-white px-3 text-xs text-luxury-ink outline-none focus:border-luxury-ink"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!newSubName.trim() || isSaving}
          className="inline-flex items-center justify-center gap-1.5 rounded-[2px] bg-luxury-ink px-4 py-2 text-2xs font-bold uppercase tracking-[0.12em] text-luxury-ivory hover:bg-charcoal-800 disabled:opacity-50 transition-colors"
        >
          <IconPlus className="h-3 w-3" />
          Thêm
        </button>
      </div>
      {error && <p className="text-2xs text-blush-600 mt-1">{error}</p>}
    </div>
  );
}
