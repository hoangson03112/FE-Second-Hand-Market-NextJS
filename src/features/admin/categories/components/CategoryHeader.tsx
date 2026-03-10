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
        className="flex items-center gap-2 text-left"
      >
        <IconFolders className="h-4 w-4 text-muted-foreground shrink-0" />
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={categoryNameDraft}
              onChange={(e) => onNameChange(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm"
              autoFocus
            />
          </div>
        ) : (
          <div>
            <p
              className={`text-sm font-semibold ${
                isCategoryInactive
                  ? "text-muted-foreground"
                  : "text-foreground"
              }`}
            >
              {category.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              / {category.slug}
            </p>
          </div>
        )}
      </button>

      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">
          {subCount} danh mục con
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            isCategoryInactive
              ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
              : "bg-secondary text-foreground dark:bg-secondary/70"
          }`}
        >
          {isCategoryInactive ? "Inactive" : "Active"}
        </span>
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onSave}
              disabled={isSaving || !categoryNameDraft.trim()}
              className="rounded-lg bg-primary p-1.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              title="Lưu"
            >
              <IconCheck className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted"
              title="Hủy"
            >
              <IconX className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <IconPencil className="h-3.5 w-3.5 mr-1 inline-block" />
            Sửa
          </button>
        )}
      </div>
    </div>
  );
}
