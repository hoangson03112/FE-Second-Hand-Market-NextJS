import { IconFolders, IconPencil, IconX, IconCheck } from "@tabler/icons-react";
import type { AdminCategory } from "@/types/admin";

interface CategoryHeaderProps {
  category: AdminCategory;
  isEditing: boolean;
  isSaving: boolean;
  categoryNameDraft: string;
  isCategoryInactive: boolean;
  subCount: number;
  onSelect: () => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (name: string) => void;
}

export default function CategoryHeader({
  category,
  isEditing,
  isSaving,
  categoryNameDraft,
  isCategoryInactive,
  subCount,
  onSelect,
  onStartEdit,
  onSave,
  onCancel,
  onNameChange,
}: CategoryHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <button
        type="button"
        onClick={onSelect}
        className="flex items-center gap-2.5 text-left group"
      >
        <div className="w-8 h-8 rounded-[2px] bg-cream-50 border border-luxury-ink/10 flex items-center justify-center shrink-0">
          <IconFolders className="h-4 w-4 text-luxury-ink" />
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={categoryNameDraft}
              onChange={(e) => onNameChange(e.target.value)}
              className="h-8 rounded-[2px] border border-luxury-ink/20 bg-white px-2.5 text-xs font-bold text-luxury-ink outline-none focus:border-luxury-ink"
              autoFocus
            />
          </div>
        ) : (
          <div>
            <p
              className={`font-droid-serif text-sm font-bold group-hover:underline ${
                isCategoryInactive ? "text-neutral-400 line-through" : "text-luxury-ink"
              }`}
            >
              {category.name}
            </p>
            <p className="text-2xs font-mono text-neutral-400">
              /{category.slug}
            </p>
          </div>
        )}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-2xs text-neutral-500 font-medium">
          {subCount} mục con
        </span>
        <span
          className={`px-2 py-0.5 rounded-[2px] border text-2xs font-bold uppercase tracking-wider ${
            isCategoryInactive
              ? "bg-taupe-50 border-luxury-ink/10 text-neutral-400"
              : "bg-taupe-50 border-accent/35 text-taupe-700"
          }`}
        >
          {isCategoryInactive ? "Tạm ẩn" : "Hoạt động"}
        </span>
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || !categoryNameDraft.trim()}
              className="rounded-[2px] bg-luxury-ink p-1.5 text-luxury-ivory hover:bg-charcoal-800 disabled:opacity-50"
              title="Lưu"
            >
              <IconCheck className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-[2px] border border-luxury-ink/20 p-1.5 text-neutral-500 hover:bg-taupe-50"
              title="Hủy"
            >
              <IconX className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className="rounded-[2px] border border-luxury-ink/20 px-2.5 py-1 text-2xs font-bold uppercase tracking-wider text-luxury-ink hover:bg-taupe-50 transition-colors"
          >
            <IconPencil className="h-3 w-3 mr-1 inline-block" />
            Sửa
          </button>
        )}
      </div>
    </div>
  );
}
