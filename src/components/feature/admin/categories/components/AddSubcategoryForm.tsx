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
    <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 space-y-2">
      <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
        <IconPlus className="h-3.5 w-3.5" />
        Thêm danh mục con cho{" "}
        <span className="font-semibold">{categoryName}</span>
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={newSubName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Tên danh mục con (VD: Áo thun, Laptop, Sách giáo khoa...)"
          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={!newSubName.trim() || isSaving}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <IconPlus className="h-3 w-3" />
          Thêm
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}
