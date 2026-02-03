import axiosClient from "@/lib/axios";
import type {
  IProductFilters,
  AdminProductListParams,
  AdminProductListResponse,
} from "@/types/product";

export interface CreateProductPayload {
  name: string;
  price: number;
  stock: number;
  description?: string;
  categoryId: string;
  subcategoryId: string;
  condition?: "new" | "like_new" | "good" | "fair" | "poor";
  attributes?: Array<{ key: string; value: string | number }>;
  images?: File[];
  video?: File | null;
}

export const ProductService = {
  create: async (payload: CreateProductPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("price", payload.price.toString());
    formData.append("stock", payload.stock.toString());
    formData.append("description", payload.description ?? "");
    formData.append("categoryId", payload.categoryId);
    formData.append("subcategoryId", payload.subcategoryId);
    formData.append("condition", payload.condition ?? "good");
    formData.append(
      "attributes",
      JSON.stringify(payload.attributes ?? [])
    );
    if (payload.images?.length) {
      payload.images.forEach((file) => formData.append("images", file));
    }
    if (payload.video) {
      formData.append("video", payload.video);
    }
    const response = await axiosClient.post("/products", formData);
    return response as { success: boolean; message: string; product: { id: string; name: string; status: string } };
  },

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

  /** Admin: lấy danh sách sản phẩm (cần token + role admin) */
  getProductsAdmin: async (
    params?: AdminProductListParams
  ): Promise<AdminProductListResponse> => {
    const search = new URLSearchParams();
    if (params?.status) search.set("status", params.status);
    if (params?.page) search.set("page", String(params.page));
    if (params?.limit) search.set("limit", String(params.limit));
    const response = await axiosClient.get(`/products?${search.toString()}`);
    return response as unknown as AdminProductListResponse;
  },

  /** Admin: cập nhật trạng thái sản phẩm (duyệt / từ chối) */
  updateStatus: async (
    productId: string,
    status: "approved" | "rejected" | "pending" | "under_review"
  ) => {
    const response = await axiosClient.patch(`/products/${productId}/status`, {
      status,
    });
    return response as { _id: string; status: string };
  },
};
