import { IconSearch } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import type { AdminCategory } from "@/types/admin";
import SubcategoryItem from "./SubcategoryItem";

type SubCategory = AdminCategory["subCategories"][number];

interface SubcategoryListProps {
  subcategories: SubCategory[];
  editingSubId: string | null;
  subNameDraft: string;
  subStatusDraft: "active" | "inactive";
  isSavingSub: boolean;
  onSubNameChange: (name: string) => void;
  onSubStatusChange: (status: "active" | "inactive") => void;
  onStartEditSub: (sub: SubCategory) => void;
  onSaveSub: () => void;
  onCancelEditSub: () => void;
  onDeleteSub: (subId: string) => void;
}

export default function SubcategoryList({
  subcategories,
  editingSubId,
  subNameDraft,
  subStatusDraft,
  isSavingSub,
  onSubNameChange,
  onSubStatusChange,
  onStartEditSub,
  onSaveSub,
  onCancelEditSub,
  onDeleteSub,
}: SubcategoryListProps) {
  const [subSearch, setSubSearch] = useState("");
  const normalizedSubSearch = subSearch.trim().toLowerCase();

  const filteredSubs = useMemo(() => {
    if (!normalizedSubSearch) {
      return subcategories;
    }
    return subcategories.filter((s) =>
      s.name.toLowerCase().includes(normalizedSubSearch),
    );
  }, [normalizedSubSearch, subcategories]);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-2xs font-bold uppercase tracking-[0.14em] text-neutral-500">
          Danh mục con ({subcategories.length})
        </p>
        <div className="flex items-center gap-1.5 rounded-[2px] border border-luxury-ink/15 bg-white px-2.5 py-1">
          <IconSearch className="h-3.5 w-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm theo tên..."
            className="bg-transparent text-xs outline-none border-none placeholder:text-neutral-400 text-luxury-ink"
            value={subSearch}
            onChange={(e) => setSubSearch(e.target.value)}
          />
        </div>
      </div>
      {filteredSubs.length ? (
        <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
          {filteredSubs.map((sub) => (
            <SubcategoryItem
              key={sub._id}
              subcategory={sub}
              isEditing={editingSubId === sub._id}
              isSaving={isSavingSub}
              nameDraft={subNameDraft}
              statusDraft={subStatusDraft}
              onNameChange={onSubNameChange}
              onStatusChange={onSubStatusChange}
              onStartEdit={() => onStartEditSub(sub)}
              onSave={onSaveSub}
              onCancel={onCancelEditSub}
              onDelete={() => onDeleteSub(sub._id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-400 italic">
          Chưa có danh mục con nào.
        </p>
      )}
    </div>
  );
}
