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

  const baseCreator = subscribeWithSelector(
    storeCreator as unknown as StateCreator<T, [], []>
  );

  const persistedCreator = shouldPersist
    ? persist(baseCreator as unknown as StateCreator<T, [], []>, { name })
    : baseCreator;

  const finalCreator =
    enableDevtools && process.env.NODE_ENV === "development"
      ? devtools(persistedCreator as unknown as StateCreator<T, [], []>, { name })
      : persistedCreator;

  // TS: middleware mutator types are carried in `finalCreator`,
  // but `create<T>()` here expects a plain StateCreator signature.
  return create<T>()(finalCreator as unknown as StateCreator<T, [], []>);
}
