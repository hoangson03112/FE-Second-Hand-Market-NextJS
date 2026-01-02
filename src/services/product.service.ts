import axiosClient from "@/lib/axios";
import { IProductFilters } from "@/types/product";

export const ProductService = {
  getAll: async (filters?: IProductFilters) => {
    const params = new URLSearchParams();

    if (filters?.categorySlug)
      params.append("categorySlug", filters.categorySlug);
    if (filters?.subCategorySlug)
      params.append("subCategorySlug", filters.subCategorySlug);
    if (filters?.minPrice)
      params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice)
      params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.condition) params.append("condition", filters.condition);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    const response = await axiosClient.get(
      `/products/categories?${params.toString()}`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  getByCategory: async (categorySlug: string, filters?: IProductFilters) => {
    return ProductService.getAll({ ...filters, categorySlug });
  },

  getBySubCategory: async (
    categorySlug: string,
    subCategorySlug: string,
    filters?: IProductFilters
  ) => {
    return ProductService.getAll({
      ...filters,
      categorySlug,
      subCategorySlug,
    });
  },
};
