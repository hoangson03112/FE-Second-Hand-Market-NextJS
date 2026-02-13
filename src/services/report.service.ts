import axiosClient from "@/lib/axios";

export const ReportService = {
  create: async (data: {
    type: "product" | "order" | "system" | "other";
    targetId?: string;
    description?: string;
  }) => {
    return axiosClient.post("/reports", data);
  },
};
