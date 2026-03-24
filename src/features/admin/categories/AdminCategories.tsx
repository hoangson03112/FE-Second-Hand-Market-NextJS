"use client";

import { IconLoader2 } from "@tabler/icons-react";
import type { AdminCategory } from "@/types/admin";
import { useAdminCategories } from "./hooks/useAdminCategories";
import EmptyState from "./components/EmptyState";
import CategoryHeader from "./components/CategoryHeader";
import AddCategoryForm from "./components/AddCategoryForm";
import AddSubcategoryForm from "./components/AddSubcategoryForm";
import SubcategoryList from "./components/SubcategoryList";

export default function AdminCategories() {
  const {
    categories,
    isLoading,
    error,
    selectedCategory,
    selectCategory,
    editingCategoryId,
    categoryNameDraft,
    setCategoryNameDraft,
    newCategoryName,
    setNewCategoryName,
    addCategory,
    isCreatingCategory,
    isSavingCategory,
    startEditCategory,
    cancelEditCategory,
    saveCategory,
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

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
        <AddCategoryForm
          newCategoryName={newCategoryName}
          isSaving={isCreatingCategory}
          onNameChange={setNewCategoryName}
          onSubmit={addCategory}
        />
        <EmptyState />
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

      <AddCategoryForm
        newCategoryName={newCategoryName}
        isSaving={isCreatingCategory}
        onNameChange={setNewCategoryName}
        onSubmit={addCategory}
      />

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
              <CategoryHeader
                category={cat}
                isEditing={isEditingCategory}
                isSaving={isSavingCategory}
                categoryNameDraft={categoryNameDraft}
                isCategoryInactive={isCategoryInactive}
                subCount={subCount}
                onSelect={() => selectCategory(cat._id)}
                onStartEdit={() => {
                  selectCategory(cat._id);
                  startEditCategory(cat);
                }}
                onSave={saveCategory}
                onCancel={cancelEditCategory}
                onNameChange={setCategoryNameDraft}
              />

              {isSelected && (
                <div className="mt-2 space-y-3 border-t border-border pt-2">
                  <AddSubcategoryForm
                    categoryName={cat.name}
                    newSubName={newSubName}
                    isSaving={isSavingSub}
                    error={subError}
                    onNameChange={setNewSubName}
                    onSubmit={addSubCategory}
                  />

                  <SubcategoryList
                    subcategories={selectedCategory?.subCategories ?? []}
                    editingSubId={editingSubId}
                    subNameDraft={subNameDraft}
                    subStatusDraft={subStatusDraft}
                    isSavingSub={isSavingSub}
                    onSubNameChange={setSubNameDraft}
                    onSubStatusChange={setSubStatusDraft}
                    onStartEditSub={startEditSub}
                    onSaveSub={saveSub}
                    onCancelEditSub={cancelEditSub}
                    onDeleteSub={deleteSub}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

