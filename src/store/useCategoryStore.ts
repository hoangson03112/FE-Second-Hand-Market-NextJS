import { ICategory } from "@/types/category";
import { createStore } from "@/lib/zustand";

interface CategoryState {
  categories: ICategory[] | undefined;
  setCategories: (categories: ICategory[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  visibleCategories: ICategory[] | undefined;
  getVisibleCategories: (limit?: number) => ICategory[] | undefined;
}

export const useCategoryStore = createStore<CategoryState>(
  (set, get) => ({
    categories: undefined,
    isLoading: false,
    visibleCategories: undefined,

    setCategories: (categories: ICategory[]) =>
      set({
        categories,
        visibleCategories: categories?.slice(0, 8),
      }),

    setIsLoading: (loading: boolean) => set({ isLoading: loading }),

    getVisibleCategories: (limit = 8) => {
      const { categories } = get();
      return categories?.slice(0, limit);
    },
  }),
  {
    name: "category-store",
    persist: false, // Don't persist categories (they change frequently)
    devtools: true,
  }
);
