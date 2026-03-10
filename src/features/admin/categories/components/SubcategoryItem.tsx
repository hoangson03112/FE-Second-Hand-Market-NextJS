import { IconPencil, IconTrash, IconCheck, IconX } from "@tabler/icons-react";
import type { AdminCategory } from "@/types/admin";

type SubCategory = AdminCategory["subCategories"][number];

interface SubcategoryItemProps {
  subcategory: SubCategory;
  isEditing: boolean;
  isSaving: boolean;
  nameDraft: string;
  statusDraft: "active" | "inactive";
  onNameChange: (name: string) => void;
  onStatusChange: (status: "active" | "inactive") => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function SubcategoryItem({
  subcategory,
  isEditing,
  isSaving,
  nameDraft,
  statusDraft,
  onNameChange,
  onStatusChange,
  onStartEdit,
  onSave,
  onCancel,
  onDelete,
}: SubcategoryItemProps) {
  const isSubInactive = subcategory.status === "inactive";

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
        isSubInactive
          ? "border-border/70 bg-muted text-muted-foreground"
          : "border-border bg-background text-foreground"
      }`}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={nameDraft}
            onChange={(e) => onNameChange(e.target.value)}
            className="flex-1 rounded border border-border bg-card px-2 py-1 text-xs"
          />
          <select
            value={statusDraft}
            onChange={(e) =>
              onStatusChange(e.target.value as "active" | "inactive")
            }
            className="rounded border border-border bg-card px-2 py-1 text-[11px]"
          >
            <option value="active">Đang dùng</option>
            <option value="inactive">Ẩn</option>
          </select>
          <button
            type="button"
            onClick={onSave}
            disabled={!nameDraft.trim() || isSaving}
            className="rounded bg-primary p-1 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <IconCheck className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded border border-border p-1 text-muted-foreground hover:bg-muted"
          >
            <IconX className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p
              className={`font-medium truncate ${
                isSubInactive
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {subcategory.name}
            </p>
            <p className="text-[11px] text-muted-foreground truncate">
              / {subcategory.slug}
            </p>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
              isSubInactive
                ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                : "bg-secondary text-foreground dark:bg-secondary/70"
            }`}
          >
            {isSubInactive ? "Inactive" : "Active"}
          </span>
          <button
            type="button"
            onClick={onStartEdit}
            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Sửa"
          >
            <IconPencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded p-1 text-destructive hover:bg-destructive/5 dark:hover:bg-destructive/10"
            title="Xóa"
          >
            <IconTrash className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}
