import { apiClient } from "@/lib/axios";
import { Product, ProductCreateInput } from "@/types";

export const productService = {
  // Mutations - dùng axios trực tiếp
  async create(data: ProductCreateInput) {
    const response = await apiClient.post("/products", data);
    return response.data;
  },

  async update(id: string, data: Partial<ProductCreateInput>) {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/products/${id}`);
  },


  async incrementView(productId: string) {
    await apiClient.post(`/products/${productId}/view`);
  },

  // Upload images
  async uploadImages(files: File[]) {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/upload/product-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.url;
    });

    const urls = await Promise.all(uploadPromises);
    return urls;
  },
};


