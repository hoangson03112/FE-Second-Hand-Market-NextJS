import axiosClient from "@/lib/axios";
import { IProductFilters, IProductResponse } from "@/types/product";

export const ProductService = {
  getAll: async (filters?: IProductFilters): Promise<IProductResponse> => {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.subCategory) params.append("subCategory", filters.subCategory);
    if (filters?.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.condition) params.append("condition", filters.condition);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await axiosClient.get(`/products?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (
    categoryId: string,
    filters?: Omit<IProductFilters, "category">
  ) => {
    return ProductService.getAll({ ...filters, category: categoryId });
  },

  getBySubCategory: async (
    categoryId: string,
    subCategoryId: string,
    filters?: Omit<IProductFilters, "category" | "subCategory">
  ) => {
    return ProductService.getAll({
      ...filters,
      category: categoryId,
      subCategory: subCategoryId,
    });
  },
};
