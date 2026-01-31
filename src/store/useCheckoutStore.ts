
import { createClientStore } from "@/lib/state";
import { IProduct } from "@/types/product";

export interface CheckoutItem {
  product: IProduct;
  quantity: number;
}

interface CheckoutState {
  items: CheckoutItem[];
  setCheckoutItems: (items: CheckoutItem[]) => void;
  clearCheckout: () => void;
  addItem: (item: CheckoutItem) => void;
}

export const useCheckoutStore = createClientStore<CheckoutState>(
  (set) => ({
    items: [],
    setCheckoutItems: (items) => {
      console.log(items);
      set({ items });
    },
    clearCheckout: () => set({ items: [] }),
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
          return { items: newItems };
        }

        // Add new item
        return { items: [...state.items, item] };
      }),
  }),
  {
    name: "checkout-store",
    persist: true,
  }
);
