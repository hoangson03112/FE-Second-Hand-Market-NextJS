import axiosClient from "@/lib/axios";
import type {
  IProduct,
  IProductFilters,
  AdminProductListParams,
  AdminProductListResponse,
} from "@/types/product";
import type { MyListingsResponse } from "@/types/myProducts";
import type { CreateProductPayload, UpdateProductPayload } from "@/types/productPayload";

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
    if (payload.pickupAddress) {
      formData.append("pickupProvinceId", payload.pickupAddress.provinceId);
      formData.append("pickupDistrictId", payload.pickupAddress.districtId);
      formData.append("pickupWardCode", payload.pickupAddress.wardCode);
      formData.append("pickupBusinessAddress", payload.pickupAddress.businessAddress);
    }

    // Upload sản phẩm (ảnh/video) có thể mất thời gian lâu hơn,
    // nên tăng timeout để tránh request bị `canceled` giữa chừng.
    const response = await axiosClient.post("/products", formData, {
      timeout: 60000, // 60s cho upload file
    });

    return response as unknown as {
      success: boolean;
      message: string;
      product: { id: string; name: string; status: string };
    };
  },

  /** Tìm kiếm sản phẩm toàn hệ thống – dùng endpoint /products/search */
  search: async (query: string, filters?: IProductFilters) => {
    if (!query || query.trim().length === 0) {
      return {
        success: true,
        data: [],
        total: 0,
        page: 1,
        limit: filters?.limit || 20,
        totalPages: 0,
      };
    }
    const params = new URLSearchParams();
    params.append("q", query.trim());
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.minPrice) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    return await axiosClient.get(`/products/search?${params.toString()}`);
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

  /** Chi tiết sản phẩm đầy đủ – dùng khi xem trang chi tiết hoặc mở form Edit */
  getById: async (id: string): Promise<IProduct> => {
    const response = await axiosClient.get<{ success?: boolean; data?: IProduct }>(`/products/${id}`);
    const body = response.data;
    const product = body?.data ?? body;
    if (!product || typeof product !== "object") {
      throw new Error("Product not found");
    }
    return product as IProduct;
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

  /** User: danh sách sản phẩm đã đăng (chỉ fields cho list). Chi tiết đầy đủ khi bấm Edit gọi getById. */
  getMyListings: async (): Promise<MyListingsResponse> => {
    const response = await axiosClient.get("/products/my/listings");
    return response as unknown as MyListingsResponse;
  },

  /** Admin: lấy danh sách sản phẩm (cần token + role admin) */
  getProductsAdmin: async (
    params?: AdminProductListParams
  ): Promise<AdminProductListResponse> => {
    const queryParams: Record<string, string | number> = {};

    if (params?.status) queryParams.status = params.status;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    const response = await axiosClient.get("/products", {
      params: queryParams,
    });

    return response as unknown as AdminProductListResponse;
  },

  /** Admin: cập nhật trạng thái sản phẩm (duyệt / từ chối) */
  updateStatus: async (
    productId: string,
    status: "approved" | "rejected" | "pending" | "under_review",
    reason?: string
  ) => {
    const response = await axiosClient.patch(`/products/${productId}/status`, {
      status,
      reason, // Lý do từ chối (bắt buộc nếu status = "rejected")
    });
    return response as unknown as { success: boolean; _id: string; status: string; message?: string };
  },

  /** User: yêu cầu duyệt lại sản phẩm bị AI reject (gửi thẳng cho admin, không qua AI) */
  requestReview: async (productId: string) => {
    const response = await axiosClient.post(`/products/${productId}/request-review`);
    return response as unknown as {
      success: boolean;
      message: string;
      product: { id: string; name: string; status: string };
    };
  },

  /** User: cập nhật sản phẩm của chính mình */
  update: async (productId: string, payload: UpdateProductPayload) => {
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
    if (payload.pickupAddress) {
      formData.append("pickupProvinceId", payload.pickupAddress.provinceId);
      formData.append("pickupDistrictId", payload.pickupAddress.districtId);
      formData.append("pickupWardCode", payload.pickupAddress.wardCode);
      formData.append("pickupBusinessAddress", payload.pickupAddress.businessAddress);
    }

    const response = await axiosClient.put(`/products/${productId}`, formData, {
      timeout: 60000, // 60s cho upload file
    });

    return response as unknown as {
      success: boolean;
      message: string;
      product: { id: string; name: string; status: string };
    };
  },

  /** User: xóa sản phẩm của chính mình */
  delete: async (productId: string) => {
    await axiosClient.delete(`/products/${productId}`);
  },
};
