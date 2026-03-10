import { createClientStore } from "@/lib/state";
import type { OrderStatus } from "@/types/order";

interface OrderFilters {
  status: OrderStatus | "all";
  search: string;
  dateFrom?: string;
  dateTo?: string;
}

interface OrderState {
  // Filter state for order lists
  buyerFilters: OrderFilters;
  sellerFilters: OrderFilters;
  adminFilters: OrderFilters;

  // Currently focused order (for detail view)
  currentOrderId: string | null;

  // Refund modal state
  refundModal: {
    isOpen: boolean;
    orderId: string | null;
    reason: string;
    description: string;
    images: File[];
    videos: File[];
    isSubmitting: boolean;
  };

  // Cancel dialog state
  cancelDialog: {
    isOpen: boolean;
    orderId: string | null;
  };

  // Actions
  setBuyerFilters: (filters: Partial<OrderFilters>) => void;
  setSellerFilters: (filters: Partial<OrderFilters>) => void;
  setAdminFilters: (filters: Partial<OrderFilters>) => void;
  setCurrentOrderId: (id: string | null) => void;

  openRefundModal: (orderId: string) => void;
  closeRefundModal: () => void;
  setRefundReason: (reason: string) => void;
  setRefundDescription: (description: string) => void;
  setRefundImages: (images: File[]) => void;
  setRefundVideos: (videos: File[]) => void;
  setRefundSubmitting: (isSubmitting: boolean) => void;

  openCancelDialog: (orderId: string) => void;
  closeCancelDialog: () => void;

  resetFilters: (role: "buyer" | "seller" | "admin") => void;
}

const defaultFilters: OrderFilters = {
  status: "all",
  search: "",
};

export const useOrderStore = createClientStore<OrderState>(
  (set) => ({
    buyerFilters: { ...defaultFilters },
    sellerFilters: { ...defaultFilters },
    adminFilters: { ...defaultFilters },

    currentOrderId: null,

    refundModal: {
      isOpen: false,
      orderId: null,
      reason: "",
      description: "",
      images: [],
      videos: [],
      isSubmitting: false,
    },

    cancelDialog: {
      isOpen: false,
      orderId: null,
    },

    setBuyerFilters: (filters) =>
      set((state) => ({
        buyerFilters: { ...state.buyerFilters, ...filters },
      })),

    setSellerFilters: (filters) =>
      set((state) => ({
        sellerFilters: { ...state.sellerFilters, ...filters },
      })),

    setAdminFilters: (filters) =>
      set((state) => ({
        adminFilters: { ...state.adminFilters, ...filters },
      })),

    setCurrentOrderId: (id) => set({ currentOrderId: id }),

    openRefundModal: (orderId) =>
      set({ refundModal: { isOpen: true, orderId, reason: "", description: "", images: [], videos: [], isSubmitting: false } }),

    closeRefundModal: () =>
      set((state) => ({
        refundModal: { ...state.refundModal, isOpen: false, orderId: null, reason: "", description: "", images: [], videos: [] },
      })),

    setRefundReason: (reason) =>
      set((state) => ({
        refundModal: { ...state.refundModal, reason },
      })),

    setRefundDescription: (description) =>
      set((state) => ({
        refundModal: { ...state.refundModal, description },
      })),

    setRefundImages: (images) =>
      set((state) => ({
        refundModal: { ...state.refundModal, images },
      })),

    setRefundVideos: (videos) =>
      set((state) => ({
        refundModal: { ...state.refundModal, videos },
      })),

    setRefundSubmitting: (isSubmitting) =>
      set((state) => ({
        refundModal: { ...state.refundModal, isSubmitting },
      })),

    openCancelDialog: (orderId) =>
      set({ cancelDialog: { isOpen: true, orderId } }),

    closeCancelDialog: () =>
      set({ cancelDialog: { isOpen: false, orderId: null } }),

    resetFilters: (role) => {
      if (role === "buyer") set({ buyerFilters: { ...defaultFilters } });
      else if (role === "seller") set({ sellerFilters: { ...defaultFilters } });
      else set({ adminFilters: { ...defaultFilters } });
    },
  }),
  { name: "order-store" }
);
