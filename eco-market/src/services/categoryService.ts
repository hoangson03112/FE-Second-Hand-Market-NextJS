import { apiClient } from '@/lib/axios';
import { Category } from '@/types';

export const categoryService = {
  // Mutations - dùng axios trực tiếp
  async create(data: Omit<Category, 'id'>) {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },

  async update(id: string, data: Partial<Category>) {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    await apiClient.delete(`/categories/${id}`);
  },
};






