
import { createClientStore } from "@/lib/state";
import { IProduct } from "@/types/product";

export interface CheckoutItem {
  product: IProduct;
  quantity: number;
}

export type CheckoutSource = "cart" | "buy_now" | null;

interface CheckoutState {
  items: CheckoutItem[];
  source: CheckoutSource;
  setCheckoutItems: (items: CheckoutItem[], source?: CheckoutSource) => void;
  clearCheckout: () => void;
  addItem: (item: CheckoutItem) => void;
}

export const useCheckoutStore = createClientStore<CheckoutState>(
  (set) => ({
    items: [],
    source: null,
    setCheckoutItems: (items, source = null) => {
      set({ items, source });
    },
    clearCheckout: () => set({ items: [], source: null }),
    addItem: (item) =>
      set((state: CheckoutState) => {
        // Check if product already exists
        const existingIndex = state.items.findIndex(
          (i) => i.product._id === item.product._id
        );

        if (existingIndex >= 0) {
          // Update quantity
          const newItems = [...state.items];
          newItems[existingIndex] = item;
          return { items: newItems, source: state.source };
        }

        // Add new item
        return { items: [...state.items, item], source: state.source };
      }),
  }),
  {
    name: "checkout-store",
    persist: true,
  }
);
