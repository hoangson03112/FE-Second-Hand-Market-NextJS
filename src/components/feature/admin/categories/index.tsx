"use client";

import { useMemo, useState } from "react";
import {
  FolderTree,
  Loader2,
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import type { AdminCategory } from "@/services/admin.service";
import { useAdminCategories } from "./hooks/useAdminCategories";

export default function AdminCategories() {
  const {
    categories,
    isLoading,
    error,
    // category
    selectedCategory,
    selectCategory,
    editingCategoryId,
    categoryNameDraft,
    setCategoryNameDraft,
    isSavingCategory,
    startEditCategory,
    cancelEditCategory,
    saveCategory,
    // subcategory
    newSubName,
    setNewSubName,
    addSubCategory,
    subError,
    editingSubId,
    subNameDraft,
    setSubNameDraft,
    subStatusDraft,
    setSubStatusDraft,
    isSavingSub,
    startEditSub,
    cancelEditSub,
    saveSub,
    deleteSub,
  } = useAdminCategories();

  const [subSearch, setSubSearch] = useState("");
  const normalizedSubSearch = subSearch.trim().toLowerCase();

  const filteredSubs = useMemo(() => {
    if (!normalizedSubSearch || !selectedCategory?.subCategories) {
      return selectedCategory?.subCategories ?? [];
    }
    return selectedCategory.subCategories.filter((s) =>
      s.name.toLowerCase().includes(normalizedSubSearch)
    );
  }, [normalizedSubSearch, selectedCategory]);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được danh mục.
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-lg font-bold text-foreground">Danh mục</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Quản lý danh mục và danh mục con
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          <FolderTree className="mx-auto mb-2 h-10 w-10 opacity-50" />
          Chưa có danh mục nào.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Danh mục</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Quản lý cây danh mục và danh mục con cho toàn bộ hệ thống
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat: AdminCategory) => {
          const isSelected = selectedCategory?._id === cat._id;
          const isEditingCategory = editingCategoryId === cat._id;
          const subCount = cat.subCategories?.length ?? 0;
          const hasActiveSub = cat.subCategories?.some(
            (s) => s.status !== "inactive"
          );
          const isCategoryInactive =
            cat.status === "inactive" || (!!subCount && !hasActiveSub);

          return (
            <div
              key={cat._id}
              className="rounded-xl border border-border bg-card p-3 md:p-4 space-y-2"
            >
              {/* Header danh mục cha */}
              <div className="flex items-start justify-between gap-3">
                <button
                  type="button"
                  onClick={() => selectCategory(cat._id)}
                  className="flex items-center gap-2 text-left"
                >
                  <FolderTree className="h-4 w-4 text-muted-foreground shrink-0" />
                  {isEditingCategory ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={categoryNameDraft}
                        onChange={(e) => setCategoryNameDraft(e.target.value)}
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
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        / {cat.slug}
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
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                    }`}
                  >
                    {isCategoryInactive ? "Inactive" : "Active"}
                  </span>
                  {isEditingCategory ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={saveCategory}
                        disabled={isSavingCategory || !categoryNameDraft.trim()}
                        className="rounded-lg bg-primary p-1.5 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        title="Lưu"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditCategory}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-muted"
                        title="Hủy"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        selectCategory(cat._id);
                        startEditCategory(cat);
                      }}
                      className="rounded-lg border border-border px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-1 inline-block" />
                      Sửa
                    </button>
                  )}
                </div>
              </div>

              {/* Mở chi tiết + danh mục con ngay dưới danh mục cha */}
              {isSelected && (
                <div className="mt-2 space-y-3 border-t border-border pt-2">
                  {/* Form thêm danh mục con */}
                  <div className="rounded-lg border border-dashed border-border bg-muted/40 p-3 space-y-2">
                    <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                      <Plus className="h-3.5 w-3.5" />
                      Thêm danh mục con cho{" "}
                      <span className="font-semibold">{cat.name}</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newSubName}
                        onChange={(e) => setNewSubName(e.target.value)}
                        placeholder="Tên danh mục con (VD: Áo thun, Laptop, Sách giáo khoa...)"
                        className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs"
                      />
                      <button
                        type="button"
                        onClick={addSubCategory}
                        disabled={!newSubName.trim() || isSavingSub}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                        Thêm
                      </button>
                    </div>
                    {subError && (
                      <p className="text-[11px] text-red-500 mt-1">{subError}</p>
                    )}
                  </div>

                  {/* Danh sách danh mục con */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Danh mục con ({selectedCategory.subCategories?.length ?? 0})
                      </p>
                      <div className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1">
                        <Search className="h-3.5 w-3.5 text-muted-foreground" />
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
                        {filteredSubs.map((sub) => {
                          const isEditing = editingSubId === sub._id;
                          const isSubInactive = sub.status === "inactive";
                          return (
                            <div
                              key={sub._id}
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
                                    value={subNameDraft}
                                    onChange={(e) =>
                                      setSubNameDraft(e.target.value)
                                    }
                                    className="flex-1 rounded border border-border bg-card px-2 py-1 text-xs"
                                  />
                                  <select
                                    value={subStatusDraft}
                                    onChange={(e) =>
                                      setSubStatusDraft(
                                        e.target.value as "active" | "inactive"
                                      )
                                    }
                                    className="rounded border border-border bg-card px-2 py-1 text-[11px]"
                                  >
                                    <option value="active">Đang dùng</option>
                                    <option value="inactive">Ẩn</option>
                                  </select>
                                  <button
                                    type="button"
                                    onClick={saveSub}
                                    disabled={!subNameDraft.trim() || isSavingSub}
                                    className="rounded bg-primary p-1 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                  >
                                    <Check className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={cancelEditSub}
                                    className="rounded border border-border p-1 text-muted-foreground hover:bg-muted"
                                  >
                                    <X className="h-3 w-3" />
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
                                      {sub.name}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground truncate">
                                      / {sub.slug}
                                    </p>
                                  </div>
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                      isSubInactive
                                        ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200"
                                    }`}
                                  >
                                    {isSubInactive ? "Inactive" : "Active"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => startEditSub(sub)}
                                    className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                                    title="Sửa"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteSub(sub._id)}
                                    className="rounded p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                    title="Xóa"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Chưa có danh mục con nào cho danh mục này.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

