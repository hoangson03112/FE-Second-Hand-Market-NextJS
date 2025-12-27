import axiosClient from "@/lib/axios";

export const CategoryService = {
  getAll: async () => {
    return axiosClient.get("/categories");
  },
};
