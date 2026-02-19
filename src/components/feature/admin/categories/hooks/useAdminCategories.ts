import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminCategory } from "@/types/admin";
import { useConfirm, useToast } from "@/components/ui";

export function useAdminCategories() {
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();
  const toast = useToast();

  // Category editing
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryNameDraft, setCategoryNameDraft] = useState("");

  // Selection
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Subcategory state
  const [newSubName, setNewSubName] = useState("");
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [subNameDraft, setSubNameDraft] = useState("");
  const [subStatusDraft, setSubStatusDraft] = useState<"active" | "inactive">(
    "active"
  );
  const [subError, setSubError] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => AdminService.getCategories(),
  });

  const categories: AdminCategory[] = useMemo(
    () => data?.data ?? [],
    [data?.data]
  );

  const selectedCategory = useMemo(
    () => categories.find((c) => c._id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId]
  );

  const updateCategoryMutation = useMutation({
    mutationFn: ({
      id,
      name,
      status,
    }: {
      id: string;
      name: string;
      status?: "active" | "inactive";
    }) => AdminService.updateCategory(id, { name, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategoryId(null);
      setCategoryNameDraft("");
      toast.success("Cập nhật danh mục thành công");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Không cập nhật được danh mục.";
      toast.error(message);
    },
  });

  const createSubMutation = useMutation({
    mutationFn: (params: { parentCategoryId: string; name: string }) =>
      AdminService.createSubCategory(params.parentCategoryId, {
        name: params.name,
        status: "active",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setNewSubName("");
      setSubError(null);
      toast.success("Đã tạo danh mục con thành công");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Không tạo được danh mục con.";
      setSubError(message);
      toast.error(message);
    },
  });

  const updateSubMutation = useMutation({
    mutationFn: (params: {
      categoryId: string;
      subcategoryId: string;
      name: string;
      status: "active" | "inactive";
    }) =>
      AdminService.updateSubCategory({
        parentCategoryId: params.categoryId,
        subcategoryId: params.subcategoryId,
        name: params.name,
        status: params.status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingSubId(null);
      setSubNameDraft("");
      toast.success("Cập nhật danh mục con thành công");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Không cập nhật được danh mục con.";
      setSubError(message);
      toast.error(message);
    },
  });

  const deleteSubMutation = useMutation({
    mutationFn: (params: { categoryId: string; subcategoryId: string }) =>
      AdminService.deleteSubCategory(params.categoryId, params.subcategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setSubError(null);
      toast.success("Đã xóa danh mục con thành công");
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ??
        "Không xóa được danh mục con (có thể còn sản phẩm đang dùng).";
      setSubError(message);
      toast.error(message);
    },
  });

  const startEditCategory = useCallback((cat: AdminCategory) => {
    setEditingCategoryId(cat._id);
    setCategoryNameDraft(cat.name);
  }, []);

  const cancelEditCategory = useCallback(() => {
    setEditingCategoryId(null);
    setCategoryNameDraft("");
  }, []);

  const saveCategory = useCallback(() => {
    if (!editingCategoryId || !categoryNameDraft.trim()) return;
    const current = categories.find((c) => c._id === editingCategoryId);
    updateCategoryMutation.mutate({
      id: editingCategoryId,
      name: categoryNameDraft.trim(),
      status: current?.status,
    });
  }, [editingCategoryId, categoryNameDraft, updateCategoryMutation, categories]);

  const selectCategory = useCallback((id: string) => {
    setSelectedCategoryId((prev) => (prev === id ? null : id));
    setSubError(null);
    setNewSubName("");
    setEditingSubId(null);
  }, []);

  const addSubCategory = useCallback(() => {
    if (!selectedCategory || !newSubName.trim()) return;
    createSubMutation.mutate({
      parentCategoryId: selectedCategory._id,
      name: newSubName.trim(),
    });
  }, [createSubMutation, newSubName, selectedCategory]);

  const startEditSub = useCallback(
    (sub: { _id: string; name: string; status?: "active" | "inactive" }) => {
      if (!selectedCategory) return;
      setEditingSubId(sub._id);
      setSubNameDraft(sub.name);
      setSubStatusDraft(sub.status === "inactive" ? "inactive" : "active");
    },
    [selectedCategory]
  );

  const cancelEditSub = useCallback(() => {
    setEditingSubId(null);
    setSubNameDraft("");
    setSubStatusDraft("active");
  }, []);

  const saveSub = useCallback(() => {
    if (!selectedCategory || !editingSubId || !subNameDraft.trim()) return;
    updateSubMutation.mutate({
      categoryId: selectedCategory._id,
      subcategoryId: editingSubId,
      name: subNameDraft.trim(),
      status: subStatusDraft,
    });
  }, [
    editingSubId,
    selectedCategory,
    subNameDraft,
    subStatusDraft,
    updateSubMutation,
  ]);

  const deleteSub = useCallback(
    async (subcategoryId: string) => {
      if (!selectedCategory) return;
      const ok = await confirm({
        title: "Xóa danh mục con",
        message:
          "Bạn có chắc chắn muốn xóa danh mục con này? Hành động này không thể hoàn tác.",
        confirmText: "Xóa",
        cancelText: "Hủy",
        variant: "danger",
      });
      if (!ok) return;
      deleteSubMutation.mutate({
        categoryId: selectedCategory._id,
        subcategoryId,
      });
    },
    [confirm, deleteSubMutation, selectedCategory]
  );

  return {
    categories,
    isLoading,
    error,
    // category
    selectedCategory,
    selectCategory,
    editingCategoryId,
    categoryNameDraft,
    setCategoryNameDraft,
    isSavingCategory: updateCategoryMutation.isPending,
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
    isSavingSub:
      createSubMutation.isPending ||
      updateSubMutation.isPending ||
      deleteSubMutation.isPending,
    startEditSub,
    cancelEditSub,
    saveSub,
    deleteSub,
  };
}

