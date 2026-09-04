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
      className={`flex items-center gap-2 rounded-[2px] border px-3 py-2 text-xs transition-colors ${
        isSubInactive
          ? "border-luxury-ink/8 bg-taupe-50/50 text-neutral-400"
          : "border-luxury-ink/10 bg-white text-luxury-ink hover:border-luxury-ink/20"
      }`}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={nameDraft}
            onChange={(e) => onNameChange(e.target.value)}
            className="flex-1 h-7 rounded-[2px] border border-luxury-ink/20 bg-white px-2 text-xs outline-none focus:border-luxury-ink"
          />
          <select
            value={statusDraft}
            onChange={(e) =>
              onStatusChange(e.target.value as "active" | "inactive")
            }
            className="h-7 rounded-[2px] border border-luxury-ink/20 bg-white px-2 text-2xs"
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Tạm ẩn</option>
          </select>
          <button
            type="button"
            onClick={onSave}
            disabled={!nameDraft.trim() || isSaving}
            className="rounded-[2px] bg-luxury-ink p-1 text-luxury-ivory hover:bg-charcoal-800 disabled:opacity-50"
          >
            <IconCheck className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[2px] border border-luxury-ink/20 p-1 text-neutral-500 hover:bg-taupe-50"
          >
            <IconX className="h-3 w-3" />
          </button>
        </>
      ) : (
        <>
          <div className="flex-1 min-w-0">
            <p
              className={`font-semibold truncate ${
                isSubInactive
                  ? "text-neutral-400 line-through"
                  : "text-luxury-ink"
              }`}
            >
              {subcategory.name}
            </p>
            <p className="text-2xs font-mono text-neutral-400 truncate">
              /{subcategory.slug}
            </p>
          </div>
          <span
            className={`px-2 py-0.5 rounded-[2px] border text-2xs font-bold uppercase tracking-wider ${
              isSubInactive
                ? "bg-taupe-50 border-luxury-ink/10 text-neutral-400"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            {isSubInactive ? "Tạm ẩn" : "Hoạt động"}
          </span>
          <button
            type="button"
            onClick={onStartEdit}
            className="rounded-[2px] p-1 text-neutral-400 hover:text-luxury-ink hover:bg-taupe-50 transition-colors"
            title="Sửa"
          >
            <IconPencil className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-[2px] p-1 text-neutral-400 hover:text-blush-600 hover:bg-blush-50 transition-colors"
            title="Xóa"
          >
            <IconTrash className="h-3 w-3" />
          </button>
        </>
      )}
    </div>
  );
}
