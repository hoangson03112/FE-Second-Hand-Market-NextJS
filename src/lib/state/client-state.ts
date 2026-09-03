

import { createStore } from "@/lib/zustand";
import type { StoreApi } from "zustand";


export function createClientStore<T extends object>(
  storeCreator: (
    set: StoreApi<T>["setState"],
    get: StoreApi<T>["getState"]
  ) => T,
  options?: {
    name?: string;
    persist?: boolean;
    devtools?: boolean;
  }
) {
  return createStore<T>(storeCreator, {
    devtools: process.env.NODE_ENV === "development",
    ...options,
  });
}

