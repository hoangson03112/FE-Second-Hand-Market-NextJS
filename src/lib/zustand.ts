/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";

export function createStore<T extends object>(
  storeCreator: (set: any, get: any) => T,
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

  let creator: any = subscribeWithSelector(storeCreator);

  if (shouldPersist) {
    creator = persist(creator, { name });
  }

  if (enableDevtools && process.env.NODE_ENV === "development") {
    creator = devtools(creator, { name });
  }

  return create<T>()(creator as any);
}
