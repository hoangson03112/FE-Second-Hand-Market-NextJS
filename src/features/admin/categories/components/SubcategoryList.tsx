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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground">
          Danh mục con ({subcategories.length})
        </p>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1">
          <IconSearch className="h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo tên..."
            className="bg-transparent text-[11px] outline-none border-none placeholder:text-muted-foreground"
            value={subSearch}
            onChange={(e) => setSubSearch(e.target.value)}
          />
        </div>
      </div>
      {filteredSubs.length ? (
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
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
        <p className="text-[11px] text-muted-foreground">
          Chưa có danh mục con nào cho danh mục này.
        </p>
      )}
    </div>
  );
}
