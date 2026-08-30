"use client";

import { IconFolders, IconLoader2 } from "@tabler/icons-react";
import type { AdminCategory } from "@/types/admin";
import { useAdminCategories } from "./hooks/useAdminCategories";
import { NoData, PageHeader, ErrorState } from "@/features/admin/components";
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Đang tải cây danh mục...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được danh mục"
        description="Vui lòng kiểm tra quyền đăng nhập tài khoản quản trị viên."
      />
    );
  }

  if (!categories.length) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Quản lý danh mục"
          description="Cấu hình danh mục cha và các phân loại con hỗ trợ người bán phân loại sản phẩm."
        />
        <AddCategoryForm
          newCategoryName={newCategoryName}
          isSaving={isCreatingCategory}
          onNameChange={setNewCategoryName}
          onSubmit={addCategory}
        />
        <NoData
          icon={<IconFolders className="w-10 h-10 text-muted-foreground" />}
          title="Chưa có danh mục nào"
          description="Hãy tạo danh mục đầu tiên bằng form ở trên."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý danh mục"
        description="Cấu hình danh mục cha và các phân loại con cho toàn bộ hệ thống Eco Market."
        badge={
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
            {categories.length} danh mục
          </span>
        }
      />

      <AddCategoryForm
        newCategoryName={newCategoryName}
        isSaving={isCreatingCategory}
        onNameChange={setNewCategoryName}
        onSubmit={addCategory}
      />

      <div className="space-y-3.5">
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
              className={`rounded-2xl border bg-card p-4 sm:p-5 transition-all shadow-xs ${
                isSelected
                  ? "border-primary/40 ring-1 ring-primary/20"
                  : "border-border/80 hover:border-primary/20"
              }`}
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
                <div className="mt-4 space-y-4 border-t border-border/60 pt-4">
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


