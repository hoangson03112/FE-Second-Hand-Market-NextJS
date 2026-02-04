import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import type { StateCreator, StoreApi } from "zustand";

export function createStore<T extends object>(
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
  const {
    name = "store",
    persist: shouldPersist = false,
    devtools: enableDevtools = true,
  } = options || {};

  let creator: StateCreator<T, [], []> = subscribeWithSelector(
    storeCreator as StateCreator<T, [], []>
  );

  if (shouldPersist) {
    creator = persist(creator, { name });
  }

  if (enableDevtools && process.env.NODE_ENV === "development") {
    creator = devtools(creator, { name });
  }

  return create<T>()(creator);
}
