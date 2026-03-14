import axiosClient from "@/lib/axios";

/**
 * Buyer escalates a rejected refund to admin (dispute)
 * POST /refunds/:refundId/escalate
 */
export const RefundService = {
  escalateToAdmin: async (
    refundId: string
  ): Promise<{ success: boolean; message: string; refund: unknown }> => {
    const res = await axiosClient.post(`/refunds/${refundId}/escalate`);
    return res as unknown as { success: boolean; message: string; refund: unknown };
  },
};
